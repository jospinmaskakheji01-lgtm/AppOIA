import { useRouter } from 'expo-router';
import React, { useMemo, useState } from 'react';
import { Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Carte, Etiquette, Puce, Separateur, SousTitre, Titre } from '../../src/components/ui';
import {
  chapitresDuLivre,
  livresCanoniques,
  livresDeLaVersion,
  normaliser,
  statistiquesVersion,
  versionsDisponibles,
} from '../../src/knowledge';
import { useApp } from '../../src/store/AppContext';
import { fontSize, radius, spacing } from '../../src/theme/theme';
import { nombre } from '../../src/utils/nombres';

/**
 * L'écran d'ouverture : la Bible.
 *
 * C'est le premier écran de l'application, et c'est voulu — on ouvre une
 * application biblique pour lire la Bible, pas pour consulter un tableau de
 * bord. Choisir une version, choisir un livre, lire ; et quand une lecture est
 * en cours, elle passe avant tout le reste.
 *
 * Les corpus sont séparés parce qu'ils n'ont pas le même statut : les livres
 * deutérocanoniques ne sont pas reçus par toutes les Églises, et les présenter
 * dans une seule liste continue trancherait une question qui n'appartient pas à
 * l'application.
 */
const CORPUS = [
  { cle: 'ancien', titre: 'Ancien Testament' },
  { cle: 'deuterocanonique', titre: 'Livres deutérocanoniques' },
  { cle: 'nouveau', titre: 'Nouveau Testament' },
] as const;

