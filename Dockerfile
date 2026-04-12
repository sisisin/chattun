FROM node:22.18.0-slim AS base

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable pnpm

FROM base AS builder

WORKDIR /app

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml vp-shared.ts ./
COPY .npmrc* ./
COPY front/package.json ./front/
COPY front/patches ./front/patches
COPY server/package.json ./server/
RUN --mount=type=cache,id=pnpm,target=/pnpm/store \
    pnpm install --frozen-lockfile --ignore-scripts

COPY ./front ./front
RUN pnpm --filter chattun-front exec vp run build

FROM base AS runner

WORKDIR /app

ENV NODE_ENV=production

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY .npmrc* ./
COPY front/package.json ./front/
COPY front/patches ./front/patches
COPY server/package.json ./server/
RUN --mount=type=cache,id=pnpm,target=/pnpm/store \
    pnpm install --frozen-lockfile --filter chattun-server --prod --ignore-scripts

WORKDIR /app/server
COPY ./server ./
COPY --from=builder /app/front/build ./public

EXPOSE 3100
CMD ["node", "--experimental-strip-types", "./src/index.ts"]
