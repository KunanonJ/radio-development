import {
  normalizeLocale,
  normalizeStationSlug,
  type ApiEnvelope,
  type Locale,
  type ScheduleEvent,
  type StationMode,
  type SubscriptionPlan,
  type WidgetConfig
} from "@radioboss/contracts";
import { badRequest, json, notFound, readJson } from "./lib/http";
import {
  createStation,
  createTenant,
  getStation,
  listPlaylists,
  listSchedules,
  listStations,
  listTenants,
  listWidgets,
  savePlaylist,
  saveSchedule,
  saveWebhook,
  saveWidget
} from "./lib/db";
import { signWidgetToken, verifyWidgetToken } from "./lib/jwt";
import { StationProvisionWorkflow, type ProvisionStationParams } from "./workflows/station-provision";

interface AnalyticsDataset {
  writeDataPoint(input: {
    blobs?: string[];
    doubles?: number[];
    indexes?: string[];
  }): void | Promise<void>;
}

interface WorkflowBinding<T> {
  create(options?: { id?: string; params?: T }): Promise<{ id: string; status(): Promise<unknown> }>;
}

interface Env {
  APP_ENV: string;
  STATION_DB_MODE: string;
  WIDGET_TOKEN_SECRET: string;
  GLOBAL_DB: D1Database;
  STATION_DB: D1Database;
  MEDIA_BUCKET: R2Bucket;
  STATION_EVENTS: Queue;
  STATION_GATEWAY: Fetcher;
  OBSERVABILITY?: AnalyticsDataset;
  STATION_PROVISIONER: WorkflowBinding<ProvisionStationParams>;
}

export { StationProvisionWorkflow };

function emit(env: Env, event: string, id: string) {
  env.OBSERVABILITY?.writeDataPoint({
    indexes: [id],
    blobs: [event, env.APP_ENV],
    doubles: [Date.now()]
  });
}

