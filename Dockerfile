FROM oven/bun:1.2.22-alpine as build-env

RUN apk --no-cache add \
    build-base \
    python3

WORKDIR /home/bun/app

# Usa caché para las dependencias de package.json
ADD package.json bun.lock /tmp/
RUN cd /tmp && bun install
RUN cp -a /tmp/node_modules /home/bun/app

COPY . .