import type { Metadata } from "next";
import { AppShell } from "@the-urban-radio/ui";
import { siteName, siteUrl } from "../../lib/site";

export const metadata: Metadata = {
  title: "Privacy",
  description: `Privacy overview for ${siteName} station operations, billing flows, and hosted product surfaces.`,
  alternates: {
    canonical: "/privacy"
  }
};

export default function PrivacyPage() {
  return (
    <AppShell
      eyebrow="Privacy"
      title="Privacy and data handling"
      description={`${siteName} is designed around authenticated station operations, hosted control surfaces, and explicit data ownership boundaries.`}
    >
      <section
        style={{
          display: "grid",
          gap: 18,
          padding: 24,
          borderRadius: 24,
          background: "rgba(255, 250, 241, 0.82)",
          border: "1px solid rgba(112, 71, 17, 0.08)"
        }}
      >
        <section>
          <h2>What data the platform stores</h2>
          <p>
            The platform stores account identity, tenant membership, station configuration, media metadata, playlists,
            schedule events, relay definitions, recording jobs, widget settings, and worker status documents so the
            station can be operated through the web control plane.
          </p>
        </section>

        <section>
          <h2>How billing data is handled</h2>
          <p>
            Billing workflows are designed to hand payment processing to Stripe. The application stores billing account
            and subscription references needed to connect a station to Stripe, while card collection and payment
            processing remain with Stripe.
          </p>
        </section>

        <section>
          <h2>How operational data is used</h2>
          <p>
            Station configuration and worker status are used to provision stations, coordinate automation workflows,
            show operational state in Cloud and FM, and support public outputs such as widgets and player surfaces.
          </p>
        </section>

        <section>
          <h2>Operator transparency</h2>
          <p>
            Product surfaces should expose enough information for operators to understand station state, billing state,
            worker health, and public outputs without relying on hidden background processes or machine-local settings.
          </p>
        </section>

        <section>
          <h2>Reference URLs</h2>
          <p>
            Canonical site URL: <a href={siteUrl}>{siteUrl}</a>
          </p>
        </section>
      </section>
    </AppShell>
  );
}
