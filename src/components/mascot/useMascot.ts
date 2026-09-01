import { useCallback, useEffect, useRef, useState } from 'react';
import { BIG_EVENTS, CLICK_PHRASES, EVENT_TO_STATE, STATE_CONFIG, type MascotEvent, type MascotState } from './mascotStates';

export interface MascotBubbleData {
  id: number;
  message: string;
}

export type IdleTick = 'blink' | 'glance' | 'wiggle' | null;

export interface MascotController {
  state: MascotState;
  bubble: MascotBubbleData | null;
  /** Dispara confeti una vez; el componente Mascot lo consume y lo vacía solo. */
  burstId: number | null;
  /** Microvariación aleatoria que se SUMA al idle (parpadeo/vistazo/meneo) — null la mayor parte del tiempo. */
  idleTick: IdleTick;
  react: (event: MascotEvent, opts?: { intensity?: 'normal' | 'big' }) => void;
  say: (message: string, opts?: { duration?: number }) => void;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  onClick: () => void;
  reducedMotion: boolean;
}

const MIN_BUBBLE_GAP_MS = 1200;
let bubbleSeq = 0;
let burstSeq = 0;

/**
 * Toda la lógica de "el profe" vive aquí, no repartida por las pantallas
 * que lo usan: prioridad entre estados, temporizadores de auto-vuelta a
 * idle, el easter egg de dormirse, y las burbujas de diálogo. Cualquier
 * pantalla nueva que quiera hacer reaccionar a la mascota importa este
 * hook, nunca reimplementa un trocito de esta máquina de estados.
 */
