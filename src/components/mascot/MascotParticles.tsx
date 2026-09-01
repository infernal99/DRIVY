import { useEffect, useRef, useState } from 'react';
import styles from './MascotParticles.module.css';

const COLORS = ['var(--color-primary)', 'var(--color-accent-pink)', 'var(--color-xp)', 'var(--color-success)'];
const PIECE_COUNT = 10; // modesto a propósito — es CSS puro (transform/opacity), barato incluso en gama baja
const LIFETIME_MS = 950;

interface Piece {
  key: number;
  left: number;
  delay: number;
  color: string;
  rotate: number;
}

function makeBurst(): Piece[] {
  return Array.from({ length: PIECE_COUNT }, (_, i) => ({
    key: i,
    left: 10 + Math.random() * 80,
    delay: Math.random() * 150,
    color: COLORS[i % COLORS.length],
    rotate: Math.random() * 360,
  }));
}

/**
 * Solo para los hitos importantes (achievement/levelUp/streak, o un acierto
 * marcado como intensity:'big'): ver BIG_EVENTS en mascotStates.ts — nunca
 * se dispara en un acierto normal.
 */
export function MascotParticles({ burstId }: { burstId: number | null }) {
  const [pieces, setPieces] = useState<Piece[] | null>(null);
  const lastId = useRef<number | null>(null);
  const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (burstId == null || burstId === lastId.current) return;
    lastId.current = burstId;
    setPieces(makeBurst());
    if (hideTimer.current) clearTimeout(hideTimer.current);
    hideTimer.current = setTimeout(() => setPieces(null), LIFETIME_MS);
    return () => {
      if (hideTimer.current) clearTimeout(hideTimer.current);
    };
  }, [burstId]);

  if (!pieces) return null;

  return (
    <div className={styles.wrap} aria-hidden="true">
      {pieces.map((p) => (
        <span
          key={p.key}
          className={styles.piece}
          style={{
            left: `${p.left}%`,
            background: p.color,
            animationDelay: `${p.delay}ms`,
            transform: `rotate(${p.rotate}deg)`,
          }}
        />
      ))}
    </div>
  );
}
