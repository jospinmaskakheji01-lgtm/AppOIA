# Lumière — Méditation et étude biblique quotidienne selon la méthode OIA

Application mobile (iOS · Android) d'étude et de méditation biblique quotidienne, ancrée
dans la foi chrétienne. **Toute l'étude repose sur la méthode OIA** : Observation,
Interprétation, Application. Le contenu est embarqué : l'application fonctionne
intégralement hors connexion et aucune donnée personnelle ne quitte l'appareil.

Construite avec **Expo (SDK 57) · React Native · TypeScript · expo-router**.

## La méthode OIA

Les trois temps, leurs questions et l'exemple travaillé sont repris fidèlement du
document de référence `MODALITE_METHODE_OIA`.

### O — Observation : « Que dit le texte ? »
Sept questions, à traiter dans l'ordre : **Qui ? Où ? Quand ? Comment ? Pourquoi ?
Quoi ? Donc ?** — la dernière rassemblant toutes les précédentes en une synthèse.
Chaque question porte ses sous-questions exactes (« Qui a écrit le livre ? », « À qui
l'auteur s'adresse-t-il ? », « Avant et après quel événement ? »…).

### I — Interprétation : « Qu'est-ce que le texte veut dire ? »
Trois questions : l'enseignement destiné aux **premiers destinataires** (la lecture sur
deux ou trois versions y est recommandée), la place du texte dans **l'histoire du
Salut** et par rapport à l'évangile, et l'**enseignement général** que Dieu adresse à
son Église.

### A — Application : « Que dois-je faire ? »
Neuf questions, dont la note du document précise qu'elles ne sont pas toutes
obligatoires : un exemple à suivre, un péché à éviter, une promesse à réclamer, une
prière à répéter, un commandement à obéir, une condition à remplir, une erreur à
éviter, un verset à mémoriser, un défi à relever. L'étude se conclut par un
**engagement** écrit et un **verset à mémoriser**.

### Exemple travaillé
**Luc 8:22-25** — la tempête apaisée — est intégré tel qu'il figure dans le document,
avec les sept réponses d'observation, l'interprétation et l'application. Accessible à
tout moment depuis l'onglet Étudier.

## Base de connaissances

L'application n'est pas seulement un lecteur de versets : c'est une base de connaissances
bibliques que l'on **enrichit par ingestion de documents**, sans refonte à chaque ajout.

```
Nouveau document → Analyse → Extraction → Structuration → Vérification → Intégration → Test
```

### Ce qu'elle relie

```
Jean 3:16
 ├── texte biblique          dans chaque version installée
 ├── mots et notions         entrées de dictionnaire citant le passage
 ├── commentaires            contexte, histoire, théologie, application
 ├── références croisées     avec le type de relation
 ├── thèmes                  regroupements transverses
 └── sources                 titre, auteur, page
```

Chaque information porte **sa source** et **sa nature**. L'application ne mélange jamais :

| Nature | Origine | Affichage |
| --- | --- | --- |
| `texte-biblique` | une version installée | badge bleu, abréviation de la version |
| `source-documentaire` | un ouvrage | badge doré, titre, auteur, page |
| `synthese-ia` | un modèle de langage | badge gris, modèle nommé, mention explicite |

### Multi-versions

L'architecture est `Bible → Version → Livre → Chapitre → Verset`. Une version est un
module autonome : l'ajouter ne demande qu'un import et une ligne dans `bootstrap.ts`.
L'utilisateur choisit sa version de lecture, et les passages s'affichent côte à côte dès
que plusieurs versions sont installées.

### Recherche

Une requête interroge simultanément le texte biblique, le dictionnaire, les commentaires
et les thèmes, avec filtres par catégorie. Elle reconnaît les références écrites
librement (`Jn 3.16`, `1co 13:4`, `Ps 23`), ignore les accents, comprend les questions
rédigées, et fait remonter les expressions exactes.

### Assistant

Par défaut, l'assistant fonctionne **hors connexion** : il restitue le texte biblique et
les extraits d'ouvrages, sans rien générer. Une synthèse rédigée peut être ajoutée en
configurant l'adresse d'un service que vous hébergez (`serveur/`, implémentation de
référence fournie). L'application n'embarque aucune clé d'API — elle serait extractible
du paquet installé. Le service ne renvoyant que la synthèse, la séparation des trois
natures est garantie par l'architecture et non par la bonne volonté du modèle.

