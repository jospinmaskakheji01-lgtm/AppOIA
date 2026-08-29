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
 * ce qui se décide et s'écrit : les titres et les descriptions des plans. La
 * liste des passages du plan sur les enseignements de Jésus — le seul qui ne
 * soit pas une traversée — est elle aussi dans le générateur, avec le nom de
 * chaque enseignement.
 */

import {
  journeesDesEnseignementsDeJesus,
  joursDesPlansDeLecture,
} from './plans-lecture-jours';

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
    description: `Tout ce que Jésus a enseigné dans les quatre évangiles : les soixante-seize discours, paraboles et réponses, du sermon sur la montagne à la prière de Jean 17, répartis sur soixante journées. Ce plan ne lit pas les évangiles d'un bout à l'autre — il laisse de côté les récits qui ne portent pas d'enseignement — mais à l'intérieur de ce qu'il retient, rien ne manque. Les passages parallèles ne sont pas fusionnés : Matthieu, Marc, Luc et Jean gardent chacun leur voix.`,
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
  // Les enseignements de Jésus sont le seul plan dont les journées portent un
  // titre : il ne traverse pas un livre, il rassemble des passages.
  if (id === 'lecture-jesus-60') {
    return journeesDesEnseignementsDeJesus.map((j, i) => ({ jour: i + 1, ...j }));
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
