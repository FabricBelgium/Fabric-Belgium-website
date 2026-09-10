import { OriginButton } from "@/components/ui/origin-button";

/**
 * Only two variants, and they differ solely in what the button rests on. Every
 * button is an outline at rest and floods brand green on hover, so there is no
 * "primary vs secondary" any more: emphasis comes from placement and copy
 * rather than from colour.
 */
type ButtonVariant = "default" | "inverse";
type ButtonSize = "sm" | "md" | "lg";

const VARIANTS: Record<
  ButtonVariant,
  { base: string; rest: string; fill: string; filled: string }
> = {
  /** On the cream panels. */
  default: {
    base: "border border-text/25 bg-transparent",
    rest: "text-text",
    fill: "bg-brand-500",
    filled: "text-text",
  },
  /** On the shader hero and the dark cards. */
  inverse: {
    base: "border border-text-inverse/35 bg-transparent",
    rest: "text-text-inverse",
    fill: "bg-brand-500",
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
  /** "inverse" on dark ground, "default" on the cream panels */
  variant?: ButtonVariant;
  size?: ButtonSize;
  type?: "button" | "submit";
  /** Passed straight to OriginButton, which already supports it. */
  onClick?: React.MouseEventHandler<HTMLElement>;
  disabled?: boolean;
  className?: string;
}

export function Button({
  children,
  href,
  variant = "default",
  size = "md",
  type = "button",
  onClick,
  disabled = false,
  className = "",
}: ButtonProps) {
  const v = VARIANTS[variant];

  return (
    <OriginButton
      href={href}
      type={type}
      onClick={onClick}
      disabled={disabled}
      fillClassName={v.fill}
      restTextClassName={v.rest}
      // Near-black on the green fill, never white: brand-500 carries white at
      // only 2.08:1, which fails even the 3:1 bar for large text.
      filledTextClassName={v.filled}
      className={`${BASE} ${v.base} ${SIZES[size]} ${className}`}
    >
      {children}
    </OriginButton>
  );
}
