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

import { BandeauTemps, BlocRevelable, CarteFicheLivre, ChampOIA } from '../../src/components/oia';
import { Bouton, Carte, Etiquette, Separateur, SousTitre } from '../../src/components/ui';
import { getFiche } from '../../src/data/livres';
import {
  CleApplication,
  CleInterpretation,
  CleObservation,
  NOTE_APPLICATION,
  TEMPS_OIA,
  progressionTemps,
  questionsApplication,
  questionsInterpretation,
  questionsObservation,
} from '../../src/data/oia';
import { getPassage } from '../../src/data/passages';
import { getJour } from '../../src/data/plans';
import { analyserReference, dossierReference } from '../../src/knowledge';
import { CarteEntree } from '../../src/components/oia-connaissance';
import { useApp } from '../../src/store/AppContext';
import { fontSize, radius, spacing } from '../../src/theme/theme';

type Temps = 'observation' | 'interpretation' | 'application';

export default function AtelierOIA() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { theme: t, etat, majEtude, terminerEtude, supprimerEtude } = useApp();
  const router = useRouter();

  const etude = etat.etudes.find((e) => e.id === String(id));

  // Le brouillon est local : il n'est jamais resynchronisé depuis le store,
  // ce qui évite qu'une sauvegarde en cours ne réécrive la saisie en cours.
  const [observation, setObservation] = useState<Partial<Record<CleObservation, string>>>(
    () => etude?.observation ?? {},
  );
  const [interpretation, setInterpretation] = useState<
    Partial<Record<CleInterpretation, string>>
  >(() => etude?.interpretation ?? {});
  const [application, setApplication] = useState<Partial<Record<CleApplication, string>>>(
    () => etude?.application ?? {},
  );
  const [engagement, setEngagement] = useState(() => etude?.engagement ?? '');
  const [versetMemoire, setVersetMemoire] = useState(() => etude?.versetMemoire ?? '');
  const [temps, setTemps] = useState<Temps>('observation');
  const defilement = useRef<ScrollView>(null);

  const etudeId = etude?.id;
  const enregistrer = useCallback(() => {
    if (!etudeId) return;
    majEtude(etudeId, { observation, interpretation, application, engagement, versetMemoire });
  }, [etudeId, majEtude, observation, interpretation, application, engagement, versetMemoire]);

  // Sauvegarde différée : la saisie n'est pas perdue si l'application est fermée.
  useEffect(() => {
    const minuteur = setTimeout(enregistrer, 900);
    return () => clearTimeout(minuteur);
  }, [enregistrer]);

  const passage = etude?.passageId ? getPassage(etude.passageId) : undefined;
  const fiche = passage ? getFiche(passage.book) : undefined;
  const guide =
    etude?.planId && etude.jour !== undefined ? getJour(etude.planId, etude.jour) : undefined;

  const versets = useMemo(() => {
    if (!passage) return [];
    if (!guide?.versets) return passage.verses;
    const garder = new Set(guide.versets);
    return passage.verses.filter((v) => garder.has(v.n));
  }, [passage, guide]);

  /** Ce que la base de connaissances sait du passage étudié. */
  const dossier = useMemo(() => {
    const ref = analyserReference(etude?.reference ?? '');
    return ref ? dossierReference(ref) : undefined;
  }, [etude?.reference]);

  const progressions = useMemo(
    () => ({
      observation: progressionTemps(observation, 'observation'),
      interpretation: progressionTemps(interpretation, 'interpretation'),
      application: progressionTemps(application, 'application'),
    }),
    [observation, interpretation, application],
  );

  if (!etude) {
    return (
      <View style={{ flex: 1, backgroundColor: t.colors.background, padding: spacing.xl }}>
        <SousTitre>Cette étude est introuvable.</SousTitre>
      </View>
    );
  }

  const echelle = etat.reglages.tailleTexte;
  const changerTemps = (nouveau: Temps) => {
    enregistrer();
    setTemps(nouveau);
    defilement.current?.scrollTo({ y: 0, animated: true });
  };

  const partager = () => {
    const bloc = (titre: string, entrees: [string, string | undefined][]) =>
      `${titre}\n` +
      entrees
        .filter(([, v]) => (v ?? '').trim())
        .map(([q, v]) => `• ${q}\n${v!.trim()}`)
        .join('\n\n');
    const texte = [
      `ÉTUDE OIA — ${etude.reference}`,
      '',
      bloc(
        '▪ OBSERVATION',
        questionsObservation.map((q) => [q.question, observation[q.cle]]),
      ),
      '',
      bloc(
        '▪ INTERPRÉTATION',
        questionsInterpretation.map((q) => [q.question, interpretation[q.cle]]),
      ),
      '',
      bloc(
        '▪ APPLICATION',
        questionsApplication.map((q) => [q.question, application[q.cle]]),
      ),
      engagement.trim() ? `\n▪ MON ENGAGEMENT\n${engagement.trim()}` : '',
      versetMemoire.trim() ? `\n▪ VERSET À MÉMORISER\n${versetMemoire.trim()}` : '',
    ].join('\n');
    Share.share({ message: texte }).catch(() => {});
  };

  const achever = () => {
    enregistrer();
    terminerEtude(etude.id);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
    router.back();
  };

  const infoTemps = TEMPS_OIA.find((x) => x.cle === temps)!;

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
        <Etiquette>{guide ? `Plan · jour ${guide.jour}` : 'Étude libre'}</Etiquette>
        <Text
          style={{
            color: t.colors.text,
            fontSize: fontSize.title,
            fontWeight: '700',
            marginTop: spacing.xs,
          }}>
          {etude.reference}
        </Text>
        {guide ? <SousTitre style={{ marginTop: spacing.xs }}>{guide.titre}</SousTitre> : null}

        <View style={{ marginTop: spacing.lg }}>
          <BandeauTemps courant={temps} progressions={progressions} onChange={changerTemps} />
        </View>

        <Carte accent style={{ marginTop: spacing.lg }}>
          <Text style={{ color: t.colors.text, fontSize: fontSize.lg, fontWeight: '700' }}>
            {infoTemps.lettre} — {infoTemps.titre} : {infoTemps.question}
          </Text>
          <Text
            style={{
              color: t.colors.textMuted,
              fontSize: fontSize.sm,
              lineHeight: 22,
              marginTop: spacing.sm,
            }}>
            {infoTemps.consigne}
          </Text>
        </Carte>

        {passage ? (
          <View style={{ marginTop: spacing.lg }}>
            <Pressable onPress={() => router.push(`/passage/${passage.id}`)}>
              <Text style={{ color: t.colors.accent, fontSize: fontSize.sm, fontWeight: '700' }}>
                Lire le passage en plein écran →
              </Text>
            </Pressable>
            <View
              style={{
                marginTop: spacing.md,
                padding: spacing.lg,
                borderRadius: radius.lg,
                backgroundColor: t.colors.surface,
                borderWidth: 1,
                borderColor: t.colors.border,
              }}>
              {versets.map((v) => (
                <View key={v.n} style={{ flexDirection: 'row', marginBottom: spacing.sm }}>
                  <Text
                    style={{
                      color: t.colors.textFaint,
                      fontSize: fontSize.xs * echelle,
                      fontWeight: '700',
                      width: 22,
                      paddingTop: 4,
                    }}>
                    {v.n}
                  </Text>
                  <Text
                    style={{
                      color: t.colors.text,
                      fontSize: fontSize.md * echelle,
                      lineHeight: 25 * echelle,
                      flex: 1,
                    }}>
                    {v.t}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        ) : null}

        {guide?.contexteImmediat ? (
          <View
            style={{
              marginTop: spacing.lg,
              padding: spacing.lg,
              borderRadius: radius.lg,
              backgroundColor: t.colors.accentSoft,
            }}>
            <Text style={{ color: t.colors.text, fontSize: fontSize.sm, lineHeight: 22 }}>
              {guide.contexteImmediat}
            </Text>
          </View>
        ) : null}

        <Separateur />

        {temps === 'observation' ? (
          <>
            {fiche ? <CarteFicheLivre fiche={fiche} /> : null}
            {dossier && dossier.entrees.length > 0 ? (
              <View style={{ marginBottom: spacing.lg }}>
                <Etiquette>Mots et notions de ce passage</Etiquette>
                <SousTitre style={{ marginTop: spacing.xs, marginBottom: spacing.md }}>
                  Ces notices viennent des ouvrages installés. Elles aident à observer,
                  elles ne remplacent pas votre lecture.
                </SousTitre>
                {dossier.entrees.slice(0, 4).map((e) => (
                  <CarteEntree key={e.id} entree={e} compact />
                ))}
              </View>
            ) : null}

            {questionsObservation.map((q) => (
              <ChampOIA
                key={q.cle}
                question={q}
                valeur={observation[q.cle] ?? ''}
                onChange={(v) => setObservation((o) => ({ ...o, [q.cle]: v }))}
                onBlur={enregistrer}
                piste={guide?.pistesObservation[q.cle]}
                hauteur={q.cle === 'donc' ? 160 : 110}
              />
            ))}
            <Bouton
              titre="Passer à l’Interprétation"
              onPress={() => changerTemps('interpretation')}
            />
          </>
        ) : null}

        {temps === 'interpretation' ? (
          <>
            {fiche ? (
              <View
                style={{
                  backgroundColor: t.colors.surfaceAlt,
                  borderRadius: radius.lg,
                  padding: spacing.lg,
                  marginBottom: spacing.lg,
                }}>
                <Etiquette>Situer dans l’histoire du Salut</Etiquette>
                <Text
                  style={{
                    color: t.colors.textMuted,
                    fontSize: fontSize.md,
                    lineHeight: 24,
                    marginTop: spacing.sm,
                  }}>
                  {fiche.histoireDuSalut}
                </Text>
              </View>
            ) : null}

            {questionsInterpretation.map((q) => (
              <ChampOIA
                key={q.cle}
                question={q}
                valeur={interpretation[q.cle] ?? ''}
                onChange={(v) => setInterpretation((o) => ({ ...o, [q.cle]: v }))}
                onBlur={enregistrer}
                hauteur={130}
              />
            ))}

            {dossier && dossier.commentaires.length > 0 ? (
              <BlocRevelable
                titre={`Voir les commentaires disponibles (${dossier.commentaires.length})`}
                debloque={progressions.interpretation > 0}
                messageVerrou="Écrivez d’abord votre propre réponse : la méthode demande de chercher avant de lire ce que d’autres ont écrit."
                contenu={dossier.commentaires
                  .slice(0, 6)
                  .map((c) => `${c.titre ? `${c.titre} — ` : ''}${c.texte}`)
                  .join('\n\n')}
              />
            ) : null}

            {guide?.interpretation.destinataires ? (
              <BlocRevelable
                titre="Voir l’interprétation proposée"
                debloque={progressions.interpretation > 0}
                messageVerrou="Écrivez d’abord votre propre réponse à l’une des questions ci-dessus."
                contenu={[
                  guide.interpretation.destinataires,
                  guide.interpretation.eglise,
                ]
                  .filter(Boolean)
                  .join('\n\n')}
              />
            ) : null}

            <Bouton titre="Passer à l’Application" onPress={() => changerTemps('application')} />
          </>
        ) : null}

        {temps === 'application' ? (
          <>
            <SousTitre style={{ marginBottom: spacing.lg }}>{NOTE_APPLICATION}</SousTitre>

            {questionsApplication.map((q) => (
              <ChampOIA
                key={q.cle}
                question={q}
                valeur={application[q.cle] ?? ''}
                onChange={(v) => setApplication((o) => ({ ...o, [q.cle]: v }))}
                onBlur={enregistrer}
                piste={guide?.pistesApplication[q.cle]}
                hauteur={80}
              />
            ))}

            <Separateur label="Mon engagement" />
            <SousTitre style={{ marginBottom: spacing.md }}>
              En une phrase, ce que vous décidez de faire. C’est la conclusion de l’étude.
            </SousTitre>
            <TextInput
              value={engagement}
              onChangeText={setEngagement}
              onBlur={enregistrer}
              multiline
              textAlignVertical="top"
              placeholder="Je m’engage à…"
              placeholderTextColor={t.colors.textFaint}
              style={{
                backgroundColor: t.colors.surface,
                borderRadius: radius.md,
                borderWidth: 1,
                borderColor: engagement.trim() ? t.colors.primary : t.colors.border,
                paddingHorizontal: spacing.lg,
                paddingVertical: spacing.md,
                minHeight: 100,
                color: t.colors.text,
                fontSize: fontSize.md,
                lineHeight: 23,
              }}
            />

            <Separateur label="Verset à mémoriser" />
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
            {guide?.versetMemoire ? (
              <Pressable
                onPress={() =>
                  setVersetMemoire(`« ${guide.versetMemoire.texte} » — ${guide.versetMemoire.ref}`)
                }
                style={{ marginTop: spacing.sm }}>
                <Text style={{ color: t.colors.accent, fontSize: fontSize.sm, fontWeight: '700' }}>
                  Reprendre le verset proposé par le plan ({guide.versetMemoire.ref})
                </Text>
              </Pressable>
            ) : null}

            {guide?.questionsApprofondissement.length ? (
              <>
                <Separateur label="Pour creuser" />
                {guide.questionsApprofondissement.map((q, i) => (
                  <View key={i} style={{ flexDirection: 'row', gap: spacing.md, marginBottom: spacing.md }}>
                    <Text style={{ color: t.colors.accent, fontWeight: '700' }}>{i + 1}</Text>
                    <Text
                      style={{
                        color: t.colors.textMuted,
                        fontSize: fontSize.md,
                        lineHeight: 24,
                        flex: 1,
                      }}>
                      {q}
                    </Text>
                  </View>
                ))}
              </>
            ) : null}

            {guide?.priere ? (
              <>
                <Separateur label="Prier" />
                <Carte accent>
                  <Text
                    style={{
                      color: t.colors.text,
                      fontSize: fontSize.md * echelle,
                      lineHeight: 26 * echelle,
                      fontStyle: 'italic',
                    }}>
                    {guide.priere}
                  </Text>
                </Carte>
              </>
            ) : null}

            <Bouton
              titre={etude.terminee ? 'Étude déjà terminée' : 'Terminer cette étude'}
              onPress={achever}
              desactive={etude.terminee}
              style={{ marginTop: spacing.xl }}
            />
            <Bouton
              titre="Partager mon étude"
              variante="secondaire"
              onPress={partager}
              style={{ marginTop: spacing.sm }}
            />
          </>
        ) : null}

        <Pressable
          onPress={() =>
            Alert.alert('Supprimer cette étude ?', 'Vos réponses seront perdues.', [
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
          style={{ alignSelf: 'center', padding: spacing.lg, marginTop: spacing.lg }}>
          <Text style={{ color: t.colors.textFaint, fontSize: fontSize.sm }}>
            Supprimer cette étude
          </Text>
        </Pressable>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
