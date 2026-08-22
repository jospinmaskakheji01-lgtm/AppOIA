/**
 * Couche assistant.
 *
 * Règle centrale : une réponse est composée de trois blocs distincts, jamais
 * fondus l'un dans l'autre —
 *
 *   1. `textesBibliques`   le texte biblique, cité tel quel, avec sa version ;
 *   2. `extraitsSources`   ce que disent les ouvrages, avec titre, auteur et
 *                          localisation ;
 *   3. `synthese`          la synthèse produite par un modèle de langage,
 *                          explicitement identifiée comme telle.
 *
 * L'assistant par défaut (`AssistantLocal`) n'appelle aucun service : il
 * restitue uniquement 1 et 2, à partir de la base embarquée. Un assistant
 * distant peut être branché pour ajouter 3 ; il passe alors par un service que
 * l'utilisateur héberge (voir `serveur/`), jamais par une clé d'API embarquée
 * dans l'application.
 */

import { comparerVersions, VersionBible } from './bible';
import { formaterReference } from './reference';
import { getSource } from './registre';
import { rechercher, ResultatRecherche } from './recherche';
import { Commentaire, NatureContenu, ReferenceBiblique, Source } from './types';

export interface CitationBiblique {
  nature: 'texte-biblique';
  reference: string;
  texte: string;
  version: VersionBible;
}

export interface ExtraitSource {
  nature: 'source-documentaire';
  /** Ce que dit l'ouvrage, cité ou résumé sans reformulation interprétative. */
  texte: string;
  titreOuvrage: string;
  auteur?: string;
  abreviation: string;
  reference?: string;
  localisation?: string;
  sourceId: string;
}

export interface SyntheseIA {
  nature: 'synthese-ia';
  texte: string;
  modele: string;
  /** Identifiants des sources sur lesquelles la synthèse s'est appuyée. */
  sourcesUtilisees: string[];
  /** Vrai quand la synthèse a dû s'écarter des sources fournies. */
  horsSources: boolean;
}

export interface ReponseAssistant {
  question: string;
  textesBibliques: CitationBiblique[];
  extraitsSources: ExtraitSource[];
  synthese?: SyntheseIA;
  /** Toutes les sources mobilisées, pour l'affichage en pied de réponse. */
  sources: Source[];
  /** Message affiché quand la base ne contient rien sur la question. */
  avertissement?: string;
}

export interface OptionsAssistant {
  versionId?: string;
  /** Nombre maximal d'éléments par bloc. */
  limite?: number;
}

export interface AssistantBiblique {
  readonly nom: string;
  /** Vrai quand l'assistant produit une synthèse en plus de la restitution. */
  readonly produitSynthese: boolean;
  repondre(question: string, options?: OptionsAssistant): Promise<ReponseAssistant>;
}

function localisationLisible(c: Commentaire): string | undefined {
  const l = c.localisation;
  if (!l) return undefined;
  const parties = [
    l.chapitre ? `chap. ${l.chapitre}` : undefined,
    l.section,
    l.article ? `art. ${l.article}` : undefined,
    l.page ? `p. ${l.page}` : undefined,
  ].filter(Boolean);
  return parties.length ? parties.join(', ') : undefined;
}

/** Construit les deux premiers blocs à partir de la base embarquée. */
export function rassemblerContexte(
  question: string,
  options: OptionsAssistant = {},
): Omit<ReponseAssistant, 'synthese'> {
  const limite = options.limite ?? 6;
  const reponse = rechercher(question, { versionId: options.versionId, limite: limite * 2 });

  const textesBibliques: CitationBiblique[] = [];
  const extraitsSources: ExtraitSource[] = [];
  const idsSources = new Set<string>();

  const ajouterExtrait = (extrait: ExtraitSource) => {
    if (extraitsSources.length >= limite) return;
    extraitsSources.push(extrait);
    idsSources.add(extrait.sourceId);
  };

  for (const r of reponse.resultats) {
    if (r.genre === 'verset' && textesBibliques.length < limite) {
      textesBibliques.push({
        nature: 'texte-biblique',
        reference: r.libelle,
        texte: r.texte,
        version: r.version,
      });
      idsSources.add(r.version.sourceId);
      continue;
    }
    if (r.genre === 'definition') {
      for (const def of r.entree.definitions.slice(0, 2)) {
        const source = getSource(def.sourceId);
        if (!source) continue;
        ajouterExtrait({
          nature: 'source-documentaire',
          texte: `${r.entree.terme} — ${def.texte}`,
          titreOuvrage: source.titre,
          auteur: source.auteur,
          abreviation: source.abreviation,
          localisation: def.localisation?.article ?? def.localisation?.page,
          sourceId: source.id,
        });
      }
      continue;
    }
    if (r.genre === 'commentaire') {
      const source = r.source;
      if (!source) continue;
      ajouterExtrait({
        nature: 'source-documentaire',
        texte: r.commentaire.texte,
        titreOuvrage: source.titre,
        auteur: r.commentaire.auteur ?? source.auteur,
        abreviation: source.abreviation,
        reference: formaterReference(r.commentaire.reference),
        localisation: localisationLisible(r.commentaire),
        sourceId: source.id,
      });
      continue;
    }
    if (r.genre === 'theme' && r.source) {
      ajouterExtrait({
        nature: 'source-documentaire',
        texte: `${r.theme.nom} — ${r.theme.description}`,
        titreOuvrage: r.source.titre,
        auteur: r.source.auteur,
        abreviation: r.source.abreviation,
        sourceId: r.source.id,
      });
    }
  }

  const sources = [...idsSources]
    .map((id) => getSource(id))
    .filter((s): s is Source => Boolean(s));

  return {
    question,
    textesBibliques,
    extraitsSources,
    sources,
    avertissement:
      textesBibliques.length === 0 && extraitsSources.length === 0
        ? `La base de connaissances ne contient rien sur cette question. Ajoutez un ouvrage de référence pour l'enrichir.`
        : undefined,
  };
}

