"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { GooeyButton } from "@/components/ui/gooey-button";
import { navigation, site } from "@/lib/site";

/**
 * Two modes, from the 1.txt demo's header:
 *
 * - **overlay** (homepage): transparent, sitting inside the hero shader panel,
 *   pill-shaped nav links that fill on hover, white text.
 * - **solid** (every other page): the same layout on the cream surface, since
 *   those pages have no shader to sit on.
 *
 * The demo put its header inside the shader container. Here it stays in the
 * root layout and positions itself absolutely instead, so one component keeps
 * serving every route.
 */
export function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();
  const isOverlay = pathname === "/";

  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));

  const shell = isOverlay
    ? "absolute inset-x-0 top-0 z-50 bg-transparent"
    : "sticky top-0 z-50 border-b border-surface-border/70 bg-surface/90 backdrop-blur";

  const wordmark = isOverlay ? "text-text-inverse" : "text-text";

  const linkTone = (active: boolean) => {
    if (isOverlay) {
      return active
        ? "bg-text-inverse/15 text-text-inverse"
        : "text-text-inverse/75 hover:bg-text-inverse/10 hover:text-text-inverse";
    }
    return active
      ? "bg-brand-100 text-brand-800"
      : "text-text-secondary hover:bg-surface-muted hover:text-text";
  };

  return (
    <header className={shell}>
      <div className="container-site flex h-20 items-center justify-between gap-6">
        <Link href="/" className="flex items-center gap-3" onClick={() => setMenuOpen(false)}>
          <Image
            src="/images/logo-mark.png"
            alt=""
            width={36}
            height={36}
            className="h-9 w-auto"
            priority
          />
          <span className={`text-sm font-bold uppercase leading-tight tracking-wider ${wordmark}`}>
            Microsoft Fabric
            <span className={`block ${isOverlay ? "text-brand-400" : "text-brand-600"}`}>
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
              className={`rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-wider transition-colors ${linkTone(
                isActive(item.href),
              )}`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden md:block">
          <GooeyButton href="/events" tone={isOverlay ? "dark" : "light"}>
            Join us
          </GooeyButton>
        </div>

        <button
          type="button"
          className={`-mr-2 inline-flex h-10 w-10 items-center justify-center rounded-full md:hidden ${
            isOverlay ? "text-text-inverse" : "text-text"
          }`}
          aria-expanded={menuOpen}
          aria-controls="mobile-nav"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          onClick={() => setMenuOpen((open) => !open)}
        >
          <span aria-hidden="true" className="text-2xl leading-none">
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
                className={`border-b py-3 text-sm font-semibold uppercase tracking-wider last:border-0 ${
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
              className={`py-3 text-sm font-semibold uppercase tracking-wider ${
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
