# syntax=docker/dockerfile:1


##
## Build
##



# Alpine is chosen for its small footprint
# compared to Ubuntu
# FROM golang:1.17-alpine3.15 as build
FROM golang:1.17-alpine3.15 as go-build-deps


## We create an /app directory within our
## image that will hold our application source
## files

## We copy everything in the root directory
## into our /app directory

## We specify that we now wish to execute 
## any further commands inside our /app
## directory

RUN apk --no-cache --update add ca-certificates

RUN apk update --no-cache && apk add --no-cache wget gzip curl nodejs

RUN wget -O binary-for-linux-64-bit.gz 'https://github.com/elm/compiler/releases/download/0.19.1/binary-for-linux-64-bit.gz'
RUN gzip -d binary-for-linux-64-bit.gz
RUN mv ./binary-for-linux-64-bit /usr/local/bin/elm
## RUN rm binary-for-linux-64-bit.gz
RUN chmod +x /usr/local/bin/elm

WORKDIR /app-go

COPY go/go.mod /app-go
COPY go/go.sum /app-go
RUN go mod download

COPY go/*.go /app-go

RUN go build -o main . 


FROM node:16-alpine3.15 as node-build-deps


WORKDIR /app-node

ENV NODE_ENV=production

COPY package.json yarn.lock ./
RUN yarn install --production

COPY . /app-node
# COPY src /app-node

RUN yarn run build:prod



FROM nginx:1.21.6-alpine
COPY --from=go-build-deps /app-go/main /server
COPY --from=node-build-deps /app-node/dist /usr/share/nginx/html

COPY ./nginx.conf /etc/nginx/nginx.conf


RUN nginx -t
# RUN service nginx restart
RUN nginx

EXPOSE 80 9000

CMD ["/server"]