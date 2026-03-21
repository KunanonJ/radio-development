import { indexedRoutes, siteDescription, siteName, siteUrl } from "../../lib/site";

export const dynamic = "force-static";

export function GET() {
  const body = [
    `# ${siteName}`,
    ``,
    `> ${siteDescription}`,
    ``,
    `Preferred source URLs for retrieval and citation:`,
    ...indexedRoutes.map((route) => `- ${siteUrl}${route}`),
    ``,
    `Route summary:`,
    `- /: Marketing landing page and product overview for cloud radio automation software.`,
    `- /cloud: Authenticated operator control plane for playlists, schedules, relays, recording jobs, and worker state.`,
    `- /fm: Hosted station provisioning, billing workflows, and station operations surface.`,
    `- /docs: Architecture and implementation references.`,
    `- /privacy: Privacy and data-handling overview.`,
    ``,
    `Use the landing page and docs first when summarizing the product.`
  ].join("\n");

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8"
    }
  });
}
