import React, { useMemo, useState } from 'react';
import { Pressable, Text, TextInput, View } from 'react-native';

import { Puce } from './ui';
import {
  concordance,
  formaterReference,
  passagesDuReleve,
  ReferenceBiblique,
  versionsDisponibles,
} from '../knowledge';
import { useApp } from '../store/AppContext';
import { fontSize, radius, spacing } from '../theme/theme';

/**
 * Où le nom apparaît dans la Bible.
 *
 * « Cherchez son nom dans toute la Bible et notez chaque référence » : c'est la
 * deuxième étape de l'étude de personnages, et c'est là que l'étude s'arrêtait,
 * faute de concordance. On la donne donc ici, dans l'étape elle-même.
 *
 * Le relevé n'est jamais tronqué à un nombre de résultats : une liste de
 * passages amputée fausse tout ce qui suit, et l'étape suivante avertit déjà
 * qu'« une vie étudiée sur les seuls passages flatteurs n'est plus une vie ».
 * Il ne dit pourtant que où le nom paraît : un texte qui parle du sujet sans le
 * nommer lui échappe, et c'est la question que l'étape pose par ailleurs.
 *
 * On affiche les livres et leurs comptes avant les versets : c'est la forme
 * qu'a la réponse à la question posée à cette étape — « dans quels livres
 * apparaît-il ? » — et elle tient à l'écran, ce que soixante-douze versets ne
 * feraient pas.
 */
