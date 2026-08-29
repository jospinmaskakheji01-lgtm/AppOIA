import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { useColorScheme } from 'react-native';

import { CleApplication, CleInterpretation, CleObservation } from '../data/oia';
import { CleQuestionA, CleQuestionB } from '../data/oia-simplifiee';
import { Theme, ThemeName, themes } from '../theme/theme';
import { calculerSerie, cleJour } from '../utils/dates';

const CLE_STOCKAGE = '@lumiere/etat-v1';

/**
 * Les deux méthodes du document de référence. La générale est l'étude
 * biblique, qui demande une à deux heures ; la simplifiée est la méditation
 * personnelle quotidienne, qui tient en cinq à quinze minutes.
 */
export type MethodeOIA = 'generale' | 'simplifiee';

/**
 * Un travail conduit sur un passage, selon l'une des deux méthodes.
 *
 * Les deux partagent la référence, l'engagement, le verset à mémoriser et le
 * rattachement à un plan ; les champs propres à chacune restent vides pour
 * l'autre. Une seule entité, pour que les listes, les plans, la série et le
 * partage n'aient pas à connaître la méthode employée.
 */
export interface EtudeOIA {
  id: string;
  /** Méthode employée. Les études d'avant cette distinction sont générales. */
  methode: MethodeOIA;
  /** Passage de la bibliothèque, quand l'étude en part. */
  passageId?: string;
  /** Référence affichée — celle du passage, ou une référence saisie librement. */
  reference: string;
  cree: string;
  modifie: string;
  // — Méthode générale —
  observation: Partial<Record<CleObservation, string>>;
  interpretation: Partial<Record<CleInterpretation, string>>;
  application: Partial<Record<CleApplication, string>>;
  // — Méthode simplifiée —
  /** Les questions A : ce que le passage dit. */
  questionsA?: Partial<Record<CleQuestionA, string>>;
  /** Les questions B : le verset qui interpelle, et les quatre axes de prière. */
  questionsB?: Partial<Record<CleQuestionB, string>>;
  /** Le mouvement « Priez » : la méditation retournée en prière. */
  priere?: string;
  /** Commun aux deux : ce que je décide de mettre en pratique. */
  engagement: string;
  versetMemoire: string;
  terminee: boolean;
  /** Renseignés lorsque l'étude est celle d'une journée de plan. */
  planId?: string;
  jour?: number;
}

/**
 * Un travail conduit selon l'une des six méthodes d'étude biblique.
 *
 * Contrairement à l'étude OIA, dont les champs sont fixés par la méthode, ces
 * six-là n'ont pas les mêmes étapes : les réponses sont donc rangées par clé
 * d'étape, et c'est la méthode qui dit lesquelles attendre.
 */
export interface TravailEtude {
  id: string;
  /** L'une des six méthodes de src/data/methodes-etude.ts. */
  methodeId: string;
  /** Ce sur quoi porte l'étude : « Barnabas », « la grâce », « Philippiens »… */
  sujet: string;
  cree: string;
  modifie: string;
  /** Clé d'étape → réponse. */
  reponses: Record<string, string>;
  terminee: boolean;
}

export interface EntreeJournal {
  id: string;
  date: string;
  titre: string;
  texte: string;
  reference?: string;
  humeur?: string;
}

export interface SujetPriere {
  id: string;
  texte: string;
  categorie: 'personnel' | 'famille' | 'église' | 'monde' | 'gratitude';
  cree: string;
  exauce?: string;
  reponse?: string;
}

export interface ProgressionPlan {
  planId: string;
  joursTermines: number[];
  commence: string;
  dernierJour?: string;
}

export interface Reglages {
  theme: ThemeName | 'systeme';
  rappelActif: boolean;
  rappelHeure: string;
  tailleTexte: number;
  prenom: string;
  /** Version biblique préférée pour la lecture. */
  versionPreferee: string;
  /** Versions affichées côte à côte lors d'une comparaison. */
  versionsComparees: string[];
  /** Dernier chapitre lu, pour reprendre la lecture où elle s'est arrêtée. */
  derniereLecture?: { livre: string; chapitre: number };
  /**
   * Service de synthèse que vous hébergez. Laissé vide, l'application reste
   * hors connexion et l'assistant se limite à la restitution des sources.
   */
  assistantUrl: string;
  assistantJeton: string;
  assistantModele: string;
}

export interface EtatApp {
  joursTermines: string[];
  etudes: EtudeOIA[];
  travaux: TravailEtude[];
  progressions: Record<string, ProgressionPlan>;
  journal: EntreeJournal[];
  prieres: SujetPriere[];
  favoris: string[];
  versetsMemorises: string[];
  minutesMeditation: number;
  seancesTerminees: number;
  reglages: Reglages;
}

