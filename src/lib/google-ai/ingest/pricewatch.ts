/**
 * Price watch — compare a fetched pricing page with the knowledge base.
 *
 * It reads the page's visible text, finds each Google text model the knowledge
 * base has a current standard-tier price for, and reads the input and output
 * dollar figures in the tables headed by the model's name. A difference raises an alert
 * for an editor; it never rewrites the knowledge base on its own, because a
 * page can list introductory, regional and scheduled prices side by side.
 */
import { ENTITY_BY_ID, PRICES } from "../kb";
import { inEffect } from "../dates";
import type { PriceRecord, PriceSurface } from "../types";
import type { PriceCheck } from "./types";

/** Every stretch of text that starts at a model's name and runs to the next model's name (or a fixed length). */
function sectionsFor(pageText: string, name: string, allNames: string[]): string[] {
  const out: string[] = [];
  let from = 0;
  for (;;) {
    const at = pageText.indexOf(name, from);
    if (at < 0) break;
    from = at + name.length;
    // Skip longer names that merely start with this one ("… Flash-Lite", "… Flash Image").
    const next = pageText.slice(from, from + 14);
    if (/^[-\w.]/.test(next) || /^ (Lite|Image|Live|TTS|Pro|Flash|Fast|Ultra|Preview Image)\b/i.test(next)) continue;
    let end = Math.min(pageText.length, at + 1400);
    for (const other of allNames) {
      if (other === name) continue;
      const j = pageText.indexOf(other, from);
      if (j > 0 && j < end) end = j;
    }
    const section = pageText.slice(at, end);
    // A price table starts with an "Input" row close to the name; banners and footnotes that only mention the model do not.
    if (/\bInput\b/.test(section.slice(0, 220))) out.push(section);
  }
  return out;
}

function firstPriceAfter(section: string, marker: RegExp): number | null {
  const m = section.match(marker);
  if (!m || m.index == null) return null;
  const p = section.slice(m.index).match(/\$\s?(\d+(?:\.\d+)?)/);
  return p ? Number(p[1]) : null;
}

/**
 * Checks Google text models only: other meters on the page use other units
 * (per 1,000 characters, per second, per image) and partner models are priced
 * on a different page. A model's name can head several tables (an introductory
 * price and the scheduled one), so a check passes when ANY of its tables shows
 * the expected price, and reports "changed" only when none does. Precision is
 * preferred over recall here: a separate content-hash alert fires on any change
 * to the page, so a missed difference still reaches an editor.
 */
export function checkPrices(pageText: string, surface: PriceSurface, today: string, rows: PriceRecord[] = PRICES): PriceCheck[] {
  const current = rows.filter((p) => {
    const e = ENTITY_BY_ID[p.entityId];
    return e?.providerId === "google" && (e.model?.category ?? "text") === "text" && p.unit === "usd-per-1m-tokens" && p.surface === surface && p.tier === "standard" && (p.region ?? "global") === "global" && p.aboveContextTokens == null && (p.meter === "input" || p.meter === "output") && inEffect(today, p.effectiveFrom, p.effectiveTo);
  });
  const names = [...new Set(current.map((p) => ENTITY_BY_ID[p.entityId].name))];
  const out: PriceCheck[] = [];
  for (const p of current) {
    const name = ENTITY_BY_ID[p.entityId].name;
    const seen = sectionsFor(pageText, name, names)
      .map((s) => firstPriceAfter(s, p.meter === "input" ? /\bInput\b/ : /\boutput\b/i))
      .filter((v): v is number => v != null);
    const hit = seen.some((v) => Math.abs(v - p.price) < 1e-9);
    out.push({ entityId: p.entityId, name, meter: p.meter as "input" | "output", expected: p.price, found: seen.length ? (hit ? p.price : seen[0]) : null, status: !seen.length ? "not-found" : hit ? "match" : "changed" });
  }
  return out;
}
