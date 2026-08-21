import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useMemo } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';

import { CarteFicheLivre } from '../../../../src/components/oia';
import { Bouton, Carte, Etiquette, Separateur, SousTitre } from '../../../../src/components/ui';
import { getFiche } from '../../../../src/data/livres';
import { TEMPS_OIA } from '../../../../src/data/oia';
import { getPassage } from '../../../../src/data/passages';
import { getPlan } from '../../../../src/data/plans';
import { useApp } from '../../../../src/store/AppContext';
import { fontSize, radius, spacing } from '../../../../src/theme/theme';

export default function JourDEtude() {
  const { id, jour } = useLocalSearchParams<{ id: string; jour: string }>();
  const { theme: t, etat, creerEtude, etudeDuPlan } = useApp();
  const router = useRouter();

  const plan = getPlan(String(id));
  const numero = Number(jour);
  const etude = plan?.jours.find((j) => j.jour === numero);
  const passage = etude ? getPassage(etude.passageId) : undefined;
  const fiche = passage ? getFiche(passage.book) : undefined;

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

  const existante = etudeDuPlan(plan.id, numero);
  const fait = etat.progressions[plan.id]?.joursTermines.includes(numero) ?? false;
  const suivant = plan.jours.find((j) => j.jour === numero + 1);
  const echelle = etat.reglages.tailleTexte;

  const ouvrirAtelier = () => {
    if (existante) {
      router.push(`/oia/${existante.id}`);
      return;
    }
    const creee = creerEtude({
      reference: passage.reference,
      passageId: passage.id,
      planId: plan.id,
      jour: numero,
    });
    router.push(`/oia/${creee.id}`);
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

      <Separateur label="Le texte" />

      <Pressable onPress={() => router.push(`/passage/${passage.id}`)}>
        <Text style={{ color: t.colors.accent, fontSize: fontSize.sm, fontWeight: '700' }}>
          {passage.reference}
          {etude.versets
            ? ` (v. ${etude.versets[0]}-${etude.versets[etude.versets.length - 1]})`
            : ''}
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

      <View
        style={{
          marginTop: spacing.lg,
          padding: spacing.lg,
          borderRadius: radius.lg,
          backgroundColor: t.colors.accentSoft,
        }}>
        <Etiquette>Contexte immédiat</Etiquette>
        <Text
          style={{
            color: t.colors.text,
            fontSize: fontSize.md,
            lineHeight: 24,
            marginTop: spacing.sm,
          }}>
          {etude.contexteImmediat}
        </Text>
      </View>

      {fiche ? (
        <View style={{ marginTop: spacing.lg }}>
          <CarteFicheLivre fiche={fiche} />
        </View>
      ) : null}

      <Separateur label="Les trois temps" />

      {TEMPS_OIA.map((temps) => (
        <Carte key={temps.cle} style={{ marginBottom: spacing.sm }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.md }}>
            <View
              style={{
                width: 36,
                height: 36,
                borderRadius: radius.sm,
                backgroundColor: t.colors.primarySoft,
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <Text style={{ color: t.colors.primary, fontWeight: '800', fontSize: fontSize.lg }}>
                {temps.lettre}
              </Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ color: t.colors.text, fontSize: fontSize.md, fontWeight: '700' }}>
                {temps.titre}
              </Text>
              <Text style={{ color: t.colors.textMuted, fontSize: fontSize.sm, marginTop: 1 }}>
                {temps.question}
              </Text>
            </View>
          </View>
        </Carte>
      ))}

      <Bouton
        titre={
          existante
            ? existante.terminee
              ? 'Revoir mon étude'
              : 'Reprendre mon étude'
            : 'Commencer l’étude OIA'
        }
        onPress={ouvrirAtelier}
        style={{ marginTop: spacing.lg }}
      />

      {fait ? (
        <Text
          style={{
            color: t.colors.success,
            textAlign: 'center',
            marginTop: spacing.md,
            fontSize: fontSize.sm,
            fontWeight: '600',
          }}>
          Journée terminée.
        </Text>
      ) : (
        <SousTitre style={{ textAlign: 'center', marginTop: spacing.md }}>
          La journée sera validée quand vous achèverez l’étude.
        </SousTitre>
      )}

      {suivant ? (
        <Bouton
          titre={`Jour suivant · ${suivant.titre}`}
          variante="discret"
          onPress={() => router.replace(`/plan/${plan.id}/jour/${suivant.jour}`)}
          style={{ marginTop: spacing.lg }}
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
