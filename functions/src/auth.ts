import { getApp, getApps, initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";
import type { Request } from "firebase-functions/v2/https";
import type { TenantMembership, TenantRole } from "@the-urban-radio/contracts";
import { ProvisioningError } from "./provisioning";

const getDb = () => {
  const app = getApps().length > 0 ? getApp() : initializeApp();
  return getFirestore(app);
};

const getBearerToken = (request: Request) => {
  const header = request.headers.authorization;
  if (!header) {
    return null;
  }

  const [scheme, token] = header.split(" ");
  if (scheme !== "Bearer" || !token) {
    throw new ProvisioningError("Authorization header must be a Bearer token.", 401);
  }

  return token;
};

export const getAuthenticatedUser = async (request: Request) => {
  const token = getBearerToken(request);

  if (!token) {
    if (process.env.DEV_BOOTSTRAP_ENABLED === "true") {
      return {
        uid: "dev-bootstrap",
        email: "dev-bootstrap@local.test"
      };
    }

    throw new ProvisioningError("Authentication is required.", 401);
  }

  const decoded = await getAuth().verifyIdToken(token);
  return {
    uid: decoded.uid,
    email: decoded.email ?? ""
  };
};

export const buildTenantMembershipId = (tenantId: string, userId: string) => `${tenantId}_${userId}`;

export const buildTenantMembership = (args: {
  tenantId: string;
  userId: string;
  email: string;
  role: TenantRole;
  createdAt: string;
  createdBy: string;
}): TenantMembership => ({
  id: buildTenantMembershipId(args.tenantId, args.userId),
  tenantId: args.tenantId,
  userId: args.userId,
  email: args.email,
  role: args.role,
  createdAt: args.createdAt,
  createdBy: args.createdBy
});

export const hasAllowedTenantRole = (role: TenantRole, allowedRoles: TenantRole[]) => {
  return allowedRoles.includes(role);
};

export const getTenantMembership = async (args: {
  tenantId: string;
  userId: string;
}) => {
  const membershipId = buildTenantMembershipId(args.tenantId, args.userId);
  const snapshot = await getDb().collection("tenantMemberships").doc(membershipId).get();
  return snapshot.exists ? (snapshot.data() as TenantMembership) : null;
};

export const requireTenantMembership = async (args: {
  tenantId: string;
  userId: string;
}) => {
  const membership = await getTenantMembership(args);
  if (!membership) {
    throw new ProvisioningError("You are not a member of this tenant.", 403);
  }

  return membership;
};

export const listTenantMemberships = async (userId: string) => {
  const snapshot = await getDb().collection("tenantMemberships").where("userId", "==", userId).get();
  return snapshot.docs
    .map((doc) => doc.data() as TenantMembership)
    .sort((left, right) => right.createdAt.localeCompare(left.createdAt));
};

export const getAccessibleTenantIds = (memberships: TenantMembership[]) => {
  return [...new Set(memberships.map((membership) => membership.tenantId))];
};

export const requireTenantRole = async (args: {
  tenantId: string;
  userId: string;
  allowedRoles: TenantRole[];
}) => {
  const membership = await requireTenantMembership({
    tenantId: args.tenantId,
    userId: args.userId
  });
  if (!hasAllowedTenantRole(membership.role, args.allowedRoles)) {
    throw new ProvisioningError("You do not have the required tenant role for this action.", 403);
  }

  return membership;
};
