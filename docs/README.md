# docs

## Component prompts

`*.prompt.md` are the original integration briefs for the third-party
components vendored into [`src/components/ui/`](../src/components/ui/) — the
generator's own output, kept verbatim as provenance.

| Prompt | Component |
|---|---|
| [hero-shader.prompt.md](hero-shader.prompt.md) | `ui/hero-shader.tsx` — WebGL mesh gradient |
| [animated-gradient-background.prompt.md](animated-gradient-background.prompt.md) | `ui/animated-gradient-background.tsx` — radial breathing gradient |
| [story-scroll.prompt.md](story-scroll.prompt.md) | `ui/story-scroll.tsx` — GSAP pinned/rotating panels |

**Read these as history, not as instructions.** None of the three components
matches its prompt: each was adapted for this repo's API versions, brand
tokens, accessibility and layout constraints. Two of the briefs are also
written for a stack we do not run — they assume a full shadcn/ui project and
Tailwind 4, while this repo is Tailwind 3 with semantic brand tokens and no
`components.json`.

The deviations, and the reason for each, are recorded in
[`src/components/ui/README.md`](../src/components/ui/README.md). That file is
the one to trust when the two disagree.
