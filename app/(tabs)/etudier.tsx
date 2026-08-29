import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { IconeCoche } from '../../src/components/icons';
import {
  Bouton,
  Carte,
  Etiquette,
  Puce,
  Separateur,
  SousTitre,
  Titre,
} from '../../src/components/ui';
import { progressionTemps } from '../../src/data/oia';
import { progressionSimplifiee } from '../../src/data/oia-simplifiee';
import { plans } from '../../src/data/plans';
import { methodesEtude } from '../../src/data/methodes-etude';
import { chapitresDuJour, formaterPortions, plansLecture } from '../../src/data/plans-lecture';
import { EtudeOIA, useApp } from '../../src/store/AppContext';
import { fontSize, radius, spacing } from '../../src/theme/theme';
import { dateCourte } from '../../src/utils/dates';
import { BarreProgression } from './index';

type Onglet = 'etudes' | 'plans' | 'lecture';

export default function Etudier() {
  const { theme: t, etat } = useApp();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [onglet, setOnglet] = useState<Onglet>('etudes');

  const enCours = etat.etudes.filter((e) => !e.terminee);
  const commences = plans.filter((p) => etat.progressions[p.id]);
  const nouveaux = plans.filter((p) => !etat.progressions[p.id]);
  const lecturesCommencees = plansLecture.filter((p) => etat.progressions[p.id]);
  const lecturesNouvelles = plansLecture.filter((p) => !etat.progressions[p.id]);

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: t.colors.background }}
      contentContainerStyle={{
        padding: spacing.lg,
        paddingTop: insets.top + spacing.md,
        paddingBottom: spacing.xxxl * 2,
      }}
      showsVerticalScrollIndicator={false}>
      <Etiquette>Observation · Interprétation · Application</Etiquette>
      <Titre style={{ marginTop: spacing.sm }}>Étudier</Titre>
      <SousTitre style={{ marginTop: spacing.sm }}>
        Deux méthodes, selon le temps dont vous disposez : la méditation quotidienne
        simplifiée, et l’étude biblique complète.
      </SousTitre>

      <Carte
        accent
        style={{ marginTop: spacing.lg }}
        onPress={() => router.push('/oia/methode')}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.md }}>
          <View style={{ flexDirection: 'row', gap: 4 }}>
            {['O', 'I', 'A'].map((l) => (
              <View
                key={l}
                style={{
                  width: 26,
                  height: 26,
                  borderRadius: radius.sm,
                  backgroundColor: t.colors.primary,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <Text style={{ color: t.colors.onPrimary, fontWeight: '800', fontSize: fontSize.sm }}>
                  {l}
                </Text>
              </View>
            ))}
          </View>
          <View style={{ flex: 1 }}>
            <Text style={{ color: t.colors.text, fontSize: fontSize.md, fontWeight: '700' }}>
              La méthode, et un exemple travaillé
            </Text>
            <SousTitre style={{ marginTop: 1 }}>Luc 8:22-25, étudié pas à pas</SousTitre>
          </View>
        </View>
      </Carte>

      <Bouton
        titre="Méditation du jour · 5 à 15 min"
        onPress={() => router.push('/oia/nouvelle?methode=simplifiee')}
        style={{ marginTop: spacing.md }}
      />
      <Bouton
        titre="Étude biblique complète · 1 à 2 h"
        variante="secondaire"
        onPress={() => router.push('/oia/nouvelle?methode=generale')}
        style={{ marginTop: spacing.sm }}
      />

      <Carte style={{ marginTop: spacing.md }} onPress={() => router.push('/etude')}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.md }}>
          <View
            style={{
              width: 46,
              height: 46,
              borderRadius: radius.md,
              backgroundColor: t.colors.primarySoft,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Text style={{ color: t.colors.primary, fontSize: 20 }}>❋</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={{ color: t.colors.text, fontSize: fontSize.md, fontWeight: '700' }}>
              Six méthodes d’étude biblique
            </Text>
            <SousTitre style={{ marginTop: 1 }}>
              Personnages, thèmes, mots, survol, analyse, contexte — la marche à suivre
            </SousTitre>
          </View>
        </View>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm, marginTop: spacing.md }}>
          {methodesEtude.map((m) => (
            <View
              key={m.id}
              style={{
                backgroundColor: t.colors.surfaceAlt,
                borderRadius: radius.pill,
                paddingVertical: 4,
                paddingHorizontal: spacing.md,
              }}>
              <Text style={{ color: t.colors.textMuted, fontSize: fontSize.xs, fontWeight: '600' }}>
                {m.symbole} {m.titre.replace('Étude de ', '').replace('Étude ', '').replace('Le survol des ', 'Survol des ')}
              </Text>
            </View>
          ))}
        </View>
      </Carte>

      <View
        style={{
          flexDirection: 'row',
          flexWrap: 'wrap',
          gap: spacing.sm,
          marginTop: spacing.xl,
        }}>
        <Puce
          texte={`Mes études (${etat.etudes.length})`}
          actif={onglet === 'etudes'}
          onPress={() => setOnglet('etudes')}
        />
        <Puce texte="Plans d’étude" actif={onglet === 'plans'} onPress={() => setOnglet('plans')} />
        <Puce
          texte={`Plans de lecture (${plansLecture.length})`}
          actif={onglet === 'lecture'}
          onPress={() => setOnglet('lecture')}
        />
      </View>

      {onglet === 'etudes' ? (
        <>
          {etat.etudes.length === 0 ? (
            <Carte style={{ marginTop: spacing.lg }}>
              <Text style={{ color: t.colors.text, fontSize: fontSize.lg, lineHeight: 26 }}>
                Vous n’avez pas encore d’étude.
              </Text>
              <SousTitre style={{ marginTop: spacing.md }}>
                Commencez par la méditation du jour, qui tient en quelques minutes ; gardez
                l’étude complète pour un temps plus long, seul ou en groupe.
              </SousTitre>
            </Carte>
          ) : null}

          {enCours.length > 0 ? <Separateur label="En cours" /> : null}
          {enCours.map((e) => (
            <LigneEtude key={e.id} etude={e} onPress={() => router.push(`/oia/${e.id}`)} />
          ))}

          {etat.etudes.some((e) => e.terminee) ? <Separateur label="Terminées" /> : null}
          {etat.etudes
            .filter((e) => e.terminee)
            .map((e) => (
              <LigneEtude key={e.id} etude={e} onPress={() => router.push(`/oia/${e.id}`)} />
            ))}
        </>
      ) : null}

      {onglet === 'plans' ? (
        <>
          <SousTitre style={{ marginTop: spacing.lg }}>
            Dix journées sur dix textes, chacune avec son contexte, ses pistes d’observation
            et son interprétation. Ces plans apprennent la méthode.
          </SousTitre>
          {commences.length > 0 ? <Separateur label="Plans commencés" /> : null}
          {commences.map((p) => {
            const prog = etat.progressions[p.id];
            const termine = prog.joursTermines.length >= p.jours.length;
            const prochain =
              p.jours.find((j) => !prog.joursTermines.includes(j.jour)) ?? p.jours[0];
            return (
              <Carte
                key={p.id}
                style={{ marginBottom: spacing.md }}
                onPress={() => router.push(`/plan/${p.id}`)}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.md }}>
                  <Symbole symbole={p.symbole} />
                  <View style={{ flex: 1 }}>
                    <Text style={{ color: t.colors.text, fontSize: fontSize.lg, fontWeight: '700' }}>
                      {p.titre}
                    </Text>
                    <SousTitre style={{ marginTop: 2 }}>
                      {termine
                        ? 'Plan terminé — relisez-le quand vous voudrez'
                        : `Prochain : jour ${prochain.jour} · ${prochain.titre}`}
                    </SousTitre>
                  </View>
                </View>
                <BarreProgression valeur={prog.joursTermines.length / p.jours.length} />
                <Text
                  style={{ color: t.colors.textFaint, fontSize: fontSize.xs, marginTop: spacing.sm }}>
                  {prog.joursTermines.length} / {p.jours.length} jours
                </Text>
              </Carte>
            );
          })}

          <Separateur label={commences.length > 0 ? 'Autres plans' : 'Tous les plans'} />

          {nouveaux.map((p) => (
            <Carte
              key={p.id}
              style={{ marginBottom: spacing.md }}
              onPress={() => router.push(`/plan/${p.id}`)}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.md }}>
                <Symbole symbole={p.symbole} />
                <View style={{ flex: 1 }}>
                  <Text style={{ color: t.colors.text, fontSize: fontSize.lg, fontWeight: '700' }}>
                    {p.titre}
                  </Text>
                  <SousTitre style={{ marginTop: 2 }}>{p.sousTitre}</SousTitre>
                </View>
              </View>
              <Text
                style={{
                  color: t.colors.textMuted,
                  fontSize: fontSize.md,
                  lineHeight: 23,
                  marginTop: spacing.md,
                }}>
                {p.description}
              </Text>
              <View style={{ flexDirection: 'row', gap: spacing.sm, marginTop: spacing.md }}>
                <Badge texte={p.niveau} />
                <Badge texte={`${p.jours.length} jours`} />
              </View>
            </Carte>
          ))}
        </>
      ) : null}

      {onglet === 'lecture' ? (
        <>
          <SousTitre style={{ marginTop: spacing.lg }}>
            Une portion par jour, pour traverser un livre, un testament ou la Bible entière.
            Chaque journée se lit dans l’application, puis se médite avec l’OIA simplifiée.
          </SousTitre>

          {lecturesCommencees.length > 0 ? <Separateur label="Lectures commencées" /> : null}
          {lecturesCommencees.map((p) => {
            const prog = etat.progressions[p.id];
            const fini = prog.joursTermines.length >= p.jours.length;
            const prochain =
              p.jours.find((j) => !prog.joursTermines.includes(j.jour)) ?? p.jours[0];
            return (
              <Carte
                key={p.id}
                style={{ marginBottom: spacing.md }}
                onPress={() => router.push(`/lecture/${p.id}`)}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.md }}>
                  <Symbole symbole={p.symbole} />
                  <View style={{ flex: 1 }}>
                    <Text style={{ color: t.colors.text, fontSize: fontSize.lg, fontWeight: '700' }}>
                      {p.titre}
                    </Text>
                    <SousTitre style={{ marginTop: 2 }}>
                      {fini
                        ? 'Plan terminé — relisez-le quand vous voudrez'
                        : `Prochain : jour ${prochain.jour} · ${prochain.titre ?? formaterPortions(prochain.portions)}`}
                    </SousTitre>
                  </View>
                </View>
                <BarreProgression valeur={prog.joursTermines.length / p.jours.length} />
                <Text
                  style={{ color: t.colors.textFaint, fontSize: fontSize.xs, marginTop: spacing.sm }}>
                  {prog.joursTermines.length} / {p.jours.length} jours
                </Text>
              </Carte>
            );
          })}

          <Separateur
            label={lecturesCommencees.length > 0 ? 'Autres lectures' : 'Tous les plans de lecture'}
          />

          {lecturesNouvelles.map((p) => (
            <Carte
              key={p.id}
              style={{ marginBottom: spacing.md }}
              onPress={() => router.push(`/lecture/${p.id}`)}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.md }}>
                <Symbole symbole={p.symbole} />
                <View style={{ flex: 1 }}>
                  <Text style={{ color: t.colors.text, fontSize: fontSize.lg, fontWeight: '700' }}>
                    {p.titre}
                  </Text>
                  <SousTitre style={{ marginTop: 2 }}>{p.parcours}</SousTitre>
                </View>
              </View>
              <Text
                style={{
                  color: t.colors.textMuted,
                  fontSize: fontSize.md,
                  lineHeight: 23,
                  marginTop: spacing.md,
                }}>
                {p.description}
              </Text>
              <View style={{ flexDirection: 'row', gap: spacing.sm, marginTop: spacing.md }}>
                <Badge texte={p.sousTitre} />
                <Badge
                  texte={`≈ ${Math.max(1, Math.round(p.jours.reduce((n, j) => n + chapitresDuJour(j.portions), 0) / p.jours.length))} chapitre(s) / jour`}
                />
              </View>
            </Carte>
          ))}
        </>
      ) : null}
    </ScrollView>
  );
}

