import { useRouter } from 'expo-router';
import React from 'react';
import { Pressable, Text, View } from 'react-native';

import {
  Commentaire,
  ConseilMethode,
  EntreeDictionnaire,
  NatureContenu,
  Source,
  formaterReference,
  getSource,
} from '../knowledge';
import { useTheme } from '../store/AppContext';
import { fontSize, radius, spacing } from '../theme/theme';

/** Pastille indiquant de quelle nature est le contenu affiché en dessous. */
export function BadgeNature({ nature }: { nature: NatureContenu }) {
  const t = useTheme();
  const config: Record<NatureContenu, { libelle: string; fond: string; texte: string }> = {
    'texte-biblique': { libelle: 'Texte biblique', fond: t.colors.primarySoft, texte: t.colors.primary },
    'source-documentaire': { libelle: 'Ouvrage', fond: t.colors.accentSoft, texte: t.colors.accent },
    'synthese-ia': { libelle: 'Synthèse IA', fond: t.colors.surfaceAlt, texte: t.colors.textMuted },
  };
  const c = config[nature];
  return (
    <View
      style={{
        alignSelf: 'flex-start',
        backgroundColor: c.fond,
        borderRadius: radius.sm,
        paddingVertical: 3,
        paddingHorizontal: spacing.sm + 2,
      }}>
      <Text style={{ color: c.texte, fontSize: 10, fontWeight: '800', letterSpacing: 0.8 }}>
        {c.libelle.toUpperCase()}
      </Text>
    </View>
  );
}

/** Ligne d'attribution : d'où vient l'information affichée. */
export function LigneSource({
  source,
  complement,
}: {
  source?: Source;
  complement?: string;
}) {
  const t = useTheme();
  if (!source) return null;
  const parties = [
    source.titre,
    source.auteur,
    source.annee,
    complement,
  ].filter(Boolean);
  return (
    <Text
      style={{
        color: t.colors.textFaint,
        fontSize: fontSize.xs,
        marginTop: spacing.sm,
        lineHeight: 17,
      }}>
      {parties.join(' · ')}
    </Text>
  );
}

export function CarteCommentaire({ commentaire }: { commentaire: Commentaire }) {
  const t = useTheme();
  const router = useRouter();
  const source = getSource(commentaire.sourceId);
  const libellesType: Record<Commentaire['type'], string> = {
    contexte: 'Contexte',
    historique: 'Repère historique',
    theologique: 'Théologie',
    pratique: 'Application',
    linguistique: 'Langue',
    structure: 'Structure',
  };
  const localisation = [
    commentaire.localisation?.section,
    commentaire.localisation?.page ? `p. ${commentaire.localisation.page}` : undefined,
  ]
    .filter(Boolean)
    .join(', ');

  return (
    <View
      style={{
        backgroundColor: t.colors.surface,
        borderRadius: radius.lg,
        borderWidth: 1,
        borderColor: t.colors.border,
        padding: spacing.lg,
        marginBottom: spacing.md,
      }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.sm }}>
        <BadgeNature nature="source-documentaire" />
        <Text style={{ color: t.colors.textFaint, fontSize: fontSize.xs, fontWeight: '600' }}>
          {libellesType[commentaire.type]}
        </Text>
      </View>
      {commentaire.titre ? (
        <Text
          style={{
            color: t.colors.text,
            fontSize: fontSize.lg,
            fontWeight: '700',
            marginTop: spacing.sm,
          }}>
          {commentaire.titre}
        </Text>
      ) : null}
      <Pressable onPress={() => router.push(`/reference/${encodeURIComponent(formaterReference(commentaire.reference))}`)}>
        <Text style={{ color: t.colors.accent, fontSize: fontSize.sm, fontWeight: '700', marginTop: 2 }}>
          {formaterReference(commentaire.reference)}
        </Text>
      </Pressable>
      <Text
        style={{
          color: t.colors.textMuted,
          fontSize: fontSize.md,
          lineHeight: 25,
          marginTop: spacing.md,
        }}>
        {commentaire.texte}
      </Text>
      {commentaire.position ? (
        <Text style={{ color: t.colors.textFaint, fontSize: fontSize.sm, marginTop: spacing.sm, fontStyle: 'italic' }}>
          Position défendue : {commentaire.position}
        </Text>
      ) : null}
      <LigneSource source={source} complement={localisation || undefined} />
    </View>
  );
}

