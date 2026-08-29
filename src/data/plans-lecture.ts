/**
 * Plans de lecture biblique.
 *
 * Ils ne font pas double emploi avec les plans d'étude de `plans.ts`. Un plan
 * d'étude conduit dix journées sur dix textes, chacun accompagné de son
 * contexte, de ses pistes et de son interprétation : il apprend la méthode. Un
 * plan de lecture, lui, fait traverser un corpus entier — un livre, un
 * testament, la Bible — à raison d'une portion par jour. Ce qu'il demande n'est
 * pas d'étudier chaque texte à fond, mais de lire, puis de méditer ce qu'on
 * vient de lire avec la méthode OIA simplifiée.
 *
 * Le découpage des journées n'est pas écrit ici : il est calculé par
 * scripts/generer-plans-lecture.mjs, pesé en versets sur le texte de la Segond
 * installée, et déposé dans plans-lecture-jours.ts. Ce fichier-ci ne porte que
 * ce qui se décide et s'écrit : les titres, les descriptions, et les soixante
 * journées choisies du plan sur les enseignements de Jésus, qui n'est pas une
 * traversée mais un parcours.
 */

import { joursDesPlansDeLecture } from './plans-lecture-jours';

/**
 * Une portion de lecture. Trois formes, et trois seulement :
 * un chapitre entier, une suite de chapitres entiers, ou un fragment de
 * chapitre — qui porte alors toujours ses deux bornes.
 */
export interface PortionLecture {
  livre: string;
  chapitre: number;
  /** Premier verset lu, quand la portion ne prend qu'une partie du chapitre. */
  verset?: number;
  /** Dernier chapitre lu, quand la portion en couvre plusieurs. */
  chapitreFin?: number;
  /** Dernier verset lu, toujours présent lorsque `verset` l'est. */
  versetFin?: number;
}

export interface JourLecture {
  jour: number;
  /**
   * Titre de la journée. Les traversées n'en ont pas : leur référence dit tout
   * ce qu'il y a à dire. Les parcours choisis en portent un.
   */
  titre?: string;
  portions: PortionLecture[];
}

export interface PlanLecture {
  id: string;
  titre: string;
  sousTitre: string;
  description: string;
  symbole: string;
  /** Ce que le plan fait traverser, dit en clair. */
  parcours: string;
  jours: JourLecture[];
}

// ————————————————————————————————————————————————————————————
// Mise en forme des références
// ————————————————————————————————————————————————————————————

export function formaterPortion(p: PortionLecture): string {
  if (p.verset !== undefined) {
    const fin = p.versetFin !== undefined && p.versetFin !== p.verset ? `-${p.versetFin}` : '';
    return `${p.livre} ${p.chapitre}:${p.verset}${fin}`;
  }
  if (p.chapitreFin !== undefined && p.chapitreFin !== p.chapitre) {
    return `${p.livre} ${p.chapitre}-${p.chapitreFin}`;
  }
  return `${p.livre} ${p.chapitre}`;
}

export function formaterPortions(portions: PortionLecture[]): string {
  return portions.map(formaterPortion).join(' · ');
}

/** Nombre de chapitres couverts par une journée, pour annoncer la charge. */
export function chapitresDuJour(portions: PortionLecture[]): number {
  return portions.reduce((n, p) => n + ((p.chapitreFin ?? p.chapitre) - p.chapitre + 1), 0);
}

// ————————————————————————————————————————————————————————————
// Les enseignements de Jésus — soixante journées choisies
// ————————————————————————————————————————————————————————————

/**
 * Ce plan est le seul de la liste qui ne se lise pas d'un bout à l'autre d'un
 * livre. Il rassemble ce que Jésus a enseigné, à travers les quatre évangiles :
 * les discours, les paraboles, les réponses. L'ordre suit celui des évangiles —
 * Matthieu, Marc, Luc, Jean — plutôt qu'un ordre thématique, pour que chaque
 * enseignement garde le fil du récit dans lequel il a été donné.
 */
