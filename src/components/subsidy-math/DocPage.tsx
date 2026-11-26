import fs from "node:fs";
import path from "node:path";
import Link from "next/link";
import { headings, Markdown } from "@/lib/subsidy-math/markdown";

/** Server component: renders one of the study's Markdown deliverables from public/subsidy-math/. */
export default function DocPage({ file, title, kicker, toc = true, actions }: { file: string; title: string; kicker: string; toc?: boolean; actions?: React.ReactNode }) {
  const source = fs.readFileSync(path.join(process.cwd(), "public", "subsidy-math", file), "utf8");
  const body = source.replace(/^# .*\n/, "");
  const hs = toc ? headings(body, 2) : [];
  return (
    <>
      <div className="sm-top">
        <div className="sm-wrap sm-top-inner">
          <Link href="/subsidy-math" prefetch={false}>← Subsidy Math</Link>
          <span><a href={`/subsidy-math/${file}`} download>Download .md</a> · <a href="/subsidy-math/subsidy-math-model.xlsx" download>Excel model</a></span>
        </div>
      </div>
      <header className="sm-hero" style={{ paddingBottom: 28 }}>
        <div className="sm-wrap">
          <div className="sm-eyebrow">{kicker}</div>
          <h1 className="sm-title" style={{ fontSize: "clamp(30px, 4.6vw, 52px)" }}>{title}</h1>
          {actions}
        </div>
      </header>
      <div className="sm-wrap">
        <div className="sm-doclayout" style={toc ? undefined : { gridTemplateColumns: "minmax(0, 1fr)" }}>
          {toc && (
            <nav className="sm-toc" aria-label="Contents">
              {hs.map((h) => <a key={h.id} href={`#${h.id}`}>{h.text}</a>)}
            </nav>
          )}
          <Markdown source={body} className={`sm-doc ${toc ? "" : "sm-narrow"}`} />
        </div>
      </div>
    </>
  );
}
