"use client";

/*
 * Markdown, code and diff rendering for package files. Everything renders to
 * React elements — never innerHTML — because files can be authored by users.
 */
import { Fragment, type ReactNode } from "react";
import type { DiffLine } from "@/lib/asset-factory/skillmd";

// ── Inline markdown ──────────────────────────────────────────────────────
function inline(text: string, key = "i"): ReactNode[] {
  const out: ReactNode[] = [];
  const re = /(`[^`]+`)|(\*\*[^*]+\*\*)|(\*[^*\s][^*]*\*|_[^_\s][^_]*_)|(\[[^\]]+\]\([^)\s]+\))/g;
  let last = 0;
  let m: RegExpExecArray | null;
  let n = 0;
  while ((m = re.exec(text))) {
    if (m.index > last) out.push(text.slice(last, m.index));
    const t = m[0];
    const k = `${key}-${n++}`;
    if (m[1]) out.push(<code key={k} className="af-ic">{t.slice(1, -1)}</code>);
    else if (m[2]) out.push(<strong key={k}>{inline(t.slice(2, -2), k)}</strong>);
    else if (m[3]) out.push(<em key={k}>{inline(t.slice(1, -1), k)}</em>);
    else if (m[4]) {
      const lm = /\[([^\]]+)\]\(([^)\s]+)\)/.exec(t)!;
      const href = /^(https?:|#|\/)/.test(lm[2]) ? lm[2] : undefined;
      out.push(href ? <a key={k} href={href} target={href.startsWith("http") ? "_blank" : undefined} rel="noreferrer">{lm[1]}</a> : <span key={k}>{lm[1]}</span>);
    }
    last = m.index + t.length;
  }
  if (last < text.length) out.push(text.slice(last));
  return out;
}

// ── Syntax highlighting (small, line-based) ──────────────────────────────
export type Lang = "yaml" | "json" | "md" | "http" | "bash" | "text";

export function langOf(path: string): Lang {
  if (/\.ya?ml$/.test(path)) return "yaml";
  if (/\.jsonl?$/.test(path)) return "json";
  if (/\.md$/.test(path)) return "md";
  if (/\.http$/.test(path)) return "http";
  if (/\.(sh|bash)$/.test(path)) return "bash";
  return "text";
}

function hlJson(line: string, k: string): ReactNode[] {
  const out: ReactNode[] = [];
  const re = /("(?:[^"\\]|\\.)*")(\s*:)?|(-?\b\d+(?:\.\d+)?(?:e[+-]?\d+)?\b)|\b(true|false|null)\b/g;
  let last = 0;
  let m: RegExpExecArray | null;
  let n = 0;
  while ((m = re.exec(line))) {
    if (m.index > last) out.push(line.slice(last, m.index));
    const key = `${k}-${n++}`;
    if (m[1]) out.push(<span key={key} className={m[2] ? "tk-key" : "tk-str"}>{m[1]}</span>, m[2] ?? "");
    else if (m[3]) out.push(<span key={key} className="tk-num">{m[3]}</span>);
    else out.push(<span key={key} className="tk-kw">{m[4]}</span>);
    last = m.index + m[0].length;
  }
  if (last < line.length) out.push(line.slice(last));
  return out;
}

function hlYaml(line: string, k: string): ReactNode[] {
  const c = /(^|\s)#.*$/.exec(line);
  const code = c ? line.slice(0, c.index + c[1].length) : line;
  const comment = c ? line.slice(c.index + c[1].length) : "";
  const out: ReactNode[] = [];
  const km = /^(\s*-?\s*)([A-Za-z_$][\w.$/-]*)(\s*:)(.*)$/.exec(code);
  if (km) {
    out.push(km[1], <span key={`${k}k`} className="tk-key">{km[2]}</span>, km[3]);
    const v = km[4];
    if (/^\s*["'].*["']\s*$/.test(v)) out.push(<span key={`${k}v`} className="tk-str">{v}</span>);
    else if (/^\s*-?\d+(\.\d+)?\s*$/.test(v)) out.push(<span key={`${k}v`} className="tk-num">{v}</span>);
    else if (/^\s*(true|false|null|~)\s*$/.test(v)) out.push(<span key={`${k}v`} className="tk-kw">{v}</span>);
    else if (/[\w/-]+@[\d.]+/.test(v)) out.push(<span key={`${k}v`} className="tk-ref">{v}</span>);
    else out.push(v);
  } else if (/^\s*-\s/.test(code)) {
    const mm = /^(\s*-\s)(.*)$/.exec(code)!;
    out.push(mm[1], /[\w/-]+@[\d.]+/.test(mm[2]) ? <span key={`${k}r`} className="tk-ref">{mm[2]}</span> : mm[2]);
  } else out.push(code);
  if (comment) out.push(<span key={`${k}c`} className="tk-com">{comment}</span>);
  return out;
}

function hlMd(line: string, k: string, state: { fence: boolean; fm: boolean }, idx: number): ReactNode[] {
  if (idx === 0 && line === "---") { state.fm = true; return [<span key={k} className="tk-com">{line}</span>]; }
  if (state.fm) {
    if (line === "---") { state.fm = false; return [<span key={k} className="tk-com">{line}</span>]; }
    return hlYaml(line, k);
  }
  if (/^```/.test(line)) { state.fence = !state.fence; return [<span key={k} className="tk-com">{line}</span>]; }
  if (state.fence) return [<span key={k} className="tk-code">{line}</span>];
  if (/^#{1,6}\s/.test(line)) return [<span key={k} className="tk-head">{line}</span>];
  if (/^<!--.*-->$/.test(line.trim())) return [<span key={k} className="tk-com">{line}</span>];
  const lm = /^(\s*(?:[-*]|\d+\.)\s)(.*)$/.exec(line);
  if (lm) return [<span key={`${k}b`} className="tk-kw">{lm[1]}</span>, ...inlineCodeOnly(lm[2], k)];
  return inlineCodeOnly(line, k);
}

