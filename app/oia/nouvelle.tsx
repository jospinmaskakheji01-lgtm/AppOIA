import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useMemo, useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, Text, TextInput, View } from 'react-native';

import { Bouton, Carte, Etiquette, Puce, Separateur, SousTitre, Titre } from '../../src/components/ui';
import { passages } from '../../src/data/passages';
import { versetDuJour } from '../../src/data/versets';
import { MethodeOIA, useApp } from '../../src/store/AppContext';
import { fontSize, radius, spacing } from '../../src/theme/theme';

/**
 * Ce que chaque méthode demande, et ce qu'elle donne. Le document de référence
 * réserve l'OIA générale à l'étude biblique et l'OIA simplifiée à la méditation
 * personnelle : la distinction est celle du temps disponible.
 */
const METHODES: {
  cle: MethodeOIA;
  titre: string;
  duree: string;
  description: string;
}[] = [
  {
    cle: 'simplifiee',
    titre: 'Méditation quotidienne',
    duree: '5 à 15 min',
    description: `La méthode OIA simplifiée : deux séries de questions, la prière, puis l'obéissance. C'est celle que les étudiants utilisent pour leur méditation.`,
  },
  {
    cle: 'generale',
    titre: 'Étude biblique complète',
    duree: '1 à 2 h',
    description: `La méthode OIA générale : les sept questions de l'Observation, les trois de l'Interprétation, les neuf de l'Application.`,
  },
];

export default function NouvelleEtude() {
  const { methode: methodeParam } = useLocalSearchParams<{ methode?: string }>();
  const { theme: t, creerEtude } = useApp();
  const router = useRouter();
  const [recherche, setRecherche] = useState('');
  const [referenceLibre, setReferenceLibre] = useState('');
  const [methode, setMethode] = useState<MethodeOIA>(
    methodeParam === 'generale' ? 'generale' : 'simplifiee',
  );

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
    const etude = creerEtude({ reference, passageId, methode });
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
        <Titre style={{ marginTop: spacing.sm }}>Quelle méthode ?</Titre>

        <View style={{ gap: spacing.md, marginTop: spacing.lg }}>
          {METHODES.map((m) => {
            const actif = m.cle === methode;
            return (
              <Carte key={m.cle} accent={actif} onPress={() => setMethode(m.cle)}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.md }}>
                  <View
                    style={{
                      width: 20,
                      height: 20,
                      borderRadius: 10,
                      borderWidth: 2,
                      borderColor: actif ? t.colors.primary : t.colors.border,
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                    {actif ? (
                      <View
                        style={{
                          width: 10,
                          height: 10,
                          borderRadius: 5,
                          backgroundColor: t.colors.primary,
                        }}
                      />
                    ) : null}
                  </View>
                  <Text
                    style={{
                      color: t.colors.text,
                      fontSize: fontSize.lg,
                      fontWeight: '700',
                      flex: 1,
                    }}>
                    {m.titre}
                  </Text>
                  <Text style={{ color: t.colors.accent, fontSize: fontSize.sm, fontWeight: '700' }}>
                    {m.duree}
                  </Text>
                </View>
                <SousTitre style={{ marginTop: spacing.sm }}>{m.description}</SousTitre>
              </Carte>
            );
          })}
        </View>

        <Titre style={{ marginTop: spacing.xxl }}>Sur quel texte ?</Titre>
        <SousTitre style={{ marginTop: spacing.sm }}>
          {methode === 'generale'
            ? `Choisissez une portion courte : la méthode OIA demande d’observer en détail, ce qui est impossible sur un chapitre entier.`
            : `Le passage du jour, ou celui de votre calendrier de lecture.`}
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
          titre={methode === 'generale' ? 'Commencer l’étude' : 'Commencer la méditation'}
          onPress={() => ouvrir(referenceLibre.trim())}
          desactive={!referenceLibre.trim()}
          style={{ marginTop: spacing.lg }}
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
