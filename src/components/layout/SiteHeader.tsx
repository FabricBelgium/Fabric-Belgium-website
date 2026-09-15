"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/common/Button";
import { navigation, site } from "@/lib/site";

/**
 * Two modes, from the 1.txt demo's header:
 *
 * - **overlay** (homepage, unscrolled): transparent, sitting on the hero
 *   shader panel, pill-shaped nav links that fill on hover, white text.
 * - **solid** (every other page, and the homepage as soon as it scrolls):
 *   the same layout on the cream surface.
 *
 * The homepage variant is `position: fixed` rather than the document-flow
 * `absolute` it used to be, and flips to solid the moment `scrollY > 0`.
 * Previously it stayed `absolute` and transparent for the entire pinned
 * scroll story below it, which depends on the shader/GSAP pin rendering
 * correctly underneath to stay legible — on iOS Safari that combination
 * (WebGL canvas + scroll-linked pin) can fail silently, leaving white text
 * on the plain white page background with no fixed anchor, i.e. an
 * invisible menu that scrolls away instead of staying put. Fixed position +
 * solid-on-scroll makes the header legible and reachable regardless of
 * whether the hero animation itself renders.
 */
export function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const isHome = pathname === "/";
  const isOverlay = isHome && !scrolled;

  useEffect(() => {
    if (!isHome) return;

    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [isHome]);

  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));

  const shell = isHome
    ? `fixed inset-x-0 top-0 z-50 transition-colors ${
        isOverlay
          ? "bg-transparent"
          : "border-b border-surface-border/70 bg-surface/90 backdrop-blur"
      }`
    : "sticky top-0 z-50 border-b border-surface-border/70 bg-surface/90 backdrop-blur";

  const wordmark = isOverlay ? "text-text-inverse" : "text-text";

  const linkTone = (active: boolean) => {
    if (isOverlay) {
      return active
        ? "bg-text-inverse/15 text-text-inverse"
        : "text-text-inverse/75 hover:bg-text-inverse/10 hover:text-text-inverse";
    }
    return active
      ? "bg-brand-100 text-brand-500"
      : "text-text-secondary hover:bg-surface-muted hover:text-text";
  };

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
          <span className={`text-base font-bold uppercase leading-tight tracking-wider ${wordmark}`}>
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
          <Button href="/events" size="lg" variant={isOverlay ? "inverse" : "default"}>
            Join us
          </Button>
        </div>

        <button
          type="button"
          className={`-mr-2 inline-flex h-11 w-11 items-center justify-center rounded-full md:hidden ${
            isOverlay ? "text-text-inverse" : "text-text"
          }`}
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
        <div
          id="mobile-nav"
          className={`md:hidden ${
            isOverlay
              ? "border-t border-text-inverse/10 bg-surface-ink/95 backdrop-blur"
              : "border-t border-surface-border bg-surface"
          }`}
        >
          <nav aria-label="Main" className="container-site flex flex-col py-4">
            {navigation.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                aria-current={isActive(item.href) ? "page" : undefined}
                onClick={() => setMenuOpen(false)}
                className={`border-b py-3.5 text-base font-semibold uppercase tracking-wider last:border-0 ${
                  isOverlay
                    ? "border-text-inverse/10 text-text-inverse"
                    : "border-surface-border/60 text-text"
                } ${isActive(item.href) ? "text-brand-500" : ""}`}
              >
                {item.label}
              </Link>
            ))}
            <a
              href={`mailto:${site.email}`}
              className={`py-3.5 text-base font-semibold uppercase tracking-wider ${
                isOverlay ? "text-text-inverse/70" : "text-text-secondary"
              }`}
            >
              {site.email}
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}
