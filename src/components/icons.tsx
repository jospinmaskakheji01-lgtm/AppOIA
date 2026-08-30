import React from 'react';
import { ColorValue } from 'react-native';
import Svg, { Circle, Path, Line } from 'react-native-svg';

export interface PropsIcone {
  couleur: ColorValue;
  taille?: number;
  epaisseur?: number;
}

const base = (taille = 24) => ({
  width: taille,
  height: taille,
  viewBox: '0 0 24 24',
  fill: 'none',
});

export function IconeAube({ couleur, taille, epaisseur = 1.7 }: PropsIcone) {
  return (
    <Svg {...base(taille)}>
      <Circle cx="12" cy="13" r="4" stroke={couleur} strokeWidth={epaisseur} />
      <Line x1="12" y1="3" x2="12" y2="5.5" stroke={couleur} strokeWidth={epaisseur} strokeLinecap="round" />
      <Line x1="4.5" y1="5.5" x2="6.3" y2="7.3" stroke={couleur} strokeWidth={epaisseur} strokeLinecap="round" />
      <Line x1="19.5" y1="5.5" x2="17.7" y2="7.3" stroke={couleur} strokeWidth={epaisseur} strokeLinecap="round" />
      <Line x1="3" y1="20" x2="21" y2="20" stroke={couleur} strokeWidth={epaisseur} strokeLinecap="round" />
    </Svg>
  );
}

export function IconeSouffle({ couleur, taille, epaisseur = 1.7 }: PropsIcone) {
  return (
    <Svg {...base(taille)}>
      <Circle cx="12" cy="12" r="8.5" stroke={couleur} strokeWidth={epaisseur} opacity={0.45} />
      <Circle cx="12" cy="12" r="4.5" stroke={couleur} strokeWidth={epaisseur} />
      <Circle cx="12" cy="12" r="1.3" fill={couleur} />
    </Svg>
  );
}

export function IconeLivre({ couleur, taille, epaisseur = 1.7 }: PropsIcone) {
  return (
    <Svg {...base(taille)}>
      <Path
        d="M12 6.5C10.4 5.2 8.3 4.7 4.5 4.8v13c3.8-.1 5.9.4 7.5 1.7 1.6-1.3 3.7-1.8 7.5-1.7v-13c-3.8-.1-5.9.4-7.5 1.7Z"
        stroke={couleur}
        strokeWidth={epaisseur}
        strokeLinejoin="round"
      />
      <Line x1="12" y1="6.5" x2="12" y2="19.5" stroke={couleur} strokeWidth={epaisseur} />
    </Svg>
  );
}

export function IconeCroix({ couleur, taille, epaisseur = 1.7 }: PropsIcone) {
  return (
    <Svg {...base(taille)}>
      <Line x1="12" y1="3.5" x2="12" y2="20.5" stroke={couleur} strokeWidth={epaisseur} strokeLinecap="round" />
      <Line x1="6.5" y1="9" x2="17.5" y2="9" stroke={couleur} strokeWidth={epaisseur} strokeLinecap="round" />
    </Svg>
  );
}

export function IconePlume({ couleur, taille, epaisseur = 1.7 }: PropsIcone) {
  return (
    <Svg {...base(taille)}>
      <Path
        d="M19 4.5c-7 0-11 3.6-11 9.2 0 1.3.3 2.4.8 3.3L5 20.5"
        stroke={couleur}
        strokeWidth={epaisseur}
        strokeLinecap="round"
      />
      <Path
        d="M8.8 17c6.2.6 10.2-3.3 10.2-12.5"
        stroke={couleur}
        strokeWidth={epaisseur}
        strokeLinecap="round"
        opacity={0.55}
      />
    </Svg>
  );
}

export function IconePersonne({ couleur, taille, epaisseur = 1.7 }: PropsIcone) {
  return (
    <Svg {...base(taille)}>
      <Circle cx="12" cy="8" r="3.6" stroke={couleur} strokeWidth={epaisseur} />
      <Path
        d="M4.8 20c.6-3.7 3.6-5.8 7.2-5.8s6.6 2.1 7.2 5.8"
        stroke={couleur}
        strokeWidth={epaisseur}
        strokeLinecap="round"
      />
    </Svg>
  );
}

