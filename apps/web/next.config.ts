import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typedRoutes: true,
  transpilePackages: [
    "@the-urban-radio/contracts",
    "@the-urban-radio/i18n",
    "@the-urban-radio/ui"
  ]
};

export default nextConfig;
