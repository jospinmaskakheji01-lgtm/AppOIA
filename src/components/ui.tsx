import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextStyle,
  View,
  ViewStyle,
} from 'react-native';

import { useTheme } from '../store/AppContext';
import { fontSize, radius, spacing } from '../theme/theme';

export function Titre({
  children,
  style,
}: {
  children: React.ReactNode;
  style?: TextStyle;
}) {
  const t = useTheme();
  return (
    <Text style={[{ color: t.colors.text, fontSize: fontSize.title, fontWeight: '700', letterSpacing: -0.5 }, style]}>
      {children}
    </Text>
  );
}

export function SousTitre({
  children,
  style,
}: {
  children: React.ReactNode;
  style?: TextStyle;
}) {
  const t = useTheme();
  return (
    <Text style={[{ color: t.colors.textMuted, fontSize: fontSize.md, lineHeight: 22 }, style]}>
      {children}
    </Text>
  );
}

export function Etiquette({ children }: { children: React.ReactNode }) {
  const t = useTheme();
  return (
    <Text
      style={{
        color: t.colors.accent,
        fontSize: fontSize.xs,
        fontWeight: '700',
        letterSpacing: 1.4,
        textTransform: 'uppercase',
      }}>
      {children}
    </Text>
  );
}

export function Carte({
  children,
  onPress,
  style,
  accent,
}: {
  children: React.ReactNode;
  onPress?: () => void;
  style?: ViewStyle;
  accent?: boolean;
}) {
  const t = useTheme();
  const contenu = (
    <View
      style={[
        {
          backgroundColor: accent ? t.colors.surfaceAlt : t.colors.surface,
          borderRadius: radius.lg,
          borderWidth: StyleSheet.hairlineWidth,
          borderColor: t.colors.border,
          padding: spacing.lg,
        },
        style,
      ]}>
      {children}
    </View>
  );
  if (!onPress) return contenu;
  return (
    <Pressable onPress={onPress} style={({ pressed }) => ({ opacity: pressed ? 0.75 : 1 })}>
      {contenu}
    </Pressable>
  );
}

export function Bouton({
  titre,
  onPress,
  variante = 'principal',
  style,
  desactive,
}: {
  titre: string;
  onPress: () => void;
  variante?: 'principal' | 'secondaire' | 'discret';
  style?: ViewStyle;
  desactive?: boolean;
}) {
  const t = useTheme();
  const fond =
    variante === 'principal'
      ? t.colors.primary
      : variante === 'secondaire'
        ? t.colors.primarySoft
        : 'transparent';
  const couleurTexte =
    variante === 'principal'
      ? t.colors.onPrimary
      : variante === 'secondaire'
        ? t.colors.primary
        : t.colors.textMuted;
  return (
    <Pressable
      onPress={onPress}
      disabled={desactive}
      style={({ pressed }) => [
        {
          backgroundColor: fond,
          borderRadius: radius.pill,
          paddingVertical: spacing.md + 2,
          paddingHorizontal: spacing.xl,
          alignItems: 'center',
          opacity: desactive ? 0.45 : pressed ? 0.8 : 1,
          borderWidth: variante === 'discret' ? StyleSheet.hairlineWidth : 0,
          borderColor: t.colors.border,
        },
        style,
      ]}>
      <Text style={{ color: couleurTexte, fontWeight: '700', fontSize: fontSize.md }}>
        {titre}
      </Text>
    </Pressable>
  );
}

