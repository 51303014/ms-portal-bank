# Test Image
FROM node:lts-alpine as builder
LABEL maintainer "binhpham"

WORKDIR /app
COPY package.json yarn.lock ./

RUN set -x && yarn --production=false

COPY . .

RUN yarn build

# Production Image
FROM node:lts-alpine as main
LABEL maintainer "binhpham"

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /app
EXPOSE 3000

COPY package.json yarn.lock ./
RUN touch .env

RUN set -x && yarn --production=true

COPY --from=builder /app/dist ./dist

CMD ["yarn", "start:prod"]
