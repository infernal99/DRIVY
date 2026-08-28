import { supabase } from '../lib/supabase';

export interface PremiumStatus {
  isPremium: boolean;
  practiceToday: number;
  practiceLimit: number | null;
  battlesToday: number;
  battlesLimit: number | null;
}

export async function getMyPremiumStatus(): Promise<PremiumStatus> {
  const { data, error } = await supabase.rpc('fn_get_my_premium_status');
  if (error) throw error;
  return {
    isPremium: data.isPremium,
    practiceToday: data.practiceToday,
    practiceLimit: data.practiceLimit,
    battlesToday: data.battlesToday,
    battlesLimit: data.battlesLimit,
  };
}

export type PracticeKind = 'simulacro' | 'examen_real' | 'random' | 'daily';

/** Authoritative gate — inserts a practice_sessions row and returns whether this attempt is allowed under the free-tier daily cap. */
export async function startPracticeSession(kind: PracticeKind): Promise<boolean> {
  const { data, error } = await supabase.rpc('fn_start_practice_session', { p_kind: kind });
  if (error) throw error;
  return data.allowed === true;
}

async function callBillingEndpoint(path: string): Promise<string> {
  const {
    data: { session },
  } = await supabase.auth.getSession();
  if (!session) throw new Error('not authenticated');

  const res = await fetch(path, {
    method: 'POST',
    headers: { Authorization: `Bearer ${session.access_token}` },
  });
  if (!res.ok) throw new Error('billing request failed');
  const { url } = await res.json();
  return url as string;
}

/** Redirects to Stripe Checkout for a new subscription. */
export async function startCheckout(): Promise<void> {
  const url = await callBillingEndpoint('/api/create-checkout-session');
  window.location.href = url;
}

/** Redirects to the Stripe Billing Portal to manage/cancel an existing subscription. */
export async function openBillingPortal(): Promise<void> {
  const url = await callBillingEndpoint('/api/create-portal-session');
  window.location.href = url;
}
