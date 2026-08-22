#!/usr/bin/env node
/**
 * Analyse le « Petit Dictionnaire Biblique ».
 *
 *   node scripts/analyseurs/petit-dictionnaire.mjs <fichier.txt> [sortie.json]
 *
 * Structure du document :
 *
 *     TERME (étymologie ou transcription)
 *     corps de la notice, parsemé de références abrégées
 *     [Sous-source]
 *
 * L'ouvrage est un recueil : chaque notice indique entre crochets celui des
 * cinq dictionnaires dont elle provient. Ces sous-sources sont conservées
 * telles quelles — c'est ce qui permet à deux notices du même terme, venues
 * d'ouvrages différents, de coexister dans l'application au lieu d'être
 * fondues.
 *
 * Sur les parenthèses : la préface indique que la portion tirée du Petit
 * Dictionnaire du Nouveau Testament donne « la transcription du terme grec
 * correspondant ». On s'appuie sur cette règle — et sur elle seule — pour
 * distinguer une translittération grecque d'une simple glose française.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chargerTS } from '../lib/charger-ts.mjs';

const racine = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const [entree, sortieArg] = process.argv.slice(2);
if (!entree) {
  console.error('Usage : node scripts/analyseurs/petit-dictionnaire.mjs <fichier.txt> [sortie.json]');
  process.exit(1);
}

const { livresCanoniques, trouverLivre, normaliser } = await chargerTS(
  path.join(racine, 'src/knowledge/reference.ts'),
);

/** Sous-sources telles que le recueil les nomme. */
const SOUS_SOURCES = {
  'Petit Dictionnaire NT R.Pigeon': { nom: 'Petit Dictionnaire du Nouveau Testament', auteur: 'Richard Pigeon', grec: true },
  'Encyclopédie Reisdorf-Reece': { nom: 'Encyclopédie Biblique', auteur: 'Reisdorf-Reece', grec: false },
  'Glossaire du Nouveau Testament - A.Espic': { nom: 'Glossaire du Nouveau Testament', auteur: 'André Espic', grec: false },
  'Sondez les Écritures': { nom: 'Sondez les Écritures', auteur: undefined, grec: false },
  'Dictionnaire ordinaire': { nom: 'Dictionnaire ordinaire', auteur: undefined, grec: false },
  Bibliquest: { nom: 'Bibliquest', auteur: undefined, grec: false },
  'Walter Scott': { nom: 'Walter Scott', auteur: 'Walter Scott', grec: false },
};

// ————— Détection des références bibliques dans le corps des notices —————

