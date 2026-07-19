"use client";

import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";

import Navbar from "@/components/Navbar";

const bgMap: Record<string, string> = {
  "/about": "/images/about_wallpaper.png",
  "/articles": "/images/article_wallpaper.png",
  "/Scholar": "/images/about_wallpaper.png",
  "/sites": "/images/links_wallpaper.png",
  "/social": "/images/linktree-wallpaper.jpg",
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
  const bgImage = getBgImage(pathname);

  if (isHome) {
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
      <AnimatePresence mode="wait">
        <motion.main
          key={pathname}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="mx-auto max-w-5xl px-6 py-10">
          {children}
        </motion.main>
      </AnimatePresence>
    </div>
  );
}
