/**
 * Offers — shareable scenario URLs.
 *
 * ?pt=600&u=85&pg=600&mix=15-30-20-10&h=15&fsp=20&t=1m&gcp=0&q3d=15
 *   &m=gemini-3-6-flash&tpm=60000&o=bogo.offpeak.deferred.batch.fsp.q3&preset=japac
 *
 * Percentages travel as whole numbers; elected offers travel as a
 * dot-separated list. Anything missing or malformed falls back to the default,
 * so a hand-edited link degrades instead of breaking.
 */

import {
  DEFAULT_LEVERS,
  type GsuTerm,
  LEVER_RANGES,
  type Levers,
  type OfferElections,
  type PayGoMix,
} from "./model";
import { MODEL_PRICES } from "./models";
import { findPreset } from "./presets";

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

function readNum(params: URLSearchParams, key: string): number | null {
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
  const value = readNum(params, key);
  return value === null ? null : clamp(value / 100, min, max);
}

const TERMS: readonly GsuTerm[] = ["1m", "3m", "1y"];

function readTerm(params: URLSearchParams): GsuTerm | null {
  const raw = params.get("t");
  return raw && (TERMS as readonly string[]).includes(raw)
    ? (raw as GsuTerm)
    : null;
}

function readMix(params: URLSearchParams): PayGoMix | null {
  const raw = params.get("mix");
  if (!raw) return null;
  const parts = raw.split("-").map(Number);
  if (parts.length !== 4 || parts.some((n) => !Number.isFinite(n) || n < 0)) {
    return null;
  }
  const [spike, offPeak, deferred, batch] = parts;
  return {
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

function snap(value: number, step: number, min: number, max: number): number {
  return clamp(Math.round(value / step) * step, min, max);
}

export function leversFromParams(params: URLSearchParams): {
  levers: Levers;
  presetId: string | null;
} {
  const preset = findPreset(params.get("preset"));
  const base = preset ? preset.levers : DEFAULT_LEVERS;

  const ptGsus = readNum(params, "pt");
  const paygoGsus = readNum(params, "pg");
  const ptUtilization = readPct(
    params,
    "u",
    LEVER_RANGES.ptUtilization.min,
    LEVER_RANGES.ptUtilization.max,
  );
  const mix = readMix(params);
  const harness = readPct(params, "h", LEVER_RANGES.harness.min, LEVER_RANGES.harness.max);
  const fspRaw = readNum(params, "fsp");
  const term = readTerm(params);
  const gcpCommit = readPct(params, "gcp", LEVER_RANGES.gcpCommit.min, LEVER_RANGES.gcpCommit.max);
  const q3Discount = readPct(params, "q3d", 0, 0.3);
  const offers = readOffers(params);
  const tpmRaw = readNum(params, "tpm");
  const modelRaw = params.get("m");
  const modelId = MODEL_PRICES.some((m) => m.id === modelRaw && m.selectable)
    ? (modelRaw as string)
    : null;

  const fspRate =
    fspRaw === null ? base.fspRate : [10, 20].includes(fspRaw) ? fspRaw / 100 : base.fspRate;

  return {
    levers: {
      ptGsus:
        ptGsus === null
          ? base.ptGsus
          : snap(ptGsus, LEVER_RANGES.ptGsus.step, LEVER_RANGES.ptGsus.min, LEVER_RANGES.ptGsus.max),
      paygoGsus:
        paygoGsus === null
          ? base.paygoGsus
          : snap(
              paygoGsus,
              LEVER_RANGES.paygoGsus.step,
              LEVER_RANGES.paygoGsus.min,
              LEVER_RANGES.paygoGsus.max,
            ),
      ptUtilization: ptUtilization ?? base.ptUtilization,
      paygoMix: mix ?? base.paygoMix,
      harness: harness ?? base.harness,
      tpmPerGsu:
        tpmRaw === null
          ? base.tpmPerGsu
          : snap(
              tpmRaw,
              LEVER_RANGES.tpmPerGsu.step,
              LEVER_RANGES.tpmPerGsu.min,
              LEVER_RANGES.tpmPerGsu.max,
            ),
      modelId: modelId ?? base.modelId,
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
  params.set("pt", String(levers.ptGsus));
  params.set("u", String(round(levers.ptUtilization)));
  params.set("pg", String(levers.paygoGsus));
  params.set(
    "mix",
    [
      levers.paygoMix.spike,
      levers.paygoMix.offPeak,
      levers.paygoMix.deferred,
      levers.paygoMix.batch,
    ]
      .map(round)
      .join("-"),
  );
  params.set("h", String(round(levers.harness)));
  params.set("fsp", String(round(levers.fspRate)));
  params.set("t", levers.term);
  params.set("gcp", String(round(levers.gcpCommit)));
  params.set("q3d", String(round(levers.q3Discount)));
  params.set("m", levers.modelId);
  params.set("tpm", String(levers.tpmPerGsu));
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
