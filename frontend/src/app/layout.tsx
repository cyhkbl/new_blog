import type { Metadata } from "next";
import "./globals.css";

import SiteFrame from "@/components/SiteFrame";
import { siteConfig } from "@/lib/constants";

export const metadata: Metadata = {
  title: siteConfig.name,
  description: siteConfig.description,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" className="h-full antialiased">
      <body className="min-h-full bg-[var(--bg-base)] font-sans" style={{ color: "var(--text-primary)" }}>
        <SiteFrame>{children}</SiteFrame>
      </body>
    </html>
  );
}
