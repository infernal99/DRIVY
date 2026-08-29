import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';
import Stripe from 'stripe';

// Same auth pattern as send-push.ts: verify the caller's JWT via the anon
// client, never trust a client-supplied user id. STRIPE_PRICE_ID is the one
// recurring monthly Price created in the Stripe Dashboard — the actual
// amount/currency is never hardcoded here.

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

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

  const origin = req.headers.origin ?? `https://${req.headers.host}`;

  try {
    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      line_items: [{ price: process.env.STRIPE_PRICE_ID as string, quantity: 1 }],
      client_reference_id: caller.id,
      customer_email: caller.email,
      subscription_data: { metadata: { supabase_user_id: caller.id } },
      success_url: `${origin}/settings?checkout=success`,
      cancel_url: `${origin}/settings?checkout=cancel`,
    });
    res.status(200).json({ url: session.url });
  } catch (err) {
    res.status(500).json({ error: err instanceof Error ? err.message : 'stripe error' });
  }
}
