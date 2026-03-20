"use client";

import type { FormEvent, ReactNode } from "react";
import { useEffect, useMemo, useState } from "react";
import type {
  BillingSummary,
  ProvisionStationInput,
  Station,
  WorkerCommand,
  WorkerStatus
} from "@the-urban-radio/contracts";
import { AppShell } from "@the-urban-radio/ui";
import { onAuthStateChanged, type User } from "firebase/auth";
import {
  collection,
  onSnapshot,
  orderBy,
  query,
  where
} from "firebase/firestore";
import {
  firebaseAuth,
  firestore,
  signInWithEmail,
  signOutUser,
  signUpWithEmail
} from "../../lib/firebase/client";
import {
  createBillingPortalSession,
  createCheckoutSession,
  getBillingSummary,
  provisionStation
} from "../../lib/control-plane-api";

const defaultForm: ProvisionStationInput = {
  tenantName: "Urban Demo Tenant",
  stationName: "Urban Demo FM",
  locale: "en",
  timezone: "Asia/Bangkok",
  plan: "starter"
};

const defaultCredentials = {
  email: "owner@theurbanradio.local",
  password: "demo1234"
};

const FmPage = () => {
  const [form, setForm] = useState<ProvisionStationInput>(defaultForm);
  const [credentials, setCredentials] = useState(defaultCredentials);
  const [tenantId, setTenantId] = useState("");
  const [stationId, setStationId] = useState("");
  const [createdStation, setCreatedStation] = useState<Station | null>(null);
  const [stations, setStations] = useState<Station[]>([]);
  const [commands, setCommands] = useState<WorkerCommand[]>([]);
  const [statuses, setStatuses] = useState<WorkerStatus[]>([]);
  const [billingSummary, setBillingSummary] = useState<BillingSummary | null>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(firebaseAuth.currentUser);
  const [submitting, setSubmitting] = useState(false);
  const [authLoading, setAuthLoading] = useState(false);
  const [billingLoading, setBillingLoading] = useState(false);
  const [authError, setAuthError] = useState("");
  const [billingError, setBillingError] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    return onAuthStateChanged(firebaseAuth, (user) => {
      setCurrentUser(user);
    });
  }, []);

  useEffect(() => {
    if (!tenantId) {
      return;
    }

    const stationsQuery = query(
      collection(firestore, "stations"),
      where("tenantId", "==", tenantId),
      orderBy("createdAt", "desc")
    );

    return onSnapshot(stationsQuery, (snapshot) => {
      setStations(snapshot.docs.map((doc) => doc.data() as Station));
    });
  }, [tenantId]);

  useEffect(() => {
    if (!stationId) {
      return;
    }

    const commandQuery = query(
      collection(firestore, "workerCommands"),
      where("stationId", "==", stationId),
      orderBy("createdAt", "desc")
    );
    const statusQuery = query(
      collection(firestore, "workerStatuses"),
      where("stationId", "==", stationId),
      orderBy("lastSeenAt", "desc")
    );

    const unsubscribeCommands = onSnapshot(commandQuery, (snapshot) => {
      setCommands(snapshot.docs.map((doc) => doc.data() as WorkerCommand));
    });

    const unsubscribeStatuses = onSnapshot(statusQuery, (snapshot) => {
      setStatuses(snapshot.docs.map((doc) => doc.data() as WorkerStatus));
    });

    return () => {
      unsubscribeCommands();
      unsubscribeStatuses();
    };
  }, [stationId]);

  useEffect(() => {
    if (!stationId || !currentUser) {
      setBillingSummary(null);
      return;
    }

    setBillingLoading(true);
    setBillingError("");
    getBillingSummary(stationId)
      .then((summary) => {
        setBillingSummary(summary);
      })
      .catch((loadError) => {
        setBillingError(loadError instanceof Error ? loadError.message : "Failed to load billing.");
      })
      .finally(() => {
        setBillingLoading(false);
      });
  }, [stationId, currentUser]);

  const commandSummary = useMemo(() => commands[0] ?? null, [commands]);
  const statusSummary = useMemo(() => statuses[0] ?? null, [statuses]);

  const handleSignUp = async () => {
    setAuthLoading(true);
    setAuthError("");

    try {
      await signUpWithEmail(credentials.email, credentials.password);
    } catch (signUpError) {
      setAuthError(signUpError instanceof Error ? signUpError.message : "Sign-up failed.");
    } finally {
      setAuthLoading(false);
    }
  };

  const handleSignIn = async () => {
    setAuthLoading(true);
    setAuthError("");

    try {
      await signInWithEmail(credentials.email, credentials.password);
    } catch (signInError) {
      setAuthError(signInError instanceof Error ? signInError.message : "Sign-in failed.");
    } finally {
      setAuthLoading(false);
    }
  };

  const handleSignOut = async () => {
    await signOutUser();
    setTenantId("");
    setStationId("");
    setCreatedStation(null);
    setStations([]);
    setCommands([]);
    setStatuses([]);
    setBillingSummary(null);
  };

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      const result = await provisionStation(form);
      setTenantId(result.tenant.id);
      setStationId(result.station.id);
      setCreatedStation(result.station);
    } catch (submissionError) {
      setError(submissionError instanceof Error ? submissionError.message : "Provisioning failed.");
    } finally {
      setSubmitting(false);
    }
  }

  const handleCheckout = async () => {
    if (!stationId) {
      return;
    }

    setBillingLoading(true);
    setBillingError("");

    try {
      const result = await createCheckoutSession({
        stationId,
        successUrl: `${window.location.origin}/fm?checkout=success`,
        cancelUrl: `${window.location.origin}/fm?checkout=cancel`
      });
      window.location.assign(result.url);
    } catch (checkoutError) {
      setBillingError(checkoutError instanceof Error ? checkoutError.message : "Checkout failed.");
      setBillingLoading(false);
    }
  };

  const handleBillingPortal = async () => {
    if (!stationId) {
      return;
    }

    setBillingLoading(true);
    setBillingError("");

    try {
      const result = await createBillingPortalSession({
        stationId,
        returnUrl: `${window.location.origin}/fm`
      });
      window.location.assign(result.url);
    } catch (portalError) {
      setBillingError(portalError instanceof Error ? portalError.message : "Billing portal failed.");
      setBillingLoading(false);
    }
  };

  return (
    <AppShell
      eyebrow="The Urban Radio FM"
      title="Station hosting and operations"
      description="Provision a tenant and station locally through Firebase emulators, then watch worker command state update in realtime."
    >
      <section
        style={{
          display: "grid",
          gridTemplateColumns: "minmax(320px, 460px) minmax(320px, 1fr)",
          gap: 20
        }}
      >
        <div style={{ display: "grid", gap: 20 }}>
          <section style={panelStyle}>
            <h2 style={{ marginTop: 0 }}>Authentication</h2>
            <p style={helperStyle}>
              Sign in with a Firebase Auth emulator account before provisioning stations.
            </p>
            <label>
              Email
              <input
                aria-label="Email"
                value={credentials.email}
                onChange={(event) =>
                  setCredentials({
                    ...credentials,
                    email: event.target.value
                  })
                }
                style={inputStyle}
                required
              />
            </label>
            <label>
              Password
              <input
                aria-label="Password"
                type="password"
                value={credentials.password}
                onChange={(event) =>
                  setCredentials({
                    ...credentials,
                    password: event.target.value
                  })
                }
                style={inputStyle}
                required
              />
            </label>
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              <button type="button" onClick={handleSignUp} disabled={authLoading} style={primaryButtonStyle}>
                {authLoading ? "Working..." : "Create Account"}
              </button>
              <button type="button" onClick={handleSignIn} disabled={authLoading} style={secondaryButtonStyle}>
                Sign In
              </button>
              {currentUser ? (
                <button type="button" onClick={handleSignOut} style={secondaryButtonStyle}>
                  Sign Out
                </button>
              ) : null}
            </div>
            <p style={helperStyle}>
              {currentUser ? `Signed in as ${currentUser.email ?? currentUser.uid}` : "Not signed in"}
            </p>
            {authError ? <p style={errorStyle}>{authError}</p> : null}
          </section>

          <form onSubmit={handleSubmit} style={panelStyle}>
            <h2 style={{ marginTop: 0 }}>Provision Station</h2>
            <label>
              Tenant Name
              <input
                aria-label="Tenant Name"
                value={form.tenantName}
                onChange={(event) => setForm({ ...form, tenantName: event.target.value })}
                style={inputStyle}
                required
                disabled={!currentUser}
              />
            </label>
            <label>
              Station Name
              <input
                aria-label="Station Name"
                value={form.stationName}
                onChange={(event) => setForm({ ...form, stationName: event.target.value })}
                style={inputStyle}
                required
                disabled={!currentUser}
              />
            </label>
            <label>
              Locale
              <input
                value={form.locale}
                onChange={(event) => setForm({ ...form, locale: event.target.value })}
                style={inputStyle}
                disabled={!currentUser}
              />
            </label>
            <label>
              Timezone
              <input
                value={form.timezone}
                onChange={(event) => setForm({ ...form, timezone: event.target.value })}
                style={inputStyle}
                disabled={!currentUser}
              />
            </label>
            <label>
              Plan
              <select
                value={form.plan}
                onChange={(event) =>
                  setForm({
                    ...form,
                    plan: event.target.value as ProvisionStationInput["plan"]
                  })
                }
                style={inputStyle}
                disabled={!currentUser}
              >
                <option value="starter">starter</option>
                <option value="growth">growth</option>
                <option value="broadcast">broadcast</option>
              </select>
            </label>
            <button
              type="submit"
              disabled={submitting || !currentUser}
              style={primaryButtonStyle}
            >
              {submitting ? "Provisioning..." : "Provision Station"}
            </button>
            {error ? <p style={errorStyle}>{error}</p> : null}
          </form>
        </div>

        <div style={{ display: "grid", gap: 20 }}>
          <StatusCard title="Created Station">
            {createdStation ? (
              <dl style={detailsStyle}>
                <div><dt>ID</dt><dd>{createdStation.id}</dd></div>
                <div><dt>Name</dt><dd>{createdStation.name}</dd></div>
                <div><dt>Slug</dt><dd>{createdStation.slug}</dd></div>
                <div><dt>Status</dt><dd>{createdStation.status}</dd></div>
              </dl>
            ) : (
              <p style={emptyStyle}>No station provisioned yet.</p>
            )}
          </StatusCard>

          <StatusCard title="Realtime Station List">
            {stations.length > 0 ? (
              <ul style={listStyle}>
                {stations.map((station) => (
                  <li key={station.id}>
                    <strong>{station.name}</strong>
                    <span>{station.slug}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p style={emptyStyle}>Create a station to start the Firestore listener.</p>
            )}
          </StatusCard>

          <StatusCard title="Worker Command">
            {commandSummary ? (
              <dl style={detailsStyle}>
                <div><dt>Command</dt><dd>{commandSummary.id}</dd></div>
                <div><dt>Type</dt><dd>{commandSummary.type}</dd></div>
                <div><dt>Status</dt><dd>{commandSummary.status}</dd></div>
              </dl>
            ) : (
              <p style={emptyStyle}>Waiting for worker command state.</p>
            )}
          </StatusCard>

          <StatusCard title="Worker Status">
            {statusSummary ? (
              <dl style={detailsStyle}>
                <div><dt>Worker</dt><dd>{statusSummary.workerName}</dd></div>
                <div><dt>Health</dt><dd>{statusSummary.health}</dd></div>
                <div><dt>Last Command</dt><dd>{statusSummary.lastCommandId ?? "n/a"}</dd></div>
              </dl>
            ) : (
              <p style={emptyStyle}>Worker heartbeat will appear after command processing starts.</p>
            )}
          </StatusCard>

          <StatusCard title="Stripe Billing">
            {billingSummary ? (
              <dl style={detailsStyle}>
                <div><dt>Plan</dt><dd>{billingSummary.plan}</dd></div>
                <div><dt>Status</dt><dd>{billingSummary.status}</dd></div>
                <div><dt>Customer</dt><dd>{billingSummary.stripeCustomerId ?? "Not created yet"}</dd></div>
                <div><dt>Subscription</dt><dd>{billingSummary.stripeSubscriptionId ?? "Not created yet"}</dd></div>
                <div><dt>Current Period End</dt><dd>{billingSummary.currentPeriodEnd ?? "n/a"}</dd></div>
              </dl>
            ) : (
              <p style={emptyStyle}>
                {stationId ? "Loading billing state..." : "Provision a station before starting Stripe checkout."}
              </p>
            )}
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              <button
                type="button"
                onClick={handleCheckout}
                disabled={!stationId || billingLoading}
                style={primaryButtonStyle}
              >
                {billingLoading ? "Working..." : "Start Stripe Checkout"}
              </button>
              <button
                type="button"
                onClick={handleBillingPortal}
                disabled={!stationId || billingLoading || !billingSummary?.billingPortalReady}
                style={secondaryButtonStyle}
              >
                Open Billing Portal
              </button>
            </div>
            {billingError ? <p style={errorStyle}>{billingError}</p> : null}
          </StatusCard>
        </div>
      </section>
    </AppShell>
  );
};

export default FmPage;

function StatusCard({
  title,
  children
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section
      style={{
        background: "var(--surface)",
        border: "1px solid var(--border)",
        borderRadius: 24,
        padding: 24
      }}
    >
      <h2 style={{ marginTop: 0 }}>{title}</h2>
      {children}
    </section>
  );
}

const inputStyle = {
  width: "100%",
  marginTop: 8,
  padding: 12,
  borderRadius: 12,
  border: "1px solid var(--border)",
  background: "#fff",
  display: "block"
} as const;

const panelStyle = {
  background: "var(--surface)",
  border: "1px solid var(--border)",
  borderRadius: 24,
  padding: 24,
  display: "grid",
  gap: 16
} as const;

const emptyStyle = {
  margin: 0,
  color: "var(--muted)"
} as const;

const helperStyle = {
  margin: 0,
  color: "var(--muted)"
} as const;

const errorStyle = {
  color: "#b42318",
  margin: 0
} as const;

const primaryButtonStyle = {
  border: 0,
  borderRadius: 999,
  padding: "14px 18px",
  background: "var(--accent)",
  color: "white",
  fontWeight: 700,
  cursor: "pointer"
} as const;

const secondaryButtonStyle = {
  ...primaryButtonStyle,
  background: "#fff",
  color: "var(--foreground)",
  border: "1px solid var(--border)"
} as const;

const listStyle = {
  margin: 0,
  paddingLeft: 18,
  display: "grid",
  gap: 8
} as const;

const detailsStyle = {
  margin: 0,
  display: "grid",
  gap: 8
} as const;
