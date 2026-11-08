"use client";

import { CartesianGrid, ResponsiveContainer, Scatter, ScatterChart, Tooltip, XAxis, YAxis, ZAxis, LabelList } from "recharts";
import { NARRATIVE } from "@/lib/under-the-hood/data";
import { ChartFrame, Cite, ClassBadge, PALETTE, Section } from "../ui";

export default function Verdict() {
  const v = NARRATIVE.verdict;
  const pts = v.positioning.points.map((p) => ({ ...p, z: p.size * 120 }));
  return (
    <Section id="verdict">
      <div className="uth-card" style={{ background: "var(--accent)", color: "#fff", borderColor: "var(--accent)" }}>
        <div className="uth-kicker" style={{ color: "rgba(255,255,255,.7)" }}>Overall assessment</div>
        <p style={{ fontFamily: "var(--serif)", fontSize: "clamp(22px,2.6vw,30px)", lineHeight: 1.25, margin: "8px 0 10px" }}>{v.headline}</p>
        <p style={{ margin: 0, color: "rgba(255,255,255,.86)", maxWidth: 920 }}>{v.assessment}</p>
      </div>

      <div className="uth-block">
        <h3 className="uth-h4">The five conclusions that matter</h3>
        <ol className="uth-g5">
          {v.conclusions.map((c, i) => (
            <li key={c.title} className="uth-card" style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <div style={{ fontFamily: "var(--serif)", fontSize: 30, color: "var(--accent)", lineHeight: 1 }}>{i + 1}</div>
              <div className="uth-h3" style={{ fontSize: 20 }}>{c.title}</div>
              <p className="uth-p" style={{ fontSize: 14.5 }}>{c.body}</p>
              <div style={{ marginTop: "auto" }}>{c.refs.map((r) => <Cite key={r} id={r} />)}</div>
            </li>
          ))}
        </ol>
      </div>

      <div className="uth-block uth-grid uth-g3">
        {([
          ["Three biggest strengths", v.strengths, "plus"],
          ["Three structural vulnerabilities", v.vulnerabilities, "minus"],
          ["Three competitive implications", v.implications, ""],
        ] as const).map(([title, items, cls]) => (
          <div key={title} className="uth-card">
            <h3 className="uth-h4">{title}</h3>
            <ul className={`uth-list ${cls}`}>
              {items.map((it) => (
                <li key={it.title}><span><strong style={{ color: "var(--ink)" }}>{it.title}.</strong> {it.body}</span></li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="uth-block uth-split">
        <div className="uth-card">
          <ChartFrame
            title="Where Anthropic sits today"
            summary="Analytical positioning map. Anthropic scores highest on frontier capability momentum in agentic work but mid-range on control of distribution; Google, Microsoft and AWS score high on distribution; open-weight ecosystems score low on distribution."
            rows={pts.map(({ name, x, y, size }) => ({ player: name, distributionControl: x, capabilityMomentum: y, scale: size }))}
            cols={[{ key: "player", label: "Player" }, { key: "distributionControl", label: "Distribution control (1–5)", num: true }, { key: "capabilityMomentum", label: "Capability momentum (1–5)", num: true }, { key: "scale", label: "Scale (1–5)", num: true }]}
            filename="uth-positioning.csv"
            note={<ClassBadge kind="inference" />}
          >
            <div style={{ height: 340 }}>
              <ResponsiveContainer width="100%" height="100%" initialDimension={{ width: 640, height: 300 }}>
                <ScatterChart margin={{ top: 16, right: 24, bottom: 28, left: 22 }}>
                  <CartesianGrid stroke={PALETTE.grid} />
                  <XAxis type="number" dataKey="x" domain={[1, 5]} ticks={[1, 2, 3, 4, 5]} name="Control of distribution" label={{ value: "Control of distribution & customer relationship →", position: "insideBottom", offset: -16, fill: PALETTE.muted, fontSize: 12 }} stroke={PALETTE.axis} />
                  <YAxis type="number" dataKey="y" domain={[1, 5]} ticks={[1, 2, 3, 4, 5]} name="Capability momentum" label={{ value: "Frontier agentic capability →", angle: -90, position: "insideLeft", offset: -6, fill: PALETTE.muted, fontSize: 12 }} stroke={PALETTE.axis} width={44} />
                  <ZAxis type="number" dataKey="z" range={[160, 900]} />
                  <Tooltip cursor={false} content={({ active, payload }) => active && payload?.[0] ? (
                    <div className="uth-tip"><div className="t">{String(payload[0].payload.name)}</div><div className="r"><span>Distribution</span><b>{String(payload[0].payload.x)}</b></div><div className="r"><span>Capability momentum</span><b>{String(payload[0].payload.y)}</b></div></div>) : null} />
                  <Scatter data={pts} fill={PALETTE.s1} fillOpacity={0.85} stroke="#fff" strokeWidth={2}>
                    <LabelList dataKey="name" position="top" offset={12} style={{ fill: PALETTE.ink, fontSize: 12, fontWeight: 600 }} />
                  </Scatter>
                </ScatterChart>
              </ResponsiveContainer>
            </div>
          </ChartFrame>
          <p className="uth-xs" style={{ marginTop: 8 }}>{v.positioning.note}</p>
        </div>
        <div className="uth-card sunk">
          <h3 className="uth-h4">How to read this site</h3>
          <p className="uth-p" style={{ fontSize: 14.5 }}>Every number is tagged. Click any blue page chip to see the verbatim filing text it comes from.</p>
          <ul className="uth-list" style={{ fontSize: 14 }}>
            <li><span><ClassBadge kind="reported" /> quoted from the S-1 or S-1/A (checked against the filing text).</span></li>
            <li><span><ClassBadge kind="calculated" /> our arithmetic on disclosed figures; formula shown.</span></li>
            <li><span><ClassBadge kind="inference" /> analytical judgment combining several disclosures.</span></li>
            <li><span><ClassBadge kind="assumption" /> scenario inputs — never presented as results.</span></li>
            <li><span><ClassBadge kind="hypothesis" /> speculative; listed with what would test it.</span></li>
          </ul>
          <hr className="uth-rule" />
          <p className="uth-small" style={{ margin: 0 }}>Periods matter: <b>Q3 2026</b> means the three months ended Sep 30, 2026. Commitments include contracts signed through Nov 2, 2026. The filing contains <b>no October operating data</b> — the Oct 31 run-rate is blank.</p>
        </div>
      </div>
    </Section>
  );
}
