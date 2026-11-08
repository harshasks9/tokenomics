#!/usr/bin/env python3
"""Sentence-level diff of two filing text files produced by extract_text.py.

Normalizes away page numbers, 'Table of Contents' markers, page breaks and line
wrapping, then compares sentence/table-row sequences with difflib so that only
substantive edits remain. Each hunk is tagged with the nearest preceding
section heading (from a fixed list of S-1 headings) to make review easier.

Usage: python3 -I diff_filings.py <old.txt> <new.txt> <out.md>
"""
import difflib
import re
import sys

HEADINGS = [
    "Select Defined Terms", "Prospectus Summary", "Risk Factors",
    "Special Note Regarding Forward-Looking Statements", "Industry, Market, and Other Data",
    "Use of Proceeds", "Dividend Policy", "Capitalization", "Dilution",
    "Management’s Discussion and Analysis of", "Business", "Our Governance Structure and Its Goals",
    "Management", "Executive Compensation", "Certain Relationships and Related Person Transactions",
    "Principal and Selling Stockholders", "Description of Capital Stock", "Shares Eligible for Future Sale",
    "Underwriting", "Legal Matters", "Change in Independent Accountant", "Experts",
    "Index to Consolidated Financial Statements", "Part II",
]
NOISE = re.compile(r"^(Table of Contents|---- page break ----|\[TABLE\]|\[/TABLE\]|(F-|II-)?\d{1,3}|[ivx]+)$")


PAGE_SECTIONS = [
    (1, "Select Defined Terms"), (4, "Prospectus Summary"), (27, "Risk Factors"),
    (121, "Forward-Looking Statements / Industry Data"), (125, "Use of Proceeds / Dividend Policy"),
    (127, "Capitalization"), (130, "Dilution"), (133, "MD&A"), (182, "Business"),
    (246, "Our Governance Structure and Its Goals"), (258, "Management"), (268, "Executive Compensation"),
    (286, "Related Person Transactions"), (292, "Principal and Selling Stockholders"),
    (296, "Description of Capital Stock"), (311, "Shares Eligible for Future Sale"),
    (316, "Tax Considerations"), (321, "Underwriting"), (338, "Legal Matters / Experts"),
]


def section_for(page):
    if page is None:
        return "Cover"
    if page.startswith("F-"):
        return "Financial Statements"
    if page.startswith("II-"):
        return "Part II (exhibits / undertakings)"
    if re.fullmatch(r"[ivx]+", page):
        return "Cover"
    n = int(page)
    sec = "Cover"
    for start, name in PAGE_SECTIONS:
        if n >= start:
            sec = name
    return sec


def units(path):
    lines = open(path, encoding="utf-8").read().split("\n")
    # page marker = page-number line followed by 'Table of Contents'; text above it belongs to that page
    page_of = [None] * len(lines)
    nxt = None
    for i in range(len(lines) - 1, -1, -1):
        s = lines[i].strip()
        if re.fullmatch(r"(F-|II-)?\d{1,3}|[ivx]+", s) and i + 1 < len(lines) and lines[i + 1].startswith("Table of Contents"):
            nxt = s
        page_of[i] = nxt
    out = []
    buf, buf_sec = [], "Cover"
    in_table = False
    for i, ln in enumerate(lines):
        s = ln.strip()
        if s == "[TABLE]":
            in_table = True
        if s == "[/TABLE]":
            in_table = False
        if not s or NOISE.match(s):
            continue
        sec = section_for(page_of[i]) if page_of[i] else "Part II (exhibits / undertakings)"
        if in_table:
            if buf:
                out.extend((buf_sec, x) for x in split_sentences(" ".join(buf)))
                buf = []
            out.append((sec, "ROW: " + re.sub(r"\s+", " ", s)))
        else:
            if buf and sec != buf_sec:
                out.extend((buf_sec, x) for x in split_sentences(" ".join(buf)))
                buf = []
            if not buf:
                buf_sec = sec
            buf.append(s)
    if buf:
        out.extend((buf_sec, x) for x in split_sentences(" ".join(buf)))
    return out


def split_sentences(text):
    text = re.sub(r"\s+", " ", text)
    parts = re.split(r"(?<=[.;:])\s+(?=[A-Z“•◦(])", text)
    return [p.strip() for p in parts if p.strip()]


def norm(t):
    return re.sub(r"\s+", "", t).lower()


def main():
    old, new, dst = sys.argv[1:4]
    a, b = units(old), units(new)
    an, bn = [norm(t) for _, t in a], [norm(t) for _, t in b]
    sm = difflib.SequenceMatcher(None, an, bn, autojunk=False)
    hunks = []
    for tag, i1, i2, j1, j2 in sm.get_opcodes():
        if tag == "equal":
            continue
        sec = (b[j1][0] if j1 < len(b) else a[i1][0] if i1 < len(a) else "?")
        hunks.append((tag, sec, [t for _, t in a[i1:i2]], [t for _, t in b[j1:j2]]))
    with open(dst, "w", encoding="utf-8") as f:
        f.write(f"# Sentence-level diff\n\nold: {old}\nnew: {new}\nhunks: {len(hunks)}\n\n")
        for k, (tag, sec, olds, news) in enumerate(hunks, 1):
            f.write(f"## [{k}] {tag.upper()} — section: {sec}\n")
            for t in olds:
                f.write(f"- OLD: {t}\n")
            for t in news:
                f.write(f"+ NEW: {t}\n")
            f.write("\n")
    print(f"{len(hunks)} hunks -> {dst}")


if __name__ == "__main__":
    main()
