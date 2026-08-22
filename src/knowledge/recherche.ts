/**
 * Moteur de recherche unifié.
 *
 * Une même requête interroge le texte biblique, le dictionnaire, les
 * commentaires et les thèmes. Chaque résultat porte sa nature
 * (`texte-biblique` ou `source-documentaire`) et sa source, de sorte que
 * l'interface ne mélange jamais les registres.
 */

import { comparerVersions, rechercherDansTexte, ResultatVerset, VersionBible } from './bible';
import {
  analyserReference,
  comparerReferences,
  extraireTermes,
  formaterReference,
  normaliser,
} from './reference';
import {
  chercherEntrees,
  dossierReference,
  getSource,
  tousLesCommentaires,
  tousLesThemes,
} from './registre';
import {
  Commentaire,
  EntreeDictionnaire,
  NatureContenu,
  ReferenceBiblique,
  Source,
  ThemeBiblique,
} from './types';

export type ResultatRecherche =
  | {
      genre: 'verset';
      nature: NatureContenu;
      score: number;
      reference: ReferenceBiblique;
      libelle: string;
      texte: string;
      version: VersionBible;
    }
  | {
      genre: 'definition';
      nature: NatureContenu;
      score: number;
      entree: EntreeDictionnaire;
      sources: Source[];
    }
  | {
      genre: 'commentaire';
      nature: NatureContenu;
      score: number;
      commentaire: Commentaire;
      source?: Source;
    }
  | {
      genre: 'theme';
      nature: NatureContenu;
      score: number;
      theme: ThemeBiblique;
      source?: Source;
    };

export interface OptionsRecherche {
  versionId?: string;
  /** Limite par catégorie de résultat. */
  limite?: number;
  genres?: ResultatRecherche['genre'][];
}

export interface ReponseRecherche {
  requete: string;
  /** Renseigné quand la requête est elle-même une référence biblique. */
  referenceDetectee?: ReferenceBiblique;
  resultats: ResultatRecherche[];
  /** Nombre de résultats par genre, pour les filtres d'interface. */
  compte: Record<ResultatRecherche['genre'], number>;
}

function scoreTexte(champ: string, termes: string[]): number {
  const t = normaliser(champ);
  let score = 0;
  for (const terme of termes) {
    const occurrences = t.split(terme).length - 1;
    if (occurrences > 0) score += occurrences;
  }
  return score;
}

export function rechercher(requete: string, options: OptionsRecherche = {}): ReponseRecherche {
  const limite = options.limite ?? 20;
  const genres = options.genres;
  const accepte = (g: ResultatRecherche['genre']) => !genres || genres.includes(g);
  const termes = extraireTermes(requete);

  const resultats: ResultatRecherche[] = [];
  const referenceDetectee = analyserReference(requete);

  // 1. La requête est une référence : le passage lui-même arrive en tête.
  if (referenceDetectee && accepte('verset')) {
    for (const compare of comparerVersions(referenceDetectee, options.versionId ? [options.versionId] : undefined)) {
      for (const v of compare.versets) {
        resultats.push({
          genre: 'verset',
          nature: 'texte-biblique',
          score: 1000,
          reference: { livre: v.livre, chapitre: v.chapitre, verset: v.verset },
          libelle: formaterReference({ livre: v.livre, chapitre: v.chapitre, verset: v.verset }),
          texte: v.texte,
          version: compare.version,
        });
      }
    }
  }

  // 2. Recherche plein texte dans le ou les textes bibliques installés.
  if (accepte('verset') && termes.length > 0) {
    const versets: ResultatVerset[] = rechercherDansTexte(requete, {
      versionId: options.versionId,
      limite,
    });
    for (const r of versets) {
      resultats.push({
        genre: 'verset',
        nature: 'texte-biblique',
        score: r.score,
        reference: r.reference,
        libelle: formaterReference(r.reference),
        texte: r.verset.texte,
        version: r.version,
      });
    }
  }

  // 3. Dictionnaire.
  if (accepte('definition')) {
    for (const entree of chercherEntrees(requete, limite)) {
      const sources = [
        ...new Set(entree.definitions.map((d) => d.sourceId)),
      ]
        .map((id) => getSource(id))
        .filter((s): s is Source => Boolean(s));
      resultats.push({
        genre: 'definition',
        nature: 'source-documentaire',
        score: 100 + scoreTexte(entree.terme, termes),
        entree,
        sources,
      });
    }
  }

  // 4. Commentaires : par référence détectée, sinon par plein texte.
  if (accepte('commentaire')) {
    const candidats: { commentaire: Commentaire; score: number }[] = [];
    if (referenceDetectee) {
      for (const c of dossierReference(referenceDetectee).commentaires) {
        candidats.push({ commentaire: c, score: 500 });
      }
    }
    if (termes.length > 0) {
      for (const c of tousLesCommentaires()) {
        const score = scoreTexte(c.texte, termes) * 2 + scoreTexte(c.titre ?? '', termes) * 5;
        if (score > 0) candidats.push({ commentaire: c, score });
      }
    }
    const vus = new Set<string>();
    for (const c of candidats.sort((a, b) => b.score - a.score)) {
      if (vus.has(c.commentaire.id)) continue;
      vus.add(c.commentaire.id);
      resultats.push({
        genre: 'commentaire',
        nature: 'source-documentaire',
        score: c.score,
        commentaire: c.commentaire,
        source: getSource(c.commentaire.sourceId),
      });
      if (vus.size >= limite) break;
    }
  }

  // 5. Thèmes.
  if (accepte('theme') && termes.length > 0) {
    for (const theme of tousLesThemes()) {
      const score =
        scoreTexte(theme.nom, termes) * 8 +
        scoreTexte(theme.motsCles.join(' '), termes) * 4 +
        scoreTexte(theme.description, termes);
      if (score > 0) {
        resultats.push({
          genre: 'theme',
          nature: 'source-documentaire',
          score: 50 + score,
          theme,
          source: getSource(theme.sourceId),
        });
      }
    }
  }

  const tries = resultats.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    if (a.genre === 'verset' && b.genre === 'verset') {
      return comparerReferences(a.reference, b.reference);
    }
    return 0;
  });

  const compte: Record<ResultatRecherche['genre'], number> = {
    verset: 0,
    definition: 0,
    commentaire: 0,
    theme: 0,
  };
  for (const r of tries) compte[r.genre] += 1;

  return { requete, referenceDetectee, resultats: tries, compte };
}
