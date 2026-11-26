#!/usr/bin/env python3
"""
Build the Subsidy Math Excel workbook: public/subsidy-math/subsidy-math-model.xlsx

Regenerate everything (build -> verify -> fixtures) with one command from the repo root:

    python3 scripts/subsidy-math/build_model.py && python3 scripts/subsidy-math/verify_model.py && python3 scripts/subsidy-math/model_ref.py --fixtures

Nothing numeric is hard-coded here. The builder reads:
  src/lib/subsidy-math/params.json    REQUIRED. Every assumption with low / base / high / basis / note.
  src/lib/subsidy-math/model.ts       Constants LIST, INFRA_SPLIT, INCENTIVE_LEVELS (parsed by model_ref.py).
  src/lib/subsidy-math/sources.json   OPTIONAL. A JSON list (or {"sources": [...]}) of
        {"id": "S1", "claim": "CSP channel fees as % of CSP-marketplace revenue", "value": 0.157,
         "period": "FY2025", "source": "Anthropic S-1/A", "url": "https://...",
         "location": "p. F-22", "basis": "D|R|A|C", "confidence": "high|medium|low"}
        `value` may be a number (fractions for percentages) or text. Rendered on the Sources sheet.
  src/lib/subsidy-math/earnings.json  OPTIONAL. Quarterly series per company:
        {"_meta": {"quarters": ["Q3 2024", ...], "asOf": "...", "note": "calendar vs fiscal mapping"},
         "series": [
          {"company": "Amazon", "metric": "AWS segment revenue", "unit": "$m",
           "values": {"Q3 2024": 27452, "Q4 2024": 28786, "Q1 2025": 29267},
           "source": "Amazon Form 10-Q", "url": "https://...", "basis": "D|R|A|C", "note": "optional"}
        ]}
        Quarter keys look like "Q<1-4> <YYYY>". Column order = _meta.quarters (any other quarters found
        in the series are appended chronologically). Values are numbers in `unit` (unit "%" = percent
        points, e.g. 38.1); null / missing quarters stay blank. The sheet adds live year-over-year
        formulas: growth % for amounts, change in points for "%" series.

It writes public/subsidy-math/subsidy-math-model.xlsx. Every calculated cell is a live formula;
the only hard-coded numbers are inputs (blue): Low / Base / High on Assumptions, the incentive
levels on Subsidy_Grid (from model.ts INCENTIVE_LEVELS) and the Earnings / Sources data. After
saving, the file is recalculated once with LibreOffice headless and the computed values are
written back into it as cached values, so viewers that do not calculate still show numbers
(Excel recalculates on open regardless: fullCalcOnLoad is set). --no-recalc skips that step.

verify_model.py imports this module (build_book) to learn where every output lives.
"""
from __future__ import annotations

import argparse
import datetime as _dt
import html
import json
import os
import re
import shutil
import subprocess
import sys
import tempfile
import zipfile
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
import model_ref as M  # noqa: E402

from openpyxl import Workbook, load_workbook  # noqa: E402
from openpyxl.chart import BarChart, Reference  # noqa: E402
from openpyxl.chart.series import SeriesLabel  # noqa: E402
from openpyxl.styles import Alignment, Border, Font, PatternFill, Side  # noqa: E402
from openpyxl.utils import get_column_letter as CL  # noqa: E402
from openpyxl.workbook.defined_name import DefinedName  # noqa: E402
from openpyxl.worksheet.datavalidation import DataValidation  # noqa: E402

ROOT = M.ROOT
OUT_XLSX = ROOT / "public" / "subsidy-math" / "subsidy-math-model.xlsx"
SOURCES_JSON = M.LIB / "sources.json"
EARNINGS_JSON = M.LIB / "earnings.json"
REGEN_CMD = ("python3 scripts/subsidy-math/build_model.py && python3 scripts/subsidy-math/verify_model.py "
             "&& python3 scripts/subsidy-math/model_ref.py --fixtures")

SHEETS = ["README", "Assumptions", "Waterfall_Y1", "Subsidy_Grid", "Lifetime", "OneTime_vs_Recurring",
          "Adjacency", "Equity", "Sensitivity", "Earnings", "Sources"]

# ---------------------------------------------------------------------------------------
# Styling
# ---------------------------------------------------------------------------------------
FONT = "Arial"
BLUE, BLACK, GREEN, GREY, WHITE = "0000FF", "000000", "008000", "808080", "FFFFFF"
FILL_YELLOW = PatternFill("solid", fgColor="FFFF00")
FILL_HEAD = PatternFill("solid", fgColor="1F3864")
FILL_SECTION = PatternFill("solid", fgColor="D9E1F2")
FILL_BAND = PatternFill("solid", fgColor="F2F2F2")
FILL_KEY = PatternFill("solid", fgColor="E2EFDA")
FILL_SWAP = PatternFill("solid", fgColor="FCE4D6")
THIN = Side(style="thin", color="BFBFBF")
BOTTOM = Border(bottom=THIN)

F_USD = '$#,##0.0;[Red]($#,##0.0);"-"'
F_USD2 = '$#,##0.00;[Red]($#,##0.00);"-"'
F_SLOPE = '0.000;[Red]-0.000;"-"'
F_PCT = '0.0%;[Red]-0.0%;"-"'
F_PCT_IN = "0.0%"
F_X = '0.00"x";[Red]-0.00"x";"-"'
F_MULT_IN = '0.0"x"'
F_RATIO = "0.00"
F_MO = '0.0;[Red]-0.0;"0.0"'
F_INT = "0"
F_FACTOR = "0.0000"
F_NUM = "#,##0.0"

KIND_COLOR = {"input": BLUE, "formula": BLACK, "link": GREEN, "label": BLACK, "muted": GREY, "head": WHITE}


def put(ws, row, col, value, kind=None, fmt=None, bold=False, italic=False, fill=None, wrap=False,
        size=10, halign=None, color=None, valign=None):
    if kind == "label" and isinstance(value, str) and value.startswith("="):
        raise ValueError(f"text cell {ws.title}!{CL(col)}{row} would be stored as a formula: {value!r}")
    c = ws.cell(row=row, column=col, value=value)
    if kind is None:
        if isinstance(value, str) and value.startswith("="):
            kind = "formula"
        elif isinstance(value, (int, float)) and not isinstance(value, bool):
            kind = "input"
        else:
            kind = "label"
    c.font = Font(name=FONT, size=size, bold=bold or kind == "head", italic=italic, color=color or KIND_COLOR[kind])
    if kind == "head":
        c.fill = FILL_HEAD
    if fill is not None:
        c.fill = fill
    if fmt:
        c.number_format = fmt
    if wrap or halign or valign:
        c.alignment = Alignment(wrap_text=wrap, horizontal=halign, vertical=valign or ("top" if wrap else None))
    return c


def title(ws, text, sub=None, sub2=None):
    put(ws, 1, 2, text, bold=True, size=14)
    if sub:
        put(ws, 2, 2, sub, italic=True, color=GREY)
    if sub2:
        put(ws, 3, 2, sub2, italic=True, color=GREY)


def header(ws, row, col, labels, wrap=True):
    for j, lab in enumerate(labels):
        put(ws, row, col + j, lab, kind="head", wrap=wrap, halign="center" if j else None, valign="center")


def section(ws, row, col_from, col_to, text):
    for c in range(col_from, col_to + 1):
        ws.cell(row=row, column=c).fill = FILL_SECTION
    put(ws, row, col_from, text, bold=True, fill=FILL_SECTION)


def widths(ws, spec):
    for col, w in spec.items():
        ws.column_dimensions[col].width = w


def absref(coord):
    m = re.match(r"([A-Z]+)(\d+)$", coord)
    return f"${m.group(1)}${m.group(2)}"


# ---------------------------------------------------------------------------------------
# Parameter metadata (labels/units/format only; values always come from params.json)
# ---------------------------------------------------------------------------------------
PARAM_META = {
    # route
    "customerDiscount": ("Negotiated recurring customer discount off list", "% of list", F_PCT_IN, "Customer discount"),
    "discountFundedByProvider": ("Share of that discount funded by the model provider", "% of discount", F_PCT_IN, "Discount funded by provider"),
    "channelFee": ("Channel (distribution) fee the cloud keeps", "% of provider revenue", F_PCT_IN, "Channel fee"),
    "providerServingCost": ("Provider serving compute", "% of provider revenue", F_PCT_IN, "Provider serving cost"),
    "hostedShare": ("Share of that serving compute hosted on this cloud", "% of serving compute", F_PCT_IN, "Hosted share"),
    "incrementalComputeShare": ("Share of hosted compute that is incremental to the provider's take-or-pay commitment", "% of hosted compute", F_PCT_IN, "Incremental compute share"),
    "computeMargin": ("Cloud margin on AI compute sold to the provider", "% of compute revenue", F_PCT_IN, "Compute margin"),
    "revenueShare": ("Revenue share paid to the model owner", "% of cloud net revenue", F_PCT_IN, "Revenue share"),
    "infraCost": ("Serving infrastructure cost at base utilization", "% of list", F_PCT_IN, "Infra cost"),
    "utilization": ("Achieved serving utilization", "%", F_PCT_IN, "Utilization"),
    "baseUtilization": ("Utilization embedded in the infra cost", "%", F_PCT_IN, "Base utilization"),
    "modelDevCost": ("Model development amortization (economic view only)", "% of cloud net revenue", F_PCT_IN, "Model development cost"),
    "distributionCost": ("Distribution cost: platform, support, account team", "% of list", F_PCT_IN, "Distribution cost"),
    # incentive
    "pct": ("Incentive size (credits)", "% of list spend", F_PCT_IN, "Incentive %"),
    "partnerFunded": ("Share of the incentive funded by a partner (SI / reseller)", "% of incentive", F_PCT_IN, "Partner-funded share"),
    "providerFunded": ("Share of the incentive funded by the model provider", "% of incentive", F_PCT_IN, "Provider-funded share"),
    # lifetime
    "years": ("Customer lifetime modelled (horizon)", "years (1-5)", F_INT, "Lifetime years"),
    "growth": ("Annual growth in list-price AI spend", "% per year", F_PCT_IN, "Spend growth"),
    "retention": ("Annual retention of the workload", "% per year", F_PCT_IN, "Retention"),
    "priceDeflation": ("Annual list-price deflation per unit of capability", "% per year", F_PCT_IN, "Price deflation"),
    "efficiencyGain": ("Annual fall in serving cost per unit", "% per year", F_PCT_IN, "Efficiency gain"),
    "channelFeeDrift": ("Annual change in the channel fee (agent routes)", "points per year", F_PCT_IN, "Channel-fee drift"),
    "adjacencyAttach": ("Adjacent non-AI cloud revenue per $1 of AI spend", "$ per $1 of AI", F_RATIO, "Adjacency attach"),
    "adjacencyIncremental": ("Share of adjacent revenue that is genuinely incremental", "%", F_PCT_IN, "Adjacency incremental share"),
    "adjacencyMargin": ("Gross margin on adjacent cloud services", "%", F_PCT_IN, "Adjacency margin"),
    "commitAdjacencyUplift": ("Committed adjacent revenue per $1 of AI spend (commit type, during the term)", "$ per $1 of AI", F_RATIO, "Commit adjacency uplift"),
    "commitYears": ("Commit term (retention 100% inside it)", "years", F_INT, "Commit years"),
    "baselineShare": ("Pre-existing spend excluded from consumption credits", "% of year-1 spend", F_PCT_IN, "Baseline share"),
    "consumptionYears": ("Years in which spend growth earns consumption credits", "years", F_INT, "Consumption-credit years"),
    "discountRate": ("Discount rate for NPV", "% per year", F_PCT_IN, "Discount rate"),
    "includeAdjacency": ("Include adjacent non-AI gross profit (1 = yes, 0 = no)", "flag", F_INT, "Include adjacency"),
    # equity
    "stake": ("Cloud's economic stake in the model provider", "%", F_PCT_IN, "Equity stake"),
    "revenueMultiple": ("Provider equity value per $1 of annual revenue", "x revenue", F_MULT_IN, "Revenue multiple"),
    "incrementalToProvider": ("Share of subsidized consumption that is new revenue for the provider", "%", F_PCT_IN, "Incremental to provider"),
}
AGENT_USED = {"customerDiscount", "discountFundedByProvider", "channelFee", "providerServingCost", "hostedShare",
              "incrementalComputeShare", "computeMargin", "distributionCost"}
PRINCIPAL_USED = {"customerDiscount", "revenueShare", "infraCost", "utilization", "baseUtilization",
                  "modelDevCost", "distributionCost"}
ROUTE_SYM = {"d": "customerDiscount", "phi": "discountFundedByProvider", "f": "channelFee", "sigma": "providerServingCost",
             "h": "hostedShare", "i": "incrementalComputeShare", "mc": "computeMargin", "rho": "revenueShare",
             "kappa": "infraCost", "u": "utilization", "u0": "baseUtilization", "dev": "modelDevCost", "k": "distributionCost"}
INC_SYM = {"c": "pct", "pp": "partnerFunded", "pm": "providerFunded"}
LT_SYM = {"g": "growth", "ret": "retention", "p": "priceDeflation", "e": "efficiencyGain", "drift": "channelFeeDrift",
          "att": "adjacencyAttach", "inc": "adjacencyIncremental", "am": "adjacencyMargin", "upl": "commitAdjacencyUplift",
          "cy": "commitYears", "base": "baselineShare", "cyc": "consumptionYears", "w": "discountRate", "incadj": "includeAdjacency"}
SYM_GROUP = {**{s: ("route", k) for s, k in ROUTE_SYM.items()}, **{s: ("incentive", k) for s, k in INC_SYM.items()},
             **{s: ("lifetime", k) for s, k in LT_SYM.items()}}
TYPE_LABEL = {"one-time": "One-time", "recurring": "Recurring", "consumption": "Consumption", "commit": "Commit"}


def meta(key):
    return PARAM_META.get(key, (key, "", F_RATIO, key))


def _site_labels():
    """Tornado labels used by the microsite (src/lib/subsidy-math/sensitivity.ts LABELS), if present."""
    path = M.LIB / "sensitivity.ts"
    if not path.exists():
        return {}
    m = re.search(r"const LABELS[^=]*=\s*\{(.*?)\};", path.read_text(encoding="utf-8"), re.S)
    return dict(re.findall(r'(\w+)\s*:\s*"([^"]*)"', m.group(1))) if m else {}


