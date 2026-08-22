/**
 * Ce que les ouvrages de méthode enseignent sur chacun des trois temps.
 *
 * Ces conseils ne sont pas extraits mécaniquement : ces livres sont de la
 * prose sans marqueur exploitable, et un analyseur automatique n'en aurait
 * tiré que du bruit. Ils ont donc été lus, et le contenu structuré ici renvoie
 * au chapitre d'où il provient, pour que le lecteur puisse s'y reporter.
 *
 * Découverte au passage : les neuf questions d'Application de la méthode OIA
 * sont celles du chapitre 44 de Howard Hendricks, dans le même ordre. La clé
 * `cleQuestion` fait le lien, de sorte que chaque question de l'application
 * puisse afficher le commentaire de son auteur.
 */

import { ConseilMethode, ModuleConnaissance, Source } from '../../knowledge/types';

export const SOURCE_HENDRICKS = 'living-by-the-book';
export const SOURCE_FEE_STUART = 'how-to-read-the-bible';
export const SOURCE_KUEN_ETUDIER = 'kuen-comment-etudier';
export const SOURCE_KUEN_LIRE = 'kuen-comment-lire';

const sourceHendricks: Source = {
  id: SOURCE_HENDRICKS,
  titre: 'Living By the Book — The Art and Science of Reading the Bible',
  auteur: 'Howard G. Hendricks et William D. Hendricks',
  editeur: 'Moody Publishers',
  annee: '2007',
  langue: 'en',
  type: 'etude',
  abreviation: 'LBB',
  documentOrigine: 'Living-By-the-Book-Hendricks.pdf',
  noteProvenance: `L'ouvrage d'où vient la méthode Observation – Interprétation – Application, y compris les neuf questions de l'Application.`,
  ajouteLe: '2026-08-22',
};

const sourceFeeStuart: Source = {
  id: SOURCE_FEE_STUART,
  titre: 'How to Read the Bible for All Its Worth',
  auteur: 'Gordon D. Fee et Douglas Stuart',
  editeur: 'Zondervan',
  annee: '2014',
  langue: 'en',
  type: 'etude',
  abreviation: 'HRB',
  documentOrigine: 'Fee-Stuart-How-to-Read-the-Bible.pdf',
  noteProvenance: `Herméneutique par genre littéraire : chaque genre biblique appelle des règles de lecture propres.`,
  ajouteLe: '2026-08-22',
};

const sourceKuenEtudier: Source = {
  id: SOURCE_KUEN_ETUDIER,
  titre: 'Comment étudier la Bible',
  auteur: 'Alfred Kuen',
  editeur: 'BLF Europe',
  annee: '2001',
  langue: 'fr',
  type: 'etude',
  abreviation: 'CEB',
  documentOrigine: 'Comment étudier la Bible - Alfred Kuen.pdf',
  ajouteLe: '2026-08-22',
};

const sourceKuenLire: Source = {
  id: SOURCE_KUEN_LIRE,
  titre: 'Comment lire la Bible',
  auteur: 'Alfred Kuen',
  editeur: 'BLF Europe',
  langue: 'fr',
  type: 'etude',
  abreviation: 'CLB',
  documentOrigine: 'Comment lire la Bible - Alfred Kuen.pdf',
  ajouteLe: '2026-08-22',
};

// ————————————————————————————————————————————————————————————
// Observation — Howard Hendricks
// ————————————————————————————————————————————————————————————

