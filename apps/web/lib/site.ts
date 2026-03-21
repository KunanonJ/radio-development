export const siteName = "The Urban Radio";
export const siteDescription =
  "Cloud radio automation software for internet and FM stations with playlists, scheduling, relay control, recording, widgets, billing, and Thai-ready outputs.";
export const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? "http://127.0.0.1:3000").replace(/\/$/, "");
export const primaryKeyword = "cloud radio automation software";
export const siteKeywords = [
  "cloud radio automation software",
  "internet radio automation",
  "FM station automation software",
  "radio scheduling software",
  "radio relay control",
  "radio recording software",
  "Thai radio automation",
  "station automation dashboard"
];

export const indexedRoutes = ["/", "/cloud", "/fm", "/docs", "/privacy"] as const;
