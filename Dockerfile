FROM node:19.6.0-alpine3.16 as builder
WORKDIR /app
COPY . .
RUN yarn install && yarn build

FROM node:19.6.0-alpine3.16
WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY package.json yarn.lock ./

CMD yarn start
