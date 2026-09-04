import Image from "next/image";
import type { Partner } from "@/lib/content/partners";

interface PartnerLogoGridProps {
  partners: Partner[];
  /** Cap the number shown. Omit to show every partner. */
  limit?: number;
  /** Fixed column count, or "responsive" to step 2 → 3 → 4 with the viewport */
  columns?: 2 | 3 | 4 | "responsive";
  className?: string;
}

const COLUMNS = {
  2: "grid-cols-2",
  3: "grid-cols-3",
  4: "grid-cols-4",
  responsive: "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4",
} as const;

/**
 * Logo wall, used on the homepage partners card and the partnerships page.
 *
 * Sizing is not done here. Every file in /images/partners is pre-normalised to
 * one 480×180 canvas with its mark scaled by *area* (see the build note in
 * ASSETS/partner logos), so simply rendering each canvas at the same box makes
 * every logo read as the same size regardless of its aspect ratio. The tile
 * therefore matches that canvas ratio — change one and you must change both.
 *
 * The white tile is load-bearing too: the marks are a mix of dark ink on
 * transparent and logos with their own coloured grounds (ConXioN's blue
 * square, U2U's black badge). On the dark green card the first kind would
 * vanish and the second would read as stray rectangles.
 */
export function PartnerLogoGrid({
  partners,
  limit,
  columns = "responsive",
  className = "",
}: PartnerLogoGridProps) {
  const shown = limit ? partners.slice(0, limit) : partners;

  if (shown.length === 0) {
    return (
      <p className={`text-sm normal-case tracking-normal text-text-secondary ${className}`}>
        Partner list coming soon.
      </p>
    );
  }

  return (
    <ul className={`grid gap-2 ${COLUMNS[columns]} ${className}`}>
      {shown.map((partner, index) => {
        const tile = (
          <div className="flex aspect-[8/3] items-center justify-center rounded-md bg-white p-2">
            {partner.logo ? (
              <div className="relative h-full w-full">
                <Image
                  src={partner.logo}
                  alt={partner.name}
                  fill
                  sizes="240px"
                  className="object-contain"
                />
              </div>
            ) : (
              <span className="text-center text-xs font-semibold uppercase tracking-wider text-text-secondary">
                {partner.name}
              </span>
            )}
          </div>
        );

        return (
          <li key={`${partner.name}-${index}`}>
            {partner.website ? (
              <a
                href={partner.website}
                target="_blank"
                rel="noopener noreferrer"
                className="block transition-opacity hover:opacity-80"
                title={partner.name}
              >
                {tile}
              </a>
            ) : (
              tile
            )}
          </li>
        );
      })}
    </ul>
  );
}
