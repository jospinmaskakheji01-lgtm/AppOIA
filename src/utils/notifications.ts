import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

import { versetDuJour } from '../data/versets';

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

/** (Re)programme le rappel quotidien à l'heure « HH:MM ». */
export async function programmerRappel(heure: string): Promise<boolean> {
  const autorise = await demanderPermission();
  if (!autorise) return false;

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('rappels', {
      name: 'Rappels quotidiens',
      importance: Notifications.AndroidImportance.DEFAULT,
      lightColor: '#D9A441',
    });
  }

  await annulerRappel();

  const [h, m] = heure.split(':').map(Number);
  const verset = versetDuJour();

  await Notifications.scheduleNotificationAsync({
    identifier: IDENTIFIANT_RAPPEL,
    content: {
      title: 'Votre temps avec Dieu',
      body: `${verset.ref} — « ${verset.texte.slice(0, 90)}… »`,
      data: { route: '/' },
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DAILY,
      hour: Number.isFinite(h) ? h : 7,
      minute: Number.isFinite(m) ? m : 0,
    },
  });
  return true;
}

export async function annulerRappel(): Promise<void> {
  try {
    await Notifications.cancelScheduledNotificationAsync(IDENTIFIANT_RAPPEL);
  } catch {
    // Aucun rappel programmé : rien à annuler.
  }
}
