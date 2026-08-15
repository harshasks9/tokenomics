"use client";

import { useState } from "react";
import { AlertTriangle, ArrowUpRight } from "lucide-react";
import { DASH, ORG_TABS, type TabId } from "./data";
import { AMBER, BORDER, BRAND, FAINT, GREEN, INK, MUTED, Panel, Pill, RED, Tag } from "./ui";

const STATE_DOT = { ok: GREEN, warn: AMBER, bad: RED } as const;

export function OrgTabs() {
  const [active, setActive] = useState<TabId>("admissions");
  const tab = ORG_TABS.find((t) => t.id === active)!;

  return (
    <div>
      {/* Tab strip */}
      <div className="flex gap-1 overflow-x-auto pb-px -mx-5 px-5 md:mx-0 md:px-0" style={{ borderBottom: `1px solid ${BORDER}` }} role="tablist" aria-label="Function">
        {ORG_TABS.map((t) => {
          const on = t.id === active;
          return (
            <button
              key={t.id}
              role="tab"
              aria-selected={on}
              onClick={() => setActive(t.id)}
              className="px-3.5 py-2.5 text-[13px] font-medium whitespace-nowrap transition-colors"
              style={{
                color: on ? BRAND : MUTED,
                borderBottom: `2px solid ${on ? BRAND : "transparent"}`,
                marginBottom: -1,
              }}
            >
              {t.label}
            </button>
          );
        })}
      </div>

      <div className="pt-7 grid lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] gap-7 lg:gap-10 items-start">
        <div>
          <div className="text-[10.5px] font-semibold uppercase mb-2" style={{ color: FAINT, letterSpacing: "0.09em" }}>{tab.owner}</div>
          <h3 className="text-[20px] md:text-[24px] font-bold tracking-[-0.02em] leading-[1.25]" style={{ color: INK }}>{tab.headline}</h3>
          <p className="text-[14px] leading-[1.65] mt-3" style={{ color: MUTED }}>{tab.outcome}</p>

          <div className="mt-5 rounded-lg p-4" style={{ backgroundColor: "#F1F5FD", border: `1px solid #DBE5FA` }}>
            <div className="text-[19px] font-bold tabular-nums tracking-tight" style={{ color: BRAND }}>{tab.metric.value}</div>
            <div className="text-[12px] leading-[1.55] mt-1" style={{ color: MUTED }}>
              {tab.metric.label} <Tag kind={tab.metric.kind} src={tab.metric.src} />
            </div>
          </div>

          <ul className="mt-5 space-y-2.5">
            {tab.notes.map((n, i) => (
              <li key={i} className="text-[12.5px] leading-[1.6] pl-3.5 relative" style={{ color: MUTED }}>
                <span className="absolute left-0 top-[7px] w-1 h-1 rounded-full" style={{ backgroundColor: FAINT }} />
                {n.text} <Tag kind={n.kind} src={n.src} />
              </li>
            ))}
          </ul>
        </div>

        <div>
          {tab.id === "management" ? <ManagementDashboard /> : (
            <Panel title={tab.screen.title} right={<Pill color={FAINT}>Sample data</Pill>}>
              {tab.screen.rows.map((r, i) => (
                <div
                  key={i}
                  className="px-4 py-3 grid grid-cols-[minmax(0,1fr)_auto] gap-x-4 items-center"
                  style={{ borderBottom: i < tab.screen.rows.length - 1 ? `1px solid ${BORDER}` : undefined }}
                >
                  <div className="min-w-0">
                    <div className="text-[13px] font-medium flex items-start gap-2" style={{ color: INK }}>
                      <span className="w-1.5 h-1.5 rounded-full mt-[6px] shrink-0" style={{ backgroundColor: STATE_DOT[r.state ?? "ok"] }} />
                      <span>{r.left}</span>
                    </div>
                    {r.mid && <div className="text-[11.5px] mt-0.5 pl-3.5" style={{ color: FAINT }}>{r.mid}</div>}
                  </div>
                  <div className="text-[14px] font-semibold tabular-nums text-right" style={{ color: r.state === "bad" ? RED : r.state === "warn" ? AMBER : INK }}>
                    {r.right}
                  </div>
                </div>
              ))}
            </Panel>
          )}
        </div>
      </div>
    </div>
  );
}

