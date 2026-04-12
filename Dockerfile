FROM node:22.18.0 AS builder

RUN corepack enable pnpm
WORKDIR /app

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY .npmrc* ./
COPY front/package.json ./front/
COPY front/patches ./front/patches
COPY server/package.json ./server/
RUN pnpm install --frozen-lockfile

COPY ./front ./front
RUN pnpm --filter chattun-front exec vp run build

FROM node:22.18.0-alpine AS runner

RUN corepack enable pnpm
WORKDIR /app

ENV NODE_ENV=production

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY .npmrc* ./
COPY front/package.json ./front/
COPY front/patches ./front/patches
COPY server/package.json ./server/
RUN pnpm install --frozen-lockfile --filter chattun-server --prod --ignore-scripts

WORKDIR /app/server
COPY ./server ./
COPY --from=builder /app/front/build ./public

EXPOSE 3100
CMD ["./node_modules/.bin/ts-node", "-T", "./src/index.ts"]
