import { supabase } from '../lib/supabase';

// Web push has two independent pieces this module owns:
//   1. Subscribing this browser (Notification permission + PushManager +
//      storing the resulting endpoint/keys in push_subscriptions, which the
//      user can read/write only their own rows of — see the migration).
//   2. Asking the server to actually send one, for one specific known event
//      — see api/send-push.ts for why it's shaped as a closed set of
//      `type`s rather than a free-form "notify this user" call.
// Actually delivering the push (VAPID signing) only ever happens server-side;
// this file never sees the private key.

const VAPID_PUBLIC_KEY = import.meta.env.VITE_VAPID_PUBLIC_KEY as string | undefined;

export function isPushSupported(): boolean {
  return 'serviceWorker' in navigator && 'PushManager' in window && !!VAPID_PUBLIC_KEY;
}

export function getNotificationPermission(): NotificationPermission | 'unsupported' {
  if (!('Notification' in window)) return 'unsupported';
  return Notification.permission;
}

function urlBase64ToUint8Array(base64: string): Uint8Array {
  const padding = '='.repeat((4 - (base64.length % 4)) % 4);
  const base64Safe = (base64 + padding).replace(/-/g, '+').replace(/_/g, '/');
  const raw = atob(base64Safe);
  return Uint8Array.from([...raw].map((c) => c.charCodeAt(0)));
}

/** Requests permission (if not already decided) and stores the resulting subscription for this user. Returns false if the user declined or the platform doesn't support it. */
export async function enablePushNotifications(): Promise<boolean> {
  if (!isPushSupported()) return false;

  let permission = Notification.permission;
  if (permission === 'default') {
    permission = await Notification.requestPermission();
  }
  if (permission !== 'granted') return false;

  const registration = await navigator.serviceWorker.ready;
  const existing = await registration.pushManager.getSubscription();
  const subscription =
    existing ??
    (await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY as string) as BufferSource,
    }));

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return false;

  const json = subscription.toJSON();
  const { error } = await supabase.from('push_subscriptions').upsert(
    {
      user_id: user.id,
      endpoint: subscription.endpoint,
      p256dh: json.keys?.p256dh ?? '',
      auth: json.keys?.auth ?? '',
    },
    { onConflict: 'user_id,endpoint' },
  );

  return !error;
}

/** Stops this browser's subscription and removes it from the server. */
export async function disablePushNotifications(): Promise<void> {
  if (!('serviceWorker' in navigator)) return;
  const registration = await navigator.serviceWorker.ready;
  const subscription = await registration.pushManager.getSubscription();
  if (!subscription) return;

  await supabase.from('push_subscriptions').delete().eq('endpoint', subscription.endpoint);
  await subscription.unsubscribe();
}

export async function hasActivePushSubscription(): Promise<boolean> {
  if (!('serviceWorker' in navigator)) return false;
  const registration = await navigator.serviceWorker.getRegistration();
  if (!registration) return false;
  const subscription = await registration.pushManager.getSubscription();
  return !!subscription;
}

export type PushNotifyEvent =
  | { type: 'friend_request'; friendCode: string }
  | { type: 'friend_accept'; requestId: number }
  | { type: 'battle_request'; battleId: number }
  | { type: 'battle_accept'; battleId: number };

/** Best-effort — a failed push must never block or surface as an error on the action that triggered it. */
export async function notifyPush(event: PushNotifyEvent): Promise<void> {
  try {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (!session) return;

    await fetch('/api/send-push', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${session.access_token}` },
      body: JSON.stringify(event),
    });
  } catch {
    // Notifying is not this action's job to guarantee.
  }
}
