interface EdgeFadeProps {
  /** Which edge of the parent to soften */
  edge: "top" | "bottom";
  /** The colour it fades to/from — the surface on the other side of the seam */
  via?: string;
  /** Tailwind height utility; taller = softer */
  height?: string;
  className?: string;
}

/**
 * Dissolves the hard line where two differently-coloured bands meet, so the
 * page reads as one continuous surface rather than a stack of blocks.
 *
 * Sits above a section's background layer but below its content: give the
 * parent `relative isolate` and keep the content in a `relative z-10` wrapper.
 */
export function EdgeFade({
  edge,
  via = "from-surface",
  height = "h-32",
  className = "",
}: EdgeFadeProps) {
  const position = edge === "top" ? "top-0 bg-gradient-to-b" : "bottom-0 bg-gradient-to-t";

  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute inset-x-0 ${position} ${height} ${via} to-transparent ${className}`}
    />
  );
}
