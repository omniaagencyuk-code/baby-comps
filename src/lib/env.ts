/**
 * Centralised environment configuration and validation.
 *
 * We intentionally do NOT throw at import time — the app is designed to run in
 * a "demo mode" without Stripe, and the build must not require secrets. Instead
 * use `getConfigStatus()` / `assertProductionReady()` at runtime (e.g. the
 * health check) to surface misconfiguration clearly.
 */

export type StripeMode = 'live' | 'test' | 'unset';

export function stripeMode(): StripeMode {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) return 'unset';
  return key.startsWith('sk_live_') ? 'live' : 'test';
}

export const isProduction = process.env.NODE_ENV === 'production';

/** True when payments are NOT running against live Stripe keys. */
export function isDemoOrTestPayments(): boolean {
  return stripeMode() !== 'live';
}

export interface ConfigCheck {
  key: string;
  ok: boolean;
  required: boolean;
  detail: string;
}

/** A non-secret report of what is / isn't configured. Safe to expose. */
export function getConfigStatus(): ConfigCheck[] {
  const has = (v?: string) => Boolean(v && v.trim().length > 0);
  const authSecret = process.env.AUTH_SECRET;

  return [
    {
      key: 'DATABASE_URL',
      ok: has(process.env.DATABASE_URL),
      required: true,
      detail: has(process.env.DATABASE_URL) ? 'set' : 'missing',
    },
    {
      key: 'AUTH_SECRET',
      ok: has(authSecret) && (authSecret?.length ?? 0) >= 16,
      required: true,
      detail: !has(authSecret)
        ? 'missing'
        : (authSecret?.length ?? 0) < 16
          ? 'too short (use `openssl rand -base64 32`)'
          : 'set',
    },
    {
      key: 'NEXT_PUBLIC_SITE_URL',
      ok: has(process.env.NEXT_PUBLIC_SITE_URL),
      required: true,
      detail: process.env.NEXT_PUBLIC_SITE_URL || 'missing',
    },
    {
      key: 'STRIPE_SECRET_KEY',
      ok: has(process.env.STRIPE_SECRET_KEY),
      required: false,
      detail: stripeMode(),
    },
    {
      key: 'STRIPE_WEBHOOK_SECRET',
      ok: has(process.env.STRIPE_WEBHOOK_SECRET),
      required: false,
      detail: has(process.env.STRIPE_WEBHOOK_SECRET) ? 'set' : 'missing (webhooks disabled)',
    },
    {
      key: 'NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY',
      ok: has(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY),
      required: false,
      detail: has(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY) ? 'set' : 'missing',
    },
  ];
}

/**
 * Returns a list of problems that would block a real production launch.
 * Empty array == good to go.
 */
export function productionReadiness(): string[] {
  const problems: string[] = [];
  for (const c of getConfigStatus()) {
    if (c.required && !c.ok) problems.push(`${c.key}: ${c.detail}`);
  }
  // For a live launch, Stripe should be fully wired.
  if (stripeMode() !== 'live') {
    problems.push('Stripe is not in live mode (payments will not be real).');
  }
  if (!process.env.STRIPE_WEBHOOK_SECRET) {
    problems.push('STRIPE_WEBHOOK_SECRET missing — orders will not auto-confirm.');
  }
  return problems;
}
