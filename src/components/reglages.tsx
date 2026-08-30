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

/**
 * Le choix du thème, avec un aperçu de chacun.
 *
 * Trois vignettes plutôt que trois mots : « clair » et « sombre » se
 * reconnaissent d'un coup d'œil, et « système » se comprend mieux quand on le
 * voit coupé en deux. La vignette n'est pas une image mais les vraies couleurs
 * des thèmes — elle ne peut donc pas mentir sur ce qu'on va obtenir.
 */
export function ChoixTheme({
  valeur,
  onChange,
}: {
  valeur: 'systeme' | 'aube' | 'veillee';
  onChange: (v: 'systeme' | 'aube' | 'veillee') => void;
}) {
  const t = useTheme();
  const choix = [
    { cle: 'clair', label: 'Clair', valeur: 'aube' as const },
    { cle: 'sombre', label: 'Sombre', valeur: 'veillee' as const },
    { cle: 'systeme', label: 'Système', valeur: 'systeme' as const },
  ];

  return (
    <View>
      <View style={{ flexDirection: 'row', gap: spacing.md }}>
        {choix.map((c) => {
          const actif = valeur === c.valeur;
          return (
            <Pressable
              key={c.cle}
              onPress={() => onChange(c.valeur)}
              accessibilityRole="radio"
              accessibilityState={{ selected: actif }}
              style={{ flex: 1, alignItems: 'center' }}>
              <View
                style={{
                  width: '100%',
                  aspectRatio: 0.82,
                  borderRadius: radius.md,
                  borderWidth: actif ? 2 : 1,
                  borderColor: actif ? t.colors.primary : t.colors.border,
                  overflow: 'hidden',
                  flexDirection: 'row',
                }}>
                {(c.valeur === 'systeme'
                  ? ([apercus.aube, apercus.veillee] as const)
                  : ([apercus[c.valeur]] as const)
                ).map((a, i) => (
                  <View
                    key={i}
                    style={{ flex: 1, backgroundColor: a.fond, padding: 7, justifyContent: 'flex-end' }}>
                    <View
                      style={{
                        height: 5,
                        borderRadius: 3,
                        backgroundColor: a.trait,
                        marginBottom: 4,
                        width: '85%',
                      }}
                    />
                    <View
                      style={{ height: 5, borderRadius: 3, backgroundColor: a.faible, marginBottom: 4 }}
                    />
                    <View
                      style={{
                        height: 14,
                        borderRadius: 4,
                        backgroundColor: a.carte,
                        borderWidth: 1,
                        borderColor: a.bord,
                      }}
                    />
                  </View>
                ))}
              </View>
              <Text
                style={{
                  color: actif ? t.colors.primary : t.colors.textMuted,
                  fontSize: fontSize.sm,
                  fontWeight: actif ? '700' : '600',
                  marginTop: spacing.sm,
                }}>
                {c.label}
              </Text>
            </Pressable>
          );
        })}
      </View>
      <Text
        style={{
          color: t.colors.textFaint,
          fontSize: fontSize.xs,
          lineHeight: 17,
          marginTop: spacing.md,
        }}>
        {valeur === 'systeme'
          ? 'L’application suit le réglage de votre téléphone : claire le jour, sombre la nuit s’il est réglé ainsi.'
          : valeur === 'aube'
            ? 'Toujours clair, quel que soit le réglage du téléphone.'
            : 'Toujours sombre, quel que soit le réglage du téléphone. Plus reposant pour lire le soir.'}
      </Text>
    </View>
  );
}

/** Les vraies couleurs des deux thèmes, pour que l'aperçu ne mente pas. */
const apercus = {
  aube: { fond: '#FBF7F0', carte: '#FFFFFF', bord: '#E7DCCB', trait: '#241F2E', faible: '#C9BFB0' },
  veillee: { fond: '#14132A', carte: '#1E1D3B', bord: '#333062', trait: '#F2EFE8', faible: '#4A4770' },
} as const;
