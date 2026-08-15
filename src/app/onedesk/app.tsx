"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowDown, FileText } from "lucide-react";
import { SplitScreen } from "./split";
import { MiddlewareMap, RegulatorProof } from "./map";
import { Architecture, Boundaries, ComplianceConsole, Economics, EvidencePanel } from "./panels";
import { AGENT, Display, INK, Kicker, Lede, MUTED, PAPER, RULE, SERIF, STALL, Section, Tag } from "./ui";

const NAV = [
  { id: "story", label: "Two universities" },
  { id: "map", label: "The map" },
  { id: "evidence", label: "The evidence" },
  { id: "boundaries", label: "Boundaries" },
  { id: "architecture", label: "Architecture" },
  { id: "economics", label: "Economics" },
];

const DESKS = ["Admissions", "Accounts", "Library", "Hostel", "Examination", "Registrar"];

/** The insight, shown: a document carried by hand from desk to desk while days pass. */
function DeskWalk() {
  const [pos, setPos] = useState(0);
  const [reduced, setReduced] = useState(false);
  const raf = useRef<number | null>(null);
  const last = useRef(0);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => setReduced(mq.matches);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  useEffect(() => {
    if (reduced) { setPos(DESKS.length - 1); return; }
    last.current = performance.now();
    const tick = (now: number) => {
      const dt = Math.min(now - last.current, 100); // clamp across tab suspension
      last.current = now;
      setPos((v) => (v + dt / 3400) % (DESKS.length + 1.4));
      raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
    return () => { if (raf.current) cancelAnimationFrame(raf.current); };
  }, [reduced]);

  const clamped = Math.min(pos, DESKS.length - 1);
  const day = Math.min(Math.floor(pos * 2.4) + 1, 14);

  return (
    <div className="mt-10 md:mt-14" aria-hidden>
      <div className="flex items-center justify-between mb-2.5">
        <span className="text-[9.5px] font-bold uppercase" style={{ color: MUTED, letterSpacing: "0.18em" }}>
          One request · one student · carried by hand
        </span>
        <span className="text-[11px] font-bold tabular-nums" style={{ color: STALL, fontFamily: SERIF }}>
          Day {day}
        </span>
      </div>
      <div className="relative">
        <div className="flex items-stretch gap-1.5 md:gap-2">
          {DESKS.map((d, i) => {
            const reached = clamped >= i - 0.15;
            return (
              <div key={d} className="flex-1 min-w-0">
                <div
                  className="h-[3px] rounded-full transition-colors duration-500"
                  style={{ backgroundColor: reached ? `${STALL}66` : RULE }}
                />
                <div
                  className="text-[8.5px] md:text-[9.5px] mt-1.5 truncate text-center uppercase transition-colors duration-500"
                  style={{ color: reached ? INK : MUTED, letterSpacing: "0.06em" }}
                >
                  {d}
                </div>
              </div>
            );
          })}
        </div>
        <div
          className="absolute -top-[9px]"
          style={{
            left: `calc(${(clamped + 0.5) * (100 / DESKS.length)}% - 9px)`,
            transition: reduced ? "none" : "left 120ms linear",
          }}
        >
          <FileText size={18} strokeWidth={1.75} style={{ color: STALL }} />
        </div>
      </div>
      <div className="text-[11px] mt-4 leading-[1.6]" style={{ color: MUTED }}>
        Nothing is being computed here. A person is walking a piece of paper between systems that hold different names for the same human being.
      </div>
    </div>
  );
}

export default function OneDeskApp() {
  const [seen, setSeen] = useState("");

  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) setSeen(e.target.id); }),
      { rootMargin: "-45% 0px -50% 0px" },
    );
    NAV.forEach((n) => { const el = document.getElementById(n.id); if (el) obs.observe(el); });
    return () => obs.disconnect();
  }, []);

  return (
    <div style={{ backgroundColor: PAPER, color: INK, fontFamily: "Inter, system-ui, sans-serif" }}>
      {/* Nav */}
      <header className="sticky top-0 z-50 backdrop-blur" style={{ backgroundColor: "rgba(246,243,238,0.92)", borderBottom: `1px solid ${RULE}` }}>
        <div className="max-w-[1120px] mx-auto px-5 md:px-8 h-13 py-3 flex items-center justify-between gap-4">
          <a href="#top" className="flex items-baseline gap-2 shrink-0">
            <span className="text-[15px] font-bold tracking-[-0.01em]" style={{ fontFamily: SERIF }}>One Desk</span>
            <span className="hidden sm:inline text-[9.5px] uppercase" style={{ color: MUTED, letterSpacing: "0.16em" }}>
              The agentic front office
            </span>
          </a>
          <nav className="flex gap-1 overflow-x-auto">
            {NAV.map((n) => (
              <a
                key={n.id} href={`#${n.id}`}
                className="text-[11px] font-semibold px-2.5 py-1 rounded-full whitespace-nowrap transition-colors"
                style={seen === n.id ? { backgroundColor: INK, color: PAPER } : { color: MUTED }}
              >
                {n.label}
              </a>
            ))}
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section id="top" className="pt-16 md:pt-24 pb-14 md:pb-20">
        <div className="max-w-[1120px] mx-auto px-5 md:px-8">
          <Kicker color={STALL}>The agentic front office · Indian higher education</Kicker>
          <h1 className="text-[38px] md:text-[68px] leading-[1.03] tracking-[-0.03em] max-w-[19ch]" style={{ fontFamily: SERIF }}>
            Your university&apos;s front end is a <span style={{ color: STALL }}>person</span>.
          </h1>
          <div className="grid md:grid-cols-[1.15fr_1fr] gap-8 md:gap-14 mt-7 items-start">
            <div>
              <p className="text-[15px] md:text-[17px] leading-[1.65]" style={{ color: MUTED }}>
                Not a website. A human being standing between seven to ten systems that cannot talk to each other — doing the
                integration by hand, while the student walks their own documents from desk to desk.
              </p>
              <p className="text-[17px] md:text-[21px] leading-[1.45] mt-6" style={{ fontFamily: SERIF, color: INK }}>
                Indian universities do not have a communication problem. They have a{" "}
                <span style={{ color: AGENT, borderBottom: `2px solid ${AGENT}` }}>completion</span> problem.
              </p>
              <a
                href="#story"
                className="inline-flex items-center gap-2 mt-8 text-[12.5px] font-bold rounded-full px-5 py-3"
                style={{ backgroundColor: INK, color: PAPER }}
              >
                Watch the same student, twice <ArrowDown size={13} />
              </a>
            </div>
            <DeskWalk />
          </div>
        </div>
      </section>

      {/* The centrepiece */}
      <Section id="story" tint="#FDFBF8">
        <div className="mb-8 max-w-[70ch]">
          <Kicker color={AGENT}>Two universities, same student</Kicker>
          <Display>One request. Two institutions. Both real.</Display>
          <div className="mt-4">
            <Lede>
              Pick a person and a moment. The left column is how it resolves today. The right is the same request through an agentic
              front office. Both start at the same instant — watch where each one is when the other has finished.
            </Lede>
          </div>
        </div>
        <SplitScreen />
      </Section>

      {/* Map */}
      <Section id="map">
        <div className="mb-8 max-w-[70ch]">
          <Kicker color={STALL}>The map</Kicker>
          <Display>Seven to ten systems. No shared key. Twelve people holding it together.</Display>
          <div className="mt-4">
            <Lede>
              This is the estate under a typical Indian private university. The dashed lines are not integrations — each one is a
              human being re-keying, reconciling, exporting or verifying by hand. Hover any of them.
            </Lede>
          </div>
        </div>
        <MiddlewareMap />
        <div className="mt-6"><RegulatorProof /></div>
        <div className="mt-6 grid md:grid-cols-3 gap-3">
          {[
            { t: "Five times, the same documents", d: "ID proof and marksheets to the CRM at application, again to the ERP at admission, again for the scholarship claim, again for DigiLocker and ABC seeding, again to the placement cell.", k: "inference" as const },
            { t: "The handoff nobody owns", d: "The admissions CRM owns the record from enquiry to fee-paid, then hands it to an ERP that does not share its data model. This is the most common re-keying point in an Indian university.", k: "inference" as const },
            { t: "A window that closed for good", d: "UGC's ABC upload for Examination Year 2025 shut permanently on 30 June 2026. A mismatch between two systems becomes an unfixable harm to that student's credit record.", k: "fact" as const, s: "abc" },
          ].map((c) => (
            <div key={c.t} className="p-5 rounded-[3px] bg-white" style={{ border: `1px solid ${RULE}` }}>
              <div className="text-[13px] font-bold mb-2" style={{ fontFamily: SERIF, color: INK }}>{c.t}</div>
              <p className="text-[11.5px] leading-[1.65]" style={{ color: MUTED }}>{c.d} <Tag kind={c.k} src={c.s} /></p>
            </div>
          ))}
        </div>
      </Section>

      {/* Evidence */}
      <Section id="evidence" tint="#FDFBF8">
        <div className="mb-8 max-w-[70ch]">
          <Kicker color={STALL}>The evidence</Kicker>
          <Display>The obvious version of this product does not work. We can prove it.</Display>
          <div className="mt-4">
            <Lede>
              Before you buy anything in this category, read the two results that matter. They point in opposite directions, and the
              difference between them is the entire design of this product.
            </Lede>
          </div>
        </div>
        <EvidencePanel />
      </Section>

      {/* Boundaries */}
      <Section id="boundaries">
        <div className="mb-8 max-w-[70ch]">
          <Kicker color="#9A6B12">Boundaries</Kicker>
          <Display>Watch it refuse.</Display>
          <div className="mt-4">
            <Lede>
              An agent that will do anything you ask cannot be deployed in an Indian university. Here is the same system declining
              four reasonable-sounding requests — and what it does instead.
            </Lede>
          </div>
        </div>
        <ComplianceConsole />
        <div className="mt-6"><Boundaries /></div>
      </Section>

      {/* Architecture */}
      <Section id="architecture" tint="#FDFBF8">
        <div className="mb-8 max-w-[70ch]">
          <Kicker color={AGENT}>Architecture</Kicker>
          <Display>Ground. Hold identity. Act. Gate. Prove.</Display>
          <div className="mt-4">
            <Lede>
              Built on the Gemini Enterprise Agent Platform. The layer that matters is the second one — holding one human being
              across systems that share no key. Everything else is a feature; that is the architecture.
            </Lede>
          </div>
        </div>
        <Architecture />
      </Section>

      {/* Economics */}
      <Section id="economics">
        <div className="mb-8 max-w-[70ch]">
          <Kicker color={STALL}>Economics</Kicker>
          <Display>Your dead lead pool, priced honestly.</Display>
          <div className="mt-4">
            <Lede>
              The most valuable asset in an admissions funnel is the enquiry nobody had capacity to call a second time. Move the
              assumptions. Every one of them is yours to change, and every benchmark is labelled with where it came from.
            </Lede>
          </div>
        </div>
        <Economics />
      </Section>

      {/* Close */}
      <section className="py-16 md:py-24" style={{ backgroundColor: INK }}>
        <div className="max-w-[1120px] mx-auto px-5 md:px-8">
          <div className="max-w-[26ch]">
            <p className="text-[30px] md:text-[46px] leading-[1.1] tracking-[-0.02em]" style={{ fontFamily: SERIF, color: PAPER }}>
              The queue outside the registrar&apos;s office is not a service problem.
            </p>
            <p className="text-[30px] md:text-[46px] leading-[1.1] tracking-[-0.02em] mt-2" style={{ fontFamily: SERIF, color: "#E8C86A" }}>
              It is an integration failure with people standing in it.
            </p>
          </div>
          <p className="text-[13px] leading-[1.7] mt-8 max-w-[64ch]" style={{ color: "#9C948A" }}>
            Start with one blocked task that has a date attached to it — a scholarship defect before the deadline, a no-dues chain
            before convocation, a marksheet reconciliation before results publish. Measure it against a holdout. In a category with
            almost no published Indian evidence, a credible measured result is itself the differentiator.
          </p>
          <div className="flex flex-wrap gap-2.5 mt-8">
            <a href="#story" className="inline-flex items-center gap-2 text-[12.5px] font-bold rounded-full px-5 py-3" style={{ backgroundColor: PAPER, color: INK }}>
              Watch it again
            </a>
            <a href="#economics" className="inline-flex items-center gap-2 text-[12.5px] font-semibold rounded-full px-5 py-3" style={{ border: "1px solid #3A342C", color: PAPER }}>
              Model it on your numbers
            </a>
          </div>
        </div>
      </section>

      <footer className="py-8" style={{ backgroundColor: PAPER, borderTop: `1px solid ${RULE}` }}>
        <div className="max-w-[1120px] mx-auto px-5 md:px-8">
          <p className="text-[10.5px] leading-[1.7] max-w-[86ch]" style={{ color: MUTED }}>
            A concept experience, not a product announcement. Every claim on this page is labelled <b>Fact</b> (public record,
            regulation, filings or reported case), <b>Vendor benchmark</b> (vendor-published, no independent counterfactual) or{" "}
            <b>Inference</b> (reasoned from cited evidence). Source links open on the label. No internal volumes, costs, systems or
            processes of any named institution are stated as fact. The economic model is arithmetic on published sector rates applied
            to assumptions you control — a hypothesis for a pilot to test, never a projection to sign.
          </p>
        </div>
      </footer>
    </div>
  );
}
