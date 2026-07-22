---
name: run-frontend
description: Launch and verify the Next.js frontend for granat-nauki (child psychologist / tutoring site) via Docker. Use when asked to run, start, preview, or screenshot the site, or to confirm a frontend change works in the browser.
---

# Running the granat-nauki frontend

Project root is `/home/levis/.vscode-server/projects/granat-nauki`, orchestrated by the top-level `docker-compose.yaml`. The `frontend` service builds `frontend/Dockerfile` (node:24-alpine), bind-mounts the repo in, and runs `npm run dev` (Turbopack) on port 3000 inside the container. `frontend` `depends_on: backend` in the compose file.

## Start

Home page content is static locale JSON, not an API call — the frontend renders fine without the backend for design/preview work. Start frontend only, skipping the backend dependency:

```bash
cd /home/levis/.vscode-server/projects/granat-nauki
docker compose up -d --no-deps frontend
timeout 60 bash -c 'until curl -sf http://localhost:3000 >/dev/null; do sleep 2; done' && echo READY
```

If you need pages backed by the NestJS API (blog articles, reviews, contact form, `NEXT_PUBLIC_API_URL=http://localhost:4000` in `frontend/.env`), bring the backend up too — note there's no Postgres service in this compose file yet, so `backend` alone may not serve real data either:

```bash
docker compose up -d frontend backend
```

- First-ever `up` on this image also runs `npm install` inside the build (~60s, no cache) before the container even starts — the `docker compose up -d` command itself blocks for that. After the image is built once, subsequent `up`/`stop`/`up` cycles reuse the cached image and only pay Turbopack's own first-compile cost.
- First compile inside the container can take 20-30s (cold `node_modules`, no build cache) — poll, don't `sleep`.
- Container names are pinned explicitly in `docker-compose.yaml` via `container_name:` — `granat-nauki_backend` and `granat-nauki_frontend` (underscore separator, no Compose-generated `-1` suffix). Image names are still the Compose defaults (`granat-nauki-backend` / `granat-nauki-frontend`, dash) since `container_name:` only affects the container, not the built image — that mismatch between image and container naming is expected, not a bug. If a container ever comes up under a different name, it means the pinned `container_name` in the compose file was removed or overridden — check `docker compose config` against the file rather than assuming Compose's auto-naming.
- Default locale route is `/ru` or `/en` — home page is `http://localhost:3000/ru`.
- Logs: `docker compose logs -f frontend`. Check here before assuming a change is broken — Turbopack compile errors show up as a 500 with a stack trace in the log, not always in `curl`'s output.
- The bind mount (`./frontend:/app`, with `/app/node_modules` and `/app/.next` as anonymous volumes) means edits on the host are picked up live — no rebuild needed for source changes. A rebuild (`docker compose build frontend`) is only needed after changing `package.json` or the `Dockerfile`.

## Stop

```bash
docker compose stop frontend
```

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

- `NODE_ENV=development` is baked into the Dockerfile's `CMD`/compose env — don't override it.
- The cookie-based theme (`THEME` constant) means a fresh `chromium-cli` session always starts in light mode unless a cookie is set first.
- If port 3000 is already bound on the host by a stray non-Docker `next dev` process from a previous session, `docker compose up` will fail to bind — free it first with `lsof -ti:3000 -sTCP:LISTEN | xargs -r kill` before starting the container.
