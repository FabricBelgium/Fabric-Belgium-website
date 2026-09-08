import type { Metadata } from "next";
import { SectionContainer } from "@/components/common/SectionContainer";
import { Tag } from "@/components/common/Tag";
import { ContactForm } from "@/components/forms/ContactForm";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact",
  description: "Reach the Fabric Belgium organising team about events, speaking or partnerships.",
};

// Placeholder page for Phase 2 (see PROJECT-PLAN.md). The form backend is
// still an open decision — ContactForm handles both paths.
export default function ContactPage() {
  return (
    <main>
      <SectionContainer narrow>
        <Tag>Contact</Tag>
        <h1 className="mt-4 text-4xl md:text-5xl">Get in touch</h1>
        <p className="mt-4 text-lg normal-case leading-relaxed tracking-normal text-text-secondary">
          Or email us directly at{" "}
          <a
            href={`mailto:${site.email}`}
            className="font-semibold underline underline-offset-2 hover:text-brand-500"
          >
            {site.email}
          </a>
          .
        </p>
        <div className="mt-10">
          <ContactForm />
        </div>
      </SectionContainer>
    </main>
  );
}
