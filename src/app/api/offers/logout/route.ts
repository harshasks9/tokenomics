import { NextResponse } from "next/server";
import { OFFERS_SESSION_COOKIE } from "@/lib/offers/auth";
import { basePathFor, hostnameFrom } from "@/lib/offers/routes";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Clears the session cookie and returns to the gate. A plain form POST so the
 * footer "Lock" control works without JavaScript.
 */
export async function POST(request: Request) {
  // Build the redirect against the host the browser actually used: on the
  // subdomain the gate is /gate, on the main site it is /offers/gate.
  const hostname = hostnameFrom(request.headers);
  const forwardedHost = request.headers.get("x-forwarded-host");
  const proto = request.headers.get("x-forwarded-proto") ?? "https";
  const origin = forwardedHost
    ? `${proto}://${forwardedHost}`
    : new URL(request.url).origin;

  const url = new URL(`${basePathFor(hostname)}/gate`, origin);
  const response = NextResponse.redirect(url, 303);
  response.cookies.set(OFFERS_SESSION_COOKIE, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
  response.headers.set("Cache-Control", "no-store");
  return response;
}
