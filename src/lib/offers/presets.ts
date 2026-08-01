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

export const PRESETS: Preset[] = [
  {
    id: "default",
    label: "Balanced (50/50)",
    note: "An even split of new PT and new PayGo — a common starting shape, but only a starting point. Move the two volume sliders to match the real profile.",
    levers: DEFAULT_LEVERS,
  },
  {
    id: "pt-heavy",
    label: "PT-heavy baseline",
    note: "Predictable, steady new workload — most of it reserved, a thin PayGo tail for bursts.",
    levers: build({
      ptGsus: 1600,
      ptUtilization: 0.88,
      paygoGsus: 400,
      paygoMix: { spike: 0.25, offPeak: 0.2, deferred: 0.1, batch: 0.05 },
    }),
  },
  {
    id: "paygo-heavy",
    label: "PayGo-heavy, spiky",
    note: "Mostly variable new demand with sharp peaks. Watch what Buy One PT Get One PayGo is worth here — untick it and the spike share jumps to 1.8x.",
    levers: build({
      ptGsus: 300,
      ptUtilization: 0.8,
      paygoGsus: 1400,
      paygoMix: { spike: 0.35, offPeak: 0.2, deferred: 0.15, batch: 0.05 },
    }),
  },
  {
    id: "japac",
    label: "JAPAC daytime",
    note: "US off-peak is the JAPAC business morning, so a large share of live daytime traffic reprices at 0.5x with no workload changes.",
    levers: build({
      ptGsus: 700,
      ptUtilization: 0.85,
      paygoGsus: 1100,
      paygoMix: { spike: 0.1, offPeak: 0.55, deferred: 0.1, batch: 0.08 },
    }),
  },
  {
    id: "fsi",
    label: "Regulated FSI",
    note: "Off-peak and Deferred are global-endpoint only, so a residency-constrained customer cannot elect them — the shares stay at 1.0x.",
    levers: build({
      ptGsus: 900,
      ptUtilization: 0.82,
      paygoGsus: 500,
      paygoMix: { spike: 0.2, offPeak: 0.15, deferred: 0.1, batch: 0.2 },
      harness: 0,
      fspRate: 0.1,
      offers: { offPeak: false, deferred: false },
    }),
  },
  {
    id: "agent-fleet",
    label: "Agent fleet",
    note: "Mostly deferred agent work. Watch the harness share in Advanced — agent premiums dilute the 0.5x, so the blended saving lands well short of half.",
    levers: build({
      ptGsus: 500,
      ptUtilization: 0.8,
      paygoGsus: 1800,
      paygoMix: { spike: 0.05, offPeak: 0.1, deferred: 0.6, batch: 0.1 },
      harness: 0.25,
    }),
  },
  {
    id: "q3-volume",
    label: "Q3 volume (2,000+ GSUs)",
    note: "A PT order past the 2,000 GSU floor — 30% off PT spend plus 10% in credits, on a 1-year term.",
    levers: build({
      ptGsus: 2400,
      ptUtilization: 0.87,
      paygoGsus: 900,
      paygoMix: { spike: 0.15, offPeak: 0.25, deferred: 0.15, batch: 0.1 },
      term: "1y",
    }),
  },
  {
    id: "nothing-elected",
    label: "Nothing elected",
    note: "The floor case — the same workload with no programmatic options taken at all. Everything on the waterfall to the right of the first bar is what is being left behind.",
    levers: build({
      offers: {
        bogo: false,
        offPeak: false,
        deferred: false,
        batch: false,
        fsp: false,
        q3: false,
      },
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
    close(a.ptGsus, b.ptGsus) &&
    close(a.ptUtilization, b.ptUtilization) &&
    close(a.paygoGsus, b.paygoGsus) &&
    close(a.paygoMix.spike, b.paygoMix.spike) &&
    close(a.paygoMix.offPeak, b.paygoMix.offPeak) &&
    close(a.paygoMix.deferred, b.paygoMix.deferred) &&
    close(a.paygoMix.batch, b.paygoMix.batch) &&
    close(a.harness, b.harness) &&
    close(a.tpmPerGsu, b.tpmPerGsu) &&
    close(a.fspRate, b.fspRate) &&
    a.term === b.term &&
    a.modelId === b.modelId &&
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
