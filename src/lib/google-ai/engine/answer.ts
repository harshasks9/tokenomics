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
import { ANNOUNCEMENTS, ENTITY_BY_ID, LIFECYCLE_BY_ENTITY, PRICES_BY_ENTITY, RESULTS_BY_MODEL, BENCHMARK_BY_ID, providerName } from "../kb";
import { resolveEntities } from "../ingest/classify";
import type { Claim, Entity, EvidenceLabel } from "../types";
import { existedAt, effectiveOn, nameAt, statusAt } from "./asof";
import { deadlines } from "./brief";
import { neighbors } from "./graph";
import { headline, upcomingChanges } from "./pricing";
import { search } from "./search";

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
      const msg = asOf < e.introducedAt ? `${e.name} had not been introduced on ${fmtDate(asOf)} (first public date in the knowledge base: ${fmtDate(e.introducedAt)}).` : `${e.name} was retired on ${fmtDate(e.retiredAt)}.`;
      facts.push({ text: msg, label: "verified-fact", sourceIds: e.sourceIds, entityId: e.id });
      lines.push(msg);
      continue;
    }
    const st = statusAt(e, asOf);
    const renamed = name !== e.name ? ` On ${fmtDate(asOf)} it was called ${name}.` : "";
    facts.push({ text: `${e.name} (${providerName(e.providerId)}): ${e.summary}${renamed}`, label: e.verification === "verified" ? "verified-fact" : "provider-claim", sourceIds: e.sourceIds, entityId: e.id });
    lines.push(`${name}: ${e.summary}`);
    if (st.evidenced && st.status !== "not-yet") facts.push({ text: `Stage on ${fmtDate(asOf)}: ${st.status}${st.since ? ` (since ${fmtDate(st.since)})` : ""}.`, label: "verified-fact", sourceIds: e.sourceIds, entityId: e.id });

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
          const t = `${name} list price on ${fmtDate(asOf)} (${surfaceLabel(s)}, standard tier): $${h.input.price} input and $${h.output.price} output per 1M tokens${h.input.condition ? ` — ${h.input.condition}` : ""}.`;
          facts.push({ text: t, label: h.input.label, sourceIds: [...new Set([...h.input.sourceIds, ...h.output.sourceIds])], entityId: e.id });
          if (intents.includes("price")) lines.push(t);
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

    if (intents.includes("when") || intents.includes("deadline")) {
      const lc = (LIFECYCLE_BY_ENTITY[e.id] ?? []).filter((l) => l.date <= asOf).sort((a, b) => effectiveOn(a).localeCompare(effectiveOn(b)));
      for (const l of lc.slice(-5)) facts.push({ text: `${fmtDate(effectiveOn(l))}: ${l.detail}`, label: l.label, sourceIds: l.sourceIds, entityId: e.id });
      if (!lc.length && e.introducedAt) facts.push({ text: `${e.name} was first introduced on ${fmtDate(e.introducedAt)}.`, label: "verified-fact", sourceIds: e.sourceIds, entityId: e.id });
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

  // Developments: about the entities, or matching the question's words.
  const pool = ANNOUNCEMENTS.filter((a) => a.date <= asOf);
  let devs = ents.length ? pool.filter((a) => a.entityIds.some((id) => ids.includes(id))) : [];
  if (!devs.length || intents.includes("recent")) {
    const hits = search(question, { kinds: ["announcement"], asOf, limit: 6 }).map((h) => h.id);
    const extra = pool.filter((a) => hits.includes(a.id) && !devs.includes(a));
    devs = [...devs, ...extra];
  }
  if (intents.includes("recent") && !ents.length && !devs.length) devs = pool.slice(0, 6);
  devs = devs.sort((a, b) => b.date.localeCompare(a.date)).slice(0, 6);
  if (intents.includes("recent") || !ents.length) {
    for (const a of devs.slice(0, 4)) {
      const c = a.summary[0];
      if (c) facts.push({ text: `${fmtDate(a.date)} — ${a.title}: ${c.text}`, label: c.label, sourceIds: c.sourceIds });
    }
    if (devs[0] && !ents.length) lines.push(`Most relevant development: ${devs[0].title} (${fmtDate(devs[0].date)}).`);
  }

  if (intents.includes("deadline") && !historical) {
    const dl = deadlines(today).filter((d) => !ents.length || ids.includes(d.event.entityId)).slice(0, 5);
    for (const d of dl) facts.push({ text: `${d.name}: ${d.event.detail} Takes effect ${fmtDate(d.on)} (${d.days} days from today).`, label: d.event.label, sourceIds: d.event.sourceIds, entityId: d.event.entityId });
    if (!dl.length) gaps.push("No upcoming deadline is recorded for this.");
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

export function surfaceLabel(s: string): string {
  return ({ "gemini-api": "Gemini Developer API", "agent-platform": "Google Cloud Agent Platform", "first-party-api": "provider's own API", "third-party-host": "third-party host", subscription: "subscription", infrastructure: "infrastructure" } as Record<string, string>)[s] ?? s;
}