function inlineCodeOnly(text: string, k: string): ReactNode[] {
  return text.split(/(`[^`]+`)/).map((p, i) => (p.startsWith("`") && p.endsWith("`") && p.length > 1 ? <span key={`${k}-${i}`} className="tk-str">{p}</span> : p));
}

function hlHttp(line: string, k: string, idx: number): ReactNode[] {
  if (idx === 0 || /^(GET|POST|PUT|PATCH|DELETE)\s/.test(line)) {
    const [m, ...rest] = line.split(" ");
    return [<span key={`${k}m`} className="tk-kw">{m}</span>, " ", <span key={`${k}u`} className="tk-str">{rest.join(" ")}</span>];
  }
  const h = /^([\w-]+)(:)(.*)$/.exec(line);
  if (h) return [<span key={`${k}h`} className="tk-key">{h[1]}</span>, h[2], h[3]];
  if (/^\s*[{["]/.test(line)) return hlJson(line, k);
  return [line];
}

function hlBash(line: string, k: string): ReactNode[] {
  if (/^\s*#/.test(line)) return [<span key={k} className="tk-com">{line}</span>];
  const [cmd, ...rest] = line.split(" ");
  return [<span key={`${k}c`} className="tk-kw">{cmd}</span>, rest.length ? " " : "", ...rest.join(" ").split(/(\S+@[\d.]+)/).map((p, i) => (/@[\d.]+$/.test(p) ? <span key={`${k}${i}`} className="tk-ref">{p}</span> : p))];
}

export function highlightLines(code: string, lang: Lang): ReactNode[][] {
  const lines = code.replace(/\n$/, "").split("\n");
  const state = { fence: false, fm: false };
  return lines.map((line, i) => {
    const k = `l${i}`;
    switch (lang) {
      case "json": return hlJson(line, k);
      case "yaml": return hlYaml(line, k);
      case "md": return hlMd(line, k, state, i);
      case "http": return hlHttp(line, k, i);
      case "bash": return hlBash(line, k);
      default: return [line];
    }
  });
}

export function CodeView({ code, lang, maxHeight, numbers = true, wrap }: { code: string; lang: Lang; maxHeight?: number; numbers?: boolean; wrap?: boolean }) {
  const lines = highlightLines(code, lang);
  return (
    <div className={`af-code ${wrap ? "wrap" : ""}`} style={maxHeight ? { maxHeight } : undefined}>
      <table>
        <tbody>
          {lines.map((l, i) => (
            <tr key={i}>
              {numbers && <td className="af-ln" aria-hidden>{i + 1}</td>}
              <td className="af-lc">{l.length ? l : " "}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function DiffView({ lines, maxHeight, context = 3 }: { lines: DiffLine[]; maxHeight?: number; context?: number }) {
  // Collapse long unchanged runs.
  const keep = lines.map((l, i) => l.kind !== "same" || lines.slice(Math.max(0, i - context), i + context + 1).some((x) => x.kind !== "same"));
  const rows: ReactNode[] = [];
  let skipped = 0;
  let a = 0;
  let b = 0;
  lines.forEach((l, i) => {
    if (l.kind !== "add") a++;
    if (l.kind !== "del") b++;
    if (!keep[i]) { skipped++; return; }
    if (skipped) { rows.push(<tr key={`s${i}`} className="skip"><td className="af-ln" /><td className="af-ln" /><td className="af-lc">⋯ {skipped} unchanged lines</td></tr>); skipped = 0; }
    rows.push(
      <tr key={i} className={l.kind}>
        <td className="af-ln">{l.kind !== "add" ? a : ""}</td>
        <td className="af-ln">{l.kind !== "del" ? b : ""}</td>
        <td className="af-lc"><span className="af-dsign">{l.kind === "add" ? "+" : l.kind === "del" ? "−" : " "}</span>{l.text || " "}</td>
      </tr>,
    );
  });
  if (skipped) rows.push(<tr key="end" className="skip"><td className="af-ln" /><td className="af-ln" /><td className="af-lc">⋯ {skipped} unchanged lines</td></tr>);
  return <div className="af-code af-diff" style={maxHeight ? { maxHeight } : undefined}><table><tbody>{rows}</tbody></table></div>;
}

// ── Block markdown ───────────────────────────────────────────────────────
export function Markdown({ source, frontmatter = "table" }: { source: string; frontmatter?: "table" | "hide" }) {
  const text = source.replace(/\r\n/g, "\n");
  const blocks: ReactNode[] = [];
  let lines = text.split("\n");
  if (lines[0] === "---") {
    const end = lines.indexOf("---", 1);
    if (end > 0) {
      const fm = lines.slice(1, end);
      if (frontmatter === "table") {
        const rows = fm.map((l) => /^([\w-]+):\s*(.*)$/.exec(l)).filter((m): m is RegExpExecArray => Boolean(m && m[2]))
          .map((m) => { m[2] = m[2].replace(/\s+#.*$/, "").replace(/^["'](.*)["']$/, "$1"); return m; });
        blocks.push(
          <table key="fm" className="af-fm">
            <tbody>{rows.map((r) => <tr key={r[1]}><th>{r[1]}</th><td>{r[1] === "extends" ? <code className="af-ic ref">{r[2]}</code> : inline(r[2], r[1])}</td></tr>)}</tbody>
          </table>,
        );
      }
      lines = lines.slice(end + 1);
    }
  }
  let i = 0;
  let key = 0;
  while (i < lines.length) {
    const line = lines[i];
    const k = `b${key++}`;
    if (!line.trim()) { i++; continue; }
    const fence = /^```(\w*)/.exec(line);
    if (fence) {
      const body: string[] = [];
      i++;
      while (i < lines.length && !/^```/.test(lines[i])) body.push(lines[i++]);
      i++;
      const lang = (fence[1] === "yml" ? "yaml" : fence[1]) as Lang;
      blocks.push(<CodeView key={k} code={body.join("\n")} lang={["yaml", "json", "md", "http", "bash"].includes(lang) ? lang : "text"} numbers={false} />);
      continue;
    }
    const prov = /^<!--\s*(.*?)\s*-->$/.exec(line.trim());
    if (prov) {
      if (/inherited from/.test(prov[1])) blocks.push(<div key={k} className="af-prov">{prov[1]}</div>);
      i++;
      continue;
    }
    const h = /^(#{1,4})\s+(.*)$/.exec(line);
    if (h) {
      const level = h[1].length;
      const content = inline(h[2], k);
      blocks.push(level === 1 ? <h1 key={k}>{content}</h1> : level === 2 ? <h2 key={k}>{content}</h2> : level === 3 ? <h3 key={k}>{content}</h3> : <h4 key={k}>{content}</h4>);
      i++;
      continue;
    }
    if (/^(-{3,}|\*{3,})$/.test(line.trim())) { blocks.push(<hr key={k} />); i++; continue; }
    if (/^>\s?/.test(line)) {
      const body: string[] = [];
      while (i < lines.length && /^>\s?/.test(lines[i])) body.push(lines[i++].replace(/^>\s?/, ""));
      blocks.push(<blockquote key={k}>{inline(body.join(" "), k)}</blockquote>);
      continue;
    }
    if (/^\|.*\|\s*$/.test(line) && i + 1 < lines.length && /^\|?\s*:?-{2,}/.test(lines[i + 1])) {
      const cells = (l: string) => l.trim().replace(/^\||\|$/g, "").split("|").map((c) => c.trim());
      const head = cells(line);
      i += 2;
      const rows: string[][] = [];
      while (i < lines.length && /^\|.*\|\s*$/.test(lines[i])) rows.push(cells(lines[i++]));
      blocks.push(
        <div key={k} className="af-table-wrap"><table className="af-table">
          <thead><tr>{head.map((c, j) => <th key={j}>{inline(c, `${k}h${j}`)}</th>)}</tr></thead>
          <tbody>{rows.map((r, ri) => <tr key={ri}>{r.map((c, j) => <td key={j}>{inline(c, `${k}${ri}${j}`)}</td>)}</tr>)}</tbody>
        </table></div>,
      );
      continue;
    }
    const li = /^(\s*)([-*]|\d+\.)\s+(.*)$/.exec(line);
    if (li) {
      const ordered = /\d/.test(li[2]);
      const items: { text: string; indent: number }[] = [];
      while (i < lines.length) {
        const m = /^(\s*)([-*]|\d+\.)\s+(.*)$/.exec(lines[i]);
        if (m) { items.push({ text: m[3], indent: m[1].length }); i++; continue; }
        if (lines[i].trim() && /^\s{2,}/.test(lines[i]) && items.length) { items[items.length - 1].text += ` ${lines[i].trim()}`; i++; continue; }
        break;
      }
      const ListTag = ordered ? "ol" : "ul";
      blocks.push(<ListTag key={k}>{items.map((it, j) => <li key={j} style={it.indent ? { marginLeft: it.indent * 8 } : undefined}>{inline(it.text, `${k}${j}`)}</li>)}</ListTag>);
      continue;
    }
    const para: string[] = [];
    while (i < lines.length && lines[i].trim() && !/^(#{1,4}\s|```|\s*[-*]\s|\s*\d+\.\s|>|\|)/.test(lines[i])) para.push(lines[i++]);
    if (!para.length) { para.push(lines[i++]); }
    blocks.push(<p key={k}>{inline(para.join(" "), k)}</p>);
  }
  return <div className="af-md">{blocks.map((b, j) => <Fragment key={j}>{b}</Fragment>)}</div>;
}
