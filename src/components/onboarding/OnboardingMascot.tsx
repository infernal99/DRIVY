import styles from './OnboardingTutorial.module.css';

/**
 * "El profe" — la mascota y protagonista del onboarding.
 *
 * Es una imagen (public/mascot.webp), no SVG dibujado a mano como el primer
 * intento: el hand-drawn se quedó corto para un personaje que tiene que ser
 * el protagonista con acabado de verdad. Generada con IA de imágenes por
 * Oriol a partir de un prompt con los colores de marca (--color-primary
 * #8B5CF6 → --color-accent-pink #E879F9), recortada del fondo blanco por
 * relleno por inundación desde los bordes (mismo método que los objetos de
 * la carretera) y comprimida a WebP: 480×573, 47 KB.
 *
 * Proporción NO cuadrada (algo más alta que ancha) a diferencia del primer
 * intento en SVG con viewBox 200×200 — `size` se trata como el ancho y el
 * alto sale de la proporción real de la imagen, para no deformarla.
 */
const INTRINSIC_W = 480;
const INTRINSIC_H = 573;

export function OnboardingMascot({ size = 180 }: { size?: number }) {
  const height = Math.round((size * INTRINSIC_H) / INTRINSIC_W);
  return (
    <img
      src="/mascot.webp"
      alt=""
      className={styles.mascotBob}
      width={size}
      height={height}
      style={{ width: size, height }}
      decoding="async"
    />
  );
}
