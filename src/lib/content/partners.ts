import partnersData from "@/content/partners.json";

export type PartnerTier = "host" | "partner" | "supporter";

export interface Partner {
  name: string;
  website?: string;
  /** Path under /public/images/partners. Falls back to a wordmark tile. */
  logo?: string;
  tier: PartnerTier;
}

const TIER_ORDER: PartnerTier[] = ["host", "partner", "supporter"];

export function getPartners(): Partner[] {
  return (partnersData as Partner[])
    .slice()
    .sort(
      (a, b) =>
        TIER_ORDER.indexOf(a.tier) - TIER_ORDER.indexOf(b.tier) || a.name.localeCompare(b.name),
    );
}
