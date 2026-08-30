import { Tabs } from 'expo-router';
import React from 'react';
import { StyleSheet } from 'react-native';

import {
  IconeAube,
  IconeCroix,
  IconeLivre,
  IconePlume,
  IconeSouffle,
} from '../../src/components/icons';
import { useTheme } from '../../src/store/AppContext';

/**
 * L'onglet Bible est le premier, et c'est l'écran d'ouverture : on ouvre une
 * application biblique pour lire la Bible. « Aujourd'hui » — le verset du jour,
 * la série, les reprises — vient juste après.
 */
export default function TabsLayout() {
  const t = useTheme();
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: t.colors.primary,
        tabBarInactiveTintColor: t.colors.textFaint,
        tabBarStyle: {
          backgroundColor: t.colors.surface,
          borderTopColor: t.colors.border,
          borderTopWidth: StyleSheet.hairlineWidth,
          height: 88,
          paddingTop: 8,
        },
        tabBarLabelStyle: { fontSize: 10, lineHeight: 15, fontWeight: '600', marginTop: 2 },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Bible',
          tabBarIcon: ({ color }) => <IconeLivre couleur={color} taille={24} />,
        }}
      />
      <Tabs.Screen
        name="aujourdhui"
        options={{
          title: 'Aujourd’hui',
          tabBarIcon: ({ color }) => <IconeAube couleur={color} taille={24} />,
        }}
      />
      <Tabs.Screen
        name="mediter"
        options={{
          title: 'Méditer',
          tabBarIcon: ({ color }) => <IconeSouffle couleur={color} taille={24} />,
        }}
      />
      <Tabs.Screen
        name="etudier"
        options={{
          title: 'Étudier',
          tabBarIcon: ({ color }) => <IconeCroix couleur={color} taille={24} />,
        }}
      />
      <Tabs.Screen
        name="journal"
        options={{
          title: 'Journal',
          tabBarIcon: ({ color }) => <IconePlume couleur={color} taille={24} />,
        }}
      />
    </Tabs>
  );
}
