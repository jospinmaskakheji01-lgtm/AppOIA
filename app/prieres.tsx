import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, TextInput, View } from 'react-native';

import { Bouton, Carte, Etiquette, Puce, SousTitre } from '../src/components/ui';
import { SujetPriere, useApp } from '../src/store/AppContext';
import { fontSize, radius, spacing } from '../src/theme/theme';

const CATEGORIES: SujetPriere['categorie'][] = [
  'personnel',
  'famille',
  'église',
  'monde',
  'gratitude',
];

export default function NouvellePriere() {
  const { theme: t, ajouterPriere } = useApp();
  const router = useRouter();
  const [texte, setTexte] = useState('');
  const [categorie, setCategorie] = useState<SujetPriere['categorie']>('personnel');

  const enregistrer = () => {
    if (!texte.trim()) return;
    ajouterPriere(texte.trim(), categorie);
    router.back();
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: t.colors.background }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView
        contentContainerStyle={{ padding: spacing.lg }}
        keyboardShouldPersistTaps="handled">
        <SousTitre>
          « Faites connaître vos besoins à Dieu par des prières et des supplications, avec
          des actions de grâces. » — Philippiens 4:6
        </SousTitre>

        <TextInput
          value={texte}
          onChangeText={setTexte}
          placeholder="Pour qui, pour quoi priez-vous ?"
          placeholderTextColor={t.colors.textFaint}
          multiline
          textAlignVertical="top"
          style={{
            backgroundColor: t.colors.surface,
            borderRadius: radius.md,
            borderWidth: 1,
            borderColor: t.colors.border,
            paddingHorizontal: spacing.lg,
            paddingVertical: spacing.md,
            color: t.colors.text,
            fontSize: fontSize.md,
            minHeight: 130,
            marginTop: spacing.lg,
            lineHeight: 24,
          }}
        />

        <Etiquette>Catégorie</Etiquette>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm, marginTop: spacing.md }}>
          {CATEGORIES.map((c) => (
            <Puce key={c} texte={c} actif={categorie === c} onPress={() => setCategorie(c)} />
          ))}
        </View>

        <Bouton
          titre="Ajouter à mes prières"
          onPress={enregistrer}
          desactive={!texte.trim()}
          style={{ marginTop: spacing.xl }}
        />

        <Carte accent style={{ marginTop: spacing.xl }}>
          <SousTitre>
            Revenez marquer vos prières exaucées. Se souvenir des réponses reçues est l’un
            des exercices les plus fortifiants de la vie chrétienne.
          </SousTitre>
        </Carte>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
