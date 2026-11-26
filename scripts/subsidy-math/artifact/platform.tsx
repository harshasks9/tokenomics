"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

/**
 * Stand-alone (claude.ai page) version of src/components/subsidy-math/platform.tsx.
 * Pages are #views inside one document; files are offered through the viewer's
 * `downloads` capability, because the page sandbox ignores plain downloads.
 */

export type DocName = "memo" | "email" | "claims";

export const HOME_HREF = "#top";
export const docHref = (name: DocName) => `#${name}`;

export function AppLink({ href, className, children }: { href: string; className?: string; children: ReactNode }) {
  return <a href={href} className={className}>{children}</a>;
}

interface DownloadsApi { save: (r: { filename: string; data: string | Blob }) => Promise<{ status: string }> }
interface ClaudeHost { use?: (name: string) => Promise<unknown> }

let downloadsPromise: Promise<DownloadsApi | null> | null = null;

/** Resolve the downloads capability once the host is present; null when this view cannot save files. */
function getDownloads(): Promise<DownloadsApi | null> {
  if (downloadsPromise) return downloadsPromise;
  const host = (window as unknown as { claude?: ClaudeHost }).claude;
  if (!host?.use) return Promise.resolve(null);
  downloadsPromise = host.use("downloads").then((d) => (d as DownloadsApi | null) ?? null, () => null);
  return downloadsPromise;
}

const MESSAGES: Record<string, string> = {
  declined: "Cancelled.",
  rate_limited: "Another save is open — try again in a moment.",
  host_unavailable: "This app can't save files — open the page in a browser to download.",
};

function useSave(): [string, (filename: string, data: () => Promise<string | Blob>) => Promise<void>] {
  const [msg, setMsg] = useState("");
  const save = async (filename: string, data: () => Promise<string | Blob>) => {
    try {
      const api = await getDownloads();
      if (!api) { setMsg("Downloads aren't available in this view — open the page on claude.ai."); return; }
      setMsg("");
      await api.save({ filename, data: await data() });
      setMsg("Saved.");
    } catch (e) {
      const code = (e as { code?: string })?.code ?? "unavailable";
      setMsg(MESSAGES[code] ?? "Couldn't save the file here.");
    }
  };
  return [msg, save];
}

/** The workbook travels inside the page as base64 (<script type="application/octet-stream" id="sm-xlsx">), written by build.mjs. */
function workbookBlob(): Blob {
  const b64 = document.getElementById("sm-xlsx")?.textContent?.trim() ?? "";
  if (!b64) throw Object.assign(new Error("workbook missing"), { code: "unavailable" });
  const bin = atob(b64);
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i += 1) bytes[i] = bin.charCodeAt(i);
  return new Blob([bytes], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
}

export function ModelDownload({ className, children }: { className?: string; children: ReactNode }) {
  const blob = useRef<Blob | null>(null);
  const [msg, save] = useSave();
  useEffect(() => {
    try { blob.current = workbookBlob(); } catch { blob.current = null; }
  }, []);
  return (
    <span style={{ display: "grid", gap: 6 }}>
      <button type="button" className={className} onClick={() => save("subsidy-math-model.xlsx", async () => blob.current ?? workbookBlob())}>{children}</button>
      {msg && <small className="sm-src" role="status">{msg}</small>}
    </span>
  );
}

/** Save a Markdown deliverable that is bundled into the page. */
export function TextDownload({ filename, text, className, children }: { filename: string; text: string; className?: string; children: ReactNode }) {
  const [msg, save] = useSave();
  return (
    <span style={{ display: "inline-grid", gap: 4 }}>
      <button type="button" className={className} onClick={() => save(filename, async () => text)}>{children}</button>
      {msg && <small className="sm-src" role="status">{msg}</small>}
    </span>
  );
}
