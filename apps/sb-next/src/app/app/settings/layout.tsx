import Link from "next/link";

const tabs = [
  { href: "/app/settings", label: "General" },
  { href: "/app/settings/integrations", label: "Integrations" },
  { href: "/app/settings/playback", label: "Playback" },
  { href: "/app/settings/appearance", label: "Appearance" },
];

export default function SettingsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="app-page-settings space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Settings</h1>
        <p className="text-sm text-muted-foreground">Matches Vite nested settings routes.</p>
      </div>
      <nav className="flex flex-wrap gap-2 border-b border-border pb-2">
        {tabs.map((t) => (
          <Link
            key={t.href}
            href={t.href}
            className="rounded-md px-3 py-1.5 text-sm text-muted-foreground hover:bg-muted hover:text-foreground"
          >
            {t.label}
          </Link>
        ))}
      </nav>
      {children}
    </div>
  );
}
