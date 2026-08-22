/**
 * Modèle de la base de connaissances bibliques.
 *
 * Trois principes structurent ce fichier :
 *
 * 1. **Traçabilité** — toute connaissance porte l'identifiant de la source dont
 *    elle provient (`sourceId`) et, quand c'est possible, sa localisation dans
 *    l'ouvrage (page, article, section).
 * 2. **Séparation des natures** — le texte biblique, le contenu issu d'un
 *    ouvrage et l'interprétation produite par une IA sont trois catégories
 *    distinctes qui ne doivent jamais être confondues (voir `NatureContenu`).
 * 3. **Extensibilité** — la connaissance arrive par modules indépendants
 *    (`ModuleConnaissance`). Ajouter un ouvrage consiste à déposer un module et
 *    à l'enregistrer, sans toucher au reste de l'application.
 */

/** Ce qu'une information *est*, indépendamment de ce qu'elle dit. */
export type NatureContenu =
  /** Le texte biblique lui-même, dans une version donnée. */
  | 'texte-biblique'
  /** Le contenu d'un ouvrage : dictionnaire, commentaire, étude, enseignement. */
  | 'source-documentaire'
  /** Une synthèse produite par un modèle de langage. */
  | 'synthese-ia';

export type TypeSource =
  | 'bible'
  | 'dictionnaire'
  | 'commentaire'
  | 'etude'
  | 'theologie'
  | 'enseignement'
  | 'redaction-interne';

/**
 * Provenance d'une source, à titre purement documentaire.
 * Ce champ est facultatif et n'a aucun effet sur l'ingestion ni sur
 * l'affichage : il sert uniquement à qui veut noter d'où vient un ouvrage.
 */
export type Provenance =
  | 'domaine-public'
  | 'licence-libre'
  | 'sous-droits'
  | 'interne'
  | 'non-precisee';

export interface Source {
  id: string;
  titre: string;
  auteur?: string;
  editeur?: string;
  annee?: string;
  langue: string;
  type: TypeSource;
  /** Facultatif : provenance de l'ouvrage, pour mémoire. */
  provenance?: Provenance;
  /** Facultatif : note libre sur l'origine de l'ouvrage. */
  noteProvenance?: string;
  /** Nom du fichier d'origine, pour retrouver le document transmis. */
  documentOrigine?: string;
  ajouteLe: string;
  /** Abréviation affichée à côté des extraits, ex. « LSG », « DB ». */
  abreviation: string;
}

/** Où se trouve une information à l'intérieur de son ouvrage. */
export interface Localisation {
  page?: string;
  chapitre?: string;
  section?: string;
  article?: string;
}

/** Référence biblique normalisée. `versetFin` absent = un seul verset. */
export interface ReferenceBiblique {
  livre: string;
  chapitre: number;
  verset?: number;
  versetFin?: number;
}

// ————————————————————————————————————————————————————————————
// Dictionnaire
// ————————————————————————————————————————————————————————————

export type CategorieEntree =
  | 'terme'
  | 'personnage'
  | 'lieu'
  | 'objet'
  | 'evenement'
  | 'concept'
  | 'theme'
  | 'livre';

export type LangueOriginale = 'hébreu' | 'grec' | 'araméen';

export interface MotOriginal {
  langue: LangueOriginale;
  mot: string;
  translitteration: string;
  /** Numéro Strong, quand la source le fournit. */
  strong?: string;
  sensLitteral?: string;
}

export interface DefinitionEntree {
  /** Le texte de la définition, tel que la source le donne. */
  texte: string;
  sourceId: string;
  localisation?: Localisation;
  /** Nuance ou acception particulière, quand la source en distingue plusieurs. */
  nuance?: string;
}

export interface EntreeDictionnaire {
  id: string;
  terme: string;
  /** Formes alternatives : graphies, pluriels, synonymes, noms grecs ou latins. */
  variantes: string[];
  categorie: CategorieEntree;
  motsOriginaux: MotOriginal[];
  /**
   * Plusieurs définitions coexistent volontairement : quand deux ouvrages
   * divergent, les deux perspectives sont conservées avec leur source.
   */
  definitions: DefinitionEntree[];
  /** Passages où le terme ou la réalité apparaît. */
  references: ReferenceBiblique[];
  /** Identifiants d'autres entrées liées. */
  entreesLiees: string[];
  themes: string[];
}

