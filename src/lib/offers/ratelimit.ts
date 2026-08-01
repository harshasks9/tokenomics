/**
 * Offers — failed-passcode throttle.
 *
 * In-memory, per-process. Vercel runs several lambda instances and recycles
 * them, so this slows a casual guesser but is not a hard security boundary —
 * see the honesty note in docs/offers.md. At this audience size (a handful of
 * GTM teammates behind a shared passcode) that trade-off is deliberate.
 */

const MAX_FAILURES = 5;
/** Failures are counted inside this window. */
const WINDOW_MS = 10 * 60 * 1000;
/** Once tripped, the IP is locked out for this long. */
const BLOCK_MS = 10 * 60 * 1000;

interface Entry {
  failures: number[];
  blockedUntil: number;
}

const attempts = new Map<string, Entry>();

/** Bound the map so a spray of forged IPs can't grow it without limit. */
const MAX_TRACKED = 5_000;

function prune(now: number): void {
  if (attempts.size < MAX_TRACKED) return;
  for (const [key, entry] of attempts) {
    const fresh = entry.failures.some((t) => now - t < WINDOW_MS);
    if (!fresh && entry.blockedUntil < now) attempts.delete(key);
  }
}

export function clientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  return (
    forwarded?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown"
  );
}

export interface RateLimitState {
  blocked: boolean;
  retryAfterSeconds: number;
}

export function checkRateLimit(ip: string, now = Date.now()): RateLimitState {
  const entry = attempts.get(ip);
  if (!entry) return { blocked: false, retryAfterSeconds: 0 };
  if (entry.blockedUntil > now) {
    return {
      blocked: true,
      retryAfterSeconds: Math.ceil((entry.blockedUntil - now) / 1000),
    };
  }
  return { blocked: false, retryAfterSeconds: 0 };
}

export function recordFailure(ip: string, now = Date.now()): RateLimitState {
  prune(now);
  const entry = attempts.get(ip) ?? { failures: [], blockedUntil: 0 };
  entry.failures = entry.failures.filter((t) => now - t < WINDOW_MS);
  entry.failures.push(now);
  if (entry.failures.length >= MAX_FAILURES) {
    entry.blockedUntil = now + BLOCK_MS;
    entry.failures = [];
  }
  attempts.set(ip, entry);
  return checkRateLimit(ip, now);
}

export function clearFailures(ip: string): void {
  attempts.delete(ip);
}
