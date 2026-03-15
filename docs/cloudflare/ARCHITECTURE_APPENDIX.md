# Cloudflare / Vinext Architecture Appendix

This appendix turns the repo from documentation-only planning into a concrete implementation scaffold for the Cloudflare-first web suite.

## Topology

### Apps (`vinext`)

- `apps/console` — operator console for library, playlists, scheduler, and queue state.
- `apps/admin` — internal hosting/admin surface for provisioning, pilot gates, and billing posture.
- `apps/public` — public player and widget delivery surface.

All three apps use `vinext` with Next.js App Router semantics and deploy to Cloudflare Workers through per-app `wrangler.jsonc` files.

### Workers

- `workers/api` — control-plane API for tenants, stations, playlists, schedules, widgets, uploads, queue publishing, and provisioning workflow kickoff.
- `workers/station-gateway` — stateful realtime boundary with one Durable Object per station.

### Shared packages

- `packages/contracts` — domain types and helper utilities shared across apps and workers.
- `packages/i18n` — shared English/Thai locale loader backed by the existing `locales/` JSON files.
- `packages/ui` — shared shell/cards/styles used by the `vinext` apps.

### Media plane

- `containers/playout` — minimal Node-based playout service to stand in for the eventual Cloudflare Container runtime.

## Binding map

### `workers/api`

- `GLOBAL_DB` — tenant/station registry.
- `STATION_DB` — shared-station schema for the scaffold; production sharding will move this to one database per station.
- `MEDIA_BUCKET` — R2 media/object storage.
- `STATION_EVENTS` — queue for provisioning and ingest events.
- `STATION_PROVISIONER` — workflow binding for station provisioning.
- `STATION_GATEWAY` — service binding to the realtime worker.
- `OBSERVABILITY` — Analytics Engine dataset.

### `workers/station-gateway`

- `STATION_COORDINATOR` — Durable Object class for queue/mode state and websocket fanout.
- `PLAYOUT_ORIGIN` — playout service origin used to notify the media plane.
- `OBSERVABILITY` — Analytics Engine dataset.

### `apps/*`

- `CONTROL_API` — service binding to `workers/api`.
- `GLOBAL_DB` and `MEDIA_BUCKET` in `apps/console` for direct server-component inspection if needed.
- app-specific vars like `STREAM_PLAYBACK_HOST`, `ACCESS_AUDIENCE`, and `PUBLIC_WIDGET_ID`.

## Current scaffold limitations

- The repo uses a single `STATION_DB` binding today even though the target architecture calls for per-station D1 sharding. The repository/service layer is structured so that production sharding can replace this without changing the app contracts.
- Uploads are currently Worker-mediated `PUT` requests. For production, prefer **presigned R2 uploads**: generate a signed URL in the control API (e.g. `PUT /v1/stations/:id/uploads/request` returning a presigned URL and `objectKey`); the client uploads directly to R2, then notifies the API to record the object. This reduces worker CPU and avoids body size limits.
- The playout container exposes a real audio stream at `GET /stations/:id/live` (WAV silence as placeholder); replace with ffmpeg or file-based playback for production.
- Stream, Realtime SFU, Access, and WAF/API Shield are represented in config/docs, but production provisioning remains to be automated.

## Observability

- **Analytics Engine:** The control API and station-gateway workers bind `OBSERVABILITY` (Analytics Engine dataset). Use `env.OBSERVABILITY.writeDataPoint({ indexes: [id], blobs: [event, env.APP_ENV], doubles: [Date.now()] })` for key events (e.g. `tenant.created`, `station.created`, `station.provision_started`, `queue.station_created`, `media.uploaded`). Query and dashboards are configured in the Cloudflare dashboard.
- **Wrangler:** `observability.enabled: true` in `workers/api/wrangler.jsonc` enables tail and metrics; use `wrangler tail` and the dashboard for debugging and latency.

## Auth and access

- **Console and admin:** Protected by **Cloudflare Access**. Set `ACCESS_AUDIENCE` in wrangler to the Access application audience tag. When Access is enabled, valid requests include `Cf-Access-Jwt-Assertion`. Middleware (or a layout guard) can verify this and redirect unauthenticated users to the Access login page. In development, middleware may bypass the check so local `vinext dev` works without Access.
- **Public player and widgets:** Playback and embed endpoints accept a **signed token** (e.g. JWT) with claims: `stationId`, `exp`, optional `userId`. Issued by `workers/api` or console; validated at the playback/widget boundary. Use `errors.*` for invalid or expired token messages.
- **Token flow:** Console/admin users get a session via Access. For public widgets, the station owner obtains a signed embed token from the API (`POST /v1/stations/:id/widget-token`); the token is passed in the widget URL (`?token=...`) or config and validated when the player loads (`GET /v1/validate-widget?token=...`). Invalid or expired tokens return 401 with `error: "invalid_token"` or `"token_expired"`; the Public app shows localized messages from `errors.invalid_token` and `errors.token_expired`.
- **PUBLIC_WIDGET_ID:** Set in each app’s wrangler vars; used as the default widget identifier for signed embed payloads. Production should use a stable id per deployment or tenant.

## D1 migrations and provisioning

- **Migrations:** `workers/api` has two D1 bindings with versioned SQL in `workers/api/migrations/global` and `workers/api/migrations/station`. Apply with:
  - `wrangler d1 migrations apply GLOBAL_DB --remote` (or `--local` for local dev)
  - `wrangler d1 migrations apply STATION_DB --remote` (or `--local`)
  Run from `workers/api` after creating the D1 databases in the dashboard or via `wrangler d1 create`.
- **Provisioning:** New stations are created via the control API (`POST /tenants`, `POST /tenants/:tenantId/stations`). The `STATION_PROVISIONER` workflow can be triggered to seed station-specific state. For a CLI, add a script that calls the API or runs the workflow; see `docs/cloudflare/D1_AND_PROVISIONING.md`.

## Suggested next implementation slices

1. ~~Replace the simulated playout container with an actual audio pipeline.~~ (Live WAV stream added; replace with ffmpeg for production.)
2. ~~Add D1 migration automation and station-db provisioning commands.~~ (Migrations exist; provisioning doc and script added.)
3. ~~Add authenticated route protection for console/admin (middleware + Access) and signed widget tokens for public playback.~~ (Middleware and widget token issuance/validation implemented.)
4. ~~Add e2e tests against `wrangler dev` preview environments.~~ (Playwright e2e added; see `docs/E2E_TESTING.md`.)
