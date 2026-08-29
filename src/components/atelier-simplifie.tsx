import { useRouter } from 'expo-router';
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

import { ChampOIA } from './oia';
import { Bouton, Carte, Etiquette, Separateur, SousTitre } from './ui';
import {
  CleQuestionA,
  CleQuestionB,
  MOUVEMENTS_SIMPLIFIES,
  MouvementSimplifie,
  NOTE_SIMPLIFIEE,
  progressionSimplifiee,
  questionsA,
  questionsB,
} from '../data/oia-simplifiee';
import { getPassage as getPassageBibliotheque } from '../data/passages';
import { analyserReference, getPassage, versionsDisponibles } from '../knowledge';
import { EtudeOIA, useApp } from '../store/AppContext';
import { fontSize, radius, spacing } from '../theme/theme';

/**
 * L'atelier de la méthode OIA simplifiée : la méditation personnelle
 * quotidienne du document de l'École d'Apollos.
 *
 * Trois mouvements — Méditez, Priez, Obéissez — présentés un par un, pour que
 * chaque écran reste court : c'est une méditation de cinq à quinze minutes, pas
 * une étude. Le passage lu reste sous les yeux pendant « Méditez », puis
 * s'efface : à ce moment-là c'est à vous de répondre.
 */
export function AtelierSimplifie({ etude }: { etude: EtudeOIA }) {
  const { theme: t, etat, majEtude, terminerEtude, supprimerEtude } = useApp();
  const router = useRouter();
  const defilement = useRef<ScrollView>(null);

  // Le brouillon est local : il n'est jamais resynchronisé depuis le store,
  // ce qui évite qu'une sauvegarde en cours ne réécrive la saisie en cours.
  const [reponsesA, setReponsesA] = useState<Partial<Record<CleQuestionA, string>>>(
    () => etude.questionsA ?? {},
  );
  const [reponsesB, setReponsesB] = useState<Partial<Record<CleQuestionB, string>>>(
    () => etude.questionsB ?? {},
  );
  const [priere, setPriere] = useState(() => etude.priere ?? '');
  const [engagement, setEngagement] = useState(() => etude.engagement ?? '');
  const [versetMemoire, setVersetMemoire] = useState(() => etude.versetMemoire ?? '');
  const [mouvement, setMouvement] = useState<MouvementSimplifie>('mediter');

  const etudeId = etude.id;
  const enregistrer = useCallback(() => {
    majEtude(etudeId, {
      questionsA: reponsesA,
      questionsB: reponsesB,
      priere,
      engagement,
      versetMemoire,
    });
  }, [etudeId, majEtude, reponsesA, reponsesB, priere, engagement, versetMemoire]);

  // Sauvegarde différée : la saisie n'est pas perdue si l'application est fermée.
  useEffect(() => {
    const minuteur = setTimeout(enregistrer, 900);
    return () => clearTimeout(minuteur);
  }, [enregistrer]);

  /**
   * Le texte du passage. On le prend d'abord dans la bibliothèque de passages
   * travaillés ; à défaut, on lit la référence dans la version préférée, pour
   * qu'une référence saisie librement affiche quand même ses versets.
   */
  const versets = useMemo(() => {
    const dansLaBibliotheque = etude.passageId
      ? getPassageBibliotheque(etude.passageId)
      : undefined;
    if (dansLaBibliotheque) {
      return dansLaBibliotheque.verses.map((v) => ({ numero: String(v.n), texte: v.t }));
    }
    const ref = analyserReference(etude.reference);
    if (!ref) return [];
    const versions = versionsDisponibles();
    const version =
      versions.find((v) => v.id === etat.reglages.versionPreferee) ?? versions[0];
    if (!version) return [];
    return getPassage(version.id, ref).map((v) => ({
      numero: v.versetFin && v.versetFin > v.verset ? `${v.verset}-${v.versetFin}` : String(v.verset),
      texte: v.texte,
    }));
  }, [etude.passageId, etude.reference, etat.reglages.versionPreferee]);

  const progressions = useMemo(
    () => ({
      a: progressionSimplifiee(reponsesA, 'questionsA'),
      b: progressionSimplifiee(reponsesB, 'questionsB'),
    }),
    [reponsesA, reponsesB],
  );

  const echelle = etat.reglages.tailleTexte;
  const info = MOUVEMENTS_SIMPLIFIES.find((m) => m.cle === mouvement)!;

  const changerMouvement = (nouveau: MouvementSimplifie) => {
    enregistrer();
    setMouvement(nouveau);
    defilement.current?.scrollTo({ y: 0, animated: true });
  };

  const partager = () => {
    const bloc = (titre: string, entrees: [string, string | undefined][]) => {
      const remplies = entrees.filter(([, v]) => (v ?? '').trim());
      if (remplies.length === 0) return '';
      return `${titre}\n${remplies.map(([q, v]) => `• ${q}\n${v!.trim()}`).join('\n\n')}\n`;
    };
    const texte = [
      `MÉDITATION OIA SIMPLIFIÉE — ${etude.reference}`,
      '',
      bloc('▪ QUESTIONS A', questionsA.map((q) => [q.question, reponsesA[q.cle]])),
      bloc('▪ QUESTIONS B', questionsB.map((q) => [q.question, reponsesB[q.cle]])),
      priere.trim() ? `▪ MA PRIÈRE\n${priere.trim()}\n` : '',
      versetMemoire.trim() ? `▪ VERSET À MÉMORISER\n${versetMemoire.trim()}\n` : '',
      engagement.trim() ? `▪ CE QUE JE METS EN PRATIQUE\n${engagement.trim()}` : '',
    ]
      .filter(Boolean)
      .join('\n');
    Share.share({ message: texte }).catch(() => {});
  };

  const achever = () => {
    enregistrer();
    terminerEtude(etude.id);
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
        <Etiquette>Méditation quotidienne · OIA simplifiée</Etiquette>
        <Text
          style={{
            color: t.colors.text,
            fontSize: fontSize.title,
            fontWeight: '700',
            marginTop: spacing.xs,
          }}>
          {etude.reference}
        </Text>

        <View style={{ flexDirection: 'row', gap: spacing.sm, marginTop: spacing.lg }}>
          {MOUVEMENTS_SIMPLIFIES.map((m) => {
            const actif = m.cle === mouvement;
            return (
              <Pressable
                key={m.cle}
                onPress={() => changerMouvement(m.cle)}
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
                    fontSize: fontSize.md,
                    fontWeight: '700',
                  }}>
                  {m.titre}
                </Text>
              </Pressable>
            );
          })}
        </View>

        <Carte accent style={{ marginTop: spacing.lg }}>
          <Text style={{ color: t.colors.text, fontSize: fontSize.lg, fontWeight: '700' }}>
            {info.titre}
          </Text>
          <Text
            style={{
              color: t.colors.text,
              fontSize: fontSize.md,
              lineHeight: 24,
              marginTop: spacing.xs,
            }}>
            {info.consigne}
          </Text>
          <Text
            style={{
              color: t.colors.textMuted,
              fontSize: fontSize.sm,
              lineHeight: 22,
              marginTop: spacing.sm,
            }}>
            {info.detail}
          </Text>
        </Carte>

        {mouvement === 'mediter' ? (
          <>
            {versets.length > 0 ? (
              <View
                style={{
                  marginTop: spacing.lg,
                  padding: spacing.lg,
                  borderRadius: radius.lg,
                  backgroundColor: t.colors.surface,
                  borderWidth: 1,
                  borderColor: t.colors.border,
                }}>
                {versets.map((v) => (
                  <View key={v.numero} style={{ flexDirection: 'row', marginBottom: spacing.sm }}>
                    <Text
                      style={{
                        color: t.colors.textFaint,
                        fontSize: fontSize.xs * echelle,
                        fontWeight: '700',
                        width: 28,
                        paddingTop: 4,
                      }}>
                      {v.numero}
                    </Text>
                    <Text
                      style={{
                        color: t.colors.text,
                        fontSize: fontSize.md * echelle,
                        lineHeight: 25 * echelle,
                        flex: 1,
                      }}>
                      {v.texte}
                    </Text>
                  </View>
                ))}
              </View>
            ) : (
              <SousTitre style={{ marginTop: spacing.lg }}>
                Lisez le passage dans votre Bible, puis répondez ici.
              </SousTitre>
            )}

            <Separateur label="Questions A" />
            <SousTitre style={{ marginBottom: spacing.lg }}>
              Ce que le passage dit. Toutes ne se posent pas sur tous les textes.
            </SousTitre>
            {questionsA.map((q) => (
              <ChampOIA
                key={q.cle}
                question={q}
                valeur={reponsesA[q.cle] ?? ''}
                onChange={(v) => setReponsesA((o) => ({ ...o, [q.cle]: v }))}
                onBlur={enregistrer}
                hauteur={90}
              />
            ))}

            <Separateur label="Questions B" />
            <SousTitre style={{ marginBottom: spacing.lg }}>
              Le verset qui vous interpelle, puis ce que Dieu vous montre pour votre prière.
            </SousTitre>
            {questionsB.map((q) => (
              <ChampOIA
                key={q.cle}
                question={q}
                valeur={reponsesB[q.cle] ?? ''}
                onChange={(v) => setReponsesB((o) => ({ ...o, [q.cle]: v }))}
                onBlur={enregistrer}
                hauteur={q.cle === 'versetInterpellant' ? 110 : 80}
              />
            ))}

            <Bouton titre="Passer à la prière" onPress={() => changerMouvement('prier')} />
          </>
        ) : null}

        {mouvement === 'prier' ? (
          <>
            <View
              style={{
                marginTop: spacing.lg,
                padding: spacing.xl,
                borderRadius: radius.lg,
                backgroundColor: t.colors.surfaceAlt,
              }}>
              <Text
                style={{
                  color: t.colors.textMuted,
                  fontSize: fontSize.md,
                  textAlign: 'center',
                  lineHeight: 24,
                }}>
                Le texte est mis de côté. C’est à vous de parler à Dieu maintenant.
              </Text>
            </View>

            {reponsesB.versetInterpellant?.trim() ? (
              <Carte style={{ marginTop: spacing.lg }}>
                <Etiquette>Le verset qui vous a interpellé</Etiquette>
                <Text
                  style={{
                    color: t.colors.text,
                    fontSize: fontSize.md * echelle,
                    lineHeight: 26 * echelle,
                    fontStyle: 'italic',
                    marginTop: spacing.sm,
                  }}>
                  {reponsesB.versetInterpellant.trim()}
                </Text>
              </Carte>
            ) : null}

            <Separateur label="Ma prière" />
            <SousTitre style={{ marginBottom: spacing.md }}>
              Reprenez vos réponses aux questions B et transformez-les en prière : ce dont
              vous vous repentez, ce à quoi vous croyez et obéissez, ce pour quoi vous
              remerciez, ce que vous demandez.
            </SousTitre>
            <TextInput
              value={priere}
              onChangeText={setPriere}
              onBlur={enregistrer}
              multiline
              textAlignVertical="top"
              placeholder="Seigneur…"
              placeholderTextColor={t.colors.textFaint}
              style={{
                backgroundColor: t.colors.surface,
                borderRadius: radius.md,
                borderWidth: 1,
                borderColor: priere.trim() ? t.colors.primary : t.colors.border,
                paddingHorizontal: spacing.lg,
                paddingVertical: spacing.md,
                minHeight: 160,
                color: t.colors.text,
                fontSize: fontSize.md,
                lineHeight: 23,
              }}
            />

            <Separateur label="Verset à mémoriser" />
            <SousTitre style={{ marginBottom: spacing.md }}>
              Mémorisez en partie ou en entier le plus beau verset.
            </SousTitre>
            <TextInput
              value={versetMemoire}
              onChangeText={setVersetMemoire}
              onBlur={enregistrer}
              multiline
              textAlignVertical="top"
              placeholder="Le verset que vous emportez, avec sa référence…"
              placeholderTextColor={t.colors.textFaint}
              style={{
                backgroundColor: t.colors.surface,
                borderRadius: radius.md,
                borderWidth: 1,
                borderColor: versetMemoire.trim() ? t.colors.primary : t.colors.border,
                paddingHorizontal: spacing.lg,
                paddingVertical: spacing.md,
                minHeight: 90,
                color: t.colors.text,
                fontSize: fontSize.md,
                lineHeight: 23,
              }}
            />
            {reponsesB.versetInterpellant?.trim() && !versetMemoire.trim() ? (
              <Pressable
                onPress={() => setVersetMemoire(reponsesB.versetInterpellant!.trim())}
                style={{ marginTop: spacing.sm }}>
                <Text style={{ color: t.colors.accent, fontSize: fontSize.sm, fontWeight: '700' }}>
                  Reprendre le verset qui m’a interpellé
                </Text>
              </Pressable>
            ) : null}

            <Bouton
              titre="Passer à l’obéissance"
              onPress={() => changerMouvement('obeir')}
              style={{ marginTop: spacing.xl }}
            />
          </>
        ) : null}

        {mouvement === 'obeir' ? (
          <>
            <Separateur label="Ce que je mets en pratique" />
            <SousTitre style={{ marginBottom: spacing.md }}>
              En une phrase, à la première personne, une action concrète et possible que
              vous poserez aujourd’hui.
            </SousTitre>
            <TextInput
              value={engagement}
              onChangeText={setEngagement}
              onBlur={enregistrer}
              multiline
              textAlignVertical="top"
              placeholder="Aujourd’hui, je…"
              placeholderTextColor={t.colors.textFaint}
              style={{
                backgroundColor: t.colors.surface,
                borderRadius: radius.md,
                borderWidth: 1,
                borderColor: engagement.trim() ? t.colors.primary : t.colors.border,
                paddingHorizontal: spacing.lg,
                paddingVertical: spacing.md,
                minHeight: 110,
                color: t.colors.text,
                fontSize: fontSize.md,
                lineHeight: 23,
              }}
            />

            <Carte style={{ marginTop: spacing.lg }}>
              <Text style={{ color: t.colors.textMuted, fontSize: fontSize.sm, lineHeight: 22 }}>
                {NOTE_SIMPLIFIEE}
              </Text>
            </Carte>

            <Bouton
              titre={etude.terminee ? 'Méditation déjà terminée' : 'Terminer cette méditation'}
              onPress={achever}
              desactive={etude.terminee}
              style={{ marginTop: spacing.xl }}
            />
            <Bouton
              titre="Partager ma méditation"
              variante="secondaire"
              onPress={partager}
              style={{ marginTop: spacing.sm }}
            />
            <Bouton
              titre="Écrire dans mon journal"
              variante="discret"
              onPress={() => {
                enregistrer();
                router.push(
                  `/journal/nouvelle?reference=${encodeURIComponent(etude.reference)}&titre=${encodeURIComponent('Méditation OIA')}`,
                );
              }}
              style={{ marginTop: spacing.sm }}
            />
          </>
        ) : null}

        <View style={{ flexDirection: 'row', gap: spacing.sm, marginTop: spacing.xxxl }}>
          {[
            ['Questions A', progressions.a],
            ['Questions B', progressions.b],
          ].map(([libelle, valeur]) => (
            <View key={String(libelle)} style={{ flex: 1 }}>
              <Text
                style={{
                  color: t.colors.textFaint,
                  fontSize: fontSize.xs,
                  fontWeight: '700',
                  marginBottom: 4,
                }}>
                {libelle}
              </Text>
              <View
                style={{
                  height: 4,
                  borderRadius: 2,
                  backgroundColor: t.colors.surfaceAlt,
                  overflow: 'hidden',
                }}>
                <View
                  style={{
                    width: `${Math.round(Number(valeur) * 100)}%`,
                    height: '100%',
                    backgroundColor: t.colors.accent,
                  }}
                />
              </View>
            </View>
          ))}
        </View>

        <Pressable
          onPress={() =>
            Alert.alert('Supprimer cette méditation ?', 'Vos réponses seront perdues.', [
              { text: 'Annuler', style: 'cancel' },
              {
                text: 'Supprimer',
                style: 'destructive',
                onPress: () => {
                  supprimerEtude(etude.id);
                  router.back();
                },
              },
            ])
          }
          style={{ alignSelf: 'center', padding: spacing.lg, marginTop: spacing.md }}>
          <Text style={{ color: t.colors.textFaint, fontSize: fontSize.sm }}>
            Supprimer cette méditation
          </Text>
        </Pressable>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
