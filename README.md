# Govi starter kit

A single-tenant full-stack starter: a Go API on Fiber v3 with PostgreSQL 18 and
[Authula](https://github.com/Authula/authula) embedded as a library, plus a
React 19 SPA on Vite and TanStack Router. The SPA is compiled into the API
binary, so production is one artifact with no separate asset server.

```
server/   Go API, migrations, seeders, Dockerfile
web/      React SPA (Vite, TanStack Router/Query/Form/Table, shadcn/ui)
```

## Requirements

- Go 1.27.2 or newer (the module declares `go 1.27.2`; `GOTOOLCHAIN=auto`
  fetches it if your local Go is older)
- Node 22 and pnpm 10+ (this repo pins pnpm through `corepack`)
- PostgreSQL 18 — the migrations use `uuidv7()`
- Docker, only if you want the bundled database

## Quick start

```sh
make install          # pnpm install + go mod download
make db-up            # PostgreSQL 18 in Docker on :5432
cp server/.env.example server/.env
cp web/.env.example web/.env
make dev              # API on :8080, web on :3000
```

`make dev` runs both processes; Ctrl-C stops them together. Open
http://localhost:3000 and sign in with the seeded super user
(`admin@mail.com` / `admin123` by default — change it in `server/.env`).

The API applies migrations on boot because `MIGRATE_ON_BOOT=true`. To seed the
super user, set `SEED_ON_BOOT=true` for one run.

## Layout

| Path | What lives there |
| --- | --- |
| `server/cmd/api` | HTTP entry point, routes, Authula wiring |
| `server/cmd/migrate` | Migration and seeder CLI |
| `server/internal` | Config, handlers, repositories, middlewares, models, DTOs |
| `server/migrations` | Versioned SQL migrations |
| `server/internal/web` | `go:embed` SPA bundle plus its fallback handler |
| `web/src/routes` | File-based TanStack Router routes |
| `web/src/components` | Layout, UI primitives, and feature blocks |
| `web/src/lib/api` | Models, DTOs, services, and TanStack Query options |

## API contract

Everything lives under `/api/v1`. Authula keeps its native response shapes
(no `{data}` envelope); the application's own endpoints answer with
`{data, metadata?, message?}`.

| Method | Path | Notes |
| --- | --- | --- |
| `POST` | `/api/v1/auth/email-password/sign-in` | Returns `{user, session, access_token, refresh_token, expires_at, expires_in}` |
| `POST` | `/api/v1/auth/token/refresh` | Returns `{access_token, refresh_token}` |
| `POST` | `/api/v1/auth/sign-out` | Ends the session |
| `GET` | `/api/v1/me` | `{data}` envelope; the app role lives here, not in Authula |
| `GET` | `/api/v1/categories` | Public list |
| `POST` `PUT` `DELETE` | `/api/v1/categories` | Super user only, idempotency guarded |

Roles are `super_user` and `user`, stored in the `users` mirror table. The
frontend reads them from `GET /api/v1/me`, because Authula does not know about
application roles.

## Commands

Root `Makefile`:

| Target | Does |
| --- | --- |
| `install` | Install web dependencies and download Go modules |
| `dev` | Run API and Vite dev server together |
| `dev-server` | Run only the API |
| `dev-web` | Run only the Vite dev server |
| `build` | Build the SPA and embed it into the API binary |
| `build-web` | Build the SPA only, into `web/dist` |
| `test` | Run the Go test suite |
| `lint` | `go vet` plus `tsc --noEmit` |
| `db-up`, `db-down`, `db-reset` | Manage the Dockerized PostgreSQL |
| `clean` | Remove build output |

`server/Makefile` keeps the migration targets (`db/migrations/up`,
`db/migrations/down`, `db/migrations/new name=...`) and the Go release builds.

## Production build

```sh
make build
```

That runs the Vite build, copies `web/dist` into `server/internal/web/dist`,
and compiles `server/bin/api`. The binary serves the API and the SPA; unknown
`/api/*` paths still 404 instead of falling back to `index.html`.

For a container:

```sh
docker build -f server/Dockerfile -t govi .
docker run --rm -p 8080:8080 --env-file server/.env govi
```

The image is multi-stage (Node for the SPA, Go for the binary) and runs
distroless as a non-root user.

## Environment

`server/.env.example` documents every server setting; the important ones:

| Variable | Notes |
| --- | --- |
| `APP_SECRET` | At least 32 characters; signs Authula tokens |
| `DB_DSN` | PostgreSQL URL; `AUTHULA_DATABASE_URL` must not be set |
| `ENV` | `development`, `staging`, or `production`; unset means production |
| `MIGRATE_ON_BOOT` | Apply embedded migrations at startup |
| `SEED_ON_BOOT` | Run idempotent seeders at startup (needs `SUPER_USER`) |
| `CORS_ALLOWED_ORIGINS` | Comma-separated browser origins |

`web/.env.example` has `VITE_APP_NAME` and `VITE_API_URL`. Leave
`VITE_API_URL` empty to use the same origin; the dev server proxies `/api` to
`VITE_API_PROXY_TARGET` (default `http://localhost:8080`).
