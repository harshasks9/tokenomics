"use client";

import { useMemo, useState } from "react";
import { ChevronDown, RotateCcw } from "lucide-react";
import { ACTION_CLASS, DEFAULT_WEIGHTS, USE_CASES, score, type ActionClass, type Weights } from "@/lib/ge-citizen/data";
import { Basis, ClassBadge, Section, Slider } from "./ui";

const CRITERIA: { key: keyof Weights; label: string; hint: string }[] = [
  { key: "frequency", label: "Frequency", hint: "How often a household needs it" },
  { key: "value", label: "Citizen value", hint: "Time, money or stress saved per use" },
  { key: "ease", label: "Ease of integration", hint: "Content-only or one API scores high" },
  { key: "benefit", label: "Government benefit", hint: "Measurable revenue, contacts avoided, resolution" },
];

const LEVEL_LABEL = { municipal: "Municipal", state: "State / province", national: "National" } as const;

export default function UseCaseExplorer() {
  const [w, setW] = useState<Weights>(DEFAULT_WEIGHTS);
  const [source, setSource] = useState<"all" | "project" | "gap">("all");
  const [level, setLevel] = useState<"all" | "municipal" | "state" | "national">("all");
  const [open, setOpen] = useState<string | null>("bills");

  const ranked = useMemo(
    () =>
      USE_CASES.filter((u) => (source === "all" || u.source === source) && (level === "all" || u.level === level))
        .map((u) => ({ u, s: score(u, w) }))
        .sort((a, b) => b.s - a.s),
    [w, source, level],
  );

  return (
    <Section
      id="gec-usecases"
      eyebrow="2 · Use-case explorer"
      title="What citizens would actually use — ranked by your priorities"
      lede={
        <>
          Fourteen candidate services, scored 1–5 on four criteria. Move the weights to see how the ranking changes. Each use case
          is tagged with the level of permission it needs. Scores are editorial judgements, not measurements.{" "}
          <Basis kind="illustrative" />
        </>
      }
      alt
    >
      {/* Permission legend */}
      <div className="mb-8 grid gap-2 sm:grid-cols-2 lg:grid-cols-5">
        {(Object.keys(ACTION_CLASS) as ActionClass[]).map((c) => (
          <div key={c} className="rounded-xl border border-[#E8EAED] bg-white p-3">
            <ClassBadge c={c} />
            <p className="mt-2 text-[12px] leading-snug text-[#5F6368]">{ACTION_CLASS[c].rule}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
        <aside className="space-y-5 rounded-2xl border border-[#E8EAED] bg-white p-5 lg:self-start">
          <div className="flex items-center justify-between">
            <p className="text-[11px] font-bold uppercase tracking-wide text-[#5F6368]">Weights</p>
            <button onClick={() => setW(DEFAULT_WEIGHTS)} className="flex items-center gap-1 text-[11px] font-medium text-[#1A73E8]">
              <RotateCcw size={11} /> Reset
            </button>
          </div>
          {CRITERIA.map((c) => (
            <Slider
              key={c.key}
              label={c.label}
              hint={c.hint}
              value={w[c.key]}
              min={0}
              max={5}
              step={1}
              display={`×${w[c.key]}`}
              onChange={(v) => setW((p) => ({ ...p, [c.key]: v }))}
            />
          ))}
          <div className="border-t border-[#E8EAED] pt-4">
            <p className="text-[11px] font-bold uppercase tracking-wide text-[#5F6368]">Source</p>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {(
                [
                  ["all", "All"],
                  ["project", "Project material"],
                  ["gap", "Added (gaps)"],
                ] as const
              ).map(([k, l]) => (
                <button
                  key={k}
                  onClick={() => setSource(k)}
                  className={`rounded-full border px-2.5 py-1 text-[12px] font-medium ${source === k ? "border-[#1A73E8] bg-[#E8F0FE] text-[#1A73E8]" : "border-[#DADCE0] text-[#5F6368]"}`}
                >
                  {l}
                </button>
              ))}
            </div>
            <p className="mt-4 text-[11px] font-bold uppercase tracking-wide text-[#5F6368]">Level of government</p>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {(["all", "municipal", "state", "national"] as const).map((k) => (
                <button
                  key={k}
                  onClick={() => setLevel(k)}
                  className={`rounded-full border px-2.5 py-1 text-[12px] font-medium ${level === k ? "border-[#1A73E8] bg-[#E8F0FE] text-[#1A73E8]" : "border-[#DADCE0] text-[#5F6368]"}`}
                >
                  {k === "all" ? "All" : LEVEL_LABEL[k]}
                </button>
              ))}
            </div>
          </div>
        </aside>

        <ol className="space-y-2">
          {ranked.map(({ u, s }, rank) => {
            const isOpen = open === u.id;
            return (
              <li key={u.id} className="overflow-hidden rounded-xl border border-[#E8EAED] bg-white">
                <button onClick={() => setOpen(isOpen ? null : u.id)} className="flex w-full items-center gap-3 px-4 py-3 text-left hover:bg-[#F8F9FA]" aria-expanded={isOpen}>
                  <span className="tabular-nums w-6 text-[13px] font-semibold text-[#80868B]">{rank + 1}</span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-[14px] font-semibold leading-snug text-[#202124]">{u.name}</span>
                    <span className="mt-1 flex flex-wrap items-center gap-1">
                      {u.classes.map((c) => (
                        <ClassBadge key={c} c={c} size="xs" />
                      ))}
                      <span className="ml-1 text-[11px] text-[#80868B]">
                        {LEVEL_LABEL[u.level]} · {u.source === "project" ? "from project" : "added"}
                      </span>
                    </span>
                  </span>
                  <span className="hidden w-32 items-center gap-2 sm:flex" title={`Weighted score ${s.toFixed(2)} of 5`}>
                    <span className="h-1.5 flex-1 overflow-hidden rounded-full bg-[#F1F3F4]">
                      <span className="block h-full rounded-full bg-[#1A73E8]" style={{ width: `${(s / 5) * 100}%` }} />
                    </span>
                    <span className="tabular-nums w-8 text-right text-[13px] font-semibold text-[#202124]">{s.toFixed(1)}</span>
                  </span>
                  <ChevronDown size={16} className={`shrink-0 text-[#80868B] transition-transform ${isOpen ? "rotate-180" : ""}`} />
                </button>
                {isOpen && (
                  <div className="grid gap-4 border-t border-[#E8EAED] px-4 py-4 md:grid-cols-[1.4fr_1fr]">
                    <div>
                      <p className="text-[13px] leading-relaxed text-[#3C4043]">{u.example}</p>
                      <p className="mt-3 text-[12px] text-[#5F6368]">
                        <span className="font-semibold text-[#3C4043]">Measure: </span>
                        {u.metric}
                      </p>
                      <p className="mt-1 text-[12px] text-[#5F6368]">
                        <span className="font-semibold text-[#3C4043]">Needs connecting: </span>
                        {u.systems.join(" · ")}
                      </p>
                    </div>
                    <dl className="grid grid-cols-2 gap-2 self-start">
                      {CRITERIA.map((c) => (
                        <div key={c.key} className="rounded-lg bg-[#F8F9FA] px-3 py-2">
                          <dt className="text-[11px] text-[#5F6368]">{c.label}</dt>
                          <dd className="mt-0.5 flex gap-0.5" aria-label={`${u[c.key]} of 5`}>
                            {[1, 2, 3, 4, 5].map((n) => (
                              <span key={n} className="h-1.5 w-4 rounded-full" style={{ background: n <= u[c.key] ? "#1A73E8" : "#DADCE0" }} />
                            ))}
                          </dd>
                        </div>
                      ))}
                    </dl>
                  </div>
                )}
              </li>
            );
          })}
          {ranked.length === 0 && <li className="rounded-xl border border-dashed border-[#DADCE0] p-6 text-center text-[13px] text-[#80868B]">No use cases match these filters.</li>}
        </ol>
      </div>

      <div className="mt-8 rounded-2xl border border-[#E8EAED] bg-white p-5">
        <p className="text-[14px] font-semibold text-[#202124]">Reading the ranking</p>
        <p className="mt-1.5 text-[13px] leading-relaxed text-[#5F6368]">
          With frequency and ease weighted highest, the top of the list is municipal and transactional: bills, street reports,
          reminders and a procedures front door. These are the journeys a resident repeats every month and the ones a city can
          connect in a quarter. High-value but low-frequency services — business formation, benefits, permits — make the case
          compelling but belong in the second wave, because they need human review and deeper integration. Crisis routing ranks low as a “use case” but is not optional: it
          ships in every release and overrides every other flow.
        </p>
      </div>
    </Section>
  );
}
