# Checklist starter kit — Govi

Referensi: GitHub community health files, OpenSSF Scorecard, The Twelve-Factor
App, SLSA, OWASP ASVS 4.0.3, dan praktik umum starter kit (T3 stack,
gogin-boilerplate). Audit terakhir: 2026-10-26.

Legenda: `[x]` ada dan terverifikasi di repo · `[ ]` belum ada / belum lengkap
Prioritas: **P0** wajib sebelum dipakai orang lain · **P1** wajib sebelum rilis
publik · **P2** nice to have

## A. Identitas & metadata repo

- [x] Nama repo konsisten dengan produk (`govi-starter-kit`); remote
      `github.com/mahdyarief/govi-starter-kit`
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
- [ ] **P1** Branch protection di `main` (wajib PR + status check) — belum
      bisa dipasang sebelum CI ada
- [ ] **P2** Badge README (CI, lisensi, versi Go/Node) — setelah CI ada
- [ ] **P2** Social preview image repo

## B. Dokumentasi & community health files

- [x] `README.md` root: ringkasan, requirements, quick start, layout, kontrak
      API, daftar perintah, production build, environment (125 baris)
- [x] `server/README.md`, `CLAUDE.md`, dan `AGENTS.md` untuk konteks agen
- [x] `.env.example` untuk `server/` dan `web/`
- [x] `.coderabbit.yaml` dengan path_instructions Go, test, TS/TSX, dan MD
- [x] `server/docs/agents/*` — catatan domain dan triage internal
- [ ] **P0** `CONTRIBUTING.md` — setup, gaya commit, cara test/lint, aturan PR
- [ ] **P1** `SECURITY.md` — jalur pelaporan celah, versi didukung, SLA respons
- [ ] **P1** `CODE_OF_CONDUCT.md` (Contributor Covenant)
- [ ] **P1** Dokumen arsitektur ringkas (diagram komponen + alur auth) atau ADR
      untuk keputusan besar: single-tenant, Authula embedded, envelope ganda
- [ ] **P1** Panduan "cara menghapus resource demo `categories`"

- [ ] **P2** `SUPPORT.md` — ke mana bertanya (issue vs diskusi)
- [ ] **P2** `.github/CODEOWNERS`
- [ ] **P2** `.github/PULL_REQUEST_TEMPLATE.md`
- [ ] **P2** `.github/ISSUE_TEMPLATE/{bug,feature}.yml`
- [ ] **P2** Screenshot UI di README (sign-in, dashboard, categories)
- [ ] **P1** `CHANGELOG.md` di root — saat ini hanya `server/CHANGELOG.md`;
      rilis `release-it` menulis changelog server saja, padahal rilis mencakup
      web + server sekaligus
- [ ] **P2** Dokumentasi batasan single-tenant (apa yang harus diubah bila
      nanti butuh multi-tenant)

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
      `engines` di `web/package.json`, dan catatan versi Go. README menyebut
      Node 22/pnpm 10, tapi tidak ada file yang menegakkannya
- [ ] **P1** `.editorconfig` dan `.gitattributes` (normalisasi LF) — keduanya
      belum ada
- [ ] **P1** Target `make fmt` (gofmt + prettier) dan `make check`
      (fmt-check + lint + test)
- [ ] **P1** Target `make seed` eksplisit di root — sekarang hanya lewat
      `SEED_ON_BOOT` / `server/Makefile` (`db/migrations/up/seed`)
- [ ] **P2** `make setup` yang menyalin `.env.example` bila `.env` belum ada
- [ ] **P2** Healthcheck container aplikasi di compose (bukan hanya Postgres)

## D. CI / otomasi (belum ada — workflow dihapus agar push bisa jalan)

Workflow asli tersimpan di `/tmp/govi-workflows-backup` (release.yml,
release-publish.yml). Tambahkan kembali setelah token `gh` punya scope
`workflow`. Jangan menambahkan `.github/workflows/*` sebelum itu — push akan
ditolak.

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
- [ ] **P2** Job CI yang menjalankan migrasi up→down→up terhadap Postgres 18
      sungguhan (bukan hanya build)

