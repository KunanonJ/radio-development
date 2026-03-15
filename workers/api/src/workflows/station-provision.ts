import { WorkflowEntrypoint, type WorkflowEvent, type WorkflowStep } from "cloudflare:workers";
import { nowIso } from "@radioboss/contracts";

interface AnalyticsDataset {
  writeDataPoint(input: {
    blobs?: string[];
    doubles?: number[];
    indexes?: string[];
  }): void | Promise<void>;
}

interface WorkflowEnv {
  STATION_DB: D1Database;
  OBSERVABILITY?: AnalyticsDataset;
}

export interface ProvisionStationParams {
  stationId: string;
  stationDbKey: string;
}

export class StationProvisionWorkflow extends WorkflowEntrypoint<WorkflowEnv, ProvisionStationParams> {
  async run(event: WorkflowEvent<ProvisionStationParams>, step: WorkflowStep) {
    const { stationId, stationDbKey } = event.payload;

    await step.do("register station shard", async () => {
      await this.env.STATION_DB
        .prepare("INSERT OR IGNORE INTO station_registry (station_id, station_db_key, status, created_at) VALUES (?, ?, ?, ?)")
        .bind(stationId, stationDbKey, "ready", nowIso())
        .run();
    });

    await step.do("record provisioning audit", async () => {
      if (this.env.OBSERVABILITY) {
        await this.env.OBSERVABILITY.writeDataPoint({
          indexes: [stationId],
          blobs: ["workflow.station_provisioned", stationDbKey],
          doubles: [Date.now()]
        });
      }
    });

    return {
      stationId,
      stationDbKey,
      status: "ready"
    };
  }
}
