#!/bin/sh
# Rebuild src/lib/atlas/data/*.json from the raw research batches in ./research.
# Order matters: merge → model (theses, mapping, audit adjustments) → judgments → debates → scenarios → synthesis.
set -e
cd "$(dirname "$0")"
python3 merge.py && python3 model.py && python3 judgments.py && python3 debates.py && python3 scenarios.py && python3 synthesis.py
