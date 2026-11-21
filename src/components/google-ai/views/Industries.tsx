"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { casesFor, mustKnow, verticalCounts, workloadsFor } from "@/lib/google-ai/engine/specialist";
import { REGION_BY_ID, SEGMENTS, SUB_VERTICALS, SUB_VERTICAL_BY_ID } from "@/lib/google-ai/taxonomy";
import { CaseRow, NoteRow } from "../specialist";
import { Empty, PageHead, Sec, useHub } from "../ui";

const KEY = "gai-industries";

/** Industries — tick the sub-verticals you cover; the page becomes your news, examples and workloads. */
export default function Industries() {
  const { today, region } = useHub();
  const router = useRouter();
  const sp = useSearchParams();
  const fromUrl = useMemo(() => (sp.get("v") ?? "").split(",").filter((id) => SUB_VERTICAL_BY_ID[id]), [sp]);
  const [sel, setSel] = useState<string[]>(fromUrl);

  // A link wins; otherwise restore the reader's last selection.
  useEffect(() => {
    if (fromUrl.length) return;
    queueMicrotask(() => {
      try {
        const saved = (JSON.parse(localStorage.getItem(KEY) ?? "[]") as string[]).filter((id) => SUB_VERTICAL_BY_ID[id]);
        if (saved.length) setSel(saved);
      } catch {
        /* nothing saved */
      }
    });
  }, [fromUrl]);

  const update = (next: string[]) => {
    setSel(next);
    try {
      localStorage.setItem(KEY, JSON.stringify(next));
    } catch {
      /* private mode */
    }
    router.replace(next.length ? `/google-ai/industries?v=${next.join(",")}` : "/google-ai/industries", { scroll: false });
  };
  const toggle = (id: string) => update(sel.includes(id) ? sel.filter((x) => x !== id) : [...sel, id]);

  const counts = useMemo(() => verticalCounts(today, region), [today, region]);
  const news = useMemo(() => mustKnow(today, { region, subVerticals: sel }, { days: 60, limit: 8, min: 1 }).items, [today, region, sel]);
  const cases = useMemo(() => casesFor({ region, subVerticals: sel }), [region, sel]);
  const workloads = useMemo(() => workloadsFor(sel), [sel]);
  const regionName = region === "all" ? null : REGION_BY_ID[region].name;

  return (
    <>
      <PageHead icon="🏭" title="Industries" lede="Tick the sub-verticals you cover. You get the news that matters to them, customer examples to quote, and the workloads they buy.">
        {regionName && <p className="gai-small gai-muted">Showing {regionName}. Change the region in the sidebar.</p>}
      </PageHead>

      <div className="gai-panes">
        <div className="gai-pane-side">
          {SEGMENTS.map((seg) => {
            const subs = SUB_VERTICALS.filter((s) => s.segment === seg.id);
            const picked = subs.filter((s) => sel.includes(s.id)).length;
            const all = picked === subs.length;
            return (
              <details key={seg.id} open title={seg.blurb}>
                <summary>
                  <span className="caret" aria-hidden>▶</span>
                  {seg.name}
                  <span className="n">{picked ? `${picked} selected` : ""}</span>
                </summary>
                <label className="gai-check gai-muted">
                  <input type="checkbox" checked={all} onChange={() => update(all ? sel.filter((id) => !subs.some((s) => s.id === id)) : [...new Set([...sel, ...subs.map((s) => s.id)])])} />
                  All of these
                </label>
                {subs.map((s) => (
                  <label key={s.id} className="gai-check">
                    <input type="checkbox" checked={sel.includes(s.id)} onChange={() => toggle(s.id)} />
                    {s.name}
                    <span className="n">{counts[s.id].news + counts[s.id].cases || ""}</span>
                  </label>
                ))}
              </details>
            );
          })}
          <p className="gai-small gai-muted" style={{ marginTop: 8 }}>
            The number is how many news items and case studies are tagged to the line.{" "}
            {sel.length > 0 && <button type="button" className="gai-link" onClick={() => update([])}>Clear</button>}
          </p>
        </div>

        <div>
          {sel.length === 0 ? (
            <Empty title="Nothing selected yet">Tick one or more lines on the left. Your selection is remembered on this device and can be shared as a link.</Empty>
          ) : (
            <>
              <section>
                <h2 className="gai-h2">News for these industries</h2>
                <p className="gai-small gai-muted" style={{ marginBottom: 6 }}>From the last 60 days. General items that apply to every industry are included.</p>
                {news.length === 0 ? <Empty title="No recent development is tagged to this selection" /> : <div>{news.map((item) => <NoteRow key={item.a.id} item={item} />)}</div>}
              </section>

              <Sec title="Customer examples" sub={`${cases.length} case ${cases.length === 1 ? "study" : "studies"} in these industries${regionName ? ` in ${regionName}` : ""}, on Google Cloud and on other platforms.`}>
                {cases.length === 0 ? (
                  <Empty title="No case study recorded for this selection">{regionName ? `Try "All of Asia-Pacific" in the sidebar, or a neighbouring sub-vertical.` : "Try a neighbouring sub-vertical."}</Empty>
                ) : (
                  <div>{cases.slice(0, 8).map((c) => <CaseRow key={c.id} c={c} />)}</div>
                )}
                {cases.length > 8 && <p className="gai-small" style={{ marginTop: 10 }}><Link className="gai-link" href="/google-ai/cases">See all case studies</Link></p>}
              </Sec>

              <Sec title="What they buy" sub="Reference workloads that fit these industries, with the stack behind each.">
                {workloads.length === 0 ? <Empty title="No reference workload is mapped to this selection" /> : (
                  <div className="gai-grid gai-g2">
                    {workloads.map((w) => (
                      <Link key={w.id} className="gai-card link" href="/google-ai/enterprise">
                        <b>{w.name}</b>
                        <p className="gai-small gai-muted">{w.need}</p>
                      </Link>
                    ))}
                  </div>
                )}
              </Sec>
            </>
          )}
        </div>
      </div>
    </>
  );
}
