#!/usr/bin/env node
/**
 * Extrait le texte d'un document déposé dans `documents/`.
 *
 *   node scripts/extraire-document.mjs documents/mon-dictionnaire.pdf
 *   node scripts/extraire-document.mjs documents/          # tout le dossier
 *   node scripts/extraire-document.mjs documents/x.pdf --pages 10-40
 *
 * Le texte est écrit à côté du document, en `.txt`, avec un marqueur de page
 * `=== PAGE n ===`. Ces marqueurs servent ensuite à renseigner le champ
 * `localisation.page` des connaissances extraites, pour que chaque information
 * reste rattachée à son emplacement dans l'ouvrage.
 *
 * Formats : PDF (texte incorporé). Un PDF scanné sans couche texte ne donnera
 * rien — il faudrait le passer par une reconnaissance optique en amont.
 */
import fs from 'node:fs';
import path from 'node:path';

const args = process.argv.slice(2);
const cible = args[0];
const plage = args.includes('--pages') ? args[args.indexOf('--pages') + 1] : undefined;

if (!cible) {
  console.error('Usage : node scripts/extraire-document.mjs <fichier.pdf | dossier> [--pages 10-40]');
  process.exit(1);
}

const { getDocument } = await import('pdfjs-dist/legacy/build/pdf.mjs');

function bornes(total) {
  if (!plage) return [1, total];
  const [a, b] = plage.split('-').map(Number);
  return [Math.max(1, a || 1), Math.min(total, b || a || total)];
}

async function extraire(fichier) {
  const donnees = new Uint8Array(fs.readFileSync(fichier));
  const doc = await getDocument({ data: donnees, useSystemFonts: true }).promise;
  const [debut, fin] = bornes(doc.numPages);

  const morceaux = [];
  for (let i = debut; i <= fin; i++) {
    const page = await doc.getPage(i);
    const contenu = await page.getTextContent();
    let ligneY = null;
    let texte = '';
    for (const item of contenu.items) {
      if (!('str' in item)) continue;
      const y = item.transform[5];
      // Un saut vertical marque un changement de ligne.
      if (ligneY !== null && Math.abs(y - ligneY) > 2) texte += '\n';
      texte += item.str;
      ligneY = y;
    }
    morceaux.push(`=== PAGE ${i} ===\n${texte.replace(/\n{3,}/g, '\n\n').trim()}`);
    if ((i - debut + 1) % 25 === 0) {
      process.stdout.write(`\r  ${fichier} : page ${i}/${fin}`);
    }
  }

  const sortie = fichier.replace(/\.pdf$/i, '') + (plage ? `.p${plage}` : '') + '.txt';
  const texte = morceaux.join('\n\n');
  fs.writeFileSync(sortie, texte);

  const mots = texte.split(/\s+/).filter(Boolean).length;
  process.stdout.write('\r' + ' '.repeat(60) + '\r');
  console.log(`✓ ${path.basename(fichier)}`);
  console.log(`  ${doc.numPages} pages, ${debut}-${fin} extraites · ${mots.toLocaleString('fr-FR')} mots`);
  console.log(`  → ${sortie} (${(texte.length / 1024 / 1024).toFixed(1)} Mo)`);
  if (mots < doc.numPages * 20) {
    console.log(`  ⚠  Très peu de texte : le PDF est probablement scanné, sans couche texte.`);
  }
  return sortie;
}

const stat = fs.statSync(cible);
const fichiers = stat.isDirectory()
  ? fs
      .readdirSync(cible)
      .filter((f) => f.toLowerCase().endsWith('.pdf'))
      .map((f) => path.join(cible, f))
  : [cible];

if (fichiers.length === 0) {
  console.log('Aucun PDF trouvé.');
  process.exit(0);
}

console.log(`\n${fichiers.length} document(s) à extraire\n`);
for (const f of fichiers) {
  try {
    await extraire(f);
  } catch (e) {
    console.log(`✕ ${path.basename(f)} — ${e.message}`);
  }
  console.log();
}
