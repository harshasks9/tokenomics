"use client";

import { useCallback, useEffect, useMemo, useState, useSyncExternalStore } from "react";
import type { BriefIndexEntry, DailyBrief, NewsItem } from "@/lib/brief/types";

const GC_TOGGLE_KEY = "ai-daily-brief:gc-lens";
const GC_TOGGLE_EVENT = "ai-daily-brief:gc-lens-change";

function subscribeGcLens(callback: () => void) {
  window.addEventListener("storage", callback);
  window.addEventListener(GC_TOGGLE_EVENT, callback);
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener(GC_TOGGLE_EVENT, callback);
  };
}

function readGcLens() {
  try {
    return window.localStorage.getItem(GC_TOGGLE_KEY) === "1";
  } catch {
    return false;
  }
}

const CATEGORY_STYLES: Record<string, string> = {
  "Models & Research": "bg-[#E8F0FE] text-[#1A56C4]",
  "Infrastructure & Chips": "bg-[#FEF7E0] text-[#B06000]",
  "Enterprise & Cloud": "bg-[#E6F4EA] text-[#137333]",
  "Agents & Developer Tools": "bg-[#F3E8FD] text-[#7627BB]",
  "Policy & Regulation": "bg-[#FCE8E6] text-[#C5221F]",
  "Security & Trust": "bg-[#E4F7FB] text-[#007B83]",
  "Funding & Business": "bg-surface-alt text-muted",
};

function formatBriefDate(date: string) {
  return new Date(`${date}T12:00:00Z`).toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  });
}

function formatPublished(iso: string) {
  const parsed = new Date(iso);
  if (Number.isNaN(parsed.getTime())) return iso;
  return parsed.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    timeZone: "UTC",
    timeZoneName: "short",
  });
}

