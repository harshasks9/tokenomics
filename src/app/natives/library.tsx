"use client";

import { useMemo, useState } from "react";
import { ArrowRight, Sparkles } from "lucide-react";
import { ALL_USE_CASES, COMPANIES, companyBySlug } from "./index";
import { ARCHETYPES } from "./data/archetypes";
import {
  APPLIC_META, AUDIENCE_META, ECON_META, GROUP_META, opportunityScore,
  type Applicability, type Audience, type EconType, type GroupId,
} from "./schema";
import { AudienceTag, Chip, EconTag, Expandable, Fade, Field, INK, LINE, MUTED, SectionHead, Note } from "./ui";
import type { ViewId } from "./app";

// ─── Use case library (archetypes) ──────────────────────────────────────────

export function UseCaseLibrary({ go }: { go: (v: ViewId, slug?: string) => void }) {
  return (
    <section className="max-w-[1180px] mx-auto px-5 md:px-8 py-10 md:py-14">
      <SectionHead
        kicker="Use case library"
        title="Five repeatable archetypes for Indian digital natives"
        lead="Synthesised from all fifty workflows — not by counting what appears most often, but by finding where market size, economic value, agentic suitability and repeatability intersect. Each one is a product you could build once and sell ten times."
      />

      <div className="space-y-3">
        {ARCHETYPES.map((a, i) => {
          const strong = Object.values(a.applies).filter((v) => v === "strong").length;
          return (
            <Fade key={a.id} delay={i * 0.04}>
              <Expandable accent={a.color}
                summary={
                  <div className="flex items-start gap-3.5">
                    <span className="w-8 h-8 rounded-xl flex items-center justify-center text-[13px] font-extrabold shrink-0"
                      style={{ backgroundColor: `${a.color}18`, color: a.color }}>{i + 1}</span>
                    <div className="min-w-0 flex-1">
                      <div className="text-[15px] font-extrabold leading-snug">{a.name}</div>
                      <p className="text-[12px] mt-1 leading-relaxed" style={{ color: MUTED }}>{a.promise}</p>
                      <div className="flex flex-wrap items-center gap-1.5 mt-2">
                        <EconTag econ={a.econ} />
                        <Chip color={a.color}>{strong} of 10 strong fit</Chip>
                        {a.channels.slice(0, 3).map((ch) => <Chip key={ch} color={MUTED}>{ch}</Chip>)}
                      </div>
                    </div>
                  </div>
                }>
                <div className="pt-4 grid lg:grid-cols-[1.3fr_1fr] gap-6">
                  <div className="space-y-4 min-w-0">
                    <Field label="Typical trigger">{a.trigger}</Field>
                    <div>
                      <div className="text-[9px] font-bold uppercase tracking-[0.14em] mb-2" style={{ color: MUTED }}>Typical workflow</div>
                      <div className="space-y-0">
                        {a.workflow.map((s, si) => (
                          <div key={s} className="flex gap-3">
                            <div className="flex flex-col items-center">
                              <span className="w-5 h-5 rounded-full text-[9px] font-bold flex items-center justify-center text-white shrink-0" style={{ backgroundColor: a.color }}>{si + 1}</span>
                              {si < a.workflow.length - 1 && <span className="w-px flex-1" style={{ backgroundColor: LINE }} />}
                            </div>
                            <div className="text-[12px] pb-3 leading-relaxed" style={{ color: INK }}>{s}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="rounded-xl p-4" style={{ backgroundColor: `${a.color}08`, border: `1px solid ${a.color}22` }}>
                      <div className="text-[9px] font-bold uppercase tracking-[0.14em] mb-1.5" style={{ color: a.color }}>What the customer experiences</div>
                      <p className="text-[12.5px] leading-relaxed italic" style={{ color: INK }}>{a.cx}</p>
                    </div>
                  </div>
                  <div className="space-y-4 min-w-0">
                    <div>
                      <div className="text-[9px] font-bold uppercase tracking-[0.14em] mb-1.5" style={{ color: MUTED }}>KPIs affected</div>
                      <div className="flex flex-wrap gap-1.5">{a.kpis.map((k) => <Chip key={k} color="#188038">{k}</Chip>)}</div>
                    </div>
                    <div>
                      <div className="text-[9px] font-bold uppercase tracking-[0.14em] mb-1.5" style={{ color: MUTED }}>Systems required</div>
                      <div className="flex flex-wrap gap-1.5">{a.systems.map((k) => <Chip key={k} color={MUTED}>{k}</Chip>)}</div>
                    </div>
                    <div>
                      <div className="text-[9px] font-bold uppercase tracking-[0.14em] mb-1.5" style={{ color: MUTED }}>Where it applies</div>
                      <div className="flex flex-wrap gap-1.5">
                        {COMPANIES.map((c) => {
                          const lvl = a.applies[c.slug] ?? "low";
                          return (
                            <button key={c.slug} onClick={() => go("companies", c.slug)}
                              className="text-[10px] font-semibold rounded-full px-2 py-1 border inline-flex items-center gap-1"
                              style={{ borderColor: lvl === "strong" ? `${APPLIC_META[lvl].color}66` : LINE, color: lvl === "low" ? MUTED : INK, opacity: lvl === "low" ? 0.55 : 1 }}>
                              <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: APPLIC_META[lvl].color }} />
                              {c.shortName}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                    <div className="rounded-xl border p-3.5" style={{ borderColor: LINE }}>
                      <div className="text-[9px] font-bold uppercase tracking-[0.14em] mb-1.5 flex items-center gap-1.5" style={{ color: MUTED }}>
                        <Sparkles size={10} /> Why this is possible now
                      </div>
                      <p className="text-[11.5px] leading-relaxed" style={{ color: INK }}>{a.whyNow}</p>
                    </div>
                  </div>
                </div>
              </Expandable>
            </Fade>
          );
        })}
      </div>

      {/* Applicability matrix */}
      <div className="mt-10">
        <SectionHead kicker="Applicability" title="Ten companies × five archetypes" lead="Where each archetype is a strong, partial or limited fit. Strong-fit cells are where a repeatable build finds its first ten customers." />
        <div className="rounded-2xl border bg-white overflow-hidden" style={{ borderColor: LINE }}>
          <div className="overflow-x-auto">
            <table className="w-full text-[11px] min-w-[760px]">
              <thead>
                <tr style={{ backgroundColor: "#FAFBFC" }}>
                  <th className="text-left px-4 py-3 font-bold sticky left-0 z-10" style={{ color: MUTED, backgroundColor: "#FAFBFC" }}>Company</th>
                  {ARCHETYPES.map((a) => (
                    <th key={a.id} className="px-2 py-3 font-bold text-center align-bottom" style={{ minWidth: 120 }}>
                      <span className="block text-[10px] leading-tight" style={{ color: a.color }}>{a.name}</span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y" style={{ borderColor: LINE }}>
                {COMPANIES.map((c) => (
                  <tr key={c.slug} className="hover:bg-[#FAFBFC]">
                    <td className="px-4 py-2.5 sticky left-0 bg-white z-10">
                      <button onClick={() => go("companies", c.slug)} className="text-left group">
                        <span className="text-[12px] font-bold flex items-center gap-2">
                          <span className="w-2 h-2 rounded-sm" style={{ backgroundColor: c.color }} />
                          <span className="group-hover:underline">{c.shortName}</span>
                        </span>
                      </button>
                    </td>
                    {ARCHETYPES.map((a) => {
                      const lvl: Applicability = a.applies[c.slug] ?? "low";
                      const m = APPLIC_META[lvl];
                      return (
                        <td key={a.id} className="px-2 py-2.5 text-center" title={`${a.name} — ${m.label}`}>
                          <span className="inline-flex items-center justify-center rounded-lg px-2.5 py-1"
                            style={{ backgroundColor: lvl === "strong" ? `${m.color}18` : lvl === "medium" ? `${m.color}12` : "transparent" }}>
                            <span className="rounded-full" style={{ width: lvl === "strong" ? 10 : lvl === "medium" ? 7 : 4, height: lvl === "strong" ? 10 : lvl === "medium" ? 7 : 4, backgroundColor: m.color }} />
                          </span>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="px-4 py-3 border-t flex flex-wrap gap-4" style={{ borderColor: LINE }}>
            {(Object.keys(APPLIC_META) as Applicability[]).map((k) => (
              <span key={k} className="inline-flex items-center gap-1.5 text-[10px]" style={{ color: MUTED }}>
                <span className="rounded-full" style={{ width: k === "strong" ? 10 : k === "medium" ? 7 : 4, height: k === "strong" ? 10 : k === "medium" ? 7 : 4, backgroundColor: APPLIC_META[k].color }} />
                {APPLIC_META[k].label}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Opportunity matrix (all 50, filterable) ────────────────────────────────

export function OpportunityMatrix({ go }: { go: (v: ViewId, slug?: string) => void }) {
  const [group, setGroup] = useState<string>("all");
  const [audience, setAudience] = useState<string>("all");
  const [econ, setEcon] = useState<string>("all");
  const [channel, setChannel] = useState<string>("all");
  const [minScore, setMinScore] = useState(0);
  const [maxComplexity, setMaxComplexity] = useState(5);

  const channels = useMemo(() => {
    const s = new Set<string>();
    for (const u of ALL_USE_CASES) for (const c of u.channels) s.add(c);
    return Array.from(s).sort();
  }, []);

  const rows = useMemo(
    () =>
      ALL_USE_CASES.filter((u) =>
        (group === "all" || u.company.group === group) &&
        (audience === "all" || u.audience === audience) &&
        (econ === "all" || u.econ === econ) &&
        (channel === "all" || u.channels.includes(channel)) &&
        u.score >= minScore &&
        (6 - u.scores.ease) <= maxComplexity,
      ).sort((a, b) => b.score - a.score),
    [group, audience, econ, channel, minScore, maxComplexity],
  );

  const Filter = ({ label, value, set, options }: { label: string; value: string; set: (v: string) => void; options: { v: string; l: string }[] }) => (
    <label className="block">
      <span className="text-[9px] font-bold uppercase tracking-[0.14em] block mb-1" style={{ color: MUTED }}>{label}</span>
      <select value={value} onChange={(e) => set(e.target.value)}
        className="text-[11.5px] rounded-lg border px-2.5 py-1.5 bg-white focus:outline-none min-w-[130px]" style={{ borderColor: LINE }}>
        {options.map((o) => <option key={o.v} value={o.v}>{o.l}</option>)}
      </select>
    </label>
  );

  return (
    <section className="max-w-[1180px] mx-auto px-5 md:px-8 py-10 md:py-14">
      <SectionHead kicker="Opportunity matrix" title="All fifty workflows, filtered your way" lead="Filter by business model, who the agent talks to, whether value comes from revenue or cost, channel, score, and deployment complexity." />

      <div className="rounded-2xl border bg-white p-4 mb-4 flex flex-wrap gap-3 items-end" style={{ borderColor: LINE }}>
        <Filter label="Business model" value={group} set={setGroup}
          options={[{ v: "all", l: "All models" }, ...(Object.keys(GROUP_META) as GroupId[]).filter((g) => COMPANIES.some((c) => c.group === g)).map((g) => ({ v: g, l: GROUP_META[g].label }))]} />
        <Filter label="Audience" value={audience} set={setAudience}
          options={[{ v: "all", l: "Everyone" }, ...(Object.keys(AUDIENCE_META) as Audience[]).map((a) => ({ v: a, l: AUDIENCE_META[a].label }))]} />
        <Filter label="Value type" value={econ} set={setEcon}
          options={[{ v: "all", l: "Revenue + cost" }, ...(Object.keys(ECON_META) as EconType[]).map((e) => ({ v: e, l: ECON_META[e].label }))]} />
        <Filter label="Channel" value={channel} set={setChannel}
          options={[{ v: "all", l: "Any channel" }, ...channels.map((c) => ({ v: c, l: c }))]} />
        <label className="block">
          <span className="text-[9px] font-bold uppercase tracking-[0.14em] block mb-1" style={{ color: MUTED }}>Min score {minScore}</span>
          <input type="range" min={0} max={90} step={5} value={minScore} onChange={(e) => setMinScore(Number(e.target.value))} className="w-28 accent-[#1A73E8]" />
        </label>
        <label className="block">
          <span className="text-[9px] font-bold uppercase tracking-[0.14em] block mb-1" style={{ color: MUTED }}>Max complexity {maxComplexity}</span>
          <input type="range" min={1} max={5} step={1} value={maxComplexity} onChange={(e) => setMaxComplexity(Number(e.target.value))} className="w-28 accent-[#1A73E8]" />
        </label>
        <div className="ml-auto text-[11px] font-bold" style={{ color: MUTED }}>{rows.length} of {ALL_USE_CASES.length}</div>
      </div>

      <div className="rounded-2xl border bg-white overflow-hidden" style={{ borderColor: LINE }}>
        <div className="overflow-x-auto">
          <table className="w-full text-[11.5px] min-w-[840px]">
            <thead>
              <tr style={{ backgroundColor: "#FAFBFC" }}>
                {["Company", "Workflow", "Audience", "Value", "Channels", "Complexity", "Score"].map((h) => (
                  <th key={h} className="text-left px-3 py-2.5 font-bold text-[10px] uppercase tracking-wider" style={{ color: MUTED }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y" style={{ borderColor: LINE }}>
              {rows.map((u) => (
                <tr key={u.id} className="hover:bg-[#FAFBFC] align-top">
                  <td className="px-3 py-2.5">
                    <button onClick={() => go("companies", u.company.slug)} className="text-[11.5px] font-bold hover:underline whitespace-nowrap flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-sm shrink-0" style={{ backgroundColor: u.company.color }} />{u.company.shortName}
                    </button>
                  </td>
                  <td className="px-3 py-2.5 max-w-[300px]">
                    <div className="font-semibold leading-snug">{u.name}</div>
                    {u.rank === 1 && <span className="text-[9px] font-bold uppercase tracking-wider" style={{ color: u.company.color }}>Hero</span>}
                  </td>
                  <td className="px-3 py-2.5"><AudienceTag audience={u.audience} /></td>
                  <td className="px-3 py-2.5"><EconTag econ={u.econ} /></td>
                  <td className="px-3 py-2.5"><span style={{ color: MUTED }}>{u.channels.slice(0, 3).join(", ")}</span></td>
                  <td className="px-3 py-2.5">
                    <span className="inline-flex gap-0.5">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <span key={i} className="w-2.5 h-1.5 rounded-sm" style={{ backgroundColor: i <= (6 - u.scores.ease) ? "#D97706" : LINE }} />
                      ))}
                    </span>
                  </td>
                  <td className="px-3 py-2.5"><b className="tabular-nums" style={{ color: u.company.color }}>{u.score}</b></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {rows.length === 0 && <div className="text-center py-12 text-[12px]" style={{ color: MUTED }}>No workflows match these filters.</div>}
      </div>

      <div className="mt-4">
        <Note>
          Complexity is the inverse of ease of deployment: five bars means the agent needs write access to money-movement, ledger or
          supplier systems, or operates where regulation limits autonomy. Score is the weighted blend of economic impact (28%), agentic
          suitability (22%), interaction volume (20%), strategic differentiation (16%) and ease (14%).
        </Note>
      </div>
    </section>
  );
}
