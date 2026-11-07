#!/usr/bin/env python3
"""Rebuild the self-hosted woff2 files in this directory.

These fonts used to be fetched from fonts.gstatic.com by `next/font/google`
on every `next build`, which made builds flaky. They are now committed here
and loaded with `next/font/local`. This script documents (and reproduces)
exactly how each file was made:

  1. Download the upstream variable/static TTF from the google/fonts repo
     (same version Google Fonts serves).
  2. Pin every axis except `wght` to the Google Fonts axis-registry default
     (opsz=14, wdth=100, SOFT=0, WONK=0), exactly as Google Fonts does when
     only weights are requested. Note this is NOT the font's own fvar default
     (e.g. Fraunces defaults to opsz=9, Source Serif 4 to opsz=20).
  3. Subset to the union of the `unicode-range`s Google Fonts serves for the
     family's latin, latin-ext and greek subsets (whichever the family has),
     keeping only the OpenType layout features Google keeps in the files it
     serves (it strips cvXX/ssXX etc.) and dropping hinting (Google
     serves unhinted files to the browsers next/font targets). One file per
     family/style, because next/font/local cannot attach a different
     unicode-range to each file. Cyrillic and Vietnamese are left out: no
     site using these fonts has such text, and every byte here is preloaded.
  4. IBM Plex is licensed with the Reserved Font Name "Plex", which the OFL
     says a modified (here: subsetted) copy must not carry, so its internal
     name records are renamed (RENAME below). CSS never sees these names:
     next/font/local names each family after the const it is assigned to in
     the layout (e.g. `atlasFraunces`), which is why those carry site prefixes.
  5. Write woff2.

Licenses for every family are in ./licenses.

This needs network access, so it is run by hand, never during `next build`.
Usage:  pip install fonttools brotli && python3 src/fonts/build-fonts.py
"""
import io
import os
import re
import urllib.request

from fontTools import subset
from fontTools.ttLib import TTFont
from fontTools.varLib import instancer

HERE = os.path.dirname(os.path.abspath(__file__))
GF_REPO = "https://raw.githubusercontent.com/google/fonts/main/ofl"
CSS_API = "https://fonts.googleapis.com/css2?family={}&display=swap"
# Same modern UA next/font/google uses, so Google returns its unicode-range subsets.
UA = ("Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 "
      "(KHTML, like Gecko) Chrome/104.0.0.0 Safari/537.36")

SUBSETS = ("latin", "latin-ext", "greek")

# Google Fonts axis-registry defaults (github.com/google/fonts/tree/main/axisregistry).
AXIS_DEFAULTS = {"opsz": 14, "wdth": 100, "SOFT": 0, "WONK": 0}

# out file -> (repo path, Google Fonts css2 family query used to read unicode ranges)
FONTS = {
    "inter.woff2": ("inter/Inter[opsz,wght].ttf", "Inter:wght@100..900"),
    "space-grotesk.woff2": ("spacegrotesk/SpaceGrotesk[wght].ttf", "Space+Grotesk:wght@300..700"),
    "source-serif-4.woff2": ("sourceserif4/SourceSerif4[opsz,wght].ttf", "Source+Serif+4:wght@200..900"),
    "source-serif-4-italic.woff2": ("sourceserif4/SourceSerif4-Italic[opsz,wght].ttf", "Source+Serif+4:ital,wght@1,200..900"),
    "ibm-plex-sans.woff2": ("ibmplexsans/IBMPlexSans[wdth,wght].ttf", "IBM+Plex+Sans:wght@100..700"),
    "ibm-plex-mono-400.woff2": ("ibmplexmono/IBMPlexMono-Regular.ttf", "IBM+Plex+Mono:wght@400"),
    "ibm-plex-mono-500.woff2": ("ibmplexmono/IBMPlexMono-Medium.ttf", "IBM+Plex+Mono:wght@500"),
    "ibm-plex-mono-600.woff2": ("ibmplexmono/IBMPlexMono-SemiBold.ttf", "IBM+Plex+Mono:wght@600"),
    "fraunces.woff2": ("fraunces/Fraunces[SOFT,WONK,opsz,wght].ttf", "Fraunces:wght@100..900"),
    "jetbrains-mono.woff2": ("jetbrainsmono/JetBrainsMono[wght].ttf", "JetBrains+Mono:wght@100..800"),
    "archivo.woff2": ("archivo/Archivo[wdth,wght].ttf", "Archivo:wght@100..900"),
}

