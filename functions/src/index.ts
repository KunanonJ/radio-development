import { getApps, initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { onRequest } from "firebase-functions/v2/https";
import { onMessagePublished } from "firebase-functions/v2/pubsub";
import type {
  BillingAccount,
  BillingSubscription,
  MediaAsset,
  MediaAssetPage,
  Playlist,
  PlaybackSettings,
  RecordingJob,
  Relay,
  ReportJob,
  ScheduleEvent,
  Station,
  StationLibrarySummary,
  WidgetConfig,
  WorkerCommand,
  WorkerStatus
} from "@the-urban-radio/contracts";
import {
  buildStationSlug,
  dashboardSnapshot
} from "@the-urban-radio/contracts";
import {
  buildTenantMembership,
  buildTenantMembershipId,
  getAuthenticatedUser,
  requireTenantRole
} from "./auth";
import {
  buildBillingAccount,
  buildBillingSubscription,
  buildBillingSummary,
  getBillingPortalReturnUrl,
  getCheckoutUrls,
  getPlanFromPriceId,
  getStripeClient,
  getStripePriceIdForPlan,
  getStripeWebhookSecret,
  mapStripeSubscriptionStatus
} from "./billing";
import {
  buildAuditLog,
  buildDashboardSummary,
  buildMediaAsset,
  buildMediaAssetPage,
  buildPlaylist,
  buildPlaybackSettings,
  buildRecordingJob,
  buildRelay,
  buildReportJob,
  buildScheduleEvent,
  buildStationLibrarySummary,
  buildStationView,
  buildDefaultPlaybackSettings,
  buildWidgetConfig,
  buildWorkerCommand,
  validateCreateMediaAssetInput,
  validateCreatePlaylistInput,
  validateCreateRecordingJobInput,
  validateCreateRelayInput,
  validateCreateScheduleEventInput
  ,
  validateUpdatePlaybackSettingsInput
} from "./control-plane";
import {
  ProvisioningError,
  buildProvisioningDocuments,
  validateProvisionStationInput
} from "./provisioning";

if (getApps().length === 0) {
  initializeApp();
}

const db = getFirestore();
const MAX_MEDIA_ASSETS_PER_STATION = 1_000_000;

const json = (response: any, status: number, payload: unknown) => {
  response.setHeader("Content-Type", "application/json; charset=utf-8");
  response.status(status).send(JSON.stringify(payload));
};

const requireMethod = (request: any, method: string) => {
  if (request.method !== method) {
    throw new ProvisioningError("Method not allowed.", 405);
  }
};

const getRequiredQuery = (request: any, key: string) => {
  const value = String(request.query[key] ?? "").trim();
  if (!value) {
    throw new ProvisioningError(`${key} is required.`, 400);
  }

  return value;
};

const getOptionalQuery = (request: any, key: string) => {
  const value = String(request.query[key] ?? "").trim();
  return value || null;
};

const getPositiveLimit = (request: any, fallback = 25, max = 100) => {
  const parsed = Number(request.query.limit ?? fallback);
  if (!Number.isFinite(parsed) || parsed <= 0) {
    return fallback;
  }

  return Math.min(Math.floor(parsed), max);
};

const getCollection = <T>(name: string, stationId: string, orderField = "createdAt") =>
  db.collection(name).where("stationId", "==", stationId).orderBy(orderField, "desc").get().then((snapshot) =>
    snapshot.docs.map((doc) => doc.data() as T)
  );

const withErrorHandling = (handler: (request: any, response: any) => Promise<void> | void) =>
  onRequest(async (request, response) => {
    try {
      await handler(request, response);
    } catch (error) {
      if (error instanceof ProvisioningError) {
        json(response, error.status, { error: error.message });
        return;
      }

      console.error("function error", error);
      json(response, 500, { error: "Internal server error." });
    }
  });

const createStationCommand = async (args: {
  stationId: string;
  type: WorkerCommand["type"];
  payload: WorkerCommand["payload"];
}) => {
  const ref = db.collection("workerCommands").doc();
  const createdAt = new Date().toISOString();
  const command = buildWorkerCommand({
    id: ref.id,
    stationId: args.stationId,
    type: args.type,
    createdAt,
    payload: args.payload
  });

  await ref.set(command);
  return command;
};

const getStationLibrarySummary = async (stationId: string) => {
  const snapshot = await db.collection("stationSummaries").doc(stationId).get();
  return snapshot.exists ? (snapshot.data() as StationLibrarySummary) : null;
};

const getBillingSubscription = async (stationId: string) => {
  const snapshot = await db.collection("billingSubscriptions").doc(stationId).get();
  return snapshot.exists ? (snapshot.data() as BillingSubscription) : null;
};

const getPlaybackSettings = async (stationId: string) => {
  const snapshot = await db.collection("playbackSettings").doc(stationId).get();
  return snapshot.exists ? (snapshot.data() as PlaybackSettings) : null;
};

const getBillingAccount = async (tenantId: string) => {
  const snapshot = await db.collection("billingAccounts").doc(tenantId).get();
  return snapshot.exists ? (snapshot.data() as BillingAccount) : null;
};

const getMediaAssetPage = async (args: {
  stationId: string;
  limit: number;
  cursor: string | null;
}): Promise<MediaAssetPage> => {
  let mediaQuery = db
    .collection("mediaAssets")
    .where("stationId", "==", args.stationId)
    .orderBy("createdAt", "desc")
    .limit(args.limit);

  if (args.cursor) {
    const cursorSnapshot = await db.collection("mediaAssets").doc(args.cursor).get();
    if (!cursorSnapshot.exists) {
      throw new ProvisioningError("Invalid media cursor.", 400);
    }

    mediaQuery = mediaQuery.startAfter(cursorSnapshot);
  }

  const [pageSnapshot, summary] = await Promise.all([mediaQuery.get(), getStationLibrarySummary(args.stationId)]);
  const items = pageSnapshot.docs.map((doc) => doc.data() as MediaAsset);
  const nextCursor = pageSnapshot.docs.length === args.limit ? pageSnapshot.docs.at(-1)?.id ?? null : null;

  return buildMediaAssetPage({
    items,
    summary,
    nextCursor
  });
};

const getStationContext = async (stationId: string) => {
  const stationSnapshot = await db.collection("stations").doc(stationId).get();
  if (!stationSnapshot.exists) {
    throw new ProvisioningError("Station not found.", 404);
  }

  const station = stationSnapshot.data() as Station;
  const [library, playbackSettings, playlists, scheduleEvents, relays, recordingJobs, commands, workerStatuses] =
    await Promise.all([
      getStationLibrarySummary(stationId),
      getPlaybackSettings(stationId),
      getCollection<Playlist>("playlists", stationId),
      getCollection<ScheduleEvent>("scheduleEvents", stationId, "startsAt"),
      getCollection<Relay>("relays", stationId),
      getCollection<RecordingJob>("recordingJobs", stationId),
      getCollection<WorkerCommand>("workerCommands", stationId),
      getCollection<WorkerStatus>("workerStatuses", stationId, "lastSeenAt")
    ]);

  return {
    station,
    library,
    playbackSettings,
    playlists,
    scheduleEvents,
    relays,
    recordingJobs,
    commands,
    workerStatuses
  };
};

export const health = withErrorHandling((_request, response) => {
  json(response, 200, {
    service: "the-urban-radio-functions",
    status: "ok",
    mode: process.env.DEV_BOOTSTRAP_ENABLED === "true" ? "dev-bootstrap" : "authenticated",
    workers: ["automation", "indexer"]
  });
});

export const provisionStation = withErrorHandling(async (request, response) => {
  requireMethod(request, "POST");

  const input = validateProvisionStationInput(request.body);
  const authenticatedUser = await getAuthenticatedUser(request);
  const stationSlug = buildStationSlug(input.stationName);

  const duplicateSnapshot = await db.collection("stations").where("slug", "==", stationSlug).limit(1).get();
  if (!duplicateSnapshot.empty) {
    throw new ProvisioningError(`A station with slug "${stationSlug}" already exists.`, 409);
  }

  const tenantRef = db.collection("tenants").doc();
  const stationRef = db.collection("stations").doc();
  const commandRef = db.collection("workerCommands").doc();
  const auditLogRef = db.collection("auditLogs").doc();
  const widgetConfigRef = db.collection("widgetConfigs").doc();
  const stationSummaryRef = db.collection("stationSummaries").doc(stationRef.id);
  const billingSubscriptionRef = db.collection("billingSubscriptions").doc(stationRef.id);
  const playbackSettingsRef = db.collection("playbackSettings").doc(stationRef.id);
  const tenantMembershipRef = db.collection("tenantMemberships").doc(
    buildTenantMembershipId(tenantRef.id, authenticatedUser.uid)
  );

  const provisioning = buildProvisioningDocuments({
    input,
    tenantId: tenantRef.id,
    stationId: stationRef.id,
    commandId: commandRef.id,
    auditLogId: auditLogRef.id,
    context: { createdBy: authenticatedUser.uid }
  });

  const createdAt = provisioning.station.createdAt;
  const widgetConfig = buildWidgetConfig(widgetConfigRef.id, stationRef.id, input.locale, createdAt);
  const stationSummary = buildStationLibrarySummary({
    id: stationSummaryRef.id,
    stationId: stationRef.id,
    ownerUserId: authenticatedUser.uid,
    createdAt
  });
  const tenantMembership = buildTenantMembership({
    tenantId: tenantRef.id,
    userId: authenticatedUser.uid,
    email: authenticatedUser.email,
    role: "owner",
    createdAt,
    createdBy: authenticatedUser.uid
  });
  const billingSubscription = buildBillingSubscription({
    station: provisioning.station,
    now: createdAt
  });
  const playbackSettings = buildDefaultPlaybackSettings({
    stationId: stationRef.id,
    updatedAt: createdAt,
    updatedBy: authenticatedUser.uid
  });

  await db.runTransaction(async (transaction) => {
    transaction.set(tenantRef, provisioning.tenant);
    transaction.set(stationRef, provisioning.station);
    transaction.set(commandRef, provisioning.command);
    transaction.set(auditLogRef, provisioning.auditLog);
    transaction.set(widgetConfigRef, widgetConfig);
    transaction.set(stationSummaryRef, stationSummary);
    transaction.set(tenantMembershipRef, tenantMembership);
    transaction.set(billingSubscriptionRef, billingSubscription);
    transaction.set(playbackSettingsRef, playbackSettings);
  });

  json(response, 201, {
    tenant: provisioning.tenant,
    station: provisioning.station,
    command: provisioning.command
  });
});

export const stations = withErrorHandling(async (request, response) => {
  requireMethod(request, "GET");
  await getAuthenticatedUser(request);

  const tenantId = getRequiredQuery(request, "tenantId");
  const snapshot = await db
    .collection("stations")
    .where("tenantId", "==", tenantId)
    .orderBy("createdAt", "desc")
    .get();

  json(response, 200, { stations: snapshot.docs.map((doc) => doc.data()) });
});

export const dashboardSummary = withErrorHandling(async (request, response) => {
  requireMethod(request, "GET");
  await getAuthenticatedUser(request);

  const stationId = getRequiredQuery(request, "stationId");
  const context = await getStationContext(stationId);
  json(response, 200, buildDashboardSummary(context));
});

export const stationDetail = withErrorHandling(async (request, response) => {
  requireMethod(request, "GET");
  await getAuthenticatedUser(request);

  const stationId = getRequiredQuery(request, "stationId");
  const context = await getStationContext(stationId);
  json(response, 200, buildStationView(context));
});

export const workerCommands = withErrorHandling(async (request, response) => {
  requireMethod(request, "GET");
  await getAuthenticatedUser(request);

  const stationId = getRequiredQuery(request, "stationId");
  json(response, 200, { commands: await getCollection<WorkerCommand>("workerCommands", stationId) });
});

export const workerStatuses = withErrorHandling(async (request, response) => {
  requireMethod(request, "GET");
  await getAuthenticatedUser(request);

  const stationId = getRequiredQuery(request, "stationId");
  json(response, 200, { statuses: await getCollection<WorkerStatus>("workerStatuses", stationId, "lastSeenAt") });
});

export const playbackSettings = withErrorHandling(async (request, response) => {
  const authenticatedUser = await getAuthenticatedUser(request);

  if (request.method === "GET") {
    const stationId = getRequiredQuery(request, "stationId");
    const station = (await db.collection("stations").doc(stationId).get()).data() as Station | undefined;
    if (!station) {
      throw new ProvisioningError("Station not found.", 404);
    }

    await requireTenantRole({
      tenantId: station.tenantId,
      userId: authenticatedUser.uid,
      allowedRoles: ["owner", "admin", "operator"]
    });

    const settings = await getPlaybackSettings(stationId);
    if (!settings) {
      throw new ProvisioningError("Playback settings not found.", 404);
    }

    json(response, 200, settings);
    return;
  }

  requireMethod(request, "POST");
  const input = validateUpdatePlaybackSettingsInput(request.body);
  const station = (await db.collection("stations").doc(input.stationId).get()).data() as Station | undefined;
  if (!station) {
    throw new ProvisioningError("Station not found.", 404);
  }

  await requireTenantRole({
    tenantId: station.tenantId,
    userId: authenticatedUser.uid,
    allowedRoles: ["owner", "admin", "operator"]
  });

  const settings = buildPlaybackSettings({
    input,
    updatedAt: new Date().toISOString(),
    updatedBy: authenticatedUser.uid
  });

  await db.collection("playbackSettings").doc(input.stationId).set(settings);
  json(response, 200, settings);
});

export const billingSummary = withErrorHandling(async (request, response) => {
  requireMethod(request, "GET");
  const authenticatedUser = await getAuthenticatedUser(request);

  const stationId = getRequiredQuery(request, "stationId");
  const station = (await db.collection("stations").doc(stationId).get()).data() as Station | undefined;
  if (!station) {
    throw new ProvisioningError("Station not found.", 404);
  }

  await requireTenantRole({
    tenantId: station.tenantId,
    userId: authenticatedUser.uid,
    allowedRoles: ["owner", "admin"]
  });

  const subscription = await getBillingSubscription(stationId);
  json(response, 200, buildBillingSummary({ station, subscription }));
});

export const createCheckoutSession = withErrorHandling(async (request, response) => {
  requireMethod(request, "POST");
  const authenticatedUser = await getAuthenticatedUser(request);
  const stationId = String(request.body?.stationId ?? "").trim();
  if (!stationId) {
    throw new ProvisioningError("stationId is required.", 400);
  }

  const station = (await db.collection("stations").doc(stationId).get()).data() as Station | undefined;
  if (!station) {
    throw new ProvisioningError("Station not found.", 404);
  }

  await requireTenantRole({
    tenantId: station.tenantId,
    userId: authenticatedUser.uid,
    allowedRoles: ["owner", "admin"]
  });

  const stripe = getStripeClient();
  const { successUrl, cancelUrl } = getCheckoutUrls({
    successUrl: request.body?.successUrl,
    cancelUrl: request.body?.cancelUrl
  });
  const priceId = getStripePriceIdForPlan(station.plan);
  const now = new Date().toISOString();
  const billingAccountRef = db.collection("billingAccounts").doc(station.tenantId);
  const billingSubscriptionRef = db.collection("billingSubscriptions").doc(station.id);

  let billingAccount = await getBillingAccount(station.tenantId);
  if (!billingAccount?.stripeCustomerId) {
    const customer = await stripe.customers.create({
      email: authenticatedUser.email || undefined,
      metadata: {
        tenantId: station.tenantId,
        defaultStationId: station.id,
        createdBy: authenticatedUser.uid
      }
    });

    billingAccount = buildBillingAccount({
      tenantId: station.tenantId,
      defaultStationId: station.id,
      createdBy: authenticatedUser.uid,
      email: authenticatedUser.email,
      stripeCustomerId: customer.id,
      now
    });
    await billingAccountRef.set(billingAccount);
  }

  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    customer: billingAccount.stripeCustomerId,
    success_url: successUrl,
    cancel_url: cancelUrl,
    client_reference_id: station.id,
    line_items: [{ price: priceId, quantity: 1 }],
    metadata: {
      stationId: station.id,
      tenantId: station.tenantId,
      plan: station.plan
    },
    subscription_data: {
      metadata: {
        stationId: station.id,
        tenantId: station.tenantId,
        plan: station.plan
      }
    }
  });

  await billingSubscriptionRef.set(
    buildBillingSubscription({
      station,
      now,
      status: "incomplete",
      stripeCustomerId: billingAccount.stripeCustomerId,
      stripePriceId: priceId,
      stripeSubscriptionId: typeof session.subscription === "string" ? session.subscription : undefined,
      stripeCheckoutSessionId: session.id
    }),
    { merge: true }
  );

  if (!session.url) {
    throw new ProvisioningError("Stripe did not return a checkout URL.", 502);
  }

  json(response, 200, {
    url: session.url,
    sessionId: session.id,
    customerId: billingAccount.stripeCustomerId
  });
});

