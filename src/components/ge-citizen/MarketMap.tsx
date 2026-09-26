"use client";

import { useMemo, useState } from "react";
import { Star, RotateCcw } from "lucide-react";
import { SEGMENTS, USE_CASES, type Segment } from "@/lib/ge-citizen/data";
import { fmtInt, fmtMoney } from "@/lib/ge-citizen/economics";
import { useEcon } from "./EconContext";
import { Basis, Section, Slider } from "./ui";

// Sequential single-hue tint for the quadrants: priority rises toward top-right.
const QUAD = {
  tl: { fill: "#E8F0FE", label: "Big prize, hard to deploy", sub: "Build the path: start with one department or district" },
  tr: { fill: "#C6DAFC", label: "Start here", sub: "High impact and deployable within a budget cycle" },
  bl: { fill: "#F8F9FA", label: "Deprioritize", sub: "Reach through consortia, not direct sales" },
  br: { fill: "#E8F0FE", label: "Quick wins, narrower scope", sub: "Good references; bundle with city services" },
};

/** Keep bubbles off the frame edge: map 0–100 into 6–94%. */
const inset = (v: number) => 6 + v * 0.88;

function QuadLabels({ quads, below }: { quads: ("tl" | "tr" | "bl" | "br")[]; below?: boolean }) {
  return (
    <div className={`ml-6 grid grid-cols-2 gap-3 ${below ? "mt-2" : "mb-2"}`}>
      {quads.map((q, k) => (
        <p key={q} className={`text-[12px] font-semibold leading-tight text-[#174EA6] ${k === 1 ? "text-right" : ""}`}>
          {QUAD[q].label}
          <span className="block text-[11px] font-normal text-[#5F6368]">{QUAD[q].sub}</span>
        </p>
      ))}
    </div>
  );
}

const nameOfUseCase = (id: string) => USE_CASES.find((u) => u.id === id)?.name ?? id;

