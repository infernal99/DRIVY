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
      <text x="50" y="62" textAnchor="middle" style={{ fontFamily: 'var(--font-display)' }} fontWeight={700} fontSize="26" fill="#fff">
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
      <text x="50" y="64" textAnchor="middle" style={{ fontFamily: 'var(--font-display)' }} fontWeight={700} fontSize="34" fill={DARK}>50</text>
    </Circle>
  ),
  'limite-velocidad-90': () => (
    <Circle>
      <text x="50" y="64" textAnchor="middle" style={{ fontFamily: 'var(--font-display)' }} fontWeight={700} fontSize="30" fill={DARK}>90</text>
    </Circle>
  ),
  'fin-limite-velocidad': () => (
    <Circle border="#9aa3b5">
      <text x="50" y="64" textAnchor="middle" style={{ fontFamily: 'var(--font-display)' }} fontWeight={700} fontSize="30" fill="#9aa3b5">50</text>
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
  // A generic upright stick figure (head + straight body + spread limbs)
  // reads as a pedestrian, not a worker — indistinguishable from a danger
  // sign for peatones. Redrawn bent forward over a shovel so the digging
  // posture and the tool itself (not just a person shape) read clearly at
  // the small size this renders at — reported by the user against the live
  // app after the 2026-09-01 audit; that audit had checked this sign's
  // code/meaning but not whether its actual pictogram was legible.
  obras: () => (
    <Triangle>
      <circle cx="52" cy="30" r="7" fill={DARK} />
      <path
        d="M52 38 L64 55 M64 55 L74 82 M64 55 L54 82 M58 46 L36 63 M36 63 L26 81"
        stroke={DARK}
        strokeWidth="6"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      <rect x="8" y="72" width="24" height="12" rx="2" fill={DARK} transform="rotate(-32 20 78)" />
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
      <text x="50" y="64" textAnchor="middle" style={{ fontFamily: 'var(--font-display)' }} fontWeight={700} fontSize="34" fill="#fff">P</text>
      <line x1="18" y1="82" x2="82" y2="18" stroke={RED} strokeWidth="7" />
    </Circle>
  ),
  aparcamiento: () => (
    <Square>
      <text x="50" y="66" textAnchor="middle" style={{ fontFamily: 'var(--font-display)' }} fontWeight={700} fontSize="42" fill="#fff">P</text>
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
      <text x="50" y="64" textAnchor="middle" style={{ fontFamily: 'var(--font-display)' }} fontWeight={700} fontSize="30" fill="#fff">40</text>
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

// Real vector recreations (public/signs/<key>.svg), vendored from Wikimedia
// Commons — public domain, no-conditions dedications, individually checked
// against the current (post-2025-reform) catalogue during the 2026-09-01
// content-quality audit (see docs/content-pipeline.md). Deliberately a small
// allowlist, not "use the real file whenever one exists": several Commons
// files for this series turned out to be CC-BY-SA (attribution owed, a
// different author) or superseded by a "2023 set" redesign whose own
// license rests on the same unresolved art. 13 LPI question flagged in
// src/data/sources.ts — those were left on the hand-drawn registry below
// rather than risk an uncleared or outdated image. Extend this list only
// after the same two checks (license + currency), not just because a file
// exists on Commons.
const REAL_SIGN_KEYS = new Set<SignKey>([
  'ceda-el-paso',
  'paso-nivel',
  'obras',
  'prohibido-adelantar',
  'circulacion-prohibida-ambos-sentidos',
  'prohibido-aparcar',
  'animales-sueltos',
  // Second pass (same day): the remaining signs that weren't blocked by a
  // CC-BY-SA license or a "2023 set" government-sourced redesign.
  'curva-peligrosa-derecha',
  'limite-velocidad-50',
  'limite-velocidad-90',
  'autopista',
  'fin-autopista',
  'aparcamiento',
  'prohibido-paso-peatones',
  'carril-bici',
  'velocidad-minima-40',
]);

/** Renders a real vendored sign image where one is cleared for use, otherwise our own illustration. Falls back to nothing for unknown keys. */
export function TrafficSign({ signKey, size = 96, style }: { signKey: SignKey; size?: number; style?: CSSProperties }) {
  if (REAL_SIGN_KEYS.has(signKey)) {
    return (
      <div style={{ width: size, height: size, ...style }}>
        <img src={`/signs/${signKey}.svg`} width={size} height={size} alt="" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
      </div>
    );
  }

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
