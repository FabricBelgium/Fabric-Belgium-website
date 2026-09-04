import type { Metadata } from "next";
import { SectionContainer } from "@/components/common/SectionContainer";
import { BecomePartnerCTA } from "@/components/partners/BecomePartnerCTA";
import { PartnerLogoGrid } from "@/components/partners/PartnerLogoGrid";
import { getPartners } from "@/lib/content/partners";

export const metadata: Metadata = {
  title: "Partnerships",
  description:
    "Host an evening, reach Belgian data practitioners, and keep Fabric Belgium meetups free to attend.",
};

// Placeholder page for Phase 2 (see PROJECT-PLAN.md), built from the same
// components as the homepage so the navigation works today.
export default function PartnershipsPage() {
  const partners = getPartners();

  return (
    <main>
      <SectionContainer>
        <BecomePartnerCTA />
      </SectionContainer>

      <SectionContainer className="bg-surface-muted">
        <h2 className="text-3xl md:text-4xl">Our partners</h2>
        <PartnerLogoGrid partners={partners} className="mt-10" />
      </SectionContainer>
    </main>
  );
}
