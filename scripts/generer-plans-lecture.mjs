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
 * La règle est celle que l'utilisateur a fixée : une journée, un chapitre. Deux
 * cas s'en écartent, et un seul est un choix.
 *
 * Quand le plan a plus de jours que de chapitres — Ecclésiaste en quatorze jours
 * pour douze chapitres — on divise les chapitres les plus longs, autant de fois
 * qu'il manque de journées, et on laisse les autres entiers. Chaque journée
 * reçoit alors exactement un chapitre ou une part de chapitre.
 *
 * Quand le plan a plus de chapitres que de jours — l'Ancien Testament en
 * quatre-vingt-dix jours en compte neuf cent vingt-neuf — la règle ne peut pas
 * tenir, et aucun découpage ne la sauverait. On s'en approche : toutes les
 * journées reçoivent le même nombre de chapitres à une unité près, dix ou onze
 * et jamais quatre puis dix-sept, et c'est la charge en versets qui décide
 * lesquelles prennent le chapitre supplémentaire. Peser en versets plutôt qu'en
 * chapitres évite qu'une journée tombe sur le Psaume 119, qui en compte cent
 * soixante-seize, quand la suivante a le Psaume 117, qui en compte deux.
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

/**
 * Journées de longueur égale, à un chapitre près.
 *
 * Le recours quand il y a plus de chapitres que de jours. Le nombre de
 * chapitres par journée ne prend que deux valeurs, `base` et `base + 1` : le
 * lecteur sait ce qui l'attend chaque matin. Reste à choisir quelles journées
 * reçoivent le chapitre en plus — celles qui, sans lui, resteraient en deçà de
 * la charge en versets qu'elles devraient porter.
 */
function parChapitresUniformes(chapitres, jours) {
  return decouperUniforme(chapitres, jours, (c) => c.versets);
}

/**
 * Répartit des unités indivisibles — chapitres, ou passages d'enseignement — en
 * donnant à chaque journée le même compte à une unité près. Le poids sert
 * seulement à décider quelles journées reçoivent l'unité supplémentaire.
 */
