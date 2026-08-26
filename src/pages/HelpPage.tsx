import { AppShell } from '../components/layout/AppShell';
import { ScreenHeader } from '../components/layout/ScreenHeader';
import { Card } from '../components/ui/Card';

const FAQ = [
  {
    q: '¿De dónde sale el contenido de las preguntas?',
    a: 'Se elabora a partir de fuentes oficiales de la DGT (normativa de circulación, manual del permiso B, catálogo de señales). Consulta la sección "Fuentes oficiales" para ver el listado completo con enlaces.',
  },
  {
    q: '¿Son preguntas oficiales de examen?',
    a: 'No. Ninguna pregunta de DRIVY se presenta como pregunta oficial de la DGT. Todo el banco está marcado internamente como contenido de práctica, redactado por nosotros a partir de la normativa oficial vigente.',
  },
  {
    q: '¿Cómo funciona el repaso de errores?',
    a: 'Cada vez que fallas una pregunta, se guarda automáticamente en "Mis errores". Puedes repasarlas todas juntas desde Practicar → Repasar errores; al acertarlas se eliminan de la lista.',
  },
  {
    q: '¿Cómo se eligen las preguntas de cada sesión?',
    a: 'Un algoritmo de repaso prioriza las preguntas falladas, las que llevan más tiempo sin aparecer y las que nunca has practicado, reduciendo la frecuencia de las que ya dominas.',
  },
  {
    q: '¿Qué diferencia hay entre el simulacro y el examen real?',
    a: 'Ambos siguen el formato oficial: 30 preguntas con 3 opciones cada una y 30 minutos de tiempo. El examen real usa una interfaz más sobria para acercarse a la experiencia del examen oficial.',
  },
  {
    q: '¿Dónde se guarda mi progreso?',
    a: 'En este dispositivo, mediante almacenamiento local del navegador. Si cambias de navegador o de dispositivo no se sincronizará automáticamente.',
  },
];

export function HelpPage() {
  return (
    <AppShell>
      <ScreenHeader title="Ayuda" />
      <div style={{ flex: 1, overflowY: 'auto', padding: '0 20px 30px', display: 'flex', flexDirection: 'column', gap: 10 }}>
        {FAQ.map((item) => (
          <Card key={item.q} style={{ padding: 16 }}>
            <div style={{ fontWeight: 600, fontSize: 14, color: 'var(--color-text)', marginBottom: 6 }}>{item.q}</div>
            <p style={{ fontSize: 12.5, color: 'var(--color-text-muted-60)', lineHeight: 1.55, margin: 0 }}>{item.a}</p>
          </Card>
        ))}
      </div>
    </AppShell>
  );
}