### Ajouter un document

```bash
npm run importer:version  mon-fichier.json    # une version biblique
npm run importer:document  mon-ouvrage.json   # dictionnaire, commentaire, étude…
npm run test:base                             # vérifie l'intégration
```

Les importateurs valident la structure — références résolues, livres du canon, chapitres
dans les bornes — et génèrent le module. Deux ouvrages traitant du même terme produisent
**une entrée à deux définitions**, chacune attribuée à sa source : les perspectives
divergentes sont conservées, jamais fusionnées.

Le déroulé complet et les formats d'entrée sont dans
[`docs/BASE-DE-CONNAISSANCES.md`](docs/BASE-DE-CONNAISSANCES.md).

### Contenu actuel

**Deux versions bibliques** — Louis Segond 1910 (48 passages) et Parole Vivante, la
transposition du Nouveau Testament par Alfred Kuen (7 952 versets, les 27 livres).

**Plus de 1 600 entrées de dictionnaire**, dont 1 671 issues du Petit Dictionnaire
Biblique — un recueil de cinq ouvrages où chaque notice conserve celui dont elle
provient, avec sa page. Les termes traités par plusieurs ouvrages portent plusieurs
définitions côte à côte plutôt qu'une synthèse.

**Les introductions d'Alfred Kuen** au Cantique des cantiques, à Job, aux Proverbes et à
l'Ecclésiaste, rattachées à chacun de ces livres.

**35 conseils de méthode** tirés des quatre ouvrages qui fondent la démarche : *Living By
the Book* de Howard Hendricks — d'où viennent les trois temps et les neuf questions de
l'Application —, *How to Read the Bible for All Its Worth* de Fee et Stuart pour les
règles propres à chaque genre littéraire, et les deux ouvrages d'Alfred Kuen. Chacun
renvoie à son chapitre. Ces livres sont de la prose sans marqueur exploitable : ils ont
été lus plutôt qu'extraits par un analyseur, qui n'en aurait tiré que du bruit.

S'y ajoutent 24 fiches de livres, plus de 200 commentaires, plus de 6 000 références
bibliques extraites et normalisées, et le document de méthode OIA comme source citable.

## Comment l'application applique la méthode

- **L'atelier OIA** est l'écran central : trois temps navigables, un champ par question,
  sauvegarde continue, barre de progression par temps, et export texte de l'étude
  complète par partage.
- **Les fiches de livres** (24 livres du corpus : auteur, destinataires, date, lieu,
  genre, contexte) servent les questions « Qui ? », « Où ? » et « Quand ? », qui ne se
  devinent pas à la seule lecture du passage. La question de l'histoire du Salut est
  également servie par la fiche.
- **Les pistes ne sont jamais des réponses.** Chaque question d'observation peut révéler
  un indice sur ce qu'il faut remarquer dans ce passage précis (« comptez combien de fois
  son nom revient », « repérez le pivot du v. 4 »).
- **Les conseils de méthode accompagnent chaque temps**, repliés : on les ouvre quand on
  bloque, on les referme pour écrire. À l'Interprétation, l'application ajoute les règles
  propres au genre du livre étudié — un psaume ne reçoit pas les règles d'une épître. À
  l'Application, chacune des neuf questions porte le commentaire de l'auteur dont elle
  vient. Chaque conseil affiche son ouvrage et son chapitre : c'est un ouvrage qui parle,
  jamais l'application.
- **L'interprétation proposée reste verrouillée** tant que l'utilisateur n'a pas écrit la
  sienne. C'est un choix pédagogique : la méthode demande d'observer avant qu'on ne vous
  explique.
- **Les 7 plans guidés (52 journées)** sont tous structurés en OIA : contexte immédiat,
  pistes d'observation, interprétation proposée, questions d'application que le texte
  soulève réellement, verset à mémoriser, engagement, prière.
- **Une étude achevée valide la journée** et fait avancer le plan associé.

## Les écrans

### Aujourd'hui
Verset du jour (61 versets, choisi de façon déterministe à partir de la date), reprise de
l'étude OIA en cours avec le temps où elle en est restée, plan guidé du jour, étude libre,
méditation suggérée selon l'heure, série de jours consécutifs.

### Méditer
- **Méditation OIA guidée** : les trois temps minutés (5 min chacun), priés plutôt
  qu'écrits, sur le passage du jour ou celui de votre choix.
