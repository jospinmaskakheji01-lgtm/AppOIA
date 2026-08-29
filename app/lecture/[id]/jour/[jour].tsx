import { useLocalSearchParams, useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import React, { useMemo } from 'react';
import { Pressable, ScrollView, Share, Text, View } from 'react-native';

import { Bouton, Carte, Etiquette, Puce, Separateur, SousTitre } from '../../../../src/components/ui';
import {
  PortionLecture,
  formaterPortion,
  formaterPortions,
  getJourLecture,
  getPlanLecture,
} from '../../../../src/data/plans-lecture';
import { getPassage, versionsDisponibles } from '../../../../src/knowledge';
import { VersetTexte } from '../../../../src/knowledge/bible';
import { useApp } from '../../../../src/store/AppContext';
import { fontSize, radius, spacing } from '../../../../src/theme/theme';

/** « 14-15 » quand la version rend plusieurs versets d'un seul tenant. */
function numerote(v: VersetTexte): string {
  return v.versetFin && v.versetFin > v.verset ? `${v.verset}-${v.versetFin}` : String(v.verset);
}

/**
 * Les versets d'une portion, dans une version donnée.
 *
 * Une portion est soit un fragment d'un seul chapitre, soit une suite de
 * chapitres entiers — jamais les deux à la fois. Le premier cas se sert d'une
 * seule requête ; le second enchaîne les chapitres, `getPassage` n'en rendant
 * qu'un à la fois.
 */
function versetsDeLaPortion(versionId: string, p: PortionLecture): VersetTexte[] {
  if (p.verset !== undefined) {
    return getPassage(versionId, {
      livre: p.livre,
      chapitre: p.chapitre,
      verset: p.verset,
      versetFin: p.versetFin,
    });
  }
  const sortie: VersetTexte[] = [];
  for (let chapitre = p.chapitre; chapitre <= (p.chapitreFin ?? p.chapitre); chapitre++) {
    sortie.push(...getPassage(versionId, { livre: p.livre, chapitre }));
  }
  return sortie;
}

export default function JourDeLecture() {
  const { id, jour: jourBrut } = useLocalSearchParams<{ id: string; jour: string }>();
  const { theme: t, etat, creerEtude, etudeDuPlan, terminerJourPlan, majReglages } = useApp();
  const router = useRouter();

  const plan = getPlanLecture(String(id));
  const numero = Number(jourBrut) || 1;
  const jour = plan ? getJourLecture(plan.id, numero) : undefined;

  const versions = useMemo(() => versionsDisponibles(), []);
  const versionActive =
    versions.find((v) => v.id === etat.reglages.versionPreferee) ?? versions[0];

  /** Chaque portion avec son texte, dans l'ordre où le plan la donne. */
  const lecture = useMemo(() => {
    if (!jour || !versionActive) return [];
    return jour.portions.map((p) => ({
      portion: p,
      reference: formaterPortion(p),
      versets: versetsDeLaPortion(versionActive.id, p),
    }));
  }, [jour, versionActive?.id]);

  if (!plan || !jour) {
    return (
      <View style={{ flex: 1, backgroundColor: t.colors.background, padding: spacing.xl }}>
        <SousTitre>Cette journée de lecture est introuvable.</SousTitre>
      </View>
    );
  }

  const libelle = formaterPortions(jour.portions);
  const fait = etat.progressions[plan.id]?.joursTermines.includes(numero) ?? false;
  const meditation = etudeDuPlan(plan.id, numero);
  const suivant = plan.jours.find((j) => j.jour === numero + 1);
  const echelle = etat.reglages.tailleTexte;
  const premiere = jour.portions[0];

  const mediter = () => {
    if (meditation) {
      router.push(`/oia/${meditation.id}`);
      return;
    }
    const creee = creerEtude({
      reference: libelle,
      methode: 'simplifiee',
      planId: plan.id,
      jour: numero,
    });
    router.push(`/oia/${creee.id}`);
  };

  const marquerLu = () => {
    terminerJourPlan(plan.id, numero);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
    if (suivant) router.replace(`/lecture/${plan.id}/jour/${suivant.jour}`);
    else router.replace(`/lecture/${plan.id}`);
  };

  const partager = () => {
    const texte = lecture
      .map(
        (l) =>
          `${l.reference}\n\n${l.versets.map((v) => `${numerote(v)} ${v.texte}`).join(' ')}`,
      )
      .join('\n\n');
    Share.share({
      message: `${plan.titre} · jour ${numero}\n\n${texte}\n\n${versionActive?.nom ?? ''}`,
    }).catch(() => {});
  };

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: t.colors.background }}
      contentContainerStyle={{ padding: spacing.lg, paddingBottom: spacing.xxxl * 2 }}
      showsVerticalScrollIndicator={false}>
      <Pressable onPress={() => router.push(`/lecture/${plan.id}`)}>
        <Etiquette>
          {plan.titre} · jour {numero} sur {plan.jours.length}
        </Etiquette>
      </Pressable>
      <Text
        style={{
          color: t.colors.text,
          fontSize: fontSize.title,
          fontWeight: '700',
          marginTop: spacing.sm,
          lineHeight: 38,
        }}>
        {jour.titre ?? libelle}
      </Text>
      {jour.titre ? <SousTitre style={{ marginTop: spacing.xs }}>{libelle}</SousTitre> : null}

      {versions.length > 1 ? (
        <View
          style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm, marginTop: spacing.lg }}>
          {versions.map((v) => (
            <Puce
              key={v.id}
              texte={v.abreviation}
              actif={v.id === versionActive?.id}
              onPress={() => majReglages({ versionPreferee: v.id })}
            />
          ))}
        </View>
      ) : null}

      {lecture.map((l) => (
        <View key={l.reference} style={{ marginTop: spacing.xl }}>
          {lecture.length > 1 ? <Separateur label={l.reference} /> : null}
          {l.versets.length === 0 ? (
            <SousTitre>
              {versionActive?.nom ?? 'Cette version'} ne contient pas {l.reference}.
            </SousTitre>
          ) : (
            l.versets.map((v) => (
              <View
                key={`${v.chapitre}-${v.verset}`}
                style={{ flexDirection: 'row', marginBottom: spacing.md }}>
                <Text
                  style={{
                    color: t.colors.textFaint,
                    fontSize: fontSize.xs * echelle,
                    fontWeight: '700',
                    width: 34,
                    paddingTop: 4,
                  }}>
                  {l.versets[0] !== v && v.verset === 1 ? `${v.chapitre}:1` : numerote(v)}
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
              </View>
            ))
          )}
        </View>
      ))}

      <Pressable
        onPress={() =>
          router.push(`/lire/${encodeURIComponent(premiere.livre)}/${premiere.chapitre}`)
        }
        style={{ marginTop: spacing.lg }}>
        <Text style={{ color: t.colors.accent, fontSize: fontSize.sm, fontWeight: '700' }}>
          Ouvrir dans le lecteur, pour lire au-delà →
        </Text>
      </Pressable>

      <Separateur label="Méditer ce que vous venez de lire" />
      <Carte>
        <Text style={{ color: t.colors.textMuted, fontSize: fontSize.md, lineHeight: 24 }}>
          La lecture n’est que la moitié du chemin. Reprenez ce texte avec la méthode OIA
          simplifiée : deux séries de questions, la prière, puis l’obéissance.
        </Text>
      </Carte>

      <Bouton
        titre={meditation ? 'Reprendre ma méditation' : 'Méditer avec l’OIA simplifiée'}
        onPress={mediter}
        style={{ marginTop: spacing.lg }}
      />
      <Bouton
        titre={fait ? 'Journée déjà lue' : 'J’ai lu cette journée'}
        variante="secondaire"
        onPress={marquerLu}
        desactive={fait}
        style={{ marginTop: spacing.sm }}
      />
      <Bouton
        titre="Partager cette lecture"
        variante="discret"
        onPress={partager}
        style={{ marginTop: spacing.sm }}
      />

      {suivant ? (
        <Pressable
          onPress={() => router.replace(`/lecture/${plan.id}/jour/${suivant.jour}`)}
          style={{
            marginTop: spacing.xl,
            padding: spacing.lg,
            borderRadius: radius.lg,
            backgroundColor: t.colors.surfaceAlt,
          }}>
          <Text style={{ color: t.colors.textFaint, fontSize: fontSize.xs, fontWeight: '700' }}>
            DEMAIN · JOUR {suivant.jour}
          </Text>
          <Text
            style={{
              color: t.colors.text,
              fontSize: fontSize.md,
              fontWeight: '600',
              marginTop: 2,
            }}>
            {suivant.titre ?? formaterPortions(suivant.portions)}
          </Text>
        </Pressable>
      ) : (
        <Carte accent style={{ marginTop: spacing.xl }}>
          <Text style={{ color: t.colors.text, fontSize: fontSize.md, lineHeight: 24 }}>
            C’est la dernière journée de ce plan. Vous avez traversé {plan.parcours}.
          </Text>
        </Carte>
      )}
    </ScrollView>
  );
}
