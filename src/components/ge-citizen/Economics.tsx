"use client";

import { useState } from "react";
import { AlertTriangle, CheckCircle2, XCircle, RotateCcw, Info } from "lucide-react";
import {
  COST_BASIS,
  DEFAULT_INPUTS,
  PRESETS,
  SERVICE_CLASS_LABEL,
  fmtInt,
  fmtMoney,
  normalizeMix,
  sensitivity,
  type EconInputs,
  type FlagLevel,
  type ServiceClass,
} from "@/lib/ge-citizen/economics";
import { MODELS } from "@/lib/pricing";
import { useEcon } from "./EconContext";
import { Basis, NumberField, Section, Slider } from "./ui";

const pct = (v: number) => `${(v * 100).toFixed(0)}%`;
const CLASSES: ServiceClass[] = ["inform", "prepare", "act"];

const FLAG_STYLE: Record<FlagLevel, { Icon: typeof XCircle; color: string; bg: string; border: string }> = {
  fail: { Icon: XCircle, color: "#C5221F", bg: "#FCE8E6", border: "#F6AEA9" },
  warn: { Icon: AlertTriangle, color: "#B06000", bg: "#FEF7E0", border: "#FDE293" },
  ok: { Icon: CheckCircle2, color: "#137333", bg: "#E6F4EA", border: "#A8DAB5" },
};

function Group({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="space-y-4">
      <p className="text-[11px] font-bold uppercase tracking-wide text-[#5F6368]">{title}</p>
      {children}
    </div>
  );
}

function Tile({ label, value, sub, tone }: { label: string; value: string; sub?: string; tone?: "neg" | "pos" }) {
  return (
    <div className="rounded-xl border border-[#E8EAED] bg-white p-4">
      <p className="text-[12px] text-[#5F6368]">{label}</p>
      <p className={`tabular-nums mt-1 text-[24px] font-semibold leading-none ${tone === "neg" ? "text-[#C5221F]" : "text-[#202124]"}`}>{value}</p>
      {sub && <p className="mt-1.5 text-[11px] leading-snug text-[#80868B]">{sub}</p>}
    </div>
  );
}

