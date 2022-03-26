#!/usr/bin/env sh


git pull;

docker kill playland-server-container || echo 1;
docker rm playland-server-container || echo 1;
docker kill playland-frontend-container || echo 1;
docker rm playland-frontend-container || echo 1;

docker system prune --volumes --force || echo 1;

docker build -t playland-server . -f Dockerfile.server;
docker run -d -p 9000:9000 --restart=always --name="playland-server-container" --memory-reservation="100m" --memory-swap="600m" --memory="500m" --cpu-period=100000 --cpu-quota=50000 playland-server;

# docker run -d -p 9000:9000 --restart=always --name="playland-server-container" playland-server;
# docker update --memory-reservation="100m" --memory-swap="600m" --memory="500m" --cpu-quota="7000000" playland-server-container;
docker container restart playland-server-container;

docker build -t playland-frontend . -f Dockerfile.frontend;
docker run -d -p 80:80 --restart=always --name="playland-frontend-container" playland-frontend;

echo "Server is up!";