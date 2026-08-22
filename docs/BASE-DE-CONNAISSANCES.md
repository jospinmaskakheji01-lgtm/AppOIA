# Base de connaissances — ingestion d'un document

Ce document décrit comment un ouvrage transmis devient une connaissance interrogeable
dans l'application. Le principe : **on ajoute des modules, on ne refait pas l'application**.

```
Nouveau document → Analyse → Extraction → Structuration → Vérification → Intégration → Test
```

## 1. Analyse

Pour chaque document reçu, on établit d'abord sa fiche :

| Champ | Exemple | Remarque |
| --- | --- | --- |
| `id` | `dico-westphal` | identifiant stable, en minuscules |
| `titre` | *Dictionnaire encyclopédique de la Bible* | |
| `auteur` | A. Westphal | si connu |
| `annee` | 1932 | si connue |
| `langue` | `fr` | |
| `type` | `dictionnaire` | `bible`, `dictionnaire`, `commentaire`, `etude`, `theologie`, `enseignement` |
| `abreviation` | `DEB` | affichée à côté de chaque extrait |
| `documentOrigine` | `westphal-tome1.pdf` | pour retrouver le fichier transmis |
| `provenance` | `domaine-public` | **facultatif**, purement documentaire |

Le champ `provenance` ne conditionne rien : ni l'ingestion, ni l'indexation, ni
l'affichage. Il n'existe que pour noter d'où vient un ouvrage, à l'intention de qui
consultera plus tard la liste des sources. Il peut être omis.

## 2. Extraction et structuration

Le document est converti en un JSON qui suit l'un des deux formats ci-dessous.

### Une version biblique

```json
{
  "version": {
    "id": "ostervald1996",
    "abreviation": "OST",
    "nom": "Ostervald 1996",
    "langue": "fr",
    "annee": "1996",
    "couverture": "complete",
    "sourceId": "bible-ostervald"
  },
  "versets": [
    { "livre": "Jean", "chapitre": 3, "verset": 16, "texte": "…" }
  ]
}
```

Les noms de livres acceptent toutes les graphies du canon (`Jean`, `Jn`, `jean`,
`1 Corinthiens`, `1co`, `I Corinthiens`…). L'importateur refuse un livre inconnu ou un
chapitre hors plage.

### Un ouvrage (dictionnaire, commentaire, étude, enseignement)

```json
{
  "module": { "id": "dico-westphal-v1" },
  "source": { "id": "dico-westphal", "titre": "…", "auteur": "…", "langue": "fr",
              "type": "dictionnaire", "abreviation": "DEB" },
  "entrees": [
    {
      "id": "grace",
      "terme": "Grâce",
      "categorie": "concept",
      "variantes": ["charis"],
      "motsOriginaux": [{ "langue": "grec", "mot": "χάρις", "translitteration": "charis", "strong": "G5485" }],
      "definitions": [{ "texte": "…", "localisation": { "page": "412" } }],
      "references": ["Ep 2:8", "Jn 1:14"],
      "themes": ["salut"]
    }
  ],
  "commentaires": [
    { "reference": "Jean 3.16", "type": "theologique", "titre": "…", "texte": "…",
      "localisation": { "page": "88" }, "position": "lecture augustinienne" }
  ],
  "themes": [{ "nom": "Alliance", "description": "…", "references": ["Jr 31:31"] }],
  "referencesCroisees": [{ "de": "Ps 23:1", "vers": "Jn 10:11", "relation": "parallele" }]
}
```

### Une version qui regroupe des versets

Les traductions en langue courante rendent souvent plusieurs versets d'un seul tenant.
Un bloc déclare alors sa portée avec `versetFin` :

```json
{ "livre": "Genèse", "chapitre": 3, "verset": 14, "versetFin": 15, "texte": "…" }
```

Le registre indexe le bloc sous **chacun** des versets qu'il couvre : demander
`Genèse 3:15` rend ce bloc, au lieu de déclarer la version absente du passage. Le
lecteur affiche « 14-15 », comme une Bible imprimée. Un même bloc atteint par plusieurs
numéros n'est rendu qu'une fois.

C'est aussi ce qui permet de rester honnête quand une édition perd un numéro de verset
en composant un passage poétique : le bloc précédent le contient réellement, et le dire
vaut mieux que laisser croire que le verset manque.

### Un ouvrage de méthode

Certains ouvrages n'apportent ni définitions ni commentaires de passage : ils disent
comment lire. Ils se déclarent sous forme de **conseils**, rattachés à un temps de la
méthode et, s'il y a lieu, à un genre littéraire.

```json
{
  "module": { "id": "methode-sources-v1" },
  "source": { "id": "living-by-the-book", "titre": "…", "type": "etude" },
  "sourcesAnnexes": [{ "id": "how-to-read-the-bible", "titre": "…" }],
  "conseils": [
    { "id": "lbb-obs-repetition", "temps": "observation",
      "titre": "Ce qui est répété", "texte": "…",
      "sourceId": "living-by-the-book",
      "localisation": { "chapitre": "20", "section": "Things That Are Repeated" } },
    { "id": "hrb-psaume", "temps": "interpretation", "genre": "psaume",
      "titre": "Des prières, avec un genre et une fonction", "texte": "…",
      "sourceId": "how-to-read-the-bible",
      "localisation": { "chapitre": "11" } },
    { "id": "lbb-app-promesse", "temps": "application", "cleQuestion": "promesse",
      "titre": "Une promesse à réclamer", "texte": "…",
      "sourceId": "living-by-the-book",
      "localisation": { "chapitre": "44" } }
  ]
}
```

