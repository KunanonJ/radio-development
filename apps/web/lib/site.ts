export const siteName = "The Urban Radio";
export const siteDescription =
  "Cloud radio automation software for playlists, relays, recording, widgets, billing workflows, and Thai-ready station operations.";
export const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? "http://127.0.0.1:3000").replace(/\/$/, "");
export const primaryKeyword = "cloud radio automation software";
export const siteKeywords = [
  "cloud radio automation software",
  "radio automation platform",
  "internet radio management",
  "radio scheduling software",
  "Thai radio automation",
  "station automation dashboard"
];

export const indexedRoutes = ["/", "/cloud", "/fm", "/docs", "/privacy"] as const;
