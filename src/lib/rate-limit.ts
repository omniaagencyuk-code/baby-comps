/**
 * Minimal in-memory sliding-window rate limiter.
 *
 * Good enough as a first line of defence against abuse/bursts. Note: memory is
 * per-instance, so on multi-instance/serverless deployments it limits per warm
 * instance rather than globally. For strict global limits, swap the store for
 * Upstash Redis / Vercel KV — the `rateLimit` signature stays the same.
 */

interface Entry {
  count: number;
  resetAt: number;
}

const store = new Map<string, Entry>();

// Opportunistic cleanup so the map can't grow unbounded.
function sweep(now: number) {
  if (store.size < 5000) return;
  for (const [key, entry] of store) {
    if (entry.resetAt <= now) store.delete(key);
  }
}

export interface RateLimitResult {
  success: boolean;
  remaining: number;
  resetAt: number;
}

export function rateLimit(
  identifier: string,
  { limit, windowMs }: { limit: number; windowMs: number },
): RateLimitResult {
  const now = Date.now();
  sweep(now);

  const entry = store.get(identifier);
  if (!entry || entry.resetAt <= now) {
    store.set(identifier, { count: 1, resetAt: now + windowMs });
    return { success: true, remaining: limit - 1, resetAt: now + windowMs };
  }

  if (entry.count >= limit) {
    return { success: false, remaining: 0, resetAt: entry.resetAt };
  }

  entry.count += 1;
  return { success: true, remaining: limit - entry.count, resetAt: entry.resetAt };
}

/** Best-effort client IP from proxy headers. */
export function clientIp(headers: Headers): string {
  const fwd = headers.get('x-forwarded-for');
  if (fwd) return fwd.split(',')[0]!.trim();
  return headers.get('x-real-ip')?.trim() || 'unknown';
}

/** Convenience: rate-limit a request by IP for a named bucket. */
export function limitByIp(
  headers: Headers,
  bucket: string,
  opts: { limit: number; windowMs: number },
): RateLimitResult {
  return rateLimit(`${bucket}:${clientIp(headers)}`, opts);
}