function GcToggle({ enabled, onChange }: { enabled: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={enabled}
      onClick={() => onChange(!enabled)}
      className="flex items-center gap-2.5 rounded-full border border-border bg-surface px-3 py-1.5 text-sm font-medium transition-colors hover:bg-surface-alt"
    >
      <span className={enabled ? "text-accent" : "text-muted"}>Google Cloud Interpretation</span>
      <span
        className={`relative inline-flex h-5 w-9 shrink-0 items-center rounded-full transition-colors ${
          enabled ? "bg-accent" : "bg-[#DADCE0]"
        }`}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${
            enabled ? "translate-x-[18px]" : "translate-x-0.5"
          }`}
        />
      </span>
    </button>
  );
}

function GcLens({ item }: { item: NewsItem }) {
  const limited = item.google_cloud_interpretation
    .toLowerCase()
    .startsWith("limited direct google cloud implication");

  return (
    <div className="mt-3 rounded-lg border border-[#D2E3FC] bg-[#F5F9FF] p-3.5">
      <p className="mb-1.5 flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wide text-accent">
        <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 fill-current" aria-hidden>
          <path d="M12 4a8 8 0 0 0-7.8 6.2A5.5 5.5 0 0 0 5.5 21h13a5.5 5.5 0 0 0 1.3-10.8A8 8 0 0 0 12 4z" />
        </svg>
        Google Cloud interpretation
      </p>
      <p className="text-sm leading-relaxed text-text">{item.google_cloud_interpretation}</p>
      {!limited && (
        <>
          {item.relevant_google_cloud_products.length > 0 && (
            <div className="mt-2.5 flex flex-wrap gap-1.5">
              {item.relevant_google_cloud_products.map((product) => (
                <span
                  key={product}
                  className="rounded-full bg-white px-2.5 py-0.5 text-xs font-medium text-accent ring-1 ring-[#D2E3FC]"
                >
                  {product}
                </span>
              ))}
            </div>
          )}
          {item.competitive_implications && (
            <p className="mt-2.5 text-sm leading-relaxed text-text">
              <span className="font-semibold text-[#5F6368]">Competitive: </span>
              {item.competitive_implications}
            </p>
          )}
          {item.field_action && (
            <p className="mt-2 text-sm leading-relaxed text-text">
              <span className="font-semibold text-[#137333]">Field action: </span>
              {item.field_action}
            </p>
          )}
        </>
      )}
    </div>
  );
}

function NewsCard({ item, gcLens }: { item: NewsItem; gcLens: boolean }) {
  const [expanded, setExpanded] = useState(false);
  const categoryStyle = CATEGORY_STYLES[item.category] ?? "bg-surface-alt text-muted";

  return (
    <article className="rounded-xl border border-border bg-surface p-4 shadow-[0_1px_2px_rgba(60,64,67,0.08)] sm:p-5">
      <div className="flex items-start gap-3">
        <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-text text-sm font-bold text-white">
          {item.rank}
        </span>
        <div className="min-w-0 flex-1">
          <div className="mb-1.5 flex flex-wrap items-center gap-2">
            <span className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${categoryStyle}`}>
              {item.category}
            </span>
            <span className="text-xs text-muted">{formatPublished(item.published_at)}</span>
          </div>
          <h2 className="text-[15px] font-bold leading-snug text-text sm:text-base">{item.headline}</h2>
        </div>
      </div>

      <div className="mt-3 space-y-2.5 sm:pl-10">
        <p className="text-sm leading-relaxed text-text">{item.summary}</p>
        <p className="text-sm leading-relaxed text-muted">
          <span className="font-semibold text-text">Why it matters: </span>
          {item.why_it_matters}
        </p>
        <p className="text-xs text-muted">
          Source:{" "}
          <a
            href={item.source_url}
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-accent underline decoration-[#D2E3FC] underline-offset-2 hover:decoration-accent"
          >
            {item.source_name}
          </a>
        </p>

        {gcLens && <GcLens item={item} />}

        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          aria-expanded={expanded}
          className="flex items-center gap-1 text-sm font-medium text-accent hover:underline"
        >
          {expanded ? "Show less" : "Go deeper"}
          <svg
            viewBox="0 0 24 24"
            className={`h-4 w-4 fill-current transition-transform ${expanded ? "rotate-180" : ""}`}
            aria-hidden
          >
            <path d="M7.4 8.6 12 13.2l4.6-4.6L18 10l-6 6-6-6z" />
          </svg>
        </button>

        {expanded && (
          <div className="rounded-lg bg-surface-alt p-3.5">
            <p className="text-sm leading-relaxed text-text">{item.deeper_analysis}</p>
            {item.related_links.length > 0 && (
              <div className="mt-3">
                <p className="mb-1 text-[11px] font-bold uppercase tracking-wide text-muted">
                  Related links
                </p>
                <ul className="space-y-1">
                  {item.related_links.map((link) => (
                    <li key={link.url}>
                      <a
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-accent hover:underline"
                      >
                        {link.title}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            <p className="mt-3 text-[11px] text-muted">
              Confidence {Math.round(item.confidence_score * 100)}% · Source reliability{" "}
              {Math.round(item.reliability_score * 100)}%
            </p>
          </div>
        )}
      </div>
    </article>
  );
}

function LoadingSkeleton() {
  return (
    <div className="space-y-4" aria-label="Loading briefing">
      <div className="h-28 animate-pulse rounded-xl bg-surface-alt" />
      {[...Array(4)].map((_, i) => (
        <div key={i} className="h-36 animate-pulse rounded-xl bg-surface-alt" />
      ))}
    </div>
  );
}

export default function BriefApp() {
  const [brief, setBrief] = useState<DailyBrief | null>(null);
  const [archive, setArchive] = useState<BriefIndexEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string>("");

  const gcLens = useSyncExternalStore(subscribeGcLens, readGcLens, () => false);

  const handleGcToggle = useCallback((value: boolean) => {
    try {
      window.localStorage.setItem(GC_TOGGLE_KEY, value ? "1" : "0");
    } catch {
      // ignore storage access issues
    }
    window.dispatchEvent(new Event(GC_TOGGLE_EVENT));
  }, []);

  const applyArchive = useCallback(async (res: Response) => {
    if (!res.ok) return;
    const data = (await res.json()) as { briefs: BriefIndexEntry[] };
    setArchive(data.briefs);
  }, []);

  const loadArchive = useCallback(async () => {
    try {
      await applyArchive(await fetch("/api/brief/archive"));
    } catch {
      // archive is non-critical; ignore
    }
  }, [applyArchive]);

  const applyBrief = useCallback(async (res: Response) => {
    if (res.status === 404) {
      setBrief(null);
      setNotFound(true);
      return;
    }
    if (!res.ok) {
      const body = (await res.json().catch(() => null)) as { error?: string } | null;
      throw new Error(body?.error ?? `Request failed (${res.status})`);
    }
    const data = (await res.json()) as DailyBrief;
    setBrief(data);
    setSelectedDate(data.date);
  }, []);

  const loadBrief = useCallback(
    async (date?: string) => {
      setLoading(true);
      setError(null);
      setNotFound(false);
      try {
        await applyBrief(await fetch(date ? `/api/brief?date=${date}` : "/api/brief"));
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load the briefing.");
      } finally {
        setLoading(false);
      }
    },
    [applyBrief],
  );

  useEffect(() => {
    // Initial state already shows the loading skeleton; set state only from
    // fetch callbacks (react-hooks/set-state-in-effect).
    fetch("/api/brief")
      .then(applyBrief)
      .catch((err: unknown) => {
        setError(err instanceof Error ? err.message : "Failed to load the briefing.");
      })
      .finally(() => setLoading(false));
    fetch("/api/brief/archive")
      .then(applyArchive)
      .catch(() => {
        // archive is non-critical; ignore
      });
  }, [applyBrief, applyArchive]);

  const generateNow = useCallback(async () => {
    setGenerating(true);
    setError(null);
    try {
      const res = await fetch("/api/brief/cron?force=1", { method: "POST" });
      const body = (await res.json().catch(() => null)) as { error?: string } | null;
      if (res.status === 401) {
        throw new Error(
          "Manual generation is locked on the public site. The brief publishes automatically every morning at 09:00 SGT; the site owner can trigger an early run from the Vercel dashboard (Cron Jobs → /api/brief/cron → Run).",
        );
      }
      if (!res.ok) {
        throw new Error(body?.error ?? `Generation failed (${res.status})`);
      }
      await loadBrief();
      await loadArchive();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Generation failed.");
    } finally {
      setGenerating(false);
    }
  }, [loadBrief, loadArchive]);

  const isToday = useMemo(() => {
    if (!brief) return false;
    return brief.date === new Date().toISOString().slice(0, 10);
  }, [brief]);

  return (
    <div className="min-h-screen bg-surface-alt">
      <header className="sticky top-0 z-10 border-b border-border bg-surface/95 backdrop-blur">
        <div className="mx-auto flex max-w-3xl flex-col gap-2.5 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:py-4">
          <div>
            <h1 className="text-lg font-extrabold tracking-tight text-text sm:text-xl">
              AI Daily Brief
            </h1>
            <p className="text-xs text-muted sm:text-sm">
              {brief
                ? `${formatBriefDate(brief.date)}${isToday ? "" : " (archive)"}`
                : "Top 10 AI news, ranked — in 5 minutes"}
            </p>
          </div>
          <GcToggle enabled={gcLens} onChange={handleGcToggle} />
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 py-5 sm:py-7">
        {loading && <LoadingSkeleton />}

        {!loading && error && (
          <div className="rounded-xl border border-[#F4C7C5] bg-[#FCE8E6] p-5 text-center">
            <p className="text-sm font-semibold text-[#C5221F]">Something went wrong</p>
            <p className="mt-1 text-sm text-text">{error}</p>
            <button
              type="button"
              onClick={() => void loadBrief(selectedDate || undefined)}
              className="mt-3 rounded-full bg-accent px-4 py-1.5 text-sm font-semibold text-white hover:bg-accent-light"
            >
              Retry
            </button>
          </div>
        )}

        {!loading && !error && notFound && (
          <div className="rounded-xl border border-border bg-surface p-6 text-center sm:p-8">
            <p className="text-base font-bold text-text">No briefing yet</p>
            <p className="mx-auto mt-1.5 max-w-md text-sm leading-relaxed text-muted">
              The daily job hasn&apos;t produced a brief for this date. It runs automatically every
              morning; you can also generate one now (a live run searches the web and takes a few
              minutes).
            </p>
            <button
              type="button"
              onClick={() => void generateNow()}
              disabled={generating}
              className="mt-4 rounded-full bg-accent px-5 py-2 text-sm font-semibold text-white hover:bg-accent-light disabled:opacity-60"
            >
              {generating ? "Generating… this can take a few minutes" : "Generate today's brief"}
            </button>
          </div>
        )}

        {!loading && !error && brief && (
          <>
            {brief.mode === "mock" && (
              <div className="mb-4 rounded-lg border border-[#FDD663] bg-[#FEF7E0] px-4 py-2.5 text-sm text-[#7A5800]">
                <span className="font-semibold">Sample data.</span> This brief uses mock content for
                local development — configure <code className="font-mono text-xs">GEMINI_API_KEY</code>{" "}
                to generate live briefs from web search.
              </div>
            )}

            <section className="mb-5 rounded-xl border border-border bg-surface p-4 sm:p-5">
              <div className="mb-2.5 flex items-center justify-between">
                <h2 className="text-sm font-bold uppercase tracking-wide text-text">
                  Today&apos;s AI Signal
                </h2>
                <span className="text-[11px] font-medium text-muted">≈ 5 min read</span>
              </div>
              <ul className="space-y-1.5">
                {brief.signal_summary.map((bullet, i) => (
                  <li key={i} className="flex gap-2 text-sm leading-relaxed text-text">
                    <span className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                    {bullet}
                  </li>
                ))}
              </ul>
            </section>

            {brief.coverage_note && (
              <p className="mb-4 rounded-lg bg-surface-alt px-4 py-2.5 text-sm text-muted ring-1 ring-border">
                {brief.items.length < 10 && (
                  <span className="font-semibold text-text">
                    {brief.items.length} of 10 items today:{" "}
                  </span>
                )}
                {brief.coverage_note}
              </p>
            )}

            <div className="space-y-4">
              {brief.items.map((item) => (
                <NewsCard key={item.id} item={item} gcLens={gcLens} />
              ))}
            </div>

            {archive.length > 1 && (
              <section className="mt-8">
                <h2 className="mb-2.5 text-sm font-bold uppercase tracking-wide text-text">
                  Archive
                </h2>
                <div className="flex flex-wrap gap-2">
                  {archive.map((entry) => {
                    const active = entry.date === brief.date;
                    return (
                      <button
                        key={entry.date}
                        type="button"
                        onClick={() => void loadBrief(entry.date)}
                        className={`rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors ${
                          active
                            ? "bg-accent text-white"
                            : "border border-border bg-surface text-text hover:bg-surface-alt"
                        }`}
                      >
                        {formatBriefDate(entry.date).replace(/^\w+, /, "")}
                      </button>
                    );
                  })}
                </div>
              </section>
            )}

            <footer className="mt-8 border-t border-border pt-4 text-center text-xs text-muted">
              Generated {new Date(brief.generated_at).toLocaleString()} · Ranked by enterprise
              impact, not recency · Sources linked per item
            </footer>
          </>
        )}
      </main>
    </div>
  );
}
