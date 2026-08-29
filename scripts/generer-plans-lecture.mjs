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
// Les enseignements de Jésus
// ————————————————————————————————————————————————————————————

/**
 * Tous les passages des quatre évangiles où Jésus enseigne.
 *
 * Ce plan n'est pas une traversée : les évangiles racontent autant qu'ils
 * enseignent, et lire les enseignements suppose de laisser de côté les récits
 * qui n'en portent pas — les guérisons sans parole, la nativité, la passion.
 * Mais à l'intérieur de ce qu'il retient, le plan est complet : chaque discours,
 * chaque parabole, chaque réponse de Jésus s'y trouve, dans l'ordre des
 * évangiles, de Matthieu à Jean.
 *
 * Les passages parallèles ne sont pas fusionnés. Le discours sur la montagne et
 * le discours dans la plaine, les paraboles de Matthieu 13 et celles de Marc 4,
 * ne disent pas la même chose de la même manière : chaque évangéliste garde sa
 * voix, et le lecteur les entend l'une après l'autre.
 */
const ENSEIGNEMENTS_DE_JESUS = [
  // — Matthieu —
  ['Le sermon sur la montagne : les béatitudes, le sel et la lumière', 'Matthieu', 5, 1, 16],
  ['Le sermon sur la montagne : la loi accomplie', 'Matthieu', 5, 17, 48],
  [`Le sermon sur la montagne : l'aumône, la prière, le jeûne`, 'Matthieu', 6, 1, 18],
  [`Le sermon sur la montagne : les deux trésors et l'inquiétude`, 'Matthieu', 6, 19, 34],
  ['Le sermon sur la montagne : ne jugez pas, demandez, les deux chemins', 'Matthieu', 7, 1, 29],
  ['Le prix à payer pour suivre Jésus', 'Matthieu', 8, 18, 22],
  ['Le médecin, les outres neuves', 'Matthieu', 9, 9, 17],
  ['La moisson est grande', 'Matthieu', 9, 35, 38],
  [`L'envoi des douze`, 'Matthieu', 10, 1, 42],
  ['Sur Jean-Baptiste ; venez à moi', 'Matthieu', 11, 7, 30],
  ['Le Seigneur du sabbat', 'Matthieu', 12, 1, 21],
  ['La maison divisée, le signe de Jonas', 'Matthieu', 12, 22, 45],
  ['La vraie famille de Jésus', 'Matthieu', 12, 46, 50],
  ['Les paraboles du royaume', 'Matthieu', 13, 1, 52],
  [`Ce qui souille l'homme`, 'Matthieu', 15, 1, 20],
  ['Le levain des pharisiens', 'Matthieu', 16, 1, 12],
  ['« Qui dites-vous que je suis ? » et la croix', 'Matthieu', 16, 13, 28],
  ['La foi comme un grain de sénevé ; le didrachme', 'Matthieu', 17, 14, 27],
  ['Le discours sur la vie fraternelle', 'Matthieu', 18, 1, 35],
  ['Le mariage, les enfants, le jeune homme riche', 'Matthieu', 19, 1, 30],
  ['Les ouvriers de la onzième heure', 'Matthieu', 20, 1, 16],
  ['Le plus grand sera votre serviteur', 'Matthieu', 20, 17, 28],
  [`L'autorité, les deux fils, les vignerons`, 'Matthieu', 21, 23, 46],
  ['Les noces, César, la résurrection, le grand commandement', 'Matthieu', 22, 1, 46],
  ['Malheur aux hypocrites', 'Matthieu', 23, 1, 39],
  ['Le discours sur la fin', 'Matthieu', 24, 1, 51],
  ['Les dix vierges, les talents, le jugement des nations', 'Matthieu', 25, 1, 46],
  ['La cène instituée', 'Matthieu', 26, 26, 29],
  ['Tout pouvoir m’a été donné', 'Matthieu', 28, 16, 20],

  // — Marc —
  [`L'évangile de Dieu : le temps est accompli`, 'Marc', 1, 14, 15],
  ['Le médecin, le jeûne, le sabbat', 'Marc', 2, 15, 28],
  ['Béelzébul, et la vraie famille', 'Marc', 3, 22, 35],
  ['Les paraboles de la semence', 'Marc', 4, 1, 34],
  ['La tradition, et le cœur', 'Marc', 7, 1, 23],
  ['Prendre sa croix', 'Marc', 8, 31, 38],
  ['Qui est le plus grand', 'Marc', 9, 33, 50],
  ['Le mariage, les enfants, la richesse', 'Marc', 10, 1, 31],
  ['Servir, et donner sa vie', 'Marc', 10, 32, 45],
  ['La foi et la prière', 'Marc', 11, 20, 26],
  ['Les vignerons, César, la résurrection, la veuve', 'Marc', 12, 1, 44],
  ['Le discours du mont des Oliviers', 'Marc', 13, 1, 37],

  // — Luc —
  ['À Nazareth : l’Esprit du Seigneur est sur moi', 'Luc', 4, 16, 30],
  ['Le discours dans la plaine', 'Luc', 6, 20, 49],
  ['Les deux débiteurs', 'Luc', 7, 36, 50],
  ['Le semeur, et la lampe', 'Luc', 8, 4, 21],
  ['Prendre sa croix chaque jour', 'Luc', 9, 23, 27],
  ['Le plus grand ; suivre Jésus sans se retourner', 'Luc', 9, 46, 62],
  [`L'envoi des soixante-douze`, 'Luc', 10, 1, 24],
  ['Le bon Samaritain ; Marthe et Marie', 'Luc', 10, 25, 42],
  ['Enseigne-nous à prier', 'Luc', 11, 1, 13],
  ['Béelzébul, le signe de Jonas, les malheurs', 'Luc', 11, 14, 54],
  ['L’homme riche et insensé ; veiller', 'Luc', 12, 1, 59],
  ['Le figuier stérile ; la porte étroite', 'Luc', 13, 1, 35],
  ['Les places à table, le grand souper, le prix à payer', 'Luc', 14, 1, 35],
  ['La brebis, la drachme, le fils perdu', 'Luc', 15, 1, 32],
  ['L’économe infidèle ; le riche et Lazare', 'Luc', 16, 1, 31],
  ['Le pardon, la foi, le royaume au milieu de vous', 'Luc', 17, 1, 37],
  ['La veuve ; le pharisien et le publicain ; le riche', 'Luc', 18, 1, 30],
  ['Les dix mines', 'Luc', 19, 11, 27],
  ['L’autorité, les vignerons, César, la résurrection', 'Luc', 20, 1, 47],
  ['L’offrande de la veuve, et le discours sur la fin', 'Luc', 21, 1, 38],
  ['Le plus grand ; Simon, j’ai prié pour toi', 'Luc', 22, 24, 38],

  // — Jean —
  ['Nicodème : naître de nouveau', 'Jean', 3, 1, 21],
  ['La Samaritaine : l’eau vive', 'Jean', 4, 1, 42],
  ['Le Fils ne fait rien de lui-même', 'Jean', 5, 16, 47],
  ['Le pain de vie', 'Jean', 6, 26, 71],
  ['À la fête des tabernacles', 'Jean', 7, 14, 52],
  ['La lumière du monde ; la vérité vous affranchira', 'Jean', 8, 12, 59],
  ['L’aveuglement de ceux qui voient', 'Jean', 9, 35, 41],
  ['Le bon berger', 'Jean', 10, 1, 42],
  ['Le grain de blé qui meurt', 'Jean', 12, 20, 50],
  ['Le lavement des pieds, et le commandement nouveau', 'Jean', 13, 1, 38],
  ['Je suis le chemin, la vérité, la vie', 'Jean', 14, 1, 31],
  ['Le cep et les sarments', 'Jean', 15, 1, 27],
  ['L’Esprit de vérité ; votre tristesse se changera en joie', 'Jean', 16, 1, 33],
  ['La prière de Jésus pour les siens', 'Jean', 17, 1, 26],
].map(([nom, livre, chapitre, verset, versetFin]) => ({ nom, livre, chapitre, verset, versetFin }));