# Internal font names for families with a Reserved Font Name (OFL).
RENAME = {
    "ibm-plex-sans.woff2": ("IBM Plex", "TKN"),  # "IBM Plex Sans" -> "TKN Sans"
    "ibm-plex-mono-": ("IBM Plex", "TKN"),       # "IBM Plex Mono" -> "TKN Mono"
}
RENAME_COMPACT = {"IBMPlex": "TKN"}  # PostScript-style names, e.g. "IBMPlexSans-Regular"


def rename(font, out):
    for prefix, (old, new) in RENAME.items():
        if not out.startswith(prefix):
            continue
        for rec in font["name"].names:
            if rec.nameID in (0, 7, 13, 14):  # keep copyright, trademark, license
                continue
            text = rec.toUnicode()
            updated = text.replace(old, new)
            for a, b in RENAME_COMPACT.items():
                updated = updated.replace(a, b)
            if updated != text:
                rec.string = updated
        names = " ".join(r.toUnicode() for r in font["name"].names if r.nameID not in (0, 7, 13, 14))
        assert "Plex" not in names, names


def fetch(url, ua=None):
    req = urllib.request.Request(url, headers={"User-Agent": ua} if ua else {})
    with urllib.request.urlopen(req) as r:
        return r.read()


def unicodes_from_css(css):
    cps = set()
    blocks = re.findall(r"/\* ([\w-]+) \*/\s*@font-face \{([^}]*)\}", css)
    ranges = [re.search(r"unicode-range:\s*([^;]+);", body).group(1)
              for name, body in blocks if name in SUBSETS]
    assert ranges, "no matching subsets in Google Fonts CSS"
    for rng in ranges:
        for part in rng.split(","):
            part = part.strip()[2:]  # drop "U+"
            if "-" in part:
                a, b = part.split("-")
                cps.update(range(int(a, 16), int(b, 16) + 1))
            elif "?" in part:
                cps.update(range(int(part.replace("?", "0"), 16), int(part.replace("?", "F"), 16) + 1))
            else:
                cps.add(int(part, 16))
    return cps


def features_from_served_files(css):
    """OpenType layout features present in the files Google Fonts serves.

    Google strips optional features (cvXX, ssXX, case, zero, ...) from served
    files, so CSS like `font-feature-settings: "cv11"` was a no-op on these
    sites. Keeping only Google's set keeps the self-hosted rendering identical.
    """
    tags = set()
    blocks = re.findall(r"/\* ([\w-]+) \*/\s*@font-face \{([^}]*)\}", css)
    for name, body in blocks:
        if name not in SUBSETS:
            continue
        served = TTFont(io.BytesIO(fetch(re.search(r"url\((https://[^)]+)\)", body).group(1))))
        for table in ("GSUB", "GPOS"):
            if table in served and served[table].table.FeatureList:
                tags.update(r.FeatureTag for r in served[table].table.FeatureList.FeatureRecord)
    assert tags, "no layout features found in served files"
    return sorted(tags)


def build(out, repo_path, query):
    font = TTFont(io.BytesIO(fetch(f"{GF_REPO}/{repo_path}")))
    if "fvar" in font:
        pins = {a.axisTag: AXIS_DEFAULTS[a.axisTag] for a in font["fvar"].axes if a.axisTag != "wght"}
        if pins:
            font = instancer.instantiateVariableFont(font, pins)
            buf = io.BytesIO()
            font.save(buf)
            font = TTFont(io.BytesIO(buf.getvalue()), lazy=False)
    css = fetch(CSS_API.format(query), UA).decode()
    opts = subset.Options()
    opts.layout_features = features_from_served_files(css)
    opts.name_IDs = ["*"]
    opts.notdef_outline = True
    opts.hinting = False
    opts.flavor = "woff2"
    s = subset.Subsetter(opts)
    s.populate(unicodes=unicodes_from_css(css))
    s.subset(font)
    rename(font, out)
    font.flavor = "woff2"
    font.save(os.path.join(HERE, out))
    print(f"{out}: {os.path.getsize(os.path.join(HERE, out)) // 1024} KB")


if __name__ == "__main__":
    for out, (path, query) in FONTS.items():
        build(out, path, query)
