import type { VercelRequest, VercelResponse } from '@vercel/node';
import { sendPushToUser, supabaseAdmin } from './_push';

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

  const db = supabaseAdmin();
  const yesterday = isoDateDaysAgo(1);

  const { data: atRisk } = await db
    .from('user_progress')
    .select('user_id, streak_count')
    .gt('streak_count', 0)
    .eq('last_activity_date', yesterday);

  let sent = 0;
  for (const row of atRisk ?? []) {
    try {
      await sendPushToUser(db, row.user_id, {
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
