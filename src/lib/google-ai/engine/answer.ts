/**
 * The analyst — answers questions from the knowledge base only.
 *
 * Retrieval is deterministic and time-aware. The answer is assembled from
 * canonical claims, price records, lifecycle events and developments, each
 * with its evidence label and sources. When a Gemini key is configured the
 * API route may ask a model to phrase the answer, but only from the same
 * retrieved records (see /api/google-ai/ask); the model's own knowledge is
 * never a source.
 */
import { addDays, fmtDate } from "../dates";
import { ANNOUNCEMENTS, TIMELINE, ENTITY_BY_ID, LIFECYCLE_BY_ENTITY, PRICES_BY_ENTITY, RESULTS_BY_MODEL, BENCHMARK_BY_ID, providerName, fmtIntro } from "../kb";
import { resolveEntities } from "../ingest/classify";
import type { Claim, Entity, EvidenceLabel } from "../types";
import { existedAt, effectiveOn, nameAt, statusAt } from "./asof";
import { deadlines } from "./brief";
import { neighbors } from "./graph";
import { headline, upcomingChanges } from "./pricing";
import { norm, search } from "./search";

export interface AnswerFact {
  text: string;
  label: EvidenceLabel;
  sourceIds: string[];
  entityId?: string;
}

export interface Answer {
  question: string;
  /** Date the answer describes. */
  asOf: string;
  historical: boolean;
  mode: "retrieval" | "generated";
  /** Short direct answer. */
  summary: string;
  facts: AnswerFact[];
  developments: { id: string; title: string; date: string }[];
  entities: { id: string; name: string }[];
  /** What the knowledge base cannot answer. */
  gaps: string[];
  intents: string[];
}

const MONTHS = ["january", "february", "march", "april", "may", "june", "july", "august", "september", "october", "november", "december"];

/** Pull an "as of" date out of a question. Returns undefined when the question is about now. */
export function detectDate(q: string, today: string): string | undefined {
  const s = q.toLowerCase();
  const iso = s.match(/\b(20\d\d)-(\d\d)(?:-(\d\d))?\b/);
  if (iso) return iso[3] ? `${iso[1]}-${iso[2]}-${iso[3]}` : endOfMonth(Number(iso[1]), Number(iso[2]));
  const my = s.match(new RegExp(`\\b(?:(\\d{1,2})\\s+)?(${MONTHS.join("|")})\\s+(?:(\\d{1,2}),?\\s+)?(20\\d\\d)\\b`));
  if (my) {
    const month = MONTHS.indexOf(my[2]) + 1;
    const day = my[1] ?? my[3];
    return day ? `${my[4]}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}` : endOfMonth(Number(my[4]), month);
  }
  const yr = s.match(/\b(?:in|during|at the end of|end of|as of|back in)\s+(20\d\d)\b/);
  if (yr) return Number(yr[1]) < Number(today.slice(0, 4)) ? `${yr[1]}-12-31` : undefined;
  if (/\b(a|one) year ago\b/.test(s)) return addDays(today, -365);
  if (/\bsix months ago\b/.test(s)) return addDays(today, -182);
  return undefined;
}
function endOfMonth(y: number, m: number): string {
  return new Date(Date.UTC(y, m, 0)).toISOString().slice(0, 10);
}

const INTENTS: [string, RegExp][] = [
  ["price", /\b(pric\w*|cost\w*|how much|cheap\w*|expensive|\$|per million|token rate|tco)\b/i],
  ["compare", /\b(vs\.?|versus|compare\w*|comparison|differ\w*|better than|against)\b/i],
  ["recent", /\b(latest|recent\w*|new|news|changed?|this week|this month|update\w*|announc\w*|happen\w*)\b/i],
  ["when", /\b(when|launch\w*|releas\w*|date|ga\b|generally available|available)\b/i],
  ["deadline", /\b(deprecat\w*|retir\w*|sunset|deadline\w*|end of life|shut\w* down|migrat\w*)\b/i],
  ["name", /\b(formerly|renam\w*|called|new name|old name|same as|what happened to)\b/i],
  ["benchmark", /\b(benchmark\w*|score\w*|leaderboard|swe-?bench|arena|elo|intelligence index|performance)\b/i],
  ["related", /\b(relat\w*|depend\w*|built on|runs on|powers?|part of|fit\w*|stack|architecture|works? with|integrat\w*)\b/i],
];

