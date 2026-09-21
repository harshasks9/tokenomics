/**
 * Working plan store: one Inputs object shared by every component, persisted
 * to localStorage, exposed through useSyncExternalStore so server and first
 * client render agree (defaults), then the saved plan hydrates.
 */

import { useCallback, useSyncExternalStore } from "react";
import { defaults, normalize, type Inputs } from "./engine";
import { WORKING_KEY, clearWorking, loadWorking, saveWorking } from "./storage";

let cache: Inputs | null = null;
const listeners = new Set<() => void>();
const SERVER = defaults();

function snapshot(): Inputs {
  if (cache === null) cache = loadWorking() ?? defaults();
  return cache;
}

function emit() {
  for (const l of listeners) l();
}

export function setPlan(next: Inputs | ((prev: Inputs) => Inputs)): void {
  const value = normalize(typeof next === "function" ? next(snapshot()) : next);
  cache = value;
  saveWorking(value);
  emit();
}

export function resetPlan(): void {
  cache = defaults();
  clearWorking();
  emit();
}

function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  const onStorage = (e: StorageEvent) => {
    if (e.key === WORKING_KEY) { cache = null; listener(); }
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", onStorage);
  };
}

export function usePlan() {
  const inputs = useSyncExternalStore(subscribe, snapshot, () => SERVER);
  const update = useCallback((patch: Partial<Inputs> | ((prev: Inputs) => Partial<Inputs>)) => {
    setPlan((prev) => ({ ...prev, ...(typeof patch === "function" ? patch(prev) : patch) }));
  }, []);
  return { inputs, update, set: setPlan, reset: resetPlan };
}

/** Client-only flag so the UI can avoid flashing the server defaults as if they were the user's plan. */
export function useHydrated(): boolean {
  return useSyncExternalStore(() => () => {}, () => true, () => false);
}
