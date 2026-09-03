# Fabric Belgium Website — Build Plan (Squarespace -> Next.js + Tailwind + Azure SWA)

This plan follows the same playbook Plainsight used to move `plainsight.pro`
off Squarespace (see `reference-plainsight-website/MIGRATION-PLAN.md` in the
sibling folder), scaled down and adapted for Fabric Belgium's smaller,
community-focused site.

## 1) Scope and goals

- Rebuild `fabricbelgium.be` from Squarespace to the same Next.js + Tailwind +
  Azure Static Web Apps stack as the Plainsight site.
- Preserve the event history, speaker/session archive, partner list, and
  contact/partnership flows.
- Give the community a maintainable content model: adding a new event or
  partner should be a markdown/JSON edit + PR, not a Squarespace form.
- Keep the existing brand identity (gold, black, white, the Fabric triangle
  mark, city-skyline motif) rather than redesigning it.

## 2) Source inventory (from fabricbelgium.be, captured 2026-09-03)

### Pages

| Page | Path | Content |
|------|------|---------|
| Home | `/` | Hero tagline ("Empower every data professional with a community to grow Fabric expertise from peers and create a vibrant community"), 3 CTA buttons (Events / Partnerships / Contact), a highlighted banner linking to Fabric Winterfest, a "thanks to our partners" logo section |
| Events | `/events` | Next event block: date, full agenda (welcome/snacks/sessions/networking with times), venue, two speaker sessions (name + talk title), host, register CTA. Below it, a past-events archive grouped by year (2022-2026), each entry with date, title/venue, and per-speaker slide links |
| Partnerships | `/partnerships` | "Becoming a Fabric Belgium partner" pitch, partner logo grid, contact CTA |
| Contact | `/contact-1` | Contact form (first name, last name, email, subject, message), team email (`team@fabricbelgium.be`), LinkedIn link |

### Related property

- **Fabric Winterfest** (`fabricwinterfest.be`) — the flagship annual event,
  currently a separate domain/site, cross-linked from the Fabric Belgium
  homepage banner. Decision needed: keep it external (as today) or fold an
  events-detail page into this site. See open decisions below.

### Footer / global

- Org name: "Microsoft Fabric Belgium"
- Email: `team@fabricbelgium.be`
- LinkedIn: `linkedin.com/company/power-bi-brussels` (legacy company-page slug
  from before the group renamed to Fabric Belgium — keep the link, just note
  the mismatch)
- Built on Squarespace (confirmed via `/cart` route and CDN asset host
  `images.squarespace-cdn.com`)

## 3) Brand direction (updated 2026-09-03 — new look, not a Squarespace clone)

The old site's gold/black/white palette (sampled below for the record) is
**superseded**. The new site uses a palette set explicitly for this rebuild:

| Token | Value | Role |
|-------|-------|------|
| Green | `#3CC789` | `brand-500` — primary CTA / highlight color |
| Off-white | `#FCFAFA` | `surface` — page background |
| Slate | `#545F66` | `text-secondary` |
| Near-black | `#1D1C1C` | `text` default + `surface-ink` (dark sections: footer, CTA banners) |

Full tonal ramps (50-950 for `brand`, plus `surface`/`text` variants) are
already in `tailwind.config.ts`. Still open: the logo itself likely needs a
refresh to sit well on this palette (see open decisions) — the current
Squarespace logo is teal/gold-coded.

### For reference: old site's sampled colors (no longer used)

| Token | Value | Source |
|-------|-------|--------|
| Gold | `#E5B110` | Computed style of the "EVENTS" button |
| Black / text | `#111111` (approx.) | Body headings render as pure black; banner box is near-black |
| White / surface | `#FFFFFF` | Body background |
| Type family | Poppins (Google Font) | `font-family` on buttons and headings, kept in the new palette too |
| Motif | City skyline watercolor illustration behind the hero | Background image on homepage — still under consideration for the new look |
| Logo | `logo microsoft fabric belgium website.png` on Squarespace CDN | Triangle mark + "MICROSOFT FABRIC BELGIUM" wordmark |

