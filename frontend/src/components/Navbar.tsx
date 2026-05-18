"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navLinks = [
  { href: "/articles", label: "文章" },
  { href: "/about", label: "关于我" },
  { href: "/sites", label: "Links" },
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

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  return (
    <nav
      className={`flex items-center justify-between px-6 py-4 transition-all duration-300 ${
        scrolled
          ? "bg-white/70 backdrop-blur-2xl saturate-180 shadow-sm border-b border-black/5"
          : "bg-white/50 backdrop-blur-2xl saturate-180 border-b border-black/5"
      }`}
    >
      <Link href="/" className="flex items-center gap-2.5">
        <img
          src="/images/avatar_without_background.png"
          alt="头像"
          className="h-7 w-7 rounded-full object-cover"
        />
        <span className="text-sm font-semibold tracking-wider transition text-[var(--text-primary)]">
          空白棱的小站
        </span>
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
                  ? "bg-black/8 text-[var(--text-primary)] font-medium"
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
        <span className={`block h-0.5 w-5 rounded-full transition-all duration-300 bg-[var(--text-primary)] ${menuOpen ? "rotate-45 translate-y-2" : ""}`} />
        <span className={`block h-0.5 w-5 rounded-full transition-all duration-300 bg-[var(--text-primary)] ${menuOpen ? "opacity-0" : ""}`} />
        <span className={`block h-0.5 w-5 rounded-full transition-all duration-300 bg-[var(--text-primary)] ${menuOpen ? "-rotate-45 -translate-y-2" : ""}`} />
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
