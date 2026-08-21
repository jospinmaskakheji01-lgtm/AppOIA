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

import { Theme, ThemeName, themes } from '../theme/theme';
import { calculerSerie, cleJour } from '../utils/dates';

const CLE_STOCKAGE = '@lumiere/etat-v1';

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
}

export interface EtatApp {
  joursTermines: string[];
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
  },
};

interface ContexteApp {
  etat: EtatApp;
  pret: boolean;
  theme: Theme;
  serie: number;
  marquerJourTermine: (date?: string) => void;
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