export default function MarketMap() {
  const { inputs } = useEcon();
  const [sel, setSel] = useState("midcity");
  const [hover, setHover] = useState<string | null>(null);
  const [overrides, setOverrides] = useState<Record<string, { ease: number; impact: number }>>({});

  const segs: Segment[] = useMemo(() => SEGMENTS.map((s) => ({ ...s, ...(overrides[s.id] ?? {}) })), [overrides]);
  const seg = segs.find((s) => s.id === sel)!;
  const idx = (id: string) => SEGMENTS.findIndex((s) => s.id === id) + 1;

  // Bubble area scales with log of the population midpoint.
  const size = (s: Segment) => {
    const mid = Math.sqrt(s.popLow * s.popHigh);
    return 26 + (Math.log10(mid) - 4.5) * 9;
  };

  const setPlacement = (k: "ease" | "impact", v: number) =>
    setOverrides((o) => ({ ...o, [sel]: { ease: seg.ease, impact: seg.impact, [k]: v } }));

  return (
    <Section
      id="gec-markets"
      eyebrow="3 · Market heat map"
      title="Who to launch for first"
      lede={
        <>
          Eight buyer segments placed by ease of deployment (digital readiness, integration complexity) and potential citizen impact
          (population reached, frequency of services, unmet need). Select a segment for its first use cases, buyer, rollout and
          indicative contract value. Placements are judgements you can adjust. <Basis kind="illustrative" />
        </>
      }
    >
      <div className="grid gap-6 lg:grid-cols-[1.15fr_1fr]">
        {/* Matrix */}
        <div>
          <QuadLabels quads={["tl", "tr"]} />
          <div className="relative flex">
            <div className="flex w-6 shrink-0 items-center justify-center">
              <span className="-rotate-90 whitespace-nowrap text-[11px] font-semibold uppercase tracking-wide text-[#5F6368]">Potential citizen impact →</span>
            </div>
            <div className="relative aspect-square w-full overflow-hidden rounded-xl border border-[#DADCE0]">
              <div className="absolute inset-0 grid grid-cols-2 grid-rows-2 gap-[2px] bg-white" aria-hidden>
                {(["tl", "tr", "bl", "br"] as const).map((q) => (
                  <div key={q} style={{ background: QUAD[q].fill }} />
                ))}
              </div>
              {segs.map((s) => {
                const d = size(s);
                const on = s.id === sel;
                return (
                  <button
                    key={s.id}
                    onClick={() => setSel(s.id)}
                    onMouseEnter={() => setHover(s.id)}
                    onMouseLeave={() => setHover(null)}
                    onFocus={() => setHover(s.id)}
                    onBlur={() => setHover(null)}
                    aria-label={`${s.name}: ease ${s.ease}, impact ${s.impact}`}
                    aria-pressed={on}
                    className="absolute flex -translate-x-1/2 translate-y-1/2 items-center justify-center rounded-full text-[12px] font-bold transition-all"
                    style={{
                      left: `${inset(s.ease)}%`,
                      bottom: `${inset(s.impact)}%`,
                      width: `min(${d}px, ${(d / 4.4).toFixed(1)}vw)`,
                      height: `min(${d}px, ${(d / 4.4).toFixed(1)}vw)`,
                      background: on ? "#1A73E8" : "#FFFFFF",
                      color: on ? "#FFFFFF" : "#174EA6",
                      border: `2px solid ${on ? "#FFFFFF" : "#1A73E8"}`,
                      boxShadow: on ? "0 0 0 3px #1A73E8" : "0 1px 3px rgba(32,33,36,.2)",
                      zIndex: on ? 3 : 2,
                    }}
                  >
                    {s.wedge ? <Star size={14} fill="currentColor" /> : idx(s.id)}
                  </button>
                );
              })}
              {hover &&
                (() => {
                  const s = segs.find((x) => x.id === hover)!;
                  const right = s.ease > 60;
                  return (
                    <div
                      className="pointer-events-none absolute z-10 w-52 rounded-lg bg-[#202124] px-3 py-2 text-[12px] text-white shadow-lg"
                      style={{
                        left: right ? undefined : `calc(${inset(s.ease)}% + 22px)`,
                        right: right ? `calc(${100 - inset(s.ease)}% + 22px)` : undefined,
                        bottom: `calc(${inset(s.impact)}% - 10px)`,
                      }}
                    >
                      <p className="font-semibold">{s.name}</p>
                      <p className="tabular-nums mt-0.5 text-[#BDC1C6]">
                        Ease {s.ease} · Impact {s.impact} · {fmtInt(s.popLow)}–{fmtInt(s.popHigh)} people
                      </p>
                    </div>
                  );
                })()}
            </div>
          </div>
          <QuadLabels quads={["bl", "br"]} below />
          <p className="ml-6 mt-2 text-center text-[11px] font-semibold uppercase tracking-wide text-[#5F6368]">Ease of deployment →</p>

          <ol className="ml-6 mt-4 grid gap-1 sm:grid-cols-2">
            {segs.map((s) => (
              <li key={s.id}>
                <button
                  onClick={() => setSel(s.id)}
                  className={`flex w-full items-center gap-2 rounded-lg px-2 py-1 text-left text-[12px] ${s.id === sel ? "bg-[#E8F0FE] font-semibold text-[#174EA6]" : "text-[#3C4043] hover:bg-[#F8F9FA]"}`}
                >
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-[#1A73E8] text-[10px] font-bold text-[#174EA6]">
                    {s.wedge ? <Star size={9} fill="currentColor" /> : idx(s.id)}
                  </span>
                  {s.name}
                </button>
              </li>
            ))}
          </ol>
          <p className="ml-6 mt-2 text-[11px] text-[#80868B]">Bubble size reflects typical covered population (log scale).</p>
        </div>

        {/* Detail */}
        <div className="rounded-2xl border border-[#E8EAED] bg-white p-5 sm:p-6 lg:self-start">
          {seg.wedge && (
            <p className="mb-2 inline-flex items-center gap-1 rounded-full bg-[#E8F0FE] px-2.5 py-0.5 text-[11px] font-bold text-[#174EA6]">
              <Star size={11} fill="currentColor" /> Recommended wedge
            </p>
          )}
          <h3 className="text-[20px] font-semibold leading-snug text-[#202124]">{seg.name}</h3>
          <p className="mt-2 text-[13px] leading-relaxed text-[#3C4043]">{seg.why}</p>

          <div className="mt-5 rounded-xl bg-[#F8F9FA] p-4">
            <div className="flex items-center justify-between">
              <p className="text-[11px] font-bold uppercase tracking-wide text-[#5F6368]">Indicative annual contract value</p>
              <Basis kind="illustrative" />
            </div>
            <p className="tabular-nums mt-1 text-[24px] font-semibold text-[#202124]">
              {fmtMoney(seg.popLow * inputs.price)} – {fmtMoney(seg.popHigh * inputs.price)}
            </p>
            <p className="tabular-nums mt-0.5 text-[12px] text-[#5F6368]">
              {fmtInt(seg.popLow)}–{fmtInt(seg.popHigh)} covered citizens × ${inputs.price.toFixed(2)} per year. Population band is an
              assumption about the segment, not market data; setup is extra.
            </p>
          </div>

          <dl className="mt-5 space-y-4 text-[13px]">
            <div>
              <dt className="text-[11px] font-bold uppercase tracking-wide text-[#5F6368]">Likely first use cases</dt>
              <dd className="mt-1.5 flex flex-wrap gap-1.5">
                {seg.firstUseCases.map((u) => (
                  <span key={u} className="rounded-full border border-[#DADCE0] px-2.5 py-0.5 text-[12px] text-[#3C4043]">
                    {nameOfUseCase(u)}
                  </span>
                ))}
              </dd>
            </div>
            <div>
              <dt className="text-[11px] font-bold uppercase tracking-wide text-[#5F6368]">Buyer</dt>
              <dd className="mt-1 leading-snug text-[#3C4043]">{seg.buyer}</dd>
            </div>
            <div>
              <dt className="text-[11px] font-bold uppercase tracking-wide text-[#5F6368]">Rollout approach</dt>
              <dd className="mt-1 leading-snug text-[#3C4043]">{seg.rollout}</dd>
            </div>
            <div>
              <dt className="text-[11px] font-bold uppercase tracking-wide text-[#5F6368]">Barriers</dt>
              <dd className="mt-1">
                <ul className="list-disc space-y-0.5 pl-4 text-[#3C4043]">
                  {seg.barriers.map((b) => (
                    <li key={b}>{b}</li>
                  ))}
                </ul>
              </dd>
            </div>
          </dl>

          <div className="mt-6 space-y-3 border-t border-[#E8EAED] pt-4">
            <div className="flex items-center justify-between">
              <p className="text-[11px] font-bold uppercase tracking-wide text-[#5F6368]">Adjust placement</p>
              {overrides[sel] && (
                <button onClick={() =>
                    setOverrides((o) => {
                      const next = { ...o };
                      delete next[sel];
                      return next;
                    })
                  } className="flex items-center gap-1 text-[11px] font-medium text-[#1A73E8]">
                  <RotateCcw size={11} /> Reset
                </button>
              )}
            </div>
            <Slider label="Ease of deployment" value={seg.ease} min={2} max={98} step={1} display={`${seg.ease}`} onChange={(v) => setPlacement("ease", v)} />
            <Slider label="Potential citizen impact" value={seg.impact} min={2} max={98} step={1} display={`${seg.impact}`} onChange={(v) => setPlacement("impact", v)} />
          </div>
        </div>
      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl border border-[#C6DAFC] bg-[#F4F8FE] p-5">
          <p className="text-[14px] font-semibold text-[#174EA6]">Why the wedge is a city, not a nation</p>
          <p className="mt-1.5 text-[13px] leading-relaxed text-[#3C4043]">
            The project&apos;s reference deployment shows national governments will buy a citizen agent. But the journeys that make
            it a daily habit — bills, street problems, reminders — sit with cities, and a city can connect them in one quarter with
            one decision-maker. A working city deployment becomes the evidence a national or state buyer asks for.
          </p>
        </div>
        <div className="rounded-2xl border border-[#E8EAED] bg-white p-5">
          <p className="text-[14px] font-semibold text-[#202124]">What would move a segment</p>
          <p className="mt-1.5 text-[13px] leading-relaxed text-[#5F6368]">
            A national digital-ID and payment rail moves every segment in that country to the right. A reusable integration for a
            common municipal billing or service-request product moves cities and consortia right. Neither is assumed here — check
            both in discovery.
          </p>
        </div>
      </div>
    </Section>
  );
}
