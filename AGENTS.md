<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Branching rules — read BEFORE writing any code

Several people ship microsites from this repo. Stale branches have repeatedly
shipped builds that erased other people's live work. Follow these rules exactly:

1. **Always start from the latest main.** Before creating a branch or touching
   any file, run:
   `git fetch origin && git checkout main && git pull origin main`
   Then create your working branch from that up-to-date main.
2. **Never reuse or branch from an old branch.** One task = one fresh branch
   cut from today's main. If a branch of yours was already merged, it is dead —
   do not push more commits to it.
3. **Stay in your lane.** A new microsite means new files only:
   `src/app/<your-site>/`, `src/components/<your-site>/`, `src/lib/<your-site>…`,
   `public/<your-site>/`. Only append to shared files (`src/proxy.ts`,
   `vercel.json`, `src/app/page.tsx`) — never rewrite or remove entries that
   belong to other sites (existing routes, crons, rewrites, homepage tiles).
4. **Never push directly to main, never force-push.** Main only changes through
   the "Deploy study" command below.
5. **Before deploying**, run `npm run build` and confirm it passes with your
   route in the output list.

# Study workflow commands

When the user says one of these phrases, execute the corresponding recipe
exactly. If any safety check fails, STOP and tell the user what to do —
do not improvise around a failed check.

## "Start new study <name>"

1. Safety check: `git status --porcelain` must print nothing. If there are
   uncommitted changes, STOP and ask the user whether to commit them to the
   current branch (if they belong to the study being worked on) or discard
   them. Never carry uncommitted changes onto a new branch.
2. `git fetch origin && git checkout main && git pull origin main`
3. `git checkout -b study/<kebab-case-name>` — always cut from the main you
   just pulled, never from another branch.
4. Confirm to the user: branch name and the main commit it was cut from
   (`git log -1 --oneline`).

## "Resume study <name>"

1. Safety check: `git status --porcelain` must print nothing (same rule as
   above — resolve uncommitted work first).
2. `git fetch origin`
3. `git checkout study/<name>` (use `git branch -a` to find it; if it only
   exists on the remote, `git checkout -b study/<name> origin/study/<name>`).
4. Bring it up to date with main: `git merge origin/main`.
   - If this produces conflicts, STOP. Do not resolve conflicts in shared
     files (`src/proxy.ts`, `vercel.json`, `src/app/page.tsx`,
     `package-lock.json`) yourself — show the user the conflicting files and
     ask them to get Kiran to resolve the merge.
5. Confirm to the user which branch is active and that it now contains the
   latest main.

## "Deploy study"

1. Safety checks, in order — STOP on the first failure:
   a. You are on a `study/*` branch (`git branch --show-current`), not main.
   b. `git status --porcelain` is empty — all work committed.
   c. `git fetch origin && git merge origin/main` succeeds without conflicts
      (conflicts → same rule as Resume: stop and escalate to Kiran).
   d. `npm run build` passes, and the study's route appears in the build's
      route list.
2. `git push -u origin study/<name>` — the branch itself, for the record.
3. Merge to main:
   `git checkout main && git pull origin main && git merge --no-ff study/<name>`
4. `git push origin main`
5. Confirm to the user: the merge commit hash, and remind them the site
   deploys automatically from main via Vercel (check aitokenomics.app in a
   few minutes).

After a study is deployed its branch is dead — the next piece of work starts
with "Start new study", never by committing more to the deployed branch.
