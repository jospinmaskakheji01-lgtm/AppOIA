import { useRouter } from 'expo-router';
import React from 'react';
import { ScrollView, Text, View } from 'react-native';

import { Carte, Etiquette, Separateur, SousTitre, Titre } from '../../src/components/ui';
import {
  famillesEtude,
  getMethodeEtude,
  methodesDeLaFamille,
  methodesEtude,
  progressionTravail,
} from '../../src/data/methodes-etude';
import { useApp } from '../../src/store/AppContext';
import { fontSize, radius, spacing } from '../../src/theme/theme';
import { dateCourte } from '../../src/utils/dates';

/**
 * Les méthodes d'étude biblique, groupées en quatre familles.
 *
 * L'écran répond à une question précise : « je veux faire une étude biblique et
 * je ne sais pas comment m'y prendre ». On choisit donc d'abord l'objet — une
 * personne, un thème, un mot, un livre — puis la méthode ; et chaque carte dit
 * quand l'employer avant de dire ce qu'elle est.
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
      <Etiquette>Quatre familles · {methodesEtude.length} méthodes</Etiquette>
      <Titre style={{ marginTop: spacing.sm }}>Méthodes d’étude biblique</Titre>
      <SousTitre style={{ marginTop: spacing.sm }}>
        La méthode OIA étudie un passage. Celles-ci étudient autre chose : une personne, un
        thème, une qualité, un mot, un livre entier. Choisissez d’abord ce que vous voulez
        étudier, ensuite comment — chaque méthode donne sa marche à suivre, étape par étape.
      </SousTitre>

      {enCours.length > 0 ? (
        <>
          <Separateur label="En cours" />
          {enCours.map((x) => (
            <LigneTravail key={x.id} travailId={x.id} />
          ))}
        </>
      ) : null}

      {famillesEtude.map((famille) => {
        const methodes = methodesDeLaFamille(famille.cle);
        return (
          <View key={famille.cle} style={{ marginTop: spacing.xxl }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.md }}>
              <View
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: radius.sm,
                  backgroundColor: t.colors.primary,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <Text
                  style={{ color: t.colors.onPrimary, fontWeight: '800', fontSize: fontSize.md }}>
                  {famille.lettre}
                </Text>
              </View>
              <Text
                style={{
                  color: t.colors.text,
                  fontSize: fontSize.xl,
                  fontWeight: '700',
                  flex: 1,
                }}>
                {famille.titre}
              </Text>
            </View>
            <Text
              style={{
                color: t.colors.textMuted,
                fontSize: fontSize.md,
                lineHeight: 23,
                marginTop: spacing.sm,
                marginBottom: spacing.lg,
              }}>
              {famille.description}
            </Text>

            {methodes.map((m) => (
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
                  <Text style={{ color: t.colors.text, fontWeight: '700' }}>
                    Quand l’utiliser —{' '}
                  </Text>
                  {m.quand}
                </Text>

                <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm, marginTop: spacing.md }}>
                  <Badge texte={`${m.etapes.length} étapes`} />
                  <Badge texte={m.duree} />
                </View>
              </Carte>
            ))}
          </View>
        );
      })}

      <Separateur label="D’où viennent ces méthodes" />
      <Carte>
        <Text style={{ color: t.colors.textMuted, fontSize: fontSize.md, lineHeight: 23 }}>
          La suite des étapes de chaque méthode est celle de Rick Warren,{' '}
          <Text style={{ fontStyle: 'italic' }}>Méthodes d’étude de la Bible</Text> (La Maison
          de la Bible, 2010), qui en expose douze ; huit sont reprises ici. C’est le même
          auteur dont le document O.I.A de l’École d’Apollos retient les quatre
          caractéristiques de l’application — personnelle, pratique, réalisable et mesurable.
        </Text>
      </Carte>

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
