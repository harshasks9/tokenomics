#!/usr/bin/env python3
"""Locate phrases in the filing text and report the printed page number.

Usage: python3 -I locate.py <filing.txt> "phrase one" ["phrase two" ...]
Whitespace and line-wraps are normalized, so phrases may span lines.
"""
import re
import sys


def pages(lines):
    """Printed folio for each line.

    In the EDGAR text extraction the folio line ("147") is emitted immediately
    before the "Table of Contents" header of the page it numbers, i.e. it
    precedes that page's text (verified against the table of contents, e.g.
    "MANAGEMENT | 258" -> "258 / Table of Contents / Management").
    """
    page_of = [None] * len(lines)
    cur = None
    for i in range(len(lines)):
        s = lines[i].strip()
        if re.fullmatch(r"(F-|II-)?\d{1,3}|[ivx]+", s) and i + 1 < len(lines) and lines[i + 1].startswith("Table of Contents"):
            cur = s
        page_of[i] = cur
    return page_of


def main():
    path, phrases = sys.argv[1], sys.argv[2:]
    lines = open(path, encoding="utf-8").read().split("\n")
    pg = pages(lines)
    # build normalized stream with char->line map
    buf, owner = [], []
    for i, ln in enumerate(lines):
        t = re.sub(r"\s+", " ", ln.strip()) + " "
        buf.append(t)
        owner.extend([i] * len(t))
    stream = "".join(buf)
    for ph in phrases:
        key = re.sub(r"\s+", " ", ph.strip())
        hits = [m.start() for m in re.finditer(re.escape(key), stream)]
        locs = sorted({pg[owner[h]] for h in hits}, key=lambda x: str(x))
        print(f"{ph[:70]!r}: {len(hits)} hit(s); pages {locs}")


if __name__ == "__main__":
    main()
