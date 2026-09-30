/**
 * Regenerates favicon.svg, favicon.ico, and apple-touch-icon.png
 * from the circular crest in src/assets/icons/logo-light.svg.
 *
 *   node scripts/gen-icons.mjs
 */
import sharp from 'sharp';
import { writeFileSync } from 'fs';

const ICON_BG = '#FFFFFF';
const LOGO_SOURCE = 'src/assets/icons/logo-light.svg';

const logo = sharp(LOGO_SOURCE).ensureAlpha();
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

const emblem = await sharp(LOGO_SOURCE)
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

const apple = await sharp(icon).resize(180, 180).png().toBuffer();

await Promise.all([
  sharp(apple).png().toFile('public/apple-touch-icon.png'),
  sharp(icon).resize(32, 32).png().toFile('public/favicon.ico'),
  sharp(icon).resize(32, 32).png().toFile('public/favicon-32.png'),
]);

console.log('✓ favicon.svg ✓ favicon.ico ✓ apple-touch-icon.png');
