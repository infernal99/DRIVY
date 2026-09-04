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
  | 'roadworks'
  | 'bicycle'
  | 'motorcycle'
  | 'priorityVehicle'
  | 'roadMarking'
  | 'panel'
  | 'rightOfWay'
  | 'turnArrow'
  | 'uturn'
  | 'merge'
  | 'stopSign'
  | 'trafficFlow'
  | 'overtake'
  | 'ruralRoad'
  | 'cityRoad'
  | 'lanes'
  | 'shoulder'
  | 'distanceGap'
  | 'brakeSkid'
  | 'hazard'
  | 'fatigue'
  | 'drowsy'
  | 'distraction'
  | 'phone'
  | 'firstAid'
  | 'eco'
  | 'weather'
  | 'travel'
  | 'alcoholEffect'
  | 'drugs'
  | 'medication'
  | 'reaction'
  | 'tire'
  | 'brakeDisc'
  | 'headlight'
  | 'inspection'
  | 'wrench'
  | 'activeSafety'
  | 'carSeat'
  | 'ecoLabel'
  | 'cargo'
  | 'visibility'
  | 'sensor'
  | 'truck'
  | 'trailer'
  | 'plate'
  | 'idCard'
  | 'points'
  | 'medicalCheck'
  | 'behavior'
  | 'wheelClamp'
  | 'scooter';

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
  bicycle: (
    <>
      <circle cx="6" cy="17" r="3.4" fill="none" stroke="#0ea5e9" strokeWidth="2" />
      <circle cx="18" cy="17" r="3.4" fill="none" stroke="#0ea5e9" strokeWidth="2" />
      <path d="M6 17 10 9h4l4 8M10 9 8.4 5.4h2.8" stroke="#0ea5e9" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="14" cy="9" r="1.3" fill="#0ea5e9" />
    </>
  ),
  motorcycle: (
    <>
      <circle cx="5.5" cy="17" r="3" fill="none" stroke="#dc2626" strokeWidth="2" />
      <circle cx="18" cy="17" r="3" fill="none" stroke="#dc2626" strokeWidth="2" />
      <path d="M5.5 17 9 12h6l3 5M9.5 12 11 8h3.5" stroke="#dc2626" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <rect x="9.5" y="9.6" width="4" height="2.2" rx="1" fill="#dc2626" />
    </>
  ),
  priorityVehicle: (
    <>
      <rect x="2" y="6" width="20" height="12" rx="3" fill="#ef4444" />
      <rect x="10.6" y="8.4" width="2.8" height="7.2" rx="1" fill="#fff" />
      <rect x="8.4" y="10.6" width="7.2" height="2.8" rx="1" fill="#fff" />
      <circle cx="6.5" cy="18.4" r="1.7" fill="#26293a" />
      <circle cx="17.5" cy="18.4" r="1.7" fill="#26293a" />
    </>
  ),
  roadMarking: (
    <>
      <rect x="2" y="9" width="20" height="6" rx="1.5" fill="#4b5563" />
      <rect x="4" y="11" width="4" height="2" rx="1" fill="#fff" />
      <rect x="10.5" y="11" width="4" height="2" rx="1" fill="#fff" />
      <rect x="17" y="11" width="3" height="2" rx="1" fill="#fff" />
    </>
  ),
  panel: (
    <>
      <rect x="3" y="2.4" width="18" height="9" rx="1.5" fill="#fff" stroke="#2563eb" strokeWidth="2" />
      <path d="M7 6.4h10M7 8.8h6" stroke="#2563eb" strokeWidth="1.6" strokeLinecap="round" />
      <rect x="6" y="14" width="12" height="7.6" rx="1.2" fill="#2563eb" />
    </>
  ),
  rightOfWay: (
    <>
      <path d="M12 2 20 5v6c0 5-3.5 8.6-8 11-4.5-2.4-8-6-8-11V5l8-3z" fill="#facc15" />
      <path d="M7 12h10M12 7v10" stroke="#7c5e05" strokeWidth="2" strokeLinecap="round" />
    </>
  ),
  turnArrow: (
    <>
      <path d="M5 19V11a5 5 0 0 1 5-5h6" fill="none" stroke="#3b82f6" strokeWidth="2.4" strokeLinecap="round" />
      <path d="M12 2.5 18.4 6 12 9.5z" fill="#3b82f6" />
    </>
  ),
  uturn: (
    <>
      <path d="M16 6a6 6 0 1 0 0 12h-3" fill="none" stroke="#3b82f6" strokeWidth="2.4" strokeLinecap="round" />
      <path d="M9.6 14.4 13 18l-3.4 3.4" fill="none" stroke="#3b82f6" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
    </>
  ),
  merge: (
    <>
      <path d="M4 20 10 6M20 20 14 6" stroke="#3b82f6" strokeWidth="2.2" fill="none" strokeLinecap="round" />
      <path d="M9.8 6.4 12 2 14.2 6.4" stroke="#3b82f6" strokeWidth="2.2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </>
  ),
  stopSign: (
    <>
      <path d="M8 2h8l6 6v8l-6 6H8l-6-6V8z" fill="#ef4444" />
      <rect x="6.5" y="11" width="11" height="2.2" rx="1" fill="#fff" />
    </>
  ),
  trafficFlow: (
    <>
      <rect x="2" y="10" width="20" height="4" rx="2" fill="#4b5563" />
      <circle cx="7" cy="12" r="2.6" fill="#3b82f6" />
      <circle cx="17" cy="12" r="2.6" fill="#f97316" />
    </>
  ),
  overtake: (
    <>
      <rect x="1.6" y="13" width="9" height="5" rx="1.6" fill="#94a3b8" />
      <rect x="10.4" y="8.6" width="9" height="5" rx="1.6" fill="#3b82f6" />
      <path d="M18 3.6 21.4 7 18 10.4" stroke="#3b82f6" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </>
  ),
  ruralRoad: (
    <>
      <rect x="2" y="4" width="20" height="16" rx="4.5" fill="#22c55e" />
      <path d="M12 7v3M12 13.4v3.6" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
    </>
  ),
  cityRoad: (
    <>
      <rect x="2" y="4" width="20" height="16" rx="4.5" fill="#64748b" />
      <rect x="6" y="8" width="4" height="4" fill="#fff" />
      <rect x="13" y="12" width="5" height="5" fill="#fff" opacity="0.85" />
    </>
  ),
  lanes: (
    <>
      <rect x="2" y="2" width="20" height="20" rx="5" fill="#3b82f6" />
      <path d="M8 5v14M16 5v14" stroke="#fff" strokeWidth="2" strokeDasharray="3 3" strokeLinecap="round" />
    </>
  ),
  shoulder: (
    <>
      <rect x="2" y="2" width="20" height="20" rx="5" fill="#a16207" />
      <rect x="4" y="9" width="6" height="6" rx="1" fill="#fde68a" />
      <path d="M12 9h8M12 15h8" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
    </>
  ),
  distanceGap: (
    <>
      <rect x="3" y="14" width="6" height="4" rx="1" fill="#3b82f6" />
      <rect x="15" y="14" width="6" height="4" rx="1" fill="#3b82f6" />
      <path d="M10 16h4" stroke="#3b82f6" strokeWidth="2" strokeDasharray="2 2" strokeLinecap="round" />
    </>
  ),
  brakeSkid: (
    <>
      <path d="M2 17c4 0 4-4 8-4s4 4 8 4" stroke="#ef4444" strokeWidth="2.4" fill="none" strokeLinecap="round" strokeDasharray="4 3" />
      <circle cx="12" cy="8" r="3" fill="#ef4444" />
    </>
  ),
  hazard: (
    <>
      <circle cx="12" cy="12" r="10" fill="#f97316" />
      <rect x="10.7" y="6" width="2.6" height="8" rx="1.3" fill="#fff" />
      <circle cx="12" cy="17" r="1.5" fill="#fff" />
    </>
  ),
  fatigue: (
    <>
      <circle cx="12" cy="12" r="10" fill="#a78bfa" />
      <path d="M7 12h4M13 12h4" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
      <path d="M15.4 6.4h3.4l-3.4 3.4h3.4" stroke="#fff" strokeWidth="1.4" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </>
  ),
  drowsy: (
    <>
      <circle cx="12" cy="12" r="10" fill="#818cf8" />
      <path d="M7 13c1-1.4 2.4-1.4 3.4 0M13.6 13c1-1.4 2.4-1.4 3.4 0" stroke="#fff" strokeWidth="1.8" fill="none" strokeLinecap="round" />
    </>
  ),
  distraction: (
    <>
      <rect x="8" y="2" width="8" height="20" rx="2.4" fill="#334155" />
      <circle cx="12" cy="18.4" r="1.2" fill="#fff" />
      <circle cx="12" cy="9" r="2.6" fill="#ef4444" />
    </>
  ),
  phone: (
    <>
      <rect x="7" y="2" width="10" height="20" rx="2.4" fill="#3b82f6" />
      <rect x="9" y="5" width="6" height="12" rx="1" fill="#fff" opacity="0.9" />
      <circle cx="12" cy="19" r="1.1" fill="#fff" />
    </>
  ),
  firstAid: (
    <>
      <rect x="2" y="6" width="20" height="14" rx="2.6" fill="#ef4444" />
      <rect x="10.4" y="9" width="3.2" height="8" rx="1" fill="#fff" />
      <rect x="8" y="11.4" width="8" height="3.2" rx="1" fill="#fff" />
    </>
  ),
  eco: (
    <>
      <path d="M20 4C10 4 4 10 4 18c8 0 14-6 16-14z" fill="#22c55e" />
      <path d="M6 18c4-4 8-8 12-12" stroke="#166534" strokeWidth="1.4" fill="none" strokeLinecap="round" />
    </>
  ),
  weather: (
    <>
      <path d="M6 13a4.5 4.5 0 0 1 .3-9 6 6 0 0 1 11.4 2A4 4 0 0 1 17 13H6z" fill="#94a3b8" />
      <path d="M8 16l-1.4 3M12 16l-1.4 3M16 16l-1.4 3" stroke="#3b82f6" strokeWidth="1.8" strokeLinecap="round" />
    </>
  ),
  travel: (
    <>
      <rect x="4" y="8" width="16" height="12" rx="2" fill="#f97316" />
      <rect x="9" y="4.5" width="6" height="4" rx="1.2" fill="none" stroke="#f97316" strokeWidth="2" />
      <rect x="4" y="12" width="16" height="2.2" fill="#fff" opacity="0.7" />
    </>
  ),
  alcoholEffect: (
    <>
      <circle cx="12" cy="12" r="10" fill="#ef4444" />
      <path d="M7 10c1.5-2 3-2 4 0M13 10c1.5-2 3-2 4 0" stroke="#fff" strokeWidth="1.8" fill="none" strokeLinecap="round" />
      <path d="M8 16c2 1.4 6 1.4 8 0" stroke="#fff" strokeWidth="1.8" fill="none" strokeLinecap="round" />
    </>
  ),
  drugs: (
    <>
      <circle cx="9" cy="9" r="4" fill="#a855f7" />
      <circle cx="15" cy="15" r="4" fill="#7e22ce" />
      <path d="M9 9 15 15" stroke="#fff" strokeWidth="1.6" />
    </>
  ),
  medication: (
    <>
      <rect x="8" y="2" width="8" height="4" rx="1.4" fill="#94a3b8" />
      <rect x="6" y="6" width="12" height="16" rx="2.4" fill="#ef4444" />
      <rect x="6" y="12" width="12" height="3" fill="#fff" />
    </>
  ),
  reaction: (
    <>
      <circle cx="12" cy="13" r="8" fill="#3b82f6" />
      <rect x="10.5" y="1.6" width="3" height="2.4" rx="1" fill="#3b82f6" />
      <path d="M12 13 12 8M12 13 15.5 15" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" />
    </>
  ),
  tire: (
    <>
      <circle cx="12" cy="12" r="10" fill="#1f2937" />
      <circle cx="12" cy="12" r="4.5" fill="#cbd5e1" />
      <circle cx="12" cy="12" r="1.6" fill="#1f2937" />
    </>
  ),
  brakeDisc: (
    <>
      <circle cx="12" cy="12" r="10" fill="#94a3b8" />
      <circle cx="12" cy="12" r="4" fill="none" stroke="#334155" strokeWidth="1.6" />
      <circle cx="12" cy="12" r="1.4" fill="#334155" />
    </>
  ),
  headlight: (
    <>
      <path d="M4 8a8 4 0 0 1 16 0 8 4 0 0 1-16 0z" fill="#facc15" />
      <path d="M20 8h3M20 5.4l2-1.4M20 10.6l2 1.4" stroke="#facc15" strokeWidth="1.6" strokeLinecap="round" />
    </>
  ),
  inspection: (
    <>
      <rect x="4" y="3" width="16" height="19" rx="2.2" fill="#3b82f6" />
      <rect x="8.4" y="1.4" width="7.2" height="3.2" rx="1" fill="#93c5fd" />
      <path d="M8 13 11 16 16.5 9" stroke="#fff" strokeWidth="2.2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </>
  ),
  wrench: (
    <path
      d="M14.7 6.3a4 4 0 0 0-5.4 4.6L3 17.2 6.8 21l6.3-6.3a4 4 0 0 0 4.6-5.4l-2.8 2.8-2-2z"
      fill="#64748b"
    />
  ),
  activeSafety: (
    <>
      <rect x="4" y="12" width="16" height="6" rx="2" fill="#3b82f6" />
      <path d="M9 9a4 4 0 0 1 6 0M7 6.4a7.4 7.4 0 0 1 10 0" stroke="#3b82f6" strokeWidth="1.8" fill="none" strokeLinecap="round" />
    </>
  ),
  carSeat: (
    <>
      <path d="M6 20V11a5 5 0 0 1 10 0v9" fill="none" stroke="#f97316" strokeWidth="2.4" strokeLinecap="round" />
      <rect x="4" y="18" width="16" height="3.4" rx="1.6" fill="#f97316" />
    </>
  ),
  ecoLabel: (
    <>
      <circle cx="12" cy="12" r="10" fill="#22c55e" />
      <path d="M8 13c1.5 2.4 6.5 2.4 8 0" stroke="#fff" strokeWidth="2" fill="none" strokeLinecap="round" />
      <circle cx="12" cy="9" r="1.4" fill="#fff" />
    </>
  ),
  cargo: (
    <>
      <path d="M3 8 12 3l9 5v9L12 22 3 17z" fill="#a16207" />
      <path d="M3 8l9 5 9-5M12 13v9" stroke="#fde68a" strokeWidth="1.4" fill="none" strokeLinejoin="round" />
    </>
  ),
  visibility: (
    <>
      <ellipse cx="12" cy="12" rx="9" ry="5.5" fill="none" stroke="#3b82f6" strokeWidth="2" />
      <circle cx="12" cy="12" r="3" fill="#3b82f6" />
    </>
  ),
  sensor: (
    <>
      <circle cx="12" cy="18" r="2" fill="#3b82f6" />
      <path d="M8 14a5.6 5.6 0 0 1 8 0M5.4 11.4a9.4 9.4 0 0 1 13.2 0" stroke="#3b82f6" strokeWidth="1.8" fill="none" strokeLinecap="round" />
    </>
  ),
  truck: (
    <>
      <rect x="1.6" y="9" width="12" height="8" rx="1.4" fill="#f97316" />
      <path d="M13.6 11h4.4l3 3.2V17h-7.4z" fill="#fb923c" />
      <circle cx="6" cy="18.2" r="1.9" fill="#26293a" />
      <circle cx="16.4" cy="18.2" r="1.9" fill="#26293a" />
    </>
  ),
  trailer: (
    <>
      <rect x="6" y="8" width="16" height="8" rx="1.4" fill="#64748b" />
      <path d="M2 16h4M2 16v-3" stroke="#64748b" strokeWidth="2" strokeLinecap="round" />
      <circle cx="10" cy="18.4" r="1.8" fill="#26293a" />
      <circle cx="18" cy="18.4" r="1.8" fill="#26293a" />
    </>
  ),
  plate: (
    <>
      <rect x="2" y="7" width="20" height="10" rx="1.6" fill="#facc15" stroke="#1f2937" strokeWidth="1.4" />
      <rect x="5" y="10.4" width="14" height="3.2" fill="#1f2937" />
    </>
  ),
  idCard: (
    <>
      <rect x="2" y="4" width="20" height="16" rx="2.4" fill="#3b82f6" />
      <circle cx="8" cy="12" r="3" fill="#fff" />
      <path d="M13 9h7M13 12.4h7M13 15.8h4" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" />
    </>
  ),
  points: (
    <path d="M12 2 14.9 8.6 22 9.3 16.7 14 18.2 21 12 17.4 5.8 21 7.3 14 2 9.3 9.1 8.6z" fill="#facc15" />
  ),
  medicalCheck: (
    <>
      <circle cx="12" cy="12" r="10" fill="#3b82f6" />
      <path d="M7 12a5 5 0 0 1 10 0 5 5 0 0 1-10 0z" fill="#fff" />
      <circle cx="12" cy="12" r="2" fill="#3b82f6" />
    </>
  ),
  behavior: (
    <path
      d="M12 20.5 4.5 13a4.5 4.5 0 0 1 6.4-6.4l1.1 1.1 1.1-1.1a4.5 4.5 0 0 1 6.4 6.4z"
      fill="#ef4444"
    />
  ),
  wheelClamp: (
    <>
      <circle cx="12" cy="12" r="9" fill="none" stroke="#334155" strokeWidth="3" />
      <rect x="10" y="2" width="4" height="9" rx="1.4" fill="#ef4444" />
    </>
  ),
  scooter: (
    <>
      <circle cx="6" cy="19" r="2.4" fill="none" stroke="#0ea5e9" strokeWidth="2" />
      <circle cx="18" cy="19" r="2.4" fill="none" stroke="#0ea5e9" strokeWidth="2" />
      <path d="M6 19h9V6h4M9 19 12 10" stroke="#0ea5e9" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
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

/** Mapea el icono fino de categoría (Icon/IconName) al icono de nodo por defecto de ese tema — solo se usa si ninguna KEYWORD_RULES encaja. */
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

/**
 * Reglas por id de subcategoría — una por lección real del temario (ver
 * src/data/categories.ts), para que cada nodo del camino tenga su propio
 * icono en vez de caer al icono genérico de la categoría. Los patrones que
 * podrían confundirse con otro id (p.ej. "prioridad" dentro de
 * "senales-prioridad" o "vehiculos-prioritarios") van anclados con ^...$
 * o usan un fragmento suficientemente largo para no cruzarse.
 */
const KEYWORD_RULES: [RegExp, PathIconName][] = [
  // Señales
  [/peligro/, 'signTriangle'],
  [/senales-prioridad/, 'signPriority'],
  [/prohibicion/, 'signProhibition'],
  [/obligacion/, 'signObligation'],
  [/indicacion/, 'signIndication'],
  [/circunstancial/, 'roadworks'],
  [/marcas-viales/, 'roadMarking'],
  [/semaforo/, 'trafficLight'],
  [/agentes/, 'shield'],
  [/paneles-complementarios/, 'panel'],
  // Normas de circulación
  [/^prioridad$/, 'rightOfWay'],
  [/adelantamientos/, 'overtake'],
  [/cambios-direccion/, 'turnArrow'],
  [/cambios-sentido/, 'uturn'],
  [/incorporaciones/, 'merge'],
  [/paradas/, 'stopSign'],
  [/aparcamiento|estacionamiento/, 'parking'],
  [/circulacion-vias/, 'trafficFlow'],
  // Vías
  [/autopistas/, 'motorway'],
  [/autovias/, 'motorway'],
  [/carreteras-convencionales/, 'ruralRoad'],
  [/vias-urbanas/, 'cityRoad'],
  [/carriles/, 'lanes'],
  [/arcenes/, 'shoulder'],
  // Seguridad vial
  [/distancia-seguridad/, 'distanceGap'],
  [/velocidad/, 'speedometer'],
  [/frenado/, 'brakeSkid'],
  [/riesgos/, 'hazard'],
  [/fatiga/, 'fatigue'],
  [/somnolencia/, 'drowsy'],
  [/distracciones/, 'distraction'],
  [/telefono-movil/, 'phone'],
  [/primeros-auxilios/, 'firstAid'],
  [/conduccion-eficiente/, 'eco'],
  [/condiciones-meteorologicas/, 'weather'],
  [/nocturn/, 'night'],
  [/preparacion-viaje/, 'travel'],
  // Alcohol y drogas
  [/alcoholemia/, 'alcohol'],
  [/efectos-alcohol/, 'alcoholEffect'],
  [/drogas/, 'drugs'],
  [/medicamentos/, 'medication'],
  [/tiempos-reaccion/, 'reaction'],
  // El vehículo
  [/neumaticos/, 'tire'],
  [/frenos/, 'brakeDisc'],
  [/alumbrado/, 'headlight'],
  [/itv/, 'inspection'],
  [/mantenimiento/, 'wrench'],
  [/seguridad-activa/, 'activeSafety'],
  [/seguridad-pasiva|cinturon/, 'seatbelt'],
  [/retencion-infantil/, 'carSeat'],
  [/distintivo-ambiental/, 'ecoLabel'],
  [/^carga/, 'cargo'],
  [/visibilidad/, 'visibility'],
  [/^adas$/, 'sensor'],
  [/vehiculos-especiales/, 'truck'],
  [/remolques/, 'trailer'],
  [/matricula/, 'plate'],
  // El conductor
  [/documentacion/, 'documentation'],
  [/permiso-conducir/, 'idCard'],
  [/^puntos$/, 'points'],
  [/aptitudes/, 'medicalCheck'],
  [/comportamiento/, 'behavior'],
  [/inmovilizacion/, 'wheelClamp'],
  // Otros usuarios
  [/peaton/, 'pedestrian'],
  [/ciclista/, 'bicycle'],
  [/motocicleta/, 'motorcycle'],
  [/prioritari/, 'priorityVehicle'],
  [/transporte/, 'car'],
  [/^vmp$/, 'scooter'],
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
  bicycle: 'rgba(14,165,233,0.4)',
  motorcycle: 'rgba(220,38,38,0.4)',
  priorityVehicle: 'rgba(239,68,68,0.45)',
  roadMarking: 'rgba(148,163,184,0.4)',
  panel: 'rgba(37,99,235,0.4)',
  rightOfWay: 'rgba(250,204,21,0.45)',
  turnArrow: 'rgba(59,130,246,0.4)',
  uturn: 'rgba(59,130,246,0.4)',
  merge: 'rgba(59,130,246,0.4)',
  stopSign: 'rgba(239,68,68,0.45)',
  trafficFlow: 'rgba(148,163,184,0.4)',
  overtake: 'rgba(59,130,246,0.4)',
  ruralRoad: 'rgba(34,197,94,0.4)',
  cityRoad: 'rgba(100,116,139,0.4)',
  lanes: 'rgba(59,130,246,0.4)',
  shoulder: 'rgba(161,98,7,0.4)',
  distanceGap: 'rgba(59,130,246,0.4)',
  brakeSkid: 'rgba(239,68,68,0.4)',
  hazard: 'rgba(249,115,22,0.45)',
  fatigue: 'rgba(167,139,250,0.4)',
  drowsy: 'rgba(129,140,248,0.4)',
  distraction: 'rgba(239,68,68,0.4)',
  phone: 'rgba(59,130,246,0.4)',
  firstAid: 'rgba(239,68,68,0.45)',
  eco: 'rgba(34,197,94,0.4)',
  weather: 'rgba(148,163,184,0.4)',
  travel: 'rgba(249,115,22,0.4)',
  alcoholEffect: 'rgba(239,68,68,0.4)',
  drugs: 'rgba(168,85,247,0.4)',
  medication: 'rgba(239,68,68,0.4)',
  reaction: 'rgba(59,130,246,0.4)',
  tire: 'rgba(31,41,55,0.5)',
  brakeDisc: 'rgba(148,163,184,0.4)',
  headlight: 'rgba(250,204,21,0.45)',
  inspection: 'rgba(59,130,246,0.4)',
  wrench: 'rgba(100,116,139,0.4)',
  activeSafety: 'rgba(59,130,246,0.4)',
  carSeat: 'rgba(249,115,22,0.4)',
  ecoLabel: 'rgba(34,197,94,0.4)',
  cargo: 'rgba(161,98,7,0.4)',
  visibility: 'rgba(59,130,246,0.4)',
  sensor: 'rgba(59,130,246,0.4)',
  truck: 'rgba(249,115,22,0.4)',
  trailer: 'rgba(100,116,139,0.4)',
  plate: 'rgba(250,204,21,0.4)',
  idCard: 'rgba(59,130,246,0.4)',
  points: 'rgba(250,204,21,0.45)',
  medicalCheck: 'rgba(59,130,246,0.4)',
  behavior: 'rgba(239,68,68,0.4)',
  wheelClamp: 'rgba(51,65,85,0.45)',
  scooter: 'rgba(14,165,233,0.4)',
};
