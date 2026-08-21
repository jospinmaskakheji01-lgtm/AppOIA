/**
 * La méthode OIA — Observation, Interprétation, Application.
 * Structure fidèle au document de référence : les trois temps, leurs questions
 * et l'exemple travaillé de Luc 8:22-25.
 */

export type CleObservation = 'qui' | 'ou' | 'quand' | 'comment' | 'pourquoi' | 'quoi' | 'donc';
export type CleInterpretation = 'destinataires' | 'salut' | 'eglise';
export type CleApplication =
  | 'exemple'
  | 'peche'
  | 'promesse'
  | 'priere'
  | 'commandement'
  | 'condition'
  | 'erreur'
  | 'verset'
  | 'defi';

export interface QuestionOIA<C extends string> {
  cle: C;
  question: string;
  /** Ce que la question cherche exactement, tel que formulé par la méthode. */
  aide: string;
  /** Sous-questions à se poser pour y répondre. */
  sousQuestions: string[];
  facultative?: boolean;
}

export const TEMPS_OIA = [
  {
    cle: 'observation' as const,
    lettre: 'O',
    titre: 'Observation',
    question: 'Que dit le texte ?',
    consigne: `Répondre à ces différentes questions est la meilleure manière de faire une observation complète et détaillée. Restez dans le texte : ne dites pas encore ce qu'il signifie.`,
  },
  {
    cle: 'interpretation' as const,
    lettre: 'I',
    titre: 'Interprétation',
    question: `Qu'est-ce que le texte veut dire ?`,
    consigne: `Cherchez l'enseignement que l'auteur voulait communiquer à ses premiers destinataires. La lecture sur deux ou trois versions est recommandée.`,
  },
  {
    cle: 'application' as const,
    lettre: 'A',
    titre: 'Application',
    question: 'Que dois-je faire ?',
    consigne: `Comment le texte s'applique à votre vie. Ces questions ne sont pas toutes obligatoires : répondez à celles que le texte soulève réellement.`,
  },
];

export const questionsObservation: QuestionOIA<CleObservation>[] = [
  {
    cle: 'qui',
    question: 'Qui ?',
    aide: `Il s'agit de savoir qui a écrit le livre, quels sont les personnages qui se retrouvent dans ce texte, et à qui l'auteur s'adresse.`,
    sousQuestions: [
      `Qui a écrit le livre ?`,
      `Quels sont les personnages présents dans ce texte ?`,
      `À qui l'auteur s'adresse-t-il (destinataire) ?`,
    ],
  },
  {
    cle: 'ou',
    question: 'Où ?',
    aide: `Il s'agit de situer la scène et les personnes dans l'espace.`,
    sousQuestions: [
      `Où se passe la scène ?`,
      `D'où viennent les personnes ? Où vont-elles ?`,
      `Où se tient l'auteur ? Où étaient ses destinataires ?`,
    ],
  },
  {
    cle: 'quand',
    question: 'Quand ?',
    aide: `Il s'agit de situer le texte et l'action dans le temps.`,
    sousQuestions: [
      `En quelle année l'auteur écrit-il ?`,
      `À quel moment de la journée ou de la semaine a lieu l'action ?`,
      `Combien de temps dure-t-elle ? Avant et après quel événement ?`,
    ],
  },
  {
    cle: 'comment',
    question: 'Comment ?',
    aide: `Il s'agit de suivre le déroulement de l'action et les attitudes des personnes.`,
    sousQuestions: [
      `Comment se déroule l'action ?`,
      `Comment se succèdent et s'enchaînent les faits ?`,
      `Comment agissent les personnes ? Quelles attitudes ont-elles vis-à-vis de l'autre ?`,
    ],
  },
  {
    cle: 'pourquoi',
    question: 'Pourquoi ?',
    aide: `Il s'agit de comprendre les motivations. Vos réponses doivent être trouvées dans cette portion de texte.`,
    sousQuestions: [
      `Pourquoi les acteurs du récit agissent-ils ainsi ?`,
      `Que dit l'auteur sur leur pensée, leur attitude envers Dieu ou envers les autres ?`,
    ],
  },
  {
    cle: 'quoi',
    question: 'Quoi ?',
    aide: `Il s'agit de savoir ce que dit exactement l'auteur.`,
    sousQuestions: [
      `Que dit exactement l'auteur ?`,
      `Que font les acteurs dans cette scène ?`,
      `Quel est le contenu essentiel de ce discours ?`,
    ],
  },
  {
    cle: 'donc',
    question: 'Donc ?',
    aide: `Il s'agit de faire la conclusion de toutes les réponses précédentes.`,
    sousQuestions: [`Rassemblez vos réponses en un seul paragraphe.`],
  },
];

