/**
 * Original educational diagrams for traffic situations that aren't a
 * catalogued vertical sign — road markings, traffic light states, and
 * officer hand signals — so questions about them aren't left as text-only.
 * These are NOT <TrafficSign> entries: they have no R-/P-/S- catalog code
 * to verify against, because they aren't signs, they're situations. Content
 * using one of these sets `image.imageType: 'diagram'` (see helpers.ts'
 * `diagram:<key>` convention) so the UI/admin never mistakes an original
 * schematic for official DGT artwork.
 */
import type { CSSProperties } from 'react';

export type DiagramKey =
  | 'linea-continua'
  | 'linea-discontinua'
  | 'linea-amarilla-borde'
  | 'flechas-carril'
  | 'semaforo-ambar-fijo'
  | 'semaforo-flecha-verde'
  | 'semaforo-ambar-intermitente'
  | 'agente-brazo-levantado';

const ASPHALT = '#3a4150';
const WHITE = '#ffffff';
const YELLOW = '#f5c518';
const AMBER = '#f5a623';
const GREEN = '#2ecc71';
const OFF_LIGHT = '#3a4150';
const HOUSING = '#20242e';
const SKIN = '#e8b98a';

function RoadTopDown({ children }: { children?: React.ReactNode }) {
  return (
    <svg viewBox="0 0 100 100" role="img" aria-hidden="true">
      <rect x="0" y="0" width="100" height="100" rx="10" fill={ASPHALT} />
      {children}
    </svg>
  );
}

function TrafficLightHousing({ children }: { children?: React.ReactNode }) {
  return (
    <svg viewBox="0 0 100 100" role="img" aria-hidden="true">
      <rect x="34" y="6" width="32" height="82" rx="8" fill={HOUSING} />
      {children}
    </svg>
  );
}

const registry: Record<DiagramKey, () => React.ReactNode> = {
  'linea-continua': () => (
    <RoadTopDown>
      <line x1="50" y1="4" x2="50" y2="96" stroke={WHITE} strokeWidth="6" />
    </RoadTopDown>
  ),
  'linea-discontinua': () => (
    <RoadTopDown>
      <line x1="50" y1="2" x2="50" y2="98" stroke={WHITE} strokeWidth="6" strokeDasharray="14 10" />
    </RoadTopDown>
  ),
  'linea-amarilla-borde': () => (
    <RoadTopDown>
      <line x1="14" y1="4" x2="14" y2="96" stroke={YELLOW} strokeWidth="7" />
    </RoadTopDown>
  ),
  'flechas-carril': () => (
    <RoadTopDown>
      <line x1="50" y1="4" x2="50" y2="96" stroke={WHITE} strokeWidth="4" strokeDasharray="12 10" opacity="0.5" />
      <polygon points="50,20 62,46 54,46 54,68 46,68 46,46 38,46" fill={WHITE} />
    </RoadTopDown>
  ),
  'semaforo-ambar-fijo': () => (
    <TrafficLightHousing>
      <circle cx="50" cy="24" r="10" fill={OFF_LIGHT} />
      <circle cx="50" cy="50" r="11" fill={AMBER} />
      <circle cx="50" cy="76" r="10" fill={OFF_LIGHT} />
    </TrafficLightHousing>
  ),
  'semaforo-flecha-verde': () => (
    <TrafficLightHousing>
      <circle cx="50" cy="24" r="10" fill={OFF_LIGHT} />
      <circle cx="50" cy="50" r="10" fill={OFF_LIGHT} />
      <circle cx="50" cy="76" r="11" fill={GREEN} />
      <polygon points="50,68 58,80 52,80 52,86 48,86 48,80 42,80" fill={HOUSING} />
    </TrafficLightHousing>
  ),
  'semaforo-ambar-intermitente': () => (
    <TrafficLightHousing>
      <circle cx="50" cy="24" r="10" fill={OFF_LIGHT} />
      <circle cx="50" cy="50" r="11" fill={AMBER} opacity="0.55" />
      <circle cx="50" cy="76" r="10" fill={OFF_LIGHT} />
      <path d="M68 42 L76 34 M70 50 L80 50 M68 58 L76 66" stroke={AMBER} strokeWidth="3.5" strokeLinecap="round" fill="none" />
    </TrafficLightHousing>
  ),
  'agente-brazo-levantado': () => (
    <svg viewBox="0 0 100 100" role="img" aria-hidden="true">
      <circle cx="48" cy="22" r="10" fill={SKIN} />
      <rect x="38" y="34" width="20" height="34" rx="8" fill={HOUSING} />
      <rect x="38" y="8" width="22" height="8" rx="4" fill={HOUSING} />
      <line x1="48" y1="36" x2="48" y2="6" stroke={SKIN} strokeWidth="7" strokeLinecap="round" />
      <line x1="42" y1="66" x2="38" y2="94" stroke={HOUSING} strokeWidth="7" strokeLinecap="round" />
      <line x1="54" y1="66" x2="58" y2="94" stroke={HOUSING} strokeWidth="7" strokeLinecap="round" />
    </svg>
  ),
};

/** Renders one of our own situation diagrams. Falls back to nothing for unknown keys. */
export function SituationDiagram({ diagramKey, size = 96, style }: { diagramKey: DiagramKey; size?: number; style?: CSSProperties }) {
  const render = registry[diagramKey];
  if (!render) return null;
  return (
    <div
      style={{
        width: size,
        height: size,
        filter: 'drop-shadow(0 6px 14px rgba(11,30,61,0.12))',
        ...style,
      }}
    >
      {render()}
    </div>
  );
}

export const DIAGRAM_KEYS = Object.keys(registry) as DiagramKey[];
