#!/usr/bin/env node
/**
 * Découpe les plans de lecture en journées.
 *
 *   node scripts/generer-plans-lecture.mjs
 *
 * Un plan de lecture est décrit par deux choses : les livres qu'il parcourt et
 * le nombre de jours qu'il dure. Le découpage, lui, ne se décide pas à la main :
 * il est calculé ici, puis écrit dans src/data/plans-lecture-jours.ts.
 *
 * Deux principes.
 *
 * D'abord, la charge des journées est pesée en versets, pas en chapitres. Un
 * plan qui donnerait « trois chapitres par jour » ferait lire 176 versets le
 * jour du Psaume 119 et 2 versets celui du Psaume 117. En répartissant sur le
 * nombre de versets, les journées demandent à peu près le même temps.
 *
 * Ensuite, on ne coupe un chapitre que lorsqu'il le faut vraiment. Tant que le
 * plan a moins de jours que de chapitres, chaque journée reçoit des chapitres
 * entiers, et les coupures tombent aux frontières les plus proches de la charge
 * visée. Quand le plan a plus de jours que de chapitres — Ecclésiaste en
 * quatorze jours pour douze chapitres — il faut bien diviser ; on divise alors
 * les chapitres les plus longs, autant de fois qu'il manque de journées, et on
 * laisse les autres entiers. Une journée reste ainsi une unité qu'on peut
 * méditer, plutôt qu'un fragment qui commence au milieu d'une phrase.
 *
 * Les chapitres retenus sont ceux que la Segond installée contient réellement,
 * et non ceux que le canon annonce : une journée ne peut pas renvoyer à un texte
 * que l'application serait incapable d'afficher.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chargerTS } from './lib/charger-ts.mjs';

const racine = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

const { modulelsg1910 } = await chargerTS(path.join(racine, 'src/data/versions/lsg1910.ts'));
const { livresCanoniques } = await chargerTS(path.join(racine, 'src/knowledge/reference.ts'));

/** Les chapitres réellement lisibles, dans l'ordre canonique, avec leur poids. */
const versetsParChapitre = new Map();
for (const v of modulelsg1910.versets) {
  const cle = `${v.livre}|${v.chapitre}`;
  versetsParChapitre.set(cle, Math.max(versetsParChapitre.get(cle) ?? 0, v.verset));
}

const rangDuLivre = new Map(livresCanoniques.map((l) => [l.nom, l.rang]));

function chapitresDe(livre) {
  const sortie = [];
  for (const [cle, nb] of versetsParChapitre) {
    const [nom, chapitre] = cle.split('|');
    if (nom === livre) sortie.push({ livre, chapitre: Number(chapitre), versets: nb });
  }
  return sortie.sort((a, b) => a.chapitre - b.chapitre);
}

function corpus(livres) {
  return livres
    .slice()
    .sort((a, b) => (rangDuLivre.get(a) ?? 0) - (rangDuLivre.get(b) ?? 0))
    .flatMap(chapitresDe);
}

const nomsPar = (predicat) =>
  livresCanoniques.filter(predicat).map((l) => l.nom);

/** Les 66 livres reçus par toutes les Églises : les plans de lecture s'y tiennent. */
const ANCIEN = nomsPar((l) => l.testament === 'ancien');
const NOUVEAU = nomsPar((l) => l.testament === 'nouveau');
const entre = (premier, dernier) =>
  NOUVEAU.slice(NOUVEAU.indexOf(premier), NOUVEAU.indexOf(dernier) + 1);

// ————————————————————————————————————————————————————————————
// Découpage
// ————————————————————————————————————————————————————————————

