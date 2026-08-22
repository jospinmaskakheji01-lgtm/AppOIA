#!/usr/bin/env node
/**
 * Analyse « Sagesse vivante » d'Alfred Kuen — introductions au Cantique des
 * cantiques, à Job, aux Proverbes et à l'Ecclésiaste.
 *
 *   node scripts/analyseurs/sagesse-vivante.mjs <fichier.txt> [sortie.json]
 *
 * Ce volume contient deux choses : les introductions d'Alfred Kuen à quatre
 * livres poétiques, et une transcription de leur texte. Seules les
 * introductions sont extraites ici.
 *
 * Pourquoi le texte biblique est laissé de côté : dans le PDF aplati, les
 * appels de note et les numéros de verset prennent la même forme — un nombre
 * seul sur sa ligne, avec ou sans espace finale indifféremment. S'y ajoutent,
 * livre par livre, des irrégularités qui ne se recoupent pas : le titre du
 * Cantique est coupé sur deux lignes, son premier verset est collé à son
 * numéro, ailleurs le verset 1 n'est pas numéroté du tout. Un découpage
 * approximatif produirait des références fausses — et une référence fausse est
 * précisément l'erreur qu'une application biblique ne peut pas se permettre.
 * Le texte de ces quatre livres reste donc servi par Louis Segond.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chargerTS } from '../lib/charger-ts.mjs';

const racine = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const [entree, sortieArg] = process.argv.slice(2);
if (!entree) {
  console.error('Usage : node scripts/analyseurs/sagesse-vivante.mjs <fichier.txt> [sortie.json]');
  process.exit(1);
}

const { trouverLivre } = await chargerTS(path.join(racine, 'src/knowledge/reference.ts'));

/** Les quatre livres transcrits, dans l'ordre du volume. */
const LIVRES = [
  { nom: 'Cantique des cantiques', entetes: ['Cantique des cantiques', 'des cantiques'] },
  { nom: 'Job', entetes: ['Job'] },
  { nom: 'Proverbes', entetes: ['Proverbes'] },
  { nom: 'Ecclésiaste', entetes: ['Ecclésiaste'] },
];

const lignes = fs
  .readFileSync(entree, 'utf8')
  .split('\n')
  .filter((l) => !/^=== PAGE \d+ ===$/.test(l.trim()));

/**
 * Le nom d'un livre revient dans la table des matières, dans le titre de son
 * introduction et dans le corps des autres introductions. Seule l'ouverture de
 * son texte est suivie d'une avalanche de numéros de verset : on exige donc
 * au moins cinq nombres isolés dans les trente lignes qui suivent.
 */
function ouvreLeTexte(indice) {
  let vues = 0;
  let nombres = 0;
  for (let i = indice + 1; i < lignes.length && vues < 30; i++) {
    const l = lignes[i].trim();
    if (!l) continue;
    vues += 1;
    if (/^\d{1,3}$/.test(l)) nombres += 1;
  }
  return nombres >= 5;
}

/** Ligne où s'ouvre le texte de chaque livre. */
const departsTexte = [];
for (const livre of LIVRES) {
  let trouve = null;
  for (let i = 0; i < lignes.length; i++) {
    if (!livre.entetes.includes(lignes[i].trim())) continue;
    if (ouvreLeTexte(i)) trouve = i;
  }
  if (trouve !== null) departsTexte.push({ livre, ligne: trouve });
}
departsTexte.sort((a, b) => a.ligne - b.ligne);

/**
 * L'introduction d'un livre se termine où son texte commence. Son début se
 * trouve en remontant depuis là jusqu'au titre « Introduction… » le plus
 * proche : borner par la fin du livre précédent ferait entrer tout son texte
 * dans l'introduction du suivant.
 */
function debutIntroduction(departTexte, borneBasse) {
  for (let i = departTexte - 1; i > borneBasse; i--) {
    if (/^Introduction\b/.test(lignes[i].trim())) return i;
  }
  return -1;
}

const commentaires = [];

for (let i = 0; i < departsTexte.length; i++) {
  const { livre, ligne: depart } = departsTexte[i];
  const borneBasse = i === 0 ? 0 : departsTexte[i - 1].ligne;
  const debut = debutIntroduction(depart, borneBasse);
  const canon = trouverLivre(livre.nom);
  if (debut < 0 || !canon) continue;

  const corps = lignes
    .slice(debut, depart)
    .map((l) => l.trim())
    // Les nombres isolés sont des appels de note ou des numéros de page.
    .filter((l) => l && !/^\d{1,3}$/.test(l))
    .join(' ')
    .replace(/\s+/g, ' ')
    .trim();

  if (corps.length < 1500) continue;

  const sections = corps.match(/[\s\S]{2500,4000}?(?:\.\s|$)/g) ?? [corps];
  sections.forEach((section, n) => {
    commentaires.push({
      id: `sv-intro-${canon.rang}-${n + 1}`,
      reference: { livre: canon.nom, chapitre: 1 },
      type: n === 0 ? 'contexte' : 'structure',
      titre:
        sections.length > 1
          ? `Introduction à ${livre.nom} — ${n + 1}/${sections.length}`
          : `Introduction à ${livre.nom}`,
      texte: section.trim(),
      themes: ['sagesse', 'poésie', 'ancien testament'],
    });
  });
}

const sortie = sortieArg ?? path.join(racine, 'sagesse-vivante.json');
fs.writeFileSync(
  sortie,
  JSON.stringify(
    {
      module: { id: 'sagesse-vivante-introductions' },
      source: {
        id: 'sagesse-vivante',
        titre: 'Sagesse vivante — introductions aux livres poétiques',
        auteur: 'Alfred Kuen',
        editeur: 'BLF Éditions',
        annee: '2015',
        langue: 'fr',
        type: 'commentaire',
        abreviation: 'SV',
        documentOrigine: 'Sagesse-vivante-Alfred-Kuen.pdf',
        noteProvenance: `Seules les introductions sont extraites. La transcription du texte biblique qui accompagne ce volume n'a pas pu être découpée de façon sûre : dans le PDF aplati, les appels de note et les numéros de verset sont indistinguables.`,
      },
      commentaires,
    },
    null,
    1,
  ),
);

console.log('\nlivre                       texte@   sections   signes');
for (const d of departsTexte) {
  const s = commentaires.filter((c) => c.reference.livre === trouverLivre(d.livre.nom)?.nom);
  const signes = s.reduce((n, c) => n + c.texte.length, 0);
  console.log(
    d.livre.nom.padEnd(27),
    String(d.ligne).padStart(6),
    String(s.length).padStart(10),
    String(signes).padStart(9),
  );
}
console.log(`\nSections totales    ${commentaires.length}`);
console.log(`\n→ ${sortie}\n`);
