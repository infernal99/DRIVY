import styles from './OnboardingTutorial.module.css';

/**
 * "El profe" — la mascota del tutorial. Reutiliza los tokens de marca
 * (--color-primary, --color-accent-pink, --color-primary-navy) en vez de
 * hexadecimales sueltos, a diferencia de los objetos decorativos del fondo
 * de auth: aquella era ilustración de ambiente, esta es un elemento de marca
 * que va a reaparecer (botón "ver tutorial de nuevo" en Ayuda), así que sí
 * debe seguir la paleta si algún día cambia.
 *
 * Sin IA real detrás — como aiTutorService, todo el texto que "dice" está
 * escrito a mano, no generado. El gorro de graduación es lo único que lo
 * marca como "profesor" sin necesidad de un dibujo más complejo.
 */
export function OnboardingMascot({ size = 96 }: { size?: number }) {
  return (
    <svg
      className={styles.mascotBob}
      width={size}
      height={size}
      viewBox="0 0 120 120"
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <linearGradient id="mascotBodyGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" style={{ stopColor: 'var(--color-primary)' }} />
          <stop offset="100%" style={{ stopColor: 'var(--color-accent-pink)' }} />
        </linearGradient>
      </defs>

      {/* Sombra de contacto */}
      <ellipse cx="60" cy="112" rx="30" ry="5" fill="rgba(0,0,0,0.28)" />

      {/* Borla del birrete */}
      <line x1="90" y1="18" x2="95" y2="35" stroke="var(--color-accent-pink)" strokeWidth="2.5" strokeLinecap="round" />
      <circle cx="95" cy="35" r="3.2" fill="var(--color-accent-pink)" />

      {/* Birrete: plato romboidal + banda */}
      <rect x="48" y="15" width="24" height="11" rx="5.5" fill="var(--color-primary-navy)" />
      <polygon points="60,4 92,18 60,32 28,18" fill="var(--color-primary-navy)" />

      {/* Cuerpo */}
      <rect x="14" y="26" width="92" height="86" rx="38" fill="url(#mascotBodyGrad)" />

      {/* Mofletes */}
      <circle cx="35" cy="76" r="6" fill="var(--color-accent-pink)" opacity="0.4" />
      <circle cx="85" cy="76" r="6" fill="var(--color-accent-pink)" opacity="0.4" />

      {/* Ojos */}
      <circle cx="44" cy="62" r="9.5" fill="#fff" />
      <circle cx="76" cy="62" r="9.5" fill="#fff" />
      <circle cx="46.5" cy="64.5" r="4.6" fill="var(--color-primary-navy)" />
      <circle cx="78.5" cy="64.5" r="4.6" fill="var(--color-primary-navy)" />
      <circle cx="48.5" cy="61" r="1.7" fill="#fff" />
      <circle cx="80.5" cy="61" r="1.7" fill="#fff" />

      {/* Sonrisa */}
      <path d="M46 82 Q60 93 74 82" stroke="var(--color-primary-navy)" strokeWidth="4" strokeLinecap="round" fill="none" />
    </svg>
  );
}
