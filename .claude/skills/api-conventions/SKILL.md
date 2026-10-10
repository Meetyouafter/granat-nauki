---
name: api-conventions
description: Server-side conventions for granat-nauki Route Handlers and services in main/ — withErrorHandling, zod via parseBody, AppError + API_STATUSES, auth checks through the DAL (requireUser/requireAdmin), DTOs, server-only. Use when writing, editing or reviewing anything under main/src/app/api or main/src/lib, or when adding a new endpoint for the admin panel.
---

# granat-nauki API conventions

There is no separate backend: the admin SPA talks to Route Handlers in `main/src/app/api/**`. Reference implementation: `src/app/api/auth/*` + `src/lib/auth/*` + `src/lib/http.ts`.

## Layers

```
app/api/<name>/route.ts   HTTP only: parse body, call service, set cookies, build Response
@granat/contracts         request-body zod schemas + z.infer types, limits, API_STATUSES,
                          DTO/response types: everything the admin also needs
                          (packages/contracts/src, exported through index.ts)
lib/<domain>/schemas.ts   server-only schemas the admin never sees (if any)
lib/<domain>/<service>.ts business logic: knows nothing about Request/Response/cookies,
                          returns data or throws AppError (see lib/auth/auth.ts)
lib/db.ts                 the only Prisma client — import { prisma } from '@/lib/db'
```

Every module under `lib/` that touches the DB, secrets or cookies starts with `import 'server-only'`.

## Handler template

```ts
import { createThingSchema, type ThingResponse } from '@granat/contracts';

import { requireAdmin } from '@/lib/auth/dal';
import { parseBody, withErrorHandling } from '@/lib/http';
import { createThing } from '@/lib/things/things';

export const POST = withErrorHandling(async (request) => {
  await requireAdmin();
  const body = await parseBody(request, createThingSchema);
  const thing = await createThing(body);
  return Response.json({ thing } satisfies ThingResponse, { status: 201 });
});
```

- **Always wrap in `withErrorHandling`.** It does three things you must not re-implement per route: CSRF check (`Sec-Fetch-Site === 'same-origin'` on non-GET/HEAD/OPTIONS → 403 `CSRF`), `AppError` → JSON response (anything else is logged and becomes 500), `Cache-Control: no-store` on every response unless the handler set its own. (`api/health` is the only unwrapped route — don't copy it.)
- **Body only through `parseBody(request, schema)`.** Broken JSON and schema failures both become 400 `VALIDATION_ERROR` with `details` = zod `fieldErrors`. Normalize in the schema (`trim()`, `toLowerCase()`), put length limits in `@granat/contracts` (`MIN_PASSWORD_LENGTH`, …), export `z.infer` types next to the schema. Schemas live in contracts so the admin validates forms with the same rules.
- **Responses:** action without payload → `new Response(null, { status: 204 })`; data → `Response.json({ <key>: value })`, wrapped in a named key (`{ user }`), not a bare object/array.

## Auth — check in the handler, next to the data

From `lib/auth/dal.ts`:

| Call | When | Fails with |
|---|---|---|
| `getCurrentSession()` | anonymous is allowed, returns `null` | — |
| `requireUser()` | any logged-in user (e.g. a `USER` asking for access) | 401 `UNAUTHORIZED` |
| `requireAdmin()` | everything that reads or changes content | 403 `FORBIDDEN` (401 if anonymous) |

- Call it first thing in the handler, before parsing the body. Deny by default: content endpoints use `requireAdmin()` for reads too.
- `proxy.ts` is i18n only. Never move auth checks there.
- Role comes from the DB on every request (`validateSessionToken`), never from the client, cookie or request body.
- 401 = "don't know who you are" (admin redirects to sign in), 403 = "know you, not allowed" (admin shows "request access"). Keep that split.
- Changing a user's role or other security-relevant state → `invalidateUserSessions(userId, tx)` in the same transaction.

## Errors

- Throw `new AppError(API_STATUSES.X, details?)` from services or handlers. Never build an error `Response` by hand.
- New error = new entry in `packages/contracts/src/apiStatuses.ts` (`{ status, message } as const`, `message` equals the key) and add it to `API_STATUSES`. The admin switches on `error`, so codes are API surface — don't rename them casually.
- Translate known Prisma errors into domain errors at the service level (`P2002` unique violation → `EMAIL_TAKEN` in `signup`). Rethrow everything else.
- Don't leak existence: auth-type failures return one generic error (`INVALID_CREDENTIALS`) and keep timing equal (see the dummy argon2 hash in `auth.ts`).

## Data out — DTOs via `select`

- Always `select` the fields you return; never send a whole Prisma model. `passwordHash`, `secretHash` and similar must be impossible to return, not just "not returned".
- The DTO the admin receives is declared in `@granat/contracts` (`UserDto`, `MeResponse`); the handler checks the actual value against it with `satisfies`. That way a `select` that drifts from the contract fails `tsc` in `main` instead of breaking the admin at runtime. Server-internal types can still be derived from the query (`Awaited<ReturnType<…>>`, as `SessionUser` does).

## Writes

- Idempotent deletes/updates by id: `deleteMany` / `updateMany`, so a concurrent delete (second tab) doesn't turn into P2025 → 500.
- Multi-step changes in `prisma.$transaction(async (tx) => …)`. Helpers that may run inside a transaction take `db: Prisma.TransactionClient = prisma` as the last arg (see `invalidateSession`).

## Checking an endpoint by hand

Dev cookie name is `session` (`__Host-session` only in production). Non-GET requests need the same-origin header or they get 403 `CSRF`:

```bash
curl -i -c /tmp/jar -H 'Sec-Fetch-Site: same-origin' -H 'Content-Type: application/json' \
  -d '{"email":"…","password":"…"}' http://localhost:3000/api/auth/signin
curl -i -b /tmp/jar http://localhost:3000/api/auth/me
```

Then `pnpm typecheck && pnpm lint` in `main/`.
