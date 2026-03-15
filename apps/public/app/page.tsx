import { env } from "cloudflare:workers";
import { normalizeLocale } from "@radioboss/contracts";
import { getLocaleDictionary } from "@radioboss/i18n";
import { AppShell, Pill, SectionCard, StatCard } from "@radioboss/ui";

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

export default async function PublicPage({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;
  const locale = normalizeLocale(Array.isArray(params.lang) ? params.lang[0] : params.lang);
  const { dictionary } = getLocaleDictionary(locale);
  const runtimeEnv = env as unknown as {
    APP_ENV?: string;
    STREAM_PLAYBACK_HOST?: string;
    PUBLIC_WIDGET_ID?: string;
    CONTROL_API?: Fetcher;
  };

  let tokenError: string | null = null;
  const token = Array.isArray(params.token) ? params.token[0] : params.token;
  if (token && runtimeEnv.CONTROL_API) {
    try {
      const res = await runtimeEnv.CONTROL_API.fetch(
        `https://control-api/v1/validate-widget?token=${encodeURIComponent(token)}`
      );
      if (!res.ok) {
        const body = (await res.json()) as { error?: string };
        tokenError = body.error === "token_expired" ? dictionary.errors.token_expired : dictionary.errors.invalid_token;
      }
    } catch {
      tokenError = dictionary.errors.invalid_token;
    }
  }

  return (
    <AppShell
      appName="RadioBOSS Public"
      title="Listener Delivery"
      subtitle="Public embeds and playback are delivered at the edge, with HLS from Stream and legacy endpoints from the playout container."
      locale={locale}
      nav={[
        { href: `/?lang=${locale}`, label: dictionary.streaming.title },
        { href: `/?lang=${locale}#widgets`, label: "Widgets" },
        { href: `/?lang=${locale}#metadata`, label: "Metadata" }
      ]}
      actions={
        <>
          <a href="/?lang=en">English</a>
          <a href="/?lang=th">ภาษาไทย</a>
        </>
      }
    >
      <StatCard label="Widget ID" value={runtimeEnv.PUBLIC_WIDGET_ID ?? "demo-player"} hint="Used for signed embed payloads" />
      <StatCard label="Playback host" value={runtimeEnv.STREAM_PLAYBACK_HOST ?? "unset"} hint="Browser/mobile HLS origin" />
      <StatCard label="Environment" value={runtimeEnv.APP_ENV ?? "dev"} hint="Worker binding" />

      <SectionCard title={dictionary.streaming.title} description="Encoder state, listeners, and now-playing export are exposed at the edge.">
        <p>
          <Pill tone="accent">{dictionary.streaming.listeners}</Pill>
        </p>
        <ul>
          <li>{dictionary.streaming.encoder}</li>
          <li>{dictionary.streaming.now_playing_export}</li>
          <li>{dictionary.streaming.statistics}</li>
        </ul>
      </SectionCard>

      <SectionCard title="Now playing" description="Metadata is sourced from the station gateway worker and published to widgets and webhooks.">
        <p>
          <Pill tone="accent">{dictionary.player.current_track}</Pill>
        </p>
        <ul>
          <li>{dictionary.player.next_track}</li>
          <li>{dictionary.playlist.generate}</li>
          <li>{dictionary.library.artwork}</li>
        </ul>
      </SectionCard>

      {tokenError && (
        <SectionCard title={dictionary.common.error} description={tokenError}>
          <p>{dictionary.errors.please_restart}</p>
        </SectionCard>
      )}

      <SectionCard title={dictionary.common.error} description="User-facing errors use localized messages.">
        <ul>
          <li>{dictionary.errors.connection_failed}</li>
          <li>{dictionary.errors.stream_error}</li>
          <li>{dictionary.errors.invalid_token}</li>
          <li>{dictionary.errors.token_expired}</li>
          <li>{dictionary.errors.please_restart}</li>
        </ul>
      </SectionCard>

      <SectionCard title={dictionary.common.language} description="Thai and English are both first-class in shared locale packs.">
        <ul>
          <li>{dictionary.common.language_thai}</li>
          <li>{dictionary.common.language_english}</li>
          <li>{dictionary.common.help}</li>
        </ul>
      </SectionCard>
    </AppShell>
  );
}
