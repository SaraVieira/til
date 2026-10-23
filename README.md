# TIL

A tiny "Today I Learned" site. TanStack Start + Postgres (Drizzle), with a password-protected `/admin` to write entries in markdown.

## Local setup

```bash
pnpm install
cp .env.example .env.local   # then edit the values
createdb til
pnpm db:migrate
pnpm dev
```

Open http://localhost:3000/login, enter `ADMIN_PASSWORD`, write, hit ⌘ + Enter.

## Env

| Var              | What                                      |
| ---------------- | ----------------------------------------- |
| `DATABASE_URL`   | Postgres connection string                |
| `ADMIN_PASSWORD` | Password for `/admin`                     |
| `SESSION_SECRET` | 32+ random chars (`openssl rand -hex 32`) |
| `SITE_URL`       | Public URL, used for RSS links            |

## Routes

- `/` list + search (`?q=`)
- `/til/:slug` single entry
- `/tags`, `/tags/:tag`
- `/rss.xml`
- `/admin` write / edit / delete

## Scripts

- `pnpm check` format check + lint + typecheck
- `pnpm format` format with oxfmt
- `pnpm db:generate` new migration after editing `src/db/schema.ts`

## Dev with Docker (HMR)

```bash
pnpm docker:dev
```

Starts Postgres and the Vite dev server at http://localhost:3000 with your source mounted, so edits hot-reload. Login password is `admin` (override with `ADMIN_PASSWORD=...`). Postgres is exposed on `localhost:5432` (user/pass/db: `til`). Stop with `pnpm docker:dev:down`.

After adding dependencies, rerun `pnpm docker:dev` (it rebuilds and refreshes the container's `node_modules`).

## Run with Docker (production build)

```bash
ADMIN_PASSWORD=change-me SERVICE_PASSWORD_64_SESSION=$(openssl rand -hex 32) docker compose up --build
```

Starts Postgres and the app on a random host port (`docker compose port app 3000` shows it). Migrations run on start.

## Deploy (Coolify)

1. New resource → this repo → build pack **Docker Compose**
2. Set `ADMIN_PASSWORD` in the environment variables tab
3. Deploy

Coolify generates the domain, the Postgres user/password and `SESSION_SECRET` for you. Data lives in the `postgres-data` volume.
