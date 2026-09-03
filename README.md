# Fabric Belgium website

Next.js + Tailwind + Azure Static Web Apps rebuild of [fabricbelgium.be](https://www.fabricbelgium.be/),
following the same stack and workflow as the Plainsight website.

See [PROJECT-PLAN.md](PROJECT-PLAN.md) for the full build plan: source
content inventory, target architecture, phased roadmap, and open decisions.

## Running it locally

```bash
npm install
npm run dev      # http://localhost:3000
```

Before opening a PR, sanity-check the production build:

```bash
npm run build
```

## Workflow

See [CONTRIBUTING.md](CONTRIBUTING.md). Short version: `main` is production
and auto-deploys, so always branch + PR, never push directly to `main`.