export const questionsInterpretation: QuestionOIA<CleInterpretation>[] = [
  {
    cle: 'destinataires',
    question: `Quel enseignement l'auteur voulait-il communiquer à ses premiers destinataires ?`,
    aide: `La lecture sur deux ou trois versions est recommandée pour cette question.`,
    sousQuestions: [
      `Qu'est-ce que les premiers lecteurs devaient comprendre ?`,
      `Qu'est-ce que cela changeait pour eux ?`,
    ],
  },
  {
    cle: 'salut',
    question: `Où se situe ce texte dans l'histoire du Salut et par rapport à l'évangile ?`,
    aide: `Il s'agit de savoir dans quel testament se trouve le livre lu : l'Ancien Testament ou le Nouveau Testament.`,
    sousQuestions: [
      `Ancien ou Nouveau Testament ?`,
      `Avant, pendant ou après la venue de Jésus-Christ ?`,
      `Comment ce texte annonce-t-il l'évangile ou en découle-t-il ?`,
    ],
  },
  {
    cle: 'eglise',
    question: `Quel enseignement général Dieu veut-il communiquer à son église ?`,
    aide: `Passez du message d'origine à la vérité permanente, valable pour l'Église d'aujourd'hui.`,
    sousQuestions: [
      `Quelles vérités ce texte enseigne-t-il sur Dieu ?`,
      `Quelles vérités enseigne-t-il sur l'homme ?`,
    ],
  },
];

export const questionsApplication: QuestionOIA<CleApplication>[] = [
  {
    cle: 'exemple',
    question: `Y a-t-il un exemple à suivre ?`,
    aide: `Une attitude, une décision, une foi que vous pouvez imiter.`,
    sousQuestions: [],
    facultative: true,
  },
  {
    cle: 'peche',
    question: `Y a-t-il un péché à éviter ?`,
    aide: `Quelque chose que le texte désigne comme mauvais devant Dieu.`,
    sousQuestions: [],
    facultative: true,
  },
  {
    cle: 'promesse',
    question: `Y a-t-il une promesse à réclamer ?`,
    aide: `Une parole de Dieu sur laquelle vous pouvez vous appuyer.`,
    sousQuestions: [],
    facultative: true,
  },
  {
    cle: 'priere',
    question: `Y a-t-il une prière à répéter ?`,
    aide: `Une prière du texte que vous pouvez faire vôtre.`,
    sousQuestions: [],
    facultative: true,
  },
  {
    cle: 'commandement',
    question: `Y a-t-il un commandement à obéir ?`,
    aide: `Un ordre clair, qui appelle une obéissance concrète.`,
    sousQuestions: [],
    facultative: true,
  },
  {
    cle: 'condition',
    question: `Y a-t-il une condition à remplir ?`,
    aide: `Un « si » dont dépend une promesse ou une bénédiction.`,
    sousQuestions: [],
    facultative: true,
  },
  {
    cle: 'erreur',
    question: `Y a-t-il une erreur à éviter ?`,
    aide: `Un raisonnement ou un comportement que le texte corrige.`,
    sousQuestions: [],
    facultative: true,
  },
  {
    cle: 'verset',
    question: `Y a-t-il un verset à mémoriser ?`,
    aide: `Le verset que vous voulez emporter avec vous.`,
    sousQuestions: [],
    facultative: true,
  },
  {
    cle: 'defi',
    question: `Y a-t-il un défi à relever ?`,
    aide: `Un pas concret, daté, que vous décidez de poser.`,
    sousQuestions: [],
    facultative: true,
  },
];

export const NOTE_APPLICATION = `Ces questions ne sont pas toutes obligatoires à répondre.`;

