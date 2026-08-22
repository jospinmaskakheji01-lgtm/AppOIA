#!/usr/bin/env node
/**
 * Analyse « Parole Vivante » d'Alfred Kuen — transposition du Nouveau Testament.
 *
 *   node scripts/analyseurs/parole-vivante.mjs <fichier.txt> [sortie.json]
 *
 * Le PDF place les titres de chapitre tantôt sur leur propre ligne, tantôt
 * dans le fil du texte, à la suite du verset précédent. Plutôt que de traiter
 * deux cas, on recolle tout le document en une seule chaîne : les deux formes
 * s'y présentent alors identiquement, sous la forme « Livre N 1 … ».
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chargerTS } from '../lib/charger-ts.mjs';

const racine = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const [entree, sortieArg] = process.argv.slice(2);
if (!entree) {
  console.error('Usage : node scripts/analyseurs/parole-vivante.mjs <fichier.txt> [sortie.json]');
  process.exit(1);
}

const { trouverLivre } = await chargerTS(path.join(racine, 'src/knowledge/reference.ts'));

/** Graphies rencontrées dans le PDF, y compris tronquées ou désaccentuées. */
const GRAPHIES = {
  Matthieu: 'Matthieu',
  Marc: 'Marc',
  Luc: 'Luc',
  Jean: 'Jean',
  Actes: 'Actes',
  Romains: 'Romains',
  '1 Corinthiens': '1 Corinthiens',
  '2 Corinthiens': '2 Corinthiens',
  Galates: 'Galates',
  Ephésiens: 'Éphésiens',
  Éphésiens: 'Éphésiens',
  Philippiens: 'Philippiens',
  Colossiens: 'Colossiens',
  '1 Thessalonic': '1 Thessaloniciens',
  '2 Thessalonic': '2 Thessaloniciens',
  '1 Thessaloniciens': '1 Thessaloniciens',
  '2 Thessaloniciens': '2 Thessaloniciens',
  '1 Timothée': '1 Timothée',
  '2 Timothée': '2 Timothée',
  Tite: 'Tite',
  Philémon: 'Philémon',
  Hébreux: 'Hébreux',
  Jacques: 'Jacques',
  '1 Pierre': '1 Pierre',
  '2 Pierre': '2 Pierre',
  '1 Jean': '1 Jean',
  '2 Jean': '2 Jean',
  '3 Jean': '3 Jean',
  Jude: 'Jude',
  Apocalypse: 'Apocalypse',
};

// Les graphies les plus longues d'abord, pour que « 1 Jean » l'emporte sur « Jean ».
const noms = Object.keys(GRAPHIES).sort((a, b) => b.length - a.length);
const motifTitre = new RegExp(
  `(?:^|[^\\p{L}\\p{N}])(${noms.map((n) => n.replace(/[.*+?^${}()|[\\]\\\\]/g, '\\$&')).join('|')}) (\\d{1,3})(?= 1[\\s.,;:!?–—])`,
  'gu',
);

const brut = fs
  .readFileSync(entree, 'utf8')
  .split('\n')
  .filter((l) => !/^=== PAGE \d+ ===$/.test(l.trim()))
  .join(' ')
  // Recoller les mots coupés en fin de ligne par la mise en page du PDF.
  .replace(/(\p{L})-\s+(\p{L})/gu, '$1$2')
  .replace(/\s+/g, ' ');

/** Emplacements des titres de chapitre dans le texte recollé. */
const titres = [];
for (const m of brut.matchAll(motifTitre)) {
  const nomCanonique = GRAPHIES[m[1]];
  const livre = trouverLivre(nomCanonique);
  const chapitre = Number(m[2]);
  if (!livre || chapitre < 1 || chapitre > livre.chapitres) continue;
  titres.push({
    livre: livre.nom,
    chapitre,
    debut: m.index + m[0].length,
  });
}

/**
 * Découpe le corps d'un chapitre en versets.
 * On avance verset par verset : le numéro 7 n'est cherché qu'après le 6, de
 * sorte qu'un nombre cité dans la phrase ne soit jamais pris pour un numéro.
 */
function decouper(texte) {
  const versets = [];
  let position = 0;
  let attendu = 1;
  let debutCourant = null;

  for (;;) {
    const motif = new RegExp(
      `(?:^|[\\s(«"’—–-])(${attendu})(?=[\\s.,;:!?»]|$)`,
      'g',
    );
    motif.lastIndex = position;
    const m = motif.exec(texte);
    if (!m) break;

    const debutNumero = m.index + m[0].length - String(attendu).length;
    if (debutCourant !== null) {
      versets.push({ n: attendu - 1, t: texte.slice(debutCourant, debutNumero) });
    }
    debutCourant = debutNumero + String(attendu).length;
    position = debutCourant;
    attendu += 1;
  }

  if (debutCourant !== null) versets.push({ n: attendu - 1, t: texte.slice(debutCourant) });
  return versets;
}

/** Le dernier passage l'emporte : le PDF reprend certaines sections deux fois. */
const parCle = new Map();
for (let i = 0; i < titres.length; i++) {
  const titre = titres[i];
  const fin = i + 1 < titres.length ? titres[i + 1].debut : brut.length;
  const corps = brut.slice(titre.debut, fin);
  for (const v of decouper(corps)) {
    const texte = v.t.replace(/\s+/g, ' ').trim();
    if (!texte) continue;
    parCle.set(`${titre.livre}|${titre.chapitre}|${v.n}`, {
      livre: titre.livre,
      chapitre: titre.chapitre,
      verset: v.n,
      texte,
    });
  }
}

const versets = [...parCle.values()];
const livresTrouves = [...new Set(versets.map((v) => v.livre))];
const sortie = sortieArg ?? path.join(racine, 'parole-vivante.json');

fs.writeFileSync(
  sortie,
  JSON.stringify(
    {
      version: {
        id: 'parole-vivante',
        abreviation: 'PV',
        nom: 'Parole Vivante — Nouveau Testament',
        langue: 'fr',
        annee: '1976',
        couverture: 'partielle',
        sourceId: 'bible-parole-vivante',
      },
      versets,
    },
    null,
    1,
  ),
);

const tropLongs = versets.filter((v) => v.texte.length > 1200);
console.log(`\nTitres de chapitre  ${titres.length}`);
console.log(`Livres              ${livresTrouves.length} / 27`);
console.log(`Versets             ${versets.length}`);
console.log(`Versets > 1200 car. ${tropLongs.length}${tropLongs.length ? ' — ' + tropLongs.slice(0, 4).map((v) => `${v.livre} ${v.chapitre}:${v.verset}`).join(', ') : ''}`);
console.log(`\n→ ${sortie}\n`);
