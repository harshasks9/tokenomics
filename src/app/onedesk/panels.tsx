"use client";

import { useMemo, useState } from "react";
import { Ban, ArrowRight, Check, ShieldCheck } from "lucide-react";
import {
  ARCH, CONSTRAINTS, ECON_DEFAULTS, ECON_NOTES, EVIDENCE_PANEL, GOOGLE_NOTE, SOURCES,
} from "./data";
import { AGENT, Claim, Chip, Disclose, GATE, INK, MUTED, PAPER, RULE, SERIF, STALL, Tag } from "./ui";

// ─── Evidence ───────────────────────────────────────────────────────────────

export function EvidencePanel() {
  const { against, forIt, principle } = EVIDENCE_PANEL;
  return (
    <div>
      <div className="grid md:grid-cols-2 gap-px rounded-[3px] overflow-hidden" style={{ backgroundColor: RULE, border: `1px solid ${RULE}` }}>
        <div className="bg-white p-6 md:p-7">
          <div className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase mb-3" style={{ color: STALL, letterSpacing: "0.16em" }}>
            <Ban size={11} /> {against.title}
          </div>
          <div className="text-[19px] md:text-[22px] leading-[1.25] mb-3" style={{ fontFamily: SERIF, color: INK }}>{against.finding}</div>
          <p className="text-[12.5px] leading-[1.65]" style={{ color: MUTED }}>{against.body}</p>
          <p className="text-[12.5px] leading-[1.65] mt-3 pl-3" style={{ color: INK, borderLeft: `2px solid ${STALL}` }}>{against.kicker}</p>
          <div className="mt-3 flex gap-1.5"><Tag kind="fact" src={against.src} /><Tag kind="fact" src={against.src2} /></div>
        </div>
        <div className="bg-white p-6 md:p-7">
          <div className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase mb-3" style={{ color: AGENT, letterSpacing: "0.16em" }}>
            <Check size={11} /> {forIt.title}
          </div>
          <div className="text-[19px] md:text-[22px] leading-[1.25] mb-3" style={{ fontFamily: SERIF, color: INK }}>{forIt.finding}</div>
          <p className="text-[12.5px] leading-[1.65]" style={{ color: MUTED }}>{forIt.body}</p>
          <p className="text-[12.5px] leading-[1.65] mt-3 pl-3" style={{ color: INK, borderLeft: `2px solid ${AGENT}` }}>{forIt.kicker}</p>
          <div className="mt-3"><Tag kind="fact" src={forIt.src} /></div>
        </div>
      </div>
      <div className="mt-4 p-6 md:p-7 rounded-[3px]" style={{ backgroundColor: "#fff", border: `1px solid ${AGENT}44` }}>
        <div className="text-[10px] font-bold uppercase mb-2.5" style={{ color: AGENT, letterSpacing: "0.16em" }}>{principle.title}</div>
        <p className="text-[14px] md:text-[15.5px] leading-[1.6] max-w-[76ch]" style={{ color: INK }}>{principle.body}</p>
      </div>
    </div>
  );
}

// ─── Compliance console ─────────────────────────────────────────────────────

