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
  /**
   * Corpus auquel le livre appartient. Les livres deutérocanoniques sont
   * reçus comme canoniques par les Églises catholique et orthodoxe, et tenus
   * pour utiles sans être canoniques par les Églises issues de la Réforme.
   * Les distinguer permet à l'application de les présenter sans trancher.
   */
  testament: 'ancien' | 'deuterocanonique' | 'nouveau';
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
  { nom: 'Tobie', abreviation: 'Tb', testament: 'deuterocanonique', rang: 17, chapitres: 14, alias: ['tobie', 'tb', 'tob', 'tobit'] },
  { nom: 'Judith', abreviation: 'Jdt', testament: 'deuterocanonique', rang: 18, chapitres: 16, alias: ['judith', 'jdt', 'jud'] },
  { nom: 'Esther', abreviation: 'Est', testament: 'ancien', rang: 19, chapitres: 10, alias: ['esther', 'est', 'esth'] },
  { nom: 'Esther grec', abreviation: 'Estgr', testament: 'deuterocanonique', rang: 20, chapitres: 16, alias: ['esther grec', 'estgr', 'est gr', 'est grec', 'esther gr'] },
  { nom: '1 Maccabées', abreviation: '1 M', testament: 'deuterocanonique', rang: 21, chapitres: 16, alias: ['1 maccabees', '1m', '1 mac', '1 macc', 'i maccabees', '1 maccabee'] },
  { nom: '2 Maccabées', abreviation: '2 M', testament: 'deuterocanonique', rang: 22, chapitres: 15, alias: ['2 maccabees', '2m', '2 mac', '2 macc', 'ii maccabees', '2 maccabee'] },
  { nom: 'Job', abreviation: 'Jb', testament: 'ancien', rang: 23, chapitres: 42, alias: ['job', 'jb'] },
  { nom: 'Psaumes', abreviation: 'Ps', testament: 'ancien', rang: 24, chapitres: 150, alias: ['psaumes', 'psaume', 'ps', 'psa', 'psau', 'psalm'] },
  { nom: 'Proverbes', abreviation: 'Pr', testament: 'ancien', rang: 25, chapitres: 31, alias: ['proverbes', 'pr', 'prov', 'pro'] },
  { nom: 'Ecclésiaste', abreviation: 'Ec', testament: 'ancien', rang: 26, chapitres: 12, alias: ['ecclesiaste', 'ec', 'eccl', 'qohelet', 'ecc', 'eccle', 'qoh'] },
  { nom: 'Cantique des cantiques', abreviation: 'Ct', testament: 'ancien', rang: 27, chapitres: 8, alias: ['cantique des cantiques', 'cantique', 'ct', 'cant', 'cantiques', 'cant des cant'] },
  { nom: 'Sagesse', abreviation: 'Sg', testament: 'deuterocanonique', rang: 28, chapitres: 19, alias: ['sagesse', 'sg', 'sag', 'sagesse de salomon'] },
  { nom: 'Siracide', abreviation: 'Si', testament: 'deuterocanonique', rang: 29, chapitres: 51, alias: ['siracide', 'si', 'sir', 'sirac', 'ecclesiastique', 'ben sira'] },
  { nom: 'Ésaïe', abreviation: 'És', testament: 'ancien', rang: 30, chapitres: 66, alias: ['esaie', 'es', 'isaie', 'is', 'esa', 'isa'] },
  { nom: 'Jérémie', abreviation: 'Jr', testament: 'ancien', rang: 31, chapitres: 52, alias: ['jeremie', 'jr', 'jer', 'jere'] },
  { nom: 'Lamentations', abreviation: 'Lm', testament: 'ancien', rang: 32, chapitres: 5, alias: ['lamentations', 'lm', 'lam', 'lament', 'lamentations de jeremie'] },
  { nom: 'Baruch', abreviation: 'Ba', testament: 'deuterocanonique', rang: 33, chapitres: 5, alias: ['baruch', 'ba', 'bar', 'baruc'] },
  { nom: 'Ézéchiel', abreviation: 'Éz', testament: 'ancien', rang: 34, chapitres: 48, alias: ['ezechiel', 'ez', 'eze', 'ezech'] },
  { nom: 'Daniel', abreviation: 'Dn', testament: 'ancien', rang: 35, chapitres: 14, alias: ['daniel', 'dn', 'dan', 'da'] },
  { nom: 'Osée', abreviation: 'Os', testament: 'ancien', rang: 36, chapitres: 14, alias: ['osee', 'os', 'ose'] },
  { nom: 'Joël', abreviation: 'Jl', testament: 'ancien', rang: 37, chapitres: 3, alias: ['joel', 'jl', 'joe'] },
  { nom: 'Amos', abreviation: 'Am', testament: 'ancien', rang: 38, chapitres: 9, alias: ['amos', 'am', 'amo'] },
  { nom: 'Abdias', abreviation: 'Ab', testament: 'ancien', rang: 39, chapitres: 1, alias: ['abdias', 'ab'] },
  { nom: 'Jonas', abreviation: 'Jon', testament: 'ancien', rang: 40, chapitres: 4, alias: ['jonas', 'jon'] },
  { nom: 'Michée', abreviation: 'Mi', testament: 'ancien', rang: 41, chapitres: 7, alias: ['michee', 'mi', 'mic', 'mich'] },
  { nom: 'Nahum', abreviation: 'Na', testament: 'ancien', rang: 42, chapitres: 3, alias: ['nahum', 'na', 'nah'] },
  { nom: 'Habacuc', abreviation: 'Ha', testament: 'ancien', rang: 43, chapitres: 3, alias: ['habacuc', 'ha', 'hab', 'habac', 'habakuk', 'habakkuk'] },
  { nom: 'Sophonie', abreviation: 'So', testament: 'ancien', rang: 44, chapitres: 3, alias: ['sophonie', 'so', 'soph', 'sop'] },
  { nom: 'Aggée', abreviation: 'Ag', testament: 'ancien', rang: 45, chapitres: 2, alias: ['aggee', 'ag', 'agg'] },
  { nom: 'Zacharie', abreviation: 'Za', testament: 'ancien', rang: 46, chapitres: 14, alias: ['zacharie', 'za', 'zach', 'zac'] },
  { nom: 'Malachie', abreviation: 'Ml', testament: 'ancien', rang: 47, chapitres: 4, alias: ['malachie', 'ml', 'mal', 'mala'] },
  { nom: 'Lettre de Jérémie', abreviation: 'LtJr', testament: 'deuterocanonique', rang: 48, chapitres: 1, alias: ['lettre de jeremie', 'ltjr', 'lt jr', 'letjer', 'epitre de jeremie'] },
  { nom: 'Matthieu', abreviation: 'Mt', testament: 'nouveau', rang: 49, chapitres: 28, alias: ['matthieu', 'mt', 'matt', 'mat'] },
  { nom: 'Marc', abreviation: 'Mc', testament: 'nouveau', rang: 50, chapitres: 16, alias: ['marc', 'mc', 'mar'] },
  { nom: 'Luc', abreviation: 'Lc', testament: 'nouveau', rang: 51, chapitres: 24, alias: ['luc', 'lc'] },
  { nom: 'Jean', abreviation: 'Jn', testament: 'nouveau', rang: 52, chapitres: 21, alias: ['jean', 'jn'] },
  { nom: 'Actes', abreviation: 'Ac', testament: 'nouveau', rang: 53, chapitres: 28, alias: ['actes', 'ac', 'act', 'actes des apotres'] },
  { nom: 'Romains', abreviation: 'Rm', testament: 'nouveau', rang: 54, chapitres: 16, alias: ['romains', 'rm', 'rom', 'ro'] },
  { nom: '1 Corinthiens', abreviation: '1 Co', testament: 'nouveau', rang: 55, chapitres: 16, alias: ['1 corinthiens', '1co', '1 cor', 'i corinthiens', '1 co', '1cor', 'i cor'] },
  { nom: '2 Corinthiens', abreviation: '2 Co', testament: 'nouveau', rang: 56, chapitres: 13, alias: ['2 corinthiens', '2co', '2 cor', 'ii corinthiens', '2 co', '2cor', 'ii cor'] },
  { nom: 'Galates', abreviation: 'Ga', testament: 'nouveau', rang: 57, chapitres: 6, alias: ['galates', 'ga', 'gal'] },
  { nom: 'Éphésiens', abreviation: 'Ép', testament: 'nouveau', rang: 58, chapitres: 6, alias: ['ephesiens', 'ep', 'eph', 'ephes', 'esiens'] },
  { nom: 'Philippiens', abreviation: 'Ph', testament: 'nouveau', rang: 59, chapitres: 4, alias: ['philippiens', 'ph', 'phil', 'php'] },
  { nom: 'Colossiens', abreviation: 'Col', testament: 'nouveau', rang: 60, chapitres: 4, alias: ['colossiens', 'col'] },
  { nom: '1 Thessaloniciens', abreviation: '1 Th', testament: 'nouveau', rang: 61, chapitres: 5, alias: ['1 thessaloniciens', '1th', '1 thess', '1 th', '1thess', '1 thes'] },
  { nom: '2 Thessaloniciens', abreviation: '2 Th', testament: 'nouveau', rang: 62, chapitres: 3, alias: ['2 thessaloniciens', '2th', '2 thess', '2 th', '2thess', '2 thes'] },
  { nom: '1 Timothée', abreviation: '1 Tm', testament: 'nouveau', rang: 63, chapitres: 6, alias: ['1 timothee', '1tm', '1 tim', '1tim'] },
  { nom: '2 Timothée', abreviation: '2 Tm', testament: 'nouveau', rang: 64, chapitres: 4, alias: ['2 timothee', '2tm', '2 tim', '2tim'] },
  { nom: 'Tite', abreviation: 'Tt', testament: 'nouveau', rang: 65, chapitres: 3, alias: ['tite', 'tt', 'tit'] },
  { nom: 'Philémon', abreviation: 'Phm', testament: 'nouveau', rang: 66, chapitres: 1, alias: ['philemon', 'phm', 'philem'] },
  { nom: 'Hébreux', abreviation: 'Hé', testament: 'nouveau', rang: 67, chapitres: 13, alias: ['hebreux', 'he', 'heb', 'hebr'] },
  { nom: 'Jacques', abreviation: 'Jc', testament: 'nouveau', rang: 68, chapitres: 5, alias: ['jacques', 'jc', 'jac', 'jacq'] },
  { nom: '1 Pierre', abreviation: '1 P', testament: 'nouveau', rang: 69, chapitres: 5, alias: ['1 pierre', '1p', 'i pierre', '1 pi', '1pi', '1 p', '1 pier'] },
  { nom: '2 Pierre', abreviation: '2 P', testament: 'nouveau', rang: 70, chapitres: 3, alias: ['2 pierre', '2p', 'ii pierre', '2 pi', '2pi', '2 p', '2 pier'] },
  { nom: '1 Jean', abreviation: '1 Jn', testament: 'nouveau', rang: 71, chapitres: 5, alias: ['1 jean', '1jn', 'i jean', '1 jn'] },
  { nom: '2 Jean', abreviation: '2 Jn', testament: 'nouveau', rang: 72, chapitres: 1, alias: ['2 jean', '2jn', 'ii jean', '2 jn'] },
  { nom: '3 Jean', abreviation: '3 Jn', testament: 'nouveau', rang: 73, chapitres: 1, alias: ['3 jean', '3jn', 'iii jean', '3 jn'] },
  { nom: 'Jude', abreviation: 'Jud', testament: 'nouveau', rang: 74, chapitres: 1, alias: ['jude', 'jud', 'jd'] },
  { nom: 'Apocalypse', abreviation: 'Ap', testament: 'nouveau', rang: 75, chapitres: 22, alias: ['apocalypse', 'ap', 'apoc', 'revelation', 'apo', 'rev'] },
];

