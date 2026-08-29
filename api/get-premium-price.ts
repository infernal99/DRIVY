import type { VercelRequest, VercelResponse } from '@vercel/node';
import Stripe from 'stripe';

// Public, read-only — no auth needed, just mirrors what Stripe's own
// Checkout page would show anyway. Keeps the price never hardcoded in the
// client: it's always read live from the actual STRIPE_PRICE_ID.

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    res.status(405).json({ error: 'method not allowed' });
    return;
  }

  try {
    const price = await stripe.prices.retrieve(process.env.STRIPE_PRICE_ID as string);
    res.status(200).json({
      amount: price.unit_amount,
      currency: price.currency,
      interval: price.recurring?.interval ?? 'month',
    });
  } catch (err) {
    res.status(500).json({ error: err instanceof Error ? err.message : 'stripe error' });
  }
}
