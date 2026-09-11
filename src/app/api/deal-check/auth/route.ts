import { timingSafeEqual } from "node:crypto";
import { NextResponse } from "next/server";
import { DEALCHECK_SESSION_COOKIE, SESSION_MAX_AGE, createSessionToken, passcode as expectedPasscode, sessionSecret, sha256Hex } from "@/lib/deal-check/auth";
import { checkRateLimit, clearFailures, clientIp, recordFailure } from "@/lib/deal-check/ratelimit";

// node:crypto.timingSafeEqual is not available on the Edge runtime.
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Deliberately identical for "wrong passcode" and "no passcode supplied". */
const GENERIC_FAILURE = "That passcode was not recognised.";

function constantTimeEqualHex(a: string, b: string): boolean {
  const left = Buffer.from(a, "hex");
  const right = Buffer.from(b, "hex");
  if (left.length !== right.length) return false;
  return timingSafeEqual(left, right);
}

const tooMany = (retryAfterSeconds: number) =>
  NextResponse.json(
    { error: `Too many attempts. Try again in ${Math.ceil(retryAfterSeconds / 60)} minute(s).` },
    { status: 429, headers: { "Retry-After": String(retryAfterSeconds) } },
  );

export async function POST(request: Request) {
  const expected = expectedPasscode();
  const secret = sessionSecret();
  if (!expected || !secret) {
    return NextResponse.json({ error: "This site is not configured yet. DEALCHECK_PASSCODE and a session secret must be set." }, { status: 503 });
  }

  const ip = clientIp(request);
  const limited = checkRateLimit(ip);
  if (limited.blocked) return tooMany(limited.retryAfterSeconds);

  let candidate = "";
  try {
    const body: unknown = await request.json();
    if (body && typeof body === "object" && "passcode" in body) candidate = String((body as { passcode: unknown }).passcode ?? "");
  } catch {
    candidate = "";
  }

  // Hash both sides so the comparison is fixed-width and length never leaks through timing.
  const [candidateHash, truthHash] = await Promise.all([sha256Hex(candidate), sha256Hex(expected)]);
  if (!constantTimeEqualHex(candidateHash, truthHash)) {
    const state = recordFailure(ip);
    if (state.blocked) return tooMany(state.retryAfterSeconds);
    return NextResponse.json({ error: GENERIC_FAILURE }, { status: 401 });
  }

  clearFailures(ip);
  const response = NextResponse.json({ ok: true });
  response.cookies.set(DEALCHECK_SESSION_COOKIE, await createSessionToken(secret), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_MAX_AGE,
  });
  response.headers.set("Cache-Control", "no-store");
  return response;
}