/** Journées faites de chapitres entiers, aux frontières les plus proches de la charge visée. */
function parChapitres(chapitres, jours) {
  const cumul = [0];
  for (const c of chapitres) cumul.push(cumul[cumul.length - 1] + c.versets);
  const total = cumul[cumul.length - 1];

  const sortie = [];
  let pris = 0;
  for (let jour = 1; jour <= jours; jour++) {
    const restants = jours - jour;
    const cible = (jour * total) / jours;
    let i = pris + 1;
    while (
      i < chapitres.length - restants &&
      Math.abs(cumul[i + 1] - cible) < Math.abs(cumul[i] - cible)
    ) {
      i += 1;
    }
    sortie.push(chapitres.slice(pris, i));
    pris = i;
  }
  return sortie;
}

/**
 * Journées obtenues en divisant les chapitres les plus longs.
 *
 * Le recours quand il y a plus de jours que de chapitres. Plutôt que de
 * redistribuer tout le corpus au verset près — ce qui ferait commencer une
 * journée à « Ecclésiaste 1:17 » et couperait le récit de la Pentecôte en son
 * milieu — on ne divise que ce qu'il faut : le chapitre dont chaque part est
 * encore la plus lourde, autant de fois qu'il manque de journées. Tous les
 * autres restent entiers.
 */
function parChapitresDivises(chapitres, jours) {
  const parts = chapitres.map(() => 1);
  for (let manquantes = jours - chapitres.length; manquantes > 0; manquantes--) {
    let choisi = -1;
    for (let i = 0; i < chapitres.length; i++) {
      // Un chapitre ne se divise pas en plus de parts qu'il n'a de versets.
      if (parts[i] >= chapitres[i].versets) continue;
      if (
        choisi < 0 ||
        chapitres[i].versets / parts[i] > chapitres[choisi].versets / parts[choisi]
      ) {
        choisi = i;
      }
    }
    if (choisi < 0) break;
    parts[choisi] += 1;
  }

  const sortie = [];
  chapitres.forEach((c, i) => {
    for (let part = 0; part < parts[i]; part++) {
      sortie.push([
        {
          livre: c.livre,
          chapitre: c.chapitre,
          premierVerset: Math.round((part * c.versets) / parts[i]) + 1,
          dernierVerset: Math.round(((part + 1) * c.versets) / parts[i]),
          versetsDuChapitre: c.versets,
        },
      ]);
    }
  });
  return sortie;
}

/**
 * Regroupe une journée en portions : des chapitres consécutifs d'un même livre
 * n'ont pas à être énumérés un par un, « Genèse 1-3 » suffit et se lit mieux.
 */
function enPortions(journee) {
  const portions = [];
  for (const bloc of journee) {
    const partiel =
      bloc.premierVerset !== undefined &&
      (bloc.premierVerset > 1 || bloc.dernierVerset < bloc.versetsDuChapitre);
    const precedente = portions[portions.length - 1];
    const prolonge =
      precedente &&
      !partiel &&
      precedente.versetFin === undefined &&
      precedente.livre === bloc.livre &&
      (precedente.chapitreFin ?? precedente.chapitre) === bloc.chapitre - 1;

    if (prolonge) {
      precedente.chapitreFin = bloc.chapitre;
      continue;
    }
    const portion = { livre: bloc.livre, chapitre: bloc.chapitre };
    // Une portion partielle porte toujours ses deux bornes : « Actes 7:31-60 »
    // se lit, « Actes 7:31 » suivi de rien laisserait le lecteur deviner où
    // s'arrêter.
    if (partiel) {
      portion.verset = bloc.premierVerset;
      portion.versetFin = bloc.dernierVerset;
    }
    portions.push(portion);
  }
  return portions;
}

function decouper(livres, jours) {
  const chapitres = corpus(livres);
  if (chapitres.length === 0) throw new Error(`Aucun chapitre pour ${livres.join(', ')}`);
  const journees =
    jours <= chapitres.length
      ? parChapitres(chapitres, jours)
      : parChapitresDivises(chapitres, jours);
  return journees.map(enPortions);
}

// ————————————————————————————————————————————————————————————
// Les plans
// ————————————————————————————————————————————————————————————

