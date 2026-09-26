"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Lock, Plug, CheckCircle2, Bell } from "lucide-react";
import { JOURNEY, PERSONA } from "@/lib/ge-citizen/data";
import { Basis, ClassBadge, Section } from "./ui";

export default function DayInLife() {
  const [i, setI] = useState(0);
  const s = JOURNEY[i];

  return (
    <Section
      id="gec-day"
      eyebrow="1 · Day in the life"
      title="One resident, five government tasks, no queue"
      lede={
        <>
          Follow {PERSONA.name} — {PERSONA.sketch}. Each moment shows what the agent does, what it needs permission for, and
          which government systems would have to be connected. <Basis kind="illustrative" />
        </>
      }
    >
      <div className="grid gap-6 lg:grid-cols-[260px_1fr]">
        <ol className="flex gap-2 overflow-x-auto pb-1 lg:flex-col lg:overflow-visible" role="tablist" aria-label="Moments in the day">
          {JOURNEY.map((j, k) => {
            const on = k === i;
            return (
              <li key={j.time} className="shrink-0 lg:shrink">
                <button
                  role="tab"
                  aria-selected={on}
                  onClick={() => setI(k)}
                  className={`flex w-full items-start gap-3 rounded-xl border px-3 py-2.5 text-left transition-colors ${
                    on ? "border-[#1A73E8] bg-[#E8F0FE]" : "border-[#E8EAED] bg-white hover:bg-[#F8F9FA]"
                  }`}
                >
                  <span className={`tabular-nums text-[12px] font-semibold ${on ? "text-[#1A73E8]" : "text-[#80868B]"}`}>{j.time}</span>
                  <span className={`text-[13px] font-medium leading-snug ${on ? "text-[#202124]" : "text-[#3C4043]"}`}>{j.title}</span>
                </button>
              </li>
            );
          })}
        </ol>

        <div className="rounded-2xl border border-[#E8EAED] bg-white p-5 sm:p-6">
          <AnimatePresence mode="wait">
            <motion.div key={i} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.18 }}>
              <div className="flex flex-wrap items-center gap-2">
                <span className="tabular-nums text-[13px] font-semibold text-[#1A73E8]">{s.time}</span>
                <h3 className="text-[18px] font-semibold text-[#202124]">{s.title}</h3>
                <div className="ml-auto flex flex-wrap gap-1.5">
                  {s.classes.map((c) => (
                    <ClassBadge key={c} c={c} />
                  ))}
                </div>
              </div>
              <p className="mt-1 flex items-center gap-1.5 text-[12px] text-[#80868B]">
                <Bell size={12} /> {s.trigger}
              </p>

              <div className="mt-5 space-y-3 rounded-xl bg-[#F8F9FA] p-4">
                {s.citizen !== "—" && (
                  <div className="flex justify-end">
                    <p className="max-w-[80%] rounded-2xl rounded-br-md bg-[#1A73E8] px-4 py-2.5 text-[14px] leading-snug text-white">{s.citizen}</p>
                  </div>
                )}
                <div className="flex">
                  <p className="max-w-[88%] rounded-2xl rounded-bl-md border border-[#E8EAED] bg-white px-4 py-2.5 text-[14px] leading-relaxed text-[#202124]">
                    {s.agent}
                  </p>
                </div>
              </div>

              <div className="mt-5 grid gap-4 md:grid-cols-3">
                <div className="rounded-xl border border-[#E8EAED] p-4">
                  <p className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wide text-[#5F6368]">
                    <Lock size={12} /> Permission
                  </p>
                  <p className="mt-2 text-[13px] leading-snug text-[#3C4043]">{s.permission}</p>
                </div>
                <div className="rounded-xl border border-[#E8EAED] p-4">
                  <p className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wide text-[#5F6368]">
                    <Plug size={12} /> Needs connecting
                  </p>
                  <ul className="mt-2 space-y-1">
                    {s.systems.map((x) => (
                      <li key={x} className="text-[13px] text-[#3C4043]">
                        {x}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="rounded-xl border border-[#E8EAED] p-4">
                  <p className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wide text-[#5F6368]">
                    <CheckCircle2 size={12} /> Outcome
                  </p>
                  <p className="mt-2 text-[13px] leading-snug text-[#3C4043]">{s.outcome}</p>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          <div className="mt-6 flex items-center justify-between border-t border-[#E8EAED] pt-4">
            <button
              onClick={() => setI((k) => Math.max(0, k - 1))}
              disabled={i === 0}
              className="flex items-center gap-1 rounded-full px-3 py-1.5 text-[13px] font-medium text-[#1A73E8] hover:bg-[#E8F0FE] disabled:opacity-30"
            >
              <ChevronLeft size={15} /> Previous
            </button>
            <span className="tabular-nums text-[12px] text-[#80868B]">
              {i + 1} / {JOURNEY.length}
            </span>
            <button
              onClick={() => setI((k) => Math.min(JOURNEY.length - 1, k + 1))}
              disabled={i === JOURNEY.length - 1}
              className="flex items-center gap-1 rounded-full px-3 py-1.5 text-[13px] font-medium text-[#1A73E8] hover:bg-[#E8F0FE] disabled:opacity-30"
            >
              Next <ChevronRight size={15} />
            </button>
          </div>
        </div>
      </div>
      <p className="mt-4 text-[12px] text-[#80868B]">
        Names, amounts, references and dates are invented for illustration. The systems listed are integration requirements, not
        claims that they exist in any particular city.
      </p>
    </Section>
  );
}
