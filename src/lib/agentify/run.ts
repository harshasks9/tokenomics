/**
 * Server-only: "Try it" for a Workspace use-case package (forked from the
 * Asset Factory runner). Live with Gemini when GEMINI_API_KEY is configured;
 * otherwise the package's recorded examples/sample-output.json, labeled.
 */
import { GoogleGenAI } from "@google/genai";
import { ALL_FILES as USECASE_FILES, ALL_USECASES as USECASES } from "./catalog";

export const RUN_MODEL = process.env.AGENTIFY_GEMINI_MODEL ?? process.env.BRIEF_GEMINI_MODEL ?? "gemini-3.5-flash";
const MAX_INPUT = 6000;

export interface TraceStep { label: string; detail: string; ms: number; status: "ok" | "warn" | "fail" }
export interface RunResult {
  mode: "live" | "recorded"; model: string; output: unknown; outputText: string; trace: TraceStep[];
  latencyMs: number; validation: { valid: boolean; issues: string[] } | null; note?: string;
}

const file = (id: string, path: string) => USECASE_FILES[id]?.find((f) => f.path === path)?.content;

function parseJson(text: string): unknown {
  const t = text.trim().replace(/^```(?:json)?\s*/i, "").replace(/```\s*$/, "");
  try { return JSON.parse(t); } catch {
    const m = /\{[\s\S]*\}/.exec(t);
    if (m) { try { return JSON.parse(m[0]); } catch { /* ignore */ } }
    return null;
  }
}

export function validate(output: unknown, schemaText?: string): { valid: boolean; issues: string[] } | null {
  if (!schemaText) return null;
  let schema: { required?: string[]; properties?: Record<string, { type?: string | string[]; enum?: unknown[] }> };
  try { schema = JSON.parse(schemaText); } catch { return null; }
  if (!output || typeof output !== "object" || Array.isArray(output)) return { valid: false, issues: ["Output is not a JSON object"] };
  const o = output as Record<string, unknown>;
  const issues: string[] = [];
  for (const k of schema.required ?? []) if (!(k in o)) issues.push(`missing “${k}”`);
  for (const [k, p] of Object.entries(schema.properties ?? {})) {
    if (!(k in o) || o[k] === null) continue;
    const v = o[k];
    const types = Array.isArray(p.type) ? p.type : p.type ? [p.type] : [];
    const actual = Array.isArray(v) ? "array" : typeof v === "number" ? (Number.isInteger(v) ? "integer" : "number") : typeof v;
    if (types.length && !types.some((t) => t === actual || (t === "number" && actual === "integer"))) issues.push(`“${k}” should be ${types.join("|")}`);
    if (p.enum && !p.enum.includes(v)) issues.push(`“${k}” not in enum`);
  }
  return { valid: !issues.length, issues };
}

function responseSchema(text?: string): Record<string, unknown> | undefined {
  if (!text) return undefined;
  try {
    const strip = (n: unknown): unknown => Array.isArray(n) ? n.map(strip) : n && typeof n === "object"
      ? Object.fromEntries(Object.entries(n).filter(([k]) => !["$schema", "$id", "$comment", "examples", "default", "additionalProperties", "title"].includes(k)).map(([k, v]) => [k, strip(v)]))
      : n;
    return strip(JSON.parse(text)) as Record<string, unknown>;
  } catch { return undefined; }
}

const buckets = new Map<string, { n: number; reset: number }>();
export function rateLimited(key: string, limit = 12): boolean {
  const now = Date.now();
  const b = buckets.get(key);
  if (!b || b.reset < now) { buckets.set(key, { n: 1, reset: now + 60_000 }); return false; }
  b.n += 1;
  return b.n > limit;
}

export async function runUseCase(idOrSlug: string, rawInput: string): Promise<RunResult | null> {
  const uc = USECASES.find((u) => u.id === idOrSlug || u.slug === idOrSlug);
  if (!uc) return null;
  const t0 = Date.now();
  const trace: TraceStep[] = [];
  const step = (label: string, detail: string, status: TraceStep["status"] = "ok") => trace.push({ label, detail, ms: Date.now() - t0, status });
  const skill = file(uc.id, "SKILL.md") ?? "";
  const schemaText = file(uc.id, "schema/output.json");
  step("Load package", `${uc.slug}@${uc.version} · SKILL.md (${skill.split("\n").length} lines)${schemaText ? " · schema/output.json" : ""}`);
  step("Surfaces", `${uc.surfaces.join(", ")} — long-running; actions that send or book wait for approval`);
  const input = String(rawInput ?? "").slice(0, MAX_INPUT);
  const key = process.env.GEMINI_API_KEY ?? process.env.GOOGLE_API_KEY;
  if (key && skill) {
    try {
      const client = new GoogleGenAI({ apiKey: key });
      const schema = responseSchema(schemaText);
      const started = Date.now();
      const res = (await client.interactions.create({
        model: RUN_MODEL,
        system_instruction: `${skill}\n\n---\nYou are executing this Workspace agent in a sandbox. Do not send, book or share anything — produce the plan, drafts and approval requests as JSON only${schemaText ? ", matching the output schema" : ""}. Use only facts in the input.`,
        input: input || "{}",
        response_format: schema ? { type: "text", mime_type: "application/json", schema } : { type: "text", mime_type: "application/json" },
        store: false,
      } as Parameters<typeof client.interactions.create>[0])) as { output_text?: string };
      const text = res.output_text ?? "";
      step(`Call ${RUN_MODEL}`, `${Date.now() - started} ms · live`, text ? "ok" : "warn");
      const output = parseJson(text);
      const validation = validate(output, schemaText);
      if (validation) step("Validate output", validation.valid ? "Matches schema/output.json" : validation.issues.join("; "), validation.valid ? "ok" : "warn");
      return { mode: "live", model: RUN_MODEL, output, outputText: text, trace, latencyMs: Date.now() - t0, validation };
    } catch (e) {
      step(`Call ${RUN_MODEL}`, `Live call failed (${e instanceof Error ? e.message.slice(0, 120) : "error"}) — showing the recorded run`, "warn");
    }
  } else {
    step("Model", "Live runs need GEMINI_API_KEY on this deployment — showing the package's recorded run", "warn");
  }
  const recorded = file(uc.id, "examples/sample-output.json") ?? "";
  const output = parseJson(recorded);
  const validation = validate(output, schemaText);
  if (validation) step("Validate output", validation.valid ? "Recorded output matches schema/output.json" : validation.issues.join("; "), validation.valid ? "ok" : "warn");
  return { mode: "recorded", model: RUN_MODEL, output, outputText: recorded, trace, latencyMs: Date.now() - t0, validation, note: "Recorded run from examples/sample-output.json — it answers the package's sample input." };
}