## E. Kualitas kode & konvensi

- [x] TypeScript `strict` + `noUnusedLocals` + `noUnusedParameters` +
      `noFallthroughCasesInSwitch` + `noUncheckedSideEffectImports`
- [x] Go: `go vet` bersih, 10 file test (authula, flag, validator, middleware,
      web embed, integration test yang di-gate `TEST_DB_DSN`)
- [x] Parameterized query (`$1`, `$2`) — tidak ada string interpolation nilai
- [x] Sort kolom lewat whitelist (`categorySortColumns`)
- [x] Pagination dengan clamp (limit ≤ 100, offset ≥ 0)
- [x] Error handler terpusat (`middlewares/catch_error.go`)
- [x] Graceful shutdown (`signal.NotifyContext` untuk SIGINT/SIGTERM)
- [x] Tidak ada `console.log` / `debugger` tertinggal di `web/src`
- [ ] **P0** ESLint + Prettier (atau Biome) untuk `web/` — tidak ada config
      maupun script lint/format sama sekali
- [ ] **P1** `golangci-lint` config (`.golangci.yml`)
- [ ] **P1** Pre-commit hook (lefthook/husky) menjalankan fmt + lint
- [ ] **P1** Coverage report Go + threshold minimum
- [ ] **P1** Test frontend (Vitest + Testing Library) — saat ini nol file test
- [ ] **P2** E2E Playwright untuk alur sign-in + CRUD categories
- [ ] **P2** Constraint `UNIQUE` pada `categories.name` (sekarang hanya
      validasi panjang ≤ 100; duplikat lolos). Perlu keputusan produk:
      unique global atau cukup unique di antara baris yang belum dihapus
      (`UNIQUE ... WHERE deleted_at IS NULL`)

## F. Keamanan (OWASP ASVS baseline)

- [x] Session cookie Authula `HttpOnly`, `SameSite=lax`, dan `Secure` di luar
      `ENV=development` (lihat `config.go` + `authula.go`)
- [x] Rate limit per IP: 30/menit untuk auth, 120/menit untuk API lain, dengan
      daftar pengecualian `RATE_LIMIT_EXEMPT_IPS`
- [x] Idempotency guard pada endpoint tulis, key di-scope per caller + route
      (`Idempotency-Key` maupun `X-Idempotency-Key`)
- [x] CORS eksplisit via `CORS_ALLOWED_ORIGINS` (kosong = same-origin),
      `AllowCredentials` hanya untuk origin terdaftar
- [x] Pertahanan CSRF untuk cookie `SameSite=Lax`
      (`middlewares.CrossOrigin`, dipasang sebelum CORS)
- [x] Security headers via `helmet.New()` (HSTS, X-Content-Type-Options, dll.)
- [x] Request ID (`requestid.New()`) dan kompresi respons (`compress.New()`)
- [x] `recover.New()` — panic tidak mematikan proses
- [x] `APP_SECRET` minimal 32 byte; debug ditolak di production
- [x] SQL injection tertutup oleh parameterized query
- [x] Image runtime distroless, nonroot, tanpa shell
- [x] Password policy Authula: min 8 / max 128, reset link 1 jam, sesi dihapus
      saat ganti password, `BeforeSignIn` menolak email belum terverifikasi
- [ ] **P0** Body limit pada request (`fiber.Config{BodyLimit: ...}`) — saat ini
      tidak diset, jadi body besar diterima sampai batas fasthttp
- [ ] **P1** Klarifikasi model auth frontend: access/refresh token disimpan di
      cookie yang bisa dibaca JavaScript (`token-storage.ts`) lalu dikirim
      sebagai `Authorization: Bearer` (`client-fetch.ts`). Ini menyimpang dari
      klaim "cookie-only" dan membuka jalur XSS→token theft. Pilih satu:
      (a) hapus penyimpanan token di klien dan andalkan cookie sesi saja, atau
      (b) dokumentasikan trade-off-nya secara eksplisit
