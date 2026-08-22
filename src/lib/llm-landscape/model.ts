import type { Claim, Dataset, Dimension, Model } from "./types";

/** released can be YYYY-MM-DD, YYYY-MM, YYYY, YYYY-Qn, or null. */
export function parseReleased(released: string | null | undefined): {
  sort: number;
  year: number | null;
  quarter: string | null;
  display: string;
} {
  if (!released) return { sort: Number.MAX_SAFE_INTEGER, year: null, quarter: null, display: "not published" };
  const q = /^(\d{4})-Q([1-4])$/.exec(released);
  if (q) {
    const year = Number(q[1]);
    const month = Number(q[2]) * 3 - 1;
    return {
      sort: Date.UTC(year, month - 1, 1),
      year,
      quarter: `${year} Q${q[2]}`,
      display: `${year} Q${q[2]}`,
    };
  }
  const parts = released.split("-").map(Number);
  const [y, m = 1, d = 1] = parts;
  const sort = Date.UTC(y, (m || 1) - 1, d || 1);
  const quarter = `${y} Q${Math.floor(((m || 1) - 1) / 3) + 1}`;
  const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  let display = String(y);
  if (parts.length >= 2) display = `${MONTHS[(m - 1) % 12]} ${y}`;
  if (parts.length >= 3) display = `${MONTHS[(m - 1) % 12]} ${d}, ${y}`;
  return { sort, year: y, quarter, display };
}

export function byReleaseAsc(a: Model, b: Model): number {
  const sa = parseReleased(a.released).sort;
  const sb = parseReleased(b.released).sort;
  if (sa !== sb) return sa - sb;
  return (a.tier ?? 9) - (b.tier ?? 9) || a.id.localeCompare(b.id);
}

/** Presentation constants (styling only — no facts). */
export const VENDOR_HUES: Record<string, string> = {
  Google: "#4285F4",
  "Google DeepMind": "#4285F4",
  "Google (DeepMind)": "#4285F4",
  OpenAI: "#10A37F",
  Anthropic: "#D97757",
  Meta: "#0866FF",
  "Mistral AI": "#F5A623",
  DeepSeek: "#6C5CE7",
  Alibaba: "#E2543E",
  "Moonshot AI": "#38BDF8",
  "Zhipu AI (Z.ai)": "#34D399",
  xAI: "#9CA3AF",
  "Stability AI (CompVis / Runway / LAION collaboration)": "#C084FC",
  "Black Forest Labs": "#C084FC",
  ElevenLabs: "#F472B6",
};

export function vendorHue(vendor: string): string {
  if (VENDOR_HUES[vendor]) return VENDOR_HUES[vendor];
  const key = Object.keys(VENDOR_HUES).find((k) => vendor.startsWith(k.split(" ")[0]));
  return key ? VENDOR_HUES[key] : "#94A3B8";
}

export const GRADE_META: Record<string, { short: string; label: string; cls: string }> = {
  "vendor-claim": { short: "VENDOR", label: "vendor claim", cls: "g-vendor" },
  "measured-benchmark": { short: "BENCH", label: "measured benchmark", cls: "g-bench" },
  "independent-eval": { short: "INDEP", label: "independent eval", cls: "g-indep" },
  "practitioner-consensus": { short: "PRACT", label: "practitioner consensus", cls: "g-pract" },
  "analyst-inference": { short: "ANALYST", label: "analyst inference", cls: "g-analyst" },
};

export const STATUS_META: Record<string, { label: string; cls: string }> = {
  current: { label: "current", cls: "s-current" },
  superseded: { label: "superseded", cls: "s-superseded" },
  deprecated: { label: "deprecated", cls: "s-deprecated" },
  retired: { label: "retired", cls: "s-retired" },
  announced: { label: "announced", cls: "s-announced" },
  preview: { label: "preview", cls: "s-announced" },
};

export const ACCESS_LABEL: Record<string, string> = {
  "proprietary-api": "proprietary API",
  "open-weights": "open weights",
  "source-available": "source available",
  "on-device": "on-device",
};

export function fmtMods(m: Model): string {
  const inn = m.modalities_in?.length ? m.modalities_in.join("+") : null;
  const out = m.modalities_out?.length ? m.modalities_out.join("+") : null;
  if (!inn && !out) return "—";
  return `${inn ?? "—"} → ${out ?? "—"}`;
}

