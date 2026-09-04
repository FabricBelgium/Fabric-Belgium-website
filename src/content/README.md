# Content

Everything on the site that is not layout lives here. Editing a file in this
folder and opening a PR is the whole publishing workflow — no CMS.

## `events/`

One markdown file per event, named `YYYY-MM-DD-slug.md`. Frontmatter:

```yaml
title: "Fabric Belgium — September meetup"
date: 2026-09-24 # ISO date, drives sorting and the year buckets
status: upcoming # upcoming | past
startTime: "18:00"
endTime: "21:30"
venue:
  name: "Venue name"
  address: "Street 1"
  city: "Brussels"
  url: "https://maps.example/..."
host: "Host or hosting company"
registerUrl: "https://..."
agenda:
  - time: "18:00"
    title: "Welcome & snacks"
    description: "Optional line of detail"
speakers:
  - name: "Speaker name"
    company: "Optional company"
    talk: "Talk title"
    slidesUrl: "https://..." # added after the event
```

Unknown or misspelled keys are ignored rather than fatal (see
`src/lib/content/events.ts`), so check the rendered page after an edit.

> **Placeholder content.** The events currently in this folder are structural
> placeholders. The real archive (2022–2026: dates, venues, speakers, talk
> titles, hosts and slide links) still has to be migrated off the Squarespace
> site — see step 2 of section 6 in `PROJECT-PLAN.md`.

## `partners.json`

```json
{ "name": "...", "website": "https://...", "logo": "/images/partners/x.png", "tier": "partner" }
```

`tier` is `host | partner | supporter` and controls ordering. `website` is
optional: with it the logo tile becomes a link, without it a plain tile.

### Partner logos are pre-normalised — do not drop raw files in

Every file in `public/images/partners/` is a 480x180 transparent PNG produced
from the original in `assets/Partners/`. Two things happen in that step, and
both matter for how the wall looks:

1. **Conditional trim.** Most originals carry large transparent or white
   margins, which make a logo render small inside its tile. The margin is
   trimmed away — but only when the border is transparent or near-white.
   ConXioN (white text on solid blue) and U2U (white on black) must _not_ be
   trimmed: stripping their ground would leave white marks, invisible on the
   white tile.
2. **Area normalisation.** Each trimmed mark is scaled so it covers the same
   _area_ (40% of the canvas), not so it fits the same bounding box. Fitting
   to a box makes a 6:1 wordmark tower over a 1:1 badge; equal area is what
   makes them read as the same size.

`PartnerLogoGrid` then renders each canvas at one fixed `aspect-[8/3]` tile,
so the normalisation done here is what you see. **The tile ratio and the
canvas ratio have to stay in step** — change one and the sizing drifts.

To add a partner: drop the original in `assets/Partners/`, then

```bash
npm i -D sharp                              # only needed to re-run this
node scripts/normalise-partner-logos.js
```

and add the row to `partners.json`. The slug comes from the filename, so
renaming a source file is safe; `SLUG_OVERRIDES` in the script covers the few
originals whose names do not identify the partner.
