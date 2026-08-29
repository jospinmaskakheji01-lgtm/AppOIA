/**
 * La méthode OIA — Observation, Interprétation, Application.
 *
 * Structure fidèle au document de référence de l'École d'Apollos
 * (« MEDITATION-OIA GENERALE ») : les trois temps, leurs questions, les
 * caractéristiques de l'application et l'exemple travaillé de Luc 8:22-25.
 *
 * Ce document réserve la méthode OIA générale à l'étude biblique. Pour la
 * méditation personnelle quotidienne, il renvoie à la méthode OIA simplifiée,
 * décrite dans `oia-simplifiee.ts`.
 */

export type CleObservation = 'qui' | 'quoi' | 'ou' | 'quand' | 'comment' | 'pourquoi' | 'donc';
export type CleInterpretation = 'destinataires' | 'eglise' | 'principes';
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
    consigne: `Pour mieux aborder cette partie, posez-vous les sept questions du journaliste. Restez dans le texte : ne dites pas encore ce qu'il signifie.`,
  },
  {
    cle: 'interpretation' as const,
    lettre: 'I',
    titre: 'Interprétation',
    question: 'Que signifie le texte ?',
    consigne: `Cherchez l'enseignement que l'auteur voulait communiquer à ses premiers destinataires. Sur ce point, la lecture de deux ou trois versions est recommandée.`,
  },
  {
    cle: 'application' as const,
    lettre: 'A',
    titre: 'Application',
    question: `Comment le texte s'applique-t-il à moi ?`,
    consigne: `Pour mieux aborder cette partie, posez-vous ces différentes questions. Elles ne sont pas toutes obligatoires : répondez à celles que le texte soulève réellement.`,
  },
];

export const questionsObservation: QuestionOIA<CleObservation>[] = [
  {
    cle: 'qui',
    question: 'Qui ?',
    aide: `Il s'agit de savoir qui a écrit le livre, quels sont les personnages qui se retrouvent dans ce passage, et à qui l'auteur s'adresse.`,
    sousQuestions: [
      `Qui a écrit le livre d'où le passage est tiré ?`,
      `Quels sont les personnages qui se retrouvent dans ce passage ?`,
      `À qui l'auteur s'adresse-t-il ?`,
    ],
  },
  {
    cle: 'quoi',
    question: 'Quoi ?',
    aide: `Il s'agit de savoir ce que dit exactement ce texte.`,
    sousQuestions: [
      `Que dit exactement ce texte ? Ou de quoi parle ce texte ?`,
      `Que font les acteurs dans cette scène ?`,
      `Quel est le thème principal de ce passage ?`,
    ],
  },
  {
    cle: 'ou',
    question: 'Où ?',
    aide: `Il s'agit de situer la scène, les personnes et l'auteur dans l'espace.`,
    sousQuestions: [
      `Où se passe la scène ?`,
      `D'où viennent les personnes ? Où vont-elles ?`,
      `Où écrivait l'auteur ? Où se tient-il ?`,
      `Où étaient ses destinataires ?`,
    ],
  },
  {
    cle: 'quand',
    question: 'Quand ?',
    aide: `Il s'agit de situer le texte et l'action dans le temps.`,
    sousQuestions: [
      `En quelle année l'auteur a-t-il écrit le livre ?`,
      `À quel moment de la journée, ou de la semaine, a lieu l'action de la scène ?`,
      `Combien de temps dure-t-elle ?`,
      `Avant et après quel événement ?`,
    ],
  },
  {
    cle: 'comment',
    question: 'Comment ?',
    aide: `Il s'agit de suivre le déroulement de l'action et les attitudes des personnes.`,
    sousQuestions: [
      `Comment se déroule l'action ?`,
      `Comment se succèdent et s'enchaînent les faits ?`,
      `Comment agissent les personnes ?`,
      `Quelles attitudes ont-elles vis-à-vis de l'autre ?`,
      `Quel est le genre littéraire ?`,
    ],
  },
  {
    cle: 'pourquoi',
    question: 'Pourquoi ?',
    aide: `Il s'agit de comprendre les motivations. À cette étape, limitez-vous aux réponses qui se retrouvent dans le passage à méditer.`,
    sousQuestions: [
      `Quel est l'objectif de l'auteur ?`,
      `Pourquoi les acteurs du récit agissent-ils ainsi ?`,
      `Que dit l'auteur sur leur pensée, leur attitude envers Dieu ou envers les autres ?`,
    ],
  },
  {
    cle: 'donc',
    question: 'Donc ?',
    aide: `Il s'agit de faire la conclusion de toutes les réponses précédentes.`,
    sousQuestions: [
      `Quelles sont les conséquences de cet incident, de cet enseignement ?`,
      `Quel en est l'effet sur les lecteurs, sur les premiers auditeurs ?`,
    ],
  },
];

