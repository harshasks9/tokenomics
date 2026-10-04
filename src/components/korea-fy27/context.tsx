"use client";

import { createContext, useContext } from "react";
import type { SiteModel } from "@/lib/korea-fy27/model";
import type { CohortId } from "@/lib/korea-fy27/types";

export type DrawerTab = "economics" | "plays" | "deliver" | "team" | "decisions" | "accounts";

type SiteContext = {
  model: SiteModel;
  openCohort: (id: CohortId, tab?: DrawerTab) => void;
};

export const SiteCtx = createContext<SiteContext | null>(null);

export function useSite(): SiteContext {
  const value = useContext(SiteCtx);
  if (!value) throw new Error("useSite must be used inside the Korea plan site");
  return value;
}
