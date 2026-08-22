import { useRouter } from 'expo-router';
import React, { useMemo, useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, Text, TextInput, View } from 'react-native';

import {
  CarteCommentaire,
  CarteEntree,
  CarteVersetResultat,
} from '../src/components/connaissance';
import { Carte, Etiquette, Puce, Separateur, SousTitre, Titre } from '../src/components/ui';
import { formaterReference, rechercher, ResultatRecherche, statistiquesBase } from '../src/knowledge';
import { useApp } from '../src/store/AppContext';
import { fontSize, radius, spacing } from '../src/theme/theme';

type Filtre = 'tout' | ResultatRecherche['genre'];

const LIBELLES: Record<Filtre, string> = {
  tout: 'Tout',
  verset: 'Versets',
  definition: 'Dictionnaire',
  commentaire: 'Commentaires',
  theme: 'Thèmes',
};

const SUGGESTIONS = ['grâce', 'Jean 3:16', 'pardon', 'agapè', 'Psaume 23', 'espérance'];

export default function Recherche() {
  const { theme: t } = useApp();
  const router = useRouter();
  const [saisie, setSaisie] = useState('');
  const [filtre, setFiltre] = useState<Filtre>('tout');

  const base = useMemo(() => statistiquesBase(), []);
  // La recherche porte sur toutes les versions installées, non sur la seule
  // version de lecture : un texte qui ne figure que dans l'une d'elles — les
  // livres deutérocanoniques, le Nouveau Testament de Parole Vivante — doit
  // pouvoir être trouvé. Chaque résultat indique de quelle version il vient.
  const reponse = useMemo(
    () => (saisie.trim().length >= 2 ? rechercher(saisie, { limite: 25 }) : undefined),
    [saisie],
  );

  const affiches = (reponse?.resultats ?? []).filter(
    (r) => filtre === 'tout' || r.genre === filtre,
  );

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: t.colors.background }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView
        contentContainerStyle={{ padding: spacing.lg, paddingBottom: spacing.xxxl * 2 }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}>
        <Etiquette>Base de connaissances</Etiquette>
        <Titre style={{ marginTop: spacing.sm }}>Rechercher</Titre>
        <SousTitre style={{ marginTop: spacing.sm }}>
          Une requête interroge à la fois le texte biblique, le dictionnaire, les
          commentaires et les thèmes. Chaque résultat indique sa nature et sa source.
        </SousTitre>

        <TextInput
          value={saisie}
          onChangeText={setSaisie}
          autoFocus
          placeholder="Un mot, un thème, ou une référence (Jean 3:16)…"
          placeholderTextColor={t.colors.textFaint}
          style={{
            backgroundColor: t.colors.surface,
            borderRadius: radius.md,
            borderWidth: 1,
            borderColor: t.colors.border,
            paddingHorizontal: spacing.lg,
            paddingVertical: spacing.md,
            marginTop: spacing.lg,
            color: t.colors.text,
            fontSize: fontSize.md,
          }}
        />

        {!reponse ? (
          <>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm, marginTop: spacing.lg }}>
              {SUGGESTIONS.map((s) => (
                <Puce key={s} texte={s} onPress={() => setSaisie(s)} />
              ))}
            </View>
            <Carte accent style={{ marginTop: spacing.xl }}>
              <Text style={{ color: t.colors.text, fontSize: fontSize.md, fontWeight: '700' }}>
                Ce que la base contient
              </Text>
              <SousTitre style={{ marginTop: spacing.sm }}>
                {base.entrees} entrées de dictionnaire · {base.commentaires} commentaires ·{' '}
                {base.referencesCroisees} références croisées · {base.themes} thèmes,
                répartis sur {base.sources} sources.
              </SousTitre>
              <Puce texte="Voir les sources" onPress={() => router.push('/sources')} />
            </Carte>
          </>
        ) : (
          <>
            {reponse.referenceDetectee ? (
              <Carte
                accent
                style={{ marginTop: spacing.lg }}
                onPress={() =>
                  router.push(
                    `/reference/${encodeURIComponent(formaterReference(reponse.referenceDetectee!))}`,
                  )
                }>
                <Etiquette>Référence reconnue</Etiquette>
                <Text
                  style={{
                    color: t.colors.text,
                    fontSize: fontSize.xl,
                    fontWeight: '700',
                    marginTop: spacing.xs,
                  }}>
                  {formaterReference(reponse.referenceDetectee)}
                </Text>
                <SousTitre style={{ marginTop: 2 }}>
                  Ouvrir le dossier complet de ce passage
                </SousTitre>
              </Carte>
            ) : null}

            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm, marginTop: spacing.lg }}>
              {(['tout', 'verset', 'definition', 'commentaire', 'theme'] as Filtre[])
                .filter((f) => f === 'tout' || reponse.compte[f] > 0)
                .map((f) => (
                  <Puce
                    key={f}
                    texte={
                      f === 'tout'
                        ? `${LIBELLES[f]} (${reponse.resultats.length})`
                        : `${LIBELLES[f]} (${reponse.compte[f]})`
                    }
                    actif={filtre === f}
                    onPress={() => setFiltre(f)}
                  />
                ))}
            </View>

            <Separateur />

            {affiches.length === 0 ? (
              <SousTitre style={{ textAlign: 'center', marginTop: spacing.xl }}>
                Aucun résultat. Ajoutez un ouvrage de référence pour enrichir la base.
              </SousTitre>
            ) : null}

            {affiches.map((r, i) => {
              if (r.genre === 'verset') {
                return (
                  <CarteVersetResultat
                    key={`v-${r.libelle}-${r.version.id}-${i}`}
                    libelle={r.libelle}
                    texte={r.texte}
                    abreviation={r.version.abreviation}
                    onPress={() => router.push(`/reference/${encodeURIComponent(r.libelle)}`)}
                  />
                );
              }
              if (r.genre === 'definition') {
                return <CarteEntree key={`d-${r.entree.id}`} entree={r.entree} compact />;
              }
              if (r.genre === 'commentaire') {
                return <CarteCommentaire key={`c-${r.commentaire.id}`} commentaire={r.commentaire} />;
              }
              return (
                <Carte key={`t-${r.theme.id}`} style={{ marginBottom: spacing.md }}>
                  <Etiquette>Thème</Etiquette>
                  <Text
                    style={{
                      color: t.colors.text,
                      fontSize: fontSize.lg,
                      fontWeight: '700',
                      marginTop: spacing.xs,
                    }}>
                    {r.theme.nom}
                  </Text>
                  <SousTitre style={{ marginTop: 2 }}>{r.theme.description}</SousTitre>
                  <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm, marginTop: spacing.md }}>
                    {r.theme.references.slice(0, 8).map((ref, j) => (
                      <Puce
                        key={`${formaterReference(ref)}-${j}`}
                        texte={formaterReference(ref)}
                        onPress={() =>
                          router.push(`/reference/${encodeURIComponent(formaterReference(ref))}`)
                        }
                      />
                    ))}
                  </View>
                </Carte>
              );
            })}
          </>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
