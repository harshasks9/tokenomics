"use client";

import { useMemo, useState } from "react";
import { Award, MessageSquareQuote, Rocket, Search, Zap } from "lucide-react";
import { COMPANIES, companyBySlug, heroUseCase, scoreOf } from "./index";
import { SCORE_LABELS, opportunityScore, type Company, type UseCase } from "./schema";
import {
  AudienceTag, Chip, EconTag, EvidenceTag, Expandable, Fade, Field, INK, LINE, MUTED,
  ScoreBars, ScoreRing, SectionHead, SourceLinks,
} from "./ui";

export function CompanyExplorer({ focus, setFocus }: { focus: string | null; setFocus: (s: string) => void }) {
  const [q, setQ] = useState("");
  const active = companyBySlug(focus ?? "") ?? COMPANIES[0];
  const list = useMemo(
    () => COMPANIES.filter((c) => q === "" || c.name.toLowerCase().includes(q.toLowerCase()) || c.category.toLowerCase().includes(q.toLowerCase())),
    [q],
  );

  return (
    <section className="max-w-[1180px] mx-auto px-5 md:px-8 py-10 md:py-14">
      <SectionHead kicker="Company explorer" title="Ten operating models, fifty workflows" lead="Select a company for its snapshot, ranked opportunities, hero workflow, discovery questions and recommended pilot." />

      <div className="grid lg:grid-cols-[250px_1fr] gap-6 items-start">
        {/* Selector */}
        <div className="lg:sticky lg:top-24 space-y-2">
          <div className="relative">
            <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: MUTED }} />
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Find a company"
              className="w-full text-[12px] rounded-full border pl-8 pr-3 py-2 bg-white focus:outline-none" style={{ borderColor: LINE }} />
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-1 gap-1.5">
            {list.map((c) => {
              const on = c.slug === active.slug;
              return (
                <button key={c.slug} onClick={() => setFocus(c.slug)}
                  className="text-left rounded-xl border px-3 py-2.5 transition-all flex items-center justify-between gap-2"
                  style={on ? { borderColor: c.color, backgroundColor: `${c.color}0C` } : { borderColor: LINE, backgroundColor: "#fff" }}>
                  <span className="min-w-0">
                    <span className="text-[12.5px] font-bold block truncate" style={{ color: on ? c.color : INK }}>{c.shortName}</span>
                    <span className="text-[10px] block truncate" style={{ color: MUTED }}>{c.category}</span>
                  </span>
                  <span className="text-[11px] font-extrabold tabular-nums shrink-0" style={{ color: on ? c.color : MUTED }}>{scoreOf(c)}</span>
                </button>
              );
            })}
          </div>
        </div>

        <CompanyPanel company={active} />
      </div>
    </section>
  );
}

