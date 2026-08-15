"use client";

import { useMemo, useState } from "react";
import { Check, Minus, RotateCcw } from "lucide-react";
import {
  CIO, COMPARISON, DEPLOY, FLOW, INTEGRATIONS, ROI_DEFAULTS, ROI_NOTES, TRUST,
} from "./data";
import {
  AMBER, BORDER, BRAND, Card, Disclosure, FAINT, fmtINR, fmtNum, GREEN, INK, MUTED,
  Panel, Pill, RED, Slider, SURFACE, Tag,
} from "./ui";

// ─── Before / after ─────────────────────────────────────────────────────────

export function BeforeAfter() {
  return (
    <div>
      <div className="rounded-lg px-4 py-3 mb-5 inline-flex items-center gap-2.5" style={{ backgroundColor: SURFACE, border: `1px solid ${BORDER}` }}>
        <span className="text-[10.5px] font-semibold uppercase" style={{ color: FAINT, letterSpacing: "0.08em" }}>Request</span>
        <span className="text-[13.5px] font-medium" style={{ color: INK }}>{FLOW.request}</span>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <FlowColumn
          label={FLOW.before.label}
          steps={FLOW.before.steps}
          elapsed={FLOW.before.elapsed}
          desks={FLOW.before.desks}
          count={FLOW.before.stepCount}
          color={AMBER}
          blockedIndex={4}
        />
        <FlowColumn
          label={FLOW.after.label}
          steps={FLOW.after.steps}
          elapsed={FLOW.after.elapsed}
          desks={FLOW.after.desks}
          count={FLOW.after.stepCount}
          color={GREEN}
        />
      </div>

      <p className="text-[12.5px] leading-[1.6] mt-4 max-w-[80ch]" style={{ color: MUTED }}>
        Both columns describe the same institution and the same rules. Nothing in the policy changes — only who does the walking.
        Elapsed times are illustrative of a multi-clearance workflow, not a measured customer result. <Tag kind="inference" />
      </p>
    </div>
  );
}

function FlowColumn({ label, steps, elapsed, desks, count, color, blockedIndex }: {
  label: string; steps: string[]; elapsed: string; desks: string; count: number; color: string; blockedIndex?: number;
}) {
  return (
    <Panel
      title={label}
      right={
        <div className="flex items-center gap-2">
          <Pill color={color}>{count} steps</Pill>
          <span className="text-[12px] font-semibold tabular-nums" style={{ color }}>{elapsed}</span>
        </div>
      }
    >
      <div className="p-4">
        <ol className="space-y-0">
          {steps.map((s, i) => {
            const blocked = i === blockedIndex;
            return (
              <li key={i} className="flex gap-3 items-start">
                <div className="flex flex-col items-center shrink-0" style={{ width: 18 }}>
                  <span
                    className="w-[18px] h-[18px] rounded-full flex items-center justify-center text-[9.5px] font-bold shrink-0"
                    style={{ backgroundColor: blocked ? `${RED}14` : `${color}14`, color: blocked ? RED : color }}
                  >
                    {i + 1}
                  </span>
                  {i < steps.length - 1 && <span className="w-px flex-1" style={{ backgroundColor: BORDER, minHeight: 18 }} />}
                </div>
                <span className="text-[12.5px] leading-[1.5] pb-3" style={{ color: blocked ? RED : INK }}>{s}</span>
              </li>
            );
          })}
        </ol>
        <div className="text-[11.5px] pt-3" style={{ color: FAINT, borderTop: `1px solid ${BORDER}` }}>{desks}</div>
      </div>
    </Panel>
  );
}

// ─── Comparison ─────────────────────────────────────────────────────────────

