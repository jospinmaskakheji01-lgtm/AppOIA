#!/usr/bin/env node
/**
 * Analyse « La Bible Parole de Vie », en trois volumes.
 *
 *   node scripts/analyseurs/parole-de-vie.mjs <vol1.txt> <vol2.txt> … --sortie <fichier.json>
 *
 * La mise en pages est régulière et, pour une fois, sans ambiguïté de nombres :
 * les appels de note sont des lettres, pas des chiffres.
 *
 *   GEN 6 Les êtres humains deviennent très nombreux sur la terre…
 *   2
 *   Les habitants du ciel voient que ces filles sont belles…
 *
 * Un chapitre s'ouvre par l'abréviation du livre suivie de son numéro, et le
 * premier verset suit sur la même ligne, sans numéro. Les suivants portent le
 * leur, seul sur sa ligne.
 *
 * Cette édition comprend les livres deutérocanoniques, que l'application reçoit
 * depuis que son canon a été élargi. Deux d'entre eux demandent un traitement
 * propre : les chapitres d'Esther grec portent des lettres autant que des
 * chiffres, et les additions grecques prolongent Daniel 3 bien au-delà du
 * compte de la Segond, qui sert ailleurs de borne.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chargerTS } from '../lib/charger-ts.mjs';

const racine = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const args = process.argv.slice(2);
const iSortie = args.indexOf('--sortie');
const sortie = iSortie >= 0 ? args[iSortie + 1] : path.join(racine, 'parole-de-vie.json');
const entrees = (iSortie >= 0 ? args.slice(0, iSortie) : args).filter(Boolean);
if (!entrees.length) {
  console.error('Usage : node scripts/analyseurs/parole-de-vie.mjs <fichiers.txt…> [--sortie f.json]');
  process.exit(1);
}

const { trouverLivre, livresCanoniques } = await chargerTS(path.join(racine, 'src/knowledge/reference.ts'));

/** Les abréviations propres à cette édition, telles qu'elles figurent dans le texte. */
const ABREVIATIONS = {
  GEN: 'Genèse', EXOD: 'Exode', EXODE: 'Exode', LÉV: 'Lévitique', NOMB: 'Nombres',
  DEUT: 'Deutéronome', JOSUÉ: 'Josué', JUGES: 'Juges', RUTH: 'Ruth',
  '1 SAM': '1 Samuel', '1 SAMUEL': '1 Samuel', '2 SAM': '2 Samuel', '2 SAMUEL': '2 Samuel',
  '1 ROIS': '1 Rois', '2 ROIS': '2 Rois', '1 CHR': '1 Chroniques', '2 CHR': '2 Chroniques',
  ESDRAS: 'Esdras', NÉH: 'Néhémie', ESTHER: 'Esther', JOB: 'Job', PSAUME: 'Psaumes',
  PROV: 'Proverbes', ECCL: 'Ecclésiaste', CANT: 'Cantique des cantiques',
  ÉSAÏE: 'Ésaïe', ES: 'Ésaïe', JÉR: 'Jérémie', LAM: 'Lamentations', ÉZÉ: 'Ézéchiel',
  DAN: 'Daniel', DANIEL: 'Daniel', OSÉE: 'Osée', JOËL: 'Joël', AMOS: 'Amos',
  ABDIAS: 'Abdias', JONAS: 'Jonas', MICHÉE: 'Michée', NAHOUM: 'Nahum', HAB: 'Habacuc',
  SOPH: 'Sophonie', AGGÉE: 'Aggée', ZA: 'Zacharie', MALAKIE: 'Malachie', MAL: 'Malachie',
  MAT: 'Matthieu', MARC: 'Marc', LUC: 'Luc', JEAN: 'Jean', ACTES: 'Actes',
  ROM: 'Romains', '1 COR': '1 Corinthiens', '2 COR': '2 Corinthiens', GAL: 'Galates',
  ÉPH: 'Éphésiens', PHIL: 'Philippiens', COL: 'Colossiens',
  '1 TH': '1 Thessaloniciens', '2 TH': '2 Thessaloniciens',
  '1 TIM': '1 Timothée', '2 TIM': '2 Timothée', TITE: 'Tite', PHLM: 'Philémon',
  HÉB: 'Hébreux', JAC: 'Jacques', '1 PI': '1 Pierre', '1 PIERRE': '1 Pierre',
  '2 PI': '2 Pierre', '2 PIERRE': '2 Pierre', '1 JEAN': '1 Jean', '2 JEAN': '2 Jean',
  '3 JEAN': '3 Jean', JUDE: 'Jude', APOC: 'Apocalypse',
  // L'édition alterne sigles et noms entiers, parfois dans le même volume.
  GENÈSE: 'Genèse', LÉVITIQUE: 'Lévitique', NOMBRES: 'Nombres', NÉHÉMIE: 'Néhémie',
  PROVERBES: 'Proverbes', CANTIQUE: 'Cantique des cantiques', ÉSAÏE: 'Ésaïe',
  JÉRÉMIE: 'Jérémie', ÉZÉKIEL: 'Ézéchiel', JOËL: 'Joël', HABACUC: 'Habacuc',
  SOPHONIE: 'Sophonie', ZAKARIE: 'Zacharie', MALACHIE: 'Malachie',
  MATTHIEU: 'Matthieu', ROMAINS: 'Romains', GALATES: 'Galates', COLOSSIENS: 'Colossiens',
  '1 TIMOTHÉE': '1 Timothée', '2 TIMOTHÉE': '2 Timothée', PHILÉMON: 'Philémon',
  HÉBREUX: 'Hébreux', JACQUES: 'Jacques', '1 CHRONIQUES': '1 Chroniques',
  '2 CHRONIQUES': '2 Chroniques', APOCALYPSE: 'Apocalypse',
  // Livres deutérocanoniques.
  TOBIT: 'Tobie', TOBIE: 'Tobie', JUDITH: 'Judith',
  SAG: 'Sagesse', SAGESSE: 'Sagesse', SIRAC: 'Siracide', SIRACIDE: 'Siracide',
  BARUC: 'Baruch', BARUCH: 'Baruch',
  '1 MACC': '1 Maccabées', '1 MACCABÉES': '1 Maccabées',
  '2 MACC': '2 Maccabées', '2 MACCABÉES': '2 Maccabées',
};

