import "./globals.css";
import type { ReactNode } from "react";

export const metadata = {
  title: "RadioBOSS Console",
  description: "Cloudflare-first radio operations console"
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
