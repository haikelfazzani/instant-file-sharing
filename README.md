# InstaSharing (Beta)
Peer-to-peer file transfers in your browser, anonymous and secure using WebRTC

## Tech Stack
- Nginx (Reverse Proxy)
- Docker / Docker Compose
- Nodejs
- ReactJS

The client server is started on localhost:3000 and it internally proxies to the server using the name bound as api:5000.

## Installation
- [install docker](https://docs.docker.com/engine/install/ubuntu)
- [install docker-compose](https://docs.docker.com/compose/install)

## Test App
- To build the application images
```
docker-compose build
```

- To start the application
```
docker-compose up
```

Now when you visit port 3050 on browser you will be able to see the application live.

## Notes
- All pull requests are welcome, feel free.
