import type { Metadata } from "next";
import Link from "next/link";
import { LegalPage } from "@/components/legal/LegalPage";
import { legalEntity } from "@/lib/legal";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Legal notice",
  description:
    "Who runs Fabric Belgium, how to reach us, and the terms that apply to using this website.",
};

function Detail({ value, label }: { value: string | null; label: string }) {
  if (value) return <>{value}</>;
  return (
    <span className="rounded bg-surface-subtle px-1.5 py-0.5 font-semibold text-text">
      [{label} to be confirmed]
    </span>
  );
}

export default function LegalNoticePage() {
  return (
    <LegalPage
      title="Legal notice"
      intro="Who is behind this website, and the terms on which it is offered."
    >
      <h2>Who runs this site</h2>
      <dl>
        <dt>Name</dt>
        <dd>
          <Detail value={legalEntity.name} label="legal name" />
        </dd>

        <dt>Address</dt>
        <dd>
          <Detail value={legalEntity.address} label="address" />
        </dd>

        <dt>Email</dt>
        <dd>
          <a href={`mailto:${site.email}`}>{site.email}</a>
        </dd>

        <dt>Enterprise number (KBO/BCE)</dt>
        <dd>
          <Detail value={legalEntity.enterpriseNumber} label="enterprise number" />
        </dd>

        <dt>VAT number</dt>
        <dd>
          <Detail value={legalEntity.vatNumber} label="VAT number" />
        </dd>
      </dl>
      <p>
        Fabric Belgium is a volunteer-run community for data professionals working with Microsoft
        Fabric. Meetups are free to attend and are funded by the partners who host them.
      </p>

      <h2>Not affiliated with Microsoft</h2>
      <p>
        Fabric Belgium is an independent community group. It is not affiliated with, endorsed by,
        sponsored by or operated by Microsoft Corporation.
      </p>
      <p>
        Microsoft, Microsoft Fabric, Power BI, Azure and related names and logos are trademarks of
        the Microsoft group of companies. They are used here only to describe the technology this
        community is about — a descriptive, nominative use, claiming no rights in those marks.
      </p>

      <h2>Content on this site</h2>
      <p>
        The text, design and code of this website belong to the people who run Fabric Belgium,
        unless stated otherwise. Partner names and logos remain the property of those companies and
        are shown with their agreement.
      </p>
      <p>
        Presentation slides linked from the events archive remain the property of the speakers who
        wrote them, and are hosted on external services rather than here. If you are a speaker and
        want a link removed, email <a href={`mailto:${site.email}`}>{site.email}</a> and we will
        take it down.
      </p>

      <h2>Accuracy and availability</h2>
      <p>
        We keep event details, dates and venues as accurate as we can, but they are subject to
        change and occasionally to error — always check the registration page before travelling.
        We make no guarantee that this site will be available uninterrupted or free of mistakes,
        and we are not liable for loss arising from relying on information here, to the extent the
        law permits.
      </p>

      <h2>Links to other sites</h2>
      <p>
        Where we link to registration forms, ticketing, slides, partner sites or LinkedIn, those
        services are run by other people. We do not control them and are not responsible for their
        content or their handling of your data. The <Link href="/cookies">cookie statement</Link>{" "}
        lists the ones we link to most.
      </p>

      <h2>Personal data</h2>
      <p>
        How we handle personal data is set out in the <Link href="/privacy">privacy policy</Link>.
      </p>

      <h2>Applicable law</h2>
      <p>
        This notice and any dispute arising from the use of this website are governed by Belgian
        law, and the courts of Belgium have jurisdiction — without affecting any mandatory
        protection you have as a consumer in the country where you live.
      </p>
    </LegalPage>
  );
}