const observation: ConseilMethode[] = [
  {
    id: 'lbb-obs-lire-attentivement',
    temps: 'observation',
    titre: `Lire attentivement, et plusieurs fois`,
    texte: `Hendricks consacre dix chapitres à la seule manière de lire : attentivement, à plusieurs reprises, patiemment, sélectivement, dans la prière, avec imagination, en méditant, avec un but, en cherchant à retenir, et en prenant du recul. La première lecture ne donne presque rien ; c'est la troisième ou la quatrième qui commence à voir. Relire n'est pas perdre du temps : c'est l'essentiel du travail d'observation.`,
    sourceId: SOURCE_HENDRICKS,
    localisation: { chapitre: '7 à 17', section: 'Ten Strategies to First-Rate Reading' },
  },
  {
    id: 'lbb-obs-emphase',
    temps: 'observation',
    titre: `Ce qui est mis en relief`,
    texte: `Un auteur souligne par la place qu'il accorde. La Genèse consacre onze chapitres à la création, au déluge et à Babel, puis trente-neuf à quatre personnes : ce déséquilibre est un choix, non un hasard. Regardez aussi l'ordre des éléments, la progression du récit, et les endroits où l'auteur ralentit.`,
    sourceId: SOURCE_HENDRICKS,
    localisation: { chapitre: '19', section: 'Things That Are Emphasized' },
  },
  {
    id: 'lbb-obs-repetition',
    temps: 'observation',
    titre: `Ce qui est répété`,
    texte: `Une formule qui revient est une insistance. « Que celui qui a des oreilles entende » revient au moins neuf fois dans les évangiles, puis aux sept Églises de l'Apocalypse. Comptez les mots, les images et les tournures qui reviennent : ils désignent ce que l'auteur ne veut pas qu'on manque.`,
    sourceId: SOURCE_HENDRICKS,
    localisation: { chapitre: '20', section: 'Things That Are Repeated' },
  },
  {
    id: 'lbb-obs-relation',
    temps: 'observation',
    titre: `Ce qui est mis en relation`,
    texte: `Deux éléments voisins ne sont pas pour autant liés : il faut qu'ils agissent l'un sur l'autre. Cherchez trois sortes de liens — du général au particulier, la cause et l'effet, la question et sa réponse. Les mots de liaison (car, donc, mais, afin que) sont les articulations du texte.`,
    sourceId: SOURCE_HENDRICKS,
    localisation: { chapitre: '21', section: 'Things That Are Related' },
  },
  {
    id: 'lbb-obs-semblable',
    temps: 'observation',
    titre: `Ce qui se ressemble et ce qui s'oppose`,
    texte: `« Comme » et « ainsi que » signalent une comparaison, et le texte biblique en est plein. Les oppositions comptent autant : « mais », « au contraire », « il n'en est pas ainsi ». Repérer une comparaison, c'est souvent trouver la clé du passage.`,
    sourceId: SOURCE_HENDRICKS,
    localisation: { chapitre: '22', section: 'Things That Are Alike & Unlike' },
  },
  {
    id: 'lbb-obs-vrai',
    temps: 'observation',
    titre: `Ce qui sonne vrai`,
    texte: `Que dit ce passage du réel ? Les personnages bibliques ont éprouvé les émotions que nous éprouvons et posé les questions que nous posons. Chercher ce qui, dans le texte, résonne avec l'expérience prépare l'application sans l'anticiper.`,
    sourceId: SOURCE_HENDRICKS,
    localisation: { chapitre: '23', section: 'Things That Are True to Life' },
  },
  {
    id: 'ceb-obs-lecture',
    temps: 'observation',
    titre: `Lire avant d'étudier`,
    texte: `Kuen distingue la lecture et l'étude, et refuse de réserver la seconde aux spécialistes. L'étude ne demande pas d'abord des dictionnaires : elle demande du temps et de l'attention. Elle suit l'exemple de Jésus, des apôtres et des serviteurs de Dieu tout au long de l'histoire de l'Église.`,
    sourceId: SOURCE_KUEN_ETUDIER,
    localisation: { chapitre: 'Introduction', section: 'Pourquoi étudier la Bible ?' },
  },
  {
    id: 'clb-obs-dispositions',
    temps: 'observation',
    titre: `Dans quelles dispositions venir au texte`,
    texte: `Kuen commence par la posture, avant la méthode. Je viens à un livre dont Dieu est l'auteur : lui seul peut me l'expliquer, donc je commence par la prière. Puis, dit-il, quatre dispositions — l'humilité, parce que c'est le Dieu tout-puissant qui parle à des pécheurs ; la foi, parce qu'il ne saurait mentir ; l'obéissance, prêt à me soumettre à ce qu'il montrera ; la confiance, parce qu'il ne veut que mon bien.`,
    sourceId: SOURCE_KUEN_LIRE,
    localisation: { chapitre: '2', section: 'Dans quelles dispositions méditer ?' },
  },
];

// ————————————————————————————————————————————————————————————
// Interprétation — les cinq clés de Hendricks
// ————————————————————————————————————————————————————————————

