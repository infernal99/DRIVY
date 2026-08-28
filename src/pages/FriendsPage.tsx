import { useCallback, useEffect, useState, type MouseEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  cancelFriendRequest,
  getFriendLeaderboard,
  getMyFriendships,
  respondFriendRequest,
  searchProfiles,
  sendFriendRequest,
  type FriendRequestSummary,
  type FriendSearchResult,
  type LeaderboardEntry,
  type MyFriendships,
} from '../services/friendsService';
import {
  acceptBattleRequest,
  cancelBattleRequest,
  declineBattleRequest,
  getMyBattles,
  sendBattleRequest,
  type ActiveBattleSummary,
  type BattleInviteSummary,
  type MyBattles,
} from '../services/battlesService';
import { useFriendNotificationStore } from '../store/friendNotificationStore';
import { AppShell } from '../components/layout/AppShell';
import { BottomNav } from '../components/layout/BottomNav';
import { Card, CardButton } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Icon } from '../components/ui/Icon';
import { Avatar } from '../components/ui/Avatar';
import { EmptyState } from '../components/ui/EmptyState';
import { LoadingScreen } from '../components/ui/Loading';

function errorMessage(err: unknown, fallback: string): string {
  return err instanceof Error ? err.message : fallback;
}

export function FriendsPage() {
  const navigate = useNavigate();
  const [data, setData] = useState<MyFriendships | null>(null);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [battles, setBattles] = useState<MyBattles | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const ingestNotifications = useFriendNotificationStore((s) => s.ingest);
  const ingestBattleNotifications = useFriendNotificationStore((s) => s.ingestBattles);
  const markFriendsSeen = useFriendNotificationStore((s) => s.markFriendsSeen);

  const refresh = useCallback(() => {
    setLoadError(null);
    return Promise.all([getMyFriendships(), getFriendLeaderboard(), getMyBattles()])
      .then(([friendships, board, battleData]) => {
        setData(friendships);
        setLeaderboard(board);
        setBattles(battleData);
        // Reflect this fresh fetch in the nav badge immediately, then mark
        // every currently-listed friend as seen — actually opening this page
        // is what "acknowledging" a newly-accepted friend means.
        ingestNotifications(friendships);
        ingestBattleNotifications(battleData.incoming.length);
        markFriendsSeen(friendships.friends);
      })
      .catch((err) => setLoadError(errorMessage(err, 'No se pudo cargar la información de amigos.')));
  }, [ingestNotifications, ingestBattleNotifications, markFriendsSeen]);

  useEffect(() => {
    refresh().finally(() => setLoading(false));
    // Runs once on mount — `refresh` is stable — so the `useState(true)`
    // initial value already covers "loading" without a redundant setState here.
  }, [refresh]);

  function copyCode() {
    if (!data) return;
    navigator.clipboard
      .writeText(data.myFriendCode)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
      })
      .catch(() => {});
  }

  return (
    <AppShell nav={<BottomNav />}>
      <div style={{ padding: '20px 20px 4px' }}>
        <span style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 19, color: 'var(--color-text)' }}>
          Amigos
        </span>
      </div>
      <div style={{ flex: 1, overflowY: 'auto', padding: '6px 20px 30px' }}>
        {loading ? (
          <LoadingScreen />
        ) : loadError ? (
          <EmptyState icon="users" title="No se pudo cargar" description={loadError} action={<Button onClick={() => refresh()}>REINTENTAR</Button>} />
        ) : data ? (
          <>
            <Card style={{ padding: 16, marginBottom: 20 }}>
              <div style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--color-text-muted-50)', marginBottom: 4 }}>Tu código de amigo</div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10 }}>
                <span
                  style={{
                    flex: 1,
                    minWidth: 0,
                    overflowWrap: 'anywhere',
                    fontFamily: 'var(--font-display)',
                    fontWeight: 700,
                    fontSize: 19,
                    color: 'var(--color-text)',
                    letterSpacing: 0.5,
                  }}
                >
                  {data.myFriendCode}
                </span>
                <Button variant="secondary" onClick={copyCode} style={{ flex: 'none', width: 'auto', padding: '8px 14px', fontSize: 12.5 }}>
                  {copied ? 'COPIADO' : 'COPIAR'}
                </Button>
              </div>
              <p style={{ fontSize: 12, color: 'var(--color-text-muted-45)', margin: '8px 0 0' }}>
                Compártelo para que otras personas puedan añadirte.
              </p>
            </Card>

            <SearchSection onSent={refresh} />

            {data.incomingRequests.length > 0 && (
              <RequestsSection
                title="Solicitudes recibidas"
                requests={data.incomingRequests}
                renderActions={(req) => (
                  <>
                    <Button
                      variant="success"
                      style={{ flex: 'none', width: 'auto', padding: '7px 12px', fontSize: 12 }}
                      onClick={() => respondFriendRequest(req.requestId, true).then(refresh)}
                    >
                      Aceptar
                    </Button>
                    <Button
                      variant="secondary"
                      style={{ flex: 'none', width: 'auto', padding: '7px 12px', fontSize: 12 }}
                      onClick={() => respondFriendRequest(req.requestId, false).then(refresh)}
                    >
                      Rechazar
                    </Button>
                  </>
                )}
              />
            )}

            {data.outgoingRequests.length > 0 && (
              <RequestsSection
                title="Solicitudes enviadas"
                requests={data.outgoingRequests}
                renderActions={(req) => (
                  <Button
                    variant="secondary"
                    style={{ flex: 'none', width: 'auto', padding: '7px 12px', fontSize: 12 }}
                    onClick={() => cancelFriendRequest(req.requestId).then(refresh)}
                  >
                    Cancelar
                  </Button>
                )}
              />
            )}

            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 15, color: 'var(--color-text)', marginBottom: 12 }}>
              Lista de amigos
            </div>
            {leaderboard.length <= 1 ? (
              <EmptyState
                icon="users"
                title="Busca a tus amigos y empezad a competir"
                description="Comparte tu código o busca por nombre para añadir a tu primer amigo."
              />
            ) : (
              <Card style={{ padding: 6, marginBottom: 20 }}>
                {leaderboard.map((entry, i) => (
                  <FriendListRow key={entry.userId} entry={entry} rank={i + 1} onOpen={() => navigate(`/friends/${entry.userId}`)} onChallenged={refresh} />
                ))}
              </Card>
            )}

            {battles && <BattlesSection battles={battles} onChanged={refresh} onOpenBattle={(id) => navigate(`/battles/${id}`)} />}
          </>
        ) : null}
      </div>
    </AppShell>
  );
}

