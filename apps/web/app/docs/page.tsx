import { AppShell } from "@the-urban-radio/ui";

export default function DocsPage() {
  return (
    <AppShell
      eyebrow="Implementation"
      title="The Urban Radio stack"
      description="Next.js, Firebase, Cloud Run, Algolia, Go workers, and Thai-first UTF-8 support."
    >
      <ul>
        <li>Firebase Auth, Firestore, Storage, Functions, Hosting, Remote Config</li>
        <li>Cloud Run workers for playout, relay failover, recording, and exports</li>
        <li>Algolia indexing fed by Firestore and Thai token preparation workers</li>
        <li>REST + Pub/Sub orchestration for control-plane and async media workflows</li>
      </ul>
    </AppShell>
  );
}
