/**
 * Plans d'étude biblique, structurés selon la méthode OIA.
 * Chaque journée se parcourt en trois temps : Observation, Interprétation, Application.
 * L'application ne donne jamais les réponses avant que l'utilisateur ait écrit les
 * siennes : les « pistes » sont des indices d'observation, et l'interprétation
 * proposée ne s'affiche qu'une fois l'étape franchie.
 */

import { CleApplication, CleInterpretation, CleObservation } from './oia';

export interface VersetMemoire {
  ref: string;
  texte: string;
}

export interface JourEtude {
  jour: number;
  titre: string;
  /** Identifiant d'un passage de src/data/passages.ts */
  passageId: string;
  /** Sous-ensemble de versets à lire, si le passage complet est trop long. */
  versets?: number[];
  /** Ce que la fiche du livre ne dit pas : la situation propre à ce passage. */
  contexteImmediat: string;
  /** Indices pour l'Observation — ce qu'il faut remarquer, jamais la réponse. */
  pistesObservation: Partial<Record<CleObservation, string>>;
  /**
   * Interprétation proposée, révélée après que l'utilisateur a écrit la sienne.
   * La question de l'histoire du Salut est servie par la fiche du livre.
   */
  interpretation: Partial<Record<CleInterpretation, string>>;
  /** Les questions d'Application que ce texte soulève réellement. */
  pistesApplication: Partial<Record<CleApplication, string>>;
  /** Questions de creusement, proposées au temps de l'Application. */
  questionsApprofondissement: string[];
  versetMemoire: VersetMemoire;
  engagementPropose: string;
  priere: string;
}

export interface PlanEtude {
  id: string;
  titre: string;
  sousTitre: string;
  description: string;
  symbole: string;
  niveau: 'Découverte' | 'Approfondissement';
  themes: string[];
  jours: JourEtude[];
}