/**
 * Répartit des passages entiers sur les journées d'un plan.
 *
 * À la différence d'une traversée, un passage d'enseignement ne se coupe pas :
 * il tient d'un seul tenant ou il perd son sens. Les journées reçoivent donc un
 * ou plusieurs passages complets, aux frontières les plus proches de la charge
 * visée, et prennent le nom du premier d'entre eux.
 */
function repartirPassages(passages, jours) {
  const poids = passages.map((p) => p.versetFin - p.verset + 1);
  const cumul = [0];
  for (const n of poids) cumul.push(cumul[cumul.length - 1] + n);
  const total = cumul[cumul.length - 1];

  const sortie = [];
  let pris = 0;
  for (let jour = 1; jour <= jours; jour++) {
    const restants = jours - jour;
    const cible = (jour * total) / jours;
    let i = pris + 1;
    while (
      i < passages.length - restants &&
      Math.abs(cumul[i + 1] - cible) < Math.abs(cumul[i] - cible)
    ) {
      i += 1;
    }
    const lot = passages.slice(pris, i);
    sortie.push({
      titre: lot.length > 1 ? `${lot[0].nom}, et la suite` : lot[0].nom,
      portions: lot.map((p) => ({
        livre: p.livre,
        chapitre: p.chapitre,
        verset: p.verset,
        versetFin: p.versetFin,
      })),
    });
    pris = i;
  }
  return sortie;
}

