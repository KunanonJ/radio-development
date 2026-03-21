import type { Metadata } from "next";
import Link from "next/link";
import styles from "./home.module.css";
import { primaryKeyword, siteDescription, siteKeywords, siteName, siteUrl } from "../lib/site";

const updatedDateLabel = "March 20, 2026";

const heroSignals = [
  "Thai-ready metadata and public outputs",
  "Single control plane for playlists, relays, and recording jobs",
  "Server-rendered web experience with Firebase + Cloud Run",
  "Built for one-station success before multi-tenant scale"
];

const featureCards = [
  {
    title: "Cloud scheduling",
    description:
      "Create playlists, queue events, relay windows, and recording jobs from one web control surface instead of juggling separate desktop utilities."
  },
  {
    title: "Operator-grade visibility",
    description:
      "Watch worker commands, relay states, playback preferences, and library counts in a single station view built for day-to-day operational decisions."
  },
  {
    title: "Public outputs",
    description:
      "Publish widget feeds, public player surfaces, and station information endpoints without building a separate public web stack for every station."
  },
  {
    title: "Thai-ready publishing",
    description:
      "Support Thai-safe input, UTF-8 output, and Thai-focused presentation requirements across dashboards, widgets, exports, and metadata workflows."
  }
];

const workflowSteps = [
  {
    title: "Provision the station",
    description:
      "Operators sign in, create a tenant and station, and establish the control-plane record that workers and dashboards use as the source of truth."
  },
  {
    title: "Configure the schedule",
    description:
      "Teams add media metadata, playlists, schedule events, relays, recording jobs, and playback settings from the cloud dashboard and FM operations surface."
  },
  {
    title: "Monitor live operations",
    description:
      "Worker status, queue-refresh commands, recording activity, and public outputs flow back into the dashboard so operators can act before problems spread."
  }
];

const comparisonRows = [
  {
    label: "Operational model",
    desktop: "Local desktop software tied to a single machine or studio workstation.",
    urban: "Web-first control plane with worker-driven execution and remote station access."
  },
  {
    label: "Station rollout",
    desktop: "Manual environment setup per machine, often with fragile local assumptions.",
    urban: "Provisioned through FM and Functions so the station starts with a repeatable control-plane model."
  },
  {
    label: "Relay and recording control",
    desktop: "Usually split across plugins, scripts, or operator memory.",
    urban: "Relay and recording jobs are first-class station workflows with command visibility."
  },
  {
    label: "Thai readiness",
    desktop: "Often bolted on through manual fonts, encodings, or export workarounds.",
    urban: "Thai support is part of the product surface, not an afterthought."
  },
  {
    label: "Team access",
    desktop: "Best for one studio operator seated at the right machine.",
    urban: "Built for owners, admins, operators, and remote operational review."
  }
];

const controlPlaneCards = [
  {
    title: "Station overview",
    description:
      "Track provisioning status, plan context, worker health, library totals, latest commands, and public output readiness."
  },
  {
    title: "Playback profile",
    description:
      "Store transitions, sound enhancer, sound check, lossless, spatial audio, HDMI passthrough, and video quality preferences at the station level."
  },
  {
    title: "Library at scale",
    description:
      "Design for paginated, materialized summaries and very large media libraries instead of loading full collections into the browser."
  },
  {
    title: "Billing and hosting",
    description:
      "Manage plan workflows, billing handoff, and hosted station operations from FM without splitting the operational story across tools."
  }
];

const thaiSupportCards = [
  {
    title: "Thai-safe text handling",
    description:
      "The Urban Radio is designed so station names, media titles, playlist labels, and widget payloads preserve Thai text without encoding loss."
  },
  {
    title: "Thai-aware public outputs",
    description:
      "The same platform that serves the dashboard can also feed public player surfaces and widgets that need to render Thai copy correctly."
  },
  {
    title: "Indexing-ready architecture",
    description:
      "The worker model already separates automation and indexing so Thai search quality can mature without rewriting the control plane."
  },
  {
    title: "Export-first discipline",
    description:
      "Thai rendering is treated as an acceptance gate for dashboards, APIs, widgets, and exports rather than a marketing checkbox."
  }
];

const audienceCards = [
  {
    title: "Internet radio operators",
    description:
      "Use The Urban Radio to centralize playlists, relays, recording jobs, and public outputs without depending on a local studio desktop."
  },
  {
    title: "FM simulcast teams",
    description:
      "Run hosted station operations, listener-capacity plans, and station health views alongside cloud scheduling and archive workflows."
  },
  {
    title: "Managed service providers",
    description:
      "Support single-station depth first, then grow into repeatable tenant and role-aware operations once the control model is proven."
  },
  {
    title: "Thai-first broadcasters",
    description:
      "Choose a stack designed to treat Thai support as a product requirement across UI, search preparation, and output quality."
  }
];

