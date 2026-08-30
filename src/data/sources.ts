/**
 * Registre des sources documentaires.
 *
 * Toute connaissance de l'application est rattachée à l'une de ces sources.
 * Ajouter un ouvrage transmis consiste à déclarer sa fiche ici, puis à
 * enregistrer le ou les modules qui en extraient le contenu.
 *
 * Le champ `provenance` est facultatif et purement documentaire : il note
 * d'où vient un ouvrage, sans rien conditionner.
 */

import { Source } from '../knowledge/types';

export const SOURCE_LSG = 'bible-lsg-1910';
export const SOURCE_PAROLE_VIVANTE = 'bible-parole-vivante';
export const SOURCE_REDACTION = 'lumiere-redaction';
export const SOURCE_METHODE_OIA = 'methode-oia';
export const SOURCE_OIA_GENERALE = 'ecole-apollos-oia-generale';
export const SOURCE_OIA_SIMPLIFIEE = 'ecole-apollos-oia-simplifiee';
export const SOURCE_WARREN = 'warren-methodes-etude';

export const sources: Source[] = [
  {
    id: SOURCE_LSG,
    titre: 'Bible Louis Segond 1910',
    auteur: 'Louis Segond',
    annee: '1910',
    langue: 'fr',
    type: 'bible',
    provenance: 'domaine-public',
    abreviation: 'LSG',
    ajouteLe: '2026-08-21',
  },
  {
    id: SOURCE_PAROLE_VIVANTE,
    titre: 'Parole Vivante — Nouveau Testament',
    auteur: 'Alfred Kuen',
    editeur: 'Éditions Farel / BLF',
    annee: '1976',
    langue: 'fr',
    type: 'bible',
    noteProvenance: `Transposition du Nouveau Testament. Le texte reformule pour éclairer le sens plutôt que de suivre le mot à mot : à lire à côté d'une traduction littérale, non à sa place.`,
    documentOrigine: 'Parole-Vivante-Kuen_-Alfred.pdf',
    abreviation: 'PV',
    ajouteLe: '2026-08-22',
  },
  {
    id: SOURCE_REDACTION,
    titre: 'Notes de rédaction Lumière',
    langue: 'fr',
    type: 'redaction-interne',
    provenance: 'interne',
    noteProvenance: `Contenu écrit pour l'application. Il est signalé comme tel et ne se substitue pas à un ouvrage de référence.`,
    abreviation: 'Lum.',
    ajouteLe: '2026-08-21',
  },
  {
    id: SOURCE_METHODE_OIA,
    titre: 'Méthode OIA — Observation, Interprétation, Application',
    langue: 'fr',
    type: 'enseignement',
    noteProvenance: `Document d'enseignement transmis par l'utilisateur (MODALITE_METHODE_OIA).`,
    documentOrigine: 'MODALITE_METHODE_OIA.pdf',
    abreviation: 'OIA',
    ajouteLe: '2026-08-22',
  },
  {
    id: SOURCE_OIA_GENERALE,
    titre: `Méthode O.I.A — École d'Apollos`,
    langue: 'fr',
    type: 'enseignement',
    noteProvenance: `Document d'enseignement transmis par l'utilisateur. Il fixe les sept questions de l'Observation, les trois de l'Interprétation, les neuf de l'Application et les quatre caractéristiques de l'application, avec l'exemple travaillé de Luc 8:22-25.`,
    documentOrigine: 'MEDITATION-OIA GENERALE.pdf',
    abreviation: 'OIA gén.',
    ajouteLe: '2026-08-29',
  },
  {
    id: SOURCE_OIA_SIMPLIFIEE,
    titre: `Méthode O.I.A simplifiée — École d'Apollos`,
    langue: 'fr',
    type: 'enseignement',
    noteProvenance: `Document d'enseignement transmis par l'utilisateur. Il fixe la méditation personnelle quotidienne : les questions A et B, puis les mouvements Priez et Obéissez. C'est la méthode que les étudiants utilisent d'après le calendrier de l'école.`,
    documentOrigine: 'MEDITATION OIA SIMPLIFIEE.pdf',
    abreviation: 'OIA simpl.',
    ajouteLe: '2026-08-29',
  },
  {
    id: SOURCE_WARREN,
    titre: `Méthodes d'étude de la Bible`,
    auteur: 'Rick Warren',
    editeur: 'La Maison de la Bible',
    annee: '2010',
    langue: 'fr',
    type: 'etude',
    noteProvenance: `Édition française de « Rick Warren's Bible Study Methods » (Zondervan, 1981 et 2006), traduite par Robert Youdi. L'ouvrage expose douze méthodes d'étude personnelle ; huit d'entre elles sont reprises dans l'application. C'est également la source des quatre caractéristiques de l'application — personnelle, pratique, réalisable et mesurable — que le document O.I.A de l'École d'Apollos cite déjà.`,
    documentOrigine: 'Rick Warren. Méthodes d étude de la Bible.pdf',
    abreviation: 'Warren',
    ajouteLe: '2026-08-30',
  },
];

export const sourcesParId: Record<string, Source> = Object.fromEntries(
  sources.map((s) => [s.id, s]),
);
