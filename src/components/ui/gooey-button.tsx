import Link from "next/link";

interface GooeyButtonProps {
  children: React.ReactNode;
  href: string;
  /** Matches the surface behind it: "light" on cream pages, "dark" over the hero */
  tone?: "light" | "dark";
  className?: string;
}

/**
 * The 1.txt demo's button group: a label pill with a second arrow pill that
 * slides out from behind it on hover, the two fused by #gooey-filter so they
 * separate like a droplet rather than as two rectangles.
 *
 * The filter is defined once in the root layout (see ui/svg-filters.tsx).
 * The demo hardcoded white-on-black; here the pill colours come from the
 * brand tokens, and the arrow pill is aria-hidden because it is the same
 * destination as the label — one link, one accessible name.
 */
export function GooeyButton({ children, href, tone = "light", className = "" }: GooeyButtonProps) {
  const pill =
    tone === "dark"
      ? "bg-text-inverse text-text hover:bg-text-inverse/90"
      : "bg-brand-500 text-text hover:bg-brand-400";

  return (
    <div
      className={`group relative flex items-center ${className}`}
      style={{ filter: "url(#gooey-filter)" }}
    >
      <span
        aria-hidden="true"
        className={`absolute right-0 z-0 flex h-9 w-9 -translate-x-12 items-center justify-center rounded-full transition-transform duration-300 group-hover:-translate-x-[5.5rem] ${pill}`}
      >
        <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M7 17L17 7M17 7H7M17 7V17"
          />
        </svg>
      </span>
      <Link
        href={href}
        className={`relative z-10 flex h-9 items-center rounded-full px-6 text-xs font-semibold uppercase tracking-wider transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600 ${pill}`}
      >
        {children}
      </Link>
    </div>
  );
}
