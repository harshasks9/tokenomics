/**
 * Stand-alone build of the Subsidy Math microsite for a claude.ai page.
 * Same components and engine as /subsidy-math; the memo, email and claims audit
 * become #memo, #email and #claims views. Built by build.mjs.
 */
import { StrictMode, useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import "@/app/subsidy-math/sm.css";
import "./artifact.css";
import Site from "@/components/subsidy-math/Site";
import { headings, Markdown } from "@/lib/subsidy-math/markdown";
import memoRaw from "../../../public/subsidy-math/research-memo.md?raw";
import emailRaw from "../../../public/subsidy-math/executive-email.md?raw";
import claimsRaw from "../../../public/subsidy-math/claims-audit.md?raw";
import { ModelDownload, TextDownload, type DocName } from "./platform";

/** Point the documents' site links at in-page views. */
const local = (md: string) =>
  md
    .replace(/\]\(\/subsidy-math\/(memo|email|claims)\)/g, "](#$1)")
    .replace(/\]\(\/subsidy-math\/subsidy-math-model\.xlsx\)/g, "](#downloads)")
    .replace(/\]\(\/subsidy-math#([a-z-]+)\)/g, "](#$1)")
    .replace(/\]\(\/subsidy-math\)/g, "](#top)");

const DOCS: Record<DocName, { kicker: string; title: string; file: string; raw: string; toc: boolean }> = {
  memo: { kicker: "B · Financial research memo", title: "The Economics of AI: Is the Hyperscaler Subsidy Model Sustainable?", file: "research-memo.md", raw: memoRaw, toc: true },
  email: { kicker: "A · Executive email", title: "Note to JAPAC AI leaders", file: "executive-email.md", raw: emailRaw, toc: false },
  claims: { kicker: "D · Claims audit", title: "What we can say, what needs a caveat, and what we should not say", file: "claims-audit.md", raw: claimsRaw, toc: true },
};

function CopyText({ text }: { text: string }) {
  const [state, setState] = useState<"idle" | "done" | "error">("idle");
  return (
    <button
      type="button"
      className="sm-btn"
      onClick={async () => {
        try {
          const plain = text.replace(/^# .*\n+/, "").replace(/\*\*([^*]+)\*\*/g, "$1").replace(/\*([^*]+)\*/g, "$1").replace(/\[([^\]]+)\]\([^)]+\)/g, "$1");
          await navigator.clipboard.writeText(plain);
          setState("done");
        } catch {
          setState("error");
        }
      }}
    >
      {state === "done" ? "Copied" : state === "error" ? "Copy blocked here — select the text instead" : "Copy email text"}
    </button>
  );
}

function DocView({ name }: { name: DocName }) {
  const d = DOCS[name];
  const body = local(d.raw).replace(/^# .*\n/, "");
  const hs = d.toc ? headings(body, 2) : [];
  return (
    <>
      <div className="sm-top">
        <div className="sm-wrap sm-top-inner">
          <a href="#top">← Subsidy Math</a>
          <span style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "start" }}>
            <TextDownload className="sm-btn ghost" filename={d.file} text={d.raw}>Save .md</TextDownload>
            <ModelDownload className="sm-btn ghost">Excel model</ModelDownload>
          </span>
        </div>
      </div>
      <header className="sm-hero" style={{ paddingBottom: 28 }}>
        <div className="sm-wrap">
          <div className="sm-eyebrow">{d.kicker}</div>
          <h1 className="sm-title" style={{ fontSize: "clamp(30px, 4.6vw, 52px)" }}>{d.title}</h1>
          {name === "email" && <div style={{ marginTop: 18 }}><CopyText text={d.raw} /></div>}
        </div>
      </header>
      <div className="sm-wrap">
        <div className="sm-doclayout" style={d.toc ? undefined : { gridTemplateColumns: "minmax(0, 1fr)" }}>
          {d.toc && (
            <nav className="sm-toc" aria-label="Contents">
              {hs.map((h) => (
                <a key={h.id} href={`#${h.id}`} onClick={(e) => { e.preventDefault(); document.getElementById(h.id)?.scrollIntoView({ behavior: "smooth", block: "start" }); }}>{h.text}</a>
              ))}
            </nav>
          )}
          <Markdown source={body} className={`sm-doc ${d.toc ? "" : "sm-narrow"}`} />
        </div>
      </div>
    </>
  );
}

const isDoc = (h: string): h is DocName => h === "memo" || h === "email" || h === "claims";
const currentDoc = (): DocName | null => { const h = window.location.hash.slice(1); return isDoc(h) ? h : null; };

function scrollToHash() {
  const id = window.location.hash.slice(1);
  const el = id ? document.getElementById(id) : null;
  if (el) el.scrollIntoView();
  else window.scrollTo(0, 0);
}

function App() {
  const [doc, setDoc] = useState<DocName | null>(currentDoc);
  useEffect(() => {
    const onHash = () => {
      const next = currentDoc();
      setDoc(next);
      requestAnimationFrame(() => (next ? window.scrollTo(0, 0) : scrollToHash()));
    };
    window.addEventListener("hashchange", onHash);
    if (!currentDoc() && window.location.hash) requestAnimationFrame(scrollToHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);
  return <div className="sm-root">{doc ? <DocView name={doc} /> : <Site />}</div>;
}

const root = document.getElementById("root");
if (root) createRoot(root).render(<StrictMode><App /></StrictMode>);
