"use client";

import { useRef, useState } from "react";

/** Posts to the shared Deal Check auth route, so one passcode and cookie cover this plan too. */
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
      const response = await fetch("/api/deal-check/auth", {
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
        data && typeof data === "object" && "error" in data ? String((data as { error: unknown }).error) : "That passcode was not recognised.";
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
    <form onSubmit={submit}>
      <label htmlFor="k-passcode" className="k-field">
        Passcode
        <input
          ref={inputRef}
          id="k-passcode"
          name="passcode"
          type="password"
          autoComplete="current-password"
          autoFocus
          required
          value={passcode}
          onChange={(e) => {
            setPasscode(e.target.value);
            if (error) setError(null);
          }}
          className="k-input"
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? "k-passcode-error" : undefined}
        />
      </label>
      <div style={{ minHeight: 20, marginTop: 8 }}>
        {error ? (
          <p id="k-passcode-error" role="alert" style={{ margin: 0, fontSize: 12.5, color: "var(--risk)" }}>
            {error}
          </p>
        ) : null}
      </div>
      <button type="submit" className="k-btn primary" disabled={pending || passcode.length === 0}>
        {pending ? "Checking…" : "Enter"}
      </button>
    </form>
  );
}