export function Comparison() {
  const [open, setOpen] = useState<number | null>(null);
  return (
    <div>
      <p className="text-[14px] leading-[1.65] max-w-[72ch] mb-6" style={{ color: MUTED }}>{COMPARISON.intro}</p>
      <Panel title="Capability">
        <div className="grid grid-cols-[minmax(0,1fr)_76px_76px] sm:grid-cols-[minmax(0,1fr)_132px_132px]">
          <div className="px-4 py-2 text-[10px] font-semibold uppercase" style={{ color: FAINT, letterSpacing: "0.06em", borderBottom: `1px solid ${BORDER}` }} />
          <div className="px-3 py-2 text-[10px] font-semibold uppercase text-center" style={{ color: FAINT, letterSpacing: "0.06em", borderBottom: `1px solid ${BORDER}` }}>Systems you own</div>
          <div className="px-3 py-2 text-[10px] font-semibold uppercase text-center" style={{ color: BRAND, letterSpacing: "0.06em", borderBottom: `1px solid ${BORDER}`, backgroundColor: "#F5F8FE" }}>Front Office</div>

          {COMPARISON.rows.map((r, i) => (
            <div key={r.capability} className="contents">
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="px-4 py-3 text-left text-[13px] hover:bg-[#FCFCFD] transition-colors"
                style={{ color: INK, borderBottom: i < COMPARISON.rows.length - 1 || open === i ? `1px solid ${BORDER}` : undefined }}
                aria-expanded={open === i}
              >
                {r.capability}
              </button>
              <div className="px-3 py-3 flex items-center justify-center" style={{ borderBottom: i < COMPARISON.rows.length - 1 || open === i ? `1px solid ${BORDER}` : undefined }}>
                {r.within
                  ? <Check size={15} strokeWidth={3} style={{ color: GREEN }} aria-label="Yes" />
                  : <Minus size={15} strokeWidth={3} style={{ color: "#D1D5DB" }} aria-label="No" />}
              </div>
              <div className="px-3 py-3 flex items-center justify-center" style={{ backgroundColor: "#F5F8FE", borderBottom: i < COMPARISON.rows.length - 1 || open === i ? `1px solid ${BORDER}` : undefined }}>
                <Check size={15} strokeWidth={3} style={{ color: BRAND }} aria-label="Yes" />
              </div>
              {open === i && (
                <div className="col-span-3 px-4 py-3 text-[12.5px] leading-[1.6]" style={{ color: MUTED, backgroundColor: "#FCFCFD", borderBottom: i < COMPARISON.rows.length - 1 ? `1px solid ${BORDER}` : undefined }}>
                  {r.note} <Tag kind={r.within ? "fact" : "inference"} src={r.src} />
                </div>
              )}
            </div>
          ))}
        </div>
      </Panel>
      <p className="text-[12px] mt-3" style={{ color: FAINT }}>Select any row for the evidence behind it.</p>
    </div>
  );
}

// ─── Integrations ───────────────────────────────────────────────────────────

export function Integrations() {
  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {INTEGRATIONS.map((g) => (
        <Card key={g.group}>
          <div className="text-[12px] font-semibold mb-3" style={{ color: INK }}>{g.group}</div>
          <div className="flex flex-wrap gap-1.5">
            {g.items.map((i) => (
              <span key={i} className="text-[11.5px] rounded-md px-2 py-1" style={{ backgroundColor: "#F4F6F9", color: MUTED, border: `1px solid ${BORDER}` }}>{i}</span>
            ))}
          </div>
        </Card>
      ))}
    </div>
  );
}

// ─── Trust ──────────────────────────────────────────────────────────────────

export function Trust() {
  return (
    <div className="space-y-3">
      {TRUST.map((t) => (
        <Disclosure key={t.title} label={t.title}>
          <div className="pt-4">
            <p className="text-[13.5px] leading-[1.65]" style={{ color: INK }}>{t.body}</p>
            <p className="text-[12.5px] leading-[1.6] mt-2.5" style={{ color: MUTED }}>
              {t.detail} <Tag kind={t.kind} src={t.src} />
              {t.extra && <> <Tag kind={t.kind} src={t.extra} /></>}
            </p>
          </div>
        </Disclosure>
      ))}
    </div>
  );
}

// ─── ROI ────────────────────────────────────────────────────────────────────

