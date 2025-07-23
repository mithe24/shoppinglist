# README.md
A dockerized full stack shopping list application that uses a NodeJS backend
with JWT authentication, a ReactJS frontend, a PostgreSQL database with Prisma ORM.

## Security Considerations
This app **does not handle HTTPS directly**.
It is intended to run **behind a reverse proxy** (e.g., NGINX, Traefik)
that terminates TLS and forwards traffic over HTTP.

- The Express server listens on HTTP only (`http://localhost:3000`).
- **DO NOT** expose the Express container directly to the internet without TLS.
- Use Docker Compose with a reverse proxy for production.

See [docker-compose.yml](./docker-compose.yml) for an example setup.

## Getting Started

1. **Install Docker Compose**

[Docker.com](https://www.docker.com/)

2. **Clone the Repository**

``` bash
$ git clone https.....
$ cd shoppinglist-app
```

3. **Generate the Prisma Client**

`$ npx prisma generate`

4. **Build Docker images**

`# docker compose build`

5. **Create PostgreSQL migrations and apply them**

`# docker compose run shoppinglist-app npx prisma migrate deploy`

6. **Boot up the docker containers**

`# docker compose up`

## Mock Network Request

