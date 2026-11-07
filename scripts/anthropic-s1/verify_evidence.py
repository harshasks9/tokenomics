#!/usr/bin/env python3
"""Verify that every evidence quote appears verbatim in its cited filing and
(re)assign the printed page number from the quote's location.

Quotes may contain '...' to elide text; each fragment must be found, in order.
Writes the page back into data/anthropic-s1/evidence.json and prints a report.
Exit code 1 if any quote cannot be found.

Usage: python3 -I verify_evidence.py <s1.txt> <s1a.txt> <evidence.json>
"""
import json
import re
import sys

sys.path.insert(0, __file__.rsplit("/", 1)[0])
from locate import pages  # noqa: E402


def stream(path):
    """Whitespace-free character stream of the filing with a line index per char.

    Matching ignores all whitespace because the EDGAR HTML often runs words
    together ("$69.8 billionof", "endedSeptember").
    """
    lines = open(path, encoding="utf-8").read().split("\n")
    pg = pages(lines)
    chars, owner = [], []
    for i, ln in enumerate(lines):
        t = ln.strip()
        if not t or t == "Table of Contents" or re.fullmatch(r"(F-|II-)?\d{1,3}", t):
            continue
        t = squash(t)
        chars.append(t)
        owner.extend([i] * len(t))
    return "".join(chars), owner, pg


def squash(s):
    s = s.replace("’", "'").replace("“", '"').replace("”", '"').replace("–", "-").replace("—", "-")
    return re.sub(r"\s+", "", s)


def main():
    s1, s1a, evp = sys.argv[1:4]
    docs = {k: stream(p) for k, p in (("s1", s1), ("s1a", s1a))}
    data = json.load(open(evp, encoding="utf-8"))
    missing = 0
    for it in data["items"]:
        src = it["sourceId"]
        if src not in docs or it.get("classification") != "reported":
            continue
        text, owner, pg = docs[src]
        ntext = text
        frags = [squash(f) for f in re.split(r"\.\.\.|…|\s/\s", it["quote"]) if len(squash(f)) >= 10]
        pos, first, ok = 0, None, True
        for f in frags:
            j = ntext.find(f, pos)
            if j < 0:
                ok = False
                break
            first = j if first is None else first
            pos = j + len(f)
        if not ok or first is None:
            missing += 1
            it["quoteVerified"] = False
            print(f"NOT FOUND [{src}] {it['id']}: {it['quote'][:90]}")
            continue
        page = pg[owner[first]]
        it["page"] = page
        it["quoteVerified"] = True
    json.dump(data, open(evp, "w", encoding="utf-8"), indent=1, ensure_ascii=False)
    open(evp, "a").write("\n")
    total = sum(1 for i in data["items"] if i["sourceId"] in docs and i.get("classification") == "reported")
    print(f"verified {total - missing}/{total} quotes; pages reassigned")
    sys.exit(1 if missing else 0)


if __name__ == "__main__":
    main()
