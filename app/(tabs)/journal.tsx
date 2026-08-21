import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, Pressable, ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { IconeCoche } from '../../src/components/icons';
import {
  Bouton,
  Carte,
  Etiquette,
  Puce,
  Separateur,
  SousTitre,
  Titre,
} from '../../src/components/ui';
import { useApp } from '../../src/store/AppContext';
import { fontSize, radius, spacing } from '../../src/theme/theme';
import { dateCourte } from '../../src/utils/dates';

type Onglet = 'journal' | 'prieres';

export default function Journal() {
  const { theme: t, etat, supprimerEntree, basculerExauce, supprimerPriere } = useApp();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [onglet, setOnglet] = useState<Onglet>('journal');

  const enAttente = etat.prieres.filter((p) => !p.exauce);
  const exaucees = etat.prieres.filter((p) => p.exauce);

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: t.colors.background }}
      contentContainerStyle={{
        padding: spacing.lg,
        paddingTop: insets.top + spacing.md,
        paddingBottom: spacing.xxxl * 2,
      }}
      showsVerticalScrollIndicator={false}>
      <Etiquette>Ce que vous gardez</Etiquette>
      <Titre style={{ marginTop: spacing.sm }}>Journal</Titre>

      <View style={{ flexDirection: 'row', gap: spacing.sm, marginTop: spacing.lg }}>
        <Puce texte="Méditations" actif={onglet === 'journal'} onPress={() => setOnglet('journal')} />
        <Puce
          texte={`Prières (${enAttente.length})`}
          actif={onglet === 'prieres'}
          onPress={() => setOnglet('prieres')}
        />
      </View>

      {onglet === 'journal' ? (
        <>
          <Bouton
            titre="Écrire une entrée"
            onPress={() => router.push('/journal/nouvelle')}
            style={{ marginTop: spacing.lg }}
          />
          {etat.journal.length === 0 ? (
            <Carte accent style={{ marginTop: spacing.xl }}>
              <Text style={{ color: t.colors.text, fontSize: fontSize.lg, lineHeight: 26 }}>
                Écrire ce que l’on comprend d’un texte, c’est déjà l’habiter.
              </Text>
              <SousTitre style={{ marginTop: spacing.md }}>
                Notez une phrase qui vous a arrêté, une question restée ouverte, une prière
                exaucée. Dans un an, ces pages seront un témoignage.
              </SousTitre>
            </Carte>
          ) : null}

          {etat.journal.map((e) => (
            <Carte key={e.id} style={{ marginTop: spacing.md }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <Text style={{ color: t.colors.textFaint, fontSize: fontSize.xs }}>
                  {dateCourte(e.date.slice(0, 10))}
                  {e.humeur ? ` · ${e.humeur}` : ''}
                </Text>
                <Pressable
                  onPress={() =>
                    Alert.alert('Supprimer cette entrée ?', 'Cette action est définitive.', [
                      { text: 'Annuler', style: 'cancel' },
                      { text: 'Supprimer', style: 'destructive', onPress: () => supprimerEntree(e.id) },
                    ])
                  }>
                  <Text style={{ color: t.colors.textFaint, fontSize: fontSize.xs }}>Supprimer</Text>
                </Pressable>
              </View>
              {e.titre ? (
                <Text
                  style={{
                    color: t.colors.text,
                    fontSize: fontSize.lg,
                    fontWeight: '700',
                    marginTop: spacing.sm,
                  }}>
                  {e.titre}
                </Text>
              ) : null}
              {e.reference ? (
                <Text style={{ color: t.colors.accent, fontSize: fontSize.sm, marginTop: 2 }}>
                  {e.reference}
                </Text>
              ) : null}
              <Text
                style={{
                  color: t.colors.textMuted,
                  fontSize: fontSize.md,
                  lineHeight: 24,
                  marginTop: spacing.sm,
                }}>
                {e.texte}
              </Text>
            </Carte>
          ))}
        </>
      ) : (
        <>
          <Bouton
            titre="Ajouter un sujet de prière"
            onPress={() => router.push('/prieres')}
            style={{ marginTop: spacing.lg }}
          />

          {etat.prieres.length === 0 ? (
            <Carte accent style={{ marginTop: spacing.xl }}>
              <Text style={{ color: t.colors.text, fontSize: fontSize.lg, lineHeight: 26 }}>
                « Persévérez dans la prière. »
              </Text>
              <SousTitre style={{ marginTop: spacing.md }}>
                Notez vos sujets ici. Quand une prière est exaucée, marquez-la : la mémoire
                des réponses nourrit la foi.
              </SousTitre>
            </Carte>
          ) : null}

          {enAttente.length > 0 ? <Separateur label="En prière" /> : null}
          {enAttente.map((p) => (
            <LignePriere
              key={p.id}
              texte={p.texte}
              categorie={p.categorie}
              date={p.cree}
              exauce={false}
              onBasculer={() => basculerExauce(p.id)}
              onSupprimer={() => supprimerPriere(p.id)}
            />
          ))}

          {exaucees.length > 0 ? <Separateur label="Exaucées" /> : null}
          {exaucees.map((p) => (
            <LignePriere
              key={p.id}
              texte={p.texte}
              categorie={p.categorie}
              date={p.exauce!}
              exauce
              onBasculer={() => basculerExauce(p.id)}
              onSupprimer={() => supprimerPriere(p.id)}
            />
          ))}
        </>
      )}
    </ScrollView>
  );
}

function LignePriere({
  texte,
  categorie,
  date,
  exauce,
  onBasculer,
  onSupprimer,
}: {
  texte: string;
  categorie: string;
  date: string;
  exauce: boolean;
  onBasculer: () => void;
  onSupprimer: () => void;
}) {
  const { theme: t } = useApp();
  return (
    <Carte style={{ marginTop: spacing.sm }}>
      <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: spacing.md }}>
        <Pressable
          onPress={onBasculer}
          hitSlop={8}
          style={{
            width: 26,
            height: 26,
            borderRadius: 13,
            borderWidth: 1.5,
            borderColor: exauce ? t.colors.success : t.colors.border,
            backgroundColor: exauce ? t.colors.success : 'transparent',
            alignItems: 'center',
            justifyContent: 'center',
            marginTop: 2,
          }}>
          {exauce ? <IconeCoche couleur={t.colors.surface} taille={16} /> : null}
        </Pressable>
        <View style={{ flex: 1 }}>
          <Text
            style={{
              color: exauce ? t.colors.textFaint : t.colors.text,
              fontSize: fontSize.md,
              lineHeight: 23,
              textDecorationLine: exauce ? 'line-through' : 'none',
            }}>
            {texte}
          </Text>
          <View style={{ flexDirection: 'row', gap: spacing.sm, marginTop: spacing.sm, alignItems: 'center' }}>
            <View
              style={{
                backgroundColor: t.colors.surfaceAlt,
                borderRadius: radius.pill,
                paddingVertical: 2,
                paddingHorizontal: spacing.sm + 2,
              }}>
              <Text style={{ color: t.colors.textFaint, fontSize: fontSize.xs }}>{categorie}</Text>
            </View>
            <Text style={{ color: t.colors.textFaint, fontSize: fontSize.xs }}>
              {exauce ? 'exaucée le ' : ''}
              {dateCourte(date.slice(0, 10))}
            </Text>
            <Pressable onPress={onSupprimer} hitSlop={8}>
              <Text style={{ color: t.colors.textFaint, fontSize: fontSize.xs }}>· retirer</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Carte>
  );
}
