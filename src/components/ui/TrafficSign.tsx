/**
 * Original, hand-built vector illustrations of traffic signs.
 *
 * We do NOT have a license to redistribute the DGT's official sign artwork,
 * so every sign here is our own simplified drawing. We only reuse the
 * internationally standardized shape + color grammar (red triangle = danger,
 * red circle = prohibition, blue circle = mandatory, blue square = info —
 * per the Vienna Convention on Road Signs, which Spain's Reglamento General
 * de Circulación also follows) — never DGT's proprietary pictogram artwork.
 * See src/data/sources.ts for the regulation this grammar is grounded in.
 */
import type { CSSProperties } from 'react';

export type SignKey =
  | 'ceda-el-paso'
  | 'stop'
  | 'prohibido-adelantar'
  | 'limite-velocidad-50'
  | 'limite-velocidad-90'
  | 'fin-limite-velocidad'
  | 'direccion-obligatoria-recto'
  | 'paso-peatones'
  | 'interseccion-prioridad'
  | 'obras'
  | 'curva-peligrosa-derecha'
  | 'glorieta-obligatoria'
  | 'prohibido-aparcar'
  | 'aparcamiento'
  | 'autopista'
  | 'fin-autopista'
  | 'paso-nivel'
  | 'animales-sueltos'
  | 'prohibido-paso-peatones'
  | 'circulacion-prohibida-ambos-sentidos'
  | 'velocidad-minima-40'
  | 'carril-bici';

const RED = '#e5484d';
const BLUE = '#2f6fed';
const DARK = '#10192e';

function Triangle({ children }: { children?: React.ReactNode }) {
  return (
    <svg viewBox="0 0 100 100" role="img" aria-hidden="true">
      <polygon points="50,6 96,90 4,90" fill="#fff" stroke={RED} strokeWidth="7" strokeLinejoin="round" />
      {children}
    </svg>
  );
}

function Circle({ bg = '#fff', border = RED, children }: { bg?: string; border?: string; children?: React.ReactNode }) {
  return (
    <svg viewBox="0 0 100 100" role="img" aria-hidden="true">
      <circle cx="50" cy="50" r="44" fill={bg} stroke={border} strokeWidth="8" />
      {children}
    </svg>
  );
}

function Square({ bg = BLUE, children }: { bg?: string; children?: React.ReactNode }) {
  return (
    <svg viewBox="0 0 100 100" role="img" aria-hidden="true">
      <rect x="6" y="6" width="88" height="88" rx="10" fill={bg} />
      {children}
    </svg>
  );
}

function Octagon() {
  return (
    <svg viewBox="0 0 100 100" role="img" aria-hidden="true">
      <polygon
        points="32,4 68,4 96,32 96,68 68,96 32,96 4,68 4,32"
        fill={RED}
        stroke="#fff"
        strokeWidth="3"
      />
      <text x="50" y="62" textAnchor="middle" fontFamily="Fredoka, sans-serif" fontWeight={700} fontSize="26" fill="#fff">
        STOP
      </text>
    </svg>
  );
}

