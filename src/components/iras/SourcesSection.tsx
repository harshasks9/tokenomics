"use client";

import { ExternalLink } from "lucide-react";
import { SOURCES } from "@/lib/iras/sources";
import { Reveal } from "./ui";

const GROUPS = ["IRAS", "Singapore Government", "Google Cloud", "Open Standards"] as const;

export default function SourcesSection() {
  return (
    <section id="iras-sources" className="bg-[#F8F9FA] border-t border-[#E8EAED]">
      <div className="section-container !py-14">
        <Reveal>
          <h2 className="text-xl font-bold text-[#202124]">Sources</h2>
          <p className="mt-2 max-w-3xl text-[13px] leading-relaxed text-[#5F6368]">
            Facts on this site were verified against the sources below in September 2026. Content
            marked <em>Potential IRAS scenario</em> or <em>Illustrative</em> describes proposed
            experiences and adoption paths, not existing IRAS systems. Product capabilities and
            certification scopes should be re-verified against current documentation before any
            contractual commitment.
          </p>
        </Reveal>
        <div className="mt-8 grid md:grid-cols-2 gap-x-10 gap-y-8">
          {GROUPS.map((g) => (
            <div key={g}>
              <p className="text-[10px] font-bold uppercase tracking-widest text-[#9AA0A6] mb-3">
                {g}
              </p>
              <ol className="space-y-2">
                {SOURCES.map((s, i) =>
                  s.group === g ? (
                    <li key={s.key} className="flex gap-2.5 text-[12px] leading-relaxed">
                      <span className="shrink-0 font-bold text-[#5F6368] tabular-nums">
                        [{i + 1}]
                      </span>
                      <a
                        href={s.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#3C4043] hover:text-[#1A73E8] transition-colors group"
                      >
                        {s.title}
                        <ExternalLink
                          size={10}
                          className="ml-1 inline-block opacity-40 group-hover:opacity-100"
                        />
                      </a>
                    </li>
                  ) : null
                )}
              </ol>
            </div>
          ))}
        </div>
        <p className="mt-10 border-t border-[#E8EAED] pt-6 text-[11px] leading-relaxed text-[#9AA0A6] max-w-3xl">
          This microsite is an independent point-of-view prepared for discussion with IRAS. It is
          not an IRAS publication and does not represent IRAS positions. Google, Google Cloud,
          Gemini, Gemma and related marks belong to Google LLC; other marks belong to their
          respective owners.
        </p>
      </div>
    </section>
  );
}
