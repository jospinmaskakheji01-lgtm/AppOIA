#!/usr/bin/env node
/**
 * Importe une version biblique dans l'application.
 *
 *   node scripts/importer-version.mjs <fichier.json> [--forcer]
 *
 * Format attendu — voir docs/BASE-DE-CONNAISSANCES.md :
 * {
 *   "version": { "id", "abreviation", "nom", "langue", "annee",
 *                "couverture", "sourceId", "provenance"? },
 *   "source":  { ...fiche source complète (facultatif : déduite de la version) },
 *   "versets": [ { "livre", "chapitre", "verset", "texte" }, ... ]
 * }
 *
 * Le script valide, puis écrit src/data/versions/<id>.ts et rappelle la ligne
 * à ajouter dans src/knowledge/bootstrap.ts.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chargerTS } from './lib/charger-ts.mjs';

const racine = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const [fichier, ...options] = process.argv.slice(2);
const forcer = options.includes('--forcer');

if (!fichier) {
  console.error('Usage : node scripts/importer-version.mjs <fichier.json> [--forcer]');
  process.exit(1);
}

function echapper(texte) {
  return String(texte).replace(/\\/g, '\\\\').replace(/`/g, '\\`').replace(/\$\{/g, '\\${');
}

const { trouverLivre } = await chargerTS(path.join(racine, 'src/knowledge/reference.ts'));

const brut = JSON.parse(fs.readFileSync(fichier, 'utf8'));
const version = brut.version ?? {};
const versets = brut.versets ?? [];

const erreurs = [];
const avertissements = [];

for (const champ of ['id', 'abreviation', 'nom', 'langue', 'sourceId']) {
  if (!version[champ]) erreurs.push(`version.${champ} est obligatoire.`);
}
if (!Array.isArray(versets) || versets.length === 0) erreurs.push('Aucun verset fourni.');

const livresInconnus = new Set();
const doublons = new Set();
const vus = new Set();
let horsPlage = 0;

for (const [i, v] of versets.entries()) {
  if (!v || typeof v.texte !== 'string' || !v.texte.trim()) {
    erreurs.push(`Verset ${i} : texte manquant.`);
    continue;
  }
  const livre = trouverLivre(String(v.livre ?? ''));
  if (!livre) {
    livresInconnus.add(String(v.livre));
    continue;
  }
  const chapitre = Number(v.chapitre);
  const numero = Number(v.verset);
  if (!Number.isInteger(chapitre) || chapitre < 1 || chapitre > livre.chapitres) {
    horsPlage += 1;
    continue;
  }
  // Le verset 0 est la suscription d'un psaume — « Au chef de chœur. Psaume de
  // David. » —, que la Segond laisse hors numérotation et que d'autres versions
  // comptent comme premier verset. La garder sous le numéro 0 conserve le texte
  // sans décaler la référence de tous les versets suivants.
  const suscription = numero === 0 && livre.nom === 'Psaumes';
  if (!Number.isInteger(numero) || (numero < 1 && !suscription)) {
    horsPlage += 1;
    continue;
  }
  const cle = `${livre.nom}|${chapitre}|${numero}`;
  if (vus.has(cle)) doublons.add(cle);
  vus.add(cle);
}

if (livresInconnus.size) {
  erreurs.push(
    `Livres non reconnus : ${[...livresInconnus].slice(0, 10).join(', ')}${livresInconnus.size > 10 ? '…' : ''}. Utilisez les noms ou abréviations du canon.`,
  );
}
if (horsPlage) erreurs.push(`${horsPlage} verset(s) hors plage de chapitre ou de numérotation.`);
if (doublons.size) {
  avertissements.push(`${doublons.size} référence(s) en double ; la dernière occurrence l'emporte.`);
}

console.log(`\nVersion   ${version.nom ?? '?'} (${version.abreviation ?? '?'})`);
console.log(`Versets   ${versets.length}`);
console.log(`Livres    ${new Set(versets.map((v) => trouverLivre(String(v.livre ?? ''))?.nom).filter(Boolean)).size}`);


for (const a of avertissements) console.log(`\n  ⚠  ${a}`);
for (const e of erreurs) console.log(`\n  ✕  ${e}`);

if (erreurs.length && !forcer) {
  console.log('\nImport interrompu. Corrigez les erreurs, ou relancez avec --forcer.\n');
  process.exit(1);
}

const chemin = path.join(racine, 'src/data/versions', `${version.id}.ts`);
const lignes = versets
  .map(
    (v) =>
      `  { livre: \`${echapper(v.livre)}\`, chapitre: ${Number(v.chapitre)}, verset: ${Number(v.verset)}` +
        // Certaines versions rendent plusieurs versets d'un seul tenant ; la
        // portée du bloc doit être conservée pour qu'on le retrouve par la
        // référence de n'importe lequel des versets qu'il couvre.
        (Number(v.versetFin) > Number(v.verset) ? `, versetFin: ${Number(v.versetFin)}` : '') +
        `, texte: \`${echapper(v.texte)}\` },`,
  )
  .join('\n');

const contenu = `/**
 * ${version.nom} — version importée.
 * Généré par scripts/importer-version.mjs à partir de ${path.basename(fichier)}.
 */

import { ModuleVersion, VersetTexte, VersionBible } from '../../knowledge/bible';

export const version${version.id.replace(/[^A-Za-z0-9]/g, '')}: VersionBible = ${JSON.stringify(version, null, 2)
  .split('\n')
  .map((l, i) => (i === 0 ? l : `${l}`))
  .join('\n')};

const versets: VersetTexte[] = [
${lignes}
];

export const module${version.id.replace(/[^A-Za-z0-9]/g, '')}: ModuleVersion = {
  version: version${version.id.replace(/[^A-Za-z0-9]/g, '')},
  versets,
};
`;

fs.mkdirSync(path.dirname(chemin), { recursive: true });
fs.writeFileSync(chemin, contenu);

const nomExport = `module${version.id.replace(/[^A-Za-z0-9]/g, '')}`;
console.log(`\n✓ Écrit ${path.relative(racine, chemin)}`);
console.log(`\nPour l'activer, dans src/knowledge/bootstrap.ts :`);
console.log(`  import { ${nomExport} } from '../data/versions/${version.id}';`);
console.log(`  const modulesVersions: ModuleVersion[] = [moduleLSG, ${nomExport}];`);
console.log(`\nPuis déclarez la source dans src/data/sources.ts si elle n'y est pas.\n`);
