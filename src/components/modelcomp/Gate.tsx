"use client";

import { useRef, useState } from "react";
import { COMPILED_ON, PASSCODE } from "@/lib/modelcomp/data";

/**
 * Client-side passcode gate.
 *
 * Session-scoped by design: the unlocked flag lives in React state and nowhere
 * else, so a reload asks again. A shared passcode is access friction, not
 * security — nothing here should be anything but internal analysis.
 */
export default function Gate({ onUnlock }: { onUnlock: () => void }) {
  const [value, setValue] = useState("");
  const [error, setError] = useState<string | null>(null);
  const input = useRef<HTMLInputElement>(null);

  function submit(event: React.FormEvent) {
    event.preventDefault();
    if (value.trim().length === 0) return;
    if (value.trim().toUpperCase() === PASSCODE) {
      onUnlock();
      return;
    }
    setError("That passcode was not recognised.");
    setValue("");
    input.current?.focus();
  }

  return (
    <main className="mc-gate">
      <div className="mc-gate-card">
        <p className="mc-eyebrow">Internal · Access required</p>

        <h1 className="mc-h1" style={{ fontSize: "2rem", marginTop: 14 }}>
          MODELCOMP
        </h1>

        <p className="mc-muted" style={{ fontSize: 13.5, marginTop: 10, lineHeight: 1.6 }}>
          Twelve months of the AI capability frontier, against the Google flagship available at each
          moment. Competitive analysis — not for external distribution.
        </p>

        <form onSubmit={submit} style={{ marginTop: 26 }}>
          <label htmlFor="mc-passcode" className="mc-eyebrow" style={{ display: "block" }}>
            Passcode
          </label>
          <input
            ref={input}
            id="mc-passcode"
            name="passcode"
            type="password"
            autoComplete="current-password"
            autoFocus
            required
            className="mc-input"
            style={{ marginTop: 10 }}
            placeholder="••••••••••••"
            value={value}
            onChange={(event) => {
              setValue(event.target.value);
              if (error) setError(null);
            }}
            aria-invalid={error ? true : undefined}
            aria-describedby={error ? "mc-passcode-error" : "mc-passcode-hint"}
          />

          <div style={{ marginTop: 10, minHeight: 18 }}>
            {error ? (
              <p id="mc-passcode-error" role="alert" className="mc-error">
                {error}
              </p>
            ) : (
              <p id="mc-passcode-hint" className="mc-muted" style={{ fontSize: 12 }}>
                Shared with the competitive-intelligence group.
              </p>
            )}
          </div>

          <button type="submit" className="mc-btn" style={{ marginTop: 16 }} disabled={value.length === 0}>
            Enter
          </button>
        </form>

        <div className="mc-hairline" style={{ marginTop: 30, paddingTop: 14 }}>
          <p className="mc-muted" style={{ fontSize: 11, lineHeight: 1.7 }}>
            Verified &amp; compiled {COMPILED_ON}. A shared passcode is access friction, not
            security — the gate holds for this tab only and is asked again on reload.
          </p>
        </div>
      </div>
    </main>
  );
}
