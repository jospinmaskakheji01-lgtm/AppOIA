/**
 * Analyse et normalisation des références bibliques.
 * Toute la base de connaissances s'indexe sur la forme canonique produite ici,
 * ce qui permet de relier entre eux des documents qui n'écrivent pas les
 * références de la même manière (« 1 Co 13.4 », « I Corinthiens 13:4 »…).
 */

import { ReferenceBiblique } from './types';

export interface LivreCanonique {
  nom: string;
  abreviation: string;
  testament: 'ancien' | 'nouveau';
  /** Rang canonique, pour trier les résultats dans l'ordre de la Bible. */
  rang: number;
  chapitres: number;
  /** Graphies acceptées en entrée, en minuscules et sans accents. */
  alias: string[];
}

export const livresCanoniques: LivreCanonique[] = [
  { nom: 'Genèse', abreviation: 'Gn', testament: 'ancien', rang: 1, chapitres: 50, alias: ['genese', 'gn', 'gen', 'ge'] },
  { nom: 'Exode', abreviation: 'Ex', testament: 'ancien', rang: 2, chapitres: 40, alias: ['exode', 'ex', 'exo'] },
  { nom: 'Lévitique', abreviation: 'Lv', testament: 'ancien', rang: 3, chapitres: 27, alias: ['levitique', 'lv', 'lev', 'le'] },
  { nom: 'Nombres', abreviation: 'Nb', testament: 'ancien', rang: 4, chapitres: 36, alias: ['nombres', 'nb', 'nom', 'no', 'nomb'] },
  { nom: 'Deutéronome', abreviation: 'Dt', testament: 'ancien', rang: 5, chapitres: 34, alias: ['deuteronome', 'dt', 'deut', 'de'] },
  { nom: 'Josué', abreviation: 'Jos', testament: 'ancien', rang: 6, chapitres: 24, alias: ['josue', 'jos', 'josh'] },
  { nom: 'Juges', abreviation: 'Jg', testament: 'ancien', rang: 7, chapitres: 21, alias: ['juges', 'jg', 'jug'] },
  { nom: 'Ruth', abreviation: 'Rt', testament: 'ancien', rang: 8, chapitres: 4, alias: ['ruth', 'rt'] },
  { nom: '1 Samuel', abreviation: '1 S', testament: 'ancien', rang: 9, chapitres: 31, alias: ['1 samuel', '1s', '1 sam', 'i samuel', '1 s', '1sam', 'i sam'] },
  { nom: '2 Samuel', abreviation: '2 S', testament: 'ancien', rang: 10, chapitres: 24, alias: ['2 samuel', '2s', '2 sam', 'ii samuel', '2 s', '2sam', 'ii sam'] },
  { nom: '1 Rois', abreviation: '1 R', testament: 'ancien', rang: 11, chapitres: 22, alias: ['1 rois', '1r', 'i rois', '1 roi'] },
  { nom: '2 Rois', abreviation: '2 R', testament: 'ancien', rang: 12, chapitres: 25, alias: ['2 rois', '2r', 'ii rois', '2 roi'] },
  { nom: '1 Chroniques', abreviation: '1 Ch', testament: 'ancien', rang: 13, chapitres: 29, alias: ['1 chroniques', '1ch', '1 chr', '1 ch', '1chr', 'i chr'] },
  { nom: '2 Chroniques', abreviation: '2 Ch', testament: 'ancien', rang: 14, chapitres: 36, alias: ['2 chroniques', '2ch', '2 chr', '2 ch', '2chr', 'ii chr'] },
  { nom: 'Esdras', abreviation: 'Esd', testament: 'ancien', rang: 15, chapitres: 10, alias: ['esdras', 'esd'] },
  { nom: 'Néhémie', abreviation: 'Né', testament: 'ancien', rang: 16, chapitres: 13, alias: ['nehemie', 'ne', 'neh', 'nehe'] },
  { nom: 'Esther', abreviation: 'Est', testament: 'ancien', rang: 17, chapitres: 10, alias: ['esther', 'est', 'esth'] },
  { nom: 'Job', abreviation: 'Jb', testament: 'ancien', rang: 18, chapitres: 42, alias: ['job', 'jb'] },
  { nom: 'Psaumes', abreviation: 'Ps', testament: 'ancien', rang: 19, chapitres: 150, alias: ['psaumes', 'psaume', 'ps', 'psa', 'psau', 'psalm'] },
  { nom: 'Proverbes', abreviation: 'Pr', testament: 'ancien', rang: 20, chapitres: 31, alias: ['proverbes', 'pr', 'prov', 'pro'] },
  { nom: 'Ecclésiaste', abreviation: 'Ec', testament: 'ancien', rang: 21, chapitres: 12, alias: ['ecclesiaste', 'ec', 'eccl', 'qohelet', 'ecc', 'eccle', 'qoh'] },
  { nom: 'Cantique des cantiques', abreviation: 'Ct', testament: 'ancien', rang: 22, chapitres: 8, alias: ['cantique des cantiques', 'cantique', 'ct', 'cant', 'cantiques', 'cant des cant'] },
  { nom: 'Ésaïe', abreviation: 'És', testament: 'ancien', rang: 23, chapitres: 66, alias: ['esaie', 'es', 'isaie', 'is', 'esa', 'isa'] },
  { nom: 'Jérémie', abreviation: 'Jr', testament: 'ancien', rang: 24, chapitres: 52, alias: ['jeremie', 'jr', 'jer', 'jere'] },
  { nom: 'Lamentations', abreviation: 'Lm', testament: 'ancien', rang: 25, chapitres: 5, alias: ['lamentations', 'lm', 'lam', 'lament'] },
  { nom: 'Ézéchiel', abreviation: 'Éz', testament: 'ancien', rang: 26, chapitres: 48, alias: ['ezechiel', 'ez', 'eze', 'ezech'] },
  { nom: 'Daniel', abreviation: 'Dn', testament: 'ancien', rang: 27, chapitres: 12, alias: ['daniel', 'dn', 'dan', 'da'] },
  { nom: 'Osée', abreviation: 'Os', testament: 'ancien', rang: 28, chapitres: 14, alias: ['osee', 'os', 'ose'] },
  { nom: 'Joël', abreviation: 'Jl', testament: 'ancien', rang: 29, chapitres: 3, alias: ['joel', 'jl', 'joe'] },
  { nom: 'Amos', abreviation: 'Am', testament: 'ancien', rang: 30, chapitres: 9, alias: ['amos', 'am', 'amo'] },
  { nom: 'Abdias', abreviation: 'Ab', testament: 'ancien', rang: 31, chapitres: 1, alias: ['abdias', 'ab'] },
  { nom: 'Jonas', abreviation: 'Jon', testament: 'ancien', rang: 32, chapitres: 4, alias: ['jonas', 'jon'] },
  { nom: 'Michée', abreviation: 'Mi', testament: 'ancien', rang: 33, chapitres: 7, alias: ['michee', 'mi', 'mic', 'mich'] },
  { nom: 'Nahum', abreviation: 'Na', testament: 'ancien', rang: 34, chapitres: 3, alias: ['nahum', 'na', 'nah'] },
  { nom: 'Habacuc', abreviation: 'Ha', testament: 'ancien', rang: 35, chapitres: 3, alias: ['habacuc', 'ha', 'hab', 'habac'] },
  { nom: 'Sophonie', abreviation: 'So', testament: 'ancien', rang: 36, chapitres: 3, alias: ['sophonie', 'so', 'soph', 'sop'] },
  { nom: 'Aggée', abreviation: 'Ag', testament: 'ancien', rang: 37, chapitres: 2, alias: ['aggee', 'ag', 'agg'] },
  { nom: 'Zacharie', abreviation: 'Za', testament: 'ancien', rang: 38, chapitres: 14, alias: ['zacharie', 'za', 'zach', 'zac'] },
  { nom: 'Malachie', abreviation: 'Ml', testament: 'ancien', rang: 39, chapitres: 4, alias: ['malachie', 'ml', 'mal', 'mala'] },
  { nom: 'Matthieu', abreviation: 'Mt', testament: 'nouveau', rang: 40, chapitres: 28, alias: ['matthieu', 'mt', 'matt', 'mat'] },
  { nom: 'Marc', abreviation: 'Mc', testament: 'nouveau', rang: 41, chapitres: 16, alias: ['marc', 'mc', 'mar'] },
  { nom: 'Luc', abreviation: 'Lc', testament: 'nouveau', rang: 42, chapitres: 24, alias: ['luc', 'lc'] },
  { nom: 'Jean', abreviation: 'Jn', testament: 'nouveau', rang: 43, chapitres: 21, alias: ['jean', 'jn'] },
  { nom: 'Actes', abreviation: 'Ac', testament: 'nouveau', rang: 44, chapitres: 28, alias: ['actes', 'ac', 'act', 'actes des apotres'] },
  { nom: 'Romains', abreviation: 'Rm', testament: 'nouveau', rang: 45, chapitres: 16, alias: ['romains', 'rm', 'rom', 'ro'] },
  { nom: '1 Corinthiens', abreviation: '1 Co', testament: 'nouveau', rang: 46, chapitres: 16, alias: ['1 corinthiens', '1co', '1 cor', 'i corinthiens', '1 co', '1cor', 'i cor'] },
  { nom: '2 Corinthiens', abreviation: '2 Co', testament: 'nouveau', rang: 47, chapitres: 13, alias: ['2 corinthiens', '2co', '2 cor', 'ii corinthiens', '2 co', '2cor', 'ii cor'] },
  { nom: 'Galates', abreviation: 'Ga', testament: 'nouveau', rang: 48, chapitres: 6, alias: ['galates', 'ga', 'gal'] },
  { nom: 'Éphésiens', abreviation: 'Ép', testament: 'nouveau', rang: 49, chapitres: 6, alias: ['ephesiens', 'ep', 'eph', 'ephes', 'esiens'] },
  { nom: 'Philippiens', abreviation: 'Ph', testament: 'nouveau', rang: 50, chapitres: 4, alias: ['philippiens', 'ph', 'phil', 'php'] },
  { nom: 'Colossiens', abreviation: 'Col', testament: 'nouveau', rang: 51, chapitres: 4, alias: ['colossiens', 'col'] },
  { nom: '1 Thessaloniciens', abreviation: '1 Th', testament: 'nouveau', rang: 52, chapitres: 5, alias: ['1 thessaloniciens', '1th', '1 thess', '1 th', '1thess', '1 thes'] },
  { nom: '2 Thessaloniciens', abreviation: '2 Th', testament: 'nouveau', rang: 53, chapitres: 3, alias: ['2 thessaloniciens', '2th', '2 thess', '2 th', '2thess', '2 thes'] },
  { nom: '1 Timothée', abreviation: '1 Tm', testament: 'nouveau', rang: 54, chapitres: 6, alias: ['1 timothee', '1tm', '1 tim', '1tim'] },
  { nom: '2 Timothée', abreviation: '2 Tm', testament: 'nouveau', rang: 55, chapitres: 4, alias: ['2 timothee', '2tm', '2 tim', '2tim'] },
  { nom: 'Tite', abreviation: 'Tt', testament: 'nouveau', rang: 56, chapitres: 3, alias: ['tite', 'tt', 'tit'] },
  { nom: 'Philémon', abreviation: 'Phm', testament: 'nouveau', rang: 57, chapitres: 1, alias: ['philemon', 'phm', 'philem'] },
  { nom: 'Hébreux', abreviation: 'Hé', testament: 'nouveau', rang: 58, chapitres: 13, alias: ['hebreux', 'he', 'heb', 'hebr'] },
  { nom: 'Jacques', abreviation: 'Jc', testament: 'nouveau', rang: 59, chapitres: 5, alias: ['jacques', 'jc', 'jac', 'jacq'] },
  { nom: '1 Pierre', abreviation: '1 P', testament: 'nouveau', rang: 60, chapitres: 5, alias: ['1 pierre', '1p', 'i pierre', '1 pi', '1pi', '1 p', '1 pier'] },
  { nom: '2 Pierre', abreviation: '2 P', testament: 'nouveau', rang: 61, chapitres: 3, alias: ['2 pierre', '2p', 'ii pierre', '2 pi', '2pi', '2 p', '2 pier'] },
  { nom: '1 Jean', abreviation: '1 Jn', testament: 'nouveau', rang: 62, chapitres: 5, alias: ['1 jean', '1jn', 'i jean', '1 jn'] },
  { nom: '2 Jean', abreviation: '2 Jn', testament: 'nouveau', rang: 63, chapitres: 1, alias: ['2 jean', '2jn', 'ii jean', '2 jn'] },
  { nom: '3 Jean', abreviation: '3 Jn', testament: 'nouveau', rang: 64, chapitres: 1, alias: ['3 jean', '3jn', 'iii jean', '3 jn'] },
  { nom: 'Jude', abreviation: 'Jud', testament: 'nouveau', rang: 65, chapitres: 1, alias: ['jude', 'jud', 'jd'] },
  { nom: 'Apocalypse', abreviation: 'Ap', testament: 'nouveau', rang: 66, chapitres: 22, alias: ['apocalypse', 'ap', 'apoc', 'revelation', 'apo', 'rev'] },
];

