import type { ReactNode } from 'react';
import type { Category, IconName } from '../../types';

export type PathIconName =
  | 'signTriangle'
  | 'signPriority'
  | 'signProhibition'
  | 'trafficLight'
  | 'roundabout'
  | 'speedometer'
  | 'parking'
  | 'motorway'
  | 'night'
  | 'seatbelt'
  | 'car'
  | 'alcohol'
  | 'documentation'
  | 'pedestrian'
  | 'shield'
  | 'flag'
  | 'bolt'
  | 'chest'
  | 'signObligation'
  | 'signIndication'
  | 'roadworks';

/**
 * Iconos "de nodo": ilustraciones planas con color propio (no `currentColor`),
 * pensadas para leerse como insignias de videojuego dentro de un botón 3D —
 * distintas del <Icon> fino de trazo que usa el resto de la app.
 */
const PATH_ICON_PATHS: Record<PathIconName, ReactNode> = {
  signTriangle: (
    <>
      <path d="M12 2.4 22 20.5H2z" fill="#fff" stroke="#ef4444" strokeWidth="2.4" strokeLinejoin="round" />
      <rect x="10.7" y="8.2" width="2.6" height="6.2" rx="1.3" fill="#ef4444" />
      <circle cx="12" cy="17.3" r="1.4" fill="#ef4444" />
    </>
  ),
  signPriority: (
    <>
      <path d="M12 2 22 12 12 22 2 12z" fill="#facc15" stroke="#d97706" strokeWidth="1.6" strokeLinejoin="round" />
      <path d="M12 6.4 17.6 12 12 17.6 6.4 12z" fill="#fff" opacity="0.9" />
    </>
  ),
  signProhibition: (
    <>
      <circle cx="12" cy="12" r="9.6" fill="#fff" stroke="#ef4444" strokeWidth="3" />
      <rect x="4.6" y="10.6" width="14.8" height="2.8" rx="1.4" fill="#ef4444" transform="rotate(-38 12 12)" />
    </>
  ),
  trafficLight: (
    <>
      <rect x="7.5" y="1.2" width="9" height="21.6" rx="3.4" fill="#26293a" />
      <circle cx="12" cy="6.4" r="2.35" fill="#ef4444" />
      <circle cx="12" cy="12" r="2.35" fill="#facc15" />
      <circle cx="12" cy="17.6" r="2.35" fill="#22c55e" />
    </>
  ),
  roundabout: (
    <>
      <circle cx="12" cy="12" r="8.4" fill="none" stroke="#3b82f6" strokeWidth="3" />
      <path d="M17.2 6.6 20.6 5.4 19.6 9" fill="none" stroke="#3b82f6" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="12" cy="12" r="2.6" fill="#3b82f6" />
    </>
  ),
  speedometer: (
    <>
      <path d="M4 16.5a8 8 0 0 1 16 0" fill="none" stroke="#3b82f6" strokeWidth="3" strokeLinecap="round" />
      <line x1="12" y1="16.2" x2="16.2" y2="8.8" stroke="#ef4444" strokeWidth="2.4" strokeLinecap="round" />
      <circle cx="12" cy="16.2" r="1.8" fill="#1f2530" />
    </>
  ),
  parking: (
    <>
      <rect x="2" y="2" width="20" height="20" rx="6" fill="#3b82f6" />
      <path
        d="M9.2 6.4h4.6a3.6 3.6 0 0 1 0 7.2H10.4v3.9H8.4V6.4h.8zm1.2 2v3.2h3.4a1.6 1.6 0 0 0 0-3.2h-3.4z"
        fill="#fff"
      />
    </>
  ),
  motorway: (
    <>
      <rect x="2" y="4" width="20" height="16" rx="4.5" fill="#16a34a" />
      <path
        d="M7.2 9.4 5.4 15M16.8 9.4l1.8 5.6M11 9v2.2M11 13.4v2M13.2 9v6.6"
        stroke="#fff"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </>
  ),
  night: (
    <>
      <path d="M15.2 2.4a9.2 9.2 0 1 0 6.4 15.7 7.4 7.4 0 0 1-6.4-15.7z" fill="#a78bfa" />
      <circle cx="19" cy="6.4" r="1.1" fill="#fff" />
      <circle cx="20.6" cy="10.4" r="0.75" fill="#fff" />
    </>
  ),
  seatbelt: (
    <>
      <path d="M12 2 20 5v6c0 5-3.5 8.6-8 11-4.5-2.4-8-6-8-11V5l8-3z" fill="#22c55e" />
      <path d="M7.6 7.6 16.4 16.4M7.6 11h2.2M14.2 13.4h2.2" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" />
    </>
  ),
  car: (
    <>
      <path
        d="M5 16.2 6.2 11a2.1 2.1 0 0 1 2-1.5h7.6a2.1 2.1 0 0 1 2 1.5l1.2 5.2v3a1 1 0 0 1-1 1h-1a1 1 0 0 1-1-1v-1H8v1a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1v-3z"
        fill="#f97316"
      />
      <circle cx="7.6" cy="16.2" r="1.7" fill="#26293a" />
      <circle cx="16.4" cy="16.2" r="1.7" fill="#26293a" />
    </>
  ),
  alcohol: (
    <>
      <path
        d="M8 3h8l-1.15 7.3a2.85 2.85 0 0 1-2.85 2.35v6.55h3.1v2H8.9v-2H12v-6.55A2.85 2.85 0 0 1 9.15 10.3L8 3z"
        fill="#ef4444"
      />
    </>
  ),
  documentation: (
    <>
      <rect x="2" y="5" width="20" height="14" rx="2.6" fill="#3b82f6" />
      <circle cx="8.2" cy="12" r="2.3" fill="#fff" />
      <path d="M13.4 10h6.2M13.4 13h6.2M4.4 16.8c.5-1.9 1.9-2.9 3.4-2.9s2.9 1 3.4 2.9" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" />
    </>
  ),
  pedestrian: (
    <>
      <circle cx="12" cy="5" r="2.4" fill="#14b8a6" />
      <path d="M12 9v6M12 9l-4 2M12 9l4 2M12 15l-3 6M12 15l3 6" stroke="#14b8a6" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
    </>
  ),
  shield: (
    <>
      <path d="M12 2 20 5v6c0 5-3.5 8.6-8 11-4.5-2.4-8-6-8-11V5l8-3z" fill="#3b82f6" />
      <path d="M8.4 12.2 10.8 14.6 15.6 9.4" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </>
  ),
  flag: (
    <>
      <rect x="5" y="2" width="2.2" height="20" rx="1.1" fill="#c4c9d4" />
      <path d="M7.2 3h12.4l-2.8 4 2.8 4H7.2z" fill="#fff" />
      <path d="M9.4 3h2.4v3.2H9.4zM14.2 3h2.4v3.2h-2.4zM11.8 6.2h2.4v3.6h-2.4zM16.6 6.2h1.2l1.6 2.3-1.6 2.5h-1.2z" fill="#1f2530" />
    </>
  ),
  bolt: (
    <path d="M13.2 1.6 4.3 13.8h5.9l-1.1 8.6L18 10h-5.9l1.1-8.4z" fill="#facc15" stroke="#d97706" strokeWidth="0.6" strokeLinejoin="round" />
  ),
  chest: (
    <>
      <rect x="2.6" y="10.4" width="18.8" height="10.4" rx="2.2" fill="#a2540f" />
      <rect x="2.6" y="10.4" width="18.8" height="4.4" rx="2.2" fill="#d97706" />
      <rect x="10" y="9" width="4" height="6.4" rx="1.2" fill="#facc15" />
      <path d="M2.6 12.4a9.4 6.2 0 0 1 18.8 0" fill="none" stroke="#7c3a0c" strokeWidth="1.4" />
    </>
  ),
  signObligation: (
    <>
      <circle cx="12" cy="12" r="10" fill="#2563eb" />
      <path d="M12 17V7M7.5 11.5 12 7l4.5 4.5" fill="none" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
    </>
  ),
  signIndication: (
    <>
      <rect x="2" y="2" width="20" height="20" rx="4.5" fill="#2563eb" />
      <path
        d="M5.5 12h10.2M11 7 16.5 12 11 17"
        fill="none"
        stroke="#fff"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </>
  ),
  roadworks: (
    <>
      <path d="M12 2.4 22 20.5H2z" fill="#fff" stroke="#f97316" strokeWidth="2.4" strokeLinejoin="round" />
      <path d="M12 9.2 9 17.4h6L12 9.2z" fill="#f97316" />
      <rect x="9.2" y="17.4" width="5.6" height="1.7" rx="0.6" fill="#f97316" />
    </>
  ),
};

