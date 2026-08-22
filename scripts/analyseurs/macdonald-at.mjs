#!/usr/bin/env node
/**
 * Analyse « Le commentaire biblique du disciple — Ancien Testament »
 * de William MacDonald.
 *
 *   node scripts/analyseurs/macdonald-at.mjs <fichier.txt> [sortie.json]
 *
 * L'ouvrage commente l'Écriture passage par passage. Chaque commentaire
 * s'ouvre par sa référence, seule en tête de ligne :
 *
 *   4. 13-16 La plainte larmoyante de Caïn révèle un remords…
 *   4. 25, 26 Sur ce tableau saisissant se détache la lignée pieuse de Seth…
 *
 * Le livre commenté ne figure pas dans ce marqueur : il vient du titre courant
 * de la page (« Genèse 4, 5 »). Un marqueur n'est donc retenu que si la page
 * porte un titre courant et que le chapitre annoncé s'y trouve — sans quoi la
 * référence serait devinée, et une référence devinée n'a pas sa place ici.
 *
 * Le PDF est composé sur deux colonnes et coupe les mots en fin de ligne. Les
 * césures sont recollées, mais seulement devant une minuscule : « Beer-Schéba »
 * doit garder son trait d'union, « consé-quent » doit le perdre.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chargerTS } from '../lib/charger-ts.mjs';

const racine = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const [entree, sortieArg] = process.argv.slice(2);
if (!entree) {
  console.error('Usage : node scripts/analyseurs/macdonald-at.mjs <fichier.txt> [sortie.json]');
  process.exit(1);
}

const { trouverLivre } = await chargerTS(path.join(racine, 'src/knowledge/reference.ts'));

const SOURCE_ID = 'macdonald-commentaire-at';

/** Marqueur de commentaire : « 4. 13-16 », « 4. 25, 26 », « 4. 7 ». */
const MARQUEUR = /^(\d{1,3})\.\s+(\d{1,3})(?:\s*[-–]\s*(\d{1,3}))?((?:\s*,\s*\d{1,3}(?:\s*[-–]\s*\d{1,3})?)*)\s+(.*)$/;

/**
 * Titre courant : « Genèse 4, 5 », « 898 Ésaïe 21-23 », « Deutéronome 5 ».
 * Le numéro de page se colle souvent au titre, et souvent en double :
 * « 2 Samuel 15, 16 331331 », « Psaume 119698698 ». D'où le nombre final long.
 */
const TITRE_COURANT = /^(.+?)\s+(\d{1,3}(?:\s*[,\-–]\s*\d{1,3})*)(?:\s*\d{1,8})?$/;

/** Titre de section : « D. Seth et ses descendants (5) ». */
const SECTION = /^[A-Z]{1,3}\.\s+[A-ZÉÈÀÎÔ]/;

/**
 * L'ouvrage a deux mises en pages. Les livres longs ouvrent chaque commentaire
 * par sa référence seule ; les plus courts la placent entre parenthèses au bout
 * du titre de section :
 *
 *   A. Sur toute la terre (1. 1-3)
 *   2. Les victimes, le peuple impie de Juda (1. 8-13)
 *
 * Le titre donne alors son intitulé au commentaire.
 */
const PLAN = /^(?:[A-Z0-9]{1,3}\.\s+)?(\S.*?)\s*\((\d{1,3})\.\s*(\d{1,3})(?:\s*[-–]\s*(\d{1,3}))?\)$/;