function claimFacts(e: Entity, keys: (keyof NonNullable<Entity["dossier"]>)[], max: number): AnswerFact[] {
  const out: AnswerFact[] = [];
  for (const k of keys) for (const c of (e.dossier?.[k] ?? []) as Claim[]) if (out.length < max) out.push({ text: c.text, label: c.label, sourceIds: c.sourceIds, entityId: e.id });
  return out;
}

export function answer(question: string, today: string): Answer {
  const asOfDetected = detectDate(question, today);
  const asOf = asOfDetected && asOfDetected < today ? asOfDetected : today;
  const historical = asOf < today;
  const intents = INTENTS.filter(([, re]) => re.test(question)).map(([i]) => i);
  const facts: AnswerFact[] = [];
  const gaps: string[] = [];
  const lines: string[] = [];

  // Entities: exact mentions first, then the best search hits.
  let ids = resolveEntities(question, 4);
  if (!ids.length) ids = search(question, { kinds: ["entity"], limit: 2 }).filter((h) => h.score >= 3).map((h) => h.id);
  const ents = ids.map((id) => ENTITY_BY_ID[id]).filter(Boolean).slice(0, 3);

  for (const e of ents) {
    const name = nameAt(e, asOf);
    if (e.kind !== "provider" && e.introducedAt && !existedAt(e, asOf)) {
      const msg = asOf < e.introducedAt ? `${e.name} had not been introduced on ${fmtDate(asOf)} (first public date in the knowledge base: ${fmtIntro(e)}).` : `${e.name} was retired on ${fmtDate(e.retiredAt)}.`;
      facts.push({ text: msg, label: "verified-fact", sourceIds: e.sourceIds, entityId: e.id });
      lines.push(msg);
      continue;
    }
    const st = statusAt(e, asOf);
    const renamed = name !== e.name ? ` On ${fmtDate(asOf)} it was called ${name}.` : "";
    facts.push({ text: `${e.name} (${providerName(e.providerId)}): ${e.summary}${renamed}`, label: e.verification === "verified" ? "verified-fact" : "provider-claim", sourceIds: e.sourceIds, entityId: e.id });
    const lead = lines.length;
    lines.push(`${name}: ${e.summary}`);
    if (st.evidenced && st.status !== "not-yet") facts.push({ text: `Stage on ${fmtDate(asOf)}: ${STAGE_WORDS[st.status] ?? st.status}${st.since ? ` (since ${fmtDate(st.since)})` : ""}.`, label: "verified-fact", sourceIds: e.sourceIds, entityId: e.id });

    if (intents.includes("name") || e.formerNames?.length) {
      for (const f of e.formerNames ?? []) facts.push({ text: `${e.name} was previously called ${f.name}${f.to ? ` until ${fmtDate(f.to)}` : ""}.`, label: "verified-fact", sourceIds: f.sourceIds, entityId: e.id });
    }

    if (intents.includes("price") || (e.kind === "model" && !intents.length)) {
      const rows = PRICES_BY_ENTITY[e.id] ?? [];
      const surfaces = [...new Set(rows.map((r) => r.surface))];
      let any = false;
      for (const s of surfaces) {
        const h = headline(e.id, asOf, s);
        if (h.input && h.output) {
          any = true;
          const t = `${name} list price on ${fmtDate(asOf)} (${surfaceLabel(s, asOf)}, standard tier): $${h.input.price} input and $${h.output.price} output per 1M tokens${h.input.condition ? ` — ${h.input.condition}` : ""}.`;
          facts.push({ text: t, label: h.input.label, sourceIds: [...new Set([...h.input.sourceIds, ...h.output.sourceIds])], entityId: e.id });
          if (intents.includes("price")) {
            // A price question is answered with the price first; the description stays in the facts below.
            if (lines[lead]?.startsWith(`${name}: `)) lines.splice(lead, 1);
            lines.push(t);
          }
        }
        const seat = rows.find((r) => r.surface === s && r.meter === "seat-month" && r.effectiveFrom <= asOf && (!r.effectiveTo || r.effectiveTo >= asOf));
        if (seat) {
          any = true;
          facts.push({ text: `${name}: $${seat.price} per user per month${seat.condition ? ` (${seat.condition})` : ""}.`, label: seat.label, sourceIds: seat.sourceIds, entityId: e.id });
        }
      }
      if (!historical) {
        for (const u of upcomingChanges(asOf, rows).filter((x) => x.next.meter === "input" || x.next.meter === "output" || x.next.meter === "seat-month").slice(0, 4)) {
          facts.push({ text: `Scheduled: ${name} ${u.next.meter} price becomes $${u.next.price} on ${fmtDate(u.next.effectiveFrom)}${u.current ? ` (now $${u.current.price})` : ""}.`, label: u.next.label, sourceIds: u.next.sourceIds, entityId: e.id });
        }
      }
      if (!any && intents.includes("price")) gaps.push(`No price record for ${name} in effect on ${fmtDate(asOf)}.`);
    }

    // "What changed for X?" when no development in the feed mentions X: fall back to its dated lifecycle records.
    const noFeed = intents.includes("recent") && !ANNOUNCEMENTS.some((a) => a.date <= asOf && a.entityIds.includes(e.id));
    if (noFeed) gaps.push(`No development in the feed mentions ${name}; its dated lifecycle records are shown instead.`);
    if (intents.includes("when") || intents.includes("deadline") || noFeed) {
      const lc = (LIFECYCLE_BY_ENTITY[e.id] ?? []).filter((l) => l.date <= asOf).sort((a, b) => effectiveOn(a).localeCompare(effectiveOn(b)));
      for (const l of lc.slice(-5)) facts.push({ text: `${fmtDate(effectiveOn(l))}: ${l.detail}`, label: l.label, sourceIds: l.sourceIds, entityId: e.id });
      if (!lc.length && e.introducedAt) facts.push({ text: `${e.name} was first introduced on ${fmtIntro(e)}.`, label: "verified-fact", sourceIds: e.sourceIds, entityId: e.id });
    }

    if (intents.includes("benchmark") && e.kind === "model") {
      const rs = (RESULTS_BY_MODEL[e.id] ?? []).filter((r) => r.date <= asOf);
      for (const r of rs.slice(0, 5)) {
        const b = BENCHMARK_BY_ID[r.benchmarkId];
        facts.push({ text: `${b?.name ?? r.benchmarkId}${r.benchmarkVersion ? ` ${r.benchmarkVersion}` : ""}: ${r.score}${b?.unit ? ` ${b.unit}` : ""} (${r.reporter === "independent" ? "independently measured" : "reported by the provider"}, ${fmtDate(r.date)}).`, label: r.reporter === "independent" ? "independent-measurement" : "provider-claim", sourceIds: r.sourceIds, entityId: e.id });
      }
      if (!rs.length) gaps.push(`No benchmark result recorded for ${name}.`);
    }

    if (intents.includes("related") || (!intents.length && e.kind !== "model")) {
      for (const n of neighbors(e.id, asOf).slice(0, 6)) facts.push({ text: `${name} ${n.phrase} ${nameAt(n.other, asOf)}${n.edge.note ? ` — ${n.edge.note}` : ""}.`, label: n.edge.label, sourceIds: n.edge.sourceIds, entityId: e.id });
    }
    if (!intents.length || intents.includes("compare")) facts.push(...claimFacts(e, ["differentiators", "limitations", "howItWorks"], 3));
  }

  // Developments: about the entities, or sharing enough of the question's content words to be on topic.
  const pool = ANNOUNCEMENTS.filter((a) => a.date <= asOf);
  let devs = ents.length ? pool.filter((a) => a.entityIds.some((id) => ids.includes(id))) : [];
  if (!devs.length || intents.includes("recent")) {
    const words = contentWords(question);
    const need = Math.min(2, words.length);
    const scored = pool
      .map((a) => {
        const hay = ` ${norm(a.title + " " + a.summary.map((c) => c.text).join(" "))} `;
        return { a, n: words.filter((w) => hay.includes(` ${w} `) || hay.includes(` ${w}s `)).length };
      })
      .filter((x) => need > 0 && x.n >= need && !devs.includes(x.a))
      .sort((x, y) => y.n - x.n || y.a.date.localeCompare(x.a.date));
    devs = [...devs, ...scored.slice(0, 6).map((x) => x.a)];
  }
  // "What is new?" with no subject: the most recent developments are the answer.
  if (intents.includes("recent") && !ents.length && !devs.length && isGeneralNews(question)) devs = pool.slice(0, 6);
  let windowed = false;
  // "What changed this week / this month?" — answer with the window's developments, weightiest first.
  if (intents.includes("recent") && ents.every((e) => e.kind === "provider")) {
    const days = /\b(today|24 hours|yesterday)\b/i.test(question) ? 1 : /\bweek\b/i.test(question) ? 7 : /\b(quarter|90 days)\b/i.test(question) ? 90 : /\byear\b/i.test(question) ? 365 : 30;
    const from = addDays(asOf, -days);
    const providers = ents.map((e) => e.id);
    const inWin = pool.filter((a) => a.date > from && (!providers.length || providers.includes(a.providerId)));
    const ranked = inWin.slice().sort((a, b) => b.importance - a.importance || b.date.localeCompare(a.date));
    const span = days === 1 ? "24 hours" : `${days} days`;
    lines.length = 0;
    lines.push(ranked.length ? `${inWin.length} ${inWin.length === 1 ? "development" : "developments"} recorded in the ${span} to ${fmtDate(asOf)}. Highest editorial weight: ${ranked.slice(0, 3).map((a) => `${a.title} (${fmtDate(a.date)})`).join("; ")}.` : `No development is recorded in the ${span} to ${fmtDate(asOf)}.`);
    devs = ranked.slice(0, 6);
    facts.length = 0;
    for (const a of devs.slice(0, 5)) {
      const c = a.summary[0];
      if (c) facts.push({ text: `${fmtDate(a.date)} — ${a.title}: ${c.text}`, label: c.label, sourceIds: c.sourceIds });
    }
    // Rivals are tracked as dated timeline events rather than full developments: include those in the window.
    const events = providers.length ? TIMELINE.filter((t) => t.date > from && t.date <= asOf && providers.includes(t.providerId)).sort((a, b) => b.significance - a.significance || b.date.localeCompare(a.date)) : [];
    for (const t of events.slice(0, 5)) facts.push({ text: `${fmtDate(t.date)} — ${t.title}: ${t.detail}`, label: t.label, sourceIds: t.sourceIds });
    if (!ranked.length && events.length) lines.splice(0, lines.length, `${events.length} dated ${events.length === 1 ? "event" : "events"} recorded in the ${span} to ${fmtDate(asOf)}: ${events.slice(0, 3).map((t) => `${t.title} (${fmtDate(t.date)})`).join("; ")}.`);
    windowed = true;
    if (!ranked.length && !events.length) gaps.push(`Nothing is recorded in that window. The knowledge base was last updated on a fixed date; see the freshness line at the top of the page.`);
  } else devs = devs.sort((a, b) => b.date.localeCompare(a.date)).slice(0, 6);
  if (!windowed && (intents.includes("recent") || !ents.length)) {
    for (const a of devs.slice(0, 4)) {
      const c = a.summary[0];
      if (c) facts.push({ text: `${fmtDate(a.date)} — ${a.title}: ${c.text}`, label: c.label, sourceIds: c.sourceIds });
    }
    if (devs[0] && !ents.length) lines.push(`Most relevant development: ${devs[0].title} (${fmtDate(devs[0].date)}).`);
  }

  if (intents.includes("deadline") && !historical) {
    // A question about a family ("which Gemini models…") covers the members of that family.
    const scope = new Set(ids);
    for (const f of ents.filter((e) => e.kind === "model-family")) {
      const family = norm(f.name);
      for (const m of Object.values(ENTITY_BY_ID)) if (m.kind === "model" && m.providerId === f.providerId && (m.parentId === f.id || ` ${norm(m.name)} `.includes(` ${family} `))) scope.add(m.id);
    }
    const dl = deadlines(today)
      .filter((d) => ["deprecated", "retirement-scheduled", "retired"].includes(d.event.type) && (!ents.length || scope.has(d.event.entityId)))
      .slice(0, 8);
    for (const d of dl) facts.push({ text: `${d.name}: ${d.event.detail} Takes effect ${fmtDate(d.on)} (${d.days} ${d.days === 1 ? "day" : "days"} from today).`, label: d.event.label, sourceIds: d.event.sourceIds, entityId: d.event.entityId });
    if (dl.length) lines.push(`${dl.length} scheduled ${dl.length === 1 ? "retirement" : "retirements"} on record: ${dl.slice(0, 4).map((d) => `${d.name} on ${fmtDate(d.on)}`).join("; ")}${dl.length > 4 ? "; and more below" : ""}.`);
    else gaps.push("No upcoming retirement is recorded for this.");
  }

  if (!ents.length && !devs.length) gaps.push("Nothing in the knowledge base matches this question. The analyst does not answer from general model knowledge.");
  if (historical) lines.unshift(`As of ${fmtDate(asOf)}:`);
  const seen = new Set<string>();
  const unique = facts.filter((f) => (seen.has(f.text) ? false : (seen.add(f.text), true))).slice(0, 14);
  return {
    question,
    asOf,
    historical,
    mode: "retrieval",
    summary: lines.slice(0, 4).join(" ") || (gaps[0] ?? ""),
    facts: unique,
    developments: devs.map((a) => ({ id: a.id, title: a.title, date: a.date })),
    entities: ents.map((e) => ({ id: e.id, name: nameAt(e, asOf) })),
    gaps,
    intents,
  };
}

