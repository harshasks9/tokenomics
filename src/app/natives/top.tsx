"use client";

import { useState } from "react";
import { ArrowRight, Gauge, Rocket, TrendingUp, Zap } from "lucide-react";
import { ALL_USE_CASES, TOP_TEN, HIGHEST_VOLUME, HIGHEST_VALUE, NEAR_TERM, TRANSFORMATIONAL, type ScoredUseCase } from "./index";
import { AudienceTag, Chip, EconTag, Fade, INK, LINE, MUTED, Note, SectionHead } from "./ui";
import type { ViewId } from "./app";

const LENSES = [
  { id: "top", label: "Top 10 overall", Icon: TrendingUp, blurb: "The ten most strategically interesting opportunities across all fifty, by weighted score.", rows: TOP_TEN },
  { id: "volume", label: "Highest volume", Icon: Gauge, blurb: "Where the largest number of interactions likely sit — the workflows that touch the most conversations.", rows: HIGHEST_VOLUME },
  { id: "value", label: "Highest economic value", Icon: Zap, blurb: "Where an agent could create or protect the most revenue, regardless of how hard it is to build.", rows: HIGHEST_VALUE },
  { id: "near", label: "Best near-term", Icon: Rocket, blurb: "High value that is genuinely deployable now — system access exists and autonomy carries acceptable risk.", rows: NEAR_TERM },
  { id: "transform", label: "Most transformational", Icon: TrendingUp, blurb: "Workflows that change the operating model rather than trimming support cost. Revenue-side by definition.", rows: TRANSFORMATIONAL },
] as const;

export function TopOpportunities({ go }: { go: (v: ViewId, slug?: string) => void }) {
  const [lens, setLens] = useState<string>("top");
  const active = LENSES.find((l) => l.id === lens)!;

  return (
    <section className="max-w-[1180px] mx-auto px-5 md:px-8 py-10 md:py-14">
      <SectionHead
        kicker="Top opportunities"
        title="The strongest plays across the whole market"
        lead="Five lenses on the same fifty workflows. Cost reduction and revenue creation are kept separate deliberately — they are sold to different executives with different proof."
      />

      <div className="flex flex-wrap gap-1.5 mb-5">
        {LENSES.map((l) => (
          <button key={l.id} onClick={() => setLens(l.id)}
            className="text-[11.5px] font-semibold rounded-full px-3.5 py-2 border inline-flex items-center gap-1.5 transition-colors"
            style={lens === l.id ? { backgroundColor: INK, color: "#fff", borderColor: "transparent" } : { borderColor: LINE, color: MUTED, backgroundColor: "#fff" }}>
            <l.Icon size={12} /> {l.label}
          </button>
        ))}
      </div>

      <p className="text-[12.5px] mb-4 max-w-2xl leading-relaxed" style={{ color: MUTED }}>{active.blurb}</p>

      <div className="space-y-2 mb-12">
        {active.rows.map((u, i) => (
          <Fade key={u.id} delay={i * 0.03}>
            <button onClick={() => go("companies", u.company.slug)}
              className="w-full text-left rounded-2xl border bg-white p-4 hover:shadow-md transition-shadow flex items-start gap-4" style={{ borderColor: LINE }}>
              <span className="text-[20px] font-extrabold tabular-nums shrink-0 w-8 text-center" style={{ color: i < 3 ? u.company.color : MUTED }}>{i + 1}</span>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-[10.5px] font-bold inline-flex items-center gap-1.5" style={{ color: u.company.color }}>
                    <span className="w-2 h-2 rounded-sm" style={{ backgroundColor: u.company.color }} />{u.company.shortName}
                  </span>
                  {u.rank === 1 && <Chip color={u.company.color}>Hero use case</Chip>}
                </div>
                <div className="text-[14px] font-extrabold leading-snug mt-1">{u.name}</div>
                <p className="text-[12px] mt-1.5 leading-relaxed" style={{ color: MUTED }}>{u.agentic}</p>
                <div className="flex flex-wrap items-center gap-1.5 mt-2.5">
                  <AudienceTag audience={u.audience} />
                  <EconTag econ={u.econ} />
                  {u.outcomes.slice(0, 2).map((o) => <Chip key={o} color="#188038">{o}</Chip>)}
                </div>
              </div>
              <div className="text-right shrink-0">
                <div className="text-[22px] font-extrabold tabular-nums leading-none" style={{ color: u.company.color }}>{u.score}</div>
                <div className="text-[9px] font-bold uppercase tracking-wider mt-1" style={{ color: MUTED }}>score</div>
              </div>
            </button>
          </Fade>
        ))}
      </div>

      <ImpactFeasibility go={go} />
    </section>
  );
}

// ─── Impact vs feasibility map ──────────────────────────────────────────────

