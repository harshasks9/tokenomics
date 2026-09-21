"use client";

import { useState } from "react";

/** Parse "450K", "1.2M", "$300,000", "2" → number. NaN when unreadable. */
export function parseNum(raw: string): number {
  const s = raw.trim().replace(/[$,\s]/g, "").toLowerCase();
  if (!s) return NaN;
  const m = s.match(/^(-?\d*\.?\d+)([km])?$/);
  if (!m) return NaN;
  const v = parseFloat(m[1]);
  return m[2] === "k" ? v * 1_000 : m[2] === "m" ? v * 1_000_000 : v;
}

export function formatNum(v: number, kind: "users" | "usd" | "price" | "plain" | "pct"): string {
  if (!Number.isFinite(v)) return "";
  switch (kind) {
    case "users": return v >= 1_000_000 ? `${+(v / 1_000_000).toFixed(3)}M` : v >= 1_000 ? `${+(v / 1_000).toFixed(1)}K` : String(Math.round(v));
    case "usd": return v >= 1_000_000 ? `${+(v / 1_000_000).toFixed(3)}M` : v >= 1_000 ? `${+(v / 1_000).toFixed(1)}K` : String(Math.round(v));
    case "price": return v.toFixed(2);
    case "pct": return String(+v.toFixed(1));
    default: return String(v);
  }
}

interface Props {
  id?: string;
  label?: string;
  value: number;
  kind: "users" | "usd" | "price" | "plain" | "pct";
  onCommit: (v: number) => string | void;
  hint?: string;
  prefix?: string;
  suffix?: string;
  min?: number;
  max?: number;
  step?: number;
  disabled?: boolean;
  compact?: boolean;
  ariaLabel?: string;
}

/**
 * Text field that commits on blur or Enter, accepts K/M shorthand, and shows a
 * message when the commit handler rejects the value (e.g. below the price floor).
 */
export default function Field({ id, label, value, kind, onCommit, hint, prefix, suffix, min, max, disabled, compact, ariaLabel }: Props) {
  const [text, setText] = useState(() => formatNum(value, kind));
  const [error, setError] = useState<string | null>(null);
  const [focused, setFocused] = useState(false);

  // Re-sync the text when the underlying value changes from elsewhere (preset, solver, table)
  // without clobbering what the user is typing.
  const [seen, setSeen] = useState(value);
  if (seen !== value) {
    setSeen(value);
    if (!focused) setText(formatNum(value, kind));
  }

  const commit = () => {
    const v = parseNum(text);
    if (!Number.isFinite(v)) { setText(formatNum(value, kind)); setError(null); return; }
    let next = v;
    if (min !== undefined && next < min) { setError(`Minimum ${formatNum(min, kind)}`); setText(formatNum(value, kind)); return; }
    if (max !== undefined && next > max) next = max;
    const msg = onCommit(next);
    if (msg) { setError(msg); setText(formatNum(value, kind)); return; }
    setError(null);
  };

  const input = (
    <input
      id={id}
      type="text"
      inputMode="decimal"
      className={`mg-num${error ? " err" : ""}`}
      value={text}
      disabled={disabled}
      aria-label={ariaLabel ?? label}
      aria-invalid={error ? true : undefined}
      onFocus={() => { setFocused(true); setError(null); }}
      onChange={(e) => setText(e.target.value)}
      onBlur={() => { setFocused(false); commit(); }}
      onKeyDown={(e) => { if (e.key === "Enter") (e.target as HTMLInputElement).blur(); if (e.key === "Escape") { setText(formatNum(value, kind)); (e.target as HTMLInputElement).blur(); } }}
    />
  );

  if (compact) return <span className="mg-cell-edit">{prefix && <span className="fix">{prefix}</span>}{input}{suffix && <span className="fix">{suffix}</span>}{error && <span className="mg-err" role="alert">{error}</span>}</span>;

  return (
    <label className="mg-field" htmlFor={id}>
      {label && <span className="lab">{label}</span>}
      <span className="mg-inwrap">{prefix && <span className="fix">{prefix}</span>}{input}{suffix && <span className="fix">{suffix}</span>}</span>
      {error ? <span className="mg-err" role="alert">{error}</span> : hint ? <span className="hint">{hint}</span> : null}
    </label>
  );
}
