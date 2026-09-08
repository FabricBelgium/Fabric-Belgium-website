type TagTone = "brand" | "neutral" | "inverse";

const TONES: Record<TagTone, string> = {
  brand: "bg-brand-100 text-brand-500",
  neutral: "bg-surface-muted text-text-secondary",
  inverse: "bg-text-inverse/10 text-text-inverse",
};

interface TagProps {
  children: React.ReactNode;
  tone?: TagTone;
  className?: string;
}

/** Small uppercase label: event status, partner tier, section eyebrow. */
export function Tag({ children, tone = "brand", className = "" }: TagProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wider ${TONES[tone]} ${className}`}
    >
      {children}
    </span>
  );
}
