/**
 * Browser-local persistence: the working plan and a list of named saved
 * scenarios. localStorage only — nothing leaves the browser.
 */

import { normalize, type Inputs } from "./engine";

export const WORKING_KEY = "mdes.working.v1";
export const SAVED_KEY = "mdes.saved.v1";

export interface SavedScenario {
  id: string;
  name: string;
  savedAt: string;
  inputs: Inputs;
}

function read<T>(key: string): T | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}

function write(key: string, value: unknown): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* quota or private mode — ignore */
  }
}

export function loadWorking(): Inputs | null {
  const raw = read<Partial<Inputs>>(WORKING_KEY);
  return raw ? normalize(raw) : null;
}

export function saveWorking(inputs: Inputs): void {
  write(WORKING_KEY, inputs);
}

export function clearWorking(): void {
  if (typeof window === "undefined") return;
  try { window.localStorage.removeItem(WORKING_KEY); } catch { /* ignore */ }
}

export function loadSaved(): SavedScenario[] {
  const raw = read<unknown>(SAVED_KEY);
  if (!Array.isArray(raw)) return [];
  return raw
    .filter((s): s is SavedScenario => Boolean(s && typeof s === "object" && "id" in s && "inputs" in s))
    .map((s) => ({ id: String(s.id), name: String(s.name ?? "Untitled"), savedAt: String(s.savedAt ?? ""), inputs: normalize(s.inputs) }));
}

export function saveScenario(name: string, inputs: Inputs, list = loadSaved()): SavedScenario[] {
  const trimmed = name.trim() || "Untitled";
  const entry: SavedScenario = {
    id: `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`,
    name: trimmed,
    savedAt: new Date().toISOString(),
    inputs: normalize(inputs),
  };
  // Same name replaces the earlier entry.
  const next = [entry, ...list.filter((s) => s.name !== trimmed)];
  write(SAVED_KEY, next);
  return next;
}

export function deleteScenario(id: string, list = loadSaved()): SavedScenario[] {
  const next = list.filter((s) => s.id !== id);
  write(SAVED_KEY, next);
  return next;
}
