#!/usr/bin/env python3
"""Convert an EDGAR HTML filing (Workiva-style) into plain text.

Tables are flattened row-by-row with ' | ' between non-empty cells so that
financial tables stay greppable and diffable. Block elements become lines.

Usage: python3 -I extract_text.py <input.htm> <output.txt>
"""
import re
import sys

from bs4 import BeautifulSoup, NavigableString, Tag

BLOCK = {"p", "div", "li", "h1", "h2", "h3", "h4", "h5", "h6", "br", "hr"}


def cell_text(td: Tag) -> str:
    t = td.get_text(" ", strip=True)
    t = re.sub(r"\s+", " ", t)
    return t


def table_lines(tbl: Tag):
    out = []
    for tr in tbl.find_all("tr"):
        cells = [cell_text(td) for td in tr.find_all(["td", "th"])]
        # merge "$" / "%" / ")" fragments that Workiva splits into separate cells
        merged = []
        for c in cells:
            if not c:
                continue
            if merged and c in {"%", ")", "%)", ")%"}:
                merged[-1] += c
            elif merged and merged[-1] in {"$", "("}:
                merged[-1] += c
            else:
                merged.append(c)
        if merged:
            out.append(" | ".join(merged))
    return out


def walk(node, lines, buf):
    for child in node.children:
        if isinstance(child, NavigableString):
            s = str(child)
            if s.strip():
                buf.append(s)
            continue
        if not isinstance(child, Tag):
            continue
        name = child.name.lower()
        if name in ("script", "style", "head"):
            continue
        if name == "table":
            flush(lines, buf)
            lines.append("[TABLE]")
            lines.extend(table_lines(child))
            lines.append("[/TABLE]")
            continue
        if name == "hr":
            flush(lines, buf)
            lines.append("---- page break ----")
            continue
        if name in BLOCK:
            flush(lines, buf)
            walk(child, lines, buf)
            flush(lines, buf)
        else:
            walk(child, lines, buf)


def flush(lines, buf):
    if buf:
        t = re.sub(r"\s+", " ", "".join(buf)).strip()
        if t:
            lines.append(t)
        buf.clear()


def main():
    src, dst = sys.argv[1], sys.argv[2]
    with open(src, "rb") as f:
        soup = BeautifulSoup(f.read(), "lxml")
    # drop inline XBRL hidden header blocks
    for hidden in soup.find_all(style=re.compile(r"display:\s*none")):
        hidden.decompose()
    body = soup.body or soup
    lines, buf = [], []
    walk(body, lines, buf)
    flush(lines, buf)
    # collapse runs of page-break markers / page numbers
    cleaned = []
    for ln in lines:
        if cleaned and ln == cleaned[-1] == "---- page break ----":
            continue
        cleaned.append(ln)
    with open(dst, "w", encoding="utf-8") as f:
        f.write("\n".join(cleaned) + "\n")
    print(f"{dst}: {len(cleaned)} lines")


if __name__ == "__main__":
    main()
