import type { NextRequest } from "next/server";

export const OPTIONS_SESSION_COOKIE = "options_session";

function toHex(bytes: Uint8Array) {
  return Array.from(bytes)
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

export async function createOptionsSessionToken(password = process.env.APP_PASSWORD ?? "") {
  const material = `options-wheel-screener:${password}`;
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(material));
  return toHex(new Uint8Array(digest));
}

export function isOptionsGateConfigured() {
  return Boolean(process.env.APP_PASSWORD);
}

export async function isOptionsRequestAuthenticated(request: NextRequest) {
  if (!isOptionsGateConfigured()) return true;
  const cookie = request.cookies.get(OPTIONS_SESSION_COOKIE)?.value;
  if (!cookie) return false;
  return cookie === (await createOptionsSessionToken());
}
