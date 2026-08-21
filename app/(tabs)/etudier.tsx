import { useRouter } from 'expo-router';
import React from 'react';
import { ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Carte, Etiquette, Separateur, SousTitre, Titre } from '../../src/components/ui';
import { plans } from '../../src/data/plans';
import { useApp } from '../../src/store/AppContext';
import { fontSize, radius, spacing } from '../../src/theme/theme';
import { BarreProgression } from './index';

export default function Etudier() {
  const { theme: t, etat } = useApp();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const commences = plans.filter((p) => etat.progressions[p.id]);
  const nouveaux = plans.filter((p) => !etat.progressions[p.id]);

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: t.colors.background }}
      contentContainerStyle={{
        padding: spacing.lg,
        paddingTop: insets.top + spacing.md,
        paddingBottom: spacing.xxxl * 2,
      }}
      showsVerticalScrollIndicator={false}>
      <Etiquette>Plans d’étude</Etiquette>
      <Titre style={{ marginTop: spacing.sm }}>Étudier</Titre>
      <SousTitre style={{ marginTop: spacing.sm }}>
        Chaque journée suit la même trame : lire le texte, méditer, répondre à trois
        questions, prier, puis poser un acte.
      </SousTitre>

      {commences.length > 0 ? (
        <>
          <Separateur label="En cours" />
          {commences.map((p) => {
            const prog = etat.progressions[p.id];
            const termine = prog.joursTermines.length >= p.jours.length;
            const prochain =
              p.jours.find((j) => !prog.joursTermines.includes(j.jour)) ?? p.jours[0];
            return (
              <Carte
                key={p.id}
                style={{ marginBottom: spacing.md }}
                onPress={() => router.push(`/plan/${p.id}`)}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.md }}>
                  <Symbole symbole={p.symbole} />
                  <View style={{ flex: 1 }}>
                    <Text style={{ color: t.colors.text, fontSize: fontSize.lg, fontWeight: '700' }}>
                      {p.titre}
                    </Text>
                    <SousTitre style={{ marginTop: 2 }}>
                      {termine
                        ? 'Plan terminé — relisez-le quand vous voudrez'
                        : `Prochain : jour ${prochain.jour} · ${prochain.titre}`}
                    </SousTitre>
                  </View>
                </View>
                <BarreProgression valeur={prog.joursTermines.length / p.jours.length} />
                <Text
                  style={{
                    color: t.colors.textFaint,
                    fontSize: fontSize.xs,
                    marginTop: spacing.sm,
                  }}>
                  {prog.joursTermines.length} / {p.jours.length} jours
                </Text>
              </Carte>
            );
          })}
        </>
      ) : null}

      <Separateur label={commences.length > 0 ? 'Autres plans' : 'Tous les plans'} />

      {nouveaux.map((p) => (
        <Carte
          key={p.id}
          style={{ marginBottom: spacing.md }}
          onPress={() => router.push(`/plan/${p.id}`)}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.md }}>
            <Symbole symbole={p.symbole} />
            <View style={{ flex: 1 }}>
              <Text style={{ color: t.colors.text, fontSize: fontSize.lg, fontWeight: '700' }}>
                {p.titre}
              </Text>
              <SousTitre style={{ marginTop: 2 }}>{p.sousTitre}</SousTitre>
            </View>
          </View>
          <Text
            style={{
              color: t.colors.textMuted,
              fontSize: fontSize.md,
              lineHeight: 23,
              marginTop: spacing.md,
            }}>
            {p.description}
          </Text>
          <View style={{ flexDirection: 'row', gap: spacing.sm, marginTop: spacing.md }}>
            <Badge texte={p.niveau} />
            <Badge texte={`${p.jours.length} jours`} />
          </View>
        </Carte>
      ))}
    </ScrollView>
  );
}

function Symbole({ symbole }: { symbole: string }) {
  const { theme: t } = useApp();
  return (
    <View
      style={{
        width: 46,
        height: 46,
        borderRadius: radius.md,
        backgroundColor: t.colors.primarySoft,
        alignItems: 'center',
        justifyContent: 'center',
      }}>
      <Text style={{ color: t.colors.primary, fontSize: 20 }}>{symbole}</Text>
    </View>
  );
}

function Badge({ texte }: { texte: string }) {
  const { theme: t } = useApp();
  return (
    <View
      style={{
        backgroundColor: t.colors.surfaceAlt,
        borderRadius: radius.pill,
        paddingVertical: 4,
        paddingHorizontal: spacing.md,
      }}>
      <Text style={{ color: t.colors.textMuted, fontSize: fontSize.xs, fontWeight: '600' }}>
        {texte}
      </Text>
    </View>
  );
}
