import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';
import Stripe from 'stripe';

// Same auth pattern as send-push.ts. The Stripe customer id only exists
// once the user has completed checkout at least once (written by
// stripe-webhook.ts's checkout.session.completed handler).

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

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
  const { data: sub } = await db.from('subscriptions').select('stripe_customer_id').eq('user_id', caller.id).maybeSingle();
  if (!sub?.stripe_customer_id) {
    res.status(400).json({ error: 'no billing account yet' });
    return;
  }

  const origin = req.headers.origin ?? `https://${req.headers.host}`;

  try {
    const portalSession = await stripe.billingPortal.sessions.create({
      customer: sub.stripe_customer_id,
      return_url: `${origin}/settings`,
    });
    res.status(200).json({ url: portalSession.url });
  } catch (err) {
    res.status(500).json({ error: err instanceof Error ? err.message : 'stripe error' });
  }
}