- **Quatre méditations guidées** : commencer le jour, déposer la journée, apaiser
  l'anxiété, bénir et rendre grâce — chaque étape minutée, avec une respiration animée
  (4 s d'inspiration, 6 s d'expiration).
- **Silence minuté** de 3 à 20 minutes.
- **Prières de la tradition chrétienne** : Notre Père, bénédiction d'Aaron, prière du
  cœur, prière de sérénité, prière pour la paix, prière du soir.

### Étudier
La méthode et son exemple travaillé, le lancement d'une étude libre, la liste de vos
études (avec la progression O / I / A de chacune), et les plans guidés.

| Plan | Journées | Sujet |
| --- | --- | --- |
| Fondations | 10 | Création, grâce, croix, foi, mission |
| Psaumes de réconfort | 7 | Prier dans les temps difficiles |
| Le Sermon sur la montagne | 7 | Le cœur de l'enseignement de Jésus |
| Aimer comme Christ | 7 | L'amour véritable en actes |
| Traverser l'épreuve | 7 | Fatigue, deuil, doute, attente |
| Apprendre à prier | 7 | Retrouver le dialogue |
| Marcher par l'Esprit | 7 | Le fruit de l'Esprit au quotidien |

### Bible
**48 passages** (Ancien et Nouveau Testament) en **Louis Segond 1910** (domaine public),
avec introduction, thèmes, recherche plein texte, favoris et partage. Chaque passage peut
lancer une étude OIA ou une méditation OIA.

### Journal
Journal spirituel libre (titre, texte, référence liée, humeur) et liste de sujets de
prière par catégorie, avec suivi des prières exaucées.

### Réglages
Prénom, rappel quotidien par notification, taille du texte biblique, ambiance claire
(« Aube ») / sombre (« Veillée ») / système, statistiques de parcours.

## Démarrer

```bash
npm install
npx expo start        # puis « a » pour Android, « i » pour iOS, « w » pour le web
npm run lint          # tsc --noEmit
npm run test:base     # vérifie la base de connaissances (references, index, recherche, ingestion)
```

Construire un bundle de production :

```bash
npx expo export --platform android
npx expo export --platform ios
```

## Structure

```
app/                        Routes (expo-router)
  (tabs)/                   Aujourd'hui · Méditer · Étudier · Bible · Journal
  oia/[id].tsx              L'atelier OIA — l'écran central
  oia/nouvelle.tsx          Choisir le passage d'une étude libre
  oia/methode.tsx           La méthode et l'exemple travaillé (Luc 8:22-25)
  passage/[id].tsx          Lecteur de passage
  plan/[id]/                Détail d'un plan et journée guidée
  meditation/               Méditation OIA guidée, séances minutées, silence
  journal/, prieres.tsx     Journal et sujets de prière
  reglages.tsx              Réglages et statistiques
src/
  knowledge/                La base de connaissances
    types.ts                sources, entrées, commentaires, relations, modules
    reference.ts            canon des 66 livres, analyse et normalisation des références
    bible.ts                Bible → Version → Livre → Chapitre → Verset ; comparaison
    registre.ts             index, fusion des sources, dossier d'un passage
    recherche.ts            moteur unifié
    assistant.ts            les trois blocs de réponse ; assistant local et distant
    bootstrap.ts            la liste des modules installés
  data/sources.ts           registre des sources documentaires
  data/versions/            une version biblique par fichier
  data/modules/             un ouvrage ingéré par fichier
  data/oia.ts               La méthode : questions, sous-questions, exemple travaillé
  data/livres.ts            24 fiches de livres, au service de l'Observation
  data/plans.ts             7 plans, 52 journées structurées en OIA
  data/passages.ts          48 passages en Louis Segond 1910
  data/versets.ts           61 versets du jour
  data/meditations.ts       Méditation OIA guidée, séances, prières traditionnelles
  store/AppContext.tsx      État global (dont les études OIA), persisté via AsyncStorage
  components/               Composants OIA, interface, icônes SVG, respiration animée
  theme/, utils/            Palettes, dates et séries, notifications
```

## Données et vie privée

Tout est stocké localement avec `AsyncStorage` sous une seule clé (`@lumiere/etat-v1`) :
études OIA, progression, journal, prières, favoris, réglages. Aucun compte, aucun
serveur, aucune requête réseau.

## Texte biblique

Version **Louis Segond 1910**, dans le domaine public. Les prières de la tradition
reproduites dans l'application sont également libres de droits.
