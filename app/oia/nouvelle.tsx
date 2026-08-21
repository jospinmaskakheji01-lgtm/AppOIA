import { useRouter } from 'expo-router';
import React, { useMemo, useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, Text, TextInput, View } from 'react-native';

import { Bouton, Carte, Etiquette, Puce, Separateur, SousTitre, Titre } from '../../src/components/ui';
import { passages } from '../../src/data/passages';
import { versetDuJour } from '../../src/data/versets';
import { useApp } from '../../src/store/AppContext';
import { fontSize, radius, spacing } from '../../src/theme/theme';

export default function NouvelleEtude() {
  const { theme: t, creerEtude } = useApp();
  const router = useRouter();
  const [recherche, setRecherche] = useState('');
  const [referenceLibre, setReferenceLibre] = useState('');

  const duJour = useMemo(() => versetDuJour(), []);
  const suggere = duJour.passageId
    ? passages.find((p) => p.id === duJour.passageId)
    : undefined;

  const resultats = useMemo(() => {
    const q = recherche.trim().toLowerCase();
    if (!q) return passages.slice(0, 12);
    return passages.filter(
      (p) =>
        p.reference.toLowerCase().includes(q) ||
        p.book.toLowerCase().includes(q) ||
        p.themes.some((th) => th.includes(q)),
    );
  }, [recherche]);

  const ouvrir = (reference: string, passageId?: string) => {
    const etude = creerEtude({ reference, passageId });
    router.replace(`/oia/${etude.id}`);
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: t.colors.background }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView
        contentContainerStyle={{ padding: spacing.lg, paddingBottom: spacing.xxxl }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}>
        <Etiquette>Observation · Interprétation · Application</Etiquette>
        <Titre style={{ marginTop: spacing.sm }}>Sur quel texte ?</Titre>
        <SousTitre style={{ marginTop: spacing.sm }}>
          Choisissez une portion courte : la méthode OIA demande d’observer en détail, ce
          qui est impossible sur un chapitre entier.
        </SousTitre>

        {suggere ? (
          <>
            <Separateur label="Suggestion du jour" />
            <Carte accent onPress={() => ouvrir(suggere.reference, suggere.id)}>
              <Text style={{ color: t.colors.text, fontSize: fontSize.xl, fontWeight: '700' }}>
                {suggere.reference}
              </Text>
              <SousTitre style={{ marginTop: spacing.xs }}>{suggere.intro}</SousTitre>
            </Carte>
          </>
        ) : null}

        <Separateur label="Dans la bibliothèque" />

        <TextInput
          value={recherche}
          onChangeText={setRecherche}
          placeholder="Rechercher un livre, un thème…"
          placeholderTextColor={t.colors.textFaint}
          style={{
            backgroundColor: t.colors.surface,
            borderRadius: radius.md,
            borderWidth: 1,
            borderColor: t.colors.border,
            paddingHorizontal: spacing.lg,
            paddingVertical: spacing.md,
            color: t.colors.text,
            fontSize: fontSize.md,
            marginBottom: spacing.lg,
          }}
        />

        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm }}>
          {resultats.map((p) => (
            <Puce key={p.id} texte={p.reference} onPress={() => ouvrir(p.reference, p.id)} />
          ))}
        </View>
        {resultats.length === 0 ? (
          <SousTitre>Aucun passage ne correspond. Vous pouvez saisir la référence ci-dessous.</SousTitre>
        ) : null}

        <Separateur label="Ou une autre référence" />

        <SousTitre style={{ marginBottom: spacing.md }}>
          Pour étudier un passage qui n’est pas dans la bibliothèque : lisez-le dans votre
          Bible, et notez ici sa référence.
        </SousTitre>
        <TextInput
          value={referenceLibre}
          onChangeText={setReferenceLibre}
          placeholder="Par exemple : Marc 4:35-41"
          placeholderTextColor={t.colors.textFaint}
          style={{
            backgroundColor: t.colors.surface,
            borderRadius: radius.md,
            borderWidth: 1,
            borderColor: t.colors.border,
            paddingHorizontal: spacing.lg,
            paddingVertical: spacing.md,
            color: t.colors.text,
            fontSize: fontSize.md,
          }}
        />
        <Bouton
          titre="Commencer l’étude"
          onPress={() => ouvrir(referenceLibre.trim())}
          desactive={!referenceLibre.trim()}
          style={{ marginTop: spacing.lg }}
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