async function proxyCoordinator(request: Request, env: Env, stationId: string): Promise<Response> {
  return env.STATION_GATEWAY.fetch(`https://station-gateway.internal/stations/${stationId}/state`, {
    method: "GET"
  });
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    const segments = url.pathname.split("/").filter(Boolean);

    if (url.pathname === "/health") {
      return json({
        ok: true,
        data: {
          service: "control-api",
          env: env.APP_ENV,
          stationDbMode: env.STATION_DB_MODE
        }
      });
    }

    if (segments[0] !== "v1") {
      return notFound("route");
    }

    if (segments[1] === "tenants" && request.method === "GET") {
      return json({ ok: true, data: await listTenants(env.GLOBAL_DB) });
    }

    if (segments[1] === "tenants" && request.method === "POST") {
      const payload = await readJson<{ name?: string; locale?: Locale; plan?: SubscriptionPlan }>(request);
      if (!payload.name) {
        return badRequest("tenant name is required");
      }

      const tenant = await createTenant(env.GLOBAL_DB, {
        name: payload.name,
        locale: normalizeLocale(payload.locale),
        plan: payload.plan ?? "starter"
      });

      emit(env, "tenant.created", tenant.id);
      return json({ ok: true, data: tenant }, { status: 201 });
    }

    if (segments[1] === "validate-widget" && request.method === "GET") {
      const token = url.searchParams.get("token");
      if (!token) {
        return badRequest("token is required");
      }
      const secret = env.WIDGET_TOKEN_SECRET || "dev-widget-secret-change-in-production";
      const result = await verifyWidgetToken(secret, token);
      if (!result.ok) {
        return json({ ok: false, error: result.error }, { status: 401 });
      }
      return json({ ok: true, data: { stationId: result.payload.stationId } });
    }

    if (segments[1] === "stations" && request.method === "GET") {
      return json({ ok: true, data: await listStations(env.GLOBAL_DB) });
    }

    if (segments[1] === "stations" && request.method === "POST") {
      const payload = await readJson<{ tenantId?: string; name?: string; locale?: Locale; timezone?: string }>(request);
      if (!payload.tenantId || !payload.name) {
        return badRequest("tenantId and name are required");
      }

      const station = await createStation(env.GLOBAL_DB, {
        tenantId: payload.tenantId,
        name: payload.name,
        locale: normalizeLocale(payload.locale),
        timezone: payload.timezone ?? "UTC"
      });

      await env.STATION_EVENTS.send({
        type: "station.created",
        stationId: station.id,
        stationDbKey: station.stationDbKey
      });

      emit(env, "station.created", station.id);
      return json({ ok: true, data: station }, { status: 201 });
    }

    const stationId = segments[2];
    if (!stationId) {
      return notFound("station");
    }

    const station = await getStation(env.GLOBAL_DB, stationId);
    if (!station) {
      return notFound("station");
    }

    if (segments[3] === "widget-token" && request.method === "POST") {
      const payload = await readJson<{ userId?: string; ttlSec?: number }>(request).catch(() => ({})) as {
        userId?: string;
        ttlSec?: number;
      };
      const secret = env.WIDGET_TOKEN_SECRET || "dev-widget-secret-change-in-production";
      const token = await signWidgetToken(secret, station.id, {
        userId: payload?.userId,
        ttlSec: payload?.ttlSec
      });
      return json({ ok: true, data: { token, stationId: station.id } });
    }

    if (segments[3] === "provision" && request.method === "POST") {
      const instance = await env.STATION_PROVISIONER.create({
        id: station.id,
        params: {
          stationId: station.id,
          stationDbKey: station.stationDbKey
        }
      });

      emit(env, "station.provision_started", station.id);
      return json({
        ok: true,
        data: {
          instanceId: instance.id,
          stationId: station.id
        }
      });
    }

    if (segments[3] === "coordinator" && request.method === "GET") {
      return proxyCoordinator(request, env, station.id);
    }

    if (segments[3] === "playlists" && request.method === "GET") {
      return json({ ok: true, data: await listPlaylists(env.STATION_DB, station.id) });
    }

    if (segments[3] === "playlists" && request.method === "POST") {
      const payload = await readJson<{ name?: string; description?: string }>(request);
      if (!payload.name) {
        return badRequest("playlist name is required");
      }

      const playlist = await savePlaylist(env.STATION_DB, station.id, payload.name, payload.description);
      emit(env, "playlist.created", station.id);
      return json({ ok: true, data: playlist }, { status: 201 });
    }

    if (segments[3] === "schedules" && request.method === "GET") {
      return json({ ok: true, data: await listSchedules(env.STATION_DB, station.id) });
    }

    if (segments[3] === "schedules" && request.method === "POST") {
      const payload = await readJson<Omit<ScheduleEvent, "id" | "stationId">>(request);
      if (!payload.name || !payload.startAt) {
        return badRequest("schedule name and startAt are required");
      }

      const event = await saveSchedule(env.STATION_DB, station.id, payload);
      emit(env, "schedule.created", station.id);
      return json({ ok: true, data: event }, { status: 201 });
    }

    if (segments[3] === "widgets" && request.method === "GET") {
      return json({ ok: true, data: await listWidgets(env.STATION_DB, station.id) });
    }

    if (segments[3] === "widgets" && request.method === "POST") {
      const payload = await readJson<Omit<WidgetConfig, "id" | "stationId">>(request);
      const widget = await saveWidget(env.STATION_DB, station.id, {
        kind: payload.kind ?? "player",
        theme: payload.theme ?? "cloud",
        locale: normalizeLocale(payload.locale)
      });
      emit(env, "widget.created", station.id);
      return json({ ok: true, data: widget }, { status: 201 });
    }

    if (segments[3] === "webhooks" && request.method === "POST") {
      const payload = await readJson<{ endpoint?: string; secret?: string }>(request);
      if (!payload.endpoint || !payload.secret) {
        return badRequest("endpoint and secret are required");
      }

      const hook = await saveWebhook(env.STATION_DB, station.id, payload.endpoint, payload.secret);
      emit(env, "webhook.created", station.id);
      return json({ ok: true, data: hook }, { status: 201 });
    }

    if (segments[3] === "uploads" && request.method === "POST") {
      const payload = await readJson<{ filename?: string; contentType?: string }>(request);
      if (!payload.filename) {
        return badRequest("filename is required");
      }

      const safeName = normalizeStationSlug(payload.filename.replace(/\.[^.]+$/, "")) || "audio";
      const objectKey = `${station.stationDbKey}/${Date.now()}-${safeName}`;

      return json({
        ok: true,
        data: {
          objectKey,
          uploadUrl: `${url.origin}/v1/stations/${station.id}/uploads/${objectKey}`,
          contentType: payload.contentType ?? "audio/mpeg"
        }
      });
    }

    if (segments[3] === "uploads" && request.method === "PUT" && segments.length >= 5) {
      const objectKey = decodeURIComponent(segments.slice(4).join("/"));
      await env.MEDIA_BUCKET.put(objectKey, request.body, {
        httpMetadata: {
          contentType: request.headers.get("content-type") ?? "application/octet-stream"
        }
      });

      await env.STATION_EVENTS.send({
        type: "media.uploaded",
        stationId: station.id,
        objectKey
      });

      emit(env, "media.uploaded", station.id);
      return json({ ok: true, data: { objectKey } }, { status: 201 });
    }

    return notFound("route");
  },

  async queue(batch: MessageBatch<unknown>, env: Env): Promise<void> {
    for (const message of batch.messages) {
      const payload = message.body as Record<string, string>;
      if (payload.type === "station.created") {
        await env.STATION_DB
          .prepare("INSERT OR IGNORE INTO station_registry (station_id, station_db_key, status, created_at) VALUES (?, ?, ?, ?)")
          .bind(payload.stationId, payload.stationDbKey, "queued", new Date().toISOString())
          .run();
        emit(env, "queue.station_created", payload.stationId);
      }

      if (payload.type === "media.uploaded") {
        await env.STATION_DB
          .prepare("INSERT INTO ingest_jobs (id, station_id, object_key, status, created_at) VALUES (?, ?, ?, ?, ?)")
          .bind(crypto.randomUUID(), payload.stationId, payload.objectKey, "uploaded", new Date().toISOString())
          .run();
        emit(env, "queue.media_uploaded", payload.stationId);
      }

      message.ack();
    }
  }
} satisfies ExportedHandler<Env>;
