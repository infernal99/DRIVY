import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';
import webpush from 'web-push';

// Runs once a day via Vercel Cron (see vercel.json's `crons` entry) —
// never callable by a regular client. Vercel automatically sends
// `Authorization: Bearer $CRON_SECRET` on its own invocations once that
// env var is set, which is what the check below verifies.
//
// Only reminds users whose streak is genuinely about to lapse *today* —
// last_activity_date = yesterday AND streak_count > 0 — rather than
// everyone with a stale streak_count from a week-old dead session, which
// would just be a permanent, ever-repeating nag for someone who isn't
// coming back.
//
// NOTE: this file's VAPID/Supabase-admin/sendToUser code is deliberately
// duplicated from api/send-push.ts rather than shared via an api/_push.ts
// import — that shared-module version made both functions crash with
// FUNCTION_INVOCATION_FAILED on Vercel for reasons that weren't
// diagnosable without dashboard log access. Keep any future fix applied
// to both files.

webpush.setVapidDetails(
  'mailto:drivy-app@example.com',
  process.env.VITE_VAPID_PUBLIC_KEY as string,
  process.env.VAPID_PRIVATE_KEY as string,
);

function admin() {
  return createClient(process.env.VITE_SUPABASE_URL as string, process.env.SUPABASE_SERVICE_ROLE_KEY as string, {
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

function isoDateDaysAgo(days: number): string {
  const d = new Date();
  d.setUTCDate(d.getUTCDate() - days);
  return d.toISOString().slice(0, 10);
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const expected = `Bearer ${process.env.CRON_SECRET}`;
  if (req.headers.authorization !== expected) {
    res.status(401).json({ error: 'unauthorized' });
    return;
  }

  const db = admin();
  const yesterday = isoDateDaysAgo(1);

  const { data: atRisk } = await db
    .from('user_progress')
    .select('user_id, streak_count')
    .gt('streak_count', 0)
    .eq('last_activity_date', yesterday);

  let sent = 0;
  for (const row of atRisk ?? []) {
    try {
      await sendToUser(db, row.user_id, {
        title: '¡Tu racha está en peligro!',
        body: `Llevas ${row.streak_count} días seguidos — practica hoy antes de medianoche para no perderla.`,
        url: '/',
      });
      sent += 1;
    } catch {
      // One user's failed send shouldn't stop the rest of the batch.
    }
  }

  res.status(200).json({ ok: true, candidates: atRisk?.length ?? 0, sent });
}
