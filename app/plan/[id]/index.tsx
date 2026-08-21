import { useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import { Alert, Pressable, ScrollView, Text, View } from 'react-native';

import { IconeCoche } from '../../../src/components/icons';
import { Carte, Etiquette, Separateur, SousTitre } from '../../../src/components/ui';
import { getPassage } from '../../../src/data/passages';
import { getPlan } from '../../../src/data/plans';
import { useApp } from '../../../src/store/AppContext';
import { fontSize, radius, spacing } from '../../../src/theme/theme';

export default function DetailPlan() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { theme: t, etat, reinitialiserPlan } = useApp();
  const router = useRouter();
  const plan = getPlan(String(id));

  if (!plan) {
    return (
      <View style={{ flex: 1, backgroundColor: t.colors.background, padding: spacing.xl }}>
        <SousTitre>Ce plan n’existe pas.</SousTitre>
      </View>
    );
  }

  const progression = etat.progressions[plan.id];
  const faits = progression?.joursTermines ?? [];

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: t.colors.background }}
      contentContainerStyle={{ padding: spacing.lg, paddingBottom: spacing.xxxl * 2 }}
      showsVerticalScrollIndicator={false}>
      <Etiquette>{plan.niveau} · {plan.jours.length} jours</Etiquette>
      <Text
        style={{
          color: t.colors.text,
          fontSize: fontSize.title,
          fontWeight: '700',
          marginTop: spacing.sm,
        }}>
        {plan.titre}
      </Text>
      <SousTitre style={{ marginTop: spacing.xs }}>{plan.sousTitre}</SousTitre>
      <Text
        style={{
          color: t.colors.textMuted,
          fontSize: fontSize.md,
          lineHeight: 24,
          marginTop: spacing.lg,
        }}>
        {plan.description}
      </Text>

      <Separateur label={`${faits.length} / ${plan.jours.length} terminés`} />

      {plan.jours.map((j) => {
        const fait = faits.includes(j.jour);
        const passage = getPassage(j.passageId);
        return (
          <Carte
            key={j.jour}
            style={{ marginBottom: spacing.sm }}
            onPress={() => router.push(`/plan/${plan.id}/jour/${j.jour}`)}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.md }}>
              <View
                style={{
                  width: 34,
                  height: 34,
                  borderRadius: 17,
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: fait ? t.colors.success : t.colors.surfaceAlt,
                }}>
                {fait ? (
                  <IconeCoche couleur={t.colors.surface} taille={18} />
                ) : (
                  <Text style={{ color: t.colors.textMuted, fontWeight: '700', fontSize: fontSize.sm }}>
                    {j.jour}
                  </Text>
                )}
              </View>
              <View style={{ flex: 1 }}>
                <Text
                  style={{
                    color: t.colors.text,
                    fontSize: fontSize.md,
                    fontWeight: '600',
                  }}>
                  {j.titre}
                </Text>
                <Text style={{ color: t.colors.textFaint, fontSize: fontSize.xs, marginTop: 2 }}>
                  {passage?.reference ?? ''}
                </Text>
              </View>
            </View>
          </Carte>
        );
      })}

      {progression ? (
        <Pressable
          onPress={() =>
            Alert.alert(
              'Recommencer ce plan ?',
              'Votre progression sera effacée. Vos entrées de journal sont conservées.',
              [
                { text: 'Annuler', style: 'cancel' },
                {
                  text: 'Recommencer',
                  style: 'destructive',
                  onPress: () => reinitialiserPlan(plan.id),
                },
              ],
            )
          }
          style={{ marginTop: spacing.xl, alignSelf: 'center', padding: spacing.md }}>
          <Text style={{ color: t.colors.textFaint, fontSize: fontSize.sm }}>
            Recommencer le plan
          </Text>
        </Pressable>
      ) : null}

      <View
        style={{
          marginTop: spacing.xl,
          padding: spacing.lg,
          borderRadius: radius.lg,
          backgroundColor: t.colors.accentSoft,
        }}>
        <Text style={{ color: t.colors.text, fontSize: fontSize.sm, lineHeight: 21 }}>
          Prenez un jour à la fois. Il vaut mieux dix jours vécus lentement que trente
          survolés.
        </Text>
      </View>
    </ScrollView>
  );
}
