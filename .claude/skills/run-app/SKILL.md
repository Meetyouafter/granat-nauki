---
name: run-app
description: Launch and verify granat-nauki via Docker — the Next.js site + API (main, :3000), the admin SPA (admin, :3001) and Postgres. Use when asked to run, start, preview, or screenshot the site or the admin panel, to sign in to the admin, to hit an API endpoint, or to confirm a change works in the browser.
---

# Running granat-nauki

Project root is `/home/levis/.vscode-server/projects/granat-nauki`, orchestrated by the top-level `docker-compose.yaml`. There is no separate backend: the `main` service (Next.js, `main/Dockerfile`, node:24-alpine) is both the site and the server (DB access, API for the admin, auth). It runs `pnpm dev` on port 3000 and `depends_on` the `db` service (Postgres 18, healthcheck-gated). The admin SPA is the `admin` service on port 3001.

## Start

```bash
cd /home/levis/.vscode-server/projects/granat-nauki
docker compose up -d main      # also starts db
timeout 60 bash -c 'until curl -sf http://localhost:3000/ru >/dev/null; do sleep 2; done' && echo READY
```

Add `admin` to the command if the admin panel is needed too (`http://localhost:3001`, its `/api` is proxied to `main`).

- First-ever `up` on this image also runs `pnpm install --frozen-lockfile --filter <pkg>...` inside the build (pnpm itself comes from corepack, version from `packageManager` in the root `package.json`) before the container even starts — the `docker compose up -d` command itself blocks for that. After the image is built once, subsequent `up`/`stop`/`up` cycles reuse the cached image and only pay the first-compile cost.
- First compile inside the container can take 20-30s (cold `node_modules`, no build cache) — poll, don't `sleep`.
- Container names are pinned via `container_name:` — `granat-nauki_main`, `granat-nauki_admin`, `granat-nauki_db`, `granat-nauki_dozzle`. Image names stay Compose defaults (`granat-nauki-main`, dash) — that mismatch is expected.
- Default locale route is `/ru` or `/en` — home page is `http://localhost:3000/ru`.
- Logs: `docker compose logs -f main` or Dozzle at `http://localhost:8888`. Check here before assuming a change is broken — compile errors show up as a 500 with a stack trace in the log, not always in `curl`'s output.
- Build context is the repo root, the repo lives at `/repo` in the container. Bind mounts `./main:/repo/main` and `./packages:/repo/packages` (with `/repo/node_modules`, `/repo/main/node_modules`, `/repo/packages/contracts/node_modules` and `/repo/main/.next` as anonymous volumes) mean edits on the host, including `@granat/contracts`, are picked up live — no rebuild needed for source changes. A rebuild (`docker compose up -d --build -V main`) is only needed after changing a `package.json`, `pnpm-lock.yaml`, `pnpm-workspace.yaml` or the `Dockerfile`; `-V` matters, otherwise the old `node_modules` volumes stay.

## Stop

```bash
docker compose stop main admin
```

## Admin panel

```bash
docker compose up -d main admin
timeout 60 bash -c 'until curl -sf http://localhost:3001 >/dev/null; do sleep 2; done' && echo READY
```

- `http://localhost:3001/` is sign-in, `/signup`, then `/dashboard`, `/faq`, `/reviews`, `/reviews/:id` (`admin/src/shared/config/paths.ts`).
- The browser only talks to `:3001`; Vite proxies `/api/*` to `main` (`API_PROXY_TARGET=http://main:3000`). That keeps requests same-origin, so the session cookie and the `Sec-Fetch-Site` CSRF check work. Never point the admin at `http://localhost:3000` directly — every POST will get 403 `CSRF`.
- Signing in needs an admin account. If there is none, the user creates it with the seed (see [[prisma-workflow]]); ask them for credentials, don't invent or seed one yourself. A fresh signup gets role `USER` and sees 403 on content endpoints — that's by design.
- Same layout for `admin` (`./admin:/repo/admin` + `./packages`, `node_modules` as anonymous volumes): after changing `admin/package.json` or the lockfile, `docker compose up -d --build -V admin`.

## API by hand

Health (checks the DB connection): `curl -s http://localhost:3000/api/health` → `{"ok":true}`.

Authenticated calls go through a cookie jar. Non-GET requests need `Sec-Fetch-Site: same-origin` or they get 403 `CSRF`. Dev cookie name is `session`.

```bash
curl -i -c /tmp/jar -H 'Sec-Fetch-Site: same-origin' -H 'Content-Type: application/json' \
  -d '{"email":"…","password":"…"}' http://localhost:3000/api/auth/signin   # 204
curl -s -b /tmp/jar http://localhost:3000/api/auth/me                       # {"user":{…,"role":"ADMIN"}}
```

Expected failures, useful as checks: no cookie → 401 `UNAUTHORIZED`; `USER` on admin content → 403 `FORBIDDEN`; wrong password and unknown email → the same 401 `INVALID_CREDENTIALS`.

Use `docker compose down` only if you also want to remove the network/containers entirely (rare for iterative preview work — `stop` is enough and keeps the anonymous `node_modules`/`.next` volumes warm for the next `up`).

## Drive it

Use `chromium-cli` (or the project's available browser-automation tool) against `http://localhost:3000/ru`:

```
nav http://localhost:3000/ru
wait-for text=Гранат
screenshot
console --errors
```

Check both `data-theme="light"` and `data-theme="dark"` (theme switcher in the header) and a mobile viewport when reviewing layout/design changes — this project has a light/dark token system (see [[design-system]]) and a mobile breakpoint at 768px (`mixins.mobile`).

## Gotchas

- `Cannot find module '@granat/contracts'` in a container → `./packages` is not mounted or the image predates the workspace; `ERR_PNPM_OUTDATED_LOCKFILE` during the build → someone changed a `package.json` without running `pnpm install` on the host.
- `NODE_ENV=development` is baked into the Dockerfile's `CMD`/compose env — don't override it.
- The cookie-based theme (`THEME` constant) means a fresh `chromium-cli` session always starts in light mode unless a cookie is set first.
- If port 3000 is already bound on the host by a stray non-Docker `next dev` process from a previous session, `docker compose up` will fail to bind — free it first with `lsof -ti:3000 -sTCP:LISTEN | xargs -r kill` before starting the container.