export const createBillingPortalSession = withErrorHandling(async (request, response) => {
  requireMethod(request, "POST");
  const authenticatedUser = await getAuthenticatedUser(request);

  const stationId = String(request.body?.stationId ?? "").trim();
  if (!stationId) {
    throw new ProvisioningError("stationId is required.", 400);
  }

  const station = (await db.collection("stations").doc(stationId).get()).data() as Station | undefined;
  if (!station) {
    throw new ProvisioningError("Station not found.", 404);
  }

  await requireTenantRole({
    tenantId: station.tenantId,
    userId: authenticatedUser.uid,
    allowedRoles: ["owner", "admin"]
  });

  const billingAccount = await getBillingAccount(station.tenantId);
  if (!billingAccount?.stripeCustomerId) {
    throw new ProvisioningError("Stripe customer has not been created for this station yet.", 409);
  }

  const stripe = getStripeClient();
  const portalSession = await stripe.billingPortal.sessions.create({
    customer: billingAccount.stripeCustomerId,
    return_url: getBillingPortalReturnUrl(request.body?.returnUrl)
  });

  json(response, 200, { url: portalSession.url });
});

export const mediaAssets = withErrorHandling(async (request, response) => {
  const user = await getAuthenticatedUser(request);

  if (request.method === "GET") {
    const stationId = getRequiredQuery(request, "stationId");
    const limit = getPositiveLimit(request);
    const cursor = getOptionalQuery(request, "cursor");
    json(response, 200, await getMediaAssetPage({ stationId, limit, cursor }));
    return;
  }

  requireMethod(request, "POST");
  const input = validateCreateMediaAssetInput(request.body);
  const station = (await db.collection("stations").doc(input.stationId).get()).data() as Station | undefined;
  if (!station) {
    throw new ProvisioningError("Station not found.", 404);
  }

  const ref = db.collection("mediaAssets").doc();
  const auditRef = db.collection("auditLogs").doc();
  const summaryRef = db.collection("stationSummaries").doc(input.stationId);
  const now = new Date().toISOString();
  const mediaAsset = buildMediaAsset(ref.id, input, now, user.uid);
  const auditLog = buildAuditLog({
    id: auditRef.id,
    type: "media.asset.created",
    tenantId: station.tenantId,
    stationId: station.id,
    createdAt: now,
    createdBy: user.uid,
    metadata: { title: mediaAsset.title }
  });

  await db.runTransaction(async (transaction) => {
    const summarySnapshot = await transaction.get(summaryRef);
    if (!summarySnapshot.exists) {
      throw new ProvisioningError("Station library summary is missing.", 500);
    }

    const summary = summarySnapshot.data() as StationLibrarySummary;
    if (summary.totalAssets >= MAX_MEDIA_ASSETS_PER_STATION) {
      throw new ProvisioningError("This station has reached the 1,000,000 song capacity.", 409);
    }

    transaction.set(ref, mediaAsset);
    transaction.set(auditRef, auditLog);
    transaction.update(summaryRef, {
      totalAssets: summary.totalAssets + 1,
      newestAssetAt: mediaAsset.createdAt,
      updatedAt: mediaAsset.createdAt
    });
  });

  json(response, 201, mediaAsset);
});

