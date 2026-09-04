# `components/ui` — third-party / generated components

The rest of `src/components/` is organised by role (`layout/`, `sections/`,
`events/`, `partners/`, `forms/`, `common/`). This folder is different on
purpose: **it holds components pasted in from outside the repo** — shadcn/ui,
21st.dev, v0, and similar generators.

## Why the folder has to exist under this exact name

Every one of those generators emits imports written as
`@/components/ui/<name>`. shadcn's CLI writes to that path by default, and its
registry entries hardcode it. If we filed these under `sections/` or
`common/` instead, then every paste would need its import lines rewritten by
hand, every future `npx shadcn@latest add …` would land in the wrong place,
and the diff between "what upstream published" and "what we run" would grow
until nobody could tell which local edits were deliberate.

Keeping the folder means a pasted component works unmodified, and the
role-based folders stay a map of _our_ design system rather than a mix of ours
and other people's.

## This is not a full shadcn/ui project

We have the two things shadcn components actually need — Tailwind CSS and
TypeScript — but not the rest of the setup:

- no `components.json` (the shadcn CLI's config)
- no `src/lib/utils.ts` with the `cn()` helper
- no CSS-variable theme (`--background`, `--foreground`, …); this repo uses
  semantic Tailwind tokens (`brand`, `surface`, `text`) from
  `tailwind.config.ts` instead
- no Radix UI primitives, `class-variance-authority`, `tailwind-merge`, or
  `tailwindcss-animate`

Components that only need Tailwind classes — like the two below — drop in
fine. If you paste one that imports `cn` or a Radix primitive, run
`npx shadcn@latest init` first (answer "src/app/globals.css" for the CSS file
and keep the `@/*` alias), then `npx shadcn@latest add <component>`. Do that
as its own PR: `init` rewrites `globals.css` and `tailwind.config.ts`, and
those need reviewing against our brand tokens rather than being taken as-is.

## What is in here

### `hero-shader.tsx` — `ShaderBackground`

WebGL mesh-gradient backdrop from `@paper-design/shaders-react`, used by
`sections/Hero.tsx`.

Changes from the upstream snippet:

- **Brand palette.** The demo shipped purple/black
  (`#8b5cf6`, `#4c1d95`, …). Exported as `fabricMeshDark` (default) and
  `fabricMeshLight`, both built from the exact `tailwind.config.ts` hexes.
  Swap the preset on the `colors` prop to flip the hero light or dark.
- **`backgroundColor` and `wireframe` props removed.** Neither exists on
  `MeshGradientParams` in `@paper-design/shaders-react` 0.0.80 — they are from
  an older API and would not type-check. The flat colour moved to the wrapper
  div; the second layer uses `swirl`/`distortion`/`grainOverlay` for the depth
  the wireframe pass used to give.
- **`prefers-reduced-motion`.** Speed drops to `0`, which stops `ShaderMount`'s
  render loop entirely rather than just freezing it visually.
- **`isActive` is wired up.** Upstream set the hover state but never read it;
  here it nudges the animation speed on hover.
- **`minHeight` is an inline style, not a class.** A default `min-h-[650px]`
  plus a `min-h-[…]` passed through `className` are equal specificity, so the
  winner would depend on generated CSS order.

The library pauses rendering on its own when the tab is hidden or the element
scrolls out of the viewport, so no extra intersection handling is needed.

### `animated-gradient-background.tsx` — `AnimatedGradientBackground`

Radial "breathing" CSS gradient, used by `sections/WinterfestBanner.tsx`
(breathing) and the dark variant of `sections/CTASection.tsx` (static).

Changes from the upstream snippet:

- **Imports from `motion/react`, not `framer-motion`.** They are the same
  library — `motion` v12 is framer-motion's current name — and `motion` is
  already a direct dependency here, with `framer-motion` present only
  underneath it. Importing the declared package keeps one dependency instead
  of two.
- **Brand palette** as the default `gradientColors`, replacing the rainbow.
- **No idle animation frame loop.** With `Breathing` off, the gradient string
  never changes, so upstream's permanent `requestAnimationFrame` loop
  repainted an identical value forever. It now paints once and stops. Same
  pixels, no idle main-thread work.
- **`prefers-reduced-motion`** disables both the breathing and the 2s
  entrance animation.

Pass `containerClassName="pointer-events-none -z-10"` wherever you use it —
it is an `absolute inset-0` layer and will otherwise sit on top of the content
it is meant to sit behind.

> Hoist `gradientColors` / `gradientStops` to module constants at the call
> site. They are `useEffect` dependencies, so inline array literals give a new
> identity on every render and restart the effect each time.