/** Minuscules, sans accents ni ponctuation : la forme utilisée pour comparer. */
export function normaliser(texte: string): string {
  return texte
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[’']/g, "'")
    .trim();
}

/**
 * Mots trop fréquents pour porter du sens dans une recherche.
 * Sans ce filtre, une question rédigée (« que signifie le mot grâce ? »)
 * n'aurait aucune chance de retrouver un verset.
 */
const MOTS_VIDES = new Set([
  'que', 'qui', 'quoi', 'dont', 'les', 'des', 'une', 'un', 'le', 'la', 'de', 'du',
  'est', 'sont', 'dans', 'pour', 'par', 'avec', 'sur', 'aux', 'ses', 'son', 'sa',
  'mon', 'ma', 'mes', 'ton', 'ta', 'tes', 'nos', 'vos', 'leur', 'leurs', 'ce',
  'cet', 'cette', 'ces', 'il', 'elle', 'ils', 'elles', 'nous', 'vous', 'je', 'tu',
  'pas', 'plus', 'moins', 'tout', 'tous', 'toute', 'toutes', 'mais', 'donc', 'car',
  'quel', 'quelle', 'quels', 'quelles', 'comment', 'pourquoi', 'quand', 'signifie',
  'signification', 'veut', 'dire', 'bible', 'biblique', 'verset', 'passage',
  'sens', 'texte', 'selon', 'ainsi', 'etre', 'avoir', 'fait', 'faire',
]);

/** Termes significatifs d'une requête, normalisés et sans mots vides. */
export function extraireTermes(requete: string): string[] {
  const bruts = normaliser(requete)
    .split(/[^a-z0-9']+/)
    .filter((t) => t.length > 2);
  const utiles = bruts.filter((t) => !MOTS_VIDES.has(t));
  // Si la requête n'est faite que de mots vides, on les garde plutôt que
  // de ne rien chercher du tout.
  return utiles.length > 0 ? [...new Set(utiles)] : [...new Set(bruts)];
}

const indexLivres = new Map<string, LivreCanonique>();
for (const livre of livresCanoniques) {
  indexLivres.set(normaliser(livre.nom), livre);
  indexLivres.set(normaliser(livre.abreviation), livre);
  for (const alias of livre.alias) indexLivres.set(normaliser(alias), livre);
}

export function trouverLivre(nom: string): LivreCanonique | undefined {
  const cle = normaliser(nom).replace(/\.$/, '');
  return indexLivres.get(cle) ?? indexLivres.get(cle.replace(/\s+/g, ' '));
}

/**
 * Analyse une référence écrite librement.
 * Accepte « Jean 3:16 », « Jn 3.16-21 », « 1 Corinthiens 13 », « Ps 23 ».
 */
export function analyserReference(brut: string): ReferenceBiblique | undefined {
  const texte = brut.trim().replace(/[–—]/g, '-');
  const m = texte.match(
    /^([1-3]?\s*[^\d,;]+?)\s*(\d+)\s*(?:[:.,v]\s*(\d+)\s*(?:-\s*(\d+))?)?\s*$/i,
  );
  if (!m) return undefined;
  const livre = trouverLivre(m[1]);
  if (!livre) return undefined;
  const chapitre = Number(m[2]);
  if (!Number.isFinite(chapitre) || chapitre < 1 || chapitre > livre.chapitres) return undefined;
  const verset = m[3] ? Number(m[3]) : undefined;
  const versetFin = m[4] ? Number(m[4]) : undefined;
  return {
    livre: livre.nom,
    chapitre,
    verset,
    versetFin: versetFin && verset && versetFin > verset ? versetFin : undefined,
  };
}

export function formaterReference(ref: ReferenceBiblique): string {
  const base = `${ref.livre} ${ref.chapitre}`;
  if (ref.verset === undefined) return base;
  if (ref.versetFin) return `${base}:${ref.verset}-${ref.versetFin}`;
  return `${base}:${ref.verset}`;
}

/** Clé d'indexation d'un verset unique, ex. « 43|3|16 ». */
export function cleVerset(livre: string, chapitre: number, verset: number): string {
  const l = trouverLivre(livre);
  return `${l?.rang ?? 0}|${chapitre}|${verset}`;
}

/** Toutes les clés de versets couvertes par une référence. */
export function clesCouvertes(ref: ReferenceBiblique): string[] {
  if (ref.verset === undefined) return [`${trouverLivre(ref.livre)?.rang ?? 0}|${ref.chapitre}|*`];
  const fin = ref.versetFin ?? ref.verset;
  const cles: string[] = [];
  for (let v = ref.verset; v <= fin; v++) cles.push(cleVerset(ref.livre, ref.chapitre, v));
  return cles;
}

/** Deux références se recouvrent-elles ? */
export function seRecouvrent(a: ReferenceBiblique, b: ReferenceBiblique): boolean {
  if (normaliser(a.livre) !== normaliser(b.livre) || a.chapitre !== b.chapitre) return false;
  if (a.verset === undefined || b.verset === undefined) return true;
  const finA = a.versetFin ?? a.verset;
  const finB = b.versetFin ?? b.verset;
  return a.verset <= finB && b.verset <= finA;
}

/** Tri dans l'ordre canonique. */
export function comparerReferences(a: ReferenceBiblique, b: ReferenceBiblique): number {
  const ra = trouverLivre(a.livre)?.rang ?? 999;
  const rb = trouverLivre(b.livre)?.rang ?? 999;
  if (ra !== rb) return ra - rb;
  if (a.chapitre !== b.chapitre) return a.chapitre - b.chapitre;
  return (a.verset ?? 0) - (b.verset ?? 0);
}
