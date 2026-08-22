/**
 * Amorçage de la base de connaissances.
 *
 * C'est le seul point à modifier pour intégrer un nouveau document :
 * on importe le module produit lors de l'ingestion et on l'ajoute à la liste.
 * Voir `docs/BASE-DE-CONNAISSANCES.md` pour le déroulé complet.
 */

import { moduleLSG } from '../data/versions/lsg1910';
import { moduleparolevivante } from '../data/versions/parole-vivante';
import { moduleDictionnaire } from '../data/modules/dictionnaire';
import { modulepetitdictionnairebiblique } from '../data/modules/petit-dictionnaire-biblique';
import { modulesagessevivanteintroductions } from '../data/modules/sagesse-vivante-introductions';
import { moduleMethodeSources } from '../data/modules/methode-sources';
import { moduleMethodeOIA, moduleRedaction } from '../data/modules/derive';
import { enregistrerVersion, ModuleVersion } from './bible';
import { enregistrerModule } from './registre';
import { AnomalieModule, ModuleConnaissance } from './types';

/** Versions bibliques installées. Ajouter une version = ajouter une ligne. */
const modulesVersions: ModuleVersion[] = [moduleLSG, moduleparolevivante];

/** Modules de connaissance installés. Ajouter un ouvrage = ajouter une ligne. */
const modulesConnaissance: ModuleConnaissance[] = [
  moduleRedaction,
  moduleDictionnaire,
  modulepetitdictionnairebiblique,
  modulesagessevivanteintroductions,
  moduleMethodeOIA,
  moduleMethodeSources,
];

export interface RapportAmorcage {
  versions: number;
  modules: number;
  anomalies: (AnomalieModule & { module: string })[];
}

let rapport: RapportAmorcage | undefined;

/** Idempotent : les appels suivants renvoient le rapport du premier. */
export function amorcerBaseDeConnaissances(): RapportAmorcage {
  if (rapport) return rapport;

  for (const module of modulesVersions) enregistrerVersion(module);

  const anomalies: (AnomalieModule & { module: string })[] = [];
  for (const module of modulesConnaissance) {
    for (const anomalie of enregistrerModule(module)) {
      anomalies.push({ ...anomalie, module: module.id });
    }
  }

  rapport = {
    versions: modulesVersions.length,
    modules: modulesConnaissance.length,
    anomalies,
  };
  return rapport;
}

export function rapportAmorcage(): RapportAmorcage | undefined {
  return rapport;
}
