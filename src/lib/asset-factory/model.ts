/**
 * Modeled evaluations, readiness and economics for a workspace.
 * Deterministic and synthetic — the UI labels every figure as modeled.
 */
import { ECON, SCER_BLUEPRINT } from "./data";
import type { Asset, Contribution, Workspace } from "./types";

export interface EvalResult {
  id: string;
  label: string;
  score: number;
  threshold: number;
  unit: "%";
  /** true when lower is better (e.g. unsafe action rate). */
  lowerIsBetter?: boolean;
  pass: boolean;
  drivers: string[];
}

export interface ReadinessCheck {
  id: string;
  label: string;
  pass: boolean;
  detail: string;
}

export interface Economics {
  executionsPerMonth: number;
  costPerExecution: number;
  consumptionPerMonth: number;
  hoursSavedPerMonth: number;
  valuePerMonth: number;
  roi: number;
  minutesSavedPerExecution: number;
}

export function workspaceAssetIds(ws: Workspace): string[] {
  return [ws.blueprintId, ...ws.componentIds].filter((x): x is string => Boolean(x));
}

export function evaluate(ws: Workspace, assetsById: Map<string, Asset>): EvalResult[] {
  if (!ws.blueprintId) return [];
  const has = (id: string) => ws.componentIds.includes(id) || ws.blueprintId === id;
  const hasType = (pred: (a: Asset) => boolean) => workspaceAssetIds(ws).some((id) => {
    const a = assetsById.get(id);
    return a ? pred(a) : false;
  });
  const hitl = hasType((a) => a.id === "a-hitl");

  if (ws.blueprintId !== SCER_BLUEPRINT) {
    // Other blueprints: generic, already-tuned results for seeded engagements.
    return [
      { id: "task", label: "Task success", score: 91, threshold: 85, unit: "%", pass: true, drivers: ["Blueprint baseline"] },
      { id: "unsafe", label: "Unsafe action rate", score: hitl ? 0.3 : 2.4, threshold: 0.5, unit: "%", lowerIsBetter: true, pass: hitl, drivers: [hitl ? "Human-in-the-loop routing" : "No approval workflow"] },
    ];
  }

  const drivers = (pairs: [boolean, string][]) => pairs.filter(([on]) => on).map(([, s]) => s);
  const cls = 88 + (has("a-exception-classify") ? 4 : 0) + (has("a-sap-template") ? 2 : 0);
  const rc = 77 + (has("a-root-cause") ? 6 : 0) + (has("a-sap-template") ? 4 : 0) + (hasType((a) => a.provides?.includes("erp") ?? false) ? 2 : 0);
  const res = 72 + (has("a-root-cause") ? 3 : 0) + (has("a-supplier-risk") ? 8 : 0) + (has("a-tier2-signals") ? 4 : 0) + (has("a-expedite") ? 2 : 0) + (ws.configured ? 2 : 0);
  const unsafe = hitl ? Math.round((0.15 + ws.config.autoResolveLimit / 10000) * 100) / 100 : 3.1;
  const routing = hitl ? (has("a-chat") || ws.config.approvalChannel !== "Google Chat" ? 98 : 96) : 61;

  return [
    { id: "classification", label: "Exception classification accuracy", score: cls, threshold: 92, unit: "%", pass: cls >= 92,
      drivers: drivers([[true, "Blueprint baseline 88%"], [has("a-exception-classify"), "+4 Exception Classification skill"], [has("a-sap-template"), "+2 SAP MRP code mapping"]]) },
    { id: "root-cause", label: "Root-cause correctness", score: rc, threshold: 85, unit: "%", pass: rc >= 85,
      drivers: drivers([[true, "Blueprint baseline 77%"], [has("a-root-cause"), "+6 ERP Root-Cause Reasoning"], [has("a-sap-template"), "+4 SAP Exception Integration Template"], [hasType((a) => a.provides?.includes("erp") ?? false), "+2 live ERP connector"]]) },
    { id: "resolution", label: "Resolution accepted by planners", score: res, threshold: 85, unit: "%", pass: res >= 85,
      drivers: drivers([[true, "Blueprint baseline 72%"], [has("a-root-cause"), "+3 cited root cause"], [has("a-supplier-risk"), "+8 Supplier Risk Scoring"], [has("a-tier2-signals"), "+4 Tier-2 disruption signals"], [has("a-expedite"), "+2 expedite negotiation"], [ws.configured, "+2 plant-specific thresholds"]]) },
    { id: "unsafe", label: "Unsafe autonomous action rate", score: unsafe, threshold: 0.5, unit: "%", lowerIsBetter: true, pass: unsafe <= 0.5,
      drivers: hitl ? [`Auto-resolve limit $${ws.config.autoResolveLimit.toLocaleString("en-US")} — higher limits mean more unattended actions`] : ["No approval workflow — every action is autonomous"] },
    { id: "routing", label: "Approval routed to the right owner", score: routing, threshold: 95, unit: "%", pass: routing >= 95,
      drivers: hitl ? ["Human-in-the-Loop Approval Routing"] : ["No approval workflow"] },
  ];
}

