import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { IconName, UserProgress } from '../../types';
import { getAllCategoryMastery, MASTERY_TIER_COPY } from '../../services/masteryService';
import { getCategoryById } from '../../data/categories';
import { getFriendLeaderboard, type LeaderboardEntry } from '../../services/friendsService';
import { Icon } from '../ui/Icon';

/** Same "practiced enough to judge" gate ProgressPage's weak-points ranking uses. */
const MIN_ANSWERED_TO_RANK = 3;

function HighlightCard({
  icon,
  iconColor,
  iconBg,
  label,
  value,
  subtitle,
  onClick,
}: {
  icon: IconName;
  iconColor: string;
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
        flex: '0 0 auto',
        width: 158,
        textAlign: 'left',
        background: 'var(--color-bg-card)',
        border: 'none',
        borderRadius: 16,
        padding: 14,
        boxShadow: 'var(--shadow-card)',
        cursor: 'pointer',
      }}
    >
      <div
        style={{
          width: 30,
          height: 30,
          borderRadius: 9,
          background: iconBg,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: 10,
        }}
      >
        <Icon name={icon} size={15} color={iconColor} />
      </div>
      <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--color-text-muted-50)' }}>{label}</div>
      <div
        style={{
          fontFamily: 'var(--font-display)',
          fontWeight: 700,
          fontSize: 15,
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
        iconColor="var(--color-error)"
        iconBg="var(--color-error-bg)"
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
        iconColor={lastExam.passed ? 'var(--color-success)' : 'var(--color-error)'}
        iconBg={lastExam.passed ? 'var(--color-success-bg)' : 'var(--color-error-bg)'}
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
        iconColor="var(--color-xp-text)"
        iconBg="var(--color-xp-bg)"
        label={leaderboardLeader.isMe ? 'Vas primero' : 'Ranking semanal'}
        value={leaderboardLeader.isMe ? `${leaderboardLeader.weeklyXp} XP` : leaderboardLeader.displayName}
        subtitle={leaderboardLeader.isMe ? 'entre tus amigos esta semana' : `${leaderboardLeader.weeklyXp} XP esta semana`}
        onClick={() => navigate('/friends')}
      />,
    );
  }

  if (cards.length === 0) return null;

  return (
    <div style={{ marginTop: 24 }}>
      <div style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 16, color: 'var(--color-text)', marginBottom: 12 }}>
        Resumen
      </div>
      <div style={{ display: 'flex', gap: 10, overflowX: 'auto', paddingBottom: 4 }}>{cards}</div>
    </div>
  );
}