const interpretation: ConseilMethode[] = [
  {
    id: 'lbb-int-contenu',
    temps: 'interpretation',
    titre: `Le contenu`,
    texte: `Le contenu est la matière première de l'interprétation : les termes, la structure, la forme littéraire, l'atmosphère du passage. Il n'y a rien à interpréter qu'on n'ait d'abord observé — c'est pourquoi le temps de l'Observation précède celui-ci, et non l'inverse.`,
    sourceId: SOURCE_HENDRICKS,
    localisation: { chapitre: '30', section: 'Content' },
  },
  {
    id: 'lbb-int-contexte',
    temps: 'interpretation',
    titre: `Le contexte`,
    texte: `Le contexte, c'est ce qui précède et ce qui suit. Un verset arraché à son contexte peut servir n'importe quelle thèse — c'est la manière la plus courante de faire dire à l'Écriture le contraire de ce qu'elle dit. Lisez toujours le paragraphe entier, et de préférence le chapitre.`,
    sourceId: SOURCE_HENDRICKS,
    localisation: { chapitre: '31', section: 'Context' },
  },
  {
    id: 'lbb-int-comparaison',
    temps: 'interpretation',
    titre: `La comparaison`,
    texte: `Comparer l'Écriture avec l'Écriture : le meilleur interprète de la Bible est la Bible elle-même. Un passage obscur s'éclaire par un passage clair, jamais l'inverse. Les références croisées de l'application servent précisément à cela.`,
    sourceId: SOURCE_HENDRICKS,
    localisation: { chapitre: '32', section: 'Comparison' },
  },
  {
    id: 'lbb-int-culture',
    temps: 'interpretation',
    titre: `La culture`,
    texte: `Le texte a été écrit dans une culture qui n'est pas la nôtre. Le livre de Ruth se comprend autrement quand on sait qu'il se déroule au temps des juges, l'âge sombre d'Israël. Chercher ce que le geste, la coutume ou l'institution signifiaient alors évite de projeter nos évidences.`,
    sourceId: SOURCE_HENDRICKS,
    localisation: { chapitre: '33', section: 'Culture' },
  },
  {
    id: 'lbb-int-consultation',
    temps: 'interpretation',
    titre: `La consultation`,
    texte: `Consulter d'autres lecteurs vient en dernier, et non en premier : après avoir cherché soi-même. Mais y venir est nécessaire — l'Esprit n'a pas parlé qu'à nous, et des milliers ont parcouru ce chemin avant nous.`,
    sourceId: SOURCE_HENDRICKS,
    localisation: { chapitre: '34', section: 'Consultation' },
  },
  {
    id: 'hrb-int-genre',
    temps: 'interpretation',
    titre: `Le genre littéraire commande la lecture`,
    texte: `Fee et Stuart font du genre la question première : un psaume, une loi, un proverbe, une épître et une apocalypse ne se lisent pas de la même manière. Appliquer à un proverbe les règles d'une épître, c'est se tromper de livre avant de se tromper de sens.`,
    sourceId: SOURCE_FEE_STUART,
    localisation: { chapitre: '1', section: 'The Need to Interpret' },
  },
];

// ————————————————————————————————————————————————————————————
// Interprétation par genre — Fee & Stuart
// ————————————————————————————————————————————————————————————

