import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';

import { Bouton, Etiquette, Puce, SousTitre } from '../../src/components/ui';
import { useApp } from '../../src/store/AppContext';
import { fontSize, radius, spacing } from '../../src/theme/theme';

const HUMEURS = ['Reconnaissant', 'En paix', 'Fatigué', 'Inquiet', 'Dans l’attente', 'Joyeux'];

export default function NouvelleEntree() {
  const params = useLocalSearchParams<{ reference?: string; titre?: string }>();
  const { theme: t, ajouterEntree } = useApp();
  const router = useRouter();

  const [titre, setTitre] = useState(params.titre ? String(params.titre) : '');
  const [texte, setTexte] = useState('');
  const [humeur, setHumeur] = useState<string | undefined>();
  const reference = params.reference ? String(params.reference) : undefined;

  const enregistrer = () => {
    if (!texte.trim()) return;
    ajouterEntree({ titre: titre.trim(), texte: texte.trim(), reference, humeur });
    router.back();
  };

  const champ = {
    backgroundColor: t.colors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: t.colors.border,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    color: t.colors.text,
    fontSize: fontSize.md,
  } as const;

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: t.colors.background }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView
        contentContainerStyle={{ padding: spacing.lg, paddingBottom: spacing.xxxl }}
        keyboardShouldPersistTaps="handled">
        {reference ? (
          <>
            <Etiquette>À propos de</Etiquette>
            <Text
              style={{
                color: t.colors.text,
                fontSize: fontSize.lg,
                fontWeight: '700',
                marginTop: spacing.xs,
                marginBottom: spacing.lg,
              }}>
              {reference}
            </Text>
          </>
        ) : (
          <SousTitre style={{ marginBottom: spacing.lg }}>
            Qu’est-ce que Dieu vous a dit aujourd’hui ? Une phrase suffit.
          </SousTitre>
        )}

        <TextInput
          value={titre}
          onChangeText={setTitre}
          placeholder="Titre (facultatif)"
          placeholderTextColor={t.colors.textFaint}
          style={champ}
        />

        <TextInput
          value={texte}
          onChangeText={setTexte}
          placeholder="Votre méditation, votre prière, votre question…"
          placeholderTextColor={t.colors.textFaint}
          multiline
          textAlignVertical="top"
          style={[champ, { marginTop: spacing.md, minHeight: 220, lineHeight: 24 }]}
        />

        <Etiquette>Aujourd’hui, je suis</Etiquette>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm, marginTop: spacing.md }}>
          {HUMEURS.map((h) => (
            <Puce
              key={h}
              texte={h}
              actif={humeur === h}
              onPress={() => setHumeur((v) => (v === h ? undefined : h))}
            />
          ))}
        </View>

        <Bouton
          titre="Enregistrer"
          onPress={enregistrer}
          desactive={!texte.trim()}
          style={{ marginTop: spacing.xl }}
        />
        <Bouton
          titre="Annuler"
          variante="discret"
          onPress={() => router.back()}
          style={{ marginTop: spacing.sm }}
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
