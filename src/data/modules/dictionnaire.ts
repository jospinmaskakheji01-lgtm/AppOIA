/**
 * Dictionnaire biblique de départ.
 *
 * Ces notices sont écrites pour l'application (source `lumiere-redaction`).
 * Elles servent d'amorce : quand un dictionnaire de référence sera ajouté,
 * ses définitions viendront s'ajouter aux mêmes entrées, chacune restant
 * attribuée à son ouvrage, et l'interface affichera les deux perspectives.
 *
 * Les numéros Strong ne sont indiqués que lorsqu'ils sont établis ; ils sont
 * omis plutôt que devinés.
 */

import { EntreeDictionnaire, ModuleConnaissance } from '../../knowledge/types';
import { sourcesParId, SOURCE_REDACTION } from '../sources';

type Brouillon = Omit<EntreeDictionnaire, 'definitions'> & { definition: string };

const brouillons: Brouillon[] = [
  {
    id: 'agape',
    terme: 'Amour',
    variantes: ['charité', 'agapè', 'agape'],
    categorie: 'concept',
    motsOriginaux: [
      { langue: 'grec', mot: 'ἀγάπη', translitteration: 'agapè', strong: 'G26', sensLitteral: `amour de bienveillance, qui veut le bien de l'autre` },
      { langue: 'hébreu', mot: 'חֶסֶד', translitteration: 'chesed', strong: 'H2617', sensLitteral: `bonté fidèle, loyauté d'alliance` },
    ],
    definition: `Dans le Nouveau Testament, l'amour désigné par « agapè » n'est pas d'abord un sentiment mais une orientation de la volonté : vouloir et faire le bien de l'autre, indépendamment de ce qu'il mérite. Louis Segond le traduit souvent par « charité ». L'Ancien Testament emploie « chesed » pour la bonté fidèle de Dieu envers son peuple, celle qui tient parce qu'une alliance a été conclue.`,
    references: [
      { livre: '1 Corinthiens', chapitre: 13, verset: 1, versetFin: 13 },
      { livre: '1 Jean', chapitre: 4, verset: 7, versetFin: 12 },
      { livre: 'Jean', chapitre: 15, verset: 9, versetFin: 12 },
      { livre: 'Romains', chapitre: 12, verset: 9 },
    ],
    entreesLiees: ['grace', 'alliance'],
    themes: ['amour', 'relations'],
  },
  {
    id: 'grace',
    terme: 'Grâce',
    variantes: ['charis', 'faveur'],
    categorie: 'concept',
    motsOriginaux: [
      { langue: 'grec', mot: 'χάρις', translitteration: 'charis', strong: 'G5485', sensLitteral: `faveur, don gratuit` },
    ],
    definition: `Faveur accordée sans contrepartie. Le mot grec « charis » appartient au vocabulaire du don : il désigne ce qui est offert, non ce qui est dû. Paul en fait le cœur de son exposé du salut — « c'est par la grâce que vous êtes sauvés, par le moyen de la foi » — en excluant explicitement toute idée de mérite.`,
    references: [
      { livre: 'Éphésiens', chapitre: 2, verset: 4, versetFin: 10 },
      { livre: '2 Corinthiens', chapitre: 12, verset: 9 },
      { livre: 'Jean', chapitre: 1, verset: 14 },
    ],
    entreesLiees: ['foi', 'salut'],
    themes: ['grâce', 'salut'],
  },
  {
    id: 'foi',
    terme: 'Foi',
    variantes: ['pistis', 'croire'],
    categorie: 'concept',
    motsOriginaux: [
      { langue: 'grec', mot: 'πίστις', translitteration: 'pistis', strong: 'G4102', sensLitteral: `confiance, fidélité` },
    ],
    definition: `Le mot grec « pistis » couvre à la fois la confiance que l'on accorde et la fidélité dont on fait preuve. La foi biblique n'est donc pas une adhésion intellectuelle à des propositions, mais une confiance dirigée vers quelqu'un de fiable. Hébreux 11:1 en donne la définition la plus ramassée : « une ferme assurance des choses qu'on espère, une démonstration de celles qu'on ne voit pas ».`,
    references: [
      { livre: 'Hébreux', chapitre: 11, verset: 1, versetFin: 6 },
      { livre: 'Romains', chapitre: 12, verset: 3 },
      { livre: 'Jacques', chapitre: 1, verset: 5, versetFin: 8 },
    ],
    entreesLiees: ['grace', 'esperance'],
    themes: ['foi'],
  },
  {
    id: 'esperance',
    terme: 'Espérance',
    variantes: ['elpis', 'espoir'],
    categorie: 'concept',
    motsOriginaux: [
      { langue: 'grec', mot: 'ἐλπίς', translitteration: 'elpis', strong: 'G1680', sensLitteral: `attente confiante` },
    ],
    definition: `L'espérance biblique n'est pas un optimisme sur l'avenir mais une attente fondée sur les promesses de Dieu. Elle se distingue de l'espoir ordinaire par son objet : ce n'est pas « les choses vont s'arranger », mais « Dieu tiendra parole ». Elle peut donc coexister avec le deuil, comme dans les Lamentations.`,
    references: [
      { livre: 'Lamentations', chapitre: 3, verset: 22, versetFin: 26 },
      { livre: 'Romains', chapitre: 12, verset: 12 },
      { livre: 'Jérémie', chapitre: 29, verset: 11 },
      { livre: '1 Corinthiens', chapitre: 13, verset: 13 },
    ],
    entreesLiees: ['foi', 'promesse'],
    themes: ['espérance'],
  },
  {
    id: 'paix',
    terme: 'Paix',
    variantes: ['shalom', 'eirènè'],
    categorie: 'concept',
    motsOriginaux: [
      { langue: 'hébreu', mot: 'שָׁלוֹם', translitteration: 'shalom', strong: 'H7965', sensLitteral: `plénitude, intégrité, bien-être` },
      { langue: 'grec', mot: 'εἰρήνη', translitteration: 'eirènè', sensLitteral: `paix, concorde` },
    ],
    definition: `« Shalom » dit beaucoup plus que l'absence de conflit : c'est l'état de ce qui est entier, ajusté, en bon ordre — santé, justice, relations réconciliées. Quand Jésus dit « je vous laisse la paix », il n'annonce pas la fin des difficultés mais une plénitude qui ne dépend pas des circonstances.`,
    references: [
      { livre: 'Jean', chapitre: 14, verset: 27 },
      { livre: 'Philippiens', chapitre: 4, verset: 6, versetFin: 7 },
      { livre: 'Colossiens', chapitre: 3, verset: 15 },
      { livre: 'Michée', chapitre: 6, verset: 8 },
    ],
    entreesLiees: ['justice'],
    themes: ['paix'],
  },
  {
    id: 'peche',
    terme: 'Péché',
    variantes: ['hamartia', 'faute', 'transgression'],
    categorie: 'concept',
    motsOriginaux: [
      { langue: 'grec', mot: 'ἁμαρτία', translitteration: 'hamartia', strong: 'G266', sensLitteral: `manquer le but` },
      { langue: 'hébreu', mot: 'חַטָּאת', translitteration: 'chattath', sensLitteral: `manquement, faute` },
    ],
    definition: `Le mot grec « hamartia » vient du vocabulaire du tir : manquer la cible. Le péché n'est donc pas d'abord la transgression d'une règle, mais l'échec à atteindre ce pour quoi l'homme est fait — la relation avec Dieu. Ésaïe 53:6 en donne l'image : « chacun suivait sa propre voie ».`,
    references: [
      { livre: 'Ésaïe', chapitre: 53, verset: 6 },
      { livre: '1 Jean', chapitre: 1, verset: 8, versetFin: 9 },
      { livre: 'Psaumes', chapitre: 51, verset: 5 },
    ],
    entreesLiees: ['repentance', 'pardon'],
    themes: ['péché', 'repentance'],
  },
  {
    id: 'repentance',
    terme: 'Repentance',
    variantes: ['metanoia', 'conversion', 'se repentir'],
    categorie: 'concept',
    motsOriginaux: [
      { langue: 'grec', mot: 'μετάνοια', translitteration: 'metanoia', strong: 'G3341', sensLitteral: `changement d'intelligence, retournement de la pensée` },
      { langue: 'hébreu', mot: 'שׁוּב', translitteration: 'shouv', sensLitteral: `revenir, faire demi-tour` },
    ],
    definition: `Deux images se complètent. L'hébreu « shouv » est spatial : faire demi-tour et revenir. Le grec « metanoia » est mental : changer de manière de penser. La repentance biblique n'est donc ni le remords ni la honte, mais un retournement qui engage la pensée et la marche.`,
    references: [
      { livre: 'Psaumes', chapitre: 51, verset: 12, versetFin: 14 },
      { livre: 'Luc', chapitre: 15, verset: 17, versetFin: 20 },
      { livre: 'Ésaïe', chapitre: 55, verset: 6, versetFin: 7 },
    ],
    entreesLiees: ['peche', 'pardon'],
    themes: ['repentance', 'pardon'],
  },
  {
    id: 'pardon',
    terme: 'Pardon',
    variantes: ['aphesis', 'remettre', 'pardonner'],
    categorie: 'concept',
    motsOriginaux: [
      { langue: 'grec', mot: 'ἄφεσις', translitteration: 'aphesis', sensLitteral: `renvoi, libération, remise de dette` },
    ],
    definition: `Le terme grec appartient au vocabulaire juridique et commercial : on « remet » une dette, on « renvoie » une charge. Pardonner n'est donc pas nier l'offense mais cesser d'en réclamer le paiement. Le Notre Père lie les deux mouvements dans la même phrase : recevoir et accorder.`,
    references: [
      { livre: 'Matthieu', chapitre: 6, verset: 12, versetFin: 15 },
      { livre: 'Colossiens', chapitre: 3, verset: 13 },
      { livre: 'Psaumes', chapitre: 103, verset: 12 },
      { livre: '1 Jean', chapitre: 1, verset: 9 },
    ],
    entreesLiees: ['repentance', 'grace'],
    themes: ['pardon'],
  },
  {
    id: 'alliance',
    terme: 'Alliance',
    variantes: ['berith', 'diathèkè', 'testament'],
    categorie: 'concept',
    motsOriginaux: [
      { langue: 'hébreu', mot: 'בְּרִית', translitteration: 'berith', strong: 'H1285', sensLitteral: `pacte, engagement solennel` },
      { langue: 'grec', mot: 'διαθήκη', translitteration: 'diathèkè', sensLitteral: `disposition, testament` },
    ],
    definition: `L'alliance est l'engagement par lequel Dieu se lie à un peuple. Elle structure toute la Bible : alliance avec Noé, avec Abraham, au Sinaï, puis l'alliance nouvelle annoncée par Jérémie et rapportée par le Nouveau Testament à la mort du Christ. Le mot « testament », dans « Ancien » et « Nouveau Testament », traduit ce même terme.`,
    references: [
      { livre: 'Jérémie', chapitre: 29, verset: 11, versetFin: 13 },
      { livre: 'Ésaïe', chapitre: 43, verset: 1 },
    ],
    entreesLiees: ['grace', 'promesse'],
    themes: ['alliance'],
  },
  {
    id: 'esprit',
    terme: 'Esprit',
    variantes: ['ruach', 'pneuma', 'Saint-Esprit', 'souffle'],
    categorie: 'concept',
    motsOriginaux: [
      { langue: 'hébreu', mot: 'רוּחַ', translitteration: 'rouach', strong: 'H7307', sensLitteral: `souffle, vent, esprit` },
      { langue: 'grec', mot: 'πνεῦμα', translitteration: 'pneuma', strong: 'G4151', sensLitteral: `souffle, vent, esprit` },
    ],
    definition: `Dans les deux langues, le même mot dit le vent, le souffle et l'esprit. C'est l'Esprit de Dieu qui « se meut au-dessus des eaux » en Genèse 1:2, et c'est lui que Jésus promet à ses disciples. Cette polysémie n'est pas une ambiguïté : elle dit une présence qu'on ne voit pas mais dont on constate les effets.`,
    references: [
      { livre: 'Genèse', chapitre: 1, verset: 2 },
      { livre: 'Galates', chapitre: 5, verset: 16, versetFin: 25 },
      { livre: 'Luc', chapitre: 11, verset: 13 },
      { livre: 'Psaumes', chapitre: 51, verset: 13 },
    ],
    entreesLiees: ['fruit-esprit'],
    themes: ['esprit'],
  },
  {
    id: 'fruit-esprit',
    terme: `Fruit de l'Esprit`,
    variantes: ['fruit'],
    categorie: 'concept',
    motsOriginaux: [
      { langue: 'grec', mot: 'καρπός', translitteration: 'karpos', sensLitteral: `fruit, récolte` },
    ],
    definition: `Paul emploie le singulier : « le fruit de l'Esprit » n'est pas une liste de vertus à cultiver séparément mais un ensemble unique à neuf facettes — amour, joie, paix, patience, bonté, bénignité, fidélité, douceur, tempérance. Le choix du mot « fruit », opposé aux « œuvres » de la chair, indique une croissance reçue plutôt qu'une production.`,
    references: [{ livre: 'Galates', chapitre: 5, verset: 22, versetFin: 23 }],
    entreesLiees: ['esprit'],
    themes: ['esprit', 'fruit'],
  },
  {
    id: 'justice',
    terme: 'Justice',
    variantes: ['dikaiosunè', 'tsedaqah', 'justifier'],
    categorie: 'concept',
    motsOriginaux: [
      { langue: 'grec', mot: 'δικαιοσύνη', translitteration: 'dikaiosunè', strong: 'G1343' },
      { langue: 'hébreu', mot: 'צְדָקָה', translitteration: 'tsedaqah', sensLitteral: `justice, droiture, fidélité à la relation` },
    ],
    definition: `La justice biblique est relationnelle avant d'être judiciaire : elle désigne la conformité à ce qu'exige une relation juste, envers Dieu comme envers le prochain. Michée 6:8 la met en tête de ce que Dieu demande. Chez Paul, « être justifié » signifie être déclaré juste par Dieu, non sur la base de ses actes mais de la foi.`,
    references: [
      { livre: 'Michée', chapitre: 6, verset: 8 },
      { livre: 'Matthieu', chapitre: 5, verset: 6 },
      { livre: 'Romains', chapitre: 8, verset: 33 },
    ],
    entreesLiees: ['paix', 'grace'],
    themes: ['justice'],
  },
  {
    id: 'royaume',
    terme: 'Royaume de Dieu',
    variantes: ['royaume des cieux', 'basileia', 'règne'],
    categorie: 'concept',
    motsOriginaux: [
      { langue: 'grec', mot: 'βασιλεία', translitteration: 'basileia', sensLitteral: `royauté, règne, domaine royal` },
    ],
    definition: `Le grec désigne d'abord l'exercice du règne, plus que le territoire. « Que ton règne vienne » demande donc que Dieu règne effectivement, ici. Matthieu écrit « royaume des cieux » là où Marc et Luc écrivent « royaume de Dieu » : c'est un usage juif évitant de prononcer le nom divin, non deux réalités différentes.`,
    references: [
      { livre: 'Matthieu', chapitre: 6, verset: 10 },
      { livre: 'Matthieu', chapitre: 6, verset: 33 },
      { livre: 'Matthieu', chapitre: 5, verset: 3 },
    ],
    entreesLiees: ['evangile'],
    themes: ['royaume'],
  },
  {
    id: 'evangile',
    terme: 'Évangile',
    variantes: ['euangelion', 'bonne nouvelle'],
    categorie: 'concept',
    motsOriginaux: [
      { langue: 'grec', mot: 'εὐαγγέλιον', translitteration: 'euangelion', strong: 'G2098', sensLitteral: `bonne nouvelle` },
    ],
    definition: `Le mot appartenait au vocabulaire impérial : on proclamait l'« évangile » d'une victoire ou de l'avènement d'un empereur. Le reprendre pour annoncer Jésus n'est pas neutre. Le terme désigne le message avant de désigner les quatre livres qui le racontent.`,
    references: [
      { livre: 'Jean', chapitre: 3, verset: 16, versetFin: 17 },
      { livre: 'Matthieu', chapitre: 28, verset: 18, versetFin: 20 },
    ],
    entreesLiees: ['royaume', 'salut'],
    themes: ['évangile', 'mission'],
  },
  {
    id: 'salut',
    terme: 'Salut',
    variantes: ['sôtèria', 'sauver', 'délivrance'],
    categorie: 'concept',
    motsOriginaux: [
      { langue: 'grec', mot: 'σωτηρία', translitteration: 'sôtèria', strong: 'G4991', sensLitteral: `délivrance, préservation, guérison` },
      { langue: 'hébreu', mot: 'יְשׁוּעָה', translitteration: 'yeshouah', sensLitteral: `délivrance` },
    ],
    definition: `Le champ du mot est large : être sauvé, c'est être tiré d'un danger, guéri, préservé. Le salut biblique n'est donc pas seulement une destination après la mort, mais une délivrance qui commence maintenant. Le nom « Jésus » — Yeshoua — est formé sur cette racine.`,
    references: [
      { livre: 'Éphésiens', chapitre: 2, verset: 8, versetFin: 9 },
      { livre: 'Jean', chapitre: 3, verset: 17 },
      { livre: 'Psaumes', chapitre: 27, verset: 1 },
    ],
    entreesLiees: ['grace', 'jesus'],
    themes: ['salut'],
  },
  {
    id: 'jesus',
    terme: 'Jésus',
    variantes: ['Yeshoua', 'Christ', 'Jésus-Christ'],
    categorie: 'personnage',
    motsOriginaux: [
      { langue: 'hébreu', mot: 'יֵשׁוּעַ', translitteration: 'Yeshoua', sensLitteral: `l'Éternel sauve` },
      { langue: 'grec', mot: 'Χριστός', translitteration: 'Christos', strong: 'G5547', sensLitteral: `oint` },
    ],
    definition: `« Jésus » est un nom propre, forme abrégée de Yehoshoua, « l'Éternel sauve ». « Christ » n'est pas un patronyme mais un titre : il traduit l'hébreu « Mashiach », l'oint — celui que Dieu a désigné et consacré. Dire « Jésus est le Christ » est donc une affirmation, pas une simple désignation.`,
    references: [
      { livre: 'Jean', chapitre: 1, verset: 14 },
      { livre: 'Jean', chapitre: 14, verset: 6 },
      { livre: 'Luc', chapitre: 8, verset: 25 },
    ],
    entreesLiees: ['salut', 'evangile'],
    themes: ['christologie'],
  },
  {
    id: 'parole',
    terme: 'Parole',
    variantes: ['logos', 'dabar', 'Verbe'],
    categorie: 'concept',
    motsOriginaux: [
      { langue: 'grec', mot: 'λόγος', translitteration: 'logos', strong: 'G3056', sensLitteral: `parole, discours, raison` },
      { langue: 'hébreu', mot: 'דָּבָר', translitteration: 'dabar', sensLitteral: `parole, chose, événement` },
    ],
    definition: `L'hébreu « dabar » signifie à la fois la parole et la chose : chez Dieu, dire et faire ne se séparent pas — « Dieu dit : que la lumière soit ; et la lumière fut ». Jean applique le grec « logos », déjà chargé de sens philosophique, à une personne : « la Parole a été faite chair ».`,
    references: [
      { livre: 'Genèse', chapitre: 1, verset: 3 },
      { livre: 'Jean', chapitre: 1, verset: 1, versetFin: 14 },
      { livre: 'Ésaïe', chapitre: 55, verset: 10, versetFin: 11 },
      { livre: 'Jacques', chapitre: 1, verset: 22 },
    ],
    entreesLiees: ['jesus'],
    themes: ['parole', 'création'],
  },
  {
    id: 'priere',
    terme: 'Prière',
    variantes: ['proseuchè', 'tefillah', 'prier'],
    categorie: 'concept',
    motsOriginaux: [
      { langue: 'grec', mot: 'προσευχή', translitteration: 'proseuchè' },
      { langue: 'hébreu', mot: 'תְּפִלָּה', translitteration: 'tefillah' },
    ],
    definition: `La prière biblique couvre un registre très large : louange, plainte, demande, silence, intercession. Les psaumes en donnent la mesure — un tiers d'entre eux sont des lamentations. Jésus l'enseigne en commençant par retirer le public, puis en donnant des mots peu nombreux.`,
    references: [
      { livre: 'Matthieu', chapitre: 6, verset: 5, versetFin: 15 },
      { livre: 'Luc', chapitre: 11, verset: 9, versetFin: 13 },
      { livre: 'Philippiens', chapitre: 4, verset: 6 },
      { livre: 'Éphésiens', chapitre: 6, verset: 18 },
    ],
    entreesLiees: ['notre-pere'],
    themes: ['prière'],
  },
  {
    id: 'notre-pere',
    terme: 'Notre Père',
    variantes: ['oraison dominicale', 'pater'],
    categorie: 'concept',
    motsOriginaux: [],
    definition: `Prière donnée par Jésus en réponse à la demande de ses disciples. Elle est construite en deux mouvements : trois demandes tournées vers Dieu (son nom, son règne, sa volonté), puis trois tournées vers nous (le pain du jour, le pardon, la protection). La doxologie finale — « car c'est à toi qu'appartiennent… » — figure dans Louis Segond ; elle est absente des manuscrits les plus anciens.`,
    references: [{ livre: 'Matthieu', chapitre: 6, verset: 9, versetFin: 13 }],
    entreesLiees: ['priere', 'pardon'],
    themes: ['prière'],
  },
  {
    id: 'beatitude',
    terme: 'Béatitude',
    variantes: ['makarios', 'heureux', 'bienheureux'],
    categorie: 'concept',
    motsOriginaux: [
      { langue: 'grec', mot: 'μακάριος', translitteration: 'makarios', sensLitteral: `heureux, bienheureux` },
    ],
    definition: `« Makarios » ne décrit pas un état affectif mais une condition objective : est heureux celui dont la situation est du bon côté de Dieu. C'est pourquoi Jésus peut déclarer heureux des affligés et des persécutés sans cynisme : il ne dit pas qu'ils se sentent bien, mais que le royaume leur appartient.`,
    references: [
      { livre: 'Matthieu', chapitre: 5, verset: 3, versetFin: 12 },
      { livre: 'Psaumes', chapitre: 1, verset: 1 },
    ],
    entreesLiees: ['royaume'],
    themes: ['béatitudes', 'royaume'],
  },
  {
    id: 'berger',
    terme: 'Berger',
    variantes: ['pasteur', 'poimèn', 'roeh'],
    categorie: 'concept',
    motsOriginaux: [
      { langue: 'grec', mot: 'ποιμήν', translitteration: 'poimèn' },
      { langue: 'hébreu', mot: 'רֹעֶה', translitteration: 'roeh' },
    ],
    definition: `Image royale autant que pastorale : dans tout le Proche-Orient ancien, le roi était appelé berger de son peuple. Dire « l'Éternel est mon berger » revient donc à reconnaître sa royauté en même temps que ses soins. Le mot français « pasteur » vient de cette image.`,
    references: [
      { livre: 'Psaumes', chapitre: 23, verset: 1, versetFin: 6 },
      { livre: 'Ésaïe', chapitre: 53, verset: 6 },
    ],
    entreesLiees: [],
    themes: ['confiance', 'consolation'],
  },
  {
    id: 'demeurer',
    terme: 'Demeurer',
    variantes: ['menô', 'rester', 'habiter'],
    categorie: 'terme',
    motsOriginaux: [
      { langue: 'grec', mot: 'μένω', translitteration: 'menô', sensLitteral: `rester, demeurer, tenir` },
    ],
    definition: `Verbe central du quatrième évangile, employé neuf fois dans les seuls douze premiers versets de Jean 15. Il n'indique pas une activité mais une permanence : rester attaché, ne pas se détacher. Le fruit en découle, il ne le précède pas.`,
    references: [{ livre: 'Jean', chapitre: 15, verset: 1, versetFin: 12 }],
    entreesLiees: ['fruit-esprit'],
    themes: ['demeurer', 'communion'],
  },
  {
    id: 'crainte',
    terme: 'Crainte de Dieu',
    variantes: ['yirah', 'phobos', 'craindre'],
    categorie: 'concept',
    motsOriginaux: [
      { langue: 'hébreu', mot: 'יִרְאָה', translitteration: 'yirah', sensLitteral: `crainte, respect` },
      { langue: 'grec', mot: 'φόβος', translitteration: 'phobos' },
    ],
    definition: `À distinguer de la peur. La crainte de Dieu désigne le respect qui reconnaît sa grandeur et ajuste la conduite en conséquence ; les Proverbes en font le commencement de la sagesse. 1 Jean 4:18 vise une autre crainte, celle du châtiment, que l'amour parfait bannit.`,
    references: [
      { livre: 'Proverbes', chapitre: 3, verset: 7 },
      { livre: '1 Jean', chapitre: 4, verset: 18 },
      { livre: 'Psaumes', chapitre: 103, verset: 11, versetFin: 13 },
    ],
    entreesLiees: ['sagesse'],
    themes: ['sagesse', 'peur'],
  },
  {
    id: 'sagesse',
    terme: 'Sagesse',
    variantes: ['chokmah', 'sophia'],
    categorie: 'concept',
    motsOriginaux: [
      { langue: 'hébreu', mot: 'חָכְמָה', translitteration: 'chokmah', sensLitteral: `habileté, savoir-faire` },
      { langue: 'grec', mot: 'σοφία', translitteration: 'sophia' },
    ],
    definition: `L'hébreu « chokmah » désigne d'abord l'habileté de l'artisan : la sagesse biblique est un savoir-faire pour vivre, non une spéculation. Elle se demande à Dieu, qui la donne « simplement et sans reproche ».`,
    references: [
      { livre: 'Proverbes', chapitre: 3, verset: 5, versetFin: 8 },
      { livre: 'Jacques', chapitre: 1, verset: 5 },
      { livre: 'Ecclésiaste', chapitre: 3, verset: 1 },
    ],
    entreesLiees: ['crainte'],
    themes: ['sagesse'],
  },
  {
    id: 'communion',
    terme: 'Communion',
    variantes: ['koinônia', 'partage', 'fraternité'],
    categorie: 'concept',
    motsOriginaux: [
      { langue: 'grec', mot: 'κοινωνία', translitteration: 'koinônia', strong: 'G2842', sensLitteral: `mise en commun, participation` },
    ],
    definition: `Le mot vient de « koinos », commun. Il désigne autant la communion spirituelle que le partage matériel — les deux sens coexistent dans le Nouveau Testament. Marcher dans la lumière produit, selon Jean, une communion mutuelle et non seulement individuelle.`,
    references: [
      { livre: '1 Jean', chapitre: 1, verset: 7 },
      { livre: 'Romains', chapitre: 12, verset: 13 },
    ],
    entreesLiees: ['demeurer', 'agape'],
    themes: ['communion', 'église'],
  },
  {
    id: 'eglise',
    terme: 'Église',
    variantes: ['ekklèsia', 'assemblée'],
    categorie: 'concept',
    motsOriginaux: [
      { langue: 'grec', mot: 'ἐκκλησία', translitteration: 'ekklèsia', strong: 'G1577', sensLitteral: `assemblée convoquée` },
    ],
    definition: `Le terme désignait dans les cités grecques l'assemblée des citoyens convoqués. Appliqué aux chrétiens, il désigne les personnes rassemblées, jamais le bâtiment. Paul lui préfère l'image du corps, dont chaque membre est nécessaire.`,
    references: [
      { livre: 'Colossiens', chapitre: 3, verset: 15 },
      { livre: 'Éphésiens', chapitre: 2, verset: 6 },
    ],
    entreesLiees: ['communion'],
    themes: ['église'],
  },
  {
    id: 'gloire',
    terme: 'Gloire',
    variantes: ['kavod', 'doxa'],
    categorie: 'concept',
    motsOriginaux: [
      { langue: 'hébreu', mot: 'כָּבוֹד', translitteration: 'kavod', sensLitteral: `poids, pesanteur, honneur` },
      { langue: 'grec', mot: 'δόξα', translitteration: 'doxa', strong: 'G1391' },
    ],
    definition: `L'hébreu « kavod » vient d'une racine signifiant « être lourd » : la gloire est ce qui a du poids, ce qui compte réellement. Glorifier Dieu, c'est donc lui reconnaître son poids véritable, et non lui ajouter quelque chose.`,
    references: [
      { livre: 'Matthieu', chapitre: 5, verset: 16 },
      { livre: 'Jean', chapitre: 1, verset: 14 },
      { livre: 'Romains', chapitre: 8, verset: 30 },
    ],
    entreesLiees: [],
    themes: ['louange'],
  },
  {
    id: 'theophile',
    terme: 'Théophile',
    variantes: ['Theophilos'],
    categorie: 'personnage',
    motsOriginaux: [
      { langue: 'grec', mot: 'Θεόφιλος', translitteration: 'Theophilos', sensLitteral: `ami de Dieu` },
    ],
    definition: `Destinataire de l'évangile de Luc et des Actes. Luc l'appelle « excellent », titre qui suggère un rang social ou administratif. Son nom signifie « ami de Dieu », ce qui a conduit certains à y voir un lecteur symbolique ; la mention d'un titre honorifique plaide plutôt pour une personne réelle.`,
    references: [{ livre: 'Luc', chapitre: 8, verset: 22 }],
    entreesLiees: [],
    themes: ['évangiles'],
  },
  {
    id: 'nicodeme',
    terme: 'Nicodème',
    variantes: ['Nikodèmos'],
    categorie: 'personnage',
    motsOriginaux: [
      { langue: 'grec', mot: 'Νικόδημος', translitteration: 'Nikodèmos', sensLitteral: `victoire du peuple` },
    ],
    definition: `Pharisien et membre du sanhédrin, il vient trouver Jésus de nuit — détail que Jean souligne, dans un évangile où la lumière et les ténèbres sont des thèmes majeurs. Il reparaît deux fois : pour demander un procès équitable, puis pour ensevelir Jésus.`,
    references: [{ livre: 'Jean', chapitre: 3, verset: 16, versetFin: 21 }],
    entreesLiees: [],
    themes: ['évangiles'],
  },
  {
    id: 'jerusalem',
    terme: 'Jérusalem',
    variantes: ['Yeroushalaïm', 'Sion', 'ville sainte'],
    categorie: 'lieu',
    motsOriginaux: [
      { langue: 'hébreu', mot: 'יְרוּשָׁלַיִם', translitteration: 'Yeroushalaïm' },
    ],
    definition: `Capitale du royaume de David, lieu du Temple, centre de la vie religieuse d'Israël. Sa destruction en 587 av. J.-C. est le contexte des Lamentations, celle de 70 apr. J.-C. l'arrière-plan probable de plusieurs écrits du Nouveau Testament. L'Apocalypse s'achève sur une Jérusalem nouvelle qui descend du ciel.`,
    references: [
      { livre: 'Lamentations', chapitre: 3, verset: 22, versetFin: 26 },
      { livre: 'Apocalypse', chapitre: 21, verset: 2 },
      { livre: 'Psaumes', chapitre: 121, verset: 1 },
    ],
    entreesLiees: [],
    themes: ['lieux'],
  },
  {
    id: 'epreuve',
    terme: 'Épreuve',
    variantes: ['peirasmos', 'tentation', 'tribulation'],
    categorie: 'concept',
    motsOriginaux: [
      { langue: 'grec', mot: 'πειρασμός', translitteration: 'peirasmos', sensLitteral: `mise à l'épreuve, tentation` },
    ],
    definition: `Le même mot grec dit l'épreuve qui éprouve et la tentation qui séduit — d'où la difficulté de traduire « ne nous induis pas en tentation ». Jacques distingue les deux : l'épreuve produit la patience, tandis que Dieu ne tente personne.`,
    references: [
      { livre: 'Jacques', chapitre: 1, verset: 2, versetFin: 4 },
      { livre: 'Matthieu', chapitre: 6, verset: 13 },
      { livre: '1 Pierre', chapitre: 5, verset: 9 },
    ],
    entreesLiees: ['foi'],
    themes: ['épreuve', 'patience'],
  },
];

const entrees: EntreeDictionnaire[] = brouillons.map(({ definition, ...reste }) => ({
  ...reste,
  definitions: [
    {
      texte: definition,
      sourceId: SOURCE_REDACTION,
      localisation: { article: reste.terme },
    },
  ],
}));

export const moduleDictionnaire: ModuleConnaissance = {
  id: 'dictionnaire-lumiere-v1',
  source: sourcesParId[SOURCE_REDACTION],
  entrees,
};
