/**
 * Registre central de la base de connaissances.
 *
 * Les modules sont enregistrés au démarrage ; le registre construit ses index
 * une seule fois et sert ensuite les recherches et les vues agrégées.
 * Ajouter un ouvrage = enregistrer un module de plus.
 */

import {
  clesCouvertes,
  comparerReferences,
  extraireTermes,
  formaterReference,
  normaliser,
  seRecouvrent,
} from './reference';
import {
  AnomalieModule,
  Commentaire,
  EntreeDictionnaire,
  ModuleConnaissance,
  ReferenceBiblique,
  ReferenceCroisee,
  Source,
  ThemeBiblique,
} from './types';

interface Etat {
  sources: Map<string, Source>;
  entrees: Map<string, EntreeDictionnaire>;
  commentaires: Commentaire[];
  referencesCroisees: ReferenceCroisee[];
  themes: Map<string, ThemeBiblique>;
  /** terme normalisé → identifiants d'entrées */
  indexTermes: Map<string, Set<string>>;
  /** clé de verset → commentaires couvrant ce verset */
  indexCommentaires: Map<string, Commentaire[]>;
  /** clé de verset → entrées de dictionnaire qui la citent */
  indexEntreesParVerset: Map<string, Set<string>>;
  modules: string[];
}

const etat: Etat = {
  sources: new Map(),
  entrees: new Map(),
  commentaires: [],
  referencesCroisees: [],
  themes: new Map(),
  indexTermes: new Map(),
  indexCommentaires: new Map(),
  indexEntreesParVerset: new Map(),
  modules: [],
};

