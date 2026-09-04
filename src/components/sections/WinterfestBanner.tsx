import { Button } from "@/components/common/Button";
import { EdgeFade } from "@/components/common/EdgeFade";
import { SectionContainer } from "@/components/common/SectionContainer";
import { Tag } from "@/components/common/Tag";
import AnimatedGradientBackground from "@/components/ui/animated-gradient-background";
import { site } from "@/lib/site";

// Hoisted so the arrays keep a stable identity across renders — they are
// effect dependencies inside AnimatedGradientBackground.
const WINTERFEST_COLORS = [
  "#1D1C1C", // surface.ink
  "#0C3521", // brand-950
  "#155537", // brand-900
  "#1E704A", // brand-800
  "#268F5F", // brand-700
  "#2FAE73", // brand-600
  "#3CC789", // brand-500
];
const WINTERFEST_STOPS = [35, 50, 60, 70, 80, 90, 100];

/**
 * Fabric Winterfest, the community's flagship annual event. Built on the 2.txt
 * demo's structure — a full-bleed band owned by the gradient, content centred
 * over it — rather than the boxed card it started as. It currently lives on
 * its own domain; if it ever moves into this repo, only `href` changes.
 *
 * `startingGap` is well below the demo's 125: that value assumes a full-screen
 * container, and on a band this short it pushes the entire colour ramp below
 * the visible area, leaving near-black with a lopsided green fringe.
 */
export function WinterfestBanner() {
  return (
    <SectionContainer className="relative isolate overflow-hidden bg-surface-ink">
      <AnimatedGradientBackground
        Breathing
        startingGap={70}
        breathingRange={7}
        gradientColors={WINTERFEST_COLORS}
        gradientStops={WINTERFEST_STOPS}
        containerClassName="pointer-events-none -z-10"
      />

      <EdgeFade edge="top" />
      <EdgeFade edge="bottom" />

      <div className="relative z-10 mx-auto max-w-2xl text-center">
        <Tag tone="inverse">Flagship event</Tag>
        <h2 className="mt-5 text-3xl text-text-inverse md:text-4xl">
          Fabric{" "}
          <span className="font-display font-normal normal-case italic tracking-normal">
            Winterfest
          </span>
        </h2>
        <p className="mt-4 text-sm font-light normal-case leading-relaxed tracking-normal text-text-inverse/70">
          A full day of Microsoft Fabric sessions, hands-on content and community, organised by the
          same people behind these meetups.
        </p>
        <div className="mt-8">
          <Button href={site.winterfestUrl} variant="inverse" size="lg">
            Visit Winterfest
          </Button>
        </div>
      </div>
    </SectionContainer>
  );
}
