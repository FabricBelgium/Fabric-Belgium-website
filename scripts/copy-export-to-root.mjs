/**
 * Copies the `out/` static export into the repository root.
 *
 * This exists only while the repository's Pages source is still "Deploy from a
 * branch" (`main` / `/`). In that mode GitHub Pages serves the committed files
 * in the root, while `.github/workflows/deploy-pages.yml` publishes a freshly
 * built artifact — two publishers for one site, and the later one wins. Keeping
 * the root copy in step with the source means whichever wins serves the same
 * pages, instead of the live site flipping between current and stale.
 *
 * Once an admin sets Settings -> Pages -> Source to "GitHub Actions", the branch
 * build stops, this script and every generated file it copies can be deleted,
 * and the workflow becomes the only publisher.
 *
 * Stale chunks are pruned: `_next` filenames are content-hashed, so copying
 * without deleting leaves every past build's assets behind in git forever.
 */
import { cp, readdir, rm, stat } from "node:fs/promises";
import { existsSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const outDir = join(repoRoot, "out");

if (!existsSync(outDir)) {
  console.error("out/ not found — run `npm run build` first.");
  process.exit(1);
}

// Replaced wholesale rather than merged, so hashed assets from earlier builds
// do not accumulate.
const nextDir = join(repoRoot, "_next");
if (existsSync(nextDir)) await rm(nextDir, { recursive: true, force: true });

const entries = await readdir(outDir);
for (const entry of entries) {
  await cp(join(outDir, entry), join(repoRoot, entry), { recursive: true });
}

// .nojekyll ships from public/, so `readdir` (which does list dotfiles) has
// already copied it. Assert it anyway: without it Jekyll silently drops the
// whole underscore-prefixed _next tree and the site renders unstyled.
if (!existsSync(join(repoRoot, ".nojekyll"))) {
  console.error(".nojekyll missing from the export — Pages would drop _next/. Check public/.");
  process.exit(1);
}

const { size } = await stat(join(repoRoot, "index.html"));
console.log(`Copied ${entries.length} entries to the repo root (index.html ${size} bytes).`);
console.log("Commit the changed root files so the branch build serves this version too.");