export const questionsInterpretation: QuestionOIA<CleInterpretation>[] = [
  {
    cle: 'destinataires',
    question: `Quel enseignement l'auteur voulait-il communiquer à ses premiers destinataires ?`,
    aide: `Sur cette question, la lecture de deux ou trois versions est recommandée.`,
    sousQuestions: [
      `Qu'est-ce que les premiers lecteurs devaient comprendre ?`,
      `Qu'est-ce que cela changeait pour eux ?`,
    ],
  },
  {
    cle: 'eglise',
    question: `Quel enseignement général, ou quelle vérité, Dieu veut-il communiquer aux chrétiens ?`,
    aide: `Passez du message d'origine à la vérité que Dieu adresse aujourd'hui à ceux qui le suivent.`,
    sousQuestions: [
      `Quelles vérités ce texte enseigne-t-il sur Dieu ?`,
      `Quelles vérités enseigne-t-il sur l'homme ?`,
    ],
  },
  {
    cle: 'principes',
    question: `Quels principes permanents se dégagent du texte ?`,
    aide: `Ce qui reste vrai en tout temps et en tout lieu, une fois la situation d'origine mise de côté.`,
    sousQuestions: [
      `Qu'est-ce qui tenait à la situation d'origine, et qu'est-ce qui vaut toujours ?`,
      `Comment formuleriez-vous ce principe en une phrase ?`,
    ],
  },
];

