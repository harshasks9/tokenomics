"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { breakEvenIncentive, creditCliff, lifetime, waterfall } from "@/lib/subsidy-math/model";
import { BASE_INCENTIVE, BASE_LIFETIME, baseRoute } from "@/lib/subsidy-math/params";
import { fmtPct, Section, Tag } from "./ui";
import Players from "./Players";
import Splitter from "./Splitter";
import CouponTime from "./CouponTime";
import AffordGrid from "./AffordGrid";
import MoneyCircle from "./MoneyCircle";
import OwnKitchen from "./OwnKitchen";
import ReportCards from "./ReportCards";
import OtherSide from "./OtherSide";
import Claims from "./Claims";
import Playbook from "./Playbook";
import Downloads from "./Downloads";

const NAV = [
  { id: "players", n: "01", label: "The players" },
  { id: "follow", n: "02", label: "Follow the $100" },
  { id: "coupon", n: "03", label: "Coupon vs forever" },
  { id: "afford", n: "04", label: "How big a coupon?" },
  { id: "circle", n: "05", label: "Money circles" },
  { id: "kitchen", n: "06", label: "Own the kitchen" },
  { id: "earnings", n: "07", label: "Report cards" },
  { id: "otherside", n: "08", label: "The other side" },
  { id: "claims", n: "09", label: "Proven or not" },
  { id: "playbook", n: "10", label: "What we do" },
  { id: "downloads", n: "11", label: "Downloads" },
];

const none = { pct: 0, partnerFunded: 0, providerFunded: 0 };

