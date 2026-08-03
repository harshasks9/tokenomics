/**
 * Offers — model pricing for the token-economics comparison.
 *
 * SOURCING MATTERS HERE. Every Google price below is stated in the Q3 2026
 * commercial deck. The Anthropic figure is *derived* from the deck's own
 * relative claim, not from a published rate card. The OpenAI models are named
 * in the deck as comparison targets but no price is given, so they carry no
 * price — a blank is honest, an invented number is not.
 *
 * Set `unverified` entries from the vendor's public price list before anyone
 * quotes them.
 */

export type Vendor = "Google" | "Anthropic" | "OpenAI";

export type PriceSource = "deck" | "derived" | "unverified";

/**
 * How raw tokens convert into the standard throughput unit. From Google's
 * "Calculate Provisioned Throughput requirements" / "Supported models and
 * burndown rates" tables.
 */
export interface Burndown {
  /** Text, image, video and audio input all burn at this rate. */
  input: number;
  /** Cached input, which is discounted through a reduced burndown rate. */
  inputCached: number;
  /** Output response tokens — materially more expensive than input. */
  output: number;
}

/**
 * Used only where a model's own burndown table has not been loaded. Taken from
 * the one published example (Gemini 3.6 Flash) rather than invented, but it is
 * an assumption: a model with a different output rate will size differently.
 */
export const ASSUMED_BURNDOWN: Burndown = { input: 1, inputCached: 0.1, output: 5 };

export interface ModelPrice {
  id: string;
  vendor: Vendor;
  name: string;
  /** $ per million input tokens. Null when the source gives no price. */
  inputPerMtok: number | null;
  /** $ per million output tokens. */
  outputPerMtok: number | null;
  source: PriceSource;
  /** Where the number came from, shown in the UI. */
  provenance: string;
  /**
   * Relative output tokens consumed for the same task, 1.0 = Gemini 3.6 Flash.
   * Directional, from EAP proof points — not a benchmark.
   */
  tokenFactor: number | null;
  tokenNote?: string;
  /**
   * Provisioned Throughput delivered by one GSU, in **burndown-adjusted**
   * tokens per second. This is the number that makes GSUs model-specific.
   * Null where Google has not published a figure we have actually read — the
   * simulator then falls back to the `tpmPerGsu` lever, a stated assumption.
   */
  tokensPerSecPerGsu: number | null;
  /**
   * Burndown rates: how each raw token converts into the standard unit that
   * `tokensPerSecPerGsu` is denominated in. Output tokens cost several times
   * an input token, which is why a chatty workload needs far more capacity
   * than its raw token count suggests. Null where not published.
   */
  burndown: Burndown | null;
  /** GSUs can only be bought in multiples of this. */
  minGsuIncrement: number;
  throughputProvenance: string;
  /** Whether this model can be picked as the working model. */
  selectable: boolean;
}

