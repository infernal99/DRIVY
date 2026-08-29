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
              ese eje con la direccion de la curva. */}
          <g transform="translate(-17,-11)">
            <rect x="0" y="0" width="34" height="22" rx="7" className={styles.carBody} />
            <rect x="19" y="3.5" width="9" height="15" rx="3" className={styles.carGlass} />
            <rect x="7" y="5" width="8" height="12" rx="2.5" className={styles.carRoofSign} />
            <rect x="-2" y="3" width="5" height="4" rx="1.5" className={styles.carWheel} />
            <rect x="-2" y="15" width="5" height="4" rx="1.5" className={styles.carWheel} />
            <rect x="26" y="3" width="5" height="4" rx="1.5" className={styles.carWheel} />
            <rect x="26" y="15" width="5" height="4" rx="1.5" className={styles.carWheel} />
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