- [ ] **P1** `SECURITY.md` + alamat `security@`
- [ ] **P1** Rotasi/penyimpanan secret terdokumentasi (bukan `.env` di server)
- [ ] **P1** Parity env: `RATE_LIMIT_EXEMPT_IPS` dan `TRUSTED_PROXIES` dibaca
      kode tapi tidak ada di `server/.env.example` maupun README
- [ ] **P2** Audit dependency otomatis (`govulncheck`, `pnpm audit`) di CI
- [ ] **P2** Rate limit & idempotency pakai shared store (Redis) agar benar
      saat replica > 1 — sekarang in-memory per proses

## G. Observability & operasi

- [x] `/health` mem-ping database, jadi probe gagal saat DB tidak terjangkau
- [x] Structured logging (`slog`) + Sentry hook (`SENTRY_DSN`), panic
      di-repanic agar tetap terlihat
- [x] Graceful shutdown dengan timeout
- [x] Timeout server: `ReadTimeout` 15s, `WriteTimeout` 30s, `IdleTimeout` 60s
- [x] Docker multi-stage, build cache mount, cross-compile
- [ ] **P1** `/ready` terpisah dari `/health` bila nanti butuh probe berbeda
      untuk liveness vs readiness
- [ ] **P1** `HEALTHCHECK` di Dockerfile atau compose untuk image aplikasi
- [ ] **P1** Format log request kaya konteks (method, path, status, durasi,
      request-id) — `logger.New()` bawaan Fiber belum menyertakan request-id
      dalam format terstruktur
- [ ] **P2** OpenTelemetry tracing
- [ ] **P2** Metrics Prometheus (`/metrics`) + dashboard
- [ ] **P2** Pin image Docker dengan digest (`@sha256:...`), bukan tag saja

## H. Database & migrasi

- [x] Migrasi berversi (golang-migrate) dengan up/down untuk ketiga migrasi
- [x] UUIDv7 sebagai primary key (butuh PostgreSQL 18)
- [x] Soft delete (`deleted_at`) pada categories
- [x] Index pada kolom yang sering difilter: `idx_categories_created_at`,
      `idx_categories_deleted_at`, `idx_categories_name`, `idx_users_email`
- [x] Migration CLI terpisah (`cmd/migrate`) + `force` untuk pemulihan
- [x] Seeder idempoten
- [ ] **P1** Strategi backup & restore terdokumentasi
- [ ] **P2** Test migrasi up→down→up di CI
- [ ] **P2** Kebijakan retensi data soft-deleted
- [ ] **P2** Index komposit untuk query list yang umum (mis. `deleted_at` +
      `created_at`) — perlu diukur dulu dengan `EXPLAIN` sebelum ditambah

## I. Kontrak API & frontend

- [x] Envelope konsisten `{data, metadata?, message?}` untuk endpoint aplikasi
- [x] Authula tidak dibungkus ulang (respons native dipertahankan)
- [x] Tipe frontend selaras (`ApiItemResponse`, `AxiosItemResponse`)
- [x] Role aplikasi dibaca dari `GET /api/v1/me`
- [x] UI responsif terverifikasi 390px / 820px / 1440px tanpa overflow
- [x] `web/pnpm-lock.yaml` dan `server/go.sum` ter-track (build reproducible)
- [ ] **P1** Spesifikasi OpenAPI 3.1 (`server/docs/openapi.yaml`) + validasi
      kontrak di CI
- [ ] **P1** Contoh `.http`/curl untuk setiap endpoint di README atau `docs/`
- [ ] **P2** Versioning API eksplisit dan kebijakan breaking change
- [ ] **P2** Generated client dari OpenAPI agar tipe tidak drift

## J. Rilis & distribusi

- [x] `release-it` + conventional changelog (`server/.release-it.json`)
- [x] `server/CHANGELOG.md` tersedia
- [x] Dockerfile siap produksi (distroless, nonroot, `-trimpath -ldflags="-s -w"`)
- [ ] **P1** Tag `v0.1.0` + GitHub Release pertama (repo belum punya tag)
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

