# Ghumo Firo India - Architecture

This document covers only three things: the **user flow**, the **architecture map**,
and the **VPS / Docker layout**.

Written using [basic Markdown syntax](https://www.markdownguide.org/basic-syntax/) only.

---

## User Flow

1. A visitor opens **ghumofiroindia.com** in their browser.
2. The request reaches **Cloudflare** (edge, DNS, TLS, CDN) first.
3. Cloudflare forwards it to the **origin VPS**, where **Nginx** is listening.
4. Nginx routes the request:
   - Page requests go to the **Next.js frontend** on `127.0.0.1:3000`.
   - API requests (paths under `/api/v1`) go to the **Express backend** on `127.0.0.1:4000`.
5. The **Next.js frontend** renders the page (server side) and sends the HTML back to the browser.
6. In the browser, the app calls the API at `/api/v1` for data such as tours, locations, and the map.
7. The **backend** handles each API call:
   - It reads and writes data in **PostgreSQL** through the Drizzle ORM.
   - It reads and writes the cache and rate-limit counters in **Redis**.
8. The backend sends the JSON response back through Nginx and Cloudflare to the browser.

> Note: When the Next.js server renders a page, it fetches the backend directly on
> `localhost:4000`. That server-to-server traffic does not pass through Nginx or Cloudflare.

### Sign in and protected pages

1. The visitor submits the login form.
2. The backend verifies the credentials and sets two **httpOnly cookies**: `gpi_at` (access) and `gpi_rt` (refresh).
3. Every later API call sends these cookies automatically.
4. When the access token expires, the app calls `/auth/refresh` once and retries the request.
5. Visiting `/dashboard` or `/my-account` is gated early: with no session cookie, the user is redirected to `/login`.

### Booking flow

1. The visitor browses tours and opens a tour page.
2. The visitor fills in the booking form and submits it.
3. The backend validates the request, applies the booking rate limit, and stores the booking in PostgreSQL.
4. A confirmation is returned to the browser and a notification email is sent.

---

## Architecture Map

The full request path, from the visitor to the data stores:

    +-----------------+
    |     Visitor     |
    |  (web browser)  |
    +--------+--------+
             |
             |  HTTPS
             v
    +-----------------+
    |   Cloudflare    |   edge: DNS, TLS, CDN, WAF
    +--------+--------+
             |
             |  only Cloudflare IPs allowed
             v
    +-----------------+
    |  Nginx (host)   |   reverse proxy
    +----+-------+----+
         |       |
  pages  |       |  /api/v1
         v       v
 +---------+   +-----------+
 | Next.js |   |  Express  |
 |frontend |   |  backend  |
 |  :3000  |   |   :4000   |
 +----+----+   +-----+-----+
      |              |
      | SSR fetch    |  reads / writes
      | (localhost)  +--------+---------+
      |              |                  |
      +------------->|                  |
                     v                  v
              +-------------+    +-------------+
              | PostgreSQL  |    |    Redis    |
              |  (Drizzle)  |    | cache + rate|
              |             |    |   limits    |
              +-------------+    +-------------+

---

## VPS and Docker Layout

Everything runs on a single **Oracle Cloud VPS** (ARM64 / aarch64, Ubuntu 24.04).
Only **Nginx** on the host is exposed to the internet, and it accepts traffic
**only from Cloudflare**. Nginx forwards each hostname to a container that
publishes its port on loopback (`127.0.0.1`). The containers live on two private
Docker networks: one for the app, one for monitoring.

    ###############################################################
    #  INSIDE THE VPS   -   Oracle Cloud, ARM64, Ubuntu 24.04     #
    #  Firewall: 80 / 443 open to Cloudflare IP ranges only       #
    ###############################################################

              from Cloudflare  (only Cloudflare IPs allowed)
                      |
                      v  :443
            +-----------------------------+
            |           Nginx             |   host reverse proxy
            |      (ports 80 / 443)       |
            +--------------+--------------+
               |           |            |
               | :3000     | :4000      | :3001
               v           v            v
           frontend     backend       grafana


    ===  Docker network: ghumo-network  (the application)  ===

        +------------------+         +------------------+
        |  ghumo-frontend  | ------> |  ghumo-backend   |
        |  Next.js   :3000 |         |  Express   :4000 |
        +------------------+         +--------+---------+
                                              |
                            +-----------------+-----------------+
                            v                                   v
                  +-------------------+             +-------------------+
                  |  ghumo-postgres   |             |   ghumo-redis     |
                  | Postgres 16 :5432 |             |  Redis 7   :6379  |
                  +---------+---------+             +---------+---------+
                            |                                 |
                            v                                 v
                    [ vol: postgres_data ]            [ vol: redis_data ]


    ===  Docker network: monitoring  (runs on its own)  ===

        +------------------+       +------------------+
        |  node-exporter   |       |    blackbox-     |
        |  (host metrics)  |       |    exporter      |
        +--------+---------+       +--------+---------+
                 |                          |
                 +------------+-------------+
                              v  (scraped every 15s)
                  +-------------------+        +-------------------+
                  | ghumo-prometheus  | -----> |   ghumo-grafana   |
                  |       :9090       |        | :3001  dashboards |
                  +---------+---------+        +---------+---------+
                            |                            |
                            v                            v
                   [ vol: prometheus_data ]     Telegram + Email alerts

Legend and notes:

- **Published ports** are bound to `127.0.0.1` only, so containers are never reachable
  from the internet directly - only through Nginx.
- **ghumo-postgres** and **ghumo-redis** publish **no** host port. The backend reaches
  them over the app network as `postgres:5432` and `redis:6379`.
- **node-exporter** collects host metrics and **blackbox-exporter** checks site up/down.
  **Prometheus** scrapes both; **Grafana** reads Prometheus and sends alerts to Telegram and email.
- **Portainer** runs separately (published on `127.0.0.1:9443`) to view and manage the containers.
- **Volumes** (`postgres_data`, `redis_data`, `prometheus_data`, `grafana_data`) keep data
  when containers are rebuilt or updated.
- New images are built in CI, pushed to GHCR, then pulled and restarted here on deploy.
