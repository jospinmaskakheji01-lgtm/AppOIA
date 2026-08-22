/**
 * Architecture multi-versions : Bible → Version → Livre → Chapitre → Verset.
 *
 * Une version est un module autonome. En ajouter une consiste à écrire un
 * fichier exportant un `ModuleVersion` et à l'enregistrer ; aucune autre partie
 * de l'application n'a besoin d'être modifiée.
 */

import {
  cleVerset,
  comparerReferences,
  extraireTermes,
  normaliser,
  trouverLivre,
} from './reference';
import { Provenance, ReferenceBiblique, Source } from './types';

export interface VersionBible {
  id: string;
  /** Abréviation affichée, ex. « LSG ». */
  abreviation: string;
  nom: string;
  langue: string;
  annee?: string;
  /** Facultatif : provenance de la version, pour mémoire. */
  provenance?: Provenance;
  noteProvenance?: string;
  /** Une version peut n'être installée que partiellement. */
  couverture: 'complete' | 'partielle';
  /** Identifiant de la source documentaire correspondante. */
  sourceId: string;
}

export interface VersetTexte {
  livre: string;
  chapitre: number;
  verset: number;
  /**
   * Dernier verset rendu par ce bloc, quand la version en regroupe plusieurs.
   * Les traductions en langue courante le font souvent — Parole de Vie rend
   * « Nombres 4.34-49 » d'un seul tenant. Absent = un seul verset.
   */
  versetFin?: number;
  texte: string;
}

export interface ModuleVersion {
  version: VersionBible;
  versets: VersetTexte[];
}

interface VersionChargee {
  version: VersionBible;
  /** cleVerset → texte */
  parVerset: Map<string, VersetTexte>;
  /** livre normalisé → chapitres présents */
  chapitresParLivre: Map<string, Set<number>>;
  versets: VersetTexte[];
}

const versions = new Map<string, VersionChargee>();

export function enregistrerVersion(module: ModuleVersion): void {
  const parVerset = new Map<string, VersetTexte>();
  const chapitresParLivre = new Map<string, Set<number>>();
  for (const v of module.versets) {
    // Un bloc qui regroupe plusieurs versets est indexé sous chacun d'eux :
    // demander le verset 15 d'un bloc « 14-15 » doit rendre ce bloc, et non
    // laisser croire que la version ne couvre pas le passage.
    for (let n = v.verset; n <= (v.versetFin ?? v.verset); n++) {
      parVerset.set(cleVerset(v.livre, v.chapitre, n), v);
    }
    const cle = normaliser(v.livre);
    if (!chapitresParLivre.has(cle)) chapitresParLivre.set(cle, new Set());
    chapitresParLivre.get(cle)!.add(v.chapitre);
  }
  versions.set(module.version.id, {
    version: module.version,
    parVerset,
    chapitresParLivre,
    versets: module.versets,
  });
}

export function versionsDisponibles(): VersionBible[] {
  return [...versions.values()].map((v) => v.version);
}

export function getVersion(id: string): VersionBible | undefined {
  return versions.get(id)?.version;
}

/** La version à utiliser quand le choix de l'utilisateur n'est pas disponible. */
export function versionParDefaut(): VersionBible | undefined {
  return versionsDisponibles()[0];
}

export function versionInstallee(id: string): boolean {
  return versions.has(id);
}

/** Le texte d'un verset dans une version, ou `undefined` s'il n'y figure pas. */
export function getVerset(
  versionId: string,
  livre: string,
  chapitre: number,
  verset: number,
): VersetTexte | undefined {
  return versions.get(versionId)?.parVerset.get(cleVerset(livre, chapitre, verset));
}

/** Tous les versets couverts par une référence, dans une version donnée. */
export function getPassage(versionId: string, ref: ReferenceBiblique): VersetTexte[] {
  const chargee = versions.get(versionId);
  if (!chargee) return [];
  if (ref.verset === undefined) {
    return chargee.versets
      .filter((v) => normaliser(v.livre) === normaliser(ref.livre) && v.chapitre === ref.chapitre)
      .sort((a, b) => a.verset - b.verset);
  }
  const fin = ref.versetFin ?? ref.verset;
  const sortie: VersetTexte[] = [];
  for (let n = ref.verset; n <= fin; n++) {
    const v = chargee.parVerset.get(cleVerset(ref.livre, ref.chapitre, n));
    // Un bloc groupé est atteint par plusieurs numéros : ne le rendre qu'une fois.
    if (v && !sortie.includes(v)) sortie.push(v);
  }
  return sortie;
}