const platformSignals = [
  {
    title: "Primary category",
    description: "Cloud radio automation software for playlisting, relay control, recording, and hosted station operations."
  },
  {
    title: "Platform architecture",
    description: "Firebase control plane, Firestore state, Functions APIs, and Cloud Run workers for automation and indexing."
  },
  {
    title: "Operational scope",
    description: "Cloud dashboard, FM operations surface, public player endpoints, widget feeds, and worker status visibility."
  },
  {
    title: "Localization stance",
    description: "Thai-ready metadata, widgets, search preparation, and export quality are treated as launch-level requirements."
  }
];

const faqs = [
  {
    question: "What is The Urban Radio?",
    answer:
      "The Urban Radio is cloud radio automation software for stations that need playlists, scheduling, relays, recording, widgets, and hosted operations without depending on a desktop client. It combines a web control plane with worker-driven execution so operators can manage one station cleanly before scaling wider."
  },
  {
    question: "How does cloud radio automation work in The Urban Radio?",
    answer:
      "The Urban Radio stores station configuration in a Firebase control plane, validates operator actions through authenticated APIs, and sends execution work to background automation workers. That model keeps the browser focused on management while worker processes handle command lifecycles, relay actions, recording flows, and indexing preparation."
  },
  {
    question: "Who should use The Urban Radio?",
    answer:
      "The Urban Radio fits internet radio operators, FM simulcast teams, managed service providers, and broadcasters that need Thai-ready station operations. It is especially useful when teams want a cloud-first workflow for station setup, playlisting, public outputs, and operational visibility instead of a local studio-only toolchain."
  },
  {
    question: "Does The Urban Radio support Thai radio workflows?",
    answer:
      "Yes. The Urban Radio is designed so Thai text survives input, display, widgets, APIs, and export-oriented workflows. Thai support is treated as a product acceptance gate, which is important for operators who cannot accept encoding errors, broken glyphs, or weak Thai metadata handling in public-facing station outputs."
  },
  {
    question: "Can The Urban Radio support large music libraries?",
    answer:
      "The platform is designed around paginated media access, summary documents, and an eventual indexing path so it can grow far beyond small prototype libraries. The current architecture already assumes materialized counts and bounded list views, which is the right direction for stations planning very large media catalogs."
  },
  {
    question: "Why choose The Urban Radio instead of desktop radio automation software?",
    answer:
      "Choose The Urban Radio when you need remote access, hosted operations, consistent station provisioning, and web-based operational visibility. Desktop radio automation software can work well for one local machine, but cloud-first teams usually need a control plane that stays accessible, auditable, and easier to evolve across stations."
  }
];

const pageSchemas = [
  {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: siteName,
    url: siteUrl,
    description: siteDescription
  },
  {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteName,
    url: siteUrl,
    description: siteDescription
  },
  {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: siteName,
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web",
    url: siteUrl,
    description: siteDescription,
    inLanguage: ["en", "th"],
    featureList: [
      "Cloud dashboard for playlists, schedules, relays, and recording jobs",
      "FM operations surface for station provisioning and hosted plan workflows",
      "Thai-ready public outputs and widget feeds",
      "Worker-driven automation and indexing architecture"
    ]
  },
  {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer
      }
    }))
  }
];

export const metadata: Metadata = {
  title: "Cloud Radio Automation Software",
  description: siteDescription,
  keywords: siteKeywords,
  alternates: {
    canonical: "/"
  },
  openGraph: {
    title: `Cloud Radio Automation Software | ${siteName}`,
    description: siteDescription,
    url: siteUrl
  },
  twitter: {
    title: `Cloud Radio Automation Software | ${siteName}`,
    description: siteDescription
  }
};

