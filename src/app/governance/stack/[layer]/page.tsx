import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { LAYER_IDS, type LayerId } from "@/lib/governance/types";
import {
  LAYERS,
  RISKS,
  capabilitiesById,
  examplesForLayer,
} from "@/lib/governance/data";
import { DepthTabs } from "@/components/governance/DepthTabs";
import { ClaimBadge, DiscoveryQuestions, GoogleBand, TalkTrack } from "@/components/governance/ui";

export function generateStaticParams() {
  return LAYER_IDS.map((layer) => ({ layer }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ layer: string }>;
}): Promise<Metadata> {
  const { layer: layerId } = await params;
  const layer = LAYERS.find((l) => l.id === layerId);
  if (!layer) return { title: "Layer not found" };
  return {
    title: `${layer.num}. ${layer.name}`,
    description: layer.question,
  };
}

export default async function LayerPage({ params }: { params: Promise<{ layer: string }> }) {
  const { layer: layerParam } = await params;
  const layer = LAYERS.find((l) => l.id === layerParam);
  if (!layer) notFound();

  const layerIndex = LAYERS.findIndex((l) => l.id === layer.id);
  const prev = LAYERS[layerIndex - 1];
  const next = LAYERS[layerIndex + 1];
  const layerRisks = RISKS.filter((r) => layer.riskIds.includes(r.id));
  const caps = capabilitiesById(layer.googleCapabilityIds);
  const related = examplesForLayer(layer.id as LayerId).slice(0, 3);

  return (
    <div data-hue={layer.hue}>
      {/* header */}
      <section className="g-section" style={{ paddingTop: 48, paddingBottom: 40 }}>
        <div className="g-wrap">
          <div className="g-kicker">
            <span className="g-kicker-num">Layer {layer.num}</span>
            <Link href="/governance/stack" style={{ color: "inherit" }}>
              The governance stack
            </Link>
            <span style={{ color: "var(--faint)" }}>/ {layer.short}</span>
          </div>
          <h1 className="g-h1" style={{ fontSize: "clamp(28px, 4vw, 40px)" }}>
            {layer.name}
          </h1>
          <p className="g-serif-voice" style={{ fontSize: 19, marginTop: 12 }}>
            {layer.question}
          </p>
          <p className="g-prose" style={{ marginTop: 16 }}>{layer.summary}</p>
        </div>
      </section>

      {/* depth tabs */}
      <section className="g-section" style={{ paddingTop: 36 }}>
        <div className="g-wrap">
          <DepthTabs
            executive={
              <div>
                <div className="g-card" style={{ borderLeft: "3px solid var(--hue)", marginBottom: 20 }}>
                  <div className="g-block-title">The risk, in one line</div>
                  <p className="g-serif-voice" style={{ fontSize: 17 }}>{layer.executive.riskLine}</p>
                </div>
                <div className="g-grid-2">
                  <div>
                    <h3 className="g-h3" style={{ marginBottom: 12 }}>Why leadership should care</h3>
                    <ul className="g-list">
                      {layer.executive.stakes.map((s, i) => (
                        <li key={i}>{s}</li>
                      ))}
                    </ul>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                    {layer.executive.anchor ? (
                      <div className="g-card">
                        <div className="g-stat" style={{ color: "var(--hue-ink)" }}>{layer.executive.anchor.value}</div>
                        <div className="g-stat-label">{layer.executive.anchor.label}</div>
                      </div>
                    ) : null}
                    <div className="g-card">
                      <div className="g-block-title">Decisions only leadership can make</div>
                      <ul className="g-list g-list-q">
                        {layer.executive.decisions.map((d, i) => (
                          <li key={i}>{d}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            }
            practitioner={
              <div>
                <h3 className="g-h3" style={{ marginBottom: 12 }}>Required controls</h3>
                <div className="g-table-scroll">
                  <table className="g-table">
                    <thead>
                      <tr>
                        <th>Control</th>
                        <th>What it does</th>
                        <th>Primary owner</th>
                        <th>Technical mechanisms</th>
                        <th>Standards hooks</th>
                      </tr>
                    </thead>
                    <tbody>
                      {layer.practitioner.controls.map((c) => (
                        <tr key={c.control}>
                          <td className="lead" style={{ whiteSpace: "normal", minWidth: 140 }}>{c.control}</td>
                          <td style={{ minWidth: 220 }}>{c.what}</td>
                          <td style={{ minWidth: 120 }}>{c.owner}</td>
                          <td style={{ minWidth: 200 }}>{c.mechanisms}</td>
                          <td style={{ minWidth: 150 }}>{c.standards}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="g-grid-2" style={{ marginTop: 20 }}>
                  <div className="g-block">
                    <div className="g-block-title">What good looks like</div>
                    <ul className="g-list g-list-check">
                      {layer.practitioner.goodLooksLike.map((g, i) => (
                        <li key={i}>{g}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="g-block">
                    <div className="g-block-title">Operating notes</div>
                    <ul className="g-list">
                      {layer.practitioner.operating.map((o, i) => (
                        <li key={i}>{o}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            }
            technical={
              <div>
                <h3 className="g-h3" style={{ marginBottom: 12 }}>Where policy is enforced</h3>
                <div className="g-table-scroll">
                  <table className="g-table">
                    <thead>
                      <tr>
                        <th>Enforcement point</th>
                        <th>What happens there</th>
                        <th>Examples</th>
                      </tr>
                    </thead>
                    <tbody>
                      {layer.technical.enforcementPoints.map((p) => (
                        <tr key={p.point}>
                          <td className="lead" style={{ whiteSpace: "normal", minWidth: 140 }}>{p.point}</td>
                          <td style={{ minWidth: 220 }}>{p.what}</td>
                          <td style={{ minWidth: 220 }}>{p.examples}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="g-grid-2" style={{ marginTop: 20 }}>
                  <div className="g-block">
                    <div className="g-block-title">Technical mechanisms</div>
                    <ul className="g-list">
                      {layer.technical.mechanisms.map((m, i) => (
                        <li key={i}>{m}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="g-block">
                    <div className="g-block-title">Monitored & audited via</div>
                    <ul className="g-list">
                      {layer.technical.monitoring.map((m, i) => (
                        <li key={i}>{m}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            }
          />
        </div>
      </section>

      {/* risks + standards */}
      <section className="g-section">
        <div className="g-wrap">
          <div className="g-grid-2">
            <div>
              <div className="g-block-title">Risks concentrated at this layer</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {layerRisks.map((r) => (
                  <Link key={r.id} href="/governance/risks" className="g-chip hue" title={r.blurb}>
                    <span className="g-dot" />
                    {r.name}
                  </Link>
                ))}
              </div>
            </div>
            <div>
              <div className="g-block-title">Read the claims right</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8, alignItems: "center" }}>
                {layer.standardsHooks.map((h) => (
                  <span key={h.label} style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
                    <ClaimBadge kind={h.kind} />
                    <span className="g-small">{h.label}</span>
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* google band */}
      <section className="g-section">
        <div className="g-wrap">
          <GoogleBand>
            <div className="g-grid-3">
              {caps.map((cap) => (
                <a
                  key={cap.id}
                  href={cap.docsUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="g-card g-card-hover"
                  style={{ display: "block" }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", gap: 8, alignItems: "start" }}>
                    <h3 className="g-h3" style={{ fontSize: 14.5 }}>{cap.name}</h3>
                    <span className={`g-badge ${cap.status === "GA" ? "ga" : "preview"}`}>{cap.status}</span>
                  </div>
                  <p className="g-micro" style={{ marginTop: 2 }}>{cap.family}</p>
                  <p className="g-small" style={{ marginTop: 8, color: "var(--ink-2)" }}>{cap.oneLiner}</p>
                  <p className="g-micro" style={{ marginTop: 8 }}>{cap.solves}</p>
                </a>
              ))}
            </div>
            <p className="g-micro" style={{ marginTop: 14 }}>
              Cards link to official documentation. Status is a snapshot (August 2026) — verify per
              component before contractual commitments. Full mapping and honest gaps:{" "}
              <Link href="/governance/google" style={{ textDecoration: "underline" }}>
                08 · Google Cloud
              </Link>
              .
            </p>
          </GoogleBand>
        </div>
      </section>

      {/* seller aids */}
      <section className="g-section">
        <div className="g-wrap">
          <div className="g-grid-2">
            <TalkTrack insight={layer.insight} points={layer.talkTrack} />
            <DiscoveryQuestions questions={layer.discovery} />
          </div>
        </div>
      </section>

      {/* related examples + nav */}
      <section className="g-section">
        <div className="g-wrap">
          {related.length > 0 ? (
            <>
              <div className="g-block-title">Proof it works — examples touching this layer</div>
              <div className="g-grid-3" style={{ marginBottom: 32 }}>
                {related.map((ex) => (
                  <Link key={ex.id} href="/governance/examples" className="g-card g-card-hover" style={{ display: "block" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", gap: 8 }}>
                      <h3 className="g-h3" style={{ fontSize: 14.5 }}>{ex.company}</h3>
                      <span className={`g-badge ${ex.lens === "google" ? "google" : ""}`}>
                        {ex.lens === "google" ? "Google Cloud" : "Market"}
                      </span>
                    </div>
                    <p className="g-micro" style={{ marginTop: 2 }}>{ex.industry}</p>
                    <p className="g-small" style={{ marginTop: 8 }}>{ex.lessons[0]}</p>
                  </Link>
                ))}
              </div>
            </>
          ) : null}
          <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }} className="g-no-print">
            {prev ? (
              <Link href={`/governance/stack/${prev.id}`} className="g-btn">
                ← {prev.num}. {prev.short}
              </Link>
            ) : (
              <Link href="/governance/stack" className="g-btn">
                ← The stack
              </Link>
            )}
            {next ? (
              <Link href={`/governance/stack/${next.id}`} className="g-btn">
                {next.num}. {next.short} →
              </Link>
            ) : (
              <Link href="/governance/readiness" className="g-btn accent">
                Rate your readiness →
              </Link>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
