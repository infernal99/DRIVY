import { useNavigate } from 'react-router-dom';
import { Icon } from '../ui/Icon';
import styles from './ScreenHeader.module.css';

export function ScreenHeader({ title, onBack }: { title: string; onBack?: () => void }) {
  const navigate = useNavigate();
  return (
    <div className={styles.header}>
      <button
        type="button"
        className={styles.back}
        onClick={() => (onBack ? onBack() : navigate(-1))}
        aria-label="Volver"
      >
        <Icon name="chevronLeft" size={16} />
      </button>
      <span className={styles.title}>{title}</span>
    </div>
  );
}