export const playlists = withErrorHandling(async (request, response) => {
  const user = await getAuthenticatedUser(request);

  if (request.method === "GET") {
    const stationId = getRequiredQuery(request, "stationId");
    json(response, 200, { playlists: await getCollection<Playlist>("playlists", stationId) });
    return;
  }

  requireMethod(request, "POST");
  const input = validateCreatePlaylistInput(request.body);
  const station = (await db.collection("stations").doc(input.stationId).get()).data() as Station | undefined;
  if (!station) {
    throw new ProvisioningError("Station not found.", 404);
  }

  const ref = db.collection("playlists").doc();
  const auditRef = db.collection("auditLogs").doc();
  const command = await createStationCommand({
    stationId: input.stationId,
    type: "queue.refresh",
    payload: { title: input.name }
  });

  const now = command.createdAt;
  const playlist = buildPlaylist(ref.id, input, now);
  const auditLog = buildAuditLog({
    id: auditRef.id,
    type: "playlist.created",
    tenantId: station.tenantId,
    stationId: station.id,
    createdAt: now,
    createdBy: user.uid,
    metadata: { playlistId: playlist.id }
  });

  await db.runTransaction(async (transaction) => {
    transaction.set(ref, playlist);
    transaction.set(auditRef, auditLog);
  });

  json(response, 201, { playlist, command });
});

