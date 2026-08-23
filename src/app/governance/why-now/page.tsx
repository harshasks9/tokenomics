import type { Metadata } from "next";
import Link from "next/link";
import { Section, TalkTrack, DiscoveryQuestions } from "@/components/governance/ui";

export const metadata: Metadata = {
  title: "Why governance is changing",
  description:
    "Predictive ML validated an artifact. GenAI evaluates behavior. Agents authorize an actor. What each era breaks, and the regulatory clock now running.",
};

const ERAS = [
  {
    era: "Predictive ML",
    years: "~2012–2022",
    unit: "A model you built",
    question: "Is the model sound?",
    posture:
      "Classic model risk management (SR 11-7 shape): validate before deployment, monitor for drift, revalidate on schedule. It worked because models were deterministic, bounded, in-house, versioned, and used by a few experts.",
    hue: "data",
  },
  {
    era: "Generative AI",
    years: "2023–2025",
    unit: "A system you assembled",
    question: "Does the system behave?",
    posture:
      "Third-party models, unbounded natural-language input, non-deterministic output, every employee a user. The unit of validation becomes the pipeline — retrieval + prompt + model + output handling — and evaluation becomes continuous.",
    hue: "application",
  },
  {
    era: "Agentic AI",
    years: "2025 →",
    unit: "An actor you authorize",
    question: "What may it do — and who can stop it?",
    posture:
      "AI with identity, tools, memory, and delegated authority. Wrong answers become wrong actions. Governance moves to runtime authorization: per-agent identity, scoped permissions, approval gates, budgets, audit trails, kill switches.",
    hue: "agent",
  },
] as const;

const BROKEN = [
  {
    assumption: "Deterministic outputs",
    breaks: "Same prompt, different answers — validation can't be a fixed test-vector pass",
    control: "Statistical eval over behavior distributions; runtime guardrails",
  },
  {
    assumption: "Enumerable input space",
    breaks: "Input is unbounded language (and images, audio); adversarial inputs are infinite",
    control: "Red teaming as a program; input/output screening in the request path",
  },
  {
    assumption: "You built the model",
    breaks: "Frontier models are third-party; weights and training data not inspectable",
    control: "Vendor due diligence, model/system cards, benchmark acceptance, contracts",
  },
  {
    assumption: "Stable versions",
    breaks: "Providers update hosted models continuously — behavior shifts without your change ticket",
    control: "Version pinning, retirement runbooks, regression evals on provider updates",
  },
  {
    assumption: "Behavior fixed at training",
    breaks: "A system-prompt edit is a production behavior change with no retraining",
    control: "Prompts under change control with safety eval gates (the Grok lesson)",
  },
  {
    assumption: "The model is the unit",
    breaks: "The real unit is retrieval + prompt + model + tools + UI",
    control: "System-level validation; grounding metrics; an AI system inventory",
  },
  {
    assumption: "Few expert users",
    breaks: "Every employee operates models through assistants and copilots",
    control: "Acceptable use, literacy duties, DLP on prompts, tiered access",
  },
] as const;

const TIMELINE = [
  {
    date: "Feb 2025",
    label: "EU AI Act: prohibitions + AI literacy duties apply",
    detail: "Banned practices enforceable; every provider and deployer owes AI literacy measures.",
    hue: "security",
  },
  {
    date: "Aug 2025",
    label: "EU GPAI model obligations apply",
    detail:
      "Documentation, copyright policy, training-content summaries for general-purpose models; Code of Practice signed by Google, Microsoft, OpenAI, Anthropic, Amazon — Meta declined.",
    hue: "security",
  },
  {
    date: "Jan 2026",
    label: "Korea's AI Basic Act takes effect · California SB 53 + Texas TRAIGA live",
    detail:
      "First comprehensive national AI law after the EU (extraterritorial, high-impact regime); US states diverge as federal posture turns deregulatory.",
    hue: "enterprise",
  },
  {
    date: "Aug 2026",
    label: "EU Commission enforcement over GPAI begins · most transparency duties apply",
    detail:
      "Chatbot disclosure, synthetic-content marking, deepfake labeling now due; fines to €15M/3% for these duties, €35M/7% for prohibited practices.",
    hue: "security",
  },
  {
    date: "Dec 2027 / Aug 2028",
    label: "EU high-risk obligations (re-scheduled by the 2026 Digital Omnibus)",
    detail:
      "Annex III standalone systems by Dec 2027; product-embedded by Aug 2028. Deferred, not cancelled — deployer duties (Art. 26) arrive with them.",
    hue: "security",
  },
] as const;

