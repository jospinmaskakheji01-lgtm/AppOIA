import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useMemo } from 'react';
import { ScrollView, Share, Text, View } from 'react-native';

import { CarteCommentaire, CarteEntree, LigneSource } from '../../src/components/connaissance';
import { Bouton, Carte, Etiquette, Puce, Separateur, SousTitre } from '../../src/components/ui';
import {
  analyserReference,
  comparerVersions,
  dossierReference,
  formaterReference,
  versionsDisponibles,
} from '../../src/knowledge';
import { useApp } from '../../src/store/AppContext';
import { fontSize, radius, spacing } from '../../src/theme/theme';

/**
 * Dossier d'un passage : tout ce que la base sait d'une référence,
 * chaque bloc restant rattaché à sa source.
 */
export default function DossierPassage() {
  const { ref } = useLocalSearchParams<{ ref: string }>();
  const { theme: t, etat, creerEtude } = useApp();
  const router = useRouter();

  const reference = useMemo(() => analyserReference(decodeURIComponent(String(ref ?? ''))), [ref]);
  const dossier = useMemo(() => (reference ? dossierReference(reference) : undefined), [reference]);
  const versions = useMemo(() => versionsDisponibles(), []);
  const comparaisons = useMemo(
    () => (reference ? comparerVersions(reference) : []),
    [reference],
  );

  if (!reference || !dossier) {
    return (
      <View style={{ flex: 1, backgroundColor: t.colors.background, padding: spacing.xl }}>
        <SousTitre>Référence non reconnue : « {String(ref)} ».</SousTitre>
      </View>
    );
  }

  const echelle = etat.reglages.tailleTexte;
  const presentes = comparaisons.filter((c) => !c.absent);
  const versionLue =
    presentes.find((c) => c.version.id === etat.reglages.versionPreferee) ?? presentes[0];

  const partager = () => {
    const texte = versionLue?.versets.map((v) => `${v.verset} ${v.texte}`).join(' ') ?? '';
    Share.share({
      message: `${dossier.libelle}\n\n${texte}\n\n${versionLue?.version.nom ?? ''}`,
    }).catch(() => {});
  };

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: t.colors.background }}
      contentContainerStyle={{ padding: spacing.lg, paddingBottom: spacing.xxxl * 2 }}
      showsVerticalScrollIndicator={false}>
      <Etiquette>Dossier du passage</Etiquette>
      <Text
        style={{
          color: t.colors.text,
          fontSize: fontSize.title,
          fontWeight: '700',
          marginTop: spacing.xs,
        }}>
        {dossier.libelle}
      </Text>

      <Separateur label="Texte biblique" />

      {presentes.length === 0 ? (
        <Carte accent>
          <SousTitre>
            Aucune version installée ne couvre ce passage. Lisez-le dans votre Bible, ou
            importez une version complète (voir les réglages).
          </SousTitre>
        </Carte>
      ) : null}

      {presentes.map((compare) => (
        <Carte key={compare.version.id} style={{ marginBottom: spacing.md }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <Text style={{ color: t.colors.accent, fontSize: fontSize.sm, fontWeight: '800' }}>
              {compare.version.abreviation}
            </Text>
            <Text style={{ color: t.colors.textFaint, fontSize: fontSize.xs }}>
              {compare.version.nom}
            </Text>
          </View>
          <View style={{ marginTop: spacing.md }}>
            {compare.versets.map((v) => (
              <View key={v.verset} style={{ flexDirection: 'row', marginBottom: spacing.sm }}>
                <Text
                  style={{
                    color: t.colors.textFaint,
                    fontSize: fontSize.xs * echelle,
                    fontWeight: '700',
                    width: 22,
                    paddingTop: 4,
                  }}>
                  {v.verset}
                </Text>
                <Text
                  style={{
                    color: t.colors.text,
                    fontSize: fontSize.md * echelle,
                    lineHeight: 25 * echelle,
                    flex: 1,
                  }}>
                  {v.texte}
                </Text>
              </View>
            ))}
          </View>
        </Carte>
      ))}

      {versions.length === 1 ? (
        <SousTitre style={{ marginTop: spacing.xs }}>
          Une seule version est installée. En ajouter une permet de comparer les
          traductions ici même.
        </SousTitre>
      ) : null}

      {dossier.entrees.length > 0 ? (
        <>
          <Separateur label="Mots et notions du passage" />
          {dossier.entrees.map((e) => (
            <CarteEntree key={e.id} entree={e} compact />
          ))}
        </>
      ) : null}

      {dossier.commentaires.length > 0 ? (
        <>
          <Separateur label={`Commentaires (${dossier.commentaires.length})`} />
          {dossier.commentaires.map((c) => (
            <CarteCommentaire key={c.id} commentaire={c} />
          ))}
        </>
      ) : null}

      {dossier.referencesCroisees.length > 0 ? (
        <>
          <Separateur label="Références croisées" />
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm }}>
            {dossier.referencesCroisees.slice(0, 24).map((rc) => {
              const cible = formaterReference(
                formaterReference(rc.de) === dossier.libelle ? rc.vers : rc.de,
              );
              return (
                <Puce
                  key={rc.id}
                  texte={cible}
                  onPress={() => router.push(`/reference/${encodeURIComponent(cible)}`)}
                />
              );
            })}
          </View>
          <SousTitre style={{ marginTop: spacing.md }}>
            Relations relevées : {[...new Set(dossier.referencesCroisees.map((r) => r.relation))].join(', ')}.
          </SousTitre>
        </>
      ) : null}

      {dossier.themes.length > 0 ? (
        <>
          <Separateur label="Thèmes" />
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm }}>
            {dossier.themes.map((th) => (
              <Puce key={th.id} texte={th.nom} onPress={() => router.push(`/recherche`)} />
            ))}
          </View>
        </>
      ) : null}

      <Separateur label="Sources mobilisées" />
      {dossier.sources.length === 0 ? (
        <SousTitre>Aucune source documentaire ne traite encore ce passage.</SousTitre>
      ) : (
        <View
          style={{
            backgroundColor: t.colors.surfaceAlt,
            borderRadius: radius.lg,
            padding: spacing.lg,
          }}>
          {dossier.sources.map((s) => (
            <View key={s.id} style={{ marginBottom: spacing.sm }}>
              <Text style={{ color: t.colors.text, fontSize: fontSize.md, fontWeight: '600' }}>
                {s.abreviation} — {s.titre}
              </Text>
              <LigneSource source={s} />
            </View>
          ))}
        </View>
      )}

      <Bouton
        titre="Étudier ce passage (méthode OIA)"
        onPress={() => {
          const etude = creerEtude({ reference: dossier.libelle });
          router.push(`/oia/${etude.id}`);
        }}
        style={{ marginTop: spacing.xl }}
      />
      <Bouton
        titre="Partager"
        variante="discret"
        onPress={partager}
        style={{ marginTop: spacing.sm }}
      />
    </ScrollView>
  );
}
