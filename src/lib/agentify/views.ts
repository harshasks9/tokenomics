/**
 * Server-side projection per persona. Customers get their own account and
 * the use-case library — never targeting scores, internal notes or the plan.
 * Partners get their book and the kit — never revenue or accountability.
 */
import { ALL_FILES as USECASE_FILES, ALL_USECASES, FUNCTION_OF } from "./catalog";
import { DAYS, FUNCTIONS } from "./functions";
import type { FunctionCollection, FunctionId, PersonaDay } from "./functions-types";
import { EDITIONS, PARTNERS, PERSONA, PERSONA_SHIFT, PROGRAM, SUB_REGIONS } from "./data";
import { canSee, PARTNER_CREDIT_CAP } from "./engine";
import { earnedStage, PLAY_LABEL, qualify, STAGES, stats, type Play, type UsageStats } from "./model";
import { COPY, EXECUTION, PRINCIPLES, QUALIFY, RACI, SHORTLIST, SQUAD, THESIS } from "./plan";
import { parseSkill } from "./skillmd";
import type { Edition, PersonaId, Stage, World } from "./types";

export interface UseCaseView {
  id: string; slug: string; ref: string; title: string; owner: string; ownerKind: "google" | "partner"; version: string;
  summary: string; surfaces: string[]; costPerRun: number; runsPerWeek: number; monthlyPerUser: number; approval: string;
  files: string[];
  functionId: FunctionId | null;
}

export interface AccountView {
  id: string; name: string; industry: string; subRegion: string; edition: Edition; seats: number;
  geminiBeta: boolean; sovereign: boolean; stage: Stage; workshopWeek: number | null;
  partner: { id: string; name: string; lead: string } | null;
  usage: UsageStats;
  useCases: { id: string; title: string; share: number }[];
  enabled: string[];
  credits: number; newUsers: number;
  /** Internal targeting — omitted for the customer persona. */
  internal?: { notes: string; score: number; play: Play; playLabel: string; next: string; reasons: string[]; headroomUsers: number; earned: Stage };
}

export interface View {
  persona: PersonaId;
  person: { name: string; title: string; org: string; initials: string };
  seq: number;
  editions: Edition[];
  useCases: UseCaseView[];
  accounts: AccountView[];
  stages: typeof STAGES;
  workshop: typeof EXECUTION.workshop;
  credits: { pool: number; used: number; remaining: number; months: number; partnerCap: number } | null;
  partners: { id: string; name: string; subRegion: string; lead: string; accounts: number }[];
  log: { seq: number; text: string; actor: PersonaId }[];
  /** Customer-facing: functional collections and the before/after day per function persona. */
  functions: FunctionCollection[];
  days: PersonaDay[];
  /** Before/after of this persona's own motion (partner and Google views). */
  shift: { title: string; before: string[]; after: string[] } | null;
  /** Google only. */
  plan?: {
    thesis: typeof THESIS; principles: typeof PRINCIPLES; shortlist: typeof SHORTLIST; execution: typeof EXECUTION;
    raci: typeof RACI; squad: typeof SQUAD; qualify: typeof QUALIFY; subRegions: string[]; program: typeof PROGRAM; copy: typeof COPY;
  };
}

export function listUseCases(): UseCaseView[] {
  return ALL_USECASES.map((u) => {
    const files = USECASE_FILES[u.id] ?? [];
    const fm = parseSkill(files.find((f) => f.path === "SKILL.md")?.content ?? "").frontmatter;
    const costPerRun = Number(fm.entitlement_cost_per_run_usd ?? 0) || 0;
    const runsPerWeek = Number(fm.typical_runs_per_user_per_week ?? 0) || 0;
    return {
      id: u.id, slug: u.slug, ref: `${u.slug}@${u.version}`, title: u.title, owner: u.owner, ownerKind: u.ownerKind, version: u.version,
      summary: u.summary, surfaces: u.surfaces, costPerRun, runsPerWeek, monthlyPerUser: Math.round(costPerRun * runsPerWeek * 4.3 * 100) / 100,
      approval: String(fm.approval ?? ""), files: files.map((f) => f.path), functionId: FUNCTION_OF.get(u.id) ?? null,
    };
  });
}

export function buildView(w: World, persona: PersonaId): View {
  const ucTitle = new Map(ALL_USECASES.map((u) => [u.id, u.title]));
  const accounts: AccountView[] = w.accounts.filter((a) => canSee(persona, a)).map((a) => {
    const s = stats(a);
    const q = qualify(a, s);
    const p = PARTNERS.find((x) => x.id === a.partnerId);
    const v: AccountView = {
      id: a.id, name: a.name, industry: a.industry, subRegion: a.subRegion, edition: EDITIONS[a.edition], seats: a.seats,
      geminiBeta: a.geminiBeta, sovereign: a.sovereign, stage: a.stage, workshopWeek: a.workshopWeek ?? null,
      partner: p ? { id: p.id, name: p.name, lead: p.lead } : null,
      usage: s,
      useCases: Object.entries(a.useCases).map(([id, share]) => ({ id, title: ucTitle.get(id) ?? id, share })),
      enabled: a.enabled, credits: a.credits, newUsers: a.newUsers,
    };
    if (persona !== "customer") {
      v.internal = { notes: a.notes, score: q.score, play: q.play, playLabel: PLAY_LABEL[q.play].label, next: PLAY_LABEL[q.play].next, reasons: q.reasons, headroomUsers: q.headroomUsers, earned: earnedStage(a, s) };
    }
    return v;
  });

  const visibleIds = new Set(accounts.map((a) => a.id));
  const view: View = {
    persona,
    person: PERSONA[persona],
    seq: w.seq,
    editions: Object.values(EDITIONS),
    useCases: listUseCases(),
    accounts,
    stages: STAGES,
    workshop: EXECUTION.workshop,
    credits: persona === "customer" ? null : { pool: PROGRAM.pocCreditPool, used: w.creditsUsed, remaining: PROGRAM.pocCreditPool - w.creditsUsed, months: PROGRAM.pocMonths, partnerCap: PARTNER_CREDIT_CAP },
    partners: (persona === "google" ? PARTNERS : PARTNERS.filter((p) => accounts.some((a) => a.partner?.id === p.id)))
      .map((p) => ({ id: p.id, name: p.name, subRegion: p.subRegion, lead: p.lead, accounts: w.accounts.filter((a) => a.partnerId === p.id).length })),
    functions: FUNCTIONS,
    days: DAYS,
    shift: persona === "customer" ? null : PERSONA_SHIFT[persona],
    log: w.log.filter((l) => !l.accountId || visibleIds.has(l.accountId)).slice(-40).reverse().map((l) => ({ seq: l.seq, text: l.text, actor: l.actor })),
  };
  if (persona === "google") {
    view.plan = { thesis: THESIS, principles: PRINCIPLES, shortlist: SHORTLIST, execution: EXECUTION, raci: RACI, squad: SQUAD, qualify: QUALIFY, subRegions: SUB_REGIONS, program: PROGRAM, copy: COPY };
  }
  return view;
}

export interface UseCaseDetail { useCase: UseCaseView; files: { path: string; content: string }[]; install: string }

export function getUseCaseDetail(slugOrId: string): UseCaseDetail | null {
  const uc = listUseCases().find((u) => u.id === slugOrId || u.slug === slugOrId);
  if (!uc) return null;
  return { useCase: uc, files: (USECASE_FILES[uc.id] ?? []).map((f) => ({ ...f })), install: `g10 workspace agents add ${uc.ref}` };
}
