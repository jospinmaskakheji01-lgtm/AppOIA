import { useLocalSearchParams, useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import React, { useEffect, useRef, useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { IconeFleche } from '../../src/components/icons';
import { Minuteur, Respiration } from '../../src/components/respiration';
import { Bouton, Etiquette } from '../../src/components/ui';
import { seances } from '../../src/data/meditations';
import { passagesById } from '../../src/data/passages';
import { useApp } from '../../src/store/AppContext';
import { fontSize, spacing } from '../../src/theme/theme';

export default function SeanceGuidee() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { theme: t, ajouterMeditation } = useApp();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const seance = seances.find((s) => s.id === String(id));
  const [index, setIndex] = useState(0);
  const [restant, setRestant] = useState(seance?.etapes[0]?.secondes ?? 0);
  const [enCours, setEnCours] = useState(true);
  const [fini, setFini] = useState(false);
  const ecoule = useRef(0);

  useEffect(() => {
    if (!seance || !enCours || fini) return;
    const timer = setInterval(() => {
      ecoule.current += 1;
      setRestant((r) => {
        if (r > 1) return r - 1;
        setIndex((i) => {
          const suivant = i + 1;
          if (suivant >= seance.etapes.length) {
            setFini(true);
            setEnCours(false);
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
            return i;
          }
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
          setRestant(seance.etapes[suivant].secondes);
          return suivant;
        });
        return 0;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [seance, enCours, fini]);

  useEffect(() => {
    if (fini && seance) {
      ajouterMeditation(Math.max(1, Math.round(ecoule.current / 60)));
    }
    // Une seule comptabilisation, au moment où la séance s'achève.
  }, [fini]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!seance) {
    return (
      <View style={{ flex: 1, backgroundColor: t.colors.background, padding: spacing.xl }}>
        <Text style={{ color: t.colors.textMuted }}>Séance introuvable.</Text>
      </View>
    );
  }

  const etape = seance.etapes[index];
  const passage = passagesById[seance.passageId];

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: t.colors.background,
        paddingTop: insets.top + spacing.sm,
        paddingBottom: insets.bottom + spacing.lg,
        paddingHorizontal: spacing.lg,
      }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        <Pressable onPress={() => router.back()} hitSlop={10} style={{ padding: spacing.xs }}>
          <IconeFleche couleur={t.colors.textMuted} taille={26} />
        </Pressable>
        <Text style={{ color: t.colors.textFaint, fontSize: fontSize.sm }}>
          {index + 1} / {seance.etapes.length}
        </Text>
      </View>

      <View style={{ alignItems: 'center', marginTop: spacing.lg }}>
        <Etiquette>{seance.titre}</Etiquette>
        <Text style={{ color: t.colors.textFaint, fontSize: fontSize.xs, marginTop: 4 }}>
          {passage?.reference ?? ''}
        </Text>
      </View>

      <View style={{ flex: 1, justifyContent: 'center' }}>
        {fini ? (
          <View style={{ alignItems: 'center' }}>
            <Text
              style={{
                color: t.colors.text,
                fontSize: fontSize.xxl,
                fontWeight: '700',
                textAlign: 'center',
              }}>
              Amen.
            </Text>
            <Text
              style={{
                color: t.colors.textMuted,
                fontSize: fontSize.md,
                textAlign: 'center',
                marginTop: spacing.md,
                lineHeight: 24,
              }}>
              Vous avez passé {Math.max(1, Math.round(ecoule.current / 60))} minutes en
              présence de Dieu. Emportez une phrase avec vous dans la journée.
            </Text>
          </View>
        ) : (
          <>
            <Respiration actif={enCours} taille={210} />
            <Minuteur restant={restant} />
            <Text
              style={{
                color: t.colors.text,
                fontSize: fontSize.xl,
                lineHeight: 32,
                textAlign: 'center',
                paddingHorizontal: spacing.md,
              }}>
              {etape.texte}
            </Text>
          </>
        )}
      </View>

      {fini ? (
        <>
          <Bouton titre="Écrire ce que j’ai reçu" onPress={() => router.replace('/journal/nouvelle')} />
          <Bouton
            titre="Terminer"
            variante="discret"
            onPress={() => router.back()}
            style={{ marginTop: spacing.sm }}
          />
        </>
      ) : (
        <>
          <Bouton
            titre={enCours ? 'Faire une pause' : 'Reprendre'}
            variante="secondaire"
            onPress={() => setEnCours((v) => !v)}
          />
          <Pressable
            onPress={() => {
              const suivant = index + 1;
              if (suivant >= seance.etapes.length) {
                setFini(true);
                setEnCours(false);
              } else {
                setIndex(suivant);
                setRestant(seance.etapes[suivant].secondes);
              }
            }}
            style={{ alignSelf: 'center', padding: spacing.md, marginTop: spacing.xs }}>
            <Text style={{ color: t.colors.textFaint, fontSize: fontSize.sm }}>
              Passer à l’étape suivante
            </Text>
          </Pressable>
        </>
      )}
    </View>
  );
}
