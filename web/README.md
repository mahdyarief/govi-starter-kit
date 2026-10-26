# Govi web

The React half of the Govi starter kit: a Vite SPA with TanStack Router,
TanStack Query, TanStack Form, TanStack Table, Tailwind v4 and shadcn/ui
primitives. It talks to the Go API under `/api/v1`.

See the [root README](../README.md) for the full quick start.

## Run

```sh
cp .env.example .env
corepack pnpm install
corepack pnpm dev        # http://localhost:3000
```

The dev server proxies `/api` to `VITE_API_PROXY_TARGET` (default
`http://localhost:8080`), so no CORS setup is needed while developing.

## Build

```sh
corepack pnpm build
```

Vite writes to `dist/`. The root `make build` copies that directory into
`server/internal/web/dist` and compiles it into the Go binary; standalone
`make build-web` only produces `dist/`.

## Environment

| Variable | Notes |
| --- | --- |
| `VITE_APP_NAME` | Shown in the document title and the sign-in card |
| `VITE_API_URL` | API origin. Empty means same origin, which is what the embedded build uses |
| `VITE_API_PROXY_TARGET` | Dev-only proxy target for `/api` |

## Layout

| Path | What lives there |
| --- | --- |
| `src/routes` | File-based TanStack Router routes; `__root.tsx` holds the shell |
| `src/components/ui` | shadcn/ui primitives |
| `src/components/layout` | Sidebar, header, page shell |
| `src/components/block` | Feature blocks (auth, dashboard, master data) |
| `src/lib/api/models` | Response models, one file per resource |
| `src/lib/api/dtos` | Zod schemas and inferred form DTOs |
| `src/lib/api/services` | Axios resources; `clientResource(path, methods)` builds the CRUD set |
| `src/lib/api/queries` | TanStack Query options and invalidation |
| `src/lib/auth` | Session handling and token storage |

## Adding a resource

Follow the category example end to end:

1. `src/lib/api/models/<resource>.ts` — the response shape.
2. `src/lib/api/dtos/master/<resource>/schema.ts` — the zod schema.
3. `src/lib/api/services/types/<resource>.ts` and `services/<resource>.ts` —
   `clientResource('/api/v1/<resources>', methods)`.
4. `src/lib/api/queries/<resource>.ts` — list/get/create/update/delete options.
5. Register the service and the query in their `index.ts` barrels.
6. `src/components/block/master/<resource>/{column,form,table}.tsx`.
7. `src/routes/(app)/master/<resources>/index.tsx`.
8. Add the entry to `src/data/sidebar-menu.ts`.

## API notes

Authula answers `/api/v1/auth/*` with its native shapes, so `sign-in` and
`token/refresh` are **not** wrapped in `{data}`. Application endpoints such as
`GET /api/v1/me` use the usual `{data, metadata?, message?}` envelope. The
access token lasts 15 minutes; `client-fetch.ts` refreshes it once on a 401 and
signs the user out if the refresh fails.

The application role (`super_user` or `user`) comes from `GET /api/v1/me`, not
from Authula, and drives the sidebar menu.
