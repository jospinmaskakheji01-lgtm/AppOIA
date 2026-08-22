/**
 * Mise en forme des nombres pour l'affichage.
 *
 * L'application compte maintenant en dizaines de milliers de versets :
 * « 31102 » se lit mal, « 31 102 » se lit d'un coup d'œil. L'espace est une
 * espace insécable étroite, celle que l'usage français demande entre les
 * groupes de chiffres, pour que le nombre ne se coupe jamais en fin de ligne.
 */
export function nombre(valeur: number | undefined): string {
  return String(valeur ?? 0).replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
}