export function PathIcon({ name, size = 30 }: { name: PathIconName; size?: number }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden="true" focusable="false">
      {PATH_ICON_PATHS[name]}
    </svg>
  );
}

/** Mapea el icono fino de categoría (Icon/IconName) al icono de nodo por defecto de ese tema. */
const CATEGORY_DEFAULT: Partial<Record<IconName, PathIconName>> = {
  sign: 'signTriangle',
  rules: 'signPriority',
  road: 'roundabout',
  shield: 'shield',
  alcohol: 'alcohol',
  car: 'car',
  user: 'documentation',
  pedestrian: 'pedestrian',
};

/** Reglas por palabra clave en el id de subcategoría — cubre los casos con arte propio antes de caer al icono por defecto de la categoría. */
const KEYWORD_RULES: [RegExp, PathIconName][] = [
  [/peligro/, 'signTriangle'],
  [/prioridad|incorporacion|cambios/, 'signPriority'],
  [/prohibicion/, 'signProhibition'],
  [/obligacion/, 'signObligation'],
  [/indicacion/, 'signIndication'],
  [/circunstancial/, 'roadworks'],
  [/semaforo/, 'trafficLight'],
  [/agentes/, 'shield'],
  [/velocidad|frenado/, 'speedometer'],
  [/aparcamiento|estacionamiento/, 'parking'],
  [/autopista|autovia|carretera/, 'motorway'],
  [/nocturn/, 'night'],
  [/seguridad-pasiva|seguridad-activa|cinturon/, 'seatbelt'],
  [/alcohol|droga|alcoholemia/, 'alcohol'],
  [/peaton/, 'pedestrian'],
  [/ciclista|motocicleta|transporte/, 'car'],
  [/documentacion|permiso|puntos/, 'documentation'],
];