export const scheduleEvents = withErrorHandling(async (request, response) => {
  const user = await getAuthenticatedUser(request);

  if (request.method === "GET") {
    const stationId = getRequiredQuery(request, "stationId");
    json(response, 200, {
      scheduleEvents: await getCollection<ScheduleEvent>("scheduleEvents", stationId, "startsAt")
    });
    return;
  }

  requireMethod(request, "POST");
  const input = validateCreateScheduleEventInput(request.body);
  const station = (await db.collection("stations").doc(input.stationId).get()).data() as Station | undefined;
  if (!station) {
    throw new ProvisioningError("Station not found.", 404);
  }

  const ref = db.collection("scheduleEvents").doc();
  const auditRef = db.collection("auditLogs").doc();
  const now = new Date().toISOString();
  const scheduleEvent = buildScheduleEvent(ref.id, input, now);
  const auditLog = buildAuditLog({
    id: auditRef.id,
    type: "schedule-event.created",
    tenantId: station.tenantId,
    stationId: station.id,
    createdAt: now,
    createdBy: user.uid,
    metadata: { action: scheduleEvent.action }
  });

  await db.runTransaction(async (transaction) => {
    transaction.set(ref, scheduleEvent);
    transaction.set(auditRef, auditLog);
  });

  json(response, 201, scheduleEvent);
});

