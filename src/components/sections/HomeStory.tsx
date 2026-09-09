import Image from "next/image";
import { Button } from "@/components/common/Button";
import { UpcomingEventsList } from "@/components/events/UpcomingEventsList";
import { ContactForm } from "@/components/forms/ContactForm";
import { PartnerLogoGrid } from "@/components/partners/PartnerLogoGrid";
import { ShaderBackground } from "@/components/ui/hero-shader";
import FlowArt, { FlowSection } from "@/components/ui/story-scroll";
import type { FabricEvent } from "@/lib/content/events";
import type { Partner } from "@/lib/content/partners";
import { formatEventDate } from "@/lib/format";
import { site } from "@/lib/site";

// text-[color:inherit] is load-bearing: globals.css sets `text-text` on every
// h1–h6 in the base layer, which would otherwise paint these headings
// near-black on the dark panels.
// Scale deliberately below the snippet's clamp(3.5rem,12vw,14rem): a three-line
// headline at that size costs ~330px, and panels 1–4 are pinned, so every pixel
// over the viewport is content nobody can scroll to.
const HEADLINE =
  "text-[clamp(2.25rem,7vw,7.5rem)] font-bold uppercase leading-[0.85] tracking-tight text-[color:inherit]";
// The landing title carries the whole first screen, so it runs heavier and
// larger than the panel headings: one weight, one case, no serif accent.
const LANDING_HEADLINE =
  "text-[clamp(3rem,9.5vw,10rem)] font-extrabold uppercase leading-[0.82] tracking-[-0.02em] text-[color:inherit]";
const LEAD =
  "max-w-[46ch] text-[clamp(0.95rem,1.8vw,1.5rem)] font-light normal-case leading-relaxed tracking-normal";
// The panel numbering stays on the panel's own text colour — white on the
// dark cards, near-black on the cream ones. It is deliberately the one label
// that is never accented, so the green reads as emphasis on content rather
// than as chrome. (Literal white here would be invisible on the cream cards.)
const KICKER = "text-xs font-bold uppercase tracking-[0.2em]";

/**
 * Brand-green accents. Pinned to the literal #3CC789 (brand-500) everywhere
 * per brand guidance, including on the cream panels where it only reaches a
 * 2.08:1 contrast ratio against the background (below the 3:1 bar for large
 * text) — a known legibility tradeoff, accepted deliberately.
 */
const ACCENT_ON_LIGHT_DISPLAY = "text-brand-500";
const ACCENT_ON_LIGHT_LABEL = "text-brand-500";
const ACCENT_ON_DARK = "text-brand-500";
// Fluid rather than a fixed text-xs/0.95rem cap: on a wide monitor the tracks
// were the one part of the Winterfest panel that stopped scaling with it.
const COL_TITLE =
  "mb-2 text-[clamp(0.8rem,1.05vw,1.05rem)] font-bold uppercase tracking-wider";
const COL_BODY =
  "text-[clamp(0.9rem,1.35vw,1.2rem)] normal-case leading-relaxed tracking-normal opacity-75";

function Rule({ tone }: { tone: "dark" | "light" }) {
  return (
    <hr
      className={`my-[1vw] border-none border-t ${
        tone === "dark" ? "border-black/30" : "border-white/30"
      }`}
    />
  );
}

interface HomeStoryProps {
  /** Every scheduled event, soonest first. */
  upcoming: FabricEvent[];
  partners: Partner[];
}

/**
 * How many events the card lists before deferring to /events. Capped because
 * panel 02 is pinned: a longer list would be clipped, not scrollable.
 */
const MAX_UPCOMING_ON_CARD = 4;

/**
 * The whole homepage as one pinned, stacking scroll: five full-screen panels
 * that swing in from 30° (see ui/story-scroll.tsx).
 *
 * Every panel has to *fit* a viewport. Panels 1–4 are pinned, and a pinned
 * section is clipped at viewport height — anything below that fold inside one
 * of them is unreachable, not merely off-screen. That constraint is why the
 * event archive is not here: it lives on /events, linked from panel 02.
 * Contact is deliberately last, because the final panel is the only one the
 * component leaves unpinned and so the only one free to grow.
 */