/** Renvoi de note en bas de page : « 4 Thomson, Deuteronomy, p. 119. ». */
const NOTE = /^\d{1,3}\s+[A-ZÉÈ][\wéèêàçôû'’.-]*,\s/;

/**
 * Le PDF a perdu ses ligatures : « souffle » en ressort « souff le », et
 * « infligea » « inf ligea ». On recolle, sauf derrière un mot français qui
 * s'écrit vraiment avec un f final — « sauf le jour » doit rester tel quel.
 */
const MOTS_EN_F = new Set([
  'sauf', 'neuf', 'boeuf', 'bœuf', 'oeuf', 'œuf', 'chef', 'vif', 'actif', 'if',
  'clef', 'soif', 'nerf', 'serf', 'veuf', 'bref', 'grief', 'motif', 'tarif',
  'récif', 'relief', 'juif', 'naïf', 'suif', 'tuf', 'buf', 'golf', 'plaintif',
]);

function recollerLigatures(texte) {
  return texte.replace(/(\S*?[a-zà-öø-ÿ]f) ([li][a-zà-öø-ÿ])/g, (tout, gauche, droite) => {
    const mot = gauche.replace(/^[^\wà-öø-ÿ]+/, '').toLowerCase();
    return MOTS_EN_F.has(mot) ? tout : gauche + droite;
  });
}

const texte = fs.readFileSync(entree, 'utf8');
const morceaux = texte.split(/^=== PAGE (\d+) ===$/m);
const pages = [];
for (let i = 1; i < morceaux.length - 1; i += 2) {
  pages.push({ numero: Number(morceaux[i]), lignes: morceaux[i + 1].split('\n').map((l) => l.trim()) });
}

/**
 * Cherche le livre commenté sur une page, à partir de son titre courant.
 * Renvoie aussi les chapitres annoncés, qui servent à valider les marqueurs.
 *
 * Le titre courant est en haut ou en bas de la page. On ne regarde que ces
 * bords : au milieu, « Lv 7 » dans un renvoi ferait passer une page de la
 * Genèse pour une page du Lévitique.
 */
function titreDePage(lignes) {
  const pleines = lignes.filter(Boolean);
  const bords = [...pleines.slice(0, 2), ...pleines.slice(-2)];
  for (const ligne of bords) {
    if (!ligne || ligne.length > 40) continue;

    // Le numéro de page se colle parfois au numéro de chapitre, sans espace,
    // et se répète : « Genèse 13636 » est le chapitre 1, page 36 écrite deux
    // fois. On ne coupe que si le reste est bien un nombre redoublé — sans
    // quoi « Genèse 11 » deviendrait le chapitre 1 suivi de la page 1.
    const fusion = ligne.match(/^(.+?)\s+(\d{2,})$/);
    if (fusion) {
      const l = trouverLivre(fusion[1]) ?? trouverLivre(fusion[1].replace(/^\d{1,4}\s+/, ''));
      if (l) {
        const chiffres = fusion[2];
        for (let k = 3; k >= 1; k--) {
          if (k >= chiffres.length) continue;
          const chapitre = Number(chiffres.slice(0, k));
          const reste = chiffres.slice(k);
          const redouble =
            reste.length % 2 === 0 && reste.slice(0, reste.length / 2) === reste.slice(reste.length / 2);
          if (redouble && chapitre >= 1 && chapitre <= l.chapitres) {
            return { livre: l.nom, chapitres: new Set([chapitre]), ligne };
          }
        }
      }
    }

    // Un livre d'un seul chapitre n'a pas de numéro dans son titre courant :
    // « Abdias1060 » est le livre entier, page 1060.
    const seul = trouverLivre(ligne.replace(/\s*\d+\s*$/, '').trim());
    if (seul && seul.chapitres === 1) return { livre: seul.nom, chapitres: new Set([1]), ligne };

    const m = ligne.match(TITRE_COURANT);
    if (!m) continue;
    // Le numéro de page précède parfois le titre. On essaie d'abord le nom
    // entier : sans quoi « 1 Samuel » serait lu comme la page 1 du « Samuel ».
    const livre = trouverLivre(m[1]) ?? trouverLivre(m[1].replace(/^\d{1,4}\s+/, ''));
    if (!livre) continue;
    const chapitres = new Set(
      m[2]
        .split(/\s*[,\-–]\s*/)
        .map(Number)
        .filter((n) => n >= 1 && n <= livre.chapitres),
    );
    // Un intervalle « 21-23 » désigne aussi les chapitres intermédiaires.
    const bornes = [...chapitres];
    if (bornes.length === 2 && ligne.includes('-')) {
      for (let c = bornes[0]; c <= bornes[1]; c++) chapitres.add(c);
    }
    if (chapitres.size) return { livre: livre.nom, chapitres, ligne };
  }
  return undefined;
}

/** Un intitulé coupé par la mise en pages ne vaut pas mieux que pas d'intitulé. */
function titrePropre(brut) {
  const t = recollerLigatures(brut.replace(/\s+/g, ' ').trim());
  if (t.length < 10) return undefined;
  if (!/^[«"'(]?\s*[A-ZÉÈÀÎÔÜŒ0-9]/.test(t)) return undefined;
  return t;
}

const commentaires = [];
const ignores = [];
let livreCourant;
let chapitresPage = new Set();
let chapitreCourant = 0;
let courant;

/** Recolle les césures de fin de ligne, sauf devant une majuscule. */
function ajouter(bloc, ligne) {
  if (!ligne) return;
  const dernier = bloc.morceaux[bloc.morceaux.length - 1];
  if (dernier && /[-‑]$/.test(dernier) && /^[a-zà-öø-ÿ]/.test(ligne)) {
    bloc.morceaux[bloc.morceaux.length - 1] = dernier.slice(0, -1) + ligne;
    return;
  }
  bloc.morceaux.push(ligne);
}

function fermer() {
  if (!courant) return;
  const contenu = recollerLigatures(courant.morceaux.join(' ').replace(/\s+/g, ' ').trim());
  // Un commentaire d'une ligne est presque toujours une légende ou un reste de
  // mise en pages ; en dessous de 120 signes on ne retient rien.
  if (contenu.length >= 120) {
    commentaires.push({
      reference: courant.reference,
      titre: courant.titre,
      texte: contenu,
      page: courant.page,
    });
  } else {
    ignores.push(`${courant.reference} (p. ${courant.page}) : ${contenu.length} signes.`);
  }
  courant = undefined;
}

for (const page of pages) {
  const titre = titreDePage(page.lignes);
  if (titre) {
    if (titre.livre !== livreCourant) chapitreCourant = 0;
    livreCourant = titre.livre;
    chapitresPage = titre.chapitres;
  }

  for (const ligne of page.lignes) {
    if (!ligne) continue;
    if (titre && ligne === titre.ligne) continue;
    if (/^\d{1,8}$/.test(ligne)) continue; // numéro de page, parfois doublé
    if (NOTE.test(ligne)) continue;
    if (/^[♦•▪]+$/.test(ligne)) { fermer(); continue; }

    const m = ligne.match(MARQUEUR);
    if (m && livreCourant) {
      const chapitre = Number(m[1]);
      const verset = Number(m[2]);
      const versetFin = m[3] ? Number(m[3]) : undefined;
      // Le chapitre doit être annoncé par le titre courant, ou poursuivre celui
      // en cours : un titre courant retarde parfois d'une page. Tout le reste —
      // les listes numérotées d'un excursus, les chaînes de renvois — est écarté.
      const suite = chapitre === chapitreCourant || chapitre === chapitreCourant + 1;
      // Un chapitre hors des bornes du livre est impossible : c'est le signe
      // que le titre courant a été perdu, pas celui d'un commentaire.
      const borne = trouverLivre(livreCourant);
      // Un commentaire commence par une majuscule. Une minuscule signale un
      // renvoi coupé en tête de ligne (« … et Hébreux 1. 2 nous apprennent que »),
      // dont la référence serait juste et le texte sans rapport.
      const ouvre = /^[«"'—–(]?\s*[A-ZÉÈÀÎÔÜŒ]/.test(m[5]);
      if (ouvre && chapitre <= (borne?.chapitres ?? 0) && (chapitresPage.has(chapitre) || suite)) {
        fermer();
        courant = {
          reference: {
            livre: livreCourant,
            chapitre,
            verset,
            ...(versetFin && versetFin > verset ? { versetFin } : {}),
          },
          page: page.numero,
          morceaux: [],
        };
        chapitreCourant = chapitre;
        ajouter(courant, m[5]);
        continue;
      }
    }

    const plan = ligne.match(PLAN);
    if (plan && livreCourant) {
      const chapitre = Number(plan[2]);
      const verset = Number(plan[3]);
      const versetFin = plan[4] ? Number(plan[4]) : undefined;
      const borne = trouverLivre(livreCourant);
      if (chapitre >= 1 && chapitre <= (borne?.chapitres ?? 0)) {
        fermer();
        chapitreCourant = chapitre;
        courant = {
          reference: {
            livre: livreCourant,
            chapitre,
            verset,
            ...(versetFin && versetFin > verset ? { versetFin } : {}),
          },
          titre: titrePropre(plan[1]),
          page: page.numero,
          morceaux: [],
        };
        continue;
      }
    }

    if (SECTION.test(ligne)) { fermer(); continue; }
    if (courant) ajouter(courant, ligne);
  }
}
fermer();

// ————————————————————————————————————————————————————————————
// Mise au format d'un module de connaissance
// ————————————————————————————————————————————————————————————

const vus = new Set();
const entrees = commentaires.map((c) => {
  const base = `mac-${c.reference.livre}-${c.reference.chapitre}-${c.reference.verset}`
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-');
  let id = base;
  let n = 2;
  while (vus.has(id)) id = `${base}-${n++}`;
  vus.add(id);
  return {
    id,
    reference: c.reference,
    type: 'theologique',
    ...(c.titre ? { titre: c.titre } : {}),
    texte: c.texte,
    sourceId: SOURCE_ID,
    localisation: { page: String(c.page) },
  };
});

const parLivre = new Map();
for (const c of entrees) parLivre.set(c.reference.livre, (parLivre.get(c.reference.livre) ?? 0) + 1);

const sortie = sortieArg ?? path.join(racine, 'macdonald-at.json');
fs.writeFileSync(
  sortie,
  JSON.stringify(
    {
      module: { id: 'macdonald-commentaire-at-v1' },
      source: {
        id: SOURCE_ID,
        titre: 'Le commentaire biblique du disciple — Ancien Testament',
        auteur: 'William MacDonald et Arthur Farstad',
        editeur: 'La Joie de l’Éternel',
        annee: '1995',
        langue: 'fr',
        type: 'commentaire',
        abreviation: 'CBD',
        documentOrigine: path.basename(entree).replace(/\.txt$/, '.pdf'),
        noteProvenance:
          'Commentaire suivi de l’Ancien Testament, passage par passage. Le numéro de page renvoie à l’édition française de 2010.',
      },
      commentaires: entrees,
    },
    null,
    0,
  ),
  'utf8',
);

console.log(`✓ ${entrees.length} commentaires · ${parLivre.size} livres`);
console.log(`  → ${sortie}`);
const classe = [...parLivre.entries()].sort((a, b) => b[1] - a[1]);
console.log('\nRépartition (dix premiers) :');
for (const [livre, n] of classe.slice(0, 10)) console.log(`  ${String(n).padStart(4)}  ${livre}`);
if (ignores.length) console.log(`\n${ignores.length} bloc(s) trop courts, écartés.`);