export const relays = withErrorHandling(async (request, response) => {
  const user = await getAuthenticatedUser(request);

  if (request.method === "GET") {
    const stationId = getRequiredQuery(request, "stationId");
    json(response, 200, { relays: await getCollection<Relay>("relays", stationId) });
    return;
  }

  requireMethod(request, "POST");
  const input = validateCreateRelayInput(request.body);
  const station = (await db.collection("stations").doc(input.stationId).get()).data() as Station | undefined;
  if (!station) {
    throw new ProvisioningError("Station not found.", 404);
  }

  const ref = db.collection("relays").doc();
  const auditRef = db.collection("auditLogs").doc();
  const command = await createStationCommand({
    stationId: input.stationId,
    type: "relay.start",
    payload: { relayId: ref.id, title: input.name }
  });

  const relay = buildRelay(ref.id, input, command.createdAt);
  const auditLog = buildAuditLog({
    id: auditRef.id,
    type: "relay.created",
    tenantId: station.tenantId,
    stationId: station.id,
    createdAt: command.createdAt,
    createdBy: user.uid,
    metadata: { relayId: relay.id }
  });

  await db.runTransaction(async (transaction) => {
    transaction.set(ref, relay);
    transaction.set(auditRef, auditLog);
  });

  json(response, 201, { relay, command });
});