function decouperUniforme(unites, jours, poids) {
  const chapitres = unites;
  const cumul = [0];
  for (const c of chapitres) cumul.push(cumul[cumul.length - 1] + poids(c));
  const total = cumul[cumul.length - 1];

  const base = Math.floor(chapitres.length / jours);
  let enPlus = chapitres.length - base * jours;
  if (base === 0) throw new Error('decouperUniforme : plus de journées que d’unités');

  const sortie = [];
  let pris = 0;
  for (let jour = 1; jour <= jours; jour++) {
    let combien = base;
    // Les chapitres en plus qu'il reste à placer doivent tenir dans les journées
    // qui restent ; passé ce point, chaque journée en prend un.
    const obligatoire = enPlus > jours - jour;
    if (enPlus > 0 && (obligatoire || cumul[pris + base] < (jour * total) / jours)) {
      combien += 1;
      enPlus -= 1;
    }
    sortie.push(chapitres.slice(pris, pris + combien));
    pris += combien;
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
      ? parChapitresUniformes(chapitres, jours)
      : parChapitresDivises(chapitres, jours);
  return journees.map((lot) => ({ portions: enPortions(lot) }));
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
 * Les prédications des apôtres dans les Actes.
 *
 * Les lettres du Nouveau Testament ne sont pas le seul enseignement laissé par
 * les apôtres : les Actes rapportent leurs discours, et ceux-là sont adressés à
 * des foules plutôt qu'à des Églises. Ils ouvrent donc le plan, dans l'ordre du
 * livre, avant les vingt et une lettres.
 */
const PREDICATIONS_DES_APOTRES = [
  ['Pierre devant les frères : le remplacement de Judas', 'Actes', 1, 15, 26],
  ['Pierre à la Pentecôte', 'Actes', 2, 14, 41],
  ['Pierre sous le portique de Salomon', 'Actes', 3, 11, 26],
  ['Pierre devant le sanhédrin', 'Actes', 4, 5, 22],
  ['La prière de l’Église, et la communion des biens', 'Actes', 4, 23, 37],
  ['Les apôtres devant le sanhédrin ; le conseil de Gamaliel', 'Actes', 5, 27, 42],
  ['Le discours d’Étienne', 'Actes', 7, 1, 53],
  ['Philippe et l’eunuque éthiopien', 'Actes', 8, 26, 40],
  ['Pierre chez Corneille', 'Actes', 10, 34, 48],
  ['Pierre rend compte à Jérusalem', 'Actes', 11, 1, 18],
  ['Paul à Antioche de Pisidie', 'Actes', 13, 16, 41],
  ['Paul et Barnabas à Lystre', 'Actes', 14, 14, 18],
  ['Le concile de Jérusalem : Pierre et Jacques', 'Actes', 15, 6, 21],
  ['Paul à Athènes, devant l’Aréopage', 'Actes', 17, 22, 34],
  ['Paul aux anciens d’Éphèse', 'Actes', 20, 17, 38],
  ['Paul à Jérusalem : son témoignage', 'Actes', 22, 1, 21],
  ['Paul devant Félix', 'Actes', 24, 10, 21],
  ['Paul devant Agrippa', 'Actes', 26, 1, 29],
  ['Paul à Rome, jusqu’au bout', 'Actes', 28, 23, 31],
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
  return decouperUniforme(passages, jours, (p) => p.versetFin - p.verset + 1).map((lot) => ({
    titre: lot.length > 1 ? `${lot[0].nom}, et la suite` : lot[0].nom,
    portions: lot.map((p) => ({
      livre: p.livre,
      chapitre: p.chapitre,
      verset: p.verset,
      versetFin: p.versetFin,
    })),
  }));
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
  // Les enseignements des apôtres se composent en deux temps : leurs discours
  // dans les Actes, puis leurs lettres. Chaque temps reçoit sa part de journées
  // au prorata du nombre d'unités, pour qu'une journée ne mêle jamais les deux.
  {
    id: 'lecture-apotres-90',
    jours: 90,
    composer: () => {
      const lettres = corpus(entre('Romains', 'Jude'));
      const unites = PREDICATIONS_DES_APOTRES.length + lettres.length;
      const joursActes = Math.max(
        1,
        Math.round((PREDICATIONS_DES_APOTRES.length * 90) / unites),
      );
      return [
        ...repartirPassages(PREDICATIONS_DES_APOTRES, joursActes),
        ...parChapitresUniformes(lettres, 90 - joursActes).map((lot) => ({
          portions: enPortions(lot),
        })),
      ];
    },
  },
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
for (const p of [...ENSEIGNEMENTS_DE_JESUS, ...PREDICATIONS_DES_APOTRES]) {
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

const resultat = {
  'lecture-jesus-60': repartirParEvangile(ENSEIGNEMENTS_DE_JESUS, 60),
};

const rapport = [];
for (const plan of PLANS) {
  const journees = plan.composer ? plan.composer() : decouper(plan.livres, plan.jours);
  resultat[plan.id] = journees;

  const chapitres = plan.livres ? corpus(plan.livres) : [];
  const total = journees.reduce(
    (n, j) =>
      n +
      j.portions.reduce((m, p) => {
        let somme = 0;
        for (let c = p.chapitre; c <= (p.chapitreFin ?? p.chapitre); c++) {
          const nb = versetsParChapitre.get(`${p.livre}|${c}`) ?? 0;
          somme += (p.versetFin ?? nb) - (p.verset ?? 1) + 1;
        }
        return m + somme;
      }, 0),
    0,
  );
  const charges = journees.map((j) =>
    j.portions.reduce((n, p) => {
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
  const chapitresParJour = journees.map((j) =>
    j.portions.reduce((n, p) => n + (p.chapitreFin ?? p.chapitre) - p.chapitre + 1, 0),
  );
  rapport.push({
    id: plan.id,
    jours: journees.length,
    chapitres: chapitres.length,
    versets: total,
    min: Math.min(...charges),
    max: Math.max(...charges),
    chMin: Math.min(...chapitresParJour),
    chMax: Math.max(...chapitresParJour),
    moyenne: Math.round(total / plan.jours),
    vides: journees.filter((j) => j.portions.length === 0).length,
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

/**
 * Les journées de chaque plan. Une journée porte un titre lorsqu'elle
 * correspond à un passage nommé — les enseignements de Jésus, les prédications
 * des apôtres ; les traversées n'en ont pas, leur référence dit tout.
 */
export const joursDesPlansDeLecture: Record<
  string,
  { titre?: string; portions: PortionLecture[] }[]
> = ${JSON.stringify(resultat, null, 0)};
`,
  'utf8',
);

console.log(`✓ ${Object.keys(resultat).length} plans découpés → ${path.relative(racine, sortie)}`);
console.log(
  `  ${ENSEIGNEMENTS_DE_JESUS.length} enseignements de Jésus · ` +
    `${PREDICATIONS_DES_APOTRES.length} prédications des apôtres\n`,
);
for (const r of rapport) {
  const alerte = r.vides > 0 ? `  ⚠ ${r.vides} journée(s) vide(s)` : '';
  const uniforme = r.chMax - r.chMin <= 1 ? ' ' : '⚠';
  console.log(
    `  ${r.id.padEnd(28)} ${String(r.jours).padStart(3)} j · ${String(r.chapitres).padStart(4)} ch · ` +
      `${uniforme} ${r.chMin}–${r.chMax} ch/jour · ` +
      `${String(r.min).padStart(3)}–${String(r.max).padStart(3)} v/jour (moy. ${r.moyenne})${alerte}`,
  );
}