export default function WhyNowPage() {
  return (
    <>
      <Section
        num="02"
        kicker="Why governance is changing"
        title="Three eras, three different problems."
        lede={
          <>
            AI governance did not get harder by degree — it changed in kind, twice, in three years.
            The one-line version:{" "}
            <strong>
              predictive-ML governance validated an artifact; GenAI governance evaluates a
              system&apos;s behavior; agent governance authorizes an actor
            </strong>{" "}
            — continuously, at runtime, with an identity, a budget, and an audit trail.
          </>
        }
      >
        <div className="g-grid-3">
          {ERAS.map((era) => (
            <div key={era.era} className="g-card" data-hue={era.hue} style={{ borderTop: "3px solid var(--hue)" }}>
              <div className="g-kicker" style={{ marginBottom: 6 }}>{era.years}</div>
              <h3 className="g-h3">{era.era}</h3>
              <p className="g-serif-voice" style={{ fontSize: 15, margin: "10px 0" }}>
                Governs: {era.unit}. Core question: {era.question}
              </p>
              <p className="g-small">{era.posture}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section
        kicker="What actually broke"
        title="Seven assumptions classic governance relied on."
        lede="Bank-grade model risk management encoded quiet assumptions. GenAI broke five; agents break the rest. Each break implies a specific new control — this table is the bridge from 'our MRM program covers AI' to what modern coverage really takes."
      >
        <div className="g-table-scroll">
          <table className="g-table">
            <thead>
              <tr>
                <th>Old assumption</th>
                <th>How it breaks now</th>
                <th>The control that replaces it</th>
              </tr>
            </thead>
            <tbody>
              {BROKEN.map((row) => (
                <tr key={row.assumption}>
                  <td className="lead">{row.assumption}</td>
                  <td>{row.breaks}</td>
                  <td>{row.control}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="g-insight" style={{ marginTop: 24 }}>
          Nothing on the right side of this table is a document. Every replacement control is a
          system property — which is why AI governance became a platform conversation.
        </p>
      </Section>

      <Section
        kicker="The regulatory clock"
        title="Deployers are now regulated parties."
        lede="You do not have to build AI to owe obligations — using it is enough. The dates below are the ones enterprise programs are actually planned around. (Regulation shown as binding law; see Sources for the full register and claim types.)"
        hue="security"
      >
        <div className="g-timeline" style={{ maxWidth: 720 }}>
          {TIMELINE.map((t) => (
            <div key={t.date} className="g-timeline-item" data-hue={t.hue}>
              <div className="g-timeline-date">{t.date}</div>
              <h3 className="g-h3" style={{ margin: "4px 0 4px" }}>{t.label}</h3>
              <p className="g-small">{t.detail}</p>
            </div>
          ))}
        </div>
        <p className="g-prose" style={{ marginTop: 24 }}>
          The through-line across the EU, Korea, and US states — whatever their differences:{" "}
          <strong>inventory your AI, tier it by risk, assess impact, keep humans in oversight, log
          operation, and report serious incidents.</strong> Those six verbs are exactly what the
          seven-layer stack operationalizes, which is why one governance program can serve every
          regime.
        </p>
      </Section>

      <Section kicker="Use it in the room" wide>
        <div className="g-grid-2">
          <TalkTrack
            insight="The customer's existing MRM program is the right instinct pointed at the wrong unit — extend it from artifacts to systems to actors."
            points={[
              "62% of organizations are experimenting with agents but only 23% are scaling — security and risk is the #1 blocker (McKinsey, 2026). Governance is the unlock.",
              "The EU's high-risk deferral to Dec 2027 is planning time, not a reprieve: transparency duties and GPAI enforcement are already live.",
              "Every broken-assumption row is a discovery question in disguise: ask which ones their current program actually covers.",
              "Agents are 12–18 months ahead of statute — the frameworks (OWASP agentic, SAIF 2.0) exist, the law doesn't yet. Leaders set their own bar now.",
            ]}
          />
          <DiscoveryQuestions
            questions={[
              "Which era is your governance program built for — artifacts, systems, or actors?",
              "Who tracks your obligations calendar across the EU, Korea, and US states — and what's due next?",
              "When a model provider updates a hosted model, what happens on your side?",
              "If an agent misfired tomorrow, which of the seven broken assumptions would the post-mortem cite?",
            ]}
          />
        </div>
        <div style={{ marginTop: 24 }} className="g-no-print">
          <Link href="/governance/stack" className="g-btn primary">
            Next: explore the seven-layer stack →
          </Link>
        </div>
      </Section>
    </>
  );
}