export const plans: PlanEtude[] = [
  {
    id: 'fondations',
    titre: 'Fondations',
    sousTitre: '10 jours pour poser les bases',
    description: `Dix textes qui forment le socle de la foi chrétienne : la création, la grâce, la croix, la foi, la mission. À suivre si vous commencez, ou si vous voulez revenir à l'essentiel.`,
    symbole: '✦',
    niveau: 'Découverte',
    themes: ['grâce', 'foi', 'salut'],
    jours: [
      {
        jour: 1,
        titre: `Au commencement, une parole`,
        passageId: 'gn1',
        contexteImmediat: `Les cinq premiers versets de la Bible : le premier jour, avant que quoi que ce soit d'organisé n'existe.`,
        pistesObservation: {
          qui: `L'auteur ne se nomme pas. Le seul acteur est Dieu — comptez combien de fois son nom revient en cinq versets.`,
          ou: `Aucun lieu identifiable : « les cieux et la terre », puis « la surface de l'abîme ». L'espace est en train d'être fait.`,
          quand: `« Au commencement », avant toute chronologie. Le passage se clôt sur la première mesure du temps : un soir, un matin.`,
          comment: `Repérez l'ordre des verbes : Dieu crée, l'Esprit se meut, Dieu dit, Dieu vit, Dieu sépare, Dieu appelle.`,
          quoi: `Trois actions distinctes aux v. 3-5 : la parole, le jugement (« bonne »), puis la séparation et la nomination.`,
        },
        interpretation: {
          destinataires: `Israël, entouré de récits où le monde naît d'un combat entre dieux, devait savoir que le sien naît d'une parole libre et bonne.`,
          eglise: `La Bible ne s'ouvre pas sur une explication, mais sur un acte. Devant l'informe et le vide, Dieu parle — et ce qui n'existait pas commence d'exister. Remarquez l'ordre : l'Esprit se meut d'abord au-dessus des eaux, patiemment, avant que le premier mot ne soit prononcé. Il y a une présence avant qu'il y ait une action. Ce même Dieu se penche sur les zones informes de nos vies : les projets en suspens, les relations abîmées, les journées qui ressemblent à du chaos. Il ne commence pas par condamner le désordre ; il commence par y faire entrer la lumière. Et il appelle « bon » ce qu'il a fait, avant même que le sixième jour ne soit arrivé.`,
        },
        pistesApplication: {
          promesse: `Dieu parle dans ce qui est informe. Quelle zone de votre vie attend cette parole ?`,
          defi: `Nommer une seule zone de désordre et la lui présenter aujourd'hui.`,
        },
        questionsApprofondissement: [
          `Quelle zone de votre vie ressemble aujourd'hui à « informe et vide » ?`,
          `Qu'est-ce que cela change de croire que Dieu parle avant tout dans ce désordre ?`,
          `Où avez-vous vu, cette année, une lumière apparaître là où vous ne l'attendiez plus ?`,
        ],
        versetMemoire: { ref: `Genèse 1:3`, texte: `Dieu dit: Que la lumière soit! Et la lumière fut.` },
        engagementPropose: `Nommez à voix haute une seule zone de désordre, et demandez à Dieu d'y parler le premier.`,
        priere: `Dieu créateur, tu n'as pas eu peur du chaos et tu n'as pas peur du mien. Parle dans ce qui, chez moi, reste informe. Que ta lumière soit, aussi ici. Amen.`,
      },
      {
        jour: 2,
        titre: `La Parole faite chair`,
        passageId: 'jn1',
        contexteImmediat: `Le prologue, écrit après le reste de l'évangile : Jean résume en quatorze versets qui est celui dont il va raconter l'histoire.`,
        pistesObservation: {
          qui: `Deux figures : « la Parole », jamais nommée ici, et Jean le témoin. Notez qui parle et qui rend témoignage.`,
          quand: `« Au commencement » reprend Genèse 1:1. Jean situe son personnage avant la création elle-même.`,
          comment: `Suivez le mouvement : de Dieu (v. 1) vers le monde (v. 10), vers « les siens » (v. 11), puis vers « tous ceux qui l'ont reçue » (v. 12).`,
          pourquoi: `Le v. 7 donne explicitement le motif de la venue de Jean : « afin que tous crussent par lui ».`,
          quoi: `Deux images dominent, la lumière et la parole. Relevez tout ce qui est dit de chacune.`,
        },
        interpretation: {
          destinataires: `Des lecteurs de la fin du premier siècle, juifs et grecs mêlés, devaient comprendre que le Dieu éternel n'est pas resté à distance : il a pris chair.`,
          eglise: `Jean reprend les premiers mots de la Genèse pour dire quelque chose d'inouï : la Parole qui a créé le monde est venue y habiter. Le mot grec traduit par « elle a habité parmi nous » évoque une tente plantée au milieu du campement. Dieu ne s'est pas contenté d'envoyer un message : il est venu résider, avec la fragilité que cela suppose. Et la réception fut mêlée — « les siens ne l'ont point reçue » — mais l'offre est restée ouverte à tous. Le christianisme ne repose donc pas d'abord sur une doctrine à comprendre, mais sur quelqu'un qui est venu, qui a un visage, et qui continue de venir vers ceux qui l'accueillent.`,
        },
        pistesApplication: {
          exemple: `Jean-Baptiste, qui sait qu'il n'est pas la lumière et l'accepte.`,
          promesse: `V. 12 : le pouvoir de devenir enfants de Dieu, donné à qui reçoit.`,
          verset: `V. 14, à retenir mot à mot.`,
        },
        questionsApprofondissement: [
          `Qu'est-ce que cela change pour vous que Dieu soit venu « habiter » plutôt que seulement parler ?`,
          `Le texte dit que la lumière luit et que les ténèbres ne l'ont pas reçue. Où voyez-vous cette tension ?`,
          `Que signifie concrètement, aujourd'hui, « recevoir » cette Parole ?`,
        ],
        versetMemoire: { ref: `Jean 1:14`, texte: `Et la parole a été faite chair, et elle a habité parmi nous, pleine de grâce et de vérité.` },
        engagementPropose: `Lisez le prologue une seconde fois, lentement, en vous arrêtant sur le mot « grâce ».`,
        priere: `Seigneur Jésus, Parole éternelle, merci d'être venu jusqu'ici. Je t'ouvre la porte de ce que je vis. Fais ta demeure chez moi. Amen.`,
      },
      {
        jour: 3,
        titre: `L'amour qui prend l'initiative`,
        passageId: 'jn3',
        contexteImmediat: `La suite de l'entretien nocturne avec Nicodème, un notable venu trouver Jésus de nuit.`,
        pistesObservation: {
          qui: `Dieu, le Fils, « quiconque », « les hommes ». Notez qu'aucun nom propre n'apparaît dans ces six versets.`,
          quand: `L'entretien a lieu de nuit (Jean 3:2) — à garder en tête quand le texte parle de lumière et de ténèbres.`,
          comment: `Les v. 16-17 énoncent, les v. 18-21 expliquent. Repérez la charnière : « et ce jugement c'est que ».`,
          pourquoi: `Les v. 19-20 donnent le motif du refus : « parce que leurs œuvres étaient mauvaises », « de peur que ses œuvres ne soient dévoilées ».`,
          quoi: `Le mot « jugement » revient plusieurs fois. Regardez comment Jean le redéfinit.`,
        },
        interpretation: {
          destinataires: `Nicodème, homme de la Loi, devait entendre que le salut ne vient pas de son rang ni de son observance, mais d'un don reçu par la foi.`,
          eglise: `Le verset le plus connu de la Bible est aussi le plus facilement banalisé. Reprenons-le mot à mot : Dieu a aimé, il a donné, afin que quiconque croie ait la vie. Quatre verbes, et le premier est le sien. L'amour de Dieu n'est pas une réponse à notre mérite : il est une initiative. Notez aussi le verset 17, souvent oublié : le Fils n'est pas venu pour juger mais pour sauver. Ceux qui vivent avec l'impression sourde que Dieu les surveille pour les prendre en défaut ont ici de quoi respirer. Le jugement dont parle Jean n'est pas une sentence arbitraire, c'est le simple fait de préférer l'ombre quand la lumière est venue.`,
        },
        pistesApplication: {
          peche: `Préférer l'ombre pour que rien ne soit dévoilé.`,
          promesse: `La vie éternelle offerte à quiconque croit.`,
          defi: `Mettre en lumière une chose que vous gardez cachée.`,
        },
        questionsApprofondissement: [
          `Quelle image de Dieu portez-vous spontanément : un juge, un père, un absent ?`,
          `Qu'est-ce qui, chez vous, préfère parfois rester dans l'ombre ?`,
          `Que voudrait dire « venir à la lumière » cette semaine ?`,
        ],
        versetMemoire: { ref: `Jean 3:16`, texte: `Car Dieu a tant aimé le monde qu'il a donné son Fils unique, afin que quiconque croit en lui ne périsse point, mais qu'il ait la vie éternelle.` },
        engagementPropose: `Écrivez le verset en remplaçant « le monde » par votre prénom, puis relisez-le.`,
        priere: `Père, merci d'avoir aimé le premier. Là où je me cache, donne-moi le courage de venir à ta lumière, en sachant que tu ne viens pas pour me condamner. Amen.`,
      },
      {
        jour: 4,
        titre: `Il était blessé pour nous`,
        passageId: 'es53',
        contexteImmediat: `Le quatrième chant du Serviteur. Le prophète parle d'un homme dont l'identité n'est pas donnée, et il en parle au passé.`,
        pistesObservation: {
          qui: `Un « il » sans nom, et un « nous » qui parle. Demandez-vous qui est ce « nous ».`,
          comment: `Le texte alterne ce que nous pensions et ce qui était vraiment. Repérez le basculement au v. 4.`,
          pourquoi: `Le v. 6 donne la cause : « chacun suivait sa propre voie ».`,
          quoi: `Comptez les pronoms : combien de « nos » et de « nous », face à combien de « il ».`,
        },
        interpretation: {
          destinataires: `Des exilés qui se croyaient frappés devaient comprendre que la souffrance d'un seul pouvait porter la faute de tous.`,
          eglise: `Sept siècles avant la croix, Ésaïe décrit un serviteur méconnaissable, dont on détourne le regard. Le texte fait un basculement décisif au verset 4 : ce que nous prenions pour sa punition était en réalité notre fardeau. « Ce sont nos souffrances qu'il a portées. » La foi chrétienne ne dit pas que Dieu observe la douleur humaine de loin ; elle affirme qu'il l'a assumée. Le verset 6 en donne la raison : nous étions errants, chacun suivant sa propre voie. C'est un diagnostic honnête sur nous-mêmes — et il se conclut non par un verdict, mais par un transfert : « l'Éternel a fait retomber sur lui l'iniquité de nous tous. »`,
        },
        pistesApplication: {
          promesse: `« C'est par ses meurtrissures que nous sommes guéris. »`,
          priere: `Reprendre le v. 6 comme confession : « chacun suivait sa propre voie ».`,
        },
        questionsApprofondissement: [
          `Quelle est la chose que vous avez le plus de mal à croire pardonnée ?`,
          `Que ressentez-vous en lisant que Christ a porté vos souffrances, et pas seulement vos fautes ?`,
          `Qu'est-ce qui vous empêche de recevoir cette guérison ?`,
        ],
        versetMemoire: { ref: `Ésaïe 53:5`, texte: `Mais il était blessé pour nos péchés, Brisé pour nos iniquités; Le châtiment qui nous donne la paix est tombé sur lui, Et c'est par ses meurtrissures que nous sommes guéris.` },
        engagementPropose: `Restez trois minutes en silence après la lecture, sans rien demander.`,
        priere: `Seigneur, tu as porté ce que je n'aurais jamais pu porter. Je dépose ici ce que je traîne encore. Guéris-moi par tes meurtrissures. Amen.`,
      },
      {
        jour: 5,
        titre: `Mais Dieu`,
        passageId: 'ep2',
        contexteImmediat: `Paul vient de prier pour ses lecteurs ; il expose maintenant ce que Dieu a fait pour des gens qu'il décrit comme morts.`,
        pistesObservation: {
          qui: `Paul écrit ; un « vous » et un « nous » alternent. Le sujet de presque tous les verbes est Dieu.`,
          comment: `Repérez le pivot du v. 4 : « Mais Dieu ». Notez tout ce qui change après ces deux mots.`,
          pourquoi: `Les v. 7 et 9 donnent deux finalités explicites : montrer la richesse de sa grâce, et que personne ne se glorifie.`,
          quoi: `Relevez les trois verbes des v. 5-6 : rendus à la vie, ressuscités, fait asseoir. Tous au passé accompli.`,
        },
        interpretation: {
          destinataires: `Des païens convertis, tenus pour étrangers à l'alliance, devaient savoir qu'ils n'avaient rien à ajouter pour être pleinement du peuple de Dieu.`,
          eglise: `Deux mots retournent le passage : « Mais Dieu ». Avant eux, un constat sans appel — morts par nos offenses. Après eux, une avalanche de verbes au passé accompli : il nous a rendus à la vie, il nous a ressuscités, il nous a fait asseoir. Paul insiste ensuite pour couper court à toute comptabilité religieuse : c'est un don, pas un salaire ; personne ne peut s'en vanter. Mais l'apôtre ne s'arrête pas à la gratuité. Le verset 10 rouvre l'horizon : nous sommes son ouvrage, créés pour de bonnes œuvres préparées d'avance. Les œuvres ne sont pas la cause du salut, elles en sont le chemin. On ne travaille pas pour être aimé ; on travaille parce qu'on l'est.`,
        },
        pistesApplication: {
          promesse: `V. 10 : des œuvres préparées d'avance, à découvrir plutôt qu'à inventer.`,
          erreur: `Croire qu'il reste quelque chose à mériter.`,
        },
        questionsApprofondissement: [
          `Où glissez-vous, sans vous en rendre compte, vers une foi de mérite ?`,
          `Qu'est-ce que changerait une journée vécue en sachant que rien ne reste à mériter ?`,
          `Quelle « bonne œuvre » vous semble préparée pour vous en ce moment ?`,
        ],
        versetMemoire: { ref: `Éphésiens 2:8`, texte: `Car c'est par la grâce que vous êtes sauvés, par le moyen de la foi. Et cela ne vient pas de vous, c'est le don de Dieu.` },
        engagementPropose: `Repérez aujourd'hui un moment où vous essayez de « mériter » — et remerciez plutôt.`,
        priere: `Dieu riche en miséricorde, je cesse de tenir mes comptes. Merci pour la grâce. Montre-moi ce que tu as préparé pour aujourd'hui. Amen.`,
      },
      {
        jour: 6,
        titre: `La foi, une assurance`,
        passageId: 'he11',
        contexteImmediat: `Après dix chapitres d'argumentation, l'auteur ouvre la grande galerie des témoins de la foi.`,
        pistesObservation: {
          qui: `L'auteur ne se nomme jamais. Il cite Abel et Énoch — cherchez d'où viennent leurs histoires.`,
          comment: `Les v. 3 à 5 suivent tous la même formule, « c'est par la foi que… ». Comptez-la.`,
          pourquoi: `Le v. 6 donne la raison de fond : sans la foi, il est impossible de plaire à Dieu.`,
          quoi: `Le v. 1 est une définition. Repérez les deux mots qu'elle emploie : assurance et démonstration.`,
        },
        interpretation: {
          destinataires: `Des croyants tentés de revenir en arrière devaient voir qu'ils appartenaient à une longue lignée de gens ayant tenu sans voir.`,
          eglise: `La définition d'Hébreux 11 est étonnamment sobre : la foi est une ferme assurance des choses qu'on espère. Ce n'est pas un saut dans le vide, ni une certitude psychologique qu'il faudrait entretenir à force de volonté. C'est une confiance dirigée vers quelqu'un de fiable. La suite du chapitre ne présente d'ailleurs pas des héros sans faille, mais des gens en marche : Abel qui offre, Énoch qui marche avec Dieu, Noé qui bâtit sans preuve. Le verset 6 donne la condition minimale : croire que Dieu existe et qu'il répond à ceux qui le cherchent. C'est peu. C'est assez pour commencer.`,
        },
        pistesApplication: {
          condition: `V. 6 : croire que Dieu existe et qu'il récompense ceux qui le cherchent.`,
          defi: `Nommer une chose que vous confiez à Dieu sans savoir comment elle se résoudra.`,
        },
        questionsApprofondissement: [
          `Distinguez-vous « avoir la foi » et « ne pas avoir de doutes » ?`,
          `Qu'est-ce que vous espérez sans le voir encore ?`,
          `Quel petit pas de confiance vous est demandé cette semaine ?`,
        ],
        versetMemoire: { ref: `Hébreux 11:1`, texte: `Or la foi est une ferme assurance des choses qu'on espère, une démonstration de celles qu'on ne voit pas.` },
        engagementPropose: `Notez une chose que vous confiez à Dieu sans savoir comment elle se résoudra.`,
        priere: `Seigneur, je crois ; viens au secours de mon incrédulité. Donne-moi assez de foi pour le pas d'aujourd'hui. Amen.`,
      },
      {
        jour: 7,
        titre: `Demeurer`,
        passageId: 'jn15',
        contexteImmediat: `La nuit de l'arrestation, entre le repas et Gethsémané. Jésus parle à onze disciples qui vont le perdre.`,
        pistesObservation: {
          qui: `Trois figures : le vigneron (le Père), le cep (Jésus), les sarments (les disciples).`,
          quand: `Ces paroles sont prononcées quelques heures avant la croix.`,
          comment: `Le verbe « demeurer » revient sans cesse. Comptez-le sur les douze versets.`,
          quoi: `Deux gestes du vigneron sont distingués au v. 2 : retrancher et émonder. Ne les confondez pas.`,
        },
        interpretation: {
          destinataires: `Des disciples sur le point d'être privés de sa présence physique devaient apprendre comment rester unis à lui.`,
          eglise: `Neuf fois en douze versets, Jésus emploie le même verbe : demeurer. C'est le mot central de la vie chrétienne, et pourtant le plus discret. Le sarment ne produit rien par effort ; il reste attaché, et la sève fait le reste. Cela ne signifie pas la passivité : l'image inclut l'émondage, geste précis et parfois douloureux du vigneron qui coupe ce qui disperse la vitalité. Puis vient le verset 5, sans ménagement : « sans moi vous ne pouvez rien faire. » Ce n'est pas un reproche mais une libération. Le fruit n'est plus votre performance, il est le résultat naturel d'une communion maintenue.`,
        },
        pistesApplication: {
          commandement: `V. 12 : « Aimez-vous les uns les autres, comme je vous ai aimés. »`,
          condition: `V. 7 : « Si vous demeurez en moi, et que mes paroles demeurent en vous… »`,
          defi: `Choisir un moment fixe de la journée pour revenir à lui.`,
        },
        questionsApprofondissement: [
          `Qu'est-ce qui, dans votre vie de foi, relève de l'effort plutôt que de la communion ?`,
          `Qu'est-ce que le vigneron pourrait vouloir émonder en ce moment ?`,
          `À quoi ressemblerait une journée « attachée au cep » ?`,
        ],
        versetMemoire: { ref: `Jean 15:5`, texte: `Je suis le cep, vous êtes les sarments. Celui qui demeure en moi et en qui je demeure porte beaucoup de fruit, car sans moi vous ne pouvez rien faire.` },
        engagementPropose: `Choisissez un moment fixe de la journée pour revenir à Dieu, ne serait-ce qu'une minute.`,
        priere: `Jésus, vrai cep, je veux moins produire et davantage demeurer. Garde-moi attaché à toi aujourd'hui. Amen.`,
      },
      {
        jour: 8,
        titre: `Rien ne peut nous séparer`,
        passageId: 'rm8',
        contexteImmediat: `La fin du chapitre 8, sommet de l'épître : Paul conclut son exposé sur la vie dans l'Esprit.`,
        pistesObservation: {
          qui: `Dieu, Christ, un « nous », et une série d'accusateurs possibles. Notez que Paul cite un psaume au v. 36.`,
          comment: `Le passage est bâti en questions. Relevez-les toutes, et voyez qui y répond.`,
          pourquoi: `Le v. 32 donne l'argument : celui qui a donné son Fils ne retiendra rien d'autre.`,
          quoi: `Les v. 38-39 dressent une liste. Comptez ses éléments et voyez par quoi elle se termine.`,
        },
        interpretation: {
          destinataires: `Une Église de Rome mêlée de juifs et de païens, sous pression, devait savoir que rien de ce qu'elle subissait ne remettait en cause son adoption.`,
          eglise: `Paul construit ce passage comme un procès. Il convoque tour à tour l'accusateur, le juge, les circonstances — et démonte chacun. « Qui accusera les élus de Dieu ? C'est Dieu qui justifie ! » L'argument ne repose pas sur notre solidité, mais sur ce que Christ a déjà accompli : mort, ressuscité, intercédant. Ensuite vient la liste : tribulation, angoisse, persécution, faim, épée. Paul n'idéalise rien ; il sait que ces choses arrivent aux croyants. Il ne promet pas qu'elles n'arriveront pas, mais qu'elles ne pourront pas trancher le lien. Le verset 28 doit se lire dans cette lumière : Dieu ne rend pas tout bon, il fait concourir toutes choses au bien.`,
        },
        pistesApplication: {
          promesse: `V. 28 et v. 38-39 : deux promesses à réclamer nommément.`,
          erreur: `Lire le v. 28 comme si tout ce qui arrive était bon en soi.`,
        },
        questionsApprofondissement: [
          `Quelle voix accusatrice revient souvent en vous ? Que lui répond ce texte ?`,
          `Y a-t-il une épreuve que vous interprétez comme une séparation d'avec Dieu ?`,
          `Que signifie « plus que vainqueurs » dans une situation qui n'est pas résolue ?`,
        ],
        versetMemoire: { ref: `Romains 8:31`, texte: `Si Dieu est pour nous, qui sera contre nous?` },
        engagementPropose: `Faites la liste de vos peurs, et écrivez en face : « ne pourra pas me séparer ».`,
        priere: `Père, quand tout me dit que je suis loin, rappelle-moi que rien ne peut me séparer de ton amour en Jésus-Christ. Amen.`,
      },
      {
        jour: 9,
        titre: `Un culte qui prend corps`,
        passageId: 'rm12',
        contexteImmediat: `Le tournant de l'épître : après la doctrine, le quotidien. Le « donc » du v. 1 renvoie à onze chapitres de grâce.`,
        pistesObservation: {
          qui: `Paul s'adresse à des « frères ». Les autres acteurs sont ceux qu'il faut aimer, bénir, accueillir.`,
          comment: `Les v. 1-2 exhortent largement ; à partir du v. 9 le style change en impératifs très courts. Comptez-les.`,
          pourquoi: `Le v. 1 donne le motif : « par les compassions de Dieu ».`,
          quoi: `Relevez ce qui est offert au v. 1 : non pas des idées, mais « vos corps ».`,
        },
        interpretation: {
          destinataires: `Des chrétiens vivant dans la capitale de l'Empire devaient apprendre à ne pas se conformer, tout en restant en paix avec tous.`,
          eglise: `Après onze chapitres de doctrine, Paul écrit « je vous exhorte donc ». Tout ce qui précède débouche sur le quotidien. Et le premier lieu de ce culte, c'est le corps : nos gestes, notre agenda, notre fatigue. Le verset 2 identifie ensuite le champ de bataille — l'intelligence, ce que nous laissons nous former. Puis le texte devient d'une concrétude désarmante : aimer sans hypocrisie, honorer l'autre avant soi, bénir ceux qui persécutent, pleurer avec ceux qui pleurent. Aucune de ces phrases ne demande un talent particulier. Toutes demandent une décision, aujourd'hui, envers une personne précise.`,
        },
        pistesApplication: {
          exemple: `V. 15 : pleurer avec ceux qui pleurent.`,
          commandement: `V. 14 : bénir ceux qui persécutent, et ne pas maudire.`,
          defi: `Choisir une seule exhortation des v. 9-18 et la vivre aujourd'hui.`,
        },
        questionsApprofondissement: [
          `Qu'est-ce qui façonne le plus votre pensée en ce moment ?`,
          `Laquelle des exhortations des versets 9 à 18 vous met mal à l'aise ?`,
          `Avec qui, précisément, pouvez-vous la mettre en pratique cette semaine ?`,
        ],
        versetMemoire: { ref: `Romains 12:2`, texte: `Ne vous conformez pas au siècle présent, mais soyez transformés par le renouvellement de l'intelligence.` },
        engagementPropose: `Choisissez une seule exhortation du passage et vivez-la aujourd'hui.`,
        priere: `Seigneur, je t'offre mon corps, mon temps et mes pensées. Renouvelle mon intelligence, et rends mon amour moins hypocrite. Amen.`,
      },
      {
        jour: 10,
        titre: `Envoyés, et accompagnés`,
        passageId: 'mt28',
        contexteImmediat: `Les cinq derniers versets de l'évangile, en Galilée, devant onze disciples dont certains doutent encore (v. 17).`,
        pistesObservation: {
          qui: `Jésus et les onze. Notez à qui l'ordre est donné : à un groupe, pas à un individu.`,
          ou: `Sur une montagne de Galilée — loin de Jérusalem, là où tout avait commencé.`,
          quand: `Après la résurrection, avant l'ascension.`,
          comment: `Le passage encadre l'envoi : l'autorité au début, la présence à la fin.`,
          quoi: `Un seul verbe porte l'ordre principal : « faites des disciples ». Les autres l'accompagnent.`,
        },
        interpretation: {
          destinataires: `Une communauté juive devenue minoritaire devait comprendre que sa mission dépassait désormais Israël.`,
          eglise: `Les derniers mots de Matthieu tiennent en trois mouvements : une autorité affirmée, un envoi, une présence promise. L'ordre compte. Avant de dire « allez », Jésus dit « tout pouvoir m'a été donné ». La mission ne repose donc pas sur nos capacités mais sur son autorité. Et elle ne se termine pas par une consigne mais par une promesse : « je suis avec vous tous les jours ». Le mot grec traduit par « faites des disciples » suggère un accompagnement lent, pas une conquête. Ce dixième jour clôt ces fondations en les ouvrant : ce que vous avez reçu n'est pas fait pour rester entre vos mains.`,
        },
        pistesApplication: {
          promesse: `« Je suis avec vous tous les jours. »`,
          commandement: `Faire des disciples, baptiser, enseigner.`,
          defi: `Prier nommément pour une personne de votre entourage, chaque jour de la semaine.`,
        },
        questionsApprofondissement: [
          `Vers qui vous sentez-vous envoyé, même modestement ?`,
          `Qu'est-ce qui vous retient : le manque de mots, la peur du jugement, autre chose ?`,
          `Quelles fondations de ces dix jours voulez-vous garder ?`,
        ],
        versetMemoire: { ref: `Matthieu 28:20`, texte: `Et voici, je suis avec vous tous les jours, jusqu'à la fin du monde.` },
        engagementPropose: `Priez pour une personne de votre entourage, nommément, chaque jour de la semaine qui vient.`,
        priere: `Seigneur, tu m'envoies et tu m'accompagnes. Donne-moi de vivre de telle manière que quelqu'un ait envie de te connaître. Amen.`,
      },
    ],
  },
  {
    id: 'psaumes',
    titre: 'Psaumes de réconfort',
    sousTitre: '7 jours pour les temps difficiles',
    description: `Sept psaumes à prier quand le cœur est lourd. Les psaumes n'exigent pas que l'on aille bien pour venir : ils apprennent à parler à Dieu depuis l'endroit où l'on est.`,
    symbole: '❋',
    niveau: 'Découverte',
    themes: ['consolation', 'peur', 'confiance'],
    jours: [
      {
        jour: 1,
        titre: `Le berger, et la vallée`,
        passageId: 'ps23',
        contexteImmediat: `Un psaume de David, formé d'images de berger puis d'hôte. Le titre en tête du psaume fait partie du v. 1.`,
        pistesObservation: {
          qui: `David écrit. Deux personnages seulement : « l'Éternel » et « je ». Les adversaires sont mentionnés sans être nommés.`,
          ou: `Le décor change en cours de route : d'abord des pâturages et des eaux, puis une vallée, enfin une table et une maison.`,
          comment: `Repérez le changement de pronom au v. 4 : jusque-là « il », ensuite « tu ». Notez où ce basculement se produit.`,
          quoi: `Comptez ce que le berger fait : reposer, diriger, restaurer, conduire, dresser, oindre.`,
        },
        interpretation: {
          destinataires: `Un peuple de pasteurs, habitué aux rois qui prennent, entendait ici décrire un Dieu qui conduit et pourvoit.`,
          eglise: `Ce psaume est si connu qu'on l'entend sans l'écouter. Notez pourtant un détail : jusqu'au verset 3, David parle de Dieu à la troisième personne — « il me fait reposer », « il me conduit ». Puis vient la vallée de l'ombre de la mort, et le langage change : « tu es avec moi ». C'est dans l'endroit le plus sombre que la relation devient directe. Le psaume ne promet pas d'éviter la vallée ; il promet une présence à l'intérieur. Et la table dressée « en face de mes adversaires » ne signifie pas que les adversaires ont disparu : ils regardent Dieu prendre soin de vous.`,
        },
        pistesApplication: {
          promesse: `« Je ne manquerai de rien », et « tu es avec moi » dans la vallée.`,
          priere: `Réciter le psaume lentement le soir, comme une prière et non comme un texte.`,
        },
        questionsApprofondissement: [
          `Quelle vallée traversez-vous en ce moment ?`,
          `Où avez-vous vu Dieu passer du « il » au « tu » dans votre vie ?`,
          `De quoi avez-vous besoin d'entendre aujourd'hui : « je ne manquerai de rien » ?`,
        ],
        versetMemoire: { ref: `Psaume 23:4`, texte: `Quand je marche dans la vallée de l'ombre de la mort, Je ne crains aucun mal, car tu es avec moi.` },
        engagementPropose: `Récitez le psaume 23 lentement le soir, avant de dormir.`,
        priere: `Berger de mon âme, je ne comprends pas toujours le chemin, mais tu es avec moi. Conduis-moi près des eaux paisibles. Amen.`,
      },
      {
        jour: 2,
        titre: `À l'abri du Très-Haut`,
        passageId: 'ps91',
        contexteImmediat: `Un psaume sans titre ni auteur nommé, construit comme un dialogue : quelqu'un parle, puis Dieu lui-même répond à la fin.`,
        pistesObservation: {
          qui: `Trois voix se succèdent : celle qui décrit (v. 1), celle qui confesse (v. 2), et Dieu qui parle aux v. 14-16.`,
          quand: `Les dangers sont datés par moments : « les terreurs de la nuit », « la flèche qui vole de jour », « en plein midi ».`,
          comment: `Le psaume empile les images d'abri : ombre, plumes, ailes, bouclier, forteresse, retraite. Relevez-les toutes.`,
          quoi: `Les v. 14-16 changent de locuteur. Notez ce que Dieu s'engage précisément à faire — sept verbes.`,
        },
        interpretation: {
          destinataires: `Un croyant exposé à la maladie, à la guerre et à la nuit devait apprendre que l'abri n'est pas un lieu mais une présence.`,
          eglise: `Le psaume 91 est un texte d'abri. Il empile les images : l'ombre, les ailes, le bouclier, la forteresse. Ce n'est pas une garantie magique contre le malheur — la Bible elle-même raconte trop de justes éprouvés pour qu'on le lise ainsi. C'est la déclaration que rien ne peut atteindre l'essentiel de celui qui habite auprès de Dieu. Le verbe du premier verset est « demeurer » : il s'agit d'une habitation, pas d'une visite en cas d'urgence. Les derniers versets renversent la perspective — c'est Dieu qui parle : « puisqu'il m'aime, je le délivrerai ».`,
        },
        pistesApplication: {
          promesse: `V. 15 : « Je serai avec lui dans la détresse. »`,
          condition: `V. 1 et 9 : l'abri est promis à celui qui « demeure » et qui « fait du Très-Haut sa retraite ».`,
          defi: `Écrire trois peurs, et inscrire au-dessus : « Mon refuge et ma forteresse ».`,
        },
        questionsApprofondissement: [
          `Vers quels abris courez-vous d'abord quand la peur monte ?`,
          `Que signifierait « demeurer » plutôt que visiter Dieu en urgence ?`,
          `Quelles peurs de la nuit avez-vous besoin de nommer ?`,
        ],
        versetMemoire: { ref: `Psaume 91:1`, texte: `Celui qui demeure sous l'abri du Très-Haut Repose à l'ombre du Tout-Puissant.` },
        engagementPropose: `Écrivez trois peurs, et au-dessus de la liste : « Mon refuge et ma forteresse ».`,
        priere: `Très-Haut, tu es mon refuge et ma forteresse. Je viens habiter chez toi, pas seulement m'y réfugier. Garde mon cœur cette nuit. Amen.`,
      },
      {
        jour: 3,
        titre: `D'où me viendra le secours`,
        passageId: 'ps121',
        contexteImmediat: `Un cantique des degrés, chanté par les pèlerins montant vers Jérusalem sur des routes où les montagnes abritaient autant de dangers que de sanctuaires étrangers.`,
        pistesObservation: {
          qui: `Un pèlerin parle ; à partir du v. 3, quelqu'un lui répond. Repérez le changement de « je » à « tu ».`,
          ou: `Des montagnes, une route, un départ et une arrivée. Le psaume est un texte de voyage.`,
          comment: `Le v. 1 pose une question, le v. 2 y répond. Tout le reste développe cette réponse.`,
          quoi: `Le verbe « garder » revient six fois. Comptez-le, et notez ce qui est gardé à chaque fois.`,
        },
        interpretation: {
          destinataires: `Des pèlerins en marche, exposés au soleil, aux bêtes et aux brigands, devaient savoir d'où venait leur sécurité.`,
          eglise: `Ce cantique était chanté par les pèlerins montant vers Jérusalem, sur des routes où les montagnes abritaient autant de dangers que de sanctuaires païens. La question du premier verset est donc réelle : de quel côté regarder ? La réponse déplace tout : le secours vient de Celui qui a fait les montagnes. Ensuite, six fois, revient le verbe « garder ». Dieu ne dort pas ; sa vigilance ne connaît pas de relève. Le psaume se termine sur le mouvement le plus ordinaire qui soit : ton départ et ton arrivée. Autrement dit, les allers-retours banals de vos journées.`,
        },
        pistesApplication: {
          promesse: `« L'Éternel gardera ton départ et ton arrivée. »`,
          defi: `Prier ce psaume en marchant, une phrase par pas.`,
        },
        questionsApprofondissement: [
          `Vers quelles « montagnes » levez-vous les yeux quand vous cherchez du secours ?`,
          `Qu'est-ce que cela change de savoir que Dieu ne sommeille pas ?`,
          `Quel départ, quelle arrivée voulez-vous confier aujourd'hui ?`,
        ],
        versetMemoire: { ref: `Psaume 121:2`, texte: `Le secours me vient de l'Éternel, Qui a fait les cieux et la terre.` },
        engagementPropose: `Priez ce psaume en marchant, une phrase par pas.`,
        priere: `Éternel qui gardes mon âme, veille sur mes départs et mes retours. Là où je cherche du secours ailleurs, ramène mes yeux vers toi. Amen.`,
      },
      {
        jour: 4,
        titre: `Sondé et connu`,
        passageId: 'ps139',
        contexteImmediat: `Un psaume de David sur la connaissance que Dieu a de lui. Les v. 23-24 forment une prière qui en renverse le ton.`,
        pistesObservation: {
          qui: `Deux personnages seulement, « toi » et « je ». Notez lequel des deux est sujet de la plupart des verbes.`,
          ou: `Le psaume fait le tour du monde : les cieux, le séjour des morts, l'aurore, l'extrémité de la mer, le sein maternel.`,
          comment: `Les v. 7-12 envisagent une fuite et l'examinent point par point. Suivez le raisonnement.`,
          quoi: `Relevez les verbes de connaissance : sonder, connaître, savoir, pénétrer. Combien y en a-t-il ?`,
        },
        interpretation: {
          destinataires: `Un croyant tenté de se croire perdu de vue par Dieu devait apprendre qu'aucun lieu n'échappe à sa présence.`,
          eglise: `Être entièrement connu est terrifiant ou libérateur, selon celui qui connaît. David choisit la seconde voie. Dieu sait quand il s'assied, ce qu'il pense avant qu'il ne le dise, où il irait s'il voulait fuir. Le psaume envisage sérieusement la fuite — les cieux, le séjour des morts, l'extrémité de la mer — et conclut chaque fois : là aussi, ta main. Puis vient le verset 13, d'une tendresse rare : « tu m'as tissé ». Et à la fin, David fait ce que personne ne fait spontanément : il invite Dieu à le sonder. Quand on sait qu'on est aimé, on ne craint plus d'être vu.`,
        },
        pistesApplication: {
          priere: `Les v. 23-24 : « Sonde-moi, ô Dieu, et connais mon cœur. »`,
          defi: `Nommer une chose que vous cachez, et la dire simplement à Dieu.`,
        },
        questionsApprofondissement: [
          `Qu'est-ce que vous préféreriez que Dieu ne voie pas ?`,
          `Que ressentez-vous à l'idée d'avoir été « tissé » intentionnellement ?`,
          `Oseriez-vous prier le verset 23 aujourd'hui ?`,
        ],
        versetMemoire: { ref: `Psaume 139:14`, texte: `Je te loue de ce que je suis une créature si merveilleuse. Tes œuvres sont admirables, Et mon âme le reconnaît bien.` },
        engagementPropose: `Nommez une chose que vous cachez, et dites-la simplement à Dieu.`,
        priere: `Sonde-moi, ô Dieu, et connais mon cœur. Là où je me fuis moi-même, conduis-moi sur la voie de l'éternité. Amen.`,
      },
      {
        jour: 5,
        titre: `Ses compassions, chaque matin`,
        passageId: 'lm3',
        contexteImmediat: `Écrit devant Jérusalem détruite, après la chute de 587 av. J.-C. Les chapitres qui précèdent sont d'une noirceur sans concession.`,
        pistesObservation: {
          qui: `Un homme parle à son âme, puis parle de l'Éternel. La ville détruite est le décor implicite.`,
          ou: `Au milieu des ruines de Jérusalem, après la déportation.`,
          quand: `Le v. 23 date la promesse : « chaque matin ». Notez la régularité, pas l'exception.`,
          comment: `Le passage est un acte de mémoire volontaire : repérez le moment où le ton bascule vers l'espérance.`,
        },
        interpretation: {
          destinataires: `Des survivants qui avaient tout perdu devaient entendre que la fidélité de Dieu n'avait pas été détruite avec la ville.`,
          eglise: `Il faut mesurer d'où vient ce texte. Jérémie contemple Jérusalem détruite, il a vu la famine et l'exil ; les chapitres précédents sont d'une noirceur sans concession. Et c'est au milieu de ces ruines qu'il écrit la phrase la plus lumineuse du livre. Ce n'est pas un optimisme de circonstance : c'est un acte de mémoire délibéré. « Voici ce que je veux me rappeler », dit-il en substance, « c'est pourquoi j'espère ». L'espérance biblique se choisit souvent contre l'évidence, en s'appuyant non sur ce qu'on voit, mais sur ce qu'on sait de Dieu.`,
        },
        pistesApplication: {
          promesse: `Les compassions renouvelées chaque matin.`,
          commandement: `V. 26 : « Il est bon d'attendre en silence le secours de l'Éternel. »`,
          defi: `Noter trois signes concrets de la bonté de Dieu depuis une semaine.`,
        },
        questionsApprofondissement: [
          `Qu'est-ce que vous devez délibérément vous rappeler aujourd'hui ?`,
          `Qu'est-ce que « attendre en silence » signifie dans votre situation ?`,
          `Où voyez-vous une compassion neuve ce matin, même minuscule ?`,
        ],
        versetMemoire: { ref: `Lamentations 3:23`, texte: `Elles se renouvellent chaque matin. Oh! que ta fidélité est grande!` },
        engagementPropose: `Notez trois signes concrets de la bonté de Dieu depuis une semaine.`,
        priere: `Seigneur, au milieu de ce qui est détruit, je choisis de me rappeler ta fidélité. Elle est grande. Renouvelle-la sur moi ce matin. Amen.`,
      },
      {
        jour: 6,
        titre: `Ma lumière et mon salut`,
        passageId: 'ps27',
        contexteImmediat: `Un psaume de David écrit alors que des adversaires s'avancent. Le titre fait partie du v. 1.`,
        pistesObservation: {
          qui: `David, et des ennemis désignés collectivement. Notez que Dieu n'agit pas encore dans les cinq premiers versets : il est décrit.`,
          comment: `Le psaume commence par deux affirmations sur Dieu, puis deux questions. Repérez l'ordre.`,
          pourquoi: `Les v. 2-3 expliquent l'assurance : ce sont les ennemis qui chancellent.`,
          quoi: `Au v. 4, David demande une seule chose. Notez ce que ce n'est pas.`,
        },
        interpretation: {
          destinataires: `Un roi menacé, et le peuple qui chantait après lui, devaient apprendre à répondre à la peur par une affirmation sur Dieu.`,
          eglise: `David écrit alors que des ennemis s'avancent. Il ne nie pas le danger — armée, guerre, persécuteurs sont nommés — mais il commence par une affirmation sur Dieu, pas sur la menace. C'est un ordre de pensée à apprendre. Puis, au verset 4, il fait une chose surprenante : au milieu du siège, il ne demande qu'une seule chose, et ce n'est pas la victoire. C'est d'habiter dans la maison de l'Éternel et de contempler sa beauté. La sécurité qu'il cherche n'est pas l'absence d'ennemis, mais la présence de Dieu.`,
        },
        pistesApplication: {
          exemple: `David, qui nomme le danger sans le laisser parler en premier.`,
          defi: `Commencer chaque prière aujourd'hui par qui est Dieu, avant de dire ce dont vous avez besoin.`,
        },
        questionsApprofondissement: [
          `Par quoi commencez-vous d'habitude : la menace ou Dieu ?`,
          `Si vous ne pouviez demander qu'une chose, que demanderiez-vous ?`,
          `Qu'est-ce que « contempler » veut dire dans une journée chargée ?`,
        ],
        versetMemoire: { ref: `Psaume 27:1`, texte: `L'Éternel est ma lumière et mon salut: De qui aurais-je crainte?` },
        engagementPropose: `Commencez chaque prière aujourd'hui par qui est Dieu, avant de dire ce dont vous avez besoin.`,
        priere: `Éternel, ma lumière et mon salut, je demande une seule chose : demeurer avec toi. Le reste, je te le confie. Amen.`,
      },
      {
        jour: 7,
        titre: `Bénis l'Éternel, mon âme`,
        passageId: 'ps103',
        contexteImmediat: `Un psaume de David, qui commence par un ordre que le psalmiste s'adresse à lui-même.`,
        pistesObservation: {
          qui: `David parle à sa propre âme. Puis le psaume élargit à « ceux qui le craignent ».`,
          comment: `Les v. 1-5 énumèrent des bienfaits ; les v. 8-14 décrivent le caractère de Dieu. Notez le changement de registre.`,
          pourquoi: `Le v. 14 donne la raison de la compassion divine : « il sait de quoi nous sommes formés ».`,
          quoi: `Relevez les cinq bienfaits des v. 3-5, chacun introduit par « c'est lui qui ».`,
        },
        interpretation: {
          destinataires: `Un peuple oublieux devait réapprendre à se souvenir, la mémoire étant chez Israël une forme de foi.`,
          eglise: `Ce psaume s'ouvre sur un homme qui se parle à lui-même : « Mon âme, bénis l'Éternel ». La gratitude n'est pas toujours spontanée ; parfois il faut se la rappeler. Suit une liste de bienfaits — pardon, guérison, délivrance, couronne de bonté. Puis le psaume s'élève vers ce qui est le plus difficile à croire : Dieu ne nous traite pas selon nos péchés. Deux images le disent : la hauteur des cieux, et la distance de l'orient à l'occident — deux points qui, par définition, ne se rejoignent jamais. Et pour finir, une tendresse : il sait de quoi nous sommes formés, il se souvient que nous sommes poussière.`,
        },
        pistesApplication: {
          promesse: `V. 12 : l'orient et l'occident, la distance mise entre nous et ce qui est pardonné.`,
          commandement: `« Mon âme, bénis l'Éternel, et n'oublie aucun de ses bienfaits. »`,
          defi: `Écrire cinq bienfaits reçus cette année, puis les relire à voix haute.`,
        },
        questionsApprofondissement: [
          `Quels bienfaits avez-vous tendance à oublier ?`,
          `Croyez-vous vraiment que Dieu ne vous traite pas selon vos fautes ?`,
          `Comment recevez-vous cette phrase : « il sait de quoi nous sommes formés » ?`,
        ],
        versetMemoire: { ref: `Psaume 103:2`, texte: `Mon âme, bénis l'Éternel, Et n'oublie aucun de ses bienfaits!` },
        engagementPropose: `Écrivez cinq bienfaits reçus cette année, puis relisez-les à voix haute.`,
        priere: `Mon âme, bénis l'Éternel. Merci pour le pardon, la guérison, la patience. Tu connais ma fragilité et tu m'aimes ainsi. Amen.`,
      },
    ],
  },
  {
    id: 'montagne',
    titre: 'Le Sermon sur la montagne',
    sousTitre: `7 jours dans l'enseignement de Jésus`,
    description: `Le cœur de l'enseignement de Jésus : le bonheur retourné, la prière, l'inquiétude, la pratique. Un plan exigeant et libérateur.`,
    symbole: '△',
    niveau: 'Approfondissement',
    themes: ['royaume', 'prière', 'pratique'],
    jours: [
      {
        jour: 1,
        titre: `Un bonheur retourné`,
        passageId: 'mt5',
        versets: [1, 2, 3, 4, 5, 6],
        contexteImmediat: `L'ouverture du Sermon sur la montagne, premier des cinq grands discours de Matthieu. Jésus s'assied — la posture du maître qui enseigne.`,
        pistesObservation: {
          qui: `Jésus enseigne, les disciples s'approchent, la foule est là. Notez qui est vraiment l'auditoire.`,
          ou: `Sur une montagne, en Galilée. Matthieu souligne la montée.`,
          comment: `Chaque béatitude a la même forme : une situation, puis une promesse introduite par « car ». Repérez-la.`,
          quoi: `Relevez les situations déclarées heureuses. Notez qu'aucune n'est un accomplissement.`,
        },
        interpretation: {
          destinataires: `Des juifs sous occupation romaine, qui attendaient un royaume de puissance, devaient entendre à qui ce royaume appartient réellement.`,
          eglise: `Jésus commence son grand discours par des félicitations adressées exactement à ceux que personne ne félicite : les pauvres en esprit, les affligés, les doux, les affamés de justice. Ce ne sont pas des vertus à acquérir mais des situations à reconnaître. « Heureux » ne veut pas dire « content » : le mot désigne celui dont la vie est du bon côté de Dieu. Le royaume ne récompense pas les forts ; il rejoint les vides. C'est pourquoi ces phrases consolent ceux qui n'ont rien à présenter — et déstabilisent ceux qui ont tout.`,
        },
        pistesApplication: {
          promesse: `Chaque béatitude porte la sienne : consolation, rassasiement, miséricorde.`,
          defi: `Relire les béatitudes en se demandant, pour chacune : qui, autour de moi, la vit ?`,
        },
        questionsApprofondissement: [
          `Laquelle de ces béatitudes vous décrit le mieux aujourd'hui ?`,
          `Qu'est-ce qui, en vous, résiste à l'idée que la pauvreté puisse être un lieu de bénédiction ?`,
          `De quoi avez-vous « faim et soif » en ce moment ?`,
        ],
        versetMemoire: { ref: `Matthieu 5:6`, texte: `Heureux ceux qui ont faim et soif de la justice, car ils seront rassasiés!` },
        engagementPropose: `Relisez les béatitudes en vous demandant, pour chacune : qui, autour de moi, la vit ?`,
        priere: `Jésus, tu déclares heureux ce que le monde plaint. Apprends-moi à recevoir ma pauvreté comme une porte vers ton royaume. Amen.`,
      },
      {
        jour: 2,
        titre: `Sel et lumière`,
        passageId: 'mt5',
        versets: [13, 14, 15, 16],
        contexteImmediat: `La suite immédiate des béatitudes : Jésus passe de ce que ses disciples reçoivent à ce qu'ils sont.`,
        pistesObservation: {
          qui: `Jésus parle à ses disciples, mais le regard porte sur « les hommes » et « votre Père ».`,
          comment: `Deux images se répondent, le sel et la lampe. Chacune est suivie d'un contre-exemple : le sel fade, la lampe cachée.`,
          pourquoi: `Le v. 16 donne la finalité : que Dieu soit glorifié, non le disciple.`,
          quoi: `Notez le temps du verbe : « vous êtes », pas « vous devez devenir ».`,
        },
        interpretation: {
          destinataires: `Une minorité méprisée devait comprendre qu'elle n'était pas insignifiante, mais destinée à être vue.`,
          eglise: `Jésus n'a pas dit « devenez » le sel et la lumière : il a dit « vous êtes ». C'est une identité donnée avant d'être une mission accomplie. Les deux images vont dans le même sens : ni le sel ni la lumière n'existent pour eux-mêmes. Le sel se dissout dans un plat, la lampe éclaire une pièce. Le danger n'est pas l'échec bruyant mais l'insipidité discrète — perdre sa saveur, se cacher sous un boisseau. Et l'objectif final n'est pas votre réputation : que les hommes voient vos œuvres, dit Jésus, et glorifient votre Père.`,
        },
        pistesApplication: {
          erreur: `Vouloir briller pour soi plutôt que pour la gloire du Père.`,
          defi: `Faire aujourd'hui un geste de bonté que personne ne saura.`,
        },
        questionsApprofondissement: [
          `Où votre foi est-elle visible sans être bruyante ?`,
          `Qu'est-ce qui pourrait « fader » votre saveur en ce moment ?`,
          `Quelle bonne œuvre pourriez-vous faire aujourd'hui sans en parler ?`,
        ],
        versetMemoire: { ref: `Matthieu 5:14`, texte: `Vous êtes la lumière du monde. Une ville située sur une montagne ne peut être cachée.` },
        engagementPropose: `Faites aujourd'hui un geste de bonté que personne ne saura.`,
        priere: `Seigneur, tu m'appelles lumière avant que je ne brille. Fais-moi rayonner sans me mettre en avant. Amen.`,
      },
      {
        jour: 3,
        titre: `Entrer dans ta chambre`,
        passageId: 'mt6a',
        versets: [5, 6, 7, 8],
        contexteImmediat: `Au cœur du Sermon, Jésus corrige trois pratiques de piété : l'aumône, la prière et le jeûne. Ce passage traite de la deuxième.`,
        pistesObservation: {
          qui: `Jésus, les « hypocrites », les « païens », et « ton Père ». Notez le passage du « vous » au « tu » au v. 6.`,
          ou: `Trois lieux s'opposent : les synagogues, les coins des rues, et une chambre dont on ferme la porte.`,
          comment: `Chaque interdiction est suivie d'un motif, puis d'une consigne positive. Suivez cette structure.`,
          pourquoi: `Les v. 5 et 7 donnent deux motivations fausses : être vu, et être exaucé à force de paroles.`,
        },
        interpretation: {
          destinataires: `Des croyants formés à une piété très visible devaient réapprendre le lieu secret.`,
          eglise: `Avant de donner des mots, Jésus donne un lieu : une chambre, une porte fermée. La prière chrétienne commence par une soustraction — retirer le public, retirer la performance. Le contraste est net entre ceux qui prient pour être vus et le Père « qui voit dans le secret ». Vient ensuite un second allègement : inutile de multiplier les paroles, votre Père sait déjà. La prière n'est donc pas un travail d'information ni de persuasion. C'est une relation dans laquelle on parle parce qu'on est aimé, non pour le devenir.`,
        },
        pistesApplication: {
          commandement: `V. 6 : entrer, fermer la porte, prier.`,
          erreur: `Multiplier les paroles en croyant être mieux entendu.`,
          defi: `Identifier un lieu physique précis pour votre prière, et l'utiliser demain.`,
        },
        questionsApprofondissement: [
          `Où et quand pouvez-vous fermer une porte, concrètement ?`,
          `Votre prière ressemble-t-elle davantage à un rapport ou à une conversation ?`,
          `Qu'est-ce qui change si Dieu sait déjà ce dont vous avez besoin ?`,
        ],
        versetMemoire: { ref: `Matthieu 6:6`, texte: `Mais quand tu pries, entre dans ta chambre, ferme ta porte, et prie ton Père qui est là dans le lieu secret.` },
        engagementPropose: `Identifiez un lieu physique précis pour votre prière, et utilisez-le demain.`,
        priere: `Père qui vois dans le secret, je viens sans effets de style. Tu sais déjà. Je viens simplement être avec toi. Amen.`,
      },
      {
        jour: 4,
        titre: `Notre Père`,
        passageId: 'mt6a',
        versets: [9, 10, 11, 12, 13],
        contexteImmediat: `La prière que Jésus donne en modèle, insérée au milieu de son enseignement sur la prière.`,
        pistesObservation: {
          qui: `La prière commence par « Notre » : elle est collective avant d'être personnelle.`,
          comment: `Repérez l'ordre : trois demandes tournées vers Dieu, puis trois tournées vers nous.`,
          pourquoi: `Les v. 14-15 expliquent pourquoi la demande de pardon engage celui qui la fait.`,
          quoi: `Relevez ce qui est demandé, et surtout ce qui ne l'est pas.`,
        },
        interpretation: {
          destinataires: `Des disciples qui demandaient une méthode ont reçu des mots, et un ordre de priorités qui ne commence pas par eux.`,
          eglise: `Cette prière tient en quelques lignes et contient tout. Elle commence par « Notre » — même seul, on ne prie jamais isolément. Puis trois demandes tournées vers Dieu : ton nom, ton règne, ta volonté. Ensuite seulement viennent les nôtres, et elles sont modestes : le pain d'aujourd'hui, pas les provisions du mois. Le pardon y est demandé et engagé dans la même phrase, ce qui est redoutable. Enfin, la protection. Rien sur la réussite, rien sur le confort. Jésus nous apprend à désirer autrement.`,
        },
        pistesApplication: {
          priere: `Le Notre Père lui-même, à prier phrase par phrase.`,
          condition: `V. 14 : le pardon reçu est lié au pardon accordé.`,
          defi: `Prier le Notre Père en s'arrêtant après chaque phrase pour la reformuler avec ses mots.`,
        },
        questionsApprofondissement: [
          `Quelle demande de cette prière vous coûte le plus ?`,
          `Que serait « ton règne vienne » dans votre semaine concrète ?`,
          `Qui devez-vous pardonner pour prier honnêtement le verset 12 ?`,
        ],
        versetMemoire: { ref: `Matthieu 6:10`, texte: `que ton règne vienne; que ta volonté soit faite sur la terre comme au ciel.` },
        engagementPropose: `Priez le Notre Père en vous arrêtant après chaque phrase pour la reformuler avec vos mots.`,
        priere: `Notre Père qui es aux cieux, que ton nom soit sanctifié, que ton règne vienne, que ta volonté soit faite en moi aujourd'hui. Amen.`,
      },
      {
        jour: 5,
        titre: `Regardez les oiseaux`,
        passageId: 'mt6b',
        contexteImmediat: `La fin du chapitre 6 : après l'argent et les trésors, Jésus aborde l'inquiétude du nécessaire.`,
        pistesObservation: {
          qui: `Jésus parle à des gens dont les besoins sont réels : nourriture, boisson, vêtement.`,
          ou: `Le regard est envoyé dehors : les oiseaux du ciel, les lis des champs, l'herbe jetée au four.`,
          comment: `Jésus argumente par comparaison : si Dieu fait cela pour eux, à combien plus forte raison pour vous.`,
          quoi: `Comptez les occurrences de « ne vous inquiétez pas ». Notez ce qui est proposé à la place.`,
        },
        interpretation: {
          destinataires: `Des paysans et des artisans de Galilée, dont la subsistance tenait à peu, devaient apprendre à qui confier le lendemain.`,
          eglise: `Jésus prend l'inquiétude au sérieux : il sait que la nourriture et le vêtement sont des besoins réels. Son argument n'est pas « ce n'est pas grave », mais « regardez ». Il envoie observer les oiseaux, les lis — la création qui reçoit sans thésauriser. Puis vient la question du verset 27, presque douce : est-ce que l'inquiétude a jamais ajouté quoi que ce soit ? Le remède proposé n'est pas l'indifférence mais une réorientation : cherchez premièrement le royaume. L'inquiétude se combat rarement de front ; elle se déplace quand quelque chose de plus grand occupe le centre.`,
        },
        pistesApplication: {
          promesse: `« Toutes ces choses vous seront données par-dessus. »`,
          commandement: `V. 33 : chercher premièrement le royaume et la justice de Dieu.`,
          defi: `Passer cinq minutes dehors à regarder quelque chose de vivant, sans téléphone.`,
        },
        questionsApprofondissement: [
          `Quelle inquiétude occupe le plus de place en vous ?`,
          `Qu'est-ce qu'elle vous a apporté jusqu'ici ?`,
          `Qu'est-ce qui passerait « premièrement » si vous décidiez aujourd'hui ?`,
        ],
        versetMemoire: { ref: `Matthieu 6:34`, texte: `Ne vous inquiétez donc pas du lendemain; car le lendemain aura soin de lui-même. A chaque jour suffit sa peine.` },
        engagementPropose: `Passez cinq minutes dehors à regarder quelque chose de vivant, sans téléphone.`,
        priere: `Père céleste, tu nourris les oiseaux et tu me connais mieux qu'eux. Je te confie demain, et je reçois aujourd'hui. Amen.`,
      },
      {
        jour: 6,
        titre: `Demandez, cherchez, frappez`,
        passageId: 'lc11',
        contexteImmediat: `Chez Luc, cet enseignement suit immédiatement la parabole de l'ami importun, qui obtient à force d'insistance.`,
        pistesObservation: {
          qui: `Jésus, et l'image d'un père avec son fils. Notez à qui Jésus se compare, et à qui il nous compare.`,
          comment: `Trois verbes montent en intensité : demander, chercher, frapper. Notez la progression.`,
          pourquoi: `L'argument va du moindre au plus grand : « si donc, méchants comme vous l'êtes… »`,
          quoi: `Le v. 13 nomme précisément le don promis. Vérifiez que ce n'est pas ce qu'on attendait.`,
        },
        interpretation: {
          destinataires: `Des disciples qui hésitaient à insister devaient savoir que la persévérance ne fatigue pas Dieu.`,
          eglise: `Les trois verbes montent en intensité : demander se fait de loin, chercher demande du mouvement, frapper suppose qu'on est déjà à la porte. Jésus légitime l'insistance dans la prière. Puis il argumente par le bas : si des parents imparfaits savent donner du pain plutôt qu'une pierre, combien plus le Père. Notez ce que Luc met à la fin de la promesse : non pas « toutes choses », mais le Saint-Esprit. La meilleure réponse à la prière n'est pas toujours l'objet demandé ; c'est parfois la présence de Dieu lui-même dans la situation.`,
        },
        pistesApplication: {
          promesse: `V. 10 : quiconque demande reçoit.`,
          defi: `Reprendre une prière abandonnée, et la prier à nouveau aujourd'hui.`,
        },
        questionsApprofondissement: [
          `Sur quoi avez-vous cessé d'insister dans la prière ?`,
          `Quelle image de « père » projetez-vous sur Dieu, à votre insu ?`,
          `Que se passerait-il si la réponse était sa présence, plutôt que la solution ?`,
        ],
        versetMemoire: { ref: `Luc 11:9`, texte: `Demandez, et l'on vous donnera; cherchez, et vous trouverez; frappez, et l'on vous ouvrira.` },
        engagementPropose: `Reprenez une prière que vous avez abandonnée, et priez-la à nouveau aujourd'hui.`,
        priere: `Père, je continue de demander, de chercher, de frapper. Et si tu me donnes ta présence plutôt que ma solution, apprends-moi à la recevoir. Amen.`,
      },
      {
        jour: 7,
        titre: `Mettre en pratique`,
        passageId: 'jc1b',
        contexteImmediat: `Jacques prolonge l'enseignement de Jésus par une image de miroir. La lettre s'adresse à des croyants dispersés.`,
        pistesObservation: {
          qui: `Jacques écrit à « mes frères bien-aimés ». L'homme au miroir est une figure, pas une personne réelle.`,
          comment: `Trois consignes brèves au v. 19, puis une comparaison développée aux v. 23-25.`,
          pourquoi: `Le v. 20 donne la raison de la consigne sur la colère.`,
          quoi: `Notez ce que fait exactement l'homme du v. 24 : il regarde, il s'en va, il oublie.`,
        },
        interpretation: {
          destinataires: `Des communautés où la parole blessait devaient apprendre que la foi se vérifie à ce qu'elle produit.`,
          eglise: `Jacques prolonge le sermon de Jésus par une image sévère : celui qui écoute sans pratiquer ressemble à un homme qui se regarde dans un miroir puis oublie aussitôt son visage. L'oubli n'est pas ici un problème de mémoire mais de volonté. Avant cela, Jacques donne trois consignes d'une simplicité redoutable : prompt à écouter, lent à parler, lent à se mettre en colère. Aucune ne demande de connaissances théologiques. Et il termine par une promesse : le bonheur n'est pas promis à celui qui sait, mais à celui qui fait.`,
        },
        pistesApplication: {
          commandement: `V. 22 : mettre la parole en pratique.`,
          erreur: `Se tromper soi-même par de faux raisonnements en se contentant d'écouter.`,
          defi: `Choisir une seule chose apprise ces sept jours, et la faire aujourd'hui.`,
        },
        questionsApprofondissement: [
          `Qu'avez-vous compris cette semaine sans encore l'avoir mis en pratique ?`,
          `Laquelle des trois consignes du verset 19 vous manque le plus ?`,
          `Qu'est-ce qui vous fait oublier si vite ce que vous lisez ?`,
        ],
        versetMemoire: { ref: `Jacques 1:22`, texte: `Mettez en pratique la parole, et ne vous bornez pas à l'écouter.` },
        engagementPropose: `Choisissez une seule chose apprise ces sept jours, et faites-la aujourd'hui.`,
        priere: `Seigneur, garde-moi d'être un auditeur oublieux. Donne-moi de faire une seule chose de ce que j'ai reçu. Amen.`,
      },
    ],
  },
  {
    id: 'amour',
    titre: 'Aimer comme Christ',
    sousTitre: `7 jours sur l'amour véritable`,
    description: `L'amour chrétien n'est pas un sentiment à entretenir mais une manière de traiter les gens. Sept textes pour désapprendre nos réflexes et réapprendre à aimer.`,
    symbole: '♡',
    niveau: 'Découverte',
    themes: ['amour', 'pardon', 'relations'],
    jours: [
      {
        jour: 1,
        titre: `Dieu est amour`,
        passageId: '1jn4',
        contexteImmediat: `Une lettre écrite après une crise : des membres ont quitté la communauté en niant que le Christ soit venu en chair.`,
        pistesObservation: {
          qui: `L'auteur s'adresse à des « bien-aimés ». Dieu, le Fils et « nous » sont les acteurs.`,
          comment: `Jean raisonne en boucle : il affirme, puis prouve, puis en tire une conséquence. Repérez les « car » et les « si ».`,
          pourquoi: `Le v. 11 tire l'obligation de l'initiative divine : « si Dieu nous a ainsi aimés ».`,
          quoi: `Le v. 10 définit l'amour par une négation puis une affirmation. Notez laquelle vient d'abord.`,
        },
        interpretation: {
          destinataires: `Une Église divisée devait vérifier sa foi à un signe visible : l'amour fraternel effectif.`,
          eglise: `Jean ne dit pas que Dieu aime, mais qu'il est amour. Ce n'est pas une qualité parmi d'autres, c'est son être même. Et la preuve n'est pas une émotion : c'est un envoi, un don, une croix. Le verset 10 renverse notre intuition religieuse — l'amour ne consiste pas en ce que nous avons aimé Dieu, mais en ce qu'il nous a aimés. Tout commence de son côté. La conséquence tombe au verset 11 : « si Dieu nous a ainsi aimés, nous devons aussi nous aimer les uns les autres ». On ne peut pas garder cet amour pour soi ; il circule ou il s'éteint.`,
        },
        pistesApplication: {
          commandement: `V. 11 : nous aimer les uns les autres.`,
          verset: `V. 19, court et décisif.`,
          defi: `Envoyer un message d'encouragement à une personne à qui vous ne parlez plus assez.`,
        },
        questionsApprofondissement: [
          `Vivez-vous l'amour de Dieu comme un fait acquis ou comme une chose à gagner ?`,
          `Vers qui cet amour reçu doit-il circuler aujourd'hui ?`,
          `Qu'est-ce qui bloque cette circulation ?`,
        ],
        versetMemoire: { ref: `1 Jean 4:19`, texte: `Pour nous, nous l'aimons, parce qu'il nous a aimés le premier.` },
        engagementPropose: `Envoyez un message d'encouragement à une personne à qui vous ne parlez plus assez.`,
        priere: `Dieu qui es amour, tu m'as aimé le premier. Fais passer par moi ce que j'ai reçu, vers ceux que tu mets sur ma route. Amen.`,
      },
      {
        jour: 2,
        titre: `Le portrait de la charité`,
        passageId: '1co13',
        versets: [1, 2, 3, 4, 5, 6, 7],
        contexteImmediat: `Paul écrit à une Église déchirée par les rivalités autour des dons spirituels. Ce chapitre est une correction, pas un poème de mariage.`,
        pistesObservation: {
          qui: `Paul parle à la première personne : « quand je parlerais ». Notez qu'il se met lui-même en cause.`,
          comment: `Les v. 1-3 suivent tous la même construction : une hypothèse grandiose, puis « si je n'ai pas la charité ».`,
          pourquoi: `Les v. 8-12 expliquent pourquoi l'amour dure : tout le reste est partiel.`,
          quoi: `Les v. 4-7 décrivent l'amour par des verbes, non par des adjectifs. Comptez combien sont négatifs.`,
        },
        interpretation: {
          destinataires: `Des Corinthiens qui hiérarchisaient les dons devaient comprendre que sans amour, les plus spectaculaires ne valent rien.`,
          eglise: `Paul écrit ce texte à une Église déchirée par les rivalités spirituelles. Ce n'est donc pas un poème de mariage : c'est une correction. Les trois premiers versets démontent nos idoles — l'éloquence, la connaissance, la foi spectaculaire, jusqu'au sacrifice de soi — et concluent chaque fois par le même verdict : sans amour, rien. Puis vient le portrait, et il est fait de verbes, pas d'adjectifs : patiente, ne se vante pas, ne cherche pas son intérêt, ne s'irrite pas. L'amour se reconnaît à des comportements observables, pas à une chaleur intérieure.`,
        },
        pistesApplication: {
          peche: `L'envie, la vantardise, la recherche de son propre intérêt.`,
          defi: `Relire les v. 4 à 7 en remplaçant « la charité » par votre prénom.`,
        },
        questionsApprofondissement: [
          `Quel verset de ce portrait vous met le plus mal à l'aise ?`,
          `Où cherchez-vous votre intérêt en croyant aimer ?`,
          `Qu'est-ce qui vous irrite le plus vite, et pourquoi ?`,
        ],
        versetMemoire: { ref: `1 Corinthiens 13:4`, texte: `La charité est patiente, elle est pleine de bonté; la charité n'est point envieuse.` },
        engagementPropose: `Relisez les versets 4 à 7 en remplaçant « la charité » par votre prénom.`,
        priere: `Seigneur, sans amour je ne suis rien. Rends ma patience plus longue et ma susceptibilité plus courte. Amen.`,
      },
      {
        jour: 3,
        titre: `Le père qui court`,
        passageId: 'lc15',
        contexteImmediat: `La troisième de trois paraboles sur ce qui était perdu, adressées à des pharisiens qui reprochaient à Jésus de manger avec les pécheurs.`,
        pistesObservation: {
          qui: `Un père, deux fils — mais seul le cadet apparaît dans ces versets. Notez qui Jésus a en face de lui en racontant cela.`,
          ou: `Suivez le trajet : la maison, un pays éloigné, un champ à pourceaux, puis le retour.`,
          comment: `Le fils prépare un discours ; observez ce qu'il en reste une fois arrivé.`,
          pourquoi: `Le v. 24 donne la raison de la fête : « il était mort et il est revenu à la vie ».`,
          quoi: `Relevez les quatre gestes du père au v. 20, puis les quatre ordres du v. 22-23.`,
        },
        interpretation: {
          destinataires: `Des religieux scandalisés par l'accueil des pécheurs devaient voir de quel côté se tenait la joie de Dieu.`,
          eglise: `Dans cette parabole, le fils prépare un discours ; le père ne le laisse pas le finir. Il l'aperçoit « comme il était encore loin », ce qui suppose qu'il regardait. Puis il court — ce qui, pour un patriarche oriental, était une perte de dignité assumée. La robe, l'anneau, les souliers ne sont pas des consolations : ce sont des signes de restauration complète du statut de fils. Le pardon, ici, n'est pas une tolérance accordée du bout des lèvres. C'est une fête. Beaucoup de croyants acceptent d'être pardonnés mais refusent d'être fêtés.`,
        },
        pistesApplication: {
          exemple: `Le père, qui court et qui restaure sans conditions.`,
          erreur: `Croire qu'il faut d'abord rembourser pour être accueilli.`,
          defi: `Écrire ce que vous croyez devoir « rembourser » à Dieu, puis le barrer.`,
        },
        questionsApprofondissement: [
          `Vous voyez-vous plutôt en fils cadet, en fils aîné, ou en père ?`,
          `Quelle part de vous prépare encore un discours pour mériter le retour ?`,
          `Que serait, pour vous, accepter la fête ?`,
        ],
        versetMemoire: { ref: `Luc 15:20`, texte: `Comme il était encore loin, son père le vit et fut ému de compassion, il courut se jeter à son cou et le baisa.` },
        engagementPropose: `Écrivez ce que vous croyez devoir « rembourser » à Dieu, puis barrez-le.`,
        priere: `Père, tu cours vers moi avant que j'aie fini de m'expliquer. Apprends-moi à me laisser accueillir. Amen.`,
      },
      {
        jour: 4,
        titre: `Se revêtir de miséricorde`,
        passageId: 'col3',
        contexteImmediat: `Après avoir affirmé la primauté du Christ, Paul décrit la vie qui en découle, avec l'image d'un vêtement que l'on choisit.`,
        pistesObservation: {
          qui: `Paul écrit à des « élus de Dieu, saints et bien-aimés ». Notez que l'identité précède l'exhortation.`,
          comment: `Le passage empile les impératifs : revêtez-vous, supportez-vous, pardonnez-vous. Comptez-les.`,
          pourquoi: `Le v. 13 donne la mesure du pardon : « de même que Christ vous a pardonné ».`,
          quoi: `Relevez les cinq vertus du v. 12, puis ce qui vient « par-dessus » au v. 14.`,
        },
        interpretation: {
          destinataires: `Une Église menacée par un enseignement fait de règles devait apprendre que la vie nouvelle se joue dans les relations ordinaires.`,
          eglise: `Paul emploie l'image du vêtement : chaque matin, on choisit ce que l'on met. Miséricorde, bonté, humilité, douceur, patience ne sont pas des tempéraments hérités mais des habits à enfiler. Le verset 13 devient plus exigeant : se supporter, et se pardonner « de même que Christ vous a pardonné ». La mesure n'est donc pas ce que l'autre mérite. Puis, par-dessus tout, la charité, qui tient l'ensemble comme une ceinture. Le passage se termine par la gratitude, mentionnée trois fois en six versets — comme si elle était le climat sans lequel rien de tout cela ne tient.`,
        },
        pistesApplication: {
          exemple: `La gratitude, mentionnée trois fois en six versets.`,
          commandement: `V. 13 : se pardonner réciproquement.`,
          defi: `Le matin, nommer le « vêtement » dont vous aurez besoin dans la journée.`,
        },
        questionsApprofondissement: [
          `Quel « vêtement » avez-vous oublié de mettre ces derniers temps ?`,
          `Qui devez-vous « supporter » en ce moment, et qu'est-ce qui vous coûte ?`,
          `Comment la gratitude pourrait-elle changer le climat de votre foyer ?`,
        ],
        versetMemoire: { ref: `Colossiens 3:14`, texte: `Mais par-dessus toutes ces choses revêtez-vous de la charité, qui est le lien de la perfection.` },
        engagementPropose: `Le matin, nommez le « vêtement » dont vous aurez besoin dans la journée.`,
        priere: `Seigneur, je me revêts aujourd'hui de bonté, d'humilité et de patience. Que ta paix règne dans mon cœur, et rends-moi reconnaissant. Amen.`,
      },
      {
        jour: 5,
        titre: `Aimer sans hypocrisie`,
        passageId: 'rm12',
        versets: [9, 10, 11, 12, 13, 14, 15, 16, 17, 18],
        contexteImmediat: `La partie pratique de l'épître aux Romains : une suite d'impératifs très courts sur la vie fraternelle.`,
        pistesObservation: {
          qui: `Paul s'adresse à des frères, mais plusieurs consignes concernent ceux du dehors, y compris les persécuteurs.`,
          comment: `Le style est télégraphique : relevez combien d'ordres tiennent en dix versets.`,
          pourquoi: `Le v. 18 pose une limite honnête : « s'il est possible, autant que cela dépend de vous ».`,
          quoi: `Notez les deux consignes du v. 15, et laquelle des deux est la plus difficile.`,
        },
        interpretation: {
          destinataires: `Des chrétiens minoritaires à Rome devaient tenir ensemble deux choses : ne pas se venger, et vivre en paix avec tous.`,
          eglise: `Paul énumère ici l'amour en actes courts, presque télégraphiques. Deux sont particulièrement difficiles. « Réjouissez-vous avec ceux qui se réjouissent » : se réjouir du bonheur d'autrui coûte souvent plus que de compatir à son malheur, car la joie de l'autre révèle nos envies. Et « bénissez ceux qui vous persécutent » : bénir, c'est vouloir activement leur bien. Puis vient une phrase pleine de réalisme : « s'il est possible, autant que cela dépend de vous ». La paix n'est pas toujours possible ; votre part, elle, l'est.`,
        },
        pistesApplication: {
          peche: `Rendre le mal pour le mal.`,
          commandement: `V. 14 : bénir et ne pas maudire.`,
          defi: `Bénir à voix haute, dans la prière, une personne difficile.`,
        },
        questionsApprofondissement: [
          `De quelle joie d'autrui avez-vous du mal à vous réjouir ?`,
          `Qui pourriez-vous bénir plutôt que juger, cette semaine ?`,
          `Quelle est votre part, dans une relation tendue en ce moment ?`,
        ],
        versetMemoire: { ref: `Romains 12:18`, texte: `S'il est possible, autant que cela dépend de vous, soyez en paix avec tous les hommes.` },
        engagementPropose: `Bénissez à voix haute, dans la prière, une personne difficile.`,
        priere: `Seigneur, rends mon amour moins hypocrite. Apprends-moi à me réjouir du bien des autres et à bénir ceux qui me blessent. Amen.`,
      },
      {
        jour: 6,
        titre: `L'amour bannit la crainte`,
        passageId: '1jn4',
        versets: [18, 19],
        contexteImmediat: `La suite immédiate du passage sur l'amour de Dieu : Jean en tire une conséquence sur la peur.`,
        pistesObservation: {
          qui: `« Nous » et « celui qui craint ». Notez que Jean ne s'exclut pas du diagnostic.`,
          comment: `Le v. 18 procède par oppositions : crainte contre amour, châtiment contre perfection.`,
          pourquoi: `Le v. 19 donne le fondement : l'amour vient de lui, pas de nous.`,
          quoi: `Notez de quelle crainte il s'agit précisément : celle qui « suppose un châtiment ».`,
        },
        interpretation: {
          destinataires: `Des croyants ébranlés par une crise devaient être rassurés sur leur place devant Dieu, non sur leur performance.`,
          eglise: `Jean fait un lien que nous faisons rarement : la peur et l'amour ne peuvent pas occuper le même espace. Il précise pourquoi — « la crainte suppose un châtiment ». La peur qu'il vise n'est pas l'appréhension ordinaire, mais celle de quelqu'un qui redoute la sanction, qui n'est jamais sûr d'être accepté. Beaucoup vivent leur foi ainsi, dans une inquiétude sourde de ne pas être à la hauteur. Le remède n'est pas de se rassurer soi-même, mais de se laisser aimer plus profondément. On ne chasse pas la peur en la combattant ; on la déloge en s'installant dans l'amour.`,
        },
        pistesApplication: {
          promesse: `« L'amour parfait bannit la crainte. »`,
          defi: `Nommer une peur, et demander à Dieu non de la retirer, mais de vous aimer dedans.`,
        },
        questionsApprofondissement: [
          `Votre foi ressemble-t-elle plus à une confiance ou à une crainte du jugement ?`,
          `Qu'est-ce qui, chez vous, redoute encore la sanction de Dieu ?`,
          `Où avez-vous besoin de « vous laisser aimer » plutôt que d'agir ?`,
        ],
        versetMemoire: { ref: `1 Jean 4:18`, texte: `La crainte n'est pas dans l'amour, mais l'amour parfait bannit la crainte.` },
        engagementPropose: `Nommez une peur, et demandez à Dieu non de la retirer, mais de vous aimer dedans.`,
        priere: `Père, là où j'ai peur de ne pas être à la hauteur, fais grandir ton amour en moi jusqu'à ce que la crainte cède. Amen.`,
      },
      {
        jour: 7,
        titre: `Comme je vous ai aimés`,
        passageId: 'jn15',
        versets: [9, 10, 11, 12],
        contexteImmediat: `Toujours la nuit de l'arrestation. Jésus donne un commandement et en fixe lui-même la mesure.`,
        pistesObservation: {
          qui: `Jésus, le Père, et « vous ». Notez la chaîne : le Père aime le Fils, le Fils nous aime, nous nous aimons.`,
          comment: `Le v. 9 précède le v. 12 : la demeure vient avant l'ordre. Repérez cet ordre logique.`,
          pourquoi: `Le v. 11 donne la finalité : « afin que votre joie soit parfaite ».`,
          quoi: `Relevez l'étalon donné au v. 12 : « comme je vous ai aimés ».`,
        },
        interpretation: {
          destinataires: `Des disciples sur le point d'être dispersés devaient recevoir un signe distinctif qui tienne sans lui.`,
          eglise: `Jésus donne un commandement neuf, et il en fixe lui-même l'étalon : « comme je vous ai aimés ». C'est-à-dire jusqu'au bout, jusqu'au lavement des pieds et jusqu'à la croix. Impossible à tenir par la volonté seule — c'est pourquoi le verset 9 vient avant le verset 12 : demeurez d'abord dans mon amour. L'ordre est essentiel. On n'aime pas afin d'être aimé de Dieu ; on aime parce qu'on demeure dans son amour. Et le verset 11 en donne le fruit inattendu : ce n'est pas l'épuisement, mais la joie parfaite.`,
        },
        pistesApplication: {
          commandement: `V. 12, le commandement neuf.`,
          condition: `V. 10 : demeurer dans son amour en gardant ses commandements.`,
          defi: `Faire, pour quelqu'un, un service concret que vous n'avez pas envie de faire.`,
        },
        questionsApprofondissement: [
          `Aimez-vous pour obtenir quelque chose, ou depuis ce que vous avez reçu ?`,
          `Qui, en ce moment, vous demande d'aimer « comme » Christ ?`,
          `Où votre amour est-il devenu un devoir plutôt qu'une joie ?`,
        ],
        versetMemoire: { ref: `Jean 15:12`, texte: `C'est ici mon commandement: Aimez-vous les uns les autres, comme je vous ai aimés.` },
        engagementPropose: `Faites, pour quelqu'un, un service concret que vous n'avez pas envie de faire.`,
        priere: `Jésus, je ne sais pas aimer ainsi par moi-même. Fais-moi demeurer dans ton amour, pour que le mien en découle. Amen.`,
      },
    ],
  },
  {
    id: 'epreuve',
    titre: `Traverser l'épreuve`,
    sousTitre: '7 jours quand tout est lourd',
    description: `Pour les saisons de fatigue, de deuil, de doute ou d'attente. Ces textes ne donnent pas d'explication facile : ils tiennent compagnie.`,
    symbole: '◇',
    niveau: 'Découverte',
    themes: ['souffrance', 'espérance', 'patience'],
    jours: [
      {
        jour: 1,
        titre: `Un temps pour tout`,
        passageId: 'ec3',
        contexteImmediat: `Un poème du Prédicateur sur les temps de la vie, au milieu d'un livre qui examine ce qui reste quand les certitudes tombent.`,
        pistesObservation: {
          qui: `Aucun personnage : le texte parle des activités humaines en général.`,
          quand: `Tout le passage porte sur le temps. Comptez combien de fois le mot revient.`,
          comment: `Les couples fonctionnent par opposition. Repérez la construction, toujours identique.`,
          quoi: `Relevez les paires : combien y en a-t-il, et laquelle vous concerne aujourd'hui ?`,
        },
        interpretation: {
          destinataires: `Des lecteurs cherchant à maîtriser leur vie devaient admettre qu'il existe des saisons qu'on ne choisit pas.`,
          eglise: `L'Ecclésiaste ne console pas en niant la difficulté ; il la situe. Il y a un temps pour pleurer, dit-il, aussi légitime que celui de rire. Beaucoup de souffrance vient de notre refus de reconnaître la saison que nous traversons : on veut danser quand il faudrait pleurer, ou l'inverse. Nommer honnêtement le temps que l'on vit, c'est cesser de lutter contre lui. Et l'énumération elle-même est apaisante : chaque chose y a une place, y compris ce qui nous semble insupportable. Rien de ce que vous vivez n'est hors du champ que Dieu embrasse.`,
        },
        pistesApplication: {
          exemple: `Reconnaître honnêtement la saison que l'on traverse.`,
          defi: `Écrire une phrase : « en ce moment, je traverse un temps de… ».`,
        },
        questionsApprofondissement: [
          `Quelle saison traversez-vous en ce moment ? Nommez-la simplement.`,
          `Contre quelle saison luttez-vous en refusant de l'admettre ?`,
          `Qu'est-ce qui changerait si vous acceptiez d'y être, pour un temps ?`,
        ],
        versetMemoire: { ref: `Ecclésiaste 3:1`, texte: `Il y a un temps pour tout, un temps pour toute chose sous les cieux.` },
        engagementPropose: `Écrivez une phrase : « en ce moment, je traverse un temps de… ».`,
        priere: `Seigneur du temps, j'accepte la saison où je suis. Ne me laisse pas seul dedans, et fais-moi confiance pour la traverser avec toi. Amen.`,
      },
      {
        jour: 2,
        titre: `Si tu traverses les eaux`,
        passageId: 'es43',
        contexteImmediat: `Un oracle adressé à un peuple déjà en exil, dont la situation ne s'est pas arrangée.`,
        pistesObservation: {
          qui: `L'Éternel parle, s'adressant à Jacob et à Israël — deux noms pour le même peuple.`,
          ou: `Le texte évoque des eaux, des fleuves, du feu : des lieux de passage, pas de séjour.`,
          comment: `Notez la forme des promesses : « si tu traverses… je serai ». La difficulté est supposée, pas niée.`,
          quoi: `Relevez ce qui fonde la promesse au v. 1 : « je t'appelle par ton nom, tu es à moi ».`,
        },
        interpretation: {
          destinataires: `Des déportés qui se croyaient abandonnés devaient entendre qu'ils appartenaient toujours à Dieu.`,
          eglise: `Dieu s'adresse ici à un peuple en exil, c'est-à-dire à des gens dont la situation ne s'est pas arrangée. La promesse n'est pas l'absence d'eaux ni de feu — elle dit « si tu traverses », « si tu marches », en supposant que cela arrivera. Ce qui est promis, c'est un accompagnement et une issue : tu ne seras pas submergé, tu ne seras pas consumé. Et cela repose sur ce qui précède, au verset 1 : « je t'ai appelé par ton nom, tu es à moi ». La sécurité vient de l'appartenance, pas des circonstances.`,
        },
        pistesApplication: {
          promesse: `V. 2 : « je serai avec toi », et « ils ne te submergeront point ».`,
          defi: `Dire son prénom à voix haute suivi de : « tu es à moi, dit le Seigneur ».`,
        },
        questionsApprofondissement: [
          `Quelles eaux traversez-vous, et depuis combien de temps ?`,
          `Qu'est-ce qui vous ferait croire que vous êtes submergé plutôt qu'en traversée ?`,
          `Que change la phrase « tu es à moi » dans votre situation ?`,
        ],
        versetMemoire: { ref: `Ésaïe 43:2`, texte: `Si tu traverses les eaux, je serai avec toi; Et les fleuves, ils ne te submergeront point.` },
        engagementPropose: `Dites votre prénom à voix haute suivi de : « tu es à moi, dit le Seigneur ».`,
        priere: `Éternel, tu m'appelles par mon nom. Je traverse, je ne m'installe pas. Sois avec moi dans les eaux. Amen.`,
      },
      {
        jour: 3,
        titre: `La force renouvelée`,
        passageId: 'es40',
        contexteImmediat: `La fin du chapitre 40, adressée à des exilés épuisés qui pensaient que Dieu avait perdu de vue leur cause.`,
        pistesObservation: {
          qui: `L'Éternel est décrit ; les « adolescents » et les « jeunes hommes » servent de contre-exemple.`,
          comment: `Le passage commence par deux questions, puis affirme. Repérez le rôle de ces questions.`,
          pourquoi: `Le v. 28 fonde tout : Dieu « ne se fatigue point ».`,
          quoi: `Notez les trois verbes de la fin : voler, courir, marcher. Vérifiez leur ordre.`,
        },
        interpretation: {
          destinataires: `Un peuple découragé devait apprendre que sa force ne venait pas de sa propre énergie.`,
          eglise: `Ésaïe s'adresse à des gens épuisés, et il commence par leur rappeler qui est Dieu : celui qui ne se fatigue pas. Puis vient une observation réaliste — même les jeunes gens chancellent. La fatigue n'est pas un défaut spirituel, elle est humaine. La promesse porte sur un renouvellement, pas sur une force à produire soi-même. Et remarquez l'ordre des images de la fin : voler, courir, marcher. On s'attendrait à l'inverse. C'est peut-être que la marche — la fidélité ordinaire, jour après jour — demande la plus grande grâce.`,
        },
        pistesApplication: {
          promesse: `V. 31 : la force renouvelée pour qui se confie.`,
          condition: `Le renouvellement est promis à « ceux qui se confient en l'Éternel ».`,
          defi: `S'accorder un vrai repos aujourd'hui, sans culpabilité.`,
        },
        questionsApprofondissement: [
          `Où êtes-vous fatigué en ce moment : le corps, le cœur, la foi ?`,
          `Qu'est-ce que vous essayez encore de porter seul ?`,
          `Êtes-vous dans un temps de vol, de course ou de marche ?`,
        ],
        versetMemoire: { ref: `Ésaïe 40:31`, texte: `Mais ceux qui se confient en l'Éternel renouvellent leur force.` },
        engagementPropose: `Accordez-vous un vrai repos aujourd'hui, sans culpabilité : c'est aussi spirituel.`,
        priere: `Dieu qui ne te lasses jamais, je suis fatigué. Renouvelle ma force, et donne-moi de marcher sans me décourager. Amen.`,
      },
      {
        jour: 4,
        titre: `L'épreuve produit`,
        passageId: 'jc1a',
        contexteImmediat: `L'ouverture de la lettre de Jacques, adressée à des croyants dispersés et éprouvés.`,
        pistesObservation: {
          qui: `Jacques écrit à « mes frères ». Dieu apparaît comme celui qui donne.`,
          comment: `Le raisonnement enchaîne : épreuve → patience → œuvre accomplie. Suivez la chaîne.`,
          pourquoi: `Les v. 6-8 expliquent pourquoi le doute empêche de recevoir.`,
          quoi: `Notez ce qui est demandé au v. 5, et la manière dont Dieu donne : « simplement et sans reproche ».`,
        },
        interpretation: {
          destinataires: `Des croyants éprouvés devaient comprendre que l'épreuve n'était pas un signe d'abandon.`,
          eglise: `Jacques demande une chose déroutante : regarder l'épreuve comme un sujet de joie. Il ne dit pas de se réjouir de la souffrance, mais de ce qu'elle produit — la patience, mot qui en grec évoque la capacité de tenir sous une charge. Ce n'est donc pas de la résignation : c'est une endurance qui se construit. Et Jacques prévoit immédiatement notre objection : si vous ne comprenez pas, demandez la sagesse. Dieu la donne « simplement et sans reproche » : sans soupir, sans vous faire sentir que vous auriez dû savoir.`,
        },
        pistesApplication: {
          promesse: `La sagesse donnée à qui la demande.`,
          condition: `V. 6 : demander avec foi, sans douter.`,
          defi: `Demander à Dieu une chose précise que vous n'osez plus demander.`,
        },
        questionsApprofondissement: [
          `Qu'est-ce que votre épreuve actuelle est en train de produire, même difficilement ?`,
          `Quelle sagesse avez-vous besoin de demander aujourd'hui ?`,
          `Qu'est-ce qui vous fait douter que Dieu réponde sans reproche ?`,
        ],
        versetMemoire: { ref: `Jacques 1:5`, texte: `Si quelqu'un d'entre vous manque de sagesse, qu'il la demande à Dieu, qui donne à tous simplement et sans reproche.` },
        engagementPropose: `Demandez à Dieu une chose précise que vous n'osez plus demander.`,
        priere: `Seigneur, je ne comprends pas tout. Je te demande la sagesse, et la patience de tenir. Achève en moi ton œuvre. Amen.`,
      },
      {
        jour: 5,
        titre: `Ma grâce te suffit`,
        passageId: '2co12',
        contexteImmediat: `Paul a prié trois fois pour que son « écharde » soit retirée. Elle ne l'a pas été. Ce passage rapporte la réponse reçue.`,
        pistesObservation: {
          qui: `Paul et le Seigneur. Notez que c'est le Seigneur qui parle en premier au v. 9.`,
          comment: `Le v. 10 énumère cinq situations. Voyez ce que Paul en dit.`,
          pourquoi: `Le motif est donné : « afin que la puissance de Christ repose sur moi ».`,
          quoi: `Relevez la réponse exacte : ce qui est promis n'est pas la guérison.`,
        },
        interpretation: {
          destinataires: `Des Corinthiens séduits par des prédicateurs qui exhibaient leur force devaient revoir ce qui atteste un vrai ministère.`,
          eglise: `Paul a prié trois fois pour que son écharde soit retirée. Elle ne l'a pas été. Voilà un texte qui prend au sérieux les prières non exaucées, et il est écrit par quelqu'un qui avait vu des miracles. La réponse reçue n'est pas une explication mais une promesse : « ma grâce te suffit ». Puis Paul opère un renversement qu'on ne peut pas imiter à froid : il cesse de cacher sa faiblesse et se met à s'en glorifier, parce qu'elle devient le lieu où la puissance du Christ se voit. Ce n'est pas de la résignation : c'est un déplacement du centre.`,
        },
        pistesApplication: {
          promesse: `« Ma grâce te suffit. »`,
          erreur: `Cacher sa faiblesse en croyant protéger sa foi.`,
          defi: `Confier une faiblesse à une personne de confiance, cette semaine.`,
        },
        questionsApprofondissement: [
          `Quelle prière n'a pas reçu la réponse que vous vouliez ?`,
          `Quelle faiblesse cherchez-vous à cacher ?`,
          `Que serait-ce, pour vous, que « la grâce suffit » aujourd'hui ?`,
        ],
        versetMemoire: { ref: `2 Corinthiens 12:9`, texte: `Ma grâce te suffit, car ma puissance s'accomplit dans la faiblesse.` },
        engagementPropose: `Confiez une faiblesse à une personne de confiance, aujourd'hui ou cette semaine.`,
        priere: `Seigneur, ta grâce me suffit. Là où je suis faible, montre ta puissance. Aide-moi à ne plus me cacher. Amen.`,
      },
      {
        jour: 6,
        titre: `Courir avec persévérance`,
        passageId: 'he12',
        contexteImmediat: `Après la galerie des témoins du chapitre 11, l'auteur en tire la conséquence pour ses lecteurs fatigués.`,
        pistesObservation: {
          qui: `« Nous », la nuée de témoins, et Jésus. Notez le rôle exact des témoins : ils entourent, ils ne jugent pas.`,
          ou: `L'image est celle d'un stade : une carrière ouverte, des gradins.`,
          comment: `Trois consignes s'enchaînent : rejeter, regarder, courir. Repérez-les.`,
          quoi: `Le v. 1 distingue deux choses à déposer : un fardeau et un péché. Ne les confondez pas.`,
        },
        interpretation: {
          destinataires: `Une communauté sous pression, tentée d'abandonner, devait tenir en fixant son regard ailleurs qu'à ses circonstances.`,
          eglise: `L'image est celle du stade. Trois consignes : alléger, regarder, courir. Alléger d'abord — l'auteur distingue le « fardeau », qui n'est pas forcément un péché mais qui ralentit, et le péché qui enveloppe les jambes. Il y a des choses légitimes qu'il faut pourtant déposer pour tenir la distance. Regarder ensuite : fixer Jésus, non comme un modèle lointain mais comme celui qui a couru avant, et qui l'a fait « en vue de la joie qui lui était réservée ». La persévérance n'est pas une crispation ; elle se nourrit d'un horizon.`,
        },
        pistesApplication: {
          commandement: `Rejeter tout fardeau et courir avec persévérance.`,
          defi: `Identifier une activité à retirer de votre semaine pour alléger la course.`,
        },
        questionsApprofondissement: [
          `Quel fardeau, même légitime, devez-vous déposer pour tenir ?`,
          `Qu'est-ce qui capte votre regard à la place du Christ ?`,
          `Quelle joie vous est réservée, que vous avez perdue de vue ?`,
        ],
        versetMemoire: { ref: `Hébreux 12:1`, texte: `courons avec persévérance dans la carrière qui nous est ouverte.` },
        engagementPropose: `Identifiez une activité à retirer de votre semaine pour alléger la course.`,
        priere: `Jésus, je dépose ce qui m'alourdit. Fixe mon regard sur toi, et donne-moi de courir jusqu'au bout. Amen.`,
      },
      {
        jour: 7,
        titre: `Il essuiera toute larme`,
        passageId: 'ap21',
        contexteImmediat: `La dernière vision de la Bible, adressée à des Églises entre compromis et persécution.`,
        pistesObservation: {
          qui: `Jean voit ; une voix parle du trône ; « celui qui était assis sur le trône » parle à son tour.`,
          ou: `Un nouveau ciel et une nouvelle terre, et une ville qui descend. Notez le sens du mouvement.`,
          comment: `Le passage alterne ce que Jean voit et ce qu'il entend. Repérez l'alternance.`,
          quoi: `Relevez ce qui disparaît au v. 4, et le geste très concret qui l'accompagne.`,
        },
        interpretation: {
          destinataires: `Des chrétiens persécutés devaient savoir que l'histoire ne se terminerait pas sur leur défaite.`,
          eglise: `La Bible s'achève sur une promesse d'une simplicité bouleversante. Dieu ne fait pas monter les siens ailleurs : il descend habiter avec eux. Et son premier geste n'est pas un discours mais une main qui essuie. Ce détail suppose qu'il y aura eu des larmes jusqu'au bout — l'espérance chrétienne ne les nie pas, elle en annonce la fin. « Voici, je fais toutes choses nouvelles » : non pas d'autres choses, mais celles-ci, renouvelées. Ce que vous traversez aujourd'hui n'est donc pas le dernier mot de votre histoire.`,
        },
        pistesApplication: {
          promesse: `V. 4 : plus de deuil, ni cri, ni douleur.`,
          defi: `Écrire ce que vous espérez voir renouvelé, et dater la page.`,
        },
        questionsApprofondissement: [
          `Qu'aimeriez-vous entendre Dieu dire quand il essuiera vos larmes ?`,
          `Qu'est-ce qui, chez vous, a besoin d'être « fait nouveau » plutôt que remplacé ?`,
          `Comment cette promesse change-t-elle votre aujourd'hui ?`,
        ],
        versetMemoire: { ref: `Apocalypse 21:5`, texte: `Voici, je fais toutes choses nouvelles.` },
        engagementPropose: `Écrivez ce que vous espérez voir renouvelé, et datez la page.`,
        priere: `Seigneur, tu fais toutes choses nouvelles. Je te confie mes larmes en attendant que tu les essuies. Que ton espérance me tienne debout. Amen.`,
      },
    ],
  },
  {
    id: 'priere',
    titre: 'Apprendre à prier',
    sousTitre: '7 jours pour retrouver le dialogue',
    description: `Pour ceux qui ne savent plus quoi dire, ou qui n'ont jamais su. Sept textes qui désencombrent la prière et lui rendent sa simplicité.`,
    symbole: '☩',
    niveau: 'Découverte',
    themes: ['prière', 'intimité', 'silence'],
    jours: [
      {
        jour: 1,
        titre: `Dans le secret`,
        passageId: 'mt6a',
        versets: [5, 6, 7, 8],
        contexteImmediat: `Le deuxième des trois actes de piété corrigés par Jésus dans le Sermon sur la montagne.`,
        pistesObservation: {
          qui: `Jésus, les hypocrites, les païens, et « ton Père qui voit dans le secret ».`,
          ou: `Trois lieux s'opposent : synagogues, coins des rues, et une chambre fermée.`,
          comment: `Chaque interdiction est suivie d'un motif, puis d'une consigne positive.`,
          quoi: `Notez ce que Jésus retire de la prière avant d'y ajouter quoi que ce soit.`,
        },
        interpretation: {
          destinataires: `Des croyants formés à une piété très visible devaient réapprendre à prier sans public.`,
          eglise: `La première leçon de Jésus sur la prière consiste à enlever des choses : le public, l'éloquence, la longueur. Ce qui reste tient en trois éléments — un lieu, une porte, un Père. Beaucoup abandonnent la prière parce qu'ils la trouvent laborieuse ; ils la comparent à celle des autres, ils s'inquiètent de mal la faire. Jésus coupe court : votre Père sait déjà. Ce que la prière produit, ce n'est donc pas de l'information transmise, mais une relation entretenue. Elle est un rendez-vous, pas une performance.`,
        },
        pistesApplication: {
          commandement: `V. 6 : entrer, fermer la porte, prier.`,
          defi: `Prier trois minutes sans rien demander, en disant seulement ce qui est vrai.`,
        },
        questionsApprofondissement: [
          `Qu'est-ce qui rend votre prière compliquée en ce moment ?`,
          `À qui, sans le vouloir, essayez-vous de plaire quand vous priez ?`,
          `Quel serait votre « lieu secret » réaliste, cette semaine ?`,
        ],
        versetMemoire: { ref: `Matthieu 6:8`, texte: `votre Père sait de quoi vous avez besoin, avant que vous le lui demandiez.` },
        engagementPropose: `Priez trois minutes, sans rien demander, en disant seulement ce qui est vrai.`,
        priere: `Père, je viens sans rien préparer. Merci de savoir déjà. Apprends-moi la simplicité. Amen.`,
      },
      {
        jour: 2,
        titre: `Les mots que Jésus donne`,
        passageId: 'mt6a',
        versets: [9, 10, 11, 12, 13],
        contexteImmediat: `La réponse de Jésus à la question de la méthode : il ne donne pas une technique, il donne des mots.`,
        pistesObservation: {
          qui: `La prière commence par « Notre » : notez que le priant n'est jamais seul.`,
          comment: `Repérez la bascule : trois demandes tournées vers Dieu, puis trois tournées vers nous.`,
          pourquoi: `Les v. 14-15 expliquent l'engagement contenu dans la demande de pardon.`,
          quoi: `Relevez ce qui est demandé pour soi : le pain du jour, le pardon, la protection. Rien d'autre.`,
        },
        interpretation: {
          destinataires: `Des disciples habitués aux longues prières devaient découvrir que l'essentiel tient en quelques lignes.`,
          eglise: `Quand les disciples demandent comment prier, Jésus ne donne pas une méthode mais des mots. Ils sont peu nombreux et couvrent toute une vie : la relation (Notre Père), le désir (que ton règne vienne), le besoin (notre pain), la réconciliation (pardonne-nous), la protection (délivre-nous). Cette prière peut se réciter en trente secondes ou se méditer une heure. Elle a l'avantage de nous sortir de nous-mêmes : elle commence par Dieu et se termine par le monde. Quand vous ne savez plus quoi dire, ces mots sont déjà là, prêts.`,
        },
        pistesApplication: {
          priere: `Le Notre Père, à prier chaque jour.`,
          condition: `V. 14 : pardonner pour être pardonné.`,
          defi: `Prier le Notre Père trois fois aujourd'hui : au lever, à midi, au coucher.`,
        },
        questionsApprofondissement: [
          `Quelle partie du Notre Père priez-vous sans y penser ?`,
          `Laquelle vous engage plus que vous ne le voudriez ?`,
          `Que demanderiez-vous si vous n'aviez droit qu'à une phrase ?`,
        ],
        versetMemoire: { ref: `Matthieu 6:9`, texte: `Notre Père qui es aux cieux! Que ton nom soit sanctifié.` },
        engagementPropose: `Priez le Notre Père trois fois aujourd'hui : au lever, à midi, au coucher.`,
        priere: `Notre Père, donne-nous aujourd'hui notre pain quotidien, et pardonne-nous comme nous pardonnons. Amen.`,
      },
      {
        jour: 3,
        titre: `L'insistance permise`,
        passageId: 'lc11',
        contexteImmediat: `Chez Luc, cet enseignement suit la parabole de l'ami importun qui obtient à force d'insistance.`,
        pistesObservation: {
          qui: `Jésus, et l'image d'un père avec son fils.`,
          comment: `Notez la progression des trois verbes, puis la reprise au v. 10 sous forme de promesse.`,
          pourquoi: `L'argument va du moindre au plus grand.`,
          quoi: `Le v. 13 nomme le don promis : le Saint-Esprit, et non l'objet demandé.`,
        },
        interpretation: {
          destinataires: `Des disciples qui craignaient d'importuner Dieu devaient apprendre que l'insistance est permise.`,
          eglise: `Jésus autorise l'insistance. Demander, chercher, frapper : les trois verbes sont au présent continu — continuez de demander. Rien dans l'Évangile ne laisse penser que la persévérance dans la prière fatiguerait Dieu. Au contraire, la comparaison avec un père humain suggère que sa disposition est meilleure que la nôtre, pas moins bonne. Et le don final, chez Luc, est le Saint-Esprit : Dieu se donne lui-même. C'est parfois décevant sur le moment, et c'est toujours plus que ce qu'on demandait.`,
        },
        pistesApplication: {
          promesse: `V. 10 : quiconque demande reçoit.`,
          defi: `Choisir une prière à porter chaque jour pendant un mois, et la noter.`,
        },
        questionsApprofondissement: [
          `Quelle prière avez-vous abandonnée par lassitude ?`,
          `Craignez-vous d'importuner Dieu ? D'où vient cette idée ?`,
          `Accepteriez-vous sa présence comme réponse ?`,
        ],
        versetMemoire: { ref: `Luc 11:10`, texte: `Car quiconque demande reçoit, celui qui cherche trouve, et l'on ouvre à celui qui frappe.` },
        engagementPropose: `Choisissez une prière à porter chaque jour pendant un mois, et notez-la.`,
        priere: `Père, je reviens frapper. Donne-moi ton Esprit, et si tu tardes, garde-moi à la porte. Amen.`,
      },
      {
        jour: 4,
        titre: `Prier avec des actions de grâces`,
        passageId: 'ph4',
        contexteImmediat: `La fin de la lettre aux Philippiens, écrite depuis une prison. Le « ne vous inquiétez de rien » vient de quelqu'un d'enchaîné.`,
        pistesObservation: {
          qui: `Paul écrit à une Église qui l'a soutenu financièrement. Le « Seigneur » est dit « proche ».`,
          ou: `Paul est en captivité ; ses lecteurs sont à Philippes, colonie romaine de Macédoine.`,
          comment: `Le v. 6 donne une méthode en trois éléments : prières, supplications, actions de grâces.`,
          quoi: `Notez ce qui est promis au v. 7 : la paix gardera le cœur, pas la disparition du problème.`,
        },
        interpretation: {
          destinataires: `Une Église inquiète pour son apôtre emprisonné devait apprendre à transformer l'inquiétude en requête.`,
          eglise: `Paul écrit depuis une prison, ce qui donne du poids à son « ne vous inquiétez de rien ». Sa méthode tient en une phrase : en toute chose, faire connaître ses besoins à Dieu, avec des actions de grâces. La gratitude n'est pas ici un supplément poli ; elle empêche la prière de devenir une liste de plaintes. Et la promesse ne porte pas sur la résolution du problème mais sur la garde du cœur : la paix de Dieu « gardera » — un terme militaire, celui d'une sentinelle. Le problème peut rester ; le cœur, lui, est tenu.`,
        },
        pistesApplication: {
          promesse: `V. 7 : la paix de Dieu comme sentinelle du cœur.`,
          commandement: `V. 6 : faire connaître ses besoins à Dieu.`,
          defi: `Pour chaque demande formulée aujourd'hui, ajouter un merci.`,
        },
        questionsApprofondissement: [
          `Vos prières ressemblent-elles plus à des plaintes ou à des remerciements ?`,
          `Quel besoin précis pouvez-vous nommer aujourd'hui ?`,
          `De quoi remercierez-vous en même temps ?`,
        ],
        versetMemoire: { ref: `Philippiens 4:6`, texte: `Ne vous inquiétez de rien; mais en toute chose faites connaître vos besoins à Dieu par des prières et des supplications, avec des actions de grâces.` },
        engagementPropose: `Pour chaque demande formulée aujourd'hui, ajoutez un merci.`,
        priere: `Seigneur, voici mon souci, et voici ce dont je te remercie. Que ta paix garde mon cœur et mes pensées. Amen.`,
      },
      {
        jour: 5,
        titre: `Confesser et être lavé`,
        passageId: '1jn1',
        contexteImmediat: `L'ouverture de la lettre, après une crise qui a divisé la communauté. Jean pose d'abord ce que Dieu est.`,
        pistesObservation: {
          qui: `« Nous » désigne les apôtres puis tous les croyants. Dieu est décrit comme lumière.`,
          comment: `Le passage alterne « si nous disons » et « si nous ». Comptez ces hypothèses.`,
          pourquoi: `Le v. 8 explique le danger de la dissimulation : se séduire soi-même.`,
          quoi: `Relevez ce qui est promis au v. 9, et sur quoi cela repose : « il est fidèle et juste ».`,
        },
        interpretation: {
          destinataires: `Des croyants troublés par ceux qui prétendaient être sans péché devaient retrouver la voie simple de la confession.`,
          eglise: `La confession n'est pas un exercice d'auto-flagellation : c'est cesser de faire semblant. Jean est direct — prétendre n'avoir pas de péché, c'est se tromper soi-même. Mais la promesse du verset 9 est aussi surprenante que ferme : Dieu est « fidèle et juste » pour pardonner. Fidèle, parce qu'il a promis ; juste, parce que le prix a été payé. Le pardon ne dépend donc pas de l'intensité de vos regrets ni de la qualité de votre formulation. Il dépend de son caractère. C'est ce qui permet de venir sans se cacher.`,
        },
        pistesApplication: {
          promesse: `V. 9 : le pardon et la purification.`,
          condition: `Confesser ses péchés.`,
          defi: `Faire une confession écrite, puis détruire la feuille en signe de pardon reçu.`,
        },
        questionsApprofondissement: [
          `Qu'est-ce que vous n'avez encore jamais dit à Dieu ?`,
          `Confondez-vous confession et culpabilité prolongée ?`,
          `Que signifierait « marcher dans la lumière » cette semaine ?`,
        ],
        versetMemoire: { ref: `1 Jean 1:9`, texte: `Si nous confessons nos péchés, il est fidèle et juste pour nous les pardonner, et pour nous purifier de toute iniquité.` },
        engagementPropose: `Faites une confession écrite, puis détruisez la feuille en signe de pardon reçu.`,
        priere: `Seigneur, je te dis ce que je préférerais taire. Merci d'être fidèle et juste. Purifie-moi, et fais-moi marcher dans ta lumière. Amen.`,
      },
      {
        jour: 6,
        titre: `Prier dans le combat`,
        passageId: 'ep6',
        contexteImmediat: `La conclusion de l'épître aux Éphésiens : l'armure de Dieu, qui se termine non par une arme mais par la prière.`,
        pistesObservation: {
          qui: `Paul, ses lecteurs, et des adversaires qui ne sont pas humains. Notez le v. 12.`,
          comment: `Chaque pièce est nommée avec ce qu'elle représente. Relevez les six correspondances.`,
          pourquoi: `Le v. 11 donne le but : « tenir ferme contre les ruses du diable ».`,
          quoi: `Notez que toutes les pièces sont reçues : aucune n'est fabriquée par le croyant.`,
        },
        interpretation: {
          destinataires: `Des chrétiens d'Asie Mineure, entourés de cultes et de pressions, devaient savoir contre quoi ils luttaient réellement.`,
          eglise: `L'armure de Dieu se termine par ce qui n'est pas une pièce d'équipement : la prière. « Faites en tout temps par l'Esprit toutes sortes de prières. » C'est la manière dont l'armure se porte. Remarquez aussi que chaque pièce est reçue, aucune n'est fabriquée : la vérité, la justice, la paix, la foi, le salut, la Parole. Et le combat n'est pas dirigé contre des personnes — « ni la chair ni le sang ». Cela change tout quand un conflit devient personnel : votre adversaire réel n'est pas en face de vous.`,
        },
        pistesApplication: {
          commandement: `V. 18 : prier en tout temps, y compris pour les autres.`,
          erreur: `Prendre un conflit pour une affaire de personnes.`,
          defi: `Prier nommément pour quelqu'un avec qui vous êtes en conflit.`,
        },
        questionsApprofondissement: [
          `Quel conflit prenez-vous pour une affaire de personnes ?`,
          `Quelle pièce de l'armure vous manque en ce moment ?`,
          `Pour qui d'autre êtes-vous appelé à prier dans ce combat ?`,
        ],
        versetMemoire: { ref: `Éphésiens 6:18`, texte: `Faites en tout temps par l'Esprit toutes sortes de prières et de supplications.` },
        engagementPropose: `Priez nommément pour quelqu'un avec qui vous êtes en conflit.`,
        priere: `Seigneur, fortifie-moi dans ta force. Je revêts ta vérité, ta justice, ta paix. Et je prie pour ceux que je serais tenté de combattre. Amen.`,
      },
      {
        jour: 7,
        titre: `Attendre en silence`,
        passageId: 'lm3',
        contexteImmediat: `Au milieu des ruines de Jérusalem, l'auteur décrit une forme de prière rarement pratiquée : le silence.`,
        pistesObservation: {
          qui: `Un homme parle à son âme au v. 24. Notez qu'il se donne à lui-même une raison d'espérer.`,
          quand: `Le v. 23 situe le renouvellement : chaque matin.`,
          comment: `Repérez l'ordre : d'abord ce qu'il sait de Dieu, ensuite ce qu'il décide.`,
          quoi: `Le v. 26 nomme deux attitudes : attendre, et se taire.`,
        },
        interpretation: {
          destinataires: `Des survivants sans mots devaient apprendre que l'attente silencieuse est encore une prière.`,
          eglise: `Le dernier jour de ce plan propose l'aspect le moins pratiqué de la prière : le silence. « Il est bon d'attendre en silence le secours de l'Éternel. » Ce n'est pas un vide, mais une attente habitée. Beaucoup d'entre nous parlent à Dieu sans jamais lui laisser un espace pour répondre — non pas qu'il faille attendre une voix, mais parce que le silence laisse remonter ce qui compte vraiment. Jérémie le pratique au milieu des ruines : le silence n'est pas réservé aux jours calmes. Il est parfois la seule prière possible.`,
        },
        pistesApplication: {
          commandement: `V. 26 : attendre en silence le secours de l'Éternel.`,
          defi: `Rester cinq minutes en silence, sans rien demander. Utilisez le minuteur de méditation.`,
        },
        questionsApprofondissement: [
          `Quand avez-vous, pour la dernière fois, prié sans parler ?`,
          `Qu'est-ce qui remonte quand vous vous taisez ?`,
          `Qu'est-ce que vous attendez de Dieu en ce moment ?`,
        ],
        versetMemoire: { ref: `Lamentations 3:26`, texte: `Il est bon d'attendre en silence Le secours de l'Éternel.` },
        engagementPropose: `Restez cinq minutes en silence, sans rien demander. Utilisez le minuteur de méditation.`,
        priere: `Seigneur, je me tais. J'attends ton secours. Que ton silence me soit une présence et non une absence. Amen.`,
      },
    ],
  },
  {
    id: 'esprit',
    titre: `Marcher par l'Esprit`,
    sousTitre: '7 jours sur la vie transformée',
    description: `Ce que Dieu fait grandir en nous, et comment lui laisser la place. Un plan sur le fruit de l'Esprit et la sainteté quotidienne.`,
    symbole: '❖',
    niveau: 'Approfondissement',
    themes: ['esprit', 'fruit', 'sanctification'],
    jours: [
      {
        jour: 1,
        titre: `Deux désirs`,
        passageId: 'ga5',
        versets: [16, 17, 18],
        contexteImmediat: `Paul écrit à des Églises tentées de revenir à la Loi. Il décrit ici le conflit intérieur du croyant.`,
        pistesObservation: {
          qui: `Paul et ses lecteurs. Deux forces sont personnifiées : la chair et l'Esprit.`,
          comment: `Le v. 17 décrit une opposition réciproque. Notez que Paul ne s'en étonne pas.`,
          pourquoi: `Le v. 18 tire la conséquence : conduits par l'Esprit, vous n'êtes plus sous la loi.`,
          quoi: `Relevez la consigne principale : « marchez selon l'Esprit ». C'est un verbe de direction.`,
        },
        interpretation: {
          destinataires: `Des Galates tentés par un retour aux règles devaient comprendre que la sainteté ne vient pas d'un code, mais d'une conduite.`,
          eglise: `Paul décrit une expérience que tout croyant reconnaît : deux désirs qui tirent en sens contraire. Il ne s'en étonne pas et ne culpabilise personne — c'est la condition normale de celui qui a l'Esprit. La consigne n'est pas « luttez plus » mais « marchez selon l'Esprit ». La marche est une image de direction et de rythme, pas d'effort héroïque. On ne gagne pas ce combat en se concentrant sur ce qu'il faut éviter ; on le gagne en suivant quelqu'un. Le verset 18 en tire une liberté : conduits par l'Esprit, vous n'êtes plus sous le régime de la loi.`,
        },
        pistesApplication: {
          commandement: `V. 16 : marcher selon l'Esprit.`,
          defi: `Avant chaque décision aujourd'hui, se demander : est-ce que je suis, ou est-ce que je fuis ?`,
        },
        questionsApprofondissement: [
          `Quels sont, en ce moment, vos deux désirs contraires ?`,
          `Essayez-vous de gagner ce combat par la volonté seule ?`,
          `Que serait « marcher », concrètement, aujourd'hui ?`,
        ],
        versetMemoire: { ref: `Galates 5:16`, texte: `Marchez selon l'Esprit, et vous n'accomplirez pas les désirs de la chair.` },
        engagementPropose: `Avant chaque décision aujourd'hui, demandez : est-ce que je suis, ou est-ce que je fuis ?`,
        priere: `Esprit Saint, conduis-moi. Je ne veux pas seulement éviter le mal, je veux te suivre. Donne-moi ton rythme. Amen.`,
      },
      {
        jour: 2,
        titre: `Le fruit, pas les résultats`,
        passageId: 'ga5',
        versets: [22, 23, 24, 25],
        contexteImmediat: `La suite immédiate : après les œuvres de la chair, Paul décrit ce que l'Esprit produit.`,
        pistesObservation: {
          qui: `L'Esprit est le sujet implicite : c'est son fruit, pas le nôtre.`,
          comment: `Le v. 24 emploie le passé : « ont crucifié ». Le v. 25 emploie le présent : « marchons ».`,
          pourquoi: `Le v. 23 conclut : « la loi n'est pas contre ces choses ».`,
          quoi: `Notez le singulier : « le fruit », et non « les fruits ». Comptez les neuf réalités.`,
        },
        interpretation: {
          destinataires: `Des croyants qui mesuraient la piété à l'observance devaient apprendre à la reconnaître à ce qui pousse.`,
          eglise: `Paul ne parle pas des « fruits » au pluriel mais du fruit, au singulier : un seul ensemble, neuf facettes. On ne choisit pas d'avoir la patience et de laisser la douceur. Et surtout, un fruit ne se fabrique pas — il pousse là où il y a de la sève, du temps et une saison. Cela devrait soulager ceux qui essaient de produire de la joie ou de la paix par un effort de volonté. Votre travail consiste à rester attaché ; la maturation est l'affaire de Dieu. Le verset 25 conclut avec justesse : si nous vivons par l'Esprit, marchons aussi selon l'Esprit — la source et le rythme doivent coïncider.`,
        },
        pistesApplication: {
          exemple: `Le fruit se cultive et se reçoit ; il ne se fabrique pas.`,
          defi: `Choisir une facette du fruit et la demander chaque matin cette semaine.`,
        },
        questionsApprofondissement: [
          `Laquelle des neuf réalités mûrit le plus lentement chez vous ?`,
          `Où essayez-vous de fabriquer ce qui devrait pousser ?`,
          `Qu'est-ce qui, dans votre vie, prive la sève de circuler ?`,
        ],
        versetMemoire: { ref: `Galates 5:22`, texte: `Mais le fruit de l'Esprit, c'est l'amour, la joie, la paix, la patience, la bonté, la bénignité, la fidélité.` },
        engagementPropose: `Choisissez une facette du fruit et demandez-la chaque matin cette semaine.`,
        priere: `Esprit de Dieu, fais mûrir en moi ton fruit. Là où je force, apprends-moi la patience de la croissance. Amen.`,
      },
      {
        jour: 3,
        titre: `Un culte qui prend corps`,
        passageId: 'rm12',
        versets: [1, 2],
        contexteImmediat: `Le tournant de l'épître aux Romains. Le mot « donc » renvoie à onze chapitres sur la grâce reçue.`,
        pistesObservation: {
          qui: `Paul s'adresse à des frères ; le destinataire de l'offrande est Dieu.`,
          comment: `Le v. 2 oppose deux verbes : se conformer et être transformé. Le second est au passif.`,
          pourquoi: `Le v. 2 donne la finalité : discerner la volonté de Dieu.`,
          quoi: `Notez ce qui est offert : « vos corps », et non des intentions.`,
        },
        interpretation: {
          destinataires: `Des chrétiens vivant au cœur de l'Empire devaient apprendre à ne pas se laisser modeler par leur milieu.`,
          eglise: `Le mot « donc » du verset 1 renvoie à onze chapitres de grâce : c'est parce que tout a été reçu que la vie peut être offerte. Et ce qui est offert est le corps — c'est-à-dire l'agenda, la fatigue, la sexualité, le travail, les gestes. Pas une spiritualité désincarnée. Le verset 2 identifie ensuite le lieu de la transformation : l'intelligence, ce qui nous forme sans qu'on y prête attention. Nous sommes façonnés par ce que nous regardons, écoutons et répétons. La question n'est pas de savoir si vous êtes influencé, mais par quoi.`,
        },
        pistesApplication: {
          commandement: `V. 1 : offrir son corps comme un sacrifice vivant.`,
          defi: `Retirer une source d'influence pendant 24 h, et la remplacer par la lecture d'un psaume.`,
        },
        questionsApprofondissement: [
          `Qu'est-ce qui façonne réellement votre pensée cette semaine ?`,
          `Quelle part de votre corps ou de votre temps n'est pas encore offerte ?`,
          `Où vous conformez-vous par simple habitude ?`,
        ],
        versetMemoire: { ref: `Romains 12:1`, texte: `offrir vos corps comme un sacrifice vivant, saint, agréable à Dieu, ce qui sera de votre part un culte raisonnable.` },
        engagementPropose: `Retirez une source d'influence pendant 24 h et remplacez-la par la lecture d'un psaume.`,
        priere: `Seigneur, je t'offre mon corps et mon temps. Renouvelle mon intelligence, pour que je discerne ce qui est bon et agréable. Amen.`,
      },
      {
        jour: 4,
        titre: `Demeurer pour porter du fruit`,
        passageId: 'jn15',
        versets: [1, 2, 3, 4, 5],
        contexteImmediat: `Toujours la nuit de l'arrestation. L'image de la vigne éclaire ce que Paul appellera le fruit de l'Esprit.`,
        pistesObservation: {
          qui: `Le Père vigneron, Jésus le cep, les disciples sarments.`,
          comment: `Deux gestes du vigneron au v. 2 : retrancher et émonder. Vérifiez sur quoi porte chacun.`,
          pourquoi: `Le v. 5 donne la raison : « sans moi vous ne pouvez rien faire ».`,
          quoi: `Comptez les occurrences de « demeurer » et notez ce qui en dépend.`,
        },
        interpretation: {
          destinataires: `Des disciples sur le point d'être seuls devaient savoir que la fécondité dépendait du lien, non de l'effort.`,
          eglise: `Deux images se répondent dans ce plan : le fruit de l'Esprit chez Paul, le sarment chez Jean. Même logique. Mais Jean ajoute un élément difficile : l'émondage. Le vigneron coupe aussi ce qui porte du fruit, afin qu'il en porte davantage. Autrement dit, certaines pertes ne sont pas des punitions mais des tailles. C'est une grille de lecture à manier avec délicatesse — on ne l'impose pas à quelqu'un qui souffre — mais elle console parfois : ce qui a été retiré n'était pas forcément mauvais, simplement dispersant.`,
        },
        pistesApplication: {
          condition: `V. 4 : demeurer pour porter du fruit.`,
          defi: `Supprimer un engagement de votre semaine et donner ce temps à la prière.`,
        },
        questionsApprofondissement: [
          `Qu'est-ce qui vous a été retiré et que vous pleurez encore ?`,
          `Qu'est-ce qui disperse votre énergie spirituelle aujourd'hui ?`,
          `À quoi ressemblerait, chez vous, « demeurer » une semaine entière ?`,
        ],
        versetMemoire: { ref: `Jean 15:4`, texte: `Demeurez en moi, et je demeurerai en vous.` },
        engagementPropose: `Supprimez un engagement de votre semaine et donnez ce temps à la prière.`,
        priere: `Père vigneron, taille en moi ce qui disperse. Jésus, je veux demeurer en toi plus que produire pour toi. Amen.`,
      },
      {
        jour: 5,
        titre: `Prompt à écouter`,
        passageId: 'jc1b',
        contexteImmediat: `Jacques donne un test très concret de la vie spirituelle : écouter, parler, se mettre en colère.`,
        pistesObservation: {
          qui: `Jacques écrit à des frères. L'homme au miroir sert de contre-exemple.`,
          comment: `Trois consignes brèves au v. 19, puis une comparaison développée.`,
          pourquoi: `Le v. 20 justifie la consigne : la colère de l'homme n'accomplit pas la justice de Dieu.`,
          quoi: `Notez ce que fait l'homme du v. 24 : il regarde, il s'en va, il oublie.`,
        },
        interpretation: {
          destinataires: `Des communautés où l'on parlait vite et mal devaient mesurer leur foi à des comportements observables.`,
          eglise: `Jacques donne un test très concret de la vie spirituelle : la manière dont nous écoutons, parlons et nous mettons en colère. Trois domaines observables, mesurables par notre entourage. « Lent à se mettre en colère » ne signifie pas ne jamais l'être : la colère a sa place, mais elle arrive trop vite et repart trop lentement. Puis vient l'image du miroir. Le problème n'est pas de mal voir, mais d'oublier en s'éloignant. La Parole demande un acte pour rester vivante — sinon elle devient une information de plus.`,
        },
        pistesApplication: {
          peche: `La colère prompte, et la parole qui devance l'écoute.`,
          commandement: `V. 22 : mettre en pratique.`,
          defi: `Dans une conversation aujourd'hui, écouter sans préparer sa réponse.`,
        },
        questionsApprofondissement: [
          `Êtes-vous plus prompt à écouter ou à répondre ?`,
          `Qu'est-ce qui déclenche votre colère le plus rapidement ?`,
          `Qu'avez-vous oublié de mettre en pratique ces dernières semaines ?`,
        ],
        versetMemoire: { ref: `Jacques 1:19`, texte: `que tout homme soit prompt à écouter, lent à parler, lent à se mettre en colère.` },
        engagementPropose: `Dans une conversation aujourd'hui, écoutez sans préparer votre réponse.`,
        priere: `Seigneur, rends-moi prompt à écouter et lent à réagir. Que ta parole ne reste pas une information chez moi. Amen.`,
      },
      {
        jour: 6,
        titre: `Marcher humblement`,
        passageId: 'mi6',
        contexteImmediat: `Un seul verset, écrit dans un contexte de religiosité intense et d'injustice sociale.`,
        pistesObservation: {
          qui: `L'Éternel s'adresse à « ô homme » — c'est-à-dire à tous, pas seulement aux prêtres.`,
          comment: `Le verset répond à une question posée juste avant sur les sacrifices à offrir.`,
          pourquoi: `Le contexte du chapitre explique pourquoi Dieu refuse les offrandes multipliées.`,
          quoi: `Relevez les trois verbes : pratiquer, aimer, marcher. Notez qu'ils ne se remplacent pas.`,
        },
        interpretation: {
          destinataires: `Un peuple qui multipliait les sacrifices tout en écrasant les pauvres devait entendre ce que Dieu demande réellement.`,
          eglise: `Un seul verset, et toute une éthique. Michée écrit dans un contexte de religiosité intense et d'injustice sociale : on multipliait les sacrifices tout en écrasant les pauvres. Sa réponse tient en trois verbes. Pratiquer la justice — c'est extérieur, cela concerne les autres. Aimer la miséricorde — c'est intérieur, cela concerne le cœur. Marcher humblement avec ton Dieu — c'est relationnel, et le mot « avec » suppose une compagnie, pas une performance solitaire. Aucun des trois ne peut remplacer les autres.`,
        },
        pistesApplication: {
          commandement: `Pratiquer la justice, aimer la miséricorde, marcher humblement.`,
          defi: `Poser un acte de justice concret : une dette réglée, une parole réparée, un don fait.`,
        },
        questionsApprofondissement: [
          `Lequel des trois verbes est le plus faible chez vous ?`,
          `Où votre pratique religieuse pourrait-elle masquer une injustice ?`,
          `Que veut dire « humblement » dans votre manière de croire ?`,
        ],
        versetMemoire: { ref: `Michée 6:8`, texte: `C'est que tu pratiques la justice, Que tu aimes la miséricorde, Et que tu marches humblement avec ton Dieu.` },
        engagementPropose: `Posez un acte de justice concret : une dette réglée, une parole réparée, un don fait.`,
        priere: `Éternel, apprends-moi à pratiquer la justice, à aimer la miséricorde, et à marcher humblement avec toi. Amen.`,
      },
      {
        jour: 7,
        titre: `Tout ce qui est vrai`,
        passageId: 'ph4',
        contexteImmediat: `La conclusion de la lettre : Paul termine par une hygiène de la pensée.`,
        pistesObservation: {
          qui: `Paul écrit à des « frères » ; il se donne lui-même en exemple au v. 9.`,
          comment: `Le v. 9 passe de la pensée à la pratique. Repérez ce déplacement.`,
          pourquoi: `La promesse finale motive l'ensemble : « et le Dieu de paix sera avec vous ».`,
          quoi: `Comptez les qualités énumérées au v. 8. Notez qu'elles concernent l'objet de la pensée.`,
        },
        interpretation: {
          destinataires: `Une Église inquiète devait apprendre à orienter son attention plutôt qu'à lutter contre ses pensées.`,
          eglise: `Paul termine son épître par une hygiène de la pensée. Il ne demande pas d'ignorer le réel, mais d'orienter l'attention : ce qui est vrai, honorable, juste, pur, aimable. Dans un monde où nous consommons chaque jour des heures de contenus choisis par d'autres, cette liste est presque subversive. Et Paul ne s'arrête pas à la pensée : « ce que vous avez appris, pratiquez-le ». Le plan se referme donc sur la même exigence que Jacques. La vie de l'Esprit n'est pas d'abord une expérience intérieure : c'est une manière de penser, puis de faire.`,
        },
        pistesApplication: {
          exemple: `V. 9 : pratiquer ce qui a été appris, reçu, entendu et vu.`,
          commandement: `V. 8 : choisir l'objet de ses pensées.`,
          defi: `Noter ce que vous voulez donner à votre attention cette semaine, et une chose à retirer.`,
        },
        questionsApprofondissement: [
          `À quoi votre attention est-elle allée ces dernières 24 heures ?`,
          `Quel élément de la liste de Paul manque le plus à votre régime mental ?`,
          `Quelle chose apprise dans ce plan allez-vous pratiquer ?`,
        ],
        versetMemoire: { ref: `Philippiens 4:8`, texte: `que tout ce qui est vrai, tout ce qui est honorable, tout ce qui est juste, tout ce qui est pur... soit l'objet de vos pensées.` },
        engagementPropose: `Notez ce que vous voulez donner à votre attention cette semaine, et une chose à retirer.`,
        priere: `Dieu de paix, je choisis de tourner mes pensées vers ce qui est vrai et digne de louange. Que ta paix garde mon cœur. Amen.`,
      },
    ],
  },
];

export const plansById: Record<string, PlanEtude> = Object.fromEntries(
  plans.map((p) => [p.id, p]),
);

export function getPlan(id: string): PlanEtude | undefined {
  return plansById[id];
}

export function getJour(planId: string, jour: number): JourEtude | undefined {
  return plansById[planId]?.jours.find((j) => j.jour === jour);
}

export const totalJoursDisponibles = plans.reduce((n, p) => n + p.jours.length, 0);
