import type { Metadata } from "next";
import { LAYERS, MATURITY_STAGES, READINESS_QUESTIONS } from "@/lib/governance/data";
import { ReadinessQuiz } from "@/components/governance/ReadinessQuiz";
import { Section } from "@/components/governance/ui";

export const metadata: Metadata = {
  title: "Governance readiness",
  description:
    "A 14-question diagnostic across the seven layers: current maturity, biggest gaps, and what to prioritize — runs entirely in the browser.",
};

export default function ReadinessPage() {
  return (
    <>
      <Section
        num="10"
        kicker="Governance readiness"
        title="How mature is your AI governance — really?"
        lede="Fourteen questions, two per layer, four maturity levels each. Five minutes with a customer produces a per-layer profile, the gaps to close first, and the topics to bring to their Google Cloud team. Nothing is stored or transmitted — answers live only in this browser."
      >
        <div className="g-grid-4" style={{ marginBottom: 36 }}>
          {MATURITY_STAGES.map((s) => (
            <div key={s.level} className="g-card">
              <div className="g-kicker" style={{ marginBottom: 6 }}>
                <span className="g-kicker-num">{s.level}</span>
                {s.name}
              </div>
              <p className="g-small">{s.meaning}</p>
            </div>
          ))}
        </div>
        <ReadinessQuiz layers={LAYERS} questions={READINESS_QUESTIONS} stages={MATURITY_STAGES} />
      </Section>
    </>
  );
}
