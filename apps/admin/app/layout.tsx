import "./globals.css";
import type { ReactNode } from "react";

export const metadata = {
  title: "RadioBOSS Admin",
  description: "Internal operations and hosting control"
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