export function fmtTokens(n: number | null | undefined): string {
  if (n == null) return "not published";
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(n % 1_000_000 ? 2 : 0)}M`;
  if (n >= 1_000) return `${Math.round(n / 1_000)}K`;
  return String(n);
}

/** Resolve a mapping's google_model display string to a dataset record. */
export function resolveGoogleRecord(googleModel: string | null, models: Model[]): Model | null {
  if (!googleModel) return null;
  const hay = googleModel.toLowerCase();
  const googles = models.filter((m) => m.vendor.toLowerCase().startsWith("google"));
  let best: Model | null = null;
  for (const m of googles) {
    const name = m.name.toLowerCase();
    if (hay.includes(name)) {
      if (!best || name.length > best.name.length) best = m;
    }
  }
  return best;
}

export function claimsFor(m: Model): { field: string; claim: Claim }[] {
  const out: { field: string; claim: Claim }[] = [];
  for (const field of ["known_for", "best_use_cases", "weaknesses"] as const) {
    for (const c of m[field] ?? []) out.push({ field, claim: c });
  }
  return out;
}

export function matchDimension(dim: Dimension, text: string): boolean {
  const t = text.toLowerCase();
  return dim.keywords.some((k) => t.includes(k.toLowerCase()));
}

/** ---------- URL state ---------- */
export type ViewId = "timeline" | "families" | "compare";

export type UiState = {
  view: ViewId;
  vendors: string[];
  access: string[];
  modality: string | null;
  workload: string | null;
  years: [number, number] | null;
  tiers: number[];
  sel: string | null; // selected model id (detail pane)
  cmp: string | null; // workload id for compare view
};

export const DEFAULT_STATE: UiState = {
  view: "timeline",
  vendors: [],
  access: [],
  modality: null,
  workload: null,
  years: null,
  tiers: [],
  sel: null,
  cmp: null,
};

export function decodeState(search: string): UiState {
  const p = new URLSearchParams(search);
  const list = (k: string) => (p.get(k) ? p.get(k)!.split(",").filter(Boolean) : []);
  const yr = p.get("y");
  let years: [number, number] | null = null;
  if (yr && /^\d{4}-\d{4}$/.test(yr)) {
    const [a, b] = yr.split("-").map(Number);
    years = [Math.min(a, b), Math.max(a, b)];
  }
  const view = p.get("view");
  return {
    view: view === "families" || view === "compare" ? view : "timeline",
    vendors: list("v"),
    access: list("a"),
    modality: p.get("m"),
    workload: p.get("w"),
    years,
    tiers: list("t").map(Number).filter((n) => [1, 2, 3].includes(n)),
    sel: p.get("sel"),
    cmp: p.get("cmp"),
  };
}

export function encodeState(s: UiState): string {
  const p = new URLSearchParams();
  if (s.view !== "timeline") p.set("view", s.view);
  if (s.vendors.length) p.set("v", s.vendors.join(","));
  if (s.access.length) p.set("a", s.access.join(","));
  if (s.modality) p.set("m", s.modality);
  if (s.workload) p.set("w", s.workload);
  if (s.years) p.set("y", `${s.years[0]}-${s.years[1]}`);
  if (s.tiers.length) p.set("t", s.tiers.join(","));
  if (s.sel) p.set("sel", s.sel);
  if (s.cmp) p.set("cmp", s.cmp);
  const q = p.toString();
  return q ? `?${q}` : "";
}

/** Composable filters over the model list. */
export function applyFilters(data: Dataset, s: UiState): Model[] {
  return data.models.filter((m) => {
    if (s.vendors.length && !s.vendors.includes(vendorGroup(m.vendor))) return false;
    if (s.access.length) {
      if (!m.access || !s.access.includes(m.access)) return false;
    }
    if (s.modality) {
      const mods = [...(m.modalities_in ?? []), ...(m.modalities_out ?? [])];
      if (!mods.includes(s.modality)) return false;
    }
    if (s.workload) {
      const rows = m.google_equivalents ?? [];
      if (!rows.some((r) => r.workload === s.workload)) return false;
    }
    if (s.years) {
      const y = parseReleased(m.released).year;
      if (y == null || y < s.years[0] || y > s.years[1]) return false;
    }
    if (s.tiers.length && !s.tiers.includes(m.tier)) return false;
    return true;
  });
}

/** Group vendor labels for the filter chips (Google DeepMind -> Google). */
export function vendorGroup(vendor: string): string {
  if (vendor.startsWith("Google")) return "Google";
  if (vendor.startsWith("Stability")) return "Stability AI";
  if (vendor.startsWith("Zhipu")) return "Zhipu (Z.ai)";
  return vendor;
}