function indexerTerme(terme: string, entreeId: string): void {
  const cle = normaliser(terme);
  if (!cle) return;
  if (!etat.indexTermes.has(cle)) etat.indexTermes.set(cle, new Set());
  etat.indexTermes.get(cle)!.add(entreeId);
  // Chaque mot du terme est également indexé, pour les entrées composées.
  for (const mot of cle.split(/[\s'-]+/)) {
    if (mot.length < 3) continue;
    if (!etat.indexTermes.has(mot)) etat.indexTermes.set(mot, new Set());
    etat.indexTermes.get(mot)!.add(entreeId);
  }
}

/**
 * Vérifie un module avant intégration. Étape « Vérification » du pipeline
 * d'ingestion : un module comportant une erreur n'est pas enregistré.
 */
export function verifierModule(module: ModuleConnaissance): AnomalieModule[] {
  const anomalies: AnomalieModule[] = [];
  if (!module.id) anomalies.push({ gravite: 'erreur', message: 'Module sans identifiant.' });
  if (!module.source?.id) {
    anomalies.push({ gravite: 'erreur', message: 'Module sans source déclarée.' });
  }
  if (module.source && module.source.droits === 'a-verifier') {
    anomalies.push({
      gravite: 'avertissement',
      message: `Droits non déterminés pour « ${module.source.titre} » : le contenu est indexé mais ne doit pas être redistribué.`,
    });
  }
  const vus = new Set<string>();
  for (const entree of module.entrees ?? []) {
    if (vus.has(entree.id)) {
      anomalies.push({ gravite: 'erreur', message: 'Identifiant d’entrée en double.', element: entree.id });
    }
    vus.add(entree.id);
    for (const def of entree.definitions) {
      if (def.sourceId !== module.source.id) {
        anomalies.push({
          gravite: 'avertissement',
          message: 'Définition attribuée à une source extérieure au module.',
          element: entree.id,
        });
      }
    }
  }
  for (const c of module.commentaires ?? []) {
    if (c.sourceId !== module.source.id) {
      anomalies.push({
        gravite: 'avertissement',
        message: 'Commentaire attribué à une source extérieure au module.',
        element: c.id,
      });
    }
  }
  return anomalies;
}

export function enregistrerModule(module: ModuleConnaissance): AnomalieModule[] {
  const anomalies = verifierModule(module);
  if (anomalies.some((a) => a.gravite === 'erreur')) return anomalies;
  if (etat.modules.includes(module.id)) return anomalies;

  etat.modules.push(module.id);
  etat.sources.set(module.source.id, module.source);

  for (const entree of module.entrees ?? []) {
    const existante = etat.entrees.get(entree.id);
    if (existante) {
      // Deux ouvrages traitant du même terme sont fusionnés : les définitions
      // s'ajoutent, chacune conservant sa source.
      existante.definitions.push(...entree.definitions);
      existante.motsOriginaux.push(...entree.motsOriginaux);
      existante.references.push(...entree.references);
      existante.variantes = [...new Set([...existante.variantes, ...entree.variantes])];
      existante.themes = [...new Set([...existante.themes, ...entree.themes])];
    } else {
      etat.entrees.set(entree.id, { ...entree });
    }
    indexerTerme(entree.terme, entree.id);
    for (const variante of entree.variantes) indexerTerme(variante, entree.id);
    for (const mot of entree.motsOriginaux) indexerTerme(mot.translitteration, entree.id);
    for (const ref of entree.references) {
      for (const cle of clesCouvertes(ref)) {
        if (!etat.indexEntreesParVerset.has(cle)) etat.indexEntreesParVerset.set(cle, new Set());
        etat.indexEntreesParVerset.get(cle)!.add(entree.id);
      }
    }
  }

  for (const commentaire of module.commentaires ?? []) {
    etat.commentaires.push(commentaire);
    for (const cle of clesCouvertes(commentaire.reference)) {
      if (!etat.indexCommentaires.has(cle)) etat.indexCommentaires.set(cle, []);
      etat.indexCommentaires.get(cle)!.push(commentaire);
    }
  }

  etat.referencesCroisees.push(...(module.referencesCroisees ?? []));
  for (const theme of module.themes ?? []) {
    const existant = etat.themes.get(theme.id);
    if (existant) {
      existant.references.push(...theme.references);
      existant.entrees = [...new Set([...existant.entrees, ...theme.entrees])];
      existant.motsCles = [...new Set([...existant.motsCles, ...theme.motsCles])];
    } else {
      etat.themes.set(theme.id, { ...theme });
    }
  }

  return anomalies;
}

// ————————————————————————————————————————————————————————————
// Lecture
// ————————————————————————————————————————————————————————————

export function getSource(id: string): Source | undefined {
  return etat.sources.get(id);
}

export function toutesLesSources(): Source[] {
  return [...etat.sources.values()];
}

export function getEntree(id: string): EntreeDictionnaire | undefined {
  return etat.entrees.get(id);
}

export function toutesLesEntrees(): EntreeDictionnaire[] {
  return [...etat.entrees.values()];
}

export function tousLesCommentaires(): Commentaire[] {
  return etat.commentaires;
}

export function tousLesThemes(): ThemeBiblique[] {
  return [...etat.themes.values()];
}

export function getTheme(id: string): ThemeBiblique | undefined {
  return etat.themes.get(id);
}

/**
 * Entrées de dictionnaire correspondant à une requête.
 * La requête entière est essayée d'abord — c'est le cas d'un terme cherché
 * directement — puis chacun de ses mots significatifs, ce qui permet à une
 * question rédigée de retrouver la bonne notice.
 */
export function chercherEntrees(requete: string, limite = 30): EntreeDictionnaire[] {
  const phrase = normaliser(requete);
  if (phrase.length < 2) return [];
  const cles = [...new Set([phrase, ...extraireTermes(requete)])];
  const scores = new Map<string, number>();

  const ajouter = (id: string, poids: number) =>
    scores.set(id, (scores.get(id) ?? 0) + poids);

  for (const [terme, ids] of etat.indexTermes) {
    let poids = 0;
    for (const cle of cles) {
      // La requête entière pèse davantage que l'un de ses mots.
      const facteur = cle === phrase ? 2 : 1;
      if (terme === cle) poids = Math.max(poids, 10 * facteur);
      else if (terme.startsWith(cle)) poids = Math.max(poids, 5 * facteur);
      else if (terme.includes(cle)) poids = Math.max(poids, 2 * facteur);
    }
    if (poids > 0) for (const id of ids) ajouter(id, poids);
  }

  return [...scores.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, limite)
    .map(([id]) => etat.entrees.get(id))
    .filter((e): e is EntreeDictionnaire => Boolean(e));
}

/** Commentaires couvrant une référence, toutes sources confondues. */
export function commentairesPour(ref: ReferenceBiblique): Commentaire[] {
  const vus = new Set<string>();
  const sortie: Commentaire[] = [];
  const ajouter = (c: Commentaire) => {
    if (vus.has(c.id)) return;
    vus.add(c.id);
    sortie.push(c);
  };
  for (const cle of clesCouvertes(ref)) {
    for (const c of etat.indexCommentaires.get(cle) ?? []) ajouter(c);
  }
  // Les commentaires portant sur le chapitre entier concernent aussi le verset.
  for (const c of etat.commentaires) {
    if (c.reference.verset === undefined && seRecouvrent(c.reference, ref)) ajouter(c);
  }
  return sortie;
}

/** Entrées de dictionnaire citant une référence. */
export function entreesPour(ref: ReferenceBiblique): EntreeDictionnaire[] {
  const ids = new Set<string>();
  for (const cle of clesCouvertes(ref)) {
    for (const id of etat.indexEntreesParVerset.get(cle) ?? []) ids.add(id);
  }
  return [...ids]
    .map((id) => etat.entrees.get(id))
    .filter((e): e is EntreeDictionnaire => Boolean(e));
}

/** Références croisées partant d'un passage, ou y arrivant. */
export function referencesCroiseesPour(ref: ReferenceBiblique): ReferenceCroisee[] {
  return etat.referencesCroisees.filter(
    (rc) => seRecouvrent(rc.de, ref) || seRecouvrent(rc.vers, ref),
  );
}

export function themesPour(ref: ReferenceBiblique): ThemeBiblique[] {
  return tousLesThemes().filter((t) => t.references.some((r) => seRecouvrent(r, ref)));
}

/**
 * Vue agrégée d'une référence : tout ce que la base sait d'un passage,
 * chaque élément restant rattaché à sa source.
 */
export interface DossierReference {
  reference: ReferenceBiblique;
  libelle: string;
  commentaires: Commentaire[];
  entrees: EntreeDictionnaire[];
  referencesCroisees: ReferenceCroisee[];
  themes: ThemeBiblique[];
  sources: Source[];
}

export function dossierReference(ref: ReferenceBiblique): DossierReference {
  const commentaires = commentairesPour(ref);
  const entrees = entreesPour(ref);
  const referencesCroisees = referencesCroiseesPour(ref).sort((a, b) =>
    comparerReferences(a.vers, b.vers),
  );
  const themes = themesPour(ref);
  const idsSources = new Set<string>([
    ...commentaires.map((c) => c.sourceId),
    ...entrees.flatMap((e) => e.definitions.map((d) => d.sourceId)),
    ...referencesCroisees.map((r) => r.sourceId),
    ...themes.map((t) => t.sourceId),
  ]);
  return {
    reference: ref,
    libelle: formaterReference(ref),
    commentaires,
    entrees,
    referencesCroisees,
    themes,
    sources: [...idsSources]
      .map((id) => etat.sources.get(id))
      .filter((s): s is Source => Boolean(s)),
  };
}

export function statistiquesBase(): {
  modules: number;
  sources: number;
  entrees: number;
  commentaires: number;
  referencesCroisees: number;
  themes: number;
} {
  return {
    modules: etat.modules.length,
    sources: etat.sources.size,
    entrees: etat.entrees.size,
    commentaires: etat.commentaires.length,
    referencesCroisees: etat.referencesCroisees.length,
    themes: etat.themes.size,
  };
}

/** Réinitialise le registre — utilisé par les tests. */
export function reinitialiserRegistre(): void {
  etat.sources.clear();
  etat.entrees.clear();
  etat.commentaires.length = 0;
  etat.referencesCroisees.length = 0;
  etat.themes.clear();
  etat.indexTermes.clear();
  etat.indexCommentaires.clear();
  etat.indexEntreesParVerset.clear();
  etat.modules.length = 0;
}
