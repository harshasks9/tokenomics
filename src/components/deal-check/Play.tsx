"use client";

import type { GeminiPlay, Inputs } from "@/lib/deal-check/engine";
import { usd } from "@/lib/deal-check/format";
import Tip from "./Tip";

export default function Play({ inputs, play, onChange }: { inputs: Inputs; play: GeminiPlay; onChange: (p: Partial<Inputs>) => void }) {
  const rec = play.minShare;
  return (
    <div className="dc-play">
      <p className="lead">
        Serve part of the traffic with Gemini and keep the rest on Anthropic via marketplace with credits. The Gemini share lowers the Anthropic bill one-for-one and the total model bill by the cost gap, while the Anthropic remainder still earns the offer&apos;s credits and the Gemini spend gives those credits somewhere to go. <Tip id="gemini" />
      </p>
      <div className="dc-play-grid">
        <div className="dc-stat">
          <div className="k">Recommended Gemini share</div>
          <div className="v">{rec === null ? "None" : `${rec.toFixed(0)}%`}</div>
          <div className="s">{rec === null ? "Google cannot beat AWS at any share with these assumptions." : rec === 0 ? "Google already beats AWS with no Gemini offload." : `Smallest share at which Google beats AWS${play.advantageAtMin !== null ? ` (advantage turns positive from here)` : ""}.`}</div>
          {rec !== null && rec > 0 && Math.abs(rec - inputs.geminiShare) > 0.5 && (
            <button className="dc-btn primary" style={{ marginTop: 8 }} onClick={() => onChange({ geminiShare: Math.ceil(rec) })}>Apply {Math.ceil(rec)}%</button>
          )}
        </div>
        <div className="dc-stat">
          <div className="k">At the current {inputs.geminiShare}%</div>
          <div className="v">{usd(Math.abs(play.advantageNow))}</div>
          <div className="s">{play.winsNow ? "Google ahead of AWS" : "AWS ahead of Google"}. Anthropic bill −{play.anthropicCut.toFixed(0)}%, total model bill −{play.billCut.toFixed(0)}% at {inputs.geminiCostRatio}% Gemini cost.</div>
        </div>
        <div className="dc-stat">
          <div className="k">Tune the share</div>
          <div className="ctl" style={{ display: "grid", gridTemplateColumns: "1fr 72px", gap: 8, alignItems: "center", marginTop: 6 }}>
            <input type="range" min={0} max={100} step={5} value={inputs.geminiShare} onChange={(e) => onChange({ geminiShare: Number(e.target.value) })} aria-label="Gemini share" />
            <input className="dc-num" type="number" min={0} max={100} step={5} value={inputs.geminiShare} onChange={(e) => onChange({ geminiShare: Number(e.target.value) })} aria-label="Gemini share value" />
          </div>
          <div className="s">Cost ratio and the rest of the assumptions live in the panel on the left.</div>
        </div>
      </div>
    </div>
  );
}