## L. Frontend, aksesibilitas & metadata

- [x] TypeScript strict, alias path konsisten (`@/*`, `#/*`)
- [x] Struktur route TanStack Router jelas: `__root`, `(app)` shell, `sign-in`
- [x] Komponen UI shadcn/ui + Tailwind v4, token tema terpusat
- [x] Query layer terpisah (`queries/`, `services/`, `dtos/`, `models/`)
- [x] Toast (`sonner`) dan error page/not-found page tersedia
- [x] `aria-*` dan `sr-only` dipakai di komponen (29 `aria-`, 11 `sr-only`)
- [ ] **P1** Skip link "Langsung ke konten" + landmark `<main>` yang konsisten
- [ ] **P1** Audit aksesibilitas terjadwal (axe/Lighthouse) dan catat baseline
- [ ] **P1** Meta & identitas halaman: `favicon`, `meta description`,
      Open Graph/Twitter card, `theme-color`. `web/index.html` masih minimal
      dan `web/public/` belum ada
- [ ] **P1** Strategi i18n — UI masih hard-coded satu bahasa, belum ada
      library atau ekstraksi string
- [ ] **P2** Loading/empty/error state eksplisit untuk setiap tabel dan form
      (verifikasi per halaman, bukan hanya global error boundary)
- [ ] **P2** Audit bundle (`vite build` + visualizer) dan lazy-load route berat
- [ ] **P2** Sentry/browser error reporting untuk sisi klien

## M. Higiene repo & aset

- [x] `.gitignore` menutup `.env*`, `node_modules`, `dist`, dan state tooling
- [x] `.dockerignore` mengecualikan `.git`, `*.md`, `.env*`, `node_modules`,
      `dist`, dan state tooling
- [x] Tidak ada `console.log`/`debugger` tertinggal
- [x] `server/docs/agents/*` mendokumentasikan alur kerja internal
- [ ] **P1** Hapus aset mati: `server/public/static/images/golang.jpg` dan
      `server/templates/` (tidak direferensikan kode mana pun)
- [ ] **P1** Selesaikan working tree: `M .gitignore` (`/graft/`) dan
      `.ignore` (untracked) belum di-commit
- [ ] **P2** Pastikan tidak ada direktori `node_modules`/`pnpm-lock.yaml` liar
      di `server/` yang ikut ter-track (saat ini `server/pnpm-lock.yaml`
      di-ignore, `server/node_modules` ada di disk)
- [ ] **P2** `.vscode/extensions.json` dengan rekomendasi ekstensi (Go,
      ESLint, Prettier, Tailwind)

---

## Ringkasan prioritas

**P0 sebelum dipakai orang lain (7 item)**
1. LICENSE di root (item A; duplikat di bagian K menunjuk hal yang sama)
2. `CONTRIBUTING.md`
3. Pin versi tool (`.nvmrc`, `packageManager`, `engines`)
4. CI `ci.yml` (vet + test + typecheck + build)
5. `permissions:` minimal di setiap workflow
6. ESLint + Prettier (atau Biome) untuk `web/`
7. Body limit request (`fiber.Config{BodyLimit}`)

**P1 sebelum rilis publik** — lihat item bertanda P1 di atas; yang paling
berisiko: model token frontend (cookie vs bearer), parity env
`RATE_LIMIT_EXEMPT_IPS`/`TRUSTED_PROXIES`, lint/format web, test frontend,
meta/SEO, skip link, dan `HEALTHCHECK` image.

**Sudah kuat:** session cookie `HttpOnly`+`SameSite`+`Secure`, CSRF
cross-origin guard, helmet, rate limit, idempotency ter-scope, graceful
shutdown, timeout server, parameterized query, migrasi berversi + index,
single-binary deploy, env validation di kedua sisi, TypeScript strict,
lockfile ter-track.
