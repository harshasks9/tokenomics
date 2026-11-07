#!/usr/bin/env bash
# Download Anthropic, PBC's S-1 and S-1/A (and the EDGAR filing list) into a work directory.
# Requires network access to www.sec.gov and data.sec.gov. SEC asks automated clients to
# identify themselves; set SEC_USER_AGENT to "<organization> <contact>" for your team.
set -euo pipefail
WORK="${1:?usage: fetch_filings.sh <workdir>}"
UA="${SEC_USER_AGENT:-tokenomics-research (research use)}"
mkdir -p "$WORK"
BASE=https://www.sec.gov/Archives/edgar/data/2130357
curl -sSf -A "$UA" -o "$WORK/s1.htm"  "$BASE/000162828026067168/anthropicpbc-sx1.htm"
curl -sSf -A "$UA" -o "$WORK/s1a.htm" "$BASE/000162828026068676/anthropicpbc-sx1ax1.htm"
curl -sSf -A "$UA" -o "$WORK/submissions.json" "https://data.sec.gov/submissions/CIK0002130357.json"
python3 -I - "$WORK/submissions.json" <<'PY'
import json, sys
d = json.load(open(sys.argv[1]))
r = d["filings"]["recent"]
for i in range(len(r["form"])):
    if r["form"][i] in ("S-1", "S-1/A", "DRS", "DRS/A", "424B4"):
        print(r["filingDate"][i], r["form"][i], r["accessionNumber"][i], r["primaryDocument"][i])
PY
echo "saved to $WORK"