const parGenre: ConseilMethode[] = [
  {
    id: 'hrb-epitre',
    temps: 'interpretation',
    genre: 'epitre',
    titre: `Les épîtres sont des écrits de circonstance`,
    texte: `Ce sont des « documents occasionnels » : chacune répond à une situation précise, dans une Église précise. On y trouve de la théologie en abondance, mais elle n'y est jamais exposée pour elle-même — elle est toujours appliquée à un besoin. Reconstituer l'occasion avant de généraliser.`,
    sourceId: SOURCE_FEE_STUART,
    localisation: { chapitre: '3', section: 'Learning to Think Contextually' },
  },
  {
    id: 'hrb-recit',
    temps: 'interpretation',
    genre: 'recit',
    titre: `Ce que les récits ne sont pas`,
    texte: `Les récits de l'Ancien Testament ne sont ni des allégories à sens caché, ni des fables destinées à enseigner une morale. Un récit rapporte ce qui est arrivé, pas nécessairement ce qui devait arriver : ce que fait un personnage n'est pas pour autant approuvé. Le narrateur enseigne surtout par la manière dont il raconte.`,
    sourceId: SOURCE_FEE_STUART,
    localisation: { chapitre: '5', section: 'Their Proper Use' },
  },
  {
    id: 'hrb-actes',
    temps: 'interpretation',
    genre: 'actes',
    titre: `Le précédent historique n'est pas une règle`,
    texte: `La question propre aux Actes est celle du précédent : ce que l'Église primitive a fait une fois est-il ce que toute Église doit faire ? Fee et Stuart invitent à distinguer ce que le texte raconte de ce qu'il prescrit. Un précédent devient contraignant lorsque le texte lui-même le donne pour tel.`,
    sourceId: SOURCE_FEE_STUART,
    localisation: { chapitre: '6', section: 'The Question of Historical Precedent' },
  },
  {
    id: 'hrb-evangile',
    temps: 'interpretation',
    genre: 'evangile',
    titre: `Une histoire, plusieurs dimensions`,
    texte: `Les évangiles se lisent à deux niveaux : ce que Jésus a dit et fait dans son contexte, et ce que l'évangéliste veut en faire entendre à son Église. Les recoupements entre Matthieu, Marc et Luc — Matthieu recoupe Marc à 59 % — invitent à observer ce que chacun retient, déplace ou omet.`,
    sourceId: SOURCE_FEE_STUART,
    localisation: { chapitre: '7', section: 'One Story, Many Dimensions' },
  },
  {
    id: 'hrb-parabole',
    temps: 'interpretation',
    genre: 'parabole',
    titre: `Une parabole a un point, et il porte`,
    texte: `Une parabole fonctionne comme une histoire drôle : elle atteint qui en partage les points de repère, et manque son effet dès qu'il faut l'expliquer. Chercher le point que le premier auditoire ne pouvait pas manquer, plutôt que d'attribuer un sens à chaque détail. Les paraboles n'ont pas été dites pour un cercle d'initiés.`,
    sourceId: SOURCE_FEE_STUART,
    localisation: { chapitre: '8', section: 'Do You Get the Point?' },
  },
  {
    id: 'hrb-loi',
    temps: 'interpretation',
    genre: 'loi',
    titre: `Des clauses d'alliance, pas un code intemporel`,
    texte: `Les lois de l'Ancien Testament sont les stipulations d'une alliance conclue avec Israël. Elles ne s'adressent pas directement au chrétien, ce qui ne les rend pas caduques : elles révèlent le caractère de Dieu et ce qu'il attend d'un peuple. Distinguer ce qui relève de l'alliance de ce qui la déborde.`,
    sourceId: SOURCE_FEE_STUART,
    localisation: { chapitre: '9', section: 'Covenant Stipulations for Israel' },
  },
  {
    id: 'hrb-prophetie',
    temps: 'interpretation',
    genre: 'prophetie',
    titre: `Les prophètes font appliquer l'alliance`,
    texte: `Ils ne sont pas d'abord des annonciateurs de l'avenir : ils sont les médiateurs qui font respecter l'alliance. L'essentiel de leur message concerne leur propre temps — appeler Israël à revenir. Lire un prophète comme un almanach du futur, c'est manquer ce qu'il disait à ceux qui l'écoutaient.`,
    sourceId: SOURCE_FEE_STUART,
    localisation: { chapitre: '10', section: 'Enforcing the Covenant in Israel' },
  },
  {
    id: 'hrb-psaume',
    temps: 'interpretation',
    genre: 'psaume',
    titre: `Des prières, avec un genre et une fonction`,
    texte: `Les psaumes sont des prières adressées à Dieu, non des exposés sur Dieu : ils disent ce qu'un croyant lui dit, pas nécessairement une doctrine à établir. Chacun appartient à un type — lamentation, action de grâces, hymne, psaume de confiance, psaume de sagesse — et chaque type avait sa fonction. Un psaume se lit entier : il ne se découpe pas en versets détachés.`,
    sourceId: SOURCE_FEE_STUART,
    localisation: { chapitre: '11', section: "Israel's Prayers and Ours" },
  },
  {
    id: 'hrb-sagesse',
    temps: 'interpretation',
    genre: 'sagesse',
    titre: `Un proverbe n'est pas une garantie`,
    texte: `Fee et Stuart résument sept règles : les proverbes sont souvent imagés et renvoient au-delà d'eux-mêmes ; ils sont pratiques plutôt que théologiques ; ils sont formulés pour être retenus, non pour être exacts ; ils ne servent jamais l'égoïsme ; certains demandent d'être transposés d'une culture à l'autre ; ils ne sont pas des garanties de Dieu mais des orientations poétiques pour bien vivre ; ils usent volontiers d'exagération.`,
    sourceId: SOURCE_FEE_STUART,
    localisation: { chapitre: '12', section: 'Wisdom: Then and Now' },
  },
  {
    id: 'hrb-apocalypse',
    temps: 'interpretation',
    genre: 'apocalypse',
    titre: `Des images de jugement et d'espérance`,
    texte: `L'Apocalypse emprunte au genre apocalyptique juif tout en s'en écartant : elle n'est pas pseudonyme, son auteur se nomme. Ses images étaient lisibles pour ses premiers destinataires ; chercher d'abord ce qu'elles leur disaient, avant d'y voir un calendrier. Le livre s'adresse à sept Églises réelles, sous pression réelle.`,
    sourceId: SOURCE_FEE_STUART,
    localisation: { chapitre: '13', section: 'Images of Judgment and Hope' },
  },
];

