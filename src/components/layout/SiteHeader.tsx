"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/common/Button";
import { navigation, site } from "@/lib/site";

/**
 * One mode, solid, everywhere — including the homepage. This used to have a
 * second "overlay" mode for the homepage only: transparent, white text,
 * sitting directly on the hero shader so the shader showed through. It
 * depended on that shader (a WebGL canvas, animated via GSAP ScrollTrigger)
 * rendering correctly to stay legible at all.
 *
 * On iOS Safari that combination broke in a way no scroll-based workaround
 * could fully fix: Safari collapses its own address bar on the first scroll
 * gesture, which fires a page `scroll` event before any *user* scrolling has
 * happened — a "solid once scrolled" rule looked instantly reliable in every
 * manual test (any touch immediately collapsed the bar and flipped the
 * header solid) but left a real gap at initial paint, exactly where a first
 * visitor lands. There is no reliable client-side signal that arrives before
 * that. Simplest fix: never transparent, so there is nothing to depend on.
 */
export function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));

  const shell = "sticky top-0 z-50 border-b border-surface-border/70 bg-surface/90 backdrop-blur";

  const linkTone = (active: boolean) =>
    active
      ? "bg-brand-100 text-brand-500"
      : "text-text-secondary hover:bg-surface-muted hover:text-text";

  return (
    <header className={shell}>
      <div className="container-site flex h-24 items-center justify-between gap-6">
        <Link href="/" className="flex items-center gap-3" onClick={() => setMenuOpen(false)}>
          <Image
            src="/images/logo-mark.png"
            alt=""
            width={44}
            height={44}
            className="h-11 w-auto"
            priority
          />
          <span className="text-base font-bold uppercase leading-tight tracking-wider text-text">
            Microsoft Fabric
            <span className="block text-brand-500">
              Belgium
            </span>
          </span>
        </Link>

        <nav aria-label="Main" className="hidden items-center gap-1 md:flex">
          {navigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isActive(item.href) ? "page" : undefined}
              className={`rounded-full px-5 py-2.5 text-sm font-semibold uppercase tracking-wider transition-colors ${linkTone(
                isActive(item.href),
              )}`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden md:block">
          <Button href="/events" size="lg" variant="default">
            Join us
          </Button>
        </div>

        <button
          type="button"
          className="-mr-2 inline-flex h-11 w-11 items-center justify-center rounded-full text-text md:hidden"
          aria-expanded={menuOpen}
          aria-controls="mobile-nav"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          onClick={() => setMenuOpen((open) => !open)}
        >
          <span aria-hidden="true" className="text-3xl leading-none">
            {menuOpen ? "×" : "≡"}
          </span>
        </button>
      </div>

      {menuOpen && (
        <div id="mobile-nav" className="border-t border-surface-border bg-surface md:hidden">
          <nav aria-label="Main" className="container-site flex flex-col py-4">
            {navigation.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                aria-current={isActive(item.href) ? "page" : undefined}
                onClick={() => setMenuOpen(false)}
                className={`border-b border-surface-border/60 py-3.5 text-base font-semibold uppercase tracking-wider text-text last:border-0 ${
                  isActive(item.href) ? "text-brand-500" : ""
                }`}
              >
                {item.label}
              </Link>
            ))}
            <a
              href={`mailto:${site.email}`}
              className="py-3.5 text-base font-semibold uppercase tracking-wider text-text-secondary"
            >
              {site.email}
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}
