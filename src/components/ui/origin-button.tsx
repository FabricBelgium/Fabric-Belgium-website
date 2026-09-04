"use client";

import { motion } from "motion/react";
import Link from "next/link";
import * as React from "react";

import { cn } from "@/lib/utils";

const FILL_DURATION = 0.5;
const FILL_EASE = [0.16, 1, 0.3, 1] as const;

/** Diameter of a circle centred at (x,y) that still covers every corner. */
function getCoverDiameter(width: number, height: number, x: number, y: number) {
  return Math.ceil(
    2 *
      Math.max(
        Math.hypot(x, y),
        Math.hypot(width - x, y),
        Math.hypot(x, height - y),
        Math.hypot(width - x, height - y),
      ),
  );
}

function hasTextContent(node: React.ReactNode): boolean {
  if (typeof node === "string" || typeof node === "number") {
    return String(node).trim().length > 0;
  }
  if (Array.isArray(node)) return node.some(hasTextContent);
  if (React.isValidElement<{ children?: React.ReactNode }>(node)) {
    return hasTextContent(node.props.children);
  }
  return false;
}

export interface OriginButtonProps {
  children?: React.ReactNode;
  /** Renders a link when set, a <button> when not. */
  href?: string;
  type?: "button" | "submit";
  disabled?: boolean;
  loading?: boolean;
  onClick?: React.MouseEventHandler<HTMLElement>;
  className?: string;
  "aria-label"?: string;
  "aria-labelledby"?: string;
  /** Tailwind background class for the ink that floods the control. */
  fillClassName?: string;
  /** Label colour at rest. */
  restTextClassName?: string;
  /** Label colour while the ink covers the control. */
  filledTextClassName?: string;
}

/**
 * A control that floods with ink from wherever the pointer entered it, the
 * label inverting as the fill passes under it.
 *
 * Adapted from the origin-button brief (docs/origin-button.prompt.md) with
 * three deliberate changes:
 *
 * 1. **It can be a link.** The original was `<button>` only; most calls to
 *    action on this site navigate, so it renders Link / <a> / <button>.
 * 2. **No vendored theme block.** The brief carried a ~2KB string of shadcn
 *    CSS variables (a white/#111 palette with a dark mode). Pasting that would
 *    have imported a second design system to fight the brand tokens, so the
 *    colours come from `fillClassName` / `filledTextClassName` instead and the
 *    caller supplies brand values.
 * 3. **Only the ink is a motion element.** The original made the whole control
 *    a `motion.button` for `whileTap`. Wrapping Next's Link in motion for that
 *    alone is not worth it, so the press uses `active:scale-[0.985]`.
 *
 * Everything that makes the interaction work is kept: the cover-diameter
 * maths, re-measuring on resize and after fonts load, and keyboard use
 * flooding from the centre rather than from a stale pointer position.
 */
