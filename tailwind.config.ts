import type { Config } from "tailwindcss";

// Brand tokens below are sampled from the live fabricbelgium.be (Squarespace)
// site's computed styles: the "EVENTS" button (gold) and body copy (black on
// white), Poppins as the type family. The teal is an approximation read off
// the logo mark, NOT sampled precisely — confirm against the source logo
// file/brand kit before treating it as final. See PROJECT-PLAN.md "Open
// decisions" for how to resolve this.
const config: Config = {
  content: [
    "./src/app/**/*.{ts,tsx,mdx}",
    "./src/components/**/*.{ts,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          // Gold/mustard - primary CTA + accent color on the live site
          50: "#fdf7e7",
          100: "#faecbf",
          200: "#f5d97f",
          300: "#f0c53f",
          400: "#ebb824",
          500: "#E5B110", // sampled: rgb(229, 177, 16)
          600: "#c4960d",
          700: "#a37b0b",
          800: "#826109",
          900: "#5c4506",
          950: "#332703",
        },
        accent: {
          // Placeholder teal from the Microsoft Fabric triangle mark in the
          // logo. Replace with the exact value once we have the source SVG.
          50: "#e9f6f6",
          100: "#c7e8e8",
          200: "#a5dada",
          300: "#7cc9c9",
          400: "#4fb5b5",
          500: "#1a9d9d",
          600: "#158383",
          700: "#116868",
          800: "#0c4e4e",
          900: "#073333",
        },
        surface: {
          DEFAULT: "#FFFFFF",
          muted: "#F7F5F0",
          subtle: "#EFEBE2",
          border: "#E3DDD0",
          ink: "#111111", // near-black banner/footer background seen on the live site
        },
        text: {
          DEFAULT: "#111111",
          secondary: "#3F3F3F",
          muted: "#6B6B6B",
          inverse: "#FFFFFF",
        },
      },
      fontFamily: {
        sans: ["var(--font-poppins)", "system-ui", "sans-serif"],
        heading: ["var(--font-poppins)", "system-ui", "sans-serif"],
      },
      spacing: {
        "18": "4.5rem",
        "22": "5.5rem",
        "30": "7.5rem",
      },
      maxWidth: {
        site: "1280px",
        content: "720px",
      },
      borderRadius: {
        card: "0.75rem",
        button: "0.5rem",
      },
      boxShadow: {
        card: "0 1px 3px 0 rgb(0 0 0 / 0.06), 0 1px 2px -1px rgb(0 0 0 / 0.06)",
        "card-hover": "0 10px 25px -5px rgb(0 0 0 / 0.08), 0 8px 10px -6px rgb(0 0 0 / 0.04)",
      },
      animation: {
        "fade-in": "fadeIn 0.5s ease-out",
        "slide-up": "slideUp 0.5s ease-out",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};

export default config;
