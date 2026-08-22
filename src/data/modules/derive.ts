/**
 * Module dérivé du contenu déjà présent dans l'application.
 *
 * Les introductions de passages, les fiches de livres et les interprétations
 * des plans d'étude sont du contenu rédactionnel : plutôt que de le laisser
 * enfermé dans les écrans qui l'affichent, on le publie dans la base de
 * connaissances, où il devient interrogeable et rattaché à sa source.
 *
 * Ce contenu est attribué à `lumiere-redaction` et se présentera dans
 * l'interface aux côtés — jamais à la place — des ouvrages de référence
 * que l'utilisateur ajoutera.
 */

import { analyserReference } from '../../knowledge/reference';
import {
  Commentaire,
  EntreeDictionnaire,
  ModuleConnaissance,
  ReferenceBiblique,
  ReferenceCroisee,
  ThemeBiblique,
} from '../../knowledge/types';
import { fichesLivres } from '../livres';
import { passages } from '../passages';
import { plans } from '../plans';
import { sourcesParId, SOURCE_METHODE_OIA, SOURCE_REDACTION } from '../sources';

/** Référence d'un passage du corpus, sous forme normalisée. */
function referenceDe(reference: string): ReferenceBiblique | undefined {
  const propre = reference.split(',')[0].trim();
  return analyserReference(propre);
}

function identifiant(...parties: (string | number)[]): string {
  return parties
    .join('-')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9-]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

function construireCommentaires(): Commentaire[] {
  const sortie: Commentaire[] = [];

  // 1. Les introductions de passages : un repère de contexte par passage.
  for (const passage of passages) {
    const ref = referenceDe(passage.reference);
    if (!ref) continue;
    sortie.push({
      id: identifiant('intro', passage.id),
      reference: ref,
      type: 'contexte',
      titre: passage.reference,
      texte: passage.intro,
      sourceId: SOURCE_REDACTION,
      themes: passage.themes,
    });
  }

  // 2. Les plans d'étude : contexte immédiat, destinataires, enseignement.
  for (const plan of plans) {
    for (const jour of plan.jours) {
      const passage = passages.find((p) => p.id === jour.passageId);
      const ref = passage ? referenceDe(passage.reference) : undefined;
      if (!ref) continue;
      const base = { reference: ref, sourceId: SOURCE_REDACTION, themes: plan.themes };

      sortie.push({
        ...base,
        id: identifiant('ctx', plan.id, jour.jour),
        type: 'contexte',
        titre: `${jour.titre} — situation du passage`,
        texte: jour.contexteImmediat,
        localisation: { section: `${plan.titre}, jour ${jour.jour}` },
      });

      if (jour.interpretation.destinataires) {
        sortie.push({
          ...base,
          id: identifiant('dest', plan.id, jour.jour),
          type: 'historique',
          titre: `Ce que les premiers destinataires devaient entendre`,
          texte: jour.interpretation.destinataires,
          localisation: { section: `${plan.titre}, jour ${jour.jour}` },
        });
      }

      if (jour.interpretation.eglise) {
        sortie.push({
          ...base,
          id: identifiant('eglise', plan.id, jour.jour),
          type: 'theologique',
          titre: jour.titre,
          texte: jour.interpretation.eglise,
          localisation: { section: `${plan.titre}, jour ${jour.jour}` },
        });
      }

      const applications = Object.entries(jour.pistesApplication)
        .map(([cle, valeur]) => `${cle} : ${valeur}`)
        .join('\n');
      if (applications) {
        sortie.push({
          ...base,
          id: identifiant('appli', plan.id, jour.jour),
          type: 'pratique',
          titre: `Pistes d'application`,
          texte: applications,
          localisation: { section: `${plan.titre}, jour ${jour.jour}` },
        });
      }
    }
  }

  return sortie;
}

/** Les fiches de livres deviennent des entrées de dictionnaire consultables. */
function construireEntreesLivres(): EntreeDictionnaire[] {
  return fichesLivres.map((fiche) => ({
    id: identifiant('livre', fiche.livre),
    terme: fiche.livre,
    variantes: [`livre de ${fiche.livre}`, `épître ${fiche.livre}`],
    categorie: 'livre' as const,
    motsOriginaux: [],
    definitions: [
      {
        texte: [
          `Auteur : ${fiche.auteur}`,
          `Destinataires : ${fiche.destinataires}`,
          `Date : ${fiche.date}`,
          `Lieu : ${fiche.lieu}`,
          `Genre : ${fiche.genre}`,
          `Contexte : ${fiche.contexte}`,
          `Place dans l'histoire du Salut : ${fiche.histoireDuSalut}`,
          `Thème majeur : ${fiche.themeMajeur}`,
        ].join('\n'),
        sourceId: SOURCE_REDACTION,
        localisation: { article: fiche.livre },
      },
    ],
    references: [],
    entreesLiees: [],
    themes: [],
  }));
}