export function HomeStory({ upcoming, partners }: HomeStoryProps) {
  const shownUpcoming = upcoming.slice(0, MAX_UPCOMING_ON_CARD);
  const moreUpcoming = upcoming.length - shownUpcoming.length;

  return (
    <FlowArt aria-label="Fabric Belgium">
      {/* 01 — Landing */}
      <FlowSection
        aria-label="Fabric Belgium"
        style={{ backgroundColor: "#1D1C1C", color: "#FCFAFA" }}
      >
        {/* Wrapped rather than given `absolute` via className: ShaderBackground's
            own root is `relative`, and two position utilities of equal
            specificity would resolve by generated CSS order. */}
        <div className="absolute inset-0 -z-10">
          <ShaderBackground minHeight="100%" />
        </div>

        <p className={KICKER}>01 / Welcome to Fabric Belgium</p>
        <Rule tone="light" />

        {/* One flex child, not four: the panel's inner container is
            `justify-between`, so every extra child here becomes another gap
            the headline and the lead get pushed apart by. `my-auto` then
            splits the panel's leftover height evenly above and below. */}
        <div className="my-auto">
          <h1 className={LANDING_HEADLINE}>
            Fabric
            <br />
            Belgium
          </h1>

          <Rule tone="light" />

          <p className={LEAD}>
            Empower every data professional with a community. Grow your Microsoft Fabric expertise
            from peers, at free meetups across the country.
          </p>
          <div className="mt-[2vw] flex flex-wrap gap-3">
            <Button href="/events" variant="inverse">
              Events
            </Button>
            <Button href="/partnerships" variant="inverse">
              Partnerships
            </Button>
            <Button href="/contact" variant="inverse">
              Contact
            </Button>
          </div>
        </div>
      </FlowSection>

      {/* 02 — Events */}
      <FlowSection aria-label="Events" style={{ backgroundColor: "#FCFAFA", color: "#1D1C1C" }}>
        <p className={KICKER}>02 / Events</p>
        <Rule tone="dark" />

        {/* Same two-column shape as the partners card: the list is the tallest
            thing here, so running it beside the headline rather than beneath
            it is what keeps a pinned panel inside the viewport. */}
        <div className="flex flex-1 flex-wrap items-center gap-[4vw]">
          <div className="min-w-[280px] flex-1">
            <h2 className={HEADLINE}>
              Join
              <br />
              <span className={ACCENT_ON_LIGHT_DISPLAY}>Us</span>
              <br />
              Next
            </h2>
            <p className={`mt-[2vw] ${LEAD}`}>
              {upcoming.length > 0
                ? "This is where the Belgian Fabric community actually meets. Evening sessions through the year, and one very long day in December."
                : "The next meetup is being scheduled. Everything so far is on the events page."}
            </p>
            <div className="mt-[2vw] flex flex-wrap gap-3">
              <Button href="/events">All events &amp; archive</Button>
            </div>
          </div>

          {upcoming.length > 0 && (
            <div className="min-w-[300px] flex-1">
              <div className="mb-[2vw] overflow-hidden rounded-xl">
                <Image
                  src="/images/events/meetup-crowd.jpg"
                  alt="Attendees at a Fabric Belgium meetup, watching a speaker present"
                  width={1600}
                  height={739}
                  sizes="(min-width: 768px) 40vw, 90vw"
                  className="h-auto w-full object-cover"
                />
              </div>
              <UpcomingEventsList events={shownUpcoming} />
              {moreUpcoming > 0 && (
                <p className="mt-3 text-sm normal-case tracking-normal opacity-60">
                  + {moreUpcoming} more on the events page
                </p>
              )}
            </div>
          )}
        </div>
      </FlowSection>

      {/* 03 — Flagship */}
      <FlowSection
        aria-label="Fabric Winterfest"
        style={{ backgroundColor: "#1D1C1C", color: "#FCFAFA" }}
      >
        <p className={KICKER}>03 / Fabric Winterfest</p>
        <Rule tone="light" />

        {/* Same two-column shape as the events and partners cards: the photo
            runs beside the copy rather than beneath it, so it adds width
            instead of height inside this pinned panel. */}
        <div className="flex flex-1 flex-wrap items-center gap-[4vw]">
          <div className="min-w-[280px] flex-1">
            <h2 className={HEADLINE}>
              One
              <br />
              <span className={ACCENT_ON_DARK}>Big</span>
              <br />
              Day
            </h2>

            <Rule tone="light" />

            <p className={LEAD}>
              Friday 4 December 2026 at SnowWorld Antwerpen. A full day of Microsoft Fabric across
              three tracks, organised by the same people behind these meetups.
            </p>

            <div className="mt-[2vw] flex flex-wrap gap-[3vw]">
              <div className="min-w-[140px] flex-1">
                <p className={`${COL_TITLE} ${ACCENT_ON_DARK}`}>Training Bar</p>
                <p className={COL_BODY}>Hands-on, laptop-open sessions.</p>
              </div>
              <div className="min-w-[140px] flex-1">
                <p className={`${COL_TITLE} ${ACCENT_ON_DARK}`}>Blue Slope</p>
                <p className={COL_BODY}>Get going with Fabric and find your footing.</p>
              </div>
              <div className="min-w-[140px] flex-1">
                <p className={`${COL_TITLE} ${ACCENT_ON_DARK}`}>Black Slope</p>
                <p className={COL_BODY}>The steep stuff, for people already deep in it.</p>
              </div>
            </div>

            <div className="mt-[2vw]">
              <Button href={site.winterfestUrl} variant="inverse" size="lg">
                Visit Winterfest
              </Button>
            </div>
          </div>

          <div className="min-w-[280px] flex-1">
            <div className="overflow-hidden rounded-xl">
              <Image
                src="/images/winterfest/winterfest-2025.jpg"
                alt="A speaker presenting Power BI dashboards at Fabric Winterfest, held at SnowWorld Antwerpen"
                width={1400}
                height={1050}
                sizes="(min-width: 768px) 40vw, 90vw"
                className="h-auto w-full object-cover"
              />
            </div>
          </div>
        </div>
      </FlowSection>

      {/* 04 — Partners */}
      <FlowSection aria-label="Partners" style={{ backgroundColor: "#155537", color: "#FCFAFA" }}>
        <p className={KICKER}>04 / Partners</p>
        <Rule tone="light" />

        {/* Two columns: the pitch on the left, every partner on the right. The
            wall is the tallest thing in this pinned panel, so running it
            alongside the copy rather than beneath it is what keeps all 21
            logos inside the viewport. */}
        <div className="flex flex-1 flex-wrap items-center gap-[4vw]">
          <div className="min-w-[280px] flex-1">
            <h2 className={HEADLINE}>
              Our
              <br />
              Proud
              <br />
              Partners
            </h2>
            <p className={`mt-[2vw] ${LEAD}`}>
              These companies believe in our community and help us bring people together to
              learn, connect, and grow.
            </p>
            <div className="mt-[2vw]">
              <Button href="/partnerships" variant="inverse" size="lg">
                Partner with us
              </Button>
            </div>
          </div>

          <div className="min-w-[300px] flex-1">
            <PartnerLogoGrid partners={partners} columns={3} />
          </div>
        </div>
      </FlowSection>

      {/* 05 — Contact. Last panel: the one FlowArt leaves unpinned, so it is
          the only one free to be taller than the viewport. */}
      <FlowSection aria-label="Contact" style={{ backgroundColor: "#FCFAFA", color: "#1D1C1C" }}>
        <p className={KICKER}>05 / Contact</p>
        <Rule tone="dark" />

        <div className="flex flex-wrap items-start gap-[4vw]">
          <div className="min-w-[280px] flex-1">
            <h2 className={HEADLINE}>
              Say
              <br />
              <span className={ACCENT_ON_LIGHT_DISPLAY}>Hello</span>
            </h2>
            <p className={`mt-[2vw] ${LEAD}`}>
              Questions about an event, an idea for a session, or interested in partnering? This
              reaches the whole organising team.
            </p>
          </div>

          <div className="min-w-[300px] flex-1">
            <ContactForm />
          </div>
        </div>
      </FlowSection>
    </FlowArt>
  );
}
