import Stripe from 'stripe';

let stripeSingleton: Stripe | null = null;

/**
 * Lazily-instantiated Stripe client. Kept lazy so that builds / pages that
 * never touch Stripe do not require the secret key to be present.
 */
export function getStripe(): Stripe {
  if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error('STRIPE_SECRET_KEY is not set.');
  }
  if (!stripeSingleton) {
    stripeSingleton = new Stripe(process.env.STRIPE_SECRET_KEY, {
      // Pin to the account's default API version by omitting an override would
      // also work; we keep the SDK's bundled version for type safety.
      apiVersion: '2025-02-24.acacia',
      typescript: true,
      appInfo: { name: 'Tiny Treasure Competitions' },
    });
  }
  return stripeSingleton;
}

export const isStripeConfigured = () => Boolean(process.env.STRIPE_SECRET_KEY);
