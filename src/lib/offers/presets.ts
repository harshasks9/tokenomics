import { DEFAULT_LEVERS, type Levers, type OfferElections } from "./model";

export interface Preset {
  id: string;
  label: string;
  /** One-line rationale, shown as a dismissible note when the chip is clicked. */
  note: string;
  levers: Levers;
}

/** Offers are patched, not replaced, so a preset only names what it changes. */
type PresetOverrides = Partial<Omit<Levers, "offers">> & {
  offers?: Partial<OfferElections>;
};

function build(overrides: PresetOverrides): Levers {
  return {
    ...DEFAULT_LEVERS,
    ...overrides,
    offers: { ...DEFAULT_LEVERS.offers, ...(overrides.offers ?? {}) },
  };
}

/**
 * Mix tuples are (PT, spike, off-peak, deferred, batch) — the same order as the
 * placement rail. Values are raw shares; the model normalizes them.
 */
export const PRESETS: Preset[] = [
  {
    id: "default",
    label: "Default / Illustrative",
    note: "The reference scenario — a mid-sized new order with a real baseline, a modest spike, and genuine off-peak and async headroom.",
    levers: DEFAULT_LEVERS,
  },
  {
    id: "digital-native",
    label: "Digital native, spiky",
    note: "Consumer traffic with sharp peaks: PT sized to the baseline, protected PayGo carrying the spikes.",
    levers: build({
      uPeak: 0.45,
      uPt: 0.88,
      mix: { pt: 0.5, spike: 0.15, offPeak: 0.15, deferred: 0.15, batch: 0.05 },
      harness: 0.1,
      fspRate: 0.2,
    }),
  },
  {
    id: "japac",
    label: "JAPAC daytime heavy",
    note: "US off-peak = JAPAC business morning. Live daytime traffic reprices at 0.5x with no workload changes.",
    levers: build({
      uPeak: 0.55,
      uPt: 0.85,
      mix: { pt: 0.4, spike: 0.05, offPeak: 0.35, deferred: 0.12, batch: 0.08 },
      harness: 0.15,
      fspRate: 0.2,
    }),
  },
  {
    id: "fsi",
    label: "Regulated FSI (residency-constrained)",
    note: "Off-peak & Deferred not available — global endpoint only. Batch where the residency class permits.",
    levers: build({
      uPeak: 0.6,
      uPt: 0.82,
      mix: { pt: 0.7, spike: 0.1, offPeak: 0, deferred: 0, batch: 0.2 },
      harness: 0,
      fspRate: 0.1,
      offers: { offPeak: false, deferred: false },
    }),
  },
  {
    id: "agent-fleet",
    label: "Agent-fleet future",
    note: "Watch the harness share — agent premiums dilute the 0.5x, so the blended saving lands well short of half.",
    levers: build({
      uPeak: 0.5,
      uPt: 0.85,
      mix: { pt: 0.3, spike: 0.05, offPeak: 0.1, deferred: 0.5, batch: 0.05 },
      harness: 0.25,
      fspRate: 0.2,
    }),
  },
  {
    id: "conservative",
    label: "Conservative (no commitments)",
    note: "Nothing elected beyond right-sizing — the floor case for what correct placement alone is worth.",
    levers: build({
      uPeak: 0.55,
      uPt: 0.78,
      mix: { pt: 0.6, spike: 0.1, offPeak: 0.12, deferred: 0.1, batch: 0.08 },
      harness: 0.2,
      offers: {
        bogo: true,
        offPeak: false,
        deferred: false,
        batch: false,
        fsp: false,
        q3: false,
      },
    }),
  },
  {
    id: "q3-volume",
    label: "Q3 volume play (2,000+ GSUs)",
    note: "A large new order that clears the 2,000 GSU floor — 30% off GSU spend plus 10% in credits, on a 1-year term.",
    levers: build({
      gsus: 4000,
      uPeak: 0.6,
      uPt: 0.85,
      mix: { pt: 0.75, spike: 0.07, offPeak: 0.08, deferred: 0.06, batch: 0.04 },
      harness: 0.15,
      fspRate: 0.2,
      term: "1y",
      offers: { q3: true },
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
    close(a.gsus, b.gsus) &&
    close(a.uPeak, b.uPeak) &&
    close(a.uPt, b.uPt) &&
    close(a.mix.pt, b.mix.pt) &&
    close(a.mix.spike, b.mix.spike) &&
    close(a.mix.offPeak, b.mix.offPeak) &&
    close(a.mix.deferred, b.mix.deferred) &&
    close(a.mix.batch, b.mix.batch) &&
    close(a.harness, b.harness) &&
    close(a.fspRate, b.fspRate) &&
    a.term === b.term &&
    close(a.gcpCommit, b.gcpCommit) &&
    close(a.q3Discount, b.q3Discount) &&
    a.offers.bogo === b.offers.bogo &&
    a.offers.offPeak === b.offers.offPeak &&
    a.offers.deferred === b.offers.deferred &&
    a.offers.batch === b.offers.batch &&
    a.offers.fsp === b.offers.fsp &&
    a.offers.q3 === b.offers.q3
  );
}