function ImpactFeasibility({ go }: { go: (v: ViewId, slug?: string) => void }) {
  const [hover, setHover] = useState<ScoredUseCase | null>(null);
  const W = 720, H = 460, PAD = 46;
  const x = (f: number) => PAD + ((f - 1) / 4) * (W - PAD * 2);
  const y = (i: number) => H - PAD - ((i - 1) / 4) * (H - PAD * 2);

  // Nudge overlapping points apart deterministically.
  const placed = ALL_USE_CASES.map((u, idx) => {
    const jitter = ((idx % 5) - 2) * 3.2;
    return { u, cx: x(u.feasibility) + jitter, cy: y(u.impact) - jitter };
  });

  const quadrants = [
    { label: "Build toward", note: "High value, hard to deploy", x: PAD + 6, y: PAD + 4, color: "#7C3AED" },
    { label: "Do now", note: "High value, deployable", x: W / 2 + 6, y: PAD + 4, color: "#188038" },
    { label: "Deprioritise", note: "Low value, hard", x: PAD + 6, y: H / 2 + 16, color: "#B3261E" },
    { label: "Fill-in", note: "Easy, but modest value", x: W / 2 + 6, y: H / 2 + 16, color: "#D97706" },
  ];

  return (
    <div>
      <SectionHead kicker="Prioritisation" title="Impact versus feasibility" lead="Every one of the fifty workflows plotted. Impact weights economic value, interaction volume and differentiation; feasibility weights ease of deployment and how well the work suits an autonomous agent." />
      <div className="rounded-2xl border bg-white p-4 md:p-6" style={{ borderColor: LINE }}>
        <div className="overflow-x-auto">
          <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ minWidth: 620 }} role="img" aria-label="Impact versus feasibility scatter plot of fifty opportunities">
            <rect x={W / 2} y={PAD} width={W / 2 - PAD} height={H / 2 - PAD} fill="#18803808" />
            <line x1={PAD} y1={H / 2} x2={W - PAD} y2={H / 2} stroke={LINE} strokeDasharray="4 4" />
            <line x1={W / 2} y1={PAD} x2={W / 2} y2={H - PAD} stroke={LINE} strokeDasharray="4 4" />
            <line x1={PAD} y1={H - PAD} x2={W - PAD} y2={H - PAD} stroke="#CFD6DD" />
            <line x1={PAD} y1={PAD} x2={PAD} y2={H - PAD} stroke="#CFD6DD" />

            {quadrants.map((q) => (
              <g key={q.label}>
                <text x={q.x} y={q.y + 10} fontSize="11" fontWeight="800" fill={q.color}>{q.label}</text>
                <text x={q.x} y={q.y + 23} fontSize="9" fill={MUTED}>{q.note}</text>
              </g>
            ))}

            <text x={W / 2} y={H - 12} fontSize="10" fontWeight="700" fill={MUTED} textAnchor="middle">Feasibility →</text>
            <text x={14} y={H / 2} fontSize="10" fontWeight="700" fill={MUTED} textAnchor="middle" transform={`rotate(-90 14 ${H / 2})`}>Impact →</text>

            {placed.map(({ u, cx, cy }) => {
              const on = hover?.id === u.id;
              return (
                <g key={u.id} onMouseEnter={() => setHover(u)} onMouseLeave={() => setHover(null)}
                  onClick={() => go("companies", u.company.slug)} style={{ cursor: "pointer" }}>
                  <circle cx={cx} cy={cy} r={on ? 9 : u.rank === 1 ? 6.5 : 4.5}
                    fill={u.company.color} fillOpacity={on ? 1 : u.rank === 1 ? 0.85 : 0.5}
                    stroke={on ? "#fff" : "none"} strokeWidth="2" />
                </g>
              );
            })}
          </svg>
        </div>

        <div className="mt-3 min-h-[62px] rounded-xl border px-4 py-3" style={{ borderColor: LINE, backgroundColor: "#FAFBFC" }}>
          {hover ? (
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[10.5px] font-bold" style={{ color: hover.company.color }}>{hover.company.shortName}</span>
                <span className="text-[13px] font-extrabold">{hover.name}</span>
                <span className="text-[11px] font-extrabold tabular-nums ml-auto" style={{ color: hover.company.color }}>{hover.score}</span>
              </div>
              <p className="text-[11.5px] mt-1 leading-relaxed" style={{ color: MUTED }}>{hover.whyThisCompany}</p>
            </div>
          ) : (
            <p className="text-[11.5px]" style={{ color: MUTED }}>
              Hover any point for the workflow; click to open the company. Larger dots are that company&apos;s hero use case.
            </p>
          )}
        </div>

        <div className="mt-3 flex flex-wrap gap-3">
          {Array.from(new Set(ALL_USE_CASES.map((u) => u.company))).map((c) => (
            <span key={c.slug} className="inline-flex items-center gap-1.5 text-[10px]" style={{ color: MUTED }}>
              <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: c.color }} />{c.shortName}
            </span>
          ))}
        </div>
      </div>
      <div className="mt-4">
        <Note>
          Scores are relative analytic judgements made across all fifty workflows to force prioritisation — they are not company data and
          not a forecast. A workflow scoring low on feasibility is not a bad idea; it is a later one.
        </Note>
      </div>
    </div>
  );
}
