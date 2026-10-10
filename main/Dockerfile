FROM node:24-alpine

ENV COREPACK_ENABLE_DOWNLOAD_PROMPT=0
RUN corepack enable

WORKDIR /repo

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY main/package.json main/
COPY admin/package.json admin/
COPY packages/contracts/package.json packages/contracts/
RUN pnpm install --frozen-lockfile --filter "frontend..."

COPY packages packages
COPY main main

WORKDIR /repo/main
EXPOSE 3000
CMD ["pnpm", "dev"]
