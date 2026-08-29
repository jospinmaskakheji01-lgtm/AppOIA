import React, { useState } from 'react';
import { ScrollView, Text, View } from 'react-native';

import { Carte, Etiquette, Puce, Separateur, SousTitre, Titre } from '../../src/components/ui';
import {
  CARACTERISTIQUES_APPLICATION,
  NOTE_APPLICATION,
  NOTE_OBSERVATION,
  TEMPS_OIA,
  exempleOIA,
  questionsApplication,
  questionsInterpretation,
  questionsObservation,
} from '../../src/data/oia';
import {
  MOUVEMENTS_SIMPLIFIES,
  NOTE_SIMPLIFIEE,
  questionsA,
  questionsB,
} from '../../src/data/oia-simplifiee';
import { BlocConseils } from '../../src/components/oia-connaissance';
import { getPassage } from '../../src/data/passages';
import { conseilsPour, getSource } from '../../src/knowledge';
import { SOURCE_HENDRICKS } from '../../src/data/modules/methode-sources';
import { useApp } from '../../src/store/AppContext';
import { fontSize, radius, spacing } from '../../src/theme/theme';

export default function Methode() {
  const { theme: t, etat } = useApp();
  const [onglet, setOnglet] = useState<'simplifiee' | 'methode' | 'exemple'>('simplifiee');
  const passage = getPassage(exempleOIA.passageId);
  const echelle = etat.reglages.tailleTexte;

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: t.colors.background }}
      contentContainerStyle={{ padding: spacing.lg, paddingBottom: spacing.xxxl * 2 }}
      showsVerticalScrollIndicator={false}>
      <Etiquette>La méthode</Etiquette>
      <Titre style={{ marginTop: spacing.sm }}>OIA</Titre>
      <SousTitre style={{ marginTop: spacing.sm }}>
        Trois temps pour lire un texte biblique : observer ce qu’il dit, comprendre ce
        qu’il veut dire, décider ce qu’il change. La méthode existe sous deux formes — la
        simplifiée, pour la méditation personnelle quotidienne ; la générale, pour l’étude
        biblique.
      </SousTitre>

      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm, marginTop: spacing.lg }}>
        <Puce
          texte="OIA simplifiée"
          actif={onglet === 'simplifiee'}
          onPress={() => setOnglet('simplifiee')}
        />
        <Puce texte="OIA générale" actif={onglet === 'methode'} onPress={() => setOnglet('methode')} />
        <Puce texte="Exemple travaillé" actif={onglet === 'exemple'} onPress={() => setOnglet('exemple')} />
      </View>

      {onglet === 'simplifiee' ? (
        <>
          <SousTitre style={{ marginTop: spacing.lg }}>
            Pour la méditation personnelle, celle qui tient en cinq, dix ou quinze minutes.
            Elle se déroule en trois mouvements, et répond à deux séries de questions.
          </SousTitre>

          {MOUVEMENTS_SIMPLIFIES.map((m) => (
            <View key={m.cle} style={{ marginTop: spacing.xl }}>
              <Text style={{ color: t.colors.text, fontSize: fontSize.xl, fontWeight: '700' }}>
                {m.titre}
              </Text>
              <Text
                style={{
                  color: t.colors.accent,
                  fontSize: fontSize.md,
                  fontWeight: '600',
                  marginTop: 2,
                }}>
                {m.consigne}
              </Text>
              <Text
                style={{
                  color: t.colors.textMuted,
                  fontSize: fontSize.md,
                  lineHeight: 24,
                  marginTop: spacing.sm,
                }}>
                {m.detail}
              </Text>

              {m.cle === 'mediter'
                ? [
                    { titre: 'Questions A', questions: questionsA },
                    { titre: 'Questions B', questions: questionsB },
                  ].map((serie) => (
                    <View key={serie.titre}>
                      <Separateur label={serie.titre} />
                      {serie.questions.map((q) => (
                        <Carte key={q.cle} style={{ marginBottom: spacing.sm }}>
                          <Text
                            style={{ color: t.colors.text, fontSize: fontSize.md, fontWeight: '700' }}>
                            {q.question}
                          </Text>
                          <Text
                            style={{
                              color: t.colors.textMuted,
                              fontSize: fontSize.sm,
                              lineHeight: 22,
                              marginTop: spacing.xs,
                            }}>
                            {q.aide}
                          </Text>
                        </Carte>
                      ))}
                    </View>
                  ))
                : null}
            </View>
          ))}

          <Text
            style={{
              color: t.colors.textFaint,
              fontSize: fontSize.sm,
              fontStyle: 'italic',
              marginTop: spacing.xl,
            }}>
            {NOTE_SIMPLIFIEE}
          </Text>
        </>
      ) : null}

      {onglet === 'methode' ? (
        <>
          <SousTitre style={{ marginTop: spacing.lg }}>
            Pour l’étude biblique, qui demande une à deux heures.
          </SousTitre>
          {TEMPS_OIA.map((temps) => {
            const questions =
              temps.cle === 'observation'
                ? questionsObservation
                : temps.cle === 'interpretation'
                  ? questionsInterpretation
                  : questionsApplication;
            return (
              <View key={temps.cle} style={{ marginTop: spacing.xl }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.md }}>
                  <View
                    style={{
                      width: 44,
                      height: 44,
                      borderRadius: radius.md,
                      backgroundColor: t.colors.primary,
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                    <Text
                      style={{ color: t.colors.onPrimary, fontSize: fontSize.xl, fontWeight: '800' }}>
                      {temps.lettre}
                    </Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={{ color: t.colors.text, fontSize: fontSize.xl, fontWeight: '700' }}>
                      {temps.titre}
                    </Text>
                    <Text style={{ color: t.colors.accent, fontSize: fontSize.sm, fontWeight: '600' }}>
                      {temps.question}
                    </Text>
                  </View>
                </View>

                <Text
                  style={{
                    color: t.colors.textMuted,
                    fontSize: fontSize.md,
                    lineHeight: 24,
                    marginTop: spacing.md,
                  }}>
                  {temps.consigne}
                </Text>

                {questions.map((q) => (
                  <Carte key={q.cle} style={{ marginTop: spacing.md }}>
                    <Text style={{ color: t.colors.text, fontSize: fontSize.md, fontWeight: '700' }}>
                      {q.question}
                    </Text>
                    <Text
                      style={{
                        color: t.colors.textMuted,
                        fontSize: fontSize.sm,
                        lineHeight: 22,
                        marginTop: spacing.xs,
                      }}>
                      {q.aide}
                    </Text>
                    {q.sousQuestions.map((sq) => (
                      <View key={sq} style={{ flexDirection: 'row', gap: spacing.sm, marginTop: 6 }}>
                        <Text style={{ color: t.colors.accent, fontSize: fontSize.sm }}>›</Text>
                        <Text
                          style={{
                            color: t.colors.textFaint,
                            fontSize: fontSize.sm,
                            flex: 1,
                            lineHeight: 20,
                          }}>
                          {sq}
                        </Text>
                      </View>
                    ))}
                  </Carte>
                ))}

                {temps.cle === 'observation' ? (
                  <Text
                    style={{
                      color: t.colors.textFaint,
                      fontSize: fontSize.sm,
                      fontStyle: 'italic',
                      marginTop: spacing.md,
                    }}>
                    {NOTE_OBSERVATION}
                  </Text>
                ) : null}

                {temps.cle === 'application' ? (
                  <>
                    <Text
                      style={{
                        color: t.colors.textFaint,
                        fontSize: fontSize.sm,
                        fontStyle: 'italic',
                        marginTop: spacing.md,
                      }}>
                      {NOTE_APPLICATION}
                    </Text>
                    <Separateur label="Caractéristiques de l’application" />
                    <SousTitre style={{ marginBottom: spacing.md }}>
                      D’après Rick Warren, l’application doit avoir ces quatre
                      caractéristiques.
                    </SousTitre>
                    {CARACTERISTIQUES_APPLICATION.map((c) => (
                      <Carte key={c.cle} style={{ marginBottom: spacing.sm }}>
                        <Text
                          style={{ color: t.colors.text, fontSize: fontSize.md, fontWeight: '700' }}>
                          {c.titre}
                        </Text>
                        <Text
                          style={{
                            color: t.colors.textMuted,
                            fontSize: fontSize.sm,
                            lineHeight: 22,
                            marginTop: spacing.xs,
                          }}>
                          {c.texte}
                        </Text>
                      </Carte>
                    ))}
                  </>
                ) : null}
              </View>
            );
          })}

          <Separateur label="D’où vient cette méthode" />
          <SousTitre style={{ marginBottom: spacing.lg }}>
            Les trois temps, et les neuf questions de l’Application, viennent de
            {' '}
            {getSource(SOURCE_HENDRICKS)?.titre ?? 'Living By the Book'}. Ce que ces
            ouvrages écrivent sur chaque temps est repris ici, chapitre par chapitre.
          </SousTitre>
          <BlocConseils conseils={conseilsPour('observation')} titre="Sur l’Observation" />
          <BlocConseils conseils={conseilsPour('interpretation')} titre="Sur l’Interprétation" />
          <BlocConseils conseils={conseilsPour('application')} titre="Sur l’Application" />
        </>
      ) : null}

      {onglet === 'exemple' ? (
        <>
          <Separateur label={`Exemple · ${exempleOIA.reference}`} />

          {passage ? (
            <Carte>
              {passage.verses.map((v) => (
                <View key={v.n} style={{ flexDirection: 'row', marginBottom: spacing.sm }}>
                  <Text
                    style={{
                      color: t.colors.textFaint,
                      fontSize: fontSize.xs * echelle,
                      fontWeight: '700',
                      width: 24,
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
            </Carte>
          ) : null}

          <BlocExemple
            lettre="O"
            titre="Observation"
            entrees={questionsObservation.map((q) => [
              q.question,
              exempleOIA.observation[q.cle],
            ])}
          />
          <BlocExemple
            lettre="I"
            titre="Interprétation"
            entrees={questionsInterpretation.map(
              (q) => [q.question, exempleOIA.interpretation[q.cle]] as [string, string | undefined],
            )}
          />
          <BlocExemple
            lettre="A"
            titre="Application"
            entrees={questionsApplication
              .map((q) => [q.question, exempleOIA.application[q.cle]] as [string, string | undefined])
              .filter(([, v]) => Boolean(v))}
          />

          <Separateur label="Verset à mémoriser" />
          <Carte accent>
            <Text
              style={{
                color: t.colors.text,
                fontSize: fontSize.lg * echelle,
                lineHeight: 28 * echelle,
                fontStyle: 'italic',
              }}>
              « {exempleOIA.versetMemoire.texte} »
            </Text>
            <Text
              style={{
                color: t.colors.accent,
                fontSize: fontSize.sm,
                fontWeight: '700',
                marginTop: spacing.md,
              }}>
              {exempleOIA.versetMemoire.ref}
            </Text>
          </Carte>
        </>
      ) : null}
    </ScrollView>
  );
}

function BlocExemple({
  lettre,
  titre,
  entrees,
}: {
  lettre: string;
  titre: string;
  entrees: [string, string | undefined][];
}) {
  const { theme: t } = useApp();
  return (
    <View style={{ marginTop: spacing.xl }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.md }}>
        <View
          style={{
            width: 32,
            height: 32,
            borderRadius: radius.sm,
            backgroundColor: t.colors.accent,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Text style={{ color: '#FFFFFF', fontWeight: '800' }}>{lettre}</Text>
        </View>
        <Text style={{ color: t.colors.text, fontSize: fontSize.xl, fontWeight: '700' }}>
          {titre}
        </Text>
      </View>
      {entrees
        .filter(([, v]) => Boolean(v))
        .map(([q, v]) => (
          <View key={q} style={{ marginTop: spacing.md }}>
            <Text style={{ color: t.colors.accent, fontSize: fontSize.md, fontWeight: '700' }}>
              {q}
            </Text>
            <Text
              style={{
                color: t.colors.textMuted,
                fontSize: fontSize.md,
                lineHeight: 25,
                marginTop: 4,
              }}>
              {v}
            </Text>
          </View>
        ))}
    </View>
  );
}