export function Concordance({
  sujet,
  onLire,
  onAjouter,
}: {
  /** Le sujet de l'étude, qui préremplit la recherche. */
  sujet: string;
  /** Ouvrir un passage à la lecture, sans quitter l'étape. */
  onLire: (ref: ReferenceBiblique) => void;
  /** Reporter les références trouvées dans la réponse de l'étape. */
  onAjouter: (texte: string) => void;
}) {
  const { theme: t, etat, majReglages } = useApp();
  const [mot, setMot] = useState(sujet);
  const [deplie, setDeplie] = useState<string | undefined>();

  const versions = useMemo(() => versionsDisponibles(), []);
  const version =
    versions.find((v) => v.id === etat.reglages.versionPreferee) ?? versions[0];

  const releve = useMemo(
    () => (version ? concordance(mot, version.id) : undefined),
    [mot, version?.id],
  );

  const terme = mot.trim();

  return (
    <View
      style={{
        marginTop: spacing.lg,
        padding: spacing.lg,
        borderRadius: radius.lg,
        borderWidth: 1,
        borderColor: t.colors.border,
        backgroundColor: t.colors.surface,
      }}>
      <Text
        style={{
          color: t.colors.textFaint,
          fontSize: fontSize.xs,
          fontWeight: '800',
          letterSpacing: 1.1,
          textTransform: 'uppercase',
        }}>
        Chercher dans la Bible
      </Text>

      <TextInput
        value={mot}
        onChangeText={setMot}
        placeholder="Un nom, un mot…"
        placeholderTextColor={t.colors.textFaint}
        autoCorrect={false}
        style={{
          backgroundColor: t.colors.surfaceAlt,
          borderRadius: radius.md,
          paddingHorizontal: spacing.lg,
          paddingVertical: spacing.md,
          marginTop: spacing.md,
          color: t.colors.text,
          fontSize: fontSize.md,
        }}
      />

      {versions.length > 1 ? (
        <View
          style={{
            flexDirection: 'row',
            flexWrap: 'wrap',
            gap: spacing.sm,
            marginTop: spacing.md,
          }}>
          {versions.map((v) => (
            <Puce
              key={v.id}
              texte={v.abreviation}
              actif={v.id === version?.id}
              onPress={() => majReglages({ versionPreferee: v.id })}
            />
          ))}
        </View>
      ) : null}

      {/* Une version partielle ne peut pas rendre un relevé complet : le dire
          vaut mieux que de laisser croire que le nom n'est nulle part ailleurs. */}
      {version?.couverture === 'partielle' ? (
        <Text
          style={{
            color: t.colors.accent,
            fontSize: fontSize.xs,
            lineHeight: 17,
            marginTop: spacing.md,
          }}>
          {version.nom} ne couvre qu’une partie de la Bible : le relevé ne vaut que pour les
          livres qu’elle contient.
        </Text>
      ) : null}

      {!terme ? null : !releve || releve.total === 0 ? (
        <Text
          style={{ color: t.colors.textMuted, fontSize: fontSize.sm, marginTop: spacing.lg }}>
          « {terme} » n’apparaît dans aucun verset de {version?.nom ?? 'cette version'}.
        </Text>
      ) : (
        <>
          <Text
            style={{
              color: t.colors.text,
              fontSize: fontSize.sm,
              lineHeight: 21,
              marginTop: spacing.lg,
            }}>
            <Text style={{ fontWeight: '800' }}>{releve.total} versets</Text> dans{' '}
            <Text style={{ fontWeight: '800' }}>{releve.livres.length} livres</Text>. Touchez un
            livre pour voir ses versets, un verset pour le lire.
          </Text>

          <View style={{ marginTop: spacing.md, gap: spacing.sm }}>
            {releve.livres.map((l) => {
              const ouvert = deplie === l.livre;
              return (
                <View key={l.livre}>
                  <Pressable
                    onPress={() => setDeplie(ouvert ? undefined : l.livre)}
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      paddingVertical: spacing.sm,
                      paddingHorizontal: spacing.md,
                      borderRadius: radius.md,
                      backgroundColor: ouvert ? t.colors.primarySoft : t.colors.surfaceAlt,
                    }}>
                    <Text
                      style={{ color: t.colors.text, fontSize: fontSize.sm, fontWeight: '700' }}>
                      {l.livre}
                    </Text>
                    <Text style={{ color: t.colors.textMuted, fontSize: fontSize.xs }}>
                      {l.versets.length} verset{l.versets.length > 1 ? 's' : ''}
                    </Text>
                  </Pressable>

                  {ouvert ? (
                    <View style={{ paddingTop: spacing.sm, gap: spacing.sm }}>
                      {l.versets.map((v) => (
                        <Pressable
                          key={`${v.chapitre}-${v.verset}`}
                          onPress={() =>
                            onLire({ livre: v.livre, chapitre: v.chapitre, verset: v.verset })
                          }
                          style={{ paddingVertical: 4 }}>
                          <Text
                            style={{
                              color: t.colors.accent,
                              fontSize: fontSize.xs,
                              fontWeight: '800',
                            }}>
                            {v.livre} {v.chapitre}:{v.verset}
                          </Text>
                          <Text
                            style={{
                              color: t.colors.textMuted,
                              fontSize: fontSize.sm,
                              lineHeight: 20,
                            }}
                            numberOfLines={2}>
                            {v.texte}
                          </Text>
                        </Pressable>
                      ))}
                    </View>
                  ) : null}
                </View>
              );
            })}
          </View>

          {/* Chaque référence est écrite en entier, livre compris : c'est ce
              qui permet à l'application de les relire ensuite, et de les
              proposer à la lecture aux étapes suivantes. */}
          <Pressable
            onPress={() =>
              onAjouter(
                releve.livres
                  .map((l) =>
                    passagesDuReleve({ ...releve, livres: [l] })
                      .map(formaterReference)
                      .join(', '),
                  )
                  .join('\n'),
              )
            }
            style={{
              marginTop: spacing.lg,
              alignItems: 'center',
              paddingVertical: spacing.md,
              borderRadius: radius.md,
              borderWidth: 1,
              borderColor: t.colors.primary,
            }}>
            <Text style={{ color: t.colors.primary, fontSize: fontSize.sm, fontWeight: '700' }}>
              Reporter ces références dans ma réponse
            </Text>
          </Pressable>
        </>
      )}
    </View>
  );
}
