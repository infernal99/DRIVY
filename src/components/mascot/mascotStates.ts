/**
 * Todos los estados posibles de "el profe". La lista y las prioridades
 * viven aquí y en ningún otro sitio — cualquier pantalla que quiera hacer
 * reaccionar a la mascota pasa por useMascot(), nunca por CSS o timers
 * sueltos en el componente que la usa.
 */
export type MascotState =
  | 'idle'
  | 'sleeping'
  | 'greeting'
  | 'thinking'
  | 'explaining'
  | 'happy'
  | 'celebrating'
  | 'encouraging'
  | 'surprised'
  | 'idea';

/**
 * Atajos de alto nivel para el resto de la app: `mascot.react('correct')`
 * en vez de que cada pantalla tenga que saber a qué MascotState exacto
 * corresponde cada evento de producto (eso es justo lo que se pidió
 * centralizar). `intensity` decide si un acierto normal basta con "happy"
 * o si el hito merece "celebrating" con confeti — la app decide cuál usar
 * según lo importante que sea el evento, esta tabla no lo adivina sola.
 */
export type MascotEvent = 'correct' | 'incorrect' | 'achievement' | 'levelUp' | 'streak' | 'thinking' | 'explaining' | 'idea';

export const EVENT_TO_STATE: Record<MascotEvent, MascotState> = {
  correct: 'happy',
  incorrect: 'encouraging',
  achievement: 'celebrating',
  levelUp: 'celebrating',
  streak: 'celebrating',
  thinking: 'thinking',
  explaining: 'explaining',
  idea: 'idea',
};

/** Eventos que por defecto lanzan confeti — solo los hitos, nunca un acierto suelto. */
export const BIG_EVENTS: ReadonlySet<MascotEvent> = new Set(['achievement', 'levelUp', 'streak']);

interface StateConfig {
  /** Más alto gana: un estado en curso solo lo interrumpe algo de prioridad igual o mayor. */
  priority: number;
  /**
   * ms hasta volver solo a 'idle' — null significa "sticky", se queda hasta
   * que algo externo lo cambie (idle, sleeping, y thinking: este último lo
   * corta explaining, no un timer, porque no sabemos cuánto va a tardar la IA).
   */
  duration: number | null;
  /** Clase CSS (Mascot.module.css) con la animación de este estado. */
  className: string;
}

export const STATE_CONFIG: Record<MascotState, StateConfig> = {
  idle: { priority: 0, duration: null, className: 'stateIdle' },
  sleeping: { priority: 0, duration: null, className: 'stateSleeping' },
  greeting: { priority: 4, duration: 1400, className: 'stateGreeting' },
  thinking: { priority: 6, duration: null, className: 'stateThinking' },
  explaining: { priority: 7, duration: 2200, className: 'stateExplaining' },
  encouraging: { priority: 5, duration: 1700, className: 'stateEncouraging' },
  idea: { priority: 5, duration: 1900, className: 'stateIdea' },
  surprised: { priority: 8, duration: 850, className: 'stateSurprised' },
  happy: { priority: 9, duration: 900, className: 'stateHappy' },
  celebrating: { priority: 10, duration: 1300, className: 'stateCelebrating' },
};

/** Frases cortas para cuando el usuario toca/hace click en la mascota. Nunca se muestran todas seguidas — ver useMascot. */
export const CLICK_PHRASES = ['¿Necesitas ayuda?', '¡Vamos!', 'Pregúntame lo que quieras.', 'Estoy aquí 👋'];
