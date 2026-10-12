"use client";

import React, { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { FLOW_RELAYOUT_EVENT } from "@/components/ui/flow-relayout";

gsap.registerPlugin(ScrollTrigger);

function cx(...parts: Array<string | undefined | false | null>): string {
  return parts.filter(Boolean).join(" ");
}

export interface FlowSectionProps {
  className?: string;
  style?: React.CSSProperties;
  children: React.ReactNode;
  "aria-label"?: string;
  /** Ground this panel gives the floating SiteHeader: "dark" turns its text white. */
  headerTone: "dark" | "light";
}

export const FlowSection: React.FC<FlowSectionProps> = ({
  className,
  style = {},
  children,
  "aria-label": ariaLabel,
  headerTone,
}) => (
  <section
    data-flow-section
    data-header-tone={headerTone}
    aria-label={ariaLabel}
    // 100svh, not the snippet's min-h-screen: on mobile `vh` is the *largest*
    // viewport, so with the browser chrome showing, every panel would be taller
    // than the screen and the pinned stack would drift.
    className={cx("relative min-h-[100svh] w-full overflow-hidden", className)}
  >
    <div
      data-flow-inner
      className={cx(
        // The extra 6rem of top padding clears SiteHeader (fixed, h-24), which
        // floats transparently over every panel.
        "flow-art-container relative flex min-h-[100svh] w-full flex-col justify-between gap-6 px-[6vw] pb-[6vw] pt-[calc(6rem+clamp(2rem,8vw,4vw))]",
        "will-change-transform",
      )}
      style={{ transformOrigin: "bottom left", ...style }}
    >
      {children}
    </div>
  </section>
);

export interface FlowArtProps {
  children: React.ReactNode;
  className?: string;
  "aria-label"?: string;
}

const childCount = (children: React.ReactNode) => React.Children.count(children);

/**
 * Scroll narrative: each panel is pinned as the next one swings up from 30°
 * around its bottom-left corner, so the sections stack rather than scroll past
 * one another.
 *
 * One deviation from the snippet: the root element is a <div>, not <main>.
 * The page that uses this already owns the document's <main>, and nesting a
 * second one is invalid — the story is a stretch *within* the page, not the
 * whole page.
 *
 * Honours prefers-reduced-motion by skipping the pinning and rotation
 * entirely, which leaves the panels as an ordinary vertical stack.
 */
const FlowArt: React.FC<FlowArtProps> = ({
  children,
  className,
  "aria-label": ariaLabel = "Story scroll",
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReducedMotion(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  useGSAP(
    () => {
      if (!containerRef.current || reducedMotion) return;

      const sections = Array.from(
        containerRef.current.querySelectorAll<HTMLElement>("[data-flow-section]"),
      );
      if (sections.length === 0) return;

      const triggers: ScrollTrigger[] = [];
      const pins = new Map<HTMLElement, ScrollTrigger>();

      sections.forEach((section, i) => {
        gsap.set(section, { zIndex: i + 1 });

        const inner = section.querySelector<HTMLElement>(".flow-art-container");
        if (!inner) return;

        if (i > 0) {
          gsap.set(inner, { rotation: 30, transformOrigin: "bottom left" });
          const tween = gsap.to(inner, {
            rotation: 0,
            ease: "none",
            scrollTrigger: {
              trigger: section,
              start: "top bottom",
              end: "top 25%",
              scrub: true,
            },
          });
          if (tween.scrollTrigger) triggers.push(tween.scrollTrigger);
        }

        if (i < sections.length - 1) {
          const pin = ScrollTrigger.create({
            trigger: section,
            start: "bottom bottom",
            end: "bottom top",
            pin: true,
            pinSpacing: false,
          });
          triggers.push(pin);
          pins.set(section, pin);
        }
      });

      // A pin locks its section to the height it measured, inline, and the
      // section is overflow-hidden. GSAP then measures that locked height again
      // on every later refresh, so a panel could never grow: an event row
      // expanded on the homepage card was cut off with no way to scroll to it.
      // Dropping the lock before each refresh lets GSAP see the content.
      const unlockHeights = () => {
        pins.forEach((_, section) => {
          section.style.removeProperty("height");
          section.style.removeProperty("max-height");
        });
      };
      ScrollTrigger.addEventListener("refreshInit", unlockHeights);

      ScrollTrigger.refresh();

      // See requestFlowRelayout. Runs before paint, so the panel never shows a
      // frame at its old height (on collapse, that frame flashed the panel
      // underneath through the space the content had left).
      const relayout = (event: Event) => {
        const section = (event.target as Element).closest<HTMLElement>("[data-flow-section]");
        const pin = section && pins.get(section);
        // The last panel is not pinned, so it grows like any page content.
        if (!section || !pin) return;

        // Refresh moves the pin start, so the same scroll offset would show the
        // panel somewhere else. Keep it where the visitor is looking: pins
        // start at "bottom bottom", which puts the in-flow top at
        // `start + innerHeight - height`. Capped at the pin start, because past
        // it the next panel is already sliding over this one.
        const top = section.getBoundingClientRect().top;
        ScrollTrigger.refresh();
        const inFlowTop = pin.start + window.innerHeight - section.offsetHeight;
        const target = Math.min(inFlowTop - top, pin.start);
        if (Math.abs(target - window.scrollY) > 1) {
          window.scrollTo({ top: target, behavior: "instant" });
          ScrollTrigger.update();
        }
      };
      const container = containerRef.current;
      container.addEventListener(FLOW_RELAYOUT_EVENT, relayout);

      return () => {
        container.removeEventListener(FLOW_RELAYOUT_EVENT, relayout);
        ScrollTrigger.removeEventListener("refreshInit", unlockHeights);
        triggers.forEach((t) => t.kill());
      };
    },
    { scope: containerRef, dependencies: [childCount(children), reducedMotion] },
  );

  return (
    <div
      ref={containerRef}
      role="region"
      aria-label={ariaLabel}
      className={cx("w-full overflow-x-hidden", className)}
    >
      {children}
    </div>
  );
};

export default FlowArt;
