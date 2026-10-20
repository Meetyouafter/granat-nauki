FROM node:24-alpine AS base

ENV COREPACK_ENABLE_DOWNLOAD_PROMPT=0
RUN corepack enable

WORKDIR /repo

#1 зависимости: кэшируем пока не изменились package.json и pnpm-lock.yaml
FROM base AS dependencies
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY main/package.json main/
COPY packages/contracts/package.json packages/contracts/
COPY packages/tsconfig/package.json packages/tsconfig/
COPY packages/eslint-config/package.json packages/eslint-config/
COPY packages/stylelint-config/package.json packages/stylelint-config/
RUN pnpm install --frozen-lockfile --filter "main..."

#2 сборка
FROM dependencies AS builder
COPY packages packages
COPY main main

WORKDIR /repo/main
# Ни generate, ни build к базе не подключаются, но обоим нужен DATABASE_URL:
# env() в prisma7.config.ts требует его для generate, а next build импортирует
# route handlers, и src/lib/db.ts создаёт клиент при импорте.
# Значение задаётся в RUN, а не через ENV, чтобы оно не попало в образ migrations.
RUN DATABASE_URL=postgresql://build@localhost/build pnpm prisma generate
RUN DATABASE_URL=postgresql://build@localhost/build pnpm build

# 3. миграции: отдельная цель, в ней есть prisma CLI
FROM builder AS migrations
CMD ["pnpm", "prisma", "migrate", "deploy"]

# dev: исходники монтируются из compose, поэтому COPY не нужен
FROM dependencies AS dev
WORKDIR /repo/main
EXPOSE 3000
CMD ["pnpm", "dev"]

# 4. финальный образ: только standalone
FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production PORT=3000 HOSTNAME=0.0.0.0
COPY --from=builder --chown=node:node /repo/main/.next/standalone ./
COPY --from=builder --chown=node:node /repo/main/.next/static ./main/.next/static
COPY --from=builder --chown=node:node /repo/main/public ./main/public
USER node
EXPOSE 3000
CMD ["node", "main/server.js"]
