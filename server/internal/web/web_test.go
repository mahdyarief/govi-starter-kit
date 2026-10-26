package web

import (
	"io"
	"io/fs"
	"net/http"
	"strings"
	"testing"

	"github.com/gofiber/fiber/v3"
)

func newRequest(t *testing.T, path string) *http.Request {
	t.Helper()

	req, err := http.NewRequest(http.MethodGet, path, nil)
	if err != nil {
		t.Fatalf("new request %s: %v", path, err)
	}
	return req
}

// firstAssetName returns one hashed file from the embedded build, so the test
// does not depend on a specific Vite output name.
func firstAssetName(t *testing.T) string {
	t.Helper()

	dist, err := fs.Sub(assets, "dist")
	if err != nil {
		t.Fatalf("open embedded dist: %v", err)
	}
	entries, err := fs.ReadDir(dist, "assets")
	if err != nil {
		t.Fatalf("read assets dir: %v", err)
	}
	for _, entry := range entries {
		if strings.HasSuffix(entry.Name(), ".js") {
			return entry.Name()
		}
	}
	t.Fatal("no JavaScript asset in the embedded build")
	return ""
}

func newTestApp(t *testing.T) *fiber.App {
	t.Helper()

	handler, err := Handler()
	if err != nil {
		t.Fatalf("Handler(): %v", err)
	}

	app := fiber.New()
	app.Get("/health", func(c fiber.Ctx) error { return c.SendString("ok") })
	app.Get("/api/v1/known", func(c fiber.Ctx) error { return c.SendString("json") })
	app.Use(handler)

	return app
}

func TestHandlerServesShellForClientRoutes(t *testing.T) {
	t.Parallel()

	app := newTestApp(t)

	for _, path := range []string{"/", "/dashboard", "/master/categories"} {
		res, err := app.Test(newRequest(t, path))
		if err != nil {
			t.Fatalf("GET %s: %v", path, err)
		}
		body, err := io.ReadAll(res.Body)
		if err != nil {
			t.Fatalf("GET %s: read body: %v", path, err)
		}
		if res.StatusCode != fiber.StatusOK {
			t.Errorf("GET %s: status %d, want 200", path, res.StatusCode)
		}
		if !strings.Contains(string(body), `<div id="root">`) {
			t.Errorf("GET %s: body is not the SPA shell", path)
		}
	}
}

func TestHandlerLeavesAPINamespaceAlone(t *testing.T) {
	t.Parallel()

	app := newTestApp(t)

	// Matched API routes keep their own response.
	res, err := app.Test(newRequest(t, "/api/v1/known"))
	if err != nil {
		t.Fatalf("GET /api/v1/known: %v", err)
	}
	body, err := io.ReadAll(res.Body)
	if err != nil {
		t.Fatalf("GET /api/v1/known: read body: %v", err)
	}
	if string(body) != "json" {
		t.Errorf("GET /api/v1/known: body %q, want %q", body, "json")
	}

	// Unknown API routes must 404 instead of returning the SPA shell.
	res, err = app.Test(newRequest(t, "/api/v1/unknown"))
	if err != nil {
		t.Fatalf("GET /api/v1/unknown: %v", err)
	}
	body, err = io.ReadAll(res.Body)
	if err != nil {
		t.Fatalf("GET /api/v1/unknown: read body: %v", err)
	}
	if res.StatusCode != fiber.StatusNotFound {
		t.Errorf("GET /api/v1/unknown: status %d, want 404", res.StatusCode)
	}
	if strings.Contains(string(body), `<div id="root">`) {
		t.Error("GET /api/v1/unknown: returned the SPA shell")
	}
}

func TestHandlerServesStaticAsset(t *testing.T) {
	t.Parallel()

	app := newTestApp(t)

	res, err := app.Test(newRequest(t, "/assets/"+firstAssetName(t)))
	if err != nil {
		t.Fatalf("GET asset: %v", err)
	}
	if res.StatusCode != fiber.StatusOK {
		t.Errorf("GET asset: status %d, want 200", res.StatusCode)
	}
	if got := res.Header.Get("Content-Type"); !strings.Contains(got, "javascript") {
		t.Errorf("GET asset: Content-Type %q, want javascript", got)
	}
}
