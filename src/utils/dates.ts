/** Utilitaires de date, tout en heure locale de l'appareil. */

export function cleJour(date: Date = new Date()): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function dateDepuisCle(cle: string): Date {
  const [y, m, d] = cle.split('-').map(Number);
  return new Date(y, m - 1, d);
}

export function veille(cle: string): string {
  const d = dateDepuisCle(cle);
  d.setDate(d.getDate() - 1);
  return cleJour(d);
}

const JOURS = ['dimanche', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi'];
const MOIS = [
  'janvier', 'février', 'mars', 'avril', 'mai', 'juin',
  'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre',
];

export function dateLongue(date: Date = new Date()): string {
  return `${JOURS[date.getDay()]} ${date.getDate()} ${MOIS[date.getMonth()]}`;
}

export function dateCourte(cle: string): string {
  const d = dateDepuisCle(cle);
  return `${d.getDate()} ${MOIS[d.getMonth()]} ${d.getFullYear()}`;
}

export function salutation(date: Date = new Date()): string {
  const h = date.getHours();
  if (h < 6) return 'Belle veillée';
  if (h < 12) return 'Bonjour';
  if (h < 18) return 'Bel après-midi';
  return 'Bonsoir';
}

/**
 * Calcule la série de jours consécutifs terminant aujourd'hui ou hier.
 * Une série reste « vivante » tant que la veille est présente.
 */
export function calculerSerie(joursTermines: string[]): number {
  if (joursTermines.length === 0) return 0;
  const set = new Set(joursTermines);
  const aujourdhui = cleJour();
  let curseur = set.has(aujourdhui) ? aujourdhui : veille(aujourdhui);
  if (!set.has(curseur)) return 0;
  let serie = 0;
  while (set.has(curseur)) {
    serie += 1;
    curseur = veille(curseur);
  }
  return serie;
}

export function formaterDuree(secondes: number): string {
  const m = Math.floor(secondes / 60);
  const s = Math.floor(secondes % 60);
  return `${m}:${String(s).padStart(2, '0')}`;
}
