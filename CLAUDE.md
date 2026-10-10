# CLAUDE.md

"Гранат науки" (Granat Nauki): a website for a child psychologist (school preparation, tutoring) plus an admin panel for its content.

## How to work in this repo

- **The user writes the code.** Default mode is advisory: explain, review, give snippets in chat. Edit files only on an explicit request for that specific task ("сделай", "поправь сам"). Permission for one change does not carry over to the next. "Давай сделаем X" means "walk me through X", not "implement X".
- Reading files, `tsc`, `eslint`, `curl` against the dev server: fine without asking. Rebuilding containers, writing to the DB, `pnpm install` / `pnpm add`: ask first.
- Talk to the user in Russian.

## Layout

```
main/                Next.js 16 (App Router): public site + the whole server side (DB, admin API, auth)
admin/               Vite + React admin SPA, Feature-Sliced Design
packages/contracts/  @granat/contracts: what main and admin share (limits, zod schemas, error codes, DTO types)
docs/                design audit and site brief
```

Project plan and decisions made so far: [TODO.md](TODO.md) (local file, not in git).

There is no separate backend; everything server-side lives in `main/`.

pnpm workspace (`pnpm-workspace.yaml`): one `pnpm-lock.yaml` and one `node_modules/.pnpm` at the root, pnpm version pinned in the root `package.json` (`packageManager`). Shared dependency versions (`zod`, `typescript`) live in the `catalog:` and are referenced as `"catalog:"`; local packages as `"workspace:*"`. pnpm is strict: a package sees only what its own `package.json` declares, so "Cannot find module" after a move means a missing dependency, not a broken install. Install scripts run only for packages allowed in `allowBuilds`. The `main` package is named `frontend` (`pnpm --filter frontend ...`).

## Running

Everything runs through docker compose from the repo root:

```bash
docker compose up -d --build -V main   # main + db
docker compose up -d                   # all: main :3000, admin :3001, db :5432, dozzle (logs) :8888
docker compose logs -f main
```

The build context is the repo root (`main/Dockerfile`, `admin/Dockerfile`, root `.dockerignore`); inside the containers the repo lives at `/repo`. `./main` (or `./admin`) and `./packages` are bind-mounted, every `node_modules` is an anonymous volume. Rebuild with `-V` only after changing a `package.json`, `pnpm-lock.yaml`, `pnpm-workspace.yaml` or a `Dockerfile`. Site: `http://localhost:3000/ru`, admin: `http://localhost:3001`.

Checks (in `main/`, `admin/` or `packages/contracts/`):

```bash
pnpm check              # everything below, nothing auto-fixed
pnpm typecheck          # tsc --noEmit (admin: tsc -b --noEmit)
pnpm lint               # eslint (not in contracts)
pnpm lint:css:check     # stylelint, main only (lint:css runs it with --fix)
pnpm build              # main and admin; required to pass, with check, before any commit
```

From the root, `pnpm -r --no-bail check` runs it in every package. Without `--no-bail` pnpm kills the other packages' scripts (SIGKILL) as soon as one fails.

No tests yet.

## main/ (Next.js)

- `src/app/[locale]/*`: site pages, i18n via `next-intl` (`src/i18n`, strings in `src/locales`). `src/proxy.ts` is the former middleware (Next 16) and does i18n **only**, never auth.
- `src/app/api/*`: Route Handlers for the admin. Server Actions don't fit the admin (it's a separate SPA); they're fine for public-site forms.
- `src/lib/db.ts`: the Prisma 7 client (`@prisma/adapter-pg`), generated into `src/generated/prisma` (never edit by hand).
- `src/lib/http.ts`: every handler is wrapped in `withErrorHandling`: `Sec-Fetch-Site` CSRF check on non-GET, `AppError` → JSON response, `Cache-Control: no-store`. Request bodies go through `parseBody(request, zodSchema)`.
- Errors: `throw new AppError(API_STATUSES.X)` (`src/lib/errors.ts`; the codes are API surface and belong in `@granat/contracts`).
- `src/lib/auth/`: DB sessions + httpOnly cookie (`__Host-session` in prod, `session` in dev), not JWT; argon2id passwords. Access is checked in the DAL (`dal.ts`) inside every handler: `getCurrentSession()` / `requireUser()` (401) / `requireAdmin()` (403). Only DTOs without `passwordHash` leave the server.
- Server-side modules start with `import 'server-only'`.
- Public pages read the DB directly in server components, not through our own API.
- UI: design-system primitives in `src/ui`, composite components in `src/components`, styles are SCSS modules.

