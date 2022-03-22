# syntax=docker/dockerfile:1

# Alpine is chosen for its small footprint
# compared to Ubuntu
FROM golang:1.17-alpine3.15


## We create an /app directory within our
## image that will hold our application source
## files
RUN mkdir /app
## We copy everything in the root directory
## into our /app directory
ADD ./go /app
## We specify that we now wish to execute 
## any further commands inside our /app
## directory
WORKDIR /app

RUN apk --update add ca-certificates

RUN apk update && apk add --no-cache wget gzip curl nodejs

RUN wget -O binary-for-linux-64-bit.gz 'https://github.com/elm/compiler/releases/download/0.19.1/binary-for-linux-64-bit.gz'
RUN gzip -d binary-for-linux-64-bit.gz
RUN mv ./binary-for-linux-64-bit /usr/local/bin/elm
## RUN rm binary-for-linux-64-bit.gz
RUN chmod +x /usr/local/bin/elm

## Add this go mod download command to pull in any dependencies
RUN go mod download
## we run go build to compile the binary
## executable of our Go program
RUN go build -o main .
## Our start command which kicks off
## our newly created binary executable
CMD ["/app/main"]