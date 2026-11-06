"use client";

import { Check } from "lucide-react";
import { LIFECYCLE } from "@/lib/asset-factory/journey";
import type { PersonaId } from "@/lib/asset-factory/types";
import { PERSONA_NAME } from "./ui";

/** The shared Gemini 10 lifecycle: every persona participates; one leads each stage. */
export default function Lifecycle({ stage, compact }: { stage: number; compact?: boolean }) {
  return (
    <ol className="af-life" aria-label="Shared Gemini 10 customer journey" style={{ listStyle: "none", padding: 0, margin: 0 }}>
      {LIFECYCLE.map((s, i) => {
        const state = i < stage ? "done" : i === stage ? "current" : "";
        const lead = s.lead as PersonaId;
        return (
          <li key={s.id} className={`af-life-step ${state}`} aria-current={i === stage ? "step" : undefined}>
            <div className="af-life-n">
              <span>{i + 1}</span>
              {i < stage ? <Check size={13} color="var(--ok)" /> : <span className="af-dot" data-p={lead} title={`${PERSONA_NAME[lead]} leads`} />}
            </div>
            <div className="af-life-label">{s.label}</div>
            {!compact && <div className="af-life-line">{s.line}</div>}
          </li>
        );
      })}
    </ol>
  );
}
