import { useCallback, useEffect, useRef, useState, type MouseEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  blockUser,
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
  type BattleHistoryEntry,
  type BattleInviteSummary,
  type MyBattles,
} from '../services/battlesService';
import { useFriendNotificationStore } from '../store/friendNotificationStore';
import { notifyPush } from '../services/pushService';
import { PremiumUpsellModal } from '../components/premium/PremiumUpsellModal';
import { PremiumBanner } from '../components/premium/PremiumBanner';
import { usePremiumStore } from '../store/premiumStore';
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
  const [shareNote, setShareNote] = useState<string | null>(null);

  const ingestNotifications = useFriendNotificationStore((s) => s.ingest);
  const ingestBattleNotifications = useFriendNotificationStore((s) => s.ingestBattles);
  const markFriendsSeen = useFriendNotificationStore((s) => s.markFriendsSeen);

  // Tracks which battle ids were outgoing invites as of the last fetch, so
  // that when one of them shows up in `active` instead (the friend accepted
  // it) we can jump the challenger straight into the duel too, with no
  // button for them to press — see the pending outgoing/active diff below.
  const prevOutgoingIdsRef = useRef<Set<number>>(new Set());

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
        ingestBattleNotifications(battleData);
        markFriendsSeen(friendships.friends);

        const justAccepted = battleData.active.find((a) => prevOutgoingIdsRef.current.has(a.battleId));
        prevOutgoingIdsRef.current = new Set(battleData.outgoing.map((o) => o.battleId));
        if (justAccepted) {
          navigate(`/battles/${justAccepted.battleId}`);
        }
      })
      .catch((err) => setLoadError(errorMessage(err, 'No se pudo cargar la información de amigos.')));
  }, [ingestNotifications, ingestBattleNotifications, markFriendsSeen, navigate]);

  useEffect(() => {
    refresh().finally(() => setLoading(false));
    // Runs once on mount — `refresh` is stable — so the `useState(true)`
    // initial value already covers "loading" without a redundant setState here.
  }, [refresh]);

  // Silent background refresh so incoming friend/duel requests show up on
  // their own while this page is open — no spinner, no visible reload (see
  // `refresh` above: it never touches `loading`, only the first mount does).
  // Polls faster while a challenge you sent is still pending, since getting
  // pulled into the duel the instant it's accepted matters more there.
  useEffect(() => {
    const hasPendingOutgoing = !!battles && battles.outgoing.length > 0;
    const id = setInterval(refresh, hasPendingOutgoing ? 3000 : 15000);
    return () => clearInterval(id);
  }, [battles, refresh]);

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

  async function shareInviteLink(friendCode: string) {
    const url = `${window.location.origin}/invite/${friendCode}`;
    const text = 'Únete a Roady conmigo y practiquemos juntos el examen del carnet:';

    if (navigator.share) {
      try {
        await navigator.share({ title: 'Roady', text, url });
        return;
      } catch (err) {
        if ((err as Error).name === 'AbortError') return;
        // Fall through to the clipboard fallback below.
      }
    }

    try {
      await navigator.clipboard.writeText(url);
      setShareNote('ENLACE COPIADO');
      setTimeout(() => setShareNote(null), 2000);
    } catch {
      // Nothing more we can do without either API.
    }
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
              <p style={{ fontSize: 12, color: 'var(--color-text-muted-45)', margin: '8px 0 0 0' }}>
                Compártelo para que otras personas puedan añadirte, o envía el enlace: quien lo abra se añadirá automáticamente.
              </p>
              <Button
                variant="secondary"
                onClick={() => shareInviteLink(data.myFriendCode)}
                style={{ marginTop: 10, padding: '9px 0', fontSize: 12.5 }}
              >
                <Icon name="users" size={13} />
                {shareNote ?? 'COMPARTIR ENLACE'}
              </Button>
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
                      onClick={() =>
                        respondFriendRequest(req.requestId, true)
                          .then(() => notifyPush({ type: 'friend_accept', requestId: req.requestId }))
                          .then(refresh)
                      }
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
                    <button
                      type="button"
                      aria-label="Bloquear"
                      title="Bloquear"
                      onClick={() => blockUser(req.userId).then(refresh)}
                      style={{
                        flex: 'none',
                        width: 30,
                        height: 30,
                        border: 'none',
                        borderRadius: 8,
                        background: 'var(--color-error-bg)',
                        color: 'var(--color-error)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                      }}
                    >
                      <Icon name="lock" size={13} />
                    </button>
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
        notifyPush({ type: 'friend_request', friendCode: code });
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
          placeholder="Nombre o código ROADY-XXXXX"
          style={{
            flex: 1,
            padding: '11px 14px',
            borderRadius: 12,
            border: '1px solid var(--color-border-subtle)',
            fontSize: 13.5,
            background: 'var(--color-bg-card)',
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
                <Avatar name={r.displayName} size={36} avatarId={r.avatarUrl} />
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
            <Avatar name={req.displayName} size={36} avatarId={req.avatarUrl} />
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
  const [showUpsell, setShowUpsell] = useState(false);

  function handleChallenge(e: MouseEvent) {
    e.stopPropagation();
    setChallenging(true);
    setChallengeError(null);
    sendBattleRequest(entry.userId, 10)
      .then(({ battleId }) => {
        notifyPush({ type: 'battle_request', battleId });
        onChallenged();
      })
      .catch((err) => {
        if (err instanceof Error && err.message.includes('daily duel limit reached')) {
          setShowUpsell(true);
        } else {
          setChallengeError(errorMessage(err, 'No se pudo enviar el reto.'));
        }
      })
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
      <Avatar name={entry.displayName} size={32} avatarId={entry.avatarUrl} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-text)' }}>
          {entry.displayName}
          {entry.isMe ? ' (tú)' : ''}
        </div>
        {challengeError && <div style={{ fontSize: 11, color: 'var(--color-error)', marginTop: 2 }}>{challengeError}</div>}
      </div>
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
      <span style={{ flex: 'none', width: 56, textAlign: 'right', fontSize: 13, fontWeight: 700, color: 'var(--color-xp-text)' }}>
        {entry.weeklyXp} XP
      </span>
      {showUpsell && <PremiumUpsellModal onClose={() => setShowUpsell(false)} />}
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
  const isPremium = usePremiumStore((s) => s.isPremium);
  const battlesToday = usePremiumStore((s) => s.battlesToday);
  const battlesLimit = usePremiumStore((s) => s.battlesLimit);

  return (
    <div style={{ marginBottom: 20 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
        <div style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 15, color: 'var(--color-text)' }}>Duelos</div>
        {!isPremium && battlesLimit != null && (
          <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-text-muted-45)' }}>
            {Math.min(battlesToday, battlesLimit)}/{battlesLimit} hoy
          </span>
        )}
      </div>

      {!isPremium && (
        <PremiumBanner subtitle="Duelos ilimitados con tus amigos, avatares exclusivos" style={{ marginBottom: 12 }} />
      )}

      {error && <p style={{ fontSize: 12.5, color: 'var(--color-error)', margin: '0 0 10px' }}>{error}</p>}

      {battles.incoming.map((invite: BattleInviteSummary) => (
        <Card key={invite.battleId} style={{ padding: 12, display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
          <Avatar name={invite.displayName} size={36} avatarId={invite.avatarUrl} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 13.5, fontWeight: 600, color: 'var(--color-text)' }}>{invite.displayName} te reta a un duelo</div>
            <div style={{ fontSize: 11.5, color: 'var(--color-text-muted-45)' }}>{invite.questionCount} preguntas</div>
          </div>
          <div style={{ display: 'flex', gap: 6 }}>
            <Button
              variant="success"
              style={{ flex: 'none', width: 'auto', padding: '7px 12px', fontSize: 12 }}
              disabled={busyId === invite.battleId}
              onClick={() => {
                setBusyId(invite.battleId);
                setError(null);
                acceptBattleRequest(invite.battleId, invite.questionCount)
                  .then(() => {
                    notifyPush({ type: 'battle_accept', battleId: invite.battleId });
                    onOpenBattle(invite.battleId);
                  })
                  .catch((err) => {
                    setError(errorMessage(err, 'No se pudo aceptar el duelo.'));
                    setBusyId(null);
                  });
              }}
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
          <Avatar name={invite.displayName} size={36} avatarId={invite.avatarUrl} />
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
          <Avatar name={active.displayName} size={36} avatarId={active.avatarUrl} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 13.5, fontWeight: 600, color: 'var(--color-text)' }}>Duelo con {active.displayName}</div>
            <div style={{ fontSize: 11.5, color: 'var(--color-text-muted-45)' }}>
              Pregunta {active.currentQuestionIndex + 1} / {active.questionCount} · Toca para continuar
            </div>
          </div>
          <Icon name="chevronRight" size={13} color="var(--color-text-muted-30)" />
        </CardButton>
      ))}

      {!hasAnything && battles.history.length === 0 && (
        <EmptyState
          icon="flag"
          title="Reta a un amigo"
          description="Pulsa «Retar a duelo» en la ficha de un amigo para empezar un examen rápido a la vez."
        />
      )}

      {battles.history.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: hasAnything ? 8 : 0 }}>
          {battles.history.map((entry: BattleHistoryEntry) => (
            <CardButton
              key={entry.battleId}
              onClick={() => onOpenBattle(entry.battleId)}
              style={{ padding: 12, display: 'flex', alignItems: 'center', gap: 10, width: '100%' }}
            >
              <Avatar name={entry.displayName} size={36} avatarId={entry.avatarUrl} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13.5, fontWeight: 600, color: 'var(--color-text)' }}>
                  {entry.status === 'abandoned'
                    ? `Duelo abandonado con ${entry.displayName}`
                    : `${entry.myCorrectCount} - ${entry.opponentCorrectCount} vs ${entry.displayName}`}
                </div>
                <div
                  style={{
                    fontSize: 11.5,
                    fontWeight: 600,
                    color:
                      entry.status === 'abandoned'
                        ? 'var(--color-text-muted-45)'
                        : entry.won
                          ? 'var(--color-success)'
                          : entry.tied
                            ? 'var(--color-text-muted-45)'
                            : 'var(--color-error)',
                  }}
                >
                  {entry.status === 'abandoned' ? 'Toca para revisar las preguntas' : entry.won ? 'Ganado' : entry.tied ? 'Empate' : 'Perdido'}
                </div>
              </div>
              <Icon name="chevronRight" size={13} color="var(--color-text-muted-30)" />
            </CardButton>
          ))}
        </div>
      )}
    </div>
  );
}
