import { Button } from "@/components/common/Button";
import { EdgeFade } from "@/components/common/EdgeFade";
import { SectionContainer } from "@/components/common/SectionContainer";
import AnimatedGradientBackground from "@/components/ui/animated-gradient-background";

// Hoisted so the arrays keep a stable identity across renders — they are
// effect dependencies inside AnimatedGradientBackground.
const CTA_COLORS = [
  "#1D1C1C", // surface.ink
  "#0C3521", // brand-950
  "#155537", // brand-900
  "#1E704A", // brand-800
  "#268F5F", // brand-700
];
const CTA_STOPS = [40, 60, 75, 88, 100];

interface CTASectionProps {
  heading: string;
  description?: string;
  ctaText: string;
  ctaHref: string;
  secondaryCtaText?: string;
  secondaryCtaHref?: string;
  /** "brand" = flat green band, "dark" = near-black band with the gradient wash */
  theme?: "brand" | "dark";
}

export function CTASection({
  heading,
  description,
  ctaText,
  ctaHref,
  secondaryCtaText,
  secondaryCtaHref,
  theme = "brand",
}: CTASectionProps) {
  const isDark = theme === "dark";

  return (
    <SectionContainer
      className={isDark ? "relative isolate overflow-hidden bg-surface-ink" : "bg-brand-500"}
    >
      {/*
        Static (non-breathing) on purpose: the hero shader already animates
        above the fold, and a second permanent animation competes with it.
      */}
      {isDark && (
        <>
          <AnimatedGradientBackground
            startingGap={80}
            gradientColors={CTA_COLORS}
            gradientStops={CTA_STOPS}
            containerClassName="pointer-events-none -z-10"
          />
          <EdgeFade edge="top" />
          <EdgeFade edge="bottom" />
        </>
      )}

      <div className="relative z-10 mx-auto max-w-2xl text-center">
        <h2 className={`text-3xl md:text-4xl ${isDark ? "text-text-inverse" : "text-text"}`}>
          {heading}
        </h2>
        {description && (
          <p
            className={`mt-4 text-lg normal-case leading-relaxed tracking-normal ${
              isDark ? "text-text-inverse/75" : "text-text/80"
            }`}
          >
            {description}
          </p>
        )}
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <Button href={ctaHref} size="lg" variant={isDark ? "inverse" : "default"}>
            {ctaText}
          </Button>
          {secondaryCtaText && secondaryCtaHref && (
            <Button href={secondaryCtaHref} size="lg" variant={isDark ? "inverse" : "default"}>
              {secondaryCtaText}
            </Button>
          )}
        </div>
      </div>
    </SectionContainer>
  );
}
