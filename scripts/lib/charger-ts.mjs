/**
 * Charge un module TypeScript du projet depuis un script Node.
 * Les scripts d'ingestion réutilisent ainsi le canon et les validateurs de
 * l'application, sans en dupliquer une deuxième version qui divergerait.
 */
import { build } from 'esbuild';
import { createRequire } from 'node:module';
import { mkdtempSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';

export async function chargerTS(entree) {
  const dossier = mkdtempSync(path.join(tmpdir(), 'lumiere-'));
  const sortie = path.join(dossier, 'module.cjs');
  await build({
    entryPoints: [entree],
    bundle: true,
    platform: 'node',
    format: 'cjs',
    outfile: sortie,
    logLevel: 'error',
  });
  return createRequire(import.meta.url)(sortie);
}
