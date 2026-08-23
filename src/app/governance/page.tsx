import type { Metadata } from "next";
import Link from "next/link";
import { LAYERS, RISKS, PERSONAS, ARCHITECTURES } from "@/lib/governance/data";
import { StackExplorer } from "@/components/governance/StackExplorer";
import { Stat } from "@/components/governance/ui";

export const metadata: Metadata = {
  title: "AI Governance — what it actually takes to govern AI across an enterprise",
};

export default function GovernanceHome() {
  return (
    <>
      {/* 01 — the question */}
      <section className="g-section" style={{ paddingTop: 72 }}>
        <div className="g-wrap">
          <div className="g-kicker">
            <span className="g-kicker-num">01</span>
            A field guide for enterprise conversations · August 2026
          </div>
          <h1 className="g-h1">
            What does it actually take to govern AI across an enterprise?
          </h1>
          <p className="g-lede" style={{ fontSize: 18, maxWidth: "42em" }}>
            Not a policy binder, and not a product list. Seven layers of decisions and controls —
            from who is accountable, to what the AI may know, to what an agent may do on its own —
            each enforced in the platform, not just written in documents. This guide gives every
            audience the same mental model, at the depth they need.
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginTop: 28 }} className="g-no-print">
            <Link href="/governance/stack" className="g-btn primary">
              Explore the framework
            </Link>
            <Link href="/governance/personas" className="g-btn">
              What does it mean for me?
            </Link>
            <Link href="/governance/readiness" className="g-btn">
              Rate your readiness
            </Link>
          </div>
        </div>
      </section>

      {/* why this matters, in four numbers */}
      <section className="g-section">
        <div className="g-wrap">
          <div className="g-kicker">The gap, in four numbers</div>
          <div className="g-grid-4">
            <Stat
              value="28%"
              label="of organizations report CEO-level oversight of AI governance"
              source="McKinsey State of AI, 2025"
            />
            <Stat
              value="72%"
              label="of enterprise GenAI use flows through personal accounts"
              source="Netskope Cloud & Threat Report, 2025"
            />
            <Stat
              value="97%"
              label="of organizations with AI-related breaches lacked AI access controls"
              source="IBM Cost of a Data Breach, 2025"
            />
            <Stat
              value="2.3 / 4"
              label="average AI trust maturity — agentic controls score lowest"
              source="McKinsey State of AI Trust, 2026"
            />
          </div>
          <p className="g-insight" style={{ marginTop: 28 }}>
            Adoption has outrun governance everywhere. The enterprises that scale AI safely are not
            the ones with the thickest policies — they are the ones whose policies compile into the
            platform.
          </p>
        </div>
      </section>

      {/* the stack */}
      <section className="g-section">
        <div className="g-wrap">
          <div className="g-kicker">The framework in 30 seconds</div>
          <h2 className="g-h2">Seven layers. One question each.</h2>
          <p className="g-lede">
            Everything in AI governance hangs off seven layers. An executive can hold the questions
            in mind; a practitioner can own the controls; an architect can build the enforcement.
            Select a layer to preview it — every layer goes three levels deep.
          </p>
          <div style={{ marginTop: 32 }}>
            <StackExplorer layers={LAYERS} risks={RISKS} />
          </div>
        </div>
      </section>

      {/* the operating loop / thesis */}
      <section className="g-section">
        <div className="g-wrap">
          <div className="g-kicker">The point of view</div>
          <h2 className="g-h2">Policy must compile.</h2>
          <p className="g-lede">
            Every public AI failure — the invented refund policy, the leaked source code, the agent
            that deleted a production database — happened at a company that had a policy against it.
            What was missing was enforcement in the request path. Across all seven layers, the same
            loop applies:
          </p>
          <div className="g-grid-4" style={{ marginTop: 28 }}>
            {[
              {
                num: "a",
                name: "Set policy",
                what: "Decide risk appetite, acceptable use, and tiering — write rules that name their enforcement point.",
              },
              {
                num: "b",
                name: "Gate the lifecycle",
                what: "Intake, impact assessment, evaluation gates, and release control before anything ships.",
              },
              {
                num: "c",
                name: "Enforce at runtime",
                what: "Allowlists, screening floors, identity, quotas — controls that run on every request, bypassable by no one.",
              },
              {
                num: "d",
                name: "Prove it",
                what: "Logs, traces, and evidence generated continuously — audit posture as a by-product, not a fire drill.",
              },
            ].map((step) => (
              <div key={step.num} className="g-card">
                <div className="g-kicker" style={{ marginBottom: 8 }}>
                  <span className="g-kicker-num">{step.num}</span>
                  {step.name}
                </div>
                <p className="g-small" style={{ color: "var(--ink-2)" }}>{step.what}</p>
              </div>
            ))}
          </div>
          <p className="g-prose" style={{ marginTop: 24 }}>
            This maps directly onto the frameworks your customers already know — NIST&apos;s
            Govern–Map–Measure–Manage, ISO/IEC 42001&apos;s management system, Gartner&apos;s AI
            TRiSM — but it says the quiet part out loud: <strong>the differentiating layer is
            runtime enforcement plus evidence</strong>, and that is a platform property.
          </p>
        </div>
      </section>

      {/* three entry doors */}
      <section className="g-section">
        <div className="g-wrap">
          <div className="g-kicker">Three ways in</div>
          <h2 className="g-h2">Start from whoever is in the room.</h2>
          <div className="g-grid-3" style={{ marginTop: 28 }}>
            <Link href="/governance/personas" className="g-card g-card-hover" style={{ display: "block" }}>
              <div className="g-block-title">By persona</div>
              <p className="g-small" style={{ color: "var(--ink-2)" }}>
                &ldquo;What does AI governance mean for me?&rdquo; — {PERSONAS.length} views, from board to
                business user, each with the decisions they own and the questions they should ask.
              </p>
              <span className="g-micro" style={{ display: "block", marginTop: 12, color: "var(--accent-ink)", fontWeight: 700 }}>
                Explore personas →
              </span>
            </Link>
            <Link href="/governance/risks" className="g-card g-card-hover" style={{ display: "block" }}>
              <div className="g-block-title">By risk</div>
              <p className="g-small" style={{ color: "var(--ink-2)" }}>
                {RISKS.length} risks that keep this conversation honest — each with documented incidents,
                the controls that mitigate it, and where it lives in the stack.
              </p>
              <span className="g-micro" style={{ display: "block", marginTop: 12, color: "var(--accent-ink)", fontWeight: 700 }}>
                Explore risks →
              </span>
            </Link>
            <Link href="/governance/architectures" className="g-card g-card-hover" style={{ display: "block" }}>
              <div className="g-block-title">By architecture</div>
              <p className="g-small" style={{ color: "var(--ink-2)" }}>
                Governance differs by what you deploy: {ARCHITECTURES.length} patterns from employee
                assistants to multi-agent fleets and air-gapped AI.
              </p>
              <span className="g-micro" style={{ display: "block", marginTop: 12, color: "var(--accent-ink)", fontWeight: 700 }}>
                Explore architectures →
              </span>
            </Link>
          </div>
        </div>
      </section>

      {/* for sellers */}
      <section className="g-section">
        <div className="g-wrap">
          <div className="g-google-band">
            <div className="g-block-title">How to use this in a customer meeting</div>
            <div className="g-grid-3">
              <div>
                <h3 className="g-h3" style={{ marginBottom: 6 }}>Open with the stack</h3>
                <p className="g-small">
                  Put the seven layers on screen and ask: &ldquo;which of these keeps you up at
                  night?&rdquo; The answer picks the page for the next ten minutes.
                </p>
              </div>
              <div>
                <h3 className="g-h3" style={{ marginBottom: 6 }}>Go one level deep, not three</h3>
                <p className="g-small">
                  Every layer page has an executive view first. The practitioner and technical
                  depths are there when the CISO or architect leans in — not before.
                </p>
              </div>
              <div>
                <h3 className="g-h3" style={{ marginBottom: 6 }}>End with discovery</h3>
                <p className="g-small">
                  Each page carries &ldquo;questions to ask your organization.&rdquo; Leave those
                  with the customer — or run the readiness diagnostic together in five minutes.
                </p>
              </div>
            </div>
            <p className="g-micro" style={{ marginTop: 16 }}>
              Objectivity note: the market treatment comes first on every topic; the &ldquo;How
              Google Cloud approaches this&rdquo; band is clearly marked, and the framework stands
              on sources a customer can check.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
