/**
 * Les méthodes d'étude biblique, groupées en quatre familles.
 *
 * La méthode OIA sert à étudier un passage. Celles-ci servent à autre chose :
 * étudier une personne, un thème, une qualité, un mot, ou un livre entier.
 * Elles répondent à la question de celui qui veut faire une étude biblique et ne
 * sait pas par où commencer — chacune donne sa marche à suivre, étape par
 * étape, avec les questions à se poser et l'erreur à éviter.
 *
 * Sur la provenance, qui est ici capitale. La suite des étapes de chaque méthode
 * est celle de Rick Warren, « Méthodes d'étude de la Bible » (La Maison de la
 * Bible, 2010), qui en expose douze ; huit sont reprises ici. Les étapes sont
 * les siennes, dans son ordre et sous ses intitulés. Ce qui est écrit pour
 * l'application, ce sont les consignes et les questions qui accompagnent chaque
 * étape : elles restituent sa méthode sans le citer, et chaque méthode renvoie
 * au chapitre de l'ouvrage où il l'expose lui-même.
 *
 * C'est le même Rick Warren dont le document O.I.A de l'École d'Apollos reprend
 * les quatre caractéristiques de l'application — personnelle, pratique,
 * réalisable et mesurable. Elles reviennent ici à la fin de presque chaque
 * méthode, parce que c'est ainsi qu'il les emploie.
 */

import {
  SOURCE_FEE_STUART,
  SOURCE_HENDRICKS,
  SOURCE_KUEN_ETUDIER,
  SOURCE_KUEN_LIRE,
} from './modules/methode-sources';
import { SOURCE_WARREN } from './sources';

export interface EtapeEtude {
  cle: string;
  titre: string;
  /** Ce qu'il faut faire à cette étape, dit à l'impératif. */
  consigne: string;
  /** Les questions à se poser pour la franchir. */
  questions: string[];
  /** L'erreur que cette étape sert à éviter. */
  garde?: string;
  /** Ce que l'application met à disposition ici. */
  outil?: string;
  /** Hauteur du champ de réponse : certaines étapes demandent plus de place. */
  hauteur?: number;
}

export interface MethodeEtude {
  id: string;
  /** La famille à laquelle la méthode appartient. */
  famille: string;
  titre: string;
  sousTitre: string;
  symbole: string;
  /** Ce sur quoi l'étude porte — ce que l'on demande de saisir pour commencer. */
  objet: string;
  exempleSujet: string;
  duree: string;
  /** Quand choisir celle-ci plutôt qu'une autre. */
  quand: string;
  description: string;
  /** Le chapitre de l'ouvrage de Warren où la méthode est exposée. */
  chapitreWarren: number;
  etapes: EtapeEtude[];
  /** Les ouvrages installés qui traitent de cette méthode. */
  pourAllerPlusLoin: { sourceId: string; note: string }[];
}

export interface FamilleEtude {
  cle: string;
  lettre: string;
  titre: string;
  description: string;
}

/**
 * Les quatre familles. Elles ne sont pas un classement décoratif : à
 * l'intérieur d'une famille, les méthodes portent sur le même objet et se
 * distinguent par leur profondeur ou leur angle. On choisit d'abord ce qu'on
 * veut étudier, ensuite comment.
 */
export const famillesEtude: FamilleEtude[] = [
  {
    cle: 'personnages',
    lettre: 'A',
    titre: 'Étude de personnages bibliques',
    description: `Suivre une vie entière — ses choix, ses chutes, ses relèvements — pour voir comment Dieu conduit un homme dans la durée.`,
  },
  {
    cle: 'thematique',
    lettre: 'B',
    titre: 'Étude thématique',
    description: `Suivre un sujet à travers l'Écriture. Trois manières de le faire : en posant d'avance quelques questions précises, en relevant tout ce qui se dit du thème, ou en se concentrant sur un trait de caractère à acquérir.`,
  },
  {
    cle: 'mots',
    lettre: 'C',
    titre: 'Étude de mots',
    description: `Chercher ce qu'un mot veut dire dans la langue d'origine, et lequel de ses sens s'applique ici.`,
  },
  {
    cle: 'livre',
    lettre: 'D',
    titre: `Étude d'un livre de la Bible`,
    description: `Trois manières d'aborder un livre entier, dans l'ordre où on les emploie : le survoler, l'analyser, puis situer ce qui l'entoure.`,
  },
];

/** L'application, telle que Warren la demande à la fin de chaque méthode. */
const APPLICATION_QUESTIONS = [
  `À la première personne : que vais-je faire ?`,
  `Est-ce pratique, réalisable, et puis-je vérifier que je l'ai fait ?`,
  `Quand exactement ?`,
];

