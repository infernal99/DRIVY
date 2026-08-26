import { NavLink } from 'react-router-dom';
import { Icon } from '../ui/Icon';
import { useFriendNotificationStore } from '../../store/friendNotificationStore';
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
  const hasFriendAlert = useFriendNotificationStore((s) => s.hasIncomingRequests || s.hasNewFriend);

  return (
    <nav className={styles.nav} aria-label="Navegación principal">
      {ITEMS.map((item) => {
        const showDot = item.to === '/friends' && hasFriendAlert;
        return (
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
                <span className={styles.iconWrap}>
                  <Icon name={item.icon} size={22} color={isActive ? 'var(--color-primary)' : 'rgba(16,25,46,0.4)'} />
                  {showDot && (
                    <span className={styles.dot} role="status" aria-label="Tienes novedades de amigos" />
                  )}
                </span>
                <span className={styles.label}>{item.label}</span>
              </>
            )}
          </NavLink>
        );
      })}
    </nav>
  );
}
