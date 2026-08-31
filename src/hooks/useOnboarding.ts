import { useState } from 'react';

/**
 * Nueva a propósito (no `drivy.*`): el resto de claves siguen ese prefijo
 * porque renombrarlas borraría datos ya guardados de usuarios existentes,
 * pero esta es una funcionalidad nueva sin ningún dato previo que migrar.
 */
const STORAGE_KEY = 'roady.onboarding.completed.v1';

function readCompleted(): boolean {
  try {
    return localStorage.getItem(STORAGE_KEY) === '1';
  } catch {
    return true; // sin localStorage, mejor no bloquear la app con el tutorial
  }
}

/**
 * Es un flag a nivel de navegador, no por cuenta: se marca "visto" en cuanto
 * se cierra una vez, sin volver a comprobar nada del progreso del usuario.
 * Igual que el intro de Duolingo, no vuelve a aparecer aunque el usuario
 * borre después su progreso o cree otra cuenta desde el mismo navegador.
 */
export function useOnboarding() {
  const [completed, setCompleted] = useState(readCompleted);

  function complete() {
    try {
      localStorage.setItem(STORAGE_KEY, '1');
    } catch {
      // best-effort — en el peor caso el tutorial reaparece la próxima vez
    }
    setCompleted(true);
  }

  /** Usado por el botón "Ver el tutorial de nuevo" de Ayuda. */
  function reset() {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignorar
    }
    setCompleted(false);
  }

  return { shouldShow: !completed, complete, reset };
}