/**
 * Assistant hors connexion, actif par défaut.
 * Il ne produit aucune synthèse : il restitue ce que la base contient,
 * chaque élément rattaché à sa source.
 */
export class AssistantLocal implements AssistantBiblique {
  readonly nom = 'Recherche locale';
  readonly produitSynthese = false;

  async repondre(question: string, options: OptionsAssistant = {}): Promise<ReponseAssistant> {
    return rassemblerContexte(question, options);
  }
}

export interface ConfigAssistantDistant {
  /**
   * URL du service que vous hébergez. L'application ne connaît aucune clé
   * d'API : c'est le service qui détient les identifiants du fournisseur.
   */
  url: string;
  /** Jeton d'authentification auprès de *votre* service, si vous en exigez un. */
  jeton?: string;
  modele?: string;
  delaiMs?: number;
}

/**
 * Assistant qui délègue la synthèse à un service distant.
 * Le contexte envoyé est celui de la base locale ; la réponse attendue ne
 * contient que la synthèse, les citations restant produites localement.
 */
export class AssistantDistant implements AssistantBiblique {
  readonly nom = 'Assistant avec synthèse';
  readonly produitSynthese = true;

  constructor(private readonly config: ConfigAssistantDistant) {}

  async repondre(question: string, options: OptionsAssistant = {}): Promise<ReponseAssistant> {
    const contexte = rassemblerContexte(question, options);
    if (contexte.textesBibliques.length === 0 && contexte.extraitsSources.length === 0) {
      return contexte;
    }

    const controleur = new AbortController();
    const minuteur = setTimeout(() => controleur.abort(), this.config.delaiMs ?? 30000);
    try {
      const reponse = await fetch(this.config.url, {
        method: 'POST',
        signal: controleur.signal,
        headers: {
          'Content-Type': 'application/json',
          ...(this.config.jeton ? { Authorization: `Bearer ${this.config.jeton}` } : {}),
        },
        body: JSON.stringify({
          question,
          modele: this.config.modele,
          textesBibliques: contexte.textesBibliques.map((t) => ({
            reference: t.reference,
            texte: t.texte,
            version: t.version.abreviation,
          })),
          extraitsSources: contexte.extraitsSources.map((e) => ({
            sourceId: e.sourceId,
            titreOuvrage: e.titreOuvrage,
            auteur: e.auteur,
            reference: e.reference,
            localisation: e.localisation,
            texte: e.texte,
          })),
        }),
      });
      if (!reponse.ok) throw new Error(`Service indisponible (${reponse.status})`);
      const donnees = (await reponse.json()) as {
        synthese?: string;
        modele?: string;
        sourcesUtilisees?: string[];
        horsSources?: boolean;
      };
      if (!donnees.synthese) return contexte;
      return {
        ...contexte,
        synthese: {
          nature: 'synthese-ia',
          texte: donnees.synthese,
          modele: donnees.modele ?? this.config.modele ?? 'inconnu',
          sourcesUtilisees: donnees.sourcesUtilisees ?? contexte.sources.map((s) => s.id),
          horsSources: Boolean(donnees.horsSources),
        },
      };
    } catch (erreur) {
      // La synthèse est un supplément : son échec ne doit pas priver
      // l'utilisateur du texte biblique et des extraits déjà rassemblés.
      return {
        ...contexte,
        avertissement:
          erreur instanceof Error && erreur.name === 'AbortError'
            ? `Le service de synthèse n'a pas répondu à temps. Voici ce que contient la base locale.`
            : `Le service de synthèse est injoignable. Voici ce que contient la base locale.`,
      };
    } finally {
      clearTimeout(minuteur);
    }
  }
}

export function creerAssistant(config?: ConfigAssistantDistant | null): AssistantBiblique {
  return config?.url ? new AssistantDistant(config) : new AssistantLocal();
}

/** Libellé affiché à côté d'un contenu, selon sa nature. */
export const LIBELLES_NATURE: Record<NatureContenu, string> = {
  'texte-biblique': 'Texte biblique',
  'source-documentaire': 'Ouvrage de référence',
  'synthese-ia': 'Synthèse IA',
};

export type { ResultatRecherche, ReferenceBiblique };
