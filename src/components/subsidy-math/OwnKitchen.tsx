"use client";

import { waterfall } from "@/lib/subsidy-math/model";
import { baseRoute, BASE_FUNDING } from "@/lib/subsidy-math/params";
import { Explain, fmt$, Tag, useTip } from "./ui";

/** Section: vertical integration — how much of $100 each structure keeps, and what it costs to own the kitchen. */
export default function OwnKitchen() {
  const none = { pct: 0, ...BASE_FUNDING };
  const g = baseRoute("vertex-gemini");
  const gw = waterfall(g, none);
  const az = baseRoute("azure-openai");
  const bars = [
    { key: "aws", label: "AWS selling Claude", value: waterfall(baseRoute("bedrock-claude"), none).cloudContribution, color: "var(--aws)", note: "seller's fee + a little compute margin" },
    { key: "gc", label: "Google selling Claude", value: waterfall(baseRoute("vertex-claude"), none).cloudContribution, color: "var(--google)", note: "same terms as AWS" },
    { key: "azold", label: "Azure selling OpenAI (before Apr 2026)", value: waterfall({ ...az, revenueShare: 0.2 }, none).cloudContribution, color: "var(--msft)", note: "paid OpenAI ~20%" },
    { key: "az", label: "Azure selling OpenAI (now)", value: waterfall(az, none).cloudContribution, color: "var(--msft)", note: "royalty-free licence to 2032" },
    { key: "gem", label: "Google selling Gemini — after model cost", value: gw.cloudEconomic, color: "var(--google)", note: "charged 25% for building Gemini" },
    { key: "gem0", label: "Google selling Gemini — before model cost", value: gw.cloudContribution, color: "var(--google)", note: "own model, own chips" },
  ];
  const max = 100;
  const { node, setTip } = useTip();
  return (
    <>
      <div className="sm-panel">
        <h3>Of $100 at list price, how much does the cloud keep before any coupon?</h3>
        <div className="sm-rel" style={{ display: "grid", gap: 10, marginTop: 12 }}>
          {bars.map((b) => (
            <div key={b.key} style={{ display: "grid", gridTemplateColumns: "minmax(140px, 260px) 1fr", gap: 12, alignItems: "center" }}>
              <div style={{ fontSize: 14 }}>{b.label}<div className="sm-src">{b.note}</div></div>
              <div style={{ background: "var(--sunk)", borderRadius: 6, height: 28, position: "relative" }}
                onMouseMove={(e) => { const r = (e.currentTarget.parentElement?.parentElement as HTMLElement).getBoundingClientRect(); setTip({ x: e.clientX - r.left, y: e.clientY - r.top, html: <span>{b.label}: <b>{fmt$(b.value, 1)}</b> of $100</span> }); }}
                onMouseLeave={() => setTip(null)}>
                <div style={{ width: `${(Math.max(0, b.value) / max) * 100}%`, background: b.color, height: "100%", borderRadius: "0 4px 4px 0" }} />
                <span style={{ position: "absolute", left: `calc(${(Math.max(0, b.value) / max) * 100}% + 8px)`, top: 4, fontWeight: 700, fontSize: 13, fontVariantNumeric: "tabular-nums" }}>{fmt$(b.value)}</span>
              </div>
            </div>
          ))}
          {node}
        </div>
        <p className="sm-caveat">Base-case assumptions, year one, 10% negotiated discount, after chips, power and selling costs. Google&apos;s 25% charge for building Gemini is our assumption <Tag b="A" /> between two anchors: ~6% if Alphabet&apos;s model-development spend ($24.7B a year) is spread over all its revenue, ~58% if Gemini had to pay its way like a stand-alone lab <Tag b="C" />.</p>
      </div>

      <div className="sm-grid c2" style={{ marginTop: 16 }}>
        <div className="sm-card">
          <h3>What owning the whole kitchen buys</h3>
          <ul style={{ margin: 0, paddingLeft: 18, fontSize: 15, color: "var(--ink-2)" }}>
            <li><b>No royalty</b> — the model&apos;s owner keeps the whole price.</li>
            <li><b>Own chips</b> — TPUs skip NVIDIA&apos;s ~75% gross margin <Tag b="D" />; independent estimates put TPU running costs ~30% below GPUs <Tag b="R" />.</li>
            <li><b>Tune everything together</b> — chips, software and model designed as one.</li>
            <li><b>Price freedom</b> — a bigger slice means room for bigger, longer deals.</li>
            <li><b>Many ways to earn</b> — the same model powers Search, Workspace, Android and Cloud.</li>
          </ul>
        </div>
        <div className="sm-card">
          <h3>What it costs — and who else has it</h3>
          <ul style={{ margin: 0, paddingLeft: 18, fontSize: 15, color: "var(--ink-2)" }}>
            <li><b>No royalty ≠ free.</b> Alphabet spends ~$25B a year on model development, booked outside Google Cloud&apos;s 36% margin <Tag b="D" />.</li>
            <li><b>Custom chips aren&apos;t margin-free</b> — Broadcom designs TPUs and takes a cut <Tag b="R" />.</li>
            <li><b>AWS has its own chips too</b> — &ldquo;most Bedrock usage runs on Trainium&rdquo;, says Amazon <Tag b="R" />.</li>
            <li><b>Microsoft now has a royalty-free frontier model</b> through 2032 — without paying to train it <Tag b="R" />.</li>
            <li><b>The cost edge hasn&apos;t won the market yet</b> — a survey puts Gemini at 9% of enterprise API spend vs Anthropic&apos;s 55% <Tag b="R" />.</li>
          </ul>
        </div>
      </div>
      <Explain>
        <b>Bottom line:</b> Google keeps more of a Gemini dollar than AWS keeps of a Claude dollar — that part is arithmetic. Whether Gemini is <i>more profitable overall</i> depends on how much model-building cost you charge it, and nobody outside Google can see that number. Microsoft&apos;s April 2026 deal gives it much of the same advantage on OpenAI models.
      </Explain>
    </>
  );
}
