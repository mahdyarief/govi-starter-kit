package web

import (
	"embed"
	"errors"
	"fmt"
	"io/fs"
	"path"
	"strings"

	"github.com/gofiber/fiber/v3"
)

// `make build-web` copies the Vite output here, so the SPA ships inside the API
// binary. The directory always exists (it holds .gitkeep) even before a build.
//
//go:embed all:dist
var assets embed.FS

const indexFile = "index.html"

// ErrNoBuild means the binary was compiled without a web build. The API still
// runs; only the SPA routes are unavailable.
var ErrNoBuild = errors.New("web: no embedded build, run `make build-web` before `go build`")

// Handler serves the embedded SPA. It is meant to be registered after the API
// routes: anything the router already matched never reaches it, and every other
// GET is a client-side route that needs the shell.
func Handler() (fiber.Handler, error) {
	dist, err := fs.Sub(assets, "dist")
	if err != nil {
		return nil, fmt.Errorf("web: open embedded dist: %w", err)
	}

	index, err := fs.ReadFile(dist, indexFile)
	if err != nil {
		return nil, ErrNoBuild
	}

	return func(c fiber.Ctx) error {
		if c.Method() != fiber.MethodGet && c.Method() != fiber.MethodHead {
			return c.Next()
		}

		// The API namespace is JSON-only: an unknown endpoint must 404 as an
		// error, not silently return the SPA shell.
		if c.Path() == "/health" || strings.HasPrefix(c.Path(), "/api/") {
			return c.Next()
		}

		name := strings.TrimPrefix(path.Clean("/"+c.Path()), "/")
		if name == "" || name == "." {
			return c.Type("html").Send(index)
		}

		if _, err := fs.Stat(dist, name); err != nil {
			return c.Type("html").Send(index)
		}

		return c.SendFile(name, fiber.SendFile{FS: dist, CacheDuration: -1})
	}, nil
}
