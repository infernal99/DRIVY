import { useState } from 'react';

const STORAGE_KEY = 'roady.onboardingProfile.v1';

export type ExperienceLevel = 'nuevo' | 'con_experiencia';

export interface OnboardingProfile {
  countryId: string | null;
  licenseCategoryId: string | null;
  level: ExperienceLevel | null;
}

const EMPTY: OnboardingProfile = { countryId: null, licenseCategoryId: null, level: null };

function read(): OnboardingProfile {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return EMPTY;
    const parsed = JSON.parse(raw);
    return { ...EMPTY, ...parsed };
  } catch {
    return EMPTY;
  }
}

/**
 * Guarda las respuestas del onboarding (país, carné, nivel) — separado del
 * flag "tutorial visto" de useOnboarding a propósito: son dos preguntas
 * distintas ("¿ha visto ya el tutorial?" vs "¿qué respondió?") y conviene
 * poder releer la segunda sin que dependa de la primera.
 *
 * Hoy solo hay contenido real para país=España y carné=B, así que estas
 * respuestas no cambian todavía qué preguntas ve el usuario — se guardan
 * para mostrarlas (p. ej. en Perfil) y para que el día que haya más
 * contenido, ya exista el dato sin tener que volver a preguntar.
 */
export function useOnboardingProfile() {
  const [profile, setProfile] = useState<OnboardingProfile>(read);

  function save(patch: Partial<OnboardingProfile>) {
    const next = { ...read(), ...patch };
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      // best-effort
    }
    setProfile(next);
  }

  return { profile, save };
}
