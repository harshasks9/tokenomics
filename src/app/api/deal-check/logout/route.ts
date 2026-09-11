import { NextResponse } from "next/server";
import { DEALCHECK_SESSION_COOKIE } from "@/lib/deal-check/auth";
import { basePathFor, hostnameFrom } from "@/lib/deal-check/routes";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Clears the session cookie and returns to the gate. Plain form POST, works without JavaScript. */
export async function POST(request: Request) {
  const hostname = hostnameFrom(request.headers);
  const forwardedHost = request.headers.get("x-forwarded-host");
  const proto = request.headers.get("x-forwarded-proto") ?? "https";
  const origin = forwardedHost ? `${proto}://${forwardedHost}` : new URL(request.url).origin;
  const response = NextResponse.redirect(new URL(`${basePathFor(hostname)}/gate`, origin), 303);
  response.cookies.set(DEALCHECK_SESSION_COOKIE, "", { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", path: "/", maxAge: 0 });
  response.headers.set("Cache-Control", "no-store");
  return response;
}
