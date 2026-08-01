/**
 * Offers — shareable scenario URLs.
 *
 * ?g=1000&up=55&ut=85&mix=55-7-18-14-6&h=15&fsp=20&t=1m&gcp=0&q3d=15
 *   &o=bogo.offpeak.deferred.batch.fsp&preset=japac
 *
 * Percentages travel as whole numbers so the URL stays readable in a chat
 * window; elected offers travel as a dot-separated list. Anything missing or
 * malformed falls back to the default, so a hand-edited link degrades instead
 * of breaking.
 */

import {
  DEFAULT_LEVERS,
  type GsuTerm,
  LEVER_RANGES,
  type Levers,
  type OfferElections,
} from "./model";
import { findPreset } from "./presets";

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

function readInt(params: URLSearchParams, key: string): number | null {
  const raw = params.get(key);
  if (raw === null || raw.trim() === "") return null;
  const value = Number(raw);
  return Number.isFinite(value) ? value : null;
}

function readPct(
  params: URLSearchParams,
  key: string,
  min: number,
  max: number,
): number | null {
  const value = readInt(params, key);
  return value === null ? null : clamp(value / 100, min, max);
}

const TERMS: readonly GsuTerm[] = ["1m", "3m", "1y"];

function readTerm(params: URLSearchParams): GsuTerm | null {
  const raw = params.get("t");
  return raw && (TERMS as readonly string[]).includes(raw)
    ? (raw as GsuTerm)
    : null;
}

function readMix(params: URLSearchParams): Levers["mix"] | null {
  const raw = params.get("mix");
  if (!raw) return null;
  const parts = raw.split("-").map(Number);
  if (parts.length !== 5 || parts.some((n) => !Number.isFinite(n) || n < 0)) {
    return null;
  }
  const [pt, spike, offPeak, deferred, batch] = parts;
  if (pt + spike + offPeak + deferred + batch <= 0) return null;
  return {
    pt: pt / 100,
    spike: spike / 100,
    offPeak: offPeak / 100,
    deferred: deferred / 100,
    batch: batch / 100,
  };
}

const OFFER_KEYS: ReadonlyArray<[keyof OfferElections, string]> = [
  ["bogo", "bogo"],
  ["offPeak", "offpeak"],
  ["deferred", "deferred"],
  ["batch", "batch"],
  ["fsp", "fsp"],
  ["q3", "q3"],
];

function readOffers(params: URLSearchParams): OfferElections | null {
  const raw = params.get("o");
  if (raw === null) return null;
  const elected = new Set(raw.split(".").filter(Boolean));
  const offers = {} as OfferElections;
  for (const [key, token] of OFFER_KEYS) offers[key] = elected.has(token);
  return offers;
}

/**
 * Hydrate lever state from a query string. A `preset` id supplies the base,
 * then any explicit params override it — so a shared link that was tweaked
 * after loading a preset round-trips exactly.
 */
export function leversFromParams(params: URLSearchParams): {
  levers: Levers;
  presetId: string | null;
} {
  const preset = findPreset(params.get("preset"));
  const base = preset ? preset.levers : DEFAULT_LEVERS;

  const gsus = readInt(params, "g");
  const uPeak = readPct(params, "up", LEVER_RANGES.uPeak.min, LEVER_RANGES.uPeak.max);
  const uPt = readPct(params, "ut", LEVER_RANGES.uPt.min, LEVER_RANGES.uPt.max);
  const mix = readMix(params);
  const harness = readPct(params, "h", LEVER_RANGES.harness.min, LEVER_RANGES.harness.max);
  const fspRaw = readInt(params, "fsp");
  const term = readTerm(params);
  const gcpCommit = readPct(params, "gcp", LEVER_RANGES.gcpCommit.min, LEVER_RANGES.gcpCommit.max);
  const q3Discount = readPct(params, "q3d", 0, 0.3);
  const offers = readOffers(params);

  const fspRate =
    fspRaw === null ? base.fspRate : [10, 20].includes(fspRaw) ? fspRaw / 100 : base.fspRate;

  return {
    levers: {
      gsus:
        gsus === null
          ? base.gsus
          : clamp(
              Math.round(gsus / LEVER_RANGES.gsus.step) * LEVER_RANGES.gsus.step,
              LEVER_RANGES.gsus.min,
              LEVER_RANGES.gsus.max,
            ),
      uPeak: uPeak ?? base.uPeak,
      uPt: uPt ?? base.uPt,
      mix: mix ?? base.mix,
      harness: harness ?? base.harness,
      fspRate,
      term: term ?? base.term,
      gcpCommit: gcpCommit ?? base.gcpCommit,
      q3Discount: q3Discount ?? base.q3Discount,
      offers: offers ?? base.offers,
    },
    presetId: preset?.id ?? null,
  };
}

const round = (fraction: number) => Math.round(fraction * 100);

export function paramsFromLevers(
  levers: Levers,
  presetId?: string | null,
): URLSearchParams {
  const params = new URLSearchParams();
  params.set("g", String(levers.gsus));
  params.set("up", String(round(levers.uPeak)));
  params.set("ut", String(round(levers.uPt)));
  params.set(
    "mix",
    [
      levers.mix.pt,
      levers.mix.spike,
      levers.mix.offPeak,
      levers.mix.deferred,
      levers.mix.batch,
    ]
      .map(round)
      .join("-"),
  );
  params.set("h", String(round(levers.harness)));
  params.set("fsp", String(round(levers.fspRate)));
  params.set("t", levers.term);
  params.set("gcp", String(round(levers.gcpCommit)));
  params.set("q3d", String(round(levers.q3Discount)));
  params.set(
    "o",
    OFFER_KEYS.filter(([key]) => levers.offers[key])
      .map(([, token]) => token)
      .join("."),
  );
  if (presetId) params.set("preset", presetId);
  return params;
}

export function shareUrl(
  origin: string,
  pathname: string,
  levers: Levers,
  presetId?: string | null,
): string {
  return `${origin}${pathname}?${paramsFromLevers(levers, presetId).toString()}`;
}
