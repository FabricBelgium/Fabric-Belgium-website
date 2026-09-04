import { Button } from "@/components/common/Button";
import { Tag } from "@/components/common/Tag";
import { EventAgenda } from "@/components/events/EventAgenda";
import { SpeakerCard } from "@/components/events/SpeakerCard";
import type { FabricEvent } from "@/lib/content/events";
import { formatEventDate } from "@/lib/format";

interface EventCardProps {
  event: FabricEvent;
}

/** The full "next event" block: date, venue, agenda, speakers, register CTA. */
export function EventCard({ event }: EventCardProps) {
  const timeRange = [event.startTime, event.endTime].filter(Boolean).join(" – ");
  const venueLine = event.venue
    ? [event.venue.name, event.venue.city].filter(Boolean).join(", ")
    : undefined;

  return (
    // No border, no shadow, no panel: the card outline was one of the seams
    // that made the page read as stacked blocks. A hairline rule and the
    // column gap carry the structure instead.
    <article className="border-t border-surface-border/60 pt-10">
      <div className="grid gap-10 md:grid-cols-[1fr_1.1fr] md:gap-16">
        <div>
          <Tag>{event.status === "upcoming" ? "Next event" : "Past event"}</Tag>

          <h3 className="mt-4 text-2xl md:text-3xl">{event.title}</h3>

          <dl className="mt-6 space-y-3 text-sm normal-case tracking-normal">
            <div className="flex gap-3">
              <dt className="w-20 shrink-0 text-text-muted">Date</dt>
              <dd className="font-semibold">{formatEventDate(event.date)}</dd>
            </div>
            {timeRange && (
              <div className="flex gap-3">
                <dt className="w-20 shrink-0 text-text-muted">Time</dt>
                <dd className="font-semibold">{timeRange}</dd>
              </div>
            )}
            {venueLine && (
              <div className="flex gap-3">
                <dt className="w-20 shrink-0 text-text-muted">Venue</dt>
                <dd className="font-semibold">
                  {event.venue?.url ? (
                    <a
                      href={event.venue.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline underline-offset-2 hover:text-brand-600"
                    >
                      {venueLine}
                    </a>
                  ) : (
                    venueLine
                  )}
                </dd>
              </div>
            )}
            {event.host && (
              <div className="flex gap-3">
                <dt className="w-20 shrink-0 text-text-muted">Host</dt>
                <dd className="font-semibold">{event.host}</dd>
              </div>
            )}
          </dl>

          {event.content && (
            <p className="mt-6 text-sm normal-case leading-relaxed tracking-normal text-text-secondary">
              {event.content}
            </p>
          )}

          <div className="mt-8">
            {event.registerUrl ? (
              <Button href={event.registerUrl} size="lg">
                Register
              </Button>
            ) : (
              <p className="text-sm normal-case tracking-normal text-text-muted">
                Registration opens closer to the date.
              </p>
            )}
          </div>
        </div>

        <div className="space-y-8">
          <EventAgenda items={event.agenda} />

          {event.speakers.length > 0 && (
            <div>
              <h3 className="text-xs text-text-muted">Speakers</h3>
              <div className="mt-4 space-y-3">
                {event.speakers.map((speaker, index) => (
                  <SpeakerCard key={`${speaker.name}-${index}`} speaker={speaker} />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </article>
  );
}
