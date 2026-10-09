---
name: git-commit
description: How to commit and push in granat-nauki when the user explicitly asks ("закоммить", "запушь", "commit", "push") — full lint + typecheck + build of both packages first, what to stage and never stage, best-practice commit messages, pushing to main. Use only on an explicit request in the current message; never commit on your own initiative.
---

# Committing in granat-nauki

Commit or push **only when the current user message asks for it**. The `guard.py` hook enforces this: `git commit` / `git push` are allowed only during the turn in which the user's message asked to commit or push (`git-intent.py` sets a per-turn flag, the Stop hook clears it). If the hook denies, don't work around it — ask the user to say it explicitly. Force push is always blocked.

## 1. Gate: checks and build in both packages

Always run all of these, in both `main/` and `admin/`, regardless of which files changed — before staging anything:

```bash
cd main  && npm run check && npm run build     # typecheck + eslint + stylelint, then next build
cd admin && npm run check && npm run build     # typecheck + eslint, then tsc -b && vite build
```

- `check` = `typecheck` + `lint` (+ `lint:css:check` in main). Nothing is auto-fixed.
- Builds run on the host: `main/.next` and `admin/dist` are gitignored, and the dev container keeps its own `.next` volume, so the running dev server is not affected.
- **Any failure → no commit, no push.** Report which command failed with the relevant output (first errors, counts), and stop. Don't fix code as part of the commit flow — the user decides: they fix it, ask you to fix it, or explicitly say "коммить всё равно" (only then commit despite failures, and say so in the report).

## 2. Stage

1. `git status --short`, `git diff --stat`, `git diff --cached --stat`. The user often stages things themselves — respect what's staged, don't unstage.
2. Decide what goes in:
   - "закоммить всё" → all changes shown by status.
   - "закоммить X" → only the files for X; leave the rest.
   - Unclear grouping → show the grouped list and ask before staging.
3. **Never stage**: `.env*` (except `.env.example`), `TODO.md`, `HELPER.md`, `docs/`, `.agents/`, `main/src/generated/`, `node_modules/`, `.next/`, `dist/`, `*.tsbuildinfo` changes caused by the build. If one shows up, stop and tell the user.
4. Stage by explicit paths (`git add path1 path2`); `git add -A` only when the user said "всё".
5. If the staged changes are unrelated to each other, propose splitting them into separate commits.

## 3. Commit message (best practice)

```
Add session-based auth for the admin API

Admin requests now authenticate with a DB-backed session cookie
instead of nothing. Sessions slide for 7 days of activity with a
30-day hard cap, and role changes revoke all sessions immediately.

- add Session and AccessRequest models with an init migration
- add signin/signup/signout/me route handlers behind withErrorHandling
- check access in the DAL (requireUser/requireAdmin) in every handler
```

- **Subject**: English, imperative mood ("Add", "Fix", "Remove", "Rename", "Update"), capitalized, no trailing period, ≤ 50 characters (hard limit 72). It completes "If applied, this commit will …".
- **Blank line** between subject and body.
- **Body** for anything beyond a trivial change: explain **what changed and why**, not how (the diff shows how). Wrap at 72 characters. A short `-` bullet list for the individual changes is fine after the explanation.
- Mention user-visible effects, migrations, breaking changes, and follow-ups ("Admin pages still call the old API; switched in a follow-up").
- One logical change per commit. A trivial change (typo, single rename) may be subject-only.
- **No `Co-Authored-By` or any other attribution trailer** — the user doesn't want it.

Use a heredoc so line breaks survive:

```bash
git commit -F - <<'EOF'
Add session-based auth for the admin API

Admin requests now authenticate with a DB-backed session cookie ...
EOF
```

Show the message to the user in the report.

## 4. Push

Only if asked ("запушь", "закоммить и запушь"): `git push` to the current branch's upstream (`origin/main`). The user works directly on `main` — no branches or PRs unless asked. Push only after the gate in step 1 passed and the commit succeeded.

## 5. Report

Commit hash + full message, what was left unstaged, gate results (all passed / what failed and why it was committed anyway), whether it was pushed.

## Don'ts

- No `--amend`, `rebase`, `reset --hard`, `--no-verify`, or git config changes unless the user asks for exactly that.
- Don't commit on your own initiative after finishing a task — offer instead ("закоммитить?").
