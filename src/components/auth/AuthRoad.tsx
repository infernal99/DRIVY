import { useEffect, useState } from 'react';
import styles from './AuthLayout.module.css';

/** Trazado de la carretera. El coche recorre exactamente esta misma curva. */
const ROAD = 'M 190 -60 C 190 90 55 165 75 305 C 95 445 335 470 315 615 C 295 760 145 785 165 980';

/**
 * Fondo animado de las pantallas de auth: una carretera serpenteante con un
 * coche de autoescuela dando vueltas en bucle.
 *
 * La animación va dentro del SVG (animateMotion sobre la propia ruta) y no en
 * CSS a propósito: el fondo escala con la ventana, y un offset-path con
 * coordenadas en píxeles se desincronizaría del trazado al redimensionar.
 * Así el coche sigue la curva exacta a cualquier tamaño.
 *
 * Con prefers-reduced-motion el coche se queda quieto en la carretera: hay
 * gente a la que el movimiento continuo en bucle le provoca mareo, y esto
 * está detrás de un formulario donde hay que leer.
 */
export function AuthRoad() {
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  return (
    <div className={styles.roadLayer} aria-hidden="true">
      {/* "meet" y no "slice": con slice, en una ventana ancha el SVG se escala
          por el ancho (2,25x en escritorio) y la carretera se estira fuera de
          pantalla dejando solo trazos sueltos. Con meet cabe entera siempre —
          en movil casi llena, y en escritorio queda como una cinta centrada
          detras de la columna. */}
      <svg className={styles.roadSvg} viewBox="0 0 400 900" preserveAspectRatio="xMidYMid meet" fill="none">
        <defs>
          {/* Referenciado por el mpath del coche: una sola definicion de la
              curva para carretera y trayectoria, imposible que se desalineen. */}
          <path id="roadPath" d={ROAD} />
        </defs>

        {/* Asfalto */}
        <path d={ROAD} className={styles.roadAsphalt} strokeWidth="88" strokeLinecap="round" />
        {/* Arcenes */}
        <path d={ROAD} className={styles.roadEdge} strokeWidth="82" strokeLinecap="round" />
        {/* Linea discontinua central */}
        <path d={ROAD} className={styles.roadDashes} strokeWidth="4" strokeDasharray="24 34" strokeLinecap="round" />

        {/* Sin animacion el coche se quedaria en el origen (0,0), fuera de la
            carretera: quieto se coloca a mano sobre una curva. */}
        <g className={styles.car} transform={reducedMotion ? 'translate(78,300) rotate(100)' : undefined}>
          {/* Dibujado apuntando a +X: animateMotion con rotate="auto" alinea
              ese eje con la direccion de la curva. El anchor (-22,-13) es el
              centro real de la caja del coche (x:2-42, y:3-23.4), no un
              numero redondo — recalcularlo si cambian las siluetas de abajo. */}
          <g transform="translate(-22,-13)">
            {/* Zocalo/carroceria: banda redondeada de parachoques a parachoques. */}
            <rect x="2" y="12" width="40" height="7" rx="3.5" className={styles.carBody} />
            {/* Cabina: cupula suave sobre el zocalo, un pelin mas fria de tono
                para dar el efecto de dos tonos de un coche real. */}
            <path d="M12 12 C13 5 17 3 22 3 L28 3 C33 3 35 6 35 12 Z" className={styles.carRoof} />
            {/* Cristales separados por el pilar B (el hueco entre ambos paths). */}
            <path d="M14.4 11 C15.2 6.6 18 5.3 21.7 5.3 L22.3 5.3 L22.3 11 Z" className={styles.carGlass} />
            <path d="M23.7 5.3 L28.3 5.3 C32.4 5.3 33.9 7.3 34.2 11 L23.7 11 Z" className={styles.carGlass} />
            {/* Reflejo diagonal sobre el cristal delantero — el toque que más
                vende "cristal" en vez de "rectangulo relleno". */}
            <line x1="25" y1="6.4" x2="32" y2="9.8" className={styles.carGlassShine} strokeWidth="0.9" strokeLinecap="round" />
            {/* Cartel de autoescuela en el techo. */}
            <rect x="18" y="1" width="8" height="2.4" rx="1.2" className={styles.carRoofSign} />
            {/* Retrovisor. */}
            <rect x="33.6" y="9.5" width="2.1" height="1.3" rx="0.65" className={styles.carBody} />
            {/* Junta de puerta, sutil. */}
            <line x1="23" y1="12" x2="23" y2="19" className={styles.carSeam} strokeWidth="0.8" />
            {/* Faro y piloto trasero. */}
            <rect x="39.8" y="13.4" width="3" height="2.4" rx="1.2" className={styles.carHeadlight} />
            <rect x="2.2" y="13.5" width="2.4" height="2.2" rx="1.1" className={styles.carTaillight} />

            {/* Ruedas con llanta y un radio que gira de verdad (animateTransform
                SMIL, no CSS): sin el radio, una rueda rotando seria un circulo
                identico a si mismo en cada frame, invisible. */}
            {[11, 34].map((cx) => (
              <g key={cx}>
                <circle cx={cx} cy="19" r="4.4" className={styles.carWheel} />
                <rect x={cx - 0.7} y="15.1" width="1.4" height="3.5" rx="0.7" className={styles.carSpoke} />
                <circle cx={cx} cy="19" r="1.9" className={styles.carHub} />
                {!reducedMotion && (
                  <animateTransform
                    attributeName="transform"
                    type="rotate"
                    from={`0 ${cx} 19`}
                    to={`360 ${cx} 19`}
                    dur="0.6s"
                    repeatCount="indefinite"
                  />
                )}
              </g>
            ))}
          </g>

          {!reducedMotion && (
            <animateMotion dur="22s" repeatCount="indefinite" rotate="auto" calcMode="linear">
              {/* href es SVG2; Safari arrastro mucho tiempo necesitar el
                  xlink:href en mpath, asi que van los dos. */}
              <mpath href="#roadPath" xlinkHref="#roadPath" />
            </animateMotion>
          )}
        </g>
      </svg>
    </div>
  );
}
