#!/usr/bin/env node
/**
 * Normalise partner logos into public/images/partners/.
 *
 *   npm i -D sharp        # not a default dependency; only needed to re-run this
 *   node scripts/normalise-partner-logos.js
 *
 * Reads every image in assets/Partners/ and writes a 480x180 transparent PNG
 * per partner. Two things happen, and both matter for how the wall looks:
 *
 * 1. Conditional trim. Most originals carry large transparent or white
 *    margins, which make a logo render small inside its tile no matter what
 *    CSS you write. The margin is trimmed away — but ONLY when the border
 *    pixel is transparent or near-white. Logos that are white ink on a solid
 *    ground (ConXioN: white on blue, U2U: white on black) must keep that
 *    ground, or they become invisible on the white tile.
 *
 * 2. Area normalisation. Each trimmed mark is scaled so it covers the same
 *    AREA of the canvas, not so it fits the same bounding box. Fit-to-box
 *    makes a 6:1 wordmark tower over a 1:1 badge; equal area is what makes
 *    them read as the same size.
 *
 * PartnerLogoGrid then renders each canvas at one fixed aspect-[8/3] tile, so
 * the sizing decided here is what ships. Change CANVAS_W/CANVAS_H and you must
 * change that tile ratio to match.
 */
const fs = require("fs");
const path = require("path");

let sharp;
try {
  sharp = require("sharp");
} catch {
  console.error("sharp is not installed. Run:  npm i -D sharp");
  process.exit(1);
}

const ROOT = path.join(__dirname, "..");
const SRC = path.join(ROOT, "assets", "Partners");
const DST = path.join(ROOT, "public", "images", "partners");

const CANVAS_W = 480;
const CANVAS_H = 180;
/** Share of the canvas each logo's ink should occupy. Tuned by eye. */
const TARGET_AREA = CANVAS_W * CANVAS_H * 0.4;

/**
 * Only for files whose name does not give the partner away. Everything else
 * takes its slug from the filename, so renaming a source file is safe.
 */
const SLUG_OVERRIDES = {
  "588802": "kohera",
  channels4_profile: "conxion",
  original: "savaco",
  "logo-datashift-pos-kleur-rgb": "datashift",
  u2u_logo: "u2u",
  cloubis_logo_green: "cloubis",
};

function slugFor(file) {
  const base = path.basename(file, path.extname(file)).toLowerCase();
  return SLUG_OVERRIDES[base] ?? base.replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

/** Is the border transparent or white enough that trimming it is safe? */
async function borderIsBlank(buf) {
  const { data } = await sharp(buf)
    .ensureAlpha()
    .extract({ left: 0, top: 0, width: 1, height: 1 })
    .raw()
    .toBuffer({ resolveWithObject: true });
  const [r, g, b, a] = data;
  if (a < 16) return true;
  return r > 235 && g > 235 && b > 235;
}

(async () => {
  fs.mkdirSync(DST, { recursive: true });
  const files = fs
    .readdirSync(SRC)
    .filter((f) => /\.(png|jpe?g|svg|webp)$/i.test(f));
  const rows = [];

  for (const file of files) {
    const srcPath = path.join(SRC, file);
    const slug = slugFor(file);

    // Rasterise SVG large so the later downscale stays crisp.
    const input = /\.svg$/i.test(file)
      ? await sharp(srcPath, { density: 600 }).resize({ width: 1200 }).png().toBuffer()
      : fs.readFileSync(srcPath);

    let img = sharp(input).ensureAlpha();
    const trimmable = await borderIsBlank(input);
    if (trimmable) img = img.trim({ threshold: 12 });

    const trimmed = await img.png().toBuffer();
    const meta = await sharp(trimmed).metadata();

    const scale = Math.sqrt(TARGET_AREA / (meta.width * meta.height));
    let w = Math.round(meta.width * scale);
    let h = Math.round(meta.height * scale);
    const clamp = Math.min(CANVAS_W / w, CANVAS_H / h, 1);
    w = Math.max(1, Math.round(w * clamp));
    h = Math.max(1, Math.round(h * clamp));

    const scaled = await sharp(trimmed).resize(w, h, { fit: "fill" }).png().toBuffer();

    await sharp({
      create: {
        width: CANVAS_W,
        height: CANVAS_H,
        channels: 4,
        background: { r: 0, g: 0, b: 0, alpha: 0 },
      },
    })
      .composite([{ input: scaled, gravity: "centre" }])
      .png({ compressionLevel: 9, palette: true })
      .toFile(path.join(DST, `${slug}.png`));

    rows.push({
      slug,
      trimmed: trimmable ? "yes" : "no (coloured ground)",
      placed: `${w}x${h}`,
      kb: Math.round(fs.statSync(path.join(DST, `${slug}.png`)).size / 1024),
    });
  }

  console.table(rows);
  console.log(
    `${rows.length} logos, ${rows.reduce((a, r) => a + r.kb, 0)} KB total.` +
      " Remember to add/remove the matching rows in src/content/partners.json.",
  );
})();
