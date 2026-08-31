import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Modal, Pressable, ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { IconeChevron } from './icons';
import {
  chapitresDuLivre,
  formaterReference,
  getPassage,
  ReferenceBiblique,
  versionsDisponibles,
} from '../knowledge';
import { VersetTexte } from '../knowledge/bible';
import { useApp } from '../store/AppContext';
import { fontSize, radius, spacing } from '../theme/theme';

/**
 * Lire un passage sans quitter ce qu'on est en train de faire.
 *
 * Une étude biblique demande de lire, puis d'écrire, puis de relire. Envoyer
 * l'utilisateur sur l'écran de lecture le ferait sortir de son étude et
 * perdre sa place ; il revenait alors avec sa Bible papier ou une autre
 * application, et l'atelier ne servait plus à rien. Le texte vient donc à lui.
 *
 * Le panneau connaît la liste des passages de l'étude, pas seulement celui
 * qu'on ouvre : la troisième étape d'une étude de personnages demande de
 * « lire tous les passages à la suite », ce qui n'est faisable que si l'on
 * passe de l'un à l'autre sans repasser par la liste.
 */

/** « 14-15 » quand la version rend plusieurs versets d'un seul tenant. */
function numerote(v: VersetTexte): string {
  return v.versetFin && v.versetFin > v.verset ? `${v.verset}-${v.versetFin}` : String(v.verset);
}

/** Le verset est-il dans la plage visée par la référence ? */
function vise(v: VersetTexte, ref: ReferenceBiblique): boolean {
  if (ref.verset === undefined) return false;
  const fin = ref.versetFin ?? ref.verset;
  return (v.versetFin ?? v.verset) >= ref.verset && v.verset <= fin;
}

