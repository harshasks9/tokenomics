// Merge the four research files into the canonical dataset, validating as it goes.
// Anything that cannot be tied to a source or a known entity is dropped and logged — never patched up.
import fs from "node:fs";
import path from "node:path";

// Usage: GAI_RESEARCH_DIR=<folder with r1-models.json, r2-stack.json, r3-competitors.json, r4-news.json[, fixes.json, dates.json]> node src/lib/google-ai/tools/merge.mjs
const IN = process.env.GAI_RESEARCH_DIR ?? process.cwd();
const OUT = path.join(path.dirname(new URL(import.meta.url).pathname), "..", "data");
// TODAY is the date the base research files (r1–r4) were verified: the default check date for their records.
const TODAY = "2026-11-15";
// CURATED is the date of the latest update applied on top (updates carry their own check dates).
const CURATED = process.env.GAI_CURATED ?? TODAY;
const load = (f) => (fs.existsSync(path.join(IN, f)) ? JSON.parse(fs.readFileSync(path.join(IN, f), "utf8")) : {});
const r1 = load("r1-models.json"), r2 = load("r2-stack.json"), r3 = load("r3-competitors.json"), r4 = load("r4-news.json");
// Dated updates applied on top of the base research, oldest first: r5-update.json, r6-update.json, …
const updates = fs.readdirSync(IN).filter((f) => /^r\d+-update\.json$/.test(f)).sort((a, b) => parseInt(a.slice(1)) - parseInt(b.slice(1))).map(load);
const up = (k) => updates.flatMap((u) => u[k] ?? []);
const fixes = fs.existsSync(path.join(IN, "fixes.json")) ? load("fixes.json") : {};
const log = [];
const note = (m) => log.push(m);

const iso = (d) => {
  if (!d || typeof d !== "string") return undefined;
  const m = d.match(/^(\d{4})(?:-(\d{2}))?(?:-(\d{2}))?/);
  if (!m) return undefined;
  return `${m[1]}-${m[2] ?? "01"}-${m[3] ?? "01"}`;
};
const squash = (s) => String(s).toLowerCase().replace(/[^a-z0-9]+/g, "");
const LABELS = ["verified-fact", "provider-claim", "independent-measurement", "analyst-interpretation"];

