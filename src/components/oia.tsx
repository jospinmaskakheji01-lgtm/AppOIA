import React, { useState } from 'react';
import { Pressable, Text, TextInput, View } from 'react-native';

import { FicheLivre } from '../data/livres';
import { QuestionOIA } from '../data/oia';
import { useTheme } from '../store/AppContext';
import { fontSize, radius, spacing } from '../theme/theme';

/** Bandeau des trois temps, avec le temps courant mis en avant. */
export function BandeauTemps({
  courant,
  progressions,
  onChange,
}: {
  courant: 'observation' | 'interpretation' | 'application';
  progressions: Record<'observation' | 'interpretation' | 'application', number>;
  onChange: (t: 'observation' | 'interpretation' | 'application') => void;
}) {
  const t = useTheme();
  const temps = [
    { cle: 'observation' as const, lettre: 'O', titre: 'Observation' },
    { cle: 'interpretation' as const, lettre: 'I', titre: 'Interprétation' },
    { cle: 'application' as const, lettre: 'A', titre: 'Application' },
  ];
  return (
    <View style={{ flexDirection: 'row', gap: spacing.sm }}>
      {temps.map((x) => {
        const actif = x.cle === courant;
        const pct = Math.round(progressions[x.cle] * 100);
        return (
          <Pressable
            key={x.cle}
            onPress={() => onChange(x.cle)}
            style={({ pressed }) => ({
              flex: 1,
              opacity: pressed ? 0.8 : 1,
              backgroundColor: actif ? t.colors.primary : t.colors.surfaceAlt,
              borderRadius: radius.md,
              paddingVertical: spacing.md,
              alignItems: 'center',
            })}>
            <Text
              style={{
                color: actif ? t.colors.onPrimary : t.colors.textMuted,
                fontSize: fontSize.xl,
                fontWeight: '800',
              }}>
              {x.lettre}
            </Text>
            <Text
              style={{
                color: actif ? t.colors.onPrimary : t.colors.textFaint,
                fontSize: 10,
                fontWeight: '600',
                marginTop: 2,
              }}>
              {x.titre}
            </Text>
            <View
              style={{
                height: 3,
                width: '60%',
                borderRadius: 2,
                marginTop: spacing.sm,
                backgroundColor: actif ? 'rgba(255,255,255,0.3)' : t.colors.border,
                overflow: 'hidden',
              }}>
              <View
                style={{
                  width: `${pct}%`,
                  height: '100%',
                  backgroundColor: actif ? t.colors.onPrimary : t.colors.accent,
                }}
              />
            </View>
          </Pressable>
        );
      })}
    </View>
  );
}

/** Un champ de réponse pour une question de la méthode. */
export function ChampOIA<C extends string>({
  question,
  valeur,
  onChange,
  onBlur,
  piste,
  hauteur = 110,
}: {
  question: QuestionOIA<C>;
  valeur: string;
  onChange: (v: string) => void;
  onBlur?: () => void;
  /** Indice propre au passage étudié, replié par défaut. */
  piste?: string;
  hauteur?: number;
}) {
  const t = useTheme();
  const [pisteOuverte, setPisteOuverte] = useState(false);
  const rempli = valeur.trim().length > 0;

  return (
    <View style={{ marginBottom: spacing.xl }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.sm }}>
        <View
          style={{
            width: 8,
            height: 8,
            borderRadius: 4,
            backgroundColor: rempli ? t.colors.success : t.colors.border,
          }}
        />
        <Text style={{ color: t.colors.text, fontSize: fontSize.lg, fontWeight: '700', flex: 1 }}>
          {question.question}
        </Text>
        {question.facultative ? (
          <Text style={{ color: t.colors.textFaint, fontSize: fontSize.xs }}>facultatif</Text>
        ) : null}
      </View>

      <Text
        style={{
          color: t.colors.textMuted,
          fontSize: fontSize.sm,
          lineHeight: 21,
          marginTop: spacing.sm,
        }}>
        {question.aide}
      </Text>

      {question.sousQuestions.map((sq) => (
        <View key={sq} style={{ flexDirection: 'row', gap: spacing.sm, marginTop: spacing.xs }}>
          <Text style={{ color: t.colors.accent, fontSize: fontSize.sm }}>›</Text>
          <Text style={{ color: t.colors.textFaint, fontSize: fontSize.sm, flex: 1, lineHeight: 20 }}>
            {sq}
          </Text>
        </View>
      ))}

      <TextInput
        value={valeur}
        onChangeText={onChange}
        onBlur={onBlur}
        multiline
        textAlignVertical="top"
        placeholder="Votre réponse…"
        placeholderTextColor={t.colors.textFaint}
        style={{
          backgroundColor: t.colors.surface,
          borderRadius: radius.md,
          borderWidth: 1,
          borderColor: rempli ? t.colors.primary : t.colors.border,
          paddingHorizontal: spacing.lg,
          paddingVertical: spacing.md,
          marginTop: spacing.md,
          minHeight: hauteur,
          color: t.colors.text,
          fontSize: fontSize.md,
          lineHeight: 23,
        }}
      />

      {piste ? (
        <View style={{ marginTop: spacing.sm }}>
          <Pressable onPress={() => setPisteOuverte((v) => !v)} hitSlop={6}>
            <Text style={{ color: t.colors.accent, fontSize: fontSize.sm, fontWeight: '700' }}>
              {pisteOuverte ? '− Masquer la piste' : '+ Une piste pour cette question'}
            </Text>
          </Pressable>
          {pisteOuverte ? (
            <View
              style={{
                backgroundColor: t.colors.accentSoft,
                borderRadius: radius.md,
                padding: spacing.md,
                marginTop: spacing.sm,
              }}>
              <Text style={{ color: t.colors.text, fontSize: fontSize.sm, lineHeight: 22 }}>
                {piste}
              </Text>
            </View>
          ) : null}
        </View>
      ) : null}
    </View>
  );
}

