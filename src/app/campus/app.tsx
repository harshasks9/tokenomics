"use client";

import { useEffect, useState } from "react";
import { ArrowRight, ExternalLink } from "lucide-react";
import { RequestBoard } from "./board";
import { OrgTabs } from "./tabs";
import { BeforeAfter, CioLayers, Comparison, Deployment, Integrations, Roi, Trust } from "./sections";
import { HERO_STATS, KIND_META, SOURCES } from "./data";
import {
  BORDER, BRAND, CANVAS, Eyebrow, FAINT, H2, INK, MUTED, Section, Stat, Sub, SURFACE, Tag,
} from "./ui";

const NAV = [
  { id: "board", label: "The board" },
  { id: "functions", label: "By function" },
  { id: "workflow", label: "Workflow" },
  { id: "compare", label: "Where it fits" },
  { id: "trust", label: "Governance" },
  { id: "value", label: "Value" },
  { id: "pilot", label: "Pilot" },
];

export function CampusApp() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div style={{ backgroundColor: CANVAS, color: INK }} className="cfo min-h-screen antialiased">
      {/* An explicit, high-contrast focus ring — the whole page is keyboard-operable
          and the UA default is too faint against this canvas. */}
      <style>{`
        .cfo :is(a,button,input,[tabindex]):focus-visible {
          outline: 2px solid ${BRAND};
          outline-offset: 2px;
          border-radius: 4px;
        }
        @media (prefers-reduced-motion: reduce) {
          .cfo *, .cfo *::before, .cfo *::after {
            transition-duration: 0.01ms !important;
            animation-duration: 0.01ms !important;
          }
        }
      `}</style>

      {/* ── Nav ── */}
      <header
        className="sticky top-0 z-50"
        style={{
          backgroundColor: "rgba(255,255,255,0.92)",
          backdropFilter: "saturate(180%) blur(8px)",
          borderBottom: `1px solid ${scrolled ? BORDER : "transparent"}`,
        }}
      >
        <div className="max-w-[1180px] mx-auto px-5 md:px-8 h-14 flex items-center gap-6">
          <a href="#top" className="flex items-center gap-2 shrink-0">
            <span className="w-[22px] h-[22px] rounded-[6px] flex items-center justify-center" style={{ backgroundColor: BRAND }}>
              <span className="w-[8px] h-[8px] rounded-[2px] bg-white" />
            </span>
            <span className="text-[14px] font-bold tracking-[-0.01em]" style={{ color: INK }}>Campus Front Office</span>
          </a>
          <nav className="hidden lg:flex items-center gap-5 ml-2">
            {NAV.map((n) => (
              <a key={n.id} href={`#${n.id}`} className="text-[12.5px] hover:text-[#111827] transition-colors" style={{ color: MUTED }}>
                {n.label}
              </a>
            ))}
          </nav>
          <a
            href="#pilot"
            className="ml-auto text-[12.5px] font-semibold rounded-lg px-3 sm:px-3.5 py-2 inline-flex items-center gap-1.5 shrink-0"
            style={{ backgroundColor: BRAND, color: "#fff" }}
          >
            <span className="hidden sm:inline">See the 12-week pilot</span>
            <span className="sm:hidden">Pilot</span>
            <ArrowRight size={13} />
          </a>
        </div>
      </header>

      {/* ── Hero ── */}
      <section id="top" className="pt-12 md:pt-16 pb-10" style={{ backgroundColor: SURFACE, borderBottom: `1px solid ${BORDER}` }}>
        <div className="max-w-[1180px] mx-auto px-5 md:px-8">
          <div className="grid lg:grid-cols-[minmax(0,1fr)_minmax(0,0.82fr)] gap-8 lg:gap-14 items-start">
            <div>
              <Eyebrow>For universities and colleges in India</Eyebrow>
              <h1 className="text-[32px] md:text-[46px] font-bold tracking-[-0.032em] leading-[1.08]" style={{ color: INK }}>
                Your institution has a system of record for everything.
                <br className="hidden md:block" />
                <span style={{ color: BRAND }}> It has no system of response.</span>
              </h1>
              <p className="text-[15px] md:text-[17px] leading-[1.6] mt-5 max-w-[58ch]" style={{ color: MUTED }}>
                Every enquiry, fee question, certificate request, scholarship defect and placement deadline arrives at a person —
                on WhatsApp, on the phone, at a counter. Campus Front Office receives them all, works them across the systems you
                already run, and closes them. Management sees one board.
              </p>
              <div className="flex flex-wrap gap-3 mt-7">
                <a href="#board" className="text-[13.5px] font-semibold rounded-lg px-4 py-2.5 inline-flex items-center gap-1.5" style={{ backgroundColor: BRAND, color: "#fff" }}>
                  See it working <ArrowRight size={14} />
                </a>
                <a href="#value" className="text-[13.5px] font-semibold rounded-lg px-4 py-2.5" style={{ border: `1px solid ${BORDER}`, color: INK }}>
                  Model the value
                </a>
              </div>
            </div>

            <div className="grid grid-cols-3 lg:grid-cols-1 gap-5 lg:gap-6 lg:pt-3">
              {HERO_STATS.map((s) => (
                <div key={s.label} className="lg:pl-5" style={{ borderLeft: `2px solid ${BORDER}` }}>
                  <Stat value={s.value} label={s.label} kind={s.kind} src={s.src} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Board ── */}
      <Section id="board">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
          <div>
            <Eyebrow>One queue for the whole institution</Eyebrow>
            <H2>Every request, from anyone, in any language</H2>
            <Sub>
              Prospective students, enrolled students, parents and staff — arriving on WhatsApp, voice, web and email, across every
              campus. Each row shows what is being worked on right now, which systems it is touching, and how long it has taken.
            </Sub>
          </div>
        </div>
        <RequestBoard />
        <div className="grid md:grid-cols-3 gap-5 mt-8">
          <Fact
            title="Nothing waits for an office to open"
            body="A guardian asking about fees at 10 PM in Marathi gets the same answer as a walk-in at the counter, with the instalment schedule cited to the circular."
          />
          <Fact
            title="A request can cross a boundary"
            body="A no-dues certificate needs library, hostel, mess and accounts. Today the student walks between them. Here they are checked at once."
          />
          <Fact
            title="Money, seats and grades stop at a person"
            body="Anything with financial or academic consequence is prepared with the evidence assembled, then waits for a named approver."
            amber
          />
        </div>
      </Section>

      {/* ── The gap ── */}
      <Section tint={SURFACE}>
        <div className="grid lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] gap-8 lg:gap-14 items-start">
          <div>
            <Eyebrow>Why this is hard today</Eyebrow>
            <H2>The systems are fine. The seams are the problem.</H2>
            <Sub>
              A person is a lead in the admissions CRM, a roll number in the ERP, a candidate in the examination system and an
              APAAR ID at the Academic Bank of Credits — with no shared key between them. Every time a request crosses one of those
              boundaries, a member of staff carries it across by hand.
            </Sub>
          </div>
          <div className="space-y-4">
            <Seam
              label="The enrolment seam"
              body="The admissions CRM's own documentation describes handing over to the ERP at enrolment. Nobody owns the person crossing that line."
              kind="fact" src="merittoSeam"
            />
            <Seam
              label="The reporting seam"
              body="One institution reported faculty counts of 210, 166 and 195 to NAAC, NIRF and AISHE in the same year. Three officers, three portals, three silos, and no one compares the answers."
              kind="fact" src="edhitch"
            />
            <Seam
              label="The staffing seam"
              body="There is roughly one non-teaching staff member for every 28 students, and 68% of them sit in clerical grades. The queue at the counter is not a service design — it is an arithmetic result."
              kind="fact" src="aishe"
            />
          </div>
        </div>
      </Section>

      {/* ── Functions ── */}
      <Section id="functions">
        <div className="mb-7">
          <Eyebrow>What changes, office by office</Eyebrow>
          <H2>Pick the desk you are responsible for</H2>
          <Sub>Same platform, different outcome depending on who is asking. Figures on these screens are illustrative sample data; every claim below them carries its source.</Sub>
        </div>
        <OrgTabs />
      </Section>

      {/* ── Workflow ── */}
      <Section id="workflow" tint={SURFACE}>
        <div className="mb-7">
          <Eyebrow>Before and after</Eyebrow>
          <H2>One request, two institutions</H2>
          <Sub>A final-year student needs a transcript. Here is the same request in a university that runs on counters, and in one that runs on a front office.</Sub>
        </div>
        <BeforeAfter />
      </Section>

      {/* ── Comparison ── */}
      <Section id="compare">
        <div className="mb-7">
          <Eyebrow>Where this fits</Eyebrow>
          <H2>This does not replace what you already run</H2>
        </div>
        <Comparison />
      </Section>

      {/* ── Integrations ── */}
      <Section tint={SURFACE}>
        <div className="mb-7">
          <Eyebrow>Connects to</Eyebrow>
          <H2>The systems already in your institution</H2>
          <Sub>Read access first, then scoped write access. The system of record stays the system of record — every action is committed through it, never around it.</Sub>
        </div>
        <Integrations />
      </Section>

      {/* ── Trust ── */}
      <Section id="trust">
        <div className="mb-7">
          <Eyebrow>Governance</Eyebrow>
          <H2>What it will not do</H2>
          <Sub>Six limits, each with the regulation or reasoning behind it. These are constraints in the product, not guidance in a policy document.</Sub>
        </div>
        <Trust />
      </Section>

      {/* ── ROI ── */}
      <Section id="value" tint={SURFACE}>
        <div className="mb-7">
          <Eyebrow>Value model</Eyebrow>
          <H2>Change the assumptions until you believe them</H2>
          <Sub>Every input is editable and every output shows its arithmetic. The defaults are sourced where a source exists and labelled where one does not.</Sub>
        </div>
        <Roi />
      </Section>

      {/* ── Pilot ── */}
      <Section id="pilot">
        <div className="mb-7">
          <Eyebrow>How it starts</Eyebrow>
          <H2>Twelve weeks, one workflow, a measured answer</H2>
          <Sub>Not a platform rollout. One workflow with a deadline attached, run against live traffic with a holdout group, and a documented decision at the end.</Sub>
        </div>
        <Deployment />
      </Section>

      {/* ── CIO ── */}
      <Section tint={SURFACE}>
        <div className="mb-7">
          <Eyebrow color={MUTED}>For the CIO and IT team</Eyebrow>
          <H2>What is underneath</H2>
          <Sub>Everything above this line was written for the office that owns the outcome. This part is for the team that will own the build.</Sub>
        </div>
        <CioLayers />
      </Section>

      {/* ── Close ── */}
      <section className="py-16 md:py-20" style={{ backgroundColor: "#0F172A" }}>
        <div className="max-w-[1180px] mx-auto px-5 md:px-8">
          <div className="grid lg:grid-cols-[minmax(0,1fr)_auto] gap-8 items-end">
            <div>
              <div className="text-[11px] font-semibold uppercase mb-3" style={{ color: "#7DA2F0", letterSpacing: "0.1em" }}>The question to take to your next council meeting</div>
              <p className="text-[22px] md:text-[30px] font-bold tracking-[-0.025em] leading-[1.25] max-w-[26ch]" style={{ color: "#F8FAFC" }}>
                How many people asked your institution something this week, and how many got an answer?
              </p>
              <p className="text-[14px] leading-[1.6] mt-4 max-w-[62ch]" style={{ color: "#94A3B8" }}>
                Most institutions cannot answer that — not because they do not care, but because no system was ever asked to keep the score.
                That is the number this platform produces on day one, before it changes anything.
              </p>
            </div>
            <a
              href="#pilot"
              className="text-[13.5px] font-semibold rounded-lg px-5 py-3 inline-flex items-center gap-2 shrink-0"
              style={{ backgroundColor: "#fff", color: "#0F172A" }}
            >
              Start with one workflow <ArrowRight size={14} />
            </a>
          </div>
        </div>
      </section>

      {/* ── Sources ── */}
      <SourcesFooter />
    </div>
  );
}