export const MODEL_PRICES: ModelPrice[] = [
  {
    id: "gemini-3-6-flash",
    vendor: "Google",
    name: "Gemini 3.6 Flash",
    inputPerMtok: 1.5,
    outputPerMtok: 7.5,
    source: "deck",
    provenance: "Q3 2026 commercial deck",
    tokenFactor: 1,
    tokenNote:
      "Baseline. 17% fewer tokens than 3.5 Flash on the AA Index; 28% fewer in medium thinking mode.",
    tokensPerSecPerGsu: 675,
    burndown: { input: 1, inputCached: 0.1, output: 5 },
    minGsuIncrement: 1,
    throughputProvenance:
      "Published: Gemini 3.6 Flash delivers 675 burndown-adjusted tokens/second per GSU, minimum purchase increment 1. Burndown: input text/image/video/audio 1x, cached input 0.1x, output text response 5x. Source: Google Cloud, 'Calculate Provisioned Throughput requirements', last updated 2026-07-30.",
    selectable: true,
  },
  {
    id: "gemini-3-5-flash-lite",
    vendor: "Google",
    name: "Gemini 3.5 Flash Lite",
    inputPerMtok: 0.3,
    outputPerMtok: 2.5,
    source: "deck",
    provenance: "Q3 2026 commercial deck — price-matched to 2.5 Flash",
    tokenFactor: 2,
    tokenNote:
      "1.3–2.7x higher verbosity on agentic and coding work — but the deck measures that against 2.5 Flash / 3.1 Flash-Lite, not against 3.6 Flash, so using 2.0x (the midpoint) on this axis is an approximation across two different baselines. Price-matched is not bill-matched on agentic work; on chat and vision the deck puts it on par with 2.5 Flash.",
    tokensPerSecPerGsu: null,
    burndown: null,
    minGsuIncrement: 1,
    throughputProvenance:
      "No published throughput-per-GSU figure loaded for this model. Falls back to the tokens-per-GSU assumption.",
    selectable: true,
  },
  {
    id: "gemini-2-5-flash",
    vendor: "Google",
    name: "Gemini 2.5 Flash",
    inputPerMtok: null,
    outputPerMtok: null,
    source: "unverified",
    provenance:
      "Included because its Provisioned Throughput figure is published and verifiable; no deck price, so it carries none.",
    tokenFactor: null,
    tokensPerSecPerGsu: 2690,
    burndown: null,
    minGsuIncrement: 1,
    throughputProvenance:
      "Published throughput: 1 GSU of gemini-2.5-flash delivers an average 2,690 tokens/second (25 GSUs = 67,250). Its own burndown table has not been loaded, so the assumed rates apply — verify before quoting a GSU count.",
    selectable: true,
  },
  {
    id: "gemini-2-5-pro",
    vendor: "Google",
    name: "Gemini 2.5 Pro",
    inputPerMtok: 1.25,
    outputPerMtok: 10,
    source: "deck",
    provenance: "Q3 2026 commercial deck — migration reference",
    tokenFactor: null,
    tokensPerSecPerGsu: null,
    burndown: null,
    minGsuIncrement: 1,
    throughputProvenance:
      "Burndown for input is published (1 input text token = 1 token, 1 cached = 0.1), but neither the output rate nor the throughput per GSU has been loaded. Pro-class models deliver materially less throughput per GSU than Flash, so the fallback will understate the GSU count.",
    selectable: true,
  },
  {
    id: "claude-sonnet",
    vendor: "Anthropic",
    name: "Claude Sonnet",
    inputPerMtok: 3,
    outputPerMtok: 15,
    source: "derived",
    provenance:
      "Derived: the deck states Sonnet is priced about 2x higher on list than Gemini 3.6 Flash. Not a published rate card — verify before quoting.",
    tokenFactor: 8.5,
    tokenNote:
      "An EAP customer reported 5–12x fewer tokens on Gemini 3.6 Flash than Sonnet 5 for one workload; 8.5x is the midpoint. A single customer's result, directional only — the range spans more than 2x, so treat the bar as an order of magnitude, not a measurement.",
    tokensPerSecPerGsu: null,
    burndown: null,
    minGsuIncrement: 1,
    throughputProvenance:
      "Not offered on Provisioned Throughput here.",
    selectable: false,
  },
  {
    id: "gpt-5-4",
    vendor: "OpenAI",
    name: "GPT-5.4",
    inputPerMtok: null,
    outputPerMtok: null,
    source: "unverified",
    provenance:
      "Named in the deck as a comparison target, with no price given. Enter the public list price to compare.",
    tokenFactor: null,
    tokensPerSecPerGsu: null,
    burndown: null,
    minGsuIncrement: 1,
    throughputProvenance:
      "Not offered on Provisioned Throughput here.",
    selectable: false,
  },
  {
    id: "gpt-5-5",
    vendor: "OpenAI",
    name: "GPT-5.5",
    inputPerMtok: null,
    outputPerMtok: null,
    source: "unverified",
    provenance:
      "Named in the deck as a comparison target, with no price given. Enter the public list price to compare.",
    tokenFactor: null,
    tokensPerSecPerGsu: null,
    burndown: null,
    minGsuIncrement: 1,
    throughputProvenance:
      "Not offered on Provisioned Throughput here.",
    selectable: false,
  },
];

export const SELECTABLE_MODELS = MODEL_PRICES.filter((m) => m.selectable);

export function findModel(id: string): ModelPrice {
  return MODEL_PRICES.find((m) => m.id === id) ?? MODEL_PRICES[0];
}

/**
 * Tokens per minute one GSU delivers for this model, or null when Google has
 * published no figure we have read. Callers fall back to the stated assumption.
 */
export function tpmPerGsuFor(model: ModelPrice): number | null {
  return model.tokensPerSecPerGsu === null
    ? null
    : model.tokensPerSecPerGsu * 60;
}

/**
 * How many standard throughput units one RAW token costs, given the output
 * mix. A token that is 20% output on Gemini 3.6 Flash costs 1.8 units, because
 * output burns at 5x — which is why raw TPM alone cannot size a reservation.
 */
export function burndownWeight(
  burndown: Burndown,
  outputShare: number,
): number {
  const out = Math.min(1, Math.max(0, outputShare));
  return (1 - out) * burndown.input + out * burndown.output;
}

export const VENDOR_COLOUR: Record<Vendor, string> = {
  Google: "var(--blue)",
  Anthropic: "var(--gold)",
  OpenAI: "var(--fsp)",
};

/**
 * Blended $/Mtok at a given output share. The decks insist on cost-per-task
 * rather than cost-per-token, so the comparison also exposes a token factor.
 */
export function blendedPerMtok(
  model: ModelPrice,
  outputShare = 0.25,
): number | null {
  if (model.inputPerMtok === null || model.outputPerMtok === null) return null;
  return (
    model.inputPerMtok * (1 - outputShare) + model.outputPerMtok * outputShare
  );
}

/** Blended rate scaled by how many tokens the model actually burns per task. */
export function effectivePerTask(
  model: ModelPrice,
  outputShare = 0.25,
): number | null {
  const blended = blendedPerMtok(model, outputShare);
  if (blended === null || model.tokenFactor === null) return null;
  return blended * model.tokenFactor;
}

export const COMPETE_CAVEAT =
  "Published list prices only. Google figures are from the Q3 2026 deck; the Anthropic figure is derived from the deck's relative claim rather than a rate card, and the OpenAI models are named in the deck without a price. Verify against the vendor's public pricing before using any of this with a customer. Effective-cost-per-task uses directional EAP token ratios, not benchmarks.";