function ManagementDashboard() {
  const max = Math.max(...DASH.received);
  return (
    <div className="space-y-4">
      <Panel
        title="Requests received and resolved · last 7 days"
        right={
          <div className="flex items-center gap-3 text-[10.5px]" style={{ color: MUTED }}>
            <span className="inline-flex items-center gap-1.5"><span className="w-2 h-2 rounded-sm" style={{ backgroundColor: "#C7D7F5" }} />Received</span>
            <span className="inline-flex items-center gap-1.5"><span className="w-2 h-2 rounded-sm" style={{ backgroundColor: BRAND }} />Resolved</span>
            <Pill color={FAINT}>Sample data</Pill>
          </div>
        }
      >
        <div className="px-4 pt-5 pb-3 flex items-end gap-2 sm:gap-3" style={{ height: 168 }}>
          {DASH.days.map((d, i) => {
            const rec = (DASH.received[i] / max) * 128;
            const res = (DASH.resolved[i] / max) * 128;
            return (
              <div key={d} className="flex-1 flex flex-col items-center justify-end gap-1.5" style={{ height: "100%" }}>
                <div className="text-[10px] font-semibold tabular-nums" style={{ color: BRAND }}>{DASH.resolved[i].toLocaleString("en-IN")}</div>
                <div className="w-full flex items-end justify-center gap-[3px]" style={{ height: 128 }}>
                  <div className="w-[42%] rounded-t-[3px]" style={{ height: rec, backgroundColor: "#C7D7F5" }} />
                  <div className="w-[42%] rounded-t-[3px]" style={{ height: res, backgroundColor: BRAND }} />
                </div>
                <div className="text-[10.5px]" style={{ color: FAINT }}>{d}</div>
              </div>
            );
          })}
        </div>
      </Panel>

      <div className="grid sm:grid-cols-2 gap-4">
        <Panel title="Time to resolve · by campus">
          <div className="p-4 space-y-3.5">
            {DASH.campuses.map((c) => {
              const worst = Math.max(...DASH.campuses.map((x) => x.minutes));
              const bad = c.minutes >= 20;
              return (
                <div key={c.name}>
                  <div className="flex items-baseline justify-between gap-3 mb-1.5">
                    <span className="text-[12.5px] font-medium" style={{ color: INK }}>{c.name}</span>
                    <span className="text-[13px] font-semibold tabular-nums" style={{ color: bad ? RED : c.minutes > 8 ? AMBER : GREEN }}>{c.minutes} min</span>
                  </div>
                  <div className="h-[6px] rounded-full overflow-hidden" style={{ backgroundColor: "#EEF0F3" }}>
                    <div className="h-full rounded-full" style={{ width: `${(c.minutes / worst) * 100}%`, backgroundColor: bad ? RED : c.minutes > 8 ? AMBER : GREEN }} />
                  </div>
                  <div className="text-[10.5px] mt-1" style={{ color: FAINT }}>
                    {c.volume.toLocaleString("en-IN")} requests · {c.trend}
                  </div>
                </div>
              );
            })}
            <p className="text-[11.5px] leading-[1.55] pt-1" style={{ color: MUTED }}>
              City campus takes six times longer than Main. Without one view, that difference is invisible.
            </p>
          </div>
        </Panel>

        <Panel title="Language of the request" right={<Pill color={FAINT}>Sample data</Pill>}>
          <div className="p-4">
            <div className="flex h-3 rounded-full overflow-hidden mb-4">
              {DASH.languages.map((l) => (
                <div key={l.name} style={{ width: `${l.share}%`, backgroundColor: l.color }} title={`${l.name} ${l.share}%`} />
              ))}
            </div>
            <div className="space-y-2">
              {DASH.languages.map((l) => (
                <div key={l.name} className="flex items-center justify-between gap-3">
                  <span className="inline-flex items-center gap-2 text-[12px]" style={{ color: MUTED }}>
                    <span className="w-2 h-2 rounded-sm" style={{ backgroundColor: l.color }} />{l.name}
                  </span>
                  <span className="text-[12px] font-semibold tabular-nums" style={{ color: INK }}>{l.share}%</span>
                </div>
              ))}
            </div>
            <p className="text-[11.5px] leading-[1.55] mt-3.5 pt-3.5" style={{ color: MUTED, borderTop: `1px solid ${BORDER}` }}>
              72% of requests arrive in a language other than English.
            </p>
          </div>
        </Panel>
      </div>

      <Panel title="Statutory clock · grievances approaching the UGC 60-day limit" right={<Tag kind="fact" src="ugcGrievance" />}>
        <div>
          {DASH.breaches.map((b, i) => (
            <div key={b.ref} className="px-4 py-2.5 flex items-center gap-3" style={{ borderBottom: i < DASH.breaches.length - 1 ? `1px solid ${BORDER}` : undefined }}>
              <AlertTriangle size={13} style={{ color: b.days >= 48 ? RED : AMBER }} className="shrink-0" />
              <span className="text-[11px] font-mono shrink-0" style={{ color: FAINT }}>{b.ref}</span>
              <span className="text-[12.5px] min-w-0 truncate" style={{ color: INK }}>{b.what}</span>
              <span className="ml-auto shrink-0 text-[12px] font-semibold tabular-nums" style={{ color: b.days >= 48 ? RED : AMBER }}>
                day {b.days} / {b.limit}
              </span>
            </div>
          ))}
        </div>
      </Panel>

      <Panel title="Student satisfaction signal · weekly">
        <div className="p-4 flex items-center gap-5">
          <Spark values={DASH.sentiment} />
          <div>
            <div className="text-[20px] font-bold tabular-nums leading-none inline-flex items-center gap-1" style={{ color: GREEN }}>
              74 <ArrowUpRight size={16} />
            </div>
            <p className="text-[11.5px] leading-[1.55] mt-2 max-w-[36ch]" style={{ color: MUTED }}>
              A continuous read on how students feel about being answered — not one survey at accreditation time.{" "}
              <Tag kind="fact" src="sss" />
            </p>
          </div>
        </div>
      </Panel>
    </div>
  );
}

function Spark({ values }: { values: number[] }) {
  const w = 150, h = 46, min = Math.min(...values) - 4, max = Math.max(...values) + 4;
  const pts = values.map((v, i) => [(i / (values.length - 1)) * w, h - ((v - min) / (max - min)) * h]);
  const d = pts.map((p, i) => `${i ? "L" : "M"} ${p[0].toFixed(1)} ${p[1].toFixed(1)}`).join(" ");
  return (
    <svg width={w} height={h} className="shrink-0" role="img" aria-label="Student satisfaction trending up over seven weeks">
      <path d={`${d} L ${w} ${h} L 0 ${h} Z`} fill="#05966914" />
      <path d={d} fill="none" stroke={GREEN} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
      <circle cx={pts[pts.length - 1][0]} cy={pts[pts.length - 1][1]} r={3} fill={GREEN} />
    </svg>
  );
}
