import type { Metadata } from "next";
import { HomeStory } from "@/components/sections/HomeStory";
import { getUpcomingEvents } from "@/lib/content/events";
import { getPartners } from "@/lib/content/partners";
import { formatEventDate } from "@/lib/format";

export const metadata: Metadata = {
  title: {
    absolute: "Fabric Belgium — the Microsoft Fabric community in Belgium",
  },
  description:
    "Free meetups, real sessions and a network of data professionals growing their Microsoft Fabric expertise together across Belgium.",
};

/**
 * The homepage is one continuous pinned scroll of five full-screen panels —
 * landing, events, flagship, partners, contact — rather than a stack of
 * sections. See components/sections/HomeStory.tsx.
 */
export default function Home() {
  const upcoming = getUpcomingEvents();
  const partners = getPartners();

  const nextEvent = upcoming[0];
  const heroEyebrow = nextEvent
    ? `Next meetup · ${formatEventDate(nextEvent.date, {
        day: "numeric",
        month: "long",
        year: "numeric",
      })}`
    : undefined;

  return (
    <main className="bg-surface">
      <HomeStory upcoming={upcoming} partners={partners} eyebrow={heroEyebrow} />
    </main>
  );
}
