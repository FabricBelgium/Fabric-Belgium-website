"use client";

import { useState } from "react";
import { flushSync } from "react-dom";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Button } from "@/components/common/Button";
import type { FabricEvent } from "@/lib/content/events";
import { formatEventDate } from "@/lib/format";

interface UpcomingEventsListProps {
  events: FabricEvent[];
  /** Colour for the date line — stepped to the panel it sits on. */
  accentClassName?: string;
}

function hasDetail(event: FabricEvent): boolean {
  return Boolean(
    event.content ||
    event.agenda.length ||
    event.speakers.length ||
    event.venue?.address ||
    event.registerUrl ||
    event.host,
  );
}

/**
 * The upcoming events on the homepage card, each row expandable for the
 * detail that does not belong in a one-line summary.
 *
 * This list lives inside a pinned GSAP panel, which is clipped at the height
 * ScrollTrigger measured. Opening a row makes the panel taller after that
 * measurement, so `toggle` re-measures — otherwise the detail past the old
 * bottom, Register button included, is clipped with no way to scroll to it.
 * Only one row opens at a time, which keeps the panel to "collapsed rows +
 * the tallest single detail block".
 */
export function UpcomingEventsList({
  events,
  accentClassName = "text-brand-500",
}: UpcomingEventsListProps) {
  const [openSlug, setOpenSlug] = useState<string | null>(null);

  if (events.length === 0) return null;

  function toggle(slug: string, row: HTMLElement) {
    const pinTrigger = ScrollTrigger.getAll().find((trigger) => trigger.pin?.contains(row));
    const startBefore = pinTrigger?.start ?? Infinity;

    // Commit the new height to the DOM first, so the refresh measures it.
    flushSync(() => setOpenSlug((current) => (current === slug ? null : slug)));
    ScrollTrigger.refresh();

    // A visitor already scrolled past the pin start has the next panel sliding
    // over this one. Moving the pin start would make the panel jump under the
    // cursor on open, or leave it half covered on close, so take them back to
    // the earlier of the two starts: the panel holds still on open and comes
    // fully back into view on close.
    if (pinTrigger) {
      const settle = Math.min(startBefore, pinTrigger.start);
      if (window.scrollY > settle) window.scrollTo(0, settle);
    }
  }

  return (
    <ul className="divide-y divide-black/10 border-y border-black/10">
      {events.map((event) => {
        const where = [event.venue?.name, event.venue?.city].filter(Boolean).join(", ");
        const when = [event.startTime, event.endTime].filter(Boolean).join(" – ");
        const isOpen = openSlug === event.slug;
        const expandable = hasDetail(event);

        const summary = (
          <>
            <span className={`block text-xs font-bold uppercase tracking-wider ${accentClassName}`}>
              {event.dateTbc
                ? `${formatEventDate(event.date, {
                    month: "long",
                    year: "numeric",
                  })} · date TBC`
                : formatEventDate(event.date, {
                    weekday: "short",
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
            </span>
            <span className="mt-1 block text-base font-bold uppercase tracking-wide">
              {event.title}
            </span>
            {(where || when) && (
              <span className="mt-0.5 block text-sm normal-case tracking-normal opacity-60">
                {[where, when].filter(Boolean).join(" · ")}
              </span>
            )}
          </>
        );

        return (
          <li key={event.slug}>
            {expandable ? (
              <button
                type="button"
                onClick={(e) => toggle(event.slug, e.currentTarget)}
                aria-expanded={isOpen}
                aria-controls={`event-${event.slug}`}
                className="flex w-full items-start justify-between gap-4 py-3 text-left transition-opacity hover:opacity-70"
              >
                <span className="min-w-0">{summary}</span>
                <span
                  aria-hidden="true"
                  className={`mt-1 shrink-0 text-lg leading-none transition-transform ${
                    isOpen ? "rotate-45" : ""
                  }`}
                >
                  +
                </span>
              </button>
            ) : (
              <div className="py-3">{summary}</div>
            )}

            {expandable && (
              <div id={`event-${event.slug}`} hidden={!isOpen} className="pb-4">
                {event.content && (
                  <p className="text-sm normal-case leading-relaxed tracking-normal opacity-75">
                    {event.content}
                  </p>
                )}

                {event.venue?.address && (
                  <p className="mt-3 text-sm normal-case tracking-normal opacity-75">
                    {[event.venue.name, event.venue.address, event.venue.city]
                      .filter(Boolean)
                      .join(", ")}
                  </p>
                )}

                {event.host && (
                  <p className="mt-1 text-sm normal-case tracking-normal opacity-60">
                    Hosted by {event.host}
                  </p>
                )}

                {/*
                  Hidden on the smallest screens to keep an expanded row short
                  there; the full agenda is on /events. (It was first hidden
                  because the pinned panel clipped what came after it — `toggle`
                  now re-measures the pin, so that is no longer the reason.)
                */}
                {event.agenda.length > 0 && (
                  <ol className="mt-3 hidden space-y-1 sm:block">
                    {event.agenda.map((item) => (
                      <li
                        key={`${item.time}-${item.title}`}
                        className="flex gap-3 text-sm normal-case tracking-normal"
                      >
                        <span className="w-12 shrink-0 font-semibold tabular-nums opacity-60">
                          {item.time}
                        </span>
                        <span>{item.title}</span>
                      </li>
                    ))}
                  </ol>
                )}

                {event.speakers.length > 0 && (
                  <ul className="mt-3 space-y-1">
                    {event.speakers.map((speaker, index) => (
                      <li
                        key={`${speaker.name}-${index}`}
                        className="text-sm normal-case tracking-normal"
                      >
                        <span className="font-semibold">{speaker.name}</span>
                        <span className="block opacity-70">{speaker.talk}</span>
                      </li>
                    ))}
                  </ul>
                )}

                {event.registerUrl && (
                  <div className="mt-4">
                    <Button href={event.registerUrl} size="sm">
                      Register
                    </Button>
                  </div>
                )}
              </div>
            )}
          </li>
        );
      })}
    </ul>
  );
}
