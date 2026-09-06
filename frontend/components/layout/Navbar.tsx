"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { NAV_LINKS } from "@/lib/constants";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [hovered, setHovered] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("#hero");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const updateActiveSection = () => {
      const sections = NAV_LINKS.map((link) => ({
        href: link.href,
        element: document.querySelector(link.href) as HTMLElement | null,
      })).filter((item) => item.element !== null);

      const offset = 140;

      let closestSection = "#hero" as (typeof NAV_LINKS)[number]["href"];
      let closestDistance = Infinity;

      sections.forEach(({ href, element }) => {
        if (!element) return;

        const top = element.getBoundingClientRect().top;
        const distance = Math.abs(top - offset);

        if (top <= offset + 100 && distance < closestDistance) {
          closestDistance = distance;
          closestSection = href;
        }
      });

      setActiveSection(closestSection);
    };

    updateActiveSection();

    window.addEventListener("scroll", updateActiveSection, {
      passive: true,
    });

    return () => {
      window.removeEventListener("scroll", updateActiveSection);
    };
  }, []);

  return (
    <header className="fixed inset-x-0 top-0 z-50 flex justify-center px-4 pt-4 sm:px-6">
      <motion.nav
        initial={{ y: -32, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className={`flex w-full max-w-6xl items-center justify-between rounded-full px-4 py-2.5 transition-all duration-500 sm:px-6 ${
          scrolled
            ? "border border-white/10 bg-ink/80 shadow-[0_18px_50px_-20px_rgba(0,0,0,0.55)] backdrop-blur-xl"
            : "border border-transparent bg-ink/40 backdrop-blur-sm"
        }`}
      >
        <Link
          href="#hero"
          className="flex items-center gap-2 pl-1 font-serif text-2xl tracking-wide text-cream"
        >
          <span className="relative flex h-2.5 w-2.5">
            <span className="absolute inset-0 animate-pulse-ring rounded-full bg-emerald-400" />
            <span className="relative h-2.5 w-2.5 rounded-full bg-emerald-400" />
          </span>
          Dharitri
        </Link>

        <ul
          className="relative hidden items-center gap-1 rounded-full lg:flex"
          onMouseLeave={() => setHovered(null)}
        >
          {NAV_LINKS.map((link) => (
            <li key={link.href} className="relative">
              <a
                href={link.href}
                onMouseEnter={() => setHovered(link.href)}
                className={`relative z-10 block rounded-full px-4 py-2 text-sm font-medium transition-colors duration-200 ${
                  activeSection === link.href
                    ? "text-white"
                    : "text-cream-muted hover:text-white"
                }`}
              >
                {(hovered === link.href || activeSection === link.href) && (
                  <motion.span
                    layoutId="nav-pill"
                    className={`absolute inset-0 -z-10 rounded-full ${
                      activeSection === link.href
                        ? "bg-emerald-600"
                        : "bg-emerald-500/80"
                    }`}
                    transition={{
                      type: "spring",
                      bounce: 0.25,
                      duration: 0.5,
                    }}
                  />
                )}
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="hidden items-center gap-3 lg:flex">
          <Link
            href="/login"
            className="group relative inline-flex items-center gap-1.5 overflow-hidden rounded-full bg-cream px-5 py-2.5 text-sm font-semibold text-ink transition-transform duration-300 hover:-translate-y-0.5"
          >
            <span className="absolute inset-0 -translate-x-full bg-linear-to-r from-emerald-200 via-emerald-400 to-amber-300 opacity-0 transition-all duration-500 group-hover:translate-x-0 group-hover:opacity-100" />
            <span className="relative z-10">Get Started</span>
            <ArrowRight className="relative z-10 h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5" />
          </Link>
        </div>

        <button
          type="button"
          aria-label="Toggle menu"
          onClick={() => setMobileOpen((v) => !v)}
          className="flex h-9 w-9 items-center justify-center rounded-full text-cream lg:hidden"
        >
          {mobileOpen ? (
            <X className="h-5 w-5" />
          ) : (
            <Menu className="h-5 w-5" />
          )}
        </button>
      </motion.nav>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.25 }}
            className="absolute inset-x-4 top-20 z-40 flex flex-col gap-1 rounded-3xl border border-white/10 bg-ink/95 p-4 backdrop-blur-xl lg:hidden"
          >
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="rounded-xl px-4 py-3 text-base font-medium text-cream-muted transition-colors hover:bg-white/5 hover:text-cream"
              >
                {link.label}
              </a>
            ))}
            <Link
              href="/login"
              onClick={() => setMobileOpen(false)}
              className="mt-2 inline-flex items-center justify-center gap-1.5 rounded-full bg-cream px-5 py-3 text-sm font-semibold text-ink"
            >
              Get Started
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
