/**
 * Vérification de la base de connaissances.
 * Lancer avec : npm run test:base
 */

import {
  amorcerBaseDeConnaissances,
  analyserReference,
  comparerVersions,
  commentairesPour,
  conseilPourQuestion,
  conseilsPour,
  dossierReference,
  enregistrerModule,
  enregistrerVersion,
  formaterReference,
  getEntree,
  getSource,
  livresCanoniques,
  rassemblerContexte,
  rechercher,
  statistiquesBase,
  statistiquesVersion,
  tousLesCommentaires,
  tousLesConseils,
  versionsDisponibles,
} from '../src/knowledge';
import { AssistantLocal } from '../src/knowledge/assistant';
import { questionsApplication } from '../src/data/oia';
import { genreDuLivre } from '../src/data/genres';

let echecs = 0;
function verifier(nom: string, condition: boolean, detail?: unknown): void {
  if (condition) {
    console.log(`  ok   ${nom}`);
  } else {
    echecs += 1;
    console.log(`  ÉCHEC ${nom}${detail === undefined ? '' : ` — ${JSON.stringify(detail)}`}`);
  }
}

async function principal(): Promise<void> {
  console.log('\nAmorçage');
  const rapport = amorcerBaseDeConnaissances();
  verifier('les modules sont enregistrés', rapport.modules >= 3, rapport.modules);
  verifier(
    'aucune anomalie bloquante',
    rapport.anomalies.every((a) => a.gravite !== 'erreur'),
    rapport.anomalies,
  );
  verifier(
    'aucune anomalie liée à la provenance',
    !rapport.anomalies.some((a) => /droit|licence|provenance/i.test(a.message)),
    rapport.anomalies,
  );

  console.log('\nAnalyse des références');
  const cas: [string, string | undefined][] = [
    ['Jean 3:16', 'Jean 3:16'],
    ['Jn 3.16-21', 'Jean 3:16-21'],
    ['1 Corinthiens 13', '1 Corinthiens 13'],
    ['1co 13:4', '1 Corinthiens 13:4'],
    ['Ps 23', 'Psaumes 23'],
    ['psaume 23:1', 'Psaumes 23:1'],
    ['Esaie 40:31', 'Ésaïe 40:31'],
    ['Luc 8:22-25', 'Luc 8:22-25'],
    ['Bidule 4:2', undefined],
  ];
  for (const [entree, attendu] of cas) {
    const ref = analyserReference(entree);
    const obtenu = ref ? formaterReference(ref) : undefined;
    verifier(`« ${entree} » → ${attendu ?? 'non reconnu'}`, obtenu === attendu, obtenu);
  }

  console.log('\nLouis Segond 1910 — texte intégral');
  const lsg = statistiquesVersion('lsg1910');
  verifier('la version est installée', Boolean(lsg), lsg?.versets);
  verifier('les 66 livres sont couverts', (lsg?.livres ?? 0) === 66, lsg?.livres);
  verifier('le compte des versets est celui du canon', lsg?.versets === 31102, lsg?.versets);
  // Trois passages hors des 48 du corpus d'origine : ils étaient inaccessibles avant.
  for (const [livre, chapitre, verset] of [
    ['Ézéchiel', 37, 1],
    ['Abdias', 1, 21],
    ['3 Jean', 1, 14],
  ] as const) {
    const rendu = comparerVersions({ livre, chapitre, verset });
    const lu = rendu.find((r) => r.version.id === 'lsg1910');
    verifier(
      `${livre} ${chapitre}:${verset} est lisible`,
      Boolean(lu?.versets.length),
      lu?.versets[0]?.texte?.slice(0, 40),
    );
  }

  console.log('\nVersions bibliques');
  const versions = versionsDisponibles();
  verifier('au moins une version installée', versions.length >= 1, versions.length);
  const stats = statistiquesVersion(versions[0].id);
  verifier('la version contient des versets', stats.versets > 300, stats);
  const pv = versions.find((v) => v.id === 'parole-vivante');
  verifier('le Nouveau Testament Parole Vivante est installé', Boolean(pv), versions.map((v) => v.abreviation));
  if (pv) {
    const statsPV = statistiquesVersion(pv.id);
    verifier('les 27 livres du NT sont présents', statsPV.livres === 27, statsPV);
    verifier('le compte de versets est proche du canon', Math.abs(statsPV.versets - 7957) < 60, statsPV.versets);
  }
  const compare = comparerVersions({ livre: 'Jean', chapitre: 3, verset: 16 });
  verifier('Jean 3:16 est trouvé', compare[0]?.versets.length === 1, compare[0]?.versets.length);
  verifier(
    'le texte de Jean 3:16 est le bon',
    compare[0]?.versets[0]?.texte.startsWith('Car Dieu a tant aimé le monde'),
    compare[0]?.versets[0]?.texte.slice(0, 40),
  );

  console.log('\nRegistre');
  const base = statistiquesBase();
  verifier('des entrées de dictionnaire existent', base.entrees > 40, base.entrees);
  verifier('des commentaires existent', base.commentaires > 100, base.commentaires);
  verifier('des références croisées existent', base.referencesCroisees > 10, base.referencesCroisees);
  verifier('des thèmes existent', base.themes > 20, base.themes);

  console.log('\nPetit Dictionnaire Biblique');
  const pdb = getSource('petit-dictionnaire-biblique');
  verifier('la source du dictionnaire est enregistrée', Boolean(pdb), pdb?.titre);
  const agape = getEntree('agape');
  verifier('une entrée du dictionnaire est présente', Boolean(agape), agape?.terme);
  verifier(
    'la translittération grecque est captée',
    Boolean(agape?.motsOriginaux.some((m) => m.translitteration === 'agapè')),
    agape?.motsOriginaux.map((m) => m.translitteration),
  );
  const centurion = getEntree('centurion');
  verifier(
    'une entrée à deux sous-sources porte deux définitions',
    (centurion?.definitions.length ?? 0) >= 2,
    centurion?.definitions.map((d) => d.nuance),
  );
  verifier(
    'chaque définition indique sa page',
    Boolean(centurion?.definitions.every((d) => Boolean(d.localisation?.page))),
    centurion?.definitions.map((d) => d.localisation?.page),
  );
  const jerusalemPDB = getEntree('jerusalem');
  verifier(
    'les références du dictionnaire sont normalisées',
    (jerusalemPDB?.references.length ?? 0) > 0,
    jerusalemPDB?.references.slice(0, 3).map((r) => formaterReference(r)),
  );

  console.log('\nSagesse vivante — introductions');
  const sv = getSource('sagesse-vivante');
  verifier('la source des introductions est enregistrée', Boolean(sv), sv?.auteur);
  for (const livre of ['Cantique des cantiques', 'Job', 'Proverbes', 'Ecclésiaste']) {
    const commentaires = commentairesPour({ livre, chapitre: 1, verset: 1 }).filter(
      (c) => c.sourceId === 'sagesse-vivante',
    );
    verifier(`l'introduction à ${livre} est rattachée au livre`, commentaires.length > 0, commentaires.length);
  }

  console.log('\nConseils de méthode');
  const conseils = tousLesConseils();
  verifier('des conseils sont enregistrés', conseils.length > 0, conseils.length);
  verifier(
    'chaque conseil cite une source connue',
    conseils.every((c) => Boolean(getSource(c.sourceId))),
    conseils.filter((c) => !getSource(c.sourceId)).map((c) => c.id),
  );
  verifier(
    'les quatre ouvrages de méthode sont représentés',
    new Set(conseils.map((c) => c.sourceId)).size >= 4,
    [...new Set(conseils.map((c) => c.sourceId))],
  );
  for (const temps of ['observation', 'interpretation', 'application'] as const) {
    verifier(`le temps « ${temps} » a des conseils`, conseilsPour(temps).length > 0);
  }
  // Un conseil rattaché à un genre ne doit pas déborder sur un autre genre.
  const psaume = conseilsPour('interpretation', 'psaume');
  const epitre = conseilsPour('interpretation', 'epitre');
  verifier(
    'les règles de genre ne se mélangent pas',
    psaume.some((c) => c.genre === 'psaume') &&
      epitre.some((c) => c.genre === 'epitre') &&
      !psaume.some((c) => c.genre === 'epitre'),
    { psaume: psaume.length, epitre: epitre.length },
  );
  verifier(
    'sans genre, seuls les conseils généraux sont donnés',
    conseilsPour('interpretation').every((c) => !c.genre),
  );
  verifier(
    'le genre du livre est connu pour les Psaumes et pour Romains',
    genreDuLivre('Psaumes') === 'psaume' && genreDuLivre('Romains') === 'epitre',
    [genreDuLivre('Psaumes'), genreDuLivre('Romains')],
  );
  const sansConseil = questionsApplication.filter((q) => !conseilPourQuestion(q.cle));
  verifier(
    'chacune des neuf questions d’Application porte le commentaire de son auteur',
    sansConseil.length === 0,
    sansConseil.map((q) => q.cle),
  );

  console.log('\nCommentaire du disciple — Ancien Testament');
  const cbd = getSource('macdonald-commentaire-at');
  verifier('la source est enregistrée', Boolean(cbd), cbd?.auteur);
  // Un commentaire par livre, sur les trente-neuf de l'Ancien Testament.
  const sansCommentaire = livresCanoniques
    .filter((l) => l.testament === 'ancien')
    .filter(
      (l) =>
        !tousLesCommentaires().some(
          (c) => c.sourceId === 'macdonald-commentaire-at' && c.reference.livre === l.nom,
        ),
    )
    .map((l) => l.nom);
  verifier('les 39 livres de l’Ancien Testament sont commentés', sansCommentaire.length === 0, sansCommentaire);
  // Chaque commentaire renvoie à sa page : c'est ce qui rend la citation vérifiable.
  const sansPage = tousLesCommentaires().filter(
    (c) => c.sourceId === 'macdonald-commentaire-at' && !c.localisation?.page,
  );
  verifier('chaque commentaire porte son numéro de page', sansPage.length === 0, sansPage.length);
  for (const [livre, chapitre, verset] of [
    ['Ésaïe', 53, 5],
    ['Psaumes', 23, 1],
    ['Genèse', 1, 1],
  ] as const) {
    const trouves = commentairesPour({ livre, chapitre, verset }).filter(
      (c) => c.sourceId === 'macdonald-commentaire-at',
    );
    verifier(`${livre} ${chapitre}:${verset} est commenté`, trouves.length > 0, trouves.length);
  }

  console.log('\nDossier de référence (exemple Jean 3:16)');
  const dossier = dossierReference({ livre: 'Jean', chapitre: 3, verset: 16 });
  verifier('des commentaires sont rattachés', dossier.commentaires.length > 0, dossier.commentaires.length);
  verifier('des entrées de dictionnaire sont rattachées', dossier.entrees.length > 0, dossier.entrees.length);
  verifier('des références croisées sont rattachées', dossier.referencesCroisees.length > 0, dossier.referencesCroisees.length);
  verifier('les sources sont identifiées', dossier.sources.length > 0, dossier.sources.map((s) => s.abreviation));

  console.log('\nRecherche');
  const parMot = rechercher('pardon');
  verifier('« pardon » renvoie des résultats', parMot.resultats.length > 0, parMot.compte);
  verifier('les versets sont présents', parMot.compte.verset > 0, parMot.compte.verset);
  verifier('les définitions sont présentes', parMot.compte.definition > 0, parMot.compte.definition);
  verifier(
    'chaque résultat porte sa nature',
    parMot.resultats.every((r) => r.nature === 'texte-biblique' || r.nature === 'source-documentaire'),
  );

  const parReference = rechercher('Jean 3:16');
  verifier('une référence est détectée', Boolean(parReference.referenceDetectee), parReference.referenceDetectee);
  verifier(
    'le verset exact arrive en tête',
    parReference.resultats[0]?.genre === 'verset',
    parReference.resultats[0]?.genre,
  );

  const parGrec = rechercher('agapè');
  verifier('la recherche par translittération fonctionne', parGrec.compte.definition > 0, parGrec.compte.definition);

  const parAccent = rechercher('esperance');
  verifier('la recherche est insensible aux accents', parAccent.resultats.length > 0, parAccent.compte);

  console.log('\nQuestions rédigées');
  const question = rechercher('Que signifie le mot grâce ?');
  verifier('une question rédigée trouve des versets', question.compte.verset > 0, question.compte);
  verifier('une question rédigée trouve des définitions', question.compte.definition > 0, question.compte);
  const exacte = rechercher('lumière du monde');
  const tete = exacte.resultats.find((r) => r.genre === 'verset');
  verifier(
    'une expression exacte remonte le verset qui la contient',
    tete?.genre === 'verset' && tete.texte.toLowerCase().includes('lumière du monde'),
    tete?.genre === 'verset' ? tete.libelle : undefined,
  );

  console.log('\nAssistant local');
  const assistant = new AssistantLocal();
  const reponse = await assistant.repondre('Que signifie la grâce ?');
  verifier('le bloc « texte biblique » est séparé', Array.isArray(reponse.textesBibliques));
  verifier('le bloc « sources » est séparé', Array.isArray(reponse.extraitsSources));
  verifier('aucune synthèse IA hors ligne', reponse.synthese === undefined);
  verifier('des extraits sont retournés', reponse.extraitsSources.length > 0, reponse.extraitsSources.length);
  verifier(
    'chaque extrait cite son ouvrage',
    reponse.extraitsSources.every((e) => Boolean(e.titreOuvrage) && Boolean(e.sourceId)),
  );

  const vide = rassemblerContexte('xqzwv brplk mtyfd');
  verifier('une requête sans résultat est signalée', Boolean(vide.avertissement), vide.avertissement);

  console.log('\nIngestion d’un ouvrage supplémentaire');
  const { moduledicoexemple } = await import('../src/data/modules/dico-exemple');
  const { moduletestfr } = await import('../src/data/versions/testfr');
  const avant = statistiquesBase();
  const anomalies = enregistrerModule(moduledicoexemple);
  enregistrerVersion(moduletestfr);
  const apres = statistiquesBase();
  verifier('le module est accepté', anomalies.every((a) => a.gravite !== 'erreur'), anomalies);
  verifier('la source est enregistrée', apres.sources === avant.sources + 1, [avant.sources, apres.sources]);
  verifier('les commentaires sont indexés', apres.commentaires > avant.commentaires, [avant.commentaires, apres.commentaires]);

  const dossierApres = dossierReference({ livre: 'Jean', chapitre: 3, verset: 16 });
  const sourcesJn316 = dossierApres.sources.map((s) => s.abreviation);
  verifier('le nouvel ouvrage apparaît sur Jean 3:16', sourcesJn316.includes('DBE'), sourcesJn316);
  verifier(
    'les commentaires des deux sources coexistent',
    new Set(dossierApres.commentaires.map((c) => c.sourceId)).size >= 2,
    dossierApres.commentaires.map((c) => c.sourceId),
  );

  console.log('\nComparaison de versions');
  const installees = versionsDisponibles();
  verifier('plusieurs versions sont installées', installees.length >= 2, installees.map((v) => v.abreviation));
  const cote = comparerVersions({ livre: 'Jean', chapitre: 3, verset: 16 });
  const rendues = cote.filter((c) => !c.absent);
  verifier(
    'chaque version rendue porte bien le texte',
    rendues.length >= 2 && rendues.every((c) => c.versets.length > 0),
    cote.map((c) => [c.version.abreviation, c.versets.length]),
  );
  verifier(
    'les textes diffèrent bien entre versions',
    new Set(rendues.map((c) => c.versets[0]?.texte)).size === rendues.length,
    rendues.map((c) => c.version.abreviation),
  );
  const absent = comparerVersions({ livre: 'Genèse', chapitre: 1, verset: 1 });
  verifier(
    'une version qui ne couvre pas le passage est signalée absente',
    absent.some((c) => c.absent),
    absent.map((c) => [c.version.abreviation, c.absent]),
  );

  console.log('\nParole de Vie — Bible entière');
  const pdv2 = statistiquesVersion('parole-de-vie');
  verifier('la version est installée', Boolean(pdv2), pdv2?.versets);
  verifier('les 66 livres sont couverts', (pdv2?.livres ?? 0) === 66, pdv2?.livres);
  // Cette traduction rend souvent plusieurs versets d'un seul tenant. Le bloc
  // déclare sa portée, de sorte que chaque référence de la Segond y mène.
  let atteignables = 0;
  let horsPortee: string[] = [];
  for (const [livre, chapitre, verset] of [
    ['Genèse', 3, 15],
    ['Nombres', 4, 40],
    ['Psaumes', 119, 105],
    ['Ésaïe', 53, 5],
    ['Jean', 3, 16],
    ['Apocalypse', 22, 21],
  ] as const) {
    const bloc = comparerVersions({ livre, chapitre, verset }).find((c) => c.version.id === 'parole-de-vie');
    if (bloc?.versets.length) atteignables += 1;
    else horsPortee.push(`${livre} ${chapitre}:${verset}`);
  }
  verifier('les versets groupés restent atteignables par leur référence', atteignables === 6, horsPortee);
  const gen3 = comparerVersions({ livre: 'Genèse', chapitre: 3, verset: 15 }).find(
    (c) => c.version.id === 'parole-de-vie',
  )?.versets[0];
  verifier(
    'un bloc groupé déclare sa portée',
    gen3?.verset === 14 && gen3?.versetFin === 15,
    [gen3?.verset, gen3?.versetFin],
  );
  // Le même bloc atteint par deux numéros ne doit être rendu qu'une fois.
  const plage = comparerVersions({ livre: 'Genèse', chapitre: 3, verset: 14, versetFin: 15 }).find(
    (c) => c.version.id === 'parole-de-vie',
  );
  verifier('un bloc groupé n’est rendu qu’une fois', plage?.versets.length === 1, plage?.versets.length);

  console.log('\nLouange vivante — les Psaumes');
  const lv = statistiquesVersion('louange-vivante');
  verifier('la version est installée', Boolean(lv), lv?.versets);
  verifier('les 150 psaumes sont couverts', (lv?.chapitres ?? 0) === 150, lv?.chapitres);
  const ps23 = comparerVersions({ livre: 'Psaumes', chapitre: 23, verset: 1 }).find(
    (c) => c.version.id === 'louange-vivante',
  );
  verifier('le Psaume 23 est rendu', Boolean(ps23?.versets.length), ps23?.versets[0]?.texte?.slice(0, 40));
  // Kuen numérote la suscription ; elle est ramenée au verset 0 pour que la
  // référence des versets suivants coïncide avec celle de la Segond.
  const ps22 = comparerVersions({ livre: 'Psaumes', chapitre: 22, verset: 1 });
  const [enLSG, enLV] = ['lsg1910', 'louange-vivante'].map(
    (id) => ps22.find((c) => c.version.id === id)?.versets[0]?.texte ?? '',
  );
  verifier(
    'Psaume 22:1 désigne le même verset dans les deux versions',
    enLSG.includes('pourquoi m') && enLV.includes('pourquoi m'),
    [enLSG.slice(0, 40), enLV.slice(0, 40)],
  );
  // Un livre que cette version ne couvre pas doit être signalé, non inventé.
  const horsPsaumes = comparerVersions({ livre: 'Jean', chapitre: 3, verset: 16 }).find(
    (c) => c.version.id === 'louange-vivante',
  );
  verifier('hors des Psaumes, la version est signalée absente', Boolean(horsPsaumes?.absent));

  console.log('\nFusion de deux sources sur une même entrée');
  const fusion = enregistrerModule({
    id: 'test-fusion',
    source: {
      id: 'source-fusion',
      titre: 'Second dictionnaire',
      langue: 'fr',
      type: 'dictionnaire',
      abreviation: 'SD',
      ajouteLe: '2026-08-22',
    },
    entrees: [
      {
        id: 'grace',
        terme: 'Grâce',
        variantes: [],
        categorie: 'concept',
        motsOriginaux: [],
        definitions: [{ texte: 'Autre perspective sur la grâce.', sourceId: 'source-fusion' }],
        references: [],
        entreesLiees: [],
        themes: [],
      },
    ],
  });
  verifier('la fusion est acceptée', fusion.every((a) => a.gravite !== 'erreur'), fusion);
  const entreeGrace = getEntree('grace');
  const sourcesGrace = new Set(entreeGrace?.definitions.map((d) => d.sourceId));
  verifier(
    'les définitions de plusieurs ouvrages coexistent sur une même entrée',
    sourcesGrace.size >= 2 && sourcesGrace.has('source-fusion'),
    [...sourcesGrace],
  );

  console.log(echecs === 0 ? '\nTout est vert.\n' : `\n${echecs} échec(s).\n`);
  process.exit(echecs === 0 ? 0 : 1);
}

principal().catch((e) => {
  console.error(e);
  process.exit(1);
});