const ENSEIGNEMENTS_DE_JESUS: [string, PortionLecture][] = [
  [`Le royaume s'est approché`, { livre: 'Matthieu', chapitre: 4, verset: 17, versetFin: 25 }],
  ['Les béatitudes', { livre: 'Matthieu', chapitre: 5, verset: 1, versetFin: 12 }],
  ['Le sel, la lumière et la loi', { livre: 'Matthieu', chapitre: 5, verset: 13, versetFin: 20 }],
  ['La colère et le regard', { livre: 'Matthieu', chapitre: 5, verset: 21, versetFin: 32 }],
  [`Le serment, la riposte, l'ennemi`, { livre: 'Matthieu', chapitre: 5, verset: 33, versetFin: 48 }],
  [`L'aumône et la prière dans le secret`, { livre: 'Matthieu', chapitre: 6, verset: 1, versetFin: 8 }],
  ['Notre Père', { livre: 'Matthieu', chapitre: 6, verset: 9, versetFin: 15 }],
  ['Le jeûne et les deux trésors', { livre: 'Matthieu', chapitre: 6, verset: 16, versetFin: 24 }],
  ['Ne vous inquiétez pas', { livre: 'Matthieu', chapitre: 6, verset: 25, versetFin: 34 }],
  ['Le jugement, la demande, la règle d’or', { livre: 'Matthieu', chapitre: 7, verset: 1, versetFin: 12 }],
  ['Les deux chemins, les deux arbres, les deux maisons', { livre: 'Matthieu', chapitre: 7, verset: 13, versetFin: 29 }],
  ['Le discours dans la plaine', { livre: 'Luc', chapitre: 6, verset: 20, versetFin: 38 }],
  ['Le médecin et les outres neuves', { livre: 'Matthieu', chapitre: 9, verset: 9, versetFin: 17 }],
  [`L'envoi des douze`, { livre: 'Matthieu', chapitre: 10, verset: 1, versetFin: 25 }],
  ['Ne craignez pas ceux qui tuent le corps', { livre: 'Matthieu', chapitre: 10, verset: 26, versetFin: 42 }],
  ['Venez à moi, vous qui êtes fatigués', { livre: 'Matthieu', chapitre: 11, verset: 20, versetFin: 30 }],
  ['Le Seigneur du sabbat', { livre: 'Matthieu', chapitre: 12, verset: 1, versetFin: 21 }],
  [`La maison divisée, et l'arbre à son fruit`, { livre: 'Matthieu', chapitre: 12, verset: 22, versetFin: 37 }],
  ['Le semeur, et pourquoi des paraboles', { livre: 'Matthieu', chapitre: 13, verset: 1, versetFin: 23 }],
  [`L'ivraie, le grain de moutarde, le trésor`, { livre: 'Matthieu', chapitre: 13, verset: 24, versetFin: 52 }],
  [`Ce qui souille l'homme`, { livre: 'Matthieu', chapitre: 15, verset: 1, versetFin: 20 }],
  ['« Qui dites-vous que je suis ? »', { livre: 'Matthieu', chapitre: 16, verset: 13, versetFin: 28 }],
  ['Devenir comme un enfant', { livre: 'Matthieu', chapitre: 18, verset: 1, versetFin: 14 }],
  ['Reprendre son frère, pardonner sans compter', { livre: 'Matthieu', chapitre: 18, verset: 15, versetFin: 35 }],
  ['Le mariage, et les enfants qu’on écarte', { livre: 'Matthieu', chapitre: 19, verset: 1, versetFin: 15 }],
  ['Le jeune homme riche', { livre: 'Matthieu', chapitre: 19, verset: 16, versetFin: 30 }],
  ['Les ouvriers de la onzième heure', { livre: 'Matthieu', chapitre: 20, verset: 1, versetFin: 16 }],
  ['Le plus grand sera votre serviteur', { livre: 'Matthieu', chapitre: 20, verset: 20, versetFin: 28 }],
  ['Les deux fils, et les vignerons', { livre: 'Matthieu', chapitre: 21, verset: 23, versetFin: 46 }],
  ['Les noces, et ce qui est à César', { livre: 'Matthieu', chapitre: 22, verset: 1, versetFin: 22 }],
  ['La résurrection, et le plus grand commandement', { livre: 'Matthieu', chapitre: 22, verset: 23, versetFin: 46 }],
  ['Malheur aux hypocrites', { livre: 'Matthieu', chapitre: 23, verset: 1, versetFin: 39 }],
  ['Le discours sur la fin', { livre: 'Matthieu', chapitre: 24, verset: 1, versetFin: 31 }],
  ['Veillez donc', { livre: 'Matthieu', chapitre: 24, verset: 32, versetFin: 51 }],
  ['Les dix vierges, et les talents', { livre: 'Matthieu', chapitre: 25, verset: 1, versetFin: 30 }],
  ['Le jugement des nations', { livre: 'Matthieu', chapitre: 25, verset: 31, versetFin: 46 }],
  ['La lampe, et la semence qui pousse d’elle-même', { livre: 'Marc', chapitre: 4, verset: 21, versetFin: 34 }],
  ['La tradition, et le cœur', { livre: 'Marc', chapitre: 7, verset: 1, versetFin: 23 }],
  ['Prendre sa croix', { livre: 'Marc', chapitre: 8, verset: 31, versetFin: 38 }],
  ['Qui est le plus grand', { livre: 'Marc', chapitre: 9, verset: 33, versetFin: 50 }],
  ['Ce qui est impossible aux hommes', { livre: 'Marc', chapitre: 10, verset: 17, versetFin: 31 }],
  ['Le premier commandement, et l’offrande de la veuve', { livre: 'Marc', chapitre: 12, verset: 28, versetFin: 44 }],
  ['La lampe, et la vraie famille', { livre: 'Luc', chapitre: 8, verset: 4, versetFin: 21 }],
  ['Le bon Samaritain ; Marthe et Marie', { livre: 'Luc', chapitre: 10, verset: 25, versetFin: 42 }],
  ['Enseigne-nous à prier', { livre: 'Luc', chapitre: 11, verset: 1, versetFin: 13 }],
  ['L’homme riche et insensé', { livre: 'Luc', chapitre: 12, verset: 1, versetFin: 21 }],
  ['Le trésor du cœur, et le serviteur qui veille', { livre: 'Luc', chapitre: 12, verset: 22, versetFin: 48 }],
  ['Le figuier stérile', { livre: 'Luc', chapitre: 13, verset: 1, versetFin: 21 }],
  ['Les places à table, et le grand souper', { livre: 'Luc', chapitre: 14, verset: 1, versetFin: 24 }],
  ['Bâtir la tour : le prix à payer', { livre: 'Luc', chapitre: 14, verset: 25, versetFin: 35 }],
  ['La brebis, la drachme, le fils perdu', { livre: 'Luc', chapitre: 15, verset: 1, versetFin: 32 }],
  ['L’économe infidèle, et le riche', { livre: 'Luc', chapitre: 16, verset: 1, versetFin: 31 }],
  ['Le pardon, la foi, les dix lépreux', { livre: 'Luc', chapitre: 17, verset: 1, versetFin: 19 }],
  ['La veuve ; le pharisien et le publicain', { livre: 'Luc', chapitre: 18, verset: 1, versetFin: 17 }],
  ['Nicodème : naître de nouveau', { livre: 'Jean', chapitre: 3, verset: 1, versetFin: 21 }],
  ['La Samaritaine : l’eau vive', { livre: 'Jean', chapitre: 4, verset: 1, versetFin: 26 }],
  ['Le pain de vie', { livre: 'Jean', chapitre: 6, verset: 26, versetFin: 59 }],
  ['Le bon berger', { livre: 'Jean', chapitre: 10, verset: 1, versetFin: 30 }],
  ['Je suis le chemin, la vérité, la vie', { livre: 'Jean', chapitre: 14, verset: 1, versetFin: 31 }],
  ['Le cep et les sarments', { livre: 'Jean', chapitre: 15, verset: 1, versetFin: 27 }],
];

