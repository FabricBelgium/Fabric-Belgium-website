import { OriginButton } from "@/components/ui/origin-button";

type ButtonVariant = "primary" | "secondary" | "ghost" | "inverse" | "contrast";
type ButtonSize = "sm" | "md" | "lg";

/**
 * Each variant supplies its resting look plus the two colours the origin fill
 * needs: the ink that floods in, and the label colour once it has. They are
 * inversions of the resting pair, so the fill reads as the button turning
 * itself inside out.
 */
const VARIANTS: Record<
  ButtonVariant,
  { base: string; rest: string; fill: string; filled: string }
> = {
  primary: {
    base: "bg-brand-500",
    rest: "text-text",
    fill: "bg-text",
    filled: "text-text-inverse",
  },
  secondary: {
    base: "border border-surface-border bg-transparent",
    rest: "text-text",
    fill: "bg-text",
    filled: "text-text-inverse",
  },
  ghost: {
    base: "bg-transparent",
    rest: "text-text",
    fill: "bg-text",
    filled: "text-text-inverse",
  },
  // Solid light pill for use on dark ground, where a green fill would sit too
  // close to the shader behind it.
  contrast: {
    base: "bg-text-inverse",
    rest: "text-text",
    fill: "bg-text",
    filled: "text-text-inverse",
  },
  inverse: {
    base: "border border-text-inverse/30 bg-transparent",
    rest: "text-text-inverse",
    fill: "bg-text-inverse",
    filled: "text-text",
  },
};

const SIZES: Record<ButtonSize, string> = {
  sm: "px-5 py-2 text-xs",
  md: "px-7 py-2.5 text-xs",
  lg: "px-8 py-3 text-sm",
};

// rounded-full, not the origin brief's rounded-xl: the header nav is built from
// pills, and mixing radii read as two design systems on one page.
const BASE = "rounded-full font-semibold uppercase tracking-wider";

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
  const v = VARIANTS[variant];

  return (
    <OriginButton
      href={href}
      type={type}
      disabled={disabled}
      fillClassName={v.fill}
      restTextClassName={v.rest}
      filledTextClassName={v.filled}
      className={`${BASE} ${v.base} ${SIZES[size]} ${className}`}
    >
      {children}
    </OriginButton>
  );
}
