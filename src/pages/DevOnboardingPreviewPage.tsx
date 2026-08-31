import { OnboardingTutorial } from '../components/onboarding/OnboardingTutorial';

/**
 * Solo para desarrollo — ver /App.tsx, ruta gateada por import.meta.env.DEV,
 * igual que /admin/content. El tutorial normalmente vive detrás de
 * RequireAuth (no hay modo invitado), así que sin esto no hay forma de
 * verlo en el navegador sin una cuenta de Supabase real.
 *
 * onFinish escribe en consola en vez de usar window.alert(): un alert() es
 * un diálogo nativo bloqueante — cuelga la pestaña entera (y cualquier
 * automatización conectada a ella) hasta que alguien lo cierra a mano.
 */
export function DevOnboardingPreviewPage() {
  return <OnboardingTutorial onFinish={() => console.info('[dev] onFinish() — en la app real esto marca el tutorial como visto y lo cierra.')} />;
}
