"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Cog, Landmark, ShieldCheck } from "lucide-react";
import { C, Reveal, SectionHeading, Cite } from "./ui";

/* “Ask the hard question” — each concern pairs a technology control with a governance duty */
const CONCERNS = [
  {
    id: "residency",
    q: "Does taxpayer data ever leave Singapore?",
    tech: "Google Cloud offers in-region AI processing in asia-southeast1 — including training and inference residency commitments announced for Singapore — plus VPC Service Controls perimeters and customer-managed encryption keys. For workloads policy keeps off the public cloud entirely, Gemini runs on Google Distributed Cloud air-gapped, fully disconnected from Google.",
    techCites: ["google-sg", "residency", "gdc"],
    gov: "IRAS classifies workloads and decides which tier each one requires — public region, sovereign controls, or air-gapped — and reviews that mapping as policy and products evolve. Residency configuration is verified per model and service before go-live, not assumed.",
  },
  {
    id: "training",
    q: "Will our data train someone else’s model?",
    tech: "Google Cloud’s generative AI data governance commitment: customer data is not used to train Google models without permission. Zero-data-retention configurations remove even transient caching.",
    techCites: ["data-governance"],
    gov: "IRAS encodes this in contract and verifies it in configuration — per service, per model, including any third-party models it enables. Procurement and legal own the paper; platform teams own the settings.",
  },
  {
    id: "hallucination",
    q: "What stops the AI from making things up?",
    tech: "Grounding constrains answers to approved corpora and attaches citations. The evaluation service scores groundedness and quality continuously, before and after deployment — the same harness for any model on the platform.",
    techCites: ["grounding", "genai-eval"],
    gov: "IRAS defines the accuracy bar per use case, curates the golden datasets evaluations run against, and decides what happens when scores dip: which workloads pause, who investigates, who signs off on resumption. A citation requirement is policy, not just a feature.",
  },
  {
    id: "injection",
    q: "What about prompt injection and jailbreaks?",
    tech: "Model Armor screens prompts and responses for injection, jailbreak attempts and sensitive-data leakage — model-agnostically, so one policy covers Gemini, open-weight and third-party models alike. Security Command Center AI Protection monitors the AI estate, including agents and MCP servers.",
    techCites: ["model-armor", "scc-aip"],
    gov: "IRAS red-teams its own applications against CSA’s Guidelines on Securing AI Systems and the 2026 Addendum on agentic AI, defines incident-response runbooks for AI-specific attacks, and treats adversarial testing as a release gate.",
    govCites: ["csa-ai", "csa-agentic"],
  },
  {
    id: "agents",
    q: "Who approved what an agent can do?",
    tech: "Agents carry individual identities mapped to IAM; tool calls pass a policy gateway; actions are allowlisted; execution can be sandboxed; every step lands in audit logs. A registry provides fleet-wide inventory and a kill switch.",
    techCites: ["scc-aip", "adk"],
    gov: "IRAS decides which actions any agent may ever take, sets the human-checkpoint thresholds, and owns the approval workflow for new agents and tools — the operating model CSA’s agentic addendum asks system owners to define.",
    govCites: ["csa-agentic"],
  },
  {
    id: "oversight",
    q: "How do we prove a human stayed accountable?",
    tech: "Immutable audit logs for administration; opt-in request/response logging for content; OpenTelemetry traces across model and tool calls. Explainable outputs: recommendations arrive with the evidence and reasoning attached.",
    techCites: ["scc-aip"],
    gov: "IRAS designs decision rights: which outcomes require an officer’s signature, how AI assistance is recorded in the case file, and how taxpayers are told when AI was involved — the accountability dimension of Singapore’s Model AI Governance Framework.",
    govCites: ["mgf"],
  },
];

const CERTS = [
  { label: "MTCS SS 584 Tier 3", note: "Singapore’s highest cloud security tier", cite: "mtcs" },
  { label: "ISO/IEC 42001", note: "Certified AI management system", cite: "iso42001" },
  { label: "GCC-ready", note: "Google Cloud is a Government on Commercial Cloud provider", cite: "gcc" },
  { label: "SAIF 2.0", note: "Secure AI Framework, extended to agents", cite: "saif" },
];

