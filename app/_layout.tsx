import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { amorcerBaseDeConnaissances } from '../src/knowledge';
import { AppProvider, useApp } from '../src/store/AppContext';

// La base de connaissances est construite une fois, au chargement du module.
amorcerBaseDeConnaissances();

SplashScreen.preventAutoHideAsync().catch(() => {});

function Navigation() {
  const { pret, theme } = useApp();

  useEffect(() => {
    if (pret) SplashScreen.hideAsync().catch(() => {});
  }, [pret]);

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
        <Stack.Screen name="meditation/oia" options={{ headerShown: false }} />
        <Stack.Screen name="meditation/silence" options={{ headerShown: false }} />
        <Stack.Screen name="oia/[id]" options={{ title: 'Étude OIA' }} />
        <Stack.Screen name="oia/nouvelle" options={{ title: 'Commencer', presentation: 'modal' }} />
        <Stack.Screen name="oia/methode" options={{ title: 'La méthode OIA' }} />
        <Stack.Screen name="lire/index" options={{ title: 'Lire la Bible' }} />
        <Stack.Screen name="lire/[livre]/[chapitre]" options={{ title: 'Lecture' }} />
        <Stack.Screen name="recherche" options={{ title: 'Recherche' }} />
        <Stack.Screen name="assistant" options={{ title: 'Questions bibliques' }} />
        <Stack.Screen name="sources" options={{ title: 'Sources documentaires' }} />
        <Stack.Screen name="reference/[ref]" options={{ title: 'Dossier du passage' }} />
        <Stack.Screen name="dictionnaire/[id]" options={{ title: 'Dictionnaire' }} />
        <Stack.Screen name="journal/nouvelle" options={{ title: 'Nouvelle entrée', presentation: 'modal' }} />
        <Stack.Screen name="prieres" options={{ title: 'Mes prières' }} />
        <Stack.Screen name="reglages" options={{ title: 'Réglages' }} />
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
