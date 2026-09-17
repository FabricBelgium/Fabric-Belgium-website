"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/common/Button";
import { navigation, site } from "@/lib/site";

type Tone = "dark" | "light";

/** Vertical centre of the h-24 header bar, in px. */
const HEADER_MID_Y = 48;

/**
 * Tone of whatever is painted behind the header right now: the nearest
 * `data-header-tone` ancestor of the topmost element at the header's centre.
 * Hit-testing rather than comparing scroll offsets, because the homepage
 * panels are pinned, stacked by z-index and rotated while they swing in —
 * `elementsFromPoint` already resolves all of that the way the eye does.
 */
function toneBehindHeader(fallback: Tone): Tone {
  const stack = document.elementsFromPoint(window.innerWidth / 2, HEADER_MID_Y);
  for (const el of stack) {
    if (el.closest("header")) continue;
    const marked = el.closest<HTMLElement>("[data-header-tone]");
    if (marked) return marked.dataset.headerTone as Tone;
  }
  return fallback;
}

/**
 * A fully transparent bar, fixed to the top of the viewport, so the menu
 * floats over the page instead of sitting on a strip of its own.
 *
 * With no background of its own, legibility comes from its text colour: white
 * over a dark surface, near-black over a cream one, read from the section
 * behind it (sections opt in with `data-header-tone`). This deliberately does
 * NOT key off "has the page scrolled": on iOS Safari the address bar collapses
 * on the first touch and fires a `scroll` event before any real scrolling, so
 * scroll-based rules looked right in testing but were wrong at initial paint.
 * The initial tone instead comes from the route — the homepage opens on the
 * dark shader panel — and the hit-test only refines it.
 */
export function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();
  const isHome = pathname === "/";
  const initialTone: Tone = isHome ? "dark" : "light";
  const [tone, setTone] = useState<Tone>(initialTone);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => setTone(toneBehindHeader(initialTone)));
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [initialTone]);

  const onDark = tone === "dark";
  const isActive = (href: string) => (href === "/" ? isHome : pathname.startsWith(href));

  const linkTone = (active: boolean) =>
    active
      ? "bg-brand-100 text-brand-500"
      : onDark
        ? "text-text-inverse/80 hover:bg-text-inverse/10 hover:text-text-inverse"
        : "text-text-secondary hover:bg-surface-muted hover:text-text";

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50 bg-transparent">
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
            <span
              className={`text-base font-bold uppercase leading-tight tracking-wider transition-colors ${
                onDark ? "text-text-inverse" : "text-text"
              }`}
            >
              Microsoft Fabric
              <span className="block text-brand-500">Belgium</span>
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
            <Button href="/events" size="lg" variant={onDark ? "inverse" : "default"}>
              Join us
            </Button>
          </div>

          <button
            type="button"
            className={`-mr-2 inline-flex h-11 w-11 items-center justify-center rounded-full transition-colors md:hidden ${
              onDark ? "text-text-inverse" : "text-text"
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

      {/* A fixed header takes no space. The homepage panels run full-bleed
          underneath it on purpose; every other page starts below it. */}
      {!isHome && <div aria-hidden="true" className="h-24" />}
    </>
  );
}