export default function Trust() {
  const [active, setActive] = useState(0);
  const c = CONCERNS[active];

  return (
    <section id="iras-trust" className="bg-white border-t border-[#F1F3F4]">
      <div className="section-container">
        <SectionHeading
          kicker="08 · Trust"
          title="AI IRAS can govern."
          takeaway="For a tax authority, trust is the product. Every hard question has two halves: a control the technology enforces, and a decision only IRAS can own. Technology alone never solves responsible AI."
        />

        {/* Question selector */}
        <Reveal delay={0.1}>
          <div className="mt-10 flex flex-wrap gap-2">
            {CONCERNS.map((q, i) => (
              <button
                key={q.id}
                onClick={() => setActive(i)}
                className="rounded-full border px-4 py-2 text-[13px] font-semibold transition-all"
                style={{
                  background: active === i ? C.navy : "#fff",
                  color: active === i ? "#fff" : "#3C4043",
                  borderColor: active === i ? C.navy : "#DADCE0",
                }}
                aria-pressed={active === i}
              >
                {q.q}
              </button>
            ))}
          </div>
        </Reveal>

        {/* Paired answer */}
        <AnimatePresence mode="wait">
          <motion.div
            key={c.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.28 }}
            className="mt-8 grid md:grid-cols-2 gap-5"
          >
            <div className="rounded-2xl border-2 border-[#1A73E8]/25 bg-[#E8F0FE]/40 p-7">
              <p className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-[#174EA6]">
                <Cog size={14} /> What the technology enforces
              </p>
              <p className="mt-3 text-[14.5px] leading-relaxed text-[#202124]">
                {c.tech}
                <Cite k={c.techCites} />
              </p>
            </div>
            <div className="rounded-2xl border-2 border-[#188038]/25 bg-[#E6F4EA]/40 p-7">
              <p className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-[#188038]">
                <Landmark size={14} /> What IRAS must govern
              </p>
              <p className="mt-3 text-[14.5px] leading-relaxed text-[#202124]">
                {c.gov}
                {c.govCites && <Cite k={c.govCites} />}
              </p>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Singapore alignment strip */}
        <Reveal delay={0.15}>
          <div className="mt-12 rounded-2xl border border-[#E8EAED] bg-[#F8F9FA] p-6 lg:p-8">
            <div className="flex flex-col lg:flex-row lg:items-center gap-6">
              <div className="lg:max-w-sm">
                <p className="flex items-center gap-2 text-sm font-bold text-[#202124]">
                  <ShieldCheck size={16} color={C.green} />
                  Aligned with Singapore&rsquo;s own frameworks
                </p>
                <p className="mt-1.5 text-[12.5px] leading-relaxed text-[#5F6368]">
                  The governance model here maps to IMDA&rsquo;s Model AI Governance Framework for
                  Generative AI<Cite k="mgf" />, CSA&rsquo;s guidance on securing AI and agentic
                  systems<Cite k={["csa-ai", "csa-agentic"]} />, and Government on Commercial Cloud
                  practice<Cite k="gcc" /> — not a parallel universe of vendor policy.
                </p>
              </div>
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3 flex-1">
                {CERTS.map((cert) => (
                  <div key={cert.label} className="rounded-xl border border-[#E8EAED] bg-white p-4">
                    <p className="text-[12.5px] font-bold text-[#202124]">
                      {cert.label}
                      <Cite k={cert.cite} />
                    </p>
                    <p className="mt-1 text-[11px] leading-snug text-[#5F6368]">{cert.note}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.2}>
          <p className="mt-8 text-center text-[13px] text-[#9AA0A6] max-w-2xl mx-auto">
            Certification scope varies by service — MTCS and other attestations cover defined
            service subsets and should be verified against workload requirements during design.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
