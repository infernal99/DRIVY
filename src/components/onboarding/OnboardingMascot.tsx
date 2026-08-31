import styles from './OnboardingTutorial.module.css';

/**
 * "El profe" — la mascota y protagonista del onboarding. Un personaje propio
 * de Roady, no una copia del búho de Duolingo: cuerpo redondeado con gorro
 * de graduación (para leerse como "profesor" sin texto) y un volante en la
 * mano (referencia directa a "profe de autoescuela", que es literalmente lo
 * que representa).
 *
 * Reutiliza los tokens de marca (--color-primary, --color-accent-pink,
 * --color-primary-navy) en vez de hex sueltos: esta mascota va a reaparecer
 * en muchos sitios (perfil, "ver tutorial de nuevo"...) y debe seguir la
 * paleta si cambia.
 */
export function OnboardingMascot({ size = 180 }: { size?: number }) {
  return (
    <svg
      className={styles.mascotBob}
      width={size}
      height={size}
      viewBox="0 0 200 200"
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
      <ellipse cx="100" cy="186" rx="50" ry="8" fill="rgba(0,0,0,0.28)" />

      {/* Pies, dibujados antes que el cuerpo para que asomen por debajo */}
      <ellipse cx="78" cy="178" rx="15" ry="9" fill="var(--color-primary-navy)" />
      <ellipse cx="122" cy="178" rx="15" ry="9" fill="var(--color-primary-navy)" />

      {/* Brazo izquierdo, relajado */}
      <path d="M38 112 Q16 130 21 156" stroke="url(#mascotBodyGrad)" strokeWidth="22" strokeLinecap="round" fill="none" />

      {/* Brazo derecho, levantado sujetando el volante */}
      <path d="M163 102 Q189 72 183 40" stroke="url(#mascotBodyGrad)" strokeWidth="22" strokeLinecap="round" fill="none" />

      {/* Cuerpo. rx=46, no más: con un radio mayor el techo plano de la
          cabeza mide menos que la banda del gorro (40px) y el gorro queda
          flotando con un hueco visible por encima — pasó en el primer
          intento, comprobado con una copia ampliada del SVG. */}
      <rect x="30" y="48" width="140" height="130" rx="46" fill="url(#mascotBodyGrad)" />

      {/* Brillo superior — sensación de volumen sin sombreado complejo */}
      <ellipse cx="66" cy="76" rx="30" ry="20" fill="#fff" opacity="0.2" transform="rotate(-18 66 76)" />
      {/* Sombra interior inferior */}
      <ellipse cx="118" cy="152" rx="46" ry="22" fill="#000" opacity="0.08" />

      {/* Mofletes */}
      <circle cx="58" cy="118" r="8" fill="var(--color-accent-pink)" opacity="0.4" />
      <circle cx="142" cy="118" r="8" fill="var(--color-accent-pink)" opacity="0.4" />

      {/* Ojos */}
      <circle cx="78" cy="100" r="15" fill="#fff" />
      <circle cx="122" cy="100" r="15" fill="#fff" />
      <circle cx="81.5" cy="104" r="7.2" fill="var(--color-primary-navy)" />
      <circle cx="125.5" cy="104" r="7.2" fill="var(--color-primary-navy)" />
      <circle cx="84.5" cy="99.5" r="2.6" fill="#fff" />
      <circle cx="128.5" cy="99.5" r="2.6" fill="#fff" />

      {/* Cejas — el toque que da expresividad de "explicando algo" */}
      <path d="M67 82q11-7 21 0" stroke="var(--color-primary-navy)" strokeWidth="3.2" strokeLinecap="round" fill="none" />
      <path d="M112 82q11-7 21 0" stroke="var(--color-primary-navy)" strokeWidth="3.2" strokeLinecap="round" fill="none" />

      {/* Sonrisa */}
      <path d="M76 128q24 17 48 0" stroke="var(--color-primary-navy)" strokeWidth="5" strokeLinecap="round" fill="none" />

      {/* Volante en la mano derecha */}
      <circle cx="182" cy="38" r="16" stroke="var(--color-primary-navy)" strokeWidth="4" fill="#fff" />
      <circle cx="182" cy="38" r="4.5" fill="var(--color-primary-navy)" />
      <path
        d="M182 38V23M182 38l-13 8M182 38l13 8"
        stroke="var(--color-primary-navy)"
        strokeWidth="3.2"
        strokeLinecap="round"
      />

      {/* Borla del birrete */}
      <line x1="128" y1="36" x2="138" y2="64" stroke="var(--color-accent-pink)" strokeWidth="3" strokeLinecap="round" />
      <circle cx="138" cy="64" r="4" fill="var(--color-accent-pink)" />

      {/* Birrete: banda + plato romboidal, unos px más abajo que en el primer
          intento para que se solape con la cabeza en vez de quedar encima
          sin tocarla. */}
      <rect x="80" y="38" width="40" height="17" rx="8.5" fill="var(--color-primary-navy)" />
      <polygon points="100,16 148,36 100,56 52,36" fill="var(--color-primary-navy)" />
    </svg>
  );
}
