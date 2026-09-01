import { Mascot, useMascot } from '../components/mascot';
import type { MascotEvent } from '../components/mascot';

const EVENTS: MascotEvent[] = ['correct', 'incorrect', 'achievement', 'levelUp', 'streak', 'thinking', 'explaining', 'idea'];

/**
 * Solo para desarrollo — mismo patrón que /dev/onboarding: ruta gateada
 * por import.meta.env.DEV en App.tsx. La mascota real vive detrás de
 * RequireAuth (onboarding, FeedbackScreen dentro de una lección real), así
 * que sin esto no hay forma de probar en el navegador estados como
 * "celebrating" con confeti, "sleeping", o el "thinking" sostenido sin
 * tener una cuenta real y datos de progreso reales.
 */
export function DevMascotPreviewPage() {
  const mascot = useMascot({ autoGreet: true, idleSleepAfterMs: 8000 });

  return (
    <div style={{ minHeight: '100dvh', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 24, padding: 40, background: 'var(--color-bg-app)' }}>
      <div style={{ padding: 40 }}>
        <Mascot controller={mascot} size={170} />
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, justifyContent: 'center', maxWidth: 420 }}>
        {EVENTS.map((ev) => (
          <button key={ev} type="button" onClick={() => mascot.react(ev)} style={{ padding: '8px 12px' }}>
            react('{ev}')
          </button>
        ))}
        <button type="button" onClick={() => mascot.react('achievement', { intensity: 'big' })} style={{ padding: '8px 12px' }}>
          react('achievement', big)
        </button>
        <button type="button" onClick={() => mascot.say('Mensaje de prueba manual')} style={{ padding: '8px 12px' }}>
          say(...)
        </button>
      </div>
      <p style={{ fontSize: 12, color: 'var(--color-text-muted-60)' }}>
        estado actual: <strong>{mascot.state}</strong> — idleSleepAfterMs=8000 para probar el easter egg rápido
      </p>
    </div>
  );
}
