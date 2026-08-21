/**
 * Méditations guidées.
 * Deux formes : la « lectio divina » (lecture priante en quatre temps),
 * et des temps de silence minutés avec une respiration accompagnée.
 */

export interface EtapeLectio {
  cle: 'lectio' | 'meditatio' | 'oratio' | 'contemplatio';
  titre: string;
  latin: string;
  duree: number;
  consigne: string;
  invite: string;
}

export const etapesLectio: EtapeLectio[] = [
  {
    cle: 'lectio',
    titre: 'Lire',
    latin: 'Lectio',
    duree: 180,
    consigne: `Lisez le passage lentement, à voix basse si possible. Ne cherchez pas encore à comprendre : laissez simplement les mots passer.`,
    invite: `Quel mot, quelle phrase s'arrête devant vous ?`,
  },
  {
    cle: 'meditatio',
    titre: 'Méditer',
    latin: 'Meditatio',
    duree: 300,
    consigne: `Reprenez le mot ou la phrase qui vous a retenu. Répétez-le intérieurement. Laissez-le rejoindre ce que vous vivez aujourd'hui.`,
    invite: `Pourquoi ce mot, aujourd'hui, pour vous ?`,
  },
  {
    cle: 'oratio',
    titre: 'Prier',
    latin: 'Oratio',
    duree: 240,
    consigne: `Répondez à Dieu. Dites-lui simplement ce que la lecture a remué : une demande, un merci, une plainte, un pardon.`,
    invite: `Que voulez-vous dire à Dieu maintenant ?`,
  },
  {
    cle: 'contemplatio',
    titre: 'Demeurer',
    latin: 'Contemplatio',
    duree: 300,
    consigne: `Cessez les mots. Restez là, en présence, sans rien produire. Si votre esprit s'échappe, revenez doucement à la phrase du début.`,
    invite: `Restez simplement. Il n'y a rien à réussir.`,
  },
];

export interface SeanceMeditation {
  id: string;
  titre: string;
  sousTitre: string;
  duree: number;
  passageId: string;
  ambiance: 'matin' | 'soir' | 'apaisement' | 'gratitude';
  /** Phrases affichées lentement pendant la séance, séparées par des respirations. */
  etapes: { texte: string; secondes: number }[];
}

export const seances: SeanceMeditation[] = [
  {
    id: 'matin-paix',
    titre: 'Commencer le jour',
    sousTitre: 'Se remettre entre les mains de Dieu',
    duree: 600,
    passageId: 'lm3',
    ambiance: 'matin',
    etapes: [
      { texte: `Installez-vous. Posez les pieds au sol, les mains ouvertes.`, secondes: 30 },
      { texte: `Respirez lentement. Vous n'avez rien à produire dans les minutes qui viennent.`, secondes: 45 },
      { texte: `« Les bontés de l'Éternel ne sont pas épuisées, ses compassions ne sont pas à leur terme. »`, secondes: 60 },
      { texte: `Laissez remonter ce qui vous attend aujourd'hui. Ne le repoussez pas, regardez-le.`, secondes: 75 },
      { texte: `« Elles se renouvellent chaque matin. »`, secondes: 60 },
      { texte: `Confiez à Dieu la première chose que vous ferez en sortant d'ici.`, secondes: 75 },
      { texte: `Nommez une personne que vous croiserez aujourd'hui. Priez pour elle, en silence.`, secondes: 75 },
      { texte: `« Oh ! que ta fidélité est grande. »`, secondes: 60 },
      { texte: `Respirez encore trois fois, puis ouvrez les yeux. Il vous accompagne.`, secondes: 60 },
    ],
  },
  {
    id: 'soir-depot',
    titre: 'Déposer la journée',
    sousTitre: 'Relecture et remise du soir',
    duree: 660,
    passageId: 'ps23',
    ambiance: 'soir',
    etapes: [
      { texte: `Le jour s'achève. Asseyez-vous, sans écran, et laissez le corps se relâcher.`, secondes: 45 },
      { texte: `Repassez la journée, du matin jusqu'à maintenant, comme un film au ralenti.`, secondes: 90 },
      { texte: `Où avez-vous reçu quelque chose de bon aujourd'hui ? Remerciez-en Dieu.`, secondes: 90 },
      { texte: `Où avez-vous manqué d'amour ? Dites-le simplement, sans vous accabler.`, secondes: 90 },
      { texte: `« L'Éternel est mon berger : je ne manquerai de rien. »`, secondes: 60 },
      { texte: `Ce qui reste en suspens, déposez-le. Vous le reprendrez demain, s'il le faut.`, secondes: 90 },
      { texte: `« Il me fait reposer dans de verts pâturages. »`, secondes: 60 },
      { texte: `Demandez la paix pour la nuit, pour votre maison, pour ceux que vous aimez.`, secondes: 75 },
      { texte: `Restez encore un instant en silence, puis allez dormir en paix.`, secondes: 60 },
    ],
  },
  {
    id: 'apaisement',
    titre: 'Apaiser l’anxiété',
    sousTitre: 'Quand le cœur s’emballe',
    duree: 540,
    passageId: 'ph4',
    ambiance: 'apaisement',
    etapes: [
      { texte: `Arrêtez tout. Sentez seulement l'air qui entre et qui sort.`, secondes: 45 },
      { texte: `Inspirez sur quatre temps, retenez deux, expirez sur six. Trois fois.`, secondes: 60 },
      { texte: `Nommez, intérieurement, ce qui vous inquiète. Un mot suffit.`, secondes: 60 },
      { texte: `« Ne vous inquiétez de rien ; mais en toute chose faites connaître vos besoins à Dieu. »`, secondes: 60 },
      { texte: `Dites ce besoin à Dieu, avec vos mots, même maladroits.`, secondes: 90 },
      { texte: `Ajoutez un merci. Une seule chose pour laquelle vous êtes reconnaissant.`, secondes: 75 },
      { texte: `« Et la paix de Dieu, qui surpasse toute intelligence, gardera vos cœurs. »`, secondes: 60 },
      { texte: `Le problème est peut-être encore là. Vous, vous êtes gardé.`, secondes: 60 },
      { texte: `Respirez une dernière fois, et reprenez votre journée.`, secondes: 30 },
    ],
  },
  {
    id: 'gratitude',
    titre: 'Bénir et rendre grâce',
    sousTitre: 'Réveiller la mémoire du cœur',
    duree: 480,
    passageId: 'ps103',
    ambiance: 'gratitude',
    etapes: [
      { texte: `Asseyez-vous confortablement. Laissez le silence s'installer.`, secondes: 45 },
      { texte: `« Mon âme, bénis l'Éternel, et n'oublie aucun de ses bienfaits. »`, secondes: 60 },
      { texte: `Rappelez-vous un bienfait reçu cette semaine. Revoyez-le en détail.`, secondes: 90 },
      { texte: `Rappelez-vous une personne qui vous a fait du bien. Remerciez Dieu pour elle.`, secondes: 90 },
      { texte: `Rappelez-vous un pardon reçu. Laissez-le vous rejoindre à nouveau.`, secondes: 90 },
      { texte: `« Autant l'orient est éloigné de l'occident, autant il éloigne de nous nos transgressions. »`, secondes: 60 },
      { texte: `Terminez par une seule phrase de louange, avec vos mots.`, secondes: 45 },
    ],
  },
];

