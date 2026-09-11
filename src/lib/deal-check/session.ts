/**
 * The working deal: the customer, every input and the chosen scenario, shared
 * between the full and simple views and kept in this browser so a change on
 * either page shows on the other. Server rendering sees the defaults; the
 * browser swaps in the saved state on hydration (useSyncExternalStore).
 */

import { defaults, type Inputs } from "./engine";
import { emptyMeta, parseDeal, type DealMeta } from "./construct";

export interface Session {
  inputs: Inputs;
  meta: DealMeta;
  presetId: string;
}

export const SESSION_KEY = "dealcheck.current.v1";
const EVENT = "dealcheck-session-changed";

export const serverSession: Session = { inputs: defaults(), meta: emptyMeta(), presetId: "" };

let cache: Session | null = null;

function read(): Session {
  try {
    const raw = globalThis.localStorage?.getItem(SESSION_KEY);
    if (!raw) return serverSession;
    const obj: unknown = JSON.parse(raw);
    if (!obj || typeof obj !== "object") return serverSession;
    const o = obj as Record<string, unknown>;
    const file = parseDeal(JSON.stringify({ meta: o.meta, inputs: o.inputs }));
    return { inputs: file.inputs, meta: file.meta, presetId: typeof o.presetId === "string" ? o.presetId : "" };
  } catch {
    return serverSession;
  }
}

export function getSession(): Session {
  if (cache === null) cache = read();
  return cache;
}

export function getServerSession(): Session {
  return serverSession;
}

export function setSession(next: Session): void {
  cache = next;
  try { globalThis.localStorage?.setItem(SESSION_KEY, JSON.stringify(next)); } catch { /* storage unavailable */ }
  try { globalThis.dispatchEvent?.(new Event(EVENT)); } catch { /* no window */ }
}

export function subscribeSession(cb: () => void): () => void {
  const onStorage = (e: StorageEvent) => { if (e.key === null || e.key === SESSION_KEY) { cache = null; cb(); } };
  window.addEventListener("storage", onStorage);
  window.addEventListener(EVENT, cb);
  return () => { window.removeEventListener("storage", onStorage); window.removeEventListener(EVENT, cb); };
}

/** Test hook: forget the cached snapshot. */
export function resetSessionCache(): void {
  cache = null;
}