export const recordingJobs = withErrorHandling(async (request, response) => {
  const user = await getAuthenticatedUser(request);

  if (request.method === "GET") {
    const stationId = getRequiredQuery(request, "stationId");
    json(response, 200, { recordingJobs: await getCollection<RecordingJob>("recordingJobs", stationId) });
    return;
  }

  requireMethod(request, "POST");
  const input = validateCreateRecordingJobInput(request.body);
  const station = (await db.collection("stations").doc(input.stationId).get()).data() as Station | undefined;
  if (!station) {
    throw new ProvisioningError("Station not found.", 404);
  }

  const ref = db.collection("recordingJobs").doc();
  const reportRef = db.collection("reportJobs").doc();
  const auditRef = db.collection("auditLogs").doc();
  const command = await createStationCommand({
    stationId: input.stationId,
    type: "recording.start",
    payload: { recordingJobId: ref.id, title: input.name, reportJobId: reportRef.id }
  });

  const recordingJob = buildRecordingJob(ref.id, input, command.createdAt);
  const reportJob = buildReportJob(reportRef.id, input.stationId, command.createdAt);
  const auditLog = buildAuditLog({
    id: auditRef.id,
    type: "recording-job.created",
    tenantId: station.tenantId,
    stationId: station.id,
    createdAt: command.createdAt,
    createdBy: user.uid,
    metadata: { recordingJobId: recordingJob.id }
  });

  await db.runTransaction(async (transaction) => {
    transaction.set(ref, recordingJob);
    transaction.set(reportRef, reportJob);
    transaction.set(auditRef, auditLog);
  });

  json(response, 201, { recordingJob, reportJob, command });
});

