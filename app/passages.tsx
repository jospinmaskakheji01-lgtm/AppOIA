import { useRouter } from 'expo-router';
import React, { useMemo, useState } from 'react';
import { ScrollView, Text, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { IconeCoeur } from '../src/components/icons';
import {
  Bouton,
  Carte,
  Etiquette,
  Puce,
  Separateur,
  SousTitre,
  Titre,
} from '../src/components/ui';
import { BIBLE_VERSION, passages, passagesById } from '../src/data/passages';
import { statistiquesBase, statistiquesVersion, versionsDisponibles } from '../src/knowledge';
import { useApp } from '../src/store/AppContext';
import { fontSize, radius, spacing } from '../src/theme/theme';
import { nombre } from '../src/utils/nombres';

type Filtre = 'tous' | 'ancien' | 'nouveau' | 'favoris';

export default function Passages() {
  const { theme: t, etat, majReglages } = useApp();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [recherche, setRecherche] = useState('');
  const [filtre, setFiltre] = useState<Filtre>('tous');

  const versions = useMemo(() => versionsDisponibles(), []);
  const base = useMemo(() => statistiquesBase(), []);
  const versionActive =
    versions.find((v) => v.id === etat.reglages.versionPreferee) ?? versions[0];
  const statsVersion = useMemo(
    () => (versionActive ? statistiquesVersion(versionActive.id) : undefined),
    [versionActive],
  );

  const resultats = useMemo(() => {
    const q = recherche.trim().toLowerCase();
    return passages.filter((p) => {
      if (filtre === 'favoris' && !etat.favoris.includes(p.id)) return false;
      if ((filtre === 'ancien' || filtre === 'nouveau') && p.testament !== filtre) return false;
      if (!q) return true;
      return (
        p.reference.toLowerCase().includes(q) ||
        p.book.toLowerCase().includes(q) ||
        p.themes.some((th) => th.includes(q)) ||
        p.verses.some((v) => v.t.toLowerCase().includes(q))
      );
    });
  }, [recherche, filtre, etat.favoris]);

  const favoris = etat.favoris
    .map((id) => passagesById[id])
    .filter((p): p is NonNullable<typeof p> => Boolean(p));

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: t.colors.background }}
      contentContainerStyle={{
        padding: spacing.lg,
        paddingTop: insets.top + spacing.md,
        paddingBottom: spacing.xxxl * 2,
      }}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}>
      <Etiquette>Un point de départ</Etiquette>
      <Titre style={{ marginTop: spacing.sm }}>Passages préparés</Titre>
      <SousTitre style={{ marginTop: spacing.sm }}>
        {passages.length} textes accompagnés d’une fiche de livre, de pistes d’observation et
        de commentaires — pour commencer une étude quand on ne sait pas par où. Le reste de la
        Bible se lit dans l’onglet Bible.
      </SousTitre>

      <TextInput
        value={recherche}
        onChangeText={setRecherche}
        placeholder="Rechercher un livre, un thème, un mot…"
        placeholderTextColor={t.colors.textFaint}
        style={{
          backgroundColor: t.colors.surface,
          borderRadius: radius.md,
          borderWidth: 1,
          borderColor: t.colors.border,
          paddingHorizontal: spacing.lg,
          paddingVertical: spacing.md,
          marginTop: spacing.lg,
          color: t.colors.text,
          fontSize: fontSize.md,
        }}
      />

      <View style={{ flexDirection: 'row', gap: spacing.sm, marginTop: spacing.md, flexWrap: 'wrap' }}>
        <Puce texte="Tous" actif={filtre === 'tous'} onPress={() => setFiltre('tous')} />
        <Puce texte="Ancien Testament" actif={filtre === 'ancien'} onPress={() => setFiltre('ancien')} />
        <Puce texte="Nouveau Testament" actif={filtre === 'nouveau'} onPress={() => setFiltre('nouveau')} />
        <Puce
          texte={`Favoris (${favoris.length})`}
          actif={filtre === 'favoris'}
          onPress={() => setFiltre('favoris')}
        />
      </View>

      <Separateur label="Passages préparés" />
      <SousTitre style={{ marginBottom: spacing.md }}>
        {resultats.length} passage{resultats.length > 1 ? 's' : ''} accompagné
        {resultats.length > 1 ? 's' : ''} d'une fiche de livre, de pistes d'observation et de
        commentaires — un point de départ pour une étude, quand on ne sait pas où commencer.
      </SousTitre>

      {resultats.length === 0 ? (
        <SousTitre style={{ textAlign: 'center', marginTop: spacing.xl }}>
          Aucun passage ne correspond. Essayez « paix », « pardon » ou « Psaume ».
        </SousTitre>
      ) : null}

      {resultats.map((p) => (
        <Carte
          key={p.id}
          style={{ marginBottom: spacing.md }}
          onPress={() => router.push(`/passage/${p.id}`)}
          >
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <Text style={{ color: t.colors.text, fontSize: fontSize.lg, fontWeight: '700', flex: 1 }}>
              {p.reference}
            </Text>
            {etat.favoris.includes(p.id) ? (
              <IconeCoeur couleur={t.colors.accent} taille={18} rempli />
            ) : null}
          </View>
          <Text
            style={{
              color: t.colors.textMuted,
              fontSize: fontSize.md,
              lineHeight: 23,
              marginTop: spacing.sm,
            }}>
            {p.intro}
          </Text>
          <View style={{ flexDirection: 'row', gap: spacing.sm, marginTop: spacing.md, flexWrap: 'wrap' }}>
            {p.themes.map((th) => (
              <View
                key={th}
                style={{
                  backgroundColor: t.colors.surfaceAlt,
                  borderRadius: radius.pill,
                  paddingVertical: 3,
                  paddingHorizontal: spacing.md,
                }}>
                <Text style={{ color: t.colors.textFaint, fontSize: fontSize.xs }}>{th}</Text>
              </View>
            ))}
          </View>
        </Carte>
      ))}

      {etat.versetsMemorises.length > 0 ? (
        <>
          <Separateur label="Versets mémorisés" />
          {etat.versetsMemorises.map((ref) => (
            <View
              key={ref}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: spacing.sm,
                paddingVertical: spacing.sm,
              }}>
              <Text style={{ color: t.colors.accent }}>✦</Text>
              <Text style={{ color: t.colors.text, fontSize: fontSize.md }}>{ref}</Text>
            </View>
          ))}
        </>
      ) : null}
    </ScrollView>
  );
}