/**
 * Esther grec numérote ses chapitres 1 à 10 comme le livre hébreu, et désigne
 * par les lettres A à F les six passages que le texte grec ajoute. Le modèle
 * de l'application compte les chapitres en nombres : les lettres deviennent
 * donc les chapitres 11 à 16, comme le fait la Vulgate depuis saint Jérôme.
 */
const CHAPITRES_LETTRES = { A: 11, B: 12, C: 13, D: 14, E: 15, F: 16 };

/**
 * Le compte de versets de la Segond borne l'analyse. Là où elle ne peut rien
 * dire — les livres deutérocanoniques, et les additions grecques qui
 * prolongent Daniel 3 jusqu'au verset 97 — la borne est donnée ici.
 */
const BORNES_PROPRES = new Map([['Daniel|3', 100]]);

/**
 * Ouverture de chapitre : « GEN 6 », « 1 TIM 3 », « PSAUME 23 ».
 * Le premier verset suit sur la même ligne — sauf quand il commence à la
 * suivante, ce qui arrive quatre fois et faisait perdre quatre chapitres.
 */
const OUVERTURE = /^(\d?\s?\p{Lu}{2,12}(?:\s+GREC)?)\s+(\d{1,3}|[A-F])\s*(.*)$/u;

/**
 * La Segond installée sert de borne : un numéro de verset ne peut pas dépasser
 * de beaucoup le compte d'un chapitre. Une marge de deux couvre les endroits où
 * les traductions découpent différemment.
 */
