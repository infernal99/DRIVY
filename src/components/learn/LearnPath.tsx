import { useEffect, useId } from 'react';
import { Icon } from '../ui/Icon';
import { Mascot } from '../mascot/Mascot';
import { useMascot } from '../mascot/useMascot';
import { PathIcon, type PathIconName } from './pathVisuals';
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
const X_PATTERN = [150, 90, 42, 150, 210, 258, 150];
const ROW_WIDTH = 300;
const ROW_HEIGHT = 104;
const TOP_PADDING = 62;
const BOTTOM_PADDING = 46;

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
  lesson: { active: 82, other: 68, extrusion: 9 },
  checkpoint: { active: 78, other: 78, extrusion: 9 },
  reward: { active: 74, other: 74, extrusion: 9 },
  exam: { active: 94, other: 94, extrusion: 11 },
  teaser: { active: 58, other: 58, extrusion: 6 },
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

/** Camino serpenteante: botones 3D tácticos, halos de color por lección, hitos especiales y la mascota contando pequeñas historias por el camino. */
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
    <div style={{ position: 'relative', width: ROW_WIDTH, height: totalHeight, margin: '64px auto 0' }}>
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
                width: 170,
                height: 170,
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
        style={{ position: 'absolute', inset: 0 }}
        aria-hidden="true"
      >
        <defs>
          <linearGradient id={`trail-${gradId}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--color-primary-light)" />
            <stop offset="100%" stopColor="var(--color-primary)" />
          </linearGradient>
        </defs>
        <path
          d={buildTrailPath(futurePoints)}
          fill="none"
          stroke="var(--color-path-trail)"
          strokeWidth={6}
          strokeLinecap="round"
          strokeDasharray="1 20"
        />
        <path
          d={buildTrailPath(pastPoints)}
          fill="none"
          stroke={`url(#trail-${gradId})`}
          strokeWidth={7}
          strokeLinecap="round"
          strokeDasharray="1 16"
          opacity={0.9}
        />
      </svg>

      {nodes.map((node, i) => {
        const { x, y } = points[i];
        const clickable = !!node.onClick && node.status !== 'locked';
        const isCurrentLesson = i === activeLessonIndex;
        const isSpecial = node.kind === 'checkpoint' || node.kind === 'reward' || node.kind === 'exam';
        const size = sizeFor(node);
        const extrusion = SIZE[node.kind].extrusion;
        const pressTravel = Math.max(3, extrusion - 3);
        const isLockedLook = node.kind === 'teaser' || node.status === 'locked';

        return (
          <div
            key={node.id}
            className={`${styles.nodeWrap} ${isCurrentLesson || isSpecial ? styles.floaty : ''}`}
            style={{ left: x, top: y }}
          >
            {isCurrentLesson && (
              <div className={styles.startBubble} style={{ top: -size / 2 - 48 }}>
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

              <div className={styles.base} style={{ background: surfaceFor(node) }} />
              <div
                className={styles.top}
                style={{
                  width: size,
                  height: size,
                  background: surfaceFor(node),
                  boxShadow: node.status === 'locked' || node.kind === 'teaser' ? 'inset 0 2px 5px rgba(0,0,0,0.35)' : 'none',
                }}
              >
                <span className={isLockedLook ? styles.iconLocked : undefined}>
                  <PathIcon name={node.icon} size={Math.round(size * 0.42)} />
                </span>
              </div>

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

            <div className={styles.label} style={{ top: size / 2 + 10, width: 118 }}>
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
      style={{ top: size / 2 + 4, left: onLeft ? size / 2 + 62 : -(size / 2 + 62) }}
    >
      <div className={styles.mascotFloat}>
        <Mascot controller={mascot} size={68} bubblePosition="top" />
      </div>
    </div>
  );
}
