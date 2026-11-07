#!/usr/bin/env python3
"""Condense sentence_diff.md hunks into word-level deltas with short context.

Drops hunks whose only differences are whitespace, punctuation, or page-number
cross references; flags hunks where numeric tokens changed.

Usage: python3 -I condense_diff.py <sentence_diff.md> <out.md>
"""
import difflib
import re
import sys

TOK = re.compile(r"\$?[\d][\d,\.]*%?|[A-Za-z’'\-]+|[^\sA-Za-z\d]")


def toks(s):
    return TOK.findall(s)


def main():
    src, dst = sys.argv[1:3]
    txt = open(src, encoding="utf-8").read()
    hunks = re.split(r"\n(?=## \[)", txt)[1:]
    out = []
    kept = 0
    for h in hunks:
        head = h.split("\n")[0]
        sec = head.split("section: ")[-1]
        kind = head.split("] ")[1].split(" ")[0]
        olds = " ".join(l[7:] for l in h.split("\n") if l.startswith("- OLD:"))
        news = " ".join(l[7:] for l in h.split("\n") if l.startswith("+ NEW:"))
        a, b = toks(olds), toks(news)
        sm = difflib.SequenceMatcher(None, a, b, autojunk=False)
        deltas = []
        numeric = False
        for tag, i1, i2, j1, j2 in sm.get_opcodes():
            if tag == "equal":
                continue
            rem, add = " ".join(a[i1:i2]), " ".join(b[j1:j2])
            if re.sub(r"[^\w]", "", rem) == re.sub(r"[^\w]", "", add):
                continue
            ctx = " ".join(a[max(0, i1 - 6):i1])
            if re.search(r"\d", rem + add):
                numeric = True
            deltas.append(f"…{ctx} [−{rem}] [+{add}]")
        # drop page-reference-only changes
        if deltas and all(re.fullmatch(r"….*(page|pages|beginning on page)\s*\[−\d+\] \[\+\d+\]", d) for d in deltas):
            continue
        if not deltas:
            continue
        kept += 1
        flag = " #NUM" if numeric else ""
        out.append(f"### {kind} | {sec}{flag}\n" + "\n".join(d[:400] for d in deltas[:12]) +
                   (f"\n(+{len(deltas)-12} more deltas)" if len(deltas) > 12 else ""))
    open(dst, "w", encoding="utf-8").write(f"kept {kept} of {len(hunks)} hunks\n\n" + "\n\n".join(out) + "\n")
    print(f"kept {kept} of {len(hunks)} hunks -> {dst}")


if __name__ == "__main__":
    main()
