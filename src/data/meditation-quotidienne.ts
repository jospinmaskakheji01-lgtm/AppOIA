import { CleQuestionA, CleQuestionB } from './oia-simplifiee';

/**
 * La méditation quotidienne — préparée, à lire.
 *
 * L'application n'a ni connexion ni modèle de langue embarqué : une méditation
 * « écrite le matin même » sur le téléphone n'existerait pas. Elle est donc
 * écrite d'avance et livrée avec l'application, qui la choisit, va chercher le
 * texte biblique dans la version installée et met le tout en page. L'utilisateur
 * n'a rien à saisir : il lit.
 *
 * Ce n'est pas un pis-aller. Un texte relu vaut mieux qu'un texte improvisé,
 * surtout quand il prétend dire ce qu'un passage biblique enseigne.
 *
 * La forme suit la méthode OIA simplifiée de l'École d'Apollos, sans en dévier :
 * MÉDITEZ (les questions A, sur le texte), le verset qui interpelle et les
 * quatre axes de prière (les questions B), PRIEZ, OBÉISSEZ. Ce que l'utilisateur
 * remplirait lui-même dans l'atelier est ici déjà rédigé — les mêmes questions,
 * dans le même ordre, de sorte qu'un jour où il voudra la faire lui-même, il
 * saura déjà à quoi elle ressemble.
 *
 * Le texte biblique n'est jamais recopié ici : il est lu dans la version
 * installée, à partir de la référence. Les trois natures ne se mélangent pas —
 * le texte biblique reste le texte biblique, et ces méditations restent ce
 * qu'elles sont : un commentaire, écrit pour l'application.
 */

export type GenreMeditation =
  | 'parabole'
  | 'recit'
  | 'psaume'
  | 'enseignement'
  | 'epitre'
  | 'priere'
  | 'promesse';

export const GENRES: Record<GenreMeditation, { titre: string; pluriel: string }> = {
  parabole: { titre: 'Parabole de Jésus', pluriel: 'Paraboles de Jésus' },
  recit: { titre: 'Récit biblique', pluriel: 'Récits bibliques' },
  psaume: { titre: 'Psaume', pluriel: 'Psaumes' },
  enseignement: { titre: 'Enseignement de Jésus', pluriel: 'Enseignements de Jésus' },
  epitre: { titre: 'Lettre des apôtres', pluriel: 'Lettres des apôtres' },
  priere: { titre: 'Prière de la Bible', pluriel: 'Prières de la Bible' },
  promesse: { titre: 'Promesse de Dieu', pluriel: 'Promesses de Dieu' },
};

/** Les axes de prière : les questions B, moins le verset qui interpelle. */
export type CleAxePriere = Exclude<CleQuestionB, 'versetInterpellant'>;

export interface MeditationQuotidienne {
  id: string;
  genre: GenreMeditation;
  titre: string;
  /**
   * Le ou les passages à lire, écrits comme on les écrit — « Luc 15:11-32 ».
   * Plusieurs quand la méditation franchit une frontière de chapitre : une
   * référence n'en franchit pas, et découper vaut mieux que de faire semblant.
   */
  references: string[];
  /** Deux ou trois phrases qui situent le passage, avant de le lire. */
  situation: string;
  /**
   * Les réponses aux questions A. Une clé absente veut dire que le texte ne dit
   * rien là-dessus — et c'est une réponse : la méthode marque ces questions
   * facultatives précisément parce que tout passage ne contient pas un ordre,
   * une promesse ou un avertissement.
   */
  mediter: Partial<Record<CleQuestionA, string>>;
  /** La référence du verset à emporter, prise dans le passage lu. */
  versetAEmporter: string;
  /** Les quatre axes de la prière, rédigés à la première personne. */
  prier: Partial<Record<CleAxePriere, string>>;
  /** Une seule action, personnelle, pratique, réalisable, pour la journée. */
  obeir: string;
}

import { meditationsParaboles } from './meditations-quotidiennes/paraboles';
import { meditationsRecits } from './meditations-quotidiennes/recits';
import { meditationsPsaumes } from './meditations-quotidiennes/psaumes';
import { meditationsEnseignements } from './meditations-quotidiennes/enseignements';
import { meditationsEpitres } from './meditations-quotidiennes/epitres';
import { meditationsPrieresEtPromesses } from './meditations-quotidiennes/prieres-promesses';

/**
 * L'ordre de parcours.
 *
 * Les méditations ne sont pas servies par genre, un mois de paraboles puis un
 * mois de psaumes : elles alternent. Un matin on lit un récit, le lendemain une
 * lettre, le surlendemain un psaume. C'est la Bible elle-même qui est ainsi
 * faite, et la variété tient un lecteur là où la répétition l'use.
 */
function entrelacer(groupes: MeditationQuotidienne[][]): MeditationQuotidienne[] {
  const restants = groupes.map((g) => [...g]);
  const sortie: MeditationQuotidienne[] = [];
  while (restants.some((g) => g.length > 0)) {
    // Le groupe le plus fourni passe en premier à chaque tour : sans quoi les
    // genres nombreux s'entasseraient tous à la fin du parcours.
    restants.sort((a, b) => b.length - a.length);
    for (const groupe of restants) {
      const suivante = groupe.shift();
      if (suivante) sortie.push(suivante);
    }
  }
  return sortie;
}

export const meditationsQuotidiennes: MeditationQuotidienne[] = entrelacer([
  meditationsParaboles,
  meditationsRecits,
  meditationsPsaumes,
  meditationsEnseignements,
  meditationsEpitres,
  meditationsPrieresEtPromesses,
]);

export function getMeditationQuotidienne(id: string): MeditationQuotidienne | undefined {
  return meditationsQuotidiennes.find((m) => m.id === id);
}

/**
 * La méditation d'un rang donné dans le parcours.
 *
 * Le parcours boucle : arrivé au bout, on recommence. Une méditation relue un
 * an plus tard n'est pas la même méditation, parce que ce n'est plus le même
 * lecteur.
 */
export function meditationAuRang(rang: number): MeditationQuotidienne {
  const n = meditationsQuotidiennes.length;
  return meditationsQuotidiennes[((rang % n) + n) % n];
}

export const NOMBRE_DE_MEDITATIONS = meditationsQuotidiennes.length;
