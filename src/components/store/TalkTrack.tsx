"use client";

import { useState } from "react";
import { talk } from "@/lib/store/data";
import { Section, Reveal } from "./ui";
import { useFill } from "./StoreContext";

export default function TalkTrack() {
  const fill = useFill();
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(talk.script.map(fill).join("\n\n"));
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };
  return (
    <Section id="talk" eyebrow={talk.eyebrow} title={talk.title} lead={talk.lead}>
      <Reveal>
        <div className="ds-card p-7 md:p-9">
          <ol className="grid gap-5" aria-label="Talk track">
            {talk.script.map((p, i) => (
              <li key={i} className="grid gap-2 md:grid-cols-[48px_1fr] md:gap-6">
                <span className="ds-tag pt-1" aria-hidden="true">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <p className="text-[17px] leading-[1.55] md:text-[19px]">{fill(p)}</p>
              </li>
            ))}
          </ol>
          <div className="mt-8 flex flex-wrap items-center gap-4 border-t border-[var(--line)] pt-6">
            <button type="button" className="ds-btn ds-btn--primary" onClick={copy} aria-live="polite">
              {copied ? talk.copied : talk.button}
            </button>
            <p className="ds-small">{talk.hint}</p>
          </div>
        </div>
      </Reveal>
    </Section>
  );
}
