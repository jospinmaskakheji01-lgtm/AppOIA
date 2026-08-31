import { useLocalSearchParams, useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Share,
  Text,
  TextInput,
  View,
} from 'react-native';

import { Concordance } from '../../src/components/concordance';
import { LecteurPassage } from '../../src/components/lecteur-passage';
import { Bouton, Carte, Etiquette, Separateur, SousTitre } from '../../src/components/ui';
import { getMethodeEtude } from '../../src/data/methodes-etude';
import { extraireReferences, formaterReference, ReferenceBiblique } from '../../src/knowledge';
import { useApp } from '../../src/store/AppContext';
import { fontSize, radius, spacing } from '../../src/theme/theme';

/**
 * L'atelier d'une étude méthodique.
 *
 * Une étape à la fois. Ces méthodes comptent sept à neuf étapes et demandent
 * des heures : tout afficher d'un coup découragerait, et laisserait croire
 * qu'on peut sauter la troisième pour aller à la septième — ce qui est
 * précisément ce que les méthodes servent à éviter.
 */
export default function AtelierEtude() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { theme: t, etat, majTravail, terminerTravail, supprimerTravail } = useApp();
  const router = useRouter();
  const defilement = useRef<ScrollView>(null);

  const travail = etat.travaux.find((x) => x.id === String(id));
  const methode = travail ? getMethodeEtude(travail.methodeId) : undefined;

  // Le brouillon est local : il n'est jamais resynchronisé depuis le store,
  // ce qui évite qu'une sauvegarde en cours ne réécrive la saisie en cours.
  const [reponses, setReponses] = useState<Record<string, string>>(
    () => travail?.reponses ?? {},
  );
  const [rang, setRang] = useState(0);
  /** Rang du passage ouvert à la lecture ; `undefined` = panneau fermé. */
  const [lecture, setLecture] = useState<number | undefined>();
  /** Un passage lu hors de la liste — un verset touché dans le relevé. */
  const [passageSeul, setPassageSeul] = useState<ReferenceBiblique | undefined>();

  /**
   * Les passages de l'étude : ceux que l'utilisateur a écrits, à n'importe
   * quelle étape. C'est ce qui relie les étapes entre elles — la liste dressée
   * à la deuxième sert aux quatre lectures qui suivent, sans qu'il ait à la
   * retaper ni à sortir de l'atelier pour la retrouver.
   */
  const references = useMemo<ReferenceBiblique[]>(() => {
    const vues = new Set<string>();
    const sortie: ReferenceBiblique[] = [];
    for (const cle of Object.keys(reponses)) {
      for (const ref of extraireReferences(reponses[cle] ?? '')) {
        const nom = formaterReference(ref);
        if (vues.has(nom)) continue;
        vues.add(nom);
        sortie.push(ref);
      }
    }
    return sortie;
  }, [reponses]);

  const travailId = travail?.id;
  const enregistrer = useCallback(() => {
    if (travailId) majTravail(travailId, reponses);
  }, [travailId, majTravail, reponses]);

  // Sauvegarde différée : la saisie n'est pas perdue si l'application est fermée.
  useEffect(() => {
    const minuteur = setTimeout(enregistrer, 900);
    return () => clearTimeout(minuteur);
  }, [enregistrer]);

  if (!travail || !methode) {
    return (
      <View style={{ flex: 1, backgroundColor: t.colors.background, padding: spacing.xl }}>
        <SousTitre>Cette étude est introuvable.</SousTitre>
      </View>
    );
  }

  const etape = methode.etapes[Math.min(rang, methode.etapes.length - 1)];
  const derniere = rang >= methode.etapes.length - 1;
  const faites = methode.etapes.filter((e) => (reponses[e.cle] ?? '').trim()).length;

  const aller = (n: number) => {
    enregistrer();
    setRang(Math.max(0, Math.min(n, methode.etapes.length - 1)));
    defilement.current?.scrollTo({ y: 0, animated: true });
  };

  const partager = () => {
    const corps = methode.etapes
      .filter((e) => (reponses[e.cle] ?? '').trim())
      .map((e, i) => `${i + 1}. ${e.titre.toUpperCase()}\n${reponses[e.cle].trim()}`)
      .join('\n\n');
    Share.share({
      message: `${methode.titre.toUpperCase()} — ${travail.sujet}\n\n${corps}`,
    }).catch(() => {});
  };

  const achever = () => {
    enregistrer();
    terminerTravail(travail.id);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
    router.back();
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: t.colors.background }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={90}>
      <ScrollView
        ref={defilement}
        contentContainerStyle={{ padding: spacing.lg, paddingBottom: spacing.xxxl * 2 }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}>
        <Pressable onPress={() => router.push(`/etude/${methode.id}`)}>
          <Etiquette>
            {methode.titre} · étape {rang + 1} sur {methode.etapes.length}
          </Etiquette>
        </Pressable>
        <Text
          style={{
            color: t.colors.text,
            fontSize: fontSize.title,
            fontWeight: '700',
            marginTop: spacing.xs,
          }}>
          {travail.sujet}
        </Text>

        {/* Toutes les étapes restent atteignables : on peut revenir en arrière. */}
        <View
          style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: spacing.lg }}>
          {methode.etapes.map((e, i) => {
            const remplie = (reponses[e.cle] ?? '').trim().length > 0;
            const active = i === rang;
            return (
              <Pressable
                key={e.cle}
                onPress={() => aller(i)}
                hitSlop={4}
                style={{
                  width: 30,
                  height: 30,
                  borderRadius: 15,
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: active
                    ? t.colors.primary
                    : remplie
                      ? t.colors.success
                      : t.colors.surfaceAlt,
                }}>
                <Text
                  style={{
                    color: active || remplie ? '#FFFFFF' : t.colors.textMuted,
                    fontWeight: '800',
                    fontSize: fontSize.xs,
                  }}>
                  {i + 1}
                </Text>
              </Pressable>
            );
          })}
        </View>

        <Carte accent style={{ marginTop: spacing.lg }}>
          <Text style={{ color: t.colors.text, fontSize: fontSize.lg, fontWeight: '700' }}>
            {etape.titre}
          </Text>
          <Text
            style={{
              color: t.colors.text,
              fontSize: fontSize.md,
              lineHeight: 24,
              marginTop: spacing.sm,
            }}>
            {etape.consigne}
          </Text>
        </Carte>

        {etape.questions.length > 0 ? (
          <View style={{ marginTop: spacing.lg }}>
            {etape.questions.map((q) => (
              <View key={q} style={{ flexDirection: 'row', gap: spacing.sm, marginTop: 6 }}>
                <Text style={{ color: t.colors.accent, fontSize: fontSize.sm }}>›</Text>
                <Text
                  style={{
                    color: t.colors.textMuted,
                    fontSize: fontSize.sm,
                    flex: 1,
                    lineHeight: 21,
                  }}>
                  {q}
                </Text>
              </View>
            ))}
          </View>
        ) : null}

        {etape.outil ? (
          <Text
            style={{
              color: t.colors.accent,
              fontSize: fontSize.sm,
              lineHeight: 21,
              marginTop: spacing.md,
            }}>
            {etape.outil}
          </Text>
        ) : null}

        {etape.atelier === 'concordance' ? (
          <Concordance
            sujet={travail.sujet}
            onLire={(ref) => {
              // Un verset ouvert depuis le relevé n'est pas encore dans la
              // liste de l'étude : on le lit seul, sans fausser les passages.
              setPassageSeul(ref);
              setLecture(0);
            }}
            onAjouter={(texte) =>
              setReponses((r) => {
                const actuel = (r[etape.cle] ?? '').trim();
                return { ...r, [etape.cle]: actuel ? `${actuel}\n${texte}` : texte };
              })
            }
          />
        ) : null}

        {/* Les passages de l'étude, lisibles depuis n'importe quelle étape.
            Sans cela, « lisez tous les passages à la suite » obligeait à sortir
            de l'atelier — et l'on n'y revenait pas. */}
        {references.length > 0 ? (
          <View style={{ marginTop: spacing.lg }}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}>
              <Etiquette>Mes passages · {references.length}</Etiquette>
              <Pressable
                onPress={() => {
                  setPassageSeul(undefined);
                  setLecture(0);
                }}
                hitSlop={8}>
                <Text
                  style={{ color: t.colors.primary, fontSize: fontSize.sm, fontWeight: '700' }}>
                  Tout lire →
                </Text>
              </Pressable>
            </View>
            <View
              style={{
                flexDirection: 'row',
                flexWrap: 'wrap',
                gap: spacing.sm,
                marginTop: spacing.md,
              }}>
              {references.map((r, i) => (
                <Pressable
                  key={`${formaterReference(r)}-${i}`}
                  onPress={() => {
                    setPassageSeul(undefined);
                    setLecture(i);
                  }}
                  style={{
                    paddingHorizontal: spacing.md,
                    paddingVertical: 7,
                    borderRadius: radius.pill,
                    borderWidth: 1,
                    borderColor: t.colors.border,
                    backgroundColor: t.colors.surface,
                  }}>
                  <Text
                    style={{ color: t.colors.text, fontSize: fontSize.xs, fontWeight: '700' }}>
                    {formaterReference(r)}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>
        ) : null}

        <TextInput
          value={reponses[etape.cle] ?? ''}
          onChangeText={(v) => setReponses((r) => ({ ...r, [etape.cle]: v }))}
          onBlur={enregistrer}
          multiline
          textAlignVertical="top"
          placeholder="Votre réponse…"
          placeholderTextColor={t.colors.textFaint}
          style={{
            backgroundColor: t.colors.surface,
            borderRadius: radius.md,
            borderWidth: 1,
            borderColor: (reponses[etape.cle] ?? '').trim()
              ? t.colors.primary
              : t.colors.border,
            paddingHorizontal: spacing.lg,
            paddingVertical: spacing.md,
            marginTop: spacing.lg,
            minHeight: etape.hauteur ?? 130,
            color: t.colors.text,
            fontSize: fontSize.md,
            lineHeight: 23,
          }}
        />

        {etape.garde ? (
          <View
            style={{
              marginTop: spacing.md,
              padding: spacing.lg,
              borderRadius: radius.lg,
              backgroundColor: t.colors.accentSoft,
            }}>
            <Text style={{ color: t.colors.text, fontSize: fontSize.sm, lineHeight: 21 }}>
              ⚠ {etape.garde}
            </Text>
          </View>
        ) : null}

        {derniere ? (
          <>
            <Separateur label={`${faites} / ${methode.etapes.length} étapes renseignées`} />
            <Bouton
              titre={travail.terminee ? 'Étude déjà terminée' : 'Terminer cette étude'}
              onPress={achever}
              desactive={travail.terminee}
            />
            <Bouton
              titre="Partager mon étude"
              variante="secondaire"
              onPress={partager}
              style={{ marginTop: spacing.sm }}
            />
            <Bouton
              titre="Revenir à la première étape"
              variante="discret"
              onPress={() => aller(0)}
              style={{ marginTop: spacing.sm }}
            />
          </>
        ) : (
          <Bouton
            titre={`Étape suivante — ${methode.etapes[rang + 1].titre}`}
            onPress={() => aller(rang + 1)}
            style={{ marginTop: spacing.xl }}
          />
        )}

        {rang > 0 ? (
          <Bouton
            titre="Étape précédente"
            variante="discret"
            onPress={() => aller(rang - 1)}
            style={{ marginTop: spacing.sm }}
          />
        ) : null}

        <Pressable
          onPress={() =>
            Alert.alert('Supprimer cette étude ?', 'Vos réponses seront perdues.', [
              { text: 'Annuler', style: 'cancel' },
              {
                text: 'Supprimer',
                style: 'destructive',
                onPress: () => {
                  supprimerTravail(travail.id);
                  router.back();
                },
              },
            ])
          }
          style={{ alignSelf: 'center', padding: spacing.lg, marginTop: spacing.lg }}>
          <Text style={{ color: t.colors.textFaint, fontSize: fontSize.sm }}>
            Supprimer cette étude
          </Text>
        </Pressable>
      </ScrollView>

      <LecteurPassage
        references={passageSeul ? [passageSeul] : references}
        depart={lecture}
        onFermer={() => setLecture(undefined)}
      />
    </KeyboardAvoidingView>
  );
}