/** Icono + color de acento (para el halo del nodo activo) de una lección concreta. */
export function lessonVisual(subcategoryId: string, category: Category): { icon: PathIconName; glow: string } {
  const match = KEYWORD_RULES.find(([re]) => re.test(subcategoryId));
  const icon = match?.[1] ?? CATEGORY_DEFAULT[category.icon] ?? 'signTriangle';
  const glow = ICON_GLOW[icon];
  return { icon, glow };
}

const ICON_GLOW: Record<PathIconName, string> = {
  signTriangle: 'rgba(239,68,68,0.45)',
  signPriority: 'rgba(250,204,21,0.45)',
  signProhibition: 'rgba(239,68,68,0.45)',
  trafficLight: 'rgba(250,204,21,0.4)',
  roundabout: 'rgba(59,130,246,0.45)',
  speedometer: 'rgba(59,130,246,0.45)',
  parking: 'rgba(59,130,246,0.45)',
  motorway: 'rgba(34,197,94,0.4)',
  night: 'rgba(167,139,250,0.45)',
  seatbelt: 'rgba(34,197,94,0.4)',
  car: 'rgba(249,115,22,0.4)',
  alcohol: 'rgba(239,68,68,0.4)',
  documentation: 'rgba(59,130,246,0.4)',
  pedestrian: 'rgba(20,184,166,0.4)',
  shield: 'rgba(59,130,246,0.4)',
  flag: 'rgba(139,92,246,0.45)',
  bolt: 'rgba(250,204,21,0.5)',
  chest: 'rgba(250,204,21,0.5)',
  signObligation: 'rgba(37,99,235,0.45)',
  signIndication: 'rgba(37,99,235,0.45)',
  roadworks: 'rgba(249,115,22,0.45)',
};
