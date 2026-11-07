/** Server-only request helper: persona cookie, body parsing and event replay. */
import { cookies } from "next/headers";
import { replay } from "./engine";
import type { Event, PersonaId } from "./types";

export const PERSONA_COOKIE = "ag_persona";
const PERSONAS: PersonaId[] = ["customer", "partner", "google"];
const MAX_BODY = 200_000;
export const noStore = { "Cache-Control": "no-store", "X-Robots-Tag": "noindex, nofollow" };

export type Body = { events?: unknown; signInAs?: unknown; action?: unknown; useCaseId?: unknown; input?: unknown };

export async function readRequest(request: Request) {
  const jar = await cookies();
  const raw = await request.text();
  if (raw.length > MAX_BODY) return { ok: false as const, response: Response.json({ ok: false, reason: "Request too large." }, { status: 413, headers: noStore }) };
  let body: Body;
  try { body = JSON.parse(raw || "{}"); } catch { return { ok: false as const, response: Response.json({ ok: false, reason: "Invalid JSON." }, { status: 400, headers: noStore }) }; }
  const fromCookie = jar.get(PERSONA_COOKIE)?.value as PersonaId | undefined;
  let persona: PersonaId = fromCookie && PERSONAS.includes(fromCookie) ? fromCookie : "customer";
  if (typeof body.signInAs === "string") {
    if (!PERSONAS.includes(body.signInAs as PersonaId)) return { ok: false as const, response: Response.json({ ok: false, reason: "Unknown persona." }, { status: 400, headers: noStore }) };
    persona = body.signInAs as PersonaId;
    jar.set(PERSONA_COOKIE, persona, { httpOnly: true, sameSite: "lax", path: "/", secure: process.env.NODE_ENV === "production", maxAge: 60 * 60 * 8 });
  }
  return { ok: true as const, body, persona, replayed: replay(Array.isArray(body.events) ? (body.events as Event[]) : []) };
}
