import type { CSSProperties, PropsWithChildren } from "react";

const panelStyle: CSSProperties = {
  background: "var(--surface)",
  border: "1px solid var(--border)",
  borderRadius: 24,
  boxShadow: "0 20px 60px var(--shadow)"
};

export function AppShell({
  eyebrow,
  title,
  description,
  children
}: PropsWithChildren<{
  eyebrow: string;
  title: string;
  description: string;
}>) {
  return (
    <main style={{ padding: 32 }}>
      <div style={{ maxWidth: 1120, margin: "0 auto", display: "grid", gap: 24 }}>
        <section style={{ ...panelStyle, padding: 32 }}>
          <p style={{ margin: 0, textTransform: "uppercase", letterSpacing: "0.12em", color: "var(--accent)" }}>
            {eyebrow}
          </p>
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(2.25rem, 5vw, 4.5rem)", marginBottom: 12 }}>
            {title}
          </h1>
          <p style={{ margin: 0, maxWidth: 760, color: "var(--muted)", fontSize: "1.1rem" }}>{description}</p>
        </section>
        <section>{children}</section>
      </div>
    </main>
  );
}

export function FeatureCard({
  title,
  description,
  href
}: {
  title: string;
  description: string;
  href?: string;
}) {
  const content = (
    <article style={{ ...panelStyle, padding: 24, height: "100%" }}>
      <h2 style={{ marginTop: 0, fontFamily: "var(--font-display)" }}>{title}</h2>
      <p style={{ marginBottom: 0, color: "var(--muted)" }}>{description}</p>
    </article>
  );

  return href ? <a href={href}>{content}</a> : content;
}

export function MetricGrid({
  metrics
}: {
  metrics: Array<{ label: string; value: string }>;
}) {
  return (
    <section
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
        gap: 20
      }}
    >
      {metrics.map((metric) => (
        <article key={metric.label} style={{ ...panelStyle, padding: 24 }}>
          <p style={{ margin: 0, color: "var(--muted)" }}>{metric.label}</p>
          <strong style={{ fontSize: "2rem", fontFamily: "var(--font-display)" }}>{metric.value}</strong>
        </article>
      ))}
    </section>
  );
}
