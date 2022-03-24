# PlayLand

### Init Notes
```
The index_comilation_template.html would be exported into the dist/ folder when webpack is run, along with the compiled elm.js. 
```


## Setup

```bash
$ yarn build
```

```bash
$ git pull 

$ sudo du -hsx /* | sort -rh | head -n 40

$ docker kill playland-server-container && docker rm playland-server-container && docker kill playland-frontend-container && docker rm playland-frontend-container

$ docker system prune --volumes

$ docker build -t playland-server . -f Dockerfile.server
$ docker run -d -p 9000:9000 --restart=always --name="playland-server-container" playland-server
$ # docker update --memory-reservation="100m" --memory-swap="600m" --memory="500m" --cpu-quota="7000000" playland-server-container

$ docker build -t playland-frontend . -f Dockerfile.frontend
$ docker run -d -p 80:80 --restart=always --name="playland-frontend-container" playland-frontend 
```


