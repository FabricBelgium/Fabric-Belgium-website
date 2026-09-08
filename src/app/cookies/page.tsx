import type { Metadata } from "next";
import Link from "next/link";
import { LegalPage } from "@/components/legal/LegalPage";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Cookie statement",
  description:
    "This site sets no cookies and runs no analytics, which is why you were never asked to accept any.",
};

const OUTBOUND = [
  { name: "Microsoft Forms", what: "event registration", href: "https://forms.office.com" },
  { name: "Weeztix", what: "Winterfest ticketing", href: "https://weeztix.shop" },
  { name: "LinkedIn", what: "our community page", href: site.linkedin },
  { name: "Fabric Winterfest", what: "the Winterfest site", href: site.winterfestUrl },
  { name: "pdfhost.io", what: "speaker slide downloads", href: "https://pdfhost.io" },
];

export default function CookiesPage() {
  return (
    <LegalPage
      title="Cookie statement"
      intro="Short version: this site does not use cookies. That is also why it never shows you a cookie banner."
    >
      <h2>We set no cookies</h2>
      <p>
        Browsing this website stores nothing on your device. There are no cookies, no local or
        session storage, no tracking pixels, no fingerprinting and no third-party scripts running
        on these pages.
      </p>
      <p>
        Because nothing is stored and nothing is tracked, there is no consent for us to ask for.
        Under the EU ePrivacy rules a consent banner is required when a site stores or reads
        information on your device beyond what is strictly necessary to deliver the page you asked
        for. We do neither, so you get the site instead of a pop-up.
      </p>

      <h2>No analytics</h2>
      <p>
        We run no analytics or visitor-statistics product — no Google Analytics, no heatmaps, no
        A/B testing. We do not count you, and we could not tell you how many people read this
        page.
      </p>

      <h2>Fonts are served from this site</h2>
      <p>
        The typefaces are downloaded and bundled into this site when it is built, and served from
        our own domain. Your browser never contacts Google&rsquo;s font servers, so your IP address
        is not disclosed to them by loading a page here.
      </p>

      <h2>Where cookies do start: links off this site</h2>
      <p>
        Several things we point you at are hosted by other people. The moment you follow one of
        these links you are on their site, and they may set their own cookies under their own
        policies:
      </p>
      <ul>
        {OUTBOUND.map((item) => (
          <li key={item.name}>
            <a href={item.href} target="_blank" rel="noopener noreferrer">
              {item.name}
            </a>{" "}
            — {item.what}
          </li>
        ))}
      </ul>
      <p>
        We have no control over, and take no responsibility for, what those services store. Check
        their own cookie and privacy notices if you want the detail.
      </p>

      <h2>Server logs are not cookies</h2>
      <p>
        Our host records ordinary request data, including IP addresses, to serve pages and keep the
        site secure. That happens on the server rather than on your device, and it is not used to
        track you across sites. It is covered in the{" "}
        <Link href="/privacy">privacy policy</Link>.
      </p>

      <h2>If this changes</h2>
      <p>
        If we ever add something that needs a cookie, we will ask for your consent before it runs,
        give you a way to refuse or withdraw it, and update this page. Adding it quietly and
        showing you a banner afterwards is not something we intend to do.
      </p>
      <p>
        Questions about any of this: <a href={`mailto:${site.email}`}>{site.email}</a>.
      </p>
    </LegalPage>
  );
}
