// Rendert og-image/template.html zu public/og-image.png (1200x630).
// Nutzt playwright-core + chromium-1234 aus ~/.cache/ms-playwright (Muster aus soulhouse).
// Lauf: node scripts/og-image.mjs  (oder npm run og)
import { chromium } from 'playwright-core';
import { existsSync, statSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url))); // site/
const candidates = [
  process.env.CHROME_PATH,
  path.join(process.env.HOME ?? '', '.cache', 'ms-playwright', 'chromium-1234', 'chrome-linux64', 'chrome'),
  path.join(process.env.HOME ?? '', '.cache', 'ms-playwright', 'chromium-1234', 'chrome-linux', 'chrome'),
].filter(Boolean);

const executablePath = candidates.find((p) => existsSync(p));
if (!executablePath) {
  console.error('✗ Kein Chromium gefunden. Setze CHROME_PATH=/pfad/zum/chrome');
  process.exit(1);
}

const outPath = path.join(root, 'public', 'og-image.png');

const browser = await chromium.launch({
  executablePath,
  args: ['--no-sandbox', '--disable-gpu', '--force-color-profile=srgb'],
});
const page = await browser.newPage({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1 });
await page.goto('file://' + path.join(root, 'og-image', 'template.html'));
await page.waitForFunction(() => document.fonts.ready.then(() => document.fonts.status === 'loaded'));
await page.waitForTimeout(300); // Glow-Filter durchrendern lassen
await page.screenshot({ path: outPath, clip: { x: 0, y: 0, width: 1200, height: 630 } });
await browser.close();

const size = statSync(outPath).size;
console.log(`✓ og-image.png geschrieben: ${outPath} (${Math.round(size / 1024)} KB)`);
if (size < 40_000) {
  console.error('✗ PNG verdächtig klein — vermutlich Render-Fehler.');
  process.exit(1);
}