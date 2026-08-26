import type { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { Icon } from '../ui/Icon';
import { AppShell } from '../layout/AppShell';
import styles from './AuthLayout.module.css';

/**
 * Shared chrome for /login, /register, /forgot-password and /reset-password
 * — a scaled-down version of HomePage's hero gradient so these screens read
 * as DRIVY, not as a generic auth template. No BottomNav: these are
 * standalone flows, not tabs of the main app shell.
 */
export function AuthLayout({ title, tagline, children }: { title: string; tagline: string; children: ReactNode }) {
  const navigate = useNavigate();
  return (
    <AppShell>
      <div className={styles.wrap}>
        <div className={styles.hero}>
          <div className={styles.heroDecor} />
          <button type="button" className={styles.backBtn} onClick={() => navigate(-1)} aria-label="Volver">
            <Icon name="chevronLeft" size={16} color="#fff" />
          </button>
          <div className={styles.brand}>
            <div className={styles.logoMark}>D</div>
            <div>
              <div className={styles.title}>{title}</div>
              <div className={styles.tagline}>{tagline}</div>
            </div>
          </div>
        </div>
        <div className={styles.sheet}>{children}</div>
      </div>
    </AppShell>
  );
}
