import { DEFAULT_LEVERS, type Levers } from "./model";

export interface Preset {
  id: string;
  label: string;
  /** One-line rationale, shown as a dismissible note when the chip is clicked. */
  note: string;
  levers: Levers;
}

function build(overrides: Partial<Levers>): Levers {
  return { ...DEFAULT_LEVERS, ...overrides };
}

/**
 * Mix tuples are (baseload, spike, off-peak, deferred, batch) — the same order
 * as the lever rail. Values are raw shares; the model normalizes them.
 */
export const PRESETS: Preset[] = [
  {
    id: "default",
    label: "Default / Illustrative",
    note: "The reference scenario — a mid-sized estate with a real baseload, a modest spike, and genuine off-peak and async headroom.",
    levers: DEFAULT_LEVERS,
  },
  {
    id: "digital-native",
    label: "Digital native, spiky",
    note: "Consumer traffic with sharp peaks: PT sized to baseload, protected PayGo carrying the spikes.",
    levers: build({
      u0: 0.45,
      u1: 0.88,
      mix: { wb: 0.5, ws: 0.15, wo: 0.15, wd: 0.15, wbt: 0.05 },
      h: 0.1,
      d: 0.2,
    }),
  },
  {
    id: "japac",
    label: "JAPAC daytime heavy",
    note: "US off-peak = JAPAC business morning. Live daytime traffic reprices at 0.5x with no workload changes.",
    levers: build({
      u0: 0.55,
      u1: 0.85,
      mix: { wb: 0.4, ws: 0.05, wo: 0.35, wd: 0.12, wbt: 0.08 },
      h: 0.15,
      d: 0.2,
    }),
  },
  {
    id: "fsi",
    label: "Regulated FSI (residency-constrained)",
    note: "Off-peak & Deferred excluded — global endpoint only. *Batch where residency class permits.",
    levers: build({
      u0: 0.6,
      u1: 0.82,
      mix: { wb: 0.7, ws: 0.1, wo: 0, wd: 0, wbt: 0.2 },
      h: 0,
      d: 0.1,
    }),
  },
  {
    id: "agent-fleet",
    label: "Agent-fleet future",
    note: "Watch the h term — harness fees dilute the 0.5x.",
    levers: build({
      u0: 0.5,
      u1: 0.85,
      mix: { wb: 0.3, ws: 0.05, wo: 0.1, wd: 0.5, wbt: 0.05 },
      h: 0.25,
      d: 0.2,
    }),
  },
  {
    id: "conservative",
    label: "Conservative (no FSP, cautious placement)",
    note: "No commitment wrapper and a modest placement assumption — the floor case for what right-sizing alone is worth.",
    levers: build({
      u0: 0.55,
      u1: 0.78,
      mix: { wb: 0.6, ws: 0.1, wo: 0.12, wd: 0.1, wbt: 0.08 },
      h: 0.2,
      d: 0,
    }),
  },
];

export function findPreset(id: string | null | undefined): Preset | undefined {
  if (!id) return undefined;
  return PRESETS.find((preset) => preset.id === id);
}

/** Structural equality against a preset, used to keep chip state honest. */
export function matchesPreset(levers: Levers, preset: Preset): boolean {
  const a = levers;
  const b = preset.levers;
  const close = (x: number, y: number) => Math.abs(x - y) < 1e-9;
  return (
    close(a.n0, b.n0) &&
    close(a.u0, b.u0) &&
    close(a.u1, b.u1) &&
    close(a.mix.wb, b.mix.wb) &&
    close(a.mix.ws, b.mix.ws) &&
    close(a.mix.wo, b.mix.wo) &&
    close(a.mix.wd, b.mix.wd) &&
    close(a.mix.wbt, b.mix.wbt) &&
    close(a.h, b.h) &&
    close(a.d, b.d) &&
    a.term === b.term &&
    close(a.gcp, b.gcp) &&
    close(a.inc, b.inc) &&
    close(a.cr, b.cr)
  );
}