export function Roi() {
  const [v, setV] = useState(ROI_DEFAULTS);
  const set = (k: keyof typeof ROI_DEFAULTS) => (n: number) => setV((p) => ({ ...p, [k]: n }));

  const m = useMemo(() => {
    const workedPool = v.enquiries * (v.poolWorked / 100);
    const uplift = (v.reInquiry - v.baseline) / 100;
    const extraEnrolments = workedPool * uplift;
    const enrolmentValue = extraEnrolments * v.tuition;

    const counsellorCost = v.counsellors * v.salary * 12;
    const capacityValue = counsellorCost * (v.callingTime / 100);

    const requests = v.students * v.requestsPerStudent;
    const serviceValue = requests * (v.deflected / 100) * v.costPerRequest;

    return { extraEnrolments, enrolmentValue, counsellorCost, capacityValue, requests, serviceValue, total: enrolmentValue + capacityValue + serviceValue };
  }, [v]);

  return (
    <div className="grid lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] gap-5 items-start">
      <Panel
        title="Assumptions — change any of them"
        right={
          <button onClick={() => setV(ROI_DEFAULTS)} className="inline-flex items-center gap-1.5 text-[11px] font-medium rounded-md px-2 py-1" style={{ border: `1px solid ${BORDER}`, color: MUTED }}>
            <RotateCcw size={11} /> Reset
          </button>
        }
      >
        <div className="p-5 space-y-5">
          <Group title="Admissions">
            <Slider label="Enquiries per year" value={v.enquiries} min={50000} max={1000000} step={10000} format={fmtNum} onChange={set("enquiries")} />
            <Slider label="Baseline conversion" value={v.baseline} min={0.4} max={3} step={0.02} format={(n) => `${n.toFixed(2)}%`} onChange={set("baseline")} />
            <Slider label="Conversion when re-contacted" value={v.reInquiry} min={1} max={6} step={0.05} format={(n) => `${n.toFixed(2)}%`} onChange={set("reInquiry")} />
            <Slider label="Share of dormant pool worked that is not worked today" value={v.poolWorked} min={0} max={40} step={1} format={(n) => `${n}%`} onChange={set("poolWorked")} />
            <Slider label="Annual tuition per student" value={v.tuition} min={40000} max={600000} step={10000} format={fmtINR} onChange={set("tuition")} />
          </Group>

          <Group title="Counsellor capacity">
            <Slider label="Admission counsellors" value={v.counsellors} min={10} max={400} step={5} format={fmtNum} onChange={set("counsellors")} />
            <Slider label="Average monthly salary" value={v.salary} min={12000} max={60000} step={500} format={fmtINR} onChange={set("salary")} />
            <Slider label="Share of calling time redirected to conversations that convert" value={v.callingTime} min={0} max={60} step={1} format={(n) => `${n}%`} onChange={set("callingTime")} note="Roughly 70% of calling time currently reaches no eligible prospect" />
          </Group>

          <Group title="Student services">
            <Slider label="Enrolled students" value={v.students} min={2000} max={120000} step={1000} format={fmtNum} onChange={set("students")} />
            <Slider label="Requests per student per year" value={v.requestsPerStudent} min={1} max={20} step={1} format={(n) => `${n}`} onChange={set("requestsPerStudent")} />
            <Slider label="Share resolved without a person" value={v.deflected} min={0} max={80} step={1} format={(n) => `${n}%`} onChange={set("deflected")} />
            <Slider label="Cost of one manually handled request" value={v.costPerRequest} min={10} max={200} step={5} format={fmtINR} onChange={set("costPerRequest")} />
          </Group>
        </div>
      </Panel>

      <div className="space-y-4 lg:sticky lg:top-16">
        <Panel title="Modelled annual value">
          <div className="p-5">
            <div className="text-[34px] md:text-[42px] font-bold tabular-nums tracking-tight leading-none" style={{ color: BRAND }}>{fmtINR(m.total)}</div>
            <div className="text-[12px] mt-2" style={{ color: MUTED }}>across three effects, on your assumptions</div>

            <div className="mt-5 space-y-3">
              <Line
                label="Enrolments from enquiries nobody re-contacts today"
                sub={`${fmtNum(m.extraEnrolments)} additional enrolments × ${fmtINR(v.tuition)}`}
                value={fmtINR(m.enrolmentValue)}
              />
              <Line
                label="Counsellor capacity redirected"
                sub={`${v.callingTime}% of ${fmtINR(m.counsellorCost)} in annual counsellor cost`}
                value={fmtINR(m.capacityValue)}
              />
              <Line
                label="Student requests resolved without a person"
                sub={`${fmtNum(m.requests * (v.deflected / 100))} of ${fmtNum(m.requests)} requests × ${fmtINR(v.costPerRequest)}`}
                value={fmtINR(m.serviceValue)}
              />
            </div>
          </div>
        </Panel>

        <div className="rounded-xl p-5" style={{ backgroundColor: "#FEF7EC", border: `1px solid #F5DDB8` }}>
          <div className="text-[12px] font-semibold mb-2" style={{ color: "#92400E" }}>Read this before you use the number</div>
          <ul className="space-y-2">
            {ROI_NOTES.map((n, i) => (
              <li key={i} className="text-[12px] leading-[1.6]" style={{ color: "#78350F" }}>
                {n.text} <Tag kind={n.kind} src={n.src} />
              </li>
            ))}
          </ul>
          <p className="text-[12px] leading-[1.6] mt-3 font-medium" style={{ color: "#92400E" }}>
            This is a hypothesis for a pilot to test, not a forecast. The twelve-week pilot below exists to replace it with your own measured numbers.
          </p>
        </div>
      </div>
    </div>
  );
}