Prisma (config: `main/prisma7.config.ts`). `DATABASE_URL` points at host `db`, so anything that touches the DB runs inside the container:

```bash
pnpm prisma format && pnpm prisma validate && pnpm prisma generate   # on the host, in main/
docker compose exec main pnpm prisma migrate dev --name <name>       # from the repo root
docker compose exec -e ADMIN_EMAIL=... -e ADMIN_PASSWORD=... main pnpm prisma db seed
```

Admin credentials are never stored in `.env`. Details: the `prisma-workflow` skill.

## packages/contracts (@granat/contracts)

- Anything both `main` and `admin` need goes here instead of being duplicated: validation limits, zod schemas of request bodies and their `z.infer` types, `API_STATUSES` and error codes, the error body type, DTO and response types (`UserDto`, `MeResponse`), enums as `as const` arrays (`ROLES`).
- Exported as TypeScript source (`exports` → `src/index.ts`), no build step: Next compiles it through `transpilePackages`, Vite and `tsc` read it directly. Every export goes through `src/index.ts`.
- Runs in the browser and on the server: no `server-only`, Prisma, `next/*`, Node or DOM APIs. `tsconfig` has no DOM lib and is at least as strict as admin's: `import type` for types (`verbatimModuleSyntax`), no `enum` / `namespace` (`erasableSyntaxOnly`).
- The server proves it honours a contract with `satisfies` (`Response.json({ user } satisfies MeResponse)`), so a drifting `select` breaks `tsc` instead of the admin.

## admin/ (Vite SPA)

- FSD: `app → pages → widgets → features → entities → shared`, imports only go downward, a slice is imported through its `index.ts`, aliases `@app @pages @widgets @features @entities @shared`. ESLint enforces the boundaries.
- State: Redux Toolkit; routing: `react-router`.
- Requests go to relative `/api/...`; Vite `server.proxy` forwards them to `main` (`API_PROXY_TARGET`, `http://main:3000` in docker).
- `@granat/contracts` is a regular package, importable from any FSD layer.

## Skills

Before touching code, load the matching skill from `.claude/skills/`:
- `frontend-conventions`: any code in `main/src`
- `api-conventions`: Route Handlers and services in `main/src/app/api`, `main/src/lib`
- `prisma-workflow`: schema, migrations, seed
- `admin-conventions`: any code in `admin/src`
- `design-system`: site styling and layout
- `i18n`: any user-visible text, new pages, metadata
- `content-copy`: the wording itself: voice, dashes, forbidden phrasing
- `run-app`: running the site and admin, checking the API
- `git-commit`: committing and pushing, only when the user asks

Third-party skills (in `.agents/skills/`, symlinked into `.claude/skills/`) are loaded **together** with the project ones:
- Design, layout, visual fixes to pages and components → `design-system` + `design-taste-frontend`. The project's `design-system` (tokens, fonts, pomegranate motif) overrides the generic advice in `design-taste-frontend`.
- Prisma → `prisma-workflow` + the relevant reference: `prisma-client-api` (queries, filters, transactions), `prisma-cli` (commands, migrations), `prisma-upgrade-v7` (errors and v6-style snippets). Where they disagree, `prisma-workflow` wins.

## Hooks

Configured in `.claude/settings.json`, scripts in `.claude/hooks/`. They only react to Claude's actions, not to the user's edits.
- `guard.py` (before tools): blocks reading or editing `.env`, editing `main/src/generated/**` and committed migrations, and running `prisma migrate reset`, data-losing `db push`, `docker compose down -v`, `docker volume rm/prune`, force push. If blocked, ask the user to do it.
- `git-intent.py`: `git commit` / `git push` are allowed only in the turn where the user's message asks to commit or push (UserPromptSubmit sets a flag, Stop clears it). Follow the `git-commit` skill.
- `check-locales.py` (after edits): ru/en key parity and dash count for `main/src/locales/*.json`.
- `check-code.py` (after edits): eslint / stylelint / `prisma validate` on the edited file only, report-only. Fix what it reports in files you changed; pre-existing issues in untouched lines are the user's call.
- On session start: `docker compose ps`. On notifications: a Windows balloon via `powershell.exe`.