SITE_LABELS = _site_labels()


def tornado_label(key):
    return SITE_LABELS.get(key) or meta(key)[3]


def route_prefix(rid):
    s = re.sub(r"[^A-Za-z0-9_]", "_", rid)
    return s if re.match(r"[A-Za-z_]", s) else f"r_{s}"


def rn(rid, key):
    return f"{route_prefix(rid)}_{key}"


def lt_name(key):
    return f"LT_{key}"


INC_NAME = {"pct": "Inc_pct", "partnerFunded": "Inc_partnerFunded", "providerFunded": "Inc_providerFunded"}


def name_refs(rid):
    """Symbol -> defined name, for the closed-form generators."""
    R = {s: rn(rid, k) for s, k in ROUTE_SYM.items()}
    R.update({s: INC_NAME[k] for s, k in INC_SYM.items()})
    R.update({s: lt_name(k) for s, k in LT_SYM.items()})
    R["L"] = "ListPrice"
    R["type"] = "Inc_type"
    return R


# ---------------------------------------------------------------------------------------
# Closed-form generators (equivalent to model.ts, see model_ref.py)
# ---------------------------------------------------------------------------------------
def m0_expr(st, R, ks="1", fee=None):
    """Cloud contribution at 0% incentive for one year (costScale ks, channel fee `fee`)."""
    L = R["L"]
    kp = "" if ks == "1" else f"*{ks}"
    if st == "agent":
        fee = fee or f"MAX(0,{R['f']})"
        r0 = f"({L}-{R['phi']}*{R['d']}*{L})"
        return (f"{fee}*{r0}-(1-{R['phi']})*{R['d']}*{L}-{R['k']}*{L}"
                f"+{R['sigma']}{kp}*{r0}*{R['h']}*{R['i']}*{R['mc']}")
    return f"(1-{R['rho']})*({L}-{R['d']}*{L})-{R['kappa']}{kp}*({R['u0']}/{R['u']})*{L}-{R['k']}*{L}"


def slope_expr(st, R, ks="1", fee=None):
    """Cost to the cloud per $1 of incentive credit (contribution is linear in the incentive)."""
    s = f"(1-{R['pp']}-{R['pm']})"
    kp = "" if ks == "1" else f"*{ks}"
    if st == "agent":
        fee = fee or f"MAX(0,{R['f']})"
        return f"{fee}*{R['pm']}+{s}+{R['sigma']}{kp}*{R['pm']}*{R['h']}*{R['i']}*{R['mc']}"
    return f"(1-{R['rho']})*{s}"


def year_contrib_expr(st, R, t, spend, prev):
    """Year-t lifetime contribution (gross - incentive cost + adjacency) as one expression."""
    if t == 1:
        ks, fee = "1", f"MAX(0,{R['f']})"
    else:
        ks = f"((1-{R['e']})/(1-{R['p']}))^{t - 1}"
        fee = f"MAX(0,{R['f']}+{R['drift']}*{t - 1})"
    m0 = m0_expr(st, R, ks, fee)
    sl = slope_expr(st, R, ks, fee)
    T = R["type"]
    first = f"{R['c']}*{spend}" if t == 1 else "0"
    cb = (f'IF(OR({T}="one-time",{T}="commit"),{first},IF({T}="recurring",{R["c"]}*{spend},'
          f'IF({t}<={R["cyc"]},{R["c"]}*MAX(0,{spend}-{prev}),0)))')
    adj = (f'IF({R["incadj"]}=1,{spend}*({R["att"]}*{R["inc"]}+IF(AND({T}="commit",{t}<={R["cy"]}),{R["upl"]},0))'
           f'*{R["am"]},0)')
    return f"({m0})*{spend}/{R['L']}-({sl})*{cb}+{adj}"


