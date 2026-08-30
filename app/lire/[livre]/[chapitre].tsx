import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Pressable, ScrollView, Share, Text, View } from 'react-native';

import { Etiquette, Puce, SousTitre } from '../../../src/components/ui';
import {
  chapitresDuLivre,
  estDeuterocanonique,
  getPassage,
  trouverLivre,
  versionsDisponibles,
} from '../../../src/knowledge';
import { VersetTexte } from '../../../src/knowledge/bible';
import { useApp } from '../../../src/store/AppContext';
import { fontSize, radius, spacing } from '../../../src/theme/theme';

/** « 14-15 » quand la version rend plusieurs versets d'un seul tenant. */
function numerote(v: VersetTexte): string {
  return v.versetFin && v.versetFin > v.verset ? `${v.verset}-${v.versetFin}` : String(v.verset);
}

export default function LireChapitre() {
  const { livre: livreBrut, chapitre: chapitreBrut } = useLocalSearchParams<{
    livre: string;
    chapitre: string;
  }>();
  const { theme: t, etat, majReglages } = useApp();
  const router = useRouter();
  const defilement = useRef<ScrollView>(null);

  const fiche = trouverLivre(decodeURIComponent(String(livreBrut ?? '')));
  const chapitre = Number(chapitreBrut) || 1;
  const livre = fiche?.nom ?? '';

  const versions = useMemo(() => versionsDisponibles(), []);
  const versionActive =
    versions.find((v) => v.id === etat.reglages.versionPreferee) ?? versions[0];

  /** Les versions qui couvrent réellement ce chapitre : les autres n'ont rien à proposer. */
  const versionsUtiles = useMemo(
    () => versions.filter((v) => chapitresDuLivre(v.id, livre).includes(chapitre)),
    [versions, livre, chapitre],
  );

  const versets = useMemo(
    () => (versionActive && livre ? getPassage(versionActive.id, { livre, chapitre }) : []),
    [versionActive?.id, livre, chapitre],
  );

  const chapitres = useMemo(
    () => (versionActive ? chapitresDuLivre(versionActive.id, livre) : []),
    [versionActive?.id, livre],
  );
  const rang = chapitres.indexOf(chapitre);
  const precedent = rang > 0 ? chapitres[rang - 1] : undefined;
  const suivant = rang >= 0 && rang < chapitres.length - 1 ? chapitres[rang + 1] : undefined;

  // Garder la place, pour que « Reprendre » retombe ici au prochain lancement.
  useEffect(() => {
    if (livre && versets.length > 0) majReglages({ derniereLecture: { livre, chapitre } });
  }, [livre, chapitre, versets.length, majReglages]);

  const [choixVersion, setChoixVersion] = useState(false);
  const echelle = etat.reglages.tailleTexte;

  const aller = (n: number) => {
    router.replace(`/lire/${encodeURIComponent(livre)}/${n}`);
    defilement.current?.scrollTo({ y: 0, animated: false });
  };

  const partager = () => {
    const texte = versets.map((v) => `${numerote(v)} ${v.texte}`).join(' ');
    Share.share({
      message: `${livre} ${chapitre}\n\n${texte}\n\n${versionActive?.nom ?? ''}`,
    }).catch(() => {});
  };

  if (!fiche) {
    return (
      <View style={{ flex: 1, backgroundColor: t.colors.background, padding: spacing.xl }}>
        <SousTitre>Ce livre est introuvable.</SousTitre>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: t.colors.background }}>
      <ScrollView
        ref={defilement}
        contentContainerStyle={{ padding: spacing.lg, paddingBottom: spacing.xxxl * 3 }}
        showsVerticalScrollIndicator={false}>
        <Pressable onPress={() => router.push('/(tabs)/')}>
          <Etiquette>{versionActive?.nom ?? 'Lecture'} · changer de livre</Etiquette>
        </Pressable>
        <Text
          style={{
            color: t.colors.text,
            fontSize: fontSize.title,
            fontWeight: '700',
            marginTop: spacing.xs,
          }}>
          {livre} {chapitre}
        </Text>

        {estDeuterocanonique({ livre, chapitre, verset: versets[0]?.verset ?? 1, versetFin: versets[versets.length - 1]?.verset }) ? (
          <SousTitre style={{ marginTop: spacing.sm }}>
            Passage deutérocanonique : reçu comme canonique par les Églises catholique et
            orthodoxe, tenu pour utile à lire sans être canonique par les Églises issues de la
            Réforme.
          </SousTitre>
        ) : null}

        {versionsUtiles.length > 1 ? (
          <View style={{ marginTop: spacing.md }}>
            <Pressable onPress={() => setChoixVersion((v) => !v)} hitSlop={6}>
              <Text style={{ color: t.colors.accent, fontSize: fontSize.sm, fontWeight: '700' }}>
                {choixVersion ? '− Masquer les versions' : '+ Lire dans une autre version'}
              </Text>
            </Pressable>
            {choixVersion ? (
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm, marginTop: spacing.md }}>
                {versionsUtiles.map((v) => (
                  <Puce
                    key={v.id}
                    texte={v.abreviation}
                    actif={v.id === versionActive?.id}
                    onPress={() => majReglages({ versionPreferee: v.id })}
                  />
                ))}
              </View>
            ) : null}
          </View>
        ) : null}

        <View style={{ marginTop: spacing.xl }}>
          {versets.map((v) => (
            <Pressable
              key={`${v.verset}-${v.versetFin ?? ''}`}
              onPress={() =>
                router.push(`/reference/${encodeURIComponent(`${livre} ${chapitre}:${v.verset}`)}`)
              }
              style={{ flexDirection: 'row', marginBottom: spacing.md }}>
              <Text
                style={{
                  color: t.colors.textFaint,
                  fontSize: fontSize.xs * echelle,
                  fontWeight: '700',
                  width: 34,
                  paddingTop: 4,
                }}>
                {numerote(v)}
              </Text>
              <Text
                style={{
                  color: t.colors.text,
                  fontSize: fontSize.md * echelle,
                  lineHeight: 27 * echelle,
                  flex: 1,
                }}>
                {v.texte}
              </Text>
            </Pressable>
          ))}
        </View>

        {versets.length === 0 ? (
          <SousTitre style={{ marginTop: spacing.lg }}>
            {versionActive?.nom ?? 'Cette version'} ne contient pas {livre} {chapitre}.
            {versionsUtiles.length > 0
              ? ' Choisissez une autre version ci-dessus.'
              : ' Aucune version installée ne couvre ce chapitre.'}
          </SousTitre>
        ) : (
          <Pressable onPress={partager} style={{ marginTop: spacing.lg }}>
            <Text style={{ color: t.colors.accent, fontSize: fontSize.sm, fontWeight: '700' }}>
              Partager ce chapitre →
            </Text>
          </Pressable>
        )}

        <SousTitre style={{ marginTop: spacing.xl }}>
          Touchez un verset pour ouvrir son dossier : les autres versions, les commentaires
          et les mots que les ouvrages installés éclairent.
        </SousTitre>
      </ScrollView>

      {/* Barre de navigation entre chapitres, toujours à portée du pouce. */}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          gap: spacing.sm,
          paddingHorizontal: spacing.lg,
          paddingTop: spacing.md,
          paddingBottom: spacing.xl,
          borderTopWidth: 1,
          borderTopColor: t.colors.border,
          backgroundColor: t.colors.surface,
        }}>
        <Pressable
          onPress={() => precedent && aller(precedent)}
          disabled={!precedent}
          style={{
            flex: 1,
            opacity: precedent ? 1 : 0.35,
            paddingVertical: spacing.md,
            borderRadius: radius.md,
            backgroundColor: t.colors.surfaceAlt,
            alignItems: 'center',
          }}>
          <Text style={{ color: t.colors.text, fontWeight: '700', fontSize: fontSize.sm }}>
            ← {precedent ? `Chapitre ${precedent}` : 'Début'}
          </Text>
        </Pressable>
        <Pressable
          onPress={() => suivant && aller(suivant)}
          disabled={!suivant}
          style={{
            flex: 1,
            opacity: suivant ? 1 : 0.35,
            paddingVertical: spacing.md,
            borderRadius: radius.md,
            backgroundColor: suivant ? t.colors.primary : t.colors.surfaceAlt,
            alignItems: 'center',
          }}>
          <Text
            style={{
              color: suivant ? '#FFFFFF' : t.colors.text,
              fontWeight: '700',
              fontSize: fontSize.sm,
            }}>
            {suivant ? `Chapitre ${suivant}` : 'Fin du livre'} →
          </Text>
        </Pressable>
      </View>
    </View>
  );
}
