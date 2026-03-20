import {
  buildStationSlug,
  type AuditLogEntry,
  type ProvisionStationInput,
  type ProvisionStationResponse,
  type Station,
  type StationPlan,
  type Tenant,
  type WorkerCommand
} from "@the-urban-radio/contracts";

export class ProvisioningError extends Error {
  constructor(
    message: string,
    readonly status: number
  ) {
    super(message);
  }
}

export interface ProvisioningRequestContext {
  createdBy: string;
  now?: string;
}

export function validateProvisionStationInput(body: unknown): ProvisionStationInput {
  if (!body || typeof body !== "object") {
    throw new ProvisioningError("Request body must be a JSON object.", 400);
  }

  const raw = body as Record<string, unknown>;
  const tenantName = String(raw.tenantName ?? "").trim();
  const stationName = String(raw.stationName ?? "").trim();
  const locale = String(raw.locale ?? "en").trim() || "en";
  const timezone = String(raw.timezone ?? "UTC").trim() || "UTC";
  const plan = String(raw.plan ?? "starter").trim() as StationPlan;

  if (!tenantName) {
    throw new ProvisioningError("tenantName is required.", 400);
  }

  if (!stationName) {
    throw new ProvisioningError("stationName is required.", 400);
  }

  if (!["starter", "growth", "broadcast"].includes(plan)) {
    throw new ProvisioningError("plan must be starter, growth, or broadcast.", 400);
  }

  const slug = buildStationSlug(stationName);
  if (!slug) {
    throw new ProvisioningError("stationName must contain at least one alphanumeric character.", 400);
  }

  return {
    tenantName,
    stationName,
    locale,
    timezone,
    plan
  };
}

export function buildProvisioningDocuments(args: {
  input: ProvisionStationInput;
  tenantId: string;
  stationId: string;
  commandId: string;
  auditLogId: string;
  context: ProvisioningRequestContext;
}): ProvisionStationResponse & { auditLog: AuditLogEntry } {
  const createdAt = args.context.now ?? new Date().toISOString();
  const slug = buildStationSlug(args.input.stationName);

  const tenant: Tenant = {
    id: args.tenantId,
    name: args.input.tenantName,
    locale: args.input.locale,
    createdAt,
    createdBy: args.context.createdBy
  };

  const station: Station = {
    id: args.stationId,
    tenantId: args.tenantId,
    name: args.input.stationName,
    slug,
    plan: args.input.plan,
    timezone: args.input.timezone,
    status: "provisioning",
    createdAt
  };

  const command: WorkerCommand = {
    id: args.commandId,
    stationId: args.stationId,
    type: "station.provision",
    status: "pending",
    createdAt,
    payload: {
      tenantId: args.tenantId,
      tenantName: args.input.tenantName,
      stationName: args.input.stationName,
      stationSlug: slug,
      plan: args.input.plan,
      timezone: args.input.timezone
    }
  };

  const auditLog: AuditLogEntry = {
    id: args.auditLogId,
    type: "station.provision.requested",
    tenantId: args.tenantId,
    stationId: args.stationId,
    createdAt,
    createdBy: args.context.createdBy
  };

  return {
    tenant,
    station,
    command,
    auditLog
  };
}