const { modulelsg1910 } = await chargerTS(path.join(racine, 'src/data/versions/lsg1910.ts'));
const versetsSegond = new Map();
for (const v of modulelsg1910.versets) {
  const cle = `${v.livre}|${v.chapitre}`;
  versetsSegond.set(cle, Math.max(versetsSegond.get(cle) ?? 0, v.verset));
}
function borne(livre, chapitre) {
  const propre = BORNES_PROPRES.get(`${livre}|${chapitre}`);
  if (propre) return propre;
  return (versetsSegond.get(`${livre}|${chapitre}`) ?? 200) + 2;
}

/**
 * La Lettre de Jérémie est le seul livre dont le texte ne s'ouvre par aucun
 * sigle : après son titre vient une introduction, puis le texte commence à la
 * page suivante, verset 1 non numéroté. On attend donc d'avoir dépassé cette
 * introduction pour ouvrir le livre, sans quoi elle deviendrait le verset 1.
 */
const TITRE_LETTRE = 'LETTRE DE JÉRÉMIE';
let attenteLettre = 0; // 0 = rien, 1 = titre vu, 2 = introduction vue

const versets = [];
const chapitresLus = new Set();
const ecartes = new Map();
const anomalies = [];
let livre = null;
let chapitre = 0;
let dernier = 0;
let courant = null;

/**
 * Clôt le bloc en cours. `finExplicite` est le second numéro d'un « 34-49 » ;
 * `finDeduite` est le dernier verset qu'il couvre en réalité, quand l'édition
 * a perdu le numéro du verset suivant.
 */
function fermer(finDeduite) {
  if (!courant) return;
  const texte = courant.morceaux.join(' ').replace(/\s+/g, ' ').trim();
  if (texte) {
    const fin = Math.max(courant.finExplicite ?? 0, finDeduite ?? 0);
    versets.push({
      livre: courant.livre,
      chapitre: courant.chapitre,
      verset: courant.verset,
      ...(fin > courant.verset ? { versetFin: fin } : {}),
      texte,
    });
  }
  courant = null;
}

