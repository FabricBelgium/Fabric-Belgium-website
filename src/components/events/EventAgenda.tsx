import type { AgendaItem } from "@/lib/content/events";

interface EventAgendaProps {
  items: AgendaItem[];
  className?: string;
}

export function EventAgenda({ items, className = "" }: EventAgendaProps) {
  if (items.length === 0) return null;

  return (
    <div className={className}>
      <h3 className="text-xs text-text-muted">Agenda</h3>
      <ol className="mt-4 space-y-0">
        {items.map((item) => (
          <li
            key={`${item.time}-${item.title}`}
            className="flex gap-4 border-b border-surface-border/70 py-3 last:border-0"
          >
            <span className="w-14 shrink-0 text-sm font-semibold tabular-nums text-brand-500">
              {item.time}
            </span>
            <span className="text-sm normal-case tracking-normal">
              <span className="font-semibold">{item.title}</span>
              {item.description && (
                <span className="block text-text-secondary">{item.description}</span>
              )}
            </span>
          </li>
        ))}
      </ol>
    </div>
  );
}
