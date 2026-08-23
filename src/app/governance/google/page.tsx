import type { Metadata } from "next";
import Link from "next/link";
import { GOOGLE_CAPABILITIES, LAYERS } from "@/lib/governance/data";
import { GoogleCapabilityMap } from "@/components/governance/GoogleCapabilityMap";
import { Section } from "@/components/governance/ui";

export const metadata: Metadata = {
  title: "Google Cloud governance",
  description:
    "Google Cloud's capabilities mapped onto the seven-layer governance framework — with current 2026 product names, reference architectures, and honest shared-responsibility notes.",
};

const REF_ARCHITECTURES = [
  {
    name: "Governed employee AI",
    for: "Rolling AI out to the whole workforce without feeding shadow AI",
    flow: "Workspace AI controls per OU → label/IRM exclusions keep crown jewels out of retrieval → context-aware access gates AI surfaces by device → Gemini Enterprise as the governed agent storefront with admin allowlists → Chrome Enterprise Premium coaches or blocks paste/upload to unsanctioned AI → usage audit logs to Cloud Logging.",
    proof: "The Macquarie pattern: training-gated, bank-wide rollout on an already-governed foundation.",
  },
  {
    name: "Governed custom application",
    for: "Customer-facing or high-stakes apps on the Agent Platform",
    flow: "Org-policy model allowlist pins approved models → VPC-SC perimeter + CMEK + regional endpoints set the data envelope → Model Armor floor guarantees screening; advanced Sensitive Data Protection de-identifies both directions and the logs → Gen AI evaluation gates every prompt/model change in CI → Data Access audit logs + opt-in redacted request/response logging → Provisioned Throughput reserves production capacity.",
    proof: "The Deutsche Bank / Commerzbank shape: evals as the compliance artifact, prompts logged and queryable.",
  },
  {
    name: "Governed agent fleet",
    for: "Agents that act on systems, data, and money",
    flow: "Agents built in ADK (OTel-instrumented) → evaluated and simulated pre-deploy → run in Agent Runtime with CMEK-protected Sessions/Memory Bank → each holds a SPIFFE-based Agent Identity mapped to IAM → every tool/MCP call traverses the Agent Gateway with Model Armor inline → untrusted code executes in the gVisor Agent Sandbox → Agent Registry is the inventory and kill switch → SCC AI Protection watches posture, anomalies, and attack paths.",
    proof: "SAIF 2.0's three agent principles rendered as products: human controllers, limited powers, observable actions.",
  },
  {
    name: "AI gateway over a multi-vendor estate",
    for: "Enterprises running Gemini alongside OpenAI, Anthropic, and self-hosted models",
    flow: "Apigee as the single AI front door: per-consumer token quotas, semantic caching, model routing/failover, analytics for chargeback → Model Armor invoked as a gateway policy so injection/leakage screening is uniform across providers → the load balancer chains Cloud Armor and Service Extensions so even non-Apigee traffic (agents, MCP) gets screened → SCC watches the whole estate.",
    proof: "The Goldman/Walmart pattern with managed parts: governance written once at the gateway, inherited by every app.",
  },
] as const;

const HONEST_GAPS = [
  "GenAI drift monitoring is not a turnkey product — Model Monitoring covers predictive models; for LLMs you assemble continuous evaluation plus dashboards.",
  "Model allowlisting governs Model Garden models, not arbitrary self-hosted weights on GKE/GCE — open weights are deliberately outside the control plane.",
  "Gemini's native safety filters do not apply to partner models (Claude, Llama). The cross-model control is Model Armor — position it that way, and note it adds latency and, for advanced inspection, cost.",
  "Audit logs never contain prompts. Content-level audit means deliberately enabling request-response logging — then you own retention, access, and PII handling (mitigate with SDP redaction).",
  "Caching is on by default; zero data retention is a configuration, not a default. Verify per-service terms during contracting.",
  "Residency can lag the frontier: the newest Gemini versions often launch on the global endpoint first. Never promise regional processing without the per-model matrix.",
  "Model retirements are aggressive (~6 months after a successor). Version pinning is temporary; a migration runbook is a governance cost of the platform.",
  "EU AI Act conformity stays with the deployer: Google supplies certifications, logging, and evidence tooling — risk classification, impact assessments, and oversight design are the customer's.",
  "The agent governance stack (Identity, Registry, Gateway, Sandbox) shipped in 2026 — expect Preview labels and evolving APIs; check status per component before proposals.",
] as const;

