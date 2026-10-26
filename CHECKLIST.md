# Checklist starter kit — Govi

Referensi: GitHub community health files, OpenSSF Scorecard, The Twelve-Factor
App, SLSA, OWASP ASVS, dan praktik umum starter kit (T3 stack, gogin-boilerplate).

Legenda: `[x]` ada dan terverifikasi · `[ ]` belum ada / belum lengkap
Prioritas: **P0** wajib sebelum dipakai orang lain · **P1** wajib sebelum rilis
publik · **P2** nice to have

## A. Identitas & metadata repo

- [x] Nama repo konsisten dengan produk (`govi-starter-kit`)
- [x] Deskripsi repo satu kalimat, menyebut stack dan sifat single-tenant
- [x] Branch default `main`
- [ ] **P0** LICENSE di root repo — saat ini hanya `server/LICENSE.md`
      (MIT, © 2026 masb0ymas). GitHub tidak mendeteksinya (`license: null`)
      karena file harus berada di root. Pindahkan ke `LICENSE` dan putuskan
      pemegang copyright.
- [ ] **P1** Topik repo: `go`, `fiber`, `react`, `vite`, `tanstack-router`,
      `postgresql`, `starter-kit`, `shadcn-ui`
- [ ] **P1** Tandai sebagai template (`is_template: true`) bila akan dipakai
      lewat tombol "Use this template"
- [ ] **P2** Badge README (CI, lisensi, versi Go/Node) — setelah CI ada

## B. Dokumentasi & community health files

- [x] `README.md`: ringkasan, requirements, quick start, layout, kontrak API,
      daftar perintah, production build
- [x] `.env.example` untuk `server/` dan `web/`
- [ ] **P0** `CONTRIBUTING.md` — setup, gaya commit, cara test/lint, aturan PR
- [ ] **P1** `SECURITY.md` — jalur pelaporan celah, versi didukung, SLA respons
- [ ] **P1** `CODE_OF_CONDUCT.md` (Contributor Covenant)
- [ ] **P2** `SUPPORT.md` — ke mana bertanya (issue vs diskusi)
- [ ] **P2** `.github/CODEOWNERS`
- [ ] **P2** `.github/PULL_REQUEST_TEMPLATE.md`
- [ ] **P2** `.github/ISSUE_TEMPLATE/{bug,feature}.yml`
- [x] `server/docs/agents/*` — catatan domain dan triage internal
- [ ] **P1** Panduan "cara menghapus resource demo `categories`"
- [ ] **P2** Screenshot UI di README (sign-in, dashboard, categories)

## C. DX / onboarding — lima menit pertama

- [x] Satu perintah install (`make install`)
- [x] Satu perintah menjalankan semuanya (`make dev`, `trap 'kill 0'`)
- [x] Database lokal lewat Docker Compose + healthcheck `pg_isready`
- [x] Migrasi otomatis saat boot (`MIGRATE_ON_BOOT=true`)
- [x] Seeder super user idempoten (`SEED_ON_BOOT=true`)
- [x] Konfigurasi 12-factor: semua lewat env, `.env` di-ignore, contoh ada
- [x] Validasi env web saat build (`@t3-oss/env-core` + zod)
- [x] Validasi env/flag server (`log.Fatalf` untuk tipe salah)
- [x] `APP_SECRET` minimal 32 karakter; debug ditolak di production
- [x] Proxy Vite ke API (`VITE_API_PROXY_TARGET`)
- [ ] **P0** Pin versi tool: `.nvmrc`/`.node-version`, `packageManager` +
      `engines` di `web/package.json`, dan catatan versi Go
- [ ] **P1** `.editorconfig` dan `.gitattributes` (normalisasi LF)
- [ ] **P1** Target `make fmt` (gofmt + prettier) dan `make check`
      (fmt-check + lint + test)
- [ ] **P1** Target `make seed` eksplisit di root
- [ ] **P2** `make setup` yang menyalin `.env.example` bila `.env` belum ada