export function ComplianceConsole() {
  const [active, setActive] = useState(CONSTRAINTS[0].id);
  const c = CONSTRAINTS.find((x) => x.id === active)!;
  return (
    <div className="grid lg:grid-cols-[260px_1fr] gap-4 items-start">
      <div className="space-y-1.5">
        {CONSTRAINTS.map((x) => {
          const on = x.id === active;
          return (
            <button
              key={x.id} onClick={() => setActive(x.id)}
              className="w-full text-left px-3.5 py-3 rounded-[3px] transition-all"
              style={{ border: `1px solid ${on ? GATE : RULE}`, backgroundColor: on ? `${GATE}0C` : "#fff" }}
              aria-pressed={on}
            >
              <div className="text-[11.5px] leading-[1.45]" style={{ color: on ? INK : MUTED }}>“{x.trigger}”</div>
            </button>
          );
        })}
      </div>

      <div className="rounded-[3px] overflow-hidden" style={{ border: `1px solid ${RULE}`, backgroundColor: "#fff" }}>
        <div className="px-5 py-3" style={{ borderBottom: `1px solid ${RULE}`, backgroundColor: "#FDFBF8" }}>
          <span className="text-[10px] font-bold uppercase" style={{ color: MUTED, letterSpacing: "0.16em" }}>Request received</span>
          <div className="text-[13.5px] mt-1" style={{ color: INK }}>“{c.trigger}”</div>
        </div>

        <div className="px-5 py-4 space-y-3.5">
          <div className="flex items-start gap-3">
            <span className="text-[9.5px] font-bold uppercase w-[92px] shrink-0 pt-0.5" style={{ color: MUTED, letterSpacing: "0.1em" }}>Naive path</span>
            <span className="text-[12.5px] line-through" style={{ color: STALL, textDecorationColor: `${STALL}88` }}>{c.naive}</span>
          </div>
          <div className="flex items-start gap-3">
            <span className="text-[9.5px] font-bold uppercase w-[92px] shrink-0 pt-0.5" style={{ color: MUTED, letterSpacing: "0.1em" }}>Agent</span>
            <span className="inline-flex items-center gap-1.5 text-[13px] font-bold" style={{ color: GATE }}>
              <Ban size={12} /> {c.refusal}
            </span>
          </div>
          <div className="flex items-start gap-3">
            <span className="text-[9.5px] font-bold uppercase w-[92px] shrink-0 pt-0.5" style={{ color: MUTED, letterSpacing: "0.1em" }}>Instead</span>
            <span className="text-[12.5px] leading-[1.6]" style={{ color: INK }}>
              <ArrowRight size={11} className="inline mr-1" style={{ color: AGENT }} />{c.instead}
            </span>
          </div>
        </div>

        <div className="px-5 py-4" style={{ borderTop: `1px solid ${RULE}`, backgroundColor: "#FDFBF8" }}>
          <div className="text-[9.5px] font-bold uppercase mb-1.5" style={{ color: MUTED, letterSpacing: "0.1em" }}>The rule</div>
          <p className="text-[12px] leading-[1.65]" style={{ color: INK }}>{c.rule} <Tag kind="fact" src={c.src} /></p>
          <div className="text-[9.5px] font-bold uppercase mt-3.5 mb-1.5" style={{ color: MUTED, letterSpacing: "0.1em" }}>Why this is a moat, not a limitation</div>
          <p className="text-[12px] leading-[1.65]" style={{ color: MUTED }}>{c.why}</p>
        </div>
      </div>
    </div>
  );
}

// ─── Architecture ───────────────────────────────────────────────────────────