function Group({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="text-[10.5px] font-semibold uppercase mb-3 pb-2" style={{ color: FAINT, letterSpacing: "0.08em", borderBottom: `1px solid ${BORDER}` }}>{title}</div>
      <div className="space-y-3.5">{children}</div>
    </div>
  );
}

function Line({ label, sub, value }: { label: string; sub: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-4 pb-3" style={{ borderBottom: `1px solid ${BORDER}` }}>
      <div className="min-w-0">
        <div className="text-[12.5px] font-medium" style={{ color: INK }}>{label}</div>
        <div className="text-[11px] mt-0.5 tabular-nums" style={{ color: FAINT }}>{sub}</div>
      </div>
      <div className="text-[14px] font-semibold tabular-nums shrink-0" style={{ color: INK }}>{value}</div>
    </div>
  );
}

// ─── Deployment ─────────────────────────────────────────────────────────────

export function Deployment() {
  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {DEPLOY.map((d, i) => (
        <Card key={d.phase} className="flex flex-col">
          <div className="flex items-center gap-2 mb-3">
            <span className="w-[20px] h-[20px] rounded-full flex items-center justify-center text-[10px] font-bold" style={{ backgroundColor: `${BRAND}14`, color: BRAND }}>{i + 1}</span>
            <span className="text-[11px] font-semibold uppercase" style={{ color: BRAND, letterSpacing: "0.06em" }}>{d.phase}</span>
          </div>
          <div className="text-[14px] font-semibold mb-2" style={{ color: INK }}>{d.title}</div>
          <p className="text-[12.5px] leading-[1.6] flex-1" style={{ color: MUTED }}>{d.body}</p>
          <div className="mt-4 pt-3" style={{ borderTop: `1px solid ${BORDER}` }}>
            <div className="text-[10px] font-semibold uppercase mb-1.5" style={{ color: FAINT, letterSpacing: "0.06em" }}>What you provide</div>
            <ul className="space-y-1">
              {d.needs.map((n) => (
                <li key={n} className="text-[11.5px] flex gap-1.5" style={{ color: MUTED }}>
                  <span style={{ color: FAINT }}>·</span>{n}
                </li>
              ))}
            </ul>
          </div>
        </Card>
      ))}
    </div>
  );
}

// ─── CIO ────────────────────────────────────────────────────────────────────

export function CioLayers() {
  return (
    <div>
      <div className="rounded-xl overflow-hidden" style={{ backgroundColor: SURFACE, border: `1px solid ${BORDER}` }}>
        {CIO.layers.map((l, i) => (
          <div key={l.name} className="grid md:grid-cols-[240px_minmax(0,1fr)] gap-x-6 gap-y-1 px-5 py-4" style={{ borderBottom: i < CIO.layers.length - 1 ? `1px solid ${BORDER}` : undefined }}>
            <div className="flex items-start gap-2.5">
              <span className="text-[10px] font-mono mt-[3px]" style={{ color: FAINT }}>{String(i + 1).padStart(2, "0")}</span>
              <span className="text-[13px] font-semibold" style={{ color: INK }}>{l.name}</span>
            </div>
            <p className="text-[12.5px] leading-[1.65]" style={{ color: MUTED }}>{l.body}</p>
          </div>
        ))}
      </div>
      <p className="text-[12.5px] leading-[1.65] mt-4 max-w-[84ch]" style={{ color: MUTED }}>
        {CIO.note} <Tag kind="fact" src={CIO.noteSrc} />
      </p>
    </div>
  );
}
