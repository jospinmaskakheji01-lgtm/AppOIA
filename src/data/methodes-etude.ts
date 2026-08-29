/**
 * Les six méthodes d'étude biblique.
 *
 * La méthode OIA sert à étudier un passage. Ces six-là servent à autre chose :
 * étudier une personne, un thème, un mot, un livre entier, ou le contexte d'un
 * texte. Elles répondent à la question de celui qui veut faire une étude
 * biblique et ne sait pas par où commencer — chacune donne sa marche à suivre,
 * étape par étape, avec les questions à se poser et l'erreur à éviter.
 *
 * Sur la nature de ce contenu : ces marches à suivre sont écrites pour
 * l'application. Elles ne sont pas tirées des ouvrages installés et ne leur sont
 * pas attribuées. Chaque méthode indique en revanche quel ouvrage installé la
 * traite, pour qui veut aller plus loin — et de nouveaux ouvrages viendront
 * l'enrichir.
 */

import {
  SOURCE_FEE_STUART,
  SOURCE_HENDRICKS,
  SOURCE_KUEN_ETUDIER,
  SOURCE_KUEN_LIRE,
} from './modules/methode-sources';

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
  etapes: EtapeEtude[];
  /** Les ouvrages installés qui traitent de cette méthode. */
  pourAllerPlusLoin: { sourceId: string; note: string }[];
}

