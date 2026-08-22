/**
 * Registre des sources documentaires.
 *
 * Toute connaissance de l'application est rattachée à l'une de ces sources.
 * Ajouter un ouvrage transmis consiste à déclarer sa fiche ici, puis à
 * enregistrer le ou les modules qui en extraient le contenu.
 *
 * Le champ `droits` conditionne ce que l'application a le droit de stocker :
 * un ouvrage `sous-droits` ne doit contenir que des renvois et de courtes
 * citations, jamais une reproduction intégrale.
 */

import { Source } from '../knowledge/types';

export const SOURCE_LSG = 'bible-lsg-1910';
export const SOURCE_REDACTION = 'lumiere-redaction';
export const SOURCE_METHODE_OIA = 'methode-oia';

export const sources: Source[] = [
  {
    id: SOURCE_LSG,
    titre: 'Bible Louis Segond 1910',
    auteur: 'Louis Segond',
    annee: '1910',
    langue: 'fr',
    type: 'bible',
    droits: 'domaine-public',
    noteDroits: `Domaine public. Reproduction intégrale autorisée.`,
    abreviation: 'LSG',
    ajouteLe: '2026-08-21',
  },
  {
    id: SOURCE_REDACTION,
    titre: 'Notes de rédaction Lumière',
    langue: 'fr',
    type: 'redaction-interne',
    droits: 'interne',
    noteDroits: `Contenu écrit pour l'application. Il est signalé comme tel et ne se substitue pas à un ouvrage de référence.`,
    abreviation: 'Lum.',
    ajouteLe: '2026-08-21',
  },
  {
    id: SOURCE_METHODE_OIA,
    titre: 'Méthode OIA — Observation, Interprétation, Application',
    langue: 'fr',
    type: 'enseignement',
    droits: 'a-verifier',
    noteDroits: `Document d'enseignement transmis par l'utilisateur (MODALITE_METHODE_OIA). Usage interne à l'application ; vérifier les droits avant toute diffusion.`,
    documentOrigine: 'MODALITE_METHODE_OIA.pdf',
    abreviation: 'OIA',
    ajouteLe: '2026-08-22',
  },
];

export const sourcesParId: Record<string, Source> = Object.fromEntries(
  sources.map((s) => [s.id, s]),
);
