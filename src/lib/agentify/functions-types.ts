/**
 * Types for functional collections (FP&A, DevOps, SecOps, RevOps) and the
 * "Agent in a Day" before/after walkthrough. Type-only — safe to import anywhere.
 */
import type { UseCaseMeta } from "./types";

export type FunctionId = "fpa" | "devops" | "secops" | "revops";
export type Surface = "Gmail" | "Calendar" | "Chat" | "Docs" | "Sheets" | "Meet" | "Drive";

export interface FunctionCollection {
  id: FunctionId;
  name: string; // "FP&A"
  tagline: string; // one line, outcome-first
  personas: string[]; // roles it serves
  outcomes: { label: string; value: string }[]; // 3 plain-language outcomes (modeled)
  useCaseIds: string[]; // 4 ids, first = hero
  heroUseCaseId: string;
  trust: string[]; // 2–4 trust/governance points (approvals, data stays in Workspace…)
}

/** A rendered mock of a Workspace surface for one moment of the day. */
export type Frame =
  | { type: "email"; from: string; to: string; subject: string; body: string[]; status: "draft" | "awaiting-approval" | "sent-after-approval" | "received" }
  | { type: "chat"; space: string; messages: { author: string; agent?: boolean; text: string }[] }
  | { type: "doc"; title: string; lines: { text: string; suggestion?: boolean; comment?: string }[] }
  | { type: "sheet"; title: string; columns: string[]; rows: (string | number)[][]; highlightRows?: number[] }
  | { type: "calendar"; day: string; events: { time: string; title: string; agent?: boolean }[] }
  | { type: "meet"; title: string; notes: string[] };

export interface DayMoment {
  time: string; // "07:30"
  surface: Surface;
  useCaseId: string;
  kind: "overnight" | "agent" | "approval" | "handoff";
  title: string; // short, e.g. "Variance explainer drafted overnight"
  agent: string; // what the agent did (1–2 sentences)
  human: string; // what the person did (approve / edit / skip), 1 sentence
  approval?: string; // what exactly was approved, if anything
  frame: Frame;
  minutesSaved: number;
  entitlementUsd: number; // cost of the agent work in this moment
}

export interface ManualBlock {
  start: string; // "08:00"
  end: string; // "09:15"
  task: string;
  surface: Surface;
  pain: string; // why it hurts (one line)
}

export interface PersonaDay {
  functionId: FunctionId;
  persona: { name: string; role: string; company: string; initials: string };
  headline: string; // e.g. "Close week, without the chase"
  scenario: string; // 1–2 sentences: what kind of day this is
  before: {
    summary: string;
    blocks: ManualBlock[]; // 7–10 blocks covering ~07:30–18:30
    stats: { hoursOnBusywork: number; contextSwitches: number; slipped: number; endOfDay: string };
  };
  after: {
    summary: string;
    moments: DayMoment[]; // 7–9 moments covering ~06:00–18:00, ≥1 overnight, ≥2 approvals
    stats: { hoursReturned: number; approvals: number; tasksCompleted: number; entitlementUsed: number; endOfDay: string };
  };
}

export type { UseCaseMeta };
