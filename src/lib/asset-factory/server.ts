/** Server-only request helpers shared by the Asset Factory route handlers. */
import { cookies } from "next/headers";
import { replay, type ReplayResult } from "./engine";
import type { Event, PersonaId } from "./types";

export const PERSONA_COOKIE = "af_persona";
export const PERSONAS: PersonaId[] = ["customer", "google", "partner"];
const MAX_BODY = 400_000;

export type Body = { events?: unknown; signInAs?: unknown; action?: unknown; assetId?: unknown; input?: unknown };

export async function readRequest(request: Request): Promise<
  | { ok: true; body: Body; persona: PersonaId; replayed: ReplayResult }
  | { ok: false; response: Response }
> {
  const raw = await request.text();
  if (raw.length > MAX_BODY) return { ok: false, response: Response.json({ ok: false, reason: "Request too large." }, { status: 413 }) };
  let body: Body;
  try {
    body = JSON.parse(raw || "{}");
  } catch {
    return { ok: false, response: Response.json({ ok: false, reason: "Invalid JSON." }, { status: 400 }) };
  }
  const jar = await cookies();
  const fromCookie = jar.get(PERSONA_COOKIE)?.value as PersonaId | undefined;
  let persona: PersonaId = fromCookie && PERSONAS.includes(fromCookie) ? fromCookie : "customer";
  if (typeof body.signInAs === "string") {
    if (!PERSONAS.includes(body.signInAs as PersonaId)) return { ok: false, response: Response.json({ ok: false, reason: "Unknown persona." }, { status: 400 }) };
    persona = body.signInAs as PersonaId;
    jar.set(PERSONA_COOKIE, persona, { httpOnly: true, sameSite: "lax", path: "/", secure: process.env.NODE_ENV === "production", maxAge: 60 * 60 * 8 });
  }
  const replayed = replay(Array.isArray(body.events) ? (body.events as Event[]) : []);
  return { ok: true, body, persona, replayed };
}

export const noStore = { "Cache-Control": "no-store" };
