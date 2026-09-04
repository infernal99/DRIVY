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
  | 'agente-brazo-levantado'
  | 'cruce-prioridad-derecha'
  | 'rotonda-prioridad-interior'
  | 'pendiente-estrecha-prioridad'
  | 'adelantamiento-espacio-seguro'
  | 'adelantamiento-curva-prohibido'
  | 'carril-reversible'
  | 'carril-vao'
  | 'peaton-cruce-no-senalizado'
  | 'ciclista-distancia-lateral'
  | 'peaton-paso-senalizado-cruzando'
  | 'eleccion-carril-flechas'
  | 'interseccion-stop-obligatorio'
  | 'interseccion-ceda-paso'
  | 'via-pavimentada-prioridad'
  | 'glorieta-salida-carril-derecho'
  | 'glorieta-salida-carril-interior-excepcion'
  | 'glorieta-entrada-izquierda-congestion'
  | 'glorieta-grupo-ciclistas'
  | 'adelantamiento-tres-vehiculos-sin-espacio'
  | 'cambio-carril-intermitente-no-prioridad'
  | 'peaton-aproximandose-paso'
  | 'ciclista-interseccion-prioridad'
  | 'vehiculo-prioritario-cediendo-lateral'
  | 'vehiculo-prioritario-dentro-cruce'
  | 'vehiculo-prioritario-glorieta'
  | 'carril-deceleracion'
  | 'carril-adicional-circunstancial'
  | 'carril-aceleracion'
  | 'estacionamiento-doble-fila'
  | 'parada-prohibida-paso-peatones'
  | 'parada-prohibida-curva-tunel';

const ASPHALT = '#3a4150';
const WHITE = '#ffffff';
const YELLOW = '#f5c518';
const AMBER = '#f5a623';
const GREEN = '#2ecc71';
const OFF_LIGHT = '#3a4150';
const HOUSING = '#20242e';
const SKIN = '#e8b98a';
// Shared colour code across the priority/overtaking diagrams below: the
// vehicle that must yield is grey, the one with right of way is green.
const YIELD_CAR = '#8b93a3';
const PRIORITY_CAR = GREEN;
const PROHIBIT_RED = '#e74c3c';
const DIRT = '#8a7259';

// --- Reusable scene primitives -------------------------------------------
// Small, composable building blocks (car, pedestrian, mini road-signs)
// shared across every diagram in the registry below, so a new situation
// can usually be assembled from these instead of drawn from scratch.

/**
 * Small top-down car glyph, nose pointing up at rotate=0 (0=up, 90=right,
 * 180=down, 270=left). Sized and outlined to stay readable at the diagram's
 * real on-screen size (~110px, not the zoomed-in view used while authoring
 * it) — a dark, muted-grey car on a dark asphalt background needs a light
 * outline or it disappears; a car under ~20% of the canvas reads as a blob.
 */
function Car({ x, y, rotate, color }: { x: number; y: number; rotate: number; color: string }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${rotate})`}>
      <rect x="-10" y="-17" width="20" height="34" rx="5" fill={color} stroke={WHITE} strokeWidth="1.5" strokeOpacity="0.9" />
      <rect x="-6.5" y="-11" width="13" height="10" rx="2.5" fill="rgba(20,26,38,0.55)" />
    </g>
  );
}

/** Priority/emergency vehicle glyph: a Car with a small flashing light bar on top. */
function PriorityVehicle({ x, y, rotate }: { x: number; y: number; rotate: number }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${rotate})`}>
      <rect x="-10" y="-17" width="20" height="34" rx="5" fill={WHITE} stroke="#aab0bd" strokeWidth="1" />
      <rect x="-6.5" y="-11" width="13" height="10" rx="2.5" fill="rgba(120,140,170,0.4)" />
      <rect x="-6" y="-21" width="12" height="6" rx="2" fill={PROHIBIT_RED} />
      <circle cx="-3" cy="-18" r="1.6" fill={WHITE} />
      <circle cx="3" cy="-18" r="1.6" fill={AMBER} />
    </g>
  );
}

