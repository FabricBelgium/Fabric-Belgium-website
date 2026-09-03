import type { Config } from "tailwindcss";

// Brand palette set explicitly by Arno on 2026-09-03, superseding the old
// fabricbelgium.be Squarespace colors (gold/black/white) this scaffold
// originally sampled. Four source colors, tonal ramps derived from them:
//   #3CC789 green   -> brand (primary CTA / highlight)
//   #FCFAFA off-white -> surface (page background)
//   #545F66 slate   -> text-secondary
//   #1D1C1C near-black -> text default / surface.ink (dark sections)
const config: Config = {
  content: [
    "./src/app/**/*.{ts,tsx,mdx}",
    "./src/components/**/*.{ts,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#EAFBF3",
          100: "#C9F3E0",
          200: "#9FE9C9",
          300: "#6DD9AA",
          400: "#4FCF98",
          500: "#3CC789", // primary
          600: "#2FAE73",
          700: "#268F5F",
          800: "#1E704A",
          900: "#155537",
          950: "#0C3521",
        },
        surface: {
          DEFAULT: "#FCFAFA", // primary
          muted: "#F2F0EF",
          subtle: "#E8E6E4",
          border: "#DCDADA",
          ink: "#1D1C1C", // primary, for dark sections (footer, CTA banners)
        },
        text: {
          DEFAULT: "#1D1C1C", // primary
          secondary: "#545F66", // primary
          muted: "#8A9096",
          inverse: "#FCFAFA",
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
