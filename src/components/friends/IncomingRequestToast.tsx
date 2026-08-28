import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFriendNotificationStore } from '../../store/friendNotificationStore';
import { respondFriendRequest } from '../../services/friendsService';
import { acceptBattleRequest, declineBattleRequest } from '../../services/battlesService';
import { notifyPush } from '../../services/pushService';
import { Avatar } from '../ui/Avatar';
import { Icon } from '../ui/Icon';

/**
 * Mounted once in App.tsx — pops up an actionable banner for a NEW incoming
 * friend/duel request while the app is open (the push notification handles
 * the "app is closed" case; this is the in-app equivalent, so the user
 * never has to go find the Amigos page to react to something that just
 * arrived). The queue itself lives in friendNotificationStore, filled by
 * the same background poll that drives the BottomNav red dot.
 */
export function IncomingRequestToast() {
  const item = useFriendNotificationStore((s) => s.toastQueue[0]);
  const dismissToast = useFriendNotificationStore((s) => s.dismissToast);
  const navigate = useNavigate();
  const [busy, setBusy] = useState(false);

  if (!item) return null;

  async function handleAccept() {
    setBusy(true);
    try {
      if (item.kind === 'friend_request') {
        await respondFriendRequest(item.requestId, true);
        notifyPush({ type: 'friend_accept', requestId: item.requestId });
      } else {
        await acceptBattleRequest(item.battleId, item.questionCount);
        notifyPush({ type: 'battle_accept', battleId: item.battleId });
        dismissToast(item.key);
        navigate(`/battles/${item.battleId}`);
        return;
      }
    } finally {
      setBusy(false);
    }
    dismissToast(item.key);
  }

  async function handleReject() {
    setBusy(true);
    try {
      if (item.kind === 'friend_request') {
        await respondFriendRequest(item.requestId, false);
      } else {
        await declineBattleRequest(item.battleId);
      }
    } finally {
      setBusy(false);
    }
    dismissToast(item.key);
  }

  const title = item.kind === 'friend_request' ? 'Solicitud de amistad' : 'Te ha retado a un duelo';
  const subtitle =
    item.kind === 'friend_request' ? `${item.displayName} quiere ser tu amigo` : `${item.displayName} · ${item.questionCount} preguntas`;

  return (
    <div
      className="anim-pop-in"
      style={{
        position: 'fixed',
        top: 12,
        left: 12,
        right: 12,
        zIndex: 210,
        maxWidth: 380,
        margin: '0 auto',
        background: 'var(--color-bg-card)',
        borderRadius: 16,
        boxShadow: 'var(--shadow-elevated)',
        padding: 14,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <Avatar name={item.displayName} size={36} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 13.5, fontWeight: 700, color: 'var(--color-text)' }}>{title}</div>
          <div style={{ fontSize: 11.5, color: 'var(--color-text-muted-60)', marginTop: 1 }}>{subtitle}</div>
        </div>
        <button
          type="button"
          onClick={() => dismissToast(item.key)}
          aria-label="Cerrar"
          disabled={busy}
          style={{ background: 'none', border: 'none', padding: 4, cursor: 'pointer', color: 'var(--color-text-muted-40)', flex: 'none' }}
        >
          <Icon name="close" size={14} />
        </button>
      </div>

      <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
        <button
          type="button"
          onClick={handleReject}
          disabled={busy}
          style={{
            flex: 1,
            padding: '8px 0',
            border: 'none',
            borderRadius: 10,
            background: 'var(--color-bg-screen)',
            color: 'var(--color-text)',
            fontWeight: 700,
            fontSize: 12.5,
            cursor: 'pointer',
          }}
        >
          Rechazar
        </button>
        <button
          type="button"
          onClick={handleAccept}
          disabled={busy}
          style={{
            flex: 1,
            padding: '8px 0',
            border: 'none',
            borderRadius: 10,
            background: 'var(--color-primary)',
            color: '#fff',
            fontWeight: 700,
            fontSize: 12.5,
            cursor: 'pointer',
          }}
        >
          {busy ? '…' : 'Aceptar'}
        </button>
      </div>
    </div>
  );
}