/** Les thèmes des passages deviennent des thèmes indexés de la base. */
function construireThemes(): ThemeBiblique[] {
  const parNom = new Map<string, ThemeBiblique>();
  for (const passage of passages) {
    const ref = referenceDe(passage.reference);
    if (!ref) continue;
    for (const nom of passage.themes) {
      const id = identifiant('theme', nom);
      if (!parNom.has(id)) {
        parNom.set(id, {
          id,
          nom,
          description: `Passages du corpus traitant de : ${nom}.`,
          motsCles: [nom],
          references: [],
          entrees: [],
          sourceId: SOURCE_REDACTION,
        });
      }
      parNom.get(id)!.references.push(ref);
    }
  }
  return [...parNom.values()];
}

/**
 * Deux passages partageant un thème sont reliés.
 * Ces liens sont explicitement de type « thème commun » : ils n'affirment
 * aucune dépendance littéraire entre les textes.
 */
function construireReferencesCroisees(): ReferenceCroisee[] {
  const sortie: ReferenceCroisee[] = [];
  const parTheme = new Map<string, { ref: ReferenceBiblique; id: string }[]>();

  for (const passage of passages) {
    const ref = referenceDe(passage.reference);
    if (!ref) continue;
    for (const theme of passage.themes) {
      if (!parTheme.has(theme)) parTheme.set(theme, []);
      parTheme.get(theme)!.push({ ref, id: passage.id });
    }
  }

  for (const [theme, membres] of parTheme) {
    if (membres.length < 2) continue;
    for (let i = 0; i < membres.length; i++) {
      for (let j = i + 1; j < membres.length; j++) {
        sortie.push({
          id: identifiant('rc', theme, membres[i].id, membres[j].id),
          de: membres[i].ref,
          vers: membres[j].ref,
          relation: 'theme-commun',
          note: theme,
          sourceId: SOURCE_REDACTION,
        });
      }
    }
  }
  return sortie;
}

export const moduleRedaction: ModuleConnaissance = {
  id: 'lumiere-redaction-v1',
  source: sourcesParId[SOURCE_REDACTION],
  entrees: construireEntreesLivres(),
  commentaires: construireCommentaires(),
  themes: construireThemes(),
  referencesCroisees: construireReferencesCroisees(),
};

/** Le document de méthode transmis par l'utilisateur, comme source citable. */
export const moduleMethodeOIA: ModuleConnaissance = {
  id: 'methode-oia-v1',
  source: sourcesParId[SOURCE_METHODE_OIA],
  entrees: [
    {
      id: 'methode-oia',
      terme: 'Méthode OIA',
      variantes: ['OIA', 'observation interprétation application'],
      categorie: 'concept',
      motsOriginaux: [],
      definitions: [
        {
          texte: `Méthode d'étude biblique en trois temps. Observation : « Que dit le texte ? » — sept questions (Qui, Où, Quand, Comment, Pourquoi, Quoi, Donc). Interprétation : « Qu'est-ce que le texte veut dire ? » — l'enseignement destiné aux premiers destinataires, la place du texte dans l'histoire du Salut, l'enseignement général adressé à l'Église. Application : « Que dois-je faire ? » — neuf questions dont la réponse n'est pas toujours obligatoire.`,
          sourceId: SOURCE_METHODE_OIA,
          localisation: { section: 'Méthode OIA' },
        },
      ],
      references: [{ livre: 'Luc', chapitre: 8, verset: 22, versetFin: 25 }],
      entreesLiees: [],
      themes: ['étude biblique', 'méthode'],
    },
  ],
  commentaires: [
    {
      id: 'oia-exemple-luc8',
      reference: { livre: 'Luc', chapitre: 8, verset: 22, versetFin: 25 },
      type: 'structure',
      titre: `Exemple travaillé de la méthode OIA`,
      texte: `Observation — Luc, médecin, écrit à l'excellent Théophile ; les personnages sont Jésus et ses disciples ; la scène se passe sur un lac, dans une barque. Devant la tempête, les disciples agissent par peur en réveillant Jésus, qui dormait tranquillement. Interprétation — Le livre de Luc se trouve dans le Nouveau Testament. Jésus est capable de calmer toutes sortes de tempêtes de nos vies ; dans notre marche avec lui, nous découvrons d'autres facettes de sa personne ; il faut lui faire confiance quelles que soient les difficultés. Application — Exemple à ne pas suivre : les disciples qui ont eu peur et manqué de foi au lieu de mettre leur foi en Jésus.`,
      sourceId: SOURCE_METHODE_OIA,
      localisation: { section: 'Exemple : Luc 8:22-25' },
      themes: ['foi', 'peur', 'méthode'],
    },
  ],
};