/**
 * Répartit les passages évangile par évangile.
 *
 * Une journée qui finirait Matthieu et commencerait Marc mêlerait deux
 * évangiles sous un seul titre. On donne donc à chaque évangile sa part de
 * journées — proportionnelle au poids de ses enseignements, arrondie à la plus
 * forte décimale — puis on répartit à l'intérieur.
 */
function repartirParEvangile(passages, jours) {
  const evangiles = [];
  for (const p of passages) {
    const dernier = evangiles[evangiles.length - 1];
    if (dernier && dernier.livre === p.livre) dernier.passages.push(p);
    else evangiles.push({ livre: p.livre, passages: [p] });
  }

  const total = passages.reduce((n, p) => n + p.versetFin - p.verset + 1, 0);
  const parts = evangiles.map((e) => {
    const versets = e.passages.reduce((n, p) => n + p.versetFin - p.verset + 1, 0);
    const exact = (versets * jours) / total;
    return { ...e, exact, jours: Math.max(1, Math.floor(exact)) };
  });

  // Les journées qu'il reste à placer vont à ceux dont l'arrondi a le plus coûté.
  let reste = jours - parts.reduce((n, p) => n + p.jours, 0);
  const ordre = [...parts].sort((a, b) => b.exact - b.jours - (a.exact - a.jours));
  for (let i = 0; reste > 0; i = (i + 1) % ordre.length, reste--) {
    ordre[i].jours += 1;
  }

  return parts.flatMap((e) => repartirPassages(e.passages, Math.min(e.jours, e.passages.length)));
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

// Une borne fausse ne lèverait aucune erreur : `getPassage` rendrait simplement
// moins de versets que prévu, et personne ne le verrait. On la refuse ici.
const bornesFausses = [];
for (const p of ENSEIGNEMENTS_DE_JESUS) {
  const nb = versetsParChapitre.get(`${p.livre}|${p.chapitre}`);
  if (!nb) bornesFausses.push(`${p.livre} ${p.chapitre} — chapitre absent de la Segond`);
  else if (p.versetFin > nb)
    bornesFausses.push(`${p.livre} ${p.chapitre}:${p.verset}-${p.versetFin} — le chapitre s'arrête au verset ${nb}`);
  else if (p.verset > p.versetFin) bornesFausses.push(`${p.livre} ${p.chapitre} — bornes inversées`);
}
if (bornesFausses.length > 0) {
  console.error(`✗ ${bornesFausses.length} passage(s) hors bornes :`);
  for (const b of bornesFausses) console.error(`  · ${b}`);
  process.exit(1);
}

const journeesJesus = repartirParEvangile(ENSEIGNEMENTS_DE_JESUS, 60);

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

/**
 * Les enseignements de Jésus : le seul plan dont les journées portent un titre,
 * parce qu'il ne traverse pas un livre mais rassemble des passages choisis dans
 * les quatre évangiles. La liste des passages est dans le générateur.
 */
export const journeesDesEnseignementsDeJesus: { titre: string; portions: PortionLecture[] }[] = ${JSON.stringify(
    journeesJesus,
    null,
    0,
  )};
`,
  'utf8',
);

const versetsJesus = ENSEIGNEMENTS_DE_JESUS.reduce((n, p) => n + p.versetFin - p.verset + 1, 0);
console.log(`✓ ${PLANS.length} plans découpés → ${path.relative(racine, sortie)}`);
console.log(
  `  enseignements de Jésus : ${ENSEIGNEMENTS_DE_JESUS.length} passages, ${versetsJesus} versets, ` +
    `répartis sur ${journeesJesus.length} journées\n`,
);
for (const r of rapport) {
  const alerte = r.vides > 0 ? `  ⚠ ${r.vides} journée(s) vide(s)` : '';
  console.log(
    `  ${r.id.padEnd(28)} ${String(r.jours).padStart(3)} j · ${String(r.chapitres).padStart(4)} ch · ` +
      `${String(r.versets).padStart(5)} v · ${String(r.min).padStart(3)}–${String(r.max).padStart(3)} v/jour ` +
      `(moy. ${r.moyenne})${alerte}`,
  );
}
