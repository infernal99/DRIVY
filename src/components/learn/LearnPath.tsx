import { useEffect, useId } from 'react';
import { Icon } from '../ui/Icon';
import { Mascot } from '../mascot/Mascot';
import { useMascot } from '../mascot/useMascot';
import { PathIcon, type PathIconName } from './pathVisuals';
import { NODE_ASSET, DAILY_CHALLENGE_ASSET, REWARD_CHEST_ASSET, ENV_PROP, type EnvPropKind } from './pathAssets';
import styles from './LearnPath.module.css';

export type PathNodeKind = 'lesson' | 'checkpoint' | 'reward' | 'exam' | 'teaser';
export type PathNodeStatus = 'done' | 'active' | 'locked';

export interface PathNode {
  id: string;
  label: string;
  meta?: string;
  icon: PathIconName;
  kind: PathNodeKind;
  status: PathNodeStatus;
  /** Color de acento (rgba) para el halo del nodo activo y el resplandor de fondo. */
  glow?: string;
  onClick?: () => void;
}

const DEFAULT_GLOW = 'rgba(139,92,246,0.45)';

/** Centro (x) de cada nodo dentro de un lienzo de ROW_WIDTH — la onda "centro / lado / extremo" que pide el diseño. */
const X_PATTERN = [165, 95, 42, 165, 235, 288, 165];
const ROW_WIDTH = 330;
/** Mundo largo a propósito: mejor que la página se desplace mucho a que los nodos se encojan. */
const ROW_HEIGHT = 172;
const TOP_PADDING = 80;
const BOTTOM_PADDING = 64;

function xFor(i: number) {
  return X_PATTERN[i % X_PATTERN.length];
}

function buildTrailPath(points: { x: number; y: number }[]) {
  if (points.length < 2) return '';
  let d = `M ${points[0].x} ${points[0].y}`;
  for (let i = 1; i < points.length; i++) {
    const prev = points[i - 1];
    const curr = points[i];
    const c1y = prev.y + (curr.y - prev.y) / 2;
    const c2y = curr.y - (curr.y - prev.y) / 2;
    d += ` C ${prev.x} ${c1y}, ${curr.x} ${c2y}, ${curr.x} ${curr.y}`;
  }
  return d;
}

const SIZE: Record<PathNodeKind, { active: number; other: number; extrusion: number }> = {
  lesson: { active: 104, other: 86, extrusion: 10 },
  checkpoint: { active: 92, other: 92, extrusion: 10 },
  reward: { active: 96, other: 96, extrusion: 10 },
  exam: { active: 100, other: 100, extrusion: 12 },
  teaser: { active: 68, other: 68, extrusion: 7 },
};

function sizeFor(node: PathNode) {
  const s = SIZE[node.kind];
  return node.status === 'active' && node.kind === 'lesson' ? s.active : s.other;
}

function surfaceFor(node: PathNode): string {
  if (node.kind === 'teaser' || node.status === 'locked') return 'var(--color-bg-locked)';
  if (node.kind === 'reward') return 'linear-gradient(155deg, #ffdc7a, var(--color-xp))';
  if (node.kind === 'checkpoint' || node.kind === 'exam') return 'var(--gradient-brand)';
  if (node.status === 'done') return 'var(--color-success)';
  return 'var(--gradient-brand)'; // lección activa
}

/** Asset PNG de producción para este nodo, si el proyecto tiene arte real para él (ver pathAssets.ts) — si no, se usa el botón 3D en CSS + PathIcon. */
function assetFor(node: PathNode): string | undefined {
  if (node.kind === 'checkpoint') return DAILY_CHALLENGE_ASSET;
  if (node.kind === 'reward') return REWARD_CHEST_ASSET;
  return NODE_ASSET[node.icon];
}

