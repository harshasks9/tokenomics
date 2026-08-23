import type { Metadata } from "next";
import Link from "next/link";
import { CHALLENGES, LAYER_MAP, VENDORS } from "@/lib/governance/data";
import { Expander } from "@/components/governance/Expander";
import { Section } from "@/components/governance/ui";

export const metadata: Metadata = {
  title: "How vendors approach governance",
  description:
    "Challenge-led comparison of governance architectures across Google Cloud, Microsoft, AWS, OpenAI, and Anthropic — philosophies, enforcement points, and honest gaps.",
};

const VENDOR_ORDER = ["google", "microsoft", "aws", "openai", "anthropic"] as const;

export default function VendorsPage() {
  return (
    <>
      <Section
        num="07"
        kicker="How vendors approach governance"
        title="Same promises, different architectures."
        lede={
          <>
            By 2026, three things are table stakes everywhere: no training on business data by
            default, an ISO/IEC 42001 certificate, and some form of content guardrail. What actually
            differentiates vendors is <strong>where in the stack policy is enforced</strong> and{" "}
            <strong>how much governance is productized versus left for you to build</strong>. This
            page compares architectures, not checkbox lists — drawn from each vendor&apos;s own
            documentation.
          </>
        }
      >
        <div className="g-grid-2">
          {VENDORS.map((v) => (
            <div key={v.id} className="g-card" style={v.id === "google" ? { borderColor: "var(--accent-line)", background: "var(--accent-wash)" } : undefined}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 10 }}>
                <h3 className="g-h3">{v.name}</h3>
                {v.id === "google" ? <span className="g-badge google">This site&apos;s sponsor — judge us the same way</span> : null}
              </div>
              <p className="g-small" style={{ marginTop: 8, color: "var(--ink-2)" }}>{v.philosophy}</p>
              <p className="g-micro" style={{ marginTop: 8 }}>
                <strong style={{ fontWeight: 700 }}>Written down in:</strong> {v.philosophyDocs}
              </p>
              <p className="g-small" style={{ marginTop: 10 }}>
                <strong style={{ fontWeight: 650, color: "var(--ink)" }}>Enforcement center of gravity:</strong>{" "}
                {v.enforcement}
              </p>
              <div className="g-grid-2" style={{ marginTop: 12, gap: 12 }}>
                <div>
                  <div className="g-block-title" style={{ marginBottom: 6 }}>Distinctive strengths</div>
                  <ul className="g-list" style={{ gap: 6 }}>
                    {v.strengths.map((s, i) => (
                      <li key={i} style={{ fontSize: 13 }}>{s}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <div className="g-block-title" style={{ marginBottom: 6 }}>You still build</div>
                  <ul className="g-list" style={{ gap: 6 }}>
                    {v.customerMustBuild.map((s, i) => (
                      <li key={i} style={{ fontSize: 13 }}>{s}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
          <div className="g-card" style={{ display: "flex", flexDirection: "column", justifyContent: "center" }}>
            <div className="g-block-title">The universal gap</div>
            <p className="g-small" style={{ color: "var(--ink-2)" }}>
              No model vendor productizes your <strong>use-case registry, intake workflow, and
              cross-vendor policy enforcement</strong>. That is why the AI gateway became the de
              facto enterprise enforcement point, and why governance platforms exist as a category.
              Whoever you buy models from, plan to own this layer.
            </p>
            <p className="g-micro" style={{ marginTop: 10 }}>
              See challenge 7 below for the gateway pattern in detail.
            </p>
          </div>
        </div>
      </Section>

      <Section
        kicker="Challenge by challenge"
        title="Start from the problem, not the product."
        lede="Seven governance challenges customers actually raise. Each opens into: the principle, what any enterprise needs, how the market approaches it, how each vendor implements it — and the questions to ask whichever vendor is in the room."
      >
        <div>
          {CHALLENGES.map((ch, i) => (
            <Expander
              key={ch.id}
              defaultOpen={i === 0}
              head={
                <span style={{ display: "flex", alignItems: "baseline", gap: 12, flexWrap: "wrap" }}>
                  <span className="g-kicker-num" style={{ background: "var(--line-soft)", color: "var(--muted)" }}>{i + 1}</span>
                  <span className="g-h3">{ch.question}</span>
                  <span style={{ display: "inline-flex", gap: 4 }}>
                    {ch.layerIds.map((id) => {
                      const l = LAYER_MAP[id];
                      return (
                        <span key={id} data-hue={l.hue} className="g-badge hue" style={{ fontSize: 9 }}>
                          {l.short}
                        </span>
                      );
                    })}
                  </span>
                </span>
              }
            >
              <p className="g-serif-voice" style={{ fontSize: 15.5 }}>{ch.principle}</p>
              <div className="g-grid-2" style={{ marginTop: 16 }}>
                <div>
                  <div className="g-block-title" style={{ marginBottom: 6 }}>What any enterprise needs</div>
                  <ul className="g-list" style={{ gap: 6 }}>
                    {ch.required.map((r, j) => (
                      <li key={j} style={{ fontSize: 13 }}>{r}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <div className="g-block-title" style={{ marginBottom: 6 }}>Architectural approaches in the market</div>
                  <ul className="g-list" style={{ gap: 6 }}>
                    {ch.approaches.map((a, j) => (
                      <li key={j} style={{ fontSize: 13 }}>{a}</li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="g-table-scroll" style={{ marginTop: 18 }}>
                <table className="g-table">
                  <thead>
                    <tr>
                      <th style={{ width: 130 }}>Provider</th>
                      <th>Implementation, per their documentation</th>
                    </tr>
                  </thead>
                  <tbody>
                    {VENDOR_ORDER.map((vid) => {
                      const vendor = VENDORS.find((v) => v.id === vid)!;
                      return (
                        <tr key={vid} style={vid === "google" ? { background: "var(--accent-wash)" } : undefined}>
                          <td className="lead">{vendor.name}</td>
                          <td>{ch.vendorNotes[vid]}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              <div className="g-block" style={{ marginTop: 16 }}>
                <div className="g-block-title">Ask any vendor</div>
                <ul className="g-list g-list-q" style={{ gap: 6 }}>
                  {ch.askVendors.map((q, j) => (
                    <li key={j} style={{ fontSize: 13.5 }}>{q}</li>
                  ))}
                </ul>
              </div>
            </Expander>
          ))}
        </div>
        <p className="g-micro" style={{ marginTop: 16 }}>
          Vendor capabilities move fast; this comparison is a snapshot (August 2026) built from
          first-party documentation — links in{" "}
          <Link href="/governance/sources" style={{ textDecoration: "underline" }}>Sources</Link>. Where a
          capability matters to a deal, verify against the vendor&apos;s current docs.
        </p>
      </Section>
    </>
  );
}