export function LecteurPassage({
  references,
  depart,
  onFermer,
}: {
  /** Les passages de l'étude, dans l'ordre. Vide = le panneau ne s'ouvre pas. */
  references: ReferenceBiblique[];
  /** Rang du passage à ouvrir ; `undefined` ferme le panneau. */
  depart: number | undefined;
  onFermer: () => void;
}) {
  const { theme: t, etat, majReglages } = useApp();
  const insets = useSafeAreaInsets();
  const defilement = useRef<ScrollView>(null);
  const [rang, setRang] = useState(0);
  /** Décalage de chapitre par rapport à la référence : on peut lire autour. */
  const [ecart, setEcart] = useState(0);
  /** Où se trouve, dans la page, le premier verset visé par la référence. */
  const hauteurVise = useRef<number | undefined>(undefined);

  const ouvert = depart !== undefined;
  useEffect(() => {
    if (depart !== undefined) {
      setRang(depart);
      setEcart(0);
    }
  }, [depart]);

  const versions = useMemo(() => versionsDisponibles(), []);
  const reference = references[Math.min(rang, references.length - 1)];

  const chapitres = useMemo(
    () => (reference ? chapitresDuLivre(etat.reglages.versionPreferee, reference.livre) : []),
    [etat.reglages.versionPreferee, reference?.livre],
  );

  // La version préférée ne couvre pas forcément ce livre : on lit alors dans la
  // première qui le couvre, en le disant, plutôt que de montrer une page vide.
  const version = useMemo(() => {
    if (!reference) return undefined;
    const preferee = versions.find((v) => v.id === etat.reglages.versionPreferee);
    if (preferee && chapitresDuLivre(preferee.id, reference.livre).length > 0) return preferee;
    return versions.find((v) => chapitresDuLivre(v.id, reference.livre).length > 0);
  }, [versions, etat.reglages.versionPreferee, reference?.livre]);

  const chapitresLus = useMemo(
    () => (version && reference ? chapitresDuLivre(version.id, reference.livre) : chapitres),
    [version?.id, reference?.livre],
  );

  const position = reference ? chapitresLus.indexOf(reference.chapitre) : -1;
  const chapitre =
    position >= 0 ? chapitresLus[Math.max(0, Math.min(position + ecart, chapitresLus.length - 1))] : reference?.chapitre;

  const versets = useMemo(
    () =>
      version && reference && chapitre
        ? getPassage(version.id, { livre: reference.livre, chapitre })
        : [],
    [version?.id, reference?.livre, chapitre],
  );

  // Lire ici compte comme lire : la reprise doit retomber au bon endroit.
  useEffect(() => {
    if (ouvert && reference && chapitre && versets.length > 0) {
      majReglages({ derniereLecture: { livre: reference.livre, chapitre } });
    }
  }, [ouvert, reference?.livre, chapitre, versets.length, majReglages]);

  if (!ouvert || !reference) return null;

  const rangChapitre = chapitre ? chapitresLus.indexOf(chapitre) : -1;
  const precedent = rangChapitre > 0 ? chapitresLus[rangChapitre - 1] : undefined;
  const suivant =
    rangChapitre >= 0 && rangChapitre < chapitresLus.length - 1
      ? chapitresLus[rangChapitre + 1]
      : undefined;
  const echelle = etat.reglages.tailleTexte;

  const allerAuPassage = (n: number) => {
    hauteurVise.current = undefined;
    setRang(n);
    setEcart(0);
    defilement.current?.scrollTo({ y: 0, animated: false });
  };

  return (
    <Modal visible animationType="slide" onRequestClose={onFermer} transparent={false}>
      <View style={{ flex: 1, backgroundColor: t.colors.background, paddingTop: insets.top }}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: spacing.md,
            paddingHorizontal: spacing.lg,
            paddingVertical: spacing.md,
            borderBottomWidth: 1,
            borderBottomColor: t.colors.border,
          }}>
          <View style={{ flex: 1 }}>
            <Text style={{ color: t.colors.text, fontSize: fontSize.lg, fontWeight: '700' }}>
              {reference.livre} {chapitre}
            </Text>
            <Text style={{ color: t.colors.textFaint, fontSize: fontSize.xs, marginTop: 1 }}>
              {version?.nom ?? 'Aucune version ne couvre ce livre'}
              {references.length > 1 ? ` · passage ${rang + 1} sur ${references.length}` : ''}
            </Text>
          </View>
          <Pressable
            onPress={onFermer}
            hitSlop={10}
            style={{
              paddingHorizontal: spacing.lg,
              paddingVertical: spacing.sm,
              borderRadius: radius.pill,
              backgroundColor: t.colors.surfaceAlt,
            }}>
            <Text style={{ color: t.colors.text, fontSize: fontSize.sm, fontWeight: '700' }}>
              Fermer
            </Text>
          </Pressable>
        </View>

        {references.length > 1 ? (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{
              paddingHorizontal: spacing.lg,
              paddingVertical: spacing.md,
              gap: spacing.sm,
            }}
            style={{ flexGrow: 0, borderBottomWidth: 1, borderBottomColor: t.colors.border }}>
            {references.map((r, i) => (
              <Pressable
                key={`${formaterReference(r)}-${i}`}
                onPress={() => allerAuPassage(i)}
                style={{
                  paddingHorizontal: spacing.md,
                  paddingVertical: 6,
                  borderRadius: radius.pill,
                  backgroundColor: i === rang ? t.colors.primary : t.colors.surfaceAlt,
                }}>
                <Text
                  style={{
                    color: i === rang ? '#FFFFFF' : t.colors.textMuted,
                    fontSize: fontSize.xs,
                    fontWeight: '700',
                  }}>
                  {formaterReference(r)}
                </Text>
              </Pressable>
            ))}
          </ScrollView>
        ) : null}

        <ScrollView
          ref={defilement}
          contentContainerStyle={{
            padding: spacing.lg,
            paddingBottom: insets.bottom + spacing.xxxl,
          }}
          showsVerticalScrollIndicator={false}>
          {versets.length === 0 ? (
            <Text style={{ color: t.colors.textMuted, fontSize: fontSize.md, lineHeight: 24 }}>
              Aucune version installée ne contient {reference.livre} {chapitre}.
            </Text>
          ) : null}

          {versets.map((v) => {
            const marque = vise(v, reference) && ecart === 0;
            return (
              <View
                key={`${v.chapitre}-${v.verset}`}
                onLayout={(e) => {
                  // Ouvrir « Ézéchiel 14:14 » sur le premier verset du chapitre
                  // obligerait à chercher le verset à la main. On l'amène sous
                  // les yeux, en gardant un peu de ce qui précède pour le contexte.
                  if (!marque || hauteurVise.current !== undefined) return;
                  hauteurVise.current = e.nativeEvent.layout.y;
                  defilement.current?.scrollTo({
                    y: Math.max(0, e.nativeEvent.layout.y - spacing.xxl),
                    animated: false,
                  });
                }}
                style={{
                  flexDirection: 'row',
                  gap: spacing.sm,
                  marginBottom: spacing.md,
                  paddingHorizontal: marque ? spacing.md : 0,
                  paddingVertical: marque ? spacing.sm : 0,
                  borderRadius: radius.md,
                  backgroundColor: marque ? t.colors.accentSoft : 'transparent',
                }}>
                <Text
                  style={{
                    color: t.colors.accent,
                    fontSize: fontSize.xs * echelle,
                    fontWeight: '800',
                    minWidth: 26,
                    paddingTop: 4,
                  }}>
                  {numerote(v)}
                </Text>
                <Text
                  style={{
                    color: t.colors.text,
                    fontSize: fontSize.md * echelle,
                    lineHeight: 26 * echelle,
                    flex: 1,
                  }}>
                  {v.texte}
                </Text>
              </View>
            );
          })}

          {/* Lire autour du passage : le contexte n'est jamais dans la référence. */}
          <View style={{ flexDirection: 'row', gap: spacing.sm, marginTop: spacing.lg }}>
            {[
              { n: precedent, label: 'Chapitre précédent', pas: -1 },
              { n: suivant, label: 'Chapitre suivant', pas: 1 },
            ].map(({ n, label, pas }) =>
              n === undefined ? null : (
                <Pressable
                  key={label}
                  onPress={() => {
                    setEcart((e) => e + pas);
                    defilement.current?.scrollTo({ y: 0, animated: false });
                  }}
                  style={{
                    flex: 1,
                    alignItems: 'center',
                    paddingVertical: spacing.md,
                    borderRadius: radius.md,
                    borderWidth: 1,
                    borderColor: t.colors.border,
                  }}>
                  <Text style={{ color: t.colors.textMuted, fontSize: fontSize.sm }}>
                    {label}
                  </Text>
                  <Text
                    style={{ color: t.colors.text, fontSize: fontSize.sm, fontWeight: '700' }}>
                    {reference.livre} {n}
                  </Text>
                </Pressable>
              ),
            )}
          </View>

          {rang < references.length - 1 ? (
            <Pressable
              onPress={() => allerAuPassage(rang + 1)}
              style={{
                marginTop: spacing.md,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                gap: spacing.sm,
                paddingVertical: spacing.lg,
                borderRadius: radius.md,
                backgroundColor: t.colors.primary,
              }}>
              <Text style={{ color: '#FFFFFF', fontSize: fontSize.md, fontWeight: '700' }}>
                Passage suivant — {formaterReference(references[rang + 1])}
              </Text>
              <IconeChevron couleur="#FFFFFF" taille={16} />
            </Pressable>
          ) : null}
        </ScrollView>
      </View>
    </Modal>
  );
}
