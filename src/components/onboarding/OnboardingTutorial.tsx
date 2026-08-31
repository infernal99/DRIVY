import { useEffect, useRef, useState } from 'react';
import type { IconName } from '../../types';
import { Icon } from '../ui/Icon';
import { Button } from '../ui/Button';
import { OnboardingMascot } from './OnboardingMascot';
import styles from './OnboardingTutorial.module.css';

interface Step {
  icon: IconName;
  title: string;
  body: string;
}

/**
 * Contenido escrito a mano, no generado — igual que aiTutorService.ts, "el
 * profe" no tiene ningún modelo real detrás. Cubre las mismas cinco cosas
 * que un usuario nuevo necesita saber para no perderse en la app: aprender,
 * practicar, amigos/duelos/ranking, y racha+XP+logros.
 */
const STEPS: Step[] = [
  {
    icon: 'bolt',
    title: '¡Hola! Soy tu profe',
    body: 'Te enseño en un minuto cómo funciona Roady para que saques el carné sin sustos.',
  },
  {
    icon: 'road',
    title: 'Aprende por categorías',
    body: 'La ruta de Aprender está dividida en categorías con lecciones cortas. Ve completándolas en orden para desbloquear la siguiente.',
  },
  {
    icon: 'target',
    title: 'Practica a tu manera',
    body: 'Simulacros cronometrados, un examen real más serio, preguntas al azar o un repaso automático de todo lo que sueles fallar.',
  },
  {
    icon: 'users',
    title: 'Reta a tus amigos',
    body: 'Añade amigos con tu código, retales a un duelo 1 contra 1 en tiempo real y mira quién manda en el ranking entre vosotros.',
  },
  {
    icon: 'flame',
    title: 'Racha, XP y logros',
    body: 'Contesta cada día para mantener la racha, gana XP con cada acierto y desbloquea logros a medida que avanzas.',
  },
];

export function OnboardingTutorial({ onFinish }: { onFinish: () => void }) {
  const [index, setIndex] = useState(0);
  const dialogRef = useRef<HTMLDivElement>(null);
  const step = STEPS[index];
  const isLast = index === STEPS.length - 1;
  const titleId = 'onboarding-title';

  useEffect(() => {
    dialogRef.current?.focus();
  }, []);

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') onFinish();
    }
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [onFinish]);

  return (
    <div className={styles.overlay} role="dialog" aria-modal="true" aria-labelledby={titleId} ref={dialogRef} tabIndex={-1}>
      <button type="button" className={styles.skip} onClick={onFinish}>
        Saltar
      </button>

      <div className={styles.mascotWrap}>
        <OnboardingMascot />
      </div>

      {/* key=index reinicia la entrada anim-pop-in en cada paso, para que se
          note el cambio de tarjeta y no un simple parpadeo de texto. */}
      <div className={`${styles.card} anim-pop-in`} key={index}>
        <div className={styles.stepIcon}>
          <Icon name={step.icon} size={20} color="var(--color-primary)" />
        </div>
        <h2 id={titleId} className={styles.title}>
          {step.title}
        </h2>
        <p className={styles.body}>{step.body}</p>

        <div className={styles.dots} aria-hidden="true">
          {STEPS.map((s, i) => (
            <span key={s.title} className={`${styles.dot} ${i === index ? styles.dotActive : ''}`} />
          ))}
        </div>

        <div className={styles.actions}>
          {index > 0 && (
            <Button variant="secondary" style={{ flex: 1 }} onClick={() => setIndex((i) => i - 1)}>
              Atrás
            </Button>
          )}
          <Button style={{ flex: 1 }} onClick={() => (isLast ? onFinish() : setIndex((i) => i + 1))}>
            {isLast ? 'Empezar' : 'Siguiente'}
          </Button>
        </div>
      </div>
    </div>
  );
}
