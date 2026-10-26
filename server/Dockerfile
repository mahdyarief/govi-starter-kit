# syntax=docker/dockerfile:1

# Build context is the repository root, so the web app is reachable:
#   docker build -f server/Dockerfile .

FROM node:22-alpine AS web
WORKDIR /web
RUN corepack enable
COPY web/package.json web/pnpm-lock.yaml ./
RUN --mount=type=cache,target=/root/.local/share/pnpm/store \
    corepack pnpm install --frozen-lockfile
COPY web/ ./
RUN corepack pnpm build

# The build stage runs on the builder's own architecture and cross-compiles,
# so a multi-platform image needs no emulation.
FROM --platform=$BUILDPLATFORM golang:1.27-alpine AS build
WORKDIR /src

COPY server/go.mod server/go.sum ./
RUN --mount=type=cache,target=/go/pkg/mod go mod download

COPY server/ ./
# The SPA is embedded into the binary, so the final image carries no assets.
COPY --from=web /web/dist ./internal/web/dist

ARG TARGETOS TARGETARCH
RUN --mount=type=cache,target=/go/pkg/mod \
    --mount=type=cache,target=/root/.cache/go-build \
    CGO_ENABLED=0 GOOS=$TARGETOS GOARCH=$TARGETARCH \
    go build -trimpath -ldflags="-s -w" -o /out/ ./cmd/api ./cmd/migrate

# Static image with CA certificates and tzdata, no shell, running as nonroot.
FROM gcr.io/distroless/static-debian12:nonroot
WORKDIR /app

COPY --from=build /out/api /out/migrate ./

EXPOSE 8080
ENTRYPOINT ["/app/api"]