const ETAT_INITIAL: EtatApp = {
  joursTermines: [],
  etudes: [],
  travaux: [],
  progressions: {},
  journal: [],
  prieres: [],
  favoris: [],
  versetsMemorises: [],
  minutesMeditation: 0,
  seancesTerminees: 0,
  reglages: {
    theme: 'systeme',
    rappelActif: false,
    rappelHeure: '07:00',
    tailleTexte: 1,
    prenom: '',
    versionPreferee: 'lsg1910',
    versionsComparees: [],
    assistantUrl: '',
    assistantJeton: '',
    assistantModele: 'claude-opus-5',
  },
};

interface ContexteApp {
  etat: EtatApp;
  pret: boolean;
  theme: Theme;
  serie: number;
  marquerJourTermine: (date?: string) => void;
  creerEtude: (init: {
    reference: string;
    /** Par défaut la méthode générale : c'est celle de l'étude biblique. */
    methode?: MethodeOIA;
    passageId?: string;
    planId?: string;
    jour?: number;
  }) => EtudeOIA;
  majEtude: (id: string, champs: Partial<Omit<EtudeOIA, 'id' | 'cree'>>) => void;
  terminerEtude: (id: string) => void;
  supprimerEtude: (id: string) => void;
  etudeDuPlan: (planId: string, jour: number) => EtudeOIA | undefined;
  creerTravail: (methodeId: string, sujet: string) => TravailEtude;
  majTravail: (id: string, reponses: Record<string, string>) => void;
  terminerTravail: (id: string) => void;
  supprimerTravail: (id: string) => void;
  terminerJourPlan: (planId: string, jour: number) => void;
  reinitialiserPlan: (planId: string) => void;
  ajouterEntree: (entree: Omit<EntreeJournal, 'id' | 'date'>) => void;
  supprimerEntree: (id: string) => void;
  ajouterPriere: (texte: string, categorie: SujetPriere['categorie']) => void;
  basculerExauce: (id: string, reponse?: string) => void;
  supprimerPriere: (id: string) => void;
  basculerFavori: (passageId: string) => void;
  basculerMemorise: (ref: string) => void;
  ajouterMeditation: (minutes: number) => void;
  majReglages: (reglages: Partial<Reglages>) => void;
}

const Contexte = createContext<ContexteApp | undefined>(undefined);