const registry: Record<SignKey, () => React.ReactNode> = {
  'ceda-el-paso': () => (
    <svg viewBox="0 0 100 100" role="img" aria-hidden="true">
      <polygon points="50,94 96,10 4,10" fill="#fff" stroke={RED} strokeWidth="7" strokeLinejoin="round" />
    </svg>
  ),
  stop: () => <Octagon />,
  'prohibido-adelantar': () => (
    <Circle>
      <rect x="18" y="60" width="26" height="14" rx="3" fill={DARK} />
      <rect x="56" y="60" width="26" height="14" rx="3" fill={RED} />
      <rect x="14" y="40" width="72" height="8" fill={RED} transform="rotate(-32 50 44)" />
    </Circle>
  ),
  'limite-velocidad-50': () => (
    <Circle>
      <text x="50" y="64" textAnchor="middle" fontFamily="Fredoka, sans-serif" fontWeight={700} fontSize="34" fill={DARK}>50</text>
    </Circle>
  ),
  'limite-velocidad-90': () => (
    <Circle>
      <text x="50" y="64" textAnchor="middle" fontFamily="Fredoka, sans-serif" fontWeight={700} fontSize="30" fill={DARK}>90</text>
    </Circle>
  ),
  'fin-limite-velocidad': () => (
    <Circle border="#9aa3b5">
      <text x="50" y="64" textAnchor="middle" fontFamily="Fredoka, sans-serif" fontWeight={700} fontSize="30" fill="#9aa3b5">50</text>
      <line x1="18" y1="82" x2="82" y2="18" stroke="#9aa3b5" strokeWidth="5" />
    </Circle>
  ),
  'direccion-obligatoria-recto': () => (
    <Circle bg={BLUE} border={BLUE}>
      <polygon points="50,18 72,50 58,50 58,82 42,82 42,50 28,50" fill="#fff" />
    </Circle>
  ),
  'paso-peatones': () => (
    <Square>
      <polygon points="50,20 78,80 22,80" fill="#fff" />
      <circle cx="50" cy="45" r="6" fill={BLUE} />
      <rect x="45" y="53" width="10" height="18" rx="4" fill={BLUE} />
      <line x1="38" y1="58" x2="45" y2="65" stroke={BLUE} strokeWidth="4" strokeLinecap="round" />
      <line x1="62" y1="58" x2="55" y2="65" stroke={BLUE} strokeWidth="4" strokeLinecap="round" />
    </Square>
  ),
  'interseccion-prioridad': () => (
    <Triangle>
      <line x1="50" y1="42" x2="50" y2="78" stroke={DARK} strokeWidth="7" strokeLinecap="round" />
      <line x1="32" y1="60" x2="68" y2="60" stroke={DARK} strokeWidth="7" strokeLinecap="round" />
    </Triangle>
  ),
  obras: () => (
    <Triangle>
      <circle cx="45" cy="46" r="6" fill={DARK} />
      <path d="M45 54 L45 70 M45 58 L36 68 M45 58 L58 66 M45 70 L38 82 M45 70 L54 82" stroke={DARK} strokeWidth="5" strokeLinecap="round" fill="none" />
    </Triangle>
  ),
  'curva-peligrosa-derecha': () => (
    <Triangle>
      <path d="M32 76 C32 50, 60 50, 60 30" stroke={DARK} strokeWidth="7" fill="none" strokeLinecap="round" />
      <polygon points="60,20 72,32 52,34" fill={DARK} />
    </Triangle>
  ),
  'glorieta-obligatoria': () => (
    <Circle bg={BLUE} border={BLUE}>
      <circle cx="50" cy="50" r="18" fill="none" stroke="#fff" strokeWidth="6" />
      <polygon points="66,34 78,34 78,46" fill="#fff" />
    </Circle>
  ),
  'prohibido-aparcar': () => (
    <Circle bg={BLUE} border={RED}>
      <text x="50" y="64" textAnchor="middle" fontFamily="Fredoka, sans-serif" fontWeight={700} fontSize="34" fill="#fff">P</text>
      <line x1="18" y1="82" x2="82" y2="18" stroke={RED} strokeWidth="7" />
    </Circle>
  ),
  aparcamiento: () => (
    <Square>
      <text x="50" y="66" textAnchor="middle" fontFamily="Fredoka, sans-serif" fontWeight={700} fontSize="42" fill="#fff">P</text>
    </Square>
  ),
  autopista: () => (
    <Square>
      <rect x="16" y="40" width="68" height="34" rx="6" fill="#fff" />
      <rect x="16" y="53" width="68" height="4" fill={BLUE} />
    </Square>
  ),
  'fin-autopista': () => (
    <Square bg="#5b6472">
      <rect x="16" y="40" width="68" height="34" rx="6" fill="#fff" />
      <rect x="16" y="53" width="68" height="4" fill="#5b6472" />
      <line x1="14" y1="82" x2="86" y2="18" stroke={RED} strokeWidth="6" />
    </Square>
  ),
  'paso-nivel': () => (
    <Triangle>
      <line x1="26" y1="34" x2="74" y2="82" stroke={DARK} strokeWidth="6" />
      <line x1="74" y1="34" x2="26" y2="82" stroke={DARK} strokeWidth="6" />
      <circle cx="50" cy="58" r="30" fill="none" stroke={DARK} strokeWidth="6" />
    </Triangle>
  ),
  'animales-sueltos': () => (
    <Triangle>
      <ellipse cx="50" cy="64" rx="22" ry="12" fill={DARK} />
      <circle cx="30" cy="54" r="9" fill={DARK} />
      <line x1="36" y1="74" x2="34" y2="86" stroke={DARK} strokeWidth="5" strokeLinecap="round" />
      <line x1="62" y1="74" x2="64" y2="86" stroke={DARK} strokeWidth="5" strokeLinecap="round" />
    </Triangle>
  ),
  'prohibido-paso-peatones': () => (
    <Circle>
      <circle cx="50" cy="38" r="7" fill={DARK} />
      <rect x="44" y="47" width="12" height="20" rx="5" fill={DARK} />
      <line x1="18" y1="82" x2="82" y2="18" stroke={RED} strokeWidth="7" />
    </Circle>
  ),
  'circulacion-prohibida-ambos-sentidos': () => (
    <Circle bg={RED} border={RED}>
      <rect x="16" y="44" width="68" height="12" rx="2" fill="#fff" />
    </Circle>
  ),
  'velocidad-minima-40': () => (
    <Circle bg={BLUE} border={BLUE}>
      <text x="50" y="64" textAnchor="middle" fontFamily="Fredoka, sans-serif" fontWeight={700} fontSize="30" fill="#fff">40</text>
    </Circle>
  ),
  'carril-bici': () => (
    <Circle bg={BLUE} border={BLUE}>
      <circle cx="34" cy="66" r="9" fill="none" stroke="#fff" strokeWidth="4" />
      <circle cx="66" cy="66" r="9" fill="none" stroke="#fff" strokeWidth="4" />
      <path d="M34 66 L46 38 L58 38 M46 38 L66 66 M50 50 L38 50" stroke="#fff" strokeWidth="4" fill="none" strokeLinecap="round" />
    </Circle>
  ),
};

/** Renders one of our own sign illustrations. Falls back to nothing for unknown keys. */
export function TrafficSign({ signKey, size = 96, style }: { signKey: SignKey; size?: number; style?: CSSProperties }) {
  const render = registry[signKey];
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

export const SIGN_KEYS = Object.keys(registry) as SignKey[];
