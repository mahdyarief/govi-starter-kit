# Govi starter kit

Single-tenant full-stack starter. Go API (Fiber v3, PostgreSQL 18, Authula as a
library) in `server/`, React 19 SPA (Vite, TanStack Router) in `web/`. The SPA
is embedded into the API binary, so production is one artifact.

## Conventions

- **Single tenant by design.** There is no organization or tenant table. Users
  are global; roles are `super_user` and `user`, defined in
  `server/internal/lib/constant` and mirrored to the frontend in
  `web/src/lib/constants/auth.ts`.
- **Two response shapes.** Authula endpoints (`/api/v1/auth/*`) keep Authula's
  native responses — never wrap or rewrite them. Everything the application
  owns answers `{data, metadata?, message?}` via `dtos`.
- **Application role lives in govi, not Authula.** `GET /api/v1/me` returns the
  mirrored user with `role`; the SPA reads roles from there.
- **pnpm through corepack.** `pnpm` is not assumed on PATH. Both Makefiles use
  `PNPM ?= corepack pnpm`.
- **The embed directory must exist.** `server/internal/web/dist/.gitkeep` keeps
  `//go:embed all:dist` compiling on a fresh clone. Do not delete it.
- **SPA fallback stays last.** `web.Handler()` is registered after the API
  routes and skips `/health` and `/api/*`, so unknown API paths 404 instead of
  returning `index.html`.
- **Docker context is the repo root.** The Dockerfile needs `web/` and
  `server/`; build with `docker build -f server/Dockerfile .`.

## Verify before finishing

```sh
make test                                  # go test ./...
make lint                                  # go vet + tsc --noEmit
cd server && go build ./...
cd web && corepack pnpm build
```

The API integration test in `server/cmd/api` runs only when `TEST_DB_DSN`
points at a disposable PostgreSQL 18 database.

## Where to change things

| Task | File |
| --- | --- |
| Add a route/handler | `server/cmd/api/routes.go`, `server/internal/handlers` |
| Add a table | `server/migrations`, `server/internal/models`, repositories |
| Add an API resource in the SPA | `web/src/lib/api/{models,dtos,services,queries}` |
| Change navigation | `web/src/data/sidebar-menu.ts` |
| Change branding | `server/.env.example` (`APP_NAME`), `web/index.html`, `web/.env.example` |
