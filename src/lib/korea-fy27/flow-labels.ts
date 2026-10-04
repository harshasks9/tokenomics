/** Labels for the flow version. Pure constants: safe to import from client components. */
import type { MotionId } from "./types";

export type When = "q4" | "q1" | "q2" | "fy27";

export const WHEN_ORDER: When[] = ["q4", "q1", "q2", "fy27"];

export const WHEN_LABEL: Record<When, string> = {
  q4: "Q4 '26 · now",
  q1: "By Q1 '27",
  q2: "By Q2 '27",
  fy27: "In FY27",
};

export const COMMERCIAL_BUCKETS = ["Switch", "Commit", "Start", "Adopt"] as const;
export type CommercialBucket = (typeof COMMERCIAL_BUCKETS)[number];

/** Motion order used by the flow, as the outline lists them. */
export const FLOW_MOTIONS: MotionId[] = ["acquire", "deepen", "penetrate"];
