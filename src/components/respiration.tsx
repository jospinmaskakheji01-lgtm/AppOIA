import React, { useEffect, useRef } from 'react';
import { Animated, Easing, Text, View } from 'react-native';

import { useTheme } from '../store/AppContext';
import { fontSize, spacing } from '../theme/theme';

/**
 * Cercle qui se dilate et se contracte pour accompagner la respiration.
 * Cycle : 4 s d'inspiration, 6 s d'expiration.
 */
export function Respiration({
  actif,
  taille = 200,
}: {
  actif: boolean;
  taille?: number;
}) {
  const t = useTheme();
  const echelle = useRef(new Animated.Value(0.65)).current;
  const opacite = useRef(new Animated.Value(0.35)).current;
  const [phase, setPhase] = React.useState<'inspire' | 'expire'>('inspire');

  useEffect(() => {
    if (!actif) {
      echelle.stopAnimation();
      opacite.stopAnimation();
      return;
    }
    let annule = false;

    const cycle = () => {
      if (annule) return;
      setPhase('inspire');
      Animated.parallel([
        Animated.timing(echelle, {
          toValue: 1,
          duration: 4000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(opacite, {
          toValue: 0.7,
          duration: 4000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ]).start(({ finished }) => {
        if (!finished || annule) return;
        setPhase('expire');
        Animated.parallel([
          Animated.timing(echelle, {
            toValue: 0.65,
            duration: 6000,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(opacite, {
            toValue: 0.35,
            duration: 6000,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
        ]).start(({ finished: fini }) => {
          if (fini && !annule) cycle();
        });
      });
    };

    cycle();
    return () => {
      annule = true;
      echelle.stopAnimation();
      opacite.stopAnimation();
    };
  }, [actif, echelle, opacite]);

  return (
    <View style={{ alignItems: 'center', justifyContent: 'center', height: taille + 40 }}>
      <Animated.View
        style={{
          position: 'absolute',
          width: taille,
          height: taille,
          borderRadius: taille / 2,
          backgroundColor: t.colors.primary,
          opacity: opacite,
          transform: [{ scale: echelle }],
        }}
      />
      <View
        style={{
          width: taille * 0.55,
          height: taille * 0.55,
          borderRadius: taille,
          borderWidth: 1,
          borderColor: t.colors.border,
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <Text
          style={{
            color: t.colors.textMuted,
            fontSize: fontSize.sm,
            letterSpacing: 1.5,
            textTransform: 'uppercase',
            fontWeight: '700',
          }}>
          {actif ? (phase === 'inspire' ? 'inspirez' : 'expirez') : 'en pause'}
        </Text>
      </View>
    </View>
  );
}

export function Minuteur({ restant }: { restant: number }) {
  const t = useTheme();
  const m = Math.floor(restant / 60);
  const s = restant % 60;
  return (
    <Text
      style={{
        color: t.colors.text,
        fontSize: 52,
        fontWeight: '200',
        letterSpacing: 2,
        textAlign: 'center',
        marginVertical: spacing.lg,
        fontVariant: ['tabular-nums'],
      }}>
      {m}:{String(s).padStart(2, '0')}
    </Text>
  );
}
