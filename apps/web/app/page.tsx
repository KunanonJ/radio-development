import type { Metadata } from "next";
import Link from "next/link";
import styles from "./home.module.css";
import { primaryKeyword, siteDescription, siteKeywords, siteName, siteUrl } from "../lib/site";

const updatedDateLabel = "March 21, 2026";
const updatedDateIso = "2026-03-21";

const proofSignals = [
  {
    value: "2 operating surfaces",
    label: "Cloud manages scheduling and widgets. FM handles provisioning, billing, and station endpoints."
  },
  {
    value: "1 web control plane",
    label: "Operators work from a browser instead of stitching together desktop software and manual exports."
  },
  {
    value: "1,000,000-asset design target",
    label: "Large library support is planned around paginated access and summary documents, not full collection loads."
  },
  {
    value: "Thai-ready by design",
    label: "UTF-8-safe metadata, widgets, player feeds, and reporting are part of the platform contract."
  }
];

const heroPillars = [
  {
    title: "Cloud",
    description: "Playlists, scheduler, relays, reports, widgets, and queue monitoring."
  },
  {
    title: "FM",
    description: "Station provisioning, listener-capacity planning, billing workflows, and stream endpoints."
  },
  {
    title: "Workers",
    description: "Relay failover, recording, export dispatch, and indexing preparation outside the browser."
  },
  {
    title: "Outputs",
    description: "Public player feeds and widget endpoints that stay aligned with station state."
  }
];

const outcomeCards = [
  {
    title: "Replace fragmented tooling",
    description:
      "Move playlists, schedules, relays, recording jobs, and public outputs into one product instead of spreading them across separate desktop tools and scripts."
  },
  {
    title: "Operate remotely with confidence",
    description:
      "Owners, admins, and operators can review the same station state without needing access to one specific studio machine."
  },
  {
    title: "Watch live operational risk",
    description:
      "Worker commands, relay states, queue refresh flows, and recording jobs stay visible so teams can intervene before small issues become dead air."
  },
  {
    title: "Publish listener-facing outputs",
    description:
      "Use the same platform to power internal operations and public-facing widgets or player feeds without creating a second web stack."
  }
];

const workflowSteps = [
  {
    title: "Provision the station in FM",
    description:
      "Create the tenant and station record, set the plan context, and establish the operational baseline the rest of the platform will use."
  },
  {
    title: "Configure the station in Cloud",
    description:
      "Add playlists, schedules, relays, recording jobs, playback preferences, and listener-facing output settings from the web control plane."
  },
  {
    title: "Let workers execute and report back",
    description:
      "Functions route commands into background workers, workers run the long-lived tasks, and station state returns to Firestore for live review."
  }
];

const surfaceCards = [
  {
    title: "Scheduling and rotation control",
    description:
      "Manage playlists, schedules, relays, and timing-sensitive station workflows from a product designed for radio operations, not generic project management."
  },
  {
    title: "Recording and archival jobs",
    description:
      "Treat recording, logging, retention, and export dispatch as first-class station workflows instead of fragile add-ons."
  },
  {
    title: "Station billing and listener plans",
    description:
      "Keep listener capacity, plan status, and billing references visible inside the same operating story as the rest of the station."
  },
  {
    title: "Widgets and player feeds",
    description:
      "Expose public-facing now-playing and station output surfaces from the same source of truth that powers the internal dashboards."
  }
];

const thaiCards = [
  {
    title: "Thai-safe metadata handling",
    description:
      "Station names, media titles, playlist labels, and public payloads are designed to preserve Thai text instead of forcing post-processing fixes."
  },
  {
    title: "Thai-ready public outputs",
    description:
      "Widgets, player feeds, and future public web surfaces can render Thai copy correctly because Thai support is handled at the platform level."
  },
  {
    title: "Thai-aware search preparation",
    description:
      "The indexing worker already separates search preparation from the main control plane so Thai search quality can improve without rewriting the app."
  },
  {
    title: "Thai as an acceptance gate",
    description:
      "The Urban Radio treats Thai rendering and export quality as launch criteria, not as a later localization backlog item."
  }
];

