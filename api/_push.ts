import { createClient } from '@supabase/supabase-js';
import webpush from 'web-push';

// Shared by every api/*.ts push sender (send-push.ts's event-triggered
// pushes, streak-reminders.ts's scheduled one) — one place for the
// VAPID setup and the "send to every subscription this user has, prune
// the ones the push service says are gone" loop.

let vapidConfigured = false;
function ensureVapid() {
  if (vapidConfigured) return;
  webpush.setVapidDetails(
    'mailto:drivy-app@example.com',
    process.env.VITE_VAPID_PUBLIC_KEY as string,
    process.env.VAPID_PRIVATE_KEY as string,
  );
  vapidConfigured = true;
}

// Reuses the same VITE_SUPABASE_URL already configured in Vercel for the
// frontend build — the VITE_ prefix only controls what Vite inlines into
// the client bundle, it doesn't restrict what a serverless function can
// read from process.env at runtime.
export function supabaseAdmin() {
  return createClient(process.env.VITE_SUPABASE_URL as string, process.env.SUPABASE_SERVICE_ROLE_KEY as string, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}

export async function sendPushToUser(
  db: ReturnType<typeof supabaseAdmin>,
  targetUserId: string,
  payload: { title: string; body: string; url: string },
) {
  ensureVapid();
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
