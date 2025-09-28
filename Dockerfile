FROM oven/bun:1.0.2-alpine as build-env

RUN apk --no-cache add \
    build-base \
    python3

WORKDIR /home/bun/app

# Usa caché para las dependencias de package.json
ADD package.json bun.lockb /tmp/
RUN cd /tmp && bun install
RUN cp -a /tmp/node_modules /home/bun/app

COPY . .