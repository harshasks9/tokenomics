"use client";

import { TriangleAlert } from "lucide-react";
import { useSite } from "../context";
import { Block, MotionTag, Section, Src } from "../ui";
import type { FlowModel } from "@/lib/korea-fy27/flow";

export default function FlowTakeaways({ flow }: { flow: FlowModel }) {
  const { model } = useSite();
  const { headline: h, facts, fragility } = model;
  const verticalLabel = (id: string) => flow.verticals.find((v) => v.id === id)?.label ?? id;

  return (
    <Section
      id="f-takeaways"
      num="3"
      label="GTM takeaways"
      question="What should change in how we go to market for AI in Korea?"
      headline={h.insight}
      lead="Six takeaways. Each ties a number in the deck to a change in how we go to market, and to the motions and verticals that act on it."
    >
      <Block title="What FY26 taught us" sub={h.fy26Definition}>
        <div className="k-grid k-g4">
          {facts.map((f) => (
            <div className="k-card k-stat" key={f.label}>
              <span className="l">{f.label}</span>
              <span className="v">{f.headline}</span>
              <span className="d">{f.detail}</span>
            </div>
          ))}
        </div>
        <p className="k-src" style={{ color: "var(--risk)" }}>
          <TriangleAlert size={14} aria-hidden="true" style={{ flex: "none" }} />
          <span style={{ color: "var(--ink-2)" }}>{fragility.text}</span>
        </p>
      </Block>

      <Block title="Six takeaways for our AI go-to-market">
        <ol className="k-takeaways">
          {flow.takeaways.map((t, i) => (
            <li className="k-take" key={t.learned}>
              <span className="n" aria-hidden="true">
                {i + 1}
              </span>
              <div>
                <h4>What we learned</h4>
                <p>{t.learned}</p>
                <Src src={t.src} />
              </div>
              <div className="gtm">
                <h4>What it means for our GTM</h4>
                <p>{t.gtm}</p>
                <p className="k-pill-row" style={{ marginTop: 8 }}>
                  {t.motions.map((m) => (
                    <MotionTag key={m} motion={m} />
                  ))}
                  {t.verticals.map((id) => (
                    <a key={id} className="k-pill" href={`#${id}`}>
                      {verticalLabel(id)}
                    </a>
                  ))}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </Block>
    </Section>
  );
}