export const widgetFeed = withErrorHandling(async (request, response) => {
  const stationId = String(request.query.stationId ?? "").trim();
  if (!stationId) {
    json(response, 200, {
      title: "City Lights",
      artist: "The Urban Radio Orchestra",
      listeners: dashboardSnapshot.listeners,
      locale: "en"
    });
    return;
  }

  const station = (await db.collection("stations").doc(stationId).get()).data() as Station | undefined;
  if (!station) {
    throw new ProvisioningError("Station not found.", 404);
  }

  const widgetConfigSnapshot = await db.collection("widgetConfigs").where("stationId", "==", stationId).limit(1).get();
  const mediaAssets = await getCollection<MediaAsset>("mediaAssets", stationId);
  const widgetConfig = widgetConfigSnapshot.docs[0]?.data() as WidgetConfig | undefined;
  const fallbackTitle = widgetConfig?.locale === "th" ? "กำลังออกอากาศ" : "Now Playing";

  json(response, 200, {
    stationId,
    title: mediaAssets[0]?.title ?? fallbackTitle,
    artist: mediaAssets[0]?.artist ?? station.name,
    listeners: dashboardSnapshot.listeners,
    locale: widgetConfig?.locale ?? "en"
  });
});

export const automationDispatch = onMessagePublished("automation-commands", (event) => {
  console.log("automation command received", event.data.message.json);
});

export const stripeWebhook = onRequest(async (request, response) => {
  if (request.method !== "POST") {
    response.status(405).send("Method not allowed.");
    return;
  }

  try {
    const stripe = getStripeClient();
    const signature = String(request.headers["stripe-signature"] ?? "");
    if (!signature) {
      response.status(400).send("Missing Stripe signature.");
      return;
    }

    const event = stripe.webhooks.constructEvent(request.rawBody, signature, getStripeWebhookSecret());
    const now = new Date().toISOString();

    if (event.type === "checkout.session.completed") {
      const session = event.data.object;
      const stationId = String(session.metadata?.stationId ?? "");
      if (stationId) {
        const station = (await db.collection("stations").doc(stationId).get()).data() as Station | undefined;
        if (station) {
          await db.collection("billingSubscriptions").doc(stationId).set(
            buildBillingSubscription({
              station,
              now,
              status: "active",
              stripeCustomerId: typeof session.customer === "string" ? session.customer : undefined,
              stripeSubscriptionId: typeof session.subscription === "string" ? session.subscription : undefined,
              stripeCheckoutSessionId: session.id,
              stripePriceId: getStripePriceIdForPlan(station.plan)
            }),
            { merge: true }
          );
        }
      }
    }

    if (
      event.type === "customer.subscription.created" ||
      event.type === "customer.subscription.updated" ||
      event.type === "customer.subscription.deleted"
    ) {
      const subscription = event.data.object;
      const stationId = String(subscription.metadata?.stationId ?? "");
      if (stationId) {
        const station = (await db.collection("stations").doc(stationId).get()).data() as Station | undefined;
        if (station) {
          const firstItem = subscription.items.data[0];
          const priceId = firstItem?.price?.id;
          const plan = priceId ? getPlanFromPriceId(priceId) : station.plan;
          const currentPeriodEndUnix =
            "current_period_end" in subscription && typeof subscription.current_period_end === "number"
              ? subscription.current_period_end
              : undefined;

          await db.collection("billingSubscriptions").doc(stationId).set(
            {
              tenantId: station.tenantId,
              stationId,
              plan,
              status: mapStripeSubscriptionStatus(subscription.status),
              stripeCustomerId: typeof subscription.customer === "string" ? subscription.customer : undefined,
              stripePriceId: priceId,
              stripeSubscriptionId: subscription.id,
              currentPeriodEnd: currentPeriodEndUnix
                ? new Date(currentPeriodEndUnix * 1000).toISOString()
                : undefined,
              cancelAtPeriodEnd: subscription.cancel_at_period_end,
              updatedAt: now
            },
            { merge: true }
          );
        }
      }
    }

    response.status(200).send("ok");
  } catch (error) {
    console.error("stripe webhook error", error);
    response.status(400).send(error instanceof Error ? error.message : "Webhook error");
  }
});