/** Minuscules, sans accents ni ponctuation : la forme utilisée pour comparer. */
/**
 * Passages deutérocanoniques logés à l'intérieur de livres reçus par tous.
 *
 * Les Églises du canon long lisent Suzanne et Bel comme les chapitres 13 et 14
 * de Daniel, et la prière d'Azarias comme la suite de Daniel 3. Le livre entier
 * ne peut donc pas porter une seule étiquette : c'est le passage qui décide.
 */
const PASSAGES_DEUTEROCANONIQUES: { livre: string; chapitre: number; depuis?: number }[] = [
  { livre: 'Daniel', chapitre: 3, depuis: 31 },
  { livre: 'Daniel', chapitre: 13 },
  { livre: 'Daniel', chapitre: 14 },
];

/** Vrai si la référence désigne un passage du canon long seul. */
export function estDeuterocanonique(ref: ReferenceBiblique): boolean {
  const livre = trouverLivre(ref.livre);
  if (!livre) return false;
  if (livre.testament === 'deuterocanonique') return true;
  return PASSAGES_DEUTEROCANONIQUES.some(
    (p) =>
      p.livre === livre.nom &&
      p.chapitre === ref.chapitre &&
      (p.depuis === undefined || (ref.versetFin ?? ref.verset ?? 0) >= p.depuis),
  );
}

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

