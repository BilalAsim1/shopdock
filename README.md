# ShopDock

A containerized e-commerce store: browse products, add to cart, and check out.
Built with Node.js, Express, and PostgreSQL, orchestrated with Docker Compose.

## Stack

- **Backend:** Node.js + Express (REST API)
- **Database:** PostgreSQL 16
- **Frontend:** Vanilla JS + HTML/CSS (fetches the API, renders a cart)
- **Orchestration:** Docker Compose (app + database, one command)

## Run it

Requires Docker. Then:

    git clone https://github.com/BilalAsim1/shopdock.git
    cd shopdock
    docker compose up --build

Open http://localhost:8000 in your browser.

## Architecture

The app and database run as two containers on a private Docker network.
The web service reaches Postgres by the hostname `db` — no IP configuration.
The database seeds itself from `init.sql` on first start, and its data
persists in a named volume across restarts.

    Browser  →  web (Express :8000)  →  db (Postgres :5432)  →  volume

## API

| Method | Route                | Description                  |
|--------|----------------------|------------------------------|
| GET    | /api/products        | List all products            |
| GET    | /api/products/:id    | Get one product              |
| POST   | /api/checkout        | Place an order, returns total|
| GET    | /health              | App + database status        |

## Configuration

The web service reads database settings from environment variables
(`DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`), set in
`docker-compose.yml`. This keeps credentials out of the code.

## Roadmap

- [ ] Decrement stock and persist orders on checkout
- [ ] Product search and categories
- [ ] User accounts and order history
- [ ] Automated tests + GitHub Actions CI

## License

MIT
