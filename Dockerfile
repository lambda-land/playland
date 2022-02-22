# syntax=docker/dockerfile:1

# Alpine is chosen for its small footprint
# compared to Ubuntu
FROM golang:1.16-alpine

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
## Add this go mod download command to pull in any dependencies
RUN go mod download
## we run go build to compile the binary
## executable of our Go program
RUN go build -o main .
## Our start command which kicks off
## our newly created binary executable
CMD ["/app/main"]