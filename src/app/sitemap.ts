import type { MetadataRoute } from "next";
import { legalNavigation } from "@/lib/legal";
import { navigation, site } from "@/lib/site";

// Static export (`output: "export"`) turns this into a build-time
// sitemap.xml — there is no request to read a real timestamp from, so
// `lastModified` is deliberately the build date, not per-page history.
const buildDate = new Date();

export default function sitemap(): MetadataRoute.Sitemap {
  const paths = [...navigation, ...legalNavigation].map((item) => item.href);

  return paths.map((path) => ({
    url: `${site.url}${path === "/" ? "" : path}`,
    lastModified: buildDate,
  }));
}
