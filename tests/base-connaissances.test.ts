/**
 * Vérification de la base de connaissances.
 * Lancer avec : npm run test:base
 */

import {
  amorcerBaseDeConnaissances,
  analyserReference,
  chapitresDuLivre,
  concordance,
  extraireReferences,
  passagesDuReleve,
  comparerVersions,
  commentairesPour,
  conseilPourQuestion,
  conseilsPour,
  dossierReference,
  enregistrerModule,
  enregistrerVersion,
  estDeuterocanonique,
  formaterReference,
  getEntree,
  getPassage,
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
import {
  CARACTERISTIQUES_APPLICATION,
  exempleOIA,
  questionsApplication,
  questionsInterpretation,
  questionsObservation,
} from '../src/data/oia';
import {
  MOUVEMENTS_SIMPLIFIES,
  progressionSimplifiee,
  questionsA,
  questionsB,
} from '../src/data/oia-simplifiee';
import { genreDuLivre } from '../src/data/genres';
import {
  famillesEtude,
  methodesDeLaFamille,
  methodesEtude,
  progressionTravail,
} from '../src/data/methodes-etude';
import {
  PortionLecture,
  chapitresDuJour,
  formaterPortion,
  formaterPortions,
  plansLecture,
} from '../src/data/plans-lecture';

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

  // ————————————————————————————————————————————————————————————
  // Les deux méthodes, contre les documents de l'École d'Apollos
  // ————————————————————————————————————————————————————————————

  console.log('\nMéthode OIA générale');
  verifier(
    'les sept questions du journaliste, dans l’ordre du document',
    questionsObservation.map((q) => q.cle).join(',') ===
      'qui,quoi,ou,quand,comment,pourquoi,donc',
    questionsObservation.map((q) => q.cle),
  );
  verifier(
    'l’Interprétation pose les trois questions du document révisé',
    questionsInterpretation.map((q) => q.cle).join(',') === 'destinataires,eglise,principes',
    questionsInterpretation.map((q) => q.cle),
  );
  verifier(
    'la question du genre littéraire est bien sous « Comment »',
    questionsObservation
      .find((q) => q.cle === 'comment')!
      .sousQuestions.some((sq) => sq.includes('genre littéraire')),
  );
  verifier(
    'l’Application garde ses neuf questions, toutes facultatives',
    questionsApplication.length === 9 && questionsApplication.every((q) => q.facultative),
    questionsApplication.length,
  );
  verifier(
    'les quatre caractéristiques de l’application sont là',
    CARACTERISTIQUES_APPLICATION.map((c) => c.cle).join(',') ===
      'personnelle,pratique,possible,mesurable',
    CARACTERISTIQUES_APPLICATION.map((c) => c.cle),
  );
  verifier(
    'l’exemple travaillé répond à chaque question d’Observation et d’Interprétation',
    questionsObservation.every((q) => exempleOIA.observation[q.cle].trim().length > 0) &&
      questionsInterpretation.every((q) => exempleOIA.interpretation[q.cle].trim().length > 0),
  );
  const refExemple = analyserReference(exempleOIA.reference);
  verifier(
    'la référence de l’exemple est lisible et retrouve son passage',
    Boolean(refExemple) && getPassage('lsg1910', refExemple!).length === 4,
    refExemple,
  );

  console.log('\nMéthode OIA simplifiée');
  verifier(
    'les trois mouvements : méditez, priez, obéissez',
    MOUVEMENTS_SIMPLIFIES.map((m) => m.cle).join(',') === 'mediter,prier,obeir',
    MOUVEMENTS_SIMPLIFIES.map((m) => m.cle),
  );
  verifier(
    'les huit questions A du document',
    questionsA.length === 8 &&
      questionsA.map((q) => q.cle).join(',') ===
        'sujet,trinite,exemple,ordre,promesse,avertissement,verite,passages',
    questionsA.map((q) => q.cle),
  );
  verifier(
    'les questions B : le verset qui interpelle, puis les quatre axes de prière',
    questionsB.length === 5 &&
      questionsB[0].cle === 'versetInterpellant' &&
      questionsB.slice(1).map((q) => q.cle).join(',') ===
        'repentir,croireObeir,remercier,demander',
    questionsB.map((q) => q.cle),
  );
  verifier(
    'aucune question des deux méthodes n’est laissée sans aide',
    [...questionsA, ...questionsB, ...questionsObservation, ...questionsInterpretation].every(
      (q) => q.aide.trim().length > 0,
    ),
  );
  verifier(
    'la progression d’une méditation vide est nulle, celle d’une méditation remplie entière',
    progressionSimplifiee({}, 'questionsA') === 0 &&
      progressionSimplifiee(
        Object.fromEntries(questionsA.map((q) => [q.cle, 'x'])),
        'questionsA',
      ) === 1,
  );
  verifier(
    'les clés des deux méthodes ne se recouvrent pas dans le stockage',
    questionsA.every((a) => !questionsB.some((b) => b.cle === (a.cle as string))),
  );

  // ————————————————————————————————————————————————————————————
  // Plans de lecture
  // ————————————————————————————————————————————————————————————

  console.log('\nPlans de lecture');

  /** Le texte d'une portion, tel que l'écran du jour l'affichera. */
  function versetsDeLaPortion(p: PortionLecture) {
    if (p.verset !== undefined) {
      return getPassage('lsg1910', {
        livre: p.livre,
        chapitre: p.chapitre,
        verset: p.verset,
        versetFin: p.versetFin,
      });
    }
    const sortie = [];
    for (let c = p.chapitre; c <= (p.chapitreFin ?? p.chapitre); c++) {
      sortie.push(...getPassage('lsg1910', { livre: p.livre, chapitre: c }));
    }
    return sortie;
  }

  verifier('les quinze plans de lecture sont là', plansLecture.length === 15, plansLecture.length);
  verifier(
    'chaque plan annonce le nombre de jours de son titre',
    plansLecture.every((p) => p.sousTitre.startsWith(String(p.jours.length))),
    plansLecture.map((p) => `${p.id}: ${p.jours.length} vs « ${p.sousTitre} »`).filter((x) => {
      const [, n, libelle] = x.match(/: (\d+) vs « (.+) »/) ?? [];
      return libelle && !libelle.startsWith(n);
    }),
  );
  verifier(
    'les journées sont numérotées de 1 à n, sans trou',
    plansLecture.every((p) => p.jours.every((j, i) => j.jour === i + 1)),
  );
  verifier(
    'aucune journée n’est vide',
    plansLecture.every((p) => p.jours.every((j) => j.portions.length > 0)),
    plansLecture
      .flatMap((p) => p.jours.filter((j) => j.portions.length === 0).map((j) => `${p.id} j${j.jour}`))
      .slice(0, 5),
  );

  // La vérification qui compte : une journée qui renverrait à un texte absent
  // de la Segond afficherait un écran vide au lecteur.
  const portionsMuettes: string[] = [];
  let portionsLues = 0;
  for (const plan of plansLecture) {
    for (const jour of plan.jours) {
      for (const portion of jour.portions) {
        portionsLues += 1;
        if (versetsDeLaPortion(portion).length === 0) {
          portionsMuettes.push(`${plan.id} j${jour.jour} — ${formaterPortion(portion)}`);
        }
      }
    }
  }
  verifier(
    `les ${portionsLues} portions de lecture rendent toutes leur texte`,
    portionsMuettes.length === 0,
    portionsMuettes.slice(0, 5),
  );

  // Une portion partielle sans borne de fin laisserait le lecteur deviner où
  // s'arrêter ; une borne inversée ne rendrait rien.
  const bornesFausses = plansLecture.flatMap((p) =>
    p.jours.flatMap((j) =>
      j.portions
        .filter(
          (x) =>
            (x.verset !== undefined && x.versetFin === undefined) ||
            (x.versetFin !== undefined && x.verset === undefined) ||
            (x.versetFin !== undefined && x.verset !== undefined && x.versetFin < x.verset) ||
            (x.chapitreFin !== undefined && x.chapitreFin < x.chapitre),
        )
        .map((x) => `${p.id} j${j.jour} — ${JSON.stringify(x)}`),
    ),
  );
  verifier('les bornes des portions sont complètes et dans l’ordre', bornesFausses.length === 0, bornesFausses.slice(0, 5));

  // Une traversée doit couvrir son corpus sans trou ni répétition : c'est la
  // promesse du plan. On la vérifie sur le plan le plus long.
  const bible = plansLecture.find((p) => p.id === 'lecture-bible-365')!;
  const chapitresLus = bible.jours.flatMap((j) =>
    j.portions.flatMap((p) => {
      const sortie: string[] = [];
      for (let c = p.chapitre; c <= (p.chapitreFin ?? p.chapitre); c++) sortie.push(`${p.livre}|${c}`);
      return sortie;
    }),
  );
  verifier(
    'la Bible en un an couvre les 1 189 chapitres, chacun une seule fois',
    chapitresLus.length === 1189 && new Set(chapitresLus).size === 1189,
    { lus: chapitresLus.length, distincts: new Set(chapitresLus).size },
  );
  const premierJour = bible.jours[0].portions[0];
  const dernierePortion = bible.jours[364].portions[bible.jours[364].portions.length - 1];
  verifier(
    'elle commence à Genèse 1 et finit à Apocalypse 22',
    premierJour.livre === 'Genèse' &&
      premierJour.chapitre === 1 &&
      dernierePortion.livre === 'Apocalypse' &&
      (dernierePortion.chapitreFin ?? dernierePortion.chapitre) === 22,
    [formaterPortions(bible.jours[0].portions), formaterPortions(bible.jours[364].portions)],
  );

  // Le plan sur les enseignements de Jésus est le seul choisi à la main : ses
  // soixante journées doivent toutes porter un titre.
  const jesus = plansLecture.find((p) => p.id === 'lecture-jesus-60')!;
  verifier(
    'les soixante journées sur les enseignements de Jésus portent un titre',
    jesus.jours.length === 60 && jesus.jours.every((j) => Boolean(j.titre?.trim())),
    jesus.jours.filter((j) => !j.titre).length,
  );
  verifier(
    'elles ne tirent que des quatre évangiles',
    jesus.jours.every((j) =>
      j.portions.every((p) => ['Matthieu', 'Marc', 'Luc', 'Jean'].includes(p.livre)),
    ),
  );
  verifier(
    'aucune journée du plan de Jésus n’en répète une autre',
    new Set(jesus.jours.map((j) => formaterPortions(j.portions))).size === 60,
  );
  // Le plan doit couvrir les enseignements sans en perdre : les grands discours
  // de chaque évangile doivent s'y retrouver.
  const referencesJesus = jesus.jours.flatMap((j) => j.portions.map(formaterPortion));
  const attendus = [
    'Matthieu 5:1-16',
    'Matthieu 10:1-42',
    'Matthieu 13:1-52',
    'Matthieu 24:1-51',
    'Matthieu 25:1-46',
    'Marc 4:1-34',
    'Marc 13:1-37',
    'Luc 15:1-32',
    'Luc 16:1-31',
    'Jean 3:1-21',
    'Jean 15:1-27',
    'Jean 17:1-26',
  ];
  const manquants = attendus.filter((r) => !referencesJesus.includes(r));
  verifier('les grands discours des quatre évangiles y sont', manquants.length === 0, manquants);
  verifier(
    'les quatre évangiles sont représentés',
    ['Matthieu', 'Marc', 'Luc', 'Jean'].every((l) =>
      jesus.jours.some((j) => j.portions.some((p) => p.livre === l)),
    ),
  );
  verifier(
    'les passages ne se chevauchent pas',
    (() => {
      const vus = new Set<string>();
      for (const j of jesus.jours) {
        for (const p of j.portions) {
          for (let v = p.verset!; v <= p.versetFin!; v++) {
            const cle = `${p.livre}|${p.chapitre}|${v}`;
            if (vus.has(cle)) return false;
            vus.add(cle);
          }
        }
      }
      return true;
    })(),
  );
  // La règle demandée : une journée, un chapitre. Onze plans sur quinze la
  // tiennent exactement ; les quatre autres ont plus de chapitres que de jours et
  // ne peuvent pas la tenir — ils s'en approchent en donnant à chaque journée le
  // même nombre de chapitres, à une unité près.
  const UN_CHAPITRE_PAR_JOUR = [
    'lecture-ecclesiaste-14',
    'lecture-actes-30',
    'lecture-marc-pierre-30',
    'lecture-hebreux-jude-30',
    'lecture-proverbes-31',
    'lecture-job-42',
    'lecture-jean-60',
    'lecture-luc-actes-60',
    'lecture-evangiles-90',
    'lecture-paul-90',
  ];
  const enFaute = UN_CHAPITRE_PAR_JOUR.filter((id) => {
    const p = plansLecture.find((x) => x.id === id)!;
    return p.jours.some((j) => chapitresDuJour(j.portions) !== 1);
  });
  verifier('dix plans donnent exactement un chapitre par jour', enFaute.length === 0, enFaute);

  const irreguliers = plansLecture
    .filter((p) => p.id !== 'lecture-jesus-60' && p.id !== 'lecture-apotres-90')
    .map((p) => {
      const comptes = p.jours.map((j) => chapitresDuJour(j.portions));
      return { id: p.id, min: Math.min(...comptes), max: Math.max(...comptes) };
    })
    .filter((x) => x.max - x.min > 1);
  verifier(
    'partout ailleurs, les journées ont le même nombre de chapitres à une unité près',
    irreguliers.length === 0,
    irreguliers,
  );

  // Les enseignements des apôtres : les discours des Actes, puis les lettres,
  // sans qu'aucun chapitre de lettre ne manque.
  const apotres = plansLecture.find((p) => p.id === 'lecture-apotres-90')!;
  const discours = apotres.jours.filter((j) => j.titre);
  verifier(
    'le plan des apôtres s’ouvre sur les discours des Actes',
    discours.length > 0 && discours.every((j) => j.portions.every((p) => p.livre === 'Actes')),
    discours.length,
  );
  const chapitresLettres = new Set(
    apotres.jours
      .filter((j) => !j.titre)
      .flatMap((j) =>
        j.portions.flatMap((p) => {
          const sortie: string[] = [];
          for (let c = p.chapitre; c <= (p.chapitreFin ?? p.chapitre); c++)
            sortie.push(`${p.livre}|${c}`);
          return sortie;
        }),
      ),
  );
  verifier(
    'les 121 chapitres des vingt et une lettres y sont, chacun une fois',
    chapitresLettres.size === 121,
    chapitresLettres.size,
  );
  verifier(
    'les discours des Actes sont ceux des apôtres, dans l’ordre du livre',
    discours
      .flatMap((j) => j.portions)
      .every((p, i, tous) => i === 0 || p.chapitre >= tous[i - 1].chapitre),
  );

  // ————————————————————————————————————————————————————————————
  // Les six méthodes d'étude biblique
  // ————————————————————————————————————————————————————————————

  console.log('\nMéthodes d’étude biblique');
  verifier(
    'les quatre familles sont là, dans l’ordre A à D',
    famillesEtude.map((f) => f.lettre).join('') === 'ABCD',
    famillesEtude.map((f) => `${f.lettre} ${f.titre}`),
  );
  verifier(
    'les huit méthodes portent l’identifiant attendu',
    methodesEtude.map((m) => m.id).join(',') ===
      'personnages,thematique-ciblee,thematique-generale,qualites,mots,survol,analyse,contexte',
    methodesEtude.map((m) => m.id),
  );
  verifier(
    'chaque famille contient les méthodes annoncées',
    methodesDeLaFamille('personnages').length === 1 &&
      methodesDeLaFamille('thematique').length === 3 &&
      methodesDeLaFamille('mots').length === 1 &&
      methodesDeLaFamille('livre').length === 3,
    famillesEtude.map((f) => `${f.cle}: ${methodesDeLaFamille(f.cle).length}`),
  );
  const orphelines = methodesEtude.filter(
    (m) => !famillesEtude.some((f) => f.cle === m.famille),
  );
  verifier(
    'aucune méthode ne pointe vers une famille inconnue',
    orphelines.length === 0,
    orphelines.map((m) => `${m.id} → ${m.famille}`),
  );

  // Les étapes doivent être celles de Warren, dans son ordre et à son compte.
  const ETAPES_WARREN: Record<string, [number, number]> = {
    // méthode : [nombre d'étapes, chapitre de l'ouvrage]
    personnages: [10, 5],
    'thematique-ciblee': [6, 4],
    'thematique-generale': [6, 6],
    qualites: [9, 3],
    mots: [8, 7],
    survol: [6, 9],
    analyse: [6, 11],
    contexte: [8, 8],
  };
  const ecarts = methodesEtude
    .map((m) => {
      const [etapes, chapitre] = ETAPES_WARREN[m.id] ?? [0, 0];
      return m.etapes.length === etapes && m.chapitreWarren === chapitre
        ? null
        : `${m.id}: ${m.etapes.length} étapes / ch. ${m.chapitreWarren}, attendu ${etapes} / ch. ${chapitre}`;
    })
    .filter(Boolean);
  verifier(
    'chaque méthode a le compte d’étapes de Warren et cite son chapitre',
    ecarts.length === 0,
    ecarts,
  );

  const etapesIncompletes = methodesEtude.flatMap((m) =>
    m.etapes
      .filter((e) => !e.titre.trim() || !e.consigne.trim() || e.questions.length === 0)
      .map((e) => `${m.id}/${e.cle}`),
  );
  verifier(
    'chaque étape a son titre, sa consigne et au moins une question',
    etapesIncompletes.length === 0,
    etapesIncompletes,
  );
  const clesDoublons = methodesEtude
    .filter((m) => new Set(m.etapes.map((e) => e.cle)).size !== m.etapes.length)
    .map((m) => m.id);
  verifier(
    'les clés d’étape sont uniques dans chaque méthode',
    clesDoublons.length === 0,
    clesDoublons,
  );

  // Une source inconnue afficherait son identifiant brut à l'écran.
  const sourcesInconnues = methodesEtude.flatMap((m) =>
    m.pourAllerPlusLoin.filter((r) => !getSource(r.sourceId)).map((r) => `${m.id} → ${r.sourceId}`),
  );
  verifier(
    'les ouvrages cités par les méthodes sont tous installés',
    sourcesInconnues.length === 0,
    sourcesInconnues,
  );
  const warren = getSource('warren-methodes-etude');
  verifier(
    'l’ouvrage de Rick Warren est enregistré comme source',
    Boolean(warren) && warren?.auteur === 'Rick Warren',
    warren?.titre,
  );
  verifier(
    'chaque méthode renvoie au chapitre de Warren qui l’expose',
    methodesEtude.every((m) =>
      m.pourAllerPlusLoin.some((r) => r.sourceId === 'warren-methodes-etude'),
    ),
    methodesEtude
      .filter((m) => !m.pourAllerPlusLoin.some((r) => r.sourceId === 'warren-methodes-etude'))
      .map((m) => m.id),
  );
  verifier(
    'chaque méthode dit quand l’utiliser et sur quoi elle porte',
    methodesEtude.every((m) => m.quand.trim() && m.objet.trim() && m.exempleSujet.trim()),
  );
  verifier(
    'la progression va de zéro à un',
    methodesEtude.every((m) => {
      const pleines = Object.fromEntries(m.etapes.map((e) => [e.cle, 'x']));
      return progressionTravail(m.id, {}) === 0 && progressionTravail(m.id, pleines) === 1;
    }),
  );
  verifier(
    'une méthode inconnue ne fait pas tomber la progression',
    progressionTravail('inexistante', { a: 'b' }) === 0,
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

  console.log('\nLecture suivie');
  // Lire un livre demande de savoir quels chapitres la version contient : une
  // version partielle ne doit pas proposer des chapitres qu'elle n'a pas.
  verifier('la Segond donne les 50 chapitres de la Genèse', chapitresDuLivre('lsg1910', 'Genèse').length === 50);
  verifier('Parole Vivante ne propose rien en Genèse', chapitresDuLivre('parole-vivante', 'Genèse').length === 0);
  verifier('Louange vivante donne les 150 psaumes', chapitresDuLivre('louange-vivante', 'Psaumes').length === 150);
  verifier(
    'Parole de Vie donne les 14 chapitres de Tobie',
    chapitresDuLivre('parole-de-vie', 'Tobie').length === 14,
    chapitresDuLivre('parole-de-vie', 'Tobie').length,
  );
  // Les chapitres sont rendus dans l'ordre, sans trou : c'est ce qui permet
  // d'enchaîner « chapitre suivant » d'un bout à l'autre d'un livre.
  const suite = chapitresDuLivre('lsg1910', 'Jean');
  verifier('les chapitres se suivent sans trou', suite.every((n, i) => n === i + 1) && suite.length === 21, suite.length);
  // Un chapitre entier se lit d'un appel, sans passer par une référence à versets.
  const jean1 = getPassage('lsg1910', { livre: 'Jean', chapitre: 1 });
  verifier('un chapitre entier est rendu', jean1.length === 51, jean1.length);
  verifier(
    'les versets d’un chapitre sont dans l’ordre',
    jean1.every((v, i) => v.verset === i + 1),
  );

  console.log('\nCitation exacte');
  for (const [citation, attendu] of [
    ['Car Dieu a tant aimé le monde', 'Jean 3:16'],
    ['Toute sagesse vient du Seigneur', 'Siracide 1:1'],
  ] as const) {
    const premier = rechercher(citation, { limite: 5 }).resultats[0];
    const libelle = premier?.genre === 'verset' ? premier.libelle : undefined;
    verifier(`« ${citation} » remonte ${attendu}`, libelle === attendu, [premier?.genre, libelle]);
  }

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
  verifier('les 75 livres du canon long sont couverts', (pdv2?.livres ?? 0) === 75, pdv2?.livres);
  // Les livres deutérocanoniques, chacun complet.
  const deutero = livresCanoniques.filter((l) => l.testament === 'deuterocanonique');
  verifier('le canon compte neuf livres deutérocanoniques', deutero.length === 9, deutero.length);
  const incomplets = deutero.filter((l) => {
    const chapitres = comparerVersions({ livre: l.nom, chapitre: l.chapitres }).find(
      (c) => c.version.id === 'parole-de-vie',
    );
    return !chapitres?.versets.length;
  });
  verifier('chacun est installé jusqu’à son dernier chapitre', incomplets.length === 0, incomplets.map((l) => l.nom));
  // Suzanne et Bel sont les chapitres 13 et 14 de Daniel dans le canon long.
  for (const chapitre of [13, 14]) {
    const dn = comparerVersions({ livre: 'Daniel', chapitre, verset: 1 }).find(
      (c) => c.version.id === 'parole-de-vie',
    );
    verifier(`Daniel ${chapitre} est installé`, Boolean(dn?.versets.length), dn?.versets[0]?.texte?.slice(0, 40));
  }
  // La prière d'Azarias prolonge Daniel 3 bien au-delà du compte de la Segond.
  const azarias = comparerVersions({ livre: 'Daniel', chapitre: 3, verset: 52 }).find(
    (c) => c.version.id === 'parole-de-vie',
  );
  verifier('les additions grecques de Daniel 3 sont installées', Boolean(azarias?.versets.length));
  // C'est le passage qui relève du canon long, pas toujours le livre entier.
  const corpus: [Record<string, unknown>, boolean][] = [
    [{ livre: 'Siracide', chapitre: 1, verset: 1 }, true],
    [{ livre: 'Daniel', chapitre: 13, verset: 1 }, true],
    [{ livre: 'Daniel', chapitre: 3, verset: 52 }, true],
    [{ livre: 'Daniel', chapitre: 3, verset: 1 }, false],
    [{ livre: 'Daniel', chapitre: 12, verset: 1 }, false],
    [{ livre: 'Jean', chapitre: 3, verset: 16 }, false],
  ];
  const mal = corpus.filter(([ref, attendu]) => estDeuterocanonique(ref as never) !== attendu);
  verifier(
    'le canon long est signalé au passage près',
    mal.length === 0,
    mal.map(([ref]) => ref),
  );
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

  console.log('\nConcordance');
  const segond = versionsDisponibles().find((v) => v.abreviation === 'LSG');
  const relDaniel = segond ? concordance('Daniel', segond.id) : undefined;
  verifier('le nom est relevé dans la version complète', (relDaniel?.total ?? 0) > 50, relDaniel?.total);
  verifier(
    'le relevé couvre les livres hors du livre de Daniel',
    (relDaniel?.livres.length ?? 0) >= 4,
    relDaniel?.livres.map((l) => l.livre),
  );
  verifier(
    'chaque verset relevé contient bien le mot',
    (relDaniel?.livres ?? []).every((l) =>
      l.versets.every((v) => v.texte.toLowerCase().includes('daniel')),
    ),
  );
  verifier(
    'les livres sortent dans l’ordre du canon',
    (relDaniel?.livres ?? []).every((l, i, tous) => i === 0 || tous[i - 1].rang < l.rang),
    relDaniel?.livres.map((l) => l.livre),
  );
  // Le relevé serait faux s'il attrapait les mots qui commencent pareil : la
  // tribu de Dan n'est pas le prophète Daniel.
  const relDan = segond ? concordance('Dan', segond.id) : undefined;
  verifier(
    'le mot cherché doit être entier',
    (relDan?.livres ?? []).every((l) => l.livre !== 'Daniel') && (relDan?.total ?? 0) > 0,
    relDan?.livres.map((l) => l.livre),
  );
  verifier(
    'une version absente ne rend rien plutôt qu’un relevé vide trompeur',
    concordance('Daniel', 'version-inexistante') === undefined,
  );

  // La liste reportée dans la réponse doit être relisible par l'application
  // elle-même : sans quoi les passages ne remontent pas aux étapes suivantes.
  const passagesDaniel = relDaniel ? passagesDuReleve(relDaniel) : [];
  verifier(
    'un livre qui nomme peu le sujet donne ses versets',
    passagesDaniel.some((r) => r.livre === 'Ézéchiel' && r.verset !== undefined),
    passagesDaniel.filter((r) => r.livre === 'Ézéchiel').map(formaterReference),
  );
  verifier(
    'un livre qui le nomme partout donne ses chapitres',
    passagesDaniel.filter((r) => r.livre === 'Daniel').every((r) => r.verset === undefined),
  );
  const listeEcrite = passagesDaniel.map(formaterReference).join(', ');
  verifier(
    'la liste écrite se relit intégralement',
    extraireReferences(listeEcrite).map(formaterReference).join(', ') === listeEcrite,
    { ecrit: listeEcrite.slice(0, 120), relu: extraireReferences(listeEcrite).map(formaterReference).join(', ').slice(0, 120) },
  );

  console.log('\nRéférences citées dans un texte libre');
  const citations = extraireReferences(
    `Daniel 1 à 3 racontent sa jeunesse. Voir aussi Dn 9:1-19, Ézéchiel 14:14 et Matthieu 24:15.`,
  ).map(formaterReference);
  verifier(
    'les chapitres d’une plage sont développés un à un',
    ['Daniel 1', 'Daniel 2', 'Daniel 3'].every((r) => citations.includes(r)),
    citations,
  );
  verifier(
    'une abréviation suivie d’un mot de liaison est reconnue',
    citations.includes('Daniel 9:1-19') && citations.includes('Matthieu 24:15'),
    citations,
  );
  verifier('les accents ne gênent pas', citations.includes('Ézéchiel 14:14'), citations);
  verifier(
    'les nombres qui ne sont pas des références sont laissés de côté',
    extraireReferences('Il a vécu 70 ans, ce qui fait 3 générations.').length === 0,
  );
  verifier(
    'un livre au nom composé est reconnu',
    extraireReferences('Voir Cantique des cantiques 2 et 1 Corinthiens 13').map(formaterReference)
      .join(' · ') === 'Cantique des cantiques 2 · 1 Corinthiens 13',
    extraireReferences('Voir Cantique des cantiques 2 et 1 Corinthiens 13').map(formaterReference),
  );

  console.log('\nLes étapes qui ouvrent un outil');
  const avecAtelier = methodesEtude.flatMap((m) =>
    m.etapes.filter((e) => e.atelier).map((e) => `${m.id}/${e.cle}`),
  );
  verifier('les étapes de relevé ouvrent la concordance', avecAtelier.length === 4, avecAtelier);
  verifier(
    'toute étape qui ouvre un outil l’annonce aussi en toutes lettres',
    methodesEtude.every((m) => m.etapes.every((e) => !e.atelier || Boolean(e.outil))),
  );

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