function SearchSection({ onSent }: { onSent: () => void }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<FriendSearchResult[] | null>(null);
  const [searching, setSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [sentCodes, setSentCodes] = useState<Set<string>>(new Set());
  const [sendingCode, setSendingCode] = useState<string | null>(null);

  function handleSearch() {
    const trimmed = query.trim();
    if (trimmed.length < 2) {
      setSearchError('Escribe al menos 2 caracteres.');
      return;
    }
    setSearching(true);
    setSearchError(null);
    searchProfiles(trimmed)
      .then(setResults)
      .catch((err) => setSearchError(errorMessage(err, 'No se pudo buscar.')))
      .finally(() => setSearching(false));
  }

  function handleAdd(code: string) {
    setSendingCode(code);
    sendFriendRequest(code)
      .then(() => {
        setSentCodes((prev) => new Set(prev).add(code));
        onSent();
      })
      .catch((err) => setSearchError(errorMessage(err, 'No se pudo enviar la solicitud.')))
      .finally(() => setSendingCode(null));
  }

  return (
    <div style={{ marginBottom: 20 }}>
      <div style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 15, color: 'var(--color-text)', marginBottom: 12 }}>
        Buscar amigos
      </div>
      <div style={{ display: 'flex', gap: 8, marginBottom: 10 }}>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          placeholder="Nombre o código DRIVY-XXXXX"
          style={{
            flex: 1,
            padding: '11px 14px',
            borderRadius: 12,
            border: '1px solid var(--color-border-subtle)',
            fontSize: 13.5,
            background: '#fff',
          }}
        />
        <Button onClick={handleSearch} disabled={searching} style={{ flex: 'none', width: 'auto', padding: '0 18px' }}>
          {searching ? '...' : 'Buscar'}
        </Button>
      </div>

      {searchError && <p style={{ fontSize: 12.5, color: 'var(--color-error)', margin: '0 0 10px' }}>{searchError}</p>}

      {results && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {results.length === 0 ? (
            <p style={{ fontSize: 13, color: 'var(--color-text-muted-50)' }}>Sin resultados.</p>
          ) : (
            results.map((r) => (
              <Card key={r.friendCode} style={{ padding: 12, display: 'flex', alignItems: 'center', gap: 10 }}>
                <Avatar name={r.displayName} size={36} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13.5, fontWeight: 600, color: 'var(--color-text)' }}>{r.displayName}</div>
                  <div style={{ fontSize: 11.5, color: 'var(--color-text-muted-45)' }}>{r.friendCode}</div>
                </div>
                <Button
                  variant={sentCodes.has(r.friendCode) ? 'secondary' : 'primary'}
                  disabled={sendingCode === r.friendCode || sentCodes.has(r.friendCode)}
                  onClick={() => handleAdd(r.friendCode)}
                  style={{ flex: 'none', width: 'auto', padding: '7px 12px', fontSize: 12 }}
                >
                  {sentCodes.has(r.friendCode) ? 'Enviada' : sendingCode === r.friendCode ? '...' : 'Añadir'}
                </Button>
              </Card>
            ))
          )}
        </div>
      )}
    </div>
  );
}

