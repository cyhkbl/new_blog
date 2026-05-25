"use client";

import { usePathname } from "next/navigation";

import Navbar from "@/components/Navbar";

const bgMap: Record<string, string> = {
  "/about": "/images/about_wallpaper.png",
  "/articles": "/images/article_wallpaper.png",
  "/sites": "/images/links_wallpaper.png",
};

function getBgImage(pathname: string): string | null {
  if (bgMap[pathname]) return bgMap[pathname];
  if (pathname.startsWith("/articles/")) return bgMap["/articles"];
  return null;
}

export default function SiteFrame({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const isSocial = pathname === "/social";
  const bgImage = getBgImage(pathname);

  if (isHome || isSocial) {
    return <>{children}</>;
  }

  return (
    <div className="relative min-h-screen">
      {bgImage && (
        <div
          className="fixed inset-0 bg-cover bg-center -z-10"
          style={{ backgroundImage: `url('${bgImage}')` }}
        />
      )}
      {!bgImage && (
        <div className="fixed inset-0 -z-10 bg-[var(--bg-base)]" />
      )}
      <Navbar />
      <main className="mx-auto max-w-5xl px-6 py-10">{children}</main>
    </div>
  );
}
