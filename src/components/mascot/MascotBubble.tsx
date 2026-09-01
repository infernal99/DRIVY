import { useEffect, useState } from 'react';
import type { MascotBubbleData } from './useMascot';
import styles from './MascotBubble.module.css';

/** Debe coincidir con la duración de "transition: opacity/transform" del CSS. */
const EXIT_MS = 200;

/**
 * Burbuja de diálogo reutilizable de la mascota. No se desmonta en seco al
 * ocultarse: se queda montada `EXIT_MS` de más para que la transición de
 * salida (opacity/transform) se vea, y luego sí desaparece del DOM.
 */
export function MascotBubble({ bubble, position }: { bubble: MascotBubbleData | null; position: 'top' | 'side' }) {
  const [rendered, setRendered] = useState(bubble);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (bubble) {
      setRendered(bubble);
      setVisible(false);
      // Doble rAF: hay que dejar que el navegador pinte el estado "oculto"
      // primero, si no, el cambio a "visible" se aplicaría en el mismo
      // frame y la transición nunca llegaría a animarse.
      let raf2 = 0;
      const raf1 = requestAnimationFrame(() => {
        raf2 = requestAnimationFrame(() => setVisible(true));
      });
      return () => {
        cancelAnimationFrame(raf1);
        cancelAnimationFrame(raf2);
      };
    }
    setVisible(false);
    const t = setTimeout(() => setRendered(null), EXIT_MS);
    return () => clearTimeout(t);
  }, [bubble]);

  if (!rendered) return null;

  return (
    <div
      className={`${styles.bubble} ${styles[position]} ${visible ? styles.visible : ''}`}
      role="status"
      aria-live="polite"
    >
      {rendered.message}
    </div>
  );
}