export function Architecture() {
  const [open, setOpen] = useState("identity");
  return (
    <div>
      <div className="rounded-[3px] overflow-hidden" style={{ border: `1px solid ${RULE}` }}>
        {ARCH.map((a, i) => {
          const on = a.id === open;
          return (
            <div key={a.id} style={{ borderTop: i === 0 ? undefined : `1px solid ${RULE}` }}>
              <button
                onClick={() => setOpen(on ? "" : a.id)}
                className="w-full text-left px-5 py-4 flex items-center gap-4 bg-white hover:bg-[#FDFBF8] transition-colors"
                aria-expanded={on}
              >
                <span className="text-[10px] font-bold tabular-nums w-5 shrink-0" style={{ color: on ? AGENT : MUTED }}>0{i + 1}</span>
                <span className="text-[16px] font-bold shrink-0" style={{ fontFamily: SERIF, color: on ? AGENT : INK, minWidth: 110 }}>{a.name}</span>
                <span className="text-[11px] flex-1 min-w-0 truncate" style={{ color: MUTED }}>{a.owner}</span>
                <span className="text-[13px] shrink-0" style={{ color: MUTED }}>{on ? "−" : "+"}</span>
              </button>
              {on && (
                <div className="px-5 pb-5 pl-[76px] bg-white">
                  <p className="text-[12.5px] leading-[1.7] max-w-[74ch]" style={{ color: INK }}>{a.body}</p>
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {a.items.map((it) => <Chip key={it} color={a.id === "gate" ? GATE : AGENT}>{it}</Chip>)}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-4 p-5 rounded-[3px]" style={{ border: `1px dashed ${RULE}`, backgroundColor: "#fff" }}>
        <p className="text-[12.5px] leading-[1.7] max-w-[80ch]" style={{ color: MUTED }}>
          {GOOGLE_NOTE.body}{" "}
          <span className="inline-flex gap-1.5 align-middle">
            {GOOGLE_NOTE.srcs.map((s) => <Tag key={s} kind="fact" src={s} />)}
          </span>
        </p>
        <p className="text-[14px] font-bold mt-2.5" style={{ color: AGENT, fontFamily: SERIF }}>{GOOGLE_NOTE.point}</p>
      </div>
    </div>
  );
}

// ─── Economics ──────────────────────────────────────────────────────────────

const fmtINR = (n: number) => {
  if (n >= 1e7) return `₹${(n / 1e7).toFixed(1)} cr`;
  if (n >= 1e5) return `₹${(n / 1e5).toFixed(1)} lakh`;
  return `₹${Math.round(n).toLocaleString("en-IN")}`;
};
const fmtNum = (n: number) => Math.round(n).toLocaleString("en-IN");

export function Economics() {
  const [enq, setEnq] = useState(ECON_DEFAULTS.enquiries);
  const [base, setBase] = useState(ECON_DEFAULTS.baseline);
  const [re, setRe] = useState(ECON_DEFAULTS.reInquiry);
  const [worked, setWorked] = useState(ECON_DEFAULTS.poolWorked);
  const [fee, setFee] = useState(ECON_DEFAULTS.tuition);
  const [minor, setMinor] = useState(ECON_DEFAULTS.minorShare);

  const m = useMemo(() => {
    const enrolled = enq * (base / 100);
    const dormant = enq - enrolled;
    const pool = dormant * (worked / 100);
    const viaConsent = pool * (minor / 100);
    const incremental = pool * (re / 100);
    return { enrolled, dormant, pool, viaConsent, incremental, revenue: incremental * fee };
  }, [enq, base, re, worked, fee, minor]);

  const rows: { label: string; value: number; step: number; min: number; max: number; set: (n: number) => void; fmt: (n: number) => string; note: string }[] = [
    { label: "Enquiries you originate in a cycle", value: enq, min: 50000, max: 2000000, step: 10000, set: setEnq, fmt: fmtNum, note: "Your number — replace it" },
    { label: "Baseline conversion, enquiry → enrolled", value: base, min: 0.4, max: 3, step: 0.02, set: setBase, fmt: (n) => `${n.toFixed(2)}%`, note: "Vendor benchmark: 1.06% national" },
    { label: "Re-inquiry conversion", value: re, min: 0.5, max: 6, step: 0.1, set: setRe, fmt: (n) => `${n.toFixed(2)}%`, note: "Vendor benchmark: 3.00% vs 0.74% first-time" },
    { label: "Share of the dormant pool actually worked", value: worked, min: 1, max: 60, step: 1, set: setWorked, fmt: (n) => `${n}%`, note: "Today, effectively near zero — no capacity" },
    { label: "Under-18 share of that pool", value: minor, min: 0, max: 90, step: 5, set: setMinor, fmt: (n) => `${n}%`, note: "Parental-consent route. No scoring, no nurture sequencing." },
    { label: "First-year tuition", value: fee, min: 50000, max: 800000, step: 10000, set: setFee, fmt: fmtINR, note: "Your number — replace it" },
  ];

  return (
    <div className="grid lg:grid-cols-[1.05fr_1fr] gap-5 items-start">
      <div className="rounded-[3px] bg-white p-5" style={{ border: `1px solid ${RULE}` }}>
        <div className="text-[10px] font-bold uppercase mb-4" style={{ color: MUTED, letterSpacing: "0.16em" }}>Every assumption, visible and editable</div>
        <div className="space-y-4">
          {rows.map((r) => (
            <div key={r.label}>
              <div className="flex items-baseline justify-between gap-3 mb-1">
                <label className="text-[11.5px] leading-tight" style={{ color: INK }}>{r.label}</label>
                <span className="text-[12.5px] font-bold tabular-nums shrink-0" style={{ color: AGENT }}>{r.fmt(r.value)}</span>
              </div>
              <input
                type="range" min={r.min} max={r.max} step={r.step} value={r.value}
                onChange={(e) => r.set(Number(e.target.value))}
                className="w-full accent-[#0F766E]" aria-label={r.label}
              />
              <div className="text-[10px] mt-0.5" style={{ color: MUTED }}>{r.note}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <div className="rounded-[3px] bg-white p-5" style={{ border: `1px solid ${RULE}` }}>
          <div className="text-[10px] font-bold uppercase mb-4" style={{ color: MUTED, letterSpacing: "0.16em" }}>What the arithmetic says</div>
          <div className="space-y-3">
            {[
              ["Enrolments at baseline", fmtNum(m.enrolled), MUTED],
              ["Enquiries that did not convert", fmtNum(m.dormant), STALL],
              ["Of those, the share you work", fmtNum(m.pool), INK],
              ["Reached through a parent, by law", fmtNum(m.viaConsent), GATE],
            ].map(([l, v, c]) => (
              <div key={l as string} className="flex items-baseline justify-between gap-3 pb-2" style={{ borderBottom: `1px solid ${RULE}` }}>
                <span className="text-[11.5px]" style={{ color: MUTED }}>{l}</span>
                <span className="text-[15px] font-bold tabular-nums" style={{ color: c as string, fontFamily: SERIF }}>{v}</span>
              </div>
            ))}
          </div>
          <div className="mt-4 pt-4" style={{ borderTop: `2px solid ${AGENT}33` }}>
            <div className="flex items-baseline justify-between gap-3">
              <span className="text-[12px] font-bold" style={{ color: INK }}>Incremental enrolments</span>
              <span className="text-[27px] font-bold tabular-nums leading-none" style={{ color: AGENT, fontFamily: SERIF }}>{fmtNum(m.incremental)}</span>
            </div>
            <div className="flex items-baseline justify-between gap-3 mt-2">
              <span className="text-[12px]" style={{ color: MUTED }}>First-year fee value</span>
              <span className="text-[17px] font-bold tabular-nums" style={{ color: INK, fontFamily: SERIF }}>{fmtINR(m.revenue)}</span>
            </div>
          </div>
        </div>

        <div className="rounded-[3px] p-5" style={{ border: `1px solid ${RULE}`, backgroundColor: "#FDFBF8" }}>
          <div className="text-[10px] font-bold uppercase mb-3" style={{ color: STALL, letterSpacing: "0.16em" }}>Read this before you quote the number</div>
          <div className="space-y-2.5">
            {ECON_NOTES.map((n) => <Claim key={n.text.slice(0, 30)} text={n.text} kind={n.kind} src={n.src} />)}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Boundaries strip ───────────────────────────────────────────────────────

export function Boundaries() {
  const items = [
    { t: "It never determines a grievance", d: "UGC reserves that for the Student Grievance Redressal Committee and the Ombudsperson. The agent runs the clock and assembles the file.", src: "ugcGrievance" },
    { t: "It never answers policy without the clause", d: "Every institutional answer cites the circular it came from. If the circular is silent, so is the agent — and it routes to a human.", src: undefined },
    { t: "It never moves money, seats or grades alone", d: "A named human approves, with the evidence already assembled. The agent removes the assembly, not the accountability.", src: undefined },
    { t: "It never profiles a child", d: "Under-18 applicants are routed to verifiable parental consent — no scoring, no behavioural sequencing, regardless of consent given.", src: "dpdpChild" },
  ];
  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
      {items.map((i) => (
        <div key={i.t} className="p-4 rounded-[3px] bg-white" style={{ border: `1px solid ${RULE}` }}>
          <ShieldCheck size={14} style={{ color: GATE }} className="mb-2" />
          <div className="text-[12.5px] font-bold leading-tight mb-1.5" style={{ color: INK }}>{i.t}</div>
          <p className="text-[11px] leading-[1.6]" style={{ color: MUTED }}>
            {i.d} {i.src && <Tag kind="fact" src={i.src} />}
          </p>
        </div>
      ))}
    </div>
  );
}
