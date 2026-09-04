import type { Speaker } from "@/lib/content/events";

interface SpeakerCardProps {
  speaker: Speaker;
  /** Compact variant used inside the past-events archive */
  compact?: boolean;
}

export function SpeakerCard({ speaker, compact = false }: SpeakerCardProps) {
  const initials = speaker.name
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();

  if (compact) {
    return (
      <li className="text-sm normal-case tracking-normal text-text-secondary">
        <span className="font-semibold text-text">{speaker.name}</span>
        {" — "}
        {speaker.talk}
        {speaker.slidesUrl && (
          <>
            {" "}
            <a
              href={speaker.slidesUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-brand-700 underline underline-offset-2 hover:text-brand-600"
            >
              Slides
            </a>
          </>
        )}
      </li>
    );
  }

  return (
    <article className="flex gap-4 border-b border-surface-border/50 pb-4 last:border-0">
      <span
        aria-hidden="true"
        className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-brand-100 text-sm font-bold text-brand-800"
      >
        {initials}
      </span>
      <div>
        <h4 className="text-sm normal-case tracking-normal">{speaker.name}</h4>
        {speaker.company && (
          <p className="text-xs normal-case tracking-normal text-text-muted">{speaker.company}</p>
        )}
        <p className="mt-2 text-sm normal-case leading-relaxed tracking-normal text-text-secondary">
          {speaker.talk}
        </p>
        {speaker.slidesUrl && (
          <a
            href={speaker.slidesUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 inline-block text-xs font-semibold uppercase tracking-wider text-brand-700 hover:text-brand-600"
          >
            Slides
          </a>
        )}
      </div>
    </article>
  );
}
