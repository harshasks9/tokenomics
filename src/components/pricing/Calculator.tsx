"use client";

import { useMemo, useState } from "react";
import { Bot, Brain, Code2, FileText, Image as ImageIcon, Layers, MessageSquare } from "lucide-react";
import type { Model, WorkloadInput } from "@/lib/pricing/types";
import { WORKLOAD_PRESETS, providerById, providerColor } from "@/lib/pricing/presets";
import { estimateCost, fmtTokens, fmtUsd } from "@/lib/pricing/calc";
import { useTip } from "./Tooltip";

const ICONS: Record<string, React.ComponentType<{ size?: number }>> = {
  MessageSquare,
  Code2,
  FileText,
  Bot,
  Image: ImageIcon,
  Brain,
  Layers,
};

const REQ_STEPS = [1_000, 10_000, 100_000, 1_000_000, 3_000_000, 10_000_000, 20_000_000, 50_000_000];

function Slider({
  label,
  value,
  display,
  min,
  max,
  step,
  onChange,
  hint,
}: {
  label: string;
  value: number;
  display: string;
  min: number;
  max: number;
  step: number;
  onChange: (v: number) => void;
  hint?: string;
}) {
  return (
    <div className="px-ctrl">
      <label>
        <span>{label}</span>
        <output>{display}</output>
      </label>
      <input type="range" min={min} max={max} step={step} value={value} onChange={(e) => onChange(Number(e.target.value))} />
      {hint && <div className="hint">{hint}</div>}
    </div>
  );
}

