// Pro-Szene OG-Images (Welle 3, Stufe A — nova §5): rendert pro Szene ein
// 1200×630-PNG (Zahl/Zitat + Quellen-Label + Kapitel-Akzent) nach public/og/scene-N.png.
// Muster aus scripts/og-image.mjs: playwright-core + chromium-1234, HTML→Screenshot.
import { chromium } from 'playwright-core';
import { mkdirSync, writeFileSync, readFileSync, existsSync, statSync, rmSync } from 'node:fs';
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

// Szenen + Kapitel direkt aus dem Content lesen (Build-Kontext, kein Astro-Import nötig)
const contentRoot = process.env.CONTENT_ROOT ?? path.join(root, '..', 'content');
const scenesRaw = JSON.parse(readFileSync(path.join(contentRoot, 'scenes.json'), 'utf-8'));
const scenes = scenesRaw.scenes ?? scenesRaw;
const chapters = JSON.parse(readFileSync(path.join(contentRoot, 'chapters.json'), 'utf-8'));
const chapterById = Object.fromEntries(chapters.map((c) => [c.id, c]));

// sceneTileContent aus src/lib/scene-tile.js (gleiche Quelle wie Client + Astro)
const { sceneTileContent } = await import('../src/lib/scene-tile.js');

const outDir = path.join(root, 'public', 'og');
mkdirSync(outDir, { recursive: true });
const tmpDir = path.join(root, 'og-image', '.scene-tmp');
mkdirSync(tmpDir, { recursive: true });

const escapeHtml = (s) =>
  String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

// OG-Layout: große Zeile (Zahl/Zitat) + Label + Quellen-Label + Prüf-Footer
const tileTemplate = (tile, accent, siteUrl, stripes) => `<!doctype html>
<html lang="de">
<head>
<meta charset="utf-8" />
<style>
  @font-face {
    font-family: 'SpaceGrotesk';
    src: url('file://${path.join(root, 'node_modules', '@fontsource-variable', 'space-grotesk', 'files', 'space-grotesk-latin-wght-normal.woff2')}') format('woff2');
    font-weight: 300 700;
  }
  @font-face {
    font-family: 'InterOg';
    src: url('file://${path.join(root, 'node_modules', '@fontsource-variable', 'inter', 'files', 'inter-latin-wght-normal.woff2')}') format('woff2');
    font-weight: 100 900;
  }
  * { margin: 0; padding: 0; box-sizing: border-box; }
  html, body { width: 1200px; height: 630px; overflow: hidden; }
  body {
    background: #0a0a0a;
    color: #f5f2ec;
    font-family: 'SpaceGrotesk', sans-serif;
    position: relative;
    display: flex;
    flex-direction: column;
    padding: 40px 64px 30px;
  }
  .glow {
    position: absolute;
    width: 640px; height: 640px; top: -360px; left: -180px;
    border-radius: 50%;
    filter: blur(90px);
    opacity: 0.5;
    background: radial-gradient(circle, ${accent}66, transparent 70%);
    pointer-events: none;
  }
  .grain { position: absolute; inset: 0; opacity: 0.5;
    background-image: repeating-linear-gradient(0deg, rgba(255,255,255,0.014) 0 1px, transparent 1px 3px); }
  .stripe { position: absolute; left: 0; right: 0; height: 16px; overflow: hidden; pointer-events: none; }
  .stripe--top { top: 0; }
  .stripe--bottom { bottom: 0; }
  .stripe__inner {
    position: absolute; top: -8px; left: 0; right: 0; bottom: -8px;
    background: repeating-linear-gradient(45deg, transparent 0 22px, rgba(255,77,46,0.5) 22px 38px);
  }
  .kicker {
    font-size: 22px; letter-spacing: 0.3em; text-transform: uppercase;
    color: #9b968c; margin-bottom: 20px; position: relative;
  }
  .big {
    font-size: 64px; font-weight: 700; line-height: 1.08; letter-spacing: -0.01em;
    color: ${accent}; position: relative;
    display: -webkit-box; -webkit-line-clamp: 4; -webkit-box-orient: vertical; overflow: hidden;
  }
  .label {
    margin-top: 18px; font-size: 26px; font-weight: 500; color: #c9c4ba;
    line-height: 1.4; position: relative; max-height: 150px; overflow: hidden;
  }
  .source {
    margin-top: 22px; font-size: 20px; color: #9b968c; position: relative;
    border-left: 5px solid ${accent}; padding-left: 18px;
    display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;
  }
  .footer {
    margin-top: auto; display: flex; justify-content: space-between; align-items: baseline;
    font-size: 22px; letter-spacing: 0.06em; color: #9b968c;
    border-top: 1px solid rgba(245,242,236,0.14); padding-top: 14px; position: relative;
  }
  .footer .site { color: #f5f2ec; font-weight: 700; font-family: 'SpaceGrotesk', sans-serif; }
  .footer .check { color: ${accent}; font-weight: 600; font-family: 'SpaceGrotesk', sans-serif; }
</style>
</head>
<body>
  <div class="glow"></div>
  <div class="grain"></div>
${stripes}
  <p class="kicker">Szene ${String(tile.num + 1).padStart(2, '0')} · FAKTEN-KACHEL</p>
  <div class="big">${escapeHtml(tile.big)}</div>
  ${tile.label ? `<p class="label">${escapeHtml(tile.label)}</p>` : ''}
  ${tile.source ? `<p class="source">Quelle: ${escapeHtml(tile.source)}</p>` : ''}
  <div class="footer">
    <span class="check">PRÜF ES SELBST →</span>
    <span class="site">${escapeHtml(siteUrl)}</span>
  </div>
</body>
</html>`;

