import { StationCoordinator } from "./coordinator";

interface AnalyticsDataset {
  writeDataPoint(input: {
    blobs?: string[];
    doubles?: number[];
    indexes?: string[];
  }): void | Promise<void>;
}

interface Env {
  APP_ENV: string;
  STATION_COORDINATOR: DurableObjectNamespace<StationCoordinator>;
  OBSERVABILITY?: AnalyticsDataset;
}

export { StationCoordinator };

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    const segments = url.pathname.split("/").filter(Boolean);

    if (url.pathname === "/health") {
      return Response.json({
        ok: true,
        data: {
          service: "station-gateway",
          env: env.APP_ENV
        }
      });
    }

    const stationId = segments[1];
    if (segments[0] !== "stations" || !stationId) {
      return Response.json({ ok: false, error: "route not found" }, { status: 404 });
    }

    const stub = env.STATION_COORDINATOR.get(env.STATION_COORDINATOR.idFromName(stationId));

    if (segments[2] === "state" && request.method === "GET") {
      return stub.fetch("https://station.internal/state");
    }

    if (segments[2] === "actions" && request.method === "POST") {
      env.OBSERVABILITY?.writeDataPoint({
        indexes: [stationId],
        blobs: ["gateway.action", env.APP_ENV],
        doubles: [Date.now()]
      });
      return stub.fetch("https://station.internal/actions", request);
    }

    if (segments[2] === "websocket" && request.headers.get("upgrade") === "websocket") {
      return stub.fetch("https://station.internal/websocket", request);
    }

    return Response.json({ ok: false, error: "route not found" }, { status: 404 });
  }
} satisfies ExportedHandler<Env>;
