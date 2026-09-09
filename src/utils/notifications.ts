import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

import { meditationAuRang, NOMBRE_DE_MEDITATIONS } from '../data/meditation-quotidienne';

/**
 * Le rappel du matin.
 *
 * Une notification quotidienne posée une fois pour toutes garderait le même
 * texte à jamais : le système répète ce qu'on lui a donné le jour où on l'a
 * programmée. Or le rappel doit annoncer la méditation du jour, qui change.
 *
 * On programme donc une série de rendez-vous datés, un par jour, chacun portant
 * le titre de la méditation qui viendra ce jour-là. La série est reprogrammée à
 * chaque ouverture de l'application : si l'utilisateur a sauté ou avancé des
 * jours, les annonces se remettent d'aplomb toutes seules.
 */

/** Combien de jours d'avance. Au-delà, l'utilisateur aura rouvert l'application. */
const JOURS_PROGRAMMES = 30;
const PREFIXE = 'meditation-jour-';
/** L'ancien identifiant unique, à annuler chez ceux qui viennent d'une version précédente. */
export const IDENTIFIANT_RAPPEL = 'rappel-quotidien';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

export async function demanderPermission(): Promise<boolean> {
  if (!Device.isDevice) return false;
  const { status } = await Notifications.getPermissionsAsync();
  if (status === 'granted') return true;
  const demande = await Notifications.requestPermissionsAsync();
  return demande.status === 'granted';
}

/** Le premier rendez-vous : aujourd'hui si l'heure n'est pas passée, sinon demain. */
function premierRendezVous(h: number, m: number): Date {
  const quand = new Date();
  quand.setHours(h, m, 0, 0);
  if (quand.getTime() <= Date.now() + 60_000) quand.setDate(quand.getDate() + 1);
  return quand;
}

/**
 * (Re)programme les rappels à l'heure « HH:MM », à partir du rang atteint.
 *
 * `rangDepart` est le nombre de méditations déjà lues : la première annonce
 * porte donc sur celle qui vient, et les suivantes sur la suite du parcours,
 * en supposant une par jour.
 */
export async function programmerRappel(heure: string, rangDepart = 0): Promise<boolean> {
  const autorise = await demanderPermission();
  if (!autorise) return false;

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('rappels', {
      name: 'Méditation du matin',
      importance: Notifications.AndroidImportance.DEFAULT,
      lightColor: '#D9A441',
    });
  }

  await annulerRappel();

  const [hBrut, mBrut] = heure.split(':').map(Number);
  const h = Number.isFinite(hBrut) ? hBrut : 7;
  const m = Number.isFinite(mBrut) ? mBrut : 0;
  const debut = premierRendezVous(h, m);

  for (let i = 0; i < JOURS_PROGRAMMES; i++) {
    const quand = new Date(debut);
    quand.setDate(debut.getDate() + i);
    const meditation = meditationAuRang(rangDepart + i);
    await Notifications.scheduleNotificationAsync({
      identifier: `${PREFIXE}${i}`,
      content: {
        title: 'Votre méditation du jour',
        body: `${meditation.titre} — ${meditation.references.join(' ; ')}`,
        data: { route: '/meditation/jour' },
      },
      trigger: { type: Notifications.SchedulableTriggerInputTypes.DATE, date: quand },
    });
  }
  return true;
}

export async function annulerRappel(): Promise<void> {
  try {
    await Notifications.cancelScheduledNotificationAsync(IDENTIFIANT_RAPPEL);
  } catch {
    // Rien à annuler : l'application n'a jamais programmé ce rappel-ci.
  }
  for (let i = 0; i < JOURS_PROGRAMMES; i++) {
    try {
      await Notifications.cancelScheduledNotificationAsync(`${PREFIXE}${i}`);
    } catch {
      // Ce rendez-vous n'existait pas : il n'y a rien à faire.
    }
  }
}

/** Le nombre de méditations du parcours, pour l'afficher là où on l'annonce. */
export { NOMBRE_DE_MEDITATIONS };