const GROUND = '#262b38';

/**
 * A crossroads scene: two asphalt road bands crossing in a "+" over a
 * darker "off-road" ground colour (so the intersection actually reads as
 * an intersection, not an undifferentiated square), each road with a
 * dashed centre line. Replaces the old small corner tick-marks, which
 * read as noise at the diagram's real ~110px render size.
 */
function IntersectionScene({ children }: { children?: React.ReactNode }) {
  return (
    <svg viewBox="0 0 100 100" role="img" aria-hidden="true">
      <rect x="0" y="0" width="100" height="100" rx="10" fill={GROUND} />
      <rect x="0" y="32" width="100" height="36" fill={ASPHALT} />
      <rect x="32" y="0" width="36" height="100" fill={ASPHALT} />
      <line x1="0" y1="50" x2="100" y2="50" stroke={WHITE} strokeWidth="2.5" strokeDasharray="8 6" opacity="0.7" />
      <line x1="50" y1="0" x2="50" y2="100" stroke={WHITE} strokeWidth="2.5" strokeDasharray="8 6" opacity="0.7" />
      {children}
    </svg>
  );
}

/** Miniature STOP octagon, for placing a real sign inline within a scene. */
function MiniStop({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <polygon
        points="-7,-3 -3,-7 3,-7 7,-3 7,3 3,7 -3,7 -7,3"
        fill={PROHIBIT_RED}
        stroke={WHITE}
        strokeWidth="1.2"
      />
    </g>
  );
}

