/**
 * La méthode OIA simplifiée — la méditation personnelle quotidienne.
 *
 * Structure fidèle au document de référence de l'École d'Apollos
 * (« MEDITATION OIA SIMPLIFIEE »). Le document distingue nettement les deux
 * usages : la méthode OIA générale sert à l'étude biblique, qui demande une à
 * deux heures ; la méthode simplifiée sert à la méditation personnelle, celle
 * qu'on peut tenir en cinq, dix ou quinze minutes avant la journée. C'est elle
 * que les étudiants utilisent pour leur méditation et pour la remise de cahier,
 * d'après le calendrier de l'école.
 *
 * Elle se déroule en quatre mouvements : MÉDITEZ (les questions A, sur le
 * texte), les questions B (sur moi et ma prière), PRIEZ, puis OBÉISSEZ. Les
 * questions A et B sont les deux séries que le document nomme ainsi.
 */

import { QuestionOIA } from './oia';

export type CleQuestionA =
  | 'sujet'
  | 'trinite'
  | 'exemple'
  | 'ordre'
  | 'promesse'
  | 'avertissement'
  | 'verite'
  | 'passages';

export type CleQuestionB =
  | 'versetInterpellant'
  | 'repentir'
  | 'croireObeir'
  | 'remercier'
  | 'demander';

export type MouvementSimplifie = 'mediter' | 'prier' | 'obeir';

export const MOUVEMENTS_SIMPLIFIES = [
  {
    cle: 'mediter' as const,
    titre: 'Méditez',
    consigne: `Réfléchir sur le passage lu.`,
    detail: `La méthode répond à deux séries de questions : les questions A, qui regardent le texte, et les questions B, qui regardent votre prière.`,
  },
  {
    cle: 'prier' as const,
    titre: 'Priez',
    consigne: `Transformez en prière tout ce que vous avez médité.`,
    detail: `Faites des proclamations sur la base de cette méditation, en vous édifiant à la Parole. Mémorisez en partie ou en entier le plus beau verset.`,
  },
  {
    cle: 'obeir' as const,
    titre: 'Obéissez',
    consigne: `Allez et mettez en pratique ce que Dieu vous a dit.`,
    detail: `C'est le dernier mouvement, et il se joue en dehors de l'application : dans la journée qui commence.`,
  },
];

/** Les questions A : ce que le passage lu dit, et ce que Dieu y révèle. */
export const questionsA: QuestionOIA<CleQuestionA>[] = [
  {
    cle: 'sujet',
    question: `De qui ou de quoi parlent ces versets ?`,
    aide: `Commencez par le plus simple : le sujet du passage, avant toute conclusion.`,
    sousQuestions: [],
  },
  {
    cle: 'trinite',
    question: `Est-ce que ce passage m'apprend quelque chose sur Dieu le Père, Dieu le Fils et Dieu le Saint-Esprit ?`,
    aide: `Un caractère, une œuvre, une intention de Dieu que le texte laisse voir.`,
    sousQuestions: [],
    facultative: true,
  },
  {
    cle: 'exemple',
    question: `Y a-t-il un exemple à suivre ou à ne pas suivre ?`,
    aide: `Une attitude ou une décision que le texte propose, ou dont il détourne.`,
    sousQuestions: [],
    facultative: true,
  },
  {
    cle: 'ordre',
    question: `Y a-t-il un ordre auquel obéir ?`,
    aide: `Un commandement clair, qui appelle une obéissance concrète.`,
    sousQuestions: [],
    facultative: true,
  },
  {
    cle: 'promesse',
    question: `Y a-t-il une promesse ?`,
    aide: `Une parole de Dieu sur laquelle vous appuyer aujourd'hui.`,
    sousQuestions: [],
    facultative: true,
  },
  {
    cle: 'avertissement',
    question: `Y a-t-il un avertissement ?`,
    aide: `Un danger que le texte signale, et dont il vous protège.`,
    sousQuestions: [],
    facultative: true,
  },
  {
    cle: 'verite',
    question: `Quelle vérité Dieu me révèle-t-il ?`,
    aide: `Ce que vous retenez du passage, dit en vos propres mots.`,
    sousQuestions: [],
  },
  {
    cle: 'passages',
    question: `Y a-t-il d'autres passages de la Bible qui m'aident à comprendre ce que j'ai lu ?`,
    aide: `L'Écriture s'éclaire par l'Écriture. Notez les références qui vous reviennent.`,
    sousQuestions: [],
    facultative: true,
  },
];

/** Les questions B : le verset qui interpelle, et les quatre axes de la prière. */
export const questionsB: QuestionOIA<CleQuestionB>[] = [
  {
    cle: 'versetInterpellant',
    question: `Quel est le verset qui m'interpelle le plus ?`,
    aide: `Le plus beau verset du passage — celui que vous emporterez et mémoriserez.`,
    sousQuestions: [],
  },
  {
    cle: 'repentir',
    question: `Y a-t-il quelque chose dont j'ai à me repentir ?`,
    aide: `Pour ma prière : ce que Dieu me montre et que je dois lui confesser.`,
    sousQuestions: [],
    facultative: true,
  },
  {
    cle: 'croireObeir',
    question: `Y a-t-il quelque chose auquel croire et obéir ?`,
    aide: `Pour ma prière : ce que Dieu me demande de recevoir et de faire.`,
    sousQuestions: [],
    facultative: true,
  },
  {
    cle: 'remercier',
    question: `Y a-t-il quelque chose pour lequel le remercier et le louer ?`,
    aide: `Pour ma prière : ce que Dieu me montre de sa bonté.`,
    sousQuestions: [],
    facultative: true,
  },
  {
    cle: 'demander',
    question: `Y a-t-il quelque chose pour lequel lui formuler une demande ?`,
    aide: `Pour ma prière : ce que je lui présente aujourd'hui.`,
    sousQuestions: [],
    facultative: true,
  },
];

export const NOTE_SIMPLIFIEE = `C'est cette méthode que les étudiants utilisent pour la méditation, d'après le calendrier de l'École d'Apollos.`;

export const questionsSimplifiees = { questionsA, questionsB };

/** Progression d'une méditation simplifiée : proportion de champs remplis. */
export function progressionSimplifiee(
  reponses: Record<string, string> | undefined,
  serie: 'questionsA' | 'questionsB',
): number {
  const questions = questionsSimplifiees[serie];
  const obligatoires = questions.filter((q) => !q.facultative);
  const cible = obligatoires.length > 0 ? obligatoires : questions;
  const remplies = cible.filter((q) => (reponses?.[q.cle] ?? '').trim().length > 0).length;
  return cible.length === 0 ? 0 : remplies / cible.length;
}
