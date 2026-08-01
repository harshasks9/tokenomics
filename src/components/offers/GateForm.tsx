"use client";

import { useRef, useState } from "react";

export default function GateForm({ next }: { next: string }) {
  const [passcode, setPasscode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    if (pending || passcode.length === 0) return;
    setPending(true);
    setError(null);
    try {
      const response = await fetch("/api/offers/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ passcode }),
      });
      if (response.ok) {
        // Full navigation so the proxy re-runs and sees the new cookie.
        window.location.assign(next);
        return;
      }
      const data: unknown = await response.json().catch(() => null);
      const message =
        data && typeof data === "object" && "error" in data
          ? String((data as { error: unknown }).error)
          : "That passcode was not recognised.";
      setError(message);
      setPasscode("");
      inputRef.current?.focus();
    } catch {
      setError("Network error. Check your connection and try again.");
    } finally {
      setPending(false);
    }
  }

  return (
    <form onSubmit={submit} className="mt-9">
      <label htmlFor="passcode" className="o-eyebrow block">
        Passcode
      </label>
      <input
        ref={inputRef}
        id="passcode"
        name="passcode"
        type="password"
        autoComplete="current-password"
        autoFocus
        required
        value={passcode}
        onChange={(event) => {
          setPasscode(event.target.value);
          if (error) setError(null);
        }}
        className="o-input mt-3"
        placeholder="••••••••••••"
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? "passcode-error" : "passcode-hint"}
      />

      <div className="mt-3 min-h-[18px]">
        {error ? (
          <p
            id="passcode-error"
            role="alert"
            className="o-mono text-[11px] leading-[1.5]"
            style={{ color: "var(--red)" }}
          >
            {error}
          </p>
        ) : (
          <p id="passcode-hint" className="o-mono o-faint text-[11px]">
            Shared with the GTM team.
          </p>
        )}
      </div>

      {/* Ghost until there is something to submit, then it lights up. */}
      <button
        type="submit"
        disabled={pending || passcode.length === 0}
        className="o-btn mt-5 w-full"
        style={
          passcode.length > 0 && !pending
            ? {
                background: "var(--ink)",
                color: "var(--canvas)",
                borderColor: "var(--ink)",
                minHeight: 44,
              }
            : { minHeight: 44 }
        }
      >
        {pending ? "Checking…" : "Enter"}
      </button>
    </form>
  );
}
