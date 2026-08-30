import { useRouter } from 'expo-router';
import Constants from 'expo-constants';
import React, { useMemo, useState } from 'react';
import { Alert, ScrollView, Share, Text, TextInput, View } from 'react-native';

import {
  IconeAube,
  IconeBoussole,
  IconeCalendrier,
  IconeCloche,
  IconeCoffre,
  IconeCorbeille,
  IconeCroix,
  IconeInfo,
  IconeLivre,
  IconeLoupe,
  IconeNuage,
  IconePartage,
  IconePersonne,
  IconePlume,
  IconeRayonnage,
  IconeTexte,
} from '../src/components/icons';
import {
  ChoixTheme,
  GroupeReglages,
  LigneBascule,
  LigneReglage,
} from '../src/components/reglages';
import { Etiquette, Puce, SousTitre, Statistique, Titre } from '../src/components/ui';
import { fichesLivres } from '../src/data/livres';
import { methodesEtude } from '../src/data/methodes-etude';
import { statistiquesBase, versionsDisponibles } from '../src/knowledge';
import { passages } from '../src/data/passages';
import { plans } from '../src/data/plans';
import { plansLecture } from '../src/data/plans-lecture';
import { useApp } from '../src/store/AppContext';
import { fontSize, radius, spacing } from '../src/theme/theme';
import { nombre } from '../src/utils/nombres';
import { annulerRappel, programmerRappel } from '../src/utils/notifications';

const HEURES = ['06:00', '06:30', '07:00', '07:30', '08:00', '12:30', '20:00', '21:30'];
const TAILLES: { label: string; valeur: number }[] = [
  { label: 'Petit', valeur: 0.9 },
  { label: 'Normal', valeur: 1 },
  { label: 'Grand', valeur: 1.15 },
  { label: 'Très grand', valeur: 1.3 },
];
/** Le nom que porte chaque thème à l'écran : celui qu'on emploie pour en parler. */
const NOM_THEME: Record<'systeme' | 'aube' | 'veillee', string> = {
  systeme: 'Système',
  aube: 'Clair',
  veillee: 'Sombre',
};

/**
 * L'écran « Plus » : ce qui n'est pas la lecture du jour.
 *
 * Il est fait de rubriques plutôt que d'une longue page : les ressources qu'on
 * ouvre, les réglages qu'on change, les écrits qu'on exporte, et ce que
 * l'application dit d'elle-même. Les réglages courts se déplient sur place —
 * changer de thème ou de taille de texte se voit immédiatement, il serait
 * absurde de le faire dans un autre écran.
 */
