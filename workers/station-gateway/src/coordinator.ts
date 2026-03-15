import { DurableObject } from "cloudflare:workers";
import { buildCoordinatorState, nowIso, type CoordinatorState, type StationMode } from "@radioboss/contracts";

interface AnalyticsDataset {
  writeDataPoint(input: {
    blobs?: string[];
    doubles?: number[];
    indexes?: string[];
  }): void | Promise<void>;
}

interface Env {
  APP_ENV: string;
  PLAYOUT_ORIGIN?: string;
  OBSERVABILITY?: AnalyticsDataset;
}

interface CoordinatorAction {
  type: "enqueue" | "advance" | "set-mode";
  track?: string;
  mode?: StationMode;
}

export class StationCoordinator extends DurableObject<Env> {
  private state: CoordinatorState;

  constructor(ctx: DurableObjectState, env: Env) {
    super(ctx, env);
    this.state = buildCoordinatorState("uninitialized");

    this.ctx.blockConcurrencyWhile(async () => {
      const stored = await this.ctx.storage.get<CoordinatorState>("state");
      const name = this.ctx.id.toString();
      this.state = stored ?? buildCoordinatorState(name, "standby");
      await this.ctx.storage.setAlarm(Date.now() + 30_000);
    });
  }

  async fetch(request: Request): Promise<Response> {
    const url = new URL(request.url);

    if (url.pathname === "/state") {
      return Response.json({
        ok: true,
        data: this.state
      });
    }

    if (url.pathname === "/websocket" && request.headers.get("upgrade") === "websocket") {
      const pair = new WebSocketPair();
      const [client, server] = Object.values(pair);
      this.ctx.acceptWebSocket(server);
      server.send(JSON.stringify({ type: "state", payload: this.state }));
      return new Response(null, {
        status: 101,
        webSocket: client
      });
    }

    if (url.pathname === "/actions" && request.method === "POST") {
      const action = (await request.json()) as CoordinatorAction;
      const state = await this.applyAction(action);
      return Response.json({ ok: true, data: state });
    }

    return Response.json({ ok: false, error: "route not found" }, { status: 404 });
  }

  async alarm(): Promise<void> {
    this.broadcast({ type: "heartbeat", payload: { updatedAt: this.state.updatedAt } });
    await this.ctx.storage.setAlarm(Date.now() + 30_000);
  }

  async webSocketMessage(_ws: WebSocket, message: string | ArrayBuffer): Promise<void> {
    if (typeof message !== "string") {
      return;
    }

    const payload = JSON.parse(message) as CoordinatorAction | { type: "sync" };
    if (payload.type === "sync") {
      this.broadcast({ type: "state", payload: this.state });
      return;
    }

    await this.applyAction(payload);
  }

  webSocketClose(ws: WebSocket): void {
    ws.close(1000, "closed");
  }

  private async applyAction(action: CoordinatorAction): Promise<CoordinatorState> {
    switch (action.type) {
      case "enqueue":
        if (action.track) {
          this.state.queue = [...this.state.queue, action.track];
          this.state.upcomingTrack = this.state.queue[0];
        }
        break;
      case "advance":
        this.state.currentTrack = action.track ?? this.state.queue.shift();
        this.state.upcomingTrack = this.state.queue[0];
        break;
      case "set-mode":
        if (action.mode) {
          this.state.mode = action.mode;
        }
        break;
      default:
        break;
    }

    this.state.updatedAt = nowIso();
    await this.ctx.storage.put("state", this.state);
    await this.notifyPlayout(action);
    this.broadcast({ type: "state", payload: this.state });

    this.env.OBSERVABILITY?.writeDataPoint({
      indexes: [this.state.stationId],
      blobs: [`coordinator.${action.type}`, this.env.APP_ENV],
      doubles: [Date.now()]
    });

    return this.state;
  }

  private broadcast(message: unknown): void {
    const serialized = JSON.stringify(message);
    for (const socket of this.ctx.getWebSockets()) {
      socket.send(serialized);
    }
  }

  private async notifyPlayout(action: CoordinatorAction): Promise<void> {
    if (!this.env.PLAYOUT_ORIGIN) {
      return;
    }

    await fetch(`${this.env.PLAYOUT_ORIGIN}/stations/${this.state.stationId}/actions`, {
      method: "POST",
      headers: {
        "content-type": "application/json"
      },
      body: JSON.stringify(action)
    }).catch(() => undefined);
  }
}
