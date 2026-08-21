import { useLocalSearchParams, useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import React, { useEffect, useMemo, useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { IconeFleche } from '../../src/components/icons';
import { Minuteur, Respiration } from '../../src/components/respiration';
import { Bouton } from '../../src/components/ui';
import { versetDuJour } from '../../src/data/versets';
import { useApp } from '../../src/store/AppContext';
import { fontSize, spacing } from '../../src/theme/theme';

export default function Silence() {
  const { minutes } = useLocalSearchParams<{ minutes?: string }>();
  const { theme: t, ajouterMeditation } = useApp();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const total = useMemo(() => {
    const m = Number(minutes);
    return (Number.isFinite(m) && m > 0 ? m : 5) * 60;
  }, [minutes]);

  const verset = useMemo(() => versetDuJour(), []);
  const [restant, setRestant] = useState(total);
  const [enCours, setEnCours] = useState(true);
  const [fini, setFini] = useState(false);

  useEffect(() => {
    if (!enCours || fini) return;
    const timer = setInterval(() => {
      setRestant((r) => {
        if (r > 1) return r - 1;
        setFini(true);
        setEnCours(false);
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
        return 0;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [enCours, fini]);

  useEffect(() => {
    if (fini) ajouterMeditation(Math.round(total / 60));
    // Comptabilisé une seule fois, à la fin du minuteur.
  }, [fini]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: t.colors.background,
        paddingTop: insets.top + spacing.sm,
        paddingBottom: insets.bottom + spacing.lg,
        paddingHorizontal: spacing.lg,
      }}>
      <Pressable onPress={() => router.back()} hitSlop={10} style={{ padding: spacing.xs, alignSelf: 'flex-start' }}>
        <IconeFleche couleur={t.colors.textMuted} taille={26} />
      </Pressable>

      <View style={{ flex: 1, justifyContent: 'center' }}>
        {fini ? (
          <View style={{ alignItems: 'center' }}>
            <Text style={{ color: t.colors.text, fontSize: fontSize.title, fontWeight: '700' }}>
              Amen.
            </Text>
            <Text
              style={{
                color: t.colors.textMuted,
                fontSize: fontSize.md,
                textAlign: 'center',
                marginTop: spacing.lg,
                lineHeight: 24,
              }}>
              {Math.round(total / 60)} minutes de silence devant Dieu.
            </Text>
          </View>
        ) : (
          <>
            <Respiration actif={enCours} taille={230} />
            <Minuteur restant={restant} />
            <Text
              style={{
                color: t.colors.textMuted,
                fontSize: fontSize.lg,
                lineHeight: 29,
                textAlign: 'center',
                fontStyle: 'italic',
                paddingHorizontal: spacing.lg,
                marginTop: spacing.md,
              }}>
              « {verset.texte} »
            </Text>
            <Text
              style={{
                color: t.colors.textFaint,
                fontSize: fontSize.sm,
                textAlign: 'center',
                marginTop: spacing.md,
              }}>
              {verset.ref}
            </Text>
          </>
        )}
      </View>

      {fini ? (
        <Bouton titre="Terminer" onPress={() => router.back()} />
      ) : (
        <Bouton
          titre={enCours ? 'Pause' : 'Reprendre'}
          variante="secondaire"
          onPress={() => setEnCours((v) => !v)}
        />
      )}
    </View>
  );
}
