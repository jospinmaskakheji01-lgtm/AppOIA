/**
 * Version de test — version importée.
 * Généré par scripts/importer-version.mjs à partir de exemple-version.json.
 */

import { ModuleVersion, VersetTexte, VersionBible } from '../../knowledge/bible';

export const versiontestfr: VersionBible = {
  "id": "testfr",
  "abreviation": "TST",
  "nom": "Version de test",
  "langue": "fr",
  "annee": "2026",
  "couverture": "partielle",
  "sourceId": "bible-test",
  "provenance": "domaine-public"
};

const versets: VersetTexte[] = [
  { livre: `Jean`, chapitre: 3, verset: 16, texte: `Oui, Dieu a tellement aimé le monde qu'il a donné son Fils unique.` },
  { livre: `Jn`, chapitre: 3, verset: 17, texte: `Car Dieu n'a pas envoyé son Fils pour condamner le monde.` },
  { livre: `Ps`, chapitre: 23, verset: 1, texte: `Le Seigneur est mon berger, je ne manque de rien.` },
];

export const moduletestfr: ModuleVersion = {
  version: versiontestfr,
  versets,
};
