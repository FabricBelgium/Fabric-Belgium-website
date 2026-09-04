"use client";

import { useState } from "react";
import { SpeakerCard } from "@/components/events/SpeakerCard";
import type { FabricEvent } from "@/lib/content/events";
import { formatEventDate } from "@/lib/format";

export interface EventYear {
  year: string;
  events: FabricEvent[];
}

interface PastEventsArchiveProps {
  years: EventYear[];
  /** Years expanded on first render. The rest start collapsed. */
  openByDefault?: number;
}

/**
 * The archive back to 2022. Years collapse so the list stays scannable, and
 * every speaker row carries its slide link when one exists.
 */
export function PastEventsArchive({ years, openByDefault = 1 }: PastEventsArchiveProps) {
  const [openYears, setOpenYears] = useState<string[]>(() =>
    years.slice(0, openByDefault).map((bucket) => bucket.year),
  );

  if (years.length === 0) {
    return (
      <p className="text-sm normal-case tracking-normal text-text-secondary">
        The event archive is being migrated. Check back shortly.
      </p>
    );
  }

  const toggle = (year: string) =>
    setOpenYears((open) =>
      open.includes(year) ? open.filter((y) => y !== year) : [...open, year],
    );

  return (
    <div className="divide-y divide-surface-border border-y border-surface-border">
      {years.map(({ year, events }) => {
        const isOpen = openYears.includes(year);
        return (
          <div key={year}>
            <h3>
              <button
                type="button"
                onClick={() => toggle(year)}
                aria-expanded={isOpen}
                aria-controls={`archive-${year}`}
                className="flex w-full items-center justify-between gap-4 py-5 text-left transition-colors hover:text-brand-600"
              >
                <span className="text-xl font-bold tracking-wide">{year}</span>
                <span className="flex items-center gap-3">
                  <span className="text-xs font-medium normal-case tracking-normal text-text-muted">
                    {events.length} {events.length === 1 ? "event" : "events"}
                  </span>
                  <span
                    aria-hidden="true"
                    className={`text-lg leading-none transition-transform ${isOpen ? "rotate-45" : ""}`}
                  >
                    +
                  </span>
                </span>
              </button>
            </h3>

            <div id={`archive-${year}`} hidden={!isOpen}>
              <ul className="space-y-6 pb-8">
                {events.map((event) => (
                  <li key={event.slug} className="border-l-2 border-brand-200 pl-4">
                    <p className="text-xs font-semibold uppercase tracking-wider text-brand-700">
                      {formatEventDate(event.date, {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </p>
                    <h4 className="mt-1 text-base normal-case tracking-normal">{event.title}</h4>
                    {event.venue && (
                      <p className="text-sm normal-case tracking-normal text-text-muted">
                        {[event.venue.name, event.venue.city].filter(Boolean).join(", ")}
                      </p>
                    )}
                    {event.speakers.length > 0 && (
                      <ul className="mt-2 space-y-1">
                        {event.speakers.map((speaker, index) => (
                          <SpeakerCard key={`${speaker.name}-${index}`} speaker={speaker} compact />
                        ))}
                      </ul>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        );
      })}
    </div>
  );
}
