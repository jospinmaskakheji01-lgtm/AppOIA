import React, { useMemo } from 'react';
import { ScrollView, Text, View } from 'react-native';

import { Carte, Etiquette, Separateur, SousTitre, Titre } from '../src/components/ui';
import { statistiquesBase, toutesLesSources, versionsDisponibles } from '../src/knowledge';
import { Provenance } from '../src/knowledge/types';
import { useApp } from '../src/store/AppContext';
import { fontSize, radius, spacing } from '../src/theme/theme';
import { nombre } from '../src/utils/nombres';

/** Libellés d'affichage de la provenance, quand elle est renseignée. */
const LIBELLES_PROVENANCE: Record<Provenance, string> = {
  'domaine-public': 'Domaine public',
  'licence-libre': 'Licence libre',
  'sous-droits': 'Sous droits',
  interne: 'Rédaction interne',
  'non-precisee': 'Provenance non précisée',
};

export default function Sources() {
  const { theme: t } = useApp();
  const sources = useMemo(() => toutesLesSources(), []);
  const versions = useMemo(() => versionsDisponibles(), []);
  const base = useMemo(() => statistiquesBase(), []);

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: t.colors.background }}
      contentContainerStyle={{ padding: spacing.lg, paddingBottom: spacing.xxxl * 2 }}
      showsVerticalScrollIndicator={false}>
      <Etiquette>Traçabilité</Etiquette>
      <Titre style={{ marginTop: spacing.sm }}>Sources</Titre>
      <SousTitre style={{ marginTop: spacing.sm }}>
        Chaque information de l’application provient de l’une de ces sources et reste
        rattachée à elle : vous savez toujours d’où vient ce que vous lisez.
      </SousTitre>

      <Carte accent style={{ marginTop: spacing.lg }}>
        <SousTitre>
          {nombre(base.sources)} sources · {nombre(base.entrees)} entrées ·{' '}
          {nombre(base.commentaires)} commentaires · {nombre(base.conseils)} conseils de méthode ·{' '}
          {nombre(base.referencesCroisees)} références croisées · {nombre(base.themes)} thèmes ·{' '}
          {versions.length} version{versions.length > 1 ? 's' : ''} biblique
          {versions.length > 1 ? 's' : ''}
        </SousTitre>
      </Carte>

      <Separateur label="Ouvrages" />

      {sources.map((s) => (
        <Carte key={s.id} style={{ marginBottom: spacing.md }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <View style={{ flex: 1, paddingRight: spacing.md }}>
              <Text style={{ color: t.colors.text, fontSize: fontSize.lg, fontWeight: '700' }}>
                {s.titre}
              </Text>
              <Text style={{ color: t.colors.textMuted, fontSize: fontSize.sm, marginTop: 2 }}>
                {[s.auteur, s.annee, s.type].filter(Boolean).join(' · ')}
              </Text>
            </View>
            <View
              style={{
                backgroundColor: t.colors.surfaceAlt,
                borderRadius: radius.sm,
                paddingVertical: 3,
                paddingHorizontal: spacing.sm + 2,
              }}>
              <Text style={{ color: t.colors.textMuted, fontSize: 10, fontWeight: '800' }}>
                {s.abreviation}
              </Text>
            </View>
          </View>

          {s.provenance ? (
            <Text
              style={{
                color: t.colors.textMuted,
                fontSize: fontSize.sm,
                fontWeight: '600',
                marginTop: spacing.md,
              }}>
              {LIBELLES_PROVENANCE[s.provenance]}
            </Text>
          ) : null}
          {s.noteProvenance ? (
            <Text
              style={{
                color: t.colors.textMuted,
                fontSize: fontSize.sm,
                lineHeight: 22,
                marginTop: 4,
              }}>
              {s.noteProvenance}
            </Text>
          ) : null}
          {s.documentOrigine ? (
            <Text style={{ color: t.colors.textFaint, fontSize: fontSize.xs, marginTop: spacing.sm }}>
              Document d’origine : {s.documentOrigine}
            </Text>
          ) : null}
          <Text style={{ color: t.colors.textFaint, fontSize: fontSize.xs, marginTop: 2 }}>
            Ajoutée le {s.ajouteLe}
          </Text>
        </Carte>
      ))}

      <Separateur label="Versions bibliques" />

      {versions.map((v) => (
        <Carte key={v.id} style={{ marginBottom: spacing.md }}>
          <Text style={{ color: t.colors.text, fontSize: fontSize.lg, fontWeight: '700' }}>
            {v.nom} ({v.abreviation})
          </Text>
          <Text style={{ color: t.colors.textMuted, fontSize: fontSize.sm, marginTop: 2 }}>
            {v.langue} · {v.annee ?? 'sans date'} ·{' '}
            {v.couverture === 'complete' ? 'couverture complète' : 'couverture partielle'}
          </Text>
          {v.provenance ? (
            <Text
              style={{
                color: t.colors.textMuted,
                fontSize: fontSize.sm,
                fontWeight: '600',
                marginTop: spacing.sm,
              }}>
              {LIBELLES_PROVENANCE[v.provenance]}
            </Text>
          ) : null}
        </Carte>
      ))}

      <Carte accent style={{ marginTop: spacing.lg }}>
        <Text style={{ color: t.colors.text, fontSize: fontSize.md, fontWeight: '700' }}>
          Ajouter un ouvrage
        </Text>
        <SousTitre style={{ marginTop: spacing.sm }}>
          Les ouvrages s’ajoutent par ingestion, hors de l’application : voir
          `docs/BASE-DE-CONNAISSANCES.md` et les scripts `importer-version` et
          `importer-document`.
        </SousTitre>
      </Carte>
    </ScrollView>
  );
}