export default function Economics() {
  const { inputs: i, setInputs, out: o } = useEcon();
  const [preset, setPreset] = useState("base");
  const set = <K extends keyof EconInputs>(k: K, v: EconInputs[K]) => {
    setPreset("");
    setInputs((p) => ({ ...p, [k]: v }));
  };
  const setMix = (c: ServiceClass, v: number) => {
    // Keep the three shares summing to 100%: the other two absorb the change in proportion.
    setPreset("");
    setInputs((p) => {
      const others = CLASSES.filter((x) => x !== c);
      const rest = 1 - v;
      const otherSum = others.reduce((a, x) => a + p.mix[x], 0);
      const mix = { ...p.mix, [c]: v };
      others.forEach((x) => (mix[x] = otherSum > 0 ? (p.mix[x] / otherSum) * rest : rest / 2));
      return { ...p, mix };
    });
  };
  const mix = normalizeMix(i.mix);
  const sens = sensitivity(i);
  const maxAbs = Math.max(...sens.map((r) => Math.abs(r.contribution)), o.revenue, 1);

  // Where the money goes. With a shortfall, the bar spans cost plus the gap revenue fails to cover.
  const bar = [
    { k: "Model & usage cost", v: o.variableCost, c: "#1A73E8" },
    { k: "Fixed run cost", v: i.opsAnnual, c: "#8AB4F8" },
    { k: o.contribution >= 0 ? "Contribution" : "Shortfall", v: Math.abs(o.contribution), c: o.contribution >= 0 ? "#DADCE0" : "#F6AEA9" },
  ];
  const barTotal = Math.max(bar.reduce((a, b) => a + b.v, 0), 1);
  const valueRatio = o.revenue > 0 ? o.avoidedContactValue / o.revenue : 0;

  return (
    <Section
      id="gec-economics"
      eyebrow="4 · Economics calculator"
      title="Does $2 per citizen per year work?"
      lede={
        <>
          The government pays for every <em>covered</em> citizen; delivery cost follows <em>usage</em>. The model works when
          usage is real but bounded — and fails if heavy use is uncapped or setup is folded into the $2. Every input is editable.
          Defaults are assumptions, not project data. <Basis kind="assumption" />
        </>
      }
      alt
    >
      <div className="mb-6 flex flex-wrap items-center gap-2">
        <span className="text-[12px] font-semibold text-[#5F6368]">Scenario:</span>
        {PRESETS.map((p) => (
          <button
            key={p.id}
            title={p.note}
            onClick={() => {
              setPreset(p.id);
              setInputs(() => ({ ...DEFAULT_INPUTS, ...p.patch }));
            }}
            className={`rounded-full border px-3 py-1 text-[12px] font-medium ${preset === p.id ? "border-[#1A73E8] bg-[#E8F0FE] text-[#1A73E8]" : "border-[#DADCE0] bg-white text-[#3C4043] hover:bg-[#F8F9FA]"}`}
          >
            {p.label}
          </button>
        ))}
        <button
          onClick={() => {
            setPreset("base");
            setInputs(() => DEFAULT_INPUTS);
          }}
          className="ml-auto flex items-center gap-1 text-[12px] font-medium text-[#1A73E8]"
        >
          <RotateCcw size={12} /> Reset all
        </button>
      </div>

      <div className="grid gap-6 lg:grid-cols-[340px_1fr]">
        {/* Inputs */}
        <aside className="space-y-7 rounded-2xl border border-[#E8EAED] bg-white p-5 lg:self-start">
          <Group title="Price & coverage">
            <Slider label="Annual price per covered citizen" value={i.price} min={0.5} max={6} step={0.1} display={`$${i.price.toFixed(2)}`} onChange={(v) => set("price", v)} />
            <NumberField label="Citizens covered" value={i.population} step={10_000} onChange={(v) => set("population", v)} hint={fmtInt(i.population) + " people"} />
          </Group>

          <Group title="Adoption & usage">
            <Slider label="Activation (share who ever use it in the year)" value={i.activation} min={0.02} max={1} step={0.01} display={pct(i.activation)} onChange={(v) => set("activation", v)} />
            <Slider label="Monthly active (share of activated)" value={i.monthlyActive} min={0.05} max={1} step={0.01} display={pct(i.monthlyActive)} onChange={(v) => set("monthlyActive", v)} />
            <Slider label="Task sessions per active citizen / month" value={i.interactions} min={1} max={60} step={1} display={`${i.interactions}`} onChange={(v) => set("interactions", v)} />
            <Slider
              label="Hard cap per citizen / month"
              value={i.cap}
              min={0}
              max={100}
              step={5}
              display={i.cap === 0 ? "None" : `${i.cap}`}
              onChange={(v) => set("cap", v)}
              hint="A pooled-quota guardrail with per-user limits — the pattern the project's reference deployment uses. 0 = uncapped."
            />
          </Group>

          <Group title="Service mix">
            {CLASSES.map((c) => (
              <Slider key={c} label={SERVICE_CLASS_LABEL[c]} value={mix[c]} min={0} max={1} step={0.01} display={pct(mix[c])} onChange={(v) => setMix(c, v)} />
            ))}
          </Group>

          <Group title="Agent operating cost per session">
            {CLASSES.map((c) => (
              <NumberField
                key={c}
                label={SERVICE_CLASS_LABEL[c]}
                prefix="$"
                step={0.001}
                value={i.cost[c]}
                onChange={(v) => set("cost", { ...i.cost, [c]: v })}
                hint={`${COST_BASIS[c].note}, at list ${MODELS[COST_BASIS[c].model].name} rates, plus $${COST_BASIS[c].overhead.toFixed(3)} for retrieval, tools and logging.`}
              />
            ))}
            <NumberField label="Fixed annual run cost" prefix="$" step={10_000} value={i.opsAnnual} onChange={(v) => set("opsAnnual", v)} hint="Support desk, monitoring, content upkeep, customer success" />
          </Group>

          <Group title="One-time setup (not in the $2)">
            <NumberField label="Integration & setup" prefix="$" step={25_000} value={i.integration} onChange={(v) => set("integration", v)} hint="Identity federation, 3–5 service APIs, payments, consent ledger, audit" />
            <Slider label="Contract term" value={i.contractYears} min={1} max={5} step={1} display={`${i.contractYears} yr`} onChange={(v) => set("contractYears", v)} />
          </Group>

          <Group title="Government-side value">
            <Slider label="Share of prepare/act sessions that replace a call or visit" value={i.contactSubstitution} min={0} max={1} step={0.05} display={pct(i.contactSubstitution)} onChange={(v) => set("contactSubstitution", v)} />
            <NumberField label="Cost of one assisted contact" prefix="$" step={0.5} value={i.costPerContact} onChange={(v) => set("costPerContact", v)} hint="Use the government's own contact-centre cost" />
          </Group>
        </aside>

        {/* Outputs */}
        <div className="space-y-6">
          <div className="space-y-2">
            {o.flags.map((f) => {
              const st = FLAG_STYLE[f.level];
              return (
                <div key={f.title} className="flex gap-3 rounded-xl border px-4 py-3" style={{ background: st.bg, borderColor: st.border }}>
                  <st.Icon size={18} className="mt-0.5 shrink-0" style={{ color: st.color }} />
                  <div>
                    <p className="text-[14px] font-semibold" style={{ color: st.color }}>
                      {f.title}
                    </p>
                    <p className="mt-0.5 text-[13px] leading-snug text-[#3C4043]">{f.detail}</p>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
            <Tile label="Gross annual revenue" value={fmtMoney(o.revenue)} sub={`${fmtInt(i.population)} × $${i.price.toFixed(2)}`} />
            <Tile label="Estimated delivery cost" value={fmtMoney(o.runCost)} sub={`${fmtMoney(o.variableCost)} usage + ${fmtMoney(i.opsAnnual)} fixed`} />
            <Tile label="Contribution margin" value={`${(o.margin * 100).toFixed(0)}%`} sub={fmtMoney(o.contribution)} tone={o.contribution < 0 ? "neg" : undefined} />
            <Tile label="Cost per active citizen" value={fmtMoney(o.costPerActive)} sub={`vs ${fmtMoney(o.revenuePerActive)} paid per active citizen`} />
          </div>

          <div className="rounded-2xl border border-[#E8EAED] bg-white p-5">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <p className="text-[14px] font-semibold text-[#202124]">Where each dollar goes</p>
              <p className="tabular-nums text-[12px] text-[#5F6368]">
                {fmtInt(o.annualInteractions)} sessions a year · blended {fmtMoney(o.blendedCost)} per session
              </p>
            </div>
            <div className="mt-3 flex h-7 gap-[2px] overflow-hidden rounded-md">
              {bar.map((b) =>
                b.v > 0 ? (
                  <div key={b.k} title={`${b.k}: ${fmtMoney(b.v)}`} style={{ width: `${(b.v / barTotal) * 100}%`, background: b.c }} />
                ) : null,
              )}
            </div>
            <ul className="mt-3 flex flex-wrap gap-x-5 gap-y-1">
              {bar.map((b) => (
                <li key={b.k} className="flex items-center gap-1.5 text-[12px] text-[#3C4043]">
                  <span className="h-2.5 w-2.5 rounded-sm" style={{ background: b.c }} />
                  {b.k} <span className="tabular-nums font-semibold">{fmtMoney(b.v)}</span>
                </li>
              ))}
            </ul>
            <dl className="mt-4 grid gap-3 border-t border-[#E8EAED] pt-4 text-[13px] sm:grid-cols-3">
              <div>
                <dt className="text-[12px] text-[#5F6368]">Activated citizens</dt>
                <dd className="tabular-nums font-semibold text-[#202124]">{fmtInt(o.activated)}</dd>
              </div>
              <div>
                <dt className="text-[12px] text-[#5F6368]">Average monthly active</dt>
                <dd className="tabular-nums font-semibold text-[#202124]">{fmtInt(o.avgMonthlyActive)}</dd>
              </div>
              <div>
                <dt className="text-[12px] text-[#5F6368]">Break-even usage</dt>
                <dd className="tabular-nums font-semibold text-[#202124]">{fmtInt(o.breakEvenInteractions)} sessions / active / month</dd>
              </div>
            </dl>
          </div>

          {/* Sensitivity */}
          <div className="rounded-2xl border border-[#E8EAED] bg-white p-5">
            <p className="text-[14px] font-semibold text-[#202124]">Sensitivity to heavy usage</p>
            <p className="mt-0.5 text-[12px] text-[#5F6368]">
              Contribution if every active citizen used it {sens.map((r) => `${r.multiplier}×`).join(", ")} as much. The cap
              {i.cap > 0 ? ` (${i.cap}/month)` : " (none set)"} still applies.
            </p>
            <div className="mt-4 space-y-2">
              {sens.map((r) => {
                const w = (Math.abs(r.contribution) / maxAbs) * 50;
                const neg = r.contribution < 0;
                return (
                  <div key={r.multiplier} className="grid grid-cols-[88px_1fr_110px] items-center gap-3 text-[12px]">
                    <span className="tabular-nums text-[#3C4043]">
                      <span className="font-semibold">{r.multiplier}×</span> · {fmtInt(r.interactions)}/mo
                    </span>
                    <div className="relative h-5" title={`${fmtMoney(r.contribution)} (${(r.margin * 100).toFixed(0)}% margin)`}>
                      <div className="absolute inset-y-0 left-1/2 w-px bg-[#BDC1C6]" />
                      <div
                        className="absolute inset-y-[3px] rounded-sm"
                        style={{
                          left: neg ? `${50 - w}%` : "50%",
                          width: `${Math.max(w, 0.5)}%`,
                          background: neg ? "#D93025" : "#1A73E8",
                        }}
                      />
                    </div>
                    <span className={`tabular-nums text-right font-semibold ${neg ? "text-[#C5221F]" : "text-[#202124]"}`}>
                      {fmtMoney(r.contribution)} · {(r.margin * 100).toFixed(0)}%
                    </span>
                  </div>
                );
              })}
            </div>
            <p className="mt-3 flex items-start gap-1.5 text-[11px] text-[#80868B]">
              <Info size={12} className="mt-[1px] shrink-0" /> Left of the line is a loss. Try setting the cap to 0 to see why a
              hard per-citizen limit is part of the offer, not an afterthought.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-2xl border border-[#E8EAED] bg-white p-5">
              <p className="text-[14px] font-semibold text-[#202124]">Setup, separate from the $2</p>
              <dl className="mt-3 space-y-2 text-[13px]">
                <div className="flex justify-between gap-3">
                  <dt className="text-[#5F6368]">One-time integration & setup</dt>
                  <dd className="tabular-nums font-semibold">{fmtMoney(i.integration)}</dd>
                </div>
                <div className="flex justify-between gap-3">
                  <dt className="text-[#5F6368]">Per citizen, spread over {i.contractYears} yr</dt>
                  <dd className="tabular-nums font-semibold">{fmtMoney(o.setupPerCitizenPerYear)} / yr</dd>
                </div>
                <div className="flex justify-between gap-3">
                  <dt className="text-[#5F6368]">Year-one all-in per citizen</dt>
                  <dd className="tabular-nums font-semibold">{fmtMoney(o.yearOneAllInPerCitizen)}</dd>
                </div>
                <div className="flex justify-between gap-3">
                  <dt className="text-[#5F6368]">Payback if the vendor absorbs setup</dt>
                  <dd className="tabular-nums font-semibold">{Number.isFinite(o.setupPaybackYears) ? `${o.setupPaybackYears.toFixed(1)} yr` : "Never"}</dd>
                </div>
              </dl>
              <p className="mt-3 text-[12px] leading-snug text-[#80868B]">
                Keep the headline clean: $2 buys the running service. Integration is a separate, fixed-scope line — ideally
                co-funded by partner enablement or a digital-transformation budget.
              </p>
            </div>
            <div className="rounded-2xl border border-[#E8EAED] bg-white p-5">
              <p className="text-[14px] font-semibold text-[#202124]">Why a government would fund it</p>
              <dl className="mt-3 space-y-2 text-[13px]">
                <div className="flex justify-between gap-3">
                  <dt className="text-[#5F6368]">Assisted contacts avoided / yr</dt>
                  <dd className="tabular-nums font-semibold">{fmtInt(o.avoidedContacts)}</dd>
                </div>
                <div className="flex justify-between gap-3">
                  <dt className="text-[#5F6368]">Value at ${i.costPerContact.toFixed(2)} per contact</dt>
                  <dd className="tabular-nums font-semibold">{fmtMoney(o.avoidedContactValue)}</dd>
                </div>
                <div className="flex justify-between gap-3">
                  <dt className="text-[#5F6368]">Versus annual price</dt>
                  <dd className="tabular-nums font-semibold">{o.revenue > 0 ? `${valueRatio.toFixed(2)}×` : "—"}</dd>
                </div>
              </dl>
              <p className="mt-3 text-[12px] leading-snug text-[#80868B]">
                {valueRatio >= 1
                  ? "At these assumptions avoided contacts alone exceed the price — but the substitution rate drives that result, so measure it in the pilot before relying on it."
                  : "At these assumptions avoided contacts alone do not cover the price."}{" "}
                The fuller case adds on-time payments, fewer incomplete applications, faster repairs and benefit take-up — measure
                each against a baseline rather than assume it.
              </p>
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
}
