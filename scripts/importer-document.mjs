#!/usr/bin/env node
/**
 * Importe un ouvrage (dictionnaire, commentaire, étude, enseignement) dans la
 * base de connaissances.
 *
 *   node scripts/importer-document.mjs <fichier.json> [--forcer]
 *
 * Format attendu — voir docs/BASE-DE-CONNAISSANCES.md :
 * {
 *   "module":  { "id": "..." },
 *   "source":  { "id", "titre", "auteur", "annee", "langue", "type", "droits",
 *                "abreviation", "documentOrigine", "noteDroits" },
 *   "entrees":             [ ... entrées de dictionnaire ],
 *   "commentaires":        [ ... commentaires, référence en texte libre ],
 *   "themes":              [ ... ],
 *   "referencesCroisees":  [ ... ]
 * }
 *
 * Les références bibliques peuvent être écrites librement (« Jn 3.16 ») :
 * le script les normalise et refuse celles qu'il ne sait pas résoudre.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chargerTS } from './lib/charger-ts.mjs';

const racine = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const [fichier, ...options] = process.argv.slice(2);
const forcer = options.includes('--forcer');

if (!fichier) {
  console.error('Usage : node scripts/importer-document.mjs <fichier.json> [--forcer]');
  process.exit(1);
}

const TYPES = ['bible', 'dictionnaire', 'commentaire', 'etude', 'theologie', 'enseignement', 'redaction-interne'];
const DROITS = ['domaine-public', 'licence-libre', 'sous-droits', 'interne', 'a-verifier'];
const CATEGORIES = ['terme', 'personnage', 'lieu', 'objet', 'evenement', 'concept', 'theme', 'livre'];
const TYPES_COMMENTAIRE = ['contexte', 'historique', 'theologique', 'pratique', 'linguistique', 'structure'];

const { analyserReference, formaterReference } = await chargerTS(
  path.join(racine, 'src/knowledge/reference.ts'),
);

const brut = JSON.parse(fs.readFileSync(fichier, 'utf8'));
const source = brut.source ?? {};
const moduleId = brut.module?.id ?? `${source.id ?? 'module'}-v1`;

const erreurs = [];
const avertissements = [];

for (const champ of ['id', 'titre', 'langue', 'type', 'droits', 'abreviation']) {
  if (!source[champ]) erreurs.push(`source.${champ} est obligatoire.`);
}
if (source.type && !TYPES.includes(source.type)) erreurs.push(`source.type doit valoir : ${TYPES.join(', ')}.`);
if (source.droits && !DROITS.includes(source.droits)) erreurs.push(`source.droits doit valoir : ${DROITS.join(', ')}.`);
if (source.droits === 'a-verifier') {
  avertissements.push(`Droits non déterminés : le contenu sera indexé mais marqué non redistribuable.`);
}
if (source.droits === 'sous-droits') {
  avertissements.push(
    `Ouvrage sous droits : ne stockez que des renvois et de courtes citations, pas le texte intégral.`,
  );
}

/** Normalise une référence écrite librement ; renvoie null si irrésoluble. */
function normaliserRef(brute, contexte) {
  if (!brute) return null;
  if (typeof brute === 'object' && brute.livre) return brute;
  const ref = analyserReference(String(brute));
  if (!ref) {
    erreurs.push(`Référence non résolue « ${brute} » (${contexte}).`);
    return null;
  }
  return ref;
}

const entrees = [];
for (const [i, e] of (brut.entrees ?? []).entries()) {
  const contexte = `entrees[${i}]`;
  if (!e.id || !e.terme) {
    erreurs.push(`${contexte} : « id » et « terme » sont obligatoires.`);
    continue;
  }
  if (e.categorie && !CATEGORIES.includes(e.categorie)) {
    erreurs.push(`${contexte} : catégorie « ${e.categorie} » inconnue.`);
  }
  const definitions = (e.definitions ?? []).map((d) =>
    typeof d === 'string'
      ? { texte: d, sourceId: source.id }
      : { ...d, sourceId: d.sourceId ?? source.id },
  );
  if (definitions.length === 0) erreurs.push(`${contexte} : aucune définition.`);
  entrees.push({
    id: e.id,
    terme: e.terme,
    variantes: e.variantes ?? [],
    categorie: e.categorie ?? 'terme',
    motsOriginaux: e.motsOriginaux ?? [],
    definitions,
    references: (e.references ?? []).map((r) => normaliserRef(r, contexte)).filter(Boolean),
    entreesLiees: e.entreesLiees ?? [],
    themes: e.themes ?? [],
  });
}

