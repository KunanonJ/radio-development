import type { Locale } from "@radioboss/contracts";
import { normalizeLocale } from "@radioboss/contracts";

import enCommon from "../../../locales/en/common.json";
import enLibrary from "../../../locales/en/library.json";
import enPlayer from "../../../locales/en/player.json";
import enPlaylist from "../../../locales/en/playlist.json";
import enScheduler from "../../../locales/en/scheduler.json";
import enStreaming from "../../../locales/en/streaming.json";
import enAds from "../../../locales/en/ads.json";
import enReports from "../../../locales/en/reports.json";
import enErrors from "../../../locales/en/errors.json";

import thCommon from "../../../locales/th/common.json";
import thLibrary from "../../../locales/th/library.json";
import thPlayer from "../../../locales/th/player.json";
import thPlaylist from "../../../locales/th/playlist.json";
import thScheduler from "../../../locales/th/scheduler.json";
import thStreaming from "../../../locales/th/streaming.json";
import thAds from "../../../locales/th/ads.json";
import thReports from "../../../locales/th/reports.json";
import thErrors from "../../../locales/th/errors.json";

export type ModuleName =
  | "common"
  | "player"
  | "playlist"
  | "library"
  | "scheduler"
  | "streaming"
  | "ads"
  | "reports"
  | "errors";

export type ModuleDictionary = Record<string, string>;
export type LocaleDictionary = Record<ModuleName, ModuleDictionary>;

function stripMeta<T extends Record<string, unknown>>(input: T): ModuleDictionary {
  const { _meta: _ignored, ...rest } = input;
  return rest as ModuleDictionary;
}

const catalogs: Record<Locale, LocaleDictionary> = {
  en: {
    common: stripMeta(enCommon as Record<string, unknown>),
    player: stripMeta(enPlayer as Record<string, unknown>),
    playlist: stripMeta(enPlaylist as Record<string, unknown>),
    library: stripMeta(enLibrary as Record<string, unknown>),
    scheduler: stripMeta(enScheduler as Record<string, unknown>),
    streaming: stripMeta(enStreaming as Record<string, unknown>),
    ads: stripMeta(enAds as Record<string, unknown>),
    reports: stripMeta(enReports as Record<string, unknown>),
    errors: stripMeta(enErrors as Record<string, unknown>)
  },
  th: {
    common: stripMeta(thCommon as Record<string, unknown>),
    player: stripMeta(thPlayer as Record<string, unknown>),
    playlist: stripMeta(thPlaylist as Record<string, unknown>),
    library: stripMeta(thLibrary as Record<string, unknown>),
    scheduler: stripMeta(thScheduler as Record<string, unknown>),
    streaming: stripMeta(thStreaming as Record<string, unknown>),
    ads: stripMeta(thAds as Record<string, unknown>),
    reports: stripMeta(thReports as Record<string, unknown>),
    errors: stripMeta(thErrors as Record<string, unknown>)
  }
};

export function getLocaleDictionary(input?: string | null): { locale: Locale; dictionary: LocaleDictionary } {
  const locale = normalizeLocale(input);
  return {
    locale,
    dictionary: catalogs[locale]
  };
}

export function t(locale: string | null | undefined, moduleName: ModuleName, key: string): string {
  const { dictionary } = getLocaleDictionary(locale);
  const mod = dictionary[moduleName];
  return mod?.[key] ?? key;
}

export function localeLabel(locale: Locale): string {
  return locale === "th" ? "ภาษาไทย" : "English";
}