/** Exemple travaillé de la méthode, tel qu'il figure dans le document de référence. */
export const exempleOIA = {
  reference: 'Luc 8:22-25',
  passageId: 'lc8',
  observation: {
    qui: `Le médecin Luc a écrit ce livre. Le livre a été écrit à l'excellent Théophile. Les personnages de ce texte : Jésus et ses disciples.`,
    ou: `La scène se passe dans un lac. Jésus et ses disciples étaient dans la barque.`,
    quand: `Nous ne savons pas clairement quand l'auteur a écrit le livre. C'est pendant la deuxième moitié du premier siècle après Jésus-Christ. Dans le texte, nous ne savons pas dans quel moment de la journée le récit s'est passé.`,
    comment: `Devant les difficultés, les disciples ont agi par peur en réveillant Jésus, pourtant Jésus dormait tranquillement dans la barque.`,
    pourquoi: `Jésus dormait en plein tourbillon et ses disciples étaient agités et avaient peur.`,
    quoi: `Jésus et ses disciples montent dans une barque pour traverser le lac. Une tempête éclate, mettant la barque en danger. Les disciples paniquent et réveillent Jésus, qui calme la tempête en menaçant le vent et les vagues. Le lac redevient calme. Jésus interroge les disciples sur leur foi. Ils sont remplis de crainte et d'étonnement devant le pouvoir de Jésus sur les éléments naturels. Les disciples se demandent qui est vraiment cet homme qui commande même au vent et à l'eau.`,
    donc: `Le médecin Luc a écrit ce livre à l'excellent Théophile. Il a rédigé ce livre pendant la deuxième moitié du premier siècle après Jésus-Christ. Les personnages de ce récit sont Jésus et ses disciples. La scène se déroule alors qu'ils étaient à bord d'une barque. Face à une tempête, les disciples réveillent Jésus qui dormait paisiblement malgré l'agitation. Jésus apaise la tempête, démontrant son autorité sur la nature. Jésus reprend ses disciples pour leur manque de foi. Ils s'interrogent sur son identité et la réalisation de sa capacité à commander aux éléments naturels (vents et tempêtes).`,
  } satisfies Record<CleObservation, string>,
  interpretation: {
    salut: `Le livre de Luc se trouve dans le Nouveau Testament.`,
    destinataires: `Théophile, et à travers lui les lecteurs de Luc, devaient reconnaître l'identité de Jésus : celui qui commande au vent et à l'eau est plus qu'un maître, il exerce l'autorité de Dieu lui-même.`,
    eglise: `Quelques vérités sur ce texte : Jésus est capable de calmer toutes sortes de tempêtes de nos vies ; dans notre marche avec Jésus, nous découvrons d'autres facettes de Jésus ; faire confiance à Jésus peu importe les moments de difficultés.`,
  } satisfies Record<CleInterpretation, string>,
  application: {
    erreur: `Exemple à ne pas suivre : les disciples qui ont eu peur et manqué de foi dans les moments difficiles, à la place de mettre leur foi en Jésus.`,
    defi: `Je m'engage à faire confiance à Jésus peu importe les difficultés et à exercer ma foi.`,
    verset: `« Puis il leur dit : où est votre foi ? Saisis de frayeur et d'étonnement, ils se dirent les uns aux autres : quel est donc celui-ci, qui commande même au vent et à l'eau, et à qui ils obéissent ? » (Luc 8:25)`,
  } as Partial<Record<CleApplication, string>>,
  engagement: `Je m'engage à faire confiance à Jésus peu importe les difficultés et à exercer ma foi.`,
  versetMemoire: {
    ref: 'Luc 8:25',
    texte: `Puis il leur dit: Où est votre foi? Saisis de frayeur et d'étonnement, ils se dirent les uns aux autres: Quel est donc celui-ci, qui commande même au vent et à l'eau, et à qui ils obéissent?`,
  },
};

export const questionsParTemps = {
  observation: questionsObservation,
  interpretation: questionsInterpretation,
  application: questionsApplication,
};

/** Progression d'une étude : proportion de champs remplis, par temps. */
export function progressionTemps(
  reponses: Record<string, string> | undefined,
  temps: 'observation' | 'interpretation' | 'application',
): number {
  const questions = questionsParTemps[temps];
  const obligatoires = questions.filter((q) => !q.facultative);
  const cible = obligatoires.length > 0 ? obligatoires : questions;
  const remplies = cible.filter((q) => (reponses?.[q.cle] ?? '').trim().length > 0).length;
  return cible.length === 0 ? 0 : remplies / cible.length;
}
