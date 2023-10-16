FROM node:18.18.1 as builder

WORKDIR /app/front

COPY ./front/package.json ./front/yarn.lock ./
RUN yarn install --frozen-lockfile && \
  rm -rf $(yarn cache dir)

COPY ./front .
RUN yarn build && yarn move-assets

FROM node:18.18.1-alpine as runner

WORKDIR /app/server
ENV NODE_ENV=production

COPY ./server/package.json ./server/yarn.lock ./
RUN yarn install --frozen-lockfile --production && \
  rm -rf $(yarn cache dir)

COPY ./server ./
COPY --from=builder /app/server/public ./public

EXPOSE 3100
CMD ["yarn", "start"]
