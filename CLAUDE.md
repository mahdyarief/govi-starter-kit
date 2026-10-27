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

## Skills: gofi and vine

The repo follows two OpenClaude plugins from the `ai-coding-skills` marketplace
(`gofi@ai-coding-skills`, `vine@ai-coding-skills`). Both halves are already
shaped by them, so use the matching skill when adding a resource instead of
inventing a new layout.

- **gofi** owns `server/`: `scaffold` (new project), `layers` (a new
  handler/repository/migration slice), `deploy`, `maintenance`.
- **vine** owns `web/`: `scaffold`, `layers` (a new
  `models → dtos → services → queries` slice), `deploy`, `maintenance`.

Their audits run from this repo, so layer drift fails the same way a test does:

```sh
make audit    # gofi + vine audit_layers.py and check_env_sync.py
make check    # format check, lint, tests, then the audits
```

`scripts/skill-audit.sh` resolves the installed plugin version at runtime and
skips a check with a notice when a plugin is absent, so the repo still builds
on a machine without the plugins. Override the cache root with
`AI_CODING_SKILLS_DIR` if the plugins live elsewhere.

## Verify before finishing

```sh
make test                                  # go test ./...
make lint                                  # go vet + eslint + tsc --noEmit
make fmt                                   # prettier --write + gofmt -w
make audit                                 # gofi/vine layer and env checks
cd server && go build ./...
cd web && corepack pnpm build
```

`make check` runs all of the above except the builds. The API integration test
in `server/cmd/api` runs only when `TEST_DB_DSN` points at a disposable
PostgreSQL 18 database.

## Where to change things

| Task | File |
| --- | --- |
| Add a route/handler | `server/cmd/api/routes.go`, `server/internal/handlers` |
| Add a table | `server/migrations`, `server/internal/models`, repositories |
| Add an API resource in the SPA | `web/src/lib/api/{models,dtos,services,queries}` |
| Change navigation | `web/src/data/sidebar-menu.ts` |
| Change branding | `server/.env.example` (`APP_NAME`), `web/index.html`, `web/.env.example` |