const PLANS = [
  { id: 'lecture-nt-90', jours: 90, livres: NOUVEAU },
  { id: 'lecture-paul-90', jours: 90, livres: entre('Romains', 'Philémon') },
  { id: 'lecture-hebreux-jude-30', jours: 30, livres: ['Hébreux', 'Jacques', '1 Pierre', '2 Pierre', 'Jude'] },
  { id: 'lecture-at-90', jours: 90, livres: ANCIEN },
  { id: 'lecture-actes-30', jours: 30, livres: ['Actes'] },
  { id: 'lecture-bible-365', jours: 365, livres: [...ANCIEN, ...NOUVEAU] },
  { id: 'lecture-apotres-90', jours: 90, livres: entre('Romains', 'Jude') },
  { id: 'lecture-proverbes-31', jours: 31, livres: ['Proverbes'] },
  { id: 'lecture-jean-60', jours: 60, livres: ['Jean', '1 Jean', '2 Jean', '3 Jean', 'Apocalypse'] },
  { id: 'lecture-luc-actes-60', jours: 60, livres: ['Luc', 'Actes'] },
  { id: 'lecture-evangiles-90', jours: 90, livres: ['Matthieu', 'Marc', 'Luc', 'Jean'] },
  { id: 'lecture-marc-pierre-30', jours: 30, livres: ['Marc', '1 Pierre', '2 Pierre'] },
  { id: 'lecture-ecclesiaste-14', jours: 14, livres: ['Ecclésiaste'] },
  { id: 'lecture-job-42', jours: 42, livres: ['Job'] },
];

const resultat = {};
const rapport = [];
for (const plan of PLANS) {
  const journees = decouper(plan.livres, plan.jours);
  resultat[plan.id] = journees;

  const chapitres = corpus(plan.livres);
  const total = chapitres.reduce((n, c) => n + c.versets, 0);
  const charges = journees.map((j) =>
    j.reduce((n, p) => {
      const debut = p.chapitre;
      const fin = p.chapitreFin ?? p.chapitre;
      let somme = 0;
      for (let c = debut; c <= fin; c++) {
        const nb = versetsParChapitre.get(`${p.livre}|${c}`) ?? 0;
        somme += (p.versetFin ?? nb) - (p.verset ?? 1) + 1;
      }
      return n + somme;
    }, 0),
  );
  rapport.push({
    id: plan.id,
    jours: journees.length,
    chapitres: chapitres.length,
    versets: total,
    min: Math.min(...charges),
    max: Math.max(...charges),
    moyenne: Math.round(total / plan.jours),
    vides: journees.filter((j) => j.length === 0).length,
  });
}

const sortie = path.join(racine, 'src/data/plans-lecture-jours.ts');
fs.writeFileSync(
  sortie,
  `/**
 * Découpage des plans de lecture en journées.
 *
 * Fichier produit par scripts/generer-plans-lecture.mjs — ne pas modifier à la
 * main. Les libellés, descriptions et symboles des plans sont écrits, eux, dans
 * plans-lecture.ts ; ici il n'y a que la répartition, pesée en versets sur le
 * texte de la Segond installée.
 */

import type { PortionLecture } from './plans-lecture';

export const joursDesPlansDeLecture: Record<string, PortionLecture[][]> = ${JSON.stringify(
    resultat,
    null,
    0,
  )};
`,
  'utf8',
);

console.log(`✓ ${PLANS.length} plans découpés → ${path.relative(racine, sortie)}\n`);
for (const r of rapport) {
  const alerte = r.vides > 0 ? `  ⚠ ${r.vides} journée(s) vide(s)` : '';
  console.log(
    `  ${r.id.padEnd(28)} ${String(r.jours).padStart(3)} j · ${String(r.chapitres).padStart(4)} ch · ` +
      `${String(r.versets).padStart(5)} v · ${String(r.min).padStart(3)}–${String(r.max).padStart(3)} v/jour ` +
      `(moy. ${r.moyenne})${alerte}`,
  );
}
