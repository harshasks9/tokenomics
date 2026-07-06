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
4. **Never push to main, never force-push.** Push your branch and hand it off
   for merging.
5. **Before handing off**, run `npm run build` and confirm it passes with your
   route in the output list.
