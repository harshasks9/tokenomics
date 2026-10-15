"use client";

import { createContext, useContext, useMemo, useState, type ReactNode } from "react";
import { DEFAULT_INPUTS, compute, type EconInputs, type EconOutputs } from "@/lib/ge-citizen/economics";

interface Ctx {
  inputs: EconInputs;
  setInputs: (updater: (prev: EconInputs) => EconInputs) => void;
  out: EconOutputs;
}

const EconCtx = createContext<Ctx | null>(null);

/** Shares calculator state so the executive summary reflects the reader's own assumptions. */
export function EconProvider({ children }: { children: ReactNode }) {
  const [inputs, setState] = useState<EconInputs>(DEFAULT_INPUTS);
  const out = useMemo(() => compute(inputs), [inputs]);
  const value = useMemo(() => ({ inputs, setInputs: (u: (p: EconInputs) => EconInputs) => setState(u), out }), [inputs, out]);
  return <EconCtx.Provider value={value}>{children}</EconCtx.Provider>;
}

export function useEcon(): Ctx {
  const c = useContext(EconCtx);
  if (!c) throw new Error("useEcon must be used inside EconProvider");
  return c;
}