export const questionsApplication: QuestionOIA<CleApplication>[] = [
  {
    cle: 'exemple',
    question: `Y a-t-il un exemple à suivre, ou à ne pas suivre ?`,
    aide: `Une attitude, une décision, une foi que vous pouvez imiter — ou dont le texte vous détourne.`,
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
    question: `Y a-t-il une prière à faire ?`,
    aide: `Une prière que ce texte met sur vos lèvres.`,
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

export const NOTE_OBSERVATION = `Toutes les questions ne sont pas à répondre pour tous les passages.`;
export const NOTE_APPLICATION = `Ces questions ne sont pas toutes obligatoires à répondre.`;

/**
 * Ce à quoi se reconnaît une application qui tiendra. Les quatre critères sont
 * ceux que le document de référence retient de Rick Warren : une application
 * qui n'est ni personnelle, ni pratique, ni possible, ni mesurable reste une
 * bonne intention.
 */
export const CARACTERISTIQUES_APPLICATION = [
  {
    cle: 'personnelle',
    titre: 'Personnelle',
    texte: `Utilisez « je », « moi », « mon ». Une application formulée à la troisième personne ne vous engage pas.`,
  },
  {
    cle: 'pratique',
    titre: 'Pratique',
    texte: `Une action spécifique et concrète, pas une résolution générale.`,
  },
  {
    cle: 'possible',
    titre: 'Possible',
    texte: `Une action que vous aurez la capacité de faire — sinon vous serez découragé.`,
  },
  {
    cle: 'mesurable',
    titre: 'Mesurable',
    texte: `Fixez-vous un délai, une date à laquelle l'accomplissement devra avoir eu lieu.`,
  },
] as const;

/** Exemple travaillé de la méthode, tel qu'il figure dans le document de référence. */
export const exempleOIA = {
  reference: 'Luc 8:22-25',
  passageId: 'lc8',
  observation: {
    qui: `Le livre a été écrit par Luc, un médecin et compagnon de Paul. Le livre s'adresse à l'excellent Théophile. Les personnages de ce texte : Jésus et ses disciples.`,
    quoi: `Jésus et ses disciples montent dans une barque pour traverser de l'autre bord du lac. Une tempête éclate, mettant la barque en danger. Les disciples paniquent et réveillent Jésus, qui calme la tempête en menaçant le vent et les vagues. Le lac redevient calme ; Jésus interroge les disciples sur leur foi. Ils sont remplis de crainte et d'étonnement devant le pouvoir de Jésus sur le vent et l'eau.`,
    ou: `La scène se passe dans un lac : Jésus et ses disciples étaient dans une barque. Jésus et ses disciples traversent le lac pour aller à l'autre côté du rivage.`,
    quand: `Nous ne savons pas clairement quand l'auteur a écrit le livre. C'est pendant la deuxième moitié du premier siècle après Jésus-Christ. Dans le texte, nous ne savons pas à quel moment de la journée le récit s'est passé.`,
    comment: `Alors qu'ils traversent le lac, une tempête survient, provoquant la panique parmi les disciples. Devant les difficultés, les disciples ont agi par peur en réveillant Jésus, pourtant le maître dormait tranquillement dans la barque. Les disciples montrent de la peur, pourtant Jésus reste calme. Le genre littéraire est un récit narratif.`,
    pourquoi: `Les disciples réagissent avec peur car ils sont confrontés à une tempête.`,
    donc: `Le médecin Luc a écrit le livre à l'excellent Théophile. Les personnages de ce récit sont Jésus et les disciples. La scène se déroule dans une barque au bord d'un lac. Face à une tempête, les disciples réveillent Jésus. Celui-ci menaça le vent et la tempête, démontrant ainsi son autorité sur la nature. Jésus reprend ses disciples pour leur manque de foi.`,
  } satisfies Record<CleObservation, string>,
  interpretation: {
    destinataires: `Théophile, et à travers lui les lecteurs de Luc, devaient reconnaître l'identité de Jésus : celui qui commande au vent et à l'eau est plus qu'un maître, il exerce l'autorité de Dieu lui-même. Le livre de Luc se trouve dans le Nouveau Testament.`,
    eglise: `Quelques vérités sur ce texte : Jésus est capable de calmer toutes sortes de tempêtes dans nos vies (verset 24) ; dans notre marche avec Jésus, nous découvrons d'autres facettes de Jésus comme c'était le cas pour les disciples (verset 25) ; faire confiance à Jésus peu importe les moments difficiles.`,
    principes: `L'autorité de Jésus ne dépend pas de la tempête que nous traversons, et la peur des disciples ne l'a pas diminuée. Ce qui est demandé au croyant dans l'épreuve n'est pas l'absence de danger, mais la foi en celui qui est dans la barque avec lui.`,
  } satisfies Record<CleInterpretation, string>,
  application: {
    erreur: `Exemple à ne pas suivre : les disciples qui ont eu peur et manqué de foi dans les moments difficiles, à la place de mettre leur foi en Jésus et en sa parole.`,
    defi: `Je m'engage à placer ma confiance en Jésus ainsi qu'en sa parole peu importe les difficultés, et à exercer ma foi.`,
    verset: `« Puis il leur dit : où est votre foi ? Saisis de frayeur et d'étonnement, ils se dirent les uns aux autres : quel est donc celui-ci, qui commande même au vent et à l'eau, et à qui ils obéissent ? » (Luc 8:25)`,
  } as Partial<Record<CleApplication, string>>,
  engagement: `Je m'engage à placer ma confiance en Jésus ainsi qu'en sa parole peu importe les difficultés, et à exercer ma foi.`,
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
