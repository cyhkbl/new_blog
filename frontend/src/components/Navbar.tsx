"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navLinks = [
  { href: "/articles", label: "文章" },
  { href: "/about", label: "关于我" },
  { href: "/sites", label: "我的其它站点" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close menu on route change
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  const isHome = pathname === "/";
  const textColor = isHome
    ? "text-white"
    : scrolled
      ? "text-[var(--text-primary)]"
      : "text-[var(--text-primary)]";

  return (
    <nav
      className={`flex items-center justify-between px-6 py-4 transition-all duration-300 ${
        scrolled
          ? "bg-white/70 backdrop-blur-2xl saturate-180 shadow-sm border-b border-black/5"
          : isHome
            ? "bg-black/20 backdrop-blur-xl saturate-150"
            : "bg-white/50 backdrop-blur-2xl saturate-180 border-b border-black/5"
      }`}
    >
      <Link href="/" className={`text-sm font-semibold tracking-wider transition ${textColor}`}>
        空白棱的小站
      </Link>

      {/* Desktop nav */}
      <div className="hidden sm:flex items-center gap-1">
        {navLinks.map(({ href, label }) => {
          const active = pathname === href || pathname.startsWith(href + "/");
          return (
            <Link
              key={href}
              href={href}
              className={`rounded-full px-4 py-1.5 text-sm transition-all ${
                active
                  ? isHome
                    ? "bg-white/20 text-white font-medium"
                    : "bg-black/8 text-[var(--text-primary)] font-medium"
                  : isHome
                    ? "text-white/70 hover:text-white hover:bg-white/10"
                    : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-black/5"
              }`}
            >
              {label}
            </Link>
          );
        })}
      </div>

      {/* Mobile hamburger */}
      <button
        className="sm:hidden flex flex-col gap-1.5 p-2 -mr-2"
        onClick={() => setMenuOpen(!menuOpen)}
        aria-label="菜单"
      >
        <span className={`block h-0.5 w-5 rounded-full transition-all duration-300 ${textColor} ${menuOpen ? "rotate-45 translate-y-2" : ""}`} />
        <span className={`block h-0.5 w-5 rounded-full transition-all duration-300 ${textColor} ${menuOpen ? "opacity-0" : ""}`} />
        <span className={`block h-0.5 w-5 rounded-full transition-all duration-300 ${textColor} ${menuOpen ? "-rotate-45 -translate-y-2" : ""}`} />
      </button>

      {/* Mobile menu overlay */}
      {menuOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm sm:hidden"
          onClick={() => setMenuOpen(false)}
        />
      )}

      {/* Mobile menu panel */}
      <div
        className={`fixed top-0 right-0 z-50 h-full w-64 bg-white/95 backdrop-blur-xl border-l border-black/10 shadow-xl transition-transform duration-300 sm:hidden ${
          menuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex flex-col p-6 pt-20 gap-1">
          {navLinks.map(({ href, label }) => {
            const active = pathname === href || pathname.startsWith(href + "/");
            return (
              <Link
                key={href}
                href={href}
                className={`rounded-xl px-4 py-3 text-sm transition-all ${
                  active
                    ? "bg-black/8 text-[var(--text-primary)] font-medium"
                    : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-black/5"
                }`}
              >
                {label}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
