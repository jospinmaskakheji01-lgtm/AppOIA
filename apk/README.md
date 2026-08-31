# Installer Lumière sur un téléphone Android

**Fichier : `Lumiere-1.4.0.apk`** — 88 Mo. Il fonctionne sur tous les téléphones
Android récents comme anciens (architectures `arm64-v8a` et `armeabi-v7a`).

L'application fonctionne entièrement hors connexion. Elle ne demande aucun
compte et n'envoie rien sur Internet.

## Si la version 1.3.0 est déjà installée

**Ne la désinstallez pas.** Installez la 1.4.0 par-dessus : elle est signée avec
la même clé, donc le téléphone la reconnaît comme une mise à jour et **vos
méditations, vos études et votre journal sont conservés**.

## Installation, pas à pas

1. Sur le téléphone, ouvrez cette page et touchez **`Lumiere-1.4.0.apk`**,
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

- **« Application non installée »** : une version signée avec une autre clé est
  déjà présente. Ce ne devrait pas être le cas si vous venez de la 1.3.0
  téléchargée ici. Sinon, désinstallez d'abord, puis réinstallez — mais notez
  alors ce que vous voulez garder, car les écrits ne survivent pas à une
  désinstallation.
- **Espace insuffisant** : il faut environ 250 Mo libres pour l'installation.

## Ce qui est nouveau depuis la 1.3.0

- **L'étude biblique ne renvoie plus chercher les passages ailleurs.** À
  l'étape « Établir la liste des passages », l'application cherche le nom dans
  toute la Bible installée et relève chaque verset, livre par livre, avec les
  comptes.
- **Lire sans quitter l'étude.** Toucher un verset ouvre le chapitre par-dessus,
  amené sur le verset visé ; on peut lire les chapitres d'avant et d'après, puis
  fermer et retrouver sa réponse intacte.
- **Les passages suivent d'une étape à l'autre.** La liste dressée une fois
  reste disponible partout sous « Mes passages », avec un « Tout lire » qui les
  enchaîne — ce que demande l'étape « lisez tous les passages à la suite ».

Ces outils valent pour les quatre méthodes qui relèvent des passages : étude de
personnages, thématique ciblée, thématique générale et étude de mots.

## Ce que contient cette version

- La **méthode O.I.A** sous ses deux formes : la méditation quotidienne
  simplifiée (5 à 15 min) et l'étude biblique complète (1 à 2 h).
- **Huit méthodes d'étude biblique** avec leur marche à suivre : étude de
  personnages ; étude thématique — ciblée, générale, étude de qualités ; étude
  de mots ; étude d'un livre — survol, étude synthétique, étude de contexte.
- **Quinze plans de lecture**, de quatorze jours à un an — 1 172 journées.
- **Quatre versions bibliques** embarquées : Segond 1910 (Bible entière),
  Parole de Vie (avec les livres deutérocanoniques), Parole Vivante (Nouveau
  Testament), Louange vivante (Psaumes).
- Le **Commentaire du disciple** de William MacDonald sur l'Ancien Testament,
  un dictionnaire biblique, et les conseils de méthode de plusieurs ouvrages.

## Vérifier que le fichier n'a pas été altéré

Empreinte SHA-256 du fichier :

```
926d69d64431b21a8996d29bea97a30312ad356aa699382e88b231602223e891
```

Signature de l'application : `CN=Lumiere, OU=Application, O=Lumiere, C=FR`
(empreinte du certificat : `4eaf700c…ac4fbe0c`). Toutes les versions sont
signées avec la même clé, ce qui permet de mettre à jour l'application sans
désinstaller la précédente.
