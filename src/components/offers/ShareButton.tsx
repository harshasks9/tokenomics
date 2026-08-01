"use client";

import { useState } from "react";
import type { Levers } from "@/lib/offers/model";
import { shareUrl } from "@/lib/offers/params";

export default function ShareButton({
  levers,
  presetId,
}: {
  levers: Levers;
  presetId: string | null;
}) {
  const [label, setLabel] = useState("Share");

  async function copy() {
    const url = shareUrl(
      window.location.origin,
      window.location.pathname,
      levers,
      presetId,
    );
    try {
      await navigator.clipboard.writeText(url);
      setLabel("Copied");
    } catch {
      // Clipboard permission denied (or an insecure origin) — put the URL in
      // the address bar so it can still be copied by hand.
      window.history.replaceState(null, "", url);
      setLabel("In URL bar");
    }
    setTimeout(() => setLabel("Share"), 2000);
  }

  return (
    <button type="button" className="o-btn" onClick={copy}>
      {label}
    </button>
  );
}
