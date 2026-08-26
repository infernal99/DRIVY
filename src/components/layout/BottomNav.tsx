import { NavLink } from 'react-router-dom';
import { Icon } from '../ui/Icon';
import type { IconName } from '../../types';
import styles from './BottomNav.module.css';

const ITEMS: { to: string; label: string; icon: IconName }[] = [
  { to: '/', label: 'Inicio', icon: 'home' },
  { to: '/friends', label: 'Amigos', icon: 'users' },
  { to: '/practice', label: 'Practicar', icon: 'target' },
  { to: '/progress', label: 'Progreso', icon: 'chart' },
  { to: '/profile', label: 'Perfil', icon: 'user' },
];

export function BottomNav() {
  return (
    <nav className={styles.nav} aria-label="Navegación principal">
      {ITEMS.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          end={item.to === '/'}
          className={styles.item}
          style={({ isActive }) => ({
            color: isActive ? 'var(--color-primary)' : 'rgba(16,25,46,0.4)',
          })}
        >
          {({ isActive }) => (
            <>
              <Icon name={item.icon} size={22} color={isActive ? 'var(--color-primary)' : 'rgba(16,25,46,0.4)'} />
              <span className={styles.label}>{item.label}</span>
            </>
          )}
        </NavLink>
      ))}
    </nav>
  );
}
