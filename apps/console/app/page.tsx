import { env } from "cloudflare:workers";
import { normalizeLocale } from "@radioboss/contracts";
import { getLocaleDictionary } from "@radioboss/i18n";
import { AppShell, Pill, SectionCard, StatCard } from "@radioboss/ui";

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

export default async function ConsolePage({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;
  const locale = normalizeLocale(Array.isArray(params.lang) ? params.lang[0] : params.lang);
  const { dictionary } = getLocaleDictionary(locale);
  const appName = dictionary.common.app_name;
  const runtimeEnv = env as unknown as {
    APP_ENV?: string;
    CONTROL_API_URL?: string;
    STREAM_PLAYBACK_HOST?: string;
  };

  return (
    <AppShell
      appName={appName}
      title="Operations Console"
      subtitle="Station programming, automation, and queue state on Workers, Durable Objects, and D1."
      locale={locale}
      nav={[
        { href: `/?lang=${locale}`, label: dictionary.player.title },
        { href: `/?lang=${locale}#library`, label: dictionary.library.title },
        { href: `/?lang=${locale}#scheduler`, label: dictionary.scheduler.title },
        { href: `/?lang=${locale}#streaming`, label: dictionary.streaming.title },
        { href: `/?lang=${locale}#reports`, label: dictionary.reports.title }
      ]}
      actions={
        <>
          <a href="/?lang=en">English</a>
          <a href="/?lang=th">ภาษาไทย</a>
        </>
      }
    >
      <StatCard label="Environment" value={runtimeEnv.APP_ENV ?? "dev"} hint="Bound from wrangler.jsonc" />
      <StatCard label="Playback host" value={runtimeEnv.STREAM_PLAYBACK_HOST ?? "pending"} hint="Cloudflare Stream edge host" />
      <StatCard label="Control API" value={runtimeEnv.CONTROL_API_URL ?? "pending"} hint="Service binding / local origin" />

      <SectionCard title={dictionary.player.title} description="Realtime operator controls are coordinated by one Durable Object per station.">
        <p>
          <Pill tone="accent">{dictionary.player.live_assist}</Pill>
        </p>
        <ul>
          <li>{dictionary.player.current_track}</li>
          <li>{dictionary.player.next_track}</li>
          <li>{dictionary.player.crossfade}</li>
          <li>{dictionary.player.voice_tracking}</li>
        </ul>
      </SectionCard>

      <SectionCard title={dictionary.library.title} description="Media metadata is stored in D1 and binary assets are stored in R2.">
        <ul>
          <li>{dictionary.common.search}</li>
          <li>{dictionary.library.tags}</li>
          <li>{dictionary.library.artwork}</li>
          <li>{dictionary.library.comments}</li>
        </ul>
      </SectionCard>

      <SectionCard title={dictionary.scheduler.title} description="Schedulers publish queue mutations through the station gateway worker.">
        <ul>
          <li>{dictionary.scheduler.events}</li>
          <li>{dictionary.scheduler.recurring}</li>
          <li>{dictionary.scheduler.commands}</li>
          <li>{dictionary.scheduler.manual_mode}</li>
        </ul>
      </SectionCard>

      <SectionCard title={dictionary.streaming.title} description="Broadcasting and encoder state are exposed via the control API and station gateway.">
        <ul>
          <li>{dictionary.streaming.encoder}</li>
          <li>{dictionary.streaming.listeners}</li>
          <li>{dictionary.streaming.now_playing_export}</li>
          <li>{dictionary.streaming.statistics}</li>
        </ul>
      </SectionCard>

      <SectionCard title={dictionary.reports.title} description="Airplay and compliance reports are generated from D1 and export to XLS/PDF.">
        <ul>
          <li>{dictionary.reports.date_range}</li>
          <li>{dictionary.reports.export_xls}</li>
          <li>{dictionary.reports.export_pdf}</li>
          <li>{dictionary.reports.airplay}</li>
        </ul>
      </SectionCard>

      <SectionCard title={dictionary.common.error} description="User-facing errors use localized messages.">
        <ul>
          <li>{dictionary.errors.file_not_found}</li>
          <li>{dictionary.errors.connection_failed}</li>
          <li>{dictionary.errors.please_restart}</li>
        </ul>
      </SectionCard>
    </AppShell>
  );
}
