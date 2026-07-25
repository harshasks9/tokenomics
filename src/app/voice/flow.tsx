"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { FLOWS, OPERATING_MODELS } from "./flows";

// ─── Roles + impact strip below the cinema ──────────────────────────────────

export function FlowContext({ slug, accent }: { slug: string; accent: string }) {
  const flow = FLOWS.find((f) => f.slug === slug);
  if (!flow) return null;
  const roles: { title: string; text: string; color: string }[] = [
    { title: "Gemini Enterprise Agent Platform", text: flow.roles.geap, color: accent },
    { title: "Customer Engagement Suite (GECX)", text: flow.roles.gecx, color: "#D97706" },
    { title: "Tilicho Labs — communications & implementation", text: flow.roles.partner, color: "#00838F" },
    { title: "Human oversight", text: flow.roles.human, color: "#5F6368" },
  ];
  return (
    <div className="mt-6 grid lg:grid-cols-2 gap-4">
      <div className="rounded-2xl border border-[#E8EAED] bg-white p-5">
        <div className="text-[10px] font-bold uppercase tracking-widest text-[#5F6368] mb-3">One integrated solution — clear ownership</div>
        <div className="space-y-3">
          {roles.map((r) => (
            <div key={r.title} className="border-l-2 pl-3" style={{ borderColor: r.color }}>
              <div className="text-xs font-extrabold" style={{ color: r.color }}>{r.title}</div>
              <p className="text-[11px] text-[#5F6368] mt-0.5 leading-relaxed">{r.text}</p>
            </div>
          ))}
        </div>
      </div>
      <div className="space-y-4">
        <div className="rounded-2xl border border-[#E8EAED] bg-white p-5">
          <div className="text-[10px] font-bold uppercase tracking-widest text-[#5F6368] mb-2">Customer & employee impact</div>
          <p className="text-[11px] text-[#202124] leading-relaxed"><span className="font-bold">Customers:</span> {flow.impact.customer}</p>
          <p className="text-[11px] text-[#202124] leading-relaxed mt-2"><span className="font-bold">Employees:</span> {flow.impact.employee}</p>
        </div>
        <div className="rounded-2xl border border-[#E8EAED] bg-white p-5">
          <div className="text-[10px] font-bold uppercase tracking-widest text-[#5F6368] mb-2">Value drivers · differentiators</div>
          <div className="flex flex-wrap gap-1.5">
            {flow.valueDrivers.map((d) => (
              <span key={d} className="text-[10px] font-medium rounded-full px-2.5 py-1" style={{ backgroundColor: `${accent}10`, color: accent }}>{d}</span>
            ))}
            {flow.differentiators.map((d) => (
              <span key={d} className="text-[10px] font-medium rounded-full px-2.5 py-1 border border-[#E8EAED] text-[#5F6368]">{d}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Operating model comparison ─────────────────────────────────────────────

export function OperatingModelCompare({ accent }: { accent: string }) {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <div>
      {/* Desktop table */}
      <div className="hidden lg:block overflow-hidden rounded-2xl border border-[#E8EAED]">
        <table className="w-full text-xs bg-white">
          <thead>
            <tr className="text-left text-[10px] uppercase tracking-wider">
              <th className="px-4 py-3 font-bold text-[#5F6368] bg-[#F8F9FA] w-[16%]">Dimension</th>
              <th className="px-4 py-3 font-bold text-[#B3261E] bg-[#B3261E]/5 w-[28%]">Conventional operating model</th>
              <th className="px-4 py-3 font-bold text-[#B26A00] bg-[#FEF7E0]/60 w-[28%]">Point solutions / partial automation</th>
              <th className="px-4 py-3 font-bold text-white w-[28%]" style={{ backgroundColor: accent }}>Agentic model on Google Cloud + Tilicho Labs</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#F1F3F4]">
            {OPERATING_MODELS.map((r) => (
              <tr key={r.dimension} className="align-top hover:bg-[#FAFBFC]">
                <td className="px-4 py-3 font-bold text-[#202124]">{r.dimension}</td>
                <td className="px-4 py-3 text-[#5F6368]">{r.conventional}</td>
                <td className="px-4 py-3 text-[#5F6368]">{r.point}</td>
                <td className="px-4 py-3 font-medium text-[#202124]" style={{ backgroundColor: `${accent}06` }}>{r.agentic}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Mobile accordion */}
      <div className="lg:hidden rounded-2xl border border-[#E8EAED] bg-white divide-y divide-[#F1F3F4] overflow-hidden">
        {OPERATING_MODELS.map((r, i) => (
          <div key={r.dimension}>
            <button className="w-full flex items-center justify-between px-4 py-3 text-left text-xs font-bold text-[#202124]" onClick={() => setOpen(open === i ? null : i)}>
              {r.dimension}
              <ChevronDown size={14} className={`text-[#9AA0A6] transition-transform ${open === i ? "rotate-180" : ""}`} />
            </button>
            {open === i && (
              <div className="px-4 pb-4 space-y-2 text-[11px]">
                <p><span className="font-bold text-[#B3261E]">Conventional:</span> <span className="text-[#5F6368]">{r.conventional}</span></p>
                <p><span className="font-bold text-[#B26A00]">Point solutions:</span> <span className="text-[#5F6368]">{r.point}</span></p>
                <p><span className="font-bold" style={{ color: accent }}>Agentic:</span> <span className="text-[#202124]">{r.agentic}</span></p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
