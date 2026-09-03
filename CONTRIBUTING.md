# Contributing to the Fabric Belgium website

**`main` is the live site.** Anything that lands on `main` deploys
automatically. Never edit `main` directly — branch, preview, review, merge.

## How a change gets to the live site

1. **Branch off `main`.** Name it by intent: `feat/...`, `fix/...`,
   `content/...` (copy, events, partners), `chore/...` (tooling, config).
2. **Push the branch** (not `main`).
3. **Open a pull request against `main`.** The Azure Static Web Apps bot
   comments with a preview URL within a minute or two.
4. **Review on the preview.** Each push updates the same preview URL.
5. **Merge to `main`.** That's the moment it goes live. The preview
   environment is deleted automatically when the PR closes.

## Running it locally

```bash
npm install
npm run dev      # http://localhost:3000
```

Do not run `npm run build` while `npm run dev` is running — concurrent
builds corrupt the shared `.next` cache. Stop dev, delete `.next`, restart
if that happens.
