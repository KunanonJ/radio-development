import type { ReactNode } from "react";
import type { Metadata, Viewport } from "next";
import { Sarabun, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { FirebaseAnalytics } from "../components/firebase-analytics";
import { siteDescription, siteName, siteUrl } from "../lib/site";

const sarabun = Sarabun({
  subsets: ["latin", "thai"],
  weight: ["400", "500", "700"],
  display: "swap",
  variable: "--font-body"
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  display: "swap",
  variable: "--font-display"
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: siteName,
    template: `%s | ${siteName}`
  },
  description: siteDescription,
  applicationName: siteName,
  alternates: {
    canonical: "/"
  },
  openGraph: {
    type: "website",
    url: siteUrl,
    title: siteName,
    description: siteDescription,
    siteName
  },
  twitter: {
    card: "summary_large_image",
    title: siteName,
    description: siteDescription
  }
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#d5622d"
};

export default function RootLayout({
  children
}: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${sarabun.variable} ${spaceGrotesk.variable}`}>
        <FirebaseAnalytics />
        {children}
      </body>
    </html>
  );
}