export function OriginButton({
  children,
  href,
  type = "button",
  disabled = false,
  loading = false,
  onClick,
  className,
  fillClassName = "bg-text",
  restTextClassName = "text-text",
  filledTextClassName = "text-text-inverse",
  ...aria
}: OriginButtonProps) {
  const nodeRef = React.useRef<HTMLElement | null>(null);
  const [hovered, setHovered] = React.useState(false);
  const [isPressed, setIsPressed] = React.useState(false);
  const [origin, setOrigin] = React.useState({ x: 0, y: 0 });
  const [coverSize, setCoverSize] = React.useState(0);

  const isDisabled = Boolean(disabled || loading);
  const showFill = !isDisabled && (hovered || isPressed);

  const ariaLabel = aria["aria-label"];
  const ariaLabelledBy = aria["aria-labelledby"];

  React.useEffect(() => {
    if (process.env.NODE_ENV === "production") return;
    if (hasTextContent(children) || ariaLabel?.trim() || ariaLabelledBy?.trim()) {
      return;
    }
    console.warn(
      "OriginButton: provide visible label text or aria-label / aria-labelledby so the control has an accessible name.",
    );
  }, [ariaLabel, ariaLabelledBy, children]);

  const updateOrigin = React.useCallback((x: number, y: number) => {
    const node = nodeRef.current;
    if (!node) return;
    const rect = node.getBoundingClientRect();
    setOrigin({ x, y });
    setCoverSize(getCoverDiameter(rect.width, rect.height, x, y));
  }, []);

  const updateOriginFromPointer = React.useCallback(
    (event: React.PointerEvent<HTMLElement>) => {
      const rect = event.currentTarget.getBoundingClientRect();
      updateOrigin(event.clientX - rect.left, event.clientY - rect.top);
    },
    [updateOrigin],
  );

  const updateOriginFromCenter = React.useCallback(() => {
    const node = nodeRef.current;
    if (!node) return;
    const rect = node.getBoundingClientRect();
    updateOrigin(rect.width / 2, rect.height / 2);
  }, [updateOrigin]);

  // The control is sized by its text, so the cover circle has to be recomputed
  // when the box changes — including after a webfont swaps in and reflows it.
  React.useLayoutEffect(() => {
    const node = nodeRef.current;
    if (!(node && showFill)) return;

    const measure = () => {
      const rect = node.getBoundingClientRect();
      setCoverSize(getCoverDiameter(rect.width, rect.height, origin.x, origin.y));
    };

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(node);

    const fonts = document.fonts;
    if (fonts?.ready) fonts.ready.then(measure).catch(() => undefined);

    return () => observer.disconnect();
  }, [showFill, origin.x, origin.y]);

  const interactionProps = {
    onPointerEnter: (event: React.PointerEvent<HTMLElement>) => {
      if (isDisabled) return;
      updateOriginFromPointer(event);
      setHovered(true);
    },
    onPointerLeave: () => {
      setHovered(false);
      setIsPressed(false);
    },
    onPointerDown: (event: React.PointerEvent<HTMLElement>) => {
      if (isDisabled || event.button !== 0) return;
      updateOriginFromPointer(event);
      setIsPressed(true);
      setHovered(true);
    },
    onPointerUp: () => setIsPressed(false),
    onPointerCancel: () => setIsPressed(false),
    onFocus: (event: React.FocusEvent<HTMLElement>) => {
      if (isDisabled) return;
      if (event.currentTarget.matches(":focus-visible")) {
        updateOriginFromCenter();
        setHovered(true);
      }
    },
    onBlur: () => {
      setIsPressed(false);
      setHovered(false);
    },
    onKeyDown: (event: React.KeyboardEvent<HTMLElement>) => {
      if (isDisabled || event.repeat) return;
      if (event.key !== " " && event.key !== "Enter") return;
      updateOriginFromCenter();
      setIsPressed(true);
      setHovered(true);
    },
    onKeyUp: (event: React.KeyboardEvent<HTMLElement>) => {
      if (event.key !== " " && event.key !== "Enter") return;
      setIsPressed(false);
      if (!event.currentTarget.matches(":focus-visible")) setHovered(false);
    },
  };

  const shared = cn(
    "relative inline-flex cursor-pointer touch-manipulation select-none items-center justify-center overflow-hidden",
    "transition-[color] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]",
    "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600",
    !isDisabled && "active:scale-[0.985]",
    // Exactly one text-colour class, never both. `cn` is a plain join with no
    // tailwind-merge, so listing the resting and filled colours together would
    // leave the winner to generated CSS order — and the label would not invert.
    showFill ? filledTextClassName : restTextClassName,
    className,
  );

  const inner = (
    <>
      <motion.span
        aria-hidden
        animate={{ scale: showFill && coverSize > 0 ? 1 : 0 }}
        initial={false}
        transition={{ duration: FILL_DURATION, ease: FILL_EASE }}
        className={cn("pointer-events-none absolute rounded-full", fillClassName)}
        // Centred by offsetting left/top rather than by -translate-x-1/2:
        // motion writes the whole `transform` property to animate scale, which
        // silently overrides Tailwind's translate utilities and leaves the
        // circle hanging off the origin instead of centred on it.
        style={{
          height: coverSize,
          width: coverSize,
          left: origin.x - coverSize / 2,
          top: origin.y - coverSize / 2,
        }}
      />
      <span className="relative z-10 inline-flex items-center justify-center gap-2">
        {children}
      </span>
    </>
  );

  if (href && !isDisabled) {
    const isExternal = href.startsWith("http") || href.startsWith("mailto:");
    const linkProps = {
      ...aria,
      ...interactionProps,
      className: shared,
      onClick,
      ref: (node: HTMLAnchorElement | null) => {
        nodeRef.current = node;
      },
    };

    return isExternal ? (
      <a href={href} target="_blank" rel="noopener noreferrer" {...linkProps}>
        {inner}
      </a>
    ) : (
      <Link href={href} {...linkProps}>
        {inner}
      </Link>
    );
  }

  return (
    <button
      {...aria}
      {...interactionProps}
      aria-busy={loading || undefined}
      className={cn(shared, "disabled:pointer-events-none disabled:opacity-60")}
      data-pressed={isPressed ? "true" : "false"}
      disabled={isDisabled}
      onClick={onClick}
      ref={(node) => {
        nodeRef.current = node;
      }}
      type={type}
    >
      {inner}
    </button>
  );
}
