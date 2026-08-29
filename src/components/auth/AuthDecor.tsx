import styles from './AuthLayout.module.css';

/**
 * Objetos decorativos del fondo de las pantallas de auth.
 *
 * Son los renders 3D de la lámina de marca, recortados por componentes
 * conexos sobre el canal alfa (no por rectángulo: las cajas de las llaves y
 * el cono se solapan) y guardados en WebP — 67 KB los tres, frente a 378 KB
 * en PNG.
 *
 * Van dentro de la capa de fondo, así que la tarjeta del formulario los tapa
 * por orden natural de pintado y solo asoman por los bordes. El contenedor
 * padre ya es aria-hidden, por eso el alt va vacío.
 */
export function AuthDecor() {
  return (
    <div className={styles.decorLayer} aria-hidden="true">
      <img
        src="/decor/keys.webp"
        alt=""
        className={`${styles.decor} ${styles.decorKeys}`}
        width={250}
        height={346}
        loading="lazy"
        decoding="async"
      />
      <img
        src="/decor/light.webp"
        alt=""
        className={`${styles.decor} ${styles.decorLight}`}
        width={220}
        height={632}
        loading="lazy"
        decoding="async"
      />
      <img
        src="/decor/cone.webp"
        alt=""
        className={`${styles.decor} ${styles.decorCone}`}
        width={280}
        height={346}
        loading="lazy"
        decoding="async"
      />
    </div>
  );
}
