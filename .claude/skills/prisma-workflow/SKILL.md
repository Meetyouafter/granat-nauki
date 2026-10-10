---
name: prisma-workflow
description: Prisma 7 schema conventions and DB workflow for granat-nauki (main/prisma) — naming with @map/@@map, where to run migrate/generate/seed (inside the main container), the generated client, transactions. Use when changing schema.prisma, adding a model, creating or applying a migration, seeding, or when Prisma errors like P1001/P2002/P2025 come up.
---

# granat-nauki Prisma workflow

This skill is how Prisma is set up *in this project*. For generic Prisma 7 reference use [[prisma-cli]] (commands and flags), [[prisma-client-api]] (queries, filters, transactions) and [[prisma-upgrade-v7]] (v6 → v7 differences, when old-style snippets don't work). Where they disagree with this file (e.g. running commands on the host), this file wins.

## Files

```
main/prisma/schema.prisma        schema (generator output → ../src/generated/prisma)
main/prisma/migrations/          migrations, committed
main/prisma/seed.ts              upserts the admin from ADMIN_EMAIL / ADMIN_PASSWORD
main/prisma7.config.ts           Prisma config: loads .env, schema/migrations paths, seed command
main/src/generated/prisma/       generated client — gitignored, eslint-ignored, never edit
main/src/lib/db.ts               the only PrismaClient (PrismaPg adapter, global singleton in dev)
```

- In app code import the client as `import { prisma } from '@/lib/db'`, types/enums/errors from `@/generated/prisma/client` (`Prisma`, `Prisma.TransactionClient`, `Prisma.PrismaClientKnownRequestError`). Never `new PrismaClient()` elsewhere.
- `datasource` has no `url` in the schema — it comes from `DATABASE_URL` via `prisma7.config.ts`.

## Naming

- Models: PascalCase singular (`User`, `AccessRequest`) + `@@map("snake_case_plural")` (`users`, `access_requests`).
- Fields: camelCase + `@map("snake_case")` whenever the names differ (`passwordHash @map("password_hash")`).
- Enums: PascalCase + `@@map("snake_case")`, values UPPER_CASE.
- Every model has `createdAt @default(now()) @map("created_at")`; mutable ones also `updatedAt @updatedAt @map("updated_at")`.
- Foreign keys: `xxxId Int @map("xxx_id")`, relation with explicit `onDelete` (`Cascade` for rows owned by the parent), and `@@index([xxxId])`. Index columns you filter by (`@@index([status])`).
- Run `pnpm prisma format` after editing; it aligns and fixes relation fields.

## Where to run commands

`DATABASE_URL` in `main/.env` points at host `db` (the compose service). From the host it is unreachable (`P1001: Can't reach database server at db:5432`), so:

- **No DB needed — run on the host** in `main/`: `pnpm prisma format`, `pnpm prisma validate`, `pnpm prisma generate`.
- **Needs the DB — run in the `main` container** (from the repo root, `main` must be up):

```bash
docker compose exec main pnpm prisma migrate dev --name add_faq
docker compose exec main pnpm prisma migrate status
docker compose exec -e ADMIN_EMAIL=… -e ADMIN_PASSWORD=… main pnpm prisma db seed
```

These change the DB — ask the user before running them.

## Changing the schema

1. Edit `schema.prisma` → `pnpm prisma format && pnpm prisma validate`.
2. `docker compose exec main pnpm prisma migrate dev --name <snake_case_what_changed>` — one migration per logical change. Read the generated `migration.sql` before moving on (renames come out as drop + add and lose data — fix the SQL by hand before applying if so).
3. `pnpm prisma generate` — Prisma 7 `migrate dev` does not regenerate the client by itself. The output lands in `src/generated` through the bind mount, so host and container see the same client. If the dev server still shows old types, restart it: `docker compose restart main`.
4. `pnpm typecheck` in `main/`.

Never edit a migration that is already applied; add a new one.

`prisma` and `@prisma/engines` must stay `true` in `allowBuilds` (`pnpm-workspace.yaml`): their install scripts fetch the schema engine, without it `migrate` fails.

## Seed

`seed.ts` validates the creds through `signupSchema` (password 15–128), upserts the user with `role: 'ADMIN'` and kills their sessions in one transaction. Credentials go in the command env only, never into `.env`. Seed runs through `tsx --conditions=react-server` so `import 'server-only'` modules load outside Next.

## Runtime patterns

- `Bytes` columns are `Uint8Array` in TS (see `Session.secretHash`).
- `P2002` (unique violation) → map to a domain `AppError` in the service (`EMAIL_TAKEN`).
- `P2025` (record not found) from `delete`/`update` → prefer `deleteMany`/`updateMany` when the row may already be gone.
- Transactions: `prisma.$transaction(async (tx) => …)`; helpers take `db: Prisma.TransactionClient = prisma` so they work both inside and outside one.
- Always `select` what you need — see the DTO rule in [[api-conventions]].
