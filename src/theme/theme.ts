/**
 * Palette et tokens de design de Lumière.
 * Deux ambiances : « aube » (clair) et « veillée » (sombre, pour la prière du soir).
 */

export type ThemeName = 'aube' | 'veillee';

export interface Theme {
  name: ThemeName;
  dark: boolean;
  colors: {
    background: string;
    surface: string;
    surfaceAlt: string;
    border: string;
    text: string;
    textMuted: string;
    textFaint: string;
    primary: string;
    primarySoft: string;
    onPrimary: string;
    accent: string;
    accentSoft: string;
    success: string;
    danger: string;
    overlay: string;
    gradient: [string, string];
    verseGradient: [string, string];
  };
}

export const aube: Theme = {
  name: 'aube',
  dark: false,
  colors: {
    background: '#FBF7F0',
    surface: '#FFFFFF',
    surfaceAlt: '#F3ECE1',
    border: '#E7DCCB',
    text: '#241F2E',
    textMuted: '#5C5468',
    textFaint: '#8E8698',
    primary: '#3E3A72',
    primarySoft: '#E6E3F5',
    onPrimary: '#FFFFFF',
    accent: '#B9863B',
    accentSoft: '#F6EAD3',
    success: '#3F7D54',
    danger: '#A8443C',
    overlay: 'rgba(27,27,58,0.45)',
    gradient: ['#3E3A72', '#6B5FA8'],
    verseGradient: ['#2F2B5C', '#5A4C8C'],
  },
};

export const veillee: Theme = {
  name: 'veillee',
  dark: true,
  colors: {
    background: '#14132A',
    surface: '#1E1D3B',
    surfaceAlt: '#272549',
    border: '#333062',
    text: '#F2EFE8',
    textMuted: '#B7B2C9',
    textFaint: '#8A85A0',
    primary: '#A99BE8',
    primarySoft: '#2B2954',
    onPrimary: '#14132A',
    accent: '#D9A441',
    accentSoft: '#3A3159',
    success: '#7FBF95',
    danger: '#E08B82',
    overlay: 'rgba(0,0,0,0.6)',
    gradient: ['#211F45', '#3B3570'],
    verseGradient: ['#2A2654', '#4A4084'],
  },
};

export const themes: Record<ThemeName, Theme> = { aube, veillee };

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
  xxxl: 48,
};

export const radius = {
  sm: 8,
  md: 14,
  lg: 20,
  xl: 28,
  pill: 999,
};

export const fontSize = {
  xs: 12,
  sm: 13,
  md: 15,
  lg: 17,
  xl: 20,
  xxl: 24,
  title: 30,
  hero: 36,
};
