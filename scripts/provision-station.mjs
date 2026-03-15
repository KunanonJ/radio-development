#!/usr/bin/env node
/**
 * Provision a tenant and station by calling the control API.
 * Usage: CONTROL_API_URL=http://localhost:8787 node scripts/provision-station.mjs [tenantName] [stationName]
 * Default tenant: "Demo Tenant"; default station: "Demo Station".
 */
const baseUrl = process.env.CONTROL_API_URL || "http://localhost:8787";
const tenantName = process.argv[2] || "Demo Tenant";
const stationName = process.argv[3] || "Demo Station";

async function post(path, body) {
  const res = await fetch(`${baseUrl}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body)
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(`${path} ${res.status}: ${data.error || JSON.stringify(data)}`);
  }
  return data;
}

async function main() {
  console.log("Creating tenant:", tenantName);
  const tenantRes = await post("/v1/tenants", { name: tenantName, locale: "en", plan: "starter" });
  const tenant = tenantRes.data;
  console.log("Tenant id:", tenant.id);

  console.log("Creating station:", stationName);
  const stationRes = await post("/v1/stations", {
    tenantId: tenant.id,
    name: stationName,
    locale: "en",
    timezone: "UTC"
  });
  const station = stationRes.data;
  console.log("Station id:", station.id);

  console.log("Triggering provision workflow...");
  const provRes = await post(`/v1/stations/${station.id}/provision`, {});
  console.log("Provision instance:", provRes.data.instanceId);

  console.log("Done. Station ID:", station.id);
}

main().catch((err) => {
  console.error(err.message);
  process.exit(1);
});