export default function Site() {
  const [active, setActive] = useState("players");
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const h = document.documentElement;
      setProgress(Math.min(1, h.scrollTop / Math.max(1, h.scrollHeight - h.clientHeight)));
      let cur = NAV[0].id;
      for (const s of NAV) {
        const el = document.getElementById(s.id);
        if (el && el.getBoundingClientRect().top <= window.innerHeight * 0.3) cur = s.id;
      }
      setActive(cur);
    };
    const onScroll = () => { if (!frame) frame = requestAnimationFrame(update); };
    window.addEventListener("scroll", onScroll, { passive: true });
    update();
    return () => { window.removeEventListener("scroll", onScroll); if (frame) cancelAnimationFrame(frame); };
  }, []);

  const aws = baseRoute("bedrock-claude");
  const awsKeep = waterfall(aws, none).cloudContribution;
  const azKeep = waterfall(baseRoute("azure-openai"), none).cloudContribution;
  const gemKeep = waterfall(baseRoute("vertex-gemini"), none).cloudContribution;
  const awsBe = breakEvenIncentive(aws, none);
  const lt5 = { ...BASE_LIFETIME, years: 5 };
  const one = lifetime(aws, { ...BASE_INCENTIVE, type: "one-time" }, lt5);
  const eff3 = lifetime(aws, { ...BASE_INCENTIVE, type: "one-time" }, { ...BASE_LIFETIME, years: 3 }).effectiveCustomerDiscount;
  const cliff = creditCliff(0, BASE_INCENTIVE.pct);

  return (
    <>
      <div className="sm-top">
        <div className="sm-wrap sm-top-inner">
          <Link href="/" prefetch={false}>aitokenomics</Link>
          <span>Research note · as of Nov 26, 2026 · not investment advice</span>
        </div>
      </div>

      <header className="sm-hero">
        <div className="sm-wrap">
          <div className="sm-eyebrow">Subsidy Math · Follow the $100</div>
          <h1 className="sm-title">The Economics of AI: is the hyperscaler <em>subsidy model</em> sustainable?</h1>
          <p className="sm-sub">AWS and Microsoft hand out big incentives to win Claude and OpenAI workloads. We followed every $100 a customer spends to see who keeps what, how big a coupon each cloud can really afford — and what that means for how we compete.</p>
          <div className="sm-meta"><span>Sources: Anthropic S-1/A and final prospectus; Amazon, Microsoft and Alphabet 10-Qs (nine quarters)</span><span>Every assumption adjustable</span><span>Independent skeptical review</span></div>

          <div className="sm-verdict">
            <div className="sm-answer">
              <h2>The short answer</h2>
              <p className="big">No — the evidence does not show that AWS&apos;s or Microsoft&apos;s subsidies are unsustainable.</p>
              <p>A one-time coupon to win a customer is ordinary business: for AWS selling Claude, a 35% one-time credit pays for itself in about {Math.round(one.paybackMonths)} months if the customer stays and grows. What <i>is</i> true is narrower: when a cloud resells someone else&apos;s model it keeps only a seller&apos;s fee — about ${awsKeep.toFixed(0)} of every $100 here — so a coupon bigger than about {fmtPct(awsBe)} <b>every year</b> can never pay back from AI alone. The real prizes for AWS are Anthropic&apos;s compute contracts and Amazon&apos;s stake, not the resale margin.</p>
              <p>For Microsoft the premise mostly falls away: since April 2026 it sells OpenAI models royalty-free.</p>
            </div>
            <div className="sm-keys">
              <div className="sm-key"><b>${awsKeep.toFixed(0)} · ${azKeep.toFixed(0)} · ${gemKeep.toFixed(0)}</b><span>What AWS keeps of $100 of Claude, Microsoft of OpenAI, and Google of Gemini (before Gemini&apos;s model-building cost).</span><small>Base case, before coupons <Tag b="C" /></small></div>
              <div className="sm-key"><b>16%→32%</b><span>The seller&apos;s fee clouds kept on Claude rose from ~16% (2025) to ~32% (Q3 2026) — and Anthropic is renegotiating it down.</span><small>Implied from Anthropic&apos;s filing; not split by cloud <Tag b="C" /></small></div>
              <div className="sm-key"><b>{(eff3 * 100).toFixed(0)}%</b><span>What a 35% one-time credit is really worth to a growing customer over three years. When it ends, the bill jumps {fmtPct(cliff)}.</span><small>Model, base case <Tag b="A" /></small></div>
              <div className="sm-key"><b>$289B</b><span>Amazon&apos;s Anthropic stake at the $83 IPO price, for about $18B of cash invested (Amazon 10-Q) — the biggest reason a subsidy can be rational for Amazon even when it thins AWS&apos;s margin.</span><small>Our calculation on the final prospectus <Tag b="C" /></small></div>
            </div>
          </div>
        </div>
      </header>

      <nav className="sm-nav sm-print-hide" aria-label="Sections">
        <div className="sm-wrap">
          <div className="sm-nav-inner">
            {NAV.map((s) => (
              <a key={s.id} href={`#${s.id}`} aria-current={active === s.id}><span>{s.n}</span>{s.label}</a>
            ))}
          </div>
        </div>
        <div className="sm-progress" style={{ transform: `scaleX(${progress})` }} />
      </nav>

      <main>
        <Section id="players" n="01" kicker="The players" title="Who sells what — and who is really the seller" lede="Three clouds, three model makers, and one accounting detail that changes everything: who sets the price.">
          <Players />
        </Section>
        <Section id="follow" n="02" kicker="Follow the $100" title="Where $100 of AI spending actually goes" lede="Pick a route. The bar shows who ends up with each dollar at list price; then add a coupon and see whether the cloud's slice can pay for it.">
          <Splitter />
        </Section>
        <Section id="coupon" n="03" kicker="One coupon vs a forever discount" title="A 35% coupon once is not a 35% price cut" lede="The same incentive, paid once, every year, only on growth, or tied to a bigger contract, has completely different economics — for the cloud and for the customer.">
          <CouponTime />
        </Section>
        <Section id="afford" n="04" kicker="The limits of subsidy" title="How big a coupon can each cloud afford?" lede="Incentive levels from 0% to 50%, for every route: what the customer pays, what the cloud keeps, how much extra usage would be needed if the coupon never ended, and how long a one-time coupon takes to pay back.">
          <AffordGrid />
        </Section>
        <Section id="circle" n="05" kicker="Circles of money" title="The clouds invest in the model makers, who spend it back on the clouds" lede="Equity in, compute contracts out, fees on every sale, and paper gains on top. Here is the map — with cash and accounting kept separate.">
          <MoneyCircle />
        </Section>
        <Section id="kitchen" n="06" kicker="Vertical integration" title="Owning the whole kitchen: bigger slice, bigger bill" lede="Does Google keep more of a Gemini dollar than AWS keeps of a Claude dollar? Yes. Is Gemini therefore more profitable? That depends on a cost nobody outside Google can see.">
          <OwnKitchen />
        </Section>
        <Section id="earnings" n="07" kicker="Check against reported results" title="What nine quarters of earnings actually show" lede="If third-party AI were wrecking cloud economics, it should show up somewhere. Here is what the segment reports reveal — and what they can't.">
          <ReportCards />
        </Section>
        <Section id="otherside" n="08" kicker="The strongest counterargument" title="Why AWS and Microsoft may be entirely rational" lede="An independent reviewer argued the opposite case. Its two strongest points: a coupon buys more than AI, and the cloud owns part of the model maker. Test them here.">
          <OtherSide />
        </Section>
        <Section id="claims" n="09" kicker="Proven, defensible, directional, unsupported" title="What we can say — and what we can't" lede="Every major finding, graded. Tap a category to filter. Each card shows the evidence, the assumption it rests on, and the best argument against it.">
          <Claims />
        </Section>
        <Section id="playbook" n="10" kicker="JAPAC go-to-market" title="What this means on Monday morning" lede="Six rules for leaders and sellers competing against heavily incentivized Claude and OpenAI deals, a test for when matching is rational, and the field intelligence that would sharpen this analysis.">
          <Playbook />
        </Section>
        <Section id="downloads" n="11" kicker="Deliverables" title="The email, the memo, the model and the claims audit" lede="Everything behind this page, ready to send or to check.">
          <Downloads />
        </Section>
      </main>

      <footer className="sm-foot">
        <div className="sm-wrap">
          Independent analysis from public filings, company statements and credible reporting as of November 26, 2026. Where contracts are private we use ranges, not invented precision. The AWS ~35% incentive is a field observation we could not verify publicly. Not investment advice.
        </div>
      </footer>
    </>
  );
}
