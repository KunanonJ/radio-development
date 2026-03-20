import { describe, expect, it } from "vitest";
import { buildProvisioningDocuments, validateProvisionStationInput } from "../src/provisioning";

describe("validateProvisionStationInput", () => {
  it("accepts a valid provisioning request", () => {
    const parsed = validateProvisionStationInput({
      tenantName: "Urban Tenant",
      stationName: "Urban FM",
      locale: "en",
      timezone: "Asia/Bangkok",
      plan: "starter"
    });

    expect(parsed.stationName).toBe("Urban FM");
    expect(parsed.plan).toBe("starter");
  });

  it("rejects invalid plans", () => {
    expect(() =>
      validateProvisionStationInput({
        tenantName: "Urban Tenant",
        stationName: "Urban FM",
        plan: "invalid"
      })
    ).toThrow("plan must be starter, growth, or broadcast.");
  });
});

describe("buildProvisioningDocuments", () => {
  it("creates tenant, station, command, and audit log records", () => {
    const result = buildProvisioningDocuments({
      input: {
        tenantName: "Urban Tenant",
        stationName: "Urban FM",
        locale: "th",
        timezone: "Asia/Bangkok",
        plan: "growth"
      },
      tenantId: "tenant_1",
      stationId: "station_1",
      commandId: "command_1",
      auditLogId: "audit_1",
      context: {
        createdBy: "dev-bootstrap",
        now: "2026-03-20T00:00:00.000Z"
      }
    });

    expect(result.station.slug).toBe("urban-fm");
    expect(result.command.status).toBe("pending");
    expect(result.auditLog.createdBy).toBe("dev-bootstrap");
  });
});