export const methodesEtude: MethodeEtude[] = [
  // ————————————————————————————————————————————————————————————
  {
    id: 'personnages',
    titre: 'Étude de personnages',
    sousTitre: 'Suivre une vie entière',
    symbole: '☗',
    objet: 'Le personnage à étudier',
    exempleSujet: 'Barnabas',
    duree: '2 à 4 heures',
    quand: `Quand vous voulez comprendre comment Dieu conduit une vie — la vôtre comprise. C'est la méthode la plus accessible pour commencer : elle raconte avant d'expliquer.`,
    description: `La Bible enseigne autant par des vies que par des discours. Suivre un personnage d'un bout à l'autre — ses choix, ses chutes, ses relèvements — fait apparaître ce qu'aucun verset isolé ne montre : la patience de Dieu dans la durée.`,
    etapes: [
      {
        cle: 'recenser',
        titre: 'Rassembler tous les passages',
        consigne: `Cherchez le nom du personnage dans toute la Bible et notez chaque référence, sans en écarter aucune — même celles qui ne vous arrangent pas.`,
        questions: [
          `Dans quels livres apparaît-il ?`,
          `Porte-t-il un autre nom ailleurs (Saul et Paul, Jacob et Israël, Simon et Pierre) ?`,
          `D'autres textes parlent-ils de lui sans le nommer ?`,
        ],
        outil: `La recherche de l'application trouve le nom dans toutes les versions installées.`,
        garde: `Une vie étudiée sur les seuls passages flatteurs n'est plus une vie, c'est un portrait.`,
        hauteur: 130,
      },
      {
        cle: 'lire',
        titre: 'Lire tous les passages d’un trait',
        consigne: `Lisez-les à la suite, dans l'ordre du récit, sans prendre de notes. Le but est de tenir la vie entière dans la tête avant de la découper.`,
        questions: [
          `Quelle impression d'ensemble se dégage de cette vie ?`,
          `Où se situe le sommet ? Où se situe le point le plus bas ?`,
        ],
      },
      {
        cle: 'situer',
        titre: 'Situer l’homme dans son monde',
        consigne: `Notez l'époque, le lieu, la famille, le métier, la position sociale. Cherchez ce que son nom signifie : dans la Bible, il dit souvent quelque chose.`,
        questions: [
          `À quelle époque et sous quel régime vit-il ?`,
          `De quelle famille, de quelle tribu, de quel peuple vient-il ?`,
          `Que signifie son nom ? A-t-il été changé, et par qui ?`,
        ],
      },
      {
        cle: 'faits',
        titre: 'Établir les faits',
        consigne: `Relevez ce qu'il fait et ce qu'il dit, dans l'ordre. Notez aussi ce que les autres disent de lui — et ce que Dieu dit de lui.`,
        questions: [
          `Quels sont les événements décisifs de sa vie, dans l'ordre ?`,
          `Quelles sont ses paroles rapportées ?`,
          `Que disent de lui les autres personnages ? Que dit Dieu de lui ?`,
        ],
        garde: `Restez sur ce que le texte dit. Ce que vous imaginez de ses pensées n'en fait pas partie.`,
        hauteur: 150,
      },
      {
        cle: 'relations',
        titre: 'Regarder ses relations',
        consigne: `Un homme se connaît à ses liens. Examinez sa relation avec Dieu, avec sa famille, avec ses amis, avec ses adversaires.`,
        questions: [
          `Comment se comporte-t-il envers Dieu ? Prie-t-il ? Obéit-il ?`,
          `Qui l'a influencé, en bien ou en mal ?`,
          `Qui a-t-il influencé à son tour ?`,
        ],
      },
      {
        cle: 'caractere',
        titre: 'Dégager son caractère',
        consigne: `Nommez ses qualités et ses défauts, et pour chacun donnez la référence qui le prouve. Regardez ensuite si son caractère a changé au fil du temps.`,
        questions: [
          `Quelles qualités le texte montre-t-il, et où ?`,
          `Quels défauts, et où ?`,
          `Est-il le même au début et à la fin ? Qu'est-ce qui l'a changé ?`,
        ],
        garde: `Une qualité sans référence est une opinion. Chaque trait doit s'appuyer sur un verset.`,
        hauteur: 150,
      },
      {
        cle: 'dieu',
        titre: 'Voir ce que Dieu fait en lui',
        consigne: `C'est le cœur de la méthode. Le personnage n'est pas le sujet du récit : Dieu l'est. Cherchez comment Dieu s'y prend avec lui.`,
        questions: [
          `Quelles promesses Dieu lui fait-il ?`,
          `Comment Dieu le corrige-t-il ? Comment le relève-t-il ?`,
          `Qu'est-ce que cette vie révèle du caractère de Dieu ?`,
        ],
        hauteur: 150,
      },
      {
        cle: 'lecon',
        titre: 'Tirer la leçon permanente',
        consigne: `En une phrase : ce que cette vie enseigne, valable pour tout croyant, en tout temps.`,
        questions: [
          `Y a-t-il un exemple à suivre ? Une erreur à éviter ?`,
          `Qu'est-ce que je ne dois surtout pas conclure de cette vie ?`,
        ],
      },
      {
        cle: 'application',
        titre: 'Appliquer',
        consigne: `Une action personnelle, pratique, possible et mesurable — les quatre caractéristiques de la méthode OIA.`,
        questions: [
          `À la première personne : que vais-je faire ?`,
          `Quand exactement ?`,
        ],
      },
    ],
    pourAllerPlusLoin: [
      {
        sourceId: SOURCE_KUEN_ETUDIER,
        note: `Kuen consacre un chapitre à l'étude biographique et donne la liste des questions à poser à un personnage.`,
      },
      {
        sourceId: SOURCE_HENDRICKS,
        note: `Hendricks montre comment observer un personnage sans lui prêter ce que le texte ne dit pas.`,
      },
    ],
  },

  // ————————————————————————————————————————————————————————————
  {
    id: 'thematique',
    titre: 'Étude thématique',
    sousTitre: 'Ce que toute la Bible dit d’un sujet',
    symbole: '❋',
    objet: 'Le thème à étudier',
    exempleSujet: 'La grâce',
    duree: '3 à 6 heures',
    quand: `Quand une question vous travaille — le pardon, la souffrance, l'argent, la crainte de Dieu — et que vous voulez savoir ce que l'Écriture entière en dit, pas seulement le verset qu'on cite toujours.`,
    description: `C'est la méthode la plus utile et la plus dangereuse. Utile, parce qu'elle donne une vue d'ensemble. Dangereuse, parce qu'on y trouve trop facilement ce qu'on y a apporté : il suffit de choisir ses versets. La discipline des étapes est là pour vous en empêcher.`,
    etapes: [
      {
        cle: 'delimiter',
        titre: 'Délimiter le sujet',
        consigne: `Formulez une question précise, pas un mot. « La prière » ne donnera rien ; « Que promet Dieu à celui qui prie ? » donnera quelque chose.`,
        questions: [
          `Quelle est exactement ma question ?`,
          `Ce sujet est-il assez étroit pour être traité, assez large pour valoir la peine ?`,
        ],
        garde: `Un thème trop vaste produit une liste de versets, pas une compréhension.`,
      },
      {
        cle: 'rassembler',
        titre: 'Rassembler les textes',
        consigne: `Cherchez le mot et ses proches dans toute la Bible ; suivez ensuite les renvois. Notez toutes les références avant d'en lire une seule attentivement.`,
        questions: [
          `Quels mots dois-je chercher, et quels synonymes ?`,
          `Quels passages traitent du sujet sans employer le mot ?`,
        ],
        outil: `La recherche et le dictionnaire de l'application couvrent les versions et les ouvrages installés.`,
        hauteur: 150,
      },
      {
        cle: 'trier',
        titre: 'Trier les textes',
        consigne: `Classez-les : ceux qui définissent, ceux qui donnent un exemple, ceux qui commandent, ceux qui promettent, ceux qui avertissent.`,
        questions: [
          `Lesquels enseignent, lesquels racontent ?`,
          `Lesquels sont les textes principaux, lesquels ne font qu'effleurer le sujet ?`,
        ],
        garde: `Un récit rapporte ce qui s'est passé ; il n'enseigne pas forcément que cela doive se reproduire.`,
        hauteur: 150,
      },
      {
        cle: 'contexte',
        titre: 'Lire chaque texte dans son contexte',
        consigne: `Ne prenez aucun verset seul. Lisez le paragraphe entier, sachez à qui l'auteur parle et dans quel genre littéraire il écrit.`,
        questions: [
          `Ce verset dit-il encore la même chose une fois replacé dans son paragraphe ?`,
          `Est-ce une promesse faite à tous, ou à quelqu'un en particulier ?`,
        ],
        garde: `C'est ici que la plupart des études thématiques se perdent : un verset arraché à son contexte dit ce qu'on veut.`,
        hauteur: 150,
      },
      {
        cle: 'comparer',
        titre: 'Comparer et ordonner',
        consigne: `Mettez en regard ce que dit l'Ancien Testament et ce que dit le Nouveau. Cherchez la progression, non la contradiction.`,
        questions: [
          `Le sujet est-il traité différemment avant et après la venue de Jésus-Christ ?`,
          `Quel texte éclaire les autres ?`,
        ],
        hauteur: 150,
      },
      {
        cle: 'formuler',
        titre: 'Formuler l’enseignement',
        consigne: `En un paragraphe, écrivez ce que la Bible enseigne sur ce sujet. Chaque affirmation doit porter sa référence.`,
        questions: [
          `Puis-je le dire en cinq lignes, sans jargon ?`,
          `Chaque phrase s'appuie-t-elle sur un texte ?`,
        ],
        hauteur: 180,
      },
      {
        cle: 'verifier',
        titre: 'Chercher ce qui vous contredit',
        consigne: `Cherchez délibérément un texte qui gêne votre conclusion. S'il en existe un, votre conclusion est à revoir — pas le texte.`,
        questions: [
          `Quel passage rend ma conclusion inconfortable ?`,
          `Ai-je écarté un texte parce qu'il ne rentrait pas ?`,
        ],
        garde: `Une étude thématique qui ne rencontre aucune objection n'a pas cherché.`,
      },
      {
        cle: 'application',
        titre: 'Appliquer',
        consigne: `Ce que cette vérité change dans votre vie cette semaine — personnel, pratique, possible, mesurable.`,
        questions: [`Que vais-je faire, et quand ?`],
      },
    ],
    pourAllerPlusLoin: [
      {
        sourceId: SOURCE_FEE_STUART,
        note: `Fee et Stuart montrent pourquoi le genre littéraire d'un texte décide de ce qu'on a le droit d'en tirer.`,
      },
      {
        sourceId: SOURCE_KUEN_ETUDIER,
        note: `Kuen décrit la marche de l'étude par sujets et met en garde contre les versets choisis.`,
      },
    ],
  },

  // ————————————————————————————————————————————————————————————
  {
    id: 'mots',
    titre: 'Étude de mots',
    sousTitre: 'Ce qu’un mot veut dire, ici',
    symbole: '✎',
    objet: 'Le mot à étudier',
    exempleSujet: 'Grâce',
    duree: '1 à 2 heures',
    quand: `Quand un mot porte tout le poids d'un passage, ou revient si souvent qu'il en devient le sujet — et que vous soupçonnez qu'il ne veut pas dire ce que le français vous fait croire.`,
    description: `Les mots de la Bible ont été écrits en hébreu et en grec, et aucune traduction ne rend un mot par un seul équivalent. Étudier un mot, c'est chercher l'éventail de ses sens, puis laisser le contexte choisir lequel s'applique ici.`,
    etapes: [
      {
        cle: 'choisir',
        titre: 'Choisir le mot',
        consigne: `Prenez un mot qui compte : répété, chargé, ou dont le sens vous échappe. Notez le passage où vous l'avez rencontré.`,
        questions: [
          `Pourquoi ce mot m'arrête-t-il ?`,
          `Est-il répété dans le passage ? Combien de fois ?`,
        ],
      },
      {
        cle: 'original',
        titre: 'Retrouver le mot d’origine',
        consigne: `Cherchez le mot hébreu ou grec derrière le mot français, et sa translittération.`,
        questions: [
          `Quel est le mot original ? Comment se prononce-t-il ?`,
          `Le même mot français traduit-il ailleurs un autre mot original ?`,
        ],
        outil: `Le dictionnaire de l'application donne les mots originaux et leur translittération pour les notions qu'il couvre.`,
      },
      {
        cle: 'sens',
        titre: 'Relever l’éventail des sens',
        consigne: `Un mot n'a pas un sens, il en a plusieurs. Notez-les tous avant de choisir.`,
        questions: [
          `Quels sens ce mot peut-il porter ?`,
          `Y a-t-il un sens courant et un sens technique ?`,
        ],
      },
      {
        cle: 'emplois',
        titre: 'Suivre tous ses emplois',
        consigne: `Regardez où le mot apparaît ailleurs — d'abord chez le même auteur, puis dans le même livre, puis dans toute la Bible.`,
        questions: [
          `Comment cet auteur emploie-t-il ce mot ailleurs ?`,
          `L'emploi est-il le même dans l'Ancien et dans le Nouveau Testament ?`,
        ],
        hauteur: 150,
      },
      {
        cle: 'contexte',
        titre: 'Laisser le contexte décider',
        consigne: `Parmi tous les sens possibles, un seul convient ici. C'est la phrase, le paragraphe et l'argument de l'auteur qui le désignent.`,
        questions: [
          `Quel sens rend la phrase cohérente ?`,
          `Quels sens le contexte exclut-il ?`,
        ],
        garde: `L'étymologie ne donne pas le sens. Ce qu'un mot voulait dire trois siècles plus tôt ne dit pas ce qu'il veut dire ici.`,
        hauteur: 150,
      },
      {
        cle: 'voisins',
        titre: 'Comparer aux mots proches et opposés',
        consigne: `Un mot se précise par ce qu'il n'est pas. Cherchez ses synonymes et son contraire.`,
        questions: [
          `Quel autre mot l'auteur aurait-il pu employer, et pourquoi ne l'a-t-il pas fait ?`,
          `Quel est le contraire de ce mot dans ce passage ?`,
        ],
      },
      {
        cle: 'conclusion',
        titre: 'Conclure',
        consigne: `En une phrase : ce que ce mot signifie dans ce passage précis, et ce que cela change à la lecture.`,
        questions: [
          `Comment traduirais-je ce mot ici, en mes propres termes ?`,
          `Qu'est-ce que je lisais de travers avant ?`,
        ],
      },
    ],
    pourAllerPlusLoin: [
      {
        sourceId: SOURCE_FEE_STUART,
        note: `Fee et Stuart expliquent en détail le piège de l'étymologie et la manière correcte de conduire une étude de mot.`,
      },
      {
        sourceId: SOURCE_KUEN_LIRE,
        note: `Kuen montre comment les mots d'une traduction recouvrent plusieurs mots d'origine.`,
      },
    ],
  },

  // ————————————————————————————————————————————————————————————
  {
    id: 'survol',
    titre: 'Le survol des livres',
    sousTitre: 'Voir un livre entier d’un seul regard',
    symbole: '◈',
    objet: 'Le livre à survoler',
    exempleSujet: 'Philippiens',
    duree: '1 à 3 heures',
    quand: `Avant toute autre étude d'un livre, et avant de prêcher ou d'enseigner un de ses passages. C'est la première chose à faire, et celle qu'on saute le plus souvent.`,
    description: `On ne comprend pas une lettre en lisant un paragraphe. Le survol consiste à embrasser le livre entier — son auteur, son occasion, son plan, son message — avant d'en étudier une ligne. Une heure de survol évite dix erreurs d'interprétation.`,
    etapes: [
      {
        cle: 'lire',
        titre: 'Lire le livre d’un trait',
        consigne: `Lisez-le en entier, en une fois si possible, sans vous arrêter et sans prendre de notes. Recommencez : deux ou trois lectures valent mieux qu'une lecture annotée.`,
        questions: [
          `Quelle impression d'ensemble me reste-t-il ?`,
          `Sur quel ton l'auteur écrit-il — joie, colère, inquiétude, tendresse ?`,
        ],
        outil: `Le lecteur de l'application enchaîne les chapitres sans quitter l'écran.`,
      },
      {
        cle: 'auteur',
        titre: 'Identifier l’auteur et les destinataires',
        consigne: `Cherchez dans le texte lui-même qui écrit, à qui, d'où et quand. Le livre le dit souvent au début ou à la fin.`,
        questions: [
          `Qui écrit ? Que sait-on de lui ?`,
          `À qui écrit-il ? Que sait-on d'eux ?`,
          `D'où écrit-il, et à quelle date ?`,
        ],
      },
      {
        cle: 'occasion',
        titre: 'Trouver l’occasion',
        consigne: `Aucun livre biblique n'a été écrit sans raison. Cherchez la situation qui l'a provoqué.`,
        questions: [
          `Quel problème, quelle question, quelle nouvelle a poussé l'auteur à écrire ?`,
          `Que veut-il obtenir de ses lecteurs ?`,
        ],
        garde: `Un livre lu sans son occasion devient un recueil de maximes intemporelles. Il ne l'est pas.`,
      },
      {
        cle: 'genre',
        titre: 'Reconnaître le genre littéraire',
        consigne: `Récit, loi, poésie, sagesse, prophétie, évangile, épître, apocalypse : le genre commande la façon de lire.`,
        questions: [
          `De quel genre relève ce livre ?`,
          `Qu'est-ce que ce genre m'autorise à conclure, et qu'est-ce qu'il m'interdit ?`,
        ],
      },
      {
        cle: 'recurrences',
        titre: 'Relever ce qui revient',
        consigne: `Notez les mots, les expressions et les idées qui reviennent. La répétition est la manière dont un auteur souligne.`,
        questions: [
          `Quels mots reviennent le plus souvent ?`,
          `Y a-t-il une phrase qui rythme le livre ?`,
        ],
        hauteur: 150,
      },
      {
        cle: 'plan',
        titre: 'Dresser le plan',
        consigne: `Découpez le livre en grandes parties et donnez à chacune un titre tiré du texte, en vos propres mots.`,
        questions: [
          `Où le livre change-t-il de sujet ou de ton ?`,
          `Comment nommerais-je chaque partie ?`,
        ],
        hauteur: 180,
      },
      {
        cle: 'verset',
        titre: 'Choisir le verset-clé',
        consigne: `Le verset qui résume le livre, ou vers lequel tout converge.`,
        questions: [`Si je ne devais retenir qu'un verset de ce livre, lequel ?`],
      },
      {
        cle: 'message',
        titre: 'Dire le message en une phrase',
        consigne: `Une seule phrase, sans « et » : ce que ce livre dit.`,
        questions: [
          `Quel est le message central ?`,
          `Qu'est-ce que ce livre apporte que les autres n'apportent pas ?`,
        ],
      },
    ],
    pourAllerPlusLoin: [
      {
        sourceId: SOURCE_HENDRICKS,
        note: `Hendricks insiste sur la lecture répétée du livre entier avant toute observation de détail.`,
      },
      {
        sourceId: SOURCE_FEE_STUART,
        note: `Fee et Stuart traitent chaque genre littéraire séparément et disent ce que chacun demande.`,
      },
    ],
  },

  // ————————————————————————————————————————————————————————————
  {
    id: 'analyse',
    titre: 'Analyse synthétique de livres',
    sousTitre: 'Suivre l’argument d’un bout à l’autre',
    symbole: '⌘',
    objet: 'Le livre à analyser',
    exempleSujet: 'Romains',
    duree: '5 à 15 heures',
    quand: `Après le survol, quand vous voulez posséder un livre — pour l'enseigner, le prêcher, ou le porter longtemps. C'est la méthode la plus exigeante des six.`,
    description: `Le survol donne la vue d'ensemble ; l'analyse synthétique donne la charpente. On titre chaque chapitre, on regroupe les chapitres en sections, on suit le fil de l'argument, et l'on finit par tenir le livre entier sur une page.`,
    etapes: [
      {
        cle: 'survol',
        titre: 'Partir du survol',
        consigne: `Reprenez le survol du livre — auteur, destinataires, occasion, genre. L'analyse ne se fait pas sans lui.`,
        questions: [
          `Le survol est-il fait ? Sinon, faites-le d'abord.`,
          `Quel était le message en une phrase ?`,
        ],
      },
      {
        cle: 'titres',
        titre: 'Titrer chaque chapitre',
        consigne: `Lisez chaque chapitre et donnez-lui un titre court, tiré de son contenu, jamais de vos souvenirs. Écrivez-les tous à la suite.`,
        questions: [
          `De quoi ce chapitre parle-t-il, en trois mots ?`,
          `Mon titre vient-il du texte, ou de ce que je croyais savoir ?`,
        ],
        garde: `Un titre honnête doit pouvoir être justifié par un verset du chapitre.`,
        hauteur: 220,
      },
      {
        cle: 'sections',
        titre: 'Regrouper en sections',
        consigne: `Rassemblez les chapitres qui vont ensemble et nommez chaque groupe. Une section commence là où le sujet change.`,
        questions: [
          `Quels chapitres traitent d'une même chose ?`,
          `Où sont les charnières du livre ?`,
        ],
        hauteur: 180,
      },
      {
        cle: 'fil',
        titre: 'Suivre le fil de l’argument',
        consigne: `Repérez les mots de liaison — donc, c'est pourquoi, mais, or, ainsi. Ils montrent comment l'auteur passe d'une idée à la suivante.`,
        questions: [
          `Comment chaque section prépare-t-elle la suivante ?`,
          `Quels mots de liaison marquent les tournants ?`,
        ],
        garde: `Un livre biblique n'est pas une collection de chapitres, c'est un raisonnement ou un récit continu.`,
        hauteur: 180,
      },
      {
        cle: 'cadre',
        titre: 'Relever le cadre',
        consigne: `Notez les personnages, les lieux et les repères de temps qui structurent le livre.`,
        questions: [
          `Qui revient d'un bout à l'autre ?`,
          `Le livre suit-il une progression géographique ou chronologique ?`,
        ],
      },
      {
        cle: 'progression',
        titre: 'Voir la progression du thème',
        consigne: `Le thème central ne reste pas immobile : il s'annonce, se développe, se résout. Décrivez ce mouvement.`,
        questions: [
          `Où le thème est-il annoncé ? Où atteint-il son sommet ?`,
          `Comment le livre se termine-t-il par rapport à son début ?`,
        ],
        hauteur: 150,
      },
      {
        cle: 'schema',
        titre: 'Tenir le livre sur une page',
        consigne: `Écrivez le plan complet : sections, titres de chapitres, thème, progression. Cette page est le fruit de l'analyse.`,
        questions: [`Puis-je expliquer le livre entier à partir de cette seule page ?`],
        hauteur: 250,
      },
      {
        cle: 'apport',
        titre: 'Dire ce que l’ensemble enseigne',
        consigne: `Ce que le livre entier dit et qu'aucun de ses chapitres ne dit à lui seul.`,
        questions: [
          `Qu'ai-je compris que la lecture chapitre par chapitre ne donnait pas ?`,
          `Qu'est-ce que ce livre change à ma façon de lire le reste de la Bible ?`,
        ],
        hauteur: 150,
      },
    ],
    pourAllerPlusLoin: [
      {
        sourceId: SOURCE_KUEN_ETUDIER,
        note: `Kuen détaille l'analyse d'un livre, du titrage des chapitres au plan d'ensemble.`,
      },
      {
        sourceId: SOURCE_HENDRICKS,
        note: `Hendricks montre comment la structure d'un texte porte elle-même une part du sens.`,
      },
    ],
  },

  // ————————————————————————————————————————————————————————————
  {
    id: 'contexte',
    titre: 'Étude de contexte',
    sousTitre: 'Ce qui entoure le texte le gouverne',
    symbole: '◎',
    objet: 'Le passage à situer',
    exempleSujet: 'Philippiens 4:13',
    duree: '1 à 3 heures',
    quand: `Chaque fois qu'un verset vous frappe et que vous voulez le citer. C'est la méthode qui empêche les contresens, et le verset le plus connu est celui qui en a le plus besoin.`,
    description: `Un texte sans contexte est un prétexte. Six enveloppes entourent un passage — le paragraphe, le livre, l'auteur, l'histoire, la géographie, l'histoire du salut — et chacune limite ce qu'on a le droit de lui faire dire.`,
    etapes: [
      {
        cle: 'immediat',
        titre: 'Le contexte immédiat',
        consigne: `Lisez ce qui précède et ce qui suit : le paragraphe entier, puis le chapitre entier. C'est le contexte le plus décisif et le plus négligé.`,
        questions: [
          `De quoi l'auteur parle-t-il juste avant ? Juste après ?`,
          `À qui s'adresse-t-il exactement à cet endroit ?`,
          `Le verset dit-il encore la même chose une fois remis dans son paragraphe ?`,
        ],
        outil: `Le lecteur de l'application ouvre le chapitre entier depuis n'importe quel verset.`,
        hauteur: 150,
      },
      {
        cle: 'livre',
        titre: 'Le contexte du livre',
        consigne: `Situez le passage dans le plan du livre : à quelle section appartient-il, et quel rôle y joue-t-il ?`,
        questions: [
          `Où ce passage tombe-t-il dans le déroulement du livre ?`,
          `Est-il au service de l'argument principal, ou en marge ?`,
        ],
      },
      {
        cle: 'auteur',
        titre: 'Le contexte de l’auteur',
        consigne: `Cherchez ce que le même auteur dit ailleurs sur le même sujet. Un auteur s'explique par lui-même avant de s'expliquer par un autre.`,
        questions: [
          `Cet auteur traite-t-il le sujet ailleurs ?`,
          `Emploie-t-il ce vocabulaire dans le même sens ailleurs ?`,
        ],
      },
      {
        cle: 'historique',
        titre: 'Le contexte historique et culturel',
        consigne: `Renseignez-vous sur l'époque : qui gouverne, comment on vit, ce qui va de soi pour les premiers lecteurs et plus pour nous.`,
        questions: [
          `Quelles coutumes le texte suppose-t-il connues ?`,
          `Quelle situation politique, économique ou religieuse est en arrière-plan ?`,
        ],
        outil: `Le dictionnaire biblique installé éclaire les usages, les fonctions et les objets du texte.`,
        hauteur: 150,
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
        cle: 'salut',
        titre: 'Le contexte de l’histoire du salut',
        consigne: `Placez le passage sur la ligne du temps de Dieu : avant ou après la croix, sous quelle alliance, à quel moment du dessein de Dieu.`,
        questions: [
          `Ancien ou Nouveau Testament ? Sous quelle alliance ?`,
          `Ce qui est demandé ici s'adresse-t-il encore au chrétien d'aujourd'hui, et à quel titre ?`,
        ],
        hauteur: 150,
      },
      {
        cle: 'controle',
        titre: 'Passer le contrôle',
        consigne: `Relisez le chapitre entier à voix haute, puis relisez votre interprétation. Si elle ne tient plus, c'est elle qu'il faut corriger.`,
        questions: [
          `Mon interprétation résiste-t-elle à la lecture du chapitre entier ?`,
          `Est-ce que je fais dire au texte ce que j'avais envie d'y trouver ?`,
        ],
        garde: `C'est l'étape que l'on saute quand la conclusion nous plaît. C'est justement là qu'il ne faut pas la sauter.`,
      },
      {
        cle: 'conclusion',
        titre: 'Conclure',
        consigne: `Écrivez ce que le contexte autorise à dire — et ce qu'il interdit de faire dire au texte.`,
        questions: [
          `Que signifie ce passage, une fois tout replacé ?`,
          `Quel usage courant de ce verset le contexte disqualifie-t-il ?`,
        ],
        hauteur: 150,
      },
    ],
    pourAllerPlusLoin: [
      {
        sourceId: SOURCE_FEE_STUART,
        note: `Fee et Stuart font du contexte historique et littéraire la première règle de toute interprétation saine.`,
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
