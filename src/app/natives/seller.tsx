"use client";

import { Check, Copy, MessageSquareQuote, Rocket } from "lucide-react";
import { useState } from "react";
import { COMPANIES, companyBySlug, heroUseCase, scoreOf } from "./index";
import { opportunityScore } from "./schema";
import { Chip, EconTag, AudienceTag, INK, LINE, MUTED, SectionHead } from "./ui";

// Deliberately stripped back: this is the view a seller opens in the lift.
export function SellerMode({ focus, setFocus }: { focus: string | null; setFocus: (s: string) => void }) {
  const c = companyBySlug(focus ?? "") ?? COMPANIES[0];
  const top3 = [...c.useCases].sort((a, b) => a.rank - b.rank).slice(0, 3);
  const [copied, setCopied] = useState(false);

  const brief = [
    `${c.name} — agentic communications, one-page brief`,
    ``,
    `WHY THIS ACCOUNT`,
    c.whyItMatters,
    ``,
    `TOP 3 OPPORTUNITIES`,
    ...top3.map((u, i) => `${i + 1}. ${u.name} (${opportunityScore(u)}/100) — ${u.agentic}`),
    ``,
    `CONVERSATION STARTER`,
    `"${c.openers[0]}"`,
    ``,
    `DISCOVERY QUESTIONS`,
    ...c.discovery.map((d, i) => `${i + 1}. ${d}`),
    ``,
    `WHERE TO START`,
    `${c.pilot.workflow} (${c.pilot.weeks}) — ${c.pilot.why}`,
  ].join("\n");

  const copy = async () => {
    await navigator.clipboard.writeText(brief);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section className="max-w-[900px] mx-auto px-5 md:px-8 py-10 md:py-14">
      <SectionHead kicker="Seller mode" title="Everything you need, nothing you don't" lead="Pick the account. Read it in ninety seconds before you walk in." />

      <div className="flex flex-wrap gap-1.5 mb-6">
        {COMPANIES.map((x) => (
          <button key={x.slug} onClick={() => setFocus(x.slug)}
            className="text-[11.5px] font-semibold rounded-full px-3.5 py-2 border transition-colors"
            style={x.slug === c.slug ? { backgroundColor: x.color, color: "#fff", borderColor: "transparent" } : { borderColor: LINE, color: MUTED, backgroundColor: "#fff" }}>
            {x.shortName}
          </button>
        ))}
      </div>

      <div className="rounded-3xl border bg-white overflow-hidden" style={{ borderColor: LINE }}>
        <div className="px-6 md:px-8 py-6" style={{ background: `linear-gradient(135deg, ${c.color}12, transparent 65%)` }}>
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <h3 className="text-[28px] font-extrabold tracking-tight leading-none">{c.name}</h3>
              <div className="text-[11px] font-semibold uppercase tracking-[0.14em] mt-2" style={{ color: c.color }}>{c.category}</div>
            </div>
            <button onClick={copy} className="inline-flex items-center gap-1.5 text-[11.5px] font-bold rounded-full px-4 py-2 border" style={{ borderColor: LINE, color: copied ? "#188038" : MUTED }}>
              {copied ? <Check size={13} /> : <Copy size={13} />} {copied ? "Copied" : "Copy brief"}
            </button>
          </div>
        </div>

        <div className="px-6 md:px-8 py-6 space-y-7">
          <div>
            <div className="text-[10px] font-bold uppercase tracking-[0.16em] mb-2" style={{ color: MUTED }}>Why this account</div>
            <p className="text-[15px] leading-relaxed" style={{ color: INK }}>{c.whyItMatters}</p>
          </div>

          <div>
            <div className="text-[10px] font-bold uppercase tracking-[0.16em] mb-3" style={{ color: MUTED }}>Top three opportunities</div>
            <div className="space-y-2.5">
              {top3.map((u, i) => (
                <div key={u.id} className="rounded-2xl border p-4" style={{ borderColor: i === 0 ? `${c.color}44` : LINE, backgroundColor: i === 0 ? `${c.color}07` : "#fff" }}>
                  <div className="flex items-start gap-3">
                    <span className="w-6 h-6 rounded-lg text-[11px] font-extrabold flex items-center justify-center shrink-0"
                      style={{ backgroundColor: i === 0 ? c.color : `${c.color}18`, color: i === 0 ? "#fff" : c.color }}>{i + 1}</span>
                    <div className="min-w-0 flex-1">
                      <div className="text-[14px] font-extrabold leading-snug">{u.name}</div>
                      <p className="text-[12.5px] mt-1.5 leading-relaxed" style={{ color: MUTED }}>{u.agentic}</p>
                      <div className="flex flex-wrap gap-1.5 mt-2">
                        <AudienceTag audience={u.audience} />
                        <EconTag econ={u.econ} />
                        {u.outcomes.slice(0, 2).map((o) => <Chip key={o} color="#188038">{o}</Chip>)}
                      </div>
                    </div>
                    <span className="text-[15px] font-extrabold tabular-nums shrink-0" style={{ color: c.color }}>{opportunityScore(u)}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl p-5" style={{ backgroundColor: "#0B1017" }}>
            <div className="text-[10px] font-bold uppercase tracking-[0.16em] mb-2.5 flex items-center gap-1.5" style={{ color: "#8AB4F8" }}>
              <MessageSquareQuote size={12} /> Best conversation starter
            </div>
            <p className="text-[15px] leading-relaxed text-white">&ldquo;{c.openers[0]}&rdquo;</p>
            {c.openers[1] && <p className="text-[12px] leading-relaxed mt-3 pt-3 border-t" style={{ color: "#9BA6B4", borderColor: "#ffffff1A" }}>Backup: &ldquo;{c.openers[1]}&rdquo;</p>}
          </div>

          <div>
            <div className="text-[10px] font-bold uppercase tracking-[0.16em] mb-2.5" style={{ color: MUTED }}>Three discovery questions</div>
            <ol className="space-y-2.5">
              {c.discovery.map((d, i) => (
                <li key={d.slice(0, 24)} className="flex gap-3 text-[13.5px] leading-relaxed">
                  <span className="w-6 h-6 rounded-full border text-[11px] font-bold flex items-center justify-center shrink-0" style={{ borderColor: LINE, color: c.color }}>{i + 1}</span>
                  <span>{d}</span>
                </li>
              ))}
            </ol>
          </div>

          <div className="rounded-2xl border-2 p-5" style={{ borderColor: `${c.color}44`, backgroundColor: `${c.color}07` }}>
            <div className="text-[10px] font-bold uppercase tracking-[0.16em] mb-2 flex items-center gap-1.5" style={{ color: c.color }}>
              <Rocket size={12} /> Recommended pilot
            </div>
            <div className="text-[16px] font-extrabold leading-snug">{c.pilot.workflow}</div>
            <div className="text-[11px] font-semibold mt-1" style={{ color: c.color }}>{c.pilot.weeks}</div>
            <p className="text-[12.5px] mt-2.5 leading-relaxed" style={{ color: MUTED }}>{c.pilot.why}</p>
          </div>

          <div className="flex items-center justify-between pt-2 border-t text-[11px]" style={{ borderColor: LINE, color: MUTED }}>
            <span>Hero use case: <b style={{ color: INK }}>{heroUseCase(c).name}</b></span>
            <span>Account opportunity score <b style={{ color: c.color }}>{scoreOf(c)}/100</b></span>
          </div>
        </div>
      </div>
    </section>
  );
}
