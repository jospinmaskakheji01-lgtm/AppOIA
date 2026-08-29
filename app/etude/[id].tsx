import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, Text, TextInput, View } from 'react-native';

import { Bouton, Carte, Etiquette, Separateur, SousTitre, Titre } from '../../src/components/ui';
import { getMethodeEtude } from '../../src/data/methodes-etude';
import { getSource } from '../../src/knowledge';
import { useApp } from '../../src/store/AppContext';
import { fontSize, radius, spacing } from '../../src/theme/theme';

/**
 * La marche à suivre d'une méthode.
 *
 * L'écran montre le chemin entier avant qu'on s'y engage : les étapes, les
 * questions de chacune, et l'erreur qu'elle sert à éviter. Quelqu'un qui n'a
 * jamais fait d'étude biblique doit pouvoir la lire de bout en bout et savoir
 * ce qui l'attend.
 */
export default function DetailMethode() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { theme: t, creerTravail } = useApp();
  const router = useRouter();
  const methode = getMethodeEtude(String(id));
  const [sujet, setSujet] = useState('');

  if (!methode) {
    return (
      <View style={{ flex: 1, backgroundColor: t.colors.background, padding: spacing.xl }}>
        <SousTitre>Cette méthode est introuvable.</SousTitre>
      </View>
    );
  }

  const commencer = () => {
    const travail = creerTravail(methode.id, sujet.trim());
    router.replace(`/travail/${travail.id}`);
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: t.colors.background }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView
        contentContainerStyle={{ padding: spacing.lg, paddingBottom: spacing.xxxl * 2 }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}>
        <Etiquette>
          {methode.etapes.length} étapes · {methode.duree}
        </Etiquette>
        <Titre style={{ marginTop: spacing.sm }}>{methode.titre}</Titre>
        <SousTitre style={{ marginTop: spacing.xs }}>{methode.sousTitre}</SousTitre>

        <Text
          style={{
            color: t.colors.textMuted,
            fontSize: fontSize.md,
            lineHeight: 24,
            marginTop: spacing.lg,
          }}>
          {methode.description}
        </Text>

        <Carte accent style={{ marginTop: spacing.lg }}>
          <Etiquette>Quand l’utiliser</Etiquette>
          <Text
            style={{
              color: t.colors.text,
              fontSize: fontSize.md,
              lineHeight: 24,
              marginTop: spacing.xs,
            }}>
            {methode.quand}
          </Text>
        </Carte>

        <Separateur label="La marche à suivre" />

        {methode.etapes.map((etape, i) => (
          <View key={etape.cle} style={{ flexDirection: 'row', gap: spacing.md, marginBottom: spacing.xl }}>
            <View style={{ alignItems: 'center' }}>
              <View
                style={{
                  width: 30,
                  height: 30,
                  borderRadius: 15,
                  backgroundColor: t.colors.primary,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <Text style={{ color: t.colors.onPrimary, fontWeight: '800', fontSize: fontSize.sm }}>
                  {i + 1}
                </Text>
              </View>
              {i < methode.etapes.length - 1 ? (
                <View style={{ flex: 1, width: 2, marginTop: 4, backgroundColor: t.colors.border }} />
              ) : null}
            </View>

            <View style={{ flex: 1, paddingBottom: spacing.sm }}>
              <Text style={{ color: t.colors.text, fontSize: fontSize.lg, fontWeight: '700' }}>
                {etape.titre}
              </Text>
              <Text
                style={{
                  color: t.colors.textMuted,
                  fontSize: fontSize.md,
                  lineHeight: 23,
                  marginTop: spacing.xs,
                }}>
                {etape.consigne}
              </Text>

              {etape.questions.map((q) => (
                <View key={q} style={{ flexDirection: 'row', gap: spacing.sm, marginTop: 6 }}>
                  <Text style={{ color: t.colors.accent, fontSize: fontSize.sm }}>›</Text>
                  <Text
                    style={{
                      color: t.colors.textFaint,
                      fontSize: fontSize.sm,
                      flex: 1,
                      lineHeight: 20,
                    }}>
                    {q}
                  </Text>
                </View>
              ))}

              {etape.outil ? (
                <Text
                  style={{
                    color: t.colors.accent,
                    fontSize: fontSize.sm,
                    lineHeight: 20,
                    marginTop: spacing.sm,
                  }}>
                  {etape.outil}
                </Text>
              ) : null}

              {etape.garde ? (
                <View
                  style={{
                    marginTop: spacing.sm,
                    padding: spacing.md,
                    borderRadius: radius.md,
                    backgroundColor: t.colors.accentSoft,
                  }}>
                  <Text style={{ color: t.colors.text, fontSize: fontSize.sm, lineHeight: 21 }}>
                    ⚠ {etape.garde}
                  </Text>
                </View>
              ) : null}
            </View>
          </View>
        ))}

        <Separateur label="Pour aller plus loin" />
        <SousTitre style={{ marginBottom: spacing.md }}>
          Cette marche à suivre est écrite pour l’application. Les ouvrages ci-dessous,
          installés dans votre base, traitent la méthode en détail.
        </SousTitre>
        {methode.pourAllerPlusLoin.map((r) => {
          const source = getSource(r.sourceId);
          return (
            <Carte key={r.sourceId} style={{ marginBottom: spacing.sm }}>
              <Text style={{ color: t.colors.text, fontSize: fontSize.md, fontWeight: '700' }}>
                {source?.titre ?? r.sourceId}
              </Text>
              {source?.auteur ? (
                <Text style={{ color: t.colors.textFaint, fontSize: fontSize.xs, marginTop: 2 }}>
                  {source.auteur}
                </Text>
              ) : null}
              <Text
                style={{
                  color: t.colors.textMuted,
                  fontSize: fontSize.sm,
                  lineHeight: 21,
                  marginTop: spacing.sm,
                }}>
                {r.note}
              </Text>
            </Carte>
          );
        })}

        <Separateur label="Commencer" />
        <SousTitre style={{ marginBottom: spacing.md }}>{methode.objet}</SousTitre>
        <TextInput
          value={sujet}
          onChangeText={setSujet}
          placeholder={`Par exemple : ${methode.exempleSujet}`}
          placeholderTextColor={t.colors.textFaint}
          style={{
            backgroundColor: t.colors.surface,
            borderRadius: radius.md,
            borderWidth: 1,
            borderColor: sujet.trim() ? t.colors.primary : t.colors.border,
            paddingHorizontal: spacing.lg,
            paddingVertical: spacing.md,
            color: t.colors.text,
            fontSize: fontSize.md,
          }}
        />
        <Bouton
          titre="Commencer cette étude"
          onPress={commencer}
          desactive={!sujet.trim()}
          style={{ marginTop: spacing.lg }}
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