export default function GooglePage() {
  return (
    <>
      <Section
        num="08"
        kicker="Google Cloud governance"
        title="The governance problem first — then the products that answer it."
        lede={
          <>
            Google&apos;s posture in one line: publish the frameworks (AI Principles, Frontier Safety
            Framework, SAIF 2.0), then ship governance as <strong>configurable platform
            primitives</strong>{" "}
            — allowlists in the resource hierarchy, screening floors in the
            request path, identity down to individual agents — under a &ldquo;shared fate&rdquo;
            posture with contractual commitments: no training on your data without permission, and
            IP indemnification for covered generative services.
          </>
        }
      >
        <div className="g-card" style={{ borderColor: "var(--warn-ink)", borderLeftWidth: 3, marginBottom: 8 }}>
          <div className="g-block-title" style={{ color: "var(--warn-ink)" }}>Naming update sellers must get right (2025–2026)</div>
          <div className="g-table-scroll" style={{ border: "none", boxShadow: "none" }}>
            <table className="g-table" style={{ minWidth: 480 }}>
              <thead>
                <tr>
                  <th>Say this now</th>
                  <th>Formerly</th>
                </tr>
              </thead>
              <tbody>
                <tr><td className="lead">Gemini Enterprise Agent Platform</td><td>Vertex AI (the builder platform; APIs unchanged)</td></tr>
                <tr><td className="lead">Gemini Enterprise</td><td>Agentspace (the employee-facing agent workplace)</td></tr>
                <tr><td className="lead">Agent Runtime</td><td>Vertex AI Agent Engine</td></tr>
                <tr><td className="lead">Agent Search</td><td>Vertex AI Search</td></tr>
                <tr><td className="lead">Knowledge Catalog</td><td>Dataplex Universal Catalog</td></tr>
              </tbody>
            </table>
          </div>
          <p className="g-micro" style={{ marginTop: 8 }}>
            Two brands are easily confused: <strong>Gemini Enterprise</strong> is what employees
            use; the <strong>Agent Platform</strong>{" "}
            is what builders use. Customers&apos; internal
            runbooks referencing old names need an update pass — a genuine consulting opening.
          </p>
        </div>
      </Section>

      <Section
        kicker="The capability map"
        title="Every capability, mapped to the layer it governs."
        lede="Filter by layer. Each card names the governance problem the capability solves — not just what it is — with its status and a link to official documentation."
      >
        <GoogleCapabilityMap layers={LAYERS} capabilities={GOOGLE_CAPABILITIES} />
      </Section>

      <Section
        kicker="How it fits together"
        title="Four reference architectures."
        lede="The capabilities compose into four repeatable shapes. Each is anchored to a public customer pattern from the examples library."
      >
        <div className="g-grid-2">
          {REF_ARCHITECTURES.map((ra, i) => (
            <div key={ra.name} className="g-card">
              <div className="g-kicker" style={{ marginBottom: 8 }}>
                <span className="g-kicker-num">R{i + 1}</span>
                {ra.for}
              </div>
              <h3 className="g-h3">{ra.name}</h3>
              <p className="g-small" style={{ marginTop: 10, color: "var(--ink-2)", lineHeight: 1.65 }}>{ra.flow}</p>
              <p className="g-micro" style={{ marginTop: 10, fontStyle: "italic" }}>{ra.proof}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section
        kicker="Credibility section"
        title="Honest gaps and shared responsibility."
        lede="A governance story earns trust by naming its own limits. These are the ones to say before the customer finds them."
        hue="security"
      >
        <ul className="g-list" style={{ maxWidth: "56em" }}>
          {HONEST_GAPS.map((gap, i) => (
            <li key={i}>{gap}</li>
          ))}
        </ul>
        <div className="g-google-band" style={{ marginTop: 28 }}>
          <div className="g-block-title">Compliance anchors (verify scope per deal)</div>
          <div className="g-grid-4">
            <div>
              <div className="g-h3" style={{ fontSize: 14 }}>ISO/IEC 42001</div>
              <p className="g-micro">Accredited AI-management-system certification covering the platform (announced Dec 2024).</p>
            </div>
            <div>
              <div className="g-h3" style={{ fontSize: 14 }}>FedRAMP High</div>
              <p className="g-micro">Generative AI and enterprise search authorized; Workspace Gemini also at FedRAMP High.</p>
            </div>
            <div>
              <div className="g-h3" style={{ fontSize: 14 }}>HIPAA (BAA)</div>
              <p className="g-micro">Platform HIPAA-eligible under the Cloud BAA — with configuration duties, not by default.</p>
            </div>
            <div>
              <div className="g-h3" style={{ fontSize: 14 }}>EU AI Act support</div>
              <p className="g-micro">Dedicated program plus Audit Manager evidence automation; conformity remains the deployer&apos;s.</p>
            </div>
          </div>
        </div>
        <div style={{ marginTop: 24 }} className="g-no-print">
          <Link href="/governance/examples" className="g-btn primary">
            Next: see it working in the examples →
          </Link>
        </div>
      </Section>
    </>
  );
}
