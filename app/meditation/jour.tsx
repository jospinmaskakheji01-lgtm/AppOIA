import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import React, { useEffect, useMemo, useState } from 'react';
import { Pressable, ScrollView, Share, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { LecteurPassage } from '../../src/components/lecteur-passage';
import { Bouton, Carte, Etiquette, Separateur, SousTitre } from '../../src/components/ui';
import {
  GENRES,
  MeditationQuotidienne,
  NOMBRE_DE_MEDITATIONS,
} from '../../src/data/meditation-quotidienne';
import {
  CleQuestionA,
  MOUVEMENTS_SIMPLIFIES,
  questionsA,
  questionsB,
} from '../../src/data/oia-simplifiee';
import {
  analyserReference,
  formaterReference,
  getPassage,
  ReferenceBiblique,
  versionsDisponibles,
} from '../../src/knowledge';
import { VersetTexte } from '../../src/knowledge/bible';
import { useApp } from '../../src/store/AppContext';
import { fontSize, radius, spacing } from '../../src/theme/theme';
import { dateLongue, salutation } from '../../src/utils/dates';

/**
 * La méditation du jour — à lire, pas à remplir.
 *
 * L'atelier OIA simplifié demande à l'utilisateur de répondre lui-même aux
 * questions. C'est la bonne manière, et elle reste disponible. Mais elle
 * suppose du temps, une méthode acquise, et un matin où l'on n'est pas déjà en
 * retard. Cet écran-ci est l'autre entrée : les mêmes questions, dans le même
 * ordre, déjà travaillées. On ouvre, on lit, on prie, on sort.
 *
 * Le texte biblique n'est pas recopié dans la méditation : il est lu dans la
 * version installée, et affiché ici. Ce qui vient de la Bible et ce qui vient
 * de l'application ne se mélangent donc jamais — c'est la règle de toute
 * l'application, et elle vaut d'autant plus ici que le lecteur ne fournit rien.
 */

/**
 * Ce que chaque question A cherche, dit en un groupe nominal.
 *
 * Sert à énoncer ce que le passage ne contient pas. Recopier la question elle-
 * même donnerait « ce passage ne répond pas à : y a-t-il un ordre auquel
 * obéir ? », qui ne se lit pas.
 */
const CHERCHE: Record<CleQuestionA, string> = {
  sujet: 'sujet',
  trinite: 'révélation sur Dieu',
  exemple: 'exemple à suivre ou à fuir',
  ordre: 'ordre à recevoir',
  promesse: 'promesse',
  avertissement: 'avertissement',
  verite: 'vérité à retenir',
  passages: 'renvoi à d’autres passages',
};

/**
 * « ne contient pas d'ordre à recevoir », « ne contient ni promesse ni
 * avertissement ». Le partitif tombe après « ni », ce qui évite l'élision ;
 * au singulier il reste, et il faut alors élider devant une voyelle.
 */
function enumererAbsences(cles: CleQuestionA[]): string {
  const noms = cles.map((c) => CHERCHE[c]);
  if (noms.length === 1) {
    const de = /^[aeéèêiouyh]/i.test(noms[0]) ? `d’${noms[0]}` : `de ${noms[0]}`;
    return `ne contient pas ${de}`;
  }
  return `ne contient ni ${noms.join(' ni ')}`;
}

/** « 14-15 » quand la version rend plusieurs versets d'un seul tenant. */
function numerote(v: VersetTexte): string {
  return v.versetFin && v.versetFin > v.verset ? `${v.verset}-${v.versetFin}` : String(v.verset);
}

function BlocPassage({ reference }: { reference: ReferenceBiblique }) {
  const { theme: t, etat } = useApp();
  const versions = useMemo(() => versionsDisponibles(), []);
  const echelle = etat.reglages.tailleTexte;

  // La version préférée d'abord ; à défaut, la première qui couvre le passage.
  const { versets, version } = useMemo(() => {
    const preferee = versions.find((v) => v.id === etat.reglages.versionPreferee);
    for (const v of [preferee, ...versions].filter(Boolean)) {
      const p = getPassage(v!.id, reference);
      if (p.length > 0) return { versets: p, version: v! };
    }
    return { versets: [] as VersetTexte[], version: undefined };
  }, [versions, etat.reglages.versionPreferee, reference.livre, reference.chapitre, reference.verset]);

  if (versets.length === 0) {
    return (
      <SousTitre>
        Aucune version installée ne contient {formaterReference(reference)}.
      </SousTitre>
    );
  }

  return (
    <View>
      <Text
        style={{
          color: t.colors.textFaint,
          fontSize: fontSize.xs,
          fontWeight: '800',
          letterSpacing: 1,
          marginBottom: spacing.sm,
        }}>
        {formaterReference(reference).toUpperCase()} · {version?.abreviation}
      </Text>
      {versets.map((v) => (
        <View key={`${v.chapitre}-${v.verset}`} style={{ flexDirection: 'row', gap: spacing.sm, marginBottom: spacing.sm }}>
          <Text
            style={{
              color: t.colors.accent,
              fontSize: fontSize.xs * echelle,
              fontWeight: '800',
              minWidth: 24,
              paddingTop: 3,
            }}>
            {numerote(v)}
          </Text>
          <Text
            style={{
              color: t.colors.text,
              fontSize: fontSize.md * echelle,
              lineHeight: 26 * echelle,
              flex: 1,
            }}>
            {v.texte}
          </Text>
        </View>
      ))}
    </View>
  );
}

/** Un mouvement de la méthode : son titre, sa consigne, et ce qui a été préparé. */
function Mouvement({ cle, children }: { cle: 'mediter' | 'prier' | 'obeir'; children: React.ReactNode }) {
  const { theme: t } = useApp();
  const m = MOUVEMENTS_SIMPLIFIES.find((x) => x.cle === cle)!;
  return (
    <View style={{ marginTop: spacing.xl }}>
      <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: spacing.sm }}>
        <Text style={{ color: t.colors.primary, fontSize: fontSize.xxl, fontWeight: '800' }}>
          {m.titre}
        </Text>
        <Text style={{ color: t.colors.textFaint, fontSize: fontSize.sm, flex: 1 }}>
          {m.consigne}
        </Text>
      </View>
      <View style={{ marginTop: spacing.md }}>{children}</View>
    </View>
  );
}

