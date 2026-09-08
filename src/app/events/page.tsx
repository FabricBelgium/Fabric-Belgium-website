import type { Metadata } from "next";
import { SectionContainer } from "@/components/common/SectionContainer";
import { Tag } from "@/components/common/Tag";
import { EventCard } from "@/components/events/EventCard";
import { PastEventsArchive } from "@/components/events/PastEventsArchive";
import { getPastEventsByYear, getUpcomingEvents } from "@/lib/content/events";

export const metadata: Metadata = {
  title: "Events",
  description:
    "Upcoming Fabric Belgium meetups plus the full archive of past events, speakers and slides.",
};

// Placeholder page for Phase 3 (see PROJECT-PLAN.md). It reuses the homepage
// components so the navigation is not broken while the real events page and
// per-event detail routes are built.
export default function EventsPage() {
  const upcoming = getUpcomingEvents();
  const archive = getPastEventsByYear();

  return (
    <main>
      <SectionContainer>
        <Tag>Events</Tag>
        <h1 className="mt-4 text-4xl md:text-5xl">Events</h1>
        {upcoming.length > 0 && (
          <div className="mt-10 space-y-16">
            {upcoming.map((event) => (
              <EventCard key={event.slug} event={event} />
            ))}
          </div>
        )}
      </SectionContainer>

      <SectionContainer className="bg-surface-muted">
        <h2 className="text-3xl md:text-4xl">Past events</h2>
        <div className="mt-10">
          <PastEventsArchive years={archive} openByDefault={archive.length} />
        </div>
      </SectionContainer>
    </main>
  );
}
