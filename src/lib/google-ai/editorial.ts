/**
 * Editorial layer — content written by this site's editors rather than taken
 * from a source: example workloads, the agent request path, enterprise
 * workload guidance. Everything here is analyst interpretation and is
 * labelled that way wherever it is shown. Product references are canonical
 * entity ids; an id that is not in the knowledge base is simply not rendered.
 */
import type { WorkloadScenario } from "./types";

/** Example workloads for the pricing calculator. The numbers are illustrative assumptions, not measurements. */
export const SCENARIOS: (WorkloadScenario & { needs: ("text" | "image" | "audio" | "video" | "pdf")[] })[] = [
  { id: "support-assistant", name: "Customer-support assistant", description: "Chat assistant answering from a help centre. Long, stable system prompt and retrieved passages; short answers.", requestsPerMonth: 1_000_000, inputTokens: 6_000, outputTokens: 350, cachedShare: 0.6, batchShare: 0, thinkingRatio: 0, attemptsPerTask: 1, needs: ["text"] },
  { id: "enterprise-search", name: "Enterprise search with grounding", description: "Employees ask questions over company documents. Large retrieved context, cited answer.", requestsPerMonth: 300_000, inputTokens: 20_000, outputTokens: 700, cachedShare: 0.2, batchShare: 0, thinkingRatio: 0.5, attemptsPerTask: 1, needs: ["text", "pdf"] },
  { id: "coding-agent", name: "Coding agent", description: "An agent that reads a repository, plans, edits and runs tests. Many model calls per finished task, heavy reasoning.", requestsPerMonth: 20_000, inputTokens: 60_000, outputTokens: 4_000, cachedShare: 0.7, batchShare: 0, thinkingRatio: 2, attemptsPerTask: 25, needs: ["text"] },
  { id: "document-pipeline", name: "Document processing pipeline", description: "Overnight extraction from invoices, contracts and forms into structured data. Not time-sensitive.", requestsPerMonth: 2_000_000, inputTokens: 8_000, outputTokens: 600, cachedShare: 0.1, batchShare: 1, thinkingRatio: 0, attemptsPerTask: 1.05, needs: ["text", "pdf", "image"] },
  { id: "voice-agent", name: "Voice agent (text-token view)", description: "Contact-centre voice agent, costed on the text tokens of each turn. Audio is metered separately and is not included here.", requestsPerMonth: 4_000_000, inputTokens: 3_000, outputTokens: 150, cachedShare: 0.5, batchShare: 0, thinkingRatio: 0, attemptsPerTask: 1, needs: ["text", "audio"] },
];

export interface FlowStep {
  id: string;
  name: string;
  job: string;
  question: string;
  entityIds: string[];
}

/** The path of one agent request. Filled in below once component ids are known. */
export const AGENT_FLOW: FlowStep[] = [];

export interface ReviewFinding {
  severity: "blocker" | "major" | "minor";
  finding: string;
  resolution: string;
  status: "fixed" | "accepted-limitation" | "open";
}
export interface ReviewerReport {
  role: string;
  lens: string;
  verdict: string;
  findings: ReviewFinding[];
}

/** Independent review, written after the build by five reviewer roles. Filled in below. */
export const REVIEW: ReviewerReport[] = [];

/** What this product does not do, or does not do yet. */
export const LIMITATIONS: { area: string; text: string }[] = [];