export default function Bible() {
  const { theme: t, etat, majReglages } = useApp();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [recherche, setRecherche] = useState('');

  const versions = useMemo(() => versionsDisponibles(), []);
  const versionActive =
    versions.find((v) => v.id === etat.reglages.versionPreferee) ?? versions[0];

  /** Les livres que cette version contient réellement, et rien d'autre. */
  const disponibles = useMemo(
    () => new Set(livresDeLaVersion(versionActive?.id ?? '')),
    [versionActive?.id],
  );

  const stats = useMemo(
    () => (versionActive ? statistiquesVersion(versionActive.id) : undefined),
    [versionActive?.id],
  );

  const q = normaliser(recherche.trim());
  const parCorpus = useMemo(
    () =>
      CORPUS.map((corpus) => ({
        ...corpus,
        livres: livresCanoniques
          .filter((l) => l.testament === corpus.cle)
          .filter((l) => disponibles.has(l.nom))
          .filter(
            (l) => !q || normaliser(l.nom).includes(q) || normaliser(l.abreviation).includes(q),
          ),
      })).filter((c) => c.livres.length > 0),
    [disponibles, q],
  );

  const reprise = etat.reglages.derniereLecture;
  const repriseLisible = reprise && disponibles.has(reprise.livre) ? reprise : undefined;

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: t.colors.background }}
      contentContainerStyle={{
        padding: spacing.lg,
        paddingTop: insets.top + spacing.md,
        paddingBottom: spacing.xxxl * 2,
      }}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}>
      <Etiquette>{versions.length} versions hors connexion</Etiquette>
      <Titre style={{ marginTop: spacing.sm }}>Lire la Bible</Titre>

      {repriseLisible ? (
        <Pressable
          onPress={() =>
            router.push(
              `/lire/${encodeURIComponent(repriseLisible.livre)}/${repriseLisible.chapitre}`,
            )
          }
          style={{
            marginTop: spacing.lg,
            padding: spacing.lg,
            borderRadius: radius.lg,
            backgroundColor: t.colors.primary,
          }}>
          <Text
            style={{
              color: '#FFFFFF',
              fontSize: fontSize.xs,
              fontWeight: '800',
              letterSpacing: 1,
            }}>
            REPRENDRE VOTRE LECTURE
          </Text>
          <Text
            style={{ color: '#FFFFFF', fontSize: fontSize.xxl, fontWeight: '700', marginTop: 4 }}>
            {repriseLisible.livre} {repriseLisible.chapitre}
          </Text>
          <Text style={{ color: '#FFFFFFCC', fontSize: fontSize.sm, marginTop: 2 }}>
            {versionActive?.nom}
          </Text>
        </Pressable>
      ) : null}

      <Separateur label="Version de lecture" />
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm }}>
        {versions.map((v) => (
          <Puce
            key={v.id}
            texte={`${v.abreviation}${v.annee ? ` · ${v.annee}` : ''}`}
            actif={v.id === versionActive?.id}
            onPress={() => majReglages({ versionPreferee: v.id })}
          />
        ))}
      </View>
      {versionActive ? (
        <SousTitre style={{ marginTop: spacing.md }}>
          {versionActive.nom} — {nombre(stats?.versets)} versets sur {nombre(stats?.livres)}{' '}
          livre{(stats?.livres ?? 0) > 1 ? 's' : ''}.
        </SousTitre>
      ) : null}

      <Separateur label="Choisir un livre" />
      <TextInput
        value={recherche}
        onChangeText={setRecherche}
        placeholder="Chercher un livre…"
        placeholderTextColor={t.colors.textFaint}
        style={{
          backgroundColor: t.colors.surface,
          borderRadius: radius.md,
          borderWidth: 1,
          borderColor: t.colors.border,
          paddingHorizontal: spacing.lg,
          paddingVertical: spacing.md,
          color: t.colors.text,
          fontSize: fontSize.md,
          marginBottom: spacing.lg,
        }}
      />

      {parCorpus.map((corpus) => (
        <View key={corpus.cle} style={{ marginBottom: spacing.xl }}>
          <Etiquette>{corpus.titre}</Etiquette>
          <View
            style={{
              flexDirection: 'row',
              flexWrap: 'wrap',
              gap: spacing.sm,
              marginTop: spacing.md,
            }}>
            {corpus.livres.map((l) => {
              const chapitres = chapitresDuLivre(versionActive?.id ?? '', l.nom);
              return (
                <Pressable
                  key={l.nom}
                  onPress={() =>
                    router.push(`/lire/${encodeURIComponent(l.nom)}/${chapitres[0] ?? 1}`)
                  }
                  style={{
                    backgroundColor: t.colors.surface,
                    borderWidth: 1,
                    borderColor: t.colors.border,
                    borderRadius: radius.md,
                    paddingVertical: spacing.md,
                    paddingHorizontal: spacing.lg,
                  }}>
                  <Text style={{ color: t.colors.text, fontSize: fontSize.md, fontWeight: '600' }}>
                    {l.nom}
                  </Text>
                  <Text style={{ color: t.colors.textFaint, fontSize: fontSize.xs, marginTop: 2 }}>
                    {chapitres.length} chapitre{chapitres.length > 1 ? 's' : ''}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>
      ))}

      {parCorpus.length === 0 ? (
        <SousTitre>Aucun livre ne correspond à « {recherche} » dans cette version.</SousTitre>
      ) : null}

      <Separateur label="Aussi dans la Bible" />
      <View style={{ gap: spacing.sm }}>
        <Carte onPress={() => router.push('/recherche')}>
          <Text style={{ color: t.colors.text, fontSize: fontSize.md, fontWeight: '700' }}>
            Rechercher un mot ou un verset
          </Text>
          <SousTitre style={{ marginTop: 2 }}>
            Dans les versions installées et dans les ouvrages
          </SousTitre>
        </Carte>
        <Carte onPress={() => router.push('/passages')}>
          <Text style={{ color: t.colors.text, fontSize: fontSize.md, fontWeight: '700' }}>
            Passages préparés
          </Text>
          <SousTitre style={{ marginTop: 2 }}>
            Des textes accompagnés d’une fiche et de pistes d’observation
          </SousTitre>
        </Carte>
        <Carte onPress={() => router.push('/assistant')}>
          <Text style={{ color: t.colors.text, fontSize: fontSize.md, fontWeight: '700' }}>
            Poser une question
          </Text>
          <SousTitre style={{ marginTop: 2 }}>
            La réponse cite ses sources et ne les mélange pas
          </SousTitre>
        </Carte>
      </View>
    </ScrollView>
  );
}
