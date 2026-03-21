import { describe, expect, it } from "vitest";
import {
  buildTenantMembership,
  getAccessibleTenantIds,
  getAuthenticatedUser,
  hasAllowedTenantRole
} from "../src/auth";
import { ProvisioningError } from "../src/provisioning";

describe("getAuthenticatedUser", () => {
  it("uses the dev bootstrap user when explicitly enabled", async () => {
    process.env.DEV_BOOTSTRAP_ENABLED = "true";

    const user = await getAuthenticatedUser({
      headers: {}
    } as never);

    expect(user.uid).toBe("dev-bootstrap");
  });

  it("rejects malformed authorization headers", async () => {
    process.env.DEV_BOOTSTRAP_ENABLED = "false";

    await expect(
      getAuthenticatedUser({
        headers: {
          authorization: "Token abc"
        }
      } as never)
    ).rejects.toBeInstanceOf(ProvisioningError);
  });

  it("recognizes owner/admin billing roles", () => {
    expect(hasAllowedTenantRole("owner", ["owner", "admin"])).toBe(true);
    expect(hasAllowedTenantRole("admin", ["owner", "admin"])).toBe(true);
    expect(hasAllowedTenantRole("operator", ["owner", "admin"])).toBe(false);
  });

  it("builds tenant membership documents", () => {
    const membership = buildTenantMembership({
      tenantId: "tenant_1",
      userId: "user_1",
      email: "owner@example.com",
      role: "owner",
      createdAt: "2026-03-20T00:00:00.000Z",
      createdBy: "user_1"
    });

    expect(membership.id).toBe("tenant_1_user_1");
    expect(membership.role).toBe("owner");
  });

  it("deduplicates accessible tenant ids from memberships", () => {
    const memberships = [
      buildTenantMembership({
        tenantId: "tenant_1",
        userId: "user_1",
        email: "owner@example.com",
        role: "owner",
        createdAt: "2026-03-20T00:00:00.000Z",
        createdBy: "user_1"
      }),
      buildTenantMembership({
        tenantId: "tenant_1",
        userId: "user_1",
        email: "owner@example.com",
        role: "admin",
        createdAt: "2026-03-20T00:01:00.000Z",
        createdBy: "user_1"
      }),
      buildTenantMembership({
        tenantId: "tenant_2",
        userId: "user_1",
        email: "owner@example.com",
        role: "viewer",
        createdAt: "2026-03-20T00:02:00.000Z",
        createdBy: "user_1"
      })
    ];

    expect(getAccessibleTenantIds(memberships)).toEqual(["tenant_1", "tenant_2"]);
  });
});
