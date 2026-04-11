FROM node:22.18.0 AS builder

RUN corepack enable pnpm
WORKDIR /app/front

COPY ./front/package.json ./front/pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile --ignore-scripts

COPY ./front .
RUN pnpm vp run build-js && pnpm vp run move-assets

FROM node:22.18.0-alpine AS runner

WORKDIR /app/server
ENV NODE_ENV=production

COPY ./server/package.json ./server/yarn.lock ./
RUN yarn install --frozen-lockfile --production && \
  rm -rf $(yarn cache dir)

COPY ./server ./
COPY --from=builder /app/server/public ./public

EXPOSE 3100
CMD ["./node_modules/.bin/ts-node", "-T", "./src/index.ts"]
