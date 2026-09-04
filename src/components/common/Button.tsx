import Link from "next/link";

type ButtonVariant = "primary" | "secondary" | "ghost" | "inverse";
type ButtonSize = "sm" | "md" | "lg";

const VARIANTS: Record<ButtonVariant, string> = {
  primary: "bg-brand-500 text-text hover:bg-brand-400",
  secondary:
    "border border-surface-border bg-transparent text-text hover:border-text hover:bg-surface-muted",
  ghost: "text-text hover:text-brand-600",
  inverse:
    "border border-text-inverse/30 bg-transparent text-text-inverse hover:border-text-inverse/50 hover:bg-text-inverse/10",
};

const SIZES: Record<ButtonSize, string> = {
  sm: "px-5 py-2 text-xs",
  md: "px-7 py-2.5 text-xs",
  lg: "px-8 py-3 text-sm",
};

// rounded-full, not the rounded-button token: both reference demos build their
// entire control language out of pills, and mixing 8px-radius buttons with the
// pill nav in the header read as two different design systems on one page.
const BASE =
  "inline-flex items-center justify-center gap-2 rounded-full font-semibold uppercase tracking-wider transition-colors " +
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600";

interface ButtonProps {
  children: React.ReactNode;
  /** Renders a link when set, a <button> when not */
  href?: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  type?: "button" | "submit";
  disabled?: boolean;
  className?: string;
}

export function Button({
  children,
  href,
  variant = "primary",
  size = "md",
  type = "button",
  disabled = false,
  className = "",
}: ButtonProps) {
  const classes = `${BASE} ${VARIANTS[variant]} ${SIZES[size]} ${className}`;

  if (href) {
    const isExternal = href.startsWith("http");
    if (isExternal) {
      return (
        <a href={href} className={classes} target="_blank" rel="noopener noreferrer">
          {children}
        </a>
      );
    }
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  }

  return (
    <button
      type={type}
      disabled={disabled}
      className={`${classes} disabled:cursor-not-allowed disabled:opacity-60`}
    >
      {children}
    </button>
  );
}
