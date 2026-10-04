"use client";

import { useSite } from "../context";
import { Block, Section, Src } from "../ui";
import { CompetitorFig, SignalsGrid, WalletFig } from "../blocks";
import { billions, money } from "@/lib/korea-fy27/format";
import type { Basis, Src as SrcType } from "@/lib/korea-fy27/types";

type Insight = { value: string; title: string; detail: string; basis: Basis[]; src: SrcType | SrcType[] };

export default function FlowInsights() {
  const { model } = useSite();
  const { segments, totals, competitors, deepDives } = model.market;
  const seg = (id: string) => segments.find((s) => s.id === id)!;
  const dd = (id: string) => deepDives.find((d) => d.segment === id)!;
  const [dn, ce, mm, ps] = ["dn", "ce", "mm", "ps"].map(seg);
  const anthropic = competitors.rows.find((r) => r.vendor === "Anthropic")!;
  const google = competitors.rows.find((r) => r.isGoogle)!;
  const dnStats = dd("dn").stats;
  const psStats = dd("ps").stats;
  const stat = (list: typeof dnStats, label: RegExp) => list.find((s) => label.test(s.label))?.value ?? "";

  const insights: Insight[] = [
    {
      value: `${totals.fy26Label} → ${totals.fy27Label}`,
      title: "The wallet doubles in a year.",
      detail: `${totals.projection} The FY27 range is ${billions(totals.fy27Range[0])}–${billions(totals.fy27Range[1])}; ${totals.agreement.charAt(0).toLowerCase()}${totals.agreement.slice(1)}`,
      basis: ["estimate"],
      src: [{ part: "main", slides: "7" }, { part: "A", slides: "43–44" }],
    },
    {
      value: `~${totals.dnPlusCePct}%`,
      title: "Two segments hold the money.",
      detail: `Digital Natives grow ${money(dn.marketFY26, { approx: true })} → ${money(dn.marketFY27, { approx: true })} and Conglomerates & Enterprise ${money(ce.marketFY26, { approx: true })} → ${money(ce.marketFY27, { approx: true })}. Mid-market and public sector together are ${money(mm.marketFY26 + ps.marketFY26, { approx: true })} → ${money(mm.marketFY27 + ps.marketFY27, { approx: true })}.`,
      basis: ["estimate"],
      src: { part: "main", slides: "6–7" },
    },
    {
      value: competitors.totals.anthropicVsGoogle,
      title: "Anthropic is the incumbent to beat.",
      detail: `${anthropic.spendLabel} of Korea spend on field intel against our ${google.spendLabel}: ${anthropic.share} of the implied wallet. Most of our FY27 share gain has to come from Anthropic workloads, with Claude on Vertex as the bridge to Gemini.`,
      basis: ["directional"],
      src: [{ part: "main", slides: "7" }, { part: "A", slides: "46" }],
    },
    {
      value: stat(dnStats, /VC investment/),
      title: "Startup capital is moving into AI.",
      detail: `Korea VC investment hit a record in H1 2026 (+54% YoY). AI took ${stat(dnStats, /AI share of startup/)} of startup investment in 2025 (9.4% in 2022), and the number of Digital Native companies funded rose ${stat(dnStats, /DN companies funded/)} (Jan–Aug 2025 → 2026).`,
      basis: ["stated"],
      src: dd("dn").src,
    },
    {
      value: "8 of 10",
      title: "Groups buy from several model vendors, through their own portals and IT arms.",
      detail: `${dd("ce").facts[0]} ${dd("ce").facts[1]}`,
      basis: ["stated"],
      src: dd("ce").src,
    },
    {
      value: `${money(mm.marketFY26 + ps.marketFY26, { approx: true })} → ${money(mm.marketFY27 + ps.marketFY27, { approx: true })}`,
      title: "Mid-market and public sector are small and slow to pay.",
      detail: `${dd("mm").facts[0]} The government AI budget is ${stat(psStats, /Government AI budget/)} (3x 2025), but only ${stat(psStats, /funding adoption/)} of it funds adoption.`,
      basis: ["stated", "estimate"],
      src: [dd("mm").src, dd("ps").src],
    },
  ];

  return (
    <Section
      id="f-insights"
      num="2"
      label="Market intel"
      question="What does the market tell us?"
      headline={`Korea's AI wallet doubles to ${totals.fy27Label} in FY27, and most of it sits with competitors today.`}
      lead={model.headline.marketDefinition}
    >
      <Block title="Six insights">
        <div className="k-grid k-ins">
          {insights.map((ins, i) => (
            <div className="k-card k-insight" key={ins.title}>
              <span className="i">Insight {i + 1}</span>
              <span className="v">{ins.value}</span>
              <h3>{ins.title}</h3>
              <p>{ins.detail}</p>
              <Src src={ins.src} basis={ins.basis} />
            </div>
          ))}
        </div>
      </Block>

      <Block>
        <WalletFig />
      </Block>

      <Block>
        <CompetitorFig />
      </Block>

      <Block title="Signals that the demand is real">
        <SignalsGrid />
        <Src src={{ part: "A", slides: "41" }} basis={["stated"]} extra={<span>External sources as cited in the deck; not independently re-verified here.</span>} />
      </Block>
    </Section>
  );
}
