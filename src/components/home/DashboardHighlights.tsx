import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { IconName, UserProgress } from '../../types';
import { getAllCategoryMastery, MASTERY_TIER_COPY } from '../../services/masteryService';
import { getCategoryById } from '../../data/categories';
import { getFriendLeaderboard, type LeaderboardEntry } from '../../services/friendsService';
import { useAuthStore } from '../../store/authStore';
import { Icon } from '../ui/Icon';

/** Same "practiced enough to judge" gate ProgressPage's weak-points ranking uses. */
const MIN_ANSWERED_TO_RANK = 3;

function HighlightCard({
  icon,
  iconBg,
  label,
  value,
  subtitle,
  onClick,
}: {
  icon: IconName;
  iconBg: string;
  label: string;
  value: string;
  subtitle: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        position: 'relative',
        overflow: 'hidden',
        flex: '0 0 auto',
        width: 162,
        textAlign: 'left',
        background: 'var(--color-bg-card)',
        border: 'none',
        borderRadius: 16,
        padding: 14,
        boxShadow: 'var(--shadow-card)',
        cursor: 'pointer',
        transition: 'transform 120ms ease',
      }}
    >
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          zIndex: 0,
          right: -24,
          top: -24,
          width: 90,
          height: 90,
          borderRadius: '50%',
          pointerEvents: 'none',
          background: `radial-gradient(closest-side, color-mix(in srgb, ${iconBg} 20%, transparent), transparent)`,
        }}
      />
      <div
        style={{
          position: 'relative',
          zIndex: 1,
          width: 36,
          height: 36,
          borderRadius: '50%',
          background: iconBg,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: 10,
          boxShadow: `0 4px 10px color-mix(in srgb, ${iconBg} 55%, transparent)`,
        }}
      >
        <Icon name={icon} size={17} color="#fff" />
      </div>
      <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--color-text-muted-50)' }}>{label}</div>
      <div
        style={{
          fontFamily: 'var(--font-display)',
          fontWeight: 800,
          fontSize: 15.5,
          color: 'var(--color-text)',
          marginTop: 2,
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
        }}
      >
        {value}
      </div>
      <div style={{ fontSize: 11, color: 'var(--color-text-muted-45)', marginTop: 2 }}>{subtitle}</div>
    </button>
  );
}

/**
 * A compact, horizontally-scrolling "what's going on" row — deliberately NOT
 * a stack of full-width cards, so showing a weak category + last exam +
 * friends-leaderboard preview together doesn't push the rest of Home down.
 * Any of the three is skipped when there's nothing to show (no practiced
 * category yet, no exam taken, no friends) — the row shrinks or disappears
 * rather than showing empty/placeholder cards.
 */
export function DashboardHighlights({ progress }: { progress: UserProgress }) {
  const navigate = useNavigate();
  const isAuthenticated = useAuthStore((s) => s.status === 'authenticated');
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[] | null>(null);

  useEffect(() => {
    getFriendLeaderboard()
      .then(setLeaderboard)
      .catch(() => setLeaderboard([]));
  }, []);

  const weakest = getAllCategoryMastery(progress)
    .filter((c) => (progress.categoryStats[c.categoryId]?.answered ?? 0) >= MIN_ANSWERED_TO_RANK)
    .sort((a, b) => a.score - b.score)[0];

  const lastExam = progress.examResults[progress.examResults.length - 1];
  const leaderboardLeader = leaderboard && leaderboard.length > 1 ? leaderboard[0] : null;

  const cards: React.ReactNode[] = [];

  if (weakest) {
    const category = getCategoryById(weakest.categoryId);
    cards.push(
      <HighlightCard
        key="weak"
        icon="target"
        iconBg="var(--color-error)"
        label="Punto débil"
        value={category?.name ?? weakest.categoryId}
        subtitle={`${MASTERY_TIER_COPY[weakest.tier].label} · ${weakest.score}%`}
        onClick={() => navigate(`/learn/${weakest.categoryId}`)}
      />,
    );
  }

  if (lastExam) {
    cards.push(
      <HighlightCard
        key="exam"
        icon="flag"
        iconBg={lastExam.passed ? 'var(--color-success)' : 'var(--color-error)'}
        label="Último examen"
        value={`${lastExam.correctCount}/${lastExam.totalCount}`}
        subtitle={lastExam.passed ? 'Apto' : 'No apto'}
        onClick={() => navigate('/exams')}
      />,
    );
  }

  if (leaderboardLeader) {
    cards.push(
      <HighlightCard
        key="leaderboard"
        icon="users"
        iconBg="var(--color-xp)"
        label={leaderboardLeader.isMe ? 'Vas primero' : 'Ranking semanal'}
        value={leaderboardLeader.isMe ? `${leaderboardLeader.weeklyXp} XP` : leaderboardLeader.displayName}
        subtitle={leaderboardLeader.isMe ? 'entre tus amigos esta semana' : `${leaderboardLeader.weeklyXp} XP esta semana`}
        onClick={() => navigate('/friends')}
      />,
    );
  }

  // Solo para /dev/home (sin sesión real, así que nunca hay nada que
  // mostrar aquí) — mismo guard que DailyMissionsCard: DEV + no autenticado,
  // lo que con RequireAuth solo ocurre en esa ruta de previsualización.
  if (cards.length === 0 && !isAuthenticated && import.meta.env.DEV) {
    cards.push(
      <HighlightCard
        key="demo-weak"
        icon="target"
        iconBg="var(--color-error)"
        label="Punto débil"
        value="Señales"
        subtitle="Necesitas practicar · 39%"
        onClick={() => navigate('/learn/senales')}
      />,
      <HighlightCard
        key="demo-leaderboard"
        icon="users"
        iconBg="var(--color-xp)"
        label="Ranking semanal"
        value="ian monfil"
        subtitle="728 XP esta semana"
        onClick={() => navigate('/friends')}
      />,
    );
  }

  if (cards.length === 0) return null;

  return (
    <div style={{ marginTop: 24 }}>
      <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 17, color: 'var(--color-text)', marginBottom: 12 }}>
        Resumen
      </div>
      <div style={{ display: 'flex', gap: 10, overflowX: 'auto', paddingBottom: 4 }}>{cards}</div>
    </div>
  );
}
