/** Polite fetching: identified user agent, timeout, robots.txt check, one request per source per run. */

export const USER_AGENT = "aitokenomics-intelligence-hub/1.0 (+https://aitokenomics.app/google-ai/research)";

export interface Fetched {
  ok: boolean;
  status?: number;
  body?: string;
  error?: string;
}

export type Fetcher = (url: string) => Promise<Fetched>;

export const httpFetch: Fetcher = async (url) => {
  try {
    const res = await fetch(url, {
      headers: { "User-Agent": USER_AGENT, Accept: "application/rss+xml, application/atom+xml, text/html;q=0.9, */*;q=0.5" },
      redirect: "follow",
      cache: "no-store",
      signal: AbortSignal.timeout(20000),
    });
    if (!res.ok) return { ok: false, status: res.status, error: `HTTP ${res.status}` };
    return { ok: true, status: res.status, body: await res.text() };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : String(e) };
  }
};

/**
 * Minimal robots.txt evaluation for the `*` group: longest matching rule wins,
 * Allow beats Disallow on a tie. Returns "unknown" when robots.txt can't be read
 * (we then proceed, since these are public feeds published for syndication).
 */
export function robotsVerdict(robotsTxt: string, pathname: string): "allowed" | "disallowed" {
  let applies = false;
  let seenAgent = false;
  let best = { len: -1, allow: true };
  for (const raw of robotsTxt.split(/\r?\n/)) {
    const line = raw.replace(/#.*/, "").trim();
    const m = line.match(/^([a-z-]+)\s*:\s*(.*)$/i);
    if (!m) continue;
    const key = m[1].toLowerCase();
    const value = m[2].trim();
    if (key === "user-agent") {
      if (!seenAgent) applies = false;
      seenAgent = true;
      if (value === "*") applies = true;
      continue;
    }
    seenAgent = false;
    if (!applies || (key !== "allow" && key !== "disallow") || !value) continue;
    const re = new RegExp("^" + value.replace(/[.+?^${}()|[\]\\]/g, "\\$&").replace(/\*/g, ".*").replace(/\\\$$/, "$"));
    if (re.test(pathname)) {
      const allow = key === "allow";
      if (value.length > best.len || (value.length === best.len && allow)) best = { len: value.length, allow };
    }
  }
  return best.allow ? "allowed" : "disallowed";
}

export async function checkRobots(url: string, fetcher: Fetcher, cache: Map<string, string | null>): Promise<"allowed" | "disallowed" | "unknown"> {
  const u = new URL(url);
  if (!cache.has(u.origin)) {
    const r = await fetcher(`${u.origin}/robots.txt`);
    cache.set(u.origin, r.ok && r.body ? r.body : null);
  }
  const txt = cache.get(u.origin);
  return txt ? robotsVerdict(txt, u.pathname) : "unknown";
}
