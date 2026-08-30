import { Button } from '../ui/Button';
import { Icon } from '../ui/Icon';

export function LessonCompleteScreen({
  xpGained,
  streak,
  correct,
  total,
  nextLessonName,
  onContinue,
  continueLabel = 'CONTINUAR',
}: {
  xpGained: number;
  streak: number;
  correct: number;
  total: number;
  nextLessonName?: string;
  onContinue: () => void;
  continueLabel?: string;
}) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        background:
          'linear-gradient(180deg,var(--color-primary-navy),var(--color-primary-navy-mid) 45%,var(--color-bg-screen) 45%)',
      }}
    >
      <div className="anim-pop-in" style={{ flex: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '36px 24px 24px', textAlign: 'center' }}>
        <div
          style={{
            width: 80,
            height: 80,
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.12)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 16,
          }}
        >
          <Icon name="flag" size={38} color="var(--color-xp)" />
        </div>
        <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 22, color: '#fff' }}>
          ¡Lección completada!
        </div>
      </div>

      <div style={{ flex: 1, background: 'var(--color-bg-screen)', borderRadius: '28px 28px 0 0', padding: '22px 22px 26px', display: 'flex', flexDirection: 'column', gap: 14, overflowY: 'auto' }}>
        <div style={{ display: 'flex', gap: 10 }}>
          <StatBox value={`+${xpGained}`} label="XP ganado" color="var(--color-xp-text)" />
          <StatBox
            value={
              <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4 }}>
                <span style={{ width: 12, height: 14, background: 'var(--color-streak)', borderRadius: '50% 50% 50% 0', transform: 'rotate(45deg)', display: 'inline-block' }} />
                {streak}
              </span>
            }
            label="Racha"
            color="var(--color-streak)"
          />
          <StatBox value={`${correct}/${total}`} label="Aciertos" color="var(--color-success)" />
        </div>

        {nextLessonName && (
          <div style={{ background: 'var(--color-bg-card)', borderRadius: 16, padding: '14px 16px', boxShadow: 'var(--shadow-card)', display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 40, height: 40, borderRadius: 12, background: 'var(--color-info-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ width: 18, height: 18, border: '2.5px solid var(--color-primary)', borderRadius: '50%' }} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 11, color: 'var(--color-text-muted-50)', fontWeight: 600 }}>Siguiente lección</div>
              <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--color-text)' }}>{nextLessonName}</div>
            </div>
          </div>
        )}

        <Button onClick={onContinue} style={{ marginTop: 6 }}>
          {continueLabel}
        </Button>
      </div>
    </div>
  );
}

function StatBox({ value, label, color }: { value: React.ReactNode; label: string; color: string }) {
  return (
    <div style={{ flex: 1, background: 'var(--color-bg-card)', borderRadius: 16, padding: 14, boxShadow: 'var(--shadow-card)', textAlign: 'center' }}>
      <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 19, color }}>{value}</div>
      <div style={{ fontSize: 11, color: 'var(--color-text-muted-50)', fontWeight: 600, marginTop: 2 }}>{label}</div>
    </div>
  );
}
