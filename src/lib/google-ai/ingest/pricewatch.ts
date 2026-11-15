/**
 * Price watch — compare a fetched pricing page with the knowledge base.
 *
 * It reads the page's visible text, finds each model the knowledge base has
 * a current standard-tier price for, and reads the first input and output
 * dollar figures that follow the model's name. A difference raises an alert
 * for an editor; it never rewrites the knowledge base on its own, because a
 * page can list introductory, regional and scheduled prices side by side.
 */
import { ENTITY_BY_ID, PRICES } from "../kb";
import { inEffect } from "../dates";
import type { PriceRecord, PriceSurface } from "../types";
import type { PriceCheck } from "./types";

/** Text between a model's heading and the next model's heading. */
function sectionFor(pageText: string, name: string, allNames: string[]): string | null {
  const at = pageText.indexOf(name + " ");
  if (at < 0) return null;
  let end = Math.min(pageText.length, at + 1500);
  for (const other of allNames) {
    if (other === name || other.startsWith(name)) continue;
    const j = pageText.indexOf(other + " ", at + name.length);
    if (j > 0 && j < end) end = j;
  }
  return pageText.slice(at, end);
}

function firstPriceAfter(section: string, marker: RegExp): number | null {
  const m = section.match(marker);
  if (!m || m.index == null) return null;
  const rest = section.slice(m.index);
  const p = rest.match(/\$\s?(\d+(?:\.\d+)?)/);
  return p ? Number(p[1]) : null;
}

export function checkPrices(pageText: string, surface: PriceSurface, today: string, rows: PriceRecord[] = PRICES): PriceCheck[] {
  const current = rows.filter((p) => p.surface === surface && p.tier === "standard" && (p.region ?? "global") === "global" && p.aboveContextTokens == null && (p.meter === "input" || p.meter === "output") && inEffect(today, p.effectiveFrom, p.effectiveTo));
  const names = [...new Set(current.map((p) => ENTITY_BY_ID[p.entityId]?.name).filter((n): n is string => !!n))];
  const out: PriceCheck[] = [];
  for (const p of current) {
    const name = ENTITY_BY_ID[p.entityId]?.name;
    if (!name) continue;
    const section = sectionFor(pageText, name, names);
    const found = section ? firstPriceAfter(section, p.meter === "input" ? /\bInput\b/ : /\boutput\b/i) : null;
    out.push({
      entityId: p.entityId,
      name,
      meter: p.meter as "input" | "output",
      expected: p.price,
      found,
      status: found == null ? "not-found" : Math.abs(found - p.price) < 1e-9 ? "match" : "changed",
    });
  }
  return out;
}
