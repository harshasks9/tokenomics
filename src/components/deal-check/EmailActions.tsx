"use client";

import { useMemo, useState } from "react";
import { dpmEmail, type DealMeta } from "@/lib/deal-check/construct";
import type { Inputs, Result } from "@/lib/deal-check/engine";

export default function EmailActions({ meta, inputs, result }: { meta: DealMeta; inputs: Inputs; result: Result }) {
  const email = useMemo(() => dpmEmail(meta, inputs, result), [meta, inputs, result]);
  const [show, setShow] = useState(false);
  const [copied, setCopied] = useState(false);
  const text = `Subject: ${email.subject}\n\n${email.body}`;
  const copy = async () => {
    try { await navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 1500); } catch { setShow(true); }
  };
  const mailto = `mailto:?subject=${encodeURIComponent(email.subject)}&body=${encodeURIComponent(email.body)}`;
  return (
    <div>
      <div className="dc-toolbar">
        <button className="dc-btn primary" onClick={copy}>{copied ? "Copied" : "Copy email to DPM"}</button>
        <a className="dc-btn" href={mailto}>Open in mail app</a>
        <button className="dc-btn ghost" onClick={() => setShow((v) => !v)}>{show ? "Hide email" : "Preview email"}</button>
      </div>
      {show && <textarea className="dc-summary" readOnly value={text} onFocus={(e) => e.currentTarget.select()} aria-label="Email to DPM" />}
    </div>
  );
}
