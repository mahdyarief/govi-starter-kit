# Govi starter kit — one entry point for both halves of the repo.
#
# The server keeps its own Makefile for migrations and Go-only targets; this
# root file is the shortcut for the day-to-day loop.

SHELL := /bin/bash
SERVER_DIR := server
WEB_DIR := web
PNPM ?= corepack pnpm
COMPOSE ?= docker compose

## help: print this help message
.PHONY: help
help:
	@echo 'Usage:'
	@sed -n 's/^##//p' $(MAKEFILE_LIST) | column -t -s ':' | sed -e 's/^/ /'

## install: install web dependencies and download Go modules
.PHONY: install
install:
	cd $(WEB_DIR) && $(PNPM) install
	cd $(SERVER_DIR) && go mod download

## dev: run the API and the Vite dev server together
.PHONY: dev
dev:
	@echo 'API on :8080, web on :3000. Ctrl-C stops both.'
	@trap 'kill 0' EXIT; \
		(cd $(SERVER_DIR) && go run ./cmd/api) & \
		(cd $(WEB_DIR) && $(PNPM) dev) & \
		wait

## dev-server: run only the API (needs a reachable PostgreSQL)
.PHONY: dev-server
dev-server:
	cd $(SERVER_DIR) && go run ./cmd/api

## dev-web: run only the Vite dev server (proxies /api to :8080)
.PHONY: dev-web
dev-web:
	cd $(WEB_DIR) && $(PNPM) dev

## build: build the SPA and embed it into a single API binary
.PHONY: build
build:
	cd $(SERVER_DIR) && $(MAKE) build

## build-web: build the SPA only, into web/dist
.PHONY: build-web
build-web:
	cd $(WEB_DIR) && $(PNPM) build

## test: run the Go test suite
.PHONY: test
test:
	cd $(SERVER_DIR) && go test ./...

## lint: vet the Go code and typecheck the web app
.PHONY: lint
lint:
	cd $(SERVER_DIR) && go vet ./...
	cd $(WEB_DIR) && $(PNPM) exec tsc --noEmit

## db-up: start PostgreSQL in the background
.PHONY: db-up
db-up:
	$(COMPOSE) up -d postgres

## db-down: stop PostgreSQL (the volume is kept)
.PHONY: db-down
db-down:
	$(COMPOSE) down

## db-reset: delete the database volume and start a clean PostgreSQL
.PHONY: db-reset
db-reset:
	$(COMPOSE) down -v
	$(COMPOSE) up -d postgres

## clean: remove build output
.PHONY: clean
clean:
	rm -rf $(WEB_DIR)/dist $(SERVER_DIR)/bin
	rm -rf $(SERVER_DIR)/internal/web/dist
	mkdir -p $(SERVER_DIR)/internal/web/dist
	touch $(SERVER_DIR)/internal/web/dist/.gitkeep
