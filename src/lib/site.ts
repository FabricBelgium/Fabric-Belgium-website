/** Single source of truth for nav, contact details and outbound links. */
export const site = {
  name: "Microsoft Fabric Belgium",
  shortName: "Fabric Belgium",
  // Canonical production origin, no trailing slash. Used to build absolute
  // URLs for the sitemap and robots.txt.
  url: "https://www.fabricbelgium.be",
  email: "team@fabricbelgium.be",
  // Share link of the Microsoft Form behind the contact page, or "" while
  // none exists. Read by ContactForm to choose between the embed and the
  // mailto fallback, and by the privacy and cookie notices so their wording
  // describes whichever one this build actually ships.
  contactFormUrl: process.env.NEXT_PUBLIC_CONTACT_FORM_URL ?? "",
  // The Mailchimp audience behind the footer's newsletter signup. The form
  // posts straight to Mailchimp's embedded-form endpoint, so there is no
  // script and no API key on this site: `u` (the account) and `id` (the
  // audience) are public identifiers, the same ones in the hosted form's URL.
  newsletter: {
    action:
      "https://fabricbelgium.us12.list-manage.com/subscribe/post?u=4d27e452d8d14e97a68c1eae4&id=1cbd9d46da",
    // Mailchimp's bot trap: a field people never see, which must reach it empty.
    honeypot: "b_4d27e452d8d14e97a68c1eae4_1cbd9d46da",
  },
  // Legacy company-page slug from before the group renamed to Fabric Belgium.
  // The URL is correct even though it says "power-bi-brussels".
  linkedin: "https://www.linkedin.com/company/power-bi-brussels",
  winterfestUrl: "https://www.fabricwinterfest.be",
} as const;

export const navigation = [
  { label: "Home", href: "/" },
  { label: "Events", href: "/events" },
  { label: "Partnerships", href: "/partnerships" },
  { label: "Contact", href: "/contact" },
] as const;