export default function Reglages() {
  const { theme: t, etat, majReglages, serie, effacerMesDonnees } = useApp();
  const router = useRouter();
  const [prenom, setPrenom] = useState(etat.reglages.prenom);
  const [assistantUrl, setAssistantUrl] = useState(etat.reglages.assistantUrl);
  const [assistantJeton, setAssistantJeton] = useState(etat.reglages.assistantJeton);

  const versions = useMemo(() => versionsDisponibles(), []);
  const base = useMemo(() => statistiquesBase(), []);
  const versionActive = versions.find((v) => v.id === etat.reglages.versionPreferee);

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

  const etudesTerminees = etat.etudes.filter((e) => e.terminee).length;
  const plansTermines = [...plans, ...plansLecture].filter(
    (p) => (etat.progressions[p.id]?.joursTermines.length ?? 0) >= p.jours.length,
  ).length;
  const ecrits =
    etat.etudes.length + etat.travaux.length + etat.journal.length + etat.prieres.length;

  /**
   * Tout ce que l'utilisateur a écrit, en texte lisible. L'application ne
   * garde rien ailleurs que sur l'appareil : c'est la seule façon d'en sortir
   * une copie, et donc de ne pas tout perdre en changeant de téléphone.
   */
  const exporter = () => {
    const bloc = (titre: string, lignes: string[]) =>
      lignes.length === 0 ? '' : `\n\n═══ ${titre.toUpperCase()} ═══\n\n${lignes.join('\n\n')}`;
    const texte =
      `LUMIÈRE — mes écrits\nExporté le ${new Date().toLocaleDateString('fr-FR')}` +
      bloc(
        'Études et méditations',
        etat.etudes.map((e) => {
          const champs = { ...e.observation, ...e.interpretation, ...e.application, ...e.questionsA, ...e.questionsB };
          const corps = Object.entries(champs)
            .filter(([, v]) => (v ?? '').trim())
            .map(([k, v]) => `• ${k} : ${v!.trim()}`)
            .join('\n');
          return `— ${e.reference} (${e.methode === 'simplifiee' ? 'méditation' : 'étude'})\n${corps}${e.engagement.trim() ? `\n• engagement : ${e.engagement.trim()}` : ''}`;
        }),
      ) +
      bloc(
        'Études méthodiques',
        etat.travaux.map((x) => {
          const corps = Object.entries(x.reponses)
            .filter(([, v]) => (v ?? '').trim())
            .map(([k, v]) => `• ${k} : ${v.trim()}`)
            .join('\n');
          return `— ${x.sujet} (${x.methodeId})\n${corps}`;
        }),
      ) +
      bloc('Journal', etat.journal.map((j) => `— ${j.date.slice(0, 10)} · ${j.titre}\n${j.texte}`)) +
      bloc(
        'Prières',
        etat.prieres.map((p) => `— [${p.categorie}] ${p.texte}${p.exauce ? ` (exaucée : ${p.reponse ?? 'oui'})` : ''}`),
      );
    Share.share({ message: texte }).catch(() => {});
  };

  const effacer = () => {
    Alert.alert(
      'Effacer toutes mes données ?',
      `Vos ${nombre(ecrits)} écrits — études, méditations, journal, prières — seront définitivement perdus. Exportez-les d’abord si vous voulez les garder.`,
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Tout effacer',
          style: 'destructive',
          onPress: () =>
            Alert.alert('Confirmer', 'Cette action est irréversible. Effacer vraiment ?', [
              { text: 'Annuler', style: 'cancel' },
              {
                text: 'Effacer',
                style: 'destructive',
                onPress: () => {
                  effacerMesDonnees();
                  Alert.alert('Effacé', 'Vos écrits ont été supprimés. Vos réglages sont conservés.');
                },
              },
            ]),
        },
      ],
    );
  };

  const versionApp = Constants.expoConfig?.version ?? '—';
  const buildApp = Constants.expoConfig?.android?.versionCode;

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: t.colors.background }}
      contentContainerStyle={{ padding: spacing.lg, paddingBottom: spacing.xxxl * 2 }}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}>
      <Etiquette>Votre parcours</Etiquette>
      <Titre style={{ marginTop: spacing.sm }}>
        {etat.reglages.prenom ? `Bonjour, ${etat.reglages.prenom}` : 'Plus'}
      </Titre>

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
        <Statistique valeur={etudesTerminees} label="études OIA" />
        <Statistique valeur={plansTermines} label="plans terminés" />
        <Statistique valeur={etat.versetsMemorises.length} label="versets mémorisés" />
      </View>

      {/* ————— Ressources ————— */}
      <GroupeReglages titre="Ressources" icone={IconeRayonnage}>
        <LigneReglage
          icone={IconeLivre}
          teinte="violet"
          titre="Lire la Bible"
          valeur={versionActive?.abreviation}
          onPress={() => router.push('/(tabs)/')}
        />
        <LigneReglage
          icone={IconeLoupe}
          teinte="bleu"
          titre="Rechercher"
          sousTitre="Dans les versions et les ouvrages installés"
          onPress={() => router.push('/recherche')}
        />
        <LigneReglage
          icone={IconeCalendrier}
          teinte="vert"
          titre="Plans de lecture"
          valeur={`${plansLecture.length} plans`}
          onPress={() => router.push('/(tabs)/etudier')}
        />
        <LigneReglage
          icone={IconeBoussole}
          teinte="or"
          titre="Méthodes d’étude biblique"
          valeur={`${methodesEtude.length} méthodes`}
          onPress={() => router.push('/etude')}
        />
        <LigneReglage
          icone={IconeCroix}
          teinte="rose"
          titre="La méthode O.I.A"
          sousTitre="Les deux formes, et un exemple travaillé"
          onPress={() => router.push('/oia/methode')}
        />
        <LigneReglage
          icone={IconeRayonnage}
          teinte="ardoise"
          titre="Ouvrages installés"
          valeur={`${base.sources} sources`}
          onPress={() => router.push('/sources')}
        />
      </GroupeReglages>

      {/* ————— Paramètres ————— */}
      <GroupeReglages titre="Paramètres" icone={IconeAube}>
        <LigneReglage
          icone={IconeAube}
          teinte="or"
          titre="Thème"
          valeur={NOM_THEME[etat.reglages.theme]}
          depliable>
          <ChoixTheme
            valeur={etat.reglages.theme}
            onChange={(v) => majReglages({ theme: v })}
          />
        </LigneReglage>

        <LigneReglage
          icone={IconeTexte}
          teinte="violet"
          titre="Taille du texte biblique"
          valeur={TAILLES.find((x) => x.valeur === etat.reglages.tailleTexte)?.label}
          depliable>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm }}>
            {TAILLES.map((x) => (
              <Puce
                key={x.label}
                texte={x.label}
                actif={etat.reglages.tailleTexte === x.valeur}
                onPress={() => majReglages({ tailleTexte: x.valeur })}
              />
            ))}
          </View>
          <Text
            style={{
              color: t.colors.textMuted,
              fontSize: fontSize.md * etat.reglages.tailleTexte,
              lineHeight: 26 * etat.reglages.tailleTexte,
              marginTop: spacing.md,
            }}>
            « Ta parole est une lampe à mes pieds. »
          </Text>
        </LigneReglage>

        <LigneReglage
          icone={IconeLivre}
          teinte="bleu"
          titre="Bible par défaut"
          valeur={versionActive?.abreviation}
          depliable>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm }}>
            {versions.map((v) => (
              <Puce
                key={v.id}
                texte={v.abreviation}
                actif={etat.reglages.versionPreferee === v.id}
                onPress={() => majReglages({ versionPreferee: v.id })}
              />
            ))}
          </View>
          {versionActive ? (
            <SousTitre style={{ marginTop: spacing.md }}>{versionActive.nom}</SousTitre>
          ) : null}
        </LigneReglage>

        <LigneReglage
          icone={IconePersonne}
          teinte="rose"
          titre="Votre prénom"
          valeur={etat.reglages.prenom || 'non renseigné'}
          depliable>
          <SousTitre style={{ marginBottom: spacing.md }}>
            Pour l’accueil du matin. Il ne quitte jamais votre téléphone.
          </SousTitre>
          <TextInput
            value={prenom}
            onChangeText={setPrenom}
            onBlur={() => majReglages({ prenom: prenom.trim() })}
            placeholder="Prénom"
            placeholderTextColor={t.colors.textFaint}
            style={{
              backgroundColor: t.colors.background,
              borderRadius: radius.md,
              borderWidth: 1,
              borderColor: t.colors.border,
              paddingHorizontal: spacing.lg,
              paddingVertical: spacing.md,
              color: t.colors.text,
              fontSize: fontSize.md,
            }}
          />
        </LigneReglage>
      </GroupeReglages>

      {/* ————— Rappel ————— */}
      <GroupeReglages titre="Rappel quotidien" icone={IconeCloche}>
        <LigneBascule
          icone={IconeCloche}
          teinte="or"
          titre="Me rappeler mon temps avec Dieu"
          sousTitre="Une notification quotidienne avec le verset du jour"
          valeur={etat.reglages.rappelActif}
          onChange={basculerRappel}
        />
        <LigneReglage
          icone={IconeAube}
          teinte="ardoise"
          titre="Heure du rappel"
          valeur={etat.reglages.rappelHeure}
          depliable>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm }}>
            {HEURES.map((h) => (
              <Puce
                key={h}
                texte={h}
                actif={etat.reglages.rappelHeure === h}
                onPress={() => choisirHeure(h)}
              />
            ))}
          </View>
        </LigneReglage>
      </GroupeReglages>

      {/* ————— Mes écrits ————— */}
      <GroupeReglages titre="Mes écrits" icone={IconeCoffre}>
        <LigneReglage
          icone={IconePlume}
          teinte="violet"
          titre="Ce que vous avez écrit"
          valeur={`${nombre(ecrits)} textes`}
          sousTitre="Études, méditations, journal et prières"
        />
        <LigneReglage
          icone={IconePartage}
          teinte="vert"
          titre="Exporter mes écrits"
          sousTitre="Pour les garder ailleurs, ou changer de téléphone"
          onPress={exporter}
        />
        <LigneReglage
          icone={IconeCorbeille}
          titre="Effacer toutes mes données"
          danger
          onPress={effacer}
        />
      </GroupeReglages>

      {/* ————— Avancé ————— */}
      <GroupeReglages titre="Avancé" icone={IconeNuage}>
        <LigneReglage
          icone={IconeNuage}
          teinte="ardoise"
          titre="Service de synthèse"
          valeur={etat.reglages.assistantUrl ? 'configuré' : 'hors connexion'}
          depliable>
          <SousTitre style={{ marginBottom: spacing.md }}>
            Par défaut, l’application fonctionne hors connexion et se limite à restituer les
            sources installées. Vous pouvez brancher un service que vous hébergez pour
            obtenir en plus une synthèse rédigée. L’application ne stocke aucune clé
            d’API : c’est votre service qui détient les identifiants du fournisseur.
          </SousTitre>
          <TextInput
            value={assistantUrl}
            onChangeText={setAssistantUrl}
            onBlur={() => majReglages({ assistantUrl: assistantUrl.trim() })}
            placeholder="https://votre-service.exemple/synthese"
            placeholderTextColor={t.colors.textFaint}
            autoCapitalize="none"
            autoCorrect={false}
            style={{
              backgroundColor: t.colors.background,
              borderRadius: radius.md,
              borderWidth: 1,
              borderColor: t.colors.border,
              paddingHorizontal: spacing.lg,
              paddingVertical: spacing.md,
              color: t.colors.text,
              fontSize: fontSize.md,
            }}
          />
          <TextInput
            value={assistantJeton}
            onChangeText={setAssistantJeton}
            onBlur={() => majReglages({ assistantJeton: assistantJeton.trim() })}
            placeholder="Jeton d’accès (facultatif)"
            placeholderTextColor={t.colors.textFaint}
            autoCapitalize="none"
            autoCorrect={false}
            secureTextEntry
            style={{
              backgroundColor: t.colors.background,
              borderRadius: radius.md,
              borderWidth: 1,
              borderColor: t.colors.border,
              paddingHorizontal: spacing.lg,
              paddingVertical: spacing.md,
              marginTop: spacing.sm,
              color: t.colors.text,
              fontSize: fontSize.md,
            }}
          />
        </LigneReglage>
      </GroupeReglages>

      {/* ————— À propos ————— */}
      <GroupeReglages titre="À propos" icone={IconeInfo}>
        <LigneReglage
          icone={IconeInfo}
          teinte="bleu"
          titre="Ce qui est installé"
          valeur={`${versions.length} bibles`}
          depliable>
          <SousTitre style={{ lineHeight: 22 }}>
            {versions.map((v) => v.nom).join('\n')}
            {'\n\n'}
            {nombre(base.sources)} ouvrages · {nombre(base.entrees)} entrées de dictionnaire ·{' '}
            {nombre(base.commentaires)} commentaires{'\n'}
            {nombre(plansLecture.length)} plans de lecture ·{' '}
            {nombre(plansLecture.reduce((n, p) => n + p.jours.length, 0))} journées{'\n'}
            {plans.length} plans d’étude · {methodesEtude.length} méthodes d’étude{'\n'}
            {passages.length} passages travaillés · {fichesLivres.length} fiches de livres
          </SousTitre>
        </LigneReglage>
        <LigneReglage
          icone={IconeCoffre}
          teinte="vert"
          titre="Vos données restent chez vous"
          sousTitre="Aucun compte, aucun serveur, rien n’est envoyé"
          depliable>
          <SousTitre style={{ lineHeight: 22 }}>
            Tout ce que vous écrivez est enregistré dans le téléphone et nulle part
            ailleurs. L’application n’a pas de compte, ne demande aucune inscription et
            fonctionne sans connexion. La seule exception est le service de synthèse
            ci-dessus, s’il est configuré — et c’est vous qui l’hébergez.
          </SousTitre>
        </LigneReglage>
      </GroupeReglages>

      <Text
        style={{
          color: t.colors.textFaint,
          fontSize: fontSize.xs,
          textAlign: 'center',
          marginTop: spacing.xl,
        }}>
        Lumière · version {versionApp}
        {buildApp ? ` (${buildApp})` : ''}
      </Text>
      <Text
        style={{
          color: t.colors.textFaint,
          fontSize: fontSize.sm,
          textAlign: 'center',
          marginTop: spacing.lg,
          fontStyle: 'italic',
          lineHeight: 21,
        }}>
        « Ta parole est une lampe à mes pieds, et une lumière sur mon sentier. »{'\n'}
        Psaume 119:105
      </Text>
    </ScrollView>
  );
}
