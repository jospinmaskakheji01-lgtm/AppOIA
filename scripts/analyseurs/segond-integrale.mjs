#!/usr/bin/env node
/**
 * Analyse la Sainte Bible — Louis Segond 1910, texte intégral.
 *
 *   node scripts/analyseurs/segond-integrale.mjs <fichier.txt> [sortie.json]
 *
 * Le PDF est d'une régularité inhabituelle, ce qui permet un découpage strict
 * plutôt qu'heuristique :
 *
 *   Genèse 1        ← un titre de chapitre occupe sa propre ligne
 *   1               ← un numéro de verset occupe sa propre ligne
 *   Au commencement, Dieu créa les cieux et la terre.
 *
 * Les cinq livres à un seul chapitre (Abdias, Philémon, 2 Jean, 3 Jean, Jude)
 * portent un titre sans numéro ; ils sont traités comme « chapitre 1 ».
 *
 * Aucune ligne n'est acceptée par ressemblance : un numéro de verset doit être
 * seul sur sa ligne et suivre immédiatement le numéro précédent. Toute rupture
 * de la suite 1, 2, 3… est signalée plutôt que corrigée — sur un texte
 * biblique, une référence fausse est pire qu'un verset manquant.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chargerTS } from '../lib/charger-ts.mjs';

const racine = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const [entree, sortieArg] = process.argv.slice(2);
if (!entree) {
  console.error('Usage : node scripts/analyseurs/segond-integrale.mjs <fichier.txt> [sortie.json]');
  process.exit(1);
}

const { trouverLivre, livresCanoniques } = await chargerTS(path.join(racine, 'src/knowledge/reference.ts'));

/** Les cinq livres dont le titre ne porte pas de numéro de chapitre. */
const UN_SEUL_CHAPITRE = new Set(['Abdias', 'Philémon', '2 Jean', '3 Jean', 'Jude']);

const lignes = fs.readFileSync(entree, 'utf8').split('\n');

const versets = [];
const anomalies = [];
let livre = null;
let chapitre = 0;
let attendu = 0;
let courant = null; // { livre, chapitre, verset, morceaux: [] }

/** Clôt le verset en cours et l'ajoute au recueil. */
function fermerVerset() {
  if (!courant) return;
  const texte = courant.morceaux.join(' ').replace(/\s+/g, ' ').trim();
  if (texte) versets.push({ ...courant, texte, morceaux: undefined });
  else anomalies.push(`${courant.livre} ${courant.chapitre}:${courant.verset} — verset vide.`);
  courant = null;
}

for (let i = 0; i < lignes.length; i++) {
  const ligne = lignes[i].trim();
  if (!ligne || ligne.startsWith('=== PAGE ')) continue;

  // Titre de chapitre : « Genèse 1 », ou le seul nom pour un livre d'un chapitre.
  const titre = ligne.match(/^(.+?)\s+(\d{1,3})$/);
  const nomSeul = UN_SEUL_CHAPITRE.has(ligne) ? ligne : null;
  const nomCandidat = nomSeul ?? (titre ? titre[1] : null);
  const trouve = nomCandidat ? trouverLivre(nomCandidat) : undefined;

  if (trouve) {
    const numero = nomSeul ? 1 : Number(titre[2]);
    // Un titre plausible mais hors des bornes du livre est du texte, pas un titre.
    if (numero >= 1 && numero <= trouve.chapitres) {
      fermerVerset();
      if (livre === trouve.nom && numero !== chapitre + 1 && numero !== chapitre) {
        anomalies.push(`${trouve.nom} : chapitre ${numero} après le chapitre ${chapitre}.`);
      }
      livre = trouve.nom;
      chapitre = numero;
      attendu = 1;
      continue;
    }
  }

  // Numéro de verset : seul sur sa ligne, et exactement le suivant attendu.
  const numeroSeul = ligne.match(/^(\d{1,3})$/);
  if (numeroSeul && livre) {
    const n = Number(numeroSeul[1]);
    if (n === attendu) {
      fermerVerset();
      courant = { livre, chapitre, verset: n, morceaux: [] };
      attendu = n + 1;
      continue;
    }
    // Un chiffre isolé qui n'est pas le verset attendu : on le garde dans le
    // texte plutôt que de sauter une référence.
    anomalies.push(`${livre} ${chapitre} : « ${n} » rencontré alors que ${attendu} était attendu.`);
  }

  if (courant) courant.morceaux.push(ligne);
}
fermerVerset();

// ————————————————————————————————————————————————————————————
// Vérification : le canon est le juge, pas l'analyseur.
// ————————————————————————————————————————————————————————————

const parLivre = new Map();
for (const v of versets) {
  if (!parLivre.has(v.livre)) parLivre.set(v.livre, new Map());
  const chapitres = parLivre.get(v.livre);
  if (!chapitres.has(v.chapitre)) chapitres.set(v.chapitre, []);
  chapitres.get(v.chapitre).push(v.verset);
}

const manquants = [];
for (const fiche of livresCanoniques) {
  const chapitres = parLivre.get(fiche.nom);
  if (!chapitres) {
    manquants.push(`${fiche.nom} : absent.`);
    continue;
  }
  if (chapitres.size !== fiche.chapitres) {
    manquants.push(`${fiche.nom} : ${chapitres.size} chapitres extraits sur ${fiche.chapitres}.`);
  }
  for (const [n, numeros] of chapitres) {
    const trous = numeros.filter((x, k) => x !== k + 1);
    if (trous.length) manquants.push(`${fiche.nom} ${n} : numérotation interrompue à ${trous[0]}.`);
  }
}

const sortie = sortieArg ?? path.join(racine, 'lsg-integrale.json');
fs.writeFileSync(
  sortie,
  JSON.stringify(
    {
      version: {
        id: 'lsg1910-integrale',
        abreviation: 'LSG',
        nom: 'Louis Segond 1910',
        langue: 'fr',
        annee: '1910',
        couverture: 'Bible entière — 66 livres',
        sourceId: 'lsg1910',
      },
      source: {
        id: 'lsg1910',
        titre: 'La Sainte Bible — version Louis Segond 1910',
        auteur: 'Louis Segond',
        annee: '1910',
        langue: 'fr',
        type: 'bible',
        abreviation: 'LSG',
        documentOrigine: path.basename(entree).replace(/\.txt$/, '.pdf'),
        ajouteLe: new Date().toISOString().slice(0, 10),
      },
      versets,
    },
    null,
    0,
  ),
  'utf8',
);

console.log(`✓ ${versets.length} versets · ${parLivre.size} livres`);
console.log(`  → ${sortie}`);
if (anomalies.length) {
  console.log(`\n${anomalies.length} anomalie(s) de découpage :`);
  for (const a of anomalies.slice(0, 25)) console.log(`  · ${a}`);
  if (anomalies.length > 25) console.log(`  … et ${anomalies.length - 25} autres.`);
}
if (manquants.length) {
  console.log(`\n${manquants.length} écart(s) au canon :`);
  for (const m of manquants.slice(0, 25)) console.log(`  · ${m}`);
  if (manquants.length > 25) console.log(`  … et ${manquants.length - 25} autres.`);
} else {
  console.log('\nLe découpage est conforme au canon : 66 livres, tous les chapitres, aucun trou.');
}