function CompanyPanel({ company: c }: { company: Company }) {
  const hero = heroUseCase(c);
  const ranked = [...c.useCases].sort((a, b) => a.rank - b.rank);
  const allChannels = Array.from(new Set(c.useCases.flatMap((u) => u.channels)));
  const allSystems = Array.from(new Set(c.useCases.flatMap((u) => u.systems)));

  return (
    <div className="space-y-5 min-w-0">
      {/* Header */}
      <div className="rounded-2xl border bg-white overflow-hidden" style={{ borderColor: LINE }}>
        <div className="px-6 pt-6 pb-5" style={{ background: `linear-gradient(135deg, ${c.color}0F, transparent 60%)` }}>
          <div className="flex items-start justify-between gap-5 flex-wrap">
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2.5">
                <span className="w-3 h-3 rounded" style={{ backgroundColor: c.color }} />
                <h3 className="text-[26px] font-extrabold tracking-tight leading-none">{c.name}</h3>
              </div>
              <div className="text-[11px] font-semibold uppercase tracking-[0.14em] mt-2" style={{ color: c.color }}>{c.category}</div>
              <p className="text-[13.5px] mt-3 leading-relaxed max-w-2xl" style={{ color: MUTED }}>{c.oneLiner}</p>
            </div>
            <div className="text-center shrink-0">
              <ScoreRing score={scoreOf(c)} size={62} color={c.color} />
              <div className="text-[9px] font-bold uppercase tracking-wider mt-1.5" style={{ color: MUTED }}>Opportunity score</div>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-2.5 mt-5">
            {c.snapshot.map((s) => (
              <div key={s.label} className="rounded-xl border bg-white px-3 py-2.5" style={{ borderColor: LINE }}>
                <div className="flex items-center gap-1.5 mb-1">
                  <span className="text-[9px] font-bold uppercase tracking-wider truncate" style={{ color: MUTED }}>{s.label}</span>
                  <EvidenceTag kind={s.kind} />
                </div>
                <div className="text-[13px] font-extrabold leading-tight">{s.value}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="px-6 py-5 border-t grid md:grid-cols-2 gap-5" style={{ borderColor: LINE }}>
          <div>
            <Field label="Why it belongs in the top ten">{c.whyTop10}</Field>
          </div>
          <div>
            <Field label="Why this account matters for agentic communications" color={c.color}>{c.whyItMatters}</Field>
          </div>
        </div>
        <div className="px-6 pb-5">
          <div className="text-[9px] font-bold uppercase tracking-[0.14em] mb-2" style={{ color: MUTED }}>What the research shows</div>
          <div className="space-y-2">
            {c.context.map((f) => (
              <div key={f.text.slice(0, 40)} className="flex gap-2 items-start">
                <EvidenceTag kind={f.kind} />
                <p className="text-[12px] leading-relaxed flex-1" style={{ color: INK }}>
                  {f.text}
                  {typeof f.source === "number" && c.sources[f.source] && (
                    <a href={c.sources[f.source].url} target="_blank" rel="noopener noreferrer"
                      className="ml-1 font-mono text-[9px] align-super hover:underline" style={{ color: MUTED }}>[{f.source + 1}]</a>
                  )}
                </p>
              </div>
            ))}
          </div>
          <div className="mt-3 pt-3 border-t" style={{ borderColor: LINE }}>
            <SourceLinks sources={c.sources} />
          </div>
        </div>
      </div>

      {/* Hero use case */}
      <div className="rounded-2xl border-2 overflow-hidden" style={{ borderColor: `${c.color}55` }}>
        <div className="px-5 py-2.5 flex items-center gap-2" style={{ backgroundColor: `${c.color}12` }}>
          <Award size={13} style={{ color: c.color }} />
          <span className="text-[10px] font-bold uppercase tracking-[0.16em]" style={{ color: c.color }}>Hero use case</span>
          <span className="ml-auto text-[11px] font-extrabold tabular-nums" style={{ color: c.color }}>{opportunityScore(hero)}/100</span>
        </div>
        <div className="bg-white p-5">
          <UseCaseBody u={hero} color={c.color} />
        </div>
      </div>

      {/* Ranked opportunities */}
      <div>
        <div className="text-[10px] font-bold uppercase tracking-[0.16em] mb-2.5" style={{ color: MUTED }}>All five opportunities, ranked</div>
        <div className="space-y-2">
          {ranked.map((u) => (
            <Expandable key={u.id} accent={c.color}
              summary={
                <div className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-lg text-[11px] font-extrabold flex items-center justify-center shrink-0 mt-0.5"
                    style={{ backgroundColor: u.rank === 1 ? c.color : `${c.color}18`, color: u.rank === 1 ? "#fff" : c.color }}>{u.rank}</span>
                  <div className="min-w-0 flex-1">
                    <div className="text-[13.5px] font-extrabold leading-snug">{u.name}</div>
                    <div className="flex flex-wrap items-center gap-1.5 mt-1.5">
                      <AudienceTag audience={u.audience} />
                      <EconTag econ={u.econ} />
                      <Chip color={MUTED}>{u.lifecycle}</Chip>
                      {u.channels.slice(0, 2).map((ch) => <Chip key={ch} color={MUTED}>{ch}</Chip>)}
                    </div>
                  </div>
                  <span className="text-[13px] font-extrabold tabular-nums shrink-0" style={{ color: c.color }}>{opportunityScore(u)}</span>
                </div>
              }>
              <div className="pt-3"><UseCaseBody u={u} color={c.color} /></div>
            </Expandable>
          ))}
        </div>
      </div>

      {/* Channels + systems */}
      <div className="grid md:grid-cols-2 gap-4">
        <div className="rounded-2xl border bg-white p-5" style={{ borderColor: LINE }}>
          <div className="text-[9px] font-bold uppercase tracking-[0.14em] mb-2" style={{ color: MUTED }}>Channels across all five</div>
          <div className="flex flex-wrap gap-1.5">{allChannels.map((x) => <Chip key={x} color={c.color}>{x}</Chip>)}</div>
        </div>
        <div className="rounded-2xl border bg-white p-5" style={{ borderColor: LINE }}>
          <div className="text-[9px] font-bold uppercase tracking-[0.14em] mb-2" style={{ color: MUTED }}>Systems the agent must reach</div>
          <div className="flex flex-wrap gap-1.5">{allSystems.map((x) => <Chip key={x} color={MUTED}>{x}</Chip>)}</div>
        </div>
      </div>

      {/* Seller block */}
      <div className="grid lg:grid-cols-2 gap-4">
        <div className="rounded-2xl border bg-white p-5" style={{ borderColor: LINE }}>
          <div className="text-[10px] font-bold uppercase tracking-[0.16em] mb-3 flex items-center gap-1.5" style={{ color: MUTED }}>
            <MessageSquareQuote size={12} /> How I would open the conversation
          </div>
          <div className="space-y-3">
            {c.openers.map((o) => (
              <p key={o.slice(0, 30)} className="text-[12.5px] leading-relaxed pl-3 border-l-2" style={{ color: INK, borderColor: c.color }}>&ldquo;{o}&rdquo;</p>
            ))}
          </div>
          <div className="mt-4 pt-4 border-t" style={{ borderColor: LINE }}>
            <div className="text-[9px] font-bold uppercase tracking-[0.14em] mb-2" style={{ color: MUTED }}>Three discovery questions</div>
            <ol className="space-y-1.5">
              {c.discovery.map((d, i) => (
                <li key={d.slice(0, 24)} className="text-[12px] flex gap-2 leading-relaxed">
                  <span className="font-mono text-[10px] shrink-0 mt-0.5" style={{ color: c.color }}>{i + 1}</span>{d}
                </li>
              ))}
            </ol>
          </div>
        </div>
        <div className="rounded-2xl p-5 text-white" style={{ background: "linear-gradient(150deg,#16243F,#0B1017)" }}>
          <div className="text-[10px] font-bold uppercase tracking-[0.16em] mb-2 flex items-center gap-1.5" style={{ color: "#8AB4F8" }}>
            <Rocket size={12} /> Where I would start
          </div>
          <div className="text-[15px] font-extrabold leading-snug">{c.pilot.workflow}</div>
          <div className="text-[10.5px] mt-1.5" style={{ color: "#8AB4F8" }}>{c.pilot.weeks}</div>
          <p className="text-[12px] mt-3 leading-relaxed" style={{ color: "#B7C0CC" }}>{c.pilot.why}</p>
        </div>
      </div>
    </div>
  );
}

function UseCaseBody({ u, color }: { u: UseCase; color: string }) {
  return (
    <div className="grid lg:grid-cols-[1.35fr_1fr] gap-5">
      <div className="space-y-3.5 min-w-0">
        <div className="text-[15px] font-extrabold leading-snug">{u.name}</div>
        <Field label="Current workflow — and where it breaks">{u.current}</Field>
        <div className="rounded-xl p-3.5" style={{ backgroundColor: `${color}09`, border: `1px solid ${color}22` }}>
          <div className="text-[9px] font-bold uppercase tracking-[0.14em] mb-1 flex items-center gap-1.5" style={{ color }}>
            <Zap size={10} /> What the agent actually does
          </div>
          <p className="text-[12.5px] leading-relaxed" style={{ color: INK }}>{u.agentic}</p>
        </div>
        <div className="grid sm:grid-cols-2 gap-3.5">
          <Field label="Trigger">{u.trigger}</Field>
          <Field label="Why this company">{u.whyThisCompany}</Field>
        </div>
      </div>
      <div className="space-y-3.5 min-w-0">
        <div>
          <div className="text-[9px] font-bold uppercase tracking-[0.14em] mb-1.5" style={{ color: MUTED }}>Business outcome</div>
          <div className="flex flex-wrap gap-1.5">{u.outcomes.map((o) => <Chip key={o} color="#188038">{o}</Chip>)}</div>
        </div>
        <div>
          <div className="text-[9px] font-bold uppercase tracking-[0.14em] mb-1.5" style={{ color: MUTED }}>Channels</div>
          <div className="flex flex-wrap gap-1.5">{u.channels.map((o) => <Chip key={o} color={color}>{o}</Chip>)}</div>
        </div>
        <div>
          <div className="text-[9px] font-bold uppercase tracking-[0.14em] mb-1.5" style={{ color: MUTED }}>Systems / context required</div>
          <div className="flex flex-wrap gap-1.5">{u.systems.map((o) => <Chip key={o} color={MUTED}>{o}</Chip>)}</div>
        </div>
        <div className="rounded-xl border p-3" style={{ borderColor: LINE }}>
          <div className="text-[9px] font-bold uppercase tracking-[0.14em] mb-2" style={{ color: MUTED }}>Opportunity score {opportunityScore(u)}/100</div>
          <ScoreBars scores={u.scores as unknown as Record<string, number>} labels={SCORE_LABELS as unknown as { key: string; label: string; hint: string }[]} />
        </div>
      </div>
    </div>
  );
}