/** Camino serpenteante: PNG de producción como base de cada nodo (con fallback al botón 3D en CSS), carretera real, decorado del entorno y la mascota contando pequeñas historias por el camino. */
export function LearnPath({ nodes }: { nodes: PathNode[] }) {
  const gradId = useId().replace(/:/g, '');
  const idleMascot = useMascot({ idleSleepAfterMs: null });
  const celebrateMascot = useMascot({ idleSleepAfterMs: null });
  const thinkMascot = useMascot({ idleSleepAfterMs: null });

  const points = nodes.map((_, i) => ({ x: xFor(i), y: TOP_PADDING + i * ROW_HEIGHT }));
  const totalHeight = TOP_PADDING + Math.max(0, nodes.length - 1) * ROW_HEIGHT + BOTTOM_PADDING;

  const activeLessonIndex = nodes.findIndex((n) => n.kind === 'lesson' && n.status === 'active');
  const rewardIndex = nodes.findIndex((n) => n.kind === 'reward');
  const examIndex = nodes.findIndex((n) => n.kind === 'exam');
  const splitIndex = (() => {
    const i = nodes.findIndex((n) => n.kind === 'teaser' || n.status === 'locked');
    return i === -1 ? nodes.length - 1 : i;
  })();

  useEffect(() => {
    if (rewardIndex !== -1) celebrateMascot.react('correct', { intensity: 'big' });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rewardIndex]);
  useEffect(() => {
    if (examIndex !== -1) thinkMascot.react('thinking');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [examIndex]);

  const pastPoints = points.slice(0, splitIndex + 1);
  const futurePoints = points.slice(splitIndex);

  return (
    <div style={{ position: 'relative', width: ROW_WIDTH, height: totalHeight, margin: '84px auto 0' }}>
      {/* Atmósfera muy sutil detrás de los hitos importantes */}
      {[activeLessonIndex, rewardIndex, examIndex].map(
        (i, k) =>
          i !== -1 && (
            <div
              key={k}
              className={styles.glow}
              style={{
                left: points[i].x,
                top: points[i].y,
                width: 200,
                height: 200,
                background: nodes[i].glow ?? DEFAULT_GLOW,
                opacity: 0.55,
              }}
            />
          ),
      )}

      <svg
        width={ROW_WIDTH}
        height={totalHeight}
        viewBox={`0 0 ${ROW_WIDTH} ${totalHeight}`}
        style={{ position: 'absolute', inset: 0, overflow: 'visible' }}
        aria-hidden="true"
      >
        <defs>
          <filter id={`roadglow-${gradId}`} x="-60%" y="-60%" width="220%" height="220%">
            <feGaussianBlur stdDeviation="9" />
          </filter>
        </defs>

        {/* Futuro (todavía bloqueado): asfalto apagado, con un halo tenue — sigue leyéndose como carretera. */}
        <path
          d={buildTrailPath(futurePoints)}
          fill="none"
          stroke="var(--color-primary)"
          strokeWidth={64}
          strokeLinecap="round"
          opacity={0.1}
          filter={`url(#roadglow-${gradId})`}
        />
        <RoadLayer d={buildTrailPath(futurePoints)} asphalt="var(--color-road-asphalt-muted)" edge="var(--color-road-edge-muted)" lane="var(--color-road-lane-muted)" />

        {/* Alcanzable ahora: asfalto vivo con halo morado brillante debajo. */}
        <path
          d={buildTrailPath(pastPoints)}
          fill="none"
          stroke="var(--color-primary)"
          strokeWidth={70}
          strokeLinecap="round"
          opacity={0.4}
          filter={`url(#roadglow-${gradId})`}
        />
        <RoadLayer d={buildTrailPath(pastPoints)} asphalt="var(--color-road-asphalt)" edge="var(--color-road-edge)" lane="var(--color-road-lane)" />
      </svg>

      <RoadProps points={points} rowWidth={ROW_WIDTH} skip={[activeLessonIndex, rewardIndex, examIndex]} />

      {nodes.map((node, i) => {
        const { x, y } = points[i];
        const clickable = !!node.onClick && node.status !== 'locked';
        const isCurrentLesson = i === activeLessonIndex;
        const isSpecial = node.kind === 'checkpoint' || node.kind === 'reward' || node.kind === 'exam';
        const size = sizeFor(node);
        const extrusion = SIZE[node.kind].extrusion;
        const pressTravel = Math.max(3, extrusion - 3);
        const isLockedLook = node.kind === 'teaser' || node.status === 'locked';
        const asset = assetFor(node);

        return (
          <div
            key={node.id}
            className={`${styles.nodeWrap} ${isCurrentLesson || isSpecial ? styles.floaty : ''}`}
            style={{ left: x, top: y }}
          >
            {isCurrentLesson && (
              <div className={styles.startBubble} style={{ top: -size / 2 - 32 }}>
                <div className={styles.startBubbleInner}>
                  EMPIEZA
                  <div className={styles.startBubbleArrow} />
                </div>
              </div>
            )}

            <button
              type="button"
              disabled={!clickable}
              onClick={node.onClick}
              aria-label={`${node.label} — ${
                node.status === 'locked' ? 'bloqueado' : node.status === 'done' ? 'completado' : 'disponible'
              }`}
              className={styles.button}
              style={{ width: size, height: size, '--press-travel': `${pressTravel}px` } as React.CSSProperties}
            >
              {isCurrentLesson && <div className={styles.activeRing} />}
              {isSpecial && <div className={styles.segRing} />}
              {isSpecial &&
                SPARKLE_DOTS.map((s, k) => (
                  <span
                    key={k}
                    className={styles.sparkle}
                    style={{ left: s.x, top: s.y, width: s.size, height: s.size, animationDelay: `${s.delay}s` }}
                  />
                ))}

              {asset ? (
                <img src={asset} alt="" className={isLockedLook ? styles.assetImgLocked : styles.assetImg} />
              ) : (
                <>
                  <div className={styles.base} style={{ background: surfaceFor(node) }} />
                  <div
                    className={styles.top}
                    style={{
                      width: size,
                      height: size,
                      background: surfaceFor(node),
                      boxShadow:
                        node.status === 'locked' || node.kind === 'teaser'
                          ? 'inset 0 2px 5px rgba(0,0,0,0.35)'
                          : '0 10px 18px rgba(20,10,50,0.4)',
                    }}
                  >
                    <span className={isLockedLook ? styles.iconLocked : undefined}>
                      <PathIcon name={node.icon} size={Math.round(size * 0.48)} />
                    </span>
                  </div>
                </>
              )}

              {node.status === 'done' && (
                <div className={styles.doneBadge}>
                  <Icon name="check" size={13} color="#fff" strokeWidth={3} />
                </div>
              )}
              {isLockedLook && (
                <div className={styles.lockBadge}>
                  <Icon name="lock" size={12} color="var(--color-text-muted-40)" />
                </div>
              )}
            </button>

            <div className={styles.label} style={{ top: size / 2 + 10, width: 128 }}>
              <span
                style={{
                  fontFamily: 'var(--font-display)',
                  fontWeight: isCurrentLesson || isSpecial ? 700 : 500,
                  fontSize: 12,
                  color: node.status === 'locked' ? 'var(--color-text-muted-40)' : 'var(--color-text)',
                  lineHeight: 1.25,
                }}
              >
                {node.label}
              </span>
              {node.meta && (
                <div style={{ fontSize: 10.5, fontWeight: 700, color: isSpecial ? 'var(--color-xp-text)' : 'var(--color-primary)', marginTop: 2 }}>
                  {node.meta}
                </div>
              )}
            </div>

            {i === activeLessonIndex && (
              <MascotMoment mascot={idleMascot} x={x} size={size} rowWidth={ROW_WIDTH} />
            )}
            {i === rewardIndex && <MascotMoment mascot={celebrateMascot} x={x} size={size} rowWidth={ROW_WIDTH} />}
            {i === examIndex && <MascotMoment mascot={thinkMascot} x={x} size={size} rowWidth={ROW_WIDTH} />}
          </div>
        );
      })}
    </div>
  );
}

const SPARKLE_DOTS = [
  { x: -6, y: -4, size: 5, delay: 0 },
  { x: '104%', y: 10, size: 4, delay: 0.6 },
  { x: 12, y: '102%', size: 4, delay: 1.3 },
];

function MascotMoment({
  mascot,
  x,
  size,
  rowWidth,
}: {
  mascot: ReturnType<typeof useMascot>;
  x: number;
  size: number;
  rowWidth: number;
}) {
  const onLeft = x < rowWidth / 2;
  return (
    <div
      className={styles.mascotWrap}
      style={{ top: size / 2 - 8, left: onLeft ? size / 2 + 74 : -(size / 2 + 74) }}
    >
      <div className={styles.mascotFloat}>
        <Mascot controller={mascot} size={94} bubblePosition="top" />
      </div>
    </div>
  );
}

/** Tres capas del mismo trazado — borde ancho claro, asfalto encima, carriles discontinuos arriba — para que se lea como una carretera en miniatura y no como una simple línea. */
function RoadLayer({ d, asphalt, edge, lane }: { d: string; asphalt: string; edge: string; lane: string }) {
  return (
    <>
      <path d={d} fill="none" stroke={edge} strokeWidth={58} strokeLinecap="round" />
      <path d={d} fill="none" stroke={asphalt} strokeWidth={48} strokeLinecap="round" />
      <path d={d} fill="none" stroke={lane} strokeWidth={3.5} strokeLinecap="round" strokeDasharray="16 15" />
    </>
  );
}

/** Pequeños elementos decorativos junto a la carretera, con los PNG reales del proyecto — nunca en el mismo nodo que la mascota, siempre en el lado contrario al que se inclina el nodo. */
function RoadProps({ points, rowWidth, skip }: { points: { x: number; y: number }[]; rowWidth: number; skip: number[] }) {
  const cycle: EnvPropKind[] = [
    'tree',
    'yield',
    'cone',
    'bushLarge',
    'lamp',
    'directionBarrier',
    'grassTall',
    'car',
    'bushSmall',
    'barrier',
    'grassSmall',
    'rocksGrass',
  ];
  const candidates = points.map((p, i) => ({ p, i })).filter(({ i }) => i > 0 && !skip.includes(i));

  return (
    <>
      {candidates.map(({ p, i }, k) => {
        const onLeft = p.x >= rowWidth / 2; // el decorado va al lado contrario al que se inclina el nodo
        const prop = ENV_PROP[cycle[k % cycle.length]];
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: p.x + (onLeft ? -90 : 90),
              top: p.y + ROW_HEIGHT * 0.36,
              transform: 'translate(-50%, -100%)',
              opacity: 0.9,
              pointerEvents: 'none',
              filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.35))',
            }}
          >
            <img src={prop.src} alt="" style={{ width: prop.width, height: 'auto', display: 'block' }} />
          </div>
        );
      })}
    </>
  );
}
