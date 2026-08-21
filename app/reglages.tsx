import React, { useState } from 'react';
import { Alert, Platform, ScrollView, Switch, Text, TextInput, View } from 'react-native';

import { Carte, Etiquette, Puce, Separateur, SousTitre, Statistique } from '../src/components/ui';
import { BIBLE_VERSION, passages } from '../src/data/passages';
import { plans, totalJoursDisponibles } from '../src/data/plans';
import { versets } from '../src/data/versets';
import { useApp } from '../src/store/AppContext';
import { fontSize, radius, spacing } from '../src/theme/theme';
import { annulerRappel, programmerRappel } from '../src/utils/notifications';

const HEURES = ['06:00', '06:30', '07:00', '07:30', '08:00', '12:30', '20:00', '21:30'];
const TAILLES: { label: string; valeur: number }[] = [
  { label: 'Petit', valeur: 0.9 },
  { label: 'Normal', valeur: 1 },
  { label: 'Grand', valeur: 1.15 },
  { label: 'Très grand', valeur: 1.3 },
];

export default function Reglages() {
  const { theme: t, etat, majReglages, serie } = useApp();
  const [prenom, setPrenom] = useState(etat.reglages.prenom);

  const basculerRappel = async (actif: boolean) => {
    if (!actif) {
      await annulerRappel();
      majReglages({ rappelActif: false });
      return;
    }
    const ok = await programmerRappel(etat.reglages.rappelHeure);
    if (!ok) {
      Alert.alert(
        'Notifications non autorisées',
        'Autorisez les notifications dans les réglages de votre appareil pour recevoir le rappel quotidien.',
      );
      majReglages({ rappelActif: false });
      return;
    }
    majReglages({ rappelActif: true });
  };

  const choisirHeure = async (heure: string) => {
    majReglages({ rappelHeure: heure });
    if (etat.reglages.rappelActif) await programmerRappel(heure);
  };

  const versetsMemorises = etat.versetsMemorises.length;
  const plansTermines = plans.filter(
    (p) => (etat.progressions[p.id]?.joursTermines.length ?? 0) >= p.jours.length,
  ).length;

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: t.colors.background }}
      contentContainerStyle={{ padding: spacing.lg, paddingBottom: spacing.xxxl * 2 }}
      keyboardShouldPersistTaps="handled">
      <Etiquette>Votre parcours</Etiquette>
      <View
        style={{
          flexDirection: 'row',
          backgroundColor: t.colors.surface,
          borderRadius: radius.lg,
          paddingVertical: spacing.lg,
          marginTop: spacing.md,
          borderWidth: 1,
          borderColor: t.colors.border,
        }}>
        <Statistique valeur={serie} label="jours de suite" />
        <Statistique valeur={etat.joursTermines.length} label="jours vécus" />
        <Statistique valeur={etat.minutesMeditation} label="min. de silence" />
      </View>
      <View
        style={{
          flexDirection: 'row',
          backgroundColor: t.colors.surface,
          borderRadius: radius.lg,
          paddingVertical: spacing.lg,
          marginTop: spacing.sm,
          borderWidth: 1,
          borderColor: t.colors.border,
        }}>
        <Statistique valeur={plansTermines} label="plans terminés" />
        <Statistique valeur={versetsMemorises} label="versets mémorisés" />
        <Statistique valeur={etat.journal.length} label="pages de journal" />
      </View>

      <Separateur label="Vous" />

      <SousTitre>Votre prénom, pour l’accueil du matin.</SousTitre>
      <TextInput
        value={prenom}
        onChangeText={setPrenom}
        onBlur={() => majReglages({ prenom: prenom.trim() })}
        placeholder="Prénom"
        placeholderTextColor={t.colors.textFaint}
        style={{
          backgroundColor: t.colors.surface,
          borderRadius: radius.md,
          borderWidth: 1,
          borderColor: t.colors.border,
          paddingHorizontal: spacing.lg,
          paddingVertical: spacing.md,
          marginTop: spacing.md,
          color: t.colors.text,
          fontSize: fontSize.md,
        }}
      />

      <Separateur label="Rappel quotidien" />

      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        <View style={{ flex: 1, paddingRight: spacing.lg }}>
          <Text style={{ color: t.colors.text, fontSize: fontSize.md, fontWeight: '600' }}>
            Me rappeler mon temps avec Dieu
          </Text>
          <SousTitre style={{ marginTop: 2 }}>
            Une notification quotidienne avec le verset du jour.
          </SousTitre>
        </View>
        <Switch
          value={etat.reglages.rappelActif}
          onValueChange={basculerRappel}
          trackColor={{ true: t.colors.primary, false: t.colors.border }}
          thumbColor={Platform.OS === 'android' ? t.colors.surface : undefined}
        />
      </View>

      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm, marginTop: spacing.lg }}>
        {HEURES.map((h) => (
          <Puce
            key={h}
            texte={h}
            actif={etat.reglages.rappelHeure === h}
            onPress={() => choisirHeure(h)}
          />
        ))}
      </View>

      <Separateur label="Lecture" />

      <SousTitre>Taille du texte biblique</SousTitre>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm, marginTop: spacing.md }}>
        {TAILLES.map((x) => (
          <Puce
            key={x.label}
            texte={x.label}
            actif={etat.reglages.tailleTexte === x.valeur}
            onPress={() => majReglages({ tailleTexte: x.valeur })}
          />
        ))}
      </View>

      <SousTitre style={{ marginTop: spacing.xl }}>Ambiance</SousTitre>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm, marginTop: spacing.md }}>
        <Puce
          texte="Système"
          actif={etat.reglages.theme === 'systeme'}
          onPress={() => majReglages({ theme: 'systeme' })}
        />
        <Puce
          texte="Aube (clair)"
          actif={etat.reglages.theme === 'aube'}
          onPress={() => majReglages({ theme: 'aube' })}
        />
        <Puce
          texte="Veillée (sombre)"
          actif={etat.reglages.theme === 'veillee'}
          onPress={() => majReglages({ theme: 'veillee' })}
        />
      </View>

      <Separateur label="À propos" />

      <Carte accent>
        <Text style={{ color: t.colors.text, fontSize: fontSize.lg, fontWeight: '700' }}>
          Lumière
        </Text>
        <Text
          style={{
            color: t.colors.textMuted,
            fontSize: fontSize.md,
            lineHeight: 24,
            marginTop: spacing.sm,
          }}>
          Une application de méditation et d’étude biblique quotidienne, ancrée dans la foi
          chrétienne. Tout le contenu fonctionne hors connexion et reste sur votre
          appareil : rien n’est envoyé sur un serveur.
        </Text>
        <Text
          style={{
            color: t.colors.textFaint,
            fontSize: fontSize.sm,
            lineHeight: 21,
            marginTop: spacing.lg,
          }}>
          {passages.length} passages · {versets.length} versets du jour · {plans.length} plans
          d’étude ({totalJoursDisponibles} jours){'\n'}
          Texte biblique : {BIBLE_VERSION}
        </Text>
      </Carte>

      <Text
        style={{
          color: t.colors.textFaint,
          fontSize: fontSize.sm,
          textAlign: 'center',
          marginTop: spacing.xl,
          fontStyle: 'italic',
          lineHeight: 21,
        }}>
        « Ta parole est une lampe à mes pieds, et une lumière sur mon sentier. »{'\n'}
        Psaume 119:105
      </Text>
    </ScrollView>
  );
}
