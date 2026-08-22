# Déposer un document ici

L'envoi de fichiers par la conversation échoue sur les gros documents. Ce dossier est la
voie de secours : **tout ce qui est déposé ici m'est accessible.**

## Comment déposer

### Depuis le navigateur (le plus simple)

1. Ouvrir <https://github.com/jospinmaskakheji01-lgtm/AppOIA/upload/claude/meditation-biblique-mobile-k4dqqq/documents>
2. Glisser les fichiers
3. « Commit changes »

Limite de cette voie : **25 Mo par fichier**.

### Depuis un ordinateur, en ligne de commande

Pour les fichiers plus gros — jusqu'à **100 Mo par fichier** :

```bash
git clone https://github.com/jospinmaskakheji01-lgtm/AppOIA.git
cd AppOIA
git checkout claude/meditation-biblique-mobile-k4dqqq
cp ~/mes-ouvrages/*.pdf documents/
git add documents/ && git commit -m "Ajout de documents" && git push
```

### Au-delà de 100 Mo

Trois solutions, par ordre de préférence :

1. **Extraire le texte avant l'envoi.** Un dictionnaire de 400 Mo en PDF pèse 8 Mo une
   fois converti en texte — et c'est le texte qui m'est utile, pas la mise en page.
   Sur macOS : *Aperçu → Exporter au format texte*. Sur Windows/Linux :
   `pdftotext -layout mon-fichier.pdf mon-fichier.txt`.
2. **Découper le PDF** par tranches de pages (A–F, G–M, N–Z pour un dictionnaire).
3. **Compresser** en `.zip` si le document est fait de nombreux petits fichiers.

## Ce qui se passe ensuite

```
documents/ouvrage.pdf
   ↓  npm run extraire documents/ouvrage.pdf
documents/ouvrage.txt          texte, avec des marqueurs « === PAGE n === »
   ↓  analyse et structuration
mon-ouvrage.json               entrées, commentaires, thèmes, références croisées
   ↓  npm run importer:document mon-ouvrage.json
src/data/modules/mon-ouvrage.ts
   ↓  une ligne dans src/knowledge/bootstrap.ts
consultable dans l'application
```

Les marqueurs de page servent à renseigner la localisation de chaque information, pour
que l'application puisse toujours dire d'où elle vient.

## Formats

| Format | Traitement |
| --- | --- |
| `.pdf` avec texte | extraction directe |
| `.pdf` scanné (images) | **rien à extraire** — il faut une reconnaissance optique en amont |
| `.txt`, `.md` | utilisable tel quel, idéal |
| `.json`, `.csv`, `.xml` | idéal : structure déjà présente |
| `.docx`, `.epub` | convertir en `.txt` avant l'envoi |

Pour savoir si un PDF contient du texte : ouvrez-le et essayez de sélectionner un mot.
Si la sélection est impossible, c'est une image.

## Ce qui aide le plus

- **Un sommaire ou un index**, s'il existe : il donne la structure de l'ouvrage.
- **Le nom de l'auteur et l'année**, pour la fiche de source.
- **Un ouvrage à la fois**, plutôt que dix d'un coup : chacun demande une analyse propre,
  et le résultat est meilleur.
