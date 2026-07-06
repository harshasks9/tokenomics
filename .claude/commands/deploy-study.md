---
description: Merge the current study branch into main and push (gated by build)
---

Read the "Study workflow commands" section of AGENTS.md at the repo root and
execute the **"Deploy study"** recipe exactly for the currently checked-out
study branch.

AGENTS.md is the single source of truth for this workflow — run its safety
checks in order, STOP on the first failure as it instructs (including
escalating merge conflicts in shared files instead of resolving them
yourself), and only push after every gate passes. Do not improvise beyond
what it specifies.