export const methodesEtude: MethodeEtude[] = [
  // ————————————————————————————————————————————————————————————
  // A. Étude de personnages
  // ————————————————————————————————————————————————————————————
  {
    id: 'personnages',
    famille: 'personnages',
    titre: 'Étude de personnages bibliques',
    sousTitre: 'Suivre une vie entière',
    symbole: '☗',
    objet: 'Le personnage à étudier',
    exempleSujet: 'Barnabas',
    duree: '2 à 4 heures',
    chapitreWarren: 5,
    quand: `Quand vous voulez comprendre comment Dieu conduit une vie — la vôtre comprise. C'est la méthode la plus accessible pour commencer : elle raconte avant d'expliquer.`,
    description: `La Bible enseigne autant par des vies que par des discours. La méthode repose sur quatre lectures successives des mêmes passages : la première pour l'impression d'ensemble, la deuxième pour l'ordre des faits, la troisième pour le portrait, la quatrième pour le caractère. Chacune voit ce que la précédente ne pouvait pas voir.`,
    etapes: [
      {
        cle: 'choix',
        titre: 'Choisir un personnage',
        consigne: `Commencez par quelqu'un dont la Bible parle assez pour qu'il y ait matière, mais pas au point de vous décourager. Un personnage secondaire bien traité vaut mieux qu'un Moïse survolé.`,
        questions: [
          `Pourquoi ce personnage m'attire-t-il ?`,
          `Le nombre de passages le concernant est-il tenable pour une première étude ?`,
        ],
      },
      {
        cle: 'passages',
        titre: 'Établir la liste des passages',
        consigne: `Cherchez son nom dans toute la Bible et notez chaque référence, sans en écarter aucune — même celles qui ne vous arrangent pas.`,
        questions: [
          `Dans quels livres apparaît-il ?`,
          `Porte-t-il un autre nom ailleurs (Saul et Paul, Jacob et Israël, Simon et Pierre) ?`,
          `D'autres textes parlent-ils de lui sans le nommer ?`,
        ],
        outil: `La recherche de l'application trouve le nom dans toutes les versions installées.`,
        garde: `Une vie étudiée sur les seuls passages flatteurs n'est plus une vie, c'est un portrait.`,
        hauteur: 150,
      },
      {
        cle: 'impressions',
        titre: 'Première lecture : les premières impressions',
        consigne: `Lisez tous les passages à la suite, sans prendre de notes pendant la lecture. Écrivez ensuite ce qui vous reste.`,
        questions: [
          `Quelle impression d'ensemble cette vie laisse-t-elle ?`,
          `Qu'est-ce qui m'a surpris ?`,
        ],
      },
      {
        cle: 'chronologie',
        titre: 'Deuxième lecture : la chronologie',
        consigne: `Relisez, et cette fois mettez les événements dans l'ordre. Une vie ne se comprend pas si l'on ignore ce qui est venu avant quoi.`,
        questions: [
          `Quels sont les événements décisifs, du premier au dernier ?`,
          `À quelle époque, sous quel régime, dans quel lieu ?`,
          `Quel âge a-t-il aux moments importants ?`,
        ],
        hauteur: 180,
      },
      {
        cle: 'portrait',
        titre: 'Troisième lecture : le portrait',
        consigne: `Relisez pour dresser sa fiche : sa famille, son métier, sa position, ce que son nom signifie, ce que les autres disent de lui — et ce que Dieu dit de lui.`,
        questions: [
          `De quelle famille, de quelle tribu, de quel peuple vient-il ?`,
          `Que signifie son nom ? A-t-il été changé, et par qui ?`,
          `Que disent de lui les autres personnages ? Que dit Dieu de lui ?`,
        ],
        hauteur: 180,
      },
      {
        cle: 'caractere',
        titre: 'Quatrième lecture : les traits de caractère',
        consigne: `Relisez pour son caractère seul. Nommez ses qualités et ses défauts, et donnez pour chacun la référence qui le prouve. Regardez s'il change au fil du temps.`,
        questions: [
          `Quelles qualités le texte montre-t-il, et où ?`,
          `Quels défauts, et où ?`,
          `Est-il le même au début et à la fin ? Qu'est-ce qui l'a changé ?`,
        ],
        garde: `Une qualité sans référence est une opinion. Chaque trait doit s'appuyer sur un verset.`,
        hauteur: 180,
      },
      {
        cle: 'verites',
        titre: 'Les vérités que cette vie illustre',
        consigne: `Le personnage n'est pas le sujet du récit : Dieu l'est. Cherchez quelles vérités bibliques cette vie met en scène.`,
        questions: [
          `Quelles promesses Dieu lui fait-il ? Comment le corrige-t-il ? Comment le relève-t-il ?`,
          `Quelle vérité sur Dieu cette vie rend-elle visible ?`,
          `Quelle vérité sur l'homme ?`,
        ],
        hauteur: 150,
      },
      {
        cle: 'enseignements',
        titre: 'Récapituler les principaux enseignements',
        consigne: `Rassemblez en quelques lignes ce que cette vie enseigne, valable pour tout croyant, en tout temps.`,
        questions: [
          `Y a-t-il un exemple à suivre ? Une erreur à éviter ?`,
          `Qu'est-ce que je ne dois surtout pas conclure de cette vie ?`,
        ],
      },
      {
        cle: 'application',
        titre: 'Écrire une application personnelle',
        consigne: `Une seule action, personnelle, pratique, réalisable et mesurable.`,
        questions: APPLICATION_QUESTIONS,
      },
      {
        cle: 'elargir',
        titre: 'Élargir l’étude',
        consigne: `L'étude ne s'arrête pas là. Notez ce qu'elle ouvre : un autre personnage à comparer, une qualité à étudier pour elle-même, un livre à survoler.`,
        questions: [
          `Quel personnage gagnerait à être comparé à celui-ci ?`,
          `Quelle question cette étude a-t-elle laissée sans réponse ?`,
        ],
      },
    ],
    pourAllerPlusLoin: [
      {
        sourceId: SOURCE_WARREN,
        note: `Chapitre 5. Warren y donne la méthode complète, ses annexes offrant une liste de personnages bibliques et une série de questions générales à leur poser.`,
      },
      {
        sourceId: SOURCE_KUEN_ETUDIER,
        note: `Kuen consacre un chapitre à l'étude biographique et à ses questions.`,
      },
    ],
  },

  // ————————————————————————————————————————————————————————————
  // B1. Étude thématique ciblée
  // ————————————————————————————————————————————————————————————
  {
    id: 'thematique-ciblee',
    famille: 'thematique',
    titre: 'Étude thématique ciblée',
    sousTitre: 'Cinq questions, posées à chaque passage',
    symbole: '◉',
    objet: 'Le thème à étudier',
    exempleSujet: `La volonté de Dieu`,
    duree: '2 à 4 heures',
    chapitreWarren: 4,
    quand: `Quand vous avez une question précise et un nombre limité de passages. C'est la plus abordable des trois études thématiques, et celle par laquelle commencer.`,
    description: `Sa force tient en une contrainte : vous décidez d'avance les questions — cinq au maximum — et vous les posez à chaque passage, toujours les mêmes. Les réponses se rangent alors d'elles-mêmes en colonnes, et le thème apparaît sans que vous ayez eu à le forcer.`,
    etapes: [
      {
        cle: 'theme',
        titre: 'Choisir un thème ciblé',
        consigne: `Prenez un sujet ni trop vaste ni trop lourd. « La prière » ne donnera rien ; « ce que Dieu promet à celui qui prie » donnera quelque chose.`,
        questions: [
          `Quelle est exactement ma question ?`,
          `Le nombre de passages est-il tenable ?`,
        ],
        garde: `Un thème trop vaste produit une liste de versets, pas une compréhension.`,
      },
      {
        cle: 'passages',
        titre: 'Dresser la liste des passages',
        consigne: `Cherchez le mot et ses proches, suivez les renvois, et notez toutes les références avant d'en lire une seule attentivement.`,
        questions: [
          `Quels mots dois-je chercher, et quels synonymes ?`,
          `Quels passages traitent du sujet sans employer le mot ?`,
        ],
        outil: `La recherche et le dictionnaire de l'application couvrent les versions et les ouvrages installés.`,
        hauteur: 150,
      },
      {
        cle: 'questions',
        titre: 'Choisir les questions',
        consigne: `Écrivez au maximum cinq questions, que vous poserez à chacun des passages. C'est le cœur de la méthode : les mêmes questions, à tous les textes.`,
        questions: [
          `En quoi consiste ce thème dans ce passage ?`,
          `Pourquoi Dieu le demande-t-il — quelles motivations, quels résultats ?`,
          `Comment le mettre en œuvre — quelles attitudes, quels actes ?`,
        ],
        garde: `Des questions différentes d'un passage à l'autre rendent les réponses incomparables. C'est justement ce que la méthode évite.`,
        hauteur: 150,
      },
      {
        cle: 'reponses',
        titre: 'Chercher les réponses',
        consigne: `Lisez les passages un à un et posez vos questions à chacun. Un texte peut ne répondre à aucune : laissez le blanc, il est une réponse lui aussi.`,
        questions: [
          `Que répond ce passage à chacune de mes questions ?`,
          `Si aucun texte ne répond à une question, faut-il la reformuler ?`,
        ],
        hauteur: 250,
      },
      {
        cle: 'recapitulation',
        titre: 'Récapituler les découvertes',
        consigne: `Regroupez les passages qui se ressemblent, et faites de chacune de vos questions une section de plan.`,
        questions: [
          `Que répond l'ensemble des textes à ma première question ? à la deuxième ?`,
          `Quelles réponses se recoupent ? Lesquelles se complètent ?`,
        ],
        hauteur: 180,
      },
      {
        cle: 'application',
        titre: 'Écrire une application personnelle',
        consigne: `Une seule action, personnelle, pratique, réalisable et mesurable.`,
        questions: APPLICATION_QUESTIONS,
      },
    ],
    pourAllerPlusLoin: [
      {
        sourceId: SOURCE_WARREN,
        note: `Chapitre 4. Warren y donne un exemple entièrement traité, sur le thème « le véritable disciple d'après Jésus ».`,
      },
      {
        sourceId: SOURCE_FEE_STUART,
        note: `Fee et Stuart montrent pourquoi le genre littéraire d'un texte décide de ce qu'on a le droit d'en tirer.`,
      },
    ],
  },

  // ————————————————————————————————————————————————————————————
  // B2. Étude thématique générale
  // ————————————————————————————————————————————————————————————
  {
    id: 'thematique-generale',
    famille: 'thematique',
    titre: 'Étude thématique générale',
    sousTitre: 'Suivre un thème à la trace',
    symbole: '❋',
    objet: 'Le thème à étudier',
    exempleSujet: 'La grâce',
    duree: '5 à 10 heures',
    chapitreWarren: 6,
    quand: `Quand le sujet est trop vaste pour tenir en cinq questions, et que vous voulez tout ce que la Bible en dit — dans un livre, ou d'un bout à l'autre.`,
    description: `Elle ressemble à l'étude ciblée, mais s'en distingue sur un point décisif : ici, on ne décide pas d'avance quelles questions poser. On lit chaque passage sans grille et l'on note toutes les vérités qu'on y trouve. C'est plus long, et c'est ce qui permet d'étudier une doctrine entière.`,
    etapes: [
      {
        cle: 'mots',
        titre: 'Compiler une liste de mots',
        consigne: `Un thème ne tient pas dans un mot. Dressez la liste de tous ceux qui le portent — le mot principal, ses synonymes, ses contraires, les expressions qui le disent autrement.`,
        questions: [
          `Quels mots la Bible emploie-t-elle pour ce thème ?`,
          `Quels mots le disent sans le nommer ?`,
        ],
        hauteur: 130,
      },
      {
        cle: 'passages',
        titre: 'Établir la liste des passages',
        consigne: `Cherchez chacun de vos mots et notez toutes les références. Décidez maintenant de l'étendue : un seul livre, un testament, ou toute la Bible.`,
        questions: [
          `Sur quelle étendue vais-je travailler ?`,
          `Combien de passages cela représente-t-il ? Est-ce tenable ?`,
        ],
        outil: `La recherche de l'application interroge les quatre versions installées à la fois.`,
        hauteur: 180,
      },
      {
        cle: 'examen',
        titre: 'Examiner chaque passage isolément',
        consigne: `Lisez chaque passage dans son contexte et notez tout ce qu'il apprend sur le thème — sans grille, sans rien écarter parce que cela ne rentre pas.`,
        questions: [
          `Qu'est-ce que ce passage apprend sur le thème ?`,
          `Ce verset dit-il encore la même chose une fois replacé dans son paragraphe ?`,
        ],
        garde: `C'est ici que la plupart des études thématiques se perdent : un verset arraché à son contexte dit ce qu'on veut.`,
        hauteur: 250,
      },
      {
        cle: 'groupement',
        titre: 'Comparer et grouper les passages',
        consigne: `Rassemblez ceux qui disent la même chose. Les groupes qui se forment sont les sous-thèmes que vous n'aviez pas prévus.`,
        questions: [
          `Quels groupes se dégagent d'eux-mêmes ?`,
          `Le thème est-il traité différemment avant et après la venue de Jésus-Christ ?`,
          `Quel passage éclaire les autres ?`,
        ],
        hauteur: 180,
      },
      {
        cle: 'plan',
        titre: 'Récapituler sous forme de plan',
        consigne: `Faites de chaque groupe une section, et donnez-lui un titre. Le plan est le résultat de l'étude — c'est lui que vous pourrez transmettre.`,
        questions: [
          `Dans quel ordre ces sections s'enchaînent-elles le mieux ?`,
          `Chaque section porte-t-elle ses références ?`,
        ],
        hauteur: 220,
      },
      {
        cle: 'conclusion',
        titre: 'Écrire une conclusion',
        consigne: `En un paragraphe : ce que la Bible enseigne sur ce thème. Puis cherchez délibérément un texte qui gêne votre conclusion.`,
        questions: [
          `Puis-je le dire en cinq lignes, sans jargon ?`,
          `Quel passage rend ma conclusion inconfortable ?`,
          `Ai-je écarté un texte parce qu'il ne rentrait pas ?`,
        ],
        garde: `Une étude thématique qui ne rencontre aucune objection n'a pas cherché.`,
        hauteur: 180,
      },
    ],
    pourAllerPlusLoin: [
      {
        sourceId: SOURCE_WARREN,
        note: `Chapitre 6. Warren y détaille ce qui sépare cette méthode de l'étude ciblée du chapitre 4.`,
      },
      {
        sourceId: SOURCE_KUEN_ETUDIER,
        note: `Kuen décrit la marche de l'étude par sujets et met en garde contre les versets choisis.`,
      },
    ],
  },

  // ————————————————————————————————————————————————————————————
  // B3. Étude de qualités
  // ————————————————————————————————————————————————————————————
  {
    id: 'qualites',
    famille: 'thematique',
    titre: 'Étude de qualités',
    sousTitre: 'Un trait de caractère à acquérir ou à quitter',
    symbole: '✦',
    objet: 'La qualité — ou le défaut — à étudier',
    exempleSujet: 'La douceur',
    duree: '2 à 3 heures, puis une semaine',
    chapitreWarren: 3,
    quand: `Quand ce que vous cherchez n'est pas de comprendre mais de changer. C'est la méthode la plus tournée vers l'application des huit : elle se termine des jours après avoir commencé.`,
    description: `Elle emprunte trois autres méthodes en les simplifiant — l'étude de mots, l'étude de personnages, les références parallèles — et les met au service d'une seule question : comment acquérir ce trait, ou m'en défaire. Ce qui la distingue de l'étude de personnages, c'est qu'elle porte sur le caractère plutôt que sur la personne.`,
    etapes: [
      {
        cle: 'qualite',
        titre: 'Choisir une qualité',
        consigne: `Une seule à la fois, et jusqu'à la victoire. Elle peut être positive — à développer — ou négative — à éviter.`,
        questions: [
          `Quelle qualité Dieu me montre-t-il en ce moment ?`,
          `Est-elle à acquérir, ou à quitter ?`,
        ],
        garde: `Deux ou trois qualités à la fois, et aucune ne s'enracine. Le développement du caractère prend des mois, parfois des années.`,
      },
      {
        cle: 'oppose',
        titre: 'Décrire le trait opposé',
        consigne: `Une qualité se comprend par son contraire. Décrivez ce à quoi ressemble son absence.`,
        questions: [
          `Quel est le contraire de cette qualité ?`,
          `À quoi reconnaît-on quelqu'un qui en manque ?`,
        ],
      },
      {
        cle: 'mot',
        titre: 'Faire une étude de mot simple',
        consigne: `Cherchez ce que le mot signifie — en français d'abord, puis dans la langue d'origine si vous le pouvez.`,
        questions: [
          `Que dit le dictionnaire de ce mot ?`,
          `Quel mot hébreu ou grec la Bible emploie-t-elle ?`,
        ],
        outil: `Le dictionnaire biblique installé donne les mots originaux pour les notions qu'il couvre.`,
      },
      {
        cle: 'paralleles',
        titre: 'Rassembler les références parallèles',
        consigne: `Notez les passages qui parlent de cette qualité. Laissez de côté sans les forcer ceux qui restent obscurs — un autre texte les éclairera plus tard.`,
        questions: [
          `Quels versets parlent de cette qualité ?`,
          `Que promet Dieu à celui qui la possède ? Que dit-il de celui qui en manque ?`,
        ],
        hauteur: 150,
      },
      {
        cle: 'personnage',
        titre: 'Faire une brève étude de personnage',
        consigne: `Trouvez au moins une personne de la Bible chez qui ce trait se voit, et décrivez brièvement comment.`,
        questions: [
          `Que montre cette manière d'être dans sa vie ?`,
          `L'a-t-elle aidé ou gêné, et comment ?`,
          `Quels résultats a-t-elle produits ?`,
        ],
        hauteur: 150,
      },
      {
        cle: 'verset',
        titre: 'Choisir un verset à mémoriser',
        consigne: `Parmi tous les textes rassemblés, retenez-en un et apprenez-le par cœur cette semaine. Il vous servira au moment où Dieu vous donnera l'occasion de travailler ce trait.`,
        questions: [`Quel verset me parle le plus directement ?`],
      },
      {
        cle: 'situation',
        titre: 'Choisir une situation ou une relation',
        consigne: `Ici commence l'application. Nommez le domaine précis de votre vie où Dieu veut vous voir travailler ce trait — une situation qui revient, ou une personne.`,
        questions: [
          `Dans quelle situation suis-je le plus exposé ?`,
          `Avec quelle personne ce trait manque-t-il le plus — conjoint, enfant, collègue, voisin ?`,
          `Quand cela a-t-il posé problème récemment ?`,
        ],
        hauteur: 150,
      },
      {
        cle: 'projet',
        titre: 'Élaborer un projet précis',
        consigne: `Décidez d'une action concrète. Pas une intention : un geste, avec une date. Personnelle, pratique, réalisable et mesurable.`,
        questions: [
          `Que vais-je faire exactement, et quand ?`,
          `Comment saurai-je que je l'ai fait ?`,
        ],
      },
      {
        cle: 'exemple',
        titre: 'Écrire un exemple, quelques jours plus tard',
        consigne: `Revenez ici après plusieurs jours et racontez ce qui s'est passé — où vous avez réussi, et où vous avez échoué. C'est la partie mesurable de l'application.`,
        questions: [
          `Qu'ai-je fait, précisément ?`,
          `Où ai-je échoué, et pourquoi ?`,
          `Qu'est-ce que Dieu a fait dans cette affaire ?`,
        ],
        garde: `C'est l'étape qu'on saute, et c'est la seule qui prouve que quelque chose a changé. Relire ces exemples relève, les jours de découragement.`,
        hauteur: 180,
      },
    ],
    pourAllerPlusLoin: [
      {
        sourceId: SOURCE_WARREN,
        note: `Chapitre 3. Warren y donne ses cinq précautions et une annexe listant les qualités positives et négatives de la Bible.`,
      },
      {
        sourceId: SOURCE_HENDRICKS,
        note: `Hendricks montre comment observer un caractère sans lui prêter ce que le texte ne dit pas.`,
      },
    ],
  },

  // ————————————————————————————————————————————————————————————
  // C. Étude de mots
  // ————————————————————————————————————————————————————————————
  {
    id: 'mots',
    famille: 'mots',
    titre: 'Étude de mots',
    sousTitre: 'Ce qu’un mot veut dire, ici',
    symbole: '✎',
    objet: 'Le mot à étudier',
    exempleSujet: 'Grâce',
    duree: '1 à 2 heures',
    chapitreWarren: 7,
    quand: `Quand un mot porte tout le poids d'un passage, ou revient si souvent qu'il en devient le sujet — et que vous soupçonnez qu'il ne veut pas dire ce que le français vous fait croire.`,
    description: `Les mots de la Bible ont été écrits en hébreu et en grec, et aucune traduction ne rend un mot par un seul équivalent. La méthode va du français vers l'original, puis de l'original vers l'emploi — car c'est l'emploi, et non l'étymologie, qui donne le sens.`,
    etapes: [
      {
        cle: 'choix',
        titre: 'Choisir un mot',
        consigne: `Prenez un mot qui compte : répété, chargé, ou dont le sens vous échappe. Notez le passage où vous l'avez rencontré.`,
        questions: [
          `Pourquoi ce mot m'arrête-t-il ?`,
          `Est-il répété dans le passage ? Combien de fois ?`,
        ],
      },
      {
        cle: 'definitionFr',
        titre: 'Chercher la définition du mot français',
        consigne: `Commencez par le dictionnaire de la langue française. On saute souvent cette étape en croyant connaître le mot.`,
        questions: [
          `Que dit exactement le dictionnaire ?`,
          `Le sens courant est-il celui que je croyais ?`,
        ],
      },
      {
        cle: 'traductions',
        titre: 'Comparer les traductions',
        consigne: `Lisez le verset dans plusieurs versions. Là où les traducteurs divergent, il y a quelque chose à comprendre.`,
        questions: [
          `Comment les autres versions rendent-elles ce mot ?`,
          `Qu'est-ce que leurs différences révèlent ?`,
        ],
        outil: `L'application affiche le même passage dans les quatre versions installées.`,
        hauteur: 150,
      },
      {
        cle: 'original',
        titre: 'Chercher la définition du mot original',
        consigne: `Trouvez le mot hébreu ou grec derrière le mot français, et l'éventail de ses sens.`,
        questions: [
          `Quel est le mot original ? Comment se prononce-t-il ?`,
          `Quels sens peut-il porter ?`,
          `Le même mot français traduit-il ailleurs un autre mot original ?`,
        ],
        outil: `Le dictionnaire de l'application donne les mots originaux et leur translittération pour les notions qu'il couvre.`,
        hauteur: 150,
      },
      {
        cle: 'apparitions',
        titre: 'Examiner ses apparitions',
        consigne: `Regardez où le mot revient — d'abord chez le même auteur, puis dans le même livre, puis dans toute la Bible.`,
        questions: [
          `Combien de fois apparaît-il ?`,
          `Est-il concentré dans un livre, ou répandu partout ?`,
        ],
        hauteur: 150,
      },
      {
        cle: 'racine',
        titre: 'Chercher la racine et l’origine',
        consigne: `Notez d'où vient le mot, ce dont il est composé. C'est instructif — et c'est précisément ce dont il ne faut pas tirer le sens.`,
        questions: [
          `De quelle racine vient-il ?`,
          `Est-il composé de plusieurs éléments ?`,
        ],
        garde: `L'étymologie ne donne pas le sens. Ce qu'un mot voulait dire trois siècles plus tôt ne dit pas ce qu'il veut dire ici.`,
      },
      {
        cle: 'emploi',
        titre: 'Examiner son emploi',
        consigne: `C'est l'étape qui décide. Parmi tous les sens possibles, un seul convient ici, et c'est l'usage de l'auteur qui le désigne.`,
        questions: [
          `Quel sens rend la phrase cohérente ?`,
          `Quels sens le contexte exclut-il ?`,
          `Quel autre mot l'auteur aurait-il pu employer, et pourquoi ne l'a-t-il pas fait ?`,
        ],
        hauteur: 150,
      },
      {
        cle: 'application',
        titre: 'Écrire une application',
        consigne: `Ce que ce mot signifie ici, et ce que cela change — personnel, pratique, réalisable, mesurable.`,
        questions: [
          `Qu'est-ce que je lisais de travers avant ?`,
          ...APPLICATION_QUESTIONS,
        ],
      },
    ],
    pourAllerPlusLoin: [
      {
        sourceId: SOURCE_WARREN,
        note: `Chapitre 7. Warren y montre par l'exemple comment sept mots grecs différents se cachent parfois derrière un seul mot français.`,
      },
      {
        sourceId: SOURCE_FEE_STUART,
        note: `Fee et Stuart expliquent en détail le piège de l'étymologie et la manière correcte de conduire une étude de mot.`,
      },
    ],
  },

  // ————————————————————————————————————————————————————————————
  // D1. Survol d'un livre
  // ————————————————————————————————————————————————————————————
  {
    id: 'survol',
    famille: 'livre',
    titre: `Survol d'un livre de la Bible`,
    sousTitre: 'Voir un livre entier d’un seul regard',
    symbole: '◈',
    objet: 'Le livre à survoler',
    exempleSujet: 'Philippiens',
    duree: '1 à 3 heures',
    chapitreWarren: 9,
    quand: `Avant toute autre étude d'un livre, et avant de prêcher ou d'enseigner un de ses passages. C'est la première chose à faire, et celle qu'on saute le plus souvent.`,
    description: `On ne comprend pas une lettre en lisant un paragraphe. Le survol embrasse le livre entier — son auteur, son occasion, son plan, son message — avant d'en étudier une ligne. Une heure de survol évite dix erreurs d'interprétation.`,
    etapes: [
      {
        cle: 'lecture',
        titre: 'Lire le livre',
        consigne: `Lisez-le en entier, en une fois si possible, sans vous arrêter et sans prendre de notes. Recommencez : deux ou trois lectures valent mieux qu'une lecture annotée.`,
        questions: [
          `Quelle impression d'ensemble me reste-t-il ?`,
          `Sur quel ton l'auteur écrit-il — joie, colère, inquiétude, tendresse ?`,
        ],
        outil: `Le lecteur de l'application enchaîne les chapitres sans quitter l'écran.`,
      },
      {
        cle: 'remarques',
        titre: 'Noter vos remarques',
        consigne: `Écrivez ce qui vous a frappé : ce qui revient, ce qui surprend, ce qui résiste.`,
        questions: [
          `Quels mots ou expressions reviennent ?`,
          `Qu'est-ce que je ne comprends pas encore ?`,
          `Quel est le ton général ?`,
        ],
        hauteur: 150,
      },
      {
        cle: 'contexte',
        titre: 'Étudier le contexte du livre',
        consigne: `Cherchez dans le texte lui-même qui écrit, à qui, d'où, quand — et pourquoi. Aucun livre biblique n'a été écrit sans raison.`,
        questions: [
          `Qui écrit ? À qui ? D'où, et à quelle date ?`,
          `Quel problème, quelle question, quelle nouvelle a poussé l'auteur à écrire ?`,
          `De quel genre littéraire ce livre relève-t-il ?`,
        ],
        garde: `Un livre lu sans son occasion devient un recueil de maximes intemporelles. Il ne l'est pas.`,
        hauteur: 180,
      },
      {
        cle: 'contenu',
        titre: 'Relever le contenu',
        consigne: `Notez les personnages, les lieux, les événements, les thèmes principaux — la matière du livre, avant sa structure.`,
        questions: [
          `Qui sont les protagonistes ?`,
          `Où se passe l'action ?`,
          `Quels sont les grands thèmes ?`,
        ],
        hauteur: 180,
      },
      {
        cle: 'plan',
        titre: 'Ébaucher un plan',
        consigne: `Découpez le livre en grandes parties et donnez à chacune un titre tiré du texte, en vos propres mots.`,
        questions: [
          `Où le livre change-t-il de sujet ou de ton ?`,
          `Comment nommerais-je chaque partie ?`,
          `Quel verset résume le livre ?`,
        ],
        hauteur: 200,
      },
      {
        cle: 'application',
        titre: 'Écrire une application',
        consigne: `Ce que ce livre, pris dans son ensemble, demande de vous.`,
        questions: APPLICATION_QUESTIONS,
      },
    ],
    pourAllerPlusLoin: [
      {
        sourceId: SOURCE_WARREN,
        note: `Chapitre 9. C'est la première des trois méthodes que Warren consacre aux livres entiers, avant l'analyse de chapitres et l'analyse synthétique.`,
      },
      {
        sourceId: SOURCE_FEE_STUART,
        note: `Fee et Stuart traitent chaque genre littéraire séparément et disent ce que chacun demande.`,
      },
    ],
  },

  // ————————————————————————————————————————————————————————————
  // D2. Analyse synthétique d'un livre
  // ————————————————————————————————————————————————————————————
  {
    id: 'analyse',
    famille: 'livre',
    titre: `Étude synthétique d'un livre de la Bible`,
    sousTitre: 'Rassembler ce que l’étude a dispersé',
    symbole: '⌘',
    objet: 'Le livre à analyser',
    exempleSujet: 'Romains',
    duree: '5 à 15 heures',
    chapitreWarren: 11,
    quand: `Après le survol, et après avoir travaillé les chapitres. C'est la conclusion logique de l'étude d'un livre : elle rassemble en une vue ce que le détail avait séparé.`,
    description: `Le survol donne la première impression ; l'analyse synthétique donne la charpente définitive. On relit le livre entier après l'avoir travaillé, on en tire un plan détaillé, un titre, et l'on finit par transmettre ce qu'on a trouvé — car une étude que personne ne reçoit s'oublie.`,
    etapes: [
      {
        cle: 'relecture',
        titre: 'Relire le livre',
        consigne: `Relisez-le d'un trait, maintenant que vous le connaissez. Cette lecture-là ne ressemble pas à la première : vous voyez enfin l'ensemble.`,
        questions: [
          `Qu'est-ce que je vois maintenant que je ne voyais pas au survol ?`,
          `Le livre se tient-il comme je le croyais ?`,
        ],
      },
      {
        cle: 'plan',
        titre: 'Élaborer le plan final',
        consigne: `Reprenez l'ébauche du survol et affinez-la : sections, sous-sections, titre de chaque chapitre. Suivez les mots de liaison — donc, c'est pourquoi, mais, or.`,
        questions: [
          `Quels chapitres tiennent ensemble, et pourquoi ?`,
          `Comment chaque section prépare-t-elle la suivante ?`,
          `Où sont les charnières du livre ?`,
        ],
        garde: `Un livre biblique n'est pas une collection de chapitres, c'est un raisonnement ou un récit continu.`,
        hauteur: 250,
      },
      {
        cle: 'titre',
        titre: 'Choisir un titre descriptif',
        consigne: `Donnez au livre un titre de votre cru, qui dise ce qu'il fait. C'est un test : si le titre ne vient pas, le plan n'est pas mûr.`,
        questions: [
          `En trois ou quatre mots, que fait ce livre ?`,
          `Mon titre couvre-t-il le livre entier, ou seulement sa moitié préférée ?`,
        ],
      },
      {
        cle: 'remarques',
        titre: 'Récapituler les remarques',
        consigne: `Rassemblez ce que l'étude a produit : le thème central et sa progression, les personnages, les vérités majeures, ce qui reste obscur.`,
        questions: [
          `Où le thème est-il annoncé ? Où atteint-il son sommet ?`,
          `Comment le livre se termine-t-il par rapport à son début ?`,
          `Qu'est-ce que l'ensemble enseigne qu'aucun chapitre ne dit seul ?`,
        ],
        hauteur: 220,
      },
      {
        cle: 'application',
        titre: 'Écrire une application',
        consigne: `Ce que ce livre entier change dans votre vie — personnel, pratique, réalisable, mesurable.`,
        questions: APPLICATION_QUESTIONS,
      },
      {
        cle: 'communication',
        titre: 'Transmettre les résultats',
        consigne: `Notez à qui vous allez présenter cette étude, et sous quelle forme. Warren en fait une étape à part entière : ce qu'on transmet, on le possède.`,
        questions: [
          `À qui vais-je le présenter — un groupe, une classe, une personne ?`,
          `Sous quelle forme, et quand ?`,
        ],
      },
    ],
    pourAllerPlusLoin: [
      {
        sourceId: SOURCE_WARREN,
        note: `Chapitre 11. Warren la place après l'analyse de chapitres (chapitre 10) : elle en est la synthèse.`,
      },
      {
        sourceId: SOURCE_KUEN_ETUDIER,
        note: `Kuen détaille l'analyse d'un livre, du titrage des chapitres au plan d'ensemble.`,
      },
    ],
  },

  // ————————————————————————————————————————————————————————————
  // D3. Étude du contexte
  // ————————————————————————————————————————————————————————————
  {
    id: 'contexte',
    famille: 'livre',
    titre: `Étude de contexte`,
    sousTitre: 'Ce qui entoure le texte le gouverne',
    symbole: '◎',
    objet: 'Le passage ou le livre à situer',
    exempleSujet: 'Philippiens 4:13',
    duree: '2 à 4 heures',
    chapitreWarren: 8,
    quand: `Chaque fois qu'un verset vous frappe et que vous voulez le citer. C'est la méthode qui empêche les contresens, et le verset le plus connu est celui qui en a le plus besoin.`,
    description: `Un texte sans contexte est un prétexte. Warren distingue quatre enveloppes qui entourent un passage — la géographie, l'histoire, la culture, la politique — et chacune limite ce qu'on a le droit de lui faire dire.`,
    etapes: [
      {
        cle: 'sujet',
        titre: 'Choisir un sujet ou un livre',
        consigne: `Décidez sur quoi porte l'enquête : un passage précis, ou un livre entier dont vous voulez connaître le monde.`,
        questions: [
          `Quel passage, ou quel livre ?`,
          `Qu'est-ce qui, dans ce texte, me paraît supposer une chose que j'ignore ?`,
        ],
      },
      {
        cle: 'outils',
        titre: 'Faire l’inventaire de vos outils',
        consigne: `Notez ce dont vous disposez pour cette recherche : dictionnaire biblique, atlas, introductions, commentaires. Savoir ce qui manque évite de conclure trop vite.`,
        questions: [
          `Quels ouvrages puis-je consulter ?`,
          `Qu'est-ce que je ne pourrai pas vérifier, et dont je devrai me méfier ?`,
        ],
        outil: `Le dictionnaire biblique et le commentaire de MacDonald sont installés dans l'application.`,
      },
      {
        cle: 'geographique',
        titre: 'Le contexte géographique',
        consigne: `Situez les lieux nommés : où ils sont, à quelle distance, ce que le trajet représentait.`,
        questions: [
          `Où se passe la scène ? Quels déplacements suppose-t-elle ?`,
          `Le relief, le climat ou la route expliquent-ils quelque chose du récit ?`,
        ],
      },
      {
        cle: 'historique',
        titre: 'Le contexte historique',
        consigne: `Cherchez l'époque : ce qui venait de se passer, ce qui allait suivre, ce que tout le monde savait alors.`,
        questions: [
          `Quels événements encadrent ce texte ?`,
          `À quelle génération l'auteur s'adresse-t-il ?`,
        ],
      },
      {
        cle: 'culturel',
        titre: 'Le contexte culturel',
        consigne: `Renseignez-vous sur la vie quotidienne : les coutumes, le travail, la famille, la religion, ce qui allait de soi pour les premiers lecteurs et plus pour nous.`,
        questions: [
          `Quelles coutumes le texte suppose-t-il connues ?`,
          `Quel geste, quel objet, quelle fonction demanderait une explication aujourd'hui ?`,
        ],
        hauteur: 150,
      },
      {
        cle: 'politique',
        titre: 'Le contexte politique',
        consigne: `Regardez qui gouverne, et à quelles conditions. Beaucoup de textes ne se comprennent que sous une occupation, un exil ou une persécution.`,
        questions: [
          `Qui détient le pouvoir ? Le peuple est-il libre, soumis, exilé ?`,
          `Le texte est-il écrit sous la contrainte ?`,
        ],
      },
      {
        cle: 'recapitulation',
        titre: 'Récapituler les découvertes',
        consigne: `Rassemblez ce que les quatre contextes ont apporté, et relisez le passage à leur lumière.`,
        questions: [
          `Que signifie ce passage, une fois tout replacé ?`,
          `Mon interprétation résiste-t-elle à la lecture du chapitre entier ?`,
          `Quel usage courant de ce verset le contexte disqualifie-t-il ?`,
        ],
        garde: `C'est l'étape que l'on saute quand la conclusion nous plaît. C'est justement là qu'il ne faut pas la sauter.`,
        hauteur: 180,
      },
      {
        cle: 'application',
        titre: 'Écrire une application',
        consigne: `Ce que le contexte autorise à dire, et ce qu'il vous demande de faire.`,
        questions: APPLICATION_QUESTIONS,
      },
    ],
    pourAllerPlusLoin: [
      {
        sourceId: SOURCE_WARREN,
        note: `Chapitre 8. Warren y traite les quatre contextes — géographique, historique, culturel, politique — l'un après l'autre.`,
      },
      {
        sourceId: SOURCE_KUEN_LIRE,
        note: `Kuen donne les repères d'époque, de coutumes et de géographie nécessaires à la lecture.`,
      },
    ],
  },
];

export const methodesEtudeById: Record<string, MethodeEtude> = Object.fromEntries(
  methodesEtude.map((m) => [m.id, m]),
);

export function getMethodeEtude(id: string): MethodeEtude | undefined {
  return methodesEtudeById[id];
}

/** Les méthodes d'une famille, dans l'ordre où elles sont déclarées. */
export function methodesDeLaFamille(cle: string): MethodeEtude[] {
  return methodesEtude.filter((m) => m.famille === cle);
}

/** Progression d'un travail : proportion d'étapes renseignées. */
export function progressionTravail(
  methodeId: string,
  reponses: Record<string, string> | undefined,
): number {
  const methode = getMethodeEtude(methodeId);
  if (!methode || methode.etapes.length === 0) return 0;
  const faites = methode.etapes.filter(
    (e) => (reponses?.[e.cle] ?? '').trim().length > 0,
  ).length;
  return faites / methode.etapes.length;
}