- **`temps`** : `observation`, `interpretation` ou `application`.
- **`genre`** : `recit`, `loi`, `psaume`, `sagesse`, `prophetie`, `evangile`, `parabole`,
  `actes`, `epitre`, `apocalypse`. Un conseil qui porte un genre n'apparaît que sur un
  passage de ce genre — les règles de lecture d'une épître n'ont rien à dire d'un psaume.
  Le genre est déduit du livre par `genreDuLivre` (`src/data/genres.ts`).
- **`cleQuestion`** rattache le conseil à une question précise de la méthode ; il
  s'affiche alors sous cette question, replié.
- **`sourcesAnnexes`** : un module de méthode peut rassembler plusieurs ouvrages, chaque
  conseil gardant le sien. Le registre refuse un conseil dont la source n'est pas déclarée.

Points importants :

- **Les références s'écrivent librement.** L'importateur les normalise et refuse celles
  qu'il ne sait pas résoudre, plutôt que de les enregistrer approximativement.
- **`id` d'entrée = clé de fusion.** Deux ouvrages qui déclarent une entrée `grace`
  produisent **une seule** entrée portant **deux définitions**, chacune attribuée à son
  ouvrage. L'écran de dictionnaire affiche alors « 2 sources sur ce terme ». C'est ainsi
  que les perspectives divergentes sont conservées plutôt que fusionnées.
- **`position`** sert à nommer une lecture particulière quand un passage en reçoit
  plusieurs.
- **Types de commentaire** : `contexte`, `historique`, `theologique`, `pratique`,
  `linguistique`, `structure`.
- **Types de relation** : `citation`, `accomplissement`, `parallele`, `contraste`,
  `developpement`, `allusion`, `theme-commun`.

## 3. Vérification et intégration

```bash
npm run importer:version  tests/fixtures/exemple-version.json
npm run importer:document tests/fixtures/exemple-dictionnaire.json
```

L'importateur affiche un récapitulatif et refuse d'écrire si une erreur **de structure**
est détectée — livre inconnu, chapitre hors plage, référence irrésoluble, définition
manquante (`--forcer` outrepasse). Il génère ensuite le module dans `src/data/versions/`
ou `src/data/modules/`.

Il reste à l'activer — c'est la seule modification de code nécessaire :

```ts
// src/knowledge/bootstrap.ts
import { moduleOstervald } from '../data/versions/ostervald1996';
const modulesVersions: ModuleVersion[] = [moduleLSG, moduleOstervald];
```

Puis :

```bash
npm run test:base   # vérifie l'intégration de bout en bout
npm run lint        # tsc --noEmit
```

## 4. Ce que l'intégration débloque, sans autre travail

Dès qu'un module est enregistré, son contenu apparaît :

- dans la **recherche globale** (`/recherche`), avec sa nature et sa source ;
- dans le **dossier de chaque passage** (`/reference/Jean 3:16`) — commentaires, mots,
  références croisées, thèmes, liste des sources mobilisées ;
- dans le **dictionnaire** (`/dictionnaire/grace`), aux côtés des autres ouvrages ;
- dans l'**atelier OIA**, où les notices aident à l'Observation et les commentaires
  s'ouvrent à l'Interprétation — après que l'utilisateur a écrit sa propre réponse ;
- dans les **conseils de méthode** de l'atelier et de l'écran `/oia/methode`, repliés par
  temps, filtrés par genre à l'Interprétation, et rattachés question par question à
  l'Application ;
- dans l'**assistant** (`/assistant`), comme contexte cité ;
- dans l'écran **Sources** (`/sources`), avec sa fiche.

Une nouvelle version biblique devient immédiatement sélectionnable et comparable.

## 5. Les trois natures de contenu

L'application ne mélange jamais :

| Nature | Origine | Affichage |
| --- | --- | --- |
| `texte-biblique` | une version installée | badge bleu, avec l'abréviation de la version |
| `source-documentaire` | un ouvrage | badge doré, avec titre, auteur et localisation |
| `synthese-ia` | un modèle de langage | badge gris, mention explicite du modèle |

La synthèse est produite par un service que vous hébergez (`serveur/`), jamais par une
clé embarquée dans l'application — une clé embarquée serait extractible du paquet
installé. Ce service ne renvoie que la synthèse : les citations restent produites
localement, ce qui rend la séparation structurelle et non déclarative.

## 6. Structure du code

```
src/knowledge/
  types.ts       le modèle : sources, entrées, commentaires, relations, modules
  reference.ts   le canon des 66 livres, l'analyse et la normalisation des références
  bible.ts       Bible → Version → Livre → Chapitre → Verset ; comparaison ; recherche plein texte
  registre.ts    enregistrement, index, fusion des sources, dossier d'un passage
  recherche.ts   moteur unifié : versets, définitions, commentaires, thèmes
  assistant.ts   les trois blocs de réponse ; assistant local et assistant distant
  bootstrap.ts   la liste des modules installés — le seul fichier à modifier

scripts/
  importer-version.mjs    ingestion d'une version biblique
  importer-document.mjs   ingestion d'un ouvrage

tests/
  base-connaissances.test.ts   npm run test:base
  fixtures/                    exemples d'entrée pour les deux importateurs
```
