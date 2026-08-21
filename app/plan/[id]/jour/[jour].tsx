import { useLocalSearchParams, useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import React, { useMemo } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';

import { IconeCoche } from '../../../../src/components/icons';
import {
  Bouton,
  Carte,
  CarteVerset,
  Etiquette,
  Separateur,
  SousTitre,
} from '../../../../src/components/ui';
import { getPassage } from '../../../../src/data/passages';
import { getPlan } from '../../../../src/data/plans';
import { useApp } from '../../../../src/store/AppContext';
import { fontSize, radius, spacing } from '../../../../src/theme/theme';

export default function JourDEtude() {
  const { id, jour } = useLocalSearchParams<{ id: string; jour: string }>();
  const { theme: t, etat, terminerJourPlan, basculerMemorise } = useApp();
  const router = useRouter();

  const plan = getPlan(String(id));
  const numero = Number(jour);
  const etude = plan?.jours.find((j) => j.jour === numero);
  const passage = etude ? getPassage(etude.passageId) : undefined;

  const versets = useMemo(() => {
    if (!passage) return [];
    if (!etude?.versets) return passage.verses;
    const garder = new Set(etude.versets);
    return passage.verses.filter((v) => garder.has(v.n));
  }, [passage, etude]);

  if (!plan || !etude || !passage) {
    return (
      <View style={{ flex: 1, backgroundColor: t.colors.background, padding: spacing.xl }}>
        <SousTitre>Cette journée d’étude est introuvable.</SousTitre>
      </View>
    );
  }

  const fait = etat.progressions[plan.id]?.joursTermines.includes(numero) ?? false;
  const memorise = etat.versetsMemorises.includes(etude.versetMemoire.ref);
  const suivant = plan.jours.find((j) => j.jour === numero + 1);
  const echelle = etat.reglages.tailleTexte;

  const terminer = () => {
    terminerJourPlan(plan.id, numero);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
    if (suivant) {
      router.replace(`/plan/${plan.id}`);
    } else {
      router.replace(`/plan/${plan.id}`);
    }
  };

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: t.colors.background }}
      contentContainerStyle={{ padding: spacing.lg, paddingBottom: spacing.xxxl * 2 }}
      showsVerticalScrollIndicator={false}>
      <Etiquette>
        {plan.titre} · Jour {etude.jour} sur {plan.jours.length}
      </Etiquette>
      <Text
        style={{
          color: t.colors.text,
          fontSize: fontSize.title,
          fontWeight: '700',
          marginTop: spacing.sm,
          lineHeight: 38,
        }}>
        {etude.titre}
      </Text>

      <Separateur label="Lire" />

      <Pressable onPress={() => router.push(`/passage/${passage.id}`)}>
        <Text style={{ color: t.colors.accent, fontSize: fontSize.sm, fontWeight: '700' }}>
          {passage.reference}
          {etude.versets ? ` (v. ${etude.versets[0]}-${etude.versets[etude.versets.length - 1]})` : ''}
        </Text>
      </Pressable>

      <View style={{ marginTop: spacing.lg }}>
        {versets.map((v) => (
          <View key={v.n} style={{ flexDirection: 'row', marginBottom: spacing.md }}>
            <Text
              style={{
                color: t.colors.textFaint,
                fontSize: fontSize.xs * echelle,
                fontWeight: '700',
                width: 24,
                paddingTop: 5,
              }}>
              {v.n}
            </Text>
            <Text
              style={{
                color: t.colors.text,
                fontSize: fontSize.lg * echelle,
                lineHeight: 30 * echelle,
                flex: 1,
              }}>
              {v.t}
            </Text>
          </View>
        ))}
      </View>

      <Separateur label="Méditer" />

      <Text
        style={{
          color: t.colors.text,
          fontSize: fontSize.lg * echelle,
          lineHeight: 29 * echelle,
        }}>
        {etude.meditation}
      </Text>

      <Separateur label="Questionner" />

      {etude.questions.map((q, i) => (
        <View key={i} style={{ flexDirection: 'row', marginBottom: spacing.lg, gap: spacing.md }}>
          <Text style={{ color: t.colors.accent, fontSize: fontSize.lg, fontWeight: '700' }}>
            {i + 1}
          </Text>
          <Text
            style={{
              color: t.colors.textMuted,
              fontSize: fontSize.md * echelle,
              lineHeight: 25 * echelle,
              flex: 1,
            }}>
            {q}
          </Text>
        </View>
      ))}

      <Bouton
        titre="Répondre dans mon journal"
        variante="secondaire"
        onPress={() =>
          router.push(
            `/journal/nouvelle?reference=${encodeURIComponent(passage.reference)}&titre=${encodeURIComponent(etude.titre)}`,
          )
        }
      />

      <Separateur label="Prier" />

      <Carte accent>
        <Text
          style={{
            color: t.colors.text,
            fontSize: fontSize.lg * echelle,
            lineHeight: 28 * echelle,
            fontStyle: 'italic',
          }}>
          {etude.priere}
        </Text>
      </Carte>

      <Separateur label="Mémoriser" />

      <CarteVerset reference={etude.versetMemoire.ref} texte={etude.versetMemoire.texte} />

      <Pressable
        onPress={() => basculerMemorise(etude.versetMemoire.ref)}
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          gap: spacing.sm,
          marginTop: spacing.md,
          alignSelf: 'flex-start',
        }}>
        <View
          style={{
            width: 22,
            height: 22,
            borderRadius: 6,
            borderWidth: 1.5,
            borderColor: memorise ? t.colors.success : t.colors.border,
            backgroundColor: memorise ? t.colors.success : 'transparent',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          {memorise ? <IconeCoche couleur={t.colors.surface} taille={14} /> : null}
        </View>
        <Text style={{ color: t.colors.textMuted, fontSize: fontSize.sm }}>
          {memorise ? 'Verset mémorisé' : 'Je veux mémoriser ce verset'}
        </Text>
      </Pressable>

      <Separateur label="Pratiquer" />

      <View
        style={{
          padding: spacing.lg,
          borderRadius: radius.lg,
          backgroundColor: t.colors.accentSoft,
        }}>
        <Text style={{ color: t.colors.text, fontSize: fontSize.md * echelle, lineHeight: 24 * echelle }}>
          {etude.pratique}
        </Text>
      </View>

      <Bouton
        titre={fait ? 'Journée déjà terminée' : 'Marquer cette journée comme terminée'}
        onPress={terminer}
        desactive={fait}
        style={{ marginTop: spacing.xl }}
      />

      {suivant ? (
        <Bouton
          titre={`Jour suivant · ${suivant.titre}`}
          variante="discret"
          onPress={() => router.replace(`/plan/${plan.id}/jour/${suivant.jour}`)}
          style={{ marginTop: spacing.md }}
        />
      ) : (
        <Text
          style={{
            color: t.colors.textFaint,
            textAlign: 'center',
            marginTop: spacing.lg,
            fontSize: fontSize.sm,
          }}>
          Dernier jour de ce plan.
        </Text>
      )}
    </ScrollView>
  );
}
