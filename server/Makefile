-include .env
# Every setting reaches the binaries through the environment, never as an
# argument: process arguments are visible to other users of the machine.
export

# ==================================================================================== #
# HELPERS
# ==================================================================================== #

## help: print this help message
.PHONY: help
help:
	@echo 'Usage:'
	@sed -n 's/^##//p' $(MAKEFILE_LIST) | column -t -s ':' |  sed -e 's/^/ /'

# ==================================================================================== #
# APPLICATION
# ==================================================================================== #

## run: run the application (configuration comes from .env)
.PHONY: run
run:
	go run ./cmd/api

# ==================================================================================== #
# MIGRATIONS
# ==================================================================================== #

## db/psql: connect to the database using psql
.PHONY: db/psql
db/psql:
	psql ${DB_DSN}

## db/migrations/new name=$1: create a new database migration
.PHONY: db/migrations/new
db/migrations/new:
	@echo 'Creating migration files for $(name)...'
	migrate create -seq -ext=.sql -dir=./migrations $(name)

## db/migrations/up: apply all up database migrations
.PHONY: db/migrations/up
db/migrations/up:
	@go run ./cmd/migrate up

## db/migrations/up/seed: apply all up database migrations and run seeders
.PHONY: db/migrations/up/seed
db/migrations/up/seed:
	@go run ./cmd/migrate --seed up

## db/migrations/force version=$1: set the schema version after a failed migration (-1 for none)
.PHONY: db/migrations/force
db/migrations/force:
	@go run ./cmd/migrate force $(version)

## db/migrations/down: roll back every migration, deleting all data (localhost only)
.PHONY: db/migrations/down
db/migrations/down:
	@go run ./cmd/migrate down

## db/migrations/refresh: roll back and reapply every migration, deleting all data (localhost only)
.PHONY: db/migrations/refresh
db/migrations/refresh:
	@go run ./cmd/migrate refresh

## db/migrations/refresh/seed: refresh, then run seeders
.PHONY: db/migrations/refresh/seed
db/migrations/refresh/seed:
	@go run ./cmd/migrate --seed refresh

# ==================================================================================== #
# BUILD
# ==================================================================================== #

WEB_DIR := ../web
WEB_DIST := ./internal/web/dist
PNPM ?= corepack pnpm

## build/web: build the React SPA and copy it into the embed directory
.PHONY: build/web
build/web:
	@echo 'Building web...'
	cd $(WEB_DIR) && $(PNPM) install --frozen-lockfile
	cd $(WEB_DIR) && $(PNPM) build
	rm -rf $(WEB_DIST)
	mkdir -p $(WEB_DIST)
	cp -R $(WEB_DIR)/dist/. $(WEB_DIST)/
	touch $(WEB_DIST)/.gitkeep

## dev/web: run the Vite dev server (proxies /api to the API on :8080)
.PHONY: dev/web
dev/web:
	cd $(WEB_DIR) && $(PNPM) dev

## build: build the SPA, then both Go binaries with it embedded
.PHONY: build
build: build/web build/api build/migrate

## build/api: build the cmd/api application
.PHONY: build/api
build/api:
	@echo 'Building cmd/api...'
	go build -ldflags="-s" -o=./bin/api ./cmd/api
	CGO_ENABLED=0 GOOS=linux GOARCH=amd64 go build -ldflags="-s" -o=./bin/linux_amd64/api ./cmd/api

## build/migrate: build the cmd/migrate application
.PHONY: build/migrate
build/migrate:
	@echo 'Building cmd/migrate...'
	go build -ldflags="-s" -o=./bin/migrate ./cmd/migrate
	CGO_ENABLED=0 GOOS=linux GOARCH=amd64 go build -ldflags="-s" -o=./bin/linux_amd64/migrate ./cmd/migrate