## D. CI / otomasi (belum ada — workflow dihapus agar push bisa jalan)

Workflow asli tersimpan di `/tmp/govi-workflows-backup` (release.yml,
release-publish.yml). Tambahkan kembali setelah token punya scope `workflow`.

- [ ] **P0** Workflow `ci.yml`: `go vet`, `go test ./...`, `tsc --noEmit`,
      `pnpm build` pada push/PR ke `main`
- [ ] **P0** `permissions:` minimal di setiap workflow (default `contents: read`)
- [ ] **P1** Cache Go modules dan pnpm store
- [ ] **P1** Matrix Go 1.27 + Node 22
- [ ] **P1** `golangci-lint` (bukan hanya `go vet`) dan ESLint/Prettier di CI
- [ ] **P1** `.github/dependabot.yml` untuk `gomod`, `npm` (web), `docker`,
      `github-actions`
- [ ] **P1** CodeQL atau `gosec` untuk analisis keamanan
- [ ] **P2** OpenSSF Scorecard workflow
- [ ] **P2** Build image multi-arch ke `ghcr.io` + SBOM (syft) + provenance SLSA

## E. Kualitas kode & konvensi

- [x] TypeScript `strict` + `noUnusedLocals` + `noUnusedParameters`
- [x] Go: `go vet` bersih, 10 file test (authula, flag, validator, middleware,
      web embed, integration test yang di-gate `TEST_DB_DSN`)
- [x] Parameterized query (`$1`, `$2`) — tidak ada string interpolation nilai
- [x] Sort kolom lewat whitelist (`categorySortColumns`)
- [x] Pagination dengan clamp (limit ≤ 100, offset ≥ 0)
- [x] Error handler terpusat (`middlewares/catch_error.go`)
- [x] Graceful shutdown (`signal.NotifyContext` untuk SIGINT/SIGTERM)
- [ ] **P0** ESLint + Prettier (atau Biome) untuk `web/`
- [ ] **P1** `golangci-lint` config (`.golangci.yml`)
- [ ] **P1** Pre-commit hook (lefthook/husky) menjalankan fmt + lint
- [ ] **P1** Coverage report Go + threshold minimum
- [ ] **P1** Test frontend (Vitest + Testing Library) — saat ini nol
- [ ] **P2** E2E Playwright untuk alur sign-in + CRUD categories
- [ ] **P2** Constraint `UNIQUE` pada `categories.name` (sekarang hanya
      validasi panjang ≤ 100; duplikat lolos)

## F. Keamanan (OWASP ASVS baseline)

- [x] Session cookie `HttpOnly`, `SameSite=Lax`, `Secure` di luar development
- [x] Auth berbasis cookie saja (tanpa bearer) agar access token tidak dicuri
- [x] Rate limit per IP: 30/menit untuk auth, 120/menit untuk API lain
- [x] Idempotency guard pada endpoint tulis
- [x] CORS eksplisit via `CORS_ALLOWED_ORIGINS` (kosong = same-origin)
- [x] `APP_SECRET` minimal 32 byte; debug ditolak di production
- [x] SQL injection tertutup oleh parameterized query
- [x] Image runtime distroless, nonroot, tanpa shell
- [ ] **P0** Body limit pada request (`fiber.Config{BodyLimit: ...}`) —
      saat ini tidak diset
- [ ] **P1** Security headers (`helmet`: HSTS, X-Content-Type-Options, CSP)
- [ ] **P1** `SECURITY.md` + `security@` contact
- [ ] **P1** Rotasi/penyimpanan secret terdokumentasi (bukan `.env` di server)
- [ ] **P2** Audit dependency otomatis (`govulncheck`, `pnpm audit`) di CI
- [ ] **P2** Rate limit & idempotency pakai shared store (Redis) agar benar
      saat replica > 1 — sekarang in-memory per proses

## G. Observability & operasi

