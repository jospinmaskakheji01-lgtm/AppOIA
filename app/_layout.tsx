import * as Notifications from 'expo-notifications';
import { Stack, useRouter } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import * as SystemUI from 'expo-system-ui';
import React, { useEffect } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { amorcerBaseDeConnaissances } from '../src/knowledge';
import { AppProvider, useApp } from '../src/store/AppContext';
import { programmerRappel } from '../src/utils/notifications';

// La base de connaissances est construite une fois, au chargement du module.
amorcerBaseDeConnaissances();

SplashScreen.preventAutoHideAsync().catch(() => {});

function Navigation() {
  const { pret, theme, etat } = useApp();
  const router = useRouter();

  useEffect(() => {
    if (pret) SplashScreen.hideAsync().catch(() => {});
  }, [pret]);

  // Le fond que le système peint derrière l'application — la barre de
  // navigation d'Android, et le blanc qui apparaît en fin de défilement. Sans
  // cela, le thème sombre laisse une bande claire en bas de l'écran.
  useEffect(() => {
    SystemUI.setBackgroundColorAsync(theme.colors.background).catch(() => {});
  }, [theme.colors.background]);

  /**
   * Toucher la notification ouvre la méditation du jour.
   *
   * Deux chemins, parce qu'il y a deux cas : l'application était en mémoire, ou
   * elle était fermée. Dans le second, aucun événement n'arrive — il faut aller
   * chercher la réponse qui a lancé l'application.
   */
  useEffect(() => {
    if (!pret) return;
    const ouvrir = (donnees: unknown) => {
      const route = (donnees as { route?: unknown } | undefined)?.route;
      if (typeof route === 'string') router.push(route as never);
    };
    Notifications.getLastNotificationResponseAsync()
      .then((reponse) => {
        if (reponse) ouvrir(reponse.notification.request.content.data);
      })
      .catch(() => {});
    const abonnement = Notifications.addNotificationResponseReceivedListener((reponse) => {
      ouvrir(reponse.notification.request.content.data);
    });
    return () => abonnement.remove();
  }, [pret, router]);

  /**
   * Remettre les rappels d'aplomb à chaque ouverture. Ils annoncent chacun une
   * méditation précise : si le parcours a avancé autrement qu'un par jour, les
   * annonces déjà posées ne correspondent plus.
   */
  useEffect(() => {
    if (!pret || !etat.reglages.rappelActif) return;
    programmerRappel(etat.reglages.rappelHeure, etat.meditationsLues.length).catch(() => {});
  }, [pret, etat.reglages.rappelActif, etat.reglages.rappelHeure, etat.meditationsLues.length]);

  if (!pret) return null;

  return (
    <>
      <StatusBar style={theme.dark ? 'light' : 'dark'} />
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: theme.colors.background },
          headerTintColor: theme.colors.text,
          headerTitleStyle: { fontWeight: '700' },
          headerShadowVisible: false,
          contentStyle: { backgroundColor: theme.colors.background },
        }}>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="passage/[id]" options={{ title: 'Lecture' }} />
        <Stack.Screen name="plan/[id]" options={{ title: 'Plan' }} />
        <Stack.Screen name="plan/[id]/jour/[jour]" options={{ title: 'Étude du jour' }} />
        <Stack.Screen name="etude/index" options={{ title: 'Méthodes d’étude' }} />
        <Stack.Screen name="etude/[id]" options={{ title: 'La méthode' }} />
        <Stack.Screen name="travail/[id]" options={{ title: 'Étude biblique' }} />
        <Stack.Screen name="lecture/[id]" options={{ title: 'Plan de lecture' }} />
        <Stack.Screen name="lecture/[id]/jour/[jour]" options={{ title: 'Lecture du jour' }} />
        <Stack.Screen name="meditation/[id]" options={{ headerShown: false }} />
        <Stack.Screen name="meditation/jour" options={{ headerShown: false }} />
        <Stack.Screen name="meditation/oia" options={{ headerShown: false }} />
        <Stack.Screen name="meditation/silence" options={{ headerShown: false }} />
        <Stack.Screen name="oia/[id]" options={{ title: 'Étude OIA' }} />
        <Stack.Screen name="oia/nouvelle" options={{ title: 'Commencer', presentation: 'modal' }} />
        <Stack.Screen name="oia/methode" options={{ title: 'La méthode OIA' }} />
        <Stack.Screen name="passages" options={{ title: 'Passages préparés' }} />
        <Stack.Screen name="lire/[livre]/[chapitre]" options={{ title: 'Lecture' }} />
        <Stack.Screen name="recherche" options={{ title: 'Recherche' }} />
        <Stack.Screen name="assistant" options={{ title: 'Questions bibliques' }} />
        <Stack.Screen name="sources" options={{ title: 'Sources documentaires' }} />
        <Stack.Screen name="reference/[ref]" options={{ title: 'Dossier du passage' }} />
        <Stack.Screen name="dictionnaire/[id]" options={{ title: 'Dictionnaire' }} />
        <Stack.Screen name="journal/nouvelle" options={{ title: 'Nouvelle entrée', presentation: 'modal' }} />
        <Stack.Screen name="prieres" options={{ title: 'Mes prières' }} />
        <Stack.Screen name="reglages" options={{ title: "Plus" }} />
      </Stack>
    </>
  );
}

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <AppProvider>
        <Navigation />
      </AppProvider>
    </SafeAreaProvider>
  );
}