export function IconeFleche({ couleur, taille, epaisseur = 1.8 }: PropsIcone) {
  return (
    <Svg {...base(taille)}>
      <Path d="M14.5 6 9 12l5.5 6" stroke={couleur} strokeWidth={epaisseur} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

export function IconeCoeur({ couleur, taille, rempli }: PropsIcone & { rempli?: boolean }) {
  return (
    <Svg {...base(taille)}>
      <Path
        d="M12 20s-7.5-4.4-7.5-9.4A4.1 4.1 0 0 1 12 8.2a4.1 4.1 0 0 1 7.5 2.4C19.5 15.6 12 20 12 20Z"
        stroke={couleur}
        strokeWidth={1.7}
        fill={rempli ? couleur : 'none'}
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export function IconeCoche({ couleur, taille, epaisseur = 2.2 }: PropsIcone) {
  return (
    <Svg {...base(taille)}>
      <Path d="m5 12.5 4.5 4.5L19 7" stroke={couleur} strokeWidth={epaisseur} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

export function IconeFlamme({ couleur, taille }: PropsIcone) {
  return (
    <Svg {...base(taille)}>
      <Path
        d="M12 3.5c3.4 3 5 5.6 5 8.4a5 5 0 0 1-10 0c0-1.4.5-2.6 1.4-3.6.2 1.2.8 2 1.8 2.2-.4-2.6.2-4.9 1.8-7Z"
        stroke={couleur}
        strokeWidth={1.6}
        strokeLinejoin="round"
      />
    </Svg>
  );
}

// ————————————————————————————————————————————————————————————
// Icônes des rubriques de réglages
// ————————————————————————————————————————————————————————————

/** Chevron des lignes de réglage. `ouvert` le fait pointer vers le bas. */
export function IconeChevron({
  couleur,
  taille,
  epaisseur = 1.8,
  ouvert,
}: PropsIcone & { ouvert?: boolean }) {
  return (
    <Svg {...base(taille)}>
      <Path
        d={ouvert ? 'M6 9.5 12 15.5l6-6' : 'M9.5 6 15.5 12l-6 6'}
        stroke={couleur}
        strokeWidth={epaisseur}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export function IconeLoupe({ couleur, taille, epaisseur = 1.7 }: PropsIcone) {
  return (
    <Svg {...base(taille)}>
      <Circle cx="10.8" cy="10.8" r="6.3" stroke={couleur} strokeWidth={epaisseur} />
      <Line x1="15.4" y1="15.4" x2="20" y2="20" stroke={couleur} strokeWidth={epaisseur} strokeLinecap="round" />
    </Svg>
  );
}

/** Rayonnage : la bibliothèque des ouvrages installés. */
export function IconeRayonnage({ couleur, taille, epaisseur = 1.7 }: PropsIcone) {
  return (
    <Svg {...base(taille)}>
      <Path d="M5 4.5h3v15H5z" stroke={couleur} strokeWidth={epaisseur} strokeLinejoin="round" />
      <Path d="M10 4.5h3v15h-3z" stroke={couleur} strokeWidth={epaisseur} strokeLinejoin="round" />
      <Path d="m15.6 5.6 2.9.8-3.4 13-2.9-.8z" stroke={couleur} strokeWidth={epaisseur} strokeLinejoin="round" />
    </Svg>
  );
}

export function IconeCalendrier({ couleur, taille, epaisseur = 1.7 }: PropsIcone) {
  return (
    <Svg {...base(taille)}>
      <Path d="M4.5 6.5h15v13h-15z" stroke={couleur} strokeWidth={epaisseur} strokeLinejoin="round" />
      <Line x1="4.5" y1="10.5" x2="19.5" y2="10.5" stroke={couleur} strokeWidth={epaisseur} />
      <Line x1="8.5" y1="4" x2="8.5" y2="7" stroke={couleur} strokeWidth={epaisseur} strokeLinecap="round" />
      <Line x1="15.5" y1="4" x2="15.5" y2="7" stroke={couleur} strokeWidth={epaisseur} strokeLinecap="round" />
      <Circle cx="9" cy="14.5" r="1.1" fill={couleur} />
    </Svg>
  );
}

/** Boussole : les méthodes, qui donnent la direction. */
export function IconeBoussole({ couleur, taille, epaisseur = 1.7 }: PropsIcone) {
  return (
    <Svg {...base(taille)}>
      <Circle cx="12" cy="12" r="8" stroke={couleur} strokeWidth={epaisseur} />
      <Path d="m15 9-1.7 4.3L9 15l1.7-4.3z" stroke={couleur} strokeWidth={epaisseur} strokeLinejoin="round" />
    </Svg>
  );
}

/** Deux « A » de tailles différentes : le corps du texte. */
export function IconeTexte({ couleur, taille, epaisseur = 1.7 }: PropsIcone) {
  return (
    <Svg {...base(taille)}>
      <Path d="M3 17 6.6 7l3.6 10" stroke={couleur} strokeWidth={epaisseur} strokeLinecap="round" strokeLinejoin="round" />
      <Line x1="4.3" y1="13.8" x2="8.9" y2="13.8" stroke={couleur} strokeWidth={epaisseur} strokeLinecap="round" />
      <Path d="M13.8 17.5 17 10l3.2 7.5" stroke={couleur} strokeWidth={epaisseur} strokeLinecap="round" strokeLinejoin="round" />
      <Line x1="14.9" y1="15.2" x2="19.1" y2="15.2" stroke={couleur} strokeWidth={epaisseur} strokeLinecap="round" />
    </Svg>
  );
}

export function IconeCloche({ couleur, taille, epaisseur = 1.7 }: PropsIcone) {
  return (
    <Svg {...base(taille)}>
      <Path
        d="M6.5 16.5v-4.8a5.5 5.5 0 0 1 11 0v4.8l1.3 2H5.2z"
        stroke={couleur}
        strokeWidth={epaisseur}
        strokeLinejoin="round"
      />
      <Path d="M10.3 18.5a1.9 1.9 0 0 0 3.4 0" stroke={couleur} strokeWidth={epaisseur} strokeLinecap="round" />
    </Svg>
  );
}

/** Coffre : les données écrites, qui restent sur l'appareil. */
export function IconeCoffre({ couleur, taille, epaisseur = 1.7 }: PropsIcone) {
  return (
    <Svg {...base(taille)}>
      <Path d="M4.5 7.5h15v12h-15z" stroke={couleur} strokeWidth={epaisseur} strokeLinejoin="round" />
      <Line x1="4.5" y1="11.5" x2="19.5" y2="11.5" stroke={couleur} strokeWidth={epaisseur} />
      <Path d="M9 7.5V6a3 3 0 0 1 6 0v1.5" stroke={couleur} strokeWidth={epaisseur} strokeLinejoin="round" />
      <Line x1="12" y1="14" x2="12" y2="17" stroke={couleur} strokeWidth={epaisseur} strokeLinecap="round" />
    </Svg>
  );
}

export function IconePartage({ couleur, taille, epaisseur = 1.7 }: PropsIcone) {
  return (
    <Svg {...base(taille)}>
      <Circle cx="17.5" cy="6" r="2.6" stroke={couleur} strokeWidth={epaisseur} />
      <Circle cx="6.5" cy="12" r="2.6" stroke={couleur} strokeWidth={epaisseur} />
      <Circle cx="17.5" cy="18" r="2.6" stroke={couleur} strokeWidth={epaisseur} />
      <Line x1="8.9" y1="10.8" x2="15.2" y2="7.3" stroke={couleur} strokeWidth={epaisseur} strokeLinecap="round" />
      <Line x1="8.9" y1="13.2" x2="15.2" y2="16.7" stroke={couleur} strokeWidth={epaisseur} strokeLinecap="round" />
    </Svg>
  );
}

export function IconeCorbeille({ couleur, taille, epaisseur = 1.7 }: PropsIcone) {
  return (
    <Svg {...base(taille)}>
      <Path d="M6 7.5h12l-1 12H7z" stroke={couleur} strokeWidth={epaisseur} strokeLinejoin="round" />
      <Line x1="4.5" y1="7.5" x2="19.5" y2="7.5" stroke={couleur} strokeWidth={epaisseur} strokeLinecap="round" />
      <Path d="M9.5 7.5V5.8a1.3 1.3 0 0 1 1.3-1.3h2.4a1.3 1.3 0 0 1 1.3 1.3v1.7" stroke={couleur} strokeWidth={epaisseur} strokeLinejoin="round" />
    </Svg>
  );
}

/** Nuage : le service de synthèse, la seule chose qui sorte de l'appareil. */
export function IconeNuage({ couleur, taille, epaisseur = 1.7 }: PropsIcone) {
  return (
    <Svg {...base(taille)}>
      <Path
        d="M7.5 17.5a3.9 3.9 0 0 1-.4-7.8 5 5 0 0 1 9.6-.6 3.6 3.6 0 0 1 .3 7.2z"
        stroke={couleur}
        strokeWidth={epaisseur}
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export function IconeInfo({ couleur, taille, epaisseur = 1.7 }: PropsIcone) {
  return (
    <Svg {...base(taille)}>
      <Circle cx="12" cy="12" r="8" stroke={couleur} strokeWidth={epaisseur} />
      <Line x1="12" y1="11" x2="12" y2="16" stroke={couleur} strokeWidth={epaisseur} strokeLinecap="round" />
      <Circle cx="12" cy="8.2" r="1" fill={couleur} />
    </Svg>
  );
}
