# AGENTS.md

## Cursor Cloud specific instructions

This is a pnpm + Turborepo monorepo (`pnpm-workspace.yaml`) with three publishable/deployable units and one example:

- `app` — the microservice: a Hono + `@hono/zod-openapi` API deployed to Cloudflare Workers. Run locally with `wrangler dev`.
- `packages/javascript` — `@inialum/error-notification-service-javascript-sdk` (built with `tsup`).
- `packages/hono` — `@inialum/error-notification-service-hono-middleware` (depends on the JS SDK via `workspace:^`, built with `tsup`).
- `examples/hono-middleware` — a Workers example that consumes the Hono middleware.

### Toolchain
- Node is pinned by `.node-version` / `devEngines.runtime` (24.11.1) and pnpm by `packageManager` / `devEngines.packageManager` in `package.json` (11.21.0). A login shell resolves these via `nvm` (24.11.1 is the nvm default); non-login shells may fall back to a system Node 22, so prefer a login shell / `nvm use` if you hit version issues.

### Standard commands (from repo root; see root `package.json` scripts)
- Lint: `pnpm lint` (Biome). Auto-fix: `pnpm fix`.
- Typecheck: `pnpm typecheck` (Turbo; runs `^build` first).
- Tests: `pnpm test:ci` (Turbo → Vitest with coverage). `pnpm test` runs Vitest in persistent watch mode, so use `test:ci` for one-shot runs.
- Build: `pnpm build` (Turbo → `tsup` for the two SDK packages).

### Running the microservice (`app`)
- Requires `app/.dev.vars` (gitignored). Copy `app/.dev.vars.example` to `app/.dev.vars` and set:
  - `ENVIRONMENT="local"` (when `production`, CORS is locked to `https://inialum.org`).
  - `TOKEN_SECRET` — HS256 JWT secret. Generate one with `openssl rand -base64 32`.
  - `DISCORD_WEBHOOK_URL` — the only notification target currently supported. For local testing without a real Discord webhook, point this at a local mock HTTP server that returns `200`; the `POST /api/v1/notify` handler only checks `response.ok`.
- Start it: `pnpm --filter ./app dev` (or `cd app && pnpm run dev`). Serves on `http://localhost:7070`.
- Auth: every `/api/*` route requires a `Bearer <JWT>` signed with `TOKEN_SECRET`. Mint a token with `cd app && pnpm run create-token` (reads `app/.dev.vars`) and pass it as `Authorization: Bearer <token>`.
- Smoke test: `POST /api/v1/notify` with body `{title, description?, service_name, environment}` where `environment` is one of `local|staging|production`. Returns `{"status":"ok"}` on success, `400` on validation error, `401` without a valid token.

### Known gotcha
- The Swagger UI page at `GET /docs/v1` currently renders blank under local `wrangler dev` (`ReferenceError: __name is not defined`) because the inline `DisableTryItOutPlugin` is serialized with an esbuild `keepNames` helper that is undefined in the browser. The raw OpenAPI spec at `GET /schema/v1` works fine. This is a pre-existing issue, not an environment setup problem.