function id(): string {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

/**
 * Rattraper les études enregistrées avant la révision du document de méthode.
 *
 * Deux choses ont changé. La méthode n'était pas notée, puisqu'il n'y en avait
 * qu'une : ces études sont générales. Et l'Interprétation ne demande plus « où
 * se situe ce texte dans l'histoire du Salut » mais « quels principes
 * permanents se dégagent du texte » ; ce qui avait été écrit sous l'ancienne
 * question est repris sous la nouvelle, qui est forcément vide, plutôt que
 * perdu.
 */
function migrerEtude(brute: EtudeOIA & { interpretation?: Record<string, string> }): EtudeOIA {
  const { salut, ...interpretation } = (brute.interpretation ?? {}) as Record<string, string>;
  return {
    ...brute,
    methode: brute.methode ?? 'generale',
    interpretation: {
      ...interpretation,
      ...(salut && !interpretation.principes ? { principes: salut } : {}),
    },
  };
}

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [etat, setEtat] = useState<EtatApp>(ETAT_INITIAL);
  const [pret, setPret] = useState(false);
  const schemaSysteme = useColorScheme();

  useEffect(() => {
    let annule = false;
    (async () => {
      try {
        const brut = await AsyncStorage.getItem(CLE_STOCKAGE);
        if (!annule && brut) {
          const charge = JSON.parse(brut) as Partial<EtatApp>;
          setEtat({
            ...ETAT_INITIAL,
            ...charge,
            etudes: (charge.etudes ?? []).map(migrerEtude),
            travaux: charge.travaux ?? [],
            reglages: { ...ETAT_INITIAL.reglages, ...(charge.reglages ?? {}) },
          });
        }
      } catch {
        // Un stockage illisible ne doit jamais empêcher l'application de démarrer.
      } finally {
        if (!annule) setPret(true);
      }
    })();
    return () => {
      annule = true;
    };
  }, []);

  useEffect(() => {
    if (!pret) return;
    AsyncStorage.setItem(CLE_STOCKAGE, JSON.stringify(etat)).catch(() => {});
  }, [etat, pret]);

  const marquerJourTermine = useCallback((date?: string) => {
    const cle = date ?? cleJour();
    setEtat((e) =>
      e.joursTermines.includes(cle)
        ? e
        : { ...e, joursTermines: [...e.joursTermines, cle].sort() },
    );
  }, []);

  const creerEtude = useCallback(
    (init: {
      reference: string;
      methode?: MethodeOIA;
      passageId?: string;
      planId?: string;
      jour?: number;
    }) => {
      const maintenant = new Date().toISOString();
      const etude: EtudeOIA = {
        id: id(),
        methode: init.methode ?? 'generale',
        reference: init.reference,
        passageId: init.passageId,
        planId: init.planId,
        jour: init.jour,
        cree: maintenant,
        modifie: maintenant,
        observation: {},
        interpretation: {},
        application: {},
        questionsA: {},
        questionsB: {},
        priere: '',
        engagement: '',
        versetMemoire: '',
        terminee: false,
      };
      setEtat((e) => ({ ...e, etudes: [etude, ...e.etudes] }));
      return etude;
    },
    [],
  );

  const majEtude = useCallback(
    (etudeId: string, champs: Partial<Omit<EtudeOIA, 'id' | 'cree'>>) => {
      setEtat((e) => ({
        ...e,
        etudes: e.etudes.map((x) =>
          x.id === etudeId ? { ...x, ...champs, modifie: new Date().toISOString() } : x,
        ),
      }));
    },
    [],
  );

  /** Achever une étude vaut journée vécue, et complète la progression du plan associé. */
  const terminerEtude = useCallback((etudeId: string) => {
    const cle = cleJour();
    setEtat((e) => {
      const etude = e.etudes.find((x) => x.id === etudeId);
      if (!etude) return e;
      const etudes = e.etudes.map((x) =>
        x.id === etudeId ? { ...x, terminee: true, modifie: new Date().toISOString() } : x,
      );
      const joursTermines = e.joursTermines.includes(cle)
        ? e.joursTermines
        : [...e.joursTermines, cle].sort();

      if (!etude.planId || etude.jour === undefined) {
        return { ...e, etudes, joursTermines };
      }
      const existante = e.progressions[etude.planId];
      const joursPlan = existante
        ? Array.from(new Set([...existante.joursTermines, etude.jour])).sort((a, b) => a - b)
        : [etude.jour];
      return {
        ...e,
        etudes,
        joursTermines,
        progressions: {
          ...e.progressions,
          [etude.planId]: {
            planId: etude.planId,
            joursTermines: joursPlan,
            commence: existante?.commence ?? cle,
            dernierJour: cle,
          },
        },
      };
    });
  }, []);

  const supprimerEtude = useCallback((etudeId: string) => {
    setEtat((e) => ({ ...e, etudes: e.etudes.filter((x) => x.id !== etudeId) }));
  }, []);

  const creerTravail = useCallback((methodeId: string, sujet: string) => {
    const maintenant = new Date().toISOString();
    const travail: TravailEtude = {
      id: id(),
      methodeId,
      sujet,
      cree: maintenant,
      modifie: maintenant,
      reponses: {},
      terminee: false,
    };
    setEtat((e) => ({ ...e, travaux: [travail, ...e.travaux] }));
    return travail;
  }, []);

  const majTravail = useCallback((travailId: string, reponses: Record<string, string>) => {
    setEtat((e) => ({
      ...e,
      travaux: e.travaux.map((x) =>
        x.id === travailId ? { ...x, reponses, modifie: new Date().toISOString() } : x,
      ),
    }));
  }, []);

  /** Achever un travail d'étude vaut journée vécue, comme une étude OIA. */
  const terminerTravail = useCallback((travailId: string) => {
    const cle = cleJour();
    setEtat((e) => ({
      ...e,
      travaux: e.travaux.map((x) =>
        x.id === travailId ? { ...x, terminee: true, modifie: new Date().toISOString() } : x,
      ),
      joursTermines: e.joursTermines.includes(cle)
        ? e.joursTermines
        : [...e.joursTermines, cle].sort(),
    }));
  }, []);

  const supprimerTravail = useCallback((travailId: string) => {
    setEtat((e) => ({ ...e, travaux: e.travaux.filter((x) => x.id !== travailId) }));
  }, []);

  const etudeDuPlan = useCallback(
    (planId: string, jour: number) =>
      etat.etudes.find((x) => x.planId === planId && x.jour === jour),
    [etat.etudes],
  );

  const terminerJourPlan = useCallback(
    (planId: string, jour: number) => {
      const cle = cleJour();
      setEtat((e) => {
        const existante = e.progressions[planId];
        const joursTermines = existante
          ? Array.from(new Set([...existante.joursTermines, jour])).sort((a, b) => a - b)
          : [jour];
        return {
          ...e,
          joursTermines: e.joursTermines.includes(cle)
            ? e.joursTermines
            : [...e.joursTermines, cle].sort(),
          progressions: {
            ...e.progressions,
            [planId]: {
              planId,
              joursTermines,
              commence: existante?.commence ?? cle,
              dernierJour: cle,
            },
          },
        };
      });
    },
    [],
  );

  const reinitialiserPlan = useCallback((planId: string) => {
    setEtat((e) => {
      const progressions = { ...e.progressions };
      delete progressions[planId];
      return { ...e, progressions };
    });
  }, []);

  const ajouterEntree = useCallback((entree: Omit<EntreeJournal, 'id' | 'date'>) => {
    setEtat((e) => ({
      ...e,
      journal: [{ ...entree, id: id(), date: new Date().toISOString() }, ...e.journal],
    }));
  }, []);

  const supprimerEntree = useCallback((entreeId: string) => {
    setEtat((e) => ({ ...e, journal: e.journal.filter((x) => x.id !== entreeId) }));
  }, []);

  const ajouterPriere = useCallback(
    (texte: string, categorie: SujetPriere['categorie']) => {
      setEtat((e) => ({
        ...e,
        prieres: [
          { id: id(), texte, categorie, cree: new Date().toISOString() },
          ...e.prieres,
        ],
      }));
    },
    [],
  );

  const basculerExauce = useCallback((priereId: string, reponse?: string) => {
    setEtat((e) => ({
      ...e,
      prieres: e.prieres.map((p) =>
        p.id === priereId
          ? p.exauce
            ? { ...p, exauce: undefined, reponse: undefined }
            : { ...p, exauce: new Date().toISOString(), reponse }
          : p,
      ),
    }));
  }, []);

  const supprimerPriere = useCallback((priereId: string) => {
    setEtat((e) => ({ ...e, prieres: e.prieres.filter((p) => p.id !== priereId) }));
  }, []);

  const basculerFavori = useCallback((passageId: string) => {
    setEtat((e) => ({
      ...e,
      favoris: e.favoris.includes(passageId)
        ? e.favoris.filter((f) => f !== passageId)
        : [...e.favoris, passageId],
    }));
  }, []);

  const basculerMemorise = useCallback((ref: string) => {
    setEtat((e) => ({
      ...e,
      versetsMemorises: e.versetsMemorises.includes(ref)
        ? e.versetsMemorises.filter((v) => v !== ref)
        : [...e.versetsMemorises, ref],
    }));
  }, []);

  const ajouterMeditation = useCallback((minutes: number) => {
    const cle = cleJour();
    setEtat((e) => ({
      ...e,
      minutesMeditation: e.minutesMeditation + minutes,
      seancesTerminees: e.seancesTerminees + 1,
      joursTermines: e.joursTermines.includes(cle)
        ? e.joursTermines
        : [...e.joursTermines, cle].sort(),
    }));
  }, []);

  const majReglages = useCallback((reglages: Partial<Reglages>) => {
    setEtat((e) => ({ ...e, reglages: { ...e.reglages, ...reglages } }));
  }, []);

  const theme = useMemo(() => {
    const choix = etat.reglages.theme;
    if (choix === 'systeme') return schemaSysteme === 'dark' ? themes.veillee : themes.aube;
    return themes[choix];
  }, [etat.reglages.theme, schemaSysteme]);

  const serie = useMemo(() => calculerSerie(etat.joursTermines), [etat.joursTermines]);

  const valeur = useMemo<ContexteApp>(
    () => ({
      etat,
      pret,
      theme,
      serie,
      marquerJourTermine,
      creerEtude,
      majEtude,
      terminerEtude,
      supprimerEtude,
      etudeDuPlan,
      creerTravail,
      majTravail,
      terminerTravail,
      supprimerTravail,
      terminerJourPlan,
      reinitialiserPlan,
      ajouterEntree,
      supprimerEntree,
      ajouterPriere,
      basculerExauce,
      supprimerPriere,
      basculerFavori,
      basculerMemorise,
      ajouterMeditation,
      majReglages,
    }),
    [
      etat,
      pret,
      theme,
      serie,
      marquerJourTermine,
      creerEtude,
      majEtude,
      terminerEtude,
      supprimerEtude,
      etudeDuPlan,
      creerTravail,
      majTravail,
      terminerTravail,
      supprimerTravail,
      terminerJourPlan,
      reinitialiserPlan,
      ajouterEntree,
      supprimerEntree,
      ajouterPriere,
      basculerExauce,
      supprimerPriere,
      basculerFavori,
      basculerMemorise,
      ajouterMeditation,
      majReglages,
    ],
  );

  return <Contexte.Provider value={valeur}>{children}</Contexte.Provider>;
}

export function useApp(): ContexteApp {
  const ctx = useContext(Contexte);
  if (!ctx) throw new Error('useApp doit être utilisé dans AppProvider');
  return ctx;
}

export function useTheme(): Theme {
  return useApp().theme;
}
