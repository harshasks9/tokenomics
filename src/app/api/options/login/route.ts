import { NextRequest, NextResponse } from "next/server";
import { OPTIONS_SESSION_COOKIE, createOptionsSessionToken } from "@/lib/options/auth";

export async function POST(request: NextRequest) {
  const form = await request.formData();
  const password = String(form.get("password") ?? "");
  const next = String(form.get("next") ?? "/");
  const expected = process.env.APP_PASSWORD;
  if (expected && password !== expected) {
    const url = new URL("/options/login", request.url);
    url.searchParams.set("error", "1");
    url.searchParams.set("next", next);
    return NextResponse.redirect(url, 303);
  }

  const redirectUrl = new URL(next.startsWith("/") ? next : "/", request.url);
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