function Fact({ title, body, amber }: { title: string; body: string; amber?: boolean }) {
  return (
    <div className="rounded-xl p-5" style={{ backgroundColor: SURFACE, border: `1px solid ${BORDER}` }}>
      <div className="text-[13px] font-semibold mb-1.5" style={{ color: amber ? "#B45309" : INK }}>{title}</div>
      <p className="text-[12.5px] leading-[1.6]" style={{ color: MUTED }}>{body}</p>
    </div>
  );
}

function Seam({ label, body, kind, src }: { label: string; body: string; kind: "fact" | "vendor" | "inference"; src: string }) {
  return (
    <div className="rounded-xl p-5" style={{ backgroundColor: CANVAS, border: `1px solid ${BORDER}` }}>
      <div className="text-[11px] font-semibold uppercase mb-2" style={{ color: BRAND, letterSpacing: "0.07em" }}>{label}</div>
      <p className="text-[13.5px] leading-[1.6]" style={{ color: INK }}>
        {body} <Tag kind={kind} src={src} />
      </p>
    </div>
  );
}

function SourcesFooter() {
  const [open, setOpen] = useState(false);
  const list = Object.values(SOURCES);
  return (
    <footer style={{ backgroundColor: SURFACE, borderTop: `1px solid ${BORDER}` }}>
      <div className="max-w-[1180px] mx-auto px-5 md:px-8 py-10">
        <div className="flex flex-wrap items-center gap-x-5 gap-y-3 mb-6">
          {(Object.keys(KIND_META) as (keyof typeof KIND_META)[]).map((k) => (
            <span key={k} className="inline-flex items-center gap-2 text-[11.5px]" style={{ color: MUTED }}>
              <Tag kind={k} /> {KIND_META[k].note}
            </span>
          ))}
        </div>

        <button
          onClick={() => setOpen(!open)}
          className="text-[12.5px] font-semibold inline-flex items-center gap-1.5"
          style={{ color: BRAND }}
          aria-expanded={open}
        >
          {open ? "Hide" : "Show"} all {list.length} sources
        </button>

        {open && (
          <ol className="mt-5 grid md:grid-cols-2 gap-x-8 gap-y-2">
            {list.map((s, i) => (
              <li key={s.id} className="text-[11.5px] leading-[1.55] flex gap-2">
                <span className="tabular-nums shrink-0" style={{ color: FAINT }}>{String(i + 1).padStart(2, "0")}</span>
                <a href={s.url} target="_blank" rel="noopener noreferrer" className="hover:underline inline-flex items-start gap-1" style={{ color: MUTED }}>
                  {s.label} <ExternalLink size={9} className="mt-[3px] shrink-0" />
                </a>
              </li>
            ))}
          </ol>
        )}

        <p className="text-[11.5px] leading-[1.65] mt-7 pt-6 max-w-[92ch]" style={{ color: FAINT, borderTop: `1px solid ${BORDER}` }}>
          Campus Front Office is a concept product experience built to test a category proposition. It is not a shipping product and
          no institution named or implied here is a customer. Board and dashboard figures are illustrative sample data. Where a number
          could not be sourced, it is labelled as an inference or a vendor benchmark rather than presented as fact — including the
          central claim of the value model, which no Indian university has yet published evidence for.
        </p>
      </div>
    </footer>
  );
}
