import fs from "fs";
import path from "path";
import matter from "gray-matter";

export interface AgendaItem {
  /** "18:00" — 24h local time */
  time: string;
  title: string;
  description?: string;
}

export interface Speaker {
  name: string;
  talk: string;
  company?: string;
  /** Link to the slide deck, added after the event */
  slidesUrl?: string;
}

export interface EventVenue {
  name: string;
  address?: string;
  city?: string;
  /** Link to a map or the venue's own page */
  url?: string;
}

export interface FabricEvent {
  slug: string;
  title: string;
  /** ISO date, "2026-09-24" */
  date: string;
  status: "upcoming" | "past";
  startTime?: string;
  endTime?: string;
  venue?: EventVenue;
  host?: string;
  registerUrl?: string;
  agenda: AgendaItem[];
  speakers: Speaker[];
  /** Body copy below the frontmatter (markdown, rendered as plain paragraphs) */
  content: string;
}

const EVENTS_DIR = path.join(process.cwd(), "src", "content", "events");

function asString(value: unknown): string | undefined {
  return typeof value === "string" && value.trim() ? value.trim() : undefined;
}

function parseAgenda(value: unknown): AgendaItem[] {
  if (!Array.isArray(value)) return [];
  return value.flatMap((item) => {
    if (!item || typeof item !== "object") return [];
    const row = item as Record<string, unknown>;
    const title = asString(row.title);
    const time = asString(row.time);
    if (!title || !time) return [];
    return [{ time, title, description: asString(row.description) }];
  });
}

function parseSpeakers(value: unknown): Speaker[] {
  if (!Array.isArray(value)) return [];
  return value.flatMap((item) => {
    if (!item || typeof item !== "object") return [];
    const row = item as Record<string, unknown>;
    const name = asString(row.name);
    if (!name) return [];
    return [
      {
        name,
        talk: asString(row.talk) ?? "Session to be announced",
        company: asString(row.company),
        slidesUrl: asString(row.slidesUrl),
      },
    ];
  });
}

function parseVenue(value: unknown): EventVenue | undefined {
  if (!value || typeof value !== "object") return undefined;
  const row = value as Record<string, unknown>;
  const name = asString(row.name);
  if (!name) return undefined;
  return {
    name,
    address: asString(row.address),
    city: asString(row.city),
    url: asString(row.url),
  };
}

/**
 * Reads every markdown file in src/content/events. Frontmatter keys are
 * validated field by field so a typo degrades to a missing value instead of
 * crashing the build — the archive goes back to 2022 and is edited by hand.
 */
export function getAllEvents(): FabricEvent[] {
  if (!fs.existsSync(EVENTS_DIR)) return [];

  return fs
    .readdirSync(EVENTS_DIR)
    .filter((file) => file.endsWith(".md"))
    .map((file) => {
      const raw = fs.readFileSync(path.join(EVENTS_DIR, file), "utf8");
      const { data, content } = matter(raw);
      const date =
        data.date instanceof Date
          ? data.date.toISOString().slice(0, 10)
          : (asString(data.date) ?? "");

      return {
        slug: file.replace(/\.md$/, ""),
        title: asString(data.title) ?? "Untitled event",
        date,
        status: data.status === "upcoming" ? "upcoming" : "past",
        startTime: asString(data.startTime),
        endTime: asString(data.endTime),
        venue: parseVenue(data.venue),
        host: asString(data.host),
        registerUrl: asString(data.registerUrl),
        agenda: parseAgenda(data.agenda),
        speakers: parseSpeakers(data.speakers),
        content: content.trim(),
      } satisfies FabricEvent;
    })
    .sort((a, b) => b.date.localeCompare(a.date));
}

/** Every scheduled event, soonest first. */
export function getUpcomingEvents(): FabricEvent[] {
  return getAllEvents()
    .filter((event) => event.status === "upcoming")
    .sort((a, b) => a.date.localeCompare(b.date));
}

/** The next event only — used where a single event is being detailed. */
export function getUpcomingEvent(): FabricEvent | undefined {
  return getUpcomingEvents()[0];
}

export function getPastEvents(): FabricEvent[] {
  return getAllEvents().filter((event) => event.status === "past");
}

/** Past events bucketed by year, newest year first. */
export function getPastEventsByYear(): { year: string; events: FabricEvent[] }[] {
  const buckets = new Map<string, FabricEvent[]>();

  for (const event of getPastEvents()) {
    const year = event.date.slice(0, 4) || "Undated";
    buckets.set(year, [...(buckets.get(year) ?? []), event]);
  }

  return Array.from(buckets.entries())
    .sort((a, b) => b[0].localeCompare(a[0]))
    .map(([year, events]) => ({ year, events }));
}
