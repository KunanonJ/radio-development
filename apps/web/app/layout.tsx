import type { ReactNode } from "react";
import type { Metadata } from "next";
import "./globals.css";
import { FirebaseAnalytics } from "../components/firebase-analytics";

export const metadata: Metadata = {
  title: "The Urban Radio",
  description: "Cloud-first radio automation powered by Firebase and Cloud Run."
};

export default function RootLayout({
  children
}: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <FirebaseAnalytics />
        {children}
      </body>
    </html>
  );
}
