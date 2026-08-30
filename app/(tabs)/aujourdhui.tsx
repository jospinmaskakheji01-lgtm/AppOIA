import { useRouter } from 'expo-router';
import React, { useMemo } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { IconeFlamme, IconePersonne } from '../../src/components/icons';
import {
  Carte,
  CarteVerset,
  Etiquette,
  Separateur,
  SousTitre,
  Statistique,
  Titre,
  BarreProgression,
} from '../../src/components/ui';
import { seances } from '../../src/data/meditations';
import { plans } from '../../src/data/plans';
import { progressionTemps } from '../../src/data/oia';
import { versetDuJour } from '../../src/data/versets';
import { EtudeOIA, useApp } from '../../src/store/AppContext';
import { fontSize, radius, spacing } from '../../src/theme/theme';
import { cleJour, dateLongue, salutation } from '../../src/utils/dates';

export default function Aujourdhui() {
  const { etat, theme: t, serie } = useApp();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const verset = useMemo(() => versetDuJour(), []);
  const jourFait = etat.joursTermines.includes(cleJour());

  /** Reprend le plan commencé le plus récemment, sinon propose le plan d'entrée. */
  const enCours = useMemo(() => {
    const progressions = Object.values(etat.progressions);
    if (progressions.length === 0) return null;
    const derniere = progressions.sort((a, b) =>
      (b.dernierJour ?? b.commence).localeCompare(a.dernierJour ?? a.commence),
    )[0];
    const plan = plans.find((p) => p.id === derniere.planId);
    if (!plan) return null;
    const prochain =
      plan.jours.find((j) => !derniere.joursTermines.includes(j.jour)) ?? null;
    return { plan, progression: derniere, prochain };
  }, [etat.progressions]);

  const etudeOuverte = useMemo(
    () =>
      etat.etudes
        .filter((e) => !e.terminee)
        .sort((a, b) => b.modifie.localeCompare(a.modifie))[0],
    [etat.etudes],
  );

  const seanceSuggeree = useMemo(() => {
    const h = new Date().getHours();
    if (h >= 20 || h < 5) return seances.find((s) => s.ambiance === 'soir')!;
    if (h < 11) return seances.find((s) => s.ambiance === 'matin')!;
    return seances.find((s) => s.ambiance === 'gratitude')!;
  }, []);

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: t.colors.background }}
      contentContainerStyle={{
        padding: spacing.lg,
        paddingTop: insets.top + spacing.md,
        paddingBottom: spacing.xxxl * 2,
      }}
      showsVerticalScrollIndicator={false}>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          marginBottom: spacing.xl,
        }}>
        <View style={{ flex: 1 }}>
          <Etiquette>{dateLongue()}</Etiquette>
          <Titre style={{ marginTop: spacing.sm }}>
            {salutation()}
            {etat.reglages.prenom ? `, ${etat.reglages.prenom}` : ''}
          </Titre>
        </View>
        <Pressable
          onPress={() => router.push('/reglages')}
          style={({ pressed }) => ({
            padding: spacing.sm,
            opacity: pressed ? 0.6 : 1,
          })}>
          <IconePersonne couleur={t.colors.textMuted} taille={26} />
        </Pressable>
      </View>

      <CarteVerset
        etiquette={`Verset du jour · ${verset.theme}`}
        reference={verset.ref}
        texte={verset.texte}
        onPress={verset.passageId ? () => router.push(`/passage/${verset.passageId}`) : undefined}
      />

      <Carte style={{ marginTop: spacing.md }} accent>
        <Etiquette>Pour méditer</Etiquette>
        <Text
          style={{
            color: t.colors.text,
            fontSize: fontSize.lg,
            lineHeight: 26,
            marginTop: spacing.sm,
          }}>
          {verset.meditation}
        </Text>
      </Carte>

      <View
        style={{
          flexDirection: 'row',
          backgroundColor: t.colors.surface,
          borderRadius: radius.lg,
          paddingVertical: spacing.lg,
          marginTop: spacing.lg,
          borderWidth: 1,
          borderColor: t.colors.border,
        }}>
        <Statistique valeur={serie} label={serie > 1 ? 'jours de suite' : 'jour de suite'} />
        <Statistique valeur={etat.joursTermines.length} label="jours vécus" />
        <Statistique valeur={etat.minutesMeditation} label="minutes de silence" />
      </View>

      {serie >= 3 ? (
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginTop: spacing.md,
            gap: spacing.sm,
          }}>
          <IconeFlamme couleur={t.colors.accent} taille={18} />
          <Text style={{ color: t.colors.accent, fontSize: fontSize.sm, fontWeight: '600' }}>
            {serie} jours consécutifs — la fidélité se construit un jour à la fois.
          </Text>
        </View>
      ) : null}

      <Separateur label="Votre temps aujourd’hui" />

      {etudeOuverte ? (
        <Carte onPress={() => router.push(`/oia/${etudeOuverte.id}`)}>
          <Etiquette>Reprendre mon étude OIA</Etiquette>
          <Text
            style={{
              color: t.colors.text,
              fontSize: fontSize.xl,
              fontWeight: '700',
              marginTop: spacing.sm,
            }}>
            {etudeOuverte.reference}
          </Text>
          <SousTitre style={{ marginTop: spacing.xs }}>
            {etapeEnCours(etudeOuverte)}
          </SousTitre>
        </Carte>
      ) : null}

      {enCours && enCours.prochain ? (
        <Carte
          onPress={() =>
            router.push(`/plan/${enCours.plan.id}/jour/${enCours.prochain!.jour}`)
          }>
          <Etiquette>Reprendre · {enCours.plan.titre}</Etiquette>
          <Text
            style={{
              color: t.colors.text,
              fontSize: fontSize.xl,
              fontWeight: '700',
              marginTop: spacing.sm,
            }}>
            Jour {enCours.prochain.jour} — {enCours.prochain.titre}
          </Text>
          <SousTitre style={{ marginTop: spacing.xs }}>
            {enCours.progression.joursTermines.length} / {enCours.plan.jours.length} jours
            terminés
          </SousTitre>
          <BarreProgression
            valeur={enCours.progression.joursTermines.length / enCours.plan.jours.length}
          />
        </Carte>
      ) : (
        <Carte
          style={{ marginTop: etudeOuverte ? spacing.md : 0 }}
          onPress={() => router.push('/(tabs)/etudier')}>
          <Etiquette>Commencer un plan guidé</Etiquette>
          <Text
            style={{
              color: t.colors.text,
              fontSize: fontSize.xl,
              fontWeight: '700',
              marginTop: spacing.sm,
            }}>
            {plans[0].titre}
          </Text>
          <SousTitre style={{ marginTop: spacing.xs }}>{plans[0].sousTitre}</SousTitre>
        </Carte>
      )}

      <Carte
        style={{ marginTop: spacing.md }}
        onPress={() => router.push('/oia/nouvelle?methode=simplifiee')}>
        <Etiquette>Méditation du jour</Etiquette>
        <Text
          style={{
            color: t.colors.text,
            fontSize: fontSize.xl,
            fontWeight: '700',
            marginTop: spacing.sm,
          }}>
          Méditer un passage avec l’OIA simplifiée
        </Text>
        <SousTitre style={{ marginTop: spacing.xs }}>
          Méditez, priez, obéissez — 5 à 15 minutes devant la Parole
        </SousTitre>
      </Carte>

      <Carte
        style={{ marginTop: spacing.md }}
        onPress={() => router.push('/oia/nouvelle?methode=generale')}>
        <Etiquette>Étude libre</Etiquette>
        <Text
          style={{
            color: t.colors.text,
            fontSize: fontSize.xl,
            fontWeight: '700',
            marginTop: spacing.sm,
          }}>
          Étudier un passage avec la méthode OIA
        </Text>
        <SousTitre style={{ marginTop: spacing.xs }}>
          Observer, interpréter, appliquer — sur le texte de votre choix
        </SousTitre>
      </Carte>

      <Carte
        style={{ marginTop: spacing.md }}
        onPress={() => router.push(`/meditation/${seanceSuggeree.id}`)}>
        <Etiquette>Méditation guidée</Etiquette>
        <Text
          style={{
            color: t.colors.text,
            fontSize: fontSize.xl,
            fontWeight: '700',
            marginTop: spacing.sm,
          }}>
          {seanceSuggeree.titre}
        </Text>
        <SousTitre style={{ marginTop: spacing.xs }}>
          {seanceSuggeree.sousTitre} · {Math.round(seanceSuggeree.duree / 60)} min
        </SousTitre>
      </Carte>

      <Carte style={{ marginTop: spacing.md }} onPress={() => router.push('/recherche')}>
        <Etiquette>Base de connaissances</Etiquette>
        <Text
          style={{
            color: t.colors.text,
            fontSize: fontSize.xl,
            fontWeight: '700',
            marginTop: spacing.sm,
          }}>
          Chercher un mot, un passage, une notion
        </Text>
        <SousTitre style={{ marginTop: spacing.xs }}>
          Texte biblique, dictionnaire, commentaires et références croisées
        </SousTitre>
      </Carte>

      <Carte
        style={{ marginTop: spacing.md }}
        onPress={() => router.push('/journal/nouvelle')}>
        <Etiquette>Journal spirituel</Etiquette>
        <Text
          style={{
            color: t.colors.text,
            fontSize: fontSize.xl,
            fontWeight: '700',
            marginTop: spacing.sm,
          }}>
          Écrire ce que Dieu vous dit
        </Text>
        <SousTitre style={{ marginTop: spacing.xs }}>
          {etat.journal.length > 0
            ? `${etat.journal.length} entrée${etat.journal.length > 1 ? 's' : ''} enregistrée${etat.journal.length > 1 ? 's' : ''}`
            : 'Votre première page vous attend'}
        </SousTitre>
      </Carte>

      {!jourFait ? (
        <Text
          style={{
            color: t.colors.textFaint,
            fontSize: fontSize.sm,
            textAlign: 'center',
            marginTop: spacing.xl,
            lineHeight: 20,
          }}>
          Une étude OIA achevée, une méditation ou une page de journal valide votre journée.
        </Text>
      ) : (
        <View
          style={{
            marginTop: spacing.xl,
            padding: spacing.lg,
            borderRadius: radius.lg,
            backgroundColor: t.colors.accentSoft,
          }}>
          <Text
            style={{
              color: t.colors.text,
              textAlign: 'center',
              fontSize: fontSize.md,
              lineHeight: 22,
            }}>
            Vous avez pris ce temps aujourd’hui. « Il est bon d’attendre en silence le
            secours de l’Éternel. »
          </Text>
        </View>
      )}
    </ScrollView>
  );
}

/** Le temps de la méthode où l'étude en est restée. */
function etapeEnCours(etude: EtudeOIA): string {
  if (progressionTemps(etude.observation, 'observation') < 1) return 'En cours — Observation';
  if (progressionTemps(etude.interpretation, 'interpretation') < 1)
    return 'En cours — Interprétation';
  return 'En cours — Application';
}
