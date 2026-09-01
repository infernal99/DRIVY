import { STATE_CONFIG } from './mascotStates';
import type { IdleTick, MascotController } from './useMascot';
import { MascotBubble } from './MascotBubble';
import { MascotParticles } from './MascotParticles';
import styles from './Mascot.module.css';

/** Mismo asset e intrínseco 480×573 que ya se usaba en OnboardingMascot — no se ha tocado ni generado ninguno nuevo. */
const INTRINSIC_W = 480;
const INTRINSIC_H = 573;

const TICK_CLASS: Record<Exclude<IdleTick, null>, keyof typeof styles> = {
  blink: 'tickBlink',
  glance: 'tickGlance',
  wiggle: 'tickWiggle',
};

/**
 * Componente puramente presentacional: toda la lógica (qué estado toca,
 * cuándo, con qué prioridad, los tics de idle...) vive en useMascot(). Este
 * componente solo pinta lo que el controller le dice — así cualquier
 * pantalla nueva puede reutilizar exactamente el mismo comportamiento sin
 * reimplementar nada, con `const mascot = useMascot(); <Mascot controller={mascot} />`.
 */
export function Mascot({
  controller,
  size = 96,
  bubblePosition = 'side',
  className,
}: {
  controller: MascotController;
  size?: number;
  bubblePosition?: 'top' | 'side';
  className?: string;
}) {
  const { state, bubble, burstId, idleTick, onMouseEnter, onMouseLeave, onClick, reducedMotion } = controller;
  const height = Math.round((size * INTRINSIC_H) / INTRINSIC_W);
  const stateClass = styles[STATE_CONFIG[state].className];
  const tickClass = idleTick ? styles[TICK_CLASS[idleTick]] : '';

  return (
    <div
      className={`${styles.root} ${className ?? ''}`}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onClick={onClick}
      role="button"
      tabIndex={0}
      aria-label="El profe"
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick();
        }
      }}
    >
      <img
        src="/mascot.webp"
        alt=""
        width={size}
        height={height}
        style={{ width: size, height }}
        decoding="async"
        className={`${styles.img} ${stateClass} ${tickClass}`}
      />
      <MascotBubble bubble={bubble} position={bubblePosition} />
      {!reducedMotion && <MascotParticles burstId={burstId} />}
    </div>
  );
}
