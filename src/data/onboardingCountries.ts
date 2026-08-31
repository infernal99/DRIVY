import type { FlagCode } from '../components/onboarding/OnboardingFlag';

export interface OnboardingCountry {
  id: string;
  code: FlagCode;
  name: string;
  /** Solo España tiene banco de preguntas real: el resto exigiría fuentes
   *  oficiales, licencias y un banco de preguntas propios por país — no es
   *  cuestión de traducir esta app, es un proyecto de contenido aparte por
   *  cada uno. Se muestran igualmente para dejar clara la ambición, con
   *  candado en vez de ocultarlos. */
  available: boolean;
}

export const ONBOARDING_COUNTRIES: OnboardingCountry[] = [
  { id: 'es', code: 'ES', name: 'España', available: true },
  { id: 'gb', code: 'GB', name: 'Reino Unido', available: false },
  { id: 'fr', code: 'FR', name: 'Francia', available: false },
  { id: 'us', code: 'US', name: 'Estados Unidos', available: false },
];