// Kachel-Basis: siteUrl ohne Protokoll (wie sharecard-Footer)
const siteUrl = (process.env.SITE_URL ?? 'https://info-afd.de/').replace(/^https?:\/\//, '').replace(/\/$/, '');
const stripes =
  '  <div class="stripe stripe--top"><div class="stripe__inner"></div></div>\n' +
  '  <div class="stripe stripe--bottom"><div class="stripe__inner"></div></div>';

const browser = await chromium.launch({
  executablePath,
  args: ['--no-sandbox', '--disable-gpu', '--force-color-profile=srgb'],
});
const page = await browser.newPage({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1 });

let rendered = 0;
for (let i = 0; i < scenes.length; i++) {
  const scene = scenes[i];
  const accent = chapterById[scene.chapter]?.accent ?? '#ff4d2e';
  const tile = sceneTileContent(scene);
  const html = tileTemplate({ ...tile, num: i }, accent, siteUrl, stripes);
  const htmlPath = path.join(tmpDir, `scene-${i}.html`);
  writeFileSync(htmlPath, html);
  await page.goto('file://' + htmlPath, { waitUntil: 'load' });
  await page.waitForFunction(() => document.fonts.ready.then(() => document.fonts.status === 'loaded'));
  await page.waitForTimeout(120); // Glow-Filter durchrendern lassen
  const outPath = path.join(outDir, `scene-${i}.png`);
  await page.screenshot({ path: outPath, clip: { x: 0, y: 0, width: 1200, height: 630 } });
  const size = statSync(outPath).size;
  if (size < 20_000) {
    console.error(`✗ scene-${i}.png verdächtig klein (${Math.round(size / 1024)} KB) — Render-Fehler?`);
    process.exit(1);
  }
  rendered++;
  if (rendered % 10 === 0) console.log(`… ${rendered}/${scenes.length} OG-Images`);
}
await browser.close();
rmSync(tmpDir, { recursive: true, force: true });
console.log(`✓ ${rendered} Szenen-OG-Images nach public/og/ geschrieben`);