import { timingSafeEqual } from "node:crypto";
import { NextResponse } from "next/server";
import {
  OFFERS_SESSION_COOKIE,
  SESSION_MAX_AGE,
  createSessionToken,
  sha256Hex,
} from "@/lib/offers/auth";
import {
  checkRateLimit,
  clearFailures,
  clientIp,
  recordFailure,
} from "@/lib/offers/ratelimit";

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

export async function POST(request: Request) {
  const expected = process.env.SITE_PASSCODE;
  const secret = process.env.SESSION_SECRET;

  if (!expected || !secret) {
    return NextResponse.json(
      {
        error:
          "This site is not configured yet. SITE_PASSCODE and SESSION_SECRET must be set.",
      },
      { status: 503 },
    );
  }

  const ip = clientIp(request);
  const limited = checkRateLimit(ip);
  if (limited.blocked) {
    return NextResponse.json(
      {
        error: `Too many attempts. Try again in ${Math.ceil(limited.retryAfterSeconds / 60)} minute(s).`,
      },
      {
        status: 429,
        headers: { "Retry-After": String(limited.retryAfterSeconds) },
      },
    );
  }

  let passcode = "";
  try {
    const body: unknown = await request.json();
    if (body && typeof body === "object" && "passcode" in body) {
      passcode = String((body as { passcode: unknown }).passcode ?? "");
    }
  } catch {
    passcode = "";
  }

  // Hash both sides first so the comparison is fixed-width and the passcode's
  // length never leaks through timing.
  const [candidate, truth] = await Promise.all([
    sha256Hex(passcode),
    sha256Hex(expected),
  ]);

  if (!constantTimeEqualHex(candidate, truth)) {
    const state = recordFailure(ip);
    if (state.blocked) {
      return NextResponse.json(
        {
          error: `Too many attempts. Try again in ${Math.ceil(state.retryAfterSeconds / 60)} minute(s).`,
        },
        {
          status: 429,
          headers: { "Retry-After": String(state.retryAfterSeconds) },
        },
      );
    }
    return NextResponse.json({ error: GENERIC_FAILURE }, { status: 401 });
  }

  clearFailures(ip);

  const response = NextResponse.json({ ok: true });
  response.cookies.set(OFFERS_SESSION_COOKIE, await createSessionToken(secret), {
    httpOnly: true,
    // Secure everywhere it can be: a browser silently drops a Secure cookie on
    // plain-http localhost, which would make `next dev` untestable.
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_MAX_AGE,
  });
  response.headers.set("Cache-Control", "no-store");
  return response;
}