## 4) Target architecture

Same stack as `plainsight-website`, right-sized:

- **Framework:** Next.js 14 (App Router), TypeScript, static export
  (`output: "export"`, `images.unoptimized: true` — same image pipeline rule
  applies: the file you commit is the file every visitor downloads)
- **Styling:** Tailwind CSS with semantic tokens (`brand`, `accent`,
  `surface`, `text`) instead of hardcoded hex
- **Hosting:** Azure Static Web Apps, GitHub Actions CI/CD, PR preview URLs
- **Content:** Markdown + frontmatter for events, JSON for partners/sponsors
  (no blog — Fabric Belgium doesn't currently publish one; leave the
  structure extensible if that changes)
- **Forms:** Contact + "become a partner" -- HubSpot embed if Fabric Belgium
  gets its own HubSpot portal/forms, otherwise an Azure Function that emails
  `team@fabricbelgium.be` (mirrors `api/src/functions/job-application.js` in
  the reference repo)
- **Analytics:** GA4 (optional, matches reference site's pattern)

### Project structure

```txt
src/
  app/
    page.tsx                   # Home
    events/
      page.tsx                 # Upcoming + past events archive
      [slug]/page.tsx           # Single event detail (agenda, speakers, slides)
    partnerships/page.tsx
    contact/page.tsx
  components/
    layout/                    # SiteHeader, SiteFooter
    sections/                  # Hero, WinterfestBanner, CTASection
    events/                    # EventCard, EventAgenda, SpeakerCard, PastEventsArchive
    partners/                  # PartnerLogoGrid, BecomePartnerCTA
    forms/                     # ContactForm
    common/                    # Button, Tag, SectionContainer
  content/
    events/                    # one .md per event, frontmatter: date, title,
                                # venue, status (upcoming|past), agenda[],
                                # speakers[{name, title, slidesUrl}], host
    partners.json               # { name, logoUrl, website, tier }
  lib/
    content/                   # markdown/JSON loaders
    seo/                       # metadata + JSON-LD (Organization, Event)
public/
  images/                      # logo, favicon, brand SVGs (small, static set)
  staticwebapp.config.json
api/
  src/functions/
    contact-submission.js      # fallback if no HubSpot portal
```

## 5) Component library (MVP)

- `SiteHeader` — logo, nav (Home / Events / Partnerships / Contact), sticky
- `SiteFooter` — org name, email, LinkedIn, legal links if needed
- `Hero` — tagline + 3 CTA buttons, skyline background
- `WinterfestBanner` — highlighted dark box linking to fabricwinterfest.be
  (or an internal event page, pending the open decision below)
- `EventCard` / `EventAgenda` / `SpeakerCard` — next-event detail block
- `PastEventsArchive` — grouped by year, expandable, links to slide decks
- `PartnerLogoGrid` — logo wall, used on both Home and Partnerships
- `BecomePartnerCTA` — pitch block + contact link
- `ContactForm` — name/email/subject/message, posts to HubSpot or the Azure
  Function fallback

## 6) Content migration

1. Transcribe home hero copy, partnership pitch copy, and contact copy
   directly from the live site (captured above).
2. Rebuild the event archive as markdown files under `src/content/events/`,
   one per event, back to 2022 — carry over dates, venues, speakers, talk
   titles, hosts, and slide-deck links.
3. Source the **partner/sponsor logo files** — these did not render as
   image elements in the automated capture (likely lazy-loaded or an embed);
   get the original files from whoever manages the Squarespace site, or
   re-export them from the live page manually.
4. Source the **logo source file** (SVG/AI if it exists) to get exact brand
   hex values instead of the sampled/approximated ones in this repo's
   `tailwind.config.ts`.
5. Set up redirects from old Squarespace paths (`/contact-1` -> `/contact`,
   etc.) once the new site is ready to take over the domain.

## 7) Repo, CI/CD, and workflow

Mirrors the reference repo's proven setup, already scaffolded in this repo:

- `main` is production (renamed from the reference's `master` — new GitHub
  repos default to `main`); it auto-deploys to Azure Static Web Apps on
  merge.
- Every PR gets an automatic preview URL via `.github/workflows/azure-swa-deploy.yml`
  (already added to this repo, pointed at `main`).
- Branch naming: `feat/...`, `fix/...`, `content/...`, `chore/...`.
- `npm install && npm run dev` locally; `npm run build` before opening a PR.

**Still needed (infra, not code):**
- An Azure Static Web Apps resource for this site, and its deploy token
  stored as the `AZURE_STATIC_WEB_APPS_API_TOKEN` GitHub secret.
- A decision on the contact-form backend (HubSpot portal vs. Azure Function)
  before wiring `ContactForm`.

## 8) Phased execution plan

### Phase 0 — Foundation (done in this session)
- Next.js + Tailwind + TypeScript scaffold, lint/format config.
- Draft brand tokens from sampled site styles.
- GitHub Actions workflow for Azure SWA (branch/PR preview + `main` deploy).
- New GitHub repo created and pushed.

### Phase 1 — Global UI and brand system
- Build `SiteHeader`, `SiteFooter`, `Hero`, `Button`, `SectionContainer`.
- Get the real logo source file and confirm exact brand colors.
- Reference `VISUAL-GUIDELINES.md` from the Plainsight repo for the pattern
  to follow (component-driven, tokenized, documented) — not its actual
  navy/orange palette.

### Phase 2 — Core pages
- Home (hero, Winterfest banner, partner logo strip).
- Partnerships (pitch, logo grid, CTA).
- Contact (working form, wired to HubSpot or the Azure Function fallback).
- Mobile responsiveness and accessibility pass.

### Phase 3 — Events content and archive
- Event detail template (agenda, speakers, venue, register CTA).
- Past-events archive by year, migrated from the live site's history.
- SEO: per-page metadata, `Organization` + `Event` JSON-LD, sitemap.

### Phase 4 — QA and launch
- Cross-browser/responsive QA.
- Redirect map from old Squarespace slugs.
- DNS cutover for `fabricbelgium.be` to Azure Static Web Apps.
- Post-launch monitoring.

## 9) Open decisions (need an answer before/while building)

1. ~~Exact brand colors~~ — resolved: green `#3CC789` / off-white `#FCFAFA` /
   slate `#545F66` / near-black `#1D1C1C` (see section 3). ~~Logo~~ — also
   resolved: the official mark (`public/images/logo-mark.png`, transparent
   background, sourced from a speaker-announcement graphic) already fits
   this palette. Still open: no wordmark/text-lockup version has shown up
   yet — for now the header pairs the icon mark with a text wordmark
   rendered in code (Poppins), not a combined logo image. Swap in a real
   lockup file if/when one exists.
2. **Fabric Winterfest relationship** — keep `fabricwinterfest.be` as a
   separate external site (current state), or bring it into this repo as a
   page?
3. **Contact-form backend** — does Fabric Belgium have (or want) its own
   HubSpot portal, or should the Azure Function + email fallback be the
   permanent solution?
4. **Newsletter / community sign-up** — not present on the current site;
   worth adding?
5. **Azure subscription** — which Azure tenant/subscription hosts the new
   Static Web App (Plainsight's, or a separate one for Fabric Belgium)?
6. **Partner/sponsor logos and current partner list** — need the source
   files and an up-to-date list (the live page's logo section didn't expose
   image URLs to the automated capture).
7. **Domain/DNS access** — who controls the `fabricbelgium.be` DNS for the
   eventual cutover?

## 10) Definition of done

- Home, Events (with full archive), Partnerships, and Contact live on
  Next.js, matching the current brand.
- Contact and partnership inquiries reach the team reliably.
- Event history and speaker/slide links fully migrated.
- `fabricbelgium.be` pointed at the new Azure Static Web Apps deployment.
- Preview-per-PR workflow working, same as the Plainsight site.
