/** Dependency-free parsers for RSS 2.0, Atom and plain HTML pages. Feed content is untrusted: it is only ever treated as text. */
import type { RawItem } from "./types";

const ENTITIES_MAP: Record<string, string> = { amp: "&", lt: "<", gt: ">", quot: '"', apos: "'", nbsp: " ", mdash: "—", ndash: "–", rsquo: "’", lsquo: "‘", rdquo: "”", ldquo: "“", hellip: "…" };

export function decode(s: string): string {
  return s
    .replace(/&#x([0-9a-f]+);/gi, (_, h) => String.fromCodePoint(parseInt(h, 16)))
    .replace(/&#(\d+);/g, (_, d) => String.fromCodePoint(Number(d)))
    .replace(/&([a-z]+);/gi, (m, n) => ENTITIES_MAP[n.toLowerCase()] ?? m);
}

/** Strip markup to readable text. */
export function text(html: string): string {
  const noCdata = html.replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1");
  return decode(
    decode(noCdata)
      .replace(/<(script|style|noscript|svg)[\s\S]*?<\/\1>/gi, " ")
      .replace(/<[^>]+>/g, " "),
  )
    .replace(/\s+/g, " ")
    .trim();
}

function tag(block: string, name: string): string | undefined {
  const m = block.match(new RegExp(`<${name}(?:\\s[^>]*)?>([\\s\\S]*?)</${name}>`, "i"));
  return m ? m[1] : undefined;
}

export function toISODate(s?: string): string | undefined {
  if (!s) return undefined;
  const t = Date.parse(text(s));
  return Number.isNaN(t) ? undefined : new Date(t).toISOString().slice(0, 10);
}

function clip(s: string, n = 400): string {
  return s.length <= n ? s : s.slice(0, n).replace(/\s+\S*$/, "") + "…";
}

export function parseRss(xml: string, feedKey: string): RawItem[] {
  const out: RawItem[] = [];
  for (const m of xml.matchAll(/<item[\s>][\s\S]*?<\/item>/gi)) {
    const b = m[0];
    const title = text(tag(b, "title") ?? "");
    const url = text(tag(b, "link") ?? tag(b, "guid") ?? "");
    if (!title || !/^https?:\/\//.test(url)) continue;
    out.push({ feedKey, title, url, published: toISODate(tag(b, "pubDate") ?? tag(b, "dc:date")), summary: clip(text(tag(b, "description") ?? tag(b, "content:encoded") ?? "")) });
  }
  return out;
}

export function parseAtom(xml: string, feedKey: string): RawItem[] {
  const out: RawItem[] = [];
  for (const m of xml.matchAll(/<entry[\s>][\s\S]*?<\/entry>/gi)) {
    const b = m[0];
    const title = text(tag(b, "title") ?? "");
    const links = [...b.matchAll(/<link\b([^>]*)\/?>/gi)].map((l) => l[1]);
    const pick = links.find((a) => /rel=["']alternate["']/i.test(a)) ?? links.find((a) => !/rel=/i.test(a)) ?? links[0] ?? "";
    const url = decode(pick.match(/href=["']([^"']+)["']/i)?.[1] ?? "");
    if (!title || !/^https?:\/\//.test(url)) continue;
    out.push({ feedKey, title, url, published: toISODate(tag(b, "published") ?? tag(b, "updated")), summary: clip(text(tag(b, "summary") ?? tag(b, "content") ?? "")) });
  }
  return out;
}

export function parseFeed(body: string, feedKey: string): RawItem[] {
  return /<entry[\s>]/i.test(body) && !/<item[\s>]/i.test(body) ? parseAtom(body, feedKey) : parseRss(body, feedKey);
}

/** Stable hash of a page's visible text, so cosmetic markup changes don't raise alerts. */
export async function contentHash(body: string): Promise<string> {
  const data = new TextEncoder().encode(text(body));
  const digest = await crypto.subtle.digest("SHA-256", data);
  return [...new Uint8Array(digest)].map((b) => b.toString(16).padStart(2, "0")).join("").slice(0, 32);
}

/** Canonical form of a URL for de-duplication: no fragment, tracking params or trailing slash. */
export function canonicalUrl(u: string): string {
  try {
    const url = new URL(u);
    url.hash = "";
    for (const k of [...url.searchParams.keys()]) if (/^(utm_|gclid|fbclid|ref$|hl$)/i.test(k)) url.searchParams.delete(k);
    url.hostname = url.hostname.replace(/^www\./, "");
    let s = url.toString();
    if (s.endsWith("/")) s = s.slice(0, -1);
    return s;
  } catch {
    return u.trim();
  }
}
