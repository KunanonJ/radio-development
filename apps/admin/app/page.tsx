import { env } from "cloudflare:workers";
import { normalizeLocale } from "@radioboss/contracts";
import { getLocaleDictionary } from "@radioboss/i18n";
import { AppShell, Pill, SectionCard, StatCard } from "@radioboss/ui";

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

export default async function AdminPage({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;
  const locale = normalizeLocale(Array.isArray(params.lang) ? params.lang[0] : params.lang);
  const { dictionary } = getLocaleDictionary(locale);
  const runtimeEnv = env as unknown as {
    APP_ENV?: string;
    ACCESS_AUDIENCE?: string;
    BILLING_PROVIDER?: string;
  };

  return (
    <AppShell
      appName="RadioBOSS.FM"
      title="Hosting Admin"
      subtitle="Internal staff surface for tenancy, provisioning, billing posture, and rollout gates."
      locale={locale}
      nav={[
        { href: `/?lang=${locale}`, label: "Plans" },
        { href: `/?lang=${locale}#provisioning`, label: "Provisioning" },
        { href: `/?lang=${locale}#ads`, label: dictionary.ads.title },
        { href: `/?lang=${locale}#reports`, label: dictionary.reports.title },
        { href: `/?lang=${locale}#observability`, label: "Observability" }
      ]}
      actions={
        <>
          <a href="/?lang=en">English</a>
          <a href="/?lang=th">ภาษาไทย</a>
        </>
      }
    >
      <StatCard label="Environment" value={runtimeEnv.APP_ENV ?? "dev"} hint="Wrangler environment" />
      <StatCard label="Access audience" value={runtimeEnv.ACCESS_AUDIENCE ?? "unset"} hint="Cloudflare Access policy" />
      <StatCard label="Billing provider" value={runtimeEnv.BILLING_PROVIDER ?? "stripe"} hint="Plan and quota source" />

      <SectionCard title={dictionary.ads.title} description="Commercial breaks, intros/outros, and remote ads are configured per station.">
        <ul>
          <li>{dictionary.ads.commercial_break}</li>
          <li>{dictionary.ads.groups}</li>
          <li>{dictionary.ads.start_date}</li>
          <li>{dictionary.ads.end_date}</li>
        </ul>
      </SectionCard>

      <SectionCard title={dictionary.reports.title} description="Reports and exports use localized column headers and labels.">
        <ul>
          <li>{dictionary.reports.generate_report}</li>
          <li>{dictionary.reports.export_pdf}</li>
          <li>{dictionary.reports.compliance}</li>
        </ul>
      </SectionCard>

      <SectionCard title="Provisioning workflow" description="Station creation is queued and finalized by a workflow export in the control API worker.">
        <ul>
          <li>Create tenant and station registry rows</li>
          <li>Prepare D1 schema and R2 prefix naming</li>
          <li>Seed widget defaults and metadata endpoints</li>
        </ul>
      </SectionCard>

      <SectionCard title="Pilot gates" description="No customer rollout happens before the container media plane passes soak validation.">
        <p>
          <Pill tone="accent">14-day playout soak</Pill>
        </p>
        <ul>
          <li>Container restart drills</li>
          <li>Realtime operator-session verification</li>
          <li>Signed playback and Stream validation</li>
        </ul>
      </SectionCard>

      <SectionCard title={dictionary.common.settings} description="Locale and support tooling inherit the shared Thai-capable UI package.">
        <ul>
          <li>{dictionary.common.language}</li>
          <li>{dictionary.common.save}</li>
          <li>{dictionary.common.warning}</li>
          <li>{dictionary.common.success}</li>
        </ul>
      </SectionCard>

      <SectionCard title={dictionary.common.error} description="Admin error messages are localized.">
        <ul>
          <li>{dictionary.errors.connection_failed}</li>
          <li>{dictionary.errors.save_failed}</li>
        </ul>
      </SectionCard>
    </AppShell>
  );
}
