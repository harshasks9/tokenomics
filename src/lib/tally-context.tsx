"use client";

import { createContext, useContext, useState, useCallback, type ReactNode } from "react";

export interface ScenarioResult {
  label: string;
  allFrontier: number;
  tiered: number;
  savings: number;
  period: "one-time" | "monthly" | "annual";
}

interface TallyContextType {
  results: Record<string, ScenarioResult>;
  updateResult: (key: string, result: ScenarioResult) => void;
  resetAll: () => void;
}

const TallyContext = createContext<TallyContextType | null>(null);

export function TallyProvider({ children }: { children: ReactNode }) {
  const [results, setResults] = useState<Record<string, ScenarioResult>>({});

  const updateResult = useCallback((key: string, result: ScenarioResult) => {
    setResults((prev) => ({ ...prev, [key]: result }));
  }, []);

  const resetAll = useCallback(() => setResults({}), []);

  return (
    <TallyContext.Provider value={{ results, updateResult, resetAll }}>
      {children}
    </TallyContext.Provider>
  );
}

export function useTally() {
  const ctx = useContext(TallyContext);
  if (!ctx) throw new Error("useTally must be used within TallyProvider");
  return ctx;
}
