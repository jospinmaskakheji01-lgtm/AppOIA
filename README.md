# Lumière — Méditation et étude biblique quotidienne

Application mobile (iOS · Android) de méditation et d'étude biblique quotidienne, ancrée
dans la foi chrétienne. Tout le contenu est embarqué : l'application fonctionne
intégralement hors connexion et aucune donnée personnelle ne quitte l'appareil.

Construite avec **Expo (SDK 57) · React Native · TypeScript · expo-router**.

## Ce que contient l'application

### Aujourd'hui
- Verset du jour tiré d'une sélection de **61 versets**, choisi de façon déterministe à
  partir de la date (le même verset pour tous, le même jour).
- Une méditation courte associée au verset.
- Reprise du plan d'étude en cours, méditation guidée suggérée selon l'heure,
  accès direct au journal.
- Série de jours consécutifs, jours vécus, minutes de silence.

### Méditer
- **Lectio divina** guidée en quatre temps minutés — *Lectio*, *Meditatio*, *Oratio*,
  *Contemplatio* — applicable à n'importe quel passage de la bibliothèque.
- **Quatre méditations guidées** : commencer le jour, déposer la journée, apaiser
  l'anxiété, bénir et rendre grâce. Chaque étape est minutée et accompagnée d'une
  respiration animée (4 s d'inspiration, 6 s d'expiration).
- **Silence minuté** de 3 à 20 minutes, avec le verset du jour en soutien.
- **Prières de la tradition chrétienne** : Notre Père, bénédiction d'Aaron, prière du
  cœur, prière de sérénité, prière pour la paix, prière du soir.

### Étudier
**7 plans d'étude, 52 journées** au total. Chaque journée suit la même trame :
lire le texte → méditer → répondre à trois questions → prier → mémoriser un verset →
poser un acte concret.

| Plan | Durée | Sujet |
| --- | --- | --- |
| Fondations | 10 jours | Le socle de la foi : création, grâce, croix, foi, mission |
| Psaumes de réconfort | 7 jours | Prier dans les temps difficiles |
| Le Sermon sur la montagne | 7 jours | Le cœur de l'enseignement de Jésus |
| Aimer comme Christ | 7 jours | L'amour véritable en actes |
| Traverser l'épreuve | 7 jours | Fatigue, deuil, doute, attente |
| Apprendre à prier | 7 jours | Retrouver le dialogue |
| Marcher par l'Esprit | 7 jours | Le fruit de l'Esprit et la sainteté quotidienne |

### Bible
**46 passages** (Ancien et Nouveau Testament) en **Louis Segond 1910** (domaine public),
avec une introduction pastorale, des thèmes, la recherche plein texte, les favoris et
le partage. Taille du texte réglable.

### Journal
- Journal spirituel : titre, texte libre, référence biblique liée, humeur du jour.
- Liste de sujets de prière par catégorie (personnel, famille, église, monde, gratitude),
  avec marquage des prières exaucées.

### Réglages
Prénom, rappel quotidien par notification (heure au choix), taille du texte biblique,
ambiance claire (« Aube ») / sombre (« Veillée ») / système, statistiques de parcours.

## Démarrer

```bash
npm install
npx expo start        # puis « a » pour Android, « i » pour iOS, « w » pour le web
```

Vérification des types :

```bash
npm run lint          # tsc --noEmit
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
  passage/[id].tsx          Lecteur de passage
  plan/[id]/                Détail d'un plan et journée d'étude
  meditation/               Séance guidée, lectio divina, silence minuté
  journal/nouvelle.tsx      Rédaction d'une entrée
  prieres.tsx               Ajout d'un sujet de prière
  reglages.tsx              Réglages et statistiques
src/
  data/                     Contenu : passages, versets, plans, méditations
  store/AppContext.tsx      État global, persisté via AsyncStorage
  components/               Composants d'interface, icônes SVG, respiration animée
  theme/                    Palette « Aube » et « Veillée », espacements, typographie
  utils/                    Dates et séries, notifications
```

## Données et vie privée

Tout est stocké localement avec `AsyncStorage` sous une seule clé (`@lumiere/etat-v1`) :
progression, journal, prières, favoris, réglages. Aucun compte, aucun serveur, aucune
requête réseau.

## Texte biblique

Version **Louis Segond 1910**, dans le domaine public. Les prières de la tradition
reproduites dans l'application sont également libres de droits.