export function useMascot(options?: { autoGreet?: boolean; idleSleepAfterMs?: number | null }): MascotController {
  const autoGreet = options?.autoGreet ?? false;
  const idleSleepAfterMs = options?.idleSleepAfterMs ?? 60_000;

  const [state, setStateRaw] = useState<MascotState>('idle');
  const [bubble, setBubble] = useState<MascotBubbleData | null>(null);
  const [burstId, setBurstId] = useState<number | null>(null);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [idleTick, setIdleTick] = useState<IdleTick>(null);

  // Refs porque los timeouts necesitan leer el valor MÁS RECIENTE al
  // disparar, no el que tenían capturado en el closure de cuando se
  // programaron (el clásico problema de estado obsoleto en un setTimeout).
  const stateRef = useRef(state);
  stateRef.current = state;
  const revertTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const sleepTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const bubbleTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const tickTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastBubbleAt = useRef(0);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  const scheduleSleep = useCallback(() => {
    if (sleepTimer.current) clearTimeout(sleepTimer.current);
    if (idleSleepAfterMs == null) return;
    sleepTimer.current = setTimeout(() => {
      // Solo se duerme si de verdad seguimos en reposo — si en medio del
      // camino ha pasado algo (una celebración, etc.) esto ya no aplica.
      if (stateRef.current === 'idle') setStateRaw('sleeping');
    }, idleSleepAfterMs);
  }, [idleSleepAfterMs]);

  // Arranca (y reinicia) el reloj del "se duerme si no pasa nada" cada vez
  // que el estado vuelve a idle — no mientras está en cualquier otro estado.
  useEffect(() => {
    if (state === 'idle') scheduleSleep();
    return () => {
      if (sleepTimer.current) clearTimeout(sleepTimer.current);
    };
  }, [state, scheduleSleep]);

  // Los "tics" — parpadeo/vistazo/meneo — solo se programan mientras está
  // en idle de verdad y sin preferencia de movimiento reducido. Se paran y
  // se reprograman cada vez que se sale/vuelve a idle, nunca siguen
  // sonando de fondo mientras la mascota está en otro estado.
  useEffect(() => {
    if (state !== 'idle' || reducedMotion) return;
    const ticks: { kind: Exclude<IdleTick, null>; ms: number }[] = [
      { kind: 'blink', ms: 260 },
      { kind: 'glance', ms: 650 },
      { kind: 'wiggle', ms: 500 },
    ];
    let clearTick: ReturnType<typeof setTimeout> | null = null;
    const scheduleNext = () => {
      // Entre 4 y 9s: ni tan seguido que distraiga, ni tan raro que parezca
      // congelada — "no cada segundo, pero tampoco nunca", tal como se pidió.
      const wait = 4000 + Math.random() * 5000;
      tickTimer.current = setTimeout(() => {
        const pick = ticks[Math.floor(Math.random() * ticks.length)];
        setIdleTick(pick.kind);
        clearTick = setTimeout(() => setIdleTick(null), pick.ms);
        scheduleNext();
      }, wait);
    };
    scheduleNext();
    return () => {
      if (tickTimer.current) clearTimeout(tickTimer.current);
      if (clearTick) clearTimeout(clearTick);
      setIdleTick(null);
    };
  }, [state, reducedMotion]);

  useEffect(
    () => () => {
      if (revertTimer.current) clearTimeout(revertTimer.current);
      if (sleepTimer.current) clearTimeout(sleepTimer.current);
      if (bubbleTimer.current) clearTimeout(bubbleTimer.current);
      if (tickTimer.current) clearTimeout(tickTimer.current);
    },
    [],
  );

  const applyState = useCallback((next: MascotState) => {
    const current = stateRef.current;
    // sleeping/idle son el "descanso": cualquier cosa con prioridad >= la
    // actual puede interrumpir, para que una celebración no se pise con
    // un idle-tick, pero dos "happy" seguidos sí se puedan reiniciar entre sí.
    const currentPriority = current === 'sleeping' ? -1 : STATE_CONFIG[current].priority;
    if (STATE_CONFIG[next].priority < currentPriority) return;

    if (revertTimer.current) clearTimeout(revertTimer.current);
    stateRef.current = next;
    setStateRaw(next);

    const { duration } = STATE_CONFIG[next];
    if (duration != null) {
      revertTimer.current = setTimeout(() => {
        stateRef.current = 'idle';
        setStateRaw('idle');
      }, duration);
    }
  }, []);

  useEffect(() => {
    if (autoGreet) applyState('greeting');
    // Solo al montar — un cambio posterior de `autoGreet` no debe re-saludar.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const say = useCallback((message: string, opts?: { duration?: number }) => {
    const now = Date.now();
    if (now - lastBubbleAt.current < MIN_BUBBLE_GAP_MS) return; // nunca encadenar burbujas
    lastBubbleAt.current = now;
    if (bubbleTimer.current) clearTimeout(bubbleTimer.current);
    const id = ++bubbleSeq;
    setBubble({ id, message });
    bubbleTimer.current = setTimeout(() => setBubble(null), opts?.duration ?? 2600);
  }, []);

  const react = useCallback(
    (event: MascotEvent, opts?: { intensity?: 'normal' | 'big' }) => {
      const big = opts?.intensity === 'big' || BIG_EVENTS.has(event);
      const target = event === 'correct' && big ? 'celebrating' : EVENT_TO_STATE[event];
      applyState(target);
      if (target === 'celebrating' && big) setBurstId(++burstSeq);
    },
    [applyState],
  );

  const onMouseEnter = useCallback(() => {
    if (stateRef.current === 'sleeping') applyState('idle');
  }, [applyState]);

  const onMouseLeave = useCallback(() => {
    // sin acción propia — el CSS de :hover en Mascot.tsx ya vuelve solo.
  }, []);

  const onClick = useCallback(() => {
    if (stateRef.current === 'sleeping') {
      applyState('idle');
      return; // despertarla ya es suficiente reacción, no hace falta hablar encima
    }
    applyState('happy');
    const phrase = CLICK_PHRASES[Math.floor(Math.random() * CLICK_PHRASES.length)];
    say(phrase);
  }, [applyState, say]);

  return { state, bubble, burstId, idleTick, react, say, onMouseEnter, onMouseLeave, onClick, reducedMotion };
}
