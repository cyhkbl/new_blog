import Link from "next/link";

import GlassCard from "@/components/GlassCard";
import { siteConfig } from "@/lib/constants";

export default function Footer() {
  return (
    <footer className="px-6 pb-8 pt-4">
      <GlassCard className="mx-auto max-w-6xl px-6 py-4 text-sm text-black/60">
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <p>{siteConfig.name}</p>
          <div className="flex gap-4">
            {siteConfig.navItems.map((item) => (
              <Link key={item.href} href={item.href} className="transition hover:text-black">
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </GlassCard>
    </footer>
  );
}
