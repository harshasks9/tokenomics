/**
 * Offers — shareable scenario URLs.
 *
 * ?n=1000&u0=55&u1=85&mix=55-7-18-14-6&h=15&d=20&t=1m&g=0&inc=0&cr=0&preset=japac
 *
 * Percentages travel as whole numbers so the URL stays readable in a chat
 * window. Anything missing or malformed falls back to the default, so a
 * hand-edited link degrades instead of breaking.
 */

import {
  DEFAULT_LEVERS,
  type GsuTerm,
  LEVER_RANGES,
  type Levers,
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
  const [wb, ws, wo, wd, wbt] = parts;
  if (wb + ws + wo + wd + wbt <= 0) return null;
  return { wb: wb / 100, ws: ws / 100, wo: wo / 100, wd: wd / 100, wbt: wbt / 100 };
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

  const n0 = readInt(params, "n");
  const u0 = readPct(params, "u0", LEVER_RANGES.u0.min, LEVER_RANGES.u0.max);
  const u1 = readPct(params, "u1", LEVER_RANGES.u1.min, LEVER_RANGES.u1.max);
  const mix = readMix(params);
  const h = readPct(params, "h", LEVER_RANGES.h.min, LEVER_RANGES.h.max);
  const dRaw = readInt(params, "d");
  const term = readTerm(params);
  const gcp = readPct(params, "g", LEVER_RANGES.gcp.min, LEVER_RANGES.gcp.max);
  const inc = readPct(params, "inc", LEVER_RANGES.inc.min, LEVER_RANGES.inc.max);
  const cr = readPct(params, "cr", LEVER_RANGES.cr.min, LEVER_RANGES.cr.max);

  const d =
    dRaw === null
      ? base.d
      : [0, 10, 20].includes(dRaw)
        ? dRaw / 100
        : base.d;

  return {
    levers: {
      n0:
        n0 === null
          ? base.n0
          : clamp(
              Math.round(n0 / LEVER_RANGES.n0.step) * LEVER_RANGES.n0.step,
              LEVER_RANGES.n0.min,
              LEVER_RANGES.n0.max,
            ),
      u0: u0 ?? base.u0,
      u1: u1 ?? base.u1,
      mix: mix ?? base.mix,
      h: h ?? base.h,
      d,
      term: term ?? base.term,
      gcp: gcp ?? base.gcp,
      inc: inc ?? base.inc,
      cr: cr ?? base.cr,
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
  params.set("n", String(levers.n0));
  params.set("u0", String(round(levers.u0)));
  params.set("u1", String(round(levers.u1)));
  params.set(
    "mix",
    [levers.mix.wb, levers.mix.ws, levers.mix.wo, levers.mix.wd, levers.mix.wbt]
      .map(round)
      .join("-"),
  );
  params.set("h", String(round(levers.h)));
  params.set("d", String(round(levers.d)));
  params.set("t", levers.term);
  params.set("g", String(round(levers.gcp)));
  params.set("inc", String(round(levers.inc)));
  params.set("cr", String(round(levers.cr)));
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