# ---------------------------------------------------------------------------------------
# The workbook
# ---------------------------------------------------------------------------------------
class Book:
    def __init__(self, raw, sources=None, earnings=None, built=None):
        self.raw = raw
        self.sources = sources
        self.earnings = earnings
        self.built = built or _dt.date.today().isoformat()
        self.routes = list(raw["routes"].keys())
        self.st = {rid: raw["routes"][rid]["structure"] for rid in self.routes}
        self.short = {rid: raw["routes"][rid].get("short", rid) for rid in self.routes}
        self.label = {rid: raw["routes"][rid].get("label", rid) for rid in self.routes}
        self.wb = Workbook()
        self.wb.remove(self.wb.active)
        self.ws = {n: self.wb.create_sheet(n) for n in SHEETS}
        self.cells = {}    # verification key -> "Sheet!A1"
        self.inputs = {}   # input key -> "Assumptions!G12" (the "Your value" cell)
        self.lowhigh = {}  # input key -> ("Assumptions!$D$12", "Assumptions!$F$12")
        self.active = {}   # input key -> defined name of the Active cell
        self.names = {}

    # -- registry ----------------------------------------------------------------------
    def reg(self, key, ws, row, col):
        self.cells[key] = f"{ws.title}!{CL(col)}{row}"

    def define(self, name, ws, coord):
        if name.lower() in {n.lower() for n in self.names}:
            raise SystemExit(f"duplicate defined name {name}")
        ref = f"{ws.title}!{absref(coord)}"
        self.names[name] = ref
        self.wb.defined_names[name] = DefinedName(name, attr_text=ref)

    def build(self):
        self.build_assumptions()
        self.build_waterfall()
        self.build_lifetime()
        self.build_grid()
        self.build_otr()
        self.build_adjacency()
        self.build_equity()
        self.build_sensitivity()
        self.build_earnings()
        self.build_sources()
        self.build_readme()
        for ws in self.wb.worksheets:
            ws.page_setup.orientation = "landscape"
            ws.page_setup.fitToWidth = 1
            ws.page_setup.fitToHeight = 0
            ws.sheet_properties.pageSetUpPr.fitToPage = True
        self.wb.active = 0
        self.wb.calculation.fullCalcOnLoad = True
        return self

    # -- Assumptions ---------------------------------------------------------------------
    def _param_row(self, ws, r, group_label, key, pm, name, input_key, used=True, desc=None, dv=None):
        label, unit, fmt, _ = meta(key)
        muted = not used
        vk = "muted" if muted else "input"
        put(ws, r, 1, group_label, kind="muted" if muted else "label")
        put(ws, r, 2, key, kind="muted" if muted else "label")
        put(ws, r, 3, desc or label, kind="muted" if muted else "label", wrap=True)
        for j, pick in enumerate(("low", "base", "high")):
            put(ws, r, 4 + j, pm.get(pick), kind=vk, fmt=fmt)
        put(ws, r, 7, None, kind="input", fmt=fmt, fill=FILL_YELLOW if used else None)
        put(ws, r, 8, f'=IF(G{r}="",E{r},G{r})', fmt=fmt, bold=used, kind="muted" if muted else "formula")
        put(ws, r, 9, unit, kind="muted" if muted else "label")
        put(ws, r, 10, pm.get("basis", ""), kind="muted" if muted else "label", halign="center")
        put(ws, r, 11, pm.get("note", "") + ("" if used else "  [not used by this route's structure]"),
            kind="muted" if muted else "label", wrap=True)
        put(ws, r, 12, name, kind="muted")
        self.define(name, ws, f"H{r}")
        self.inputs[input_key] = f"{ws.title}!G{r}"
        self.lowhigh[input_key] = (f"{ws.title}!$D${r}", f"{ws.title}!$F${r}")
        self.active[input_key] = name
        if dv is not None:
            dv.add(f"G{r}")

    def build_assumptions(self):
        ws = self.ws["Assumptions"]
        raw = self.raw
        widths(ws, {"A": 16, "B": 24, "C": 46, "D": 10, "E": 10, "F": 10, "G": 12, "H": 11, "I": 19, "J": 7, "K": 95, "L": 36})
        title(ws, "Assumptions — every input in the model",
              "Type your own value in the yellow 'Your value' cells (column G); leave blank to use Base. "
              "'Active' (column H) = Your value if entered, else Base — every other sheet reads Active.",
              f"Low / Base / High and notes are generated from params.json ({raw.get('_meta', {}).get('version', '')}, "
              f"as of {raw.get('_meta', {}).get('asOf', '')}). Percentages are fractions: 0.35 = 35%. "
              "Grey rows are not used by that route's transaction structure.")
        header(ws, 5, 1, ["Group", "Parameter", "Description", "Low", "Base", "High", "Your value", "Active",
                          "Unit", "Basis", "Note / source", "Name used in formulas"])
        ws.freeze_panes = "C6"
        dv_type = DataValidation(type="list", formula1='"one-time,recurring,consumption,commit"', allow_blank=True,
                                 showErrorMessage=True, errorTitle="Incentive type",
                                 error="Choose one-time, recurring, consumption or commit.")
        dv_years = DataValidation(type="whole", operator="between", formula1="1", formula2="5", allow_blank=True,
                                  showErrorMessage=True, errorTitle="Lifetime years", error="Whole number from 1 to 5.")
        dv_flag = DataValidation(type="whole", operator="between", formula1="0", formula2="1", allow_blank=True,
                                 showErrorMessage=True, errorTitle="Flag", error="Enter 1 (include) or 0 (exclude).")
        for dv in (dv_type, dv_years, dv_flag):
            ws.add_data_validation(dv)

        r = 6
        section(ws, r, 1, 12, "GLOBAL SELECTORS — drive every sheet")
        r += 1
        # Incentive type (text selector)
        put(ws, r, 1, "Selector")
        put(ws, r, 2, "type")
        put(ws, r, 3, "Incentive type", wrap=True)
        put(ws, r, 5, M.DEFAULT_INCENTIVE_TYPE, kind="input", halign="right")
        put(ws, r, 7, None, kind="input", fill=FILL_YELLOW)
        put(ws, r, 8, f'=IF(G{r}="",E{r},G{r})', bold=True, halign="right")
        put(ws, r, 9, "drop-down")
        put(ws, r, 10, "A", halign="center")
        put(ws, r, 11, "one-time = credit on year-1 spend only; recurring = credit on every year's spend; consumption = "
                       "credit on growth in spend over the prior year (MAP-style, for the consumption-credit years); "
                       "commit = year-1 credit tied to a commitment (100% retention and adjacency uplift during the term). "
                       "Default one-time, as in params.ts. Drives the 'selected type' views (Lifetime, Sensitivity NPV).",
            wrap=True)
        put(ws, r, 12, "Inc_type", kind="muted")
        self.define("Inc_type", ws, f"H{r}")
        self.inputs["incentive|type"] = f"Assumptions!G{r}"
        dv_type.add(f"G{r}")
        r += 1
        inc = raw["incentive"]
        for key in M.INCENTIVE_KEYS:
            self._param_row(ws, r, "Selector", key, inc[key], INC_NAME[key], f"incentive|{key}")
            r += 1
        # derived cloud share
        put(ws, r, 1, "Selector")
        put(ws, r, 2, "cloudFunded")
        put(ws, r, 3, "Share of the incentive the cloud funds (derived)")
        pp_r, pm_r = r - 2, r - 1
        put(ws, r, 8, f"=1-H{pp_r}-H{pm_r}", fmt=F_PCT_IN, bold=True)
        put(ws, r, 9, "% of incentive")
        put(ws, r, 10, "C", halign="center")
        put(ws, r, 11, "1 − partner-funded − provider-funded (model.ts cloudShare).", wrap=True)
        put(ws, r, 12, "Inc_cloudFunded", kind="muted")
        self.define("Inc_cloudFunded", ws, f"H{r}")
        self.reg("active|incentive|cloudFunded", ws, r, 8)
        r += 1
        lt = raw["lifetime"]
        self._param_row(ws, r, "Selector", "years", lt["years"], lt_name("years"), "lifetime|years", dv=dv_years)
        r += 1
        self._param_row(ws, r, "Selector", "includeAdjacency", lt["includeAdjacency"], lt_name("includeAdjacency"),
                        "lifetime|includeAdjacency", dv=dv_flag)
        r += 2

        for rid in self.routes:
            rr = raw["routes"][rid]
            st = self.st[rid]
            used = AGENT_USED if st == "agent" else PRINCIPAL_USED
            desc = ("agent structure: the model provider is principal and sets price; the cloud keeps a channel fee"
                    if st == "agent" else
                    "principal structure: the cloud books the revenue, pays serving infrastructure and any revenue share")
            section(ws, r, 1, 12, f"ROUTE — {self.label[rid]} — {desc}")
            r += 1
            for key in M.ROUTE_PARAM_KEYS:
                self._param_row(ws, r, self.short[rid], key, rr["params"][key], rn(rid, key), f"route|{rid}|{key}",
                                used=key in used)
                r += 1
            extra = [k for k in rr["params"] if k not in M.ROUTE_PARAM_KEYS]
            for key in extra:  # future params.json keys model.ts does not know yet
                self._param_row(ws, r, self.short[rid], key, rr["params"][key], rn(rid, key), f"route|{rid}|{key}", used=False)
                r += 1
            r += 1

        section(ws, r, 1, 12, "LIFETIME — the multi-year engine (Lifetime, Subsidy_Grid, OneTime_vs_Recurring, Adjacency)")
        r += 1
        for key in lt:
            if key in ("years", "includeAdjacency"):
                continue
            self._param_row(ws, r, "Lifetime", key, lt[key], lt_name(key), f"lifetime|{key}", used=key in M.LIFETIME_KEYS)
            r += 1
        r += 1
        section(ws, r, 1, 12, "EQUITY — strategic value of a stake in the model provider (Equity sheet)")
        r += 1
        for key in raw["equity"]:
            self._param_row(ws, r, "Equity", key, raw["equity"][key], f"EQ_{key}", f"equity|{key}", used=key in M.EQUITY_KEYS)
            r += 1
        r += 1
        section(ws, r, 1, 12, "MODEL CONSTANTS — fixed in src/lib/subsidy-math/model.ts (not editable here)")
        r += 1
        consts = [("LIST", "List price of the unit of analysis", M.LIST, "$ of list", "ListPrice", F_USD),
                  *[(f"INFRA_SPLIT.{k}", f"Share of serving infrastructure cost: {k}", v, "% of infra", f"Infra_{k}", F_PCT_IN)
                    for k, v in M.INFRA_SPLIT.items()]]
        for key, desc, v, unit, nm, fmt in consts:
            put(ws, r, 1, "Constant")
            put(ws, r, 2, key)
            put(ws, r, 3, desc)
            put(ws, r, 5, v, kind="input", fmt=fmt)
            put(ws, r, 8, f"=E{r}", fmt=fmt, bold=True)
            put(ws, r, 9, unit)
            put(ws, r, 10, "A", halign="center")
            put(ws, r, 11, "Parsed from model.ts at build time; change it there and rebuild.", wrap=True)
            put(ws, r, 12, nm, kind="muted")
            self.define(nm, ws, f"H{r}")
            r += 1
        r += 1
        put(ws, r, 2, "Basis: D = disclosed in a filing · R = reported estimate · A = our assumption · C = our calculation on disclosed figures.",
            italic=True, color=GREY)
        # register Active cells for verification
        for k, nm in self.active.items():
            sheet, coord = self.names[nm].split("!")
            self.cells[f"active|{k}"] = f"{sheet}!{coord.replace('$', '')}"

    # -- Waterfall_Y1 --------------------------------------------------------------------
    WF_ROWS = [
        ("_sec", "REVENUE — who pays whom"),
        ("list", "List price (rate card)", F_USD, False),
        ("discountProvider", "Negotiated discount funded by the model provider", F_USD, False),
        ("discountCloud", "Negotiated discount funded by the cloud", F_USD, False),
        ("creditsCloud", "Incentive credits funded by the cloud", F_USD, False),
        ("creditsProvider", "Incentive credits funded by the model provider", F_USD, False),
        ("creditsPartner", "Incentive credits funded by a partner", F_USD, False),
        ("customerPays", "Customer pays", F_USD, True),
        ("providerRevenue", "Model provider revenue", F_USD, False),
        ("channelFeeRate", "Channel fee rate (agent routes)", F_PCT, False),
        ("channelFeePaid", "Channel fee kept by the cloud (agent routes)", F_USD, False),
        ("revenueSharePaid", "Revenue share paid to the model owner (principal routes)", F_USD, False),
        ("cloudNetRevenue", "Cloud net revenue", F_USD, True),
        ("_sec", "CLOUD COSTS"),
        ("infra", "Serving infrastructure (principal routes)", F_USD, False),
        ("infraDepreciation", "   of which depreciation", F_USD, False),
        ("infraPower", "   of which power", F_USD, False),
        ("infraNetwork", "   of which network & data centre", F_USD, False),
        ("distribution", "Distribution cost (platform, support, account team)", F_USD, False),
        ("providerServing", "Provider serving compute (agent routes; the provider's cost)", F_USD, False),
        ("computeContribution", "Cloud margin on incremental compute sold to the provider", F_USD, False),
        ("_sec", "CONTRIBUTION"),
        ("cloudContribution", "Cloud contribution", F_USD, True),
        ("contributionPct", "Cloud contribution, % of cloud net revenue", F_PCT, False),
        ("modelDev", "Model development charge (economic view, principal routes)", F_USD, False),
        ("cloudEconomic", "Cloud economic contribution", F_USD, True),
        ("providerContribution", "Model provider contribution (before R&D)", F_USD, False),
        ("_sec", "BREAK-EVEN INCENTIVE (contribution is linear in the incentive)"),
        ("m0", "Cloud contribution at 0% incentive (M0)", F_USD, False),
        ("slope", "Cost to the cloud per $1 of incentive", F_SLOPE, False),
        ("breakEven", "Break-even incentive: contribution = 0 (% of list)", F_PCT, True),
        ("m0Economic", "Economic contribution at 0% incentive", F_USD, False),
        ("slopeEconomic", "Economic cost per $1 of incentive", F_SLOPE, False),
        ("breakEvenEconomic", "Break-even incentive: economic contribution = 0", F_PCT, True),
        ("check", "Check: M0 − cost per $1 × incentive × 100 − contribution (should be 0)", F_USD2, False),
    ]
    WF_DESC = {
        "list": ("LIST (model.ts)", "LIST (model.ts)"),
        "discountProvider": ("discount × provider-funded share × list", "0 — the cloud is principal"),
        "discountCloud": ("discount × (1 − provider-funded share) × list", "discount × list"),
        "creditsCloud": ("incentive % × cloud-funded share × list", "incentive % × cloud-funded share × list"),
        "creditsProvider": ("incentive % × provider-funded share × list", "incentive % × provider-funded share × list"),
        "creditsPartner": ("incentive % × partner-funded share × list", "incentive % × partner-funded share × list"),
        "customerPays": ("list − discount − incentive", "list − discount − incentive"),
        "providerRevenue": ("list − provider-funded discount − provider-funded credits", "revenue share − provider-funded credits"),
        "channelFeeRate": ("MAX(0, channel fee)", "n/a"),
        "channelFeePaid": ("fee rate × provider revenue", "n/a"),
        "revenueSharePaid": ("n/a", "revenue share × cloud net revenue"),
        "cloudNetRevenue": ("channel fee − cloud-funded discount − cloud-funded credits", "list − discount − cloud-funded credits"),
        "infra": ("n/a — the provider bears serving cost", "infra cost × (base utilization ÷ utilization) × list"),
        "infraDepreciation": ("n/a", "infra × INFRA_SPLIT.depreciation"),
        "infraPower": ("n/a", "infra × INFRA_SPLIT.power"),
        "infraNetwork": ("n/a", "infra × INFRA_SPLIT.network"),
        "distribution": ("distribution cost × list", "distribution cost × list"),
        "providerServing": ("provider serving cost × provider revenue", "n/a"),
        "computeContribution": ("serving compute × hosted share × incremental share × compute margin", "n/a"),
        "cloudContribution": ("net revenue − distribution + compute margin", "net revenue − revenue share − infra − distribution"),
        "contributionPct": ("contribution ÷ net revenue (n/a if net revenue ≤ 0)", "contribution ÷ net revenue"),
        "modelDev": ("n/a — the provider bears model development", "model dev cost × pre-incentive net revenue (list − discount)"),
        "cloudEconomic": ("same as contribution", "contribution − model development"),
        "providerContribution": ("provider revenue − channel fee − serving compute", "revenue share − provider-funded credits"),
        "m0": ("fee×(L−φdL) − (1−φ)dL − kL + σ(L−φdL)·h·i·m", "(1−ρ)(L−dL) − κ(u0/u)L − kL"),
        "slope": ("fee·π_provider + cloud share + σ·π_provider·h·i·m", "(1−ρ) × cloud share"),
        "breakEven": ("M0 ÷ (cost per $1 × 100); 0 if M0 ≤ 0", "M0 ÷ (cost per $1 × 100); 0 if M0 ≤ 0"),
        "m0Economic": ("same as M0", "M0 − model development"),
        "slopeEconomic": ("same as cost per $1", "same as cost per $1 (model development is fixed per $ of pre-incentive revenue)"),
        "breakEvenEconomic": ("economic M0 ÷ (economic cost per $1 × 100)", "economic M0 ÷ (economic cost per $1 × 100)"),
        "check": ("closed form vs the waterfall above", "closed form vs the waterfall above"),
    }

    def build_waterfall(self):
        ws = self.ws["Waterfall_Y1"]
        widths(ws, {"A": 2, "B": 62, "C": 15, "D": 15, "E": 15, "F": 15, "G": 2, "H": 55, "I": 55})
        title(ws, "Year-1 waterfall — $100 of list-price inference, four routes side by side",
              "$ per $100 of list at the Active incentive on Assumptions (credits are contra-revenue). "
              "Agent routes: the model provider is principal; principal routes: the cloud is.",
              "Discounts, credits and costs are shown as positive amounts and deducted in the totals; a dash means not applicable.")
        header(ws, 4, 2, ["Line item ($ per $100 of list)"] + [self.short[r] for r in self.routes] + ["", "How it is computed — agent route", "How it is computed — principal route"])
        ws.cell(row=4, column=7).fill = PatternFill(fill_type=None)
        ws.freeze_panes = "C5"
        put(ws, 5, 2, "Transaction structure")
        put(ws, 6, 2, "Incentive (credits), % of list")
        put(ws, 7, 2, "Cloud-funded share of the incentive")
        self.wf_col = {}
        self.wf_row = {}
        r = 8
        for spec in self.WF_ROWS:
            if spec[0] == "_sec":
                section(ws, r, 2, 9, spec[1])
                r += 1
                continue
            self.wf_row[spec[0]] = r
            lab = spec[1]
            if spec[0] in ("infraDepreciation", "infraPower", "infraNetwork"):
                k = {"infraDepreciation": "depreciation", "infraPower": "power", "infraNetwork": "network"}[spec[0]]
                lab = f"{lab} ({M.INFRA_SPLIT[k]:.0%} of infra, INFRA_SPLIT)"
            put(ws, r, 2, lab, bold=spec[3])
            da, dp = self.WF_DESC.get(spec[0], ("", ""))
            put(ws, r, 8, da, kind="label", color=GREY)
            put(ws, r, 9, dp, kind="label", color=GREY)
            r += 1
        R = self.wf_row
        for j, rid in enumerate(self.routes):
            col = 3 + j
            c = CL(col)
            self.wf_col[rid] = c
            st = self.st[rid]
            n = lambda key, rid=rid: rn(rid, key)  # noqa: E731
            put(ws, 5, col, st, halign="right", italic=True)
            put(ws, 6, col, "=Inc_pct", kind="link", fmt=F_PCT_IN)
            put(ws, 7, col, "=Inc_cloudFunded", kind="link", fmt=F_PCT_IN)
            C = lambda f, c=c: f"{c}{R[f]}"  # noqa: E731
            F = {}
            F["list"] = "=ListPrice"
            F["creditsCloud"] = f"=Inc_cloudFunded*Inc_pct*{C('list')}"
            F["creditsProvider"] = f"=Inc_providerFunded*Inc_pct*{C('list')}"
            F["creditsPartner"] = f"=Inc_partnerFunded*Inc_pct*{C('list')}"
            F["customerPays"] = f"={C('list')}-{n('customerDiscount')}*{C('list')}-Inc_pct*{C('list')}"
            F["distribution"] = f"={n('distributionCost')}*{C('list')}"
            if st == "agent":
                F["discountProvider"] = f"={n('discountFundedByProvider')}*{n('customerDiscount')}*{C('list')}"
                F["discountCloud"] = f"=(1-{n('discountFundedByProvider')})*{n('customerDiscount')}*{C('list')}"
                F["providerRevenue"] = f"={C('list')}-{C('discountProvider')}-{C('creditsProvider')}"
                F["channelFeeRate"] = f"=MAX(0,{n('channelFee')})"
                F["channelFeePaid"] = f"={C('channelFeeRate')}*{C('providerRevenue')}"
                F["revenueSharePaid"] = "=0"
                F["cloudNetRevenue"] = f"={C('channelFeePaid')}-{C('discountCloud')}-{C('creditsCloud')}"
                F["infra"] = "=0"
                F["providerServing"] = f"={n('providerServingCost')}*{C('providerRevenue')}"
                F["computeContribution"] = (f"={C('providerServing')}*{n('hostedShare')}*{n('incrementalComputeShare')}"
                                            f"*{n('computeMargin')}")
                F["cloudContribution"] = f"={C('cloudNetRevenue')}-{C('distribution')}+{C('computeContribution')}"
                F["modelDev"] = "=0"
                F["providerContribution"] = f"={C('providerRevenue')}-{C('channelFeePaid')}-{C('providerServing')}"
            else:
                F["discountProvider"] = "=0"
                F["discountCloud"] = f"={n('customerDiscount')}*{C('list')}"
                F["providerRevenue"] = f"={C('revenueSharePaid')}-{C('creditsProvider')}"
                F["channelFeeRate"] = "=0"
                F["channelFeePaid"] = "=0"
                F["revenueSharePaid"] = f"={n('revenueShare')}*{C('cloudNetRevenue')}"
                F["cloudNetRevenue"] = f"={C('list')}-{C('discountCloud')}-{C('creditsCloud')}"
                F["infra"] = f"={n('infraCost')}*({n('baseUtilization')}/{n('utilization')})*{C('list')}"
                F["providerServing"] = "=0"
                F["computeContribution"] = "=0"
                F["cloudContribution"] = (f"={C('cloudNetRevenue')}-{C('revenueSharePaid')}-{C('infra')}"
                                          f"-{C('distribution')}")
                F["modelDev"] = f"={n('modelDevCost')}*({C('list')}-{C('discountCloud')})"
                F["providerContribution"] = f"={C('revenueSharePaid')}-{C('creditsProvider')}"
            F["infraDepreciation"] = f"={C('infra')}*Infra_depreciation"
            F["infraPower"] = f"={C('infra')}*Infra_power"
            F["infraNetwork"] = f"={C('infra')}*Infra_network"
            F["contributionPct"] = f'=IF({C("cloudNetRevenue")}>0,{C("cloudContribution")}/{C("cloudNetRevenue")},"n/a")'
            F["cloudEconomic"] = f"={C('cloudContribution')}-{C('modelDev')}"
            Rn = name_refs(rid)
            F["m0"] = "=" + m0_expr(st, Rn, "1", C("channelFeeRate"))
            F["slope"] = "=" + slope_expr(st, Rn, "1", C("channelFeeRate"))
            be = lambda m, s: f'=IF({m}<=0,0,IF({s}*ListPrice=0,"unbounded",{m}/({s}*ListPrice)))'  # noqa: E731
            F["breakEven"] = be(C("m0"), C("slope"))
            if st == "agent":
                F["m0Economic"] = f"={C('m0')}"
                F["slopeEconomic"] = f"={C('slope')}"
            else:  # model development is charged on pre-incentive net revenue, so it does not move with the incentive
                F["m0Economic"] = f"={C('m0')}-{C('modelDev')}"
                F["slopeEconomic"] = f"={C('slope')}"
            F["breakEvenEconomic"] = be(C("m0Economic"), C("slopeEconomic"))
            F["check"] = f"={C('m0')}-{C('slope')}*Inc_pct*ListPrice-{C('cloudContribution')}"
            for spec in self.WF_ROWS:
                key = spec[0]
                if key == "_sec":
                    continue
                f = F[key]
                na = f == "=0"
                fill = FILL_KEY if key in ("cloudContribution", "breakEven") else None
                put(ws, R[key], col, f, fmt=spec[2], bold=spec[3], kind="muted" if na else ("link" if key == "list" else "formula"),
                    fill=fill, halign="right")
                self.reg(f"wf|{rid}|{key}", ws, R[key], col)

    # -- Lifetime --------------------------------------------------------------------------
    LT_COLS = ["route", "type", "year", "inH", "inCommit", "survive", "spend", "gross", "prevSpend", "credit", "cost",
               "adj", "contrib", "cum", "df", "disc", "annual", "cumBefore", "hit", "pb", "neg", "hitH", "negH"]
    LT_HEAD = {"route": "Route", "type": "Incentive type", "year": "Year", "inH": "In horizon (1/0)",
               "inCommit": "In commit term (1/0)", "survive": "Survival", "spend": "List spend",
               "gross": "Gross contribution", "prevSpend": "Prior-year spend (consumption base)",
               "credit": "Credit base (customer credit)", "cost": "Incentive cost to cloud", "adj": "Adjacency GP",
               "contrib": "Contribution", "cum": "Cumulative", "df": "Discount factor", "disc": "Discounted",
               "annual": "Annual inflow (gross + adjacency)", "cumBefore": "Cumulative before inflow",
               "hit": "Payback hit (1/0)", "pb": "Payback months if hit", "neg": "Went negative (1/0)",
               "hitH": "Hit within horizon", "negH": "Negative within horizon"}
    LT_FMT = {"inH": F_INT, "inCommit": F_INT, "survive": F_FACTOR, "spend": F_USD, "gross": F_USD, "prevSpend": F_USD,
              "credit": F_USD, "cost": F_USD, "adj": F_USD, "contrib": F_USD, "cum": F_USD, "df": F_FACTOR,
              "disc": F_USD, "annual": F_USD, "cumBefore": F_USD, "hit": F_INT, "pb": F_MO, "neg": F_INT,
              "hitH": F_INT, "negH": F_INT, "year": F_INT}
    LT_FIELD = {"spend": "spend", "gross": "grossContribution", "cost": "incentiveCost", "adj": "adjacency",
                "contrib": "contribution", "cum": "cumulative", "disc": "discounted", "credit": "customerCredit"}

    def build_lifetime(self):
        ws = self.ws["Lifetime"]
        widths(ws, {"A": 2, "B": 18, "C": 14, **{CL(c): 13 for c in range(4, 26)}})
        title(ws, "Lifetime — the customer over 1 to 5 years, every route × incentive type",
              "$ per $100 of year-1 list spend. Year rows always run 1–5; 'In horizon' applies the selected lifetime years. "
              "Incentives are booked at the start of each year; NPV discounts each year at end of year.")
        ws.freeze_panes = "D4"
        r = 5
        section(ws, r, 2, 8, "DRIVERS (linked from Assumptions)")
        r += 1
        drivers = [("Incentive, % of list", "=Inc_pct", F_PCT_IN), ("Incentive type (selected)", "=Inc_type", None),
                   ("Lifetime years (selected horizon)", "=LT_years", F_INT), ("Cloud-funded share", "=Inc_cloudFunded", F_PCT_IN),
                   ("Include adjacency (1/0)", "=LT_includeAdjacency", F_INT), ("Discount rate", "=LT_discountRate", F_PCT_IN),
                   ("Consumption-credit years", "=LT_consumptionYears", F_INT), ("Commit years", "=LT_commitYears", F_INT)]
        for lab, f, fmt in drivers:
            put(ws, r, 2, lab)
            put(ws, r, 4, f, kind="link", fmt=fmt, halign="right")
            r += 1
        put(ws, r, 2, "Serving-cost drift per year")
        put(ws, r, 5, "(1 − efficiency gain) ÷ (1 − price deflation)", kind="label", color=GREY)
        put(ws, r, 4, "=(1-LT_efficiencyGain)/(1-LT_priceDeflation)", fmt=F_FACTOR)
        r += 2

        # Pre-compute layout so summary tables (above) can reference the engine (below).
        types = M.INCENTIVE_TYPES
        n_routes = len(self.routes)
        # each table: section row, header row, data rows, one blank row
        sel_start = r + 2
        all_start = sel_start + n_routes + 3
        hz_start = all_start + n_routes * len(types) + 3
        yd_start = hz_start + n_routes * len(types) + 3
        eng_start = yd_start + n_routes * 5 + 3
        self.yd_row = {}
        self.lt_block = {}
        y = yd_start
        for rid in self.routes:
            for t in range(1, 6):
                self.yd_row[(rid, t)] = y
                y += 1
        e = eng_start
        for rid in self.routes:
            for typ in types:
                self.lt_block[(rid, typ)] = e
                e += 5
        col = {name: 2 + i for i, name in enumerate(self.LT_COLS)}
        self.lt_col = {k: CL(v) for k, v in col.items()}
        L = self.lt_col

        # Year drivers -------------------------------------------------------------------
        section(ws, yd_start - 2, 2, 8, "YEAR DRIVERS BY ROUTE — contribution at 0% incentive and the cost of $1 of credit, each year")
        header(ws, yd_start - 1, 2, ["Route", "Year", "Cost scale k(t)", "Channel fee f(t)", "Contribution at 0% (M0, per $100)",
                                     "Cost per $1 of credit", "Discount factor"])
        ws.row_dimensions[yd_start - 1].height = 42
        for rid in self.routes:
            st = self.st[rid]
            Rn = name_refs(rid)
            for t in range(1, 6):
                yr = self.yd_row[(rid, t)]
                put(ws, yr, 2, self.short[rid])
                put(ws, yr, 3, t, kind="label", fmt=F_INT)
                put(ws, yr, 4, f"=IF(C{yr}=1,1,((1-LT_efficiencyGain)/(1-LT_priceDeflation))^(C{yr}-1))", fmt=F_FACTOR)
                if st == "agent":
                    put(ws, yr, 5, f"=MAX(0,{rn(rid, 'channelFee')}+LT_channelFeeDrift*(C{yr}-1))", fmt=F_PCT)
                else:
                    put(ws, yr, 5, "=0", kind="muted", fmt=F_PCT)
                put(ws, yr, 6, "=" + m0_expr(st, Rn, f"D{yr}", f"E{yr}"), fmt=F_USD)
                put(ws, yr, 7, "=" + slope_expr(st, Rn, f"D{yr}", f"E{yr}"), fmt=F_SLOPE)
                put(ws, yr, 8, f"=1/(1+LT_discountRate)^C{yr}", fmt=F_FACTOR)
                if t == 5:
                    for cc in range(2, 9):
                        ws.cell(row=yr, column=cc).border = BOTTOM
                for key, cc in (("costScale", 4), ("fee", 5), ("m0", 6), ("slope", 7), ("df", 8)):
                    self.reg(f"yd|{rid}|{t}|{key}", ws, yr, cc)

        # Engine -------------------------------------------------------------------------
        section(ws, eng_start - 2, 2, 1 + len(self.LT_COLS), "YEAR-BY-YEAR ENGINE — one block of five years per route × incentive type")
        header(ws, eng_start - 1, 2, [self.LT_HEAD[c] for c in self.LT_COLS])
        ws.row_dimensions[eng_start - 1].height = 54
        for bi, rid in enumerate(self.routes):
            for ti, typ in enumerate(types):
                a = self.lt_block[(rid, typ)]
                band = FILL_BAND if (bi * len(types) + ti) % 2 else None
                for t in range(1, 6):
                    R = a + t - 1
                    yr = self.yd_row[(rid, t)]
                    F = {
                        "route": self.short[rid], "type": typ, "year": t,
                        "inH": f"=IF({L['year']}{R}<=LT_years,1,0)",
                        "inCommit": f'=IF(AND({L["type"]}{R}="commit",{L["year"]}{R}<=LT_commitYears),1,0)',
                        "survive": f"=IF({L['inCommit']}{R}=1,1,IF({L['year']}{R}=1,1,LT_retention^({L['year']}{R}-1)))",
                        "spend": f"=ListPrice*IF({L['year']}{R}=1,1,(1+LT_growth)^({L['year']}{R}-1))*{L['survive']}{R}",
                        "gross": f"=$F${yr}*{L['spend']}{R}/ListPrice",
                        "prevSpend": "=LT_baselineShare*ListPrice" if t == 1 else f"={L['spend']}{R - 1}",
                        "credit": (f'=IF(OR({L["type"]}{R}="one-time",{L["type"]}{R}="commit"),IF({L["year"]}{R}=1,Inc_pct*{L["spend"]}{R},0),'
                                   f'IF({L["type"]}{R}="recurring",Inc_pct*{L["spend"]}{R},'
                                   f'IF({L["year"]}{R}<=LT_consumptionYears,Inc_pct*MAX(0,{L["spend"]}{R}-{L["prevSpend"]}{R}),0)))'),
                        "cost": f"=$G${yr}*{L['credit']}{R}",
                        "adj": (f"=IF(LT_includeAdjacency=1,{L['spend']}{R}*(LT_adjacencyAttach*LT_adjacencyIncremental"
                                f"+IF({L['inCommit']}{R}=1,LT_commitAdjacencyUplift,0))*LT_adjacencyMargin,0)"),
                        "contrib": f"={L['gross']}{R}-{L['cost']}{R}+{L['adj']}{R}",
                        "cum": f"=SUM({L['contrib']}{a}:{L['contrib']}{R})",
                        "df": f"=$H${yr}",
                        "disc": f"={L['contrib']}{R}/(1+LT_discountRate)^{L['year']}{R}",
                        "annual": f"={L['gross']}{R}+{L['adj']}{R}",
                        "cumBefore": f"=-{L['cost']}{R}" if t == 1 else f"={L['cum']}{R - 1}-{L['cost']}{R}",
                        "hit": f"=IF(AND({L['cumBefore']}{R}<0,{L['annual']}{R}>0,-{L['cumBefore']}{R}<={L['annual']}{R}),1,0)",
                        "pb": f'=IF({L["hit"]}{R}=1,({L["year"]}{R}-1)*12+12*(-{L["cumBefore"]}{R})/{L["annual"]}{R},"")',
                        "neg": f"=IF({L['cumBefore']}{R}<0,1,0)",
                        "hitH": f"={L['hit']}{R}*{L['inH']}{R}",
                        "negH": f"={L['neg']}{R}*{L['inH']}{R}",
                    }
                    for name in self.LT_COLS:
                        v = F[name]
                        kind = "label" if name in ("route", "type", "year") else None
                        if name == "df":
                            kind = "formula"
                        c = put(ws, R, col[name], v, kind=kind, fmt=self.LT_FMT.get(name), fill=band)
                        if t == 5:
                            c.border = BOTTOM
                    for name, field in self.LT_FIELD.items():
                        self.reg(f"lt|{rid}|{typ}|{t}|{field}", ws, R, col[name])

        # Summaries ----------------------------------------------------------------------
        def block(rid, typ, n=5):
            a = self.lt_block[(rid, typ)]
            return a, a + n - 1

        def rng(c, a, b):
            return f"{L[c]}{a}:{L[c]}{b}"

        # all types, selected horizon
        section(ws, all_start - 2, 2, 9, "ALL INCENTIVE TYPES — over the selected lifetime years")
        header(ws, all_start - 1, 2, ["Route", "Incentive type", "NPV", "Cumulative contribution", "Payback (months)",
                                      "Effective customer discount", "Total credits", "Total list spend"])
        ws.row_dimensions[all_start - 1].height = 30
        self.lt_all_row = {}
        rr = all_start
        for bi, rid in enumerate(self.routes):
            for typ in types:
                a, b = block(rid, typ)
                band = FILL_BAND if bi % 2 else None
                self.lt_all_row[(rid, typ)] = rr
                put(ws, rr, 2, self.short[rid], fill=band)
                put(ws, rr, 3, typ, fill=band)
                put(ws, rr, 4, f"=SUMPRODUCT({rng('disc', a, b)},{rng('inH', a, b)})", fmt=F_USD, fill=band, bold=True)
                put(ws, rr, 5, f"=SUMPRODUCT({rng('contrib', a, b)},{rng('inH', a, b)})", fmt=F_USD, fill=band)
                put(ws, rr, 6, (f'=IF(SUM({rng("hitH", a, b)})>0,INDEX({rng("pb", a, b)},MATCH(1,{rng("hitH", a, b)},0)),'
                                f'IF(SUM({rng("negH", a, b)})>0,"never",0))'), fmt=F_MO, fill=band, halign="right")
                put(ws, rr, 7, (f"=IF(SUMPRODUCT({rng('spend', a, b)},{rng('inH', a, b)})>0,SUMPRODUCT({rng('credit', a, b)},"
                                f"{rng('inH', a, b)})/SUMPRODUCT({rng('spend', a, b)},{rng('inH', a, b)}),0)"), fmt=F_PCT, fill=band)
                put(ws, rr, 8, f"=SUMPRODUCT({rng('credit', a, b)},{rng('inH', a, b)})", fmt=F_USD, fill=band)
                put(ws, rr, 9, f"=SUMPRODUCT({rng('spend', a, b)},{rng('inH', a, b)})", fmt=F_USD, fill=band)
                for k, cc in (("npv", 4), ("cumulative", 5), ("paybackMonths", 6), ("effectiveCustomerDiscount", 7)):
                    self.reg(f"ltsel|{rid}|{typ}|{k}", ws, rr, cc)
                rr += 1

        # selected type
        section(ws, sel_start - 2, 2, 9, "SELECTED SCENARIO — the incentive type and lifetime years chosen on Assumptions")
        header(ws, sel_start - 1, 2, ["Route", "Incentive type", "NPV", "Cumulative contribution", "Payback (months)",
                                      "Effective customer discount"])
        ws.row_dimensions[sel_start - 1].height = 30
        for i, rid in enumerate(self.routes):
            rr = sel_start + i
            s0 = self.lt_all_row[(rid, types[0])]
            s1 = self.lt_all_row[(rid, types[-1])]
            put(ws, rr, 2, self.short[rid], bold=True)
            put(ws, rr, 3, "=Inc_type", kind="link")
            for cc, fmt, k in ((4, F_USD, "npv"), (5, F_USD, "cumulative"), (6, F_MO, "paybackMonths"), (7, F_PCT, "effectiveCustomerDiscount")):
                X = CL(cc)
                put(ws, rr, cc, f'=IFERROR(INDEX({X}{s0}:{X}{s1},MATCH(Inc_type,$C${s0}:$C${s1},0)),"invalid type")',
                    fmt=fmt, bold=cc == 4, fill=FILL_KEY if cc == 4 else None, halign="right" if cc == 6 else None)
                self.reg(f"ltpick|{rid}|{k}", ws, rr, cc)

        # fixed horizons
        section(ws, hz_start - 2, 2, 15, "FIXED HORIZONS — 1, 3 and 5 years (independent of the selected lifetime years)")
        header(ws, hz_start - 1, 2, ["Route", "Incentive type", "NPV 1 yr", "NPV 3 yr", "NPV 5 yr", "Cumulative 1 yr",
                                     "Cumulative 3 yr", "Cumulative 5 yr", "Payback 1 yr (months)", "Payback 3 yr (months)",
                                     "Payback 5 yr (months)", "Effective discount 1 yr", "Effective discount 3 yr",
                                     "Effective discount 5 yr"])
        ws.row_dimensions[hz_start - 1].height = 42
        self.lt_hz = {}
        rr = hz_start
        for bi, rid in enumerate(self.routes):
            for typ in types:
                band = FILL_BAND if bi % 2 else None
                put(ws, rr, 2, self.short[rid], fill=band)
                put(ws, rr, 3, typ, fill=band)
                for j, n in enumerate((1, 3, 5)):
                    a, b = block(rid, typ, n)
                    cells = {
                        "npv": (4 + j, f"=SUM({rng('disc', a, b)})", F_USD),
                        "cumulative": (7 + j, f"={L['cum']}{b}", F_USD),
                        "paybackMonths": (10 + j, (f'=IF(SUM({rng("hit", a, b)})>0,INDEX({rng("pb", a, b)},MATCH(1,{rng("hit", a, b)},0)),'
                                                   f'IF(SUM({rng("neg", a, b)})>0,"never",0))'), F_MO),
                        "effectiveCustomerDiscount": (13 + j, (f"=IF(SUM({rng('spend', a, b)})>0,SUM({rng('credit', a, b)})"
                                                               f"/SUM({rng('spend', a, b)}),0)"), F_PCT),
                    }
                    for k, (cc, f, fmt) in cells.items():
                        put(ws, rr, cc, f, fmt=fmt, fill=band, halign="right" if k == "paybackMonths" else None)
                        self.reg(f"lth|{rid}|{typ}|{n}|{k}", ws, rr, cc)
                        self.lt_hz[(rid, typ, n, k)] = f"Lifetime!${CL(cc)}${rr}"
                rr += 1

    # -- Subsidy_Grid --------------------------------------------------------------------
    GRID_COLS = [("level", "Incentive, % of list", F_PCT_IN), ("customerPays", "Customer pays", F_USD),
                 ("cloudNetRevenue", "Cloud net revenue", F_USD), ("contribution", "Cloud contribution", F_USD),
                 ("contributionPct", "Contribution, % of net revenue", F_PCT),
                 ("volumeMultiple", "Volume multiple needed if recurring", F_X),
                 ("paybackMonths", "Payback if one-time (months, 5-yr)", F_MO),
                 ("npv1", "NPV 1 yr, one-time", F_USD), ("npv3", "NPV 3 yr, one-time", F_USD),
                 ("npv5", "NPV 5 yr, one-time", F_USD), ("npvRecurring5", "NPV 5 yr, recurring", F_USD),
                 ("breakEven", "Break-even incentive", F_PCT)]

    def build_grid(self):
        ws = self.ws["Subsidy_Grid"]
        widths(ws, {"A": 2, "B": 13, **{CL(c): 13 for c in range(3, 14)}, "N": 3, **{CL(c): 12 for c in range(15, 21)}})
        title(ws, "Subsidy grid — what each incentive level does to the cloud's economics",
              "$ per $100 of year-1 list. Year-1 columns use the Assumptions route parameters and funding split; "
              "NPV and payback use the Lifetime sheet's growth, retention, cost drift and adjacency settings.",
              "Incentive levels (blue) come from model.ts INCENTIVE_LEVELS — overwrite any of them to explore. "
              "Columns O–T are the payback walk for a one-time credit (helper).")
        ws.freeze_panes = "C5"
        Lc = self.lt_col
        r = 5
        for rid in self.routes:
            st = self.st[rid]
            n = lambda key, rid=rid: rn(rid, key)  # noqa: E731
            wc = self.wf_col[rid]
            a = self.lt_block[(rid, "one-time")]
            y1, y5 = self.yd_row[(rid, 1)], self.yd_row[(rid, 5)]
            section(ws, r, 2, 13, f"{self.label[rid]} — {st} structure")
            for cc in range(15, 21):
                ws.cell(row=r, column=cc).fill = FILL_SECTION
            put(ws, r, 15, "Payback walk (helper): cumulative before year t's inflow", italic=True, fill=FILL_SECTION)
            r += 1
            header(ws, r, 2, [c[1] for c in self.GRID_COLS])
            header(ws, r, 15, ["Year 1", "Year 2", "Year 3", "Year 4", "Year 5", "Year-1 incentive cost"])
            ws.row_dimensions[r].height = 56
            r += 1
            for i, level in enumerate(M.INCENTIVE_LEVELS):
                R = r + i
                B = f"$B{R}"
                put(ws, R, 2, level, kind="input", fmt=F_PCT_IN)
                put(ws, R, 3, f"=ListPrice-{n('customerDiscount')}*ListPrice-{B}*ListPrice", fmt=F_USD)
                if st == "agent":
                    rm = f"(ListPrice-{n('discountFundedByProvider')}*{n('customerDiscount')}*ListPrice-Inc_providerFunded*{B}*ListPrice)"
                    put(ws, R, 4, (f"=MAX(0,{n('channelFee')})*{rm}-(1-{n('discountFundedByProvider')})*{n('customerDiscount')}*ListPrice"
                                   f"-Inc_cloudFunded*{B}*ListPrice"), fmt=F_USD)
                    put(ws, R, 5, (f"=D{R}-{n('distributionCost')}*ListPrice+{n('providerServingCost')}*{rm}*{n('hostedShare')}"
                                   f"*{n('incrementalComputeShare')}*{n('computeMargin')}"), fmt=F_USD, bold=True)
                else:
                    put(ws, R, 4, f"=ListPrice-{n('customerDiscount')}*ListPrice-Inc_cloudFunded*{B}*ListPrice", fmt=F_USD)
                    put(ws, R, 5, (f"=D{R}-{n('revenueShare')}*D{R}-{n('infraCost')}*({n('baseUtilization')}/{n('utilization')})"
                                   f"*ListPrice-{n('distributionCost')}*ListPrice"), fmt=F_USD, bold=True)
                put(ws, R, 6, f'=IF(D{R}>0,E{R}/D{R},"n/a")', fmt=F_PCT, halign="right")
                m0 = f"Waterfall_Y1!${wc}${self.wf_row['m0']}"
                put(ws, R, 7, f'=IF(OR({m0}<=0,E{R}<=0),"not recoverable",{m0}/E{R})', fmt=F_X, halign="right")
                # payback walk helpers: O..S = cumulative before year t's inflow, T = year-1 incentive cost
                put(ws, R, 20, f"=Lifetime!$G${y1}*{B}*ListPrice", fmt=F_USD)
                for t in range(1, 6):
                    if t == 1:
                        f = f"=-T{R}"
                    else:
                        f = f"=SUM(Lifetime!${Lc['annual']}${a}:${Lc['annual']}${a + t - 2})-T{R}"
                    put(ws, R, 14 + t, f, fmt=F_USD)
                ann = lambda t: f"Lifetime!${Lc['annual']}${a + t - 1}"  # noqa: E731
                cb = lambda t: f"{CL(14 + t)}{R}"  # noqa: E731
                tail = f'IF(OR({",".join(f"{cb(t)}<0" for t in range(1, 6))}),"never",0)'
                expr = tail
                for t in range(5, 0, -1):
                    expr = (f"IF(AND({cb(t)}<0,{ann(t)}>0,-{cb(t)}<={ann(t)}),{(t - 1) * 12}+12*(-{cb(t)})/{ann(t)},{expr})")
                put(ws, R, 8, "=" + expr, fmt=F_MO, halign="right")
                df = lambda m: f"Lifetime!${Lc['df']}${a}:${Lc['df']}${a + m - 1}"  # noqa: E731
                an = lambda m: f"Lifetime!${Lc['annual']}${a}:${Lc['annual']}${a + m - 1}"  # noqa: E731
                for cc, m in ((9, 1), (10, 3), (11, 5)):
                    put(ws, R, cc, f"=SUMPRODUCT({an(m)},{df(m)})-T{R}*Lifetime!${Lc['df']}${a}", fmt=F_USD)
                put(ws, R, 12, (f"=SUMPRODUCT({an(5)},{df(5)})-{B}*SUMPRODUCT(Lifetime!$G${y1}:$G${y5},"
                                f"Lifetime!${Lc['spend']}${a}:${Lc['spend']}${a + 4},{df(5)})"), fmt=F_USD)
                put(ws, R, 13, f"=Waterfall_Y1!${wc}${self.wf_row['breakEven']}", kind="link", fmt=F_PCT, halign="right")
                for j, (key, _, _) in enumerate(self.GRID_COLS):
                    if key in ("level",):
                        continue
                    self.reg(f"grid|{rid}|{i}|{key}", ws, R, 2 + j)
            r += len(M.INCENTIVE_LEVELS) + 2

    # -- OneTime_vs_Recurring --------------------------------------------------------------
    def build_otr(self):
        ws = self.ws["OneTime_vs_Recurring"]
        widths(ws, {"A": 2, "B": 24, **{CL(c): 12 for c in range(3, 9)}, "I": 16, "J": 3})
        put(ws, 1, 2, "One-time vs recurring — the same incentive, two different businesses", bold=True, size=14)
        put(ws, 2, 2, ('="Incentive "&TEXT(Inc_pct,"0%")&" of list, "&TEXT(Inc_cloudFunded,"0%")&" funded by the cloud · adjacency "'
                       '&IF(LT_includeAdjacency=1,"included","excluded")&" · $ per $100 of year-1 list spend"'), italic=True, color=GREY)
        put(ws, 3, 2, "One-time: the credit is granted on year-1 spend only. Recurring: the same % is granted on every year's spend. "
                      "Edit the drivers on Assumptions; every number here is live.", italic=True, color=GREY)
        ws.freeze_panes = "C4"
        # key inputs strip
        keys = [("Incentive %", "=Inc_pct", F_PCT_IN), ("Cloud-funded", "=Inc_cloudFunded", F_PCT_IN),
                ("Spend growth", "=LT_growth", F_PCT_IN), ("Retention", "=LT_retention", F_PCT_IN),
                ("Discount rate", "=LT_discountRate", F_PCT_IN), ("Adjacency (1/0)", "=LT_includeAdjacency", F_INT)]
        put(ws, 5, 2, "Key inputs", bold=True)
        put(ws, 6, 2, "edit on Assumptions", italic=True, color=GREY)
        for j, (lab, f, fmt) in enumerate(keys):
            put(ws, 5, 3 + j, lab, kind="muted", halign="right", wrap=True)
            put(ws, 6, 3 + j, f, kind="link", fmt=fmt, halign="right")
        r = 8
        self.otr_rows = {}

        def table(r, heading, metric, fmt, gap=True, extra=None):
            section(ws, r, 2, 9, heading)
            r += 1
            put(ws, r, 3, "One-time incentive", kind="head")
            for cc in (4, 5):
                ws.cell(row=r, column=cc).fill = FILL_HEAD
            put(ws, r, 6, "Recurring incentive", kind="head")
            for cc in (7, 8):
                ws.cell(row=r, column=cc).fill = FILL_HEAD
            put(ws, r, 2, "", kind="head")
            put(ws, r, 9, "", kind="head")
            r += 1
            header(ws, r, 2, ["Route", "1 yr", "3 yr", "5 yr", "1 yr", "3 yr", "5 yr",
                              extra[0] if extra else ("Recurring − one-time, 5 yr" if gap else "")])
            ws.row_dimensions[r].height = 30
            r += 1
            first = r
            for rid in self.routes:
                put(ws, r, 2, self.short[rid], bold=True)
                for j, typ in enumerate(("one-time", "recurring")):
                    for k, nyr in enumerate((1, 3, 5)):
                        cc = 3 + 3 * j + k
                        put(ws, r, cc, "=" + self.lt_hz[(rid, typ, nyr, metric)], kind="link", fmt=fmt,
                            halign="right", fill=FILL_KEY if nyr == 5 and metric == "npv" else None)
                        self.reg(f"otr|{rid}|{typ}|{nyr}|{metric}", ws, r, cc)
                if extra:
                    put(ws, r, 9, extra[1](rid), fmt=extra[2], halign="right")
                    self.reg(f"otr|{rid}|{extra[3]}", ws, r, 9)
                elif gap:
                    put(ws, r, 9, f"=H{r}-E{r}", fmt=fmt)
                    self.reg(f"otr|{rid}|gap5|{metric}", ws, r, 9)
                self.otr_rows[(metric, rid)] = r
                r += 1
            return r + 1, first

        r, npv_first = table(r, "1. Lifetime NPV to the cloud ($ per $100 of year-1 list)", "npv", F_USD)
        r, _ = table(r, "2. Cumulative contribution, undiscounted ($ per $100 of year-1 list)", "cumulative", F_USD)
        r, _ = table(r, "3. Payback (months until cumulative contribution covers the incentive; 'never' within the horizon)",
                     "paybackMonths", F_MO, gap=False)

        def cliff(rid):
            d = rn(rid, "customerDiscount")
            return f'=IF(1-{d}-Inc_pct<=0,"unbounded",(1-{d})/(1-{d}-Inc_pct)-1)'
        r, _ = table(r, "4. What the customer sees: effective discount from credits over the lifetime (credits ÷ list spend)",
                     "effectiveCustomerDiscount", F_PCT, extra=("Year-2 price rise when a one-time credit expires", cliff, F_PCT, "cliff"))

        section(ws, r, 2, 9, "5. Reading the numbers")
        r += 1
        for rid in self.routes:
            nr = self.otr_rows[("npv", rid)]
            pr = self.otr_rows[("paybackMonths", rid)]
            cr = self.otr_rows[("effectiveCustomerDiscount", rid)]
            f = (f'=B{nr}&": after a "&TEXT(Inc_pct,"0%")&" one-time credit the customer is worth "&TEXT(E{nr},"$#,##0.0;-$#,##0.0")'
                 f'&" over 5 years (payback "&IF(ISNUMBER(E{pr}),TEXT(E{pr},"0")&" months","never")&"); granted every year it is worth "'
                 f'&TEXT(H{nr},"$#,##0.0;-$#,##0.0")&". The customer\'s price jumps "&IF(ISNUMBER(I{cr}),TEXT(I{cr},"0%"),"without limit")'
                 f'&" when a one-time credit expires."')
            put(ws, r, 2, f)
            r += 1
        r += 1
        # chart: 5-yr NPV one-time vs recurring
        ch = BarChart()
        ch.type = "col"
        ch.grouping = "clustered"
        ch.title = "5-year NPV per $100 of year-1 list"
        ch.y_axis.title = "$ per $100"
        ch.y_axis.numFmt = "$#,##0"
        for colno, lab in ((5, "One-time"), (8, "Recurring")):
            ref = Reference(ws, min_col=colno, min_row=npv_first, max_row=npv_first + len(self.routes) - 1)
            ch.add_data(ref, titles_from_data=False)
            ch.series[-1].tx = SeriesLabel(v=lab)
        ch.set_categories(Reference(ws, min_col=2, min_row=npv_first, max_row=npv_first + len(self.routes) - 1))
        _chart_hygiene(ch)
        ch.height, ch.width = 8, 16
        ws.add_chart(ch, "K8")

    # -- Adjacency ---------------------------------------------------------------------
    def build_adjacency(self):
        ws = self.ws["Adjacency"]
        widths(ws, {"A": 2, "B": 18, "C": 14, **{CL(c): 15 for c in range(4, 11)}})
        title(ws, "Adjacency — how much non-AI cloud business would make the incentive pay",
              "Required attach ratio = adjacent revenue per $1 of AI spend (before the incremental haircut) that brings lifetime NPV "
              "to zero; adjacency is switched on for this test and the commit uplift is excluded (model.ts requiredAttach).",
              "Horizon = the selected lifetime years. $ per $100 of year-1 list unless noted.")
        ws.freeze_panes = "D5"
        r = 5
        recap = [("Lifetime years (horizon)", "=LT_years", F_INT), ("Active adjacency attach ($ per $1 of AI)", "=LT_adjacencyAttach", F_RATIO),
                 ("Incremental share of adjacent revenue", "=LT_adjacencyIncremental", F_PCT_IN),
                 ("Gross margin on adjacent services", "=LT_adjacencyMargin", F_PCT_IN), ("Discount rate", "=LT_discountRate", F_PCT_IN)]
        for lab, f, fmt in recap:
            put(ws, r, 2, lab)
            put(ws, r, 4, f, kind="link", fmt=fmt)
            r += 1
        r += 1
        header(ws, r, 2, ["Route", "Incentive type", "NPV without adjacency", "PV of incremental adjacent GP at 1.0x attach",
                          "Required attach ratio ($ per $1 of AI)", "Required incremental adjacent GP per $100 of AI spend, each year",
                          "Required adjacent GP over the lifetime (PV)", "Active attach ratio", "Covered at the active attach?"])
        ws.row_dimensions[r].height = 66
        r += 1
        Lc = self.lt_col
        order = ["one-time", "recurring", "consumption", "commit"]
        for ti, typ in enumerate(order):
            for rid in self.routes:
                a = self.lt_block[(rid, typ)]
                b = a + 4
                band = FILL_BAND if ti % 2 else None
                lr = lambda c: f"Lifetime!${Lc[c]}${a}:${Lc[c]}${b}"  # noqa: E731
                put(ws, r, 2, self.short[rid], fill=band, bold=True)
                put(ws, r, 3, typ, fill=band)
                put(ws, r, 4, f"=SUMPRODUCT({lr('gross')}-{lr('cost')},{lr('df')},{lr('inH')})", fmt=F_USD, fill=band)
                put(ws, r, 5, f"=SUMPRODUCT({lr('spend')},{lr('df')},{lr('inH')})*LT_adjacencyIncremental*LT_adjacencyMargin",
                    fmt=F_USD, fill=band)
                put(ws, r, 6, f'=IF(D{r}>=0,0,IF(E{r}<=0,"not recoverable",-D{r}/E{r}))', fmt=F_RATIO + "x", fill=band,
                    bold=True, halign="right")
                put(ws, r, 7, f'=IF(ISNUMBER(F{r}),F{r}*LT_adjacencyIncremental*LT_adjacencyMargin*ListPrice,"not recoverable")',
                    fmt=F_USD, fill=band, halign="right")
                put(ws, r, 8, f'=IF(ISNUMBER(F{r}),MAX(0,-D{r}),"not recoverable")', fmt=F_USD, fill=band, halign="right")
                put(ws, r, 9, "=LT_adjacencyAttach", kind="link", fmt=F_RATIO + "x", fill=band)
                put(ws, r, 10, f'=IF(ISNUMBER(F{r}),IF(I{r}>=F{r},"yes","no"),"no")', fill=band, halign="center")
                for k, cc in (("npvWithout", 4), ("pvSlope", 5), ("requiredAttach", 6), ("requiredGPPerYear", 7), ("requiredGPPV", 8)):
                    self.reg(f"adj|{rid}|{typ}|{k}", ws, r, cc)
                r += 1
        r += 1
        put(ws, r, 2, "Reading: an attach ratio of 0.40x means $0.40 of storage/database/networking revenue per $1 of AI spend; only the "
                      "incremental share earns gross profit for this test. 'not recoverable' = no attach ratio is enough.",
            italic=True, color=GREY)

    # -- Equity ------------------------------------------------------------------------
    def build_equity(self):
        ws = self.ws["Equity"]
        widths(ws, {"A": 2, "B": 22, **{CL(c): 16 for c in range(3, 10)}})
        title(ws, "Equity — strategic uplift from owning part of the model provider vs the subsidy the cloud bears",
              "Strategic, not operating: value of the cloud's stake rises by stake × revenue multiple × incremental provider revenue. "
              "Shown for agent routes (the cloud owns part of the provider it distributes). $ per $100 of year-1 list.")
        ws.freeze_panes = "C5"
        r = 5
        for lab, f, fmt in (("Equity stake", "=EQ_stake", F_PCT_IN), ("Revenue multiple", "=EQ_revenueMultiple", F_MULT_IN),
                            ("Share of subsidized consumption incremental to the provider", "=EQ_incrementalToProvider", F_PCT_IN),
                            ("Incentive, % of list", "=Inc_pct", F_PCT_IN)):
            put(ws, r, 2, lab)
            put(ws, r, 3, f, kind="link", fmt=fmt)
            r += 1
        r += 1
        header(ws, r, 2, ["Route", "Provider revenue (Y1, at the active incentive)", "Equity uplift to the cloud",
                          "Subsidy cost to the cloud (Y1 contribution given up)", "Cloud-funded credit face value",
                          "Uplift − subsidy cost", "Uplift ÷ subsidy cost", "Break-even incremental-to-provider share"])
        ws.row_dimensions[r].height = 54
        r += 1
        for rid in self.routes:
            wc = self.wf_col[rid]
            W = lambda key: f"Waterfall_Y1!${wc}${self.wf_row[key]}"  # noqa: E731
            put(ws, r, 2, self.short[rid], bold=True)
            put(ws, r, 5, f"={W('m0')}-{W('cloudContribution')}", fmt=F_USD)
            put(ws, r, 6, f"={W('creditsCloud')}", kind="link", fmt=F_USD)
            self.reg(f"eq|{rid}|subsidyCost", ws, r, 5)
            self.reg(f"eq|{rid}|creditsCloud", ws, r, 6)
            if self.st[rid] == "agent":
                put(ws, r, 3, f"={W('providerRevenue')}", kind="link", fmt=F_USD)
                put(ws, r, 4, f"=EQ_stake*EQ_revenueMultiple*EQ_incrementalToProvider*C{r}", fmt=F_USD, bold=True, fill=FILL_KEY)
                put(ws, r, 7, f"=D{r}-E{r}", fmt=F_USD)
                put(ws, r, 8, f'=IF(E{r}>0,D{r}/E{r},"n/a")', fmt=F_X, halign="right")
                put(ws, r, 9, f'=IF(EQ_stake*EQ_revenueMultiple*C{r}>0,E{r}/(EQ_stake*EQ_revenueMultiple*C{r}),"n/a")', fmt=F_PCT, halign="right")
                for k, cc in (("providerRevenue", 3), ("uplift", 4), ("net", 7), ("ratio", 8), ("breakEvenIncremental", 9)):
                    self.reg(f"eq|{rid}|{k}", ws, r, cc)
            else:
                for cc in (3, 4, 7, 8, 9):
                    put(ws, r, cc, "n/a", kind="muted", halign="right")
            r += 1
        r += 1
        put(ws, r, 2, "Principal routes are first-party (the cloud is principal); a stake in the model owner is outside this per-$100 view. "
                      "Break-even share: the share of subsidized consumption that must be new revenue for the provider for the uplift "
                      "to cover the subsidy.", italic=True, color=GREY)

    # -- Sensitivity ---------------------------------------------------------------------
    def build_sensitivity(self):
        ws = self.ws["Sensitivity"]
        rid = "bedrock-claude" if "bedrock-claude" in self.routes else next(r for r in self.routes if self.st[r] == "agent")
        st = self.st[rid]
        self.sens_route = rid
        used = AGENT_USED if st == "agent" else PRINCIPAL_USED
        route_syms = [s for s, k in ROUTE_SYM.items() if k in used]
        y1_syms = route_syms + ["c", "pp", "pm"]
        be_syms = route_syms + ["pp", "pm"]
        npv_syms = y1_syms + list(LT_SYM.keys())
        self.sens_syms = {"y1": y1_syms, "be": be_syms, "npv5": npv_syms}
        widths(ws, {"A": 2, "B": 38, **{CL(c): 12 for c in range(3, 11)}, "K": 3, "L": 7, "M": 38, "N": 12, "O": 12})
        title(ws, f"Sensitivity — {self.label[rid]}: one parameter at a time",
              "Each row sets one parameter to its Low, then High value (Assumptions) with every other parameter at Active. "
              "All live formulas; the calculation matrix at the bottom holds one full parameter set per case.",
              "5-year NPV uses the selected incentive type (Assumptions) at the active incentive %.")
        ws.freeze_panes = "C4"

        def key_of(sym):
            g, k = SYM_GROUP[sym]
            return f"route|{rid}|{k}" if g == "route" else f"{g}|{k}"

        # ---- calculation matrix (built first so tables can reference it) --------------
        n_tables_rows = sum(len(v) + 6 for v in self.sens_syms.values())
        m_start = 6 + n_tables_rows + 6
        cols = {}
        c = 4
        for s in npv_syms:
            cols[s] = c
            c += 1
        out_cols = {}
        for name in ("m0", "slope", "y1", "be"):
            out_cols[name] = c
            c += 1
        for t in range(1, 6):
            out_cols[f"spend{t}"] = c
            c += 1
        for t in range(1, 6):
            out_cols[f"contrib{t}"] = c
            c += 1
        out_cols["npv5"] = c
        section(ws, m_start - 3, 2, c, "CALCULATION MATRIX (helper) — one row per case; the swapped value is shaded")
        heads = ["Case", "Which"] + [tornado_label(SYM_GROUP[s][1]) for s in npv_syms] + [
            "M0 (Y1, 0% incentive)", "Cost per $1 (Y1)", "Y1 contribution", "Break-even incentive"] + \
            [f"Spend Y{t}" for t in range(1, 6)] + [f"Contribution Y{t}" for t in range(1, 6)] + ["NPV 5 yr"]
        header(ws, m_start - 2, 2, heads)
        ws.row_dimensions[m_start - 2].height = 54
        for cc in range(4, c + 1):
            ws.column_dimensions[CL(cc)].width = max(ws.column_dimensions[CL(cc)].width or 0, 12)
        cases = [("base", None, None)] + [(s, s, w) for s in npv_syms for w in ("low", "high")]
        self.sens_case_row = {}
        for i, (cid, sym, which) in enumerate(cases):
            R = m_start + i
            self.sens_case_row[(sym, which)] = R
            put(ws, R, 2, "Base case (all Active)" if sym is None else tornado_label(SYM_GROUP[sym][1]))
            put(ws, R, 3, "Active" if sym is None else which.capitalize())
            refs = {}
            for s in npv_syms:
                k = key_of(s)
                fmt = meta(SYM_GROUP[s][1])[2]
                if s == sym:
                    lo, hi = self.lowhigh[k]
                    put(ws, R, cols[s], f"={lo if which == 'low' else hi}", kind="link", fmt=fmt, fill=FILL_SWAP)
                else:
                    put(ws, R, cols[s], f"={self.active[k]}", kind="link", fmt=fmt)
                refs[s] = f"${CL(cols[s])}{R}"
            refs["L"] = "ListPrice"
            refs["type"] = "Inc_type"
            for s in ROUTE_SYM:  # syms not used by this structure: never referenced, but keep generators total
                refs.setdefault(s, "0")
            oc = {k: f"{CL(v)}{R}" for k, v in out_cols.items()}
            put(ws, R, out_cols["m0"], "=" + m0_expr(st, refs), fmt=F_USD)
            put(ws, R, out_cols["slope"], "=" + slope_expr(st, refs), fmt=F_SLOPE)
            put(ws, R, out_cols["y1"], f"={oc['m0']}-{oc['slope']}*{refs['c']}*ListPrice", fmt=F_USD, bold=True)
            put(ws, R, out_cols["be"], f'=IF({oc["m0"]}<=0,0,IF({oc["slope"]}*ListPrice=0,"unbounded",{oc["m0"]}/({oc["slope"]}*ListPrice)))',
                fmt=F_PCT, bold=True)
            for t in range(1, 6):
                if t == 1:
                    f = "=ListPrice"
                else:
                    f = (f'=ListPrice*(1+{refs["g"]})^{t - 1}*IF(AND(Inc_type="commit",{t}<={refs["cy"]}),1,{refs["ret"]}^{t - 1})')
                put(ws, R, out_cols[f"spend{t}"], f, fmt=F_USD)
            for t in range(1, 6):
                prev = f"{refs['base']}*ListPrice" if t == 1 else oc[f"spend{t - 1}"]
                put(ws, R, out_cols[f"contrib{t}"], "=" + year_contrib_expr(st, refs, t, oc[f"spend{t}"], prev), fmt=F_USD)
            npv = "+".join(f"{oc[f'contrib{t}']}/(1+{refs['w']})^{t}" for t in range(1, 6))
            put(ws, R, out_cols["npv5"], "=" + npv, fmt=F_USD, bold=True)
            for metric in ("y1", "be", "npv5"):
                if sym is None or sym in self.sens_syms[metric]:
                    self.reg(f"sens|case|{metric}|{sym or 'base'}|{which or 'base'}", ws, R, out_cols[metric])

        # ---- tornado tables ---------------------------------------------------------------
        r = 5
        specs = [("y1", "A. Year-1 cloud contribution ($ per $100 of list) at the active incentive", F_USD),
                 ("be", "B. Break-even incentive (% of list)", F_PCT),
                 ("npv5", "C. 5-year NPV ($ per $100 of year-1 list), selected incentive type", F_USD)]
        self.sens_tables = {}
        for metric, heading, fmt in specs:
            syms = self.sens_syms[metric]
            oc = CL(out_cols[metric])
            section(ws, r, 2, 15, heading)
            r += 1
            header(ws, r, 2, ["Parameter", "Low value", "High value", "Output at Low", "Output at High", "Δ at Low",
                              "Δ at High", "Swing |High − Low|", "Rank", "", "Rank", "Sorted: parameter", "Δ at Low", "Δ at High"])
            ws.cell(row=r, column=11).fill = PatternFill(fill_type=None)
            ws.row_dimensions[r].height = 30
            r += 1
            base_r = r
            put(ws, r, 2, "Base case (all Active)", bold=True)
            put(ws, r, 5, f"=${oc}${self.sens_case_row[(None, None)]}", fmt=fmt, bold=True, fill=FILL_KEY)
            self.reg(f"sens|{metric}|base", ws, r, 5)
            r += 1
            first = r
            last = r + len(syms) - 1
            for s in syms:
                k = key_of(s)
                pfmt = meta(SYM_GROUP[s][1])[2]
                lo, hi = self.lowhigh[k]
                put(ws, r, 2, tornado_label(SYM_GROUP[s][1]))
                put(ws, r, 3, f"={lo}", kind="link", fmt=pfmt)
                put(ws, r, 4, f"={hi}", kind="link", fmt=pfmt)
                put(ws, r, 5, f"=${oc}${self.sens_case_row[(s, 'low')]}", fmt=fmt, halign="right")
                put(ws, r, 6, f"=${oc}${self.sens_case_row[(s, 'high')]}", fmt=fmt, halign="right")
                b = f"$E${base_r}"
                put(ws, r, 7, f'=IF(AND(ISNUMBER(E{r}),ISNUMBER({b})),E{r}-{b},"n/a")', fmt=fmt, halign="right")
                put(ws, r, 8, f'=IF(AND(ISNUMBER(F{r}),ISNUMBER({b})),F{r}-{b},"n/a")', fmt=fmt, halign="right")
                put(ws, r, 9, f"=IF(AND(ISNUMBER(E{r}),ISNUMBER(F{r})),ABS(F{r}-E{r}),0)", fmt=fmt)
                put(ws, r, 10, f"=SUMPRODUCT(($I${first}:$I${last}>I{r})*1)+SUMPRODUCT(($I${first}:I{r}=I{r})*1)", fmt=F_INT)
                self.reg(f"sens|{metric}|{s}|low", ws, r, 5)
                self.reg(f"sens|{metric}|{s}|high", ws, r, 6)
                r += 1
            for kk in range(1, len(syms) + 1):
                R = first + kk - 1
                put(ws, R, 12, kk, kind="label", fmt=F_INT)
                m = f"MATCH(L{R},$J${first}:$J${last},0)"
                put(ws, R, 13, f"=INDEX($B${first}:$B${last},{m})")
                put(ws, R, 14, f"=INDEX($G${first}:$G${last},{m})", fmt=fmt, halign="right")
                put(ws, R, 15, f"=INDEX($H${first}:$H${last},{m})", fmt=fmt, halign="right")
            self.sens_tables[metric] = (first, last)
            r += 2
        # charts (sorted tornado) to the right of the tables
        anchor_row = 5
        for metric, heading, fmt in specs:
            if metric == "be":
                continue
            first, last = self.sens_tables[metric]
            ch = BarChart()
            ch.type = "bar"
            ch.grouping = "clustered"
            ch.overlap = 100
            ch.title = "Tornado: " + ("Year-1 contribution" if metric == "y1" else "5-year NPV") + " (Δ vs base)"
            for colno, lab in ((14, "Low"), (15, "High")):
                ch.add_data(Reference(ws, min_col=colno, min_row=first, max_row=last), titles_from_data=False)
                ch.series[-1].tx = SeriesLabel(v=lab)
            ch.set_categories(Reference(ws, min_col=13, min_row=first, max_row=last))
            ch.x_axis.scaling.orientation = "maxMin"
            ch.x_axis.tickLblPos = "low"
            ch.y_axis.numFmt = "$#,##0"
            _chart_hygiene(ch)
            ch.height, ch.width = 9, 15
            ws.add_chart(ch, f"Q{anchor_row}")
            anchor_row += 20

    # -- Earnings ----------------------------------------------------------------------
    def build_earnings(self):
        ws = self.ws["Earnings"]
        widths(ws, {"A": 2, "B": 16, "C": 48, "D": 7})
        title(ws, "Earnings — reported quarterly series used as context and calibration",
              "Populated from src/lib/subsidy-math/earnings.json when it exists (schema in scripts/subsidy-math/build_model.py). "
              "Values are as reported or calculated per the Basis column (blue = data); the change table below is live.")
        data = self.earnings
        series = (data.get("series", []) if isinstance(data, dict) else list(data or []))
        emeta = data.get("_meta", {}) if isinstance(data, dict) else {}
        if not series:
            put(ws, 5, 2, "No earnings data yet: src/lib/subsidy-math/earnings.json was not found (or has no series) at build time.",
                bold=True)
            put(ws, 6, 2, "Research agents will add it; re-run the build command in README to populate this sheet.", italic=True, color=GREY)
            return

        def qkey(q):
            m = re.match(r"\s*Q([1-4])\s+(\d{4})\s*$", q)
            return (int(m.group(2)), int(m.group(1))) if m else (9999, 9)
        seen = {q for s_ in series for q in (s_.get("values") or {})}
        listed = [q for q in emeta.get("quarters", []) if isinstance(q, str)]
        quarters = listed + sorted((seen - set(listed)), key=qkey)
        bad = [q for q in quarters if qkey(q) == (9999, 9)]
        n = len(quarters)
        if emeta.get("note") or emeta.get("asOf"):
            put(ws, 3, 2, f"{emeta.get('note', '')}{'  As of ' + emeta['asOf'] + '.' if emeta.get('asOf') else ''}", italic=True, color=GREY)
        head = ["Company", "Metric", "Unit"] + quarters + ["Basis", "Source", "URL", "Note"]
        header(ws, 5, 2, head)
        ws.row_dimensions[5].height = 30
        for j in range(n):
            ws.column_dimensions[CL(5 + j)].width = 10
        for off, wdt in ((0, 7), (1, 36), (2, 30), (3, 60)):
            ws.column_dimensions[CL(5 + n + off)].width = wdt
        ws.freeze_panes = "E6"
        r = 6
        for i, s_ in enumerate(series):
            band = FILL_BAND if i % 2 else None
            unit = s_.get("unit", "")
            put(ws, r, 2, s_.get("company", ""), fill=band, bold=True)
            put(ws, r, 3, s_.get("metric", ""), fill=band, wrap=True)
            put(ws, r, 4, unit, fill=band, halign="center")
            vals = s_.get("values") or {}
            fmt = "0.0" if unit.strip() == "%" else "#,##0;[Red](#,##0)"
            for j, q in enumerate(quarters):
                v = vals.get(q)
                if isinstance(v, (int, float)) and not isinstance(v, bool):
                    put(ws, r, 5 + j, v, kind="input", fmt=fmt, fill=band)
                else:
                    ws.cell(row=r, column=5 + j).fill = band or PatternFill(fill_type=None)
            put(ws, r, 5 + n, s_.get("basis", ""), fill=band, halign="center")
            put(ws, r, 6 + n, s_.get("source", ""), fill=band, wrap=True)
            url = s_.get("url")
            if url:
                cc = put(ws, r, 7 + n, url, fill=band)
                cc.hyperlink = url
                cc.font = Font(name=FONT, size=10, color=BLUE, underline="single")
            put(ws, r, 8 + n, s_.get("note", ""), fill=band, wrap=True)
            r += 1
        r += 2
        section(ws, r, 2, 4 + n, "Year-over-year change (live): growth % for amounts; change in points for series already in %")
        r += 1
        header(ws, r, 2, ["Company", "Metric", "Measure"] + quarters)
        r += 1
        for i, s_ in enumerate(series):
            src_r = 6 + i
            pts = s_.get("unit", "").strip() == "%"
            band = FILL_BAND if i % 2 else None
            put(ws, r, 2, f"=B{src_r}", fill=band)
            put(ws, r, 3, f"=C{src_r}", fill=band)
            put(ws, r, 4, "Δ pts" if pts else "YoY %", kind="muted", fill=band, halign="center")
            for j, q in enumerate(quarters):
                y, qq = qkey(q)
                prior = f"Q{qq} {y - 1}"
                if prior in quarters:
                    cur, pr = f"{CL(5 + j)}{src_r}", f"{CL(5 + quarters.index(prior))}{src_r}"
                    if pts:
                        put(ws, r, 5 + j, f'=IF(AND(ISNUMBER({cur}),ISNUMBER({pr})),{cur}-{pr},"")', fmt='+0.0;[Red]-0.0;0.0', fill=band)
                    else:  # growth is only meaningful against a positive base
                        put(ws, r, 5 + j, f'=IF(AND(ISNUMBER({cur}),ISNUMBER({pr})),IF({pr}>0,{cur}/{pr}-1,""),"")', fmt=F_PCT, fill=band)
                elif band:
                    ws.cell(row=r, column=5 + j).fill = band
            r += 1
        if bad:
            put(ws, r + 1, 2, f"Unrecognised quarter labels (expected 'Q<1-4> <YYYY>'): {', '.join(bad)} — no YoY computed for them.",
                italic=True, color="C00000")

    # -- Sources -------------------------------------------------------------------------
    def build_sources(self):
        ws = self.ws["Sources"]
        widths(ws, {"A": 2, "B": 8, "C": 60, "D": 14, "E": 12, "F": 34, "G": 40, "H": 18, "I": 7, "J": 11})
        title(ws, "Sources — the evidence behind the inputs",
              "Populated from src/lib/subsidy-math/sources.json when it exists. Basis: D disclosed · R reported · A assumption · C calculation.")
        src = self.sources
        if isinstance(src, dict):
            src = src.get("sources", [])
        if not src:
            put(ws, 5, 2, "No source register yet: src/lib/subsidy-math/sources.json was not found (or is empty) at build time.", bold=True)
            put(ws, 6, 2, "Until it lands, the Note / source column on Assumptions carries the citation for each input.",
                italic=True, color=GREY)
            return
        header(ws, 5, 2, ["ID", "Claim", "Value", "Period", "Source", "URL", "Location", "Basis", "Confidence"])
        ws.freeze_panes = "C6"
        r = 6
        for s in src:
            put(ws, r, 2, str(s.get("id", "")))
            put(ws, r, 3, s.get("claim", ""), wrap=True)
            v = s.get("value")
            if isinstance(v, (int, float)) and not isinstance(v, bool):
                put(ws, r, 4, v, kind="input", fmt="General")
            else:
                put(ws, r, 4, "" if v is None else str(v), wrap=True)
            put(ws, r, 5, s.get("period", ""))
            put(ws, r, 6, s.get("source", ""), wrap=True)
            url = s.get("url")
            if url:
                cc = put(ws, r, 7, url, color=BLUE, wrap=True)
                cc.hyperlink = url
                cc.font = Font(name=FONT, size=10, color=BLUE, underline="single")
            put(ws, r, 8, s.get("location", ""), wrap=True)
            put(ws, r, 9, s.get("basis", ""), halign="center")
            put(ws, r, 10, s.get("confidence", ""))
            r += 1

    # -- README ----------------------------------------------------------------------------
    def build_readme(self):
        ws = self.ws["README"]
        widths(ws, {"A": 2, "B": 28, "C": 15, "D": 15, "E": 15, "F": 15, "G": 15, "H": 15, "I": 15})
        meta_ = self.raw.get("_meta", {})
        put(ws, 1, 2, "The Economics of AI: Is the Hyperscaler Subsidy Model Sustainable?", bold=True, size=16)
        put(ws, 2, 2, "Subsidy Math — editable model workbook", bold=True, size=12, color=GREY)
        r = 4
        put(ws, r, 2, "Purpose", bold=True, size=12)
        r += 1
        for line in [
            "What does a hyperscaler earn on $100 of list-price frontier-model inference, and what does an up-front or recurring incentive",
            "(credits) do to that? Four routes: AWS Bedrock × Claude and Vertex × Claude (agent: the model provider is principal, the cloud keeps",
            "a channel fee) against Azure × OpenAI and Vertex × Gemini (principal: the cloud books revenue and pays for serving).",
            "This workbook mirrors the microsite engine (src/lib/subsidy-math/model.ts) formula for formula; verify_model.py checks they agree.",
        ]:
            put(ws, r, 2, line)
            r += 1
        r += 1
        put(ws, r, 2, "At a glance (live, at the Active assumptions)", bold=True, size=12)
        r += 1
        header(ws, r, 2, ["Route", "Y1 contribution at 0% incentive", "Y1 contribution at the active incentive", "Break-even incentive",
                          "5-yr NPV, one-time", "5-yr NPV, recurring", "Payback, one-time (months)"])
        ws.row_dimensions[r].height = 42
        r += 1
        for rid in self.routes:
            wc = self.wf_col[rid]
            put(ws, r, 2, self.short[rid], bold=True)
            links = [(3, f"=Waterfall_Y1!{wc}{self.wf_row['m0']}", F_USD, "m0"),
                     (4, f"=Waterfall_Y1!{wc}{self.wf_row['cloudContribution']}", F_USD, "y1"),
                     (5, f"=Waterfall_Y1!{wc}{self.wf_row['breakEven']}", F_PCT, "breakEven"),
                     (6, "=" + self.lt_hz[(rid, "one-time", 5, "npv")], F_USD, "npv5OneTime"),
                     (7, "=" + self.lt_hz[(rid, "recurring", 5, "npv")], F_USD, "npv5Recurring"),
                     (8, "=" + self.lt_hz[(rid, "one-time", 5, "paybackMonths")], F_MO, "payback5OneTime")]
            for cc, f, fmt, k in links:
                put(ws, r, cc, f, kind="link", fmt=fmt, halign="right")
                self.reg(f"readme|{rid}|{k}", ws, r, cc)
            r += 1
        put(ws, r, 2, '="Incentive "&TEXT(Inc_pct,"0%")&" of list ("&Inc_type&" selected) · $ per $100 of year-1 list spend"',
            italic=True, color=GREY)
        r += 2
        put(ws, r, 2, "How to use", bold=True, size=12)
        r += 1
        for line in [
            "1. Open Assumptions. Every input has Low / Base / High. Type your own number in the yellow 'Your value' cell (column G);",
            "    leave it blank to use Base. 'Active' (column H) is what every other sheet reads. Delete your entry to reset.",
            "2. Global selectors are at the top of Assumptions: incentive type (drop-down), incentive % of list, who funds it",
            "    (partner / model provider; the cloud funds the rest), lifetime years (1–5) and whether to count adjacent non-AI profit.",
            "3. Percentages are fractions: type 0.35 or 35%. Money is $ per $100 of year-1 list-price spend.",
            "4. Read the results: OneTime_vs_Recurring (headline), Waterfall_Y1, Subsidy_Grid, Lifetime, Adjacency, Equity, Sensitivity.",
            "5. Do not type over black or green cells — they are formulas and links.",
        ]:
            put(ws, r, 2, line)
            r += 1
        r += 1
        put(ws, r, 2, "Colour code", bold=True, size=12)
        r += 1
        legend = [("Blue text", "Hard-coded input (Low / Base / High from params.json, incentive levels, reported data)", BLUE, None),
                  ("Black text", "Formula", BLACK, None),
                  ("Green text", "Link to a cell on another sheet", GREEN, None),
                  ("Yellow fill", "A cell you may edit ('Your value', the incentive-type drop-down)", BLUE, FILL_YELLOW),
                  ("Grey text", "Not applicable to that route's structure (kept for completeness) or helper notes", GREY, None),
                  ("Green fill", "Key output", BLACK, FILL_KEY)]
        for lab, desc, colr, fill in legend:
            put(ws, r, 2, lab, color=colr, fill=fill, bold=True)
            put(ws, r, 3, desc)
            r += 1
        r += 1
        put(ws, r, 2, "Basis legend (Assumptions column J)", bold=True, size=12)
        r += 1
        for lab, desc in [("D", "Disclosed in a filing (10-K, 10-Q, S-1, 424B4)"), ("R", "Reported estimate (press, company statement, advisory benchmark)"),
                          ("A", "Our assumption"), ("C", "Our calculation on disclosed or reported figures")]:
            put(ws, r, 2, lab, bold=True, halign="center")
            put(ws, r, 3, desc)
            r += 1
        r += 1
        put(ws, r, 2, "Key caveats", bold=True, size=12)
        r += 1
        for line in [
            f"• Inputs are a draft ({meta_.get('version', '')}, as of {meta_.get('asOf', '')}) and will change as research lands; the Basis column says how firm each is.",
            "• Contribution = what the cloud keeps from the transaction less the costs it bears for it. It is not GAAP gross margin and carries no shared overhead.",
            "• Agent routes: Anthropic's S-1/A (p. F-22) says it is principal for Claude sold through cloud marketplaces; the cloud's take is the channel fee plus",
            "   margin on serving compute only to the extent it is incremental to Anthropic's existing take-or-pay commitments.",
            "• Credits are treated as contra-revenue in year 1 (one-time / commit) or every year (recurring), booked at the start of the year.",
            "• The lifetime engine runs at most 5 years; NPV discounts each year's contribution at the end of that year; payback assumes contribution accrues evenly.",
            "• Adjacent non-AI gross profit is excluded unless includeAdjacency = 1; the Adjacency sheet shows how much would be needed to justify the incentive.",
            "• Equity uplift is strategic value from a stake in the model provider, not operating income, and is shown separately.",
            "• model.ts is canonical. If this workbook and the microsite ever disagree, rebuild the workbook (command below).",
        ]:
            put(ws, r, 2, line)
            r += 1
        r += 1
        put(ws, r, 2, "Structure map", bold=True, size=12)
        r += 1
        for nm, desc in [
            ("Assumptions", "Every input: Low / Base / High / Your value / Active, unit, basis, note; global selectors; model.ts constants."),
            ("Waterfall_Y1", "Year-1 $100 waterfall for the four routes side by side, cloud and provider contribution, break-even incentive."),
            ("Subsidy_Grid", "Incentive levels 0–50%: customer price, net revenue, contribution, volume multiple, payback, NPVs."),
            ("Lifetime", "Year-by-year engine (route × incentive type × years 1–5), NPV, cumulative, payback, effective discount."),
            ("OneTime_vs_Recurring", "Headline: the active incentive as one-time vs recurring over 1, 3 and 5 years; customer price cliff."),
            ("Adjacency", "Attach ratio and adjacent gross profit needed for the incentive to break even over the lifetime."),
            ("Equity", "Strategic uplift from the cloud's stake in the model provider vs the subsidy it bears."),
            ("Sensitivity", f"One-at-a-time tornado for {self.short[self.sens_route]}: Y1 contribution, break-even incentive, 5-yr NPV."),
            ("Earnings", "Reported quarterly series (from earnings.json) with live year-over-year growth."),
            ("Sources", "Source register (from sources.json): claim, value, period, document, URL, location, basis, confidence."),
        ]:
            put(ws, r, 2, nm, bold=True)
            put(ws, r, 3, desc)
            r += 1
        r += 1
        put(ws, r, 2, "Version", bold=True, size=12)
        r += 1
        for lab, v in [("Parameters", f"params.json {meta_.get('version', '')} (as of {meta_.get('asOf', '')})"),
                       ("Built", self.built),
                       ("Engine constants", f"LIST = {M.LIST:g}; INFRA_SPLIT = {M.INFRA_SPLIT}; INCENTIVE_LEVELS = {M.INCENTIVE_LEVELS}"),
                       ("Sources / earnings", f"sources.json: {'yes' if self.sources else 'not yet'}; earnings.json: {'yes' if self.earnings else 'not yet'}"),
                       ("Regenerate", REGEN_CMD)]:
            put(ws, r, 2, lab, bold=True)
            put(ws, r, 3, v)
            r += 1