export const dureesSilence = [3, 5, 10, 15, 20];

export interface Priere {
  id: string;
  titre: string;
  origine: string;
  texte: string;
}

/** Prières de la tradition chrétienne (textes du domaine public). */
export const prieresTraditionnelles: Priere[] = [
  {
    id: 'notre-pere',
    titre: 'Le Notre Père',
    origine: 'Matthieu 6:9-13',
    texte: `Notre Père qui es aux cieux ! Que ton nom soit sanctifié ; que ton règne vienne ; que ta volonté soit faite sur la terre comme au ciel. Donne-nous aujourd'hui notre pain quotidien ; pardonne-nous nos offenses, comme nous aussi nous pardonnons à ceux qui nous ont offensés ; ne nous induis pas en tentation, mais délivre-nous du malin. Car c'est à toi qu'appartiennent, dans tous les siècles, le règne, la puissance et la gloire. Amen !`,
  },
  {
    id: 'benediction',
    titre: 'La bénédiction d’Aaron',
    origine: 'Nombres 6:24-26',
    texte: `Que l'Éternel te bénisse, et qu'il te garde ! Que l'Éternel fasse luire sa face sur toi, et qu'il t'accorde sa grâce ! Que l'Éternel tourne sa face vers toi, et qu'il te donne la paix !`,
  },
  {
    id: 'jesus',
    titre: 'La prière du cœur',
    origine: 'Tradition orientale, d’après Luc 18:13',
    texte: `Seigneur Jésus-Christ, Fils de Dieu, aie pitié de moi, pécheur.`,
  },
  {
    id: 'serenite',
    titre: 'Prière de sérénité',
    origine: 'Reinhold Niebuhr',
    texte: `Mon Dieu, donne-moi la sérénité d'accepter les choses que je ne peux changer, le courage de changer celles que je peux, et la sagesse d'en connaître la différence.`,
  },
  {
    id: 'francois',
    titre: 'Prière pour la paix',
    origine: 'Attribuée à saint François d’Assise',
    texte: `Seigneur, fais de moi un instrument de ta paix. Là où est la haine, que je mette l'amour. Là où est l'offense, que je mette le pardon. Là où est la discorde, que je mette l'union. Là où est l'erreur, que je mette la vérité. Là où est le doute, que je mette la foi. Là où est le désespoir, que je mette l'espérance. Là où sont les ténèbres, que je mette la lumière. Là où est la tristesse, que je mette la joie.`,
  },
  {
    id: 'soir',
    titre: 'Prière du soir',
    origine: 'Psaume 4:9',
    texte: `Je me couche et je m'endors en paix, car toi seul, ô Éternel ! tu me donnes la sécurité dans ma demeure.`,
  },
];
