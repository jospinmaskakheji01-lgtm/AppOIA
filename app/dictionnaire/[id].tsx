import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useMemo } from 'react';
import { ScrollView, Text, View } from 'react-native';

import { BadgeNature, LigneSource } from '../../src/components/connaissance';
import { Carte, Etiquette, Puce, Separateur, SousTitre } from '../../src/components/ui';
import { formaterReference, getEntree, getSource } from '../../src/knowledge';
import { useApp } from '../../src/store/AppContext';
import { fontSize, radius, spacing } from '../../src/theme/theme';

export default function EntreeDictionnaireEcran() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { theme: t } = useApp();
  const router = useRouter();
  const entree = useMemo(() => getEntree(String(id)), [id]);

  if (!entree) {
    return (
      <View style={{ flex: 1, backgroundColor: t.colors.background, padding: spacing.xl }}>
        <SousTitre>Cette entrée n’existe pas dans la base.</SousTitre>
      </View>
    );
  }

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: t.colors.background }}
      contentContainerStyle={{ padding: spacing.lg, paddingBottom: spacing.xxxl * 2 }}
      showsVerticalScrollIndicator={false}>
      <Etiquette>{entree.categorie}</Etiquette>
      <Text
        style={{
          color: t.colors.text,
          fontSize: fontSize.title,
          fontWeight: '700',
          marginTop: spacing.xs,
        }}>
        {entree.terme}
      </Text>
      {entree.variantes.length > 0 ? (
        <SousTitre style={{ marginTop: spacing.xs }}>
          Aussi : {entree.variantes.join(', ')}
        </SousTitre>
      ) : null}

      {entree.motsOriginaux.length > 0 ? (
        <>
          <Separateur label="Langues originales" />
          {entree.motsOriginaux.map((m, i) => (
            <View
              key={`${m.translitteration}-${i}`}
              style={{
                backgroundColor: t.colors.surfaceAlt,
                borderRadius: radius.lg,
                padding: spacing.lg,
                marginBottom: spacing.sm,
              }}>
              <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: spacing.md }}>
                <Text style={{ color: t.colors.text, fontSize: fontSize.xxl }}>{m.mot}</Text>
                <Text style={{ color: t.colors.accent, fontSize: fontSize.lg, fontWeight: '600' }}>
                  {m.translitteration}
                </Text>
              </View>
              <Text style={{ color: t.colors.textFaint, fontSize: fontSize.xs, marginTop: 4 }}>
                {m.langue}
                {m.strong ? ` · Strong ${m.strong}` : ''}
              </Text>
              {m.sensLitteral ? (
                <Text
                  style={{
                    color: t.colors.textMuted,
                    fontSize: fontSize.md,
                    lineHeight: 23,
                    marginTop: spacing.sm,
                  }}>
                  Sens littéral : {m.sensLitteral}
                </Text>
              ) : null}
            </View>
          ))}
        </>
      ) : null}

      <Separateur
        label={
          entree.definitions.length > 1
            ? `${entree.definitions.length} définitions`
            : 'Définition'
        }
      />

      {entree.definitions.length > 1 ? (
        <SousTitre style={{ marginBottom: spacing.md }}>
          Plusieurs ouvrages traitent ce terme. Les perspectives sont conservées telles
          quelles, chacune avec sa source.
        </SousTitre>
      ) : null}

      {entree.definitions.map((d, i) => {
        const source = getSource(d.sourceId);
        return (
          <Carte key={`${d.sourceId}-${i}`} style={{ marginBottom: spacing.md }}>
            <BadgeNature nature="source-documentaire" />
            {d.nuance ? (
              <Text
                style={{
                  color: t.colors.accent,
                  fontSize: fontSize.sm,
                  fontWeight: '700',
                  marginTop: spacing.sm,
                }}>
                {d.nuance}
              </Text>
            ) : null}
            <Text
              style={{
                color: t.colors.text,
                fontSize: fontSize.md,
                lineHeight: 25,
                marginTop: spacing.sm,
              }}>
              {d.texte}
            </Text>
            <LigneSource
              source={source}
              complement={d.localisation?.page ? `p. ${d.localisation.page}` : d.localisation?.article}
            />
          </Carte>
        );
      })}

      {entree.references.length > 0 ? (
        <>
          <Separateur label="Passages" />
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm }}>
            {entree.references.map((r, i) => (
              <Puce
                key={`${formaterReference(r)}-${i}`}
                texte={formaterReference(r)}
                onPress={() => router.push(`/reference/${encodeURIComponent(formaterReference(r))}`)}
              />
            ))}
          </View>
        </>
      ) : null}

      {entree.entreesLiees.length > 0 ? (
        <>
          <Separateur label="Notions liées" />
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm }}>
            {entree.entreesLiees
              .map((id) => getEntree(id))
              .filter((e): e is NonNullable<typeof e> => Boolean(e))
              .map((e) => (
                <Puce key={e.id} texte={e.terme} onPress={() => router.push(`/dictionnaire/${e.id}`)} />
              ))}
          </View>
        </>
      ) : null}
    </ScrollView>
  );
}