- [x] `/health` endpoint (dipakai dashboard)
- [x] Structured logging (`slog`) + Sentry hook (`SENTRY_DSN`)
- [x] Graceful shutdown dengan timeout
- [x] Docker multi-stage, build cache mount, cross-compile
- [ ] **P1** `/ready` terpisah dari `/health` (cek DB, bukan hanya proses hidup)
- [ ] **P1** `HEALTHCHECK` di Dockerfile atau compose untuk image aplikasi
- [ ] **P1** Log request terstruktur (method, path, status, durasi, request-id)
- [ ] **P1** Request timeout + `ReadTimeout`/`WriteTimeout` di server
- [ ] **P2** OpenTelemetry tracing
- [ ] **P2** Metrics Prometheus (`/metrics`) + dashboard
- [ ] **P2** Pin image Docker dengan digest (`@sha256:...`), bukan tag saja

## H. Database & migrasi

- [x] Migrasi berversi (golang-migrate) dengan up/down
- [x] UUIDv7 sebagai primary key (butuh PostgreSQL 18)
- [x] Soft delete (`deleted_at`) pada categories
- [x] Migration CLI terpisah (`cmd/migrate`) + `force` untuk pemulihan
- [x] Seeder idempoten
- [ ] **P1** Index untuk kolom yang sering difilter (`deleted_at`, `name`)
- [ ] **P1** Strategi backup & restore terdokumentasi
- [ ] **P2** Test migrasi up→down→up di CI
- [ ] **P2** Kebijakan retensi data soft-deleted

## I. Kontrak API & frontend

- [x] Envelope konsisten `{data, metadata?, message?}` untuk endpoint aplikasi
- [x] Authula tidak dibungkus ulang (respons native dipertahankan)
- [x] Tipe frontend selaras (`ApiItemResponse`, `AxiosItemResponse`)
- [x] Role aplikasi dibaca dari `GET /api/v1/me`
- [x] UI responsif terverifikasi 390px / 820px / 1440px tanpa overflow
- [ ] **P1** Spesifikasi OpenAPI 3.1 (`server/docs/openapi.yaml`) + validasi
      kontrak di CI
- [ ] **P1** Contoh `.http`/curl untuk setiap endpoint di README atau `docs/`
- [ ] **P2** Versioning API eksplisit dan kebijakan breaking change
- [ ] **P2** Generated client dari OpenAPI agar tipe tidak drift

## J. Rilis & distribusi

- [x] `release-it` + conventional changelog (`server/.release-it.json`)
- [x] `CHANGELOG.md` tersedia
- [x] Dockerfile siap produksi (distroless, nonroot, `-trimpath -ldflags="-s -w"`)
- [ ] **P1** Tag `v0.1.0` + GitHub Release pertama
- [ ] **P1** Workflow publish image ke `ghcr.io` (file ada di backup, belum aktif)
- [ ] **P1** Dokumentasi upgrade path antar versi
- [ ] **P2** Homebrew/binary release untuk `cmd/api` dan `cmd/migrate`
- [ ] **P2** `goreleaser` untuk build multi-platform otomatis

## K. Lisensi & kepatuhan

- [x] MIT di `server/LICENSE.md`
- [ ] **P0** Pindahkan ke `LICENSE` di root agar GitHub mendeteksi
- [ ] **P1** Pastikan kompatibilitas lisensi dependency (Authula, shadcn/ui)
- [ ] **P2** `THIRD_PARTY_NOTICES.md` untuk dependency langsung
- [ ] **P2** Pernyataan dukungan versi di `SECURITY.md`

---

## Ringkasan prioritas

**P0 sebelum dipakai orang lain (5 item)**
1. LICENSE di root
2. `CONTRIBUTING.md`
3. Pin versi tool (`.nvmrc`, `packageManager`, `engines`)
4. CI `ci.yml` (vet + test + typecheck + build)
5. Body limit request

**P1 sebelum rilis publik (19 item)** — lihat item bertanda P1 di atas.

**Sudah kuat:** auth berbasis cookie, rate limit, idempotency, graceful
shutdown, parameterized query, migrasi berversi, single-binary deploy,
UI responsif, env validation di kedua sisi, TypeScript strict.
