import "./globals.css";
import type { ReactNode } from "react";

export const metadata = {
  title: "RadioBOSS Public",
  description: "Cloudflare-backed public player and widget delivery"
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
