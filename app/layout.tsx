// app/layout.tsx — Ny fil — root layout for App Router
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "YouTube SEO & Community Growth Tool",
  description: "AI-drevet vækstplatform for YouTubere",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="da">
      <body>{children}</body>
    </html>
  );
}
