import { useLocalSearchParams, useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import React, { useEffect, useMemo, useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { IconeFleche } from '../../src/components/icons';
import { Minuteur } from '../../src/components/respiration';
import { Bouton, Carte, Etiquette } from '../../src/components/ui';
import { etapesLectio } from '../../src/data/meditations';
import { getPassage, passages } from '../../src/data/passages';
import { versetDuJour } from '../../src/data/versets';
import { useApp } from '../../src/store/AppContext';
import { fontSize, radius, spacing } from '../../src/theme/theme';

export default function LectioDivina() {
  const { passage: passageParam } = useLocalSearchParams<{ passage?: string }>();
  const { theme: t, ajouterMeditation, etat } = useApp();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const passage = useMemo(() => {
    if (passageParam) return getPassage(String(passageParam));
    const duJour = versetDuJour();
    return duJour.passageId ? getPassage(duJour.passageId) : passages[3];
  }, [passageParam]);

  const [index, setIndex] = useState(0);
  const [restant, setRestant] = useState(etapesLectio[0].duree);
  const [enCours, setEnCours] = useState(false);
  const [fini, setFini] = useState(false);

  useEffect(() => {
    if (!enCours || fini) return;
    const timer = setInterval(() => {
      setRestant((r) => {
        if (r > 1) return r - 1;
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
        setEnCours(false);
        return 0;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [enCours, fini]);

  const etape = etapesLectio[index];
  const echelle = etat.reglages.tailleTexte;

  const suivant = () => {
    if (index + 1 >= etapesLectio.length) {
      setFini(true);
      const total = etapesLectio.reduce((n, e) => n + e.duree, 0);
      ajouterMeditation(Math.round(total / 60));
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
      return;
    }
    const i = index + 1;
    setIndex(i);
    setRestant(etapesLectio[i].duree);
    setEnCours(false);
  };

  if (!passage) {
    return (
      <View style={{ flex: 1, backgroundColor: t.colors.background, padding: spacing.xl }}>
        <Text style={{ color: t.colors.textMuted }}>Passage introuvable.</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: t.colors.background }}
      contentContainerStyle={{
        paddingTop: insets.top + spacing.sm,
        paddingBottom: insets.bottom + spacing.xxxl,
        paddingHorizontal: spacing.lg,
      }}
      showsVerticalScrollIndicator={false}>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        <Pressable onPress={() => router.back()} hitSlop={10} style={{ padding: spacing.xs }}>
          <IconeFleche couleur={t.colors.textMuted} taille={26} />
        </Pressable>
        <Text style={{ color: t.colors.textFaint, fontSize: fontSize.sm }}>
          Lectio divina · {passage.reference}
        </Text>
      </View>

      {fini ? (
        <View style={{ marginTop: spacing.xxxl, alignItems: 'center' }}>
          <Text style={{ color: t.colors.text, fontSize: fontSize.title, fontWeight: '700' }}>
            Amen.
          </Text>
          <Text
            style={{
              color: t.colors.textMuted,
              fontSize: fontSize.md,
              textAlign: 'center',
              marginTop: spacing.lg,
              lineHeight: 25,
            }}>
            Vous avez traversé les quatre temps de la lecture priante. Notez, si vous le
            voulez, le mot que vous emportez.
          </Text>
          <Bouton
            titre="Écrire dans mon journal"
            onPress={() =>
              router.replace(
                `/journal/nouvelle?reference=${encodeURIComponent(passage.reference)}&titre=${encodeURIComponent('Lectio divina')}`,
              )
            }
            style={{ marginTop: spacing.xl, alignSelf: 'stretch' }}
          />
          <Bouton
            titre="Terminer"
            variante="discret"
            onPress={() => router.back()}
            style={{ marginTop: spacing.sm, alignSelf: 'stretch' }}
          />
        </View>
      ) : (
        <>
          <View style={{ flexDirection: 'row', gap: spacing.sm, marginTop: spacing.lg }}>
            {etapesLectio.map((e, i) => (
              <View
                key={e.cle}
                style={{
                  flex: 1,
                  height: 4,
                  borderRadius: 2,
                  backgroundColor: i <= index ? t.colors.accent : t.colors.surfaceAlt,
                }}
              />
            ))}
          </View>

          <Etiquette>{etape.latin}</Etiquette>
          <Text
            style={{
              color: t.colors.text,
              fontSize: fontSize.title,
              fontWeight: '700',
              marginTop: spacing.xs,
            }}>
            {etape.titre}
          </Text>
          <Text
            style={{
              color: t.colors.textMuted,
              fontSize: fontSize.md,
              lineHeight: 24,
              marginTop: spacing.md,
            }}>
            {etape.consigne}
          </Text>

          <Minuteur restant={restant} />

          <Bouton
            titre={enCours ? 'Pause' : restant === 0 ? 'Temps écoulé' : 'Démarrer ce temps'}
            variante={enCours ? 'secondaire' : 'principal'}
            onPress={() => setEnCours((v) => !v)}
            desactive={restant === 0}
          />

          <Carte style={{ marginTop: spacing.xl }} accent>
            <Text
              style={{
                color: t.colors.text,
                fontSize: fontSize.md * echelle,
                lineHeight: 26 * echelle,
                fontStyle: 'italic',
              }}>
              {etape.invite}
            </Text>
          </Carte>

          {index === 0 || index === 1 ? (
            <View style={{ marginTop: spacing.xl }}>
              {passage.verses.map((v) => (
                <View key={v.n} style={{ flexDirection: 'row', marginBottom: spacing.md }}>
                  <Text
                    style={{
                      color: t.colors.textFaint,
                      fontSize: fontSize.xs * echelle,
                      width: 22,
                      paddingTop: 5,
                      fontWeight: '700',
                    }}>
                    {v.n}
                  </Text>
                  <Text
                    style={{
                      color: t.colors.text,
                      fontSize: fontSize.lg * echelle,
                      lineHeight: 31 * echelle,
                      flex: 1,
                    }}>
                    {v.t}
                  </Text>
                </View>
              ))}
            </View>
          ) : (
            <View
              style={{
                marginTop: spacing.xl,
                padding: spacing.xl,
                borderRadius: radius.lg,
                backgroundColor: t.colors.surfaceAlt,
                alignItems: 'center',
              }}>
              <Text
                style={{
                  color: t.colors.textMuted,
                  fontSize: fontSize.md,
                  textAlign: 'center',
                  lineHeight: 24,
                }}>
                {index === 2
                  ? 'Le texte est mis de côté. C’est à vous de parler maintenant.'
                  : 'Plus de texte, plus de mots. Restez simplement en présence.'}
              </Text>
            </View>
          )}

          <Bouton
            titre={index + 1 >= etapesLectio.length ? 'Achever la lectio' : `Passer à ${etapesLectio[index + 1].titre.toLowerCase()}`}
            variante="discret"
            onPress={suivant}
            style={{ marginTop: spacing.xl }}
          />
        </>
      )}
    </ScrollView>
  );
}
