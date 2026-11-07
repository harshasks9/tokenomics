"use client";

import { useState } from "react";
import { PolarAngleAxis, PolarGrid, PolarRadiusAxis, Radar, RadarChart, ResponsiveContainer, Tooltip } from "recharts";
import { MOAT } from "@/lib/under-the-hood/data";
import { ChartFrame, ClassBadge, ConfBadge, PALETTE, Section } from "../ui";

const PLAYER_COLORS: Record<string, string> = { Anthropic: PALETTE.s1, Google: PALETTE.s2, Microsoft: PALETTE.s3, AWS: PALETTE.s4, OpenAI: PALETTE.s7, "Open-weight": PALETTE.s5 };
const shade = (v: number) => ["#ffffff", "#e3eefb", "#c6dcf6", "#86b6ef", "#3987e5", "#1c5cab"][v];
const ink = (v: number) => (v >= 4 ? "#ffffff" : "#121417");

export default function Moat() {
  const players = MOAT._meta.players;
  const [cell, setCell] = useState<{ d: string; p: string }>({ d: MOAT.dimensions[0].id, p: "Anthropic" });
  const [shown, setShown] = useState<string[]>(["Anthropic", "Google", "OpenAI"]);
  const dim = MOAT.dimensions.find((d) => d.id === cell.d)!;
  const SHORT: Record<string, string> = { frontier: "Frontier models", coding: "Coding & agents", research: "Research velocity", inference: "Inference eff.", training: "Training eff.", compute: "Compute supply", distribution: "Distribution", developers: "Developers", trust: "Trust & safety", capital: "Capital access" };
  const radar = MOAT.dimensions.map((d) => ({ dim: SHORT[d.id] ?? d.dimension, ...d.scores }));
  const toggle = (p: string) => setShown((s) => (s.includes(p) ? s.filter((x) => x !== p) : s.length >= 3 ? [...s.slice(1), p] : [...s, p]));
  return (
    <Section id="moat">
      <div className="uth-card">
        <div className="uth-toolbar">
          <h3 className="uth-h4" style={{ margin: 0 }}>Moat heatmap — click a cell for evidence <ClassBadge kind="inference" /></h3>
          <span className="uth-xs">Rubric: {Object.entries(MOAT._meta.rubric).map(([k, v]) => `${k} = ${v}`).join(" · ")}</span>
        </div>
        <div className="uth-tablewrap">
          <table className="uth-table uth-heat" style={{ minWidth: 760 }}>
            <thead><tr><th>Dimension</th>{players.map((p) => <th key={p} className="num" style={{ textAlign: "center" }}>{p}</th>)}</tr></thead>
            <tbody>
              {MOAT.dimensions.map((d) => (
                <tr key={d.id}>
                  <td><strong>{d.dimension}</strong><div className="uth-xs">Durability: {d.durability}</div></td>
                  {players.map((p) => {
                    const v = d.scores[p];
                    const on = cell.d === d.id && cell.p === p;
                    return (
                      <td key={p} className="cell" role="button" tabIndex={0} aria-pressed={on} aria-label={`${p}, ${d.dimension}: ${v} of 5`}
                        style={{ background: shade(v), color: ink(v) }} onClick={() => setCell({ d: d.id, p })}
                        onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); setCell({ d: d.id, p }); } }}>{v}</td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="uth-xs" style={{ marginTop: 8 }}>{MOAT._meta.description}</p>
      </div>

      <div className="uth-block uth-split">
        <div className="uth-card" aria-live="polite">
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}><span className="uth-badge neutral">{dim.dimension}</span><span className="uth-badge neutral">{cell.p}: {dim.scores[cell.p]}/5</span><ConfBadge level={dim.confidence} /></div>
          <dl className="uth-kv" style={{ marginTop: 14 }}>
            <dt>Anthropic’s strongest evidence</dt><dd>{dim.anthropicEvidence}</dd>
            <dt>Best counterargument</dt><dd>{dim.counterargument}</dd>
            <dt>Durability</dt><dd>{dim.durability}</dd>
            <dt>Difficulty of replication</dt><dd>{dim.replicationDifficulty}</dd>
            <dt>What would erode it</dt><dd>{dim.whatErodes}</dd>
            <dt>Relative position</dt><dd>{players.map((p) => `${p} ${dim.scores[p]}`).join(" · ")}</dd>
          </dl>
          <hr className="uth-rule" />
          <p className="uth-small" style={{ margin: 0 }}><b>Three separate contests:</b> <i>model</i> competition (Anthropic, OpenAI, Google, open-weight), <i>application</i> competition (Claude Code/Cowork vs Copilot, Codex, Antigravity, Cursor, Workspace) and <i>infrastructure</i> competition (where Google, AWS and Microsoft win on Anthropic’s spend regardless). Scores above blend them by dimension; no player leads all three.</p>
        </div>
        <div className="uth-card">
          <ChartFrame
            title="Compare up to three players"
            summary="Radar comparison of analytical moat scores across ten dimensions for the selected players."
            legend={shown.map((p) => ({ label: p, color: PLAYER_COLORS[p] }))}
            rows={MOAT.dimensions.map((d) => ({ dimension: d.dimension, ...d.scores }))}
            cols={[{ key: "dimension", label: "Dimension" }, ...players.map((p) => ({ key: p, label: p, num: true }))]}
            filename="uth-moat-scores.csv"
            controls={<div className="uth-chips" role="group" aria-label="Players to compare">{players.map((p) => <button key={p} type="button" className="uth-chip" aria-pressed={shown.includes(p)} onClick={() => toggle(p)}>{p}</button>)}</div>}
            note={<ClassBadge kind="inference" />}
          >
            <div style={{ height: 360 }}>
              <ResponsiveContainer width="100%" height="100%" initialDimension={{ width: 640, height: 300 }}>
                <RadarChart data={radar} outerRadius="66%">
                  <PolarGrid stroke={PALETTE.grid} />
                  <PolarAngleAxis dataKey="dim" tick={{ fontSize: 10.5, fill: PALETTE.ink2 }} />
                  <PolarRadiusAxis domain={[0, 5]} tickCount={6} tick={{ fontSize: 9, fill: PALETTE.muted }} axisLine={false} />
                  <Tooltip />
                  {shown.map((p) => <Radar key={p} dataKey={p} name={p} stroke={PLAYER_COLORS[p]} fill={PLAYER_COLORS[p]} fillOpacity={0.1} strokeWidth={2} isAnimationActive={false} />)}
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </ChartFrame>
        </div>
      </div>
    </Section>
  );
}