// ── sources
const sources = new Map();
for (const s of [...(r1.sources ?? []), ...(r2.sources ?? []), ...(r3.sources ?? []), ...(r4.sources ?? []), ...(fixes.sources ?? []), ...up("sources")]) {
  if (!s?.id || !/^https?:\/\//.test(s.url ?? "")) { note(`source dropped (no id/url): ${s?.id}`); continue; }
  if (sources.has(s.id)) continue;
  sources.set(s.id, { id: s.id, title: s.title ?? s.url, publisher: s.publisher ?? "", url: s.url, published: iso(s.published), kind: s.kind ?? "official-docs", firstParty: !!s.firstParty, access: ["primary", "search-excerpt", "secondary", "prior-knowledge"].includes(s.access) ? s.access : "secondary", lastChecked: iso(s.lastChecked) ?? TODAY });
}
const srcOk = (ids) => [...new Set((ids ?? []).filter((id) => sources.has(id)))];
const claim = (c) => {
  if (!c || typeof c.text !== "string" || !c.text.trim()) return null;
  const sourceIds = srcOk(c.sourceIds);
  if (!sourceIds.length) return null;
  return { text: c.text.trim(), label: LABELS.includes(c.label) ? c.label : "provider-claim", sourceIds, ...(iso(c.asOf) ? { asOf: iso(c.asOf) } : {}), ...(c.confidence ? { confidence: c.confidence } : {}) };
};
const claimList = (arr, where) => {
  const out = [];
  for (const c of Array.isArray(arr) ? arr : []) { const k = claim(c); if (k) out.push(k); else note(`claim dropped (no valid source) in ${where}: ${String(c?.text).slice(0, 70)}`); }
  return out;
};

// ── entities
const entities = new Map();
const DOSSIER = ["whyItExists", "problem", "howItWorks", "inputsOutputs", "architecture", "users", "useCases", "differentiators", "limitations", "competitorNotes"];
const LAYERS = ["infrastructure", "research", "models", "platform", "agents", "enterprise", "consumer", "ecosystem"];
function addEntity(e, origin) {
  if (!e?.id || !e.name) return;
  if ((fixes.skipEntity ?? []).includes(e.id)) return;
  const id = (fixes.renameEntity ?? {})[e.id] ?? e.id;
  const sourceIds = srcOk(e.sourceIds);
  const dossier = {};
  for (const k of DOSSIER) { const l = claimList(e.dossier?.[k], `${id}.${k}`); if (l.length) dossier[k] = l; }
  // An entity with no usable source of its own inherits the sources of its claims.
  const inherited = sourceIds.length ? sourceIds : [...new Set(Object.values(dossier).flat().flatMap((c) => c.sourceIds))];
  if (!inherited.length) { note(`entity dropped (no source): ${id} [${origin}]`); return; }
  const clean = {
    id, kind: e.kind ?? "product", providerId: e.providerId ?? "google", name: e.name,
    aliases: [...new Set((e.aliases ?? []).filter((a) => typeof a === "string" && a && a !== e.name))],
    ...(e.formerNames?.length ? { formerNames: e.formerNames.filter((f) => f?.name).map((f) => ({ name: f.name, ...(iso(f.from) ? { from: iso(f.from) } : {}), ...(iso(f.to) ? { to: iso(f.to) } : {}), sourceIds: srcOk(f.sourceIds).length ? srcOk(f.sourceIds) : inherited.slice(0, 1) })) } : {}),
    ...(LAYERS.includes(e.layer) ? { layer: e.layer } : {}),
    ...(e.group ? { group: e.group } : {}),
    ...(e.parentId ? { parentId: (fixes.renameEntity ?? {})[e.parentId] ?? e.parentId } : {}),
    summary: e.summary ?? "",
    status: ["ga", "preview", "experimental", "announced", "research", "deprecated", "retired"].includes(e.status) ? e.status : "ga",
    ...(iso(e.introducedAt) ? { introducedAt: iso(e.introducedAt) } : {}),
    ...(iso(e.retiredAt) ? { retiredAt: iso(e.retiredAt) } : {}),
    ...(Object.keys(dossier).length ? { dossier } : {}),
    ...(e.model ? { model: { ...e.model, apiIds: (e.model.apiIds ?? []).filter(Boolean), modalitiesIn: e.model.modalitiesIn ?? [], modalitiesOut: e.model.modalitiesOut ?? [], category: e.model.category ?? "text" } } : {}),
    verification: ["verified", "partially-verified", "unverified", "disputed"].includes(e.verification) ? e.verification : "partially-verified",
    sourceIds: inherited, lastCheckedAt: iso(e.lastCheckedAt) ?? TODAY,
  };
  const prev = entities.get(id);
  if (!prev) { entities.set(id, clean); return; }
  // Same id from two researchers: keep the first, fold in what the second adds.
  prev.aliases = [...new Set([...prev.aliases, ...clean.aliases])];
  prev.sourceIds = [...new Set([...prev.sourceIds, ...clean.sourceIds])];
  if (!prev.layer && clean.layer) prev.layer = clean.layer;
  if (!prev.group && clean.group) prev.group = clean.group;
  if (!prev.introducedAt && clean.introducedAt) prev.introducedAt = clean.introducedAt;
  if (!prev.formerNames && clean.formerNames) prev.formerNames = clean.formerNames;
  if (clean.dossier) { prev.dossier ??= {}; for (const k of DOSSIER) if (clean.dossier[k]) prev.dossier[k] = [...(prev.dossier[k] ?? []), ...clean.dossier[k].filter((c) => !(prev.dossier[k] ?? []).some((p) => p.text === c.text))]; }
  note(`entity merged from two files: ${id}`);
}
for (const e of r1.entities ?? []) addEntity(e, "r1");
for (const e of r2.entities ?? []) addEntity(e, "r2");
for (const e of r3.entities ?? []) addEntity(e, "r3");
for (const e of fixes.entities ?? []) addEntity(e, "fixes");
for (const e of up("entities")) addEntity(e, "update");
for (const id of fixes.dropEntity ?? []) entities.delete(id);

// Model families sit in the models layer; Google models inherit it.
for (const e of entities.values()) {
  if (e.providerId === "google" && (e.kind === "model" || e.kind === "model-family") && !e.layer) e.layer = "models";
  if (e.providerId === "google" && e.kind === "model" && !e.group) e.group = entities.get(e.parentId)?.name ?? "Other models";
  if (e.providerId === "google" && e.kind === "model-family" && !e.group) e.group = "Model families";
  if (e.parentId && !entities.has(e.parentId)) { note(`parentId cleared (unknown): ${e.id} → ${e.parentId}`); delete e.parentId; }
  if (!entities.has(e.providerId)) note(`!! entity ${e.id} has unknown provider ${e.providerId}`);
}

// Resolve a loose id (slug guessed by another researcher) to a canonical entity id.
const bySquash = new Map();
for (const e of entities.values()) { for (const n of [e.id, e.name, ...e.aliases, ...(e.formerNames ?? []).map((f) => f.name), ...(e.model?.apiIds ?? [])]) if (!bySquash.has(squash(n))) bySquash.set(squash(n), e.id); }
const ent = (id) => { if (!id) return undefined; const r = (fixes.renameEntity ?? {})[id] ?? id; return entities.has(r) ? r : bySquash.get(squash(r)); };

// ── relationships
const relationships = [];
const seenRel = new Set();
for (const r of [...(r1.relationships ?? []), ...(r2.relationships ?? []), ...(r3.relationships ?? []), ...(fixes.relationships ?? []), ...up("relationships")]) {
  const from = ent(r.from), to = ent(r.to);
  const sourceIds = srcOk(r.sourceIds);
  if (!from || !to || from === to) { note(`relationship dropped (unknown end): ${r.id} ${r.from} → ${r.to}`); continue; }
  if (!sourceIds.length) { note(`relationship dropped (no source): ${r.id}`); continue; }
  const key = `${from}|${r.type}|${to}`;
  if (seenRel.has(key)) continue;
  seenRel.add(key);
  relationships.push({ id: r.id ?? `rel-${relationships.length}`, from, to, type: r.type, ...(r.note ? { note: r.note } : {}), ...(r.conditions ? { conditions: r.conditions } : {}), ...(iso(r.effectiveFrom) ? { effectiveFrom: iso(r.effectiveFrom) } : {}), ...(iso(r.effectiveTo) ? { effectiveTo: iso(r.effectiveTo) } : {}), label: LABELS.includes(r.label) ? r.label : "verified-fact", confidence: r.confidence ?? "medium", sourceIds });
}
// parentId implies part-of when no edge says so.
for (const e of entities.values()) if (e.parentId && !seenRel.has(`${e.id}|part-of|${e.parentId}`)) { relationships.push({ id: `rel-parent-${e.id}`, from: e.id, to: e.parentId, type: "part-of", label: "verified-fact", confidence: "high", sourceIds: e.sourceIds.slice(0, 2) }); seenRel.add(`${e.id}|part-of|${e.parentId}`); }

// ── prices
const prices = [];
for (const p of [...(r1.prices ?? []), ...(r2.prices ?? []), ...(r3.prices ?? []), ...(fixes.prices ?? []), ...up("prices")]) {
  const entityId = ent(p.entityId);
  const sourceIds = srcOk(p.sourceIds);
  const effectiveFrom = iso(p.effectiveFrom);
  if (!entityId) { note(`price dropped (unknown entity ${p.entityId}): ${p.id}`); continue; }
  if (!sourceIds.length || typeof p.price !== "number" || !effectiveFrom) { note(`price dropped (no source/price/date): ${p.id}`); continue; }
  prices.push({ id: p.id, entityId, providerId: entities.get(entityId).providerId, surface: p.surface, meter: p.meter, unit: p.unit ?? "usd-per-1m-tokens", price: p.price, tier: p.tier ?? "standard", ...(p.region ? { region: p.region } : {}), ...(p.aboveContextTokens ? { aboveContextTokens: p.aboveContextTokens } : {}), ...(p.condition ? { condition: p.condition } : {}), ...(iso(p.publishedAt) ? { publishedAt: iso(p.publishedAt) } : {}), effectiveFrom, ...(iso(p.effectiveTo) ? { effectiveTo: iso(p.effectiveTo) } : {}), label: LABELS.includes(p.label) ? p.label : "verified-fact", sourceIds, lastCheckedAt: iso(p.lastCheckedAt) ?? TODAY, ...(p.note ? { note: p.note } : {}) });
}
// Close open-ended records that a later record for the same key supersedes; drop exact duplicates.
{
  const key = (p) => [p.entityId, p.surface, p.meter, p.tier, p.region ?? "global", p.aboveContextTokens ?? "", p.condition ?? ""].join("|");
  const groups = {};
  for (const p of prices) (groups[key(p)] ??= []).push(p);
  for (const g of Object.values(groups)) {
    g.sort((a, b) => a.effectiveFrom.localeCompare(b.effectiveFrom));
    for (let i = 1; i < g.length; i++) {
      const prev = g[i - 1], cur = g[i];
      if (prev.effectiveFrom === cur.effectiveFrom) { cur._drop = true; note(`price duplicate dropped: ${cur.id} (same key and date as ${prev.id})`); g.splice(i, 1); i--; continue; }
      if (!prev.effectiveTo || prev.effectiveTo >= cur.effectiveFrom) { const d = new Date(cur.effectiveFrom + "T00:00:00Z"); d.setUTCDate(d.getUTCDate() - 1); prev.effectiveTo = d.toISOString().slice(0, 10); }
    }
  }
}
const pricesOut = prices.filter((p) => !p._drop);

// ── benchmarks
const benchmarks = (r3.benchmarks ?? []).filter((b) => b?.id && b.name);
const benchIds = new Set(benchmarks.map((b) => b.id));
const results = [];
for (const r of r3.results ?? []) {
  const modelId = ent(r.modelId);
  const sourceIds = srcOk(r.sourceIds);
  if (!modelId || !benchIds.has(r.benchmarkId) || !sourceIds.length || typeof r.score !== "number" || !iso(r.date)) { note(`benchmark result dropped: ${r.id} (${r.modelId}/${r.benchmarkId})`); continue; }
  results.push({ ...r, modelId, date: iso(r.date), sourceIds, ...(r.benchmarkVersion ? { benchmarkVersion: String(r.benchmarkVersion).replace(/^(v\d+)\.0$/, "$1") } : {}) });
}

// ── availability, lifecycle
const availability = [];
for (const a of [...(r1.availability ?? []), ...(r2.availability ?? [])]) {
  const entityId = ent(a.entityId); const sourceIds = srcOk(a.sourceIds);
  if (!entityId || !sourceIds.length || !iso(a.effectiveFrom)) { note(`availability dropped: ${a.id}`); continue; }
  availability.push({ ...a, entityId, surface: ent(a.surface) ?? a.surface, effectiveFrom: iso(a.effectiveFrom), ...(iso(a.effectiveTo) ? { effectiveTo: iso(a.effectiveTo) } : {}), label: LABELS.includes(a.label) ? a.label : "verified-fact", sourceIds });
}
const lifecycle = [];
const seenLc = new Set();
for (const l of [...(r1.lifecycle ?? []), ...(r2.lifecycle ?? []), ...(r3.lifecycle ?? []), ...(r4.deadlines ?? []), ...(fixes.lifecycle ?? []), ...up("lifecycle").map((l) => ({ ...l, _update: true }))]) {
  const entityId = ent(l.entityId); const sourceIds = srcOk(l.sourceIds);
  if (!entityId || !sourceIds.length || !iso(l.date)) { note(`lifecycle dropped (${!entityId ? "unknown entity " + l.entityId : "no source/date"}): ${l.id}`); continue; }
  const key = `${entityId}|${l.type}|${iso(l.effectiveDate) ?? iso(l.date)}`;
  if (seenLc.has(key) || seenLc.has(l.id)) continue;
  seenLc.add(key); seenLc.add(l.id);
  lifecycle.push({ ...(l._update ? { _update: true } : {}), id: l.id, entityId, type: l.type, date: iso(l.date), ...(iso(l.effectiveDate) ? { effectiveDate: iso(l.effectiveDate) } : {}), detail: l.detail ?? "", label: LABELS.includes(l.label) ? l.label : "verified-fact", sourceIds });
}

// Confirmed status changes from updates. A patch must cite a source; the entity's check date moves to the update's.
for (const u of updates) for (const pch of u.entityPatches ?? []) {
  const e = entities.get(ent(pch.id));
  const sids = srcOk(pch.sourceIds);
  if (!e || !sids.length) { note(`entity patch dropped (unknown entity or no source): ${pch.id}`); continue; }
  if (["ga", "preview", "experimental", "announced", "research", "deprecated", "retired"].includes(pch.status)) e.status = pch.status;
  if (iso(pch.retiredAt)) e.retiredAt = iso(pch.retiredAt);
  if (pch.addAliases?.length) e.aliases = [...new Set([...e.aliases, ...pch.addAliases])];
  e.sourceIds = [...new Set([...e.sourceIds, ...sids])];
  e.lastCheckedAt = CURATED;
  note(`entity patched from update: ${e.id}${pch.status ? ` → ${pch.status}` : ""}`);
}
// A retirement date that was still ahead when the base research was verified is a schedule, not a fact. Once it
// falls inside an update window it stays a schedule unless that update confirms it (a "retired" event or a patch).
{
  const confirmed = new Set([...updates.flatMap((u) => (u.lifecycle ?? []).filter((l) => l.type === "retired").map((l) => ent(l.entityId))), ...updates.flatMap((u) => (u.entityPatches ?? []).filter((p) => p.retiredAt || p.status === "retired").map((p) => ent(p.id)))]);
  for (const e of entities.values()) {
    if (!e.retiredAt || e.retiredAt <= TODAY || e.retiredAt > CURATED || confirmed.has(e.id)) continue;
    const when = e.retiredAt;
    if (!lifecycle.some((l) => l.entityId === e.id && l.type === "retirement-scheduled" && l.effectiveDate === when)) {
      lifecycle.push({ id: `lc-sched-${e.id}`, entityId: e.id, type: "retirement-scheduled", date: TODAY, effectiveDate: when, detail: `Retirement scheduled for ${when}.`, label: "verified-fact", sourceIds: e.sourceIds.slice(0, 2) });
    }
    delete e.retiredAt;
    if (e.status === "retired") e.status = "deprecated";
    note(`retirement of ${e.id} on ${when} not confirmed by an update: kept as scheduled`);
  }
}

// Prices re-read from the live official page on a later date keep their value and take the later check date.
{
  const rc = load("rechecked.json");
  let n = 0;
  for (const c of rc.checks ?? []) for (const p of prices) {
    if (p._drop || p.entityId !== c.entityId || p.meter !== c.meter || p.surface !== "agent-platform" || p.tier !== "standard" || (p.region ?? "global") !== "global" || p.aboveContextTokens || p.price !== c.price) continue;
    if (p.effectiveFrom <= rc.date && (!p.effectiveTo || p.effectiveTo >= rc.date)) { p.lastCheckedAt = rc.date; n++; }
  }
  if (rc.date) note(`price records re-checked on ${rc.date}: ${n}`);
}

// A "retired" event on an entity the catalogue still lists as live (no retirement date, live status) describes a
// preview id or a sub-product being withdrawn, not the entity. Record it as an update so the entity is not shown as retired.
for (const l of lifecycle) {
  const e = entities.get(l.entityId);
  if (l.type === "retired" && e && !e.retiredAt && ["ga", "preview"].includes(e.status)) { l.type = "updated"; note(`lifecycle retyped retired → updated (entity still live): ${l.id}`); }
}
// Entities the catalogue marks retired take their retirement date from the matching event when they lack one.
for (const e of entities.values()) {
  if (e.status !== "retired" || e.retiredAt) continue;
  const d = lifecycle.filter((l) => l.entityId === e.id && (l.type === "retired" || l.type === "retirement-scheduled")).map((l) => l.effectiveDate ?? l.date).sort()[0];
  if (d && d <= CURATED) e.retiredAt = d;
}

// Introduction dates researched separately (dates.json), each with its own source.
{
  const patch = load("dates.json");
  for (const s of patch.sources ?? []) if (s?.id && /^https?:\/\//.test(s.url ?? "") && !sources.has(s.id)) sources.set(s.id, { id: s.id, title: s.title ?? s.url, publisher: s.publisher ?? "", url: s.url, published: iso(s.published), kind: s.kind ?? "official-blog", firstParty: !!s.firstParty, access: ["primary", "search-excerpt", "secondary", "prior-knowledge"].includes(s.access) ? s.access : "secondary", lastChecked: TODAY });
  let n = 0;
  for (const d of patch.dates ?? []) {
    const e = entities.get(ent(d.id));
    if (!e || e.introducedAt || !iso(d.introducedAt) || !sources.has(d.sourceId) || iso(d.introducedAt) > CURATED) continue;
    e.introducedAt = iso(d.introducedAt);
    if (d.precision === "month") e.introducedPrecision = "month";
    if (!e.sourceIds.includes(d.sourceId)) e.sourceIds.push(d.sourceId);
    n++;
  }
  note(`introducedAt taken from dates.json for ${n} entities`);
}

// An entity with no introduction date takes it from its earliest dated launch event or first recorded name, when one exists.
let derived = 0;
for (const e of entities.values()) {
  if (e.introducedAt) continue;
  const dates = lifecycle.filter((l) => !l._update && l.entityId === e.id && ["announced", "preview", "ga"].includes(l.type)).map((l) => l.date);
  for (const f of e.formerNames ?? []) if (f.from) dates.push(f.from);
  if (dates.length) { e.introducedAt = dates.sort()[0]; derived++; }
}
note(`introducedAt derived from lifecycle for ${derived} entities`);

// ── announcements
const AREAS = ["models", "infrastructure", "developer-platforms", "enterprise-agents", "workspace", "search-consumer", "multimodal", "safety-governance", "research"];
const announcements = [];
for (const a of [...(r4.announcements ?? []), ...up("announcements")]) {
  const sourceIds = srcOk(a.sourceIds);
  const summary = claimList(a.summary, `${a.id}.summary`);
  if (!a.id || !iso(a.date) || !summary.length) { note(`announcement dropped (no date/summary): ${a.id}`); continue; }
  const all = [...new Set([...sourceIds, ...summary.flatMap((c) => c.sourceIds)])];
  const unknown = (a.entityIds ?? []).filter((id) => !ent(id));
  if (unknown.length) note(`announcement ${a.id}: unlinked entity ids ${unknown.join(", ")}`);
  const opt = (k) => { const l = claimList(a[k], `${a.id}.${k}`); return l.length ? { [k]: k === "implications" ? l.map((c) => ({ ...c, label: "analyst-interpretation" })) : l } : {}; };
  announcements.push({
    id: a.id, title: a.title, date: iso(a.date), ...(iso(a.effectiveDate) && iso(a.effectiveDate) !== iso(a.date) ? { effectiveDate: iso(a.effectiveDate) } : {}),
    providerId: entities.has(a.providerId) ? a.providerId : "google",
    types: (a.types ?? []).length ? a.types : ["product-update"], areas: (a.areas ?? []).filter((x) => AREAS.includes(x)), layers: (a.layers ?? []).filter((x) => LAYERS.includes(x)),
    entityIds: [...new Set((a.entityIds ?? []).map(ent).filter(Boolean))],
    summary, ...(a.beforeAfter?.before && a.beforeAfter?.after ? { beforeAfter: a.beforeAfter } : {}), ...opt("technical"), ...opt("competitive"), ...opt("implications"), ...opt("pricingAvailability"),
    ...(a.uncertainty?.length ? { uncertainty: a.uncertainty } : {}),
    ...(a.followUps?.length ? { followUps: a.followUps.filter((f) => iso(f.date) && srcOk(f.sourceIds).length).map((f) => ({ date: iso(f.date), note: f.note, sourceIds: srcOk(f.sourceIds) })) } : {}),
    importance: Math.min(5, Math.max(1, Math.round(a.importance ?? 3))), verification: a.verification ?? "partially-verified", sourceIds: all, firstSeenAt: iso(a.firstSeenAt) ?? TODAY, lastCheckedAt: iso(a.lastCheckedAt) ?? TODAY,
  });
}

// ── timeline
const timeline = [];
const seenTl = new Set();
for (const t of [...(r4.timeline ?? []), ...(r3.timeline ?? []), ...up("timeline")]) {
  const sourceIds = srcOk(t.sourceIds);
  if (!t.id || !iso(t.date) || !sourceIds.length || seenTl.has(t.id)) { if (!seenTl.has(t.id)) note(`timeline dropped: ${t.id}`); continue; }
  seenTl.add(t.id);
  const precision = t.precision ?? (/^\d{4}$/.test(t.date) ? "year" : /^\d{4}-\d{2}$/.test(t.date) ? "month" : "day");
  timeline.push({ id: t.id, date: iso(t.date), precision, track: t.track ?? "macro", providerId: entities.has(t.providerId) ? t.providerId : "google", title: t.title, detail: t.detail ?? "", entityIds: [...new Set((t.entityIds ?? []).map(ent).filter(Boolean))], significance: Math.min(3, Math.max(1, t.significance ?? 2)), label: LABELS.includes(t.label) ? t.label : "verified-fact", sourceIds });
}

// ── battlegrounds
const battlegrounds = (r3.battlegrounds ?? []).map((b) => ({ id: b.id, name: b.name, question: b.question, google: claimList(b.google, `${b.id}.google`), rivals: (b.rivals ?? []).map((r) => ({ providerId: r.providerId, position: claimList(r.position, `${b.id}.${r.providerId}`) })).filter((r) => r.position.length && entities.has(r.providerId)), entityIds: [...new Set((b.entityIds ?? []).map(ent).filter(Boolean))], assessment: b.assessment ?? "", watch: b.watch ?? [] }));

// ── used sources only
const used = new Set();
const collect = (v) => { if (Array.isArray(v)) v.forEach(collect); else if (v && typeof v === "object") for (const [k, x] of Object.entries(v)) { if (k === "sourceIds") x.forEach((i) => used.add(i)); else collect(x); } };
const ents = [...entities.values()];
[ents, relationships, pricesOut, results, availability, lifecycle, announcements, timeline, battlegrounds].forEach(collect);
const sourcesOut = [...sources.values()].filter((s) => used.has(s.id));

const meta = { version: `${CURATED.replace(/-/g, ".")}-1`, curatedAt: CURATED, coverageFrom: "2026-08-15", coverageTo: CURATED, notes: [...up("metaNotes"), ...(fixes.metaNotes ?? [])] };
const write = (f, v) => fs.writeFileSync(path.join(OUT, f), JSON.stringify(v, null, 1) + "\n");
write("sources.json", sourcesOut); write("entities.json", ents); write("relationships.json", relationships); write("prices.json", pricesOut);
write("benchmarks.json", benchmarks); write("results.json", results); write("availability.json", availability); write("lifecycle.json", lifecycle.map((l) => Object.fromEntries(Object.entries(l).filter(([k]) => k !== "_update"))));
write("announcements.json", announcements); write("timeline.json", timeline); write("battlegrounds.json", battlegrounds); write("feeds.json", r4.feeds ?? []); write("meta.json", meta);
fs.writeFileSync(path.join(IN, "merge.log"), log.join("\n"));
const byAccess = {}; for (const s of sourcesOut) byAccess[s.access] = (byAccess[s.access] ?? 0) + 1;
console.log({ sources: sourcesOut.length, byAccess, entities: ents.length, google: ents.filter((e) => e.providerId === "google").length, models: ents.filter((e) => e.kind === "model").length, relationships: relationships.length, prices: pricesOut.length, benchmarks: benchmarks.length, results: results.length, availability: availability.length, lifecycle: lifecycle.length, announcements: announcements.length, timeline: timeline.length, battlegrounds: battlegrounds.length, logLines: log.length });
