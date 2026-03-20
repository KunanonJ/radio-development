import { AppShell, FeatureCard } from "@the-urban-radio/ui";
import { getLocaleDictionary } from "@the-urban-radio/i18n";

const dictionary = getLocaleDictionary("en");

export default function HomePage() {
  return (
    <AppShell
      eyebrow="The Urban Radio"
      title="Firebase-backed radio automation without desktop clients"
      description={dictionary.common.platformSummary}
    >
      <section
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
          gap: 20
        }}
      >
        <FeatureCard
          title="Cloud"
          description="Playlists, scheduler, relays, reports, widgets, and realtime queue monitoring."
          href="/cloud"
        />
        <FeatureCard
          title="FM"
          description="Hosted station provisioning, listener capacity, plan controls, and stream management."
          href="/fm"
        />
        <FeatureCard
          title="Docs"
          description="Architecture, stack decisions, and Thai localization strategy."
          href="/docs"
        />
      </section>
    </AppShell>
  );
}
