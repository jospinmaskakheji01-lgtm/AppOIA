import { getVersion, VersetTexte, VersionBible, versetsDeLaVersion } from './bible';
import { livresCanoniques, normaliser } from './reference';
import { ReferenceBiblique } from './types';

/**
 * La concordance : où un mot apparaît dans la Bible.
 *
 * L'étude de personnages commence par « cherchez son nom dans toute la Bible
 * et notez chaque référence ». Sans concordance, cette consigne renvoie le
 * lecteur à une Bible papier ou à un autre écran — et l'étude s'arrête là.
 *
 * On ne réutilise pas la recherche plein texte de `bible.ts` : celle-ci
 * classe par pertinence et coupe aux soixante meilleurs résultats, ce qui
 * convient à une question posée, pas à un relevé qui doit être complet. Ici
 * on veut toutes les occurrences, dans l'ordre du canon, et le compte exact.
 */

export interface OccurrencesDansLivre {
  livre: string;
  rang: number;
  versets: VersetTexte[];
}

export interface Concordance {
  /** Le mot cherché, tel qu'il a été saisi. */
  mot: string;
  version: VersionBible;
  /** Nombre de versets où le mot apparaît. */
  total: number;
  livres: OccurrencesDansLivre[];
}

/**
 * Le mot doit être entier.
 *
 * Sans cette précaution, chercher « Jean » ramènerait tous les « Jeanne », et
 * une liste de passages fausse dès la deuxième étape fausse toute l'étude.
 * L'apostrophe et le trait d'union comptent pour des séparateurs : on veut
 * que « d'Israël » réponde à « Israël », et que « Jean-Baptiste » réponde à
 * « Jean » — c'est bien du même homme que le texte parle.
 */
function bornes(terme: string): RegExp {
  const echappe = terme.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  return new RegExp(`(^|[^a-z0-9])${echappe}($|[^a-z0-9])`);
}

const rangs = new Map(livresCanoniques.map((l) => [normaliser(l.nom), l.rang]));

export function concordance(mot: string, versionId: string): Concordance | undefined {
  const version = getVersion(versionId);
  if (!version) return undefined;

  const terme = normaliser(mot).replace(/\s+/g, ' ').trim();
  if (!terme) return { mot, version, total: 0, livres: [] };
  const versets = versetsDeLaVersion(versionId);

  const motif = bornes(terme);
  const parLivre = new Map<string, VersetTexte[]>();
  let total = 0;

  for (const v of versets) {
    if (!motif.test(normaliser(v.texte))) continue;
    total += 1;
    const liste = parLivre.get(v.livre);
    if (liste) liste.push(v);
    else parLivre.set(v.livre, [v]);
  }

  const livres = [...parLivre.entries()]
    .map(([livre, liste]) => ({
      livre,
      rang: rangs.get(normaliser(livre)) ?? 999,
      versets: liste.sort((a, b) => a.chapitre - b.chapitre || a.verset - b.verset),
    }))
    .sort((a, b) => a.rang - b.rang);

  return { mot, version, total, livres };
}

/**
 * La liste de passages que le relevé désigne.
 *
 * Ce n'est pas la liste des versets : on n'étudie pas une vie en lisant
 * soixante-cinq versets isolés. Quand un livre nomme le sujet à quelques
 * reprises seulement, ce sont ces versets qu'il faut lire ; quand il le nomme
 * partout, c'est le chapitre entier, et le relevé donnerait une liste illisible.
 *
 * Le seuil est à trois : au-delà, le nom court le chapitre, et le chapitre est
 * l'unité de lecture.
 */
export function passagesDuReleve(releve: Concordance): ReferenceBiblique[] {
  const sortie: ReferenceBiblique[] = [];
  for (const l of releve.livres) {
    if (l.versets.length <= 3) {
      for (const v of l.versets) {
        sortie.push({ livre: l.livre, chapitre: v.chapitre, verset: v.verset });
      }
      continue;
    }
    const chapitres = [...new Set(l.versets.map((v) => v.chapitre))].sort((a, b) => a - b);
    for (const c of chapitres) sortie.push({ livre: l.livre, chapitre: c });
  }
  return sortie;
}
