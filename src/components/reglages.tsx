import React, { useState } from 'react';
import { Platform, Pressable, Switch, Text, View } from 'react-native';

import { IconeChevron, PropsIcone } from './icons';
import { useTheme } from '../store/AppContext';
import { fontSize, radius, spacing } from '../theme/theme';

/**
 * Les rubriques de réglages : des groupes de lignes, chacune portant son icône.
 *
 * Trois sortes de lignes seulement, et le chevron dit laquelle : celles qui
 * mènent ailleurs (chevron vers la droite), celles qui se déplient sur place
 * (chevron vers le bas), celles qui agissent tout de suite (pas de chevron).
 * Un réglage court — un thème, une taille — se déplie plutôt que d'ouvrir un
 * écran : on le change et on voit le résultat sans avoir bougé.
 */

/**
 * Les teintes des icônes. Ce sont des tons moyens, choisis pour tenir sur le
 * papier clair comme sur le fond sombre : la pastille est la teinte à faible
 * opacité, le trait est la teinte pleine.
 */
export const teintes = {
  violet: '#7B6AD4',
  or: '#B9863B',
  vert: '#3F8F63',
  bleu: '#3D7EA6',
  rose: '#B5566B',
  ardoise: '#6B7280',
} as const;

export type Teinte = keyof typeof teintes;

export function GroupeReglages({
  titre,
  icone: Icone,
  children,
}: {
  titre: string;
  icone?: (p: PropsIcone) => React.ReactElement;
  children: React.ReactNode;
}) {
  const t = useTheme();
  const lignes = React.Children.toArray(children).filter(Boolean);
  return (
    <View
      style={{
        backgroundColor: t.colors.surface,
        borderRadius: radius.lg,
        borderWidth: 1,
        borderColor: t.colors.border,
        marginTop: spacing.lg,
        overflow: 'hidden',
      }}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          gap: spacing.sm,
          paddingHorizontal: spacing.lg,
          paddingTop: spacing.lg,
          paddingBottom: spacing.md,
        }}>
        {Icone ? <Icone couleur={t.colors.textFaint} taille={15} /> : null}
        <Text
          style={{
            color: t.colors.textFaint,
            fontSize: fontSize.xs,
            fontWeight: '800',
            letterSpacing: 1.1,
            textTransform: 'uppercase',
          }}>
          {titre}
        </Text>
      </View>
      {lignes.map((ligne, i) => (
        <View key={i}>
          {i > 0 ? (
            <View style={{ height: 1, backgroundColor: t.colors.border, marginLeft: 62 }} />
          ) : null}
          {ligne}
        </View>
      ))}
    </View>
  );
}

export function LigneReglage({
  icone: Icone,
  teinte = 'violet',
  titre,
  valeur,
  sousTitre,
  onPress,
  depliable,
  danger,
  children,
}: {
  icone: (p: PropsIcone) => React.ReactElement;
  teinte?: Teinte;
  titre: string;
  /** La valeur courante, montrée à droite — « Veillée », « Segond 1910 ». */
  valeur?: string;
  sousTitre?: string;
  onPress?: () => void;
  /** Quand la ligne se déplie sur place, son contenu est passé en enfants. */
  depliable?: boolean;
  danger?: boolean;
  children?: React.ReactNode;
}) {
  const t = useTheme();
  const [ouvert, setOuvert] = useState(false);
  const couleur = danger ? t.colors.danger : teintes[teinte];
  const agir = depliable ? () => setOuvert((v) => !v) : onPress;

  return (
    <View>
      <Pressable
        onPress={agir}
        disabled={!agir}
        style={({ pressed }) => ({
          flexDirection: 'row',
          alignItems: 'center',
          gap: spacing.md,
          paddingHorizontal: spacing.lg,
          paddingVertical: spacing.md + 2,
          backgroundColor: pressed ? t.colors.surfaceAlt : 'transparent',
        })}>
        <View
          style={{
            width: 34,
            height: 34,
            borderRadius: radius.sm + 2,
            backgroundColor: `${couleur}22`,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Icone couleur={couleur} taille={20} />
        </View>

        <View style={{ flex: 1 }}>
          <Text
            style={{
              color: danger ? t.colors.danger : t.colors.text,
              fontSize: fontSize.md,
              fontWeight: '600',
            }}>
            {titre}
          </Text>
          {sousTitre ? (
            <Text
              style={{
                color: t.colors.textFaint,
                fontSize: fontSize.xs,
                marginTop: 2,
                lineHeight: 17,
              }}>
              {sousTitre}
            </Text>
          ) : null}
        </View>

        {valeur ? (
          <Text
            style={{ color: t.colors.textFaint, fontSize: fontSize.sm, maxWidth: 120 }}
            numberOfLines={1}>
            {valeur}
          </Text>
        ) : null}
        {agir ? (
          <IconeChevron couleur={t.colors.textFaint} taille={18} ouvert={depliable && ouvert} />
        ) : null}
      </Pressable>

      {depliable && ouvert ? (
        <View
          style={{
            paddingHorizontal: spacing.lg,
            paddingLeft: 62,
            paddingBottom: spacing.lg,
          }}>
          {children}
        </View>
      ) : null}
    </View>
  );
}

/** Une ligne dont le réglage est un simple oui / non. */
export function LigneBascule({
  icone: Icone,
  teinte = 'violet',
  titre,
  sousTitre,
  valeur,
  onChange,
}: {
  icone: (p: PropsIcone) => React.ReactElement;
  teinte?: Teinte;
  titre: string;
  sousTitre?: string;
  valeur: boolean;
  onChange: (v: boolean) => void;
}) {
  const t = useTheme();
  const couleur = teintes[teinte];
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.md,
        paddingHorizontal: spacing.lg,
        paddingVertical: spacing.md,
      }}>
      <View
        style={{
          width: 34,
          height: 34,
          borderRadius: radius.sm + 2,
          backgroundColor: `${couleur}22`,
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <Icone couleur={couleur} taille={20} />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={{ color: t.colors.text, fontSize: fontSize.md, fontWeight: '600' }}>
          {titre}
        </Text>
        {sousTitre ? (
          <Text
            style={{ color: t.colors.textFaint, fontSize: fontSize.xs, marginTop: 2, lineHeight: 17 }}>
            {sousTitre}
          </Text>
        ) : null}
      </View>
      <Switch
        value={valeur}
        onValueChange={onChange}
        trackColor={{ true: t.colors.primary, false: t.colors.border }}
        thumbColor={Platform.OS === 'android' ? t.colors.surface : undefined}
      />
    </View>
  );
}
