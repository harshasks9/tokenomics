"use client";

import { CAPABILITIES, PILLARS, ESSENTIAL_COUNT, type Pillar } from "@/lib/capabilities";
import { useState } from "react";
import { Info } from "lucide-react";

const PILLAR_COLOR: Record<Pillar, string> = {
  Build:    "#1A73E8",
  Scale:    "#188038",
  Govern:   "#E11D48",
  Optimize: "#E37400",
};

const ENTITLEMENT_CHIP: Record<string, { label: string; bg: string; text: string }> = {
  "seat":         { label: "Seat",         bg: "#E8F0FE", text: "#1A73E8" },
  "metered":      { label: "Metered",      bg: "#FEF9C3", text: "#92400E" },
  "config":       { label: "Config",       bg: "#F0FDF4", text: "#166534" },
  "custom":       { label: "Custom build", bg: "#FDF2F8", text: "#9D174D" },
  "license":      { label: "License",      bg: "#F3E8FF", text: "#6B21A8" },
  "seat+config":  { label: "Seat + Config",bg: "#E8F0FE", text: "#1A73E8" },
  "metered+config":{ label: "Metered + Config", bg: "#FEF9C3", text: "#92400E" },
  "seat+metered": { label: "Seat + Metered", bg: "#E8F0FE", text: "#1A73E8" },
};

const TAG_STYLE: Record<string, { bg: string; text: string }> = {
  VERIFIED:    { bg: "#E6F4EA", text: "#137333" },
  ASSUMPTION:  { bg: "#FEF9C3", text: "#7A4F00" },
  UNCONFIRMED: { bg: "#FCE8E6", text: "#C5221F" },
};

function EntitlementChip({ value }: { value: string }) {
  const meta = ENTITLEMENT_CHIP[value] ?? { label: value, bg: "#F3F4F6", text: "#374151" };
  return (
    <span className="inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold"
      style={{ backgroundColor: meta.bg, color: meta.text }}>
      {meta.label}
    </span>
  );
}

function CapabilityRow({ cap }: { cap: typeof CAPABILITIES[number] }) {
  const [showNote, setShowNote] = useState(false);
  const tagStyle = TAG_STYLE[cap.evidenceTag];

  return (
    <div className="group relative">
      <div className="flex items-start gap-3 rounded-lg border border-gray-100 bg-white p-3 hover:border-gray-200 transition-colors">
        {/* Essential badge */}
        <div className="flex-none pt-0.5">
          {cap.essential ? (
            <span className="inline-block h-2 w-2 rounded-full bg-red-500" title="Essential for governed production" />
          ) : (
            <span className="inline-block h-2 w-2 rounded-full bg-gray-200" title="Use-case dependent" />
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-semibold text-gray-800">{cap.fn}</span>
            {cap.essential && (
              <span className="rounded-full bg-red-50 px-1.5 py-0.5 text-[9px] font-bold text-red-700 uppercase tracking-wide">Essential</span>
            )}
            <span className="rounded-full bg-gray-100 px-1.5 py-0.5 text-[9px] font-medium text-gray-500 uppercase tracking-wide">{cap.reuse}</span>
          </div>
          <div className="mt-1.5 flex flex-wrap gap-1 items-center">
            <span className="text-[10px] text-gray-400 mr-0.5">GEAP:</span>
            <EntitlementChip value={cap.gep} />
          </div>
        </div>

        {/* Evidence tag + info button */}
        <div className="flex items-center gap-1.5 flex-none">
          <span className="rounded-full px-1.5 py-0.5 text-[9px] font-bold"
            style={{ backgroundColor: tagStyle.bg, color: tagStyle.text }}>
            {cap.evidenceTag}
          </span>
          <button
            onClick={() => setShowNote(!showNote)}
            className="rounded-full p-0.5 text-gray-300 hover:text-gray-500 transition-colors"
            aria-label="Show research note">
            <Info size={12} />
          </button>
        </div>
      </div>
      {showNote && (
        <div className="mt-1 ml-7 rounded-lg bg-gray-50 border border-gray-100 px-3 py-2 text-[11px] text-gray-600 leading-relaxed">
          {cap.note}
        </div>
      )}
    </div>
  );
}

export default function AgentEconFunctionTaxonomy() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-base font-bold text-gray-900 mb-1">Beyond the model — what functions does production require?</h3>
        <p className="text-sm text-gray-500 mb-3">
          {ESSENTIAL_COUNT} of {CAPABILITIES.length} functions are essential for governed production agents
          regardless of approach — every platform must provide them; the question is who builds and operates them.
        </p>
        <div className="flex flex-wrap gap-3 text-xs text-gray-500">
          <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-red-500 inline-block" /> Essential (required)</span>
          <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-gray-300 inline-block" /> Use-case dependent</span>
          <span className="flex items-center gap-1.5"><span className="inline-block w-3 h-3 rounded-sm bg-[#E8F0FE]" /> Seat = paid-seat entitlement</span>
          <span className="flex items-center gap-1.5"><span className="inline-block w-3 h-3 rounded-sm bg-[#FEF9C3]" /> Metered = separately billed service</span>
          <span className="flex items-center gap-1.5"><span className="inline-block w-3 h-3 rounded-sm bg-[#F3E8FF]" /> License / Custom = external product or eng work</span>
        </div>
      </div>

      {PILLARS.map((pillar) => {
        const caps = CAPABILITIES.filter((c) => c.pillar === pillar);
        const color = PILLAR_COLOR[pillar];
        return (
          <div key={pillar}>
            <div className="flex items-center gap-2 mb-2">
              <span className="h-0.5 w-4 rounded-full" style={{ backgroundColor: color }} />
              <span className="text-xs font-bold uppercase tracking-widest" style={{ color }}>{pillar}</span>
            </div>
            <div className="space-y-1.5">
              {caps.map((cap) => (
                <CapabilityRow key={cap.id} cap={cap} />
              ))}
            </div>
          </div>
        );
      })}

      <p className="text-[11px] text-gray-400 italic pt-2 border-t border-gray-100">
        GEAP = Google Enterprise Agent Platform. Equivalent platforms: AWS AgentCore/Bedrock, Azure AI Foundry.
        Click ⓘ on any row to see the research note and evidence tag.
      </p>
    </div>
  );
}
