"use client";

import { useState } from "react";

/** Copies the plain text of a Markdown deliverable (formatting markers stripped) to the clipboard. */
export default function CopyButton({ file }: { file: string }) {
  const [state, setState] = useState<"idle" | "done" | "error">("idle");
  return (
    <button
      type="button"
      className="sm-btn"
      onClick={async () => {
        try {
          const md = await (await fetch(file)).text();
          const text = md.replace(/^# .*\n+/, "").replace(/\*\*([^*]+)\*\*/g, "$1").replace(/\*([^*]+)\*/g, "$1").replace(/\[([^\]]+)\]\([^)]+\)/g, "$1");
          await navigator.clipboard.writeText(text);
          setState("done");
        } catch {
          setState("error");
        }
      }}
    >
      {state === "done" ? "Copied" : state === "error" ? "Copy failed — select the text instead" : "Copy email text"}
    </button>
  );
}
