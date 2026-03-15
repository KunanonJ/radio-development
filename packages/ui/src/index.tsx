import type { ReactNode } from "react";
import "./styles.css";

export interface NavItem {
  href: string;
  label: string;
}

export function AppShell(props: {
  appName: string;
  title: string;
  subtitle: string;
  locale: string;
  nav: NavItem[];
  actions?: ReactNode;
  children: ReactNode;
}) {
  const { appName, title, subtitle, locale, nav, actions, children } = props;
  return (
    <div className="rb-shell">
      <header className="rb-header">
        <div>
          <p className="rb-eyebrow">
            {appName} / {locale.toUpperCase()}
          </p>
          <h1>{title}</h1>
          <p className="rb-subtitle">{subtitle}</p>
        </div>
        <div className="rb-actions">{actions}</div>
      </header>
      <nav className="rb-nav">
        {nav.map((item) => (
          <a className="rb-nav-link" href={item.href} key={item.href}>
            {item.label}
          </a>
        ))}
      </nav>
      <main className="rb-grid">{children}</main>
    </div>
  );
}

export function SectionCard(props: {
  title: string;
  description?: string;
  children: ReactNode;
}) {
  return (
    <section className="rb-card">
      <div className="rb-card-header">
        <h2>{props.title}</h2>
        {props.description ? <p>{props.description}</p> : null}
      </div>
      <div className="rb-card-body">{props.children}</div>
    </section>
  );
}

export function StatCard(props: {
  label: string;
  value: string;
  hint?: string;
}) {
  return (
    <article className="rb-stat">
      <span>{props.label}</span>
      <strong>{props.value}</strong>
      {props.hint ? <small>{props.hint}</small> : null}
    </article>
  );
}

export function Pill(props: { tone?: "neutral" | "accent"; children: ReactNode }) {
  return <span className={`rb-pill rb-pill-${props.tone ?? "neutral"}`}>{props.children}</span>;
}
