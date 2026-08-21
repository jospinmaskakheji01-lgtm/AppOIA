import { useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import { Pressable, ScrollView, Share, Text, View } from 'react-native';

import { IconeCoeur } from '../../src/components/icons';
import { Bouton, Etiquette, Separateur, SousTitre } from '../../src/components/ui';
import { BIBLE_VERSION, getPassage, passageText } from '../../src/data/passages';
import { useApp } from '../../src/store/AppContext';
import { fontSize, spacing } from '../../src/theme/theme';

export default function LecturePassage() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { theme: t, etat, basculerFavori, creerEtude } = useApp();
  const router = useRouter();
  const passage = getPassage(String(id));

  if (!passage) {
    return (
      <View style={{ flex: 1, backgroundColor: t.colors.background, padding: spacing.xl }}>
        <SousTitre>Ce passage n’est pas disponible.</SousTitre>
      </View>
    );
  }

  const estFavori = etat.favoris.includes(passage.id);
  const echelle = etat.reglages.tailleTexte;

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: t.colors.background }}
      contentContainerStyle={{ padding: spacing.lg, paddingBottom: spacing.xxxl * 2 }}
      showsVerticalScrollIndicator={false}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <Etiquette>{passage.testament === 'ancien' ? 'Ancien Testament' : 'Nouveau Testament'}</Etiquette>
        <Pressable onPress={() => basculerFavori(passage.id)} hitSlop={10}>
          <IconeCoeur couleur={estFavori ? t.colors.accent : t.colors.textFaint} taille={24} rempli={estFavori} />
        </Pressable>
      </View>

      <Text
        style={{
          color: t.colors.text,
          fontSize: fontSize.title,
          fontWeight: '700',
          marginTop: spacing.sm,
        }}>
        {passage.reference}
      </Text>

      <Text
        style={{
          color: t.colors.textMuted,
          fontSize: fontSize.md * echelle,
          lineHeight: 24 * echelle,
          marginTop: spacing.md,
          fontStyle: 'italic',
        }}>
        {passage.intro}
      </Text>

      <Separateur />

      {passage.verses.map((v) => (
        <View key={v.n} style={{ flexDirection: 'row', marginBottom: spacing.md }}>
          <Text
            style={{
              color: t.colors.accent,
              fontSize: fontSize.xs * echelle,
              fontWeight: '700',
              width: 26,
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

      <Text
        style={{
          color: t.colors.textFaint,
          fontSize: fontSize.xs,
          marginTop: spacing.lg,
        }}>
        {BIBLE_VERSION}
      </Text>

      <Bouton
        titre="Étudier ce texte avec la méthode OIA"
        onPress={() => {
          const etude = creerEtude({ reference: passage.reference, passageId: passage.id });
          router.push(`/oia/${etude.id}`);
        }}
        style={{ marginTop: spacing.xl }}
      />
      <Bouton
        titre="Méditer ce texte (OIA guidé)"
        variante="secondaire"
        onPress={() => router.push(`/meditation/oia?passage=${passage.id}`)}
        style={{ marginTop: spacing.md }}
      />
      <Bouton
        titre="Écrire dans le journal"
        variante="discret"
        onPress={() =>
          router.push(`/journal/nouvelle?reference=${encodeURIComponent(passage.reference)}`)
        }
        style={{ marginTop: spacing.md }}
      />
      <Bouton
        titre="Partager le passage"
        variante="discret"
        onPress={() =>
          Share.share({
            message: `${passage.reference}\n\n« ${passageText(passage)} »\n\n${BIBLE_VERSION}`,
          }).catch(() => {})
        }
        style={{ marginTop: spacing.md }}
      />
    </ScrollView>
  );
}
