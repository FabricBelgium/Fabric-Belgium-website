"use client";

// Imported from `motion/react`, not `framer-motion`: this repo already depends
// on `motion` v12 (framer-motion's current name) and pulls framer-motion in
// only as its transitive dependency. Same API, one dependency instead of two.
import { motion, useReducedMotion } from "motion/react";
import React, { useEffect, useRef } from "react";

interface AnimatedGradientBackgroundProps {
  /**
   * Initial size of the radial gradient, defining the starting width.
   * @default 110
   */
  startingGap?: number;

  /**
   * Enables or disables the breathing animation effect.
   * @default false
   */
  Breathing?: boolean;

  /**
   * Array of colors to use in the radial gradient.
   * Each color corresponds to a stop percentage in `gradientStops`.
   * Defaults to the Fabric Belgium palette (see tailwind.config.ts).
   */
  gradientColors?: string[];

  /**
   * Array of percentage stops corresponding to each color in `gradientColors`.
   * The values should range between 0 and 100.
   * @default [35, 50, 60, 70, 80, 90, 100]
   */
  gradientStops?: number[];

  /**
   * Speed of the breathing animation.
   * Lower values result in slower animation.
   * @default 0.02
   */
  animationSpeed?: number;

  /**
   * Maximum range for the breathing animation in percentage points.
   * Determines how much the gradient "breathes" by expanding and contracting.
   * @default 5
   */
  breathingRange?: number;

  /**
   * Additional inline styles for the gradient container.
   * @default {}
   */
  containerStyle?: React.CSSProperties;

  /**
   * Additional class names for the gradient container.
   * @default ""
   */
  containerClassName?: string;

  /**
   * Additional top offset for the gradient container form the top to have a more flexible control over the gradient.
   * @default 0
   */
  topOffset?: number;
}

/**
 * AnimatedGradientBackground
 *
 * This component renders a customizable animated radial gradient background with a subtle breathing effect.
 * It uses `motion` for an entrance animation and raw CSS gradients for the dynamic background.
 *
 * @param {AnimatedGradientBackgroundProps} props - Props for configuring the gradient animation.
 * @returns JSX.Element
 */
const AnimatedGradientBackground: React.FC<AnimatedGradientBackgroundProps> = ({
  startingGap = 125,
  Breathing = false,
  gradientColors = [
    "#1D1C1C", // surface.ink
    "#155537", // brand-900
    "#1E704A", // brand-800
    "#268F5F", // brand-700
    "#2FAE73", // brand-600
    "#3CC789", // brand-500
    "#6DD9AA", // brand-300
  ],
  gradientStops = [35, 50, 60, 70, 80, 90, 100],
  animationSpeed = 0.02,
  breathingRange = 5,
  containerStyle = {},
  topOffset = 0,
  containerClassName = "",
}) => {
  // Validation: Ensure gradientStops and gradientColors lengths match
  if (gradientColors.length !== gradientStops.length) {
    throw new Error(
      `GradientColors and GradientStops must have the same length.
     Received gradientColors length: ${gradientColors.length},
     gradientStops length: ${gradientStops.length}`,
    );
  }

  const containerRef = useRef<HTMLDivElement | null>(null);
  const prefersReducedMotion = useReducedMotion();
  const isBreathing = Breathing && !prefersReducedMotion;

  useEffect(() => {
    let animationFrame: number;
    let width = startingGap;
    let directionWidth = 1;

    const paint = () => {
      const gradientStopsString = gradientStops
        .map((stop, index) => `${gradientColors[index]} ${stop}%`)
        .join(", ");

      const gradient = `radial-gradient(${width}% ${width + topOffset}% at 50% 20%, ${gradientStopsString})`;

      if (containerRef.current) {
        containerRef.current.style.background = gradient;
      }
    };

    // Without breathing the gradient never changes, so the upstream version's
    // permanent rAF loop repainted an identical value forever. Paint once and
    // stop instead — same visual result, no idle main-thread work.
    if (!isBreathing) {
      paint();
      return;
    }

    const animateGradient = () => {
      if (width >= startingGap + breathingRange) directionWidth = -1;
      if (width <= startingGap - breathingRange) directionWidth = 1;

      width += directionWidth * animationSpeed;
      paint();

      animationFrame = requestAnimationFrame(animateGradient);
    };

    animationFrame = requestAnimationFrame(animateGradient);

    return () => cancelAnimationFrame(animationFrame); // Cleanup animation
  }, [
    startingGap,
    isBreathing,
    gradientColors,
    gradientStops,
    animationSpeed,
    breathingRange,
    topOffset,
  ]);

  return (
    <motion.div
      key="animated-gradient-background"
      initial={
        prefersReducedMotion
          ? { opacity: 1, scale: 1 }
          : {
              opacity: 0,
              scale: 1.5,
            }
      }
      animate={{
        opacity: 1,
        scale: 1,
        transition: {
          duration: prefersReducedMotion ? 0 : 2,
          ease: [0.25, 0.1, 0.25, 1], // Cubic bezier easing
        },
      }}
      className={`absolute inset-0 overflow-hidden ${containerClassName}`}
    >
      <div
        ref={containerRef}
        style={containerStyle}
        className="absolute inset-0 transition-transform"
      />
    </motion.div>
  );
};

export default AnimatedGradientBackground;
