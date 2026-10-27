# Contributing

Thanks for helping improve the Govi starter kit. This file covers the local
setup, the checks a change has to pass, and the conventions the repo follows.

## Toolchain

| Tool       | Version                      | Where it is pinned                  |
| ---------- | ---------------------------- | ----------------------------------- |
| Go         | 1.27.2+                      | `server/go.mod`                     |
| Node       | 22                           | `.nvmrc`                            |
| pnpm       | 11.10.0                      | `web/package.json#packageManager`   |
| PostgreSQL | 18                           | `docker-compose.yml`                |

`pnpm` is not assumed on your PATH. Always call it through corepack:
`corepack pnpm <command>`. The Makefile already does this via `PNPM`.

## Setup

```sh
make install                  # pnpm install + go mod download
make db-up                    # PostgreSQL 18 on :5432
cp server/.env.example server/.env
cp web/.env.example web/.env
make dev                      # API :8080, Vite :3000
```

Fill in `APP_SECRET` in `server/.env` before the API will start. The seeded
super user comes from `SUPER_USER` and is created when `SEED_ON_BOOT=true`.

## Checks before opening a pull request

```sh
make check
```

`make check` runs, in order: Prettier's format check, `gofmt -l`, `go vet`,
ESLint, `tsc --noEmit`, `go test ./...`, and the gofi/vine skill audits. The
builds are separate because they are slower:

```sh
make build                    # SPA into the API binary
```

`make fmt` rewrites formatting instead of checking it. Run it before `make
check` if Prettier or gofmt complains.

The Go integration test in `server/cmd/api` is skipped unless `TEST_DB_DSN`
points at a disposable PostgreSQL 18 database. Do not point it at a database
you care about: the test truncates tables.

## Skill audits

`make audit` runs the layer and env-parity checks that ship with the
`ai-coding-skills` OpenClaude plugins. It resolves the installed plugin version
at runtime and prints `SKIP` when a plugin is not installed, so a contributor
without the plugins can still build and test. If your plugins live outside the
default cache, set `AI_CODING_SKILLS_DIR`.

Read `CLAUDE.md` before adding a resource; it explains which skill owns which
half of the repo and the layer rules the audits enforce.

## Code conventions

- **Go** — standard library formatting (`gofmt`), table-driven tests next to
  the package they test. Layers follow gofi: handlers do not touch `database/sql`,
  repositories do not import fiber, `internal/config` does not parse env or
  flags, and raw SQL stays in repositories, seeders, migrations and `cmd/`.
- **TypeScript** — no semicolons, single quotes, trailing commas, 100 columns.
  Prettier enforces this; ESLint covers correctness. The SPA follows vine:
  UI components reach the API through `lib/api/queries`, never through
  `services`, `client-fetch` or axios directly.
- **`src/components/ui`** is vendored shadcn/ui. Keep upstream code intact when
  you can; local edits should be minimal and noted in the pull request.
- **Do not add dependencies** to solve a problem the standard library or an
  existing dependency already covers. This is a starter kit, and every
  dependency becomes someone else's maintenance burden.

## Commit messages

Use Conventional Commits, matching the existing history:

```
feat: add invoice resource
fix: reject oversized request bodies
docs: document the gofi/vine audits
chore: bump pnpm to 11.10.0
```

One logical change per commit. If a commit touches both halves of the repo,
explain in the body why the change cannot be split.

## Pull requests

- Keep the diff focused. Unrelated refactors belong in their own pull request.
- Describe the behaviour change, not just the files touched.
- Include the output of `make check` in the description if a check was already
  failing before your change and remains failing.
- Do not commit `.env` files, `web/dist`, `server/internal/web/dist/*`, or
  local tooling state (`.omc`, `.graft`, `.trail`).

## Licence

By contributing you agree that your work is licensed under the MIT licence in
`LICENSE`.