def _chart_hygiene(ch):
    ch.roundedCorners = False
    if ch.legend is not None:
        ch.legend.position = "b"
        ch.legend.overlay = False
    if ch.title is not None:
        ch.title.overlay = False
    for ax in (ch.x_axis, ch.y_axis):
        ax.delete = False
        if ax.title is not None:
            ax.title.overlay = False


# ---------------------------------------------------------------------------------------
# LibreOffice recalculation + cached-value injection
# ---------------------------------------------------------------------------------------
def libreoffice_recalc(src: Path, workdir: Path, timeout: int = 300) -> Path:
    """Recalculate `src` with LibreOffice headless; returns the recalculated copy in workdir/recalc/."""
    soffice = shutil.which("soffice") or "/usr/bin/soffice"
    if not Path(soffice).exists():
        raise RuntimeError("LibreOffice (soffice) not found; install it or pass --no-recalc")
    workdir = Path(workdir)
    outdir = workdir / "recalc"
    outdir.mkdir(parents=True, exist_ok=True)
    out = outdir / Path(src).name
    if out.exists():
        out.unlink()
    env = dict(os.environ)
    env["SAL_USE_VCLPLUGIN"] = "svp"
    profile = (workdir / "lo_profile").resolve()
    cmd = [soffice, f"-env:UserInstallation={profile.as_uri()}", "--headless", "--norestore", "--nologo", "--calc",
           "--convert-to", "xlsx:Calc MS Excel 2007 XML", "--outdir", str(outdir), str(src)]
    res = subprocess.run(cmd, env=env, capture_output=True, text=True, timeout=timeout)
    if not out.exists():
        raise RuntimeError(f"LibreOffice did not write {out}\nstdout: {res.stdout}\nstderr: {res.stderr}")
    return out