/** Fiche du livre : elle sert les questions « Qui ? », « Où ? » et « Quand ? ». */
export function CarteFicheLivre({ fiche }: { fiche: FicheLivre }) {
  const t = useTheme();
  const [ouverte, setOuverte] = useState(false);
  const lignes: [string, string][] = [
    ['Auteur', fiche.auteur],
    ['Destinataires', fiche.destinataires],
    ['Date', fiche.date],
    ['Lieu', fiche.lieu],
    ['Genre', fiche.genre],
    ['Contexte', fiche.contexte],
  ];
  return (
    <View
      style={{
        backgroundColor: t.colors.surfaceAlt,
        borderRadius: radius.lg,
        padding: spacing.lg,
        marginBottom: spacing.lg,
      }}>
      <Pressable onPress={() => setOuverte((v) => !v)}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <View style={{ flex: 1 }}>
            <Text
              style={{
                color: t.colors.accent,
                fontSize: fontSize.xs,
                fontWeight: '700',
                letterSpacing: 1.2,
                textTransform: 'uppercase',
              }}>
              Repères sur le livre
            </Text>
            <Text
              style={{
                color: t.colors.text,
                fontSize: fontSize.lg,
                fontWeight: '700',
                marginTop: 2,
              }}>
              {fiche.livre}
            </Text>
          </View>
          <Text style={{ color: t.colors.textMuted, fontSize: fontSize.lg }}>
            {ouverte ? '−' : '+'}
          </Text>
        </View>
      </Pressable>

      {ouverte ? (
        <View style={{ marginTop: spacing.lg }}>
          {lignes.map(([label, valeur]) => (
            <View key={label} style={{ marginBottom: spacing.md }}>
              <Text
                style={{
                  color: t.colors.textFaint,
                  fontSize: fontSize.xs,
                  fontWeight: '700',
                  letterSpacing: 0.8,
                  textTransform: 'uppercase',
                }}>
                {label}
              </Text>
              <Text style={{ color: t.colors.textMuted, fontSize: fontSize.md, lineHeight: 23 }}>
                {valeur}
              </Text>
            </View>
          ))}
        </View>
      ) : (
        <Text
          style={{
            color: t.colors.textMuted,
            fontSize: fontSize.sm,
            marginTop: spacing.sm,
            lineHeight: 21,
          }}>
          Auteur, destinataires, date et lieu — de quoi répondre à « Qui ? », « Où ? » et
          « Quand ? ».
        </Text>
      )}
    </View>
  );
}

/** Contenu révélé seulement après que l'utilisateur a écrit sa propre réponse. */
export function BlocRevelable({
  titre,
  contenu,
  debloque,
  messageVerrou,
}: {
  titre: string;
  contenu: string;
  debloque: boolean;
  messageVerrou: string;
}) {
  const t = useTheme();
  const [ouvert, setOuvert] = useState(false);
  return (
    <View
      style={{
        borderRadius: radius.lg,
        borderWidth: 1,
        borderColor: t.colors.border,
        backgroundColor: t.colors.surface,
        padding: spacing.lg,
        marginBottom: spacing.lg,
      }}>
      <Pressable onPress={() => debloque && setOuvert((v) => !v)} disabled={!debloque}>
        <Text
          style={{
            color: debloque ? t.colors.primary : t.colors.textFaint,
            fontSize: fontSize.md,
            fontWeight: '700',
          }}>
          {debloque ? (ouvert ? `− ${titre}` : `+ ${titre}`) : `🔒 ${titre}`}
        </Text>
      </Pressable>
      {!debloque ? (
        <Text
          style={{
            color: t.colors.textFaint,
            fontSize: fontSize.sm,
            marginTop: spacing.sm,
            lineHeight: 21,
          }}>
          {messageVerrou}
        </Text>
      ) : ouvert ? (
        <Text
          style={{
            color: t.colors.textMuted,
            fontSize: fontSize.md,
            lineHeight: 25,
            marginTop: spacing.md,
          }}>
          {contenu}
        </Text>
      ) : null}
    </View>
  );
}
