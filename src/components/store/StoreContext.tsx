"use client";

import { createContext, useCallback, useContext, useMemo, useState, useSyncExternalStore, type ReactNode } from "react";
import { defaultStore, stores } from "@/lib/store/data";

/**
 * The local department store a seller names throughout the pitch.
 * Persisted per browser so the choice survives a reload.
 */

type Ctx = { store: string; setStore: (s: string) => void };
const StoreCtx = createContext<Ctx>({ store: defaultStore, setStore: () => {} });
const KEY = "ds-store";

let memStore: string | null = null;
const listeners = new Set<() => void>();
function subscribe(cb: () => void) {
  listeners.add(cb);
  window.addEventListener("storage", cb);
  return () => {
    listeners.delete(cb);
    window.removeEventListener("storage", cb);
  };
}
function readStore() {
  if (memStore) return memStore;
  try {
    const saved = window.localStorage.getItem(KEY);
    return saved && saved.trim() ? saved.trim().slice(0, 40) : defaultStore;
  } catch {
    return defaultStore;
  }
}

export function StoreProvider({ children }: { children: ReactNode }) {
  const store = useSyncExternalStore(subscribe, readStore, () => defaultStore);
  const setStore = useCallback((s: string) => {
    const v = (s || defaultStore).trim().slice(0, 40) || defaultStore;
    memStore = v;
    try {
      window.localStorage.setItem(KEY, v);
    } catch {
      /* storage unavailable */
    }
    listeners.forEach((cb) => cb());
  }, []);
  const value = useMemo(() => ({ store, setStore }), [store, setStore]);
  return <StoreCtx.Provider value={value}>{children}</StoreCtx.Provider>;
}

export function useStore() {
  return useContext(StoreCtx);
}

/** Replace {store} placeholders in copy. */
export function useFill() {
  const { store } = useStore();
  return useCallback((text: string) => text.split("{store}").join(store), [store]);
}

/** Inline store name. */
export function S() {
  const { store } = useStore();
  return <>{store}</>;
}

/** Chips to choose the store, plus a free-text option. */
export function StorePicker({ label, customLabel }: { label: string; customLabel: string }) {
  const { store, setStore } = useStore();
  const known = stores.some((s) => s.name === store);
  const [custom, setCustom] = useState("");
  return (
    <div className="grid gap-3">
      <p className="ds-tag">{label}</p>
      <div className="flex flex-wrap gap-2" role="group" aria-label="Choose a department store">
        {stores.map((s) => (
          <button key={s.name} type="button" className="ds-pill" aria-pressed={store === s.name} onClick={() => setStore(s.name)} title={s.market}>
            {s.name}
            <span className="ml-1.5 text-[11px] font-normal opacity-70">{s.market}</span>
          </button>
        ))}
        {!known && (
          <button type="button" className="ds-pill" aria-pressed>
            {store}
          </button>
        )}
      </div>
      <form
        className="flex flex-wrap items-center gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          if (custom.trim()) setStore(custom);
          setCustom("");
        }}
      >
        <label htmlFor="ds-store-custom" className="ds-small">
          {customLabel}
        </label>
        <input
          id="ds-store-custom"
          className="rounded-full border border-[var(--line-2)] bg-[var(--bg-2)] px-3 py-1.5 text-[13px]"
          placeholder="Store name"
          maxLength={40}
          value={custom}
          onChange={(e) => setCustom(e.target.value)}
        />
        <button type="submit" className="ds-btn ds-btn--ghost ds-btn--sm">
          Use it
        </button>
      </form>
    </div>
  );
}
