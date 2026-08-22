/**
 * Version Louis Segond 1910, dérivée du corpus embarqué.
 *
 * La couverture est partielle : seuls les passages présents dans
 * `src/data/passages.ts` sont installés. Pour installer une version complète,
 * voir `docs/BASE-DE-CONNAISSANCES.md` et `scripts/importer-version.mjs`.
 */

import { ModuleVersion, VersetTexte, VersionBible } from '../../knowledge/bible';
import { passages } from '../passages';
import { SOURCE_LSG } from '../sources';

export const versionLSG: VersionBible = {
  id: 'lsg1910',
  abreviation: 'LSG',
  nom: 'Louis Segond 1910',
  langue: 'fr',
  annee: '1910',
  droits: 'domaine-public',
  noteDroits: `Domaine public.`,
  couverture: 'partielle',
  sourceId: SOURCE_LSG,
};

/** Extrait le numéro de chapitre d'une référence du corpus. */
function chapitreDe(reference: string): number | undefined {
  const m = reference.match(/\s(\d+)(?:\s*[:.]|\s*$)/);
  return m ? Number(m[1]) : undefined;
}

function construireVersets(): VersetTexte[] {
  const sortie: VersetTexte[] = [];
  for (const passage of passages) {
    const chapitre = chapitreDe(passage.reference);
    if (chapitre === undefined) continue;
    for (const v of passage.verses) {
      sortie.push({ livre: passage.book, chapitre, verset: v.n, texte: v.t });
    }
  }
  return sortie;
}

export const moduleLSG: ModuleVersion = {
  version: versionLSG,
  versets: construireVersets(),
};