// ————————————————————————————————————————————————————————————
// Commentaires
// ————————————————————————————————————————————————————————————

export type TypeCommentaire =
  | 'contexte'
  | 'historique'
  | 'theologique'
  | 'pratique'
  | 'linguistique'
  | 'structure';

export interface Commentaire {
  id: string;
  reference: ReferenceBiblique;
  /** Portée du commentaire, quand il couvre plusieurs versets. */
  referenceFin?: ReferenceBiblique;
  type: TypeCommentaire;
  titre?: string;
  texte: string;
  sourceId: string;
  localisation?: Localisation;
  /** Auteur du commentaire, s'il diffère de l'auteur de l'ouvrage. */
  auteur?: string;
  /**
   * Quand un passage reçoit plusieurs lectures, chacune est enregistrée
   * séparément et ce champ nomme la position défendue.
   */
  position?: string;
  themes: string[];
}

// ————————————————————————————————————————————————————————————
// Relations
// ————————————————————————————————————————————————————————————

export type TypeRelation =
  | 'citation'
  | 'accomplissement'
  | 'parallele'
  | 'contraste'
  | 'developpement'
  | 'allusion'
  | 'theme-commun';

export interface ReferenceCroisee {
  id: string;
  de: ReferenceBiblique;
  vers: ReferenceBiblique;
  relation: TypeRelation;
  note?: string;
  sourceId: string;
}

export interface ThemeBiblique {
  id: string;
  nom: string;
  description: string;
  /** Termes-clés du thème, servant la recherche. */
  motsCles: string[];
  references: ReferenceBiblique[];
  entrees: string[];
  sourceId: string;
}

// ————————————————————————————————————————————————————————————
// Conseils de méthode
// ————————————————————————————————————————————————————————————

export type TempsOIA = 'observation' | 'interpretation' | 'application';

/**
 * Genres littéraires de l'Écriture. Un même principe d'interprétation ne
 * s'applique pas à un proverbe et à une épître : le genre conditionne la
 * lecture, et les conseils qui en dépendent portent cette étiquette.
 */
export type GenreLitteraire =
  | 'recit'
  | 'loi'
  | 'psaume'
  | 'sagesse'
  | 'prophetie'
  | 'evangile'
  | 'parabole'
  | 'actes'
  | 'epitre'
  | 'apocalypse';

/**
 * Ce qu'un ouvrage de méthode enseigne sur l'un des trois temps.
 * Ces conseils accompagnent l'utilisateur pendant son étude, à l'endroit où
 * ils servent — et non dans un chapitre séparé qu'il ne lirait pas.
 */
export interface ConseilMethode {
  id: string;
  temps: TempsOIA;
  /** Renseigné quand le conseil ne vaut que pour un genre littéraire. */
  genre?: GenreLitteraire;
  titre: string;
  texte: string;
  /** Rattache le conseil à l'une des questions de la méthode. */
  cleQuestion?: string;
  sourceId: string;
  localisation?: Localisation;
}

// ————————————————————————————————————————————————————————————
// Modules
// ————————————————————————————————————————————————————————————

/**
 * Unité d'ingestion. Un document transmis produit un ou plusieurs modules ;
 * l'enregistrement d'un module suffit à rendre son contenu interrogeable.
 */
export interface ModuleConnaissance {
  id: string;
  /** La source dont ce module extrait sa connaissance. */
  source: Source;
  /**
   * Sources supplémentaires citées par ce module. Un module de méthode
   * rassemble plusieurs ouvrages ; chaque conseil garde la sienne, et le
   * registre doit les connaître pour pouvoir les afficher.
   */
  sourcesAnnexes?: Source[];
  entrees?: EntreeDictionnaire[];
  commentaires?: Commentaire[];
  conseils?: ConseilMethode[];
  referencesCroisees?: ReferenceCroisee[];
  themes?: ThemeBiblique[];
  /** Version que ce module installe, pour les modules de type « bible ». */
  versionId?: string;
}

/** Anomalie détectée à la vérification d'un module. */
export interface AnomalieModule {
  gravite: 'erreur' | 'avertissement';
  message: string;
  element?: string;
}
