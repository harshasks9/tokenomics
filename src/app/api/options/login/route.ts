import { NextRequest, NextResponse } from "next/server";
import { OPTIONS_SESSION_COOKIE, createOptionsSessionToken } from "@/lib/options/auth";
import { checkLoginRateLimit, clearLoginRateLimit } from "@/lib/options/cache";

function safeRelativePath(value: string) {
  if (!value.startsWith("/") || value.startsWith("//") || value.includes("\\") || value.includes("\u0000")) {
    return "/";
  }
  return value;
}

function clientIdentifier(request: NextRequest) {
  const forwarded = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  const ip = forwarded || request.headers.get("x-real-ip") || "unknown";
  const ua = request.headers.get("user-agent") || "unknown";
  return `${ip}:${ua}`;
}

export async function POST(request: NextRequest) {
  const form = await request.formData();
  const password = String(form.get("password") ?? "");
  const next = safeRelativePath(String(form.get("next") ?? "/"));
  const expected = process.env.APP_PASSWORD;
  if (!expected && process.env.VERCEL_ENV === "production") {
    return NextResponse.json({ error: "APP_PASSWORD is not configured" }, { status: 503 });
  }

  const identifier = clientIdentifier(request);
  if (expected) {
    const limit = await checkLoginRateLimit(identifier);
    if (!limit.allowed) {
      return NextResponse.json(
        { error: "Too many login attempts", retryAfterSeconds: limit.retryAfterSeconds },
        { status: 429 },
      );
    }
  }

  if (expected && password !== expected) {
    const url = new URL("/options/login", request.url);
    url.searchParams.set("error", "1");
    url.searchParams.set("next", next);
    return NextResponse.redirect(url, 303);
  }

  if (expected) {
    await clearLoginRateLimit(identifier);
  }

  const redirectUrl = new URL(next, request.url);
  const response = NextResponse.redirect(redirectUrl, 303);
  response.cookies.set(OPTIONS_SESSION_COOKIE, await createOptionsSessionToken(expected ?? ""), {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
  return response;
}