function LigneEtude({ etude, onPress }: { etude: EtudeOIA; onPress: () => void }) {
  const { theme: t } = useApp();
  const simplifiee = etude.methode === 'simplifiee';
  // Les deux méthodes n'ont pas les mêmes étapes : la barre suit celle employée.
  const parts: [string, number][] = simplifiee
    ? [
        ['A', progressionSimplifiee(etude.questionsA, 'questionsA')],
        ['B', progressionSimplifiee(etude.questionsB, 'questionsB')],
      ]
    : [
        ['O', progressionTemps(etude.observation, 'observation')],
        ['I', progressionTemps(etude.interpretation, 'interpretation')],
        ['A', progressionTemps(etude.application, 'application')],
      ];
  return (
    <Carte style={{ marginBottom: spacing.sm }} onPress={onPress}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.md }}>
        <View style={{ flex: 1 }}>
          <Text style={{ color: t.colors.text, fontSize: fontSize.lg, fontWeight: '700' }}>
            {etude.reference}
          </Text>
          <Text style={{ color: t.colors.textFaint, fontSize: fontSize.xs, marginTop: 2 }}>
            {etude.planId
              ? 'Plan guidé'
              : simplifiee
                ? 'Méditation quotidienne'
                : 'Étude biblique'}{' '}
            · {dateCourte(etude.modifie.slice(0, 10))}
          </Text>
        </View>
        {etude.terminee ? (
          <View
            style={{
              width: 26,
              height: 26,
              borderRadius: 13,
              backgroundColor: t.colors.success,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <IconeCoche couleur={t.colors.surface} taille={16} />
          </View>
        ) : null}
      </View>
      <View style={{ flexDirection: 'row', gap: spacing.sm, marginTop: spacing.md }}>
        {parts.map(([lettre, valeur]) => (
          <View key={lettre} style={{ flex: 1 }}>
            <Text
              style={{
                color: valeur > 0 ? t.colors.primary : t.colors.textFaint,
                fontSize: fontSize.xs,
                fontWeight: '800',
                marginBottom: 4,
              }}>
              {lettre}
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
                  width: `${Math.round(valeur * 100)}%`,
                  height: '100%',
                  backgroundColor: t.colors.accent,
                }}
              />
            </View>
          </View>
        ))}
      </View>
    </Carte>
  );
}

function Symbole({ symbole }: { symbole: string }) {
  const { theme: t } = useApp();
  return (
    <View
      style={{
        width: 46,
        height: 46,
        borderRadius: radius.md,
        backgroundColor: t.colors.primarySoft,
        alignItems: 'center',
        justifyContent: 'center',
      }}>
      <Text style={{ color: t.colors.primary, fontSize: 20 }}>{symbole}</Text>
    </View>
  );
}

function Badge({ texte }: { texte: string }) {
  const { theme: t } = useApp();
  return (
    <View
      style={{
        backgroundColor: t.colors.surfaceAlt,
        borderRadius: radius.pill,
        paddingVertical: 4,
        paddingHorizontal: spacing.md,
      }}>
      <Text style={{ color: t.colors.textMuted, fontSize: fontSize.xs, fontWeight: '600' }}>
        {texte}
      </Text>
    </View>
  );
}