export default function Calculator({
  models,
  workload,
  onWorkload,
  presetId,
  onPreset,
}: {
  models: Model[];
  workload: WorkloadInput;
  onWorkload: (w: WorkloadInput) => void;
  presetId: string | null;
  onPreset: (id: string) => void;
}) {
  const tip = useTip();
  const [baseline, setBaseline] = useState<string | null>(null);

  const rows = useMemo(() => {
    const r = models.map((m) => ({ m, c: estimateCost(m, workload) }));
    const priced = r.filter((x) => x.c.complete).sort((a, b) => a.c.monthly - b.c.monthly);
    const unpriced = r.filter((x) => !x.c.complete);
    return { priced, unpriced };
  }, [models, workload]);

  const baseRow = rows.priced.find((r) => r.m.id === baseline) ?? rows.priced[Math.min(rows.priced.length - 1, Math.floor(rows.priced.length / 2))] ?? null;
  const max = rows.priced.length ? rows.priced[rows.priced.length - 1].c.monthly : 1;
  const reqIdx = REQ_STEPS.findIndex((s) => s >= workload.requestsPerMonth);
  const set = (patch: Partial<WorkloadInput>) => onWorkload({ ...workload, ...patch });

  return (
    <div className="px-calc">
      <div className="px-card px-calc-ctrl">
        <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--ink-3)" }}>Workload preset</div>
        <div className="px-presets">
          {WORKLOAD_PRESETS.map((p) => {
            const I = ICONS[p.icon] ?? Layers;
            return (
              <button key={p.id} className={`px-preset ${presetId === p.id ? "on" : ""}`} onClick={() => onPreset(p.id)} title={p.desc}>
                <I size={13} />
                {p.name}
              </button>
            );
          })}
        </div>
        <Slider
          label="Requests / month"
          value={reqIdx < 0 ? REQ_STEPS.length - 1 : reqIdx}
          display={fmtTokens(workload.requestsPerMonth)}
          min={0}
          max={REQ_STEPS.length - 1}
          step={1}
          onChange={(i) => set({ requestsPerMonth: REQ_STEPS[i] })}
        />
        <Slider
          label="Avg input tokens / request"
          value={workload.inputTokens}
          display={fmtTokens(workload.inputTokens)}
          min={100}
          max={100_000}
          step={100}
          onChange={(v) => set({ inputTokens: v })}
          hint="Includes system prompt, retrieved context and history."
        />
        <Slider
          label="Avg output tokens / request"
          value={workload.outputTokens}
          display={fmtTokens(workload.outputTokens)}
          min={10}
          max={16_000}
          step={10}
          onChange={(v) => set({ outputTokens: v })}
          hint="Reasoning/thinking tokens bill as output on most models — budget for them here."
        />
        <Slider
          label="Cache hit rate"
          value={Math.round(workload.cacheHitRate * 100)}
          display={`${Math.round(workload.cacheHitRate * 100)}%`}
          min={0}
          max={95}
          step={5}
          onChange={(v) => set({ cacheHitRate: v / 100 })}
          hint="Share of input tokens served from a prompt cache (stable prefixes)."
        />
        <Slider
          label="Batch-eligible share"
          value={Math.round(workload.batchShare * 100)}
          display={`${Math.round(workload.batchShare * 100)}%`}
          min={0}
          max={100}
          step={5}
          onChange={(v) => set({ batchShare: v / 100 })}
          hint="Traffic that can wait up to 24h; models without a batch tier ignore this."
        />
      </div>

      <div className="px-calc-out">
        <div className="px-assume">
          <strong>Assumptions:</strong> {fmtTokens(workload.requestsPerMonth)} requests × ({fmtTokens(workload.inputTokens)} in + {fmtTokens(workload.outputTokens)} out) ={" "}
          {fmtTokens((workload.inputTokens + workload.outputTokens) * workload.requestsPerMonth)} tokens/month · {Math.round(workload.cacheHitRate * 100)}% cached input at
          each model&apos;s cached rate (full price where none is published) · {Math.round(workload.batchShare * 100)}% batch at each model&apos;s batch discount · standard
          context tier unless avg input exceeds a model&apos;s long-context threshold · cache-write fees, tool/search surcharges and off-peak schedules excluded. Deltas are
          vs the model marked <strong>base</strong> (click any row to change).
        </div>

        <div className="px-card" style={{ padding: "12px 18px 8px" }}>
          {rows.priced.map(({ m, c }) => {
            const delta = baseRow ? c.monthly - baseRow.c.monthly : 0;
            const isBase = baseRow?.m.id === m.id;
            const parts = [
              { k: "input", v: c.input, col: providerColor(m.provider), label: "Fresh input" },
              { k: "cached", v: c.cachedInput, col: `${providerColor(m.provider)}66`, label: "Cached input" },
              { k: "output", v: c.output, col: `${providerColor(m.provider)}b3`, label: "Output" },
            ];
            const gross = c.input + c.cachedInput + c.output;
            return (
              <div
                key={m.id}
                className={`px-crow ${isBase ? "base" : ""}`}
                tabIndex={0}
                onClick={() => setBaseline(m.id)}
                onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && setBaseline(m.id)}
                onMouseEnter={(e) =>
                  tip.show(
                    {
                      title: `${m.name} — ${fmtUsd(c.monthly)}/month`,
                      rows: [
                        ...parts.map((p) => ({ label: p.label, value: fmtUsd(p.v), swatch: p.col })),
                        { label: "Batch savings", value: c.batchSavings > 0 ? `−${fmtUsd(c.batchSavings)}` : "—" },
                        { label: "Per request", value: fmtUsd(c.perRequest) },
                      ],
                      note: m.pricing.cachedInput == null && workload.cacheHitRate > 0 ? "No published cached-input price — charged at full input price." : undefined,
                    },
                    e.clientX,
                    e.clientY,
                  )
                }
                onMouseMove={(e) => tip.move(e.clientX, e.clientY)}
                onMouseLeave={tip.hide}
                style={{ cursor: "pointer" }}
              >
                <div className="nm" style={{ display: "flex", alignItems: "center", gap: 8, minWidth: 0 }}>
                  <span style={{ color: providerColor(m.provider), fontSize: 11, width: 14, textAlign: "center" }} aria-hidden>
                    {providerById(m.provider).glyph}
                  </span>
                  <span style={{ fontWeight: 600, fontSize: 13, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{m.name}</span>
                  <button className={`pick ${isBase ? "on" : ""}`} onClick={(e) => { e.stopPropagation(); setBaseline(m.id); }} aria-pressed={isBase}>
                    {isBase ? "base" : "set base"}
                  </button>
                </div>
                <div className="px-stack" style={{ width: `${Math.max(2, (c.monthly / max) * 100)}%` }} aria-hidden>
                  {parts
                    .filter((p) => p.v > 0)
                    .map((p) => (
                      <span key={p.k} className="s" style={{ flex: p.v / gross, background: p.col }} />
                    ))}
                </div>
                <div className="vals">
                  <span className="m">{fmtUsd(c.monthly, { compact: true })}</span>
                  <span style={{ color: "var(--ink-3)" }}> /mo</span>
                  {baseRow && !isBase && (
                    <div className={`d ${delta < 0 ? "save" : "more"}`}>
                      {delta < 0 ? "saves " : "costs "}
                      {fmtUsd(Math.abs(delta), { compact: true })} ({Math.abs(Math.round((delta / baseRow.c.monthly) * 100))}%) vs base
                    </div>
                  )}
                  {isBase && <div className="d">baseline</div>}
                </div>
              </div>
            );
          })}
          {rows.unpriced.length > 0 && (
            <div style={{ fontSize: 12, color: "var(--ink-3)", padding: "8px 0 4px" }}>
              No public token pricing: {rows.unpriced.map((r) => r.m.name).join(", ")}
            </div>
          )}
          <div className="px-legend">
            <span className="k"><span className="sw" style={{ background: "var(--ink-2)" }} /> Fresh input</span>
            <span className="k"><span className="sw" style={{ background: "var(--ink-2)", opacity: 0.4 }} /> Cached input</span>
            <span className="k"><span className="sw" style={{ background: "var(--ink-2)", opacity: 0.7 }} /> Output</span>
            <span style={{ color: "var(--ink-3)" }}>Bar length = monthly cost relative to the priciest visible model; segment shading = cost component.</span>
          </div>
        </div>
      </div>
    </div>
  );
}
