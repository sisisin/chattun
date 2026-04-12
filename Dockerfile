FROM node:22.18.0 AS builder

RUN corepack enable pnpm
WORKDIR /app/front

COPY ./front/package.json ./front/pnpm-lock.yaml ./
COPY ./front/patches ./patches
RUN pnpm install --frozen-lockfile

COPY ./front .
RUN pnpm vp run build && pnpm vp run move-assets

FROM node:22.18.0-alpine AS runner

RUN corepack enable pnpm
WORKDIR /app/server
ENV NODE_ENV=production

COPY ./server/package.json ./server/pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile --prod

COPY ./server ./
COPY --from=builder /app/server/public ./public

EXPOSE 3100
CMD ["./node_modules/.bin/ts-node", "-T", "./src/index.ts"]
