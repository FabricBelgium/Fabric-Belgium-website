interface SectionContainerProps {
  children: React.ReactNode;
  className?: string;
  /** Constrain to the reading width instead of the full site width */
  narrow?: boolean;
  id?: string;
}

/**
 * Every page section goes through here so vertical rhythm and gutters are set
 * in one place (`.section-padding` / `.container-site` in globals.css).
 */
export function SectionContainer({
  children,
  className = "",
  narrow = false,
  id,
}: SectionContainerProps) {
  return (
    <section className={`section-padding ${className}`} id={id}>
      <div className={narrow ? "container-content" : "container-site"}>{children}</div>
    </section>
  );
}
