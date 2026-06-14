"use client";

import { ArrowRight, CheckCircle2, Scale, ShieldCheck, TrendingDown } from "lucide-react";
import { APPROACH_META } from "@/lib/agent-economics/approaches";
import type { DecisionBrief as Brief } from "@/lib/agent-economics/types";

export default function DecisionBrief({ brief }: { brief: Brief }) {
  const winner = APPROACH_META[brief.winner];
  const runner = APPROACH_META[brief.runnerUp];
  return (
    <div className="mt-8 overflow-hidden rounded-3xl border border-slate-800 bg-slate-950 text-white shadow-xl">
      <div className="grid lg:grid-cols-[1.15fr_0.85fr]">
        <div className="p-7 md:p-9">
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-blue-300">Decision brief</p>
          <div className="flex items-start gap-3"><CheckCircle2 className="mt-1 flex-none" size={24} style={{ color: winner.color }} /><div><h3 className="text-2xl font-extrabold">{brief.headline}</h3><p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate-300">{brief.rationale}</p></div></div>
          <div className="mt-7 grid gap-3 sm:grid-cols-3">
            <Driver icon={TrendingDown} label="Economic driver" text={brief.economicDriver} />
            <Driver icon={ShieldCheck} label="Architecture driver" text={brief.architectureDriver} />
            <Driver icon={Scale} label="Tradeoff" text={brief.tradeoff} />
          </div>
        </div>
        <div className="border-t border-white/10 bg-white/5 p-7 md:p-9 lg:border-l lg:border-t-0">
          <p className="text-xs font-bold uppercase tracking-wide text-slate-400">Runner-up</p>
          <div className="mt-2 flex items-center gap-2 text-lg font-bold" style={{ color: runner.color }}>{runner.shortName}<ArrowRight size={16} /><span className="text-sm text-slate-400">when assumptions move</span></div>
          <p className="mt-6 text-xs font-bold uppercase tracking-wide text-slate-400">What could flip the answer</p>
          <ol className="mt-3 space-y-3">{brief.flipConditions.map((condition, index) => <li key={condition} className="flex gap-3 text-xs leading-relaxed text-slate-300"><span className="flex h-5 w-5 flex-none items-center justify-center rounded-full bg-white/10 text-[10px] font-bold">{index + 1}</span>{condition}</li>)}</ol>
        </div>
      </div>
    </div>
  );
}

function Driver({ icon: Icon, label, text }: { icon: typeof Scale; label: string; text: string }) {
  return <div className="rounded-2xl border border-white/10 bg-white/5 p-4"><Icon size={16} className="text-blue-300" /><p className="mt-3 text-[10px] font-bold uppercase tracking-wide text-slate-400">{label}</p><p className="mt-1 text-xs leading-relaxed text-slate-200">{text}</p></div>;
}
