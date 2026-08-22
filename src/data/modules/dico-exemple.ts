/**
 * Dictionnaire biblique d'exemple — A. Auteur
 * Généré par scripts/importer-document.mjs à partir de doc-test.json.
 *
 * Droits : domaine-public
 *
 * Fixture d'exemple, non enregistrée dans bootstrap.ts. Elle sert à
 * démontrer et tester le pipeline d'ingestion (tests/fixtures/exemple-dictionnaire.json).
 */

import { ModuleConnaissance, Source } from '../../knowledge/types';

export const sourcemoduledicoexemple: Source = {
  "id": "dico-exemple",
  "titre": "Dictionnaire biblique d'exemple",
  "auteur": "A. Auteur",
  "annee": "1900",
  "langue": "fr",
  "type": "dictionnaire",
  "droits": "domaine-public",
  "abreviation": "DBE",
  "documentOrigine": "dictionnaire-exemple.pdf",
  "ajouteLe": "2026-08-22"
};

export const moduledicoexemple: ModuleConnaissance = {
  id: "dico-exemple",
  source: sourcemoduledicoexemple,
  entrees: [
  {
    "id": "dbe-berger",
    "terme": "Berger",
    "variantes": [
      "pasteur"
    ],
    "categorie": "concept",
    "motsOriginaux": [
      {
        "langue": "hébreu",
        "mot": "רֹעֶה",
        "translitteration": "roeh"
      }
    ],
    "definitions": [
      {
        "texte": "Celui qui garde le troupeau ; image du roi et de Dieu lui-même.",
        "localisation": {
          "page": "142"
        },
        "sourceId": "dico-exemple"
      }
    ],
    "references": [
      {
        "livre": "Psaumes",
        "chapitre": 23,
        "verset": 1
      },
      {
        "livre": "Jean",
        "chapitre": 10,
        "verset": 11
      }
    ],
    "entreesLiees": [],
    "themes": [
      "pastorale"
    ]
  }
],
  commentaires: [
  {
    "id": "dbe-c1",
    "reference": {
      "livre": "Jean",
      "chapitre": 3,
      "verset": 16
    },
    "type": "theologique",
    "titre": "L'amour du Père",
    "texte": "Le verbe employé marque un don définitif, non un prêt.",
    "sourceId": "dico-exemple",
    "localisation": {
      "page": "88"
    },
    "themes": [
      "amour"
    ]
  },
  {
    "id": "dico-exemple-1",
    "reference": {
      "livre": "Psaumes",
      "chapitre": 23
    },
    "type": "contexte",
    "texte": "Psaume attribué à David, construit sur deux images successives.",
    "sourceId": "dico-exemple",
    "localisation": {
      "page": "203"
    },
    "themes": []
  }
],
  themes: [
  {
    "id": "dbe-t1",
    "nom": "Pastorale",
    "description": "Dieu comme berger de son peuple.",
    "motsCles": [
      "berger",
      "troupeau"
    ],
    "references": [
      {
        "livre": "Psaumes",
        "chapitre": 23
      },
      {
        "livre": "Ésaïe",
        "chapitre": 40,
        "verset": 11
      }
    ],
    "entrees": [],
    "sourceId": "dico-exemple"
  }
],
  referencesCroisees: [
  {
    "id": "dico-exemple-rc-0",
    "de": {
      "livre": "Psaumes",
      "chapitre": 23,
      "verset": 1
    },
    "vers": {
      "livre": "Jean",
      "chapitre": 10,
      "verset": 11
    },
    "relation": "parallele",
    "note": "Le berger",
    "sourceId": "dico-exemple"
  }
],
};