const commentaires = [];
for (const [i, c] of (brut.commentaires ?? []).entries()) {
  const contexte = `commentaires[${i}]`;
  const reference = normaliserRef(c.reference, contexte);
  if (!reference) continue;
  if (!c.texte) {
    erreurs.push(`${contexte} : texte manquant.`);
    continue;
  }
  if (c.type && !TYPES_COMMENTAIRE.includes(c.type)) {
    erreurs.push(`${contexte} : type « ${c.type} » inconnu.`);
  }
  commentaires.push({
    id: c.id ?? `${source.id}-${i}`,
    reference,
    referenceFin: c.referenceFin ? normaliserRef(c.referenceFin, contexte) : undefined,
    type: c.type ?? 'contexte',
    titre: c.titre,
    texte: c.texte,
    sourceId: source.id,
    localisation: c.localisation,
    auteur: c.auteur,
    position: c.position,
    themes: c.themes ?? [],
  });
}

const themes = (brut.themes ?? []).map((t, i) => ({
  id: t.id ?? `${source.id}-theme-${i}`,
  nom: t.nom,
  description: t.description ?? '',
  motsCles: t.motsCles ?? [],
  references: (t.references ?? []).map((r) => normaliserRef(r, `themes[${i}]`)).filter(Boolean),
  entrees: t.entrees ?? [],
  sourceId: source.id,
}));

const referencesCroisees = (brut.referencesCroisees ?? [])
  .map((rc, i) => {
    const de = normaliserRef(rc.de, `referencesCroisees[${i}].de`);
    const vers = normaliserRef(rc.vers, `referencesCroisees[${i}].vers`);
    if (!de || !vers) return null;
    return {
      id: rc.id ?? `${source.id}-rc-${i}`,
      de,
      vers,
      relation: rc.relation ?? 'parallele',
      note: rc.note,
      sourceId: source.id,
    };
  })
  .filter(Boolean);

console.log(`\nOuvrage   ${source.titre ?? '?'}${source.auteur ? ` — ${source.auteur}` : ''}`);
console.log(`Type      ${source.type ?? '?'}   Droits : ${source.droits ?? '?'}`);
console.log(`Extrait   ${entrees.length} entrées · ${commentaires.length} commentaires · ${themes.length} thèmes · ${referencesCroisees.length} références croisées`);

const exemples = commentaires.slice(0, 3).map((c) => formaterReference(c.reference));
if (exemples.length) console.log(`Exemples  ${exemples.join(' · ')}`);

for (const a of avertissements) console.log(`\n  ⚠  ${a}`);
for (const e of erreurs.slice(0, 20)) console.log(`\n  ✕  ${e}`);
if (erreurs.length > 20) console.log(`\n  ✕  … et ${erreurs.length - 20} autre(s).`);

if (erreurs.length && !forcer) {
  console.log('\nImport interrompu. Corrigez les erreurs, ou relancez avec --forcer.\n');
  process.exit(1);
}

const nomExport = `module${moduleId.replace(/[^A-Za-z0-9]/g, '')}`;
const contenu = `/**
 * ${source.titre}${source.auteur ? ` — ${source.auteur}` : ''}
 * Généré par scripts/importer-document.mjs à partir de ${path.basename(fichier)}.
 *
 * Droits : ${source.droits}${source.noteDroits ? ` — ${source.noteDroits}` : ''}
 */

import { ModuleConnaissance, Source } from '../../knowledge/types';

export const source${nomExport}: Source = ${JSON.stringify({ ...source, ajouteLe: source.ajouteLe ?? new Date().toISOString().slice(0, 10) }, null, 2)};

export const ${nomExport}: ModuleConnaissance = {
  id: ${JSON.stringify(moduleId)},
  source: source${nomExport},
  entrees: ${JSON.stringify(entrees, null, 2)},
  commentaires: ${JSON.stringify(commentaires, null, 2)},
  themes: ${JSON.stringify(themes, null, 2)},
  referencesCroisees: ${JSON.stringify(referencesCroisees, null, 2)},
};
`;

const chemin = path.join(racine, 'src/data/modules', `${moduleId}.ts`);
fs.mkdirSync(path.dirname(chemin), { recursive: true });
fs.writeFileSync(chemin, contenu);

console.log(`\n✓ Écrit ${path.relative(racine, chemin)}`);
console.log(`\nPour l'activer, dans src/knowledge/bootstrap.ts :`);
console.log(`  import { ${nomExport} } from '../data/modules/${moduleId}';`);
console.log(`  const modulesConnaissance: ModuleConnaissance[] = [ …, ${nomExport} ];`);
console.log(`\nPuis lancez « npm run test:base » pour vérifier l'intégration.\n`);