for (const fichier of entrees) {
  for (const brute of fs.readFileSync(fichier, 'utf8').split('\n')) {
    const ligne = brute.trim();
    if (!ligne) continue;

    if (ligne.startsWith('=== PAGE ')) {
      if (attenteLettre === 2 && !chapitresLus.has(`${TITRE_LETTRE}|1`)) {
        fermer(livre ? versetsSegond.get(`${livre}|${chapitre}`) : undefined);
        chapitresLus.add(`${TITRE_LETTRE}|1`);
        livre = 'Lettre de Jérémie';
        chapitre = 1;
        courant = { livre, chapitre, verset: 1, morceaux: [] };
        dernier = 1;
        attenteLettre = 0;
      }
      continue;
    }
    if (attenteLettre === 1 && ligne === 'INTRODUCTION') attenteLettre = 2;
    if (ligne === TITRE_LETTRE && attenteLettre === 0) {
      attenteLettre = 1;
      continue;
    }
    if (attenteLettre) continue;

    const ouverture = ligne.match(OUVERTURE);
    if (ouverture) {
      const sigle = ouverture[1].replace(/\s+/g, ' ').trim();
      const nom = ABREVIATIONS[sigle] ?? (sigle === 'EST GREC' ? 'Esther grec' : undefined);
      const fiche = nom ? trouverLivre(nom) : undefined;
      const numero = CHAPITRES_LETTRES[ouverture[2]] ?? Number(ouverture[2]);
      if (fiche && numero >= 1 && numero <= fiche.chapitres) {
        fermer(livre ? versetsSegond.get(`${livre}|${chapitre}`) : undefined);
        // Un chapitre déjà lu qui se rouvre appartient à un index ou à une
        // reprise de fin d'ouvrage : une Bible ne se lit qu'une fois.
        if (chapitresLus.has(`${fiche.nom}|${numero}`)) {
          livre = null;
          continue;
        }
        chapitresLus.add(`${fiche.nom}|${numero}`);
        livre = fiche.nom;
        chapitre = numero;
        // Le premier verset n'est pas numéroté : il suit le titre du chapitre.
        courant = { livre, chapitre, verset: 1, morceaux: ouverture[3] ? [ouverture[3]] : [] };
        dernier = 1;
        continue;
      }
    }

    // Trois sections viennent s'intercaler dans le fil du texte, et chacune
    // serait autrement absorbée par le dernier verset lu : les notes d'un
    // chapitre, les versions grecques d'Esther et de Daniel — qui prolongent le
    // livre sans ouvrir un nouveau sigle —, et le vocabulaire de fin d'ouvrage.
    if (/:\s*Notes\s*$/.test(ligne)) {
      fermer(livre ? versetsSegond.get(`${livre}|${chapitre}`) : undefined);
      livre = null;
      continue;
    }

    // Le texte biblique est suivi d'un vocabulaire ; sans cette borne, le
    // dernier verset de l'Apocalypse l'absorberait en entier.
    if (/^Vocabulaire(\s*[–-]|$)/.test(ligne)) {
      fermer(livre ? versetsSegond.get(`${livre}|${chapitre}`) : undefined);
      livre = null;
      continue;
    }

    if (!livre) continue;

    // Deux séries de nombres se ressemblent une fois le texte aplati : les vrais
    // numéros de versets, et des blocs de rappel que la mise en pages dépose en
    // tête de page. Un seul signe les sépare, et il est net : le numéro d'un
    // verset est suivi de son texte, donc d'une espace, quand le rappel est
    // seul sur sa ligne. Sur 7 976 nombres sans espace, 7 860 sont en tête de
    // page — ce sont eux, et ils ouvriraient des versets qui n'existent pas.
    //
    // « 24-25 » signale deux versets rendus ensemble : Parole de Vie regroupe
    // volontiers, et le second numéro devient le dernier verset atteint.
    const nombre = brute.match(/^(\d{1,3})(?:\s*[-–]\s*(\d{1,3}))?[ \t]+$/);
    if (nombre) {
      const n = Number(nombre[1]);
      if (n > dernier && n <= borne(livre, chapitre)) {
        // Le numéro d'un verset se perd quand il est composé en marge d'un
        // passage poétique. Le bloc précédent le contient : il couvre donc
        // jusqu'au verset qui précède celui-ci, et le dire permet de retrouver
        // le texte par sa référence plutôt que de le déclarer absent.
        if (n > dernier + 1) {
          anomalies.push(`${livre} ${chapitre} : versets ${dernier + 1} à ${n - 1} sans numéro propre.`);
        }
        fermer(n - 1);
        courant = { livre, chapitre, verset: n, morceaux: [], finExplicite: nombre[2] ? Number(nombre[2]) : undefined };
        dernier = nombre[2] ? Number(nombre[2]) : n;
      } else if (n > borne(livre, chapitre)) {
        // Au-delà du dernier verset du chapitre : cette édition prolonge Daniel
        // et Esther de leurs additions grecques, qui poursuivent la
        // numérotation. Le canon de l'application s'arrête ici.
        anomalies.push(`${livre} ${chapitre} : « ${n} » dépasse le chapitre ; lecture close.`);
        fermer(versetsSegond.get(`${livre}|${chapitre}`));
        livre = null;
      } else {
        anomalies.push(`${livre} ${chapitre} : « ${n} » après le verset ${dernier}.`);
      }
      continue;
    }

    // Un nombre sans texte à sa suite : rappel de mise en pages, écarté.
    if (/^\d{1,3}(?:\s*[-–]\s*\d{1,3})?$/.test(ligne)) continue;

    // Les appels de note sont des lettres isolées ; ils ne font pas partie du texte.
    if (/^[a-z]$/.test(ligne)) continue;

    if (courant) courant.morceaux.push(ligne);
  }
}
fermer(livre ? versetsSegond.get(`${livre}|${chapitre}`) : undefined);

// ————————————————————————————————————————————————————————————
// Vérification contre le canon et contre la Segond installée
// ————————————————————————————————————————————————————————————

