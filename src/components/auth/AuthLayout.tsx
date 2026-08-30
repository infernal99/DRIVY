import type { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { Icon } from '../ui/Icon';
import { AuthRoad } from './AuthRoad';
import styles from './AuthLayout.module.css';

/**
 * Chrome compartido de /login, /register, /forgot-password y /reset-password.
 *
 * A diferencia del resto de la app, estas pantallas NO usan AppShell: su
 * fondo sangra a toda la ventana. Con el marco de 480px de AppShell, el
 * degradado pastel se cortaba en seco y la banda lisa de alrededor parecía
 * "otra página por debajo". Aquí el fondo ocupa el viewport entero y solo el
 * contenido se limita a 480px.
 *
 * El ambiente (degradado, cristal, píldoras) es CSS; los objetos del fondo
 * son los renders de marca. Sin BottomNav: son flujos independientes.
 */
export function AuthLayout({ title, tagline, children }: { title: string; tagline: string; children: ReactNode }) {
  const navigate = useNavigate();

  return (
    <div className={styles.page}>
      <AuthRoad />

      <div className={styles.column}>
        {/* navigate(-1) a secas dejaba el boton muerto para quien entra
            directo a /login (sin historial previo): ahi cae a la portada. */}
        <button
          type="button"
          className={styles.backBtn}
          onClick={() => (window.history.length > 1 ? navigate(-1) : navigate('/'))}
          aria-label="Volver"
        >
          <Icon name="chevronLeft" size={16} color="currentColor" />
        </button>

        <header className={styles.brand}>
          <img src="/logo.png" alt="Roady" className={styles.logoMark} width={400} height={312} />
          <div className={styles.wordmark}>Roady</div>
          <p className={styles.slogan}>
            Aprende. Practica. <span className={styles.sloganAccent}>Conduce tu futuro.</span>
          </p>
        </header>

        {/* <main> para que haya un landmark real: sin él, quien navegue con
            lector de pantalla no tiene forma de saltar directo al formulario. */}
        <main className={styles.card}>
          <h1 className={styles.title}>{title}</h1>
          <p className={styles.tagline}>{tagline}</p>
          {children}
        </main>
      </div>
    </div>
  );
}