export function CarteVerset({
  reference,
  texte,
  etiquette,
  onPress,
}: {
  reference: string;
  texte: string;
  etiquette?: string;
  onPress?: () => void;
}) {
  const t = useTheme();
  const contenu = (
    <LinearGradient
      colors={t.colors.verseGradient}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={{ borderRadius: radius.xl, padding: spacing.xl }}>
      {etiquette ? (
        <Text
          style={{
            color: 'rgba(255,255,255,0.65)',
            fontSize: fontSize.xs,
            fontWeight: '700',
            letterSpacing: 1.4,
            textTransform: 'uppercase',
            marginBottom: spacing.md,
          }}>
          {etiquette}
        </Text>
      ) : null}
      <Text
        style={{
          color: '#FDFBF6',
          fontSize: fontSize.xl,
          lineHeight: 31,
          fontWeight: '500',
        }}>
        « {texte} »
      </Text>
      <Text
        style={{
          color: 'rgba(255,255,255,0.75)',
          fontSize: fontSize.sm,
          marginTop: spacing.lg,
          fontWeight: '600',
          letterSpacing: 0.3,
        }}>
        {reference}
      </Text>
    </LinearGradient>
  );
  if (!onPress) return contenu;
  return (
    <Pressable onPress={onPress} style={({ pressed }) => ({ opacity: pressed ? 0.85 : 1 })}>
      {contenu}
    </Pressable>
  );
}

export function Ecran({
  children,
  scroll = true,
  contentContainerStyle,
}: {
  children: React.ReactNode;
  scroll?: boolean;
  contentContainerStyle?: ViewStyle;
}) {
  const t = useTheme();
  if (!scroll) {
    return (
      <View style={{ flex: 1, backgroundColor: t.colors.background }}>{children}</View>
    );
  }
  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: t.colors.background }}
      contentContainerStyle={[
        { padding: spacing.lg, paddingBottom: spacing.xxxl * 2 },
        contentContainerStyle,
      ]}
      showsVerticalScrollIndicator={false}>
      {children}
    </ScrollView>
  );
}

export function Separateur({ label }: { label?: string }) {
  const t = useTheme();
  if (!label) {
    return (
      <View
        style={{
          height: StyleSheet.hairlineWidth,
          backgroundColor: t.colors.border,
          marginVertical: spacing.lg,
        }}
      />
    );
  }
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: spacing.xl }}>
      <View style={{ flex: 1, height: StyleSheet.hairlineWidth, backgroundColor: t.colors.border }} />
      <Text
        style={{
          color: t.colors.textFaint,
          fontSize: fontSize.xs,
          letterSpacing: 1.4,
          textTransform: 'uppercase',
          marginHorizontal: spacing.md,
          fontWeight: '700',
        }}>
        {label}
      </Text>
      <View style={{ flex: 1, height: StyleSheet.hairlineWidth, backgroundColor: t.colors.border }} />
    </View>
  );
}

export function Puce({
  texte,
  actif,
  onPress,
}: {
  texte: string;
  actif?: boolean;
  onPress?: () => void;
}) {
  const t = useTheme();
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => ({
        backgroundColor: actif ? t.colors.primary : t.colors.surfaceAlt,
        borderRadius: radius.pill,
        paddingVertical: spacing.sm,
        paddingHorizontal: spacing.lg,
        opacity: pressed ? 0.8 : 1,
      })}>
      <Text
        style={{
          color: actif ? t.colors.onPrimary : t.colors.textMuted,
          fontSize: fontSize.sm,
          fontWeight: '600',
        }}>
        {texte}
      </Text>
    </Pressable>
  );
}

export function Statistique({ valeur, label }: { valeur: string | number; label: string }) {
  const t = useTheme();
  return (
    <View style={{ alignItems: 'center', flex: 1 }}>
      <Text style={{ color: t.colors.text, fontSize: fontSize.xxl, fontWeight: '700' }}>
        {valeur}
      </Text>
      <Text
        style={{
          color: t.colors.textFaint,
          fontSize: fontSize.xs,
          marginTop: 2,
          textAlign: 'center',
        }}>
        {label}
      </Text>
    </View>
  );
}

/** Barre de progression d'un plan ou d'une étude. */
export function BarreProgression({ valeur }: { valeur: number }) {
  const t = useTheme();
  const pct = Math.max(0, Math.min(1, valeur));
  return (
    <View
      style={{
        height: 6,
        borderRadius: 3,
        backgroundColor: t.colors.surfaceAlt,
        marginTop: spacing.md,
        overflow: 'hidden',
      }}>
      <View
        style={{
          width: `${pct * 100}%`,
          height: '100%',
          backgroundColor: t.colors.accent,
          borderRadius: 3,
        }}
      />
    </View>
  );
}
