import type { Metadata } from "next";
import Link from "next/link";
import { LegalPage } from "@/components/legal/LegalPage";
import { legalEntity, supervisoryAuthority } from "@/lib/legal";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Privacy policy",
  description:
    "What personal data Fabric Belgium collects, why, how long it is kept, and the rights you have over it.",
};

/** Renders a confirmed value, or a visible marker when it is still unknown. */
function Detail({ value, label }: { value: string | null; label: string }) {
  if (value) return <>{value}</>;
  return (
    <span className="rounded bg-surface-subtle px-1.5 py-0.5 font-semibold text-text">
      [{label} to be confirmed]
    </span>
  );
}

export default function PrivacyPage() {
  return (
    <LegalPage
      title="Privacy policy"
      intro="We collect as little as possible: this site has no analytics, no advertising and no tracking. The only personal data we hold is what you send us yourself."
    >
      <h2>Who is responsible for your data</h2>
      <p>
        The data controller for this website is <Detail value={legalEntity.name} label="legal name" />
        , at <Detail value={legalEntity.address} label="address" />. You can reach us at{" "}
        <a href={`mailto:${site.email}`}>{site.email}</a> for anything in this policy.
      </p>

      <h2>What we collect, and why</h2>

      <h3>Messages you send us</h3>
      <p>
        The contact form asks for your first name, last name, email address, a subject and your
        message. It is delivered to the organising team&rsquo;s shared mailbox and nowhere else. We
        use it only to read and answer what you sent.
      </p>
      <p>
        The legal basis is our legitimate interest in responding to people who contact us (GDPR
        Art. 6(1)(f)). Where your message is about becoming a partner, we also process it to take
        steps at your request before entering into an agreement (Art. 6(1)(b)).
      </p>
      <p>
        Giving us this data is entirely voluntary — but without an email address we have no way to
        reply. You can always write to <a href={`mailto:${site.email}`}>{site.email}</a> directly
        instead of using the form.
      </p>

      <h3>Server logs</h3>
      <p>
        This site is hosted on Microsoft Azure Static Web Apps. Like any web host, it processes
        technical request data — including your IP address, the page requested, and your browser
        type — to deliver pages and to keep the service secure and available. The legal basis is
        our legitimate interest in operating a working, secure website (Art. 6(1)(f)). We do not
        use these logs to build profiles or to identify individual visitors.
      </p>

      <h2>What we do not do</h2>
      <ul>
        <li>No analytics or visitor statistics of any kind.</li>
        <li>No advertising, ad networks or remarketing.</li>
        <li>No profiling, and no automated decision-making.</li>
        <li>No selling, renting or sharing your data with third parties for their own purposes.</li>
        <li>
          No cookies or similar tracking technologies — see the{" "}
          <Link href="/cookies">cookie statement</Link>.
        </li>
        <li>No newsletter or marketing mail unless you explicitly ask to be added.</li>
      </ul>

      <h2>Who else can see it</h2>
      <p>
        The organisers running Fabric Belgium can read messages sent to the shared mailbox.
        Beyond that, our hosting and email providers process data on our behalf as processors,
        under contract and on our instructions. We do not otherwise disclose your data, unless we
        are legally required to.
      </p>
      <p>
        Microsoft is a US-headquartered provider. Where personal data is transferred outside the
        European Economic Area, it is covered by the safeguards Microsoft offers for its cloud
        services, including the EU Standard Contractual Clauses.
      </p>

      <h2>How long we keep it</h2>
      <p>
        Contact messages are kept for{" "}
        <Detail value={legalEntity.contactRetention} label="retention period" /> and then deleted.
        We keep something longer only where we have to — for example an agreement with a partner,
        which is kept for as long as the law requires.
      </p>

      <h2>Your rights</h2>
      <p>Under the GDPR you can ask us to:</p>
      <ul>
        <li>give you a copy of the personal data we hold about you;</li>
        <li>correct it if it is wrong or incomplete;</li>
        <li>delete it;</li>
        <li>restrict how we use it, or object to us using it;</li>
        <li>send it to you, or to someone else, in a portable format.</li>
      </ul>
      <p>
        Email <a href={`mailto:${site.email}`}>{site.email}</a> and we will respond within one
        month. There is no charge. We may need to confirm who you are first, so that we do not
        hand your data to somebody else.
      </p>
      <p>
        If you are not happy with how we have handled it, you can complain to the Belgian
        supervisory authority, the {supervisoryAuthority.name}, at {supervisoryAuthority.address} (
        <a href={`mailto:${supervisoryAuthority.email}`}>{supervisoryAuthority.email}</a>,{" "}
        <a href={supervisoryAuthority.url} target="_blank" rel="noopener noreferrer">
          {supervisoryAuthority.url.replace("https://", "")}
        </a>
        ). You can also complain to the authority where you live or work.
      </p>

      <h2>Other sites we link to</h2>
      <p>
        Event registration, ticketing, slide downloads and our LinkedIn page are hosted elsewhere.
        Once you follow one of those links you are on someone else&rsquo;s site, under their
        privacy policy and their cookies — not ours. The{" "}
        <Link href="/cookies">cookie statement</Link> lists which ones.
      </p>

      <h2>Changes</h2>
      <p>
        If we change how we handle personal data, we will update this page and the date at the top
        of it. If a change is significant — new tracking, say, or a new recipient of your data —
        we will ask for your consent first where the law requires it.
      </p>
    </LegalPage>
  );
}
