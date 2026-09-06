// Headless-Smoke-Test: Tour + Unterseiten. Läuft mit playwright-core + chromium-1234.
const { chromium } = require('playwright-core');
const { existsSync } = require('fs');
const path = require('path');
const os = require('os');

const candidates = [
  process.env.CHROME_PATH,
  path.join(os.homedir(), '.cache', 'ms-playwright', 'chromium-1234', 'chrome-linux64', 'chrome'),
  path.join(os.homedir(), '.cache', 'ms-playwright', 'chromium-1234', 'chrome-linux', 'chrome'),
].filter(Boolean);
const executablePath = candidates.find((p) => existsSync(p));
if (!executablePath) { console.error('✗ kein chromium'); process.exit(1); }

const BASE = process.env.BASE_URL || 'http://127.0.0.1:4173';
let failures = 0;
function check(name, cond) {
  console.log(`${cond ? '✓' : '✗'} ${name}`);
  if (!cond) failures++;
}

(async () => {
  const browser = await chromium.launch({ executablePath, args: ['--no-sandbox'] });
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } }); // Mobile
  const errors = [];
  page.on('pageerror', (e) => errors.push('pageerror: ' + e.message));
  page.on('response', (r) => {
    if (r.status() >= 400) errors.push(`http ${r.status()}: ${r.url()}`);
  });
  page.on('console', (m) => {
    if (m.type() !== 'error') return;
    errors.push('console: ' + m.text());
  });

  // --- Tour ---
  await page.goto(BASE + '/', { waitUntil: 'networkidle' });
  const scenesCount = await page.evaluate(() => document.querySelectorAll('.scene').length);
  check(`Tour: Share-Button je Szene (${scenesCount})`, (await page.locator('.scene-share').count()) === scenesCount && scenesCount >= 25);
  check('Tour: kein Stand-Badge-Overlay mehr (entfernt auf User-Wunsch)', (await page.locator('.stand-badge').count()) === 0);
  check('Tour: Skip-Link', (await page.locator('.skip-link').count()) === 1);
  check('Tour: Timeline mit 6 Karten', (await page.locator('.tl-card').count()) === 6);
  check('Tour: Action-Szene mit 4 Karten', (await page.locator('.action-card').count()) === 4);

  // Share-Popover (Desktop-Chromium hat kein navigator.share)
  const hasNativeShare = await page.evaluate(() => typeof navigator.share === 'function');
  await page.locator('.scene-share').nth(2).click();
  await page.waitForTimeout(300);
  if (hasNativeShare) {
    check('Share: natives Sheet vorhanden (navigator.share)', true);
  } else {
    check('Share: Popover öffnet', await page.locator('#share-sheet').isVisible());
    check('Share: 4 Ziele im Popover', (await page.locator('#share-sheet [data-share-to]').count()) === 4);
    await page.keyboard.press('Escape');
    await page.waitForTimeout(150);
    check('Share: Escape schließt', !(await page.locator('#share-sheet').isVisible()));
  }

  // Quiz: Antwort klicken → Erklärung mit aria-live (erstes Quiz, wo auch immer)
  const quizOpt = page.locator('.quiz .option').first();
  await quizOpt.scrollIntoViewIfNeeded();
  // client:visible-Insel hydratisiert asynchron — erst auf Hydration warten (sonst Click-Race)
  await page.waitForSelector('.quiz astro-island:not([ssr])', { timeout: 5000 });
  await quizOpt.click();
  await page.waitForTimeout(400);
  const live = page.locator('.explanation[aria-live="polite"]');
  check('Quiz: Erklärung aria-live', (await live.count()) >= 1 && (await live.first().isVisible()));

  // Deep-Link: #scene-20 → Szene 20 im Viewport
  await page.goto(BASE + '/#scene-20', { waitUntil: 'networkidle' });
  await page.waitForTimeout(900);
  const hashOK = await page.evaluate(() => {
    const el = document.getElementById('scene-20');
    const r = el.getBoundingClientRect();
    return r.top > -el.offsetHeight && r.top < window.innerHeight;
  });
  check('Deep-Link: #scene-20 landet in Szene 20', hashOK);

  // URL folgt dem Scrollen
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(900);
  const hashCleared = await page.evaluate(() => location.hash === '' || location.hash === '#scene-0');
  check('Deep-Link: Hash folgt Scrollen', hashCleared);

  // --- Unterseiten ---
  for (const p of ['/einwaende/', '/verfassungsschutz/', '/quellen/', '/fazit/', '/impressum/']) {
    await page.goto(BASE + p, { waitUntil: 'networkidle' });
    const h1 = await page.locator('h1').first().textContent();
    check(`Seite ${p}: H1 da (${(h1 || '').trim().slice(0, 30)})`, !!h1 && h1.trim().length > 2);
    check(`Seite ${p}: canonical`, await page.locator('link[rel="canonical"]').count() === 1);
    check(`Seite ${p}: og:image`, await page.locator('meta[property="og:image"]').count() === 1);
    await page.locator('.doc-tour-link').click({ timeout: 3000 }).catch(() => {});
    await page.waitForTimeout(300);
    // Base-korrekt: /fck_afd ODER /fck_afd/ sind beides gültige Tour-Ziele
    const landed = page.url().replace(/#.*$/, '').replace(/\/$/, '');
    check(`Seite ${p}: Tour-Link zurück zur /`, landed === BASE.replace(/\/$/, ''));
    await page.goto(BASE + p, { waitUntil: 'networkidle' });
  }

  // Sitemap + robots (base-aware: BASE enthält ggf. /fck_afd)
  const basePath = new URL(BASE + '/').pathname; // z.B. /fck_afd/
  const sm = await page.evaluate(async (u) => (await fetch(u)).text(), `${basePath}sitemap.xml`);
  check('sitemap.xml: 10 URLs', (sm.match(/<loc>/g) || []).length === 10);
  const rb = await page.evaluate(async (u) => (await fetch(u)).text(), `${basePath}robots.txt`);
  check('robots.txt: Sitemap-Zeile', rb.includes('Sitemap:'));

  console.log('\nJS-Fehler gesamt:', errors.length ? errors.slice(0, 10) : 'keine');
  check('keine JS-Fehler', errors.length === 0);

  await browser.close();
  console.log(failures === 0 ? '\nALL GREEN' : `\n${failures} FAILURES`);
  process.exit(failures === 0 ? 0 : 1);
})().catch((e) => { console.error(e); process.exit(1); });