/** Miniature "Ceda el paso" inverted triangle, for placing inline within a scene. */
function MiniYield({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <polygon points="0,8 8,-7 -8,-7" fill={WHITE} stroke={PROHIBIT_RED} strokeWidth="2.2" />
    </g>
  );
}

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
  // Unsignalised crossroads: the grey car must yield to the green car
  // arriving from its right (norma general de prioridad a la derecha).
  'cruce-prioridad-derecha': () => (
    <IntersectionScene>
      <Car x={50} y={84} rotate={0} color={YIELD_CAR} />
      <Car x={84} y={50} rotate={270} color={PRIORITY_CAR} />
    </IntersectionScene>
  ),
  // Roundabout: the green car already circulating inside has priority over
  // the grey car waiting to enter.
  'rotonda-prioridad-interior': () => (
    <svg viewBox="0 0 100 100" role="img" aria-hidden="true">
      <rect x="0" y="0" width="100" height="100" rx="10" fill={ASPHALT} />
      <circle cx="50" cy="50" r="32" fill="none" stroke={WHITE} strokeWidth="3" opacity="0.6" />
      <circle cx="50" cy="50" r="16" fill={HOUSING} />
      <Car x={50} y={82} rotate={0} color={YIELD_CAR} />
      <Car x={18} y={50} rotate={180} color={PRIORITY_CAR} />
    </svg>
  ),
  // Narrow steep stretch: the green car going uphill has priority over the
  // grey car coming down, which must wait or reverse to a pull-out.
  'pendiente-estrecha-prioridad': () => (
    <svg viewBox="0 0 100 100" role="img" aria-hidden="true">
      <rect x="0" y="0" width="100" height="100" rx="10" fill={ASPHALT} />
      <line x1="12" y1="88" x2="88" y2="12" stroke="#4a5468" strokeWidth="26" strokeLinecap="round" />
      <line x1="12" y1="88" x2="88" y2="12" stroke={WHITE} strokeWidth="3" strokeDasharray="8 6" opacity="0.6" />
      <polygon points="61,55 68,62 61,69 57,62" fill="#5c6478" />
      <polygon points="39,31 46,38 39,45 35,38" fill="#5c6478" />
      <Car x={26} y={74} rotate={45} color={PRIORITY_CAR} />
      <Car x={74} y={26} rotate={225} color={YIELD_CAR} />
    </svg>
  ),
  // Safe overtaking: the green car has already moved into the (currently
  // empty) opposing lane, past the slower grey vehicle, with enough space
  // and visibility ahead.
  'adelantamiento-espacio-seguro': () => (
    <RoadTopDown>
      <line x1="50" y1="2" x2="50" y2="98" stroke={WHITE} strokeWidth="4" strokeDasharray="10 8" opacity="0.6" />
      <Car x={66} y={62} rotate={0} color={YIELD_CAR} />
      <Car x={32} y={38} rotate={0} color={PRIORITY_CAR} />
    </RoadTopDown>
  ),
  // Overtaking forbidden on a bend with no visibility: a prohibition
  // roundel sits over the blind curve ahead of the (grey) car.
  'adelantamiento-curva-prohibido': () => (
    <svg viewBox="0 0 100 100" role="img" aria-hidden="true">
      <rect x="0" y="0" width="100" height="100" rx="10" fill={ASPHALT} />
      <path d="M18,90 Q18,18 90,18" stroke="#4a5468" strokeWidth="22" strokeLinecap="round" fill="none" />
      <path
        d="M18,90 Q18,18 90,18"
        stroke={WHITE}
        strokeWidth="3"
        strokeDasharray="8 6"
        opacity="0.6"
        fill="none"
      />
      <Car x={18} y={78} rotate={0} color={YIELD_CAR} />
      <circle cx="66" cy="24" r="15" fill={PROHIBIT_RED} stroke={WHITE} strokeWidth="2.5" />
      <line x1="57" y1="15" x2="75" y2="33" stroke={WHITE} strokeWidth="3.5" strokeLinecap="round" />
    </svg>
  ),
  // Reversible lane: overhead panels over each lane show whether it's open
  // (green arrow) or closed (red cross) in the current direction.
  'carril-reversible': () => (
    <RoadTopDown>
      <line x1="34" y1="4" x2="34" y2="96" stroke={WHITE} strokeWidth="2.5" strokeDasharray="8 6" opacity="0.5" />
      <line x1="66" y1="4" x2="66" y2="96" stroke={WHITE} strokeWidth="2.5" strokeDasharray="8 6" opacity="0.5" />
      <rect x="10" y="10" width="16" height="16" rx="3" fill={HOUSING} stroke={WHITE} strokeWidth="1.5" />
      <line x1="14" y1="14" x2="22" y2="22" stroke={PROHIBIT_RED} strokeWidth="3" strokeLinecap="round" />
      <line x1="22" y1="14" x2="14" y2="22" stroke={PROHIBIT_RED} strokeWidth="3" strokeLinecap="round" />
      <rect x="42" y="10" width="16" height="16" rx="3" fill={HOUSING} stroke={WHITE} strokeWidth="1.5" />
      <polygon points="50,12 56,22 52,22 52,26 48,26 48,22 44,22" fill={GREEN} />
    </RoadTopDown>
  ),
  // VAO lane: a painted diamond plus two occupant dots mark the lane
  // reserved for vehicles with a minimum number of people aboard.
  'carril-vao': () => (
    <RoadTopDown>
      <line x1="50" y1="4" x2="50" y2="96" stroke={WHITE} strokeWidth="2.5" strokeDasharray="8 6" opacity="0.5" />
      <polygon points="74,34 84,50 74,66 64,50" fill="none" stroke={WHITE} strokeWidth="3" />
      <circle cx="70" cy="48" r="4" fill={WHITE} />
      <circle cx="78" cy="48" r="4" fill={WHITE} />
    </RoadTopDown>
  ),
  // Pedestrian crossing outside a marked crossing: no zebra stripes here
  // (unlike the paso-peatones sign/diagrams elsewhere), so the pedestrian
  // has no automatic priority and the driver must stay alert.
  'peaton-cruce-no-senalizado': () => (
    <RoadTopDown>
      <line x1="50" y1="4" x2="50" y2="96" stroke={WHITE} strokeWidth="3" strokeDasharray="10 8" opacity="0.5" />
      <Car x={50} y={82} rotate={0} color={YIELD_CAR} />
      <circle cx="66" cy="40" r="7" fill={SKIN} />
      <rect x="60" y="47" width="12" height="20" rx="5" fill={HOUSING} />
      <path d="M78 26 L82 34 L74 34 Z" fill={AMBER} />
      <line x1="78" y1="29" x2="78" y2="31.5" stroke={HOUSING} strokeWidth="1.4" strokeLinecap="round" />
      <circle cx="78" cy="33" r="0.9" fill={HOUSING} />
    </RoadTopDown>
  ),
  // Overtaking a cyclist: the minimum 1.5 m lateral gap, shown as a
  // measured double-headed arrow between the bike and the passing car.
  'ciclista-distancia-lateral': () => (
    <RoadTopDown>
      <line x1="50" y1="4" x2="50" y2="96" stroke={WHITE} strokeWidth="3" strokeDasharray="10 8" opacity="0.5" />
      <g transform="translate(70 50)">
        <circle cx="0" cy="-16" r="7" fill="#8b93a3" />
        <circle cx="-6" cy="14" r="7" fill="none" stroke={WHITE} strokeWidth="2.5" />
        <circle cx="6" cy="14" r="7" fill="none" stroke={WHITE} strokeWidth="2.5" />
        <line x1="-6" y1="14" x2="0" y2="-6" stroke={WHITE} strokeWidth="2.5" />
        <line x1="6" y1="14" x2="0" y2="-6" stroke={WHITE} strokeWidth="2.5" />
        <line x1="0" y1="-6" x2="0" y2="-9" stroke={WHITE} strokeWidth="2.5" />
      </g>
      <Car x={22} y={50} rotate={0} color={PRIORITY_CAR} />
      <line x1="36" y1="50" x2="58" y2="50" stroke={AMBER} strokeWidth="2.5" />
      <polygon points="36,50 42,46 42,54" fill={AMBER} />
      <polygon points="58,50 52,46 52,54" fill={AMBER} />
    </RoadTopDown>
  ),
  // Pedestrian already crossing at a marked, striped crossing: the waiting
  // (yielding) car must let them finish crossing.
  'peaton-paso-senalizado-cruzando': () => (
    <RoadTopDown>
      <rect x="10" y="42" width="10" height="16" fill={WHITE} />
      <rect x="26" y="42" width="10" height="16" fill={WHITE} />
      <rect x="42" y="42" width="10" height="16" fill={WHITE} />
      <rect x="58" y="42" width="10" height="16" fill={WHITE} />
      <rect x="74" y="42" width="10" height="16" fill={WHITE} />
      <circle cx="50" cy="34" r="6" fill={SKIN} />
      <rect x="45" y="40" width="10" height="18" rx="4" fill={HOUSING} />
      <Car x={50} y={82} rotate={0} color={YIELD_CAR} />
    </RoadTopDown>
  ),
  // Lane-choice at a straight/left-turn split: painted arrows dictate
  // which lane the car must be in to continue straight ahead.
  'eleccion-carril-flechas': () => (
    <RoadTopDown>
      <line x1="50" y1="4" x2="50" y2="96" stroke={WHITE} strokeWidth="2.5" opacity="0.6" />
      <g transform="translate(28 30)">
        <line x1="0" y1="14" x2="0" y2="-10" stroke={WHITE} strokeWidth="4" strokeLinecap="round" />
        <line x1="0" y1="-10" x2="-10" y2="-10" stroke={WHITE} strokeWidth="4" strokeLinecap="round" />
        <polygon points="-10,-16 -10,-4 -18,-10" fill={WHITE} />
      </g>
      <polygon points="72,10 78,24 74,24 74,34 70,34 70,24 66,24" fill={WHITE} />
      <Car x={72} y={70} rotate={0} color={PRIORITY_CAR} />
    </RoadTopDown>
  ),
  // STOP-regulated crossroads: the sign is visible next to the yield car,
  // which must come to a complete stop even though the priority car isn't
  // there yet — unlike Ceda el paso, STOP is never optional.
  'interseccion-stop-obligatorio': () => (
    <IntersectionScene>
      <Car x={50} y={84} rotate={0} color={YIELD_CAR} />
      <MiniStop x={68} y={84} />
      <Car x={84} y={50} rotate={270} color={PRIORITY_CAR} />
    </IntersectionScene>
  ),
  // Ceda el paso crossroads: same layout as the STOP scene, but the sign is
  // a yield triangle — the driver only has to stop if it's actually
  // necessary to let the priority car through, not as an unconditional rule.
  'interseccion-ceda-paso': () => (
    <IntersectionScene>
      <Car x={50} y={84} rotate={0} color={YIELD_CAR} />
      <MiniYield x={68} y={84} />
      <Car x={84} y={50} rotate={270} color={PRIORITY_CAR} />
    </IntersectionScene>
  ),
  // Paved road vs. dirt track: the car on the paved surface (grey texture)
  // has priority over the one coming from the unpaved track (dirt texture),
  // regardless of which one is on the geometric right.
  'via-pavimentada-prioridad': () => (
    <svg viewBox="0 0 100 100" role="img" aria-hidden="true">
      <rect x="0" y="0" width="100" height="100" rx="10" fill={DIRT} />
      <rect x="0" y="0" width="100" height="100" rx="10" fill={DIRT} opacity="0.35" />
      <circle cx="18" cy="18" r="1.2" fill="#6e5940" />
      <circle cx="30" cy="10" r="1" fill="#6e5940" />
      <circle cx="12" cy="32" r="1" fill="#6e5940" />
      <circle cx="82" cy="80" r="1.2" fill="#6e5940" />
      <circle cx="70" cy="88" r="1" fill="#6e5940" />
      <rect x="38" y="0" width="24" height="100" fill={ASPHALT} />
      <line x1="50" y1="4" x2="50" y2="96" stroke={WHITE} strokeWidth="3" strokeDasharray="8 6" opacity="0.5" />
      <Car x={50} y={80} rotate={0} color={PRIORITY_CAR} />
      <Car x={20} y={50} rotate={90} color={YIELD_CAR} />
    </svg>
  ),
  // Roundabout — leaving from the outer (right) lane, positioned there with
  // enough advance notice: the general rule (DGT "6 situaciones").
  'glorieta-salida-carril-derecho': () => (
    <svg viewBox="0 0 100 100" role="img" aria-hidden="true">
      <rect x="0" y="0" width="100" height="100" rx="10" fill={ASPHALT} />
      <circle cx="50" cy="50" r="34" fill="none" stroke={WHITE} strokeWidth="2" opacity="0.4" />
      <circle cx="50" cy="50" r="22" fill="none" stroke={WHITE} strokeWidth="2" strokeDasharray="6 5" opacity="0.4" />
      <circle cx="50" cy="50" r="14" fill={HOUSING} />
      <Car x={84} y={50} rotate={90} color={PRIORITY_CAR} />
      <line x1="96" y1="50" x2="100" y2="50" stroke={WHITE} strokeWidth="2" opacity="0.4" />
    </svg>
  ),
  // Roundabout — the exception: leaving from an inner lane is only allowed
  // when a ground arrow explicitly marks that exit as usable from there.
  'glorieta-salida-carril-interior-excepcion': () => (
    <svg viewBox="0 0 100 100" role="img" aria-hidden="true">
      <rect x="0" y="0" width="100" height="100" rx="10" fill={ASPHALT} />
      <circle cx="50" cy="50" r="34" fill="none" stroke={WHITE} strokeWidth="2" opacity="0.4" />
      <circle cx="50" cy="50" r="22" fill="none" stroke={WHITE} strokeWidth="2" strokeDasharray="6 5" opacity="0.4" />
      <circle cx="50" cy="50" r="14" fill={HOUSING} />
      <Car x={67} y={67} rotate={45} color={PRIORITY_CAR} />
      <polygon points="80,80 87,88 82,88 82,94 78,94 78,88 73,88" fill={WHITE} />
    </svg>
  ),
  // Roundabout — entering from the left lane when the right one is jammed:
  // allowed to merge straight into the inner ring.
  'glorieta-entrada-izquierda-congestion': () => (
    <svg viewBox="0 0 100 100" role="img" aria-hidden="true">
      <rect x="0" y="0" width="100" height="100" rx="10" fill={ASPHALT} />
      <circle cx="50" cy="50" r="30" fill="none" stroke={WHITE} strokeWidth="2" opacity="0.4" />
      <circle cx="50" cy="50" r="14" fill={HOUSING} />
      <line x1="42" y1="82" x2="42" y2="100" stroke={WHITE} strokeWidth="2" strokeDasharray="5 4" opacity="0.4" />
      <Car x={42} y={92} rotate={0} color={YIELD_CAR} />
      <rect x="35" y="84" width="14" height="5" rx="2" fill={YIELD_CAR} opacity="0.55" />
      <Car x={33} y={67} rotate={135} color={PRIORITY_CAR} />
    </svg>
  ),
  // Roundabout — a group of cyclists inside is treated as a single vehicle:
  // once the first one has entered, the whole group keeps its priority.
  'glorieta-grupo-ciclistas': () => (
    <svg viewBox="0 0 100 100" role="img" aria-hidden="true">
      <rect x="0" y="0" width="100" height="100" rx="10" fill={ASPHALT} />
      <circle cx="50" cy="50" r="32" fill="none" stroke={WHITE} strokeWidth="2" opacity="0.4" />
      <circle cx="50" cy="50" r="16" fill={HOUSING} />
      <g transform="translate(30 30)">
        <circle cx="-8" cy="6" r="4" fill="none" stroke={PRIORITY_CAR} strokeWidth="2" />
        <circle cx="8" cy="6" r="4" fill="none" stroke={PRIORITY_CAR} strokeWidth="2" />
        <circle cx="0" cy="-6" r="3" fill={SKIN} />
      </g>
      <g transform="translate(46 22)">
        <circle cx="-8" cy="6" r="4" fill="none" stroke={PRIORITY_CAR} strokeWidth="2" />
        <circle cx="8" cy="6" r="4" fill="none" stroke={PRIORITY_CAR} strokeWidth="2" />
        <circle cx="0" cy="-6" r="3" fill={SKIN} />
      </g>
      <Car x={82} y={70} rotate={135} color={YIELD_CAR} />
    </svg>
  ),
  // Overtaking with three vehicles, exactly the situation to reason about:
  // A (behind slow B) cannot safely start overtaking because C is already
  // close, approaching from the opposite direction.
  'adelantamiento-tres-vehiculos-sin-espacio': () => (
    <RoadTopDown>
      <line x1="50" y1="2" x2="50" y2="98" stroke={WHITE} strokeWidth="3" strokeDasharray="9 7" opacity="0.6" />
      <Car x={50} y={86} rotate={0} color={YIELD_CAR} />
      <Car x={50} y={50} rotate={0} color={YIELD_CAR} />
      <Car x={50} y={14} rotate={180} color={PROHIBIT_RED} />
    </RoadTopDown>
  ),
  // Signalling a lane change does not, by itself, grant priority: the grey
  // car has its indicator on but must still yield to the green car already
  // established in the destination lane.
  'cambio-carril-intermitente-no-prioridad': () => (
    <RoadTopDown>
      <line x1="50" y1="4" x2="50" y2="96" stroke={WHITE} strokeWidth="3" strokeDasharray="9 7" opacity="0.5" />
      <Car x={70} y={50} rotate={0} color={YIELD_CAR} />
      <path d="M60 44 L52 44 L52 38 L44 47 L52 56 L52 50 L60 50 Z" fill={AMBER} />
      <Car x={34} y={36} rotate={0} color={PRIORITY_CAR} />
    </RoadTopDown>
  ),
  // Pedestrian on the kerb, clearly about to step onto a marked crossing —
  // not yet crossing, unlike peaton-paso-senalizado-cruzando. The driver
  // must anticipate and be ready to stop, not just react once they step out.
  'peaton-aproximandose-paso': () => (
    <RoadTopDown>
      <rect x="10" y="42" width="10" height="16" fill={WHITE} />
      <rect x="26" y="42" width="10" height="16" fill={WHITE} />
      <rect x="42" y="42" width="10" height="16" fill={WHITE} />
      <rect x="58" y="42" width="10" height="16" fill={WHITE} />
      <rect x="74" y="42" width="10" height="16" fill={WHITE} />
      <circle cx="90" cy="34" r="6" fill={SKIN} />
      <rect x="85" y="40" width="10" height="18" rx="4" fill={HOUSING} />
      <Car x={50} y={82} rotate={0} color={YIELD_CAR} />
    </RoadTopDown>
  ),
  // Cyclist arriving from the right at an unsignalised intersection: same
  // priority-to-the-right treatment as any other vehicle, no special
  // exception reducing it just for being a bicycle.
  'ciclista-interseccion-prioridad': () => (
    <IntersectionScene>
      <Car x={50} y={84} rotate={0} color={YIELD_CAR} />
      <g transform="translate(84 50) rotate(270)">
        <circle cx="-9" cy="9" r="7" fill="none" stroke={PRIORITY_CAR} strokeWidth="3" />
        <circle cx="9" cy="9" r="7" fill="none" stroke={PRIORITY_CAR} strokeWidth="3" />
        <circle cx="0" cy="-10" r="5" fill={SKIN} />
        <line x1="-9" y1="9" x2="0" y2="-5" stroke={PRIORITY_CAR} strokeWidth="3" />
        <line x1="9" y1="9" x2="0" y2="-5" stroke={PRIORITY_CAR} strokeWidth="3" />
      </g>
    </IntersectionScene>
  ),
  // A car pulling smoothly toward the right margin, well ahead of an
  // emergency vehicle approaching from behind — the correct, gradual way
  // to make way, without slamming the brakes.
  'vehiculo-prioritario-cediendo-lateral': () => (
    <RoadTopDown>
      <line x1="50" y1="4" x2="50" y2="96" stroke={WHITE} strokeWidth="3" strokeDasharray="9 7" opacity="0.5" />
      <Car x={64} y={60} rotate={-15} color={YIELD_CAR} />
      <PriorityVehicle x={50} y={20} rotate={0} />
    </RoadTopDown>
  ),
  // Caught inside a crossroads when an emergency vehicle appears on the
  // cross street: the right move is to clear the intersection, not stop
  // abruptly in the middle of it.
  'vehiculo-prioritario-dentro-cruce': () => (
    <IntersectionScene>
      <Car x={50} y={50} rotate={0} color={YIELD_CAR} />
      <PriorityVehicle x={86} y={50} rotate={270} />
    </IntersectionScene>
  ),
  // Roundabout: an emergency vehicle enters via the outer lane while a car
  // is already circulating inside — that car must yield without cutting
  // across its path, and still leave by the outer lane as usual.
  'vehiculo-prioritario-glorieta': () => (
    <svg viewBox="0 0 100 100" role="img" aria-hidden="true">
      <rect x="0" y="0" width="100" height="100" rx="10" fill={ASPHALT} />
      <circle cx="50" cy="50" r="32" fill="none" stroke={WHITE} strokeWidth="2" opacity="0.4" />
      <circle cx="50" cy="50" r="16" fill={HOUSING} />
      <Car x={26} y={50} rotate={180} color={YIELD_CAR} />
      <PriorityVehicle x={50} y={88} rotate={0} />
    </svg>
  ),
  // Deceleration lane: a car peels off the main carriageway into the
  // widening auxiliary lane to slow down before leaving the road.
  'carril-deceleracion': () => (
    <RoadTopDown>
      <line x1="72" y1="0" x2="72" y2="60" stroke={WHITE} strokeWidth="2.5" opacity="0.5" />
      <path d="M72 60 Q72 90 96 96" stroke={WHITE} strokeWidth="2.5" opacity="0.5" fill="none" />
      <line x1="40" y1="0" x2="40" y2="100" stroke={WHITE} strokeWidth="3" strokeDasharray="9 7" opacity="0.5" />
      <Car x={56} y={30} rotate={0} color={YIELD_CAR} />
      <Car x={82} y={78} rotate={35} color={PRIORITY_CAR} />
    </RoadTopDown>
  ),
  // Circumstantial additional lane: the hard shoulder opened as an extra
  // lane during heavy holiday traffic, speed-limited to 60-80 km/h.
  'carril-adicional-circunstancial': () => (
    <RoadTopDown>
      <line x1="34" y1="0" x2="34" y2="100" stroke={WHITE} strokeWidth="2.5" strokeDasharray="8 6" opacity="0.4" />
      <line x1="66" y1="0" x2="66" y2="100" stroke={WHITE} strokeWidth="2.5" strokeDasharray="8 6" opacity="0.4" />
      <rect x="4" y="4" width="24" height="16" rx="3" fill={HOUSING} stroke={WHITE} strokeWidth="1.5" />
      <text x="16" y="16" fontSize="11" fill={WHITE} textAnchor="middle" fontWeight="700">
        80
      </text>
      <Car x={18} y={70} rotate={0} color={PRIORITY_CAR} />
      <Car x={50} y={40} rotate={0} color={YIELD_CAR} />
    </RoadTopDown>
  ),
  // Acceleration lane: merging onto the main carriageway must yield to
  // traffic already on it, same underlying rule as art. 72 RGC.
  'carril-aceleracion': () => (
    <RoadTopDown>
      <line x1="60" y1="0" x2="60" y2="100" stroke={WHITE} strokeWidth="2.5" opacity="0.5" />
      <path d="M60 100 Q60 70 36 62" stroke={WHITE} strokeWidth="2.5" opacity="0.5" fill="none" />
      <Car x={76} y={40} rotate={0} color={PRIORITY_CAR} />
      <Car x={28} y={78} rotate={20} color={YIELD_CAR} />
    </RoadTopDown>
  ),
  // Double-row parking: a car stops right alongside one already legally
  // parked at the kerb, blocking the lane for everyone else.
  'estacionamiento-doble-fila': () => (
    <RoadTopDown>
      <Car x={16} y={50} rotate={0} color={YIELD_CAR} />
      <Car x={40} y={50} rotate={0} color={PROHIBIT_RED} />
      <line x1="70" y1="4" x2="70" y2="96" stroke={WHITE} strokeWidth="3" strokeDasharray="9 7" opacity="0.6" />
    </RoadTopDown>
  ),
  // Stopping right on a marked pedestrian crossing — forbidden even for a
  // brief "parada", not only for leaving the car unattended.
  'parada-prohibida-paso-peatones': () => (
    <RoadTopDown>
      <rect x="10" y="42" width="10" height="16" fill={WHITE} />
      <rect x="26" y="42" width="10" height="16" fill={WHITE} />
      <rect x="42" y="42" width="10" height="16" fill={WHITE} />
      <rect x="58" y="42" width="10" height="16" fill={WHITE} />
      <rect x="74" y="42" width="10" height="16" fill={WHITE} />
      <Car x={50} y={50} rotate={0} color={PROHIBIT_RED} />
    </RoadTopDown>
  ),
  // Stopping in a low-visibility bend — one of the spots where even a
  // brief "parada" is forbidden, not just parking.
  'parada-prohibida-curva-tunel': () => (
    <svg viewBox="0 0 100 100" role="img" aria-hidden="true">
      <rect x="0" y="0" width="100" height="100" rx="10" fill={ASPHALT} />
      <path d="M18,90 Q18,18 90,18" stroke="#4a5468" strokeWidth="22" strokeLinecap="round" fill="none" />
      <path d="M18,90 Q18,18 90,18" stroke={WHITE} strokeWidth="3" strokeDasharray="8 6" opacity="0.6" fill="none" />
      <Car x={30} y={70} rotate={335} color={PROHIBIT_RED} />
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
