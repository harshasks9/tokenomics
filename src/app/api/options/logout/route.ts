import { NextResponse } from "next/server";
import { OPTIONS_SESSION_COOKIE } from "@/lib/options/auth";

export async function POST(request: Request) {
  const response = NextResponse.redirect(new URL("/options/login", request.url), 303);
  response.cookies.delete(OPTIONS_SESSION_COOKIE);
  return response;
}
