# Agent guide — Sonic Bloom (sonic-bloom-main)

## Purpose

Vite + React + TypeScript SPA: a music library and playback UI. Marketing landing at `/`; main app under `/app` with sidebar, player bar, search, and library/detail/settings routes. **Data is mock/in-memory** (`src/lib/mock-data.ts`, `src/lib/store.ts`); there is no backend or real streaming integration in this repo yet.

## Commands

| Task | Command |
|------|---------|
| Dev server (port **8080**) | `npm run dev` |
| Production build | `npm run build` |
| Preview build | `npm run preview` |
| Lint | `npm run lint` |
| Unit tests (Vitest) | `npm test` |
| Watch tests | `npm run test:watch` |
| E2E (Playwright) | `npm run test:e2e` (config: `playwright.config.ts`; plan: `docs/TEST-PLAN.md`) |
| Cloudflare Workers Builds (deploy checklist) | `docs/CLOUDFLARE_WORKERS_BUILDS.md` |
| Full verify (lint + unit + E2E + build) | `npm run verify` |
| Cloudflare Pages + Functions (local) | `npm run pages:dev` |
| Cloudflare Pages deploy | `npm run pages:deploy` (requires `wrangler login`) |
| Upload `dist/` only (e.g. CI after build) | `npm run pages:upload` or `npm run deploy` |

Path alias: `@/` → `src/` (see `vite.config.ts`, `tsconfig`).

## Cloudflare (hosting + API)

- **Workers Builds / custom deploy step**: after the build, run **`bun run deploy`** (or **`npm run deploy`**, or **`npx wrangler pages deploy dist`**). In the Cloudflare dashboard, replace **`npx wrangler deploy`** with one of those — `wrangler deploy` targets **Workers** and fails here (`Missing entry-point`). **Git-connected Pages** often need no separate deploy command; output directory `dist` is enough.
- **Static app**: Vite `dist/` is the Pages build output (`wrangler.toml` → `pages_build_output_dir`).
- **SPA routing**: `public/_redirects` copies to `dist` — `/*` → `/index.html` (200 rewrite) for React Router.
- **Backend (edge)**: **Pages Functions** in `functions/` — only `/api/*` invokes Functions (`public/_routes.json` → `dist/_routes.json`) so static asset traffic stays cheap.
- **Sample endpoint**: `GET /api/health` → `functions/api/health.ts`.
- **Frontend API base**: `src/lib/api-base.ts` — optional `VITE_API_BASE_URL` for a non–same-origin API later; default is same-origin `/api`.
- **Secrets (local)**: copy `.dev.vars.example` → `.dev.vars` for `wrangler pages dev` (gitignored).
- **Dashboard**: **`name`** in `wrangler.toml` must match what Cloudflare expects for this repo (currently **`radio-development`**, per dashboard / Git `radio-development`). **`account_id`** in `wrangler.toml` pins account **`8724aa41…`**. The account Workers subdomain is **`urbanradio.workers.dev`** (Pages URLs use **`radio-development.pages.dev`** or a custom domain). Connect the Git repo, or deploy with a CI token that has **Account → Cloudflare Pages → Edit** (or use the “Edit Cloudflare Workers” token template, which includes Pages). If deploy fails with **Authentication error [10000]**, fix the token scopes or rotate `CLOUDFLARE_API_TOKEN` in the build environment.
- **Cloudflare Access**: edge login (Zero Trust → Access) protects the hostname before the SPA loads; optional JWT enforcement on `/api/*` when `ACCESS_TEAM_DOMAIN` and `ACCESS_POLICY_AUD` are set on the Pages project. See **`CLOUDFLARE_ACCESS.md`**.
- **App login (username/password)**: optional **`VITE_REQUIRE_AUTH=true`** in Vite env — requires a **Login** page before `/app`. Pages Functions use **`AUTH_JWT_SECRET`** (HS256 session JWT in `sb_session` cookie) and D1 table **`auth_users`** (`migrations/0003_auth_users.sql`). Demo user: **`demo` / `demo`**. Without `AUTH_JWT_SECRET`, the UI treats auth as not configured and still allows `/app` when `VITE_REQUIRE_AUTH` is true (see `auth.serverNotConfigured` copy).

## Layout

- **`src/App.tsx`** — `QueryClientProvider`, router, toasts/tooltips; nested routes under `/app`.
- **`src/components/AppLayout.tsx`** — Shell: sidebar, header, `Outlet`, `PlayerBar`, `GlobalSearch`, fullscreen player.
- **`src/pages/`** — `LandingPage`, `NotFound`, and `pages/app/*` for each route.
- **`src/lib/types.ts`** — Domain types (`Track`, `Album`, `Playlist`, `SourceType`, integrations).
- **`src/lib/store.ts`** — Zustand `usePlayerStore`: playback, queue, volume, UI flags (`isFullscreenPlayer`, `isSearchOpen`).
- **`src/lib/mock-data.ts`** — Seed content for the UI.
- **`src/components/ui/`** — shadcn/Radix primitives; prefer reusing before adding new primitives.

## Conventions

- **Styling**: Tailwind + CSS variables (`src/index.css`); follow existing patterns (`glass`, `surface-*`, sidebar/player CSS vars).
- **New UI**: Extend shadcn components in `src/components/ui/` only when needed; feature components live in `src/components/`.
- **State**: Player/queue/global UI → Zustand store. **TanStack Query** is wired in `App.tsx` but unused; use it when adding real API layers, or avoid pulling it into code paths until then.
- **Routing**: Add routes in `App.tsx`; keep `/app` children consistent with `AppSidebar` links.

## Scope notes for changes

- Do not assume a real audio element or OAuth flows exist unless you add them.
- Integration types in `types.ts` are forward-looking; settings UI may reference them with mock status.
- `lovable-tagger` runs in Vite dev only; do not rely on it for production behavior.

## Documentation

- Root **`README.md`** is still a Lovable placeholder; update it when the project is described for humans. **Do not** add extra markdown docs unless the user asks.

## Cursor / agent work rules

- **`.cursor/rules/*.mdc`** — project work rules for Cursor (workflow + frontend patterns). They complement this file; keep them in sync when conventions change.
