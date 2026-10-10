FROM node:24-alpine

ENV COREPACK_ENABLE_DOWNLOAD_PROMPT=0
RUN corepack enable

WORKDIR /repo

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY main/package.json main/
COPY admin/package.json admin/
COPY packages/contracts/package.json packages/contracts/
COPY packages/tsconfig/package.json packages/tsconfig/
COPY packages/eslint-config/package.json packages/eslint-config/
COPY packages/stylelint-config/package.json packages/stylelint-config/
RUN pnpm install --frozen-lockfile --filter "admin..."

COPY packages packages
COPY admin admin

WORKDIR /repo/admin
EXPOSE 3001
CMD ["pnpm", "dev"]
