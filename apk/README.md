# Installer Lumière sur un téléphone Android

**Fichier : `Lumiere-1.2.0.apk`** — 88 Mo. Il fonctionne sur tous les téléphones
Android récents comme anciens (architectures `arm64-v8a` et `armeabi-v7a`).

L'application fonctionne entièrement hors connexion. Elle ne demande aucun
compte et n'envoie rien sur Internet.

## Installation, pas à pas

1. Sur le téléphone, ouvrez cette page et touchez **`Lumiere-1.2.0.apk`**,
   puis le bouton de téléchargement (la flèche vers le bas).
2. Le téléphone demande de confirmer : touchez **Télécharger quand même**.
   Il prévient simplement que le fichier ne vient pas du Play Store.
3. Une fois le téléchargement fini, touchez la notification, ou ouvrez
   **Fichiers → Téléchargements** et touchez le fichier.
4. Si le téléphone dit qu'il n'est pas autorisé à installer des applications de
   cette source : touchez **Paramètres**, activez **Autoriser depuis cette
   source**, puis revenez en arrière.
5. Touchez **Installer**.

### Si Play Protect affiche un avertissement

Un écran peut apparaître : « Application non sécurisée bloquée » ou
« Play Protect ne reconnaît pas le développeur ».

**Touchez le petit lien « Installer quand même », qui se trouve au-dessus du
gros bouton.** Le gros bouton, lui, annule l'installation — c'est le piège le
plus courant.

Cet avertissement s'affiche pour toute application qui ne passe pas par le Play
Store. Il ne signale pas un problème dans l'application.

### Si l'installation échoue quand même

- **« Application non installée »** : une ancienne version signée avec une autre
  clé est déjà présente. Désinstallez-la d'abord, puis réinstallez. Vos
  méditations sont conservées dans le téléphone seulement si la clé est la
  même — sinon, notez ce que vous voulez garder avant de désinstaller.
- **Espace insuffisant** : il faut environ 250 Mo libres pour l'installation.

## Ce que contient cette version

- La **méthode O.I.A** sous ses deux formes : la méditation quotidienne
  simplifiée (5 à 15 min) et l'étude biblique complète (1 à 2 h).
- **Six méthodes d'étude biblique** avec leur marche à suivre : personnages,
  thèmes, mots, survol des livres, analyse synthétique, contexte.
- **Quinze plans de lecture**, de quatorze jours à un an — 1 172 journées.
- **Quatre versions bibliques** embarquées : Segond 1910 (Bible entière),
  Parole de Vie (avec les livres deutérocanoniques), Parole Vivante (Nouveau
  Testament), Louange vivante (Psaumes).
- Le **Commentaire du disciple** de William MacDonald sur l'Ancien Testament,
  un dictionnaire biblique, et les conseils de méthode de quatre ouvrages.

## Vérifier que le fichier n'a pas été altéré

Empreinte SHA-256 du fichier :

```
d44516df47f1fbe4eee227efc5354297579592a71bec229c8fe796b7b637c7e1
```

Signature de l'application : `CN=Lumiere, OU=Application, O=Lumiere, C=FR`.
Toutes les versions sont signées avec la même clé, ce qui permet de mettre à
jour l'application sans désinstaller la précédente.
