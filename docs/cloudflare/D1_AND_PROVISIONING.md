# D1 Migrations and Station Provisioning

This doc describes how to run D1 migrations for the control API and how station provisioning works.

---

## D1 databases (workers/api)

| Binding       | Database name (dev)     | Migrations directory           |
|---------------|-------------------------|---------------------------------|
| `GLOBAL_DB`   | `radioboss-global-dev`  | `workers/api/migrations/global` |
| `STATION_DB`  | `radioboss-station-dev` | `workers/api/migrations/station` |

---

## Create databases (one-time)

From repo root:

```bash
cd workers/api
wrangler d1 create radioboss-global-dev
wrangler d1 create radioboss-station-dev
```

Use the returned `database_id` values in `wrangler.jsonc` under `d1_databases[].database_id` if you created with different names. For local dev, the same config is used with `--local` when applying migrations.

---

## Apply migrations

From `workers/api`:

```bash
# Local (miniflare) D1
wrangler d1 migrations apply GLOBAL_DB --local
wrangler d1 migrations apply STATION_DB --local

# Remote (Cloudflare) D1
wrangler d1 migrations apply GLOBAL_DB --remote
wrangler d1 migrations apply STATION_DB --remote
```

Run after pulling new migration files. Migrations are versioned SQL files (e.g. `0001_init.sql`).

---

## Schema summary

- **GLOBAL_DB:** `tenants`, `users`, `stations`, `subscriptions`, `audit_logs`.
- **STATION_DB:** `station_registry`, `playlists`, `schedule_events`, `widgets`, `webhooks`, `ingest_jobs`.

See `workers/api/migrations/*/*.sql` for the full schema.

---

## Station provisioning flow

1. **Create tenant** — `POST /v1/tenants` with `name`, `locale`, `plan`. Creates a row in `GLOBAL_DB.tenants`.
2. **Create station** — `POST /v1/stations` with `tenantId`, `name`, `locale`, `timezone`. Creates a row in `GLOBAL_DB.stations` and sends a queue message for `station_registry`.
3. **Provision workflow** — `POST /v1/stations/:stationId/provision` triggers `STATION_PROVISIONER` to seed `STATION_DB` (e.g. station_registry, default playlists/widgets).

### Provision script

From repo root, with the control API running (e.g. `pnpm dev:api`):

```bash
CONTROL_API_URL=http://localhost:8787 pnpm run provision
# Or with names:
CONTROL_API_URL=http://localhost:8787 node scripts/provision-station.mjs "My Tenant" "My Station"
```

The script creates a tenant, a station, and triggers the provision workflow.

---

## CI / automation

- In CI, create D1 databases (or use existing), then run `wrangler d1 migrations apply ... --remote` for the target environment.
- For new environments, duplicate the `d1_databases` config with new `database_name` and `database_id` and apply migrations once.
