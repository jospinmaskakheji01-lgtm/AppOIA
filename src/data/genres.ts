/**
 * Genre littéraire de chaque livre biblique.
 *
 * Le genre conditionne l'interprétation : un proverbe ne se lit pas comme une
 * épître, ni un récit comme une prophétie. L'application s'en sert pour
 * proposer, au temps de l'Interprétation, les principes qui valent pour le
 * texte réellement étudié.
 *
 * Certains livres relèvent de plusieurs genres — les évangiles contiennent des
 * paraboles, les prophètes des récits. Le genre indiqué est le dominant ; les
 * conseils des autres genres restent consultables.
 */

import { GenreLitteraire } from '../knowledge/types';

export const genresParLivre: Record<string, GenreLitteraire> = {
  Genèse: 'recit',
  Exode: 'recit',
  Lévitique: 'loi',
  Nombres: 'recit',
  Deutéronome: 'loi',
  Josué: 'recit',
  Juges: 'recit',
  Ruth: 'recit',
  '1 Samuel': 'recit',
  '2 Samuel': 'recit',
  '1 Rois': 'recit',
  '2 Rois': 'recit',
  '1 Chroniques': 'recit',
  '2 Chroniques': 'recit',
  Esdras: 'recit',
  Néhémie: 'recit',
  Esther: 'recit',
  Job: 'sagesse',
  Psaumes: 'psaume',
  Proverbes: 'sagesse',
  Ecclésiaste: 'sagesse',
  'Cantique des cantiques': 'sagesse',
  Ésaïe: 'prophetie',
  Jérémie: 'prophetie',
  Lamentations: 'psaume',
  Ézéchiel: 'prophetie',
  Daniel: 'prophetie',
  Osée: 'prophetie',
  Joël: 'prophetie',
  Amos: 'prophetie',
  Abdias: 'prophetie',
  Jonas: 'recit',
  Michée: 'prophetie',
  Nahum: 'prophetie',
  Habacuc: 'prophetie',
  Sophonie: 'prophetie',
  Aggée: 'prophetie',
  Zacharie: 'prophetie',
  Malachie: 'prophetie',

  // Livres deutérocanoniques. Les récits de Tobie et de Judith se lisent comme
  // les récits de l'Ancien Testament ; la Sagesse et le Siracide relèvent de la
  // littérature de sagesse ; Baruch et la Lettre de Jérémie de la prophétie.
  Tobie: 'recit',
  Judith: 'recit',
  'Esther grec': 'recit',
  '1 Maccabées': 'recit',
  '2 Maccabées': 'recit',
  Sagesse: 'sagesse',
  Siracide: 'sagesse',
  Baruch: 'prophetie',
  'Lettre de Jérémie': 'prophetie',
  Matthieu: 'evangile',
  Marc: 'evangile',
  Luc: 'evangile',
  Jean: 'evangile',
  Actes: 'actes',
  Romains: 'epitre',
  '1 Corinthiens': 'epitre',
  '2 Corinthiens': 'epitre',
  Galates: 'epitre',
  Éphésiens: 'epitre',
  Philippiens: 'epitre',
  Colossiens: 'epitre',
  '1 Thessaloniciens': 'epitre',
  '2 Thessaloniciens': 'epitre',
  '1 Timothée': 'epitre',
  '2 Timothée': 'epitre',
  Tite: 'epitre',
  Philémon: 'epitre',
  Hébreux: 'epitre',
  Jacques: 'epitre',
  '1 Pierre': 'epitre',
  '2 Pierre': 'epitre',
  '1 Jean': 'epitre',
  '2 Jean': 'epitre',
  '3 Jean': 'epitre',
  Jude: 'epitre',
  Apocalypse: 'apocalypse',
};

export const nomsGenres: Record<GenreLitteraire, string> = {
  recit: 'Récit',
  loi: 'Loi',
  psaume: 'Psaume',
  sagesse: 'Sagesse',
  prophetie: 'Prophétie',
  evangile: 'Évangile',
  parabole: 'Parabole',
  actes: 'Actes des apôtres',
  epitre: 'Épître',
  apocalypse: 'Apocalypse',
};

export function genreDuLivre(livre: string): GenreLitteraire | undefined {
  return genresParLivre[livre];
}
