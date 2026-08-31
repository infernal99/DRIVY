/**
 * Banderas dibujadas a mano en SVG, no emoji: en Windows los emoji de
 * bandera (banderines regionales) se renderizan como el código de país en
 * texto plano ("ES", "US"...) en vez de una bandera — decisión deliberada
 * de la fuente Segoe UI Emoji, no un fallo de configuración. Confirmado
 * en este mismo entorno antes de escribir esto. Simplificadas a propósito
 * (sin estrellas de la Union Jack ni el escudo de España) — son iconos de
 * ~28px, no ilustraciones.
 */
export type FlagCode = 'ES' | 'US' | 'GB' | 'FR';

function FlagShape({ code }: { code: FlagCode }) {
  switch (code) {
    case 'ES':
      return (
        <>
          <rect width="32" height="24" fill="#AA151B" />
          <rect y="6" width="32" height="12" fill="#F1BF00" />
        </>
      );
    case 'FR':
      return (
        <>
          <rect width="32" height="24" fill="#fff" />
          <rect width="11" height="24" fill="#002654" />
          <rect x="21" width="11" height="24" fill="#ED2939" />
        </>
      );
    case 'US':
      return (
        <>
          <rect width="32" height="24" fill="#B31942" />
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <rect key={i} y={i * 3.7} width="32" height="1.85" fill="#fff" />
          ))}
          <rect width="14" height="13" fill="#0A3161" />
          {[0, 1].map((row) =>
            [0, 1, 2].map((col) => (
              <circle key={`${row}-${col}`} cx={3 + col * 4.5} cy={3.5 + row * 6} r="0.9" fill="#fff" />
            )),
          )}
        </>
      );
    case 'GB':
      // fill="none" es obligatorio en estos cuatro paths: por defecto un
      // <path> se rellena de negro, y M...L...M...L... sin fill=none tapa
      // la bandera entera con un relleno en vez de dibujar solo las líneas.
      return (
        <>
          <rect width="32" height="24" fill="#00247D" />
          <path d="M0 0L32 24M32 0L0 24" stroke="#fff" strokeWidth="4.5" fill="none" />
          <path d="M0 0L32 24M32 0L0 24" stroke="#CF142B" strokeWidth="1.6" fill="none" />
          <path d="M16 0V24M0 12H32" stroke="#fff" strokeWidth="7.5" fill="none" />
          <path d="M16 0V24M0 12H32" stroke="#CF142B" strokeWidth="2.6" fill="none" />
        </>
      );
  }
}

export function OnboardingFlag({ code, size = 28 }: { code: FlagCode; size?: number }) {
  const clipId = `flag-clip-${code}`;
  return (
    <svg width={size} height={(size * 3) / 4} viewBox="0 0 32 24" aria-hidden="true" focusable="false">
      <defs>
        <clipPath id={clipId}>
          <rect width="32" height="24" rx="3" />
        </clipPath>
      </defs>
      <g clipPath={`url(#${clipId})`}>
        <FlagShape code={code} />
      </g>
    </svg>
  );
}
