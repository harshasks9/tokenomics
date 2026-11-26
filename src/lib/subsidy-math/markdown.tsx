import type { ReactNode } from "react";

/**
 * A deliberately small Markdown renderer for the study's own documents (memo, email,
 * claims audit). Supports headings, paragraphs, bold/italic/code, links, ordered and
 * unordered lists (one nesting level), pipe tables, blockquotes and rules. Input is
 * trusted repository content, rendered to React elements (no HTML injection).
 */

type Block =
  | { kind: "h"; level: number; text: string; id: string }
  | { kind: "p"; text: string }
  | { kind: "ul" | "ol"; items: { text: string; children: string[] }[] }
  | { kind: "table"; head: string[]; rows: string[][] }
  | { kind: "quote"; text: string }
  | { kind: "hr" };

export function slug(s: string): string {
  return s.toLowerCase().replace(/<[^>]+>/g, "").replace(/[^\w\s-]/g, "").trim().replace(/\s+/g, "-").slice(0, 80);
}

const cells = (line: string) => line.trim().replace(/^\|/, "").replace(/\|$/, "").split("|").map((c) => c.trim());

export function parse(md: string): Block[] {
  const lines = md.replace(/\r\n/g, "\n").split("\n");
  const out: Block[] = [];
  let i = 0;
  while (i < lines.length) {
    const line = lines[i];
    if (!line.trim()) { i += 1; continue; }
    const h = /^(#{1,4})\s+(.*)$/.exec(line);
    if (h) { out.push({ kind: "h", level: h[1].length, text: h[2].trim(), id: slug(h[2]) }); i += 1; continue; }
    if (/^(-{3,}|\*{3,})\s*$/.test(line.trim())) { out.push({ kind: "hr" }); i += 1; continue; }
    if (line.trim().startsWith("|") && i + 1 < lines.length && /^\s*\|?\s*:?-{2,}/.test(lines[i + 1])) {
      const head = cells(line);
      i += 2;
      const rows: string[][] = [];
      while (i < lines.length && lines[i].trim().startsWith("|")) { rows.push(cells(lines[i])); i += 1; }
      out.push({ kind: "table", head, rows });
      continue;
    }
    if (line.startsWith(">")) {
      const buf: string[] = [];
      while (i < lines.length && lines[i].startsWith(">")) { buf.push(lines[i].replace(/^>\s?/, "")); i += 1; }
      out.push({ kind: "quote", text: buf.join(" ") });
      continue;
    }
    const li = /^(\s*)([-*]|\d+\.)\s+(.*)$/.exec(line);
    if (li && li[1].length === 0) {
      const ordered = /\d+\./.test(li[2]);
      const items: { text: string; children: string[] }[] = [];
      while (i < lines.length) {
        const m = /^(\s*)([-*]|\d+\.)\s+(.*)$/.exec(lines[i]);
        if (m && m[1].length === 0) { items.push({ text: m[3], children: [] }); i += 1; continue; }
        if (m && m[1].length > 0 && items.length) { items[items.length - 1].children.push(m[3]); i += 1; continue; }
        if (lines[i].trim() && /^\s{2,}\S/.test(lines[i]) && items.length) { items[items.length - 1].text += " " + lines[i].trim(); i += 1; continue; }
        break;
      }
      out.push({ kind: ordered ? "ol" : "ul", items });
      continue;
    }
    const buf: string[] = [line.trim()];
    i += 1;
    while (i < lines.length && lines[i].trim() && !/^(#{1,4}\s|>|\s*([-*]|\d+\.)\s|\|)/.test(lines[i]) && !/^(-{3,})\s*$/.test(lines[i].trim())) {
      buf.push(lines[i].trim());
      i += 1;
    }
    out.push({ kind: "p", text: buf.join(" ") });
  }
  return out;
}

/** Inline: **bold**, *italic*, `code`, [text](url). */
export function inline(text: string, keyBase = "i"): ReactNode[] {
  const nodes: ReactNode[] = [];
  const re = /(\*\*([^*]+)\*\*|\*([^*]+)\*|`([^`]+)`|\[([^\]]+)\]\(([^)\s]+)\))/g;
  let last = 0;
  let m: RegExpExecArray | null;
  let k = 0;
  while ((m = re.exec(text))) {
    if (m.index > last) nodes.push(text.slice(last, m.index));
    const key = `${keyBase}-${k++}`;
    if (m[2]) nodes.push(<strong key={key}>{inline(m[2], key)}</strong>);
    else if (m[3]) nodes.push(<em key={key}>{inline(m[3], key)}</em>);
    else if (m[4]) nodes.push(<code key={key}>{m[4]}</code>);
    else if (m[5]) {
      const href = m[6];
      const ext = /^https?:/.test(href);
      nodes.push(<a key={key} href={href} {...(ext ? { target: "_blank", rel: "noopener noreferrer" } : {})}>{inline(m[5], key)}</a>);
    }
    last = m.index + m[0].length;
  }
  if (last < text.length) nodes.push(text.slice(last));
  return nodes;
}

export function Markdown({ source, className }: { source: string; className?: string }) {
  const blocks = parse(source);
  return (
    <div className={className}>
      {blocks.map((b, idx) => {
        const key = `b${idx}`;
        switch (b.kind) {
          case "h": {
            const Tag = (`h${Math.min(6, b.level + 1)}`) as "h2" | "h3" | "h4" | "h5";
            return <Tag key={key} id={b.id}>{inline(b.text, key)}</Tag>;
          }
          case "p": return <p key={key}>{inline(b.text, key)}</p>;
          case "hr": return <hr key={key} />;
          case "quote": return <blockquote key={key}>{inline(b.text, key)}</blockquote>;
          case "ul":
          case "ol": {
            const List = b.kind;
            return (
              <List key={key}>
                {b.items.map((it, j) => (
                  <li key={`${key}-${j}`}>
                    {inline(it.text, `${key}-${j}`)}
                    {it.children.length > 0 && <ul>{it.children.map((c, n) => <li key={n}>{inline(c, `${key}-${j}-${n}`)}</li>)}</ul>}
                  </li>
                ))}
              </List>
            );
          }
          case "table":
            return (
              <div key={key} className="sm-table-wrap">
                <table>
                  <thead><tr>{b.head.map((c, j) => <th key={j}>{inline(c, `${key}-h${j}`)}</th>)}</tr></thead>
                  <tbody>{b.rows.map((r, j) => <tr key={j}>{r.map((c, n) => <td key={n}>{inline(c, `${key}-${j}-${n}`)}</td>)}</tr>)}</tbody>
                </table>
              </div>
            );
        }
      })}
    </div>
  );
}

export function headings(source: string, maxLevel = 2): { id: string; text: string; level: number }[] {
  return parse(source).filter((b): b is Extract<Block, { kind: "h" }> => b.kind === "h" && b.level <= maxLevel).map((b) => ({ id: b.id, text: b.text.replace(/\*\*/g, ""), level: b.level }));
}