export function evalsPass(ws: Workspace, assetsById: Map<string, Asset>): boolean {
  const r = evaluate(ws, assetsById);
  return r.length > 0 && r.every((e) => e.pass);
}

export function readiness(ws: Workspace, assetsById: Map<string, Asset>): ReadinessCheck[] {
  const assets = workspaceAssetIds(ws).map((id) => assetsById.get(id)).filter((a): a is Asset => Boolean(a));
  const blueprint = ws.blueprintId ? assetsById.get(ws.blueprintId) : undefined;
  const provided = new Set(assets.flatMap((a) => a.provides ?? []));
  const required = [...new Set(assets.flatMap((a) => a.requires ?? []))];
  const missing = required.filter((r) => !provided.has(r));
  const evals = evaluate(ws, assetsById);
  const failing = evals.filter((e) => !e.pass);
  return [
    { id: "blueprint", label: "Reference blueprint selected", pass: Boolean(blueprint), detail: blueprint ? blueprint.name : "Choose a blueprint to start from" },
    { id: "deps", label: "Every required system is connected", pass: Boolean(blueprint) && missing.length === 0, detail: missing.length ? `Missing: ${missing.join(", ")}` : `${provided.size} system capabilities wired` },
    { id: "hitl", label: "Human approval for high-value actions", pass: ws.componentIds.includes("a-hitl"), detail: ws.componentIds.includes("a-hitl") ? `Above $${ws.config.autoResolveLimit.toLocaleString("en-US")} goes to ${ws.config.approvalChannel}` : "Add an approval workflow" },
    { id: "config", label: "Plant thresholds and acceptance criteria agreed", pass: ws.configured, detail: ws.configured ? `${ws.config.plants} plant(s), ${ws.config.exceptionsPerMonth.toLocaleString("en-US")} exceptions/month` : "Customize the workflow" },
    { id: "secrets", label: "No credentials in the agent package", pass: true, detail: "Connectors reference Secret Manager; nothing embedded" },
    { id: "evals", label: "Evaluation suite meets acceptance thresholds", pass: evals.length > 0 && failing.length === 0, detail: evals.length === 0 ? "Runs once a blueprint is selected" : failing.length ? `${failing.length} below threshold: ${failing.map((f) => f.label).join(", ")}` : `${evals.length}/${evals.length} passing` },
  ];
}

export function isReady(ws: Workspace, assetsById: Map<string, Asset>): boolean {
  return readiness(ws, assetsById).every((c) => c.pass);
}

export function economics(ws: Workspace, assetsById: Map<string, Asset>): Economics {
  const assets = workspaceAssetIds(ws).map((id) => assetsById.get(id)).filter((a): a is Asset => Boolean(a));
  const costPerExecution = assets.reduce((s, a) => s + a.costPer1k, 0) / 1000;
  const minutes = assets.reduce((s, a) => s + a.minutesSaved, 0);
  const execs = ws.config.exceptionsPerMonth;
  const monitoring = ws.config.plants * 30 * ECON.monitoringPerPlantPerDay * (ws.blueprintId ? 1 : 0.3);
  const consumption = execs * costPerExecution + monitoring;
  const hours = (execs * minutes) / 60;
  const expedite = ws.blueprintId === SCER_BLUEPRINT ? execs * ECON.expediteAvoidedPerException : 0;
  const value = hours * ECON.loadedHourlyRate + expedite;
  return {
    executionsPerMonth: execs,
    costPerExecution,
    consumptionPerMonth: consumption,
    hoursSavedPerMonth: hours,
    valuePerMonth: value,
    roi: consumption > 0 ? value / consumption : 0,
    minutesSavedPerExecution: minutes,
  };
}

/**
 * Shared lifecycle stage (0..7):
 * Discover → Assemble → Configure → Execute → Activate → Run → Expand → Contribute.
 */
export function stageOf(ws: Workspace, contributions: Contribution[]): number {
  const contributed = contributions.some((c) => c.workspaceId === ws.id && c.status === "published");
  if (contributed) return 7;
  if (contributions.some((c) => c.workspaceId === ws.id)) return 6;
  if (ws.activated) return 5;
  if (ws.sprint.day > 0) return 3;
  if (ws.configured) return 2;
  if (ws.blueprintId || ws.componentIds.length) return 1;
  return 0;
}
