/**
 * Deal check — passcode gate.
 *
 * The passcode never reaches the browser and is never committed: it lives only
 * in DEALCHECK_PASSCODE on the server. The client posts a candidate to
 * /api/deal-check/auth and receives a signed cookie. Everything here runs on
 * both the Edge (proxy) and Node (route handler) runtimes, so Web Crypto only.
 */

export const DEALCHECK_SESSION_COOKIE = "dealcheck_session";

/** 14 days, matching the Offers gate. */
export const SESSION_MAX_AGE = 60 * 60 * 24 * 14;

/** Constant payload: the cookie's Max-Age is the expiry; rotating the secret ends every session. */
const SESSION_PAYLOAD = "dealcheck-session-v1";

function toHex(bytes: Uint8Array): string {
  let out = "";
  for (const b of bytes) out += b.toString(16).padStart(2, "0");
  return out;
}

/** Non-short-circuiting comparison for equal-length hex digests. */
export function timingSafeEqualHex(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i += 1) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

export async function sha256Hex(value: string): Promise<string> {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(value));
  return toHex(new Uint8Array(digest));
}

/** The signing secret: a dedicated one if set, otherwise the site-wide SESSION_SECRET. */
export function sessionSecret(): string | undefined {
  return process.env.DEALCHECK_SESSION_SECRET || process.env.SESSION_SECRET || undefined;
}

export function passcode(): string | undefined {
  return process.env.DEALCHECK_PASSCODE || undefined;
}

/** HMAC-SHA256(secret, "dealcheck-session-v1"), hex encoded. */
export async function createSessionToken(secret: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const signature = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(SESSION_PAYLOAD));
  return toHex(new Uint8Array(signature));
}

export function isGateConfigured(): boolean {
  return Boolean(passcode() && sessionSecret());
}

/** True only for a cookie matching the HMAC we would mint now. An unconfigured gate is closed. */
export async function isSessionValid(cookieValue: string | undefined): Promise<boolean> {
  const secret = sessionSecret();
  if (!cookieValue || !secret) return false;
  return timingSafeEqualHex(cookieValue, await createSessionToken(secret));
}

/** Reject open redirects: only same-origin absolute paths survive. */
export function safeNextPath(value: string | null | undefined, fallback = "/deal-check"): string {
  if (!value) return fallback;
  if (!value.startsWith("/") || value.startsWith("//") || value.includes("\\") || value.includes(" ")) return fallback;
  return value;
}
