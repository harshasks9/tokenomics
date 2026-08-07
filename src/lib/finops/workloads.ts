// FrontierOps — the customer's AI estate. Thirty synthetic-but-plausible
// workloads for "Meridian Global", a Fortune-500 retail & financial group.
// Volumes and configurations are chosen so every cost figure in the UI is
// computed from token math in engine.ts, never hard-coded.

import type { Cloud } from "./catalog";

export type Sla = "realtime" | "interactive" | "batch";

export interface Capacity {
  type: "paygo" | "committed"; // committed = PTU / GSU / provisioned throughput
  utilization: number; // share of committed capacity actually consumed
}

export interface Workload {
  id: string;
  name: string;
  bu: string;
  useCase: string;
  cloud: Cloud;
  modelId: string;
  region: string;
  reqPerDay: number;
  inTokPerReq: number;
  outTokPerReq: number;
  /** share of input tokens that are cacheable (stable system/context prefix) */
  cacheEligible: number;
  /** achieved cache hit rate on the eligible share, today */
  cacheHitRate: number;
  /** share of traffic currently on batch/deferred pricing */
  batchShare: number;
  /** share of traffic that COULD tolerate batch/deferred */
  batchPotential: number;
  /** minimum quality index this workload's evals require */
  qualityFloor: number;
  sla: Sla;
  capacity: Capacity;
  /** avg share of the model's context window actually used */
  contextUtil: number;
  /** share of requests producing an accepted/successful task outcome */
  successRate: number;
  /** true when prompt audits found trimmable boilerplate context */
  verbosePrompts?: boolean;
}

