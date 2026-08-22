import { useRouter } from 'expo-router';
import React, { useMemo, useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';

import { BadgeNature, LigneSource } from '../src/components/connaissance';
import { Bouton, Carte, Etiquette, Puce, Separateur, SousTitre, Titre } from '../src/components/ui';
import { creerAssistant, formaterReference, getSource, ReponseAssistant } from '../src/knowledge';
import { useApp } from '../src/store/AppContext';
import { fontSize, radius, spacing } from '../src/theme/theme';

const EXEMPLES = [
  'Que signifie le mot grâce ?',
  'Que dit la Bible sur le pardon ?',
  'Qui est Théophile ?',
  'Que veut dire agapè ?',
];

/**
 * Réponse aux questions bibliques.
 *
 * Les trois natures de contenu sont présentées dans trois blocs distincts et
 * étiquetés : le texte biblique, ce que disent les ouvrages, et — seulement si
 * un service de synthèse est configuré — la synthèse produite par un modèle.
 */
export default function Assistant() {
  const { theme: t, etat } = useApp();
  const router = useRouter();
  const [question, setQuestion] = useState('');
  const [reponse, setReponse] = useState<ReponseAssistant | undefined>();
  const [enCours, setEnCours] = useState(false);

  const assistant = useMemo(
    () =>
      creerAssistant(
        etat.reglages.assistantUrl
          ? {
              url: etat.reglages.assistantUrl,
              jeton: etat.reglages.assistantJeton || undefined,
              modele: etat.reglages.assistantModele || undefined,
            }
          : null,
      ),
    [etat.reglages.assistantUrl, etat.reglages.assistantJeton, etat.reglages.assistantModele],
  );

  const demander = async (texte: string) => {
    const q = texte.trim();
    if (!q) return;
    setQuestion(q);
    setEnCours(true);
    try {
      setReponse(await assistant.repondre(q, { versionId: etat.reglages.versionPreferee }));
    } finally {
      setEnCours(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: t.colors.background }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView
        contentContainerStyle={{ padding: spacing.lg, paddingBottom: spacing.xxxl * 2 }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}>
        <Etiquette>{assistant.nom}</Etiquette>
        <Titre style={{ marginTop: spacing.sm }}>Questions bibliques</Titre>
        <SousTitre style={{ marginTop: spacing.sm }}>
          {assistant.produitSynthese
            ? `Les réponses distinguent toujours trois choses : le texte biblique, ce que disent les ouvrages, et la synthèse produite par le modèle.`
            : `L'application répond hors connexion, à partir des ouvrages installés. Aucune synthèse n'est générée : vous lisez les sources elles-mêmes.`}
        </SousTitre>

        <TextInput
          value={question}
          onChangeText={setQuestion}
          onSubmitEditing={() => demander(question)}
          returnKeyType="search"
          placeholder="Posez votre question…"
          placeholderTextColor={t.colors.textFaint}
          multiline
          style={{
            backgroundColor: t.colors.surface,
            borderRadius: radius.md,
            borderWidth: 1,
            borderColor: t.colors.border,
            paddingHorizontal: spacing.lg,
            paddingVertical: spacing.md,
            marginTop: spacing.lg,
            minHeight: 90,
            color: t.colors.text,
            fontSize: fontSize.md,
            lineHeight: 23,
          }}
        />
        <Bouton
          titre="Chercher la réponse"
          onPress={() => demander(question)}
          desactive={!question.trim() || enCours}
          style={{ marginTop: spacing.md }}
        />

        {!reponse && !enCours ? (
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm, marginTop: spacing.lg }}>
            {EXEMPLES.map((e) => (
              <Puce key={e} texte={e} onPress={() => demander(e)} />
            ))}
          </View>
        ) : null}

        {enCours ? (
          <View style={{ alignItems: 'center', marginTop: spacing.xxl }}>
            <ActivityIndicator color={t.colors.primary} />
          </View>
        ) : null}

        {reponse && !enCours ? (
          <>
            {reponse.avertissement ? (
              <Carte accent style={{ marginTop: spacing.lg }}>
                <SousTitre>{reponse.avertissement}</SousTitre>
              </Carte>
            ) : null}

            {reponse.synthese ? (
              <>
                <Separateur label="Synthèse" />
                <View
                  style={{
                    backgroundColor: t.colors.surfaceAlt,
                    borderRadius: radius.lg,
                    padding: spacing.lg,
                    borderLeftWidth: 3,
                    borderLeftColor: t.colors.textFaint,
                  }}>
                  <BadgeNature nature="synthese-ia" />
                  <Text
                    style={{
                      color: t.colors.text,
                      fontSize: fontSize.md,
                      lineHeight: 25,
                      marginTop: spacing.md,
                    }}>
                    {reponse.synthese.texte}
                  </Text>
                  <Text
                    style={{
                      color: t.colors.textFaint,
                      fontSize: fontSize.xs,
                      marginTop: spacing.md,
                      lineHeight: 17,
                    }}>
                    Produit par un modèle de langage ({reponse.synthese.modele}) à partir des
                    sources ci-dessous. À vérifier contre le texte biblique.
                    {reponse.synthese.horsSources
                      ? ' Une partie de cette réponse dépasse les sources fournies.'
                      : ''}
                  </Text>
                </View>
              </>
            ) : null}

            {reponse.textesBibliques.length > 0 ? (
              <>
                <Separateur label="Texte biblique" />
                {reponse.textesBibliques.map((c, i) => (
                  <Carte
                    key={`${c.reference}-${c.version.id}-${i}`}
                    style={{ marginBottom: spacing.md }}
                    onPress={() => router.push(`/reference/${encodeURIComponent(c.reference)}`)}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.sm }}>
                      <BadgeNature nature="texte-biblique" />
                      <Text style={{ color: t.colors.textFaint, fontSize: fontSize.xs, fontWeight: '700' }}>
                        {c.version.abreviation}
                      </Text>
                    </View>
                    <Text
                      style={{
                        color: t.colors.accent,
                        fontSize: fontSize.sm,
                        fontWeight: '700',
                        marginTop: spacing.sm,
                      }}>
                      {c.reference}
                    </Text>
                    <Text
                      style={{ color: t.colors.text, fontSize: fontSize.md, lineHeight: 25, marginTop: 4 }}>
                      {c.texte}
                    </Text>
                  </Carte>
                ))}
              </>
            ) : null}

            {reponse.extraitsSources.length > 0 ? (
              <>
                <Separateur label="Ce que disent les ouvrages" />
                {reponse.extraitsSources.map((e, i) => (
                  <Carte key={`${e.sourceId}-${i}`} style={{ marginBottom: spacing.md }}>
                    <BadgeNature nature="source-documentaire" />
                    {e.reference ? (
                      <Text
                        style={{
                          color: t.colors.accent,
                          fontSize: fontSize.sm,
                          fontWeight: '700',
                          marginTop: spacing.sm,
                        }}>
                        {e.reference}
                      </Text>
                    ) : null}
                    <Text
                      style={{
                        color: t.colors.text,
                        fontSize: fontSize.md,
                        lineHeight: 25,
                        marginTop: spacing.sm,
                      }}>
                      {e.texte}
                    </Text>
                    <LigneSource source={getSource(e.sourceId)} complement={e.localisation} />
                  </Carte>
                ))}
              </>
            ) : null}

            {reponse.sources.length > 0 ? (
              <>
                <Separateur label="Sources consultées" />
                <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm }}>
                  {reponse.sources.map((s) => (
                    <Puce key={s.id} texte={s.abreviation} onPress={() => router.push('/sources')} />
                  ))}
                </View>
              </>
            ) : null}
          </>
        ) : null}

        {!assistant.produitSynthese ? (
          <Carte style={{ marginTop: spacing.xxl }}>
            <Text style={{ color: t.colors.text, fontSize: fontSize.md, fontWeight: '700' }}>
              Ajouter une synthèse
            </Text>
            <SousTitre style={{ marginTop: spacing.sm }}>
              Une synthèse rédigée peut être ajoutée en configurant, dans les réglages,
              l’adresse d’un service que vous hébergez. L’application n’embarque aucune clé
              d’API : c’est votre service qui détient les identifiants. Le dossier
              `serveur/` du dépôt contient une implémentation de référence.
            </SousTitre>
            <Bouton
              titre="Ouvrir les réglages"
              variante="secondaire"
              onPress={() => router.push('/reglages')}
              style={{ marginTop: spacing.lg }}
            />
          </Carte>
        ) : null}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