function RequestsSection({
  title,
  requests,
  renderActions,
}: {
  title: string;
  requests: FriendRequestSummary[];
  renderActions: (req: FriendRequestSummary) => React.ReactNode;
}) {
  return (
    <div style={{ marginBottom: 20 }}>
      <div style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 15, color: 'var(--color-text)', marginBottom: 12 }}>
        {title}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {requests.map((req) => (
          <Card key={req.requestId} style={{ padding: 12, display: 'flex', alignItems: 'center', gap: 10 }}>
            <Avatar name={req.displayName} size={36} />
            <span style={{ flex: 1, fontSize: 13.5, fontWeight: 600, color: 'var(--color-text)' }}>{req.displayName}</span>
            <div style={{ display: 'flex', gap: 6 }}>{renderActions(req)}</div>
          </Card>
        ))}
      </div>
    </div>
  );
}

function FriendListRow({
  entry,
  rank,
  onOpen,
  onChallenged,
}: {
  entry: LeaderboardEntry;
  rank: number;
  onOpen: () => void;
  onChallenged: () => void;
}) {
  const [challenging, setChallenging] = useState(false);
  const [challengeError, setChallengeError] = useState<string | null>(null);

  function handleChallenge(e: MouseEvent) {
    e.stopPropagation();
    setChallenging(true);
    setChallengeError(null);
    sendBattleRequest(entry.userId, 10)
      .then(onChallenged)
      .catch((err) => setChallengeError(errorMessage(err, 'No se pudo enviar el reto.')))
      .finally(() => setChallenging(false));
  }

  return (
    <div
      role={entry.isMe ? undefined : 'button'}
      tabIndex={entry.isMe ? undefined : 0}
      onClick={entry.isMe ? undefined : onOpen}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        padding: '10px 10px',
        borderRadius: 12,
        background: entry.isMe ? 'var(--color-info-bg)' : 'transparent',
        cursor: entry.isMe ? 'default' : 'pointer',
      }}
    >
      <span style={{ width: 20, textAlign: 'center', fontWeight: 700, fontSize: 13, color: 'var(--color-text-muted-45)' }}>{rank}</span>
      <Avatar name={entry.displayName} size={32} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-text)' }}>
          {entry.displayName}
          {entry.isMe ? ' (tú)' : ''}
        </div>
        {challengeError && <div style={{ fontSize: 11, color: 'var(--color-error)', marginTop: 2 }}>{challengeError}</div>}
      </div>
      <span style={{ flex: 'none', width: 56, textAlign: 'right', fontSize: 13, fontWeight: 700, color: 'var(--color-xp-text)' }}>
        {entry.weeklyXp} XP
      </span>
      <div style={{ flex: 'none', width: 74 }}>
        {!entry.isMe && (
          <Button
            variant="secondary"
            onClick={handleChallenge}
            disabled={challenging}
            style={{ flex: 'none', width: '100%', padding: '6px 8px', fontSize: 11 }}
          >
            <Icon name="flag" size={12} />
            {challenging ? '…' : 'Duelo'}
          </Button>
        )}
      </div>
    </div>
  );
}

