/**
 * Service de synthèse pour Lumière.
 *
 * Pourquoi ce service existe : une application mobile ne peut pas contenir une
 * clé d'API — elle est extractible du paquet installé. L'application envoie
 * donc ici la question et le contexte qu'elle a rassemblé localement ; ce
 * service, que vous hébergez, détient la clé et renvoie uniquement la synthèse.
 *
 * Contrat d'entrée (POST, JSON) :
 *   { question, modele?, textesBibliques: [{reference, texte, version}],
 *     extraitsSources: [{sourceId, titreOuvrage, auteur?, reference?, localisation?, texte}] }
 *
 * Contrat de sortie (JSON) :
 *   { synthese, modele, sourcesUtilisees: string[], horsSources: boolean }
 *
 * Le service ne renvoie jamais de texte biblique ni d'extraits : l'application
 * les possède déjà et les affiche dans ses propres blocs. La séparation des
 * trois natures de contenu est ainsi garantie par l'architecture, et non par la
 * bonne volonté du modèle.
 *
 *   ANTHROPIC_API_KEY=... [JETON=...] [PORT=8787] node index.mjs
 */

import Anthropic from '@anthropic-ai/sdk';
import { createServer } from 'node:http';

const PORT = Number(process.env.PORT ?? 8787);
const JETON = process.env.JETON;
const MODELE_DEFAUT = process.env.MODELE ?? 'claude-opus-5';

const client = new Anthropic();

const SYSTEME = `Tu assistes un lecteur de la Bible dans une application d'étude biblique chrétienne.

Tu reçois une question, des versets bibliques, et des extraits d'ouvrages de référence.
Tu ne produis QUE la synthèse : l'application affiche déjà les versets et les extraits
dans des blocs séparés du tien, et le lecteur les a sous les yeux.

Règles :
- Appuie-toi d'abord sur les extraits fournis. Cite l'ouvrage entre parenthèses quand tu
  reprends son contenu, par exemple : (Dictionnaire biblique, art. « Grâce »).
- Quand les extraits ne suffisent pas, dis-le explicitement plutôt que de combler le vide.
- Quand deux sources divergent, présente les deux positions sans trancher à leur place.
- Ne présente jamais ton propre raisonnement comme s'il venait du texte biblique ou d'un
  ouvrage. Le lecteur doit pouvoir distinguer ce que dit la Bible, ce que dit un auteur,
  et ce que tu déduis.
- Reste dans le cadre de la foi chrétienne et des sources fournies.
- Réponds en français, en 200 mots maximum, sans titre ni liste à puces.`;

function lireCorps(requete) {
  return new Promise((resoudre, rejeter) => {
    const morceaux = [];
    let taille = 0;
    requete.on('data', (m) => {
      taille += m.length;
      if (taille > 1_000_000) {
        rejeter(new Error('Corps de requête trop volumineux.'));
        requete.destroy();
        return;
      }
      morceaux.push(m);
    });
    requete.on('end', () => {
      try {
        resoudre(JSON.parse(Buffer.concat(morceaux).toString('utf8')));
      } catch {
        rejeter(new Error('JSON invalide.'));
      }
    });
    requete.on('error', rejeter);
  });
}

function construireContexte({ textesBibliques = [], extraitsSources = [] }) {
  const versets = textesBibliques
    .map((t) => `[${t.version ?? 'version'}] ${t.reference} — ${t.texte}`)
    .join('\n');
  const extraits = extraitsSources
    .map((e, i) => {
      const entete = [e.titreOuvrage, e.auteur, e.reference, e.localisation]
        .filter(Boolean)
        .join(', ');
      return `[S${i + 1}] (${entete})\n${e.texte}`;
    })
    .join('\n\n');
  return { versets, extraits };
}

const serveur = createServer(async (requete, reponse) => {
  const repondre = (code, corps) => {
    reponse.writeHead(code, { 'Content-Type': 'application/json; charset=utf-8' });
    reponse.end(JSON.stringify(corps));
  };

  if (requete.method !== 'POST') return repondre(405, { erreur: 'Utilisez POST.' });
  if (JETON && requete.headers.authorization !== `Bearer ${JETON}`) {
    return repondre(401, { erreur: 'Jeton invalide.' });
  }

  let donnees;
  try {
    donnees = await lireCorps(requete);
  } catch (e) {
    return repondre(400, { erreur: e.message });
  }

  const question = String(donnees.question ?? '').trim();
  if (!question) return repondre(400, { erreur: 'Question manquante.' });

  const { versets, extraits } = construireContexte(donnees);
  if (!versets && !extraits) {
    return repondre(200, { synthese: '', modele: null, sourcesUtilisees: [], horsSources: false });
  }

  const modele = donnees.modele || MODELE_DEFAUT;

  try {
    // Le streaming évite les délais d'attente sur les réponses longues ;
    // on n'a besoin ici que du message final.
    const flux = client.messages.stream({
      model: modele,
      max_tokens: 4000,
      thinking: { type: 'adaptive' },
      output_config: { effort: 'medium' },
      system: SYSTEME,
      messages: [
        {
          role: 'user',
          content: [
            `Question : ${question}`,
            versets ? `\nVersets fournis :\n${versets}` : '',
            extraits ? `\nExtraits d'ouvrages :\n${extraits}` : '',
            `\nRédige uniquement la synthèse.`,
          ]
            .filter(Boolean)
            .join('\n'),
        },
      ],
    });
    const message = await flux.finalMessage();

    if (message.stop_reason === 'refusal') {
      return repondre(200, {
        synthese: '',
        modele,
        sourcesUtilisees: [],
        horsSources: false,
        refus: message.stop_details?.category ?? true,
      });
    }

    const texte = message.content
      .filter((bloc) => bloc.type === 'text')
      .map((bloc) => bloc.text)
      .join('\n')
      .trim();

    // Les sources déclarées sont celles qui ont été fournies au modèle.
    // On ne prétend pas deviner lesquelles il a réellement mobilisées.
    const sourcesUtilisees = [
      ...new Set((donnees.extraitsSources ?? []).map((e) => e.sourceId).filter(Boolean)),
    ];

    repondre(200, {
      synthese: texte,
      modele,
      sourcesUtilisees,
      horsSources: /les extraits (fournis )?ne (suffisent|permettent)/i.test(texte),
    });
  } catch (erreur) {
    if (erreur instanceof Anthropic.RateLimitError) {
      return repondre(429, { erreur: 'Limite de débit atteinte, réessayez plus tard.' });
    }
    if (erreur instanceof Anthropic.AuthenticationError) {
      return repondre(500, { erreur: 'Clé d’API invalide côté serveur.' });
    }
    if (erreur instanceof Anthropic.APIError) {
      return repondre(502, { erreur: `Erreur du fournisseur (${erreur.status}).` });
    }
    repondre(500, { erreur: 'Erreur interne.' });
  }
});

serveur.listen(PORT, () => {
  console.log(`Service de synthèse Lumière à l'écoute sur le port ${PORT}.`);
  console.log(`Modèle par défaut : ${MODELE_DEFAUT}`);
  if (!JETON) console.log(`⚠  Aucun JETON défini : le service accepte toutes les requêtes.`);
});