const STAGE_WORDS: Record<string, string> = { ga: "generally available", preview: "preview", experimental: "experimental", announced: "announced, not yet available", research: "research", deprecated: "deprecated", retired: "retired" };

const FILLER = new Set("what whats which when where who whom whose why how does did do is are was were will would can could should the a an of in on at to for from with about and or by as it its this that these those there their they has have had been being be than then now today latest recent recently new news changed change changes update updates happened google gemini model models much many cost costs price prices any all some tell me show give list".split(" "));

/** Words that carry the topic of a question. Brand and question words are dropped: nearly every record contains them. */
export function contentWords(q: string): string[] {
  return [...new Set(norm(q).split(" ").filter((w) => w.length > 2 && !FILLER.has(w)))];
}

function isGeneralNews(q: string): boolean {
  return contentWords(q).length === 0;
}

/**
 * Display name of a price surface. With a date, Google Cloud's platform is named as it was on that date
 * (Vertex AI before the 2026 rename), so as-of views and historical answers never use a later name.
 */
export function surfaceLabel(s: string, asOf?: string): string {
  if (s === "agent-platform" && asOf) {
    const platform = ENTITY_BY_ID["gemini-enterprise-agent-platform"];
    const then = platform ? nameAt(platform, asOf) : undefined;
    if (then && then !== platform.name) return `Google Cloud ${then}`;
  }
  return ({ "gemini-api": "Gemini Developer API", "agent-platform": "Google Cloud Agent Platform", "first-party-api": "provider's own API", "third-party-host": "third-party host", subscription: "subscription", infrastructure: "infrastructure" } as Record<string, string>)[s] ?? s;
}
