/**
 * Regenerates favicon.svg, favicon.ico, apple-touch-icon.png, and og-image.jpg
 * from the circular crest in src/assets/icons/logo.png.
 *
 *   node scripts/gen-icons.mjs
 */
import sharp from 'sharp';
import { writeFileSync } from 'fs';

/** Keep in sync with src/brand.ts */
const BRAND_DARK = '#21201F';
const ICON_BG = '#FFFFFF';
const BRAND_ACCENT = '#964025';
const BRAND_CREAM = '#F2EBE6';
const BRAND_MUTED = '#D6CCC6';

const logo = sharp('src/assets/icons/logo.png').ensureAlpha();
const { data, info } = await logo.raw().toBuffer({ resolveWithObject: true });
const { width, height, channels } = info;

const colInk = [];
for (let x = 0; x < width; x++) {
  let ink = 0;
  for (let y = 0; y < height; y++) {
    if (data[(y * width + x) * channels + 3] > 20) ink++;
  }
  colInk.push(ink);
}

const startX = colInk.findIndex((n) => n > 2);
let endX = startX;
while (endX < width && colInk[endX] > 2) endX++;

let minY = height;
let maxY = 0;
for (let y = 0; y < height; y++) {
  for (let x = startX; x < endX; x++) {
    if (data[(y * width + x) * channels + 3] > 20) {
      if (y < minY) minY = y;
      if (y > maxY) maxY = y;
    }
  }
}

const emblem = await sharp('src/assets/icons/logo.png')
  .extract({ left: startX, top: minY, width: endX - startX, height: maxY - minY + 1 })
  .png()
  .toBuffer();

const side = Math.max(endX - startX, maxY - minY + 1);
const canvas = Math.round(side * 1.12);
const fitted = await sharp(emblem)
  .resize(side, side, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
  .png()
  .toBuffer();
const fittedMeta = await sharp(fitted).metadata();
const pad = Math.round((canvas - fittedMeta.width) / 2);

const mark = await sharp({
  create: {
    width: canvas,
    height: canvas,
    channels: 4,
    background: { r: 0, g: 0, b: 0, alpha: 0 },
  },
})
  .composite([{ input: fitted, left: pad, top: pad }])
  .png()
  .toBuffer();

const icon = await sharp({
  create: {
    width: canvas,
    height: canvas,
    channels: 4,
    background: ICON_BG,
  },
})
  .composite([{ input: fitted, left: pad, top: pad }])
  .png()
  .toBuffer();

const faviconSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${canvas} ${canvas}" width="32" height="32" role="img" aria-label="Vaifoou Construction">
  <rect width="${canvas}" height="${canvas}" fill="${ICON_BG}"/>
  <image width="${canvas}" height="${canvas}" href="data:image/png;base64,${mark.toString('base64')}"/>
</svg>
`;
writeFileSync('public/favicon.svg', faviconSvg);

const ogBase = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630">
  <rect width="1200" height="630" fill="${BRAND_DARK}"/>
  <rect x="0" y="0" width="8" height="630" fill="${BRAND_ACCENT}"/>
  <text x="360" y="300" font-family="Arial,sans-serif" font-size="64" font-weight="700" fill="${BRAND_CREAM}">Vaifoou Construction</text>
  <text x="362" y="358" font-family="Arial,sans-serif" font-size="28" fill="${BRAND_MUTED}">O'ahu masonry and concrete since 2000</text>
</svg>`);

const tile = await sharp(
  Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="240" height="240">
    <rect width="240" height="240" rx="36" fill="${BRAND_CREAM}"/>
  </svg>`),
)
  .composite([{ input: await sharp(mark).resize(200, 200).png().toBuffer(), left: 20, top: 20 }])
  .png()
  .toBuffer();

const apple = await sharp(icon).resize(180, 180).png().toBuffer();

await Promise.all([
  sharp(apple).png().toFile('public/apple-touch-icon.png'),
  sharp(icon).resize(32, 32).png().toFile('public/favicon.ico'),
  sharp(icon).resize(32, 32).png().toFile('public/favicon-32.png'),
  sharp(ogBase)
    .composite([{ input: tile, left: 72, top: 195 }])
    .jpeg({ quality: 92 })
    .toFile('src/assets/images/og-image.jpg'),
]);

console.log('✓ favicon.svg ✓ favicon.ico ✓ apple-touch-icon.png ✓ og-image.jpg');