_ERRORS = {"#NULL!", "#DIV/0!", "#VALUE!", "#REF!", "#NAME?", "#NUM!", "#N/A"}


def inject_cached_values(xlsx: Path, recalculated: Path) -> int:
    """Write LibreOffice's computed values into the openpyxl-written file as cached <v> values."""
    vals = load_workbook(recalculated, data_only=True)
    with zipfile.ZipFile(xlsx) as z:
        infos = z.infolist()
        parts = {i.filename: z.read(i.filename) for i in infos}
    wbxml = parts["xl/workbook.xml"].decode("utf-8")
    rels = parts["xl/_rels/workbook.xml.rels"].decode("utf-8")
    rid_target = dict(re.findall(r'<Relationship[^>]*Id="([^"]+)"[^>]*Target="([^"]+)"', rels))
    rid_target.update({k: v for v, k in re.findall(r'<Relationship[^>]*Target="([^"]+)"[^>]*Id="([^"]+)"', rels)})
    n = 0
    for name, rid in re.findall(r'<sheet[^>]*name="([^"]+)"[^>]*r:id="([^"]+)"', wbxml):
        target = rid_target[rid].lstrip("/")
        path = target if target.startswith("xl/") else f"xl/{target}"
        ws = vals[html.unescape(name)]
        xml = parts[path].decode("utf-8")

        def repl(m):
            nonlocal n
            coord, attrs, formula = m.group(1), m.group(2), m.group(3)
            v = ws[coord].value
            n += 1
            if isinstance(v, bool):
                return f'<c r="{coord}"{attrs} t="b"><f>{formula}</f><v>{int(v)}</v></c>'
            if isinstance(v, (int, float)):
                return f'<c r="{coord}"{attrs}><f>{formula}</f><v>{repr(float(v)) if isinstance(v, float) else v}</v></c>'
            if v is None:
                return f'<c r="{coord}"{attrs} t="str"><f>{formula}</f><v></v></c>'
            s = str(v)
            if s in _ERRORS:
                return f'<c r="{coord}"{attrs} t="e"><f>{formula}</f><v>{s}</v></c>'
            return f'<c r="{coord}"{attrs} t="str"><f>{formula}</f><v>{html.escape(s, quote=False)}</v></c>'

        xml = re.sub(r'<c r="([A-Z]+[0-9]+)"((?:\s+(?!t=)[a-z]+="[^"]*")*)><f>(.*?)</f><v\s*/?>(?:</v>)?</c>', repl, xml)
        parts[path] = xml.encode("utf-8")
    tmp = Path(str(xlsx) + ".tmp")
    with zipfile.ZipFile(tmp, "w", zipfile.ZIP_DEFLATED) as z:
        for i in infos:
            z.writestr(i, parts[i.filename], compress_type=zipfile.ZIP_DEFLATED)
    tmp.replace(xlsx)
    return n