const chapitresObtenus = new Map();
const versetsObtenus = new Map();
const couverts = new Map();
for (const v of versets) {
  if (!chapitresObtenus.has(v.livre)) chapitresObtenus.set(v.livre, new Set());
  chapitresObtenus.get(v.livre).add(v.chapitre);
  const cle = `${v.livre}|${v.chapitre}`;
  versetsObtenus.set(cle, Math.max(versetsObtenus.get(cle) ?? 0, v.versetFin ?? v.verset));
  if (!couverts.has(cle)) couverts.set(cle, new Set());
  for (let n = v.verset; n <= (v.versetFin ?? v.verset); n++) couverts.get(cle).add(n);
}

// Le vrai contrôle : chaque verset de la Segond est-il atteignable ?
let versetsAtteignables = 0;
let versetsHorsPortee = 0;
for (const [cle, max] of versetsSegond) {
  const presents = couverts.get(cle);
  for (let n = 1; n <= max; n++) {
    if (presents?.has(n)) versetsAtteignables += 1;
    else versetsHorsPortee += 1;
  }
}

const manquants = [];
for (const fiche of livresCanoniques) {
  const chapitres = chapitresObtenus.get(fiche.nom);
  if (!chapitres) manquants.push(`${fiche.nom} : absent.`);
  else if (chapitres.size !== fiche.chapitres) {
    manquants.push(`${fiche.nom} : ${chapitres.size} chapitres sur ${fiche.chapitres}.`);
  }
}

let concordants = 0;
const divergents = [];
for (const [cle, n] of versetsObtenus) {
  const attenduSegond = versetsSegond.get(cle);
  if (attenduSegond === undefined) continue;
  if (n === attenduSegond) concordants += 1;
  else divergents.push(`${cle.replace('|', ' ')} : ${n} versets, la Segond en compte ${attenduSegond}.`);
}

fs.writeFileSync(
  sortie,
  JSON.stringify(
    {
      version: {
        id: 'parole-de-vie',
        abreviation: 'PDV',
        nom: 'Parole de Vie',
        langue: 'fr',
        annee: '2000',
        couverture: 'complete',
        sourceId: 'bible-parole-de-vie',
      },
      source: {
        id: 'bible-parole-de-vie',
        titre: 'La Bible Parole de Vie',
        editeur: 'Société biblique française',
        annee: '2000',
        langue: 'fr',
        type: 'bible',
        abreviation: 'PDV',
        documentOrigine: 'La Bible Parole de Vie avec les livres deutérocanoniques (3 volumes).pdf',
        noteProvenance:
          'Traduction en français fondamental, à vocabulaire restreint. Utile pour dégager le sens d’un passage difficile, à côté d’une version littérale.',
        ajouteLe: new Date().toISOString().slice(0, 10),
      },
      versets,
    },
    null,
    0,
  ),
  'utf8',
);

console.log(`✓ ${versets.length} versets · ${chapitresObtenus.size} livres`);
console.log(`  → ${sortie}`);
if (ecartes.size) {
  console.log(`\nLivres écartés (hors du canon de l’application) : ${[...ecartes.keys()].join(', ')}`);
}
console.log(
  `\nChapitres au compte de la Segond : ${concordants} sur ${versetsObtenus.size} (${divergents.length} divergents).`,
);
const totalSegond = versetsAtteignables + versetsHorsPortee;
console.log(
  `Versets de la Segond retrouvables par leur référence : ${versetsAtteignables} sur ${totalSegond}` +
    ` (${((100 * versetsAtteignables) / totalSegond).toFixed(1)} %).`,
);
if (manquants.length) {
  console.log(`\n${manquants.length} écart(s) au canon :`);
  for (const m of manquants.slice(0, 20)) console.log(`  · ${m}`);
  if (manquants.length > 20) console.log(`  … et ${manquants.length - 20} autres.`);
} else {
  console.log('Les 66 livres sont couverts, chapitre par chapitre.');
}
if (anomalies.length) console.log(`\n${anomalies.length} numéro(s) inattendus, laissés dans le texte.`);