export const WORKLOADS: Workload[] = [
  { id: "support-copilot", name: "Global Support Copilot", bu: "Customer Support", useCase: "Conversational assistant",
    cloud: "azure", modelId: "gpt-4o", region: "eastus2", reqPerDay: 120_000, inTokPerReq: 2_600, outTokPerReq: 380,
    cacheEligible: 0.7, cacheHitRate: 0.35, batchShare: 0, batchPotential: 0.1, qualityFloor: 74, sla: "interactive",
    capacity: { type: "paygo", utilization: 1 }, contextUtil: 0.21, successRate: 0.87, verbosePrompts: true },
  { id: "code-assistant", name: "Engineering Code Assistant", bu: "Engineering", useCase: "Code generation",
    cloud: "anthropic", modelId: "claude-sonnet-45", region: "us-east-1", reqPerDay: 130_000, inTokPerReq: 5_200, outTokPerReq: 900,
    cacheEligible: 0.85, cacheHitRate: 0.8, batchShare: 0, batchPotential: 0.05, qualityFloor: 87, sla: "interactive",
    capacity: { type: "committed", utilization: 0.85 }, contextUtil: 0.34, successRate: 0.91 },
  { id: "knowledge-rag", name: "Enterprise Knowledge RAG", bu: "Data Platform", useCase: "RAG / grounding",
    cloud: "google", modelId: "gemini-25-pro", region: "us-central1", reqPerDay: 400_000, inTokPerReq: 6_800, outTokPerReq: 420,
    cacheEligible: 0.8, cacheHitRate: 0.6, batchShare: 0, batchPotential: 0.15, qualityFloor: 82, sla: "interactive",
    capacity: { type: "committed", utilization: 0.85 }, contextUtil: 0.18, successRate: 0.89, verbosePrompts: true },
  { id: "contract-intel", name: "Contract Intelligence", bu: "Legal", useCase: "Document analysis",
    cloud: "anthropic", modelId: "claude-opus-45", region: "us-east-1", reqPerDay: 6_000, inTokPerReq: 14_000, outTokPerReq: 1_600,
    cacheEligible: 0.4, cacheHitRate: 0.1, batchShare: 0.1, batchPotential: 0.6, qualityFloor: 88, sla: "interactive",
    capacity: { type: "paygo", utilization: 1 }, contextUtil: 0.42, successRate: 0.94 },
  { id: "content-studio", name: "Marketing Content Studio", bu: "Marketing", useCase: "Content generation",
    cloud: "openai", modelId: "gpt-51", region: "global", reqPerDay: 22_000, inTokPerReq: 1_800, outTokPerReq: 1_400,
    cacheEligible: 0.5, cacheHitRate: 0.2, batchShare: 0, batchPotential: 0.4, qualityFloor: 80, sla: "interactive",
    capacity: { type: "paygo", utilization: 1 }, contextUtil: 0.12, successRate: 0.82 },
  { id: "ticket-triage", name: "Ticket Auto-Triage", bu: "Customer Support", useCase: "Classification",
    cloud: "google", modelId: "gemini-25-flash-lite", region: "us-central1", reqPerDay: 240_000, inTokPerReq: 900, outTokPerReq: 60,
    cacheEligible: 0.6, cacheHitRate: 0.85, batchShare: 0.8, batchPotential: 0.8, qualityFloor: 62, sla: "batch",
    capacity: { type: "paygo", utilization: 1 }, contextUtil: 0.05, successRate: 0.96 },
  { id: "voc-mining", name: "Sentiment & VoC Mining", bu: "Product", useCase: "Classification",
    cloud: "aws", modelId: "nova-lite", region: "us-west-2", reqPerDay: 2_500_000, inTokPerReq: 700, outTokPerReq: 40,
    cacheEligible: 0.5, cacheHitRate: 0.85, batchShare: 0.95, batchPotential: 0.95, qualityFloor: 56, sla: "batch",
    capacity: { type: "paygo", utilization: 1 }, contextUtil: 0.04, successRate: 0.97 },
  { id: "sales-email", name: "Sales Email Assistant", bu: "Sales Ops", useCase: "Content generation",
    cloud: "openai", modelId: "gpt-4o", region: "global", reqPerDay: 30_000, inTokPerReq: 1_200, outTokPerReq: 500,
    cacheEligible: 0.6, cacheHitRate: 0, batchShare: 0, batchPotential: 0.2, qualityFloor: 72, sla: "interactive",
    capacity: { type: "paygo", utilization: 1 }, contextUtil: 0.09, successRate: 0.84 },
  { id: "fin-summarizer", name: "Financial Report Summarizer", bu: "Finance", useCase: "Summarization",
    cloud: "azure", modelId: "o3", region: "eastus2", reqPerDay: 6_000, inTokPerReq: 9_000, outTokPerReq: 1_100,
    cacheEligible: 0.3, cacheHitRate: 0.05, batchShare: 0.6, batchPotential: 0.85, qualityFloor: 84, sla: "batch",
    capacity: { type: "paygo", utilization: 1 }, contextUtil: 0.35, successRate: 0.93 },
  { id: "hr-chatbot", name: "HR Policy Chatbot", bu: "HR", useCase: "Conversational assistant",
    cloud: "azure", modelId: "gpt-5-mini", region: "eastus2", reqPerDay: 45_000, inTokPerReq: 2_000, outTokPerReq: 300,
    cacheEligible: 0.75, cacheHitRate: 0.8, batchShare: 0, batchPotential: 0.05, qualityFloor: 72, sla: "interactive",
    capacity: { type: "paygo", utilization: 1 }, contextUtil: 0.11, successRate: 0.9 },
  { id: "fraud-narratives", name: "Fraud Alert Narratives", bu: "Risk & Compliance", useCase: "Analysis & drafting",
    cloud: "azure", modelId: "gpt-51", region: "eastus2", reqPerDay: 90_000, inTokPerReq: 3_200, outTokPerReq: 260,
    cacheEligible: 0.65, cacheHitRate: 0.4, batchShare: 0, batchPotential: 0.1, qualityFloor: 85, sla: "realtime",
    capacity: { type: "committed", utilization: 0.48 }, contextUtil: 0.16, successRate: 0.95 },
  { id: "docs-generator", name: "Dev Docs Generator", bu: "Engineering", useCase: "Content generation",
    cloud: "anthropic", modelId: "claude-sonnet-45", region: "us-east-1", reqPerDay: 9_000, inTokPerReq: 4_000, outTokPerReq: 1_500,
    cacheEligible: 0.5, cacheHitRate: 0.15, batchShare: 0.1, batchPotential: 0.8, qualityFloor: 78, sla: "batch",
    capacity: { type: "paygo", utilization: 1 }, contextUtil: 0.22, successRate: 0.88 },
  { id: "ivr-summaries", name: "Voice IVR Summaries", bu: "Customer Support", useCase: "Summarization",
    cloud: "google", modelId: "gemini-25-flash", region: "asia-southeast1", reqPerDay: 400_000, inTokPerReq: 1_600, outTokPerReq: 180,
    cacheEligible: 0.55, cacheHitRate: 0.8, batchShare: 0, batchPotential: 0.3, qualityFloor: 70, sla: "realtime",
    capacity: { type: "paygo", utilization: 1 }, contextUtil: 0.07, successRate: 0.92 },
  { id: "claims-extraction", name: "Claims Field Extraction", bu: "Risk & Compliance", useCase: "Extraction",
    cloud: "aws", modelId: "llama-4-maverick", region: "us-east-1", reqPerDay: 70_000, inTokPerReq: 2_800, outTokPerReq: 240,
    cacheEligible: 0.45, cacheHitRate: 0.6, batchShare: 0.6, batchPotential: 0.7, qualityFloor: 70, sla: "batch",
    capacity: { type: "paygo", utilization: 1 }, contextUtil: 0.13, successRate: 0.94 },
  { id: "query-understanding", name: "Search Query Understanding", bu: "Product", useCase: "Classification",
    cloud: "openai", modelId: "gpt-4o-mini", region: "global", reqPerDay: 4_000_000, inTokPerReq: 320, outTokPerReq: 40,
    cacheEligible: 0.7, cacheHitRate: 0.8, batchShare: 0, batchPotential: 0.05, qualityFloor: 60, sla: "realtime",
    capacity: { type: "paygo", utilization: 1 }, contextUtil: 0.02, successRate: 0.95 },
  { id: "compliance-review", name: "Compliance Doc Review", bu: "Risk & Compliance", useCase: "Document analysis",
    cloud: "azure", modelId: "gpt-51", region: "eastus2", reqPerDay: 4_000, inTokPerReq: 22_000, outTokPerReq: 900,
    cacheEligible: 0.9, cacheHitRate: 0.1, batchShare: 0.1, batchPotential: 0.75, qualityFloor: 86, sla: "batch",
    capacity: { type: "paygo", utilization: 1 }, contextUtil: 0.55, successRate: 0.96, verbosePrompts: true },
  { id: "procurement-agent", name: "Agentic Procurement Assistant", bu: "Supply Chain", useCase: "Agentic workflow",
    cloud: "anthropic", modelId: "claude-sonnet-45", region: "us-east-1", reqPerDay: 15_000, inTokPerReq: 38_000, outTokPerReq: 2_600,
    cacheEligible: 0.9, cacheHitRate: 0.65, batchShare: 0, batchPotential: 0.3, qualityFloor: 85, sla: "interactive",
    capacity: { type: "committed", utilization: 0.85 }, contextUtil: 0.62, successRate: 0.81, verbosePrompts: true },
  { id: "catalog-enrichment", name: "Product Catalog Enrichment", bu: "Marketing", useCase: "Content generation",
    cloud: "aws", modelId: "llama-4-maverick", region: "us-west-2", reqPerDay: 450_000, inTokPerReq: 1_500, outTokPerReq: 400,
    cacheEligible: 0.4, cacheHitRate: 0, batchShare: 0.95, batchPotential: 0.95, qualityFloor: 68, sla: "batch",
    capacity: { type: "paygo", utilization: 1 }, contextUtil: 0.08, successRate: 0.9 },
  { id: "meeting-notes", name: "Meeting Notes & Actions", bu: "Workplace", useCase: "Summarization",
    cloud: "google", modelId: "gemini-25-flash", region: "us-central1", reqPerDay: 150_000, inTokPerReq: 5_200, outTokPerReq: 700,
    cacheEligible: 0.3, cacheHitRate: 0.5, batchShare: 0.55, batchPotential: 0.7, qualityFloor: 72, sla: "batch",
    capacity: { type: "paygo", utilization: 1 }, contextUtil: 0.16, successRate: 0.9 },
  { id: "code-review-bot", name: "Code Review Bot", bu: "Engineering", useCase: "Code analysis",
    cloud: "openai", modelId: "o3", region: "global", reqPerDay: 8_000, inTokPerReq: 12_000, outTokPerReq: 700,
    cacheEligible: 0.6, cacheHitRate: 0.2, batchShare: 0.2, batchPotential: 0.6, qualityFloor: 86, sla: "batch",
    capacity: { type: "paygo", utilization: 1 }, contextUtil: 0.4, successRate: 0.92 },
  { id: "regulatory-scanning", name: "Regulatory Horizon Scanning", bu: "Risk & Compliance", useCase: "Research & analysis",
    cloud: "anthropic", modelId: "claude-opus-45", region: "us-east-1", reqPerDay: 1_000, inTokPerReq: 30_000, outTokPerReq: 3_000,
    cacheEligible: 0.5, cacheHitRate: 0.05, batchShare: 0.4, batchPotential: 0.95, qualityFloor: 87, sla: "batch",
    capacity: { type: "paygo", utilization: 1 }, contextUtil: 0.7, successRate: 0.9 },
  { id: "translation-hub", name: "Multilingual Translation Hub", bu: "Operations", useCase: "Translation",
    cloud: "google", modelId: "gemini-25-flash", region: "europe-west1", reqPerDay: 600_000, inTokPerReq: 800, outTokPerReq: 750,
    cacheEligible: 0.2, cacheHitRate: 0.1, batchShare: 0.5, batchPotential: 0.6, qualityFloor: 77, sla: "interactive",
    capacity: { type: "committed", utilization: 0.85 }, contextUtil: 0.04, successRate: 0.95 },
  { id: "onboarding-tutor", name: "Onboarding Tutor", bu: "HR", useCase: "Conversational assistant",
    cloud: "azure", modelId: "gpt-4o", region: "eastus2", reqPerDay: 6_000, inTokPerReq: 2_000, outTokPerReq: 600,
    cacheEligible: 0.7, cacheHitRate: 0, batchShare: 0, batchPotential: 0.1, qualityFloor: 68, sla: "interactive",
    capacity: { type: "paygo", utilization: 1 }, contextUtil: 0.1, successRate: 0.86 },
  { id: "churn-notebooks", name: "Churn Insight Notebooks", bu: "Sales Ops", useCase: "Analysis & drafting",
    cloud: "aws", modelId: "deepseek-v32", region: "us-west-2", reqPerDay: 90_000, inTokPerReq: 4_000, outTokPerReq: 500,
    cacheEligible: 0.5, cacheHitRate: 0.85, batchShare: 0.9, batchPotential: 0.9, qualityFloor: 74, sla: "batch",
    capacity: { type: "paygo", utilization: 1 }, contextUtil: 0.2, successRate: 0.93 },
  { id: "ad-experiments", name: "Ad Copy Experiments", bu: "Marketing", useCase: "Content generation",
    cloud: "openai", modelId: "gpt-5-mini", region: "global", reqPerDay: 400_000, inTokPerReq: 900, outTokPerReq: 700,
    cacheEligible: 0.5, cacheHitRate: 0.85, batchShare: 0.6, batchPotential: 0.6, qualityFloor: 74, sla: "interactive",
    capacity: { type: "paygo", utilization: 1 }, contextUtil: 0.05, successRate: 0.88 },
  { id: "vision-qc", name: "Vision QC Reports", bu: "Supply Chain", useCase: "Multimodal analysis",
    cloud: "google", modelId: "gemini-25-pro", region: "us-central1", reqPerDay: 60_000, inTokPerReq: 5_000, outTokPerReq: 300,
    cacheEligible: 0.35, cacheHitRate: 0.5, batchShare: 0.7, batchPotential: 0.8, qualityFloor: 80, sla: "batch",
    capacity: { type: "paygo", utilization: 1 }, contextUtil: 0.24, successRate: 0.93 },
  { id: "exec-digest", name: "Exec Briefing Digest", bu: "Finance", useCase: "Summarization",
    cloud: "anthropic", modelId: "claude-opus-45", region: "us-east-1", reqPerDay: 400, inTokPerReq: 18_000, outTokPerReq: 2_200,
    cacheEligible: 0.4, cacheHitRate: 0.1, batchShare: 0.5, batchPotential: 0.9, qualityFloor: 90, sla: "batch",
    capacity: { type: "paygo", utilization: 1 }, contextUtil: 0.5, successRate: 0.95 },
  { id: "dq-copilot", name: "Data Quality Rules Copilot", bu: "Data Platform", useCase: "Code generation",
    cloud: "azure", modelId: "gpt-51", region: "eastus2", reqPerDay: 36_000, inTokPerReq: 2_600, outTokPerReq: 800,
    cacheEligible: 0.6, cacheHitRate: 0.35, batchShare: 0, batchPotential: 0.3, qualityFloor: 84, sla: "interactive",
    capacity: { type: "committed", utilization: 0.55 }, contextUtil: 0.14, successRate: 0.9 },
  { id: "store-ops-qa", name: "Store Ops Q&A", bu: "Operations", useCase: "Conversational assistant",
    cloud: "aws", modelId: "deepseek-v32", region: "ap-southeast-1", reqPerDay: 110_000, inTokPerReq: 1_400, outTokPerReq: 220,
    cacheEligible: 0.7, cacheHitRate: 0.75, batchShare: 0, batchPotential: 0.1, qualityFloor: 70, sla: "interactive",
    capacity: { type: "paygo", utilization: 1 }, contextUtil: 0.08, successRate: 0.91 },
  { id: "postmortem-writer", name: "Incident Postmortem Writer", bu: "Engineering", useCase: "Analysis & drafting",
    cloud: "google", modelId: "gemini-3-pro", region: "us-central1", reqPerDay: 3_000, inTokPerReq: 16_000, outTokPerReq: 2_400,
    cacheEligible: 0.5, cacheHitRate: 0.8, batchShare: 0.8, batchPotential: 0.8, qualityFloor: 91, sla: "batch",
    capacity: { type: "paygo", utilization: 1 }, contextUtil: 0.45, successRate: 0.94 },
];

/** Deterministic PRNG so sparklines/daily series are stable across renders. */
export function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function seedFrom(s: string) {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

/** n-point noisy series around a base value with a gentle trend, sums stable. */
export function dailySeries(key: string, base: number, n = 30, vol = 0.13, trend = 0.08): number[] {
  const rnd = mulberry32(seedFrom(key));
  const out: number[] = [];
  for (let i = 0; i < n; i++) {
    const t = i / (n - 1);
    const weekday = 1 - 0.22 * (i % 7 === 5 || i % 7 === 6 ? 1 : 0);
    out.push(base * (1 + trend * (t - 0.5)) * weekday * (1 + (rnd() - 0.5) * 2 * vol));
  }
  return out;
}
