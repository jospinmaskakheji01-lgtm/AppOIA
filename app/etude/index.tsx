import { useRouter } from 'expo-router';
import React from 'react';
import { ScrollView, Text, View } from 'react-native';

import { Carte, Etiquette, Separateur, SousTitre, Titre } from '../../src/components/ui';
import { getMethodeEtude, methodesEtude, progressionTravail } from '../../src/data/methodes-etude';
import { useApp } from '../../src/store/AppContext';
import { fontSize, radius, spacing } from '../../src/theme/theme';
import { dateCourte } from '../../src/utils/dates';

/**
 * Les six méthodes d'étude biblique.
 *
 * L'écran répond à une question précise : « je veux faire une étude biblique et
 * je ne sais pas comment m'y prendre ». Chaque carte dit donc d'abord quand
 * choisir cette méthode-là, avant de dire ce qu'elle est.
 */
export default function MethodesEtude() {
  const { theme: t, etat } = useApp();
  const router = useRouter();

  const enCours = etat.travaux.filter((x) => !x.terminee);
  const terminees = etat.travaux.filter((x) => x.terminee);

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: t.colors.background }}
      contentContainerStyle={{ padding: spacing.lg, paddingBottom: spacing.xxxl * 2 }}
      showsVerticalScrollIndicator={false}>
      <Etiquette>Six manières d’étudier</Etiquette>
      <Titre style={{ marginTop: spacing.sm }}>Méthodes d’étude biblique</Titre>
      <SousTitre style={{ marginTop: spacing.sm }}>
        La méthode OIA étudie un passage. Ces six-là étudient autre chose : une personne,
        un thème, un mot, un livre entier, ou le contexte d’un texte. Chacune donne sa
        marche à suivre, étape par étape.
      </SousTitre>

      {enCours.length > 0 ? (
        <>
          <Separateur label="En cours" />
          {enCours.map((x) => (
            <LigneTravail key={x.id} travailId={x.id} />
          ))}
        </>
      ) : null}

      <Separateur label="Choisir une méthode" />

      {methodesEtude.map((m) => (
        <Carte
          key={m.id}
          style={{ marginBottom: spacing.md }}
          onPress={() => router.push(`/etude/${m.id}`)}>
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
              <Text style={{ color: t.colors.primary, fontSize: 20 }}>{m.symbole}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ color: t.colors.text, fontSize: fontSize.lg, fontWeight: '700' }}>
                {m.titre}
              </Text>
              <SousTitre style={{ marginTop: 2 }}>{m.sousTitre}</SousTitre>
            </View>
          </View>

          <Text
            style={{
              color: t.colors.textMuted,
              fontSize: fontSize.md,
              lineHeight: 23,
              marginTop: spacing.md,
            }}>
            <Text style={{ color: t.colors.text, fontWeight: '700' }}>Quand l’utiliser — </Text>
            {m.quand}
          </Text>

          <View style={{ flexDirection: 'row', gap: spacing.sm, marginTop: spacing.md }}>
            <Badge texte={`${m.etapes.length} étapes`} />
            <Badge texte={m.duree} />
          </View>
        </Carte>
      ))}

      {terminees.length > 0 ? (
        <>
          <Separateur label="Études terminées" />
          {terminees.map((x) => (
            <LigneTravail key={x.id} travailId={x.id} />
          ))}
        </>
      ) : null}
    </ScrollView>
  );
}

function LigneTravail({ travailId }: { travailId: string }) {
  const { theme: t, etat } = useApp();
  const router = useRouter();
  const travail = etat.travaux.find((x) => x.id === travailId);
  const methode = travail ? getMethodeEtude(travail.methodeId) : undefined;
  if (!travail || !methode) return null;

  const valeur = progressionTravail(travail.methodeId, travail.reponses);
  const faites = methode.etapes.filter((e) => (travail.reponses[e.cle] ?? '').trim()).length;

  return (
    <Carte style={{ marginBottom: spacing.sm }} onPress={() => router.push(`/travail/${travail.id}`)}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.md }}>
        <Text style={{ color: t.colors.primary, fontSize: 18 }}>{methode.symbole}</Text>
        <View style={{ flex: 1 }}>
          <Text style={{ color: t.colors.text, fontSize: fontSize.lg, fontWeight: '700' }}>
            {travail.sujet}
          </Text>
          <Text style={{ color: t.colors.textFaint, fontSize: fontSize.xs, marginTop: 2 }}>
            {methode.titre} · {dateCourte(travail.modifie.slice(0, 10))}
          </Text>
        </View>
        <Text style={{ color: t.colors.textFaint, fontSize: fontSize.xs, fontWeight: '700' }}>
          {faites} / {methode.etapes.length}
        </Text>
      </View>
      <View
        style={{
          height: 4,
          borderRadius: 2,
          backgroundColor: t.colors.surfaceAlt,
          overflow: 'hidden',
          marginTop: spacing.md,
        }}>
        <View
          style={{
            width: `${Math.round(valeur * 100)}%`,
            height: '100%',
            backgroundColor: t.colors.accent,
          }}
        />
      </View>
    </Carte>
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
