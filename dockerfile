# Test Image
FROM node:lts-alpine as builder
LABEL maintainer "binhpham"

WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn config set http-proxy http://proxy.bidv.com.vn:8080
RUN yarn config set https-proxy http://proxy.bidv.com.vn:8080
RUN yarn config set "strict-ssl" false
RUN set NODE_TLS_REJECT_UNAUTHORIZED=0
RUN set -x && yarn --production=false

COPY . .

RUN yarn build

# Production Image
FROM node:lts-alpine as main
LABEL maintainer "binhpham"

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /app
EXPOSE 8080

COPY package.json yarn.lock ./
RUN touch .env
RUN yarn config set http-proxy http://proxy.bidv.com.vn:8080
RUN yarn config set https-proxy http://proxy.bidv.com.vn:8080
RUN yarn config set "strict-ssl" false
RUN set NODE_TLS_REJECT_UNAUTHORIZED=0

RUN set -x && yarn --production=true

COPY --from=builder /app/dist ./dist

CMD ["yarn", "start:prod"]
