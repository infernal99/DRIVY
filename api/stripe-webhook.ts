import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';
import Stripe from 'stripe';

// Must read the raw request body to verify Stripe's signature — Vercel's
// default JSON body parsing would otherwise mangle it before we can check.
export const config = { api: { bodyParser: false } };

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

function admin() {
  return createClient(process.env.VITE_SUPABASE_URL as string, process.env.SUPABASE_SERVICE_ROLE_KEY as string, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}

async function readRawBody(req: VercelRequest): Promise<Buffer> {
  const chunks: Buffer[] = [];
  for await (const chunk of req) {
    chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk);
  }
  return Buffer.concat(chunks);
}

// Maps Stripe's subscription status onto the narrower set the
// subscriptions.status check constraint allows.
function mapStatus(stripeStatus: Stripe.Subscription.Status): 'active' | 'trialing' | 'past_due' | 'canceled' {
  if (stripeStatus === 'active') return 'active';
  if (stripeStatus === 'trialing') return 'trialing';
  if (stripeStatus === 'past_due' || stripeStatus === 'unpaid') return 'past_due';
  return 'canceled';
}

function periodEndOf(subscription: Stripe.Subscription): string | null {
  const seconds = subscription.items.data[0]?.current_period_end;
  return seconds ? new Date(seconds * 1000).toISOString() : null;
}

async function upsertFromSubscription(userId: string, subscription: Stripe.Subscription) {
  await admin()
    .from('subscriptions')
    .upsert({
      user_id: userId,
      stripe_customer_id: subscription.customer as string,
      stripe_subscription_id: subscription.id,
      status: mapStatus(subscription.status),
      current_period_end: periodEndOf(subscription),
      updated_at: new Date().toISOString(),
    });
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'method not allowed' });
    return;
  }

  const sig = req.headers['stripe-signature'];
  if (!sig || typeof sig !== 'string') {
    res.status(400).json({ error: 'missing signature' });
    return;
  }

  let event: Stripe.Event;
  try {
    const rawBody = await readRawBody(req);
    event = stripe.webhooks.constructEvent(rawBody, sig, process.env.STRIPE_WEBHOOK_SECRET as string);
  } catch {
    res.status(400).json({ error: 'invalid signature' });
    return;
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        const userId = session.client_reference_id;
        if (!userId || !session.subscription) break;
        const subscription = await stripe.subscriptions.retrieve(session.subscription as string);
        await upsertFromSubscription(userId, subscription);
        break;
      }
      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription;
        const userId = subscription.metadata?.supabase_user_id;
        if (!userId) break;
        await upsertFromSubscription(userId, subscription);
        break;
      }
      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;
        const userId = subscription.metadata?.supabase_user_id;
        if (!userId) break;
        await admin()
          .from('subscriptions')
          .update({ status: 'canceled', updated_at: new Date().toISOString() })
          .eq('user_id', userId);
        break;
      }
      default:
        break;
    }
  } catch {
    res.status(500).json({ error: 'webhook handler failed' });
    return;
  }

  res.status(200).json({ received: true });
}
