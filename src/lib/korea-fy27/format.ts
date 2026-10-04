/** Display helpers for the plan site. Pure functions: safe to import from client components. */
import type { Basis, MotionId, PlayState, SegmentId, Src } from "./types";

/** $M with sensible precision: $226M, $13.4M, $0.36M. */
export function money(value: number, opts: { approx?: boolean; sign?: boolean } = {}): string {
  const abs = Math.abs(value);
  const digits = abs >= 1 ? (Number.isInteger(Math.round(abs * 10) / 10) ? 0 : 1) : Number.isInteger(Math.round(abs * 1000) / 100) ? 1 : 2;
  const body = `$${abs.toLocaleString("en-US", { minimumFractionDigits: digits, maximumFractionDigits: digits })}M`;
  const sign = opts.sign ? (value < 0 ? "−" : "+") : value < 0 ? "−" : "";
  return `${opts.approx ? "~" : ""}${sign}${body}`;
}

/** $B for wallet figures: 2600 → $2.6B. */
export function billions(valueM: number, opts: { approx?: boolean; digits?: number } = {}): string {
  const digits = opts.digits ?? 1;
  return `${opts.approx ? "~" : ""}$${(valueM / 1000).toFixed(digits)}B`;
}

export function pct(value: number, opts: { approx?: boolean; digits?: number } = {}): string {
  const digits = opts.digits ?? 0;
  return `${opts.approx ? "~" : ""}${value.toFixed(digits)}%`;
}

export function num(value: number | string | null | undefined, digits?: number): string {
  if (value === null || value === undefined || value === "") return "–";
  if (typeof value === "string") return value;
  const d = digits ?? (Number.isInteger(value) ? 0 : Math.abs(value) < 1 ? 2 : 1);
  return value.toLocaleString("en-US", { minimumFractionDigits: d, maximumFractionDigits: d });
}

export const BASIS_LABEL: Record<Basis, string> = {
  stated: "Stated in the deck",
  derived: "Derived on this site",
  estimate: "Estimate (est.)",
  directional: "Directional field intel",
  wip: "WIP",
  "to-confirm": "To confirm",
  placeholder: "Placeholder",
  proposed: "Proposed, not yet agreed",
};

export const BASIS_SHORT: Record<Basis, string> = {
  stated: "Stated",
  derived: "Derived",
  estimate: "Est.",
  directional: "Directional",
  wip: "WIP",
  "to-confirm": "To confirm",
  placeholder: "Placeholder",
  proposed: "Proposed",
};

export const PART_LABEL: Record<Src["part"], string> = {
  main: "Main deck",
  A: "Appendix A – Market & TAM",
  B: "Appendix B – FY26 review & bridge",
  C: "Appendix C – execution plans",
};

export function srcText(src: Src): string {
  const plural = /[–,-]/.test(src.slides) ? "slides" : "slide";
  return `${PART_LABEL[src.part]}, ${plural} ${src.slides}`;
}

export const MOTION_LABEL: Record<MotionId, string> = { deepen: "Deepen", penetrate: "Penetrate", acquire: "Acquire" };
export const SEGMENT_LABEL: Record<SegmentId, string> = {
  dn: "Digital Natives",
  ce: "Conglomerates & Enterprise",
  mm: "Mid-market",
  ps: "Public Sector & EDU",
};
export const SEGMENT_SHORT: Record<SegmentId, string> = { dn: "DN", ce: "C&E", mm: "Mid-market", ps: "Public & EDU" };
export const PLAY_STATE_LABEL: Record<PlayState, string> = { lead: "Lead play", second: "Second line", none: "Not a focus" };

/** Line-of-sight band used by filters: high ≥ 35%, medium 10–35%, low < 10%. */
export function losBand(pct: number): "High" | "Medium" | "Low" {
  if (pct >= 35) return "High";
  if (pct >= 10) return "Medium";
  return "Low";
}
