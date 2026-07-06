---
description: Check out an existing study branch and sync it with latest main
argument-hint: <study-name>
---

Read the "Study workflow commands" section of AGENTS.md at the repo root and
execute the **"Resume study <name>"** recipe exactly, with the study name:
$ARGUMENTS

AGENTS.md is the single source of truth for this workflow — follow its steps
and safety checks as written, and STOP on any failed check as it instructs
(including escalating merge conflicts in shared files instead of resolving
them yourself). Do not improvise beyond what it specifies.
