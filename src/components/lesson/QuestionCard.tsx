import type { Question } from '../../types';
import { TrafficSign, type SignKey } from '../ui/TrafficSign';
import { getPublicImageUrl } from '../../services/storageService';

export function QuestionImage({ question }: { question: Question }) {
  const image = question.image;
  if (!image) return null;
  if (image.signKey) {
    return (
      <div
        style={{
          width: 150,
          height: 150,
          background: '#F5F7FB',
          borderRadius: 24,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 6px 20px rgba(11,30,61,0.08)',
          marginBottom: 26,
        }}
      >
        <TrafficSign signKey={image.signKey as SignKey} size={110} />
        <span className="visually-hidden">{image.alt || 'Señal de tráfico'}</span>
      </div>
    );
  }
  if (image.url || image.localPath || image.storagePath) {
    const src = image.localPath ?? image.url ?? getPublicImageUrl('question-images', image.storagePath!);
    return <img src={src} alt={image.alt} style={{ width: '100%', maxWidth: 240, borderRadius: 20, marginBottom: 26 }} />;
  }
  return null;
}

export function OptionRow({
  text,
  state,
  onClick,
  disabled,
}: {
  text: string;
  state: 'idle' | 'selected' | 'correct' | 'wrong';
  onClick: () => void;
  disabled: boolean;
}) {
  const styleByState: Record<typeof state, React.CSSProperties> = {
    idle: { border: '2px solid #EEF1F7', background: '#fff' },
    selected: { border: '2px solid var(--color-primary)', background: 'var(--color-info-bg)' },
    correct: { border: '2px solid var(--color-success)', background: 'var(--color-success-bg)' },
    wrong: { border: '2px solid var(--color-error)', background: 'var(--color-error-bg)' },
  };
  const dotByState: Record<typeof state, React.CSSProperties> = {
    idle: { border: '2px solid #D5DAE5', background: 'transparent' },
    selected: { border: '2px solid var(--color-primary)', background: 'var(--color-primary)' },
    correct: { border: '2px solid var(--color-success)', background: 'var(--color-success)' },
    wrong: { border: '2px solid var(--color-error)', background: 'var(--color-error)' },
  };

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-pressed={state === 'selected'}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        padding: '14px 16px',
        borderRadius: 14,
        width: '100%',
        textAlign: 'left',
        cursor: disabled ? 'default' : 'pointer',
        ...styleByState[state],
      }}
    >
      <div style={{ width: 18, height: 18, borderRadius: '50%', flex: 'none', ...dotByState[state] }} />
      <span style={{ flex: 1, fontSize: 14.5, fontWeight: 600, color: 'var(--color-text)' }}>{text}</span>
    </button>
  );
}
