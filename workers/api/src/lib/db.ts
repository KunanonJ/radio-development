import type {
  Locale,
  Playlist,
  ScheduleEvent,
  Station,
  SubscriptionPlan,
  Tenant,
  WidgetConfig
} from "@radioboss/contracts";
import { normalizeStationSlug, nowIso } from "@radioboss/contracts";

export interface CreateTenantInput {
  name: string;
  locale: Locale;
  plan: SubscriptionPlan;
}

export interface CreateStationInput {
  tenantId: string;
  name: string;
  locale: Locale;
  timezone: string;
}

export async function listTenants(db: D1Database): Promise<Tenant[]> {
  const result = await db.prepare("SELECT id, name, slug, locale, plan, created_at AS createdAt FROM tenants ORDER BY created_at DESC").all<Tenant>();
  return result.results ?? [];
}

export async function createTenant(db: D1Database, input: CreateTenantInput): Promise<Tenant> {
  const tenant: Tenant = {
    id: crypto.randomUUID(),
    name: input.name,
    slug: normalizeStationSlug(input.name),
    locale: input.locale,
    plan: input.plan,
    createdAt: nowIso()
  };

  await db
    .prepare("INSERT INTO tenants (id, name, slug, locale, plan, created_at) VALUES (?, ?, ?, ?, ?, ?)")
    .bind(tenant.id, tenant.name, tenant.slug, tenant.locale, tenant.plan, tenant.createdAt)
    .run();

  return tenant;
}

export async function listStations(db: D1Database): Promise<Station[]> {
  const result = await db
    .prepare(
      "SELECT id, tenant_id AS tenantId, name, slug, timezone, locale, mode, stream_key AS streamKey, station_db_key AS stationDbKey, created_at AS createdAt FROM stations ORDER BY created_at DESC"
    )
    .all<Station>();
  return result.results ?? [];
}

export async function getStation(db: D1Database, stationId: string): Promise<Station | null> {
  const result = await db
    .prepare(
      "SELECT id, tenant_id AS tenantId, name, slug, timezone, locale, mode, stream_key AS streamKey, station_db_key AS stationDbKey, created_at AS createdAt FROM stations WHERE id = ?"
    )
    .bind(stationId)
    .first<Station>();
  return result ?? null;
}

export async function createStation(db: D1Database, input: CreateStationInput): Promise<Station> {
  const station: Station = {
    id: crypto.randomUUID(),
    tenantId: input.tenantId,
    name: input.name,
    slug: normalizeStationSlug(input.name),
    timezone: input.timezone,
    locale: input.locale,
    mode: "standby",
    streamKey: crypto.randomUUID(),
    stationDbKey: `station-${normalizeStationSlug(input.name)}-${crypto.randomUUID().slice(0, 8)}`,
    createdAt: nowIso()
  };

  await db
    .prepare(
      "INSERT INTO stations (id, tenant_id, name, slug, timezone, locale, mode, stream_key, station_db_key, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)"
    )
    .bind(
      station.id,
      station.tenantId,
      station.name,
      station.slug,
      station.timezone,
      station.locale,
      station.mode,
      station.streamKey,
      station.stationDbKey,
      station.createdAt
    )
    .run();

  return station;
}

export async function listPlaylists(db: D1Database, stationId: string): Promise<Playlist[]> {
  const result = await db
    .prepare(
      "SELECT id, station_id AS stationId, name, description, created_at AS createdAt, updated_at AS updatedAt FROM playlists WHERE station_id = ? ORDER BY updated_at DESC"
    )
    .bind(stationId)
    .all<Playlist>();
  return result.results ?? [];
}

export async function savePlaylist(db: D1Database, stationId: string, name: string, description?: string): Promise<Playlist> {
  const playlist: Playlist = {
    id: crypto.randomUUID(),
    stationId,
    name,
    description,
    createdAt: nowIso(),
    updatedAt: nowIso()
  };

  await db
    .prepare("INSERT INTO playlists (id, station_id, name, description, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?)")
    .bind(playlist.id, playlist.stationId, playlist.name, playlist.description ?? null, playlist.createdAt, playlist.updatedAt)
    .run();

  return playlist;
}

export async function listSchedules(db: D1Database, stationId: string): Promise<ScheduleEvent[]> {
  const rows = await db
    .prepare("SELECT id, station_id, name, start_at, recurrence_json, target_playlist_id, action FROM schedule_events WHERE station_id = ? ORDER BY start_at ASC")
    .bind(stationId)
    .all<Record<string, string>>();

  return (rows.results ?? []).map((row) => ({
    id: row.id,
    stationId: row.station_id,
    name: row.name,
    startAt: row.start_at,
    recurrence: JSON.parse(row.recurrence_json),
    targetPlaylistId: row.target_playlist_id ?? undefined,
    action: row.action as ScheduleEvent["action"]
  }));
}

export async function saveSchedule(db: D1Database, stationId: string, schedule: Omit<ScheduleEvent, "id" | "stationId">): Promise<ScheduleEvent> {
  const event: ScheduleEvent = {
    id: crypto.randomUUID(),
    stationId,
    ...schedule
  };

  await db
    .prepare(
      "INSERT INTO schedule_events (id, station_id, name, start_at, recurrence_json, target_playlist_id, action) VALUES (?, ?, ?, ?, ?, ?, ?)"
    )
    .bind(
      event.id,
      event.stationId,
      event.name,
      event.startAt,
      JSON.stringify(event.recurrence),
      event.targetPlaylistId ?? null,
      event.action
    )
    .run();

  return event;
}

export async function listWidgets(db: D1Database, stationId: string): Promise<WidgetConfig[]> {
  const result = await db
    .prepare("SELECT id, station_id AS stationId, kind, theme, locale FROM widgets WHERE station_id = ? ORDER BY id ASC")
    .bind(stationId)
    .all<WidgetConfig>();
  return result.results ?? [];
}

export async function saveWidget(db: D1Database, stationId: string, widget: Omit<WidgetConfig, "id" | "stationId">): Promise<WidgetConfig> {
  const row: WidgetConfig = {
    id: crypto.randomUUID(),
    stationId,
    ...widget
  };

  await db
    .prepare("INSERT INTO widgets (id, station_id, kind, theme, locale) VALUES (?, ?, ?, ?, ?)")
    .bind(row.id, row.stationId, row.kind, row.theme, row.locale)
    .run();

  return row;
}

export async function saveWebhook(db: D1Database, stationId: string, endpoint: string, secret: string): Promise<{ id: string; endpoint: string }> {
  const id = crypto.randomUUID();
  await db
    .prepare("INSERT INTO webhooks (id, station_id, endpoint, secret, created_at) VALUES (?, ?, ?, ?, ?)")
    .bind(id, stationId, endpoint, secret, nowIso())
    .run();
  return { id, endpoint };
}
