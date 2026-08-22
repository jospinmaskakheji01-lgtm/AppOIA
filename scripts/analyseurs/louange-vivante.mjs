#!/usr/bin/env node
/**
 * Analyse « Louange vivante » d'Alfred Kuen — transcription dynamique des Psaumes.
 *
 *   node scripts/analyseurs/louange-vivante.mjs <fichier.txt> [sortie.json]
 *
 * Le PDF mêle deux séries de nombres, chacune seule sur sa ligne : les numéros
 * de versets et les appels de note. Rien ne les distingue typographiquement une
 * fois le texte aplati :
 *
 *   1
 *   Heureux, bienheureux est l'homme
 *   Qui ne cherche pas conseil auprès des gens en révolte
 *   22            ← appel de note, pas le verset 22
 *   ,
 *
 * Ce qui les sépare, c'est leur loi de progression. Les versets repartent de 1
 * à chaque psaume et avancent de un ; les appels de note courent d'un bout à
 * l'autre du livre sans jamais reculer. Un nombre n'est donc lu comme verset
 * que s'il est exactement celui qu'on attend ; tout le reste est un appel de
 * note, et disparaît du texte.
 *
 * Le résultat est vérifié contre la Segond installée dans l'application : le
 * compte des versets de chaque psaume doit s'y retrouver.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chargerTS } from '../lib/charger-ts.mjs';

const racine = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const [entree, sortieArg] = process.argv.slice(2);
if (!entree) {
  console.error('Usage : node scripts/analyseurs/louange-vivante.mjs <fichier.txt> [sortie.json]');
  process.exit(1);
}

/**
 * La Segond installée dans l'application sert deux fois : de borne pendant
 * l'analyse — aucun psaume ne peut avoir beaucoup plus de versets qu'elle n'en
 * compte — puis de contrôle une fois l'analyse terminée.
 */
const { modulelsg1910 } = await chargerTS(path.join(racine, 'src/data/versions/lsg1910.ts'));
const attenduParPsaume = new Map();
for (const v of modulelsg1910.versets) {
  if (v.livre !== 'Psaumes') continue;
  attenduParPsaume.set(v.chapitre, Math.max(attenduParPsaume.get(v.chapitre) ?? 0, v.verset));
}

/** Kuen numérote le titre ; il peut donc dépasser la Segond de deux versets. */
function borne(psaume) {
  return (attenduParPsaume.get(psaume) ?? 0) + 2;
}

const lignes = fs.readFileSync(entree, 'utf8').split('\n');

const versets = [];
const ambigus = [];
let psaume = 0;
let attendu = 0;
let noteMax = 0;
let courant = null;

function fermer() {
  if (!courant) return;
  const texte = courant.morceaux
    .join(' ')
    .replace(/\s+([,.;:!?»])/g, '$1')
    .replace(/([«])\s+/g, '$1')
    .replace(/\s+/g, ' ')
    .trim();
  if (texte) versets.push({ livre: 'Psaumes', chapitre: courant.psaume, verset: courant.verset, texte });
  courant = null;
}

for (const brute of lignes) {
  const ligne = brute.trim();
  if (!ligne || ligne.startsWith('=== PAGE ')) continue;

  const titre = ligne.match(/^Psaume\s+(\d{1,3})$/);
  if (titre) {
    fermer();
    psaume = Number(titre[1]);
    attendu = 1;
    continue;
  }

  // « ::::: » sépare les sections du livre : il clôt le verset en cours.
  if (/^:{3,}$/.test(ligne)) {
    fermer();
    continue;
  }

  // Le psautier est suivi d'un index qui reprend chaque psaume et ses versets
  // (« Psaume 1 • 1 2 3 4 5 6 7 »). Sans cette borne, le dernier verset du
  // livre absorberait tout l'index.
  if (/^Psaume\s+\d{1,3}\s+•/.test(ligne)) {
    fermer();
    psaume = 0;
    continue;
  }

  if (!psaume) continue;

  // Un numéro seul sur sa ligne, ou glissé dans le fil du texte : dans les deux
  // cas, il n'ouvre un verset que s'il est exactement celui qu'on attend.
  let reste = ligne;
  for (;;) {
    const seul = reste.match(/^(\d{1,4})$/);
    if (seul) {
      const n = Number(seul[1]);
      if (n === attendu && n <= borne(psaume)) {
        if (n === noteMax + 1) ambigus.push(`Psaume ${psaume} : ${n} — verset ou appel de note ?`);
        fermer();
        courant = { psaume, verset: n, morceaux: [] };
        attendu = n + 1;
      } else {
        noteMax = Math.max(noteMax, n);
      }
      reste = '';
      break;
    }

    if (attendu > borne(psaume)) break;
    const dedans = reste.match(new RegExp(`^(.*?)(?:^|\\s)${attendu}(?=\\s|$)(.*)$`));
    if (!dedans) break;
    if (courant) courant.morceaux.push(dedans[1]);
    fermer();
    courant = { psaume, verset: attendu, morceaux: [] };
    attendu += 1;
    reste = dedans[2].trim();
  }

  if (reste && courant) courant.morceaux.push(reste);
}
fermer();

