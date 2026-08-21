/**
 * Versets du jour — sélection tournante (Louis Segond 1910).
 * Un verset est choisi de façon déterministe à partir de la date,
 * afin que tous les appareils affichent le même verset le même jour.
 */

export interface VersetDuJour {
  ref: string;
  texte: string;
  theme: string;
  /** Une phrase de méditation, pour ancrer le verset dans la journée. */
  meditation: string;
  /** Passage complet lié, s'il existe dans la bibliothèque. */
  passageId?: string;
}

export const versets: VersetDuJour[] = [
  {
    ref: 'Lamentations 3:22-23',
    texte: `Les bontés de l'Éternel ne sont pas épuisées, Ses compassions ne sont pas à leur terme; Elles se renouvellent chaque matin. Oh! que ta fidélité est grande!`,
    theme: 'Fidélité',
    meditation: `Ce matin n'est pas un recommencement pour toi seulement : la miséricorde de Dieu aussi est neuve. Ce que tu portes d'hier ne fixe pas la mesure d'aujourd'hui.`,
    passageId: 'lm3',
  },
  {
    ref: 'Psaume 23:1',
    texte: `L'Éternel est mon berger: je ne manquerai de rien.`,
    theme: 'Confiance',
    meditation: `Avant de demander quoi que ce soit, essaie de nommer ce que tu as déjà reçu. La confiance commence souvent par la mémoire.`,
    passageId: 'ps23',
  },
  {
    ref: 'Ésaïe 41:10',
    texte: `Ne crains rien, car je suis avec toi; Ne promène pas des regards inquiets, car je suis ton Dieu; Je te fortifie, je viens à ton secours, Je te soutiens de ma droite triomphante.`,
    theme: 'Courage',
    meditation: `Dieu ne dit pas « il n'y a rien à craindre », mais « je suis avec toi ». La peur ne disparaît pas : elle change de compagnie.`,
  },
  {
    ref: 'Matthieu 11:28',
    texte: `Venez à moi, vous tous qui êtes fatigués et chargés, et je vous donnerai du repos.`,
    theme: 'Repos',
    meditation: `Le repos n'est pas la récompense de ceux qui ont fini : c'est l'offre faite à ceux qui n'en peuvent plus.`,
    passageId: 'mt11',
  },
  {
    ref: 'Proverbes 3:5-6',
    texte: `Confie-toi en l'Éternel de tout ton cœur, Et ne t'appuie pas sur ta sagesse; Reconnais-le dans toutes tes voies, Et il aplanira tes sentiers.`,
    theme: 'Direction',
    meditation: `Reconnaître Dieu dans « toutes » nos voies, c'est l'inviter aussi dans les décisions minuscules d'aujourd'hui.`,
    passageId: 'pr3',
  },
  {
    ref: 'Philippiens 4:6-7',
    texte: `Ne vous inquiétez de rien; mais en toute chose faites connaître vos besoins à Dieu par des prières et des supplications, avec des actions de grâces. Et la paix de Dieu, qui surpasse toute intelligence, gardera vos cœurs et vos pensées en Jésus-Christ.`,
    theme: 'Paix',
    meditation: `Remarque l'ordre : la paix ne vient pas avant la prière, elle vient après. Commence par dire, même maladroitement.`,
    passageId: 'ph4',
  },
  {
    ref: 'Jean 3:16',
    texte: `Car Dieu a tant aimé le monde qu'il a donné son Fils unique, afin que quiconque croit en lui ne périsse point, mais qu'il ait la vie éternelle.`,
    theme: 'Amour',
    meditation: `Relis ce verset en y mettant ton prénom à la place de « le monde ». C'est aussi vrai ainsi.`,
    passageId: 'jn3',
  },
  {
    ref: 'Romains 8:28',
    texte: `Nous savons, du reste, que toutes choses concourent au bien de ceux qui aiment Dieu, de ceux qui sont appelés selon son dessein.`,
    theme: 'Providence',
    meditation: `Le texte ne dit pas que tout est bien. Il dit que Dieu tisse. C'est autre chose, et c'est plus solide.`,
    passageId: 'rm8',
  },
  {
    ref: 'Josué 1:9',
    texte: `Fortifie-toi et prends courage? Ne t'effraie point et ne t'épouvante point, car l'Éternel, ton Dieu, est avec toi dans tout ce que tu entreprendras.`,
    theme: 'Courage',
    meditation: `Le courage biblique n'est pas une émotion à produire, mais un ordre à recevoir — parce que quelqu'un marche devant.`,
    passageId: 'jos1',
  },
  {
    ref: 'Psaume 46:2',
    texte: `Dieu est pour nous un refuge et un appui, Un secours qui ne manque jamais dans la détresse.`,
    theme: 'Refuge',
    meditation: `Un refuge ne supprime pas la tempête : il te tient pendant qu'elle passe.`,
  },
  {
    ref: 'Ésaïe 40:31',
    texte: `Mais ceux qui se confient en l'Éternel renouvellent leur force. Ils prennent le vol comme les aigles; Ils courent, et ne se lassent point, Ils marchent, et ne se fatiguent point.`,
    theme: 'Force',
    meditation: `Le verbe est « renouveler », pas « fabriquer ». Ta force du jour se reçoit, elle ne se produit pas.`,
    passageId: 'es40',
  },
  {
    ref: '1 Jean 4:19',
    texte: `Pour nous, nous l'aimons, parce qu'il nous a aimés le premier.`,
    theme: 'Amour',
    meditation: `Tout amour véritable que tu donneras aujourd'hui est un écho, pas une origine.`,
    passageId: '1jn4',
  },
  {
    ref: 'Psaume 34:19',
    texte: `L'Éternel est près de ceux qui ont le cœur brisé, Et il sauve ceux qui ont l'esprit dans l'abattement.`,
    theme: 'Consolation',
    meditation: `Il n'attend pas que tu ailles mieux pour s'approcher. Le brisement est le lieu de sa proximité.`,
  },
  {
    ref: 'Jean 14:27',
    texte: `Je vous laisse la paix, je vous donne ma paix. Je ne vous donne pas comme le monde donne. Que votre cœur ne se trouble point, et ne s'alarme point.`,
    theme: 'Paix',
    meditation: `La paix du monde dépend des circonstances. Celle de Jésus dépend de sa présence — elle tient donc dans la tempête.`,
    passageId: 'jn14',
  },
  {
    ref: 'Psaume 119:105',
    texte: `Ta parole est une lampe à mes pieds, Et une lumière sur mon sentier.`,
    theme: 'Parole',
    meditation: `Une lampe n'éclaire pas tout le chemin, seulement le pas suivant. C'est suffisant pour marcher.`,
  },
  {
    ref: 'Michée 6:8',
    texte: `On t'a fait connaître, ô homme, ce qui est bien; Et ce que l'Éternel demande de toi, C'est que tu pratiques la justice, Que tu aimes la miséricorde, Et que tu marches humblement avec ton Dieu.`,
    theme: 'Justice',
    meditation: `Trois verbes pour aujourd'hui : pratiquer, aimer, marcher. Aucun ne demande d'être parfait, tous demandent d'être en mouvement.`,
    passageId: 'mi6',
  },
  {
    ref: 'Galates 5:22-23',
    texte: `Mais le fruit de l'Esprit, c'est l'amour, la joie, la paix, la patience, la bonté, la bénignité, la fidélité, la douceur, la tempérance; la loi n'est pas contre ces choses.`,
    theme: 'Esprit',
    meditation: `Le fruit se cultive, il ne se force pas. Quelle est celle de ces neuf réalités que Dieu fait mûrir en toi en ce moment ?`,
    passageId: 'ga5',
  },
  {
    ref: 'Psaume 51:12',
    texte: `O Dieu! crée en moi un cœur pur, Renouvelle en moi un esprit bien disposé.`,
    theme: 'Repentance',
    meditation: `« Crée » est le verbe de la Genèse. David ne demande pas une réparation, mais une création — et Dieu sait faire.`,
    passageId: 'ps51',
  },
  {
    ref: '2 Corinthiens 12:9',
    texte: `Ma grâce te suffit, car ma puissance s'accomplit dans la faiblesse.`,
    theme: 'Grâce',
    meditation: `L'endroit que tu voudrais cacher est précisément celui que Dieu choisit pour se montrer.`,
    passageId: '2co12',
  },
  {
    ref: 'Jean 15:5',
    texte: `Je suis le cep, vous êtes les sarments. Celui qui demeure en moi et en qui je demeure porte beaucoup de fruit, car sans moi vous ne pouvez rien faire.`,
    theme: 'Communion',
    meditation: `Demeurer, ce n'est pas faire davantage : c'est rester attaché plus longtemps.`,
    passageId: 'jn15',
  },
  {
    ref: 'Psaume 139:23-24',
    texte: `Sonde-moi, ô Dieu, et connais mon cœur! Éprouve-moi, et connais mes pensées! Regarde si je suis sur une mauvaise voie, Et conduis-moi sur la voie de l'éternité!`,
    theme: 'Examen',
    meditation: `Prier ainsi demande du courage : c'est autoriser Dieu à toucher ce que l'on préférerait ignorer.`,
    passageId: 'ps139',
  },
  {
    ref: 'Matthieu 6:33',
    texte: `Cherchez premièrement le royaume et la justice de Dieu; et toutes ces choses vous seront données par-dessus.`,
    theme: 'Priorité',
    meditation: `« Premièrement » est une question d'ordre, pas d'exclusivité. Qu'est-ce qui passe avant, aujourd'hui ?`,
    passageId: 'mt6b',
  },
  {
    ref: 'Hébreux 11:1',
    texte: `Or la foi est une ferme assurance des choses qu'on espère, une démonstration de celles qu'on ne voit pas.`,
    theme: 'Foi',
    meditation: `La foi n'est pas l'absence de questions. C'est une assurance qui tient debout au milieu d'elles.`,
    passageId: 'he11',
  },
  {
    ref: '1 Pierre 5:7',
    texte: `et déchargez-vous sur lui de tous vos soucis, car lui-même prend soin de vous.`,
    theme: 'Souci',
    meditation: `Nomme un souci précis ce matin, et laisse-le là, écrit, devant Dieu. Reprendre le fardeau sera toujours possible ; le déposer, plus rare.`,
    passageId: '1p5',
  },
  {
    ref: 'Psaume 27:1',
    texte: `L'Éternel est ma lumière et mon salut: De qui aurais-je crainte? L'Éternel est le soutien de ma vie: De qui aurais-je peur?`,
    theme: 'Lumière',
    meditation: `David répond à la peur par une question, pas par une négation. Face à qui, exactement, aurais-tu peur aujourd'hui ?`,
    passageId: 'ps27',
  },
  {
    ref: 'Colossiens 3:13',
    texte: `Supportez-vous les uns les autres, et, si l'un a sujet de se plaindre de l'autre, pardonnez-vous réciproquement. De même que Christ vous a pardonné, pardonnez-vous aussi.`,
    theme: 'Pardon',
    meditation: `La mesure du pardon n'est pas ce que l'autre mérite, mais ce que nous avons reçu.`,
    passageId: 'col3',
  },
  {
    ref: 'Jérémie 29:11',
    texte: `Car je connais les projets que j'ai formés sur vous, dit l'Éternel, projets de paix et non de malheur, afin de vous donner un avenir et de l'espérance.`,
    theme: 'Espérance',
    meditation: `Ces mots furent écrits à des exilés, pour un délai de soixante-dix ans. L'espérance biblique est patiente, jamais naïve.`,
    passageId: 'jr29',
  },
  {
    ref: 'Psaume 121:1-2',
    texte: `Je lève mes yeux vers les montagnes... D'où me viendra le secours? Le secours me vient de l'Éternel, Qui a fait les cieux et la terre.`,
    theme: 'Secours',
    meditation: `Lever les yeux est déjà une prière : cela suppose qu'on cesse un instant de fixer le problème.`,
    passageId: 'ps121',
  },
  {
    ref: '1 Corinthiens 13:4-5',
    texte: `La charité est patiente, elle est pleine de bonté; la charité n'est point envieuse; la charité ne se vante point, elle ne s'enfle point d'orgueil, elle ne fait rien de malhonnête, elle ne cherche point son intérêt, elle ne s'irrite point, elle ne soupçonne point le mal.`,
    theme: 'Amour',
    meditation: `Relis ce passage en remplaçant « la charité » par ton prénom. Ce qui grince indique où Dieu travaille.`,
    passageId: '1co13',
  },
  {
    ref: 'Ésaïe 43:2',
    texte: `Si tu traverses les eaux, je serai avec toi; Et les fleuves, ils ne te submergeront point; Si tu marches dans le feu, tu ne te brûleras pas, Et la flamme ne t'embrasera pas.`,
    theme: 'Épreuve',
    meditation: `« Si tu traverses » — il est question de passage, non d'installation. Tu n'habiteras pas ici pour toujours.`,
    passageId: 'es43',
  },
  {
    ref: 'Psaume 103:12',
    texte: `Autant l'orient est éloigné de l'occident, Autant il éloigne de nous nos transgressions.`,
    theme: 'Pardon',
    meditation: `L'orient et l'occident ne se rejoignent jamais. C'est la distance que Dieu met entre toi et ce qui est pardonné.`,
    passageId: 'ps103',
  },
  {
    ref: 'Apocalypse 21:4',
    texte: `Il essuiera toute larme de leurs yeux, et la mort ne sera plus, et il n'y aura plus ni deuil, ni cri, ni douleur, car les premières choses ont disparu.`,
    theme: 'Espérance',
    meditation: `Un geste très concret : essuyer. Dieu se penche, il ne se contente pas de décréter.`,
    passageId: 'ap21',
  },
  {
    ref: 'Jacques 1:5',
    texte: `Si quelqu'un d'entre vous manque de sagesse, qu'il la demande à Dieu, qui donne à tous simplement et sans reproche, et elle lui sera donnée.`,
    theme: 'Sagesse',
    meditation: `« Sans reproche » : Dieu ne soupire pas quand tu reviens poser la même question.`,
    passageId: 'jc1a',
  },
  {
    ref: 'Psaume 37:5',
    texte: `Recommande ton sort à l'Éternel, Mets en lui ta confiance, et il agira.`,
    theme: 'Confiance',
    meditation: `Recommander, c'est confier une charge à quelqu'un de plus solide. Qu'est-ce que tu tiens encore seul ?`,
  },
  {
    ref: 'Éphésiens 2:8',
    texte: `Car c'est par la grâce que vous êtes sauvés, par le moyen de la foi. Et cela ne vient pas de vous, c'est le don de Dieu.`,
    theme: 'Grâce',
    meditation: `Rien à mériter, rien à rembourser. Il ne reste qu'à recevoir — ce qui est parfois le plus difficile.`,
    passageId: 'ep2',
  },
  {
    ref: 'Psaume 55:23',
    texte: `Remets ton sort à l'Éternel, et il te soutiendra, Il ne laissera jamais chanceler le juste.`,
    theme: 'Soutien',
    meditation: `Être soutenu n'est pas être dispensé de marcher. C'est ne pas marcher seul.`,
  },
  {
    ref: 'Matthieu 5:9',
    texte: `Heureux ceux qui procurent la paix, car ils seront appelés fils de Dieu!`,
    theme: 'Paix',
    meditation: `« Procurer » la paix, c'est un travail actif : quelqu'un doit faire le premier pas. Est-ce toi, aujourd'hui ?`,
    passageId: 'mt5',
  },
  {
    ref: 'Romains 12:2',
    texte: `Ne vous conformez pas au siècle présent, mais soyez transformés par le renouvellement de l'intelligence, afin que vous discerniez quelle est la volonté de Dieu, ce qui est bon, agréable et parfait.`,
    theme: 'Transformation',
    meditation: `La transformation passe par la pensée. Ce que tu nourris ton esprit aujourd'hui te façonnera demain.`,
    passageId: 'rm12',
  },
  {
    ref: 'Psaume 16:11',
    texte: `Tu me feras connaître le sentier de la vie; Il y a d'abondantes joies devant ta face, Des délices éternelles à ta droite.`,
    theme: 'Joie',
    meditation: `La joie chrétienne n'est pas d'abord un sentiment, mais un lieu : devant sa face.`,
  },
  {
    ref: 'Ésaïe 55:8-9',
    texte: `Car mes pensées ne sont pas vos pensées, Et vos voies ne sont pas mes voies, Dit l'Éternel. Autant les cieux sont élevés au-dessus de la terre, Autant mes voies sont élevées au-dessus de vos voies.`,
    theme: 'Mystère',
    meditation: `Ce verset n'explique pas ce que tu ne comprends pas. Il te dit à qui tu peux confier ce qui reste sans réponse.`,
    passageId: 'es55',
  },
  {
    ref: '1 Jean 1:9',
    texte: `Si nous confessons nos péchés, il est fidèle et juste pour nous les pardonner, et pour nous purifier de toute iniquité.`,
    theme: 'Confession',
    meditation: `Le pardon ne dépend pas de l'intensité de tes regrets, mais de la fidélité de Dieu.`,
    passageId: '1jn1',
  },
  {
    ref: 'Hébreux 12:2',
    texte: `ayant les regards sur Jésus, le chef et le consommateur de la foi.`,
    theme: 'Persévérance',
    meditation: `Quand la course est longue, ce n'est pas la ligne d'arrivée qu'on regarde, c'est Celui qui l'a franchie avant nous.`,
    passageId: 'he12',
  },
  {
    ref: 'Psaume 62:6',
    texte: `Oui, c'est en Dieu que mon âme se confie; De lui vient mon salut.`,
    theme: 'Silence',
    meditation: `Il y a des matins où la meilleure prière est de se taire et de rester là.`,
  },
  {
    ref: 'Luc 11:9',
    texte: `Et moi, je vous dis: Demandez, et l'on vous donnera; cherchez, et vous trouverez; frappez, et l'on vous ouvrira.`,
    theme: 'Prière',
    meditation: `Trois verbes d'insistance croissante. La prière a le droit d'être obstinée.`,
    passageId: 'lc11',
  },
  {
    ref: 'Genèse 1:3',
    texte: `Dieu dit: Que la lumière soit! Et la lumière fut.`,
    theme: 'Création',
    meditation: `La première chose que Dieu fait face au chaos, c'est parler. Écoute avant d'agir aujourd'hui.`,
    passageId: 'gn1',
  },
  {
    ref: 'Ecclésiaste 3:1',
    texte: `Il y a un temps pour tout, un temps pour toute chose sous les cieux.`,
    theme: 'Saison',
    meditation: `Quelle saison traverses-tu ? La nommer honnêtement, c'est déjà cesser de lutter contre elle.`,
    passageId: 'ec3',
  },
  {
    ref: 'Matthieu 28:20',
    texte: `Et voici, je suis avec vous tous les jours, jusqu'à la fin du monde.`,
    theme: 'Présence',
    meditation: `« Tous les jours » comprend celui-ci, avec exactement ce qu'il contient.`,
    passageId: 'mt28',
  },
  {
    ref: 'Psaume 32:8',
    texte: `Je t'instruirai et te montrerai la voie que tu dois suivre; Je te conseillerai, j'aurai le regard sur toi.`,
    theme: 'Direction',
    meditation: `Dieu ne se contente pas d'indiquer la route : il garde le regard sur celui qui la prend.`,
  },
  {
    ref: 'Ésaïe 53:5',
    texte: `Mais il était blessé pour nos péchés, Brisé pour nos iniquités; Le châtiment qui nous donne la paix est tombé sur lui, Et c'est par ses meurtrissures que nous sommes guéris.`,
    theme: 'Croix',
    meditation: `Toute la distance a été franchie depuis l'autre côté. Il ne te reste pas un pont à construire, mais un pont à emprunter.`,
    passageId: 'es53',
  },
  {
    ref: 'Jean 1:5',
    texte: `La lumière luit dans les ténèbres, et les ténèbres ne l'ont point reçue.`,
    theme: 'Lumière',
    meditation: `Le verbe est au présent : elle luit, maintenant, y compris là où tu ne la vois pas encore.`,
    passageId: 'jn1',
  },
  {
    ref: 'Psaume 90:12',
    texte: `Enseigne-nous à bien compter nos jours, Afin que nous appliquions notre cœur à la sagesse.`,
    theme: 'Temps',
    meditation: `Compter ses jours n'est pas morbide : c'est ce qui rend une journée précieuse.`,
  },
  {
    ref: 'Romains 8:38-39',
    texte: `Car j'ai l'assurance que ni la mort ni la vie... ni aucune autre créature ne pourra nous séparer de l'amour de Dieu manifesté en Jésus-Christ notre Seigneur.`,
    theme: 'Assurance',
    meditation: `Fais la liste de ce qui te fait peur, puis relis la liste de Paul. La sienne est plus longue, et elle se termine par « rien ».`,
    passageId: 'rm8',
  },
  {
    ref: 'Jacques 1:22',
    texte: `Mettez en pratique la parole, et ne vous bornez pas à l'écouter, en vous trompant vous-mêmes par de faux raisonnements.`,
    theme: 'Pratique',
    meditation: `Une seule chose comprise et vécue vaut mieux que dix chapitres lus. Laquelle mettras-tu en pratique aujourd'hui ?`,
    passageId: 'jc1b',
  },
  {
    ref: 'Psaume 145:18',
    texte: `L'Éternel est près de tous ceux qui l'invoquent, De tous ceux qui l'invoquent avec sincérité.`,
    theme: 'Proximité',
    meditation: `Le critère n'est pas la beauté des mots, mais la sincérité. Tu peux venir tel que tu es.`,
  },
  {
    ref: 'Éphésiens 6:10',
    texte: `Au reste, fortifiez-vous dans le Seigneur, et par sa force toute-puissante.`,
    theme: 'Combat',
    meditation: `On ne se fortifie pas en soi-même, mais « dans le Seigneur ». La force est un lieu où l'on entre.`,
    passageId: 'ep6',
  },
  {
    ref: 'Luc 15:20',
    texte: `Comme il était encore loin, son père le vit et fut ému de compassion, il courut se jeter à son cou et le baisa.`,
    theme: 'Retour',
    meditation: `Le père court. Dans toute la parabole, c'est lui qui va le plus vite.`,
    passageId: 'lc15',
  },
  {
    ref: 'Psaume 46:11',
    texte: `Arrêtez, et sachez que je suis Dieu.`,
    theme: 'Silence',
    meditation: `Le premier mot est un arrêt. Avant de savoir quoi que ce soit de Dieu, il faut cesser de courir.`,
  },
  {
    ref: 'Colossiens 3:15',
    texte: `Et que la paix de Christ, à laquelle vous avez été appelés pour former un seul corps, règne dans vos cœurs. Et soyez reconnaissants.`,
    theme: 'Gratitude',
    meditation: `La gratitude est la porte étroite par laquelle la paix entre dans une journée ordinaire.`,
    passageId: 'col3',
  },
  {
    ref: 'Matthieu 5:16',
    texte: `Que votre lumière luise ainsi devant les hommes, afin qu'ils voient vos bonnes œuvres, et qu'ils glorifient votre Père qui est dans les cieux.`,
    theme: 'Témoignage',
    meditation: `Ta lumière n'a pas à être expliquée pour être vue. Vis simplement, et laisse Dieu être reconnu.`,
    passageId: 'mt5',
  },
  {
    ref: 'Psaume 42:6',
    texte: `Pourquoi t'abats-tu, mon âme, et gémis-tu au dedans de moi? Espère en Dieu, car je le louerai encore; Il est mon salut et mon Dieu.`,
    theme: 'Découragement',
    meditation: `Le psalmiste se parle à lui-même. Parfois, croire consiste à se rappeler à voix haute ce qu'on sait déjà.`,
  },
  {
    ref: '1 Corinthiens 13:13',
    texte: `Maintenant donc ces trois choses demeurent: la foi, l'espérance, la charité; mais la plus grande de ces choses, c'est la charité.`,
    theme: 'Amour',
    meditation: `Tout le reste passera. Ce que tu auras aimé, non.`,
    passageId: '1co13',
  },
];

/** Jour de l'année (1-366) pour une date donnée. */
export function dayOfYear(date: Date): number {
  const start = Date.UTC(date.getFullYear(), 0, 1);
  const current = Date.UTC(date.getFullYear(), date.getMonth(), date.getDate());
  return Math.floor((current - start) / 86400000) + 1;
}

/** Verset du jour : déterministe, identique pour tous à une date donnée. */
export function versetDuJour(date: Date = new Date()): VersetDuJour {
  const index = (dayOfYear(date) + date.getFullYear()) % versets.length;
  return versets[index];
}
