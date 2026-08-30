import { useSyncExternalStore } from 'react';
import { Appearance } from 'react-native';

type SchemaSysteme = ReturnType<typeof Appearance.getColorScheme>;

/**
 * Le mode clair ou sombre réglé sur le téléphone.
 *
 * On n'utilise pas `useColorScheme` de React Native : sur le Web, sa mise en
 * place réabonne l'écouteur à chaque rendu, et le changement de réglage en
 * cours d'usage n'arrive pas jusqu'à l'application — vérifié au navigateur, le
 * fond restait sombre après le passage du système en clair. On s'abonne donc
 * directement à `Appearance`, qui est la même source sur toutes les
 * plateformes, par le mécanisme prévu pour lire une valeur extérieure à React.
 *
 * `lire` est appelée aussi bien au rendu qu'au premier rendu du serveur : elle
 * rend une chaîne, donc jamais un nouvel objet, et ne peut pas faire boucler le
 * rendu.
 */
function abonner(prevenir: () => void) {
  const abonnement = Appearance.addChangeListener(prevenir);
  return () => abonnement.remove();
}

function lire(): SchemaSysteme {
  return Appearance.getColorScheme();
}

export function useSchemaSysteme(): SchemaSysteme {
  return useSyncExternalStore(abonner, lire, lire);
}