const audienceCards = [
  {
    title: "Internet radio operators",
    description:
      "Use one cloud product for playlists, scheduling, relays, recordings, and widgets without depending on a local studio desktop."
  },
  {
    title: "FM simulcast teams",
    description:
      "Manage station provisioning, billing, and hosted stream operations while keeping daily automation work in the same platform."
  },
  {
    title: "Multi-station operators",
    description:
      "Start with a strong one-station operating model, then extend the same tenant-aware control plane across a broader portfolio."
  },
  {
    title: "Thai-first broadcasters",
    description:
      "Choose a radio platform that treats Thai-safe metadata, widgets, search preparation, and reporting as product requirements."
  }
];

const evaluationFacts = [
  {
    term: "Primary category",
    description: "Cloud radio automation software for internet stations and FM operations teams."
  },
  {
    term: "Product surfaces",
    description: "The Urban Radio Cloud for operations and The Urban Radio FM for provisioning and plan administration."
  },
  {
    term: "Control plane",
    description: "Firebase Auth, Firestore, Storage, and Functions manage identity, state, and command routing."
  },
  {
    term: "Worker plane",
    description: "Cloud Run services handle long-running relay, recording, export, and indexing workflows."
  },
  {
    term: "Public outputs",
    description: "Widget feeds and player surfaces can be driven from the same station state as the internal dashboards."
  },
  {
    term: "Localization stance",
    description: "Thai-ready rendering, metadata handling, and future Thai-aware search are part of the core product direction."
  }
];

const comparisonRows = [
  {
    label: "Operating model",
    desktop: "Usually tied to a studio machine or one operator seat.",
    urban: "Web-first control plane that stays available to owners, admins, and operators."
  },
  {
    label: "Station rollout",
    desktop: "Manual setup on the right machine with local assumptions and hidden dependencies.",
    urban: "Provisioned through FM with repeatable station records, plan context, and authenticated APIs."
  },
  {
    label: "Relay and recording workflows",
    desktop: "Often split across plugins, scripts, or operator memory.",
    urban: "Workers run relay failover, recording, and export-oriented jobs as explicit platform workflows."
  },
  {
    label: "Public outputs",
    desktop: "Commonly requires a separate web stack or custom glue code.",
    urban: "Widgets and player feeds can come from the same station state that powers the operator dashboards."
  },
  {
    label: "Thai readiness",
    desktop: "Frequently depends on manual encoding and font workarounds.",
    urban: "Thai-safe metadata and outputs are part of the product contract."
  }
];