function QuestionRepondue({ question, reponse }: { question: string; reponse: string }) {
  const { theme: t } = useApp();
  return (
    <View style={{ marginBottom: spacing.lg }}>
      <Text
        style={{
          color: t.colors.textMuted,
          fontSize: fontSize.sm,
          lineHeight: 21,
          fontWeight: '700',
        }}>
        {question}
      </Text>
      <Text
        style={{
          color: t.colors.text,
          fontSize: fontSize.md,
          lineHeight: 25,
          marginTop: 4,
        }}>
        {reponse}
      </Text>
    </View>
  );
}

export default function MeditationDuJour() {
  const { theme: t, etat, meditationDuJour, fixerMeditationDuJour, marquerMeditationLue } = useApp();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [lecture, setLecture] = useState<number | undefined>();

  const m: MeditationQuotidienne = meditationDuJour;

  // Fixer la méditation du jour dès l'ouverture : à partir de maintenant, c'est
  // celle-ci pour aujourd'hui, même après l'avoir lue.
  useEffect(() => {
    fixerMeditationDuJour();
  }, [fixerMeditationDuJour]);

  const references = useMemo(
    () => m.references.map((r) => analyserReference(r)).filter((r): r is ReferenceBiblique => Boolean(r)),
    [m.id],
  );
  const versetAEmporter = useMemo(() => analyserReference(m.versetAEmporter), [m.id]);
  const lue = etat.meditationsLues.includes(m.id);
  const rang = etat.meditationsLues.length + (lue ? 0 : 1);

  const partager = () => {
    const corps = [
      `${m.titre} — ${m.references.join(' ; ')}`,
      '',
      m.situation,
      '',
      'MÉDITEZ',
      ...questionsA.filter((q) => m.mediter[q.cle]).map((q) => `• ${q.question}\n${m.mediter[q.cle]}`),
      '',
      `Verset à emporter : ${m.versetAEmporter}`,
      '',
      'PRIEZ',
      ...questionsB
        .filter((q) => q.cle !== 'versetInterpellant' && m.prier[q.cle as keyof typeof m.prier])
        .map((q) => m.prier[q.cle as keyof typeof m.prier]),
      '',
      `OBÉISSEZ\n${m.obeir}`,
    ].join('\n');
    Share.share({ message: `${corps}\n\nLumière — méditation du jour` }).catch(() => {});
  };

  const achever = () => {
    marquerMeditationLue(m.id);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
  };

  return (
    <View style={{ flex: 1, backgroundColor: t.colors.background }}>
      <ScrollView
        contentContainerStyle={{
          padding: spacing.lg,
          paddingTop: insets.top + spacing.lg,
          paddingBottom: insets.bottom + spacing.xxxl * 2,
        }}
        showsVerticalScrollIndicator={false}>
        <Pressable onPress={() => router.back()} hitSlop={10}>
          <Text style={{ color: t.colors.textFaint, fontSize: fontSize.sm }}>‹ Retour</Text>
        </Pressable>

        <Etiquette>
          {salutation()} · {dateLongue()}
        </Etiquette>
        <Text
          style={{
            color: t.colors.text,
            fontSize: fontSize.title,
            fontWeight: '700',
            marginTop: spacing.xs,
          }}>
          {m.titre}
        </Text>
        <SousTitre style={{ marginTop: 2 }}>
          {GENRES[m.genre].titre} · {m.references.join(' ; ')} · méditation {rang} sur{' '}
          {NOMBRE_DE_MEDITATIONS}
        </SousTitre>

        <Carte accent style={{ marginTop: spacing.lg }}>
          <Text style={{ color: t.colors.text, fontSize: fontSize.md, lineHeight: 25 }}>
            {m.situation}
          </Text>
        </Carte>

        <Separateur label="Le texte" />
        {references.map((r, i) => (
          <View key={i} style={{ marginBottom: spacing.lg }}>
            <BlocPassage reference={r} />
          </View>
        ))}
        {references.length > 0 ? (
          <Pressable onPress={() => setLecture(0)} hitSlop={6}>
            <Text style={{ color: t.colors.primary, fontSize: fontSize.sm, fontWeight: '700' }}>
              Ouvrir le passage en entier →
            </Text>
          </Pressable>
        ) : null}

        <Mouvement cle="mediter">
          {questionsA.map((q) =>
            m.mediter[q.cle] ? (
              <QuestionRepondue key={q.cle} question={q.question} reponse={m.mediter[q.cle]!} />
            ) : null,
          )}
          {/* Les questions sans réponse ne sont pas cachées : leur silence est
              une réponse, et la méthode les marque facultatives pour cela. */}
          {questionsA.some((q) => !m.mediter[q.cle]) ? (
            <Text
              style={{
                color: t.colors.textFaint,
                fontSize: fontSize.xs,
                lineHeight: 18,
                fontStyle: 'italic',
              }}>
              Ce passage{' '}
              {enumererAbsences(questionsA.filter((q) => !m.mediter[q.cle]).map((q) => q.cle))}. Le
              silence du texte est une réponse : mieux vaut ne rien dire que de lui faire dire.
            </Text>
          ) : null}
        </Mouvement>

        <Separateur label="Le verset à emporter" />
        <Pressable
          onPress={() => {
            const i = references.findIndex((r) => r.livre === versetAEmporter?.livre);
            setLecture(i >= 0 ? i : 0);
          }}
          style={{
            padding: spacing.lg,
            borderRadius: radius.lg,
            backgroundColor: t.colors.primary,
          }}>
          <Text style={{ color: '#FFFFFF', fontSize: fontSize.xs, fontWeight: '800', letterSpacing: 1 }}>
            {m.versetAEmporter.toUpperCase()}
          </Text>
          {versetAEmporter ? (
            <View style={{ marginTop: spacing.sm }}>
              <TexteDuVerset reference={versetAEmporter} />
            </View>
          ) : null}
        </Pressable>

        <Mouvement cle="prier">
          {questionsB
            .filter((q) => q.cle !== 'versetInterpellant')
            .map((q) => {
              const texte = m.prier[q.cle as keyof typeof m.prier];
              return texte ? (
                <QuestionRepondue key={q.cle} question={q.question} reponse={texte} />
              ) : null;
            })}
        </Mouvement>

        <Mouvement cle="obeir">
          <Carte>
            <Text style={{ color: t.colors.text, fontSize: fontSize.md, lineHeight: 25 }}>
              {m.obeir}
            </Text>
          </Carte>
          <SousTitre style={{ marginTop: spacing.sm }}>
            {MOUVEMENTS_SIMPLIFIES.find((x) => x.cle === 'obeir')!.detail}
          </SousTitre>
        </Mouvement>

        <Separateur />
        <Bouton
          titre={lue ? 'Méditation lue' : 'J’ai médité aujourd’hui'}
          onPress={achever}
          desactive={lue}
        />
        <Bouton
          titre="Partager cette méditation"
          variante="secondaire"
          onPress={partager}
          style={{ marginTop: spacing.sm }}
        />
        <Bouton
          titre="La faire moi-même, avec la méthode"
          variante="discret"
          onPress={() => router.push('/oia/nouvelle?methode=simplifiee')}
          style={{ marginTop: spacing.sm }}
        />
        <SousTitre style={{ marginTop: spacing.lg, textAlign: 'center' }}>
          Méditation préparée d’après la méthode OIA simplifiée de l’École d’Apollos. Le texte
          biblique est celui de la version installée.
        </SousTitre>
      </ScrollView>

      <LecteurPassage
        references={references}
        depart={lecture}
        onFermer={() => setLecture(undefined)}
      />
    </View>
  );
}

/** Le texte du verset à emporter, sur la carte colorée. */
function TexteDuVerset({ reference }: { reference: ReferenceBiblique }) {
  const { etat } = useApp();
  const versions = useMemo(() => versionsDisponibles(), []);
  const texte = useMemo(() => {
    const preferee = versions.find((v) => v.id === etat.reglages.versionPreferee);
    for (const v of [preferee, ...versions].filter(Boolean)) {
      const p = getPassage(v!.id, reference);
      if (p.length > 0) return p.map((x) => x.texte).join(' ');
    }
    return '';
  }, [versions, etat.reglages.versionPreferee, reference.livre, reference.chapitre, reference.verset]);
  if (!texte) return null;
  return (
    <Text style={{ color: '#FFFFFF', fontSize: fontSize.lg, lineHeight: 27, fontWeight: '600' }}>
      « {texte} »
    </Text>
  );
}
