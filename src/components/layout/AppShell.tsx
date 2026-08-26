import type { ReactNode } from 'react';
import styles from './AppShell.module.css';

export function AppShell({ children, nav }: { children: ReactNode; nav?: ReactNode }) {
  return (
    <div className={styles.shell}>
      <div className={styles.frame}>
        <div className={`${styles.content} ${nav ? '' : styles.noNav}`}>{children}</div>
        {nav}
      </div>
    </div>
  );
}
