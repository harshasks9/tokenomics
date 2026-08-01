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
      "1.3–2.7x higher verbosity on agentic and coding work. Price-matched is not bill-matched there; 2.0x is the midpoint.",
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
      "An EAP customer reported 5–12x fewer tokens on Gemini 3.6 Flash than Sonnet 5 for their workload; 8.5x is the midpoint of that range and is directional only.",
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
    selectable: false,
  },
];

export const SELECTABLE_MODELS = MODEL_PRICES.filter((m) => m.selectable);

export function findModel(id: string): ModelPrice {
  return MODEL_PRICES.find((m) => m.id === id) ?? MODEL_PRICES[0];
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