# ---------------------------------------------------------------------------------------
def _load_optional(path: Path):
    if path and Path(path).exists():
        return json.loads(Path(path).read_text(encoding="utf-8"))
    return None


def build_book(params=M.PARAMS_JSON, sources=SOURCES_JSON, earnings=EARNINGS_JSON, built=None) -> Book:
    raw = M.load_raw(Path(params))
    M.model_inputs(raw)  # validates required keys
    return Book(raw, _load_optional(sources), _load_optional(earnings), built).build()


def main(argv=None):
    ap = argparse.ArgumentParser(description="Build the Subsidy Math workbook.")
    ap.add_argument("--params", default=str(M.PARAMS_JSON))
    ap.add_argument("--sources", default=str(SOURCES_JSON))
    ap.add_argument("--earnings", default=str(EARNINGS_JSON))
    ap.add_argument("--out", default=str(OUT_XLSX))
    ap.add_argument("--no-recalc", action="store_true", help="skip the LibreOffice pass that stores cached values")
    a = ap.parse_args(argv)
    book = build_book(a.params, a.sources, a.earnings)
    out = Path(a.out)
    out.parent.mkdir(parents=True, exist_ok=True)
    book.wb.save(out)
    n_formulas = sum(1 for ws in book.wb for row in ws.iter_rows() for c in row
                     if isinstance(c.value, str) and c.value.startswith("="))
    msg = f"wrote {out.relative_to(ROOT) if out.is_relative_to(ROOT) else out} — {len(book.wb.sheetnames)} sheets, {n_formulas} formulas, {len(book.names)} names"
    if not a.no_recalc:
        with tempfile.TemporaryDirectory(prefix="subsidy-math-recalc-") as td:
            rec = libreoffice_recalc(out, Path(td))
            n = inject_cached_values(out, rec)
        msg += f"; cached values stored for {n} formula cells (LibreOffice)"
    print(msg)


if __name__ == "__main__":
    main()