// ————————————————————————————————————————————————————————————
// Vérification contre la Segond déjà installée
// ————————————————————————————————————————————————————————————

/**
 * Kuen numérote le titre du psaume comme verset 1 ; la Segond le laisse hors
 * numérotation. Le décalage est donc d'un verset sur les psaumes qui portent un
 * titre — et comparer « Psaume 22:1 » d'une version à l'autre donnerait deux
 * textes sans rapport.
 *
 * On réaligne sur la Segond, qui est la numérotation de toute l'application :
 * là où Kuen compte un verset de plus, tout est décalé d'un rang et le titre
 * devient le verset 0. Rien n'est perdu, et les deux versions se répondent.
 */
const maxKuen = new Map();
for (const v of versets) maxKuen.set(v.chapitre, Math.max(maxKuen.get(v.chapitre) ?? 0, v.verset));

const decalage = new Map();
for (const [psaume, max] of maxKuen) {
  const d = max - (attenduParPsaume.get(psaume) ?? 0);
  if (d === 1 || d === 2) decalage.set(psaume, d);
}
for (const v of versets) v.verset -= decalage.get(v.chapitre) ?? 0;

// Un titre sur deux lignes donnait deux versets : ils redeviennent un seul.
const titres = new Map();
for (const v of versets) {
  if (v.verset > 0) continue;
  titres.set(v.chapitre, [...(titres.get(v.chapitre) ?? []), v.texte]);
}
const sansTitres = versets.filter((v) => v.verset > 0);
for (const [psaume, textes] of titres) {
  sansTitres.push({ livre: 'Psaumes', chapitre: psaume, verset: 0, texte: textes.join(' ') });
}
sansTitres.sort((a, b) => a.chapitre - b.chapitre || a.verset - b.verset);
versets.length = 0;
versets.push(...sansTitres);
const realignes = decalage.size;

const obtenu = new Map();
for (const v of versets) obtenu.set(v.chapitre, Math.max(obtenu.get(v.chapitre) ?? 0, v.verset));

const ecarts = [];
for (let n = 1; n <= 150; n++) {
  const a = attenduParPsaume.get(n) ?? 0;
  const o = obtenu.get(n) ?? 0;
  if (o === 0) ecarts.push(`Psaume ${n} : absent.`);
  else if (o !== a) ecarts.push(`Psaume ${n} : ${o} versets, la Segond en compte ${a}.`);
}

const sortie = sortieArg ?? path.join(racine, 'louange-vivante.json');
fs.writeFileSync(
  sortie,
  JSON.stringify(
    {
      version: {
        id: 'louange-vivante',
        abreviation: 'LV',
        nom: 'Louange vivante — les Psaumes',
        langue: 'fr',
        annee: '2003',
        couverture: 'partielle',
        sourceId: 'bible-louange-vivante',
      },
      source: {
        id: 'bible-louange-vivante',
        titre: 'Louange vivante — transcription dynamique des Psaumes',
        auteur: 'Alfred Kuen',
        editeur: 'BLF Europe',
        annee: '2003',
        langue: 'fr',
        type: 'bible',
        abreviation: 'LV',
        documentOrigine: path.basename(entree).replace(/\.txt$/, '.pdf'),
        noteProvenance:
          'Transcription dynamique : Kuen rend le mouvement du poème plutôt que le mot à mot. À lire à côté d’une version littérale, non à sa place.',
        ajouteLe: new Date().toISOString().slice(0, 10),
      },
      versets,
    },
    null,
    0,
  ),
  'utf8',
);

console.log(`✓ ${versets.length} versets · ${obtenu.size} psaumes`);
console.log(`  ${realignes} psaume(s) réalignés sur la numérotation de la Segond (titre en verset 0).`);
console.log(`  → ${sortie}`);
if (ambigus.length) console.log(`\n${ambigus.length} numéro(s) indécidables (verset ou note).`);
if (ecarts.length) {
  console.log(`\n${ecarts.length} écart(s) au compte de la Segond :`);
  for (const e of ecarts.slice(0, 20)) console.log(`  · ${e}`);
  if (ecarts.length > 20) console.log(`  … et ${ecarts.length - 20} autres.`);
} else {
  console.log('\nLes 150 psaumes ont le compte de versets de la Segond.');
}
