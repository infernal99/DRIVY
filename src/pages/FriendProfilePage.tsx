import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getFriendProfile, removeFriend, type FriendProfile } from '../services/friendsService';
import { getFriendBattleStats, getHeadToHead, type BattleStats, type HeadToHeadRecord } from '../services/battlesService';
import { getAchievementById } from '../data/achievements';
import { getCategoryById } from '../data/categories';
import { AppShell } from '../components/layout/AppShell';
import { ScreenHeader } from '../components/layout/ScreenHeader';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Pill } from '../components/ui/Pill';
import { Icon } from '../components/ui/Icon';
import { Avatar } from '../components/ui/Avatar';
import { ProgressBar } from '../components/ui/ProgressBar';
import { EmptyState } from '../components/ui/EmptyState';
import { LoadingScreen } from '../components/ui/Loading';

function errorMessage(err: unknown, fallback: string): string {
  return err instanceof Error ? err.message : fallback;
}

export function FriendProfilePage() {
  const navigate = useNavigate();
  const { userId = '' } = useParams();
  const [profile, setProfile] = useState<FriendProfile | null>(null);
  const [battleStats, setBattleStats] = useState<BattleStats | null>(null);
  const [headToHead, setHeadToHead] = useState<HeadToHeadRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [confirmingRemove, setConfirmingRemove] = useState(false);
  const [removing, setRemoving] = useState(false);

  useEffect(() => {
    setLoading(true);
    setError(null);
    Promise.all([getFriendProfile(userId), getFriendBattleStats(userId), getHeadToHead(userId)])
      .then(([p, b, h2h]) => {
        setProfile(p);
        setBattleStats(b);
        setHeadToHead(h2h);
      })
      .catch((err) => setError(errorMessage(err, 'No se pudo cargar este perfil.')))
      .finally(() => setLoading(false));
  }, [userId]);

  return (
    <AppShell>
      <ScreenHeader title={profile?.displayName ?? 'Perfil'} />
      <div style={{ flex: 1, overflowY: 'auto', padding: '6px 20px 30px' }}>
        {loading ? (
          <LoadingScreen />
        ) : error || !profile ? (
          <EmptyState icon="users" title="No se puede mostrar este perfil" description={error ?? 'Este perfil no está disponible.'} />
        ) : (
          <>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', marginBottom: 20 }}>
              <Avatar name={profile.displayName} size={76} />
              <div style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 18, color: 'var(--color-text)', marginTop: 10 }}>
                {profile.displayName}
              </div>
              <div style={{ display: 'flex', gap: 8, marginTop: 8, flexWrap: 'wrap', justifyContent: 'center' }}>
                <Pill>Nivel {profile.level}</Pill>
                <Pill bg="var(--color-xp-bg)" color="var(--color-xp-text)">
                  {profile.xp.toLocaleString('es-ES')} XP
                </Pill>
                <Pill bg="var(--color-streak-bg)" color="var(--color-streak-text)">
                  {profile.currentStreak} días
                </Pill>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 20 }}>
              <Card style={{ padding: 13 }}>
                <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 19, color: 'var(--color-text)' }}>
                  {profile.examsPassed}/{profile.examsTaken}
                </div>
                <div style={{ fontSize: 11, color: 'var(--color-text-muted-50)', fontWeight: 600, marginTop: 2 }}>Exámenes aprobados</div>
              </Card>
              <Card style={{ padding: 13 }}>
                <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 19, color: 'var(--color-text)' }}>
                  {profile.bestExamScorePct}%
                </div>
                <div style={{ fontSize: 11, color: 'var(--color-text-muted-50)', fontWeight: 600, marginTop: 2 }}>Mejor nota</div>
              </Card>
              {battleStats && battleStats.battlesPlayed > 0 && (
                <>
                  <Card style={{ padding: 13 }}>
                    <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 19, color: 'var(--color-text)' }}>
                      {battleStats.winRatePct}%
                    </div>
                    <div style={{ fontSize: 11, color: 'var(--color-text-muted-50)', fontWeight: 600, marginTop: 2 }}>Victorias en duelos</div>
                  </Card>
                  <Card style={{ padding: 13 }}>
                    <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 19, color: 'var(--color-text)' }}>
                      {battleStats.accuracyPct}%
                    </div>
                    <div style={{ fontSize: 11, color: 'var(--color-text-muted-50)', fontWeight: 600, marginTop: 2 }}>Acierto en duelos</div>
                  </Card>
                </>
              )}
            </div>

            {headToHead && headToHead.totalBattles > 0 && (
              <Card style={{ padding: 16, marginBottom: 20, textAlign: 'center' }}>
                <div style={{ fontSize: 11.5, fontWeight: 700, color: 'var(--color-text-muted-45)', textTransform: 'uppercase', letterSpacing: 0.3, marginBottom: 8 }}>
                  Historial de duelos
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 14 }}>
                  <div>
                    <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 28, color: 'var(--color-primary)' }}>
                      {headToHead.myWins}
                    </div>
                    <div style={{ fontSize: 11.5, color: 'var(--color-text-muted-50)', fontWeight: 600 }}>Tú</div>
                  </div>
                  <div style={{ fontSize: 15, color: 'var(--color-text-muted-40)', fontWeight: 700 }}>—</div>
                  <div>
                    <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 28, color: 'var(--color-text)' }}>
                      {headToHead.theirWins}
                    </div>
                    <div style={{ fontSize: 11.5, color: 'var(--color-text-muted-50)', fontWeight: 600 }}>{profile.displayName}</div>
                  </div>
                </div>
                {headToHead.ties > 0 && (
                  <div style={{ fontSize: 11.5, color: 'var(--color-text-muted-45)', marginTop: 8 }}>
                    {headToHead.ties} {headToHead.ties === 1 ? 'empate' : 'empates'}
                  </div>
                )}
              </Card>
            )}

            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 15, color: 'var(--color-text)', marginBottom: 12 }}>
              Logros
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 22 }}>
              {profile.achievements.length === 0 ? (
                <div style={{ gridColumn: '1 / -1' }}>
                  <p style={{ fontSize: 13, color: 'var(--color-text-muted-50)', textAlign: 'center' }}>Todavía no ha desbloqueado logros.</p>
                </div>
              ) : (
                profile.achievements.map((a) => {
                  const def = getAchievementById(a.id);
                  if (!def) return null;
                  return (
                    <div
                      key={a.id}
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: 8,
                        background: 'var(--color-bg-card)',
                        borderRadius: 14,
                        padding: '16px 10px',
                        textAlign: 'center',
                        boxShadow: 'var(--shadow-card)',
                      }}
                    >
                      <div
                        style={{
                          width: 40,
                          height: 40,
                          borderRadius: '50%',
                          background: 'var(--color-xp-bg)',
                          color: 'var(--color-xp-text)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          padding: 10,
                        }}
                      >
                        <Icon name={def.icon} size={20} />
                      </div>
                      <span style={{ fontSize: 11.5, fontWeight: 600, color: 'var(--color-text)', lineHeight: 1.3 }}>{def.name}</span>
                    </div>
                  );
                })
              )}
            </div>

            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 15, color: 'var(--color-text)', marginBottom: 12 }}>
              Progreso por categoría
            </div>
            {profile.categoryStats.length === 0 ? (
              <p style={{ fontSize: 13, color: 'var(--color-text-muted-50)' }}>Todavía no ha practicado ninguna categoría.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {profile.categoryStats
                  .filter((c) => c.answered > 0)
                  .map((c) => {
                    const pct = Math.round((c.correct / c.answered) * 100);
                    return (
                      <div key={c.categoryId}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, fontWeight: 600, color: 'var(--color-text)', marginBottom: 6 }}>
                          <span>{getCategoryById(c.categoryId)?.name ?? c.categoryId}</span>
                          <span>{pct}%</span>
                        </div>
                        <ProgressBar pct={pct} />
                      </div>
                    );
                  })}
              </div>
            )}

            {confirmingRemove ? (
              <div style={{ display: 'flex', gap: 8, marginTop: 24 }}>
                <Button variant="secondary" style={{ flex: 1 }} onClick={() => setConfirmingRemove(false)} disabled={removing}>
                  Cancelar
                </Button>
                <Button
                  variant="danger"
                  style={{ flex: 1 }}
                  disabled={removing}
                  onClick={() => {
                    setRemoving(true);
                    removeFriend(userId)
                      .then(() => navigate('/friends'))
                      .catch(() => setRemoving(false));
                  }}
                >
                  {removing ? 'Eliminando…' : 'Confirmar'}
                </Button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setConfirmingRemove(true)}
                style={{
                  display: 'block',
                  margin: '24px auto 0',
                  background: 'none',
                  border: 'none',
                  color: 'var(--color-error)',
                  fontSize: 12.5,
                  fontWeight: 600,
                  cursor: 'pointer',
                  padding: 0,
                }}
              >
                Eliminar amigo
              </button>
            )}
          </>
        )}
      </div>
    </AppShell>
  );
}
