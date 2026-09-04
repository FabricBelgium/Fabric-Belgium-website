import type { Metadata } from "next";
import { Instrument_Serif, Poppins } from "next/font/google";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SvgFilters } from "@/components/ui/svg-filters";
import "./globals.css";

const poppins = Poppins({
  subsets: ["latin"],
  // 800 exists for the landing title only — see LANDING_HEADLINE in HomeStory.
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-poppins",
});

// The 1.txt hero demo sets its accent word in an italic serif ("instrument").
// Instrument Serif is that face; it is used only for those accents, never for
// body copy.
const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  weight: ["400"],
  style: ["italic", "normal"],
  variable: "--font-instrument",
});

export const metadata: Metadata = {
  title: {
    default: "Fabric Belgium",
    template: "%s | Fabric Belgium",
  },
  description:
    "Fabric Belgium is a community for data professionals to grow Microsoft Fabric expertise from peers and build a vibrant network.",
  icons: {
    icon: "/images/favicon.ico",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${poppins.variable} ${instrumentSerif.variable}`}>
      <body className="bg-surface font-sans text-text antialiased">
        <SvgFilters />
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[60] focus:rounded-full focus:bg-brand-500 focus:px-4 focus:py-2 focus:text-sm focus:font-semibold"
        >
          Skip to content
        </a>
        <SiteHeader />
        <div id="main-content">{children}</div>
        <SiteFooter />
      </body>
    </html>
  );
}
