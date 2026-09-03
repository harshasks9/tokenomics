"use client";

import { motion } from "framer-motion";
import { ArrowRight, TrendingUp, MessageSquareText, FileSearch, Workflow } from "lucide-react";
import { C, Reveal, SectionHeading, Cite } from "./ui";

const STATS = [
  { value: "S$88.9B", label: "Tax revenue, FY2024/25", cite: "iras-ar" },
  { value: "0.58¢", label: "Cost per dollar collected", cite: "iras-ar" },
  { value: ">2M", label: "Taxpayers on No-Filing Service, YA2026", cite: "iras-nfs" },
  { value: "90.4%", label: "Corporate on-time filing, YA2024 — a record", cite: "iras-cit" },
  { value: "S$507M", label: "Recovered from >8,600 audit & investigation cases", cite: "iras-ar" },
];

const SHIFTS = [
  {
    Icon: MessageSquareText,
    from: "Answers as links",
    to: "Answers as resolution",
    d: "Today a taxpayer searches, reads, and interprets. AI that understands intent, reasons across guidance and initiates permitted next steps turns every interaction into a resolved one.",
    color: C.blue,
  },
  {
    Icon: FileSearch,
    from: "Officers assembling context",
    to: "Officers exercising judgment",
    d: "Case history, correspondence, supporting documents and precedent — assembled in minutes by AI, so officer time goes to the decision, not the retrieval.",
    color: C.purple,
  },
  {
    Icon: TrendingUp,
    from: "Risk models on samples",
    to: "Intelligence across the population",
    d: "IRAS already applies analytics to non-compliance. Multimodal AI extends coverage to documents, correspondence and relationships that structured models never saw.",
    color: C.teal,
  },
  {
    Icon: Workflow,
    from: "Digital forms",
    to: "Tax that happens by itself",
    d: "NFS and direct assessment already remove filing for millions. InvoiceNow brings transaction data to IRAS by 2031. AI is what turns that data into taxes that are simply correct.",
    color: C.amber,
  },
];

export default function WhyNow() {
  return (
    <section id="iras-whynow" className="bg-white border-t border-[#F1F3F4]">
      <div className="section-container">
        <SectionHeading
          kicker="02 · Why Now"
          title="IRAS has already digitised tax. The next chapter is intelligence."
          takeaway="Few tax authorities in the world run this efficiently. That is exactly why the remaining gains are not in more digitisation — they are in understanding, reasoning and acting on what is already digital."
        />

        {/* Stat band */}
        <Reveal delay={0.1}>
          <div className="mt-12 grid grid-cols-2 lg:grid-cols-5 rounded-2xl border border-[#E8EAED] bg-[#F8F9FA] overflow-hidden">
            {STATS.map((s, i) => (
              <div
                key={s.label}
                className={`p-5 lg:p-6 ${i > 0 ? "border-l border-[#E8EAED]" : ""} ${
                  i >= 2 ? "max-lg:border-t max-lg:border-[#E8EAED]" : ""
                } ${i % 2 === 0 ? "max-lg:border-l-0" : ""}`}
              >
                <p className="text-2xl lg:text-[28px] font-bold tracking-tight text-[#202124] tabular-nums">
                  {s.value}
                  <Cite k={s.cite} />
                </p>
                <p className="mt-1.5 text-[11.5px] leading-snug text-[#5F6368] font-medium">
                  {s.label}
                </p>
              </div>
            ))}
          </div>
        </Reveal>

        <Reveal delay={0.15}>
          <p className="mt-6 max-w-3xl text-[15px] leading-relaxed text-[#5F6368]">
            IRAS states it is{" "}
            <em className="text-[#202124] not-italic font-semibold">
              &ldquo;expanding the use of data and AI across all functions&rdquo;
            </em>{" "}
            — from managing non-compliance to service delivery
            <Cite k="iras-ai" />. Singapore&rsquo;s national posture points the same way: Smart
            Nation 2.0<Cite k="smart-nation" />, a refreshed National AI Strategy
            <Cite k={["nais", "nais-refresh"]} />, and a 2026 national AI partnership between the
            Government and Google that includes a joint sandbox for government use of AI agents
            <Cite k="natl-partnership" />. The question is no longer whether AI belongs in tax
            administration — it is which platform lets IRAS adopt it fastest, safest, and without
            betting the next decade on today&rsquo;s technology.
          </p>
        </Reveal>

        {/* Four shifts */}
        <div className="mt-14 grid md:grid-cols-2 gap-5">
          {SHIFTS.map((s, i) => (
            <Reveal key={s.from} delay={0.08 * i}>
              <motion.div
                whileHover={{ y: -3 }}
                className="h-full rounded-2xl border border-[#E8EAED] bg-white p-6 shadow-[0_1px_3px_rgba(32,33,36,0.05)] hover:shadow-[0_8px_28px_rgba(32,33,36,0.09)] transition-shadow"
              >
                <span
                  className="flex h-10 w-10 items-center justify-center rounded-xl"
                  style={{ background: `${s.color}12` }}
                >
                  <s.Icon size={19} color={s.color} />
                </span>
                <div className="mt-4 flex flex-wrap items-center gap-2 text-[15px] font-bold">
                  <span className="text-[#9AA0A6] line-through decoration-[#DADCE0]">{s.from}</span>
                  <ArrowRight size={15} color={s.color} />
                  <span className="text-[#202124]">{s.to}</span>
                </div>
                <p className="mt-2.5 text-[13.5px] leading-relaxed text-[#5F6368]">{s.d}</p>
              </motion.div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