function BattlesSection({
  battles,
  onChanged,
  onOpenBattle,
}: {
  battles: MyBattles;
  onChanged: () => void;
  onOpenBattle: (battleId: number) => void;
}) {
  const [busyId, setBusyId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  function withBusy(id: number, action: () => Promise<void>) {
    setBusyId(id);
    setError(null);
    action()
      .then(onChanged)
      .catch((err) => setError(errorMessage(err, 'No se pudo completar la acción.')))
      .finally(() => setBusyId(null));
  }

  const hasAnything = battles.incoming.length > 0 || battles.outgoing.length > 0 || battles.active.length > 0;

  return (
    <div style={{ marginBottom: 20 }}>
      <div style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 15, color: 'var(--color-text)', marginBottom: 12 }}>
        Duelos
      </div>

      {error && <p style={{ fontSize: 12.5, color: 'var(--color-error)', margin: '0 0 10px' }}>{error}</p>}

      {battles.incoming.map((invite: BattleInviteSummary) => (
        <Card key={invite.battleId} style={{ padding: 12, display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
          <Avatar name={invite.displayName} size={36} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 13.5, fontWeight: 600, color: 'var(--color-text)' }}>{invite.displayName} te reta a un duelo</div>
            <div style={{ fontSize: 11.5, color: 'var(--color-text-muted-45)' }}>{invite.questionCount} preguntas</div>
          </div>
          <div style={{ display: 'flex', gap: 6 }}>
            <Button
              variant="success"
              style={{ flex: 'none', width: 'auto', padding: '7px 12px', fontSize: 12 }}
              disabled={busyId === invite.battleId}
              onClick={() => withBusy(invite.battleId, () => acceptBattleRequest(invite.battleId, invite.questionCount))}
            >
              Aceptar
            </Button>
            <Button
              variant="secondary"
              style={{ flex: 'none', width: 'auto', padding: '7px 12px', fontSize: 12 }}
              disabled={busyId === invite.battleId}
              onClick={() => withBusy(invite.battleId, () => declineBattleRequest(invite.battleId))}
            >
              Rechazar
            </Button>
          </div>
        </Card>
      ))}

      {battles.outgoing.map((invite: BattleInviteSummary) => (
        <Card key={invite.battleId} style={{ padding: 12, display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
          <Avatar name={invite.displayName} size={36} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 13.5, fontWeight: 600, color: 'var(--color-text)' }}>Esperando respuesta de {invite.displayName}</div>
            <div style={{ fontSize: 11.5, color: 'var(--color-text-muted-45)' }}>{invite.questionCount} preguntas</div>
          </div>
          <Button
            variant="secondary"
            style={{ flex: 'none', width: 'auto', padding: '7px 12px', fontSize: 12 }}
            disabled={busyId === invite.battleId}
            onClick={() => withBusy(invite.battleId, () => cancelBattleRequest(invite.battleId))}
          >
            Cancelar
          </Button>
        </Card>
      ))}

      {battles.active.map((active: ActiveBattleSummary) => (
        <CardButton
          key={active.battleId}
          onClick={() => onOpenBattle(active.battleId)}
          style={{ padding: 12, display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8, width: '100%' }}
        >
          <Avatar name={active.displayName} size={36} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 13.5, fontWeight: 600, color: 'var(--color-text)' }}>Duelo con {active.displayName}</div>
            <div style={{ fontSize: 11.5, color: 'var(--color-text-muted-45)' }}>
              {active.iHaveFinished ? 'Esperando a que termine' : 'Toca para continuar'}
            </div>
          </div>
          <Icon name="chevronRight" size={13} color="rgba(16,25,46,0.3)" />
        </CardButton>
      ))}

      {!hasAnything && (
        <EmptyState
          icon="flag"
          title="Reta a un amigo"
          description="Pulsa «Retar a duelo» en la ficha de un amigo para empezar un examen rápido a la vez."
        />
      )}
    </div>
  );
}
