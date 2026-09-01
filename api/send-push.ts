import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';
import webpush from 'web-push';

// Sends a web push notification for one specific, known event — never a
// free-form "notify this user_id" endpoint. Each `type` below re-derives its
// own target user server-side from the actual DB row (never trusts a
// target uuid the client might send), using the service role key, which is
// required anyway to read someone else's push_subscriptions rows (RLS on
// that table only ever allows reading your own). The caller's identity
// comes from their own Supabase JWT, verified via supabase.auth.getUser —
// same trust boundary as every other authenticated action in this app.
//
// NOTE: this file's VAPID/Supabase-admin/sendToUser code is deliberately
// duplicated in api/streak-reminders.ts rather than shared via an
// api/_push.ts import — that shared-module version made both functions
// crash with FUNCTION_INVOCATION_FAILED on Vercel for reasons that
// weren't diagnosable without dashboard log access. Keep any future fix
// applied to both files.

type SendPushBody =
  | { type: 'friend_request'; friendCode: string }
  | { type: 'friend_accept'; requestId: number }
  | { type: 'battle_request'; battleId: number }
  | { type: 'battle_accept'; battleId: number };

webpush.setVapidDetails(
  'mailto:roady-app@example.com',
  process.env.VITE_VAPID_PUBLIC_KEY as string,
  process.env.VAPID_PRIVATE_KEY as string,
);

// Reuses the same VITE_SUPABASE_URL already configured in Vercel for the
// frontend build — the VITE_ prefix only controls what Vite inlines into
// the client bundle, it doesn't restrict what a serverless function can
// read from process.env at runtime.
function admin() {
  return createClient(process.env.VITE_SUPABASE_URL as string, process.env.SUPABASE_SERVICE_ROLE_KEY as string, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}

function anon() {
  return createClient(process.env.VITE_SUPABASE_URL as string, process.env.VITE_SUPABASE_PUBLISHABLE_KEY as string, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}

async function sendToUser(
  db: ReturnType<typeof admin>,
  targetUserId: string,
  payload: { title: string; body: string; url: string },
) {
  const { data: subs } = await db.from('push_subscriptions').select('id, endpoint, p256dh, auth').eq('user_id', targetUserId);
  if (!subs || subs.length === 0) return;

  await Promise.all(
    subs.map(async (sub) => {
      try {
        await webpush.sendNotification(
          { endpoint: sub.endpoint, keys: { p256dh: sub.p256dh, auth: sub.auth } },
          JSON.stringify(payload),
        );
      } catch (err) {
        const statusCode = (err as { statusCode?: number }).statusCode;
        if (statusCode === 404 || statusCode === 410) {
          await db.from('push_subscriptions').delete().eq('id', sub.id);
        }
      }
    }),
  );
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'method not allowed' });
    return;
  }

  const authHeader = req.headers.authorization;
  const jwt = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null;
  if (!jwt) {
    res.status(401).json({ error: 'missing authorization' });
    return;
  }

  const { data: userData, error: authError } = await anon().auth.getUser(jwt);
  const caller = userData?.user;
  if (authError || !caller) {
    res.status(401).json({ error: 'not authenticated' });
    return;
  }

  const db = admin();
  const body = req.body as SendPushBody;

  const { data: callerProfile } = await db.from('profiles').select('display_name').eq('user_id', caller.id).single();
  const callerName = callerProfile?.display_name ?? 'Alguien';

  try {
    switch (body.type) {
      case 'friend_request': {
        const { data: target } = await db.from('profiles').select('user_id').eq('friend_code', body.friendCode.toUpperCase().trim()).single();
        if (!target) break;
        const { data: friendship } = await db
          .from('friendships')
          .select('id')
          .eq('requester_id', caller.id)
          .eq('addressee_id', target.user_id)
          .eq('status', 'pending')
          .maybeSingle();
        if (!friendship) break;
        await sendToUser(db, target.user_id, {
          title: 'Nueva solicitud de amistad',
          body: `${callerName} quiere ser tu amigo en Roady`,
          url: '/friends',
        });
        break;
      }
      case 'friend_accept': {
        const { data: friendship } = await db
          .from('friendships')
          .select('requester_id, addressee_id, status')
          .eq('id', body.requestId)
          .single();
        if (!friendship || friendship.addressee_id !== caller.id || friendship.status !== 'accepted') break;
        await sendToUser(db, friendship.requester_id, {
          title: 'Solicitud aceptada',
          body: `${callerName} ha aceptado tu solicitud de amistad`,
          url: '/friends',
        });
        break;
      }
      case 'battle_request': {
        const { data: battle } = await db
          .from('battles')
          .select('challenger_id, opponent_id, status')
          .eq('id', body.battleId)
          .single();
        if (!battle || battle.challenger_id !== caller.id || battle.status !== 'pending') break;
        await sendToUser(db, battle.opponent_id, {
          title: 'Nuevo duelo',
          body: `${callerName} te ha retado a un duelo`,
          url: '/friends',
        });
        break;
      }
      case 'battle_accept': {
        const { data: battle } = await db
          .from('battles')
          .select('challenger_id, opponent_id, status')
          .eq('id', body.battleId)
          .single();
        if (!battle || battle.opponent_id !== caller.id || battle.status !== 'active') break;
        await sendToUser(db, battle.challenger_id, {
          title: '¡Duelo en marcha!',
          body: `${callerName} ha aceptado tu duelo`,
          url: `/battles/${body.battleId}`,
        });
        break;
      }
      default:
        res.status(400).json({ error: 'unknown type' });
        return;
    }
  } catch {
    // Best-effort — a failed push should never surface as an error to the
    // action that triggered it (sending a friend request/duel invite must
    // still succeed even if notifying about it fails).
  }

  res.status(200).json({ ok: true });
}
