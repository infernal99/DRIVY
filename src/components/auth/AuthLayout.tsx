import type { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { Icon } from '../ui/Icon';
import { AuthDecor } from './AuthDecor';
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
      <AuthDecor />

      <div className={styles.column}>
        <button type="button" className={styles.backBtn} onClick={() => navigate(-1)} aria-label="Volver">
          <Icon name="chevronLeft" size={16} color="currentColor" />
        </button>

        <div className={styles.pills} aria-hidden="true">
          <div className={`${styles.pill} ${styles.pillLeft}`}>
            <span className={`${styles.pillIcon} ${styles.pillIconBrand}`}>
              <Icon name="bolt" size={15} color="#fff" />
            </span>
            <span style={{ minWidth: 0 }}>
              <span className={styles.pillTitle}>Prepárate</span>
              <span className={styles.pillText} style={{ display: 'block' }}>
                Aprueba tu teórico
              </span>
            </span>
          </div>

          <div className={`${styles.pill} ${styles.pillRight}`}>
            <span className={`${styles.pillIcon} ${styles.pillIconMint}`}>
              <Icon name="chart" size={15} color="#fff" />
            </span>
            <span style={{ minWidth: 0 }}>
              <span className={styles.pillTitle}>Progreso</span>
              <span className={styles.pillText} style={{ display: 'block' }}>
                Mejora cada día
              </span>
            </span>
          </div>
        </div>

        <header className={styles.brand}>
          <img src="/logo.png" alt="Roady" className={styles.logoMark} width={400} height={312} />
          <div className={styles.wordmark}>Roady</div>
          <p className={styles.slogan}>
            Aprende. Practica. <span className={styles.sloganAccent}>Conduce tu futuro.</span>
          </p>
        </header>

        <div className={styles.card}>
          <h1 className={styles.title}>{title}</h1>
          <p className={styles.tagline}>{tagline}</p>
          {children}
        </div>

        <div className={styles.features}>
          <div className={styles.feature}>
            <span className={styles.featureIcon} style={{ background: 'rgba(139, 92, 246, 0.14)' }}>
              <Icon name="book" size={17} color="var(--color-primary)" />
            </span>
            <span className={styles.featureTitle}>Tests actualizados</span>
            <span className={styles.featureText}>preguntas oficiales</span>
          </div>
          <div className={styles.feature}>
            <span className={styles.featureIcon} style={{ background: 'rgba(255, 138, 61, 0.16)' }}>
              <Icon name="target" size={17} color="var(--color-streak)" />
            </span>
            <span className={styles.featureTitle}>Prácticas reales</span>
            <span className={styles.featureText}>simulacros de examen</span>
          </div>
          <div className={styles.feature}>
            <span className={styles.featureIcon} style={{ background: 'rgba(58, 178, 110, 0.16)' }}>
              <Icon name="flame" size={17} color="var(--color-success)" />
            </span>
            <span className={styles.featureTitle}>Logros y rachas</span>
            <span className={styles.featureText}>mantén tu motivación</span>
          </div>
        </div>
      </div>
    </div>
  );
}
