"use client";

import { useCallback, useSyncExternalStore } from "react";
import { defaults, type Inputs } from "./engine";
import { PRESETS } from "./presets";
import type { DealFile, DealMeta } from "./construct";
import { getServerSession, getSession, setSession, subscribeSession, type Session } from "./session";

/** Shared working state for both views. Every setter persists, so the other page sees it. */
export function useDealSession() {
  const session: Session = useSyncExternalStore(subscribeSession, getSession, getServerSession);
  const update = useCallback((patch: Partial<Inputs>) => { const s = getSession(); setSession({ ...s, inputs: { ...s.inputs, ...patch }, presetId: "" }); }, []);
  const setHorizonOnly = useCallback((patch: Partial<Inputs>) => { const s = getSession(); setSession({ ...s, inputs: { ...s.inputs, ...patch } }); }, []);
  const applyPreset = useCallback((id: string) => { const p = PRESETS.find((x) => x.id === id); const s = getSession(); setSession({ ...s, presetId: id, inputs: p ? { ...defaults(), ...p.set } : defaults() }); }, []);
  const reset = useCallback(() => { const s = getSession(); setSession({ ...s, presetId: "", inputs: defaults() }); }, []);
  const setMeta = useCallback((meta: DealMeta) => { setSession({ ...getSession(), meta }); }, []);
  const loadDeal = useCallback((file: DealFile) => { setSession({ inputs: file.inputs, meta: file.meta, presetId: "" }); }, []);
  return { ...session, update, setHorizonOnly, applyPreset, reset, setMeta, loadDeal };
}
