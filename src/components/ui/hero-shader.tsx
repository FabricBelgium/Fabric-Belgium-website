"use client";

import type React from "react";

import { useEffect, useRef, useState } from "react";
import { MeshGradient } from "@paper-design/shaders-react";
import { useReducedMotion } from "motion/react";

/**
 * Brand mesh presets. The source snippet shipped a purple/black demo palette;
 * these are the Fabric Belgium tokens from tailwind.config.ts, used verbatim
 * so the shader never lands "roughly green" next to a real brand surface.
 */
export const fabricMeshDark = [
  "#1D1C1C", // surface.ink
  "#155537", // brand-900
  "#2FAE73", // brand-600
  "#3CC789", // brand-500
  "#1D1C1C",
];

export const fabricMeshLight = [
  "#FCFAFA", // surface
  "#EAFBF3", // brand-50
  "#9FE9C9", // brand-200
  "#3CC789", // brand-500
  "#FCFAFA",
];

interface ShaderBackgroundProps {
  /** Optional: omit to use this purely as a background layer behind its own
   *  positioned wrapper, rather than as a container for hero copy. */
  children?: React.ReactNode;
  /** Base mesh colors. Defaults to the dark brand preset. */
  colors?: string[];
  /** Second, faster layer blended on top for depth. */
  overlayColors?: string[];
  /** Animation speed of the base layer. The overlay runs slower. */
  speed?: number;
  /** Flat colour painted behind the canvas — matters while WebGL boots. */
  backgroundColor?: string;
  /**
   * Set as an inline style rather than a Tailwind class: a `min-h-[…]` default
   * here and a `min-h-[…]` from `className` are the same specificity, so which
   * one wins would depend on generated CSS order.
   */
  minHeight?: string;
  className?: string;
}

export function ShaderBackground({
  children,
  colors = fabricMeshDark,
  overlayColors = ["#1D1C1C", "#3CC789", "#6DD9AA", "#1D1C1C"],
  speed = 0.3,
  backgroundColor = "#1D1C1C",
  minHeight = "650px",
  className = "",
}: ShaderBackgroundProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isActive, setIsActive] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    const handleMouseEnter = () => setIsActive(true);
    const handleMouseLeave = () => setIsActive(false);

    const container = containerRef.current;
    if (container) {
      container.addEventListener("mouseenter", handleMouseEnter);
      container.addEventListener("mouseleave", handleMouseLeave);
    }

    return () => {
      if (container) {
        container.removeEventListener("mouseenter", handleMouseEnter);
        container.removeEventListener("mouseleave", handleMouseLeave);
      }
    };
  }, []);

  // speed 0 stops the render loop entirely in ShaderMount, so honouring
  // prefers-reduced-motion here also removes the per-frame GPU cost.
  const baseSpeed = prefersReducedMotion ? 0 : isActive ? speed * 1.6 : speed;

  return (
    <div
      ref={containerRef}
      className={`relative w-full overflow-hidden ${className}`}
      style={{ backgroundColor, minHeight }}
    >
      {/*
        The snippet's #glass-effect def moved to ui/svg-filters.tsx, rendered
        once from the root layout: filter ids are global and a duplicated one
        would be invalid markup.
      */}

      {/*
        Background shaders. The upstream snippet passed `backgroundColor` and
        `wireframe` to MeshGradient; neither exists in @paper-design/shaders-react
        0.0.80 (see MeshGradientParams). The flat colour moved to the wrapper
        above, and the second layer uses swirl/distortion for the same sense of
        depth the wireframe pass gave.
      */}
      <MeshGradient
        className="absolute inset-0 h-full w-full"
        colors={colors}
        speed={baseSpeed}
        distortion={0.8}
        swirl={0.1}
      />
      <MeshGradient
        className="absolute inset-0 h-full w-full opacity-50"
        colors={overlayColors}
        speed={baseSpeed * 0.66}
        distortion={1}
        swirl={0.6}
        grainOverlay={0.05}
      />

      {children}
    </div>
  );
}
