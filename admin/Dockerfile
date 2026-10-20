FROM node:24-alpine AS base

ENV COREPACK_ENABLE_DOWNLOAD_PROMPT=0
RUN corepack enable

WORKDIR /repo

#1 зависимости: кэшируем пока не изменились package.json и pnpm-lock.yaml
FROM base AS dependencies
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY admin/package.json admin/
COPY packages/contracts/package.json packages/contracts/
COPY packages/tsconfig/package.json packages/tsconfig/
COPY packages/eslint-config/package.json packages/eslint-config/
COPY packages/stylelint-config/package.json packages/stylelint-config/
RUN pnpm install --frozen-lockfile --filter "admin..."

#dev: исходники монтируются из compose
FROM dependencies AS dev
WORKDIR /repo/admin
EXPOSE 3001
CMD ["pnpm", "dev"]

#2 сборка
FROM dependencies AS builder
COPY packages packages
COPY admin admin
WORKDIR /repo/admin
RUN pnpm build

#3 prod: только статика и nginx
FROM nginx:1.29-alpine AS runner
COPY admin/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /repo/admin/dist /usr/share/nginx/html
EXPOSE 80