// ————————————————————————————————————————————————————————————
// Les plans
// ————————————————————————————————————————————————————————————

interface FichePlan {
  id: string;
  titre: string;
  sousTitre: string;
  description: string;
  symbole: string;
  parcours: string;
}

/**
 * Les plans, du plus court au plus long. Cet ordre est celui dans lequel ils
 * sont proposés : quelqu'un qui commence doit tomber d'abord sur un plan qu'il
 * peut tenir, pas sur la Bible en un an.
 */
const FICHES: FichePlan[] = [
  {
    id: 'lecture-ecclesiaste-14',
    titre: `À l'école de la sagesse — Ecclésiaste`,
    sousTitre: '14 jours',
    parcours: 'Ecclésiaste',
    symbole: '☼',
    description: `Douze chapitres en quatorze jours : le livre le plus déroutant de la Bible, lu assez lentement pour qu'on ne le fuie pas. L'Ecclésiaste regarde en face ce qui ne s'explique pas — le travail sans fruit, la mort qui égalise, le temps qui passe — et ne conclut ni par le désespoir ni par la formule.`,
  },
  {
    id: 'lecture-actes-30',
    titre: 'Actes des Apôtres',
    sousTitre: '30 jours',
    parcours: 'Actes',
    symbole: '↟',
    description: `Un mois pour traverser les Actes : de la Pentecôte à Rome. C'est le seul livre qui raconte ce que l'Église a fait des premiers jours, et il ne cache ni les conflits ni les hésitations. À lire si vous voulez savoir d'où vient ce que vous vivez le dimanche.`,
  },
  {
    id: 'lecture-marc-pierre-30',
    titre: 'Marc et les épîtres de Pierre',
    sousTitre: '30 jours',
    parcours: 'Marc · 1 et 2 Pierre',
    symbole: '⚓',
    description: `L'évangile le plus rapide, suivi des deux lettres de celui dont il porte, dit la tradition, le témoignage. Marc raconte Jésus au pas de course ; Pierre écrit plus tard, à des chrétiens dispersés et éprouvés. Les mêmes yeux, à trente ans d'intervalle.`,
  },
  {
    id: 'lecture-hebreux-jude-30',
    titre: 'Hébreux, Jacques, 1–2 Pierre et Jude',
    sousTitre: '30 jours',
    parcours: 'Hébreux · Jacques · 1 et 2 Pierre · Jude',
    symbole: '⛨',
    description: `Les lettres qui ne sont pas de Paul, en un mois. Elles ont un ton à elles : Hébreux démontre, Jacques bouscule, Pierre console, Jude avertit. Toutes s'adressent à des croyants sous pression, tentés de lâcher.`,
  },
  {
    id: 'lecture-proverbes-31',
    titre: `À l'école de la sagesse — Proverbes`,
    sousTitre: '31 jours',
    parcours: 'Proverbes',
    symbole: '☼',
    description: `Un chapitre par jour, un mois entier. Les Proverbes n'enseignent pas une doctrine mais un art de vivre : la parole, l'argent, le travail, les amitiés, la colère. Beaucoup les relisent chaque mois, en suivant le quantième.`,
  },
  {
    id: 'lecture-job-42',
    titre: `À l'école de la sagesse — Job`,
    sousTitre: '42 jours',
    parcours: 'Job',
    symbole: '☼',
    description: `Un chapitre par jour. Job pose la question que personne n'ose poser tout haut, et le livre prend le temps de ne pas y répondre trop vite : trois amis, trois cycles de discours, puis Dieu lui-même, qui parle sans expliquer. À lire lentement, surtout si vous traversez quelque chose.`,
  },
  {
    id: 'lecture-jesus-60',
    titre: 'Les enseignements de Jésus',
    sousTitre: '60 jours',
    parcours: 'Les quatre évangiles',
    symbole: '✝',
    description: `Soixante journées choisies dans les quatre évangiles : les discours, les paraboles, les réponses. Ce plan ne lit pas les évangiles d'un bout à l'autre — il s'arrête sur ce que Jésus a enseigné, et le suit dans l'ordre où les évangiles le rapportent.`,
  },
  {
    id: 'lecture-jean-60',
    titre: 'Les écrits de Jean',
    sousTitre: '60 jours',
    parcours: 'Jean · 1, 2 et 3 Jean · Apocalypse',
    symbole: '☾',
    description: `L'évangile, les trois lettres et l'Apocalypse, en deux mois. Un même vocabulaire les traverse — la lumière, la vie, la vérité, l'amour — d'un bout à l'autre d'une longue vie. L'Apocalypse se lit autrement une fois qu'on a lu le reste.`,
  },
  {
    id: 'lecture-luc-actes-60',
    titre: 'Luc et Actes',
    sousTitre: '60 jours',
    parcours: 'Luc · Actes',
    symbole: '⁂',
    description: `Les deux volumes du même auteur, lus à la suite comme il les a écrits : ce que Jésus a fait, puis ce qu'il a continué de faire par les siens. Le second tome ne se comprend qu'avec le premier.`,
  },
  {
    id: 'lecture-nt-90',
    titre: 'Nouveau Testament',
    sousTitre: '90 jours',
    parcours: 'Matthieu à Apocalypse',
    symbole: '✧',
    description: `Les vingt-sept livres en trois mois, dans l'ordre. Environ trois chapitres par jour. C'est le plan à prendre si vous n'avez jamais lu le Nouveau Testament en entier — et beaucoup de chrétiens ne l'ont jamais fait.`,
  },
  {
    id: 'lecture-evangiles-90',
    titre: 'Les quatre Évangiles',
    sousTitre: '90 jours',
    parcours: 'Matthieu · Marc · Luc · Jean',
    symbole: '✝',
    description: `Trois mois sur les quatre récits, l'un après l'autre. Les lire à la suite fait apparaître ce que chacun choisit de raconter, et ce qu'il laisse de côté : quatre témoins, une seule histoire.`,
  },
  {
    id: 'lecture-paul-90',
    titre: 'Les épîtres de Paul',
    sousTitre: '90 jours',
    parcours: 'Romains à Philémon',
    symbole: '✉',
    description: `Les treize lettres en trois mois. Le rythme est lent — moins d'un chapitre par jour — parce que Paul se lit mal en diagonale : ses raisonnements tiennent sur plusieurs paragraphes, et une phrase sautée fait perdre le fil.`,
  },
  {
    id: 'lecture-apotres-90',
    titre: 'Les enseignements des apôtres',
    sousTitre: '90 jours',
    parcours: 'Romains à Jude',
    symbole: '✉',
    description: `Les vingt et une lettres du Nouveau Testament, de Romains à Jude, en trois mois. C'est l'enseignement donné aux premières Églises : ce qu'il faut croire, et comment vivre ensemble. Rien n'y est théorique — chaque lettre répond à une situation.`,
  },
  {
    id: 'lecture-at-90',
    titre: 'Ancien Testament',
    sousTitre: '90 jours',
    parcours: 'Genèse à Malachie',
    symbole: '☗',
    description: `Les trente-neuf livres en trois mois. Le rythme est soutenu — une dizaine de chapitres par jour — et c'est voulu : à cette vitesse on ne s'attarde pas sur les détails, on voit la ligne d'ensemble. Pour l'étude verset par verset, prenez un plan d'étude.`,
  },
  {
    id: 'lecture-bible-365',
    titre: 'La Bible en un an',
    sousTitre: '365 jours',
    parcours: 'Genèse à Apocalypse',
    symbole: '❋',
    description: `Toute la Bible en une année, de la Genèse à l'Apocalypse, dans l'ordre. Trois ou quatre chapitres par jour. C'est un engagement long : mieux vaut reprendre un jour manqué le lendemain que tout recommencer.`,
  },
];

function joursDuPlan(id: string): JourLecture[] {
  if (id === 'lecture-jesus-60') {
    return ENSEIGNEMENTS_DE_JESUS.map(([titre, portion], i) => ({
      jour: i + 1,
      titre,
      portions: [portion],
    }));
  }
  const decoupage = joursDesPlansDeLecture[id] ?? [];
  return decoupage.map((portions, i) => ({ jour: i + 1, portions }));
}

export const plansLecture: PlanLecture[] = FICHES.map((fiche) => ({
  ...fiche,
  jours: joursDuPlan(fiche.id),
}));

export const plansLectureById: Record<string, PlanLecture> = Object.fromEntries(
  plansLecture.map((p) => [p.id, p]),
);

export function getPlanLecture(id: string): PlanLecture | undefined {
  return plansLectureById[id];
}

export function getJourLecture(planId: string, jour: number): JourLecture | undefined {
  return getPlanLecture(planId)?.jours.find((j) => j.jour === jour);
}
