#!/usr/bin/env node
/**
 * Builds src/lib/earbuds/catalog.json from the raw research files in
 * docs/earbuds-pareto/catalog-raw/ (one JSON array per research batch).
 *
 *   node scripts/earbuds-build-catalog.mjs
 *
 * - Merges duplicate models across batches (same normalised brand + model).
 * - Gives every value the ids of the sources that stated it ("fields" lists);
 *   a value no source claimed is attributed to all of the record's sources at
 *   low confidence.
 * - Drops out-of-range values (e.g. a case weight reported as one earbud) and
 *   entries with too little sourced data, logging every drop.
 * - Attaches independent lab scores (SoundGuys / RTINGS) from *lab*.json files.
 */
import { readFileSync, readdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const ROOT = new URL("..", import.meta.url).pathname;
const RAW = join(ROOT, "docs/earbuds-pareto/catalog-raw");
const OUT = join(ROOT, "src/lib/earbuds/catalog.json");
const CURATED = readFileSync(join(ROOT, "src/lib/earbuds/sources.ts"), "utf8");
const GENERATED = process.env.CATALOG_DATE ?? "2026-10-02";

const log = [];
const warn = (m) => log.push(m);

export function matchKey(brand, model) {
  return `${brand} ${model}`
    .toLowerCase()
    .replace(/\(([^)]*)\)/g, " $1 ")
    .replace(/[^a-z0-9]+/g, " ")
    .replace(/\b(true wireless|earbuds|tws|wireless|the)\b/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

// ── Source registry ─────────────────────────────────────────────────────────
const curatedByUrl = new Map();
for (const m of CURATED.matchAll(/\{\s*id:\s*"([^"]+)",[^}]*?url:\s*"([^"]+)"/g)) curatedByUrl.set(normUrl(m[2]), m[1]);

function normUrl(u) {
  return String(u).trim().replace(/^http:\/\//, "https://").replace(/^https:\/\/(?!www\.)/, "https://www.").replace(/\/+$/, "").replace(/#.*$/, "");
}

const sources = new Map(); // normUrl -> {id, publisher, title, url, kind}
const KINDS = { aggregator: "retailer", manufacturer: "manufacturer", retailer: "retailer", news: "news", review: "review", lab: "lab" };

function sourceId(src) {
  const n = normUrl(src.url);
  if (curatedByUrl.has(n)) return curatedByUrl.get(n);
  if (sources.has(n)) return sources.get(n).id;
  let host = "";
  try {
    host = new URL(src.url).hostname.replace(/^www\./, "");
  } catch {
    warn(`bad url ${src.url}`);
    return null;
  }
  const id = `c${sources.size + 1}`;
  const path = (() => {
    try {
      return decodeURIComponent(new URL(src.url).pathname).replace(/[-_/]+/g, " ").replace(/\.\w+$/, "").trim();
    } catch {
      return "";
    }
  })();
  sources.set(n, {
    id,
    publisher: src.publisher || host,
    title: (path.length > 4 ? path : host).slice(0, 120),
    url: src.url,
    kind: KINDS[src.kind] ?? "review",
  });
  return id;
}

// ── Field mapping & sanity ranges ───────────────────────────────────────────
const FIELD_MAP = {
  launchPriceINR: "priceInr",
  mrpINR: "mrpInr",
  launchPriceUSD: "priceUsd",
  anc: "anc",
  ancClaimDb: "ancClaimDb",
  batteryBudsAncOn: "batteryAncOn",
  batteryBudsMax: "batteryMax",
  batteryTotalMax: "batteryTotal",
  ip: "ip",
  weightG: "weight",
  multipoint: "multipoint",
  bluetooth: "bluetooth",
  codecs: "codecs",
  wirelessCharging: "wirelessCharging",
  latencyMs: "latencyMs",
  drivers: "drivers",
};

const RANGES = {
  priceInr: [300, 70000],
  mrpInr: [300, 90000],
  priceUsd: [10, 700],
  ancClaimDb: [10, 70],
  batteryAncOn: [1, 20],
  batteryMax: [1, 24],
  batteryTotal: [4, 200],
  weight: [2.5, 15],
  latencyMs: [20, 300],
};

function clean(field, value, ctx) {
  if (value === null || value === undefined || value === "") return null;
  if (field in RANGES) {
    const n = typeof value === "number" ? value : Number(String(value).replace(/[^0-9.]/g, ""));
    if (!Number.isFinite(n)) return warn(`${ctx}: ${field} not numeric (${value}) — dropped`), null;
    const [lo, hi] = RANGES[field];
    if (n < lo || n > hi) return warn(`${ctx}: ${field}=${n} outside ${lo}–${hi} — dropped`), null;
    return n;
  }
  if (field === "anc") return ["none", "anc", "adaptive"].includes(value) ? value : (warn(`${ctx}: anc=${value} unknown`), null);
  if (field === "multipoint" || field === "wirelessCharging") return typeof value === "boolean" ? value : null;
  if (field === "ip") {
    const ip = String(value).toUpperCase().replace(/\s+/g, "");
    return /^IP[0-6X][0-9]K?$/.test(ip) ? ip : (warn(`${ctx}: ip=${value} unparseable`), null);
  }
  if (field === "codecs") return Array.isArray(value) && value.length ? value.map(String) : null;
  if (field === "bluetooth") return String(value).replace(/^v/i, "");
  return value;
}

const FORMS = ["in-ear", "semi-in-ear", "open-ear", "ear-hook", "clip"];
const RANK = { high: 3, medium: 2, low: 1 };

// ── Load & merge ────────────────────────────────────────────────────────────
const files = readdirSync(RAW).filter((f) => f.endsWith(".json")).sort();
const byKey = new Map();
const ALIAS = JSON.parse(readFileSync(join(RAW, "..", "catalog-aliases.json"), "utf8"));

for (const f of files.filter((f) => !f.includes("lab"))) {
  const arr = JSON.parse(readFileSync(join(RAW, f), "utf8"));
  for (const r of arr) {
    if (!r || !r.brand || !r.model) continue;
    const ctx = `${f}:${r.brand} ${r.model}`;
    if (/\bSTUB\b/.test(r.notes ?? "")) {
      warn(`${ctx}: stub — skipped`);
      continue;
    }
    const key = ALIAS.keys[matchKey(r.brand, r.model)] ?? matchKey(r.brand, r.model);
    const srcIds = (r.sources ?? []).map((s) => ({ id: sourceId(s), fields: s.fields ?? [] })).filter((s) => s.id);
    const conf = r.confidence ?? "medium";
    const values = {};
    for (const [rawField, field] of Object.entries(FIELD_MAP)) {
      const v = clean(field, r[rawField], ctx);
      if (v === null) continue;
      const stated = srcIds.filter((s) => s.fields.includes(rawField)).map((s) => s.id);
      values[field] = { v, s: stated.length ? stated : srcIds.map((s) => s.id), c: stated.length ? conf : "low" };
    }
    const rec = byKey.get(key);
    if (!rec) {
      byKey.set(key, {
        id: r.id && /^[a-z0-9-]+$/.test(r.id) ? r.id : key.replace(/\s+/g, "-"),
        brand: ALIAS.brands[r.brand] ?? r.brand,
        // "Xiaomi" + "Xiaomi Buds 5" → "Buds 5" so labels don't repeat the brand.
        model: r.model.toLowerCase().startsWith(`${(ALIAS.brands[r.brand] ?? r.brand).toLowerCase()} `) ? r.model.slice((ALIAS.brands[r.brand] ?? r.brand).length + 1) : r.model,
        released: /^\d{4}(-\d{2})?$/.test(r.released ?? "") ? r.released : null,
        status: r.status ?? "unknown",
        form: FORMS.includes(r.form) ? r.form : null,
        indiaAvailable: typeof r.indiaAvailable === "boolean" ? r.indiaAvailable : null,
        confidence: conf,
        notes: (r.notes ?? "").trim(),
        values,
      });
    } else {
      warn(`${ctx}: merged into ${rec.brand} ${rec.model}`);
      for (const [k, v] of Object.entries(values)) {
        const cur = rec.values[k];
        if (!cur) rec.values[k] = v;
        else if (JSON.stringify(cur.v) === JSON.stringify(v.v)) cur.s = [...new Set([...cur.s, ...v.s])];
        else if (RANK[v.c] > RANK[cur.c]) {
          rec.notes += ` Conflict on ${k}: ${JSON.stringify(cur.v)} vs ${JSON.stringify(v.v)} (kept the higher-confidence value).`;
          rec.values[k] = v;
        } else rec.notes += ` Conflict on ${k}: other batch reported ${JSON.stringify(v.v)}.`;
      }
      rec.released ??= /^\d{4}(-\d{2})?$/.test(r.released ?? "") ? r.released : null;
      rec.form ??= FORMS.includes(r.form) ? r.form : null;
      if (rec.indiaAvailable === null && typeof r.indiaAvailable === "boolean") rec.indiaAvailable = r.indiaAvailable;
      if (r.notes) rec.notes = `${rec.notes} ${r.notes}`.trim();
    }
  }
}

// ── Lab scores ──────────────────────────────────────────────────────────────
for (const f of files.filter((f) => f.includes("lab"))) {
  for (const r of JSON.parse(readFileSync(join(RAW, f), "utf8"))) {
    const key = ALIAS.keys[matchKey(r.brand, r.model)] ?? matchKey(r.brand, r.model);
    const lab = {
      sgAnc: r.sgAncScore,
      sgAncPct: r.sgAncPct,
      sgComfort: r.sgComfort,
      sgBattery: r.sgBatteryH,
      rtingsBattery: r.rtingsBatteryH,
    };
    if (Object.values(lab).every((v) => v === null || v === undefined)) continue;
    const rec = byKey.get(key);
    if (!rec) {
      warn(`lab ${r.brand} ${r.model}: no catalog entry (key "${key}") — lab scores unused`);
      continue;
    }
    const labSrc = (r.sources ?? []).map((s) => ({ id: sourceId(s), fields: s.fields ?? [] })).filter((s) => s.id);
    const rawName = { sgAnc: "sgAncScore", sgAncPct: "sgAncPct", sgComfort: "sgComfort", sgBattery: "sgBatteryH", rtingsBattery: "rtingsBatteryH" };
    for (const [k, v] of Object.entries(lab)) {
      if (typeof v !== "number") continue;
      if ((k === "sgAnc" || k === "sgComfort") && (v < 0 || v > 10)) continue;
      const stated = labSrc.filter((s) => s.fields.includes(rawName[k])).map((s) => s.id);
      rec.values[k] = { v, s: stated.length ? stated : labSrc.map((s) => s.id), c: stated.length ? "medium" : "low" };
    }
    if (r.notes) rec.notes = `${rec.notes} Lab: ${r.notes}`.trim();
  }
}

// ── Quality gate ────────────────────────────────────────────────────────────
const SUBSTANTIVE = ["priceInr", "priceUsd", "batteryMax", "batteryTotal", "batteryAncOn", "ancClaimDb", "sgAnc", "ip", "weight"];
const models = [];
const ids = new Set();
for (const rec of byKey.values()) {
  const n = SUBSTANTIVE.filter((k) => rec.values[k]).length;
  if (n < 2) {
    warn(`${rec.brand} ${rec.model}: only ${n} substantive sourced value(s) — excluded`);
    continue;
  }
  let id = rec.id;
  while (ids.has(id)) id += "-x";
  ids.add(id);
  models.push({ ...rec, id, notes: rec.notes.replace(/\s+/g, " ").trim() });
}
models.sort((a, b) => a.brand.localeCompare(b.brand) || a.model.localeCompare(b.model));

const used = new Set(models.flatMap((m) => Object.values(m.values).flatMap((v) => v.s)));
const out = {
  generated: GENERATED,
  sources: [...sources.values()].filter((s) => used.has(s.id)),
  models,
};
writeFileSync(OUT, JSON.stringify(out, null, 1) + "\n");
writeFileSync(join(RAW, "..", "catalog-build-log.txt"), log.join("\n") + "\n");
console.log(`${models.length} models, ${out.sources.length} new sources, ${log.length} log lines → ${OUT}`);