export interface PassageCompare {
  version: VersionBible;
  versets: VersetTexte[];
  /** Vrai quand la version est installée mais ne couvre pas ce passage. */
  absent: boolean;
}

/** Le même passage dans plusieurs versions, pour la comparaison côte à côte. */
export function comparerVersions(
  ref: ReferenceBiblique,
  versionIds?: string[],
): PassageCompare[] {
  const cibles = versionIds ?? versionsDisponibles().map((v) => v.id);
  return cibles
    .map((id) => versions.get(id))
    .filter((v): v is VersionChargee => Boolean(v))
    .map((chargee) => {
      const versets = getPassage(chargee.version.id, ref);
      return { version: chargee.version, versets, absent: versets.length === 0 };
    });
}

export interface ResultatVerset {
  version: VersionBible;
  verset: VersetTexte;
  reference: ReferenceBiblique;
  /** Score de pertinence, croissant. */
  score: number;
}

/**
 * Recherche plein texte dans une version (ou dans toutes).
 *
 * Un verset est retenu dès qu'il contient l'un des termes significatifs, et
 * son score croît avec le nombre de termes couverts : une question rédigée
 * trouve ainsi les versets pertinents, tandis qu'une expression exacte, dont
 * tous les mots sont présents, remonte largement en tête.
 */
export function rechercherDansTexte(
  requete: string,
  options: { versionId?: string; limite?: number } = {},
): ResultatVerset[] {
  const termes = extraireTermes(requete);
  if (termes.length === 0) return [];
  // Une expression de plusieurs mots retrouvée telle quelle dans un verset
  // prime sur des occurrences dispersées des mêmes mots.
  const phrase = normaliser(requete).replace(/[^a-z0-9' ]+/g, ' ').replace(/\s+/g, ' ').trim();
  const chercherPhrase = phrase.includes(' ');
  const cibles = options.versionId
    ? [versions.get(options.versionId)].filter((v): v is VersionChargee => Boolean(v))
    : [...versions.values()];

  const resultats: ResultatVerset[] = [];
  for (const chargee of cibles) {
    for (const v of chargee.versets) {
      const texte = normaliser(v.texte);
      let score = 0;
      let couverts = 0;
      for (const terme of termes) {
        const occurrences = texte.split(terme).length - 1;
        if (occurrences > 0) {
          couverts += 1;
          score += occurrences;
        }
      }
      // Couvrir tous les termes vaut bien davantage que les cumuler sur un seul.
      if (couverts > 0) score += couverts * 4 + (couverts === termes.length ? 12 : 0);
      // Retrouver mot pour mot ce que l'utilisateur a tapé dans un verset est
      // le résultat le plus sûr qu'une recherche biblique puisse donner : le
      // bonus doit dépasser le plancher des autres natures, sans quoi une
      // notice de dictionnaire qui partage un seul mot passerait devant le
      // verset cité.
      if (chercherPhrase && couverts > 0 && texte.includes(phrase)) score += 220;
      if (score > 0) {
        resultats.push({
          version: chargee.version,
          verset: v,
          reference: { livre: v.livre, chapitre: v.chapitre, verset: v.verset },
          score,
        });
      }
    }
  }
  return resultats
    .sort((a, b) => b.score - a.score || comparerReferences(a.reference, b.reference))
    .slice(0, options.limite ?? 60);
}

/** Les livres réellement présents dans une version, dans l'ordre canonique. */
export function livresDeLaVersion(versionId: string): string[] {
  const chargee = versions.get(versionId);
  if (!chargee) return [];
  const noms = new Set(chargee.versets.map((v) => v.livre));
  return [...noms].sort(
    (a, b) => (trouverLivre(a)?.rang ?? 999) - (trouverLivre(b)?.rang ?? 999),
  );
}

export function statistiquesVersion(versionId: string): {
  livres: number;
  chapitres: number;
  versets: number;
} {
  const chargee = versions.get(versionId);
  if (!chargee) return { livres: 0, chapitres: 0, versets: 0 };
  let chapitres = 0;
  for (const set of chargee.chapitresParLivre.values()) chapitres += set.size;
  return {
    livres: chargee.chapitresParLivre.size,
    chapitres,
    versets: chargee.versets.length,
  };
}

/** Construit la fiche source correspondant à une version. */
export function sourceDeVersion(version: VersionBible, ajouteLe: string): Source {
  return {
    id: version.sourceId,
    titre: version.nom,
    langue: version.langue,
    annee: version.annee,
    type: 'bible',
    provenance: version.provenance,
    noteProvenance: version.noteProvenance,
    abreviation: version.abreviation,
    ajouteLe,
  };
}