export default function HomePage() {
  return (
    <main className={styles.page}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(pageSchemas) }}
      />

      <div className={styles.shell}>
        <header className={styles.topbar}>
          <Link href="/" className={styles.brand} aria-label={`${siteName} home`}>
            <span className={styles.brandMark} aria-hidden="true" />
            <span>{siteName}</span>
          </Link>

          <nav className={styles.topLinks} aria-label="Section navigation">
            <a href="#overview" className={styles.pillLink}>
              Overview
            </a>
            <a href="#compare" className={styles.pillLink}>
              Compare
            </a>
            <a href="#thai" className={styles.pillLink}>
              Thai Support
            </a>
            <a href="#faq" className={styles.pillLink}>
              FAQ
            </a>
          </nav>
        </header>

        <section className={styles.hero}>
          <div className={styles.heroCopy}>
            <p className={styles.eyebrow}>Cloud Radio Automation Software</p>
            <h1 className={styles.heroTitle}>
              Cloud radio automation software for stations that need to move faster.
            </h1>
            <p className={styles.heroLead}>
              {siteName} is {primaryKeyword} for operators who want playlists, schedules, relay control,
              recording workflows, public outputs, and hosted station operations in one web-first product.
              It is built for internet stations, FM simulcasts, and Thai-ready broadcasters that do not want
              their operation tied to a desktop client.
            </p>

            <div className={styles.heroActions}>
              <Link href="/fm" className={styles.primaryAction}>
                Launch A Station
              </Link>
              <Link href="/cloud" className={styles.secondaryAction}>
                View The Control Plane
              </Link>
              <Link href="/docs" className={styles.secondaryAction}>
                Read Architecture
              </Link>
            </div>

            <div className={styles.heroMeta} aria-label="Key product signals">
              {heroSignals.map((signal) => (
                <span key={signal} className={styles.metaChip}>
                  {signal}
                </span>
              ))}
            </div>
          </div>

          <aside className={styles.heroPanel} aria-label="Product snapshot">
            <p className={styles.panelLabel}>Product Snapshot</p>
            <h2 className={styles.panelTitle}>A focused platform for modern station operations.</h2>

            <div className={styles.snapshotList}>
              <div className={styles.snapshotItem}>
                <span className={styles.snapshotValue}>One-station-first rollout</span>
                <span className={styles.snapshotCaption}>
                  Start with a clean operator path before layering on larger tenant operations.
                </span>
              </div>
              <div className={styles.snapshotItem}>
                <span className={styles.snapshotValue}>1,000,000-song-ready library design</span>
                <span className={styles.snapshotCaption}>
                  Built around paginated media access and summary documents instead of whole-library browser loads.
                </span>
              </div>
              <div className={styles.snapshotItem}>
                <span className={styles.snapshotValue}>Thai as a launch requirement</span>
                <span className={styles.snapshotCaption}>
                  Thai rendering, metadata preservation, widgets, and exports are part of the product contract.
                </span>
              </div>
              <div className={styles.snapshotItem}>
                <span className={styles.snapshotValue}>Updated {updatedDateLabel}</span>
                <span className={styles.snapshotCaption}>
                  This landing page reflects the current Firebase, Cloud Run, widget, billing, and worker model.
                </span>
              </div>
            </div>
          </aside>
        </section>

        <section id="overview" className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>What is The Urban Radio?</h2>
            <p className={styles.answerLead}>
              The Urban Radio is a cloud-first radio automation platform that gives operators a single web control
              plane for playlists, scheduling, relay control, recording jobs, widgets, and hosted station operations.
              It is designed to replace fragmented station workflows with one consistent operational surface.
            </p>
          </div>

          <div className={styles.featureGrid}>
            {featureCards.map((card) => (
              <article key={card.title} className={styles.featureCard}>
                <h3>{card.title}</h3>
                <p>{card.description}</p>
              </article>
            ))}
          </div>
        </section>

        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>How does cloud radio automation work in The Urban Radio?</h2>
            <p className={styles.answerLead}>
              The Urban Radio separates the browser, control plane, and worker plane so each layer does one job well.
              Operators manage station state in the web app, Functions validate and record intent, and automation
              workers execute commands for relays, recordings, indexing, and queue refresh workflows.
            </p>
          </div>

          <div className={styles.steps}>
            {workflowSteps.map((step, index) => (
              <article key={step.title} className={styles.stepCard}>
                <span className={styles.stepNumber}>{index + 1}</span>
                <h3>{step.title}</h3>
                <p>{step.description}</p>
              </article>
            ))}
          </div>
        </section>

        <section id="compare" className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>
              Why choose The Urban Radio instead of desktop radio automation software?
            </h2>
            <p className={styles.answerLead}>
              The Urban Radio is better suited to teams that need remote visibility, repeatable station provisioning,
              hosted plan operations, and Thai-ready publishing. Desktop radio automation software often works for a
              single local setup, but web-first operations need a control model that can be reviewed, shared, and
              evolved without depending on one machine.
            </p>
          </div>

          <div className={styles.comparisonWrap}>
            <table className={styles.comparisonTable}>
              <thead>
                <tr>
                  <th scope="col">Decision Area</th>
                  <th scope="col">Desktop Automation</th>
                  <th scope="col">The Urban Radio</th>
                </tr>
              </thead>
              <tbody>
                {comparisonRows.map((row) => (
                  <tr key={row.label}>
                    <td className={styles.comparisonHighlight}>{row.label}</td>
                    <td>{row.desktop}</td>
                    <td>{row.urban}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>What can operators manage from one station dashboard?</h2>
            <p className={styles.answerLead}>
              Operators can use The Urban Radio to manage the core state that keeps a station moving: library totals,
              playlists, schedule events, relays, recording jobs, playback preferences, worker commands, and hosted
              plan context. That scope matters because fragmented operations create slow handoffs and hidden failure
              points.
            </p>
          </div>

          <div className={styles.signalGrid}>
            {controlPlaneCards.map((card) => (
              <article key={card.title} className={styles.signalCard}>
                <h3>{card.title}</h3>
                <p>{card.description}</p>
              </article>
            ))}
          </div>
        </section>

        <section id="thai" className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>How does The Urban Radio support Thai radio operations?</h2>
            <p className={styles.answerLead}>
              The Urban Radio treats Thai support as a product requirement, not a translation afterthought. The stack
              is designed so Thai text, station metadata, widget payloads, dashboard content, and output-oriented
              workflows can be implemented and verified as part of launch quality instead of patched in later.
            </p>
          </div>

          <div className={styles.featureGrid}>
            {thaiSupportCards.map((card) => (
              <article key={card.title} className={styles.featureCard}>
                <h3>{card.title}</h3>
                <p>{card.description}</p>
              </article>
            ))}
          </div>
        </section>

        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Who is The Urban Radio for?</h2>
            <p className={styles.answerLead}>
              The Urban Radio is for teams that need a cloud radio automation platform rather than a single-machine
              broadcast tool. It fits internet stations, FM simulcast operators, managed service providers, and
              broadcasters that care about Thai-ready metadata, public outputs, and repeatable operational control.
            </p>
          </div>

          <div className={styles.fitGrid}>
            {audienceCards.map((card) => (
              <article key={card.title} className={styles.fitCard}>
                <h3>{card.title}</h3>
                <p>{card.description}</p>
              </article>
            ))}
          </div>
        </section>

        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>What makes this platform easy to cite and evaluate?</h2>
            <p className={styles.answerLead}>
              The Urban Radio publishes a direct product story with clean semantic HTML, structured FAQ answers, and
              explicit platform facts. That matters for human evaluation and AI citation because answer engines need
              clear, quotable passages and machine-readable product context instead of vague marketing fragments.
            </p>
            <p className={styles.sectionNote}>
              Product facts below are intentionally specific so search engines, AI systems, and buyers can understand
              the platform without guessing.
            </p>
          </div>

          <div className={styles.signalGrid}>
            {platformSignals.map((card) => (
              <article key={card.title} className={styles.signalCard}>
                <h3>{card.title}</h3>
                <p>{card.description}</p>
              </article>
            ))}
          </div>
        </section>

        <section id="faq" className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Frequently asked questions about The Urban Radio</h2>
            <p className={styles.answerLead}>
              These answers are written to be direct, complete, and easy to quote because operators, search engines,
              and AI assistants all look for concise explanations before they commit time to a platform evaluation.
            </p>
          </div>

          <div className={styles.faqGrid}>
            {faqs.map((faq) => (
              <details key={faq.question} className={styles.faqItem}>
                <summary>{faq.question}</summary>
                <p>{faq.answer}</p>
              </details>
            ))}
          </div>
        </section>

        <section className={styles.cta}>
          <h2 className={styles.ctaTitle}>Run your next station from one cloud control plane.</h2>
          <p className={styles.ctaLead}>
            Start with FM provisioning, move into Cloud operations, and use the architecture docs to evaluate how
            The Urban Radio handles scheduling, relays, recording workflows, public outputs, and Thai-ready station
            publishing.
          </p>

          <div className={styles.heroActions}>
            <Link href="/fm" className={styles.primaryAction}>
              Provision A Station
            </Link>
            <Link href="/docs" className={styles.secondaryAction}>
              Review The Docs
            </Link>
          </div>
        </section>

        <footer className={styles.footer}>
          <span>
            {siteName} • {primaryKeyword} • Updated {updatedDateLabel}
          </span>

          <div className={styles.footerLinks}>
            <Link href="/privacy">Privacy</Link>
            <Link href="/docs">Docs</Link>
            <Link href="/cloud">Cloud</Link>
            <Link href="/fm">FM</Link>
          </div>
        </footer>
      </div>
    </main>
  );
}
