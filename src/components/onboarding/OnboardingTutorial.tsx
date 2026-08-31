import { useEffect, useRef, useState } from 'react';
import type { IconName } from '../../types';
import { Icon } from '../ui/Icon';
import { Button } from '../ui/Button';
import { LICENSE_CATEGORIES } from '../../data/licenseCategories';
import { ONBOARDING_COUNTRIES } from '../../data/onboardingCountries';
import { useOnboardingProfile } from '../../hooks/useOnboardingProfile';
import { OnboardingMascot } from './OnboardingMascot';
import { OnboardingFlag, type FlagCode } from './OnboardingFlag';
import styles from './OnboardingTutorial.module.css';

interface ChoiceOption {
  id: string;
  title: string;
  subtitle: string;
  available: boolean;
  render: () => React.ReactNode;
}

type Step =
  | { kind: 'info'; icon: IconName; title: string; body: string }
  | { kind: 'choice'; title: string; body: string; field: 'countryId' | 'licenseCategoryId' | 'level'; options: ChoiceOption[] };

const LEVEL_OPTIONS: ChoiceOption[] = [
  {
    id: 'nuevo',
    title: 'Empiezo desde cero',
    subtitle: 'Nunca me he examinado del teórico.',
    available: true,
    render: () => <Icon name="book" size={20} color="var(--color-primary)" />,
  },
  {
    id: 'con_experiencia',
    title: 'Ya sé algo',
    subtitle: 'He estudiado o me he examinado antes.',
    available: true,
    render: () => <Icon name="target" size={20} color="var(--color-primary)" />,
  },
];

/**
 * Contenido escrito a mano, no generado — igual que aiTutorService.ts, "el
 * profe" no tiene ningún modelo real detrás.
 *
 * Orden País → Carné → Nivel, no el orden en que se pidió: elegir primero
 * el país es lo que tiene sentido de cara al futuro (las letras A1/A2/B son
 * categorías de la UE; EEUU no las usa), aunque hoy solo España tenga
 * contenido real detrás.
 */
function buildSteps(): Step[] {
  return [
    {
      kind: 'choice',
      title: '¿Dónde vas a sacarte el carné?',
      body: 'El examen varía según el país. Hoy solo tenemos preguntas reales de la DGT española.',
      field: 'countryId',
      options: ONBOARDING_COUNTRIES.map((c) => ({
        id: c.id,
        title: c.name,
        subtitle: c.available ? 'Banco de preguntas disponible' : 'Próximamente',
        available: c.available,
        render: () => <OnboardingFlag code={c.code as FlagCode} />,
      })),
    },
    {
      kind: 'choice',
      title: '¿Qué carné te gustaría sacarte?',
      body: 'Hoy solo tenemos preguntas del permiso B. El resto de categorías llegarán más adelante.',
      field: 'licenseCategoryId',
      options: LICENSE_CATEGORIES.map((c) => ({
        id: c.id,
        title: `${c.name} (${c.code})`,
        subtitle: c.available ? c.description : 'Próximamente',
        available: c.available,
        render: () => <Icon name={c.icon} size={20} color="var(--color-primary)" />,
      })),
    },
    {
      kind: 'choice',
      title: '¿Cómo empezamos?',
      body: 'Así adaptamos por dónde te proponemos empezar la ruta de aprendizaje.',
      field: 'level',
      options: LEVEL_OPTIONS,
    },
    {
      kind: 'info',
      icon: 'bolt',
      title: '¡Hola! Soy tu profe',
      body: 'Ahora sí, te enseño en un minuto cómo funciona Roady para que saques el carné sin sustos.',
    },
    {
      kind: 'info',
      icon: 'road',
      title: 'Aprende por categorías',
      body: 'La ruta de Aprender está dividida en categorías con lecciones cortas. Ve completándolas en orden para desbloquear la siguiente.',
    },
    {
      kind: 'info',
      icon: 'target',
      title: 'Practica a tu manera',
      body: 'Simulacros cronometrados, un examen real más serio, preguntas al azar o un repaso automático de todo lo que sueles fallar.',
    },
    {
      kind: 'info',
      icon: 'users',
      title: 'Reta a tus amigos',
      body: 'Añade amigos con tu código, retales a un duelo 1 contra 1 en tiempo real y mira quién manda en el ranking entre vosotros.',
    },
    {
      kind: 'info',
      icon: 'flame',
      title: 'Racha, XP y logros',
      body: 'Contesta cada día para mantener la racha, gana XP con cada acierto y desbloquea logros a medida que avanzas.',
    },
  ];
}

export function OnboardingTutorial({ onFinish }: { onFinish: () => void }) {
  const [steps] = useState(buildSteps);
  const [index, setIndex] = useState(0);
  const dialogRef = useRef<HTMLDivElement>(null);
  const { profile, save } = useOnboardingProfile();
  const step = steps[index];
  const isLast = index === steps.length - 1;
  const titleId = 'onboarding-title';

  const selectedValue = step.kind === 'choice' ? profile[step.field] : null;
  const canContinue = step.kind === 'info' || selectedValue !== null;

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

      {step.kind === 'info' && (
        <div className={styles.mascotWrap}>
          <OnboardingMascot />
        </div>
      )}

      {/* key=index reinicia la entrada anim-pop-in en cada paso, para que se
          note el cambio de tarjeta y no un simple parpadeo de texto. */}
      <div className={`${styles.card} ${step.kind === 'choice' ? styles.cardWide : ''} anim-pop-in`} key={index}>
        {step.kind === 'info' && (
          <div className={styles.stepIcon}>
            <Icon name={step.icon} size={20} color="var(--color-primary)" />
          </div>
        )}
        <h2 id={titleId} className={styles.title}>
          {step.title}
        </h2>
        <p className={styles.body}>{step.body}</p>

        {step.kind === 'choice' && (
          <div className={styles.options} role="radiogroup" aria-labelledby={titleId}>
            {step.options.map((opt) => {
              const selected = selectedValue === opt.id;
              return (
                <button
                  key={opt.id}
                  type="button"
                  role="radio"
                  aria-checked={selected}
                  disabled={!opt.available}
                  className={`${styles.option} ${selected ? styles.optionSelected : ''}`}
                  onClick={() => save({ [step.field]: opt.id })}
                >
                  <span className={styles.optionIcon}>{opt.render()}</span>
                  <span className={styles.optionText}>
                    <span className={styles.optionTitle}>{opt.title}</span>
                    <span className={styles.optionSubtitle}>{opt.subtitle}</span>
                  </span>
                  {!opt.available && (
                    <span className={styles.optionLock}>
                      <Icon name="lock" size={14} color="var(--color-text-muted-40)" />
                    </span>
                  )}
                  {selected && (
                    <span className={styles.optionCheck}>
                      <Icon name="check" size={13} color="#fff" />
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        )}

        <div className={styles.dots} aria-hidden="true">
          {steps.map((_, i) => (
            <span key={i} className={`${styles.dot} ${i === index ? styles.dotActive : ''}`} />
          ))}
        </div>

        <div className={styles.actions}>
          {index > 0 && (
            <Button variant="secondary" style={{ flex: 1 }} onClick={() => setIndex((i) => i - 1)}>
              Atrás
            </Button>
          )}
          <Button
            style={{ flex: 1 }}
            disabled={!canContinue}
            onClick={() => (isLast ? onFinish() : setIndex((i) => i + 1))}
          >
            {isLast ? 'Empezar' : 'Continuar'}
          </Button>
        </div>
      </div>
    </div>
  );
}