/**
 * Toutes les références citées dans un texte libre, dans leur ordre d'apparition.
 *
 * L'étude de personnages fait établir la liste des passages à une étape, puis
 * les relire à quatre étapes suivantes. Si l'application ne sait pas relire ce
 * que l'utilisateur a écrit, elle lui demande de retaper ses références à
 * chaque fois — ou de sortir de l'étude pour aller les rechercher ailleurs.
 *
 * On part des nombres, et non des noms : c'est le nombre qui signale une
 * référence possible, et les mots qui le précèdent qui disent de quel livre il
 * s'agit. On essaie les trois derniers mots, puis les deux derniers, puis le
 * dernier — « Cantique des cantiques » est le nom le plus long du canon — et
 * c'est `analyserReference` qui tranche : un nom qui n'est pas un livre, ou un
 * chapitre qui dépasse ce que le livre compte, est écarté. Mieux vaut manquer
 * une référence mal écrite qu'en inventer une.
 */
export function extraireReferences(texte: string): ReferenceBiblique[] {
  // La virgule sépare un chapitre de son verset — « Jean 3,16 » — mais aussi
  // les références d'une liste. On ne la lit comme séparateur de verset que
  // collée au chiffre suivant : sans quoi, dans « 2 Corinthiens 2, 2
  // Corinthiens 7 », le « 2 » du livre suivant devenait un verset du chapitre
  // précédent et l'application inventait un « 2 Corinthiens 2:2 ».
  const nombres = /\d+(?:\s*[:.]\s*\d+|,\d+)?(?:\s*[-–]\s*\d+)?/g;
  const vues = new Set<string>();
  const sortie: ReferenceBiblique[] = [];
  let precedente: { ref: ReferenceBiblique; fin: number } | undefined;

  const retenir = (ref: ReferenceBiblique) => {
    const cle = formaterReference(ref);
    if (vues.has(cle)) return;
    vues.add(cle);
    sortie.push(ref);
  };

  for (const m of texte.matchAll(nombres)) {
    const debut = m.index ?? 0;
    // Le nom du livre ne franchit ni une virgule, ni un point-virgule, ni une
    // fin de ligne : au-delà, ce sont les mots d'une autre référence.
    const avant = texte
      .slice(0, debut)
      .split(/[,;\n]/)
      .pop()!
      .replace(/\s+$/, '');
    const mots = avant.split(/\s+/).filter(Boolean).slice(-3);

    let trouvee: ReferenceBiblique | undefined;
    for (let i = 0; i < mots.length && !trouvee; i++) {
      trouvee = analyserReference(`${mots.slice(i).join(' ')} ${m[0]}`);
    }

    if (trouvee) {
      retenir(trouvee);
      precedente = { ref: trouvee, fin: debut + m[0].length };
      continue;
    }

    // « Daniel 1 à 6 », « Actes 13-14 » : un nombre que rien ne rattache à un
    // livre, séparé du précédent par un simple tiret ou « à », continue la
    // référence d'avant. On développe la plage, un chapitre à la fois, parce
    // que c'est ainsi qu'on les relit.
    const liaison = precedente ? texte.slice(precedente.fin, debut) : '';
    const chapitre = Number(m[0]);
    if (
      precedente &&
      precedente.ref.verset === undefined &&
      /^\s*(?:[-–]|à|au|a)\s*$/i.test(liaison) &&
      Number.isInteger(chapitre) &&
      chapitre > precedente.ref.chapitre &&
      chapitre <= (trouverLivre(precedente.ref.livre)?.chapitres ?? 0)
    ) {
      for (let c = precedente.ref.chapitre + 1; c <= chapitre; c++) {
        retenir({ livre: precedente.ref.livre, chapitre: c });
      }
      precedente = {
        ref: { livre: precedente.ref.livre, chapitre },
        fin: debut + m[0].length,
      };
    }
  }
  return sortie;
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
