# Service de synthèse Lumière

Service optionnel. Sans lui, l'application fonctionne entièrement hors connexion et se
limite à restituer les sources installées — ce qui est déjà l'essentiel.

## Pourquoi un service séparé

Une application mobile ne peut pas contenir une clé d'API : elle est extractible du
paquet installé, quelle que soit la manière dont on la dissimule. L'application envoie
donc ici la question et le contexte qu'elle a rassemblé localement ; ce service, que vous
hébergez, détient la clé et renvoie uniquement la synthèse.

Cette séparation garantit aussi, par construction, la règle centrale de l'application :
le service ne renvoie **jamais** de texte biblique ni d'extraits d'ouvrages. L'application
les possède déjà et les affiche dans ses propres blocs. Le modèle ne peut donc pas
mélanger les trois natures de contenu, même s'il le voulait.

## Lancer

```bash
cd serveur
npm install
ANTHROPIC_API_KEY=sk-ant-... JETON=un-secret-de-votre-choix npm start
```

Variables d'environnement :

| Variable | Rôle | Défaut |
| --- | --- | --- |
| `ANTHROPIC_API_KEY` | Clé d'API du fournisseur | requis |
| `JETON` | Jeton exigé des clients (`Authorization: Bearer …`) | aucun — le service accepte tout |
| `PORT` | Port d'écoute | `8787` |
| `MODELE` | Modèle par défaut | `claude-opus-5` |

Renseignez ensuite l'URL du service, et le jeton, dans **Réglages → Service de synthèse**.

## Contrat

Entrée (`POST`, JSON) :

```json
{
  "question": "Que signifie la grâce ?",
  "modele": "claude-opus-5",
  "textesBibliques": [{ "reference": "Éphésiens 2:8", "texte": "…", "version": "LSG" }],
  "extraitsSources": [
    { "sourceId": "dico-x", "titreOuvrage": "…", "auteur": "…", "reference": "…", "localisation": "p. 88", "texte": "…" }
  ]
}
```

Sortie :

```json
{ "synthese": "…", "modele": "claude-opus-5", "sourcesUtilisees": ["dico-x"], "horsSources": false }
```

Une erreur du fournisseur n'est pas fatale : l'application affiche alors le texte biblique
et les extraits qu'elle a rassemblés localement, avec un avertissement.

## Ce que le service impose au modèle

- s'appuyer d'abord sur les extraits fournis, et les citer ;
- dire explicitement quand les extraits ne suffisent pas, plutôt que de combler le vide ;
- présenter les positions divergentes sans trancher à la place des auteurs ;
- ne jamais présenter son raisonnement comme venant de la Bible ou d'un ouvrage.

`sourcesUtilisees` liste les sources **fournies** au modèle, pas celles qu'il aurait
mobilisées : le service ne prétend pas deviner ce second point.