const faqs = [
  {
    question: "What is The Urban Radio?",
    answer:
      "The Urban Radio is cloud radio automation software for internet and FM stations that want playlists, scheduling, relay control, recording, widgets, billing workflows, and Thai-ready outputs in one web product."
  },
  {
    question: "How does The Urban Radio work?",
    answer:
      "Operators manage station state in the web app, Firebase stores the control-plane records, Functions route commands, and Cloud Run workers execute long-running tasks such as relay actions, recording jobs, exports, and indexing preparation."
  },
  {
    question: "Who should use The Urban Radio?",
    answer:
      "The product fits internet radio teams, FM simulcast operators, multi-station groups, and broadcasters that need remote visibility, hosted workflows, and Thai-ready public outputs instead of a desktop-only automation stack."
  },
  {
    question: "Does The Urban Radio support Thai radio workflows?",
    answer:
      "Yes. Thai-safe metadata handling, UTF-8-ready outputs, widgets, player feeds, and future Thai-aware search preparation are treated as product requirements rather than optional localization work."
  },
  {
    question: "Can The Urban Radio support large music libraries?",
    answer:
      "The platform direction is built around paginated media access, materialized summaries, and indexing workflows so stations can grow toward very large libraries without forcing the browser to load entire collections."
  },
  {
    question: "Why choose The Urban Radio over desktop radio automation software?",
    answer:
      "Choose The Urban Radio when you need remote access, repeatable station provisioning, worker-driven relay and recording workflows, billing visibility, and public outputs from one web-first control plane."
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
    "@type": "WebPage",
    name: `${siteName} Landing Page`,
    url: siteUrl,
    description: siteDescription,
    dateModified: updatedDateIso
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
      "Cloud dashboard for playlists, schedules, relays, widgets, and queue monitoring",
      "FM operations surface for station provisioning, billing workflows, and stream endpoints",
      "Cloud Run workers for relay failover, recording, export dispatch, and indexing preparation",
      "Thai-ready metadata handling, public outputs, and reporting workflows"
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

          <div className={styles.utilityLinks}>
            <Link href="/docs" className={styles.utilityLink}>
              Architecture
            </Link>
            <Link href="/privacy" className={styles.utilityLink}>
              Privacy
            </Link>
            <span className={styles.utilityNote}>Updated {updatedDateLabel}</span>
          </div>
        </header>

        <section className={styles.hero}>
          <div className={styles.heroCopy}>
            <p className={styles.eyebrow}>{primaryKeyword}</p>
            <h1 className={styles.heroTitle}>Cloud radio automation software for internet and FM stations.</h1>
            <p className={styles.heroLead}>
              {siteName} is {primaryKeyword} for teams that want playlists, scheduling, relay control, recording,
              widgets, billing workflows, and Thai-ready outputs in one web-first product. It replaces desktop-heavy
              station management with a Firebase control plane, Cloud Run workers, and a clearer operating model for
              modern radio teams.
            </p>

            <div className={styles.heroActions}>
              <Link href="/fm" className={styles.primaryAction}>
                Launch A Station
              </Link>
              <Link href="/cloud" className={styles.secondaryAction}>
                Open The Control Plane
              </Link>
              <Link href="/docs" className={styles.secondaryAction}>
                Review The Architecture
              </Link>
            </div>

            <p className={styles.heroNote}>
              Start in <Link href="/fm" className={styles.inlineLink}>FM</Link> to provision a station, move into{" "}
              <Link href="/cloud" className={styles.inlineLink}>Cloud</Link> to manage schedules and relays, and use{" "}
              <Link href="/privacy" className={styles.inlineLink}>Privacy</Link> plus{" "}
              <Link href="/docs" className={styles.inlineLink}>Architecture</Link> as the trust layer for buyers and
              reviewers.
            </p>
          </div>

          <aside className={styles.heroPanel} aria-label="Operating model">
            <p className={styles.panelLabel}>Operating Model</p>
            <p className={styles.panelTitle}>One product for station control, worker execution, and public outputs.</p>
            <p className={styles.panelLead}>
              The Urban Radio is built for web-only station operations. The browser handles management, Firebase stores
              operational state, and workers handle the long-running tasks that should not block the UI.
            </p>

            <div className={styles.pillarList}>
              {heroPillars.map((pillar) => (
                <div key={pillar.title} className={styles.pillarItem}>
                  <span className={styles.pillarValue}>{pillar.title}</span>
                  <span className={styles.pillarText}>{pillar.description}</span>
                </div>
              ))}
            </div>

            <div className={styles.panelLinks}>
              <Link href="/cloud" className={styles.panelLink}>
                Cloud Surface
              </Link>
              <Link href="/fm" className={styles.panelLink}>
                FM Surface
              </Link>
              <Link href="/privacy" className={styles.panelLink}>
                Privacy Policy
              </Link>
            </div>
          </aside>
        </section>

        <section className={styles.proofRail} aria-label="Product proof points">
          {proofSignals.map((signal) => (
            <article key={signal.value} className={styles.proofCard}>
              <p className={styles.proofValue}>{signal.value}</p>
              <p className={styles.proofLabel}>{signal.label}</p>
            </article>
          ))}
        </section>

        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <p className={styles.sectionEyebrow}>Direct Answer</p>
            <h2 className={styles.sectionTitle}>What is The Urban Radio?</h2>
            <p className={styles.answerLead}>
              {siteName} is a cloud-first radio automation platform for stations that want playlists, scheduling,
              relays, recording, widgets, billing workflows, and Thai-ready outputs in one product. It gives radio
              teams a web control plane instead of forcing daily operations through local desktop software.
            </p>
          </div>

          <div className={styles.cardGrid}>
            {outcomeCards.map((card) => (
              <article key={card.title} className={styles.card}>
                <h3 className={styles.cardTitle}>{card.title}</h3>
                <p className={styles.cardText}>{card.description}</p>
              </article>
            ))}
          </div>
        </section>

        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <p className={styles.sectionEyebrow}>Operational Benefit</p>
            <h2 className={styles.sectionTitle}>How does The Urban Radio help stations operate faster?</h2>
            <p className={styles.answerLead}>
              The Urban Radio reduces handoffs by putting station provisioning, scheduling, relay control, recording,
              and public outputs into one operating story. Instead of moving between desktop software, spreadsheets,
              scripts, and separate web tools, teams manage the station from a platform that keeps state visible and
              consistent.
            </p>
          </div>

          <div className={styles.cardGrid}>
            {surfaceCards.map((card) => (
              <article key={card.title} className={styles.card}>
                <h3 className={styles.cardTitle}>{card.title}</h3>
                <p className={styles.cardText}>{card.description}</p>
              </article>
            ))}
          </div>
        </section>

        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <p className={styles.sectionEyebrow}>System Flow</p>
            <h2 className={styles.sectionTitle}>How does The Urban Radio work?</h2>
            <p className={styles.answerLead}>
              The browser manages intent, Firebase stores control-plane state, and Cloud Run workers execute long-lived
              tasks. That separation keeps the landing experience fast while still supporting relay failover,
              recording jobs, queue refresh workflows, exports, and future indexing paths for large, Thai-ready
              libraries.
            </p>
          </div>

          <ol className={styles.stepGrid}>
            {workflowSteps.map((step, index) => (
              <li key={step.title} className={styles.stepCard}>
                <span className={styles.stepIndex}>{index + 1}</span>
                <h3 className={styles.cardTitle}>{step.title}</h3>
                <p className={styles.cardText}>{step.description}</p>
              </li>
            ))}
          </ol>
        </section>

        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <p className={styles.sectionEyebrow}>Buyer Fit</p>
            <h2 className={styles.sectionTitle}>Who should use The Urban Radio?</h2>
            <p className={styles.answerLead}>
              The Urban Radio fits internet radio operators, FM simulcast teams, multi-station groups, and
              broadcasters that need remote visibility, repeatable station provisioning, worker-driven automation, and
              Thai-ready outputs. It is especially useful when a station has outgrown single-machine workflows and
              needs a clearer cloud operating model.
            </p>
          </div>

          <div className={styles.cardGrid}>
            {audienceCards.map((card) => (
              <article key={card.title} className={styles.card}>
                <h3 className={styles.cardTitle}>{card.title}</h3>
                <p className={styles.cardText}>{card.description}</p>
              </article>
            ))}
          </div>
        </section>

        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <p className={styles.sectionEyebrow}>Localization</p>
            <h2 className={styles.sectionTitle}>Why is The Urban Radio stronger for Thai-ready radio operations?</h2>
            <p className={styles.answerLead}>
              The Urban Radio treats Thai as a product requirement. UTF-8-safe metadata, Thai-ready public outputs,
              and Thai-aware indexing preparation belong inside the platform contract, which is important for stations
              that cannot accept broken glyphs, encoding loss, or manual workaround chains in production workflows.
            </p>
          </div>

          <div className={styles.cardGrid}>
            {thaiCards.map((card) => (
              <article key={card.title} className={styles.card}>
                <h3 className={styles.cardTitle}>{card.title}</h3>
                <p className={styles.cardText}>{card.description}</p>
              </article>
            ))}
          </div>
        </section>

        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <p className={styles.sectionEyebrow}>Competitive Context</p>
            <h2 className={styles.sectionTitle}>
              How does The Urban Radio compare with desktop radio automation software?
            </h2>
            <p className={styles.answerLead}>
              The Urban Radio is designed for teams that need remote visibility, repeatable provisioning, worker-driven
              relay and recording workflows, and public outputs from one web-first control plane. Desktop automation
              software can work for one local setup, but it usually becomes harder to review, share, and evolve across
              a broader station operation.
            </p>
          </div>

          <div className={styles.compareWrap}>
            <table className={styles.compareTable}>
              <thead>
                <tr>
                  <th scope="col">Decision Area</th>
                  <th scope="col">Desktop Automation</th>
                  <th scope="col">{siteName}</th>
                </tr>
              </thead>
              <tbody>
                {comparisonRows.map((row) => (
                  <tr key={row.label}>
                    <td className={styles.compareHighlight}>{row.label}</td>
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
            <p className={styles.sectionEyebrow}>Evaluation Facts</p>
            <h2 className={styles.sectionTitle}>What facts help buyers evaluate The Urban Radio quickly?</h2>
            <p className={styles.answerLead}>
              Buyers, search engines, and answer engines all respond better to clear product facts than vague claims.
              The Urban Radio exposes a defined category, explicit system boundaries, and direct product scope so the
              platform is easier to review, easier to quote, and easier to align with high-intent search queries.
            </p>
          </div>

          <dl className={styles.factGrid}>
            {evaluationFacts.map((fact) => (
              <div key={fact.term} className={styles.factItem}>
                <dt>{fact.term}</dt>
                <dd>{fact.description}</dd>
              </div>
            ))}
          </dl>
        </section>

        <section id="faq" className={styles.section}>
          <div className={styles.sectionHeader}>
            <p className={styles.sectionEyebrow}>FAQ</p>
            <h2 className={styles.sectionTitle}>Frequently asked questions about The Urban Radio</h2>
            <p className={styles.answerLead}>
              These answers are written to match the questions buyers and answer engines ask most often when they are
              comparing cloud radio automation software, remote station management products, and Thai-ready
              broadcasting platforms.
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
          <p className={styles.sectionEyebrow}>Get Started</p>
          <h2 className={styles.ctaTitle}>Run the station from the web, not from one machine.</h2>
          <p className={styles.ctaLead}>
            Start with <Link href="/fm" className={styles.ctaLink}>FM</Link> to provision a station, move into{" "}
            <Link href="/cloud" className={styles.ctaLink}>Cloud</Link> to manage playlists, relays, recording, and
            widgets, then review <Link href="/docs" className={styles.ctaLink}>Architecture</Link> and{" "}
            <Link href="/privacy" className={styles.ctaLink}>Privacy</Link> before deployment.
          </p>

          <div className={styles.heroActions}>
            <Link href="/fm" className={styles.primaryAction}>
              Launch A Station
            </Link>
            <Link href="/cloud" className={styles.secondaryAction}>
              Open Cloud
            </Link>
          </div>
        </section>

        <footer className={styles.footer}>
          <span>{siteName} landing page updated {updatedDateLabel}.</span>
          <div className={styles.footerLinks}>
            <Link href="/docs">Docs</Link>
            <Link href="/privacy">Privacy</Link>
            <Link href="/cloud">Cloud</Link>
            <Link href="/fm">FM</Link>
          </div>
        </footer>
      </div>
    </main>
  );
}