// ————————————————————————————————————————————————————————————
// Application — Hendricks, chapitres 42 et 44
// ————————————————————————————————————————————————————————————

const application: ConseilMethode[] = [
  {
    id: 'lbb-app-quatre-etapes',
    temps: 'application',
    titre: `Connaître le texte, se connaître soi-même`,
    texte: `Appliquer suppose deux connaissances : celle du texte, acquise par les deux temps précédents, et celle de soi. Hendricks cite Paul à Timothée — « prends garde à toi-même et à ton enseignement » — et souligne l'ordre : à toi-même d'abord.`,
    sourceId: SOURCE_HENDRICKS,
    localisation: { chapitre: '42', section: 'Four Steps of Application' },
  },
  {
    id: 'lbb-app-exemple',
    temps: 'application',
    cleQuestion: 'exemple',
    titre: `Un exemple à suivre`,
    texte: `Une grande part de la Bible est biographique, et ce n'est pas un hasard : rien ne rend une vérité vivante comme une personne. La difficulté est de tracer le parallèle entre sa situation et la nôtre. Abraham intercédant pour Sodome n'a pas d'équivalent littéral dans nos vies, mais il reste un modèle de prière pour ceux qu'on serait tenté de juger.`,
    sourceId: SOURCE_HENDRICKS,
    localisation: { chapitre: '44', section: 'Nine Questions to Ask' },
  },
  {
    id: 'lbb-app-peche',
    cleQuestion: 'peche',
    temps: 'application',
    titre: `Un péché à éviter`,
    texte: `L'Écriture élève le niveau de conscience morale. On découvre souvent qu'on ignorait qu'une chose fût un péché, faute d'avoir connu une autre norme que la sienne.`,
    sourceId: SOURCE_HENDRICKS,
    localisation: { chapitre: '44', section: 'Nine Questions to Ask' },
  },
  {
    id: 'lbb-app-promesse',
    cleQuestion: 'promesse',
    temps: 'application',
    titre: `Une promesse à réclamer`,
    texte: `Toutes les promesses de l'Écriture ne nous sont pas adressées : certaines visaient une personne, d'autres un peuple. On ne peut réclamer une promesse qui ne nous a pas été faite. Mais celles qui sont faites à l'Église, ou aux justes dans les livres de sagesse, nous reviennent.`,
    sourceId: SOURCE_HENDRICKS,
    localisation: { chapitre: '44', section: 'Nine Questions to Ask' },
  },
  {
    id: 'lbb-app-priere',
    cleQuestion: 'priere',
    temps: 'application',
    titre: `Une prière à répéter`,
    texte: `Hendricks recommande d'étudier les grandes prières de l'Écriture et de se les approprier : la confession de David au Psaume 51, l'action de grâces d'Anne, la prière de Jonas du fond du poisson, le cantique de Marie.`,
    sourceId: SOURCE_HENDRICKS,
    localisation: { chapitre: '44', section: 'Nine Questions to Ask' },
  },
  {
    id: 'lbb-app-commandement',
    cleQuestion: 'commandement',
    temps: 'application',
    titre: `Un commandement à observer`,
    texte: `L'Écriture est pleine d'ordres nets — cinquante-quatre dans la seule épître de Jacques, et les sections d'exhortation de Paul (Romains 12–15, Galates 5–6, Éphésiens 4–6, Colossiens 3–4) sont pour l'essentiel des commandements. Hendricks rapporte le mot d'un vieux savant à qui l'on demandait comment discerner la volonté de Dieu : « quatre-vingt-quinze pour cent en sont révélés dans les commandements de l'Écriture ; occupez-vous-en, et les cinq pour cent restants vous donneront peu de mal ».`,
    sourceId: SOURCE_HENDRICKS,
    localisation: { chapitre: '44', section: 'Nine Questions to Ask' },
  },
  {
    id: 'lbb-app-condition',
    cleQuestion: 'condition',
    temps: 'application',
    titre: `Une condition à remplir`,
    texte: `Beaucoup de promesses sont assorties d'une condition posée par le texte lui-même. « Si vous demeurez en moi et que mes paroles demeurent en vous, demandez ce que vous voudrez et cela vous sera accordé » (Jean 15.7) : la promesse est immense, mais elle vient après deux « si ». Repérer la condition fait partie de la lecture de la promesse.`,
    sourceId: SOURCE_HENDRICKS,
    localisation: { chapitre: '44', section: 'Nine Questions to Ask' },
  },
  {
    id: 'lbb-app-erreur',
    cleQuestion: 'erreur',
    temps: 'application',
    titre: `Une erreur à corriger`,
    texte: `Hendricks observe un regain d'attention aux personnes, et en même temps une perte de repères doctrinaux : la résurrection, la naissance virginale, l'inspiration de l'Écriture, l'œuvre de l'Esprit. D'où trois questions à poser au passage : quelles vérités enseigne-t-il ? quelles erreurs met-il au jour ? et que dois-je changer dans ma manière de penser pour l'accorder à ce qu'il dit ?`,
    sourceId: SOURCE_HENDRICKS,
    localisation: { chapitre: '44', section: 'Nine Questions to Ask' },
  },
  {
    id: 'lbb-app-verset',
    cleQuestion: 'verset',
    temps: 'application',
    titre: `Un verset à mémoriser`,
    texte: `N'importe quel verset peut être appris ; certains comptent davantage pour vous que d'autres. Constituez votre propre liste, faite des versets devenus personnels au fil de vos études.`,
    sourceId: SOURCE_HENDRICKS,
    localisation: { chapitre: '44', section: 'Nine Questions to Ask' },
  },
  {
    id: 'lbb-app-defi',
    cleQuestion: 'defi',
    temps: 'application',
    titre: `Un défi à relever`,
    texte: `Il arrive qu'une lecture laisse la conviction qu'il faut agir. Une relation à réparer, une excuse à présenter, une situation dont il faut sortir : c'est l'Esprit qui presse, et le défi est de répondre plutôt que de refermer le livre.`,
    sourceId: SOURCE_HENDRICKS,
    localisation: { chapitre: '44', section: 'Nine Questions to Ask' },
  },
  {
    id: 'clb-app-conclusion',
    temps: 'application',
    titre: `Terminer par une prière et une résolution`,
    texte: `Pour Kuen, la méditation s'achève par une prière — adoration, demande, action de grâces ou intercession, selon ce qui a été découvert — et souvent par une résolution : un tort à réparer, une lettre d'excuse à écrire. Il conseille d'écrire l'une et l'autre, « pour que je ne sois pas tenté de l'oublier ».`,
    sourceId: SOURCE_KUEN_LIRE,
    localisation: { chapitre: '2', section: 'Comment méditer ?' },
  },
];

export const moduleMethodeSources: ModuleConnaissance = {
  id: 'methode-sources-v1',
  // Hendricks est la source principale : la méthode elle-même vient de lui.
  source: sourceHendricks,
  sourcesAnnexes: [sourceFeeStuart, sourceKuenEtudier, sourceKuenLire],
  conseils: [...observation, ...interpretation, ...parGenre, ...application],
};
