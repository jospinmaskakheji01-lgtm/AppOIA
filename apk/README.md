# Installer Lumière sur un téléphone Android

**Fichier : `Lumiere-1.5.0.apk`** — 88 Mo. Il fonctionne sur tous les téléphones
Android récents comme anciens (architectures `arm64-v8a` et `armeabi-v7a`).

L'application fonctionne entièrement hors connexion. Elle ne demande aucun
compte et n'envoie rien sur Internet.

## Si la version 1.4.0 est déjà installée

**Ne la désinstallez pas.** Installez la 1.5.0 par-dessus : elle est signée avec
la même clé, donc le téléphone la reconnaît comme une mise à jour et **vos
méditations, vos études et votre journal sont conservés**.

## Installation, pas à pas

1. Sur le téléphone, ouvrez cette page et touchez **`Lumiere-1.5.0.apk`**,
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
  déjà présente. Ce ne devrait pas être le cas si vous venez de la 1.4.0
  téléchargée ici. Sinon, désinstallez d'abord, puis réinstallez — mais notez
  alors ce que vous voulez garder, car les écrits ne survivent pas à une
  désinstallation.
- **Espace insuffisant** : il faut environ 250 Mo libres pour l'installation.

## Ce qui est nouveau depuis la 1.4.0

- **La méditation quotidienne.** Chaque matin, une notification annonce la
  méditation du jour ; la toucher ouvre directement l'écran, où tout est déjà
  écrit. Rien à saisir : le texte biblique, la méditation, la prière, et une
  seule chose à faire dans la journée.
- **Soixante méditations préparées**, en six genres qui alternent d'un jour à
  l'autre : paraboles de Jésus, récits bibliques, psaumes, enseignements de
  Jésus, lettres des apôtres, prières et promesses. Elles suivent la méthode
  O.I.A simplifiée de l'École d'Apollos.
- Le parcours **avance à la lecture et non au calendrier** : une journée sautée
  décale la suite, elle ne fait rien manquer.

Pour recevoir le rappel du matin : **Plus → Rappel quotidien → Ma méditation du
matin**, et choisissez l'heure. Android demandera l'autorisation d'envoyer des
notifications ; il faut l'accorder.

## Ce que contient cette version

- **Soixante méditations quotidiennes** préparées, une par jour, à lire sans
  rien avoir à écrire.
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
52998f4a4975c0a5843e6d8f23e2692e518885665614c77ec383c9dfb8a72180
```

Signature de l'application : `CN=Lumiere, OU=Application, O=Lumiere, C=FR`
(empreinte du certificat : `4eaf700c…ac4fbe0c`). Toutes les versions sont
signées avec la même clé, ce qui permet de mettre à jour l'application sans
désinstaller la précédente.
