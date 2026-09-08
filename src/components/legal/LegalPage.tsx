import { SectionContainer } from "@/components/common/SectionContainer";
import { Tag } from "@/components/common/Tag";
import { hasUnconfirmedDetails, lastUpdated, unconfirmedFields } from "@/lib/legal";

/**
 * Long-form prose on a site whose base layer uppercases every heading. Legal
 * text has to stay readable at length, so headings are pulled back to sentence
 * case and normal tracking here rather than inheriting the display treatment.
 */
const PROSE = [
  "mt-10 space-y-8 text-sm normal-case leading-relaxed tracking-normal text-text-secondary",
  "[&_h2]:mt-12 [&_h2]:text-lg [&_h2]:normal-case [&_h2]:tracking-normal [&_h2]:text-text",
  "[&_h3]:mt-8 [&_h3]:text-base [&_h3]:normal-case [&_h3]:tracking-normal [&_h3]:text-text",
  "[&_p]:mt-3 [&_ul]:mt-3 [&_ul]:list-disc [&_ul]:space-y-1.5 [&_ul]:pl-5",
  "[&_dl]:mt-3 [&_dt]:font-semibold [&_dt]:text-text [&_dd]:mb-2",
  "[&_a]:font-semibold [&_a]:text-text [&_a]:underline [&_a]:underline-offset-2 hover:[&_a]:text-brand-500",
].join(" ");

interface LegalPageProps {
  title: string;
  /** One line under the title saying what this document is for. */
  intro: string;
  children: React.ReactNode;
}

export function LegalPage({ title, intro, children }: LegalPageProps) {
  return (
    <main>
      <SectionContainer narrow>
        <Tag>Legal</Tag>
        <h1 className="mt-4 text-3xl md:text-4xl">{title}</h1>
        <p className="mt-4 text-sm normal-case leading-relaxed tracking-normal text-text-secondary">
          {intro}
        </p>
        <p className="mt-2 text-xs normal-case tracking-normal text-text-muted">
          Last updated{" "}
          <time dateTime={lastUpdated}>
            {new Date(lastUpdated).toLocaleDateString("en-GB", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </time>
        </p>

        {hasUnconfirmedDetails && <DraftNotice />}

        <div className={PROSE}>{children}</div>
      </SectionContainer>
    </main>
  );
}

/**
 * Deliberately loud and deliberately not dismissible. This text is a draft
 * until the entity details in lib/legal.ts are confirmed, and a visitor
 * reading an unfinished privacy notice should be told so.
 */
function DraftNotice() {
  return (
    <div
      role="note"
      className="mt-8 rounded-card border border-surface-border bg-surface-muted p-5 text-sm normal-case leading-relaxed tracking-normal text-text-secondary"
    >
      <p className="font-semibold text-text">Draft — not yet in force</p>
      <p className="mt-2">
        This document is still missing details that only the organisers can confirm (
        {unconfirmedFields.join(", ")}). It has not been reviewed by a lawyer and should not be
        relied on until it has been. Until then, email us and we will answer any question about
        your data directly.
      </p>
    </div>
  );
}
