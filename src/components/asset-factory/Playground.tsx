"use client";

import { CircleAlert, CircleCheck, LoaderCircle, Play, RotateCcw, TriangleAlert, Zap } from "lucide-react";
import { useMemo, useState } from "react";
import type { RunResult } from "@/lib/asset-factory/run";
import type { AssetDetail } from "@/lib/asset-factory/views";
import { useFactory } from "./state";
import { CodeView } from "./md";

interface EvalCase { id: string; input: unknown; expected?: unknown; grader?: string }

function pretty(text: string): string {
  try { return JSON.stringify(JSON.parse(text), null, 2); } catch { return text; }
}

export default function Playground({ detail }: { detail: AssetDetail }) {
  const { runAsset, view } = useFactory();
  const sample = detail.sampleInput ?? "{}";
  const [input, setInput] = useState(pretty(sample));
  const [running, setRunning] = useState(false);
  const [result, setResult] = useState<RunResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const cases = useMemo<EvalCase[]>(() => {
    const file = detail.files.find((f) => f.path === "evals/cases.jsonl" || f.path === "cases/sample.jsonl");
    if (!file) return [];
    return file.content.split("\n").filter((l) => l.trim()).flatMap((l) => { try { return [JSON.parse(l) as EvalCase]; } catch { return []; } }).slice(0, 6);
  }, [detail]);

  let inputValid = true;
  try { JSON.parse(input); } catch { inputValid = false; }

  const run = async () => {
    setRunning(true);
    setError(null);
    const r = await runAsset(detail.asset.id, input);
    setRunning(false);
    if (r.ok) setResult(r.result);
    else setError(r.reason);
  };

  return (
    <div className="af-play">
      <div className="af-card" style={{ padding: 0, overflow: "hidden" }}>
        <div className="af-file-head">
          <b>Input</b><span className="af-muted af-mono">examples/sample-input.json</span>
          <span className="af-spacer" />
          <button type="button" className="af-btn sm ghost" onClick={() => { setInput(pretty(sample)); setResult(null); }}><RotateCcw size={13} />Sample</button>
        </div>
        {cases.length > 0 && (
          <div className="af-row" style={{ padding: "10px 14px 0", gap: 6 }}>
            <span className="af-muted" style={{ fontSize: 12 }}>Eval cases:</span>
            {cases.map((c) => (
              <button key={c.id} type="button" className="af-chip af-mono" style={{ fontSize: 11.5 }} title={c.grader ? `Graded by ${c.grader}` : undefined}
                onClick={() => { setInput(typeof c.input === "string" ? c.input : JSON.stringify(c.input, null, 2)); setResult(null); }}>{c.id}</button>
            ))}
          </div>
        )}
        <textarea className="af-editor" style={{ minHeight: 360, borderTop: 0 }} value={input} onChange={(e) => setInput(e.target.value)} spellCheck={false} aria-label="Run input (JSON)" />
        <div className="af-commit">
          {!inputValid && <span style={{ color: "var(--bad)", fontSize: 12.5 }}><CircleAlert size={13} /> Input isn&apos;t valid JSON</span>}
          <span className="af-muted" style={{ fontSize: 12 }}>Runs as {view?.actor.person.name} · {detail.resolved ? "resolved SKILL.md" : detail.mainFile}</span>
          <span className="af-spacer" />
          <button type="button" className="af-btn primary" disabled={running || !inputValid} onClick={run}>
            {running ? <LoaderCircle size={14} className="af-spin" /> : <Play size={14} />}{running ? "Running…" : "Run"}
          </button>
        </div>
      </div>

      <div className="af-stack" style={{ gap: 14 }}>
        {error && <div className="af-banner warn"><TriangleAlert size={15} /><div>{error}</div></div>}
        {!result && !error && (
          <div className="af-card af-empty" style={{ textAlign: "left" }}>
            <div className="af-h3" style={{ color: "var(--ink)" }}>Run this {detail.asset.type} on real input</div>
            <p style={{ marginTop: 6 }}>The server resolves the package{detail.resolved ? " (including everything it inherits)" : ""}, uses its instructions as the system prompt, calls Gemini with the output schema, and validates the result. You&apos;ll see each step.</p>
          </div>
        )}
        {result && (
          <>
            <div className="af-card">
              <div className="af-row between" style={{ marginBottom: 10 }}>
                <div className="af-row">
                  {result.mode === "live" ? <span className="af-tag ok"><Zap size={11} />Live · {result.model}</span> : <span className="af-tag warn">Recorded run</span>}
                  {result.validation && (result.validation.valid ? <span className="af-tag ok"><CircleCheck size={11} />Schema valid</span> : <span className="af-tag bad"><CircleAlert size={11} />{result.validation.issues.length} schema issue(s)</span>)}
                </div>
                <span className="af-muted af-num" style={{ fontSize: 12 }}>
                  {result.latencyMs} ms{result.tokens ? ` · ${result.tokens.input.toLocaleString()} in / ${result.tokens.output.toLocaleString()} out tokens` : ""}{result.costUsd ? ` · ~$${result.costUsd.toFixed(3)}/run modeled` : ""}
                </span>
              </div>
              <ol className="af-trace">
                {result.trace.map((t, i) => (
                  <li key={i} data-s={t.status}>
                    <span className="af-trace-dot" />
                    <div><b>{t.label}</b><div className="af-muted" style={{ fontSize: 12.5 }}>{t.detail}</div></div>
                    <span className="af-muted af-num" style={{ fontSize: 11.5 }}>+{t.ms}ms</span>
                  </li>
                ))}
              </ol>
              {result.note && <p className="af-muted" style={{ fontSize: 12, marginTop: 8 }}>{result.note}</p>}
            </div>
            <div className="af-card" style={{ padding: 0, overflow: "hidden" }}>
              <div className="af-file-head"><b>Output</b><span className="af-muted">{result.mode === "live" ? "model response" : "examples/sample-output.json"}</span></div>
              <CodeView code={result.output ? JSON.stringify(result.output, null, 2) : result.outputText || "(no output)"} lang="json" maxHeight={520} />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
