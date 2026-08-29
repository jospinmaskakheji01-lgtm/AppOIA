import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useMemo, useRef } from 'react';
import { Alert, FlatList, Pressable, Text, View } from 'react-native';

import { IconeCoche } from '../../../src/components/icons';
import { Bouton, Carte, Etiquette, SousTitre } from '../../../src/components/ui';
import {
  JourLecture,
  chapitresDuJour,
  formaterPortions,
  getPlanLecture,
} from '../../../src/data/plans-lecture';
import { useApp } from '../../../src/store/AppContext';
import { fontSize, radius, spacing } from '../../../src/theme/theme';

/**
 * Le sommaire d'un plan de lecture.
 *
 * La liste est virtualisée : « La Bible en un an » compte trois cent
 * soixante-cinq journées, et les rendre toutes d'un coup rendrait l'écran
 * poussif sur un téléphone modeste.
 */
export default function DetailPlanLecture() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { theme: t, etat, reinitialiserPlan } = useApp();
  const router = useRouter();
  const plan = getPlanLecture(String(id));
  const liste = useRef<FlatList<JourLecture>>(null);

  const progression = plan ? etat.progressions[plan.id] : undefined;
  const faits = useMemo(() => new Set(progression?.joursTermines ?? []), [progression]);

  if (!plan) {
    return (
      <View style={{ flex: 1, backgroundColor: t.colors.background, padding: spacing.xl }}>
        <SousTitre>Ce plan n’existe pas.</SousTitre>
      </View>
    );
  }

  const prochain = plan.jours.find((j) => !faits.has(j.jour)) ?? plan.jours[0];
  const termine = faits.size >= plan.jours.length;

  const entete = (
    <View>
      <Etiquette>
        {plan.jours.length} jours · {plan.parcours}
      </Etiquette>
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

      <Bouton
        titre={
          termine
            ? 'Plan terminé — relire le jour 1'
            : faits.size > 0
              ? `Reprendre au jour ${prochain.jour}`
              : 'Commencer le jour 1'
        }
        onPress={() => router.push(`/lecture/${plan.id}/jour/${termine ? 1 : prochain.jour}`)}
        style={{ marginTop: spacing.xl }}
      />

      {faits.size > 0 ? (
        <>
          <View
            style={{
              height: 6,
              borderRadius: 3,
              backgroundColor: t.colors.surfaceAlt,
              overflow: 'hidden',
              marginTop: spacing.lg,
            }}>
            <View
              style={{
                width: `${Math.round((faits.size / plan.jours.length) * 100)}%`,
                height: '100%',
                backgroundColor: t.colors.accent,
              }}
            />
          </View>
          <Text
            style={{ color: t.colors.textFaint, fontSize: fontSize.xs, marginTop: spacing.sm }}>
            {faits.size} / {plan.jours.length} journées lues
          </Text>
        </>
      ) : null}

      <View style={{ height: spacing.xl }} />
    </View>
  );

  const pied = (
    <View>
      {progression ? (
        <Pressable
          onPress={() =>
            Alert.alert(
              'Recommencer ce plan ?',
              'Votre progression sera effacée. Vos méditations sont conservées.',
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
          marginTop: spacing.lg,
          marginBottom: spacing.xxxl,
          padding: spacing.lg,
          borderRadius: radius.lg,
          backgroundColor: t.colors.accentSoft,
        }}>
        <Text style={{ color: t.colors.text, fontSize: fontSize.sm, lineHeight: 21 }}>
          Un jour manqué se rattrape le lendemain. Reprendre le plan depuis le début parce
          qu’on a sauté une journée est la meilleure façon de ne jamais le finir.
        </Text>
      </View>
    </View>
  );

  return (
    <FlatList
      ref={liste}
      style={{ flex: 1, backgroundColor: t.colors.background }}
      contentContainerStyle={{ padding: spacing.lg }}
      data={plan.jours}
      keyExtractor={(j) => String(j.jour)}
      initialNumToRender={20}
      windowSize={7}
      ListHeaderComponent={entete}
      ListFooterComponent={pied}
      renderItem={({ item }) => {
        const fait = faits.has(item.jour);
        const chapitres = chapitresDuJour(item.portions);
        return (
          <Carte
            style={{ marginBottom: spacing.sm }}
            onPress={() => router.push(`/lecture/${plan.id}/jour/${item.jour}`)}>
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
                  <Text
                    style={{
                      color: t.colors.textMuted,
                      fontWeight: '700',
                      fontSize: item.jour > 99 ? fontSize.xs : fontSize.sm,
                    }}>
                    {item.jour}
                  </Text>
                )}
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ color: t.colors.text, fontSize: fontSize.md, fontWeight: '600' }}>
                  {item.titre ?? formaterPortions(item.portions)}
                </Text>
                <Text style={{ color: t.colors.textFaint, fontSize: fontSize.xs, marginTop: 2 }}>
                  {item.titre
                    ? formaterPortions(item.portions)
                    : `${chapitres} chapitre${chapitres > 1 ? 's' : ''}`}
                </Text>
              </View>
            </View>
          </Carte>
        );
      }}
    />
  );
}