export function CarteEntree({
  entree,
  compact,
}: {
  entree: EntreeDictionnaire;
  compact?: boolean;
}) {
  const t = useTheme();
  const router = useRouter();
  const sources = [...new Set(entree.definitions.map((d) => d.sourceId))]
    .map((id) => getSource(id))
    .filter((s): s is Source => Boolean(s));

  return (
    <Pressable
      onPress={() => router.push(`/dictionnaire/${entree.id}`)}
      style={({ pressed }) => ({
        backgroundColor: t.colors.surface,
        borderRadius: radius.lg,
        borderWidth: 1,
        borderColor: t.colors.border,
        padding: spacing.lg,
        marginBottom: spacing.md,
        opacity: pressed ? 0.8 : 1,
      })}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.sm }}>
        <BadgeNature nature="source-documentaire" />
        <Text style={{ color: t.colors.textFaint, fontSize: fontSize.xs }}>{entree.categorie}</Text>
      </View>
      <Text
        style={{
          color: t.colors.text,
          fontSize: fontSize.xl,
          fontWeight: '700',
          marginTop: spacing.sm,
        }}>
        {entree.terme}
      </Text>
      {entree.motsOriginaux.length > 0 ? (
        <Text style={{ color: t.colors.accent, fontSize: fontSize.md, marginTop: 2 }}>
          {entree.motsOriginaux
            .map((m) => `${m.mot} (${m.translitteration})`)
            .join(' · ')}
        </Text>
      ) : null}
      <Text
        numberOfLines={compact ? 3 : undefined}
        style={{
          color: t.colors.textMuted,
          fontSize: fontSize.md,
          lineHeight: 24,
          marginTop: spacing.sm,
        }}>
        {entree.definitions[0]?.texte}
      </Text>
      {sources.length > 1 ? (
        <Text style={{ color: t.colors.accent, fontSize: fontSize.xs, marginTop: spacing.sm, fontWeight: '700' }}>
          {sources.length} sources sur ce terme
        </Text>
      ) : (
        <LigneSource source={sources[0]} />
      )}
    </Pressable>
  );
}

export function CarteVersetResultat({
  libelle,
  texte,
  abreviation,
  onPress,
}: {
  libelle: string;
  texte: string;
  abreviation: string;
  onPress?: () => void;
}) {
  const t = useTheme();
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => ({
        backgroundColor: t.colors.surface,
        borderRadius: radius.lg,
        borderWidth: 1,
        borderColor: t.colors.border,
        padding: spacing.lg,
        marginBottom: spacing.md,
        opacity: pressed ? 0.8 : 1,
      })}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.sm }}>
        <BadgeNature nature="texte-biblique" />
        <Text style={{ color: t.colors.textFaint, fontSize: fontSize.xs, fontWeight: '700' }}>
          {abreviation}
        </Text>
      </View>
      <Text
        style={{
          color: t.colors.accent,
          fontSize: fontSize.sm,
          fontWeight: '700',
          marginTop: spacing.sm,
        }}>
        {libelle}
      </Text>
      <Text
        style={{
          color: t.colors.text,
          fontSize: fontSize.md,
          lineHeight: 25,
          marginTop: 4,
        }}>
        {texte}
      </Text>
    </Pressable>
  );
}


/**
 * Un conseil de méthode, avec l'ouvrage et le chapitre d'où il vient.
 *
 * Ce n'est ni le texte biblique ni une synthèse : c'est ce qu'un auteur écrit
 * sur la manière de lire. La pastille et l'attribution le disent explicitement.
 */
export function CarteConseil({ conseil }: { conseil: ConseilMethode }) {
  const t = useTheme();
  const source = getSource(conseil.sourceId);
  const localisation = [
    conseil.localisation?.chapitre ? `chap. ${conseil.localisation.chapitre}` : undefined,
    conseil.localisation?.section,
  ]
    .filter(Boolean)
    .join(', ');

  return (
    <View
      style={{
        backgroundColor: t.colors.surface,
        borderRadius: radius.lg,
        borderWidth: 1,
        borderColor: t.colors.border,
        padding: spacing.lg,
        marginBottom: spacing.md,
      }}>
      <BadgeNature nature="source-documentaire" />
      <Text
        style={{
          color: t.colors.text,
          fontSize: fontSize.md,
          fontWeight: '700',
          marginTop: spacing.sm,
        }}>
        {conseil.titre}
      </Text>
      <Text
        style={{
          color: t.colors.textMuted,
          fontSize: fontSize.sm,
          lineHeight: 23,
          marginTop: spacing.xs,
        }}>
        {conseil.texte}
      </Text>
      <LigneSource source={source} complement={localisation || undefined} />
    </View>
  );
}

/**
 * Les conseils d'un temps, repliés par défaut.
 *
 * Repliés parce qu'ils accompagnent le travail sans le précéder : on ouvre
 * quand on bloque, on referme quand on écrit.
 */
export function BlocConseils({
  conseils,
  titre,
}: {
  conseils: ConseilMethode[];
  titre: string;
}) {
  const t = useTheme();
  const [ouvert, setOuvert] = React.useState(false);
  if (conseils.length === 0) return null;

  return (
    <View style={{ marginBottom: spacing.lg }}>
      <Pressable
        onPress={() => setOuvert((o) => !o)}
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          backgroundColor: t.colors.surfaceAlt,
          borderRadius: radius.md,
          paddingVertical: spacing.md,
          paddingHorizontal: spacing.lg,
        }}>
        <Text
          style={{
            color: t.colors.text,
            fontSize: fontSize.sm,
            fontWeight: '700',
            flex: 1,
            paddingRight: spacing.md,
          }}>
          {titre} ({conseils.length})
        </Text>
        <Text style={{ color: t.colors.accent, fontSize: fontSize.sm, fontWeight: '700' }}>
          {ouvert ? 'Replier' : 'Ouvrir'}
        </Text>
      </Pressable>
      {ouvert ? (
        <View style={{ marginTop: spacing.md }}>
          {conseils.map((c) => (
            <CarteConseil key={c.id} conseil={c} />
          ))}
        </View>
      ) : null}
    </View>
  );
}
