import { useRouter } from 'expo-router';
import React from 'react';
import { ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Carte, Etiquette, Separateur, SousTitre, Titre } from '../../src/components/ui';
import {
  dureesSilence,
  etapesMeditationOIA,
  prieresTraditionnelles,
  seances,
} from '../../src/data/meditations';
import { passagesById } from '../../src/data/passages';
import { useApp } from '../../src/store/AppContext';
import { fontSize, radius, spacing } from '../../src/theme/theme';

export default function Mediter() {
  const { theme: t, etat } = useApp();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: t.colors.background }}
      contentContainerStyle={{
        padding: spacing.lg,
        paddingTop: insets.top + spacing.md,
        paddingBottom: spacing.xxxl * 2,
      }}
      showsVerticalScrollIndicator={false}>
      <Etiquette>Silence et prière</Etiquette>
      <Titre style={{ marginTop: spacing.sm }}>Méditer</Titre>
      <SousTitre style={{ marginTop: spacing.sm }}>
        {etat.seancesTerminees > 0
          ? `${etat.seancesTerminees} séance${etat.seancesTerminees > 1 ? 's' : ''} · ${etat.minutesMeditation} minutes passées devant Dieu.`
          : 'La méditation chrétienne ne vide pas l’esprit : elle le remplit de la Parole.'}
      </SousTitre>

      <Separateur label="Méditation OIA" />

      <Carte onPress={() => router.push('/meditation/oia')} accent>
        <Text
          style={{
            color: t.colors.text,
            fontSize: fontSize.xl,
            fontWeight: '700',
          }}>
          Les trois temps, en silence
        </Text>
        <SousTitre style={{ marginTop: spacing.xs }}>
          Observer, interpréter, appliquer — la méthode priée plutôt qu’écrite · 15 min
        </SousTitre>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm, marginTop: spacing.lg }}>
          {etapesMeditationOIA.map((e) => (
            <View
              key={e.cle}
              style={{
                backgroundColor: t.colors.surface,
                borderRadius: radius.pill,
                paddingVertical: spacing.xs + 2,
                paddingHorizontal: spacing.md,
              }}>
              <Text style={{ color: t.colors.textMuted, fontSize: fontSize.xs, fontWeight: '700' }}>
                {e.lettre} · {e.titre}
              </Text>
            </View>
          ))}
        </View>
      </Carte>

      <Carte
        style={{ marginTop: spacing.md }}
        onPress={() => router.push('/oia/nouvelle?methode=simplifiee')}>
        <Text style={{ color: t.colors.text, fontSize: fontSize.xl, fontWeight: '700' }}>
          Méditation écrite · OIA simplifiée
        </Text>
        <SousTitre style={{ marginTop: spacing.xs }}>
          Méditez, priez, obéissez — les deux séries de questions, notées · 5 à 15 min
        </SousTitre>
      </Carte>

      <SousTitre style={{ marginTop: spacing.md }}>
        C’est la méthode de la méditation personnelle. Pour l’étude biblique complète, avec
        les questions de chaque temps, passez par l’onglet Étudier.
      </SousTitre>

      <Separateur label="Méditations guidées" />

      {seances.map((s) => (
        <Carte
          key={s.id}
          style={{ marginBottom: spacing.md }}
          onPress={() => router.push(`/meditation/${s.id}`)}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <View style={{ flex: 1, paddingRight: spacing.md }}>
              <Text style={{ color: t.colors.text, fontSize: fontSize.lg, fontWeight: '700' }}>
                {s.titre}
              </Text>
              <SousTitre style={{ marginTop: 2 }}>{s.sousTitre}</SousTitre>
              <Text
                style={{
                  color: t.colors.textFaint,
                  fontSize: fontSize.xs,
                  marginTop: spacing.sm,
                }}>
                {passagesById[s.passageId]?.reference ?? ''}
              </Text>
            </View>
            <View
              style={{
                backgroundColor: t.colors.primarySoft,
                borderRadius: radius.md,
                paddingHorizontal: spacing.md,
                paddingVertical: spacing.sm,
                alignSelf: 'flex-start',
              }}>
              <Text style={{ color: t.colors.primary, fontWeight: '700', fontSize: fontSize.sm }}>
                {Math.round(s.duree / 60)} min
              </Text>
            </View>
          </View>
        </Carte>
      ))}

      <Separateur label="Silence minuté" />

      <SousTitre style={{ marginBottom: spacing.md }}>
        Un temps sans mots, avec une respiration guidée et une cloche à la fin.
      </SousTitre>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm }}>
        {dureesSilence.map((m) => (
          <Carte
            key={m}
            style={{ paddingVertical: spacing.md, paddingHorizontal: spacing.xl }}
            onPress={() => router.push(`/meditation/silence?minutes=${m}`)}>
            <Text style={{ color: t.colors.text, fontWeight: '700', fontSize: fontSize.lg }}>
              {m} min
            </Text>
          </Carte>
        ))}
      </View>

      <Separateur label="Prières de la tradition" />

      {prieresTraditionnelles.map((p) => (
        <Carte key={p.id} style={{ marginBottom: spacing.md }}>
          <Text style={{ color: t.colors.text, fontSize: fontSize.lg, fontWeight: '700' }}>
            {p.titre}
          </Text>
          <Text
            style={{
              color: t.colors.textFaint,
              fontSize: fontSize.xs,
              marginTop: 2,
              marginBottom: spacing.md,
            }}>
            {p.origine}
          </Text>
          <Text style={{ color: t.colors.textMuted, fontSize: fontSize.md, lineHeight: 24 }}>
            {p.texte}
          </Text>
        </Carte>
      ))}
    </ScrollView>
  );
}