const graphies = [];
for (const livre of livresCanoniques) {
  graphies.push(livre.nom, livre.abreviation, ...livre.alias);
}
const alternance = [...new Set(graphies)]
  .sort((a, b) => b.length - a.length)
  .map((g) => g.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
  .join('|');
const motifReference = new RegExp(
  `(?:^|[^\\p{L}])(${alternance})\\.?\\s*(\\d{1,3})\\s*[:.]\\s*(\\d{1,3})(?:\\s*[-–]\\s*(\\d{1,3}))?`,
  'giu',
);

function extraireReferences(texte) {
  const vues = new Set();
  const sortie = [];
  for (const m of texte.matchAll(motifReference)) {
    const livre = trouverLivre(m[1]);
    if (!livre) continue;
    const chapitre = Number(m[2]);
    const verset = Number(m[3]);
    const versetFin = m[4] ? Number(m[4]) : undefined;
    if (chapitre < 1 || chapitre > livre.chapitres || verset < 1) continue;
    const cle = `${livre.nom}|${chapitre}|${verset}|${versetFin ?? ''}`;
    if (vues.has(cle)) continue;
    vues.add(cle);
    sortie.push({
      livre: livre.nom,
      chapitre,
      verset,
      ...(versetFin && versetFin > verset ? { versetFin } : {}),
    });
  }
  return sortie;
}

// ————— Distinguer une translittération grecque d'une glose française —————

/**
 * La préface annonce que la portion « Nouveau Testament » donne la
 * transcription grecque, mais elle dit « dans la plupart des cas » : les
 * parenthèses y contiennent aussi des gloses françaises. On ne retient donc
 * un mot que s'il en a la morphologie — et, dans le doute, on ne retient pas.
 */
const FIN_FRANCAISE = /(eur|teur|ment|tion|sion|ance|ence|ette|eux|euse|ible|able|aire|isme|iste|esse|ure|ité|ier|ien|é|ée|és|ant|ent)$/i;
const FIN_GRECQUE = /(os|ôs|on|ôn|ma|is|ia|eus|as|sis|tès|tês|ikos|ikè|ê|è)$/i;

function estTranslitteration(mot) {
  const m = mot.trim();
  if (m.length < 4 || /\s/.test(m)) return false;
  if (FIN_FRANCAISE.test(m)) return false;
  // Les circonflexes et macrons ne servent qu'à noter les voyelles longues.
  if (/[ôêîāēōû]/i.test(m)) return true;
  return FIN_GRECQUE.test(m);
}

// ————— Catégorisation, à partir de la manière dont la notice s'ouvre —————

const INDICES = [
  ['lieu', /^(ville|cité|rivière|fleuve|montagne|mont\b|pays|région|contrée|localité|bourg|village|désert|vallée|plaine|mer\b|lac\b|île|province|port|torrent|source|colline|district|territoire|capitale)/i],
  ['personnage', /^(fils|fille|père|mère|roi\b|reine|prophète|prophétesse|sacrificateur|épouse|femme de|frère|sœur|serviteur|eunuque|chef|apôtre|disciple|descendant|général|scribe|pharisien|gouverneur|centurion|patriarche|juge\b|lévite)/i],
  ['evenement', /^(fête|guerre|bataille|captivité|exil|siège|alliance conclue|déluge|pâque)/i],
  ['objet', /^(vase|vêtement|instrument|arme|monnaie|mesure|poids|pierre précieuse|étoffe|ustensile|coupe|autel|tissu|parfum|encens|métal)/i],
];

function categoriser(corps, terme) {
  const debut = corps.trim();
  for (const [categorie, motif] of INDICES) if (motif.test(debut)) return categorie;
  // Un terme entièrement en capitales avec une glose de sens est le plus souvent
  // un nom propre — le recueil glose systématiquement les noms hébreux.
  if (/^[A-ZÉÈÀÂÎÔÛÇŒ' -]+$/.test(terme) && terme.length > 2) return 'terme';
  return 'terme';
}

// ————— Analyse —————

const lignes = fs.readFileSync(entree, 'utf8').split('\n');

const motifEntete =
  /^(\p{Lu}[\p{Lu}\p{N}'’‑. -]{1,44}?)\s*(?:\(([^)]{1,120})\))?\s*(?:([:;])\s*(.*))?$/u;
const motifSource = /^\[([^\]]{3,60})\]$/;

const notices = [];
let page = 0;
let courante = null;

function cloturer(sousSource) {
  if (!courante) return;
  const corps = courante.corps.join(' ').replace(/\s+/g, ' ').trim();
  if (corps.length >= 15) {
    notices.push({ ...courante, corps, sousSource, page: courante.page });
  }
  courante = null;
}

for (const brute of lignes) {
  const ligne = brute.trim();

  const marqueur = ligne.match(/^=== PAGE (\d+) ===$/);
  if (marqueur) {
    page = Number(marqueur[1]);
    continue;
  }
  if (!ligne || /^\d{1,4}$/.test(ligne)) continue;

  const source = ligne.match(motifSource);
  if (source) {
    cloturer(source[1].trim());
    continue;
  }

  const entete = ligne.match(motifEntete);
  // Un en-tête doit être majoritairement en capitales et contenir des lettres.
  const estEntete =
    entete &&
    /\p{Lu}/u.test(entete[1]) &&
    entete[1].replace(/[^\p{L}]/gu, '').length >= 2 &&
    entete[1] === entete[1].toUpperCase();

  if (estEntete) {
    cloturer(undefined);
    courante = {
      terme: entete[1].replace(/\s+/g, ' ').trim(),
      parenthese: entete[2]?.trim(),
      corps: entete[4] ? [entete[4].trim()] : [],
      page,
    };
    continue;
  }

  if (courante) courante.corps.push(ligne);
}
cloturer(undefined);

// ————— Regroupement : un terme, plusieurs définitions —————

function identifiant(terme) {
  return normaliser(terme)
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 60);
}

const parId = new Map();
let sansSource = 0;

for (const n of notices) {
  const id = identifiant(n.terme);
  if (!id) continue;
  const meta = n.sousSource ? SOUS_SOURCES[n.sousSource] : undefined;
  if (!n.sousSource) sansSource += 1;

  const definition = {
    texte: n.parenthese ? `(${n.parenthese}) ${n.corps}` : n.corps,
    localisation: { page: String(n.page), article: n.terme },
    ...(meta ? { nuance: `${meta.nom}${meta.auteur ? ` — ${meta.auteur}` : ''}` } : {}),
  };

  const motsOriginaux =
    n.parenthese && meta?.grec
      ? n.parenthese
          .split(/\s*[,;]\s*/)
          .map((t) => t.trim())
          .filter(estTranslitteration)
          .map((t) => ({ langue: 'grec', mot: t, translitteration: t }))
      : [];

  if (!parId.has(id)) {
    parId.set(id, {
      id,
      terme: n.terme.charAt(0) + n.terme.slice(1).toLowerCase(),
      // La graphie en capitales n'est qu'une convention typographique du
      // recueil : inutile de l'exposer comme une variante du terme.
      variantes: [],
      categorie: categoriser(n.corps, n.terme),
      motsOriginaux: [],
      definitions: [],
      references: [],
      entreesLiees: [],
      themes: [],
    });
  }
  const e = parId.get(id);
  e.definitions.push(definition);
  e.motsOriginaux.push(...motsOriginaux);
  for (const r of extraireReferences(n.corps)) {
    if (!e.references.some((x) => x.livre === r.livre && x.chapitre === r.chapitre && x.verset === r.verset)) {
      e.references.push(r);
    }
  }
}

const entrees = [...parId.values()];
const sortie = sortieArg ?? path.join(racine, 'petit-dictionnaire.json');

fs.writeFileSync(
  sortie,
  JSON.stringify(
    {
      module: { id: 'petit-dictionnaire-biblique' },
      source: {
        id: 'petit-dictionnaire-biblique',
        titre: 'Petit Dictionnaire Biblique',
        auteur: 'Recueil — R. Pigeon, Reisdorf-Reece, A. Espic, Bibliquest',
        langue: 'fr',
        type: 'dictionnaire',
        abreviation: 'PDB',
        documentOrigine: 'PETIT DICTIONNAIRE BIBLIQUE.pdf',
        noteProvenance: `Recueil de notices tirées de cinq ouvrages. Chaque définition indique dans son champ « nuance » celui dont elle provient. Les termes suivent la version J.N. Darby.`,
      },
      entrees,
    },
    null,
    1,
  ),
);

const avecRefs = entrees.filter((e) => e.references.length > 0).length;
const multiSource = entrees.filter((e) => e.definitions.length > 1).length;
const avecGrec = entrees.filter((e) => e.motsOriginaux.length > 0).length;
const totalRefs = entrees.reduce((n, e) => n + e.references.length, 0);

console.log(`\nNotices repérées      ${notices.length}`);
console.log(`  dont sans source    ${sansSource}`);
console.log(`Entrées distinctes    ${entrees.length}`);
console.log(`  à plusieurs sources ${multiSource}`);
console.log(`  avec références     ${avecRefs}`);
console.log(`  avec translitt.     ${avecGrec}`);
console.log(`Références extraites  ${totalRefs}`);
console.log(`\n→ ${sortie}\n`);
