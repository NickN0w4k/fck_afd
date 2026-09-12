// Wheel-Protokoll: 1 Maus-Raster = exakt 1 Szenenwechsel? (Desktop-Regressionstest)
// Hintergrund (12.09., Nick-Feedback „Seite 2 klemmt“): Der Smoke-Test deckt Wheel-Gesten
// NICHT ab — ein Debounce-Race (Straddle über 150ms) ließ goTo mehrfach aus In-Flight-
// Position feuern und übersprang Szenen, obwohl smoke ALL GREEN zeigte. Dieses Script
// fährt Einzel-Notches und Multi-Event-Bursts (echte Maus-Feel) Geste für Geste nach.
//
// Nutzung:  node scripts/wheel-protocol.cjs [URL]     (Default: http://127.0.0.1:4173/)
//           benötigt laufenden Preview-Server (npx astro preview --port 4173)
// Exit 0 = Protokoll sauber · Exit 1 = mind. eine Anomalie (Details im Log)
const { chromium } = require('playwright-core');
const path = require('path');
const os = require('os');
const fs = require('fs');

const candidates = [
  process.env.CHROME_PATH,
  path.join(os.homedir(), '.cache', 'ms-playwright', 'chromium-1234', 'chrome-linux64', 'chrome'),
  path.join(os.homedir(), '.cache', 'ms-playwright', 'chromium-1234', 'chrome-linux', 'chrome'),
].filter(Boolean);
const executablePath = candidates.find((p) => fs.existsSync(p));
if (!executablePath) { console.error('✗ kein chromium gefunden'); process.exit(1); }

const URL = process.argv[2] || 'http://127.0.0.1:4173/';
const ANOMALIE_LIMIT = 1; // Pin-Etappen zählen als +0 — 1 „gleiche Szene“ pro Pin ist OK

(async () => {
  const browser = await chromium.launch({ executablePath, args: ['--no-sandbox'] });
  const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
  await page.goto(URL, { waitUntil: 'networkidle' });
  await page.waitForTimeout(1500);

  const state = () => page.evaluate(() => {
    const scenes = Array.from(document.querySelectorAll('.scene'));
    const vh = window.innerHeight;
    let vis = -1, best = 0;
    scenes.forEach((s, i) => {
      const r = s.getBoundingClientRect();
      const visible = Math.max(0, Math.min(r.bottom, vh) - Math.max(r.top, 0));
      if (visible > best) { best = visible; vis = i; }
    });
    return { y: Math.round(window.scrollY), scene: vis, total: scenes.length };
  });

  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(400);

  const failures = [];
  let prev = await state();
  console.log(`Wheel-Protokoll gegen ${URL} (start: szene ${prev.scene}/${prev.total - 1})`);

  // Ein Notch, 2s Ruhe: MUSS exakt +1 Szene geben (Pin: +0 Etappe ist erlaubt)
  let pinBudget = 0; // Pin-Szenen erlauben bis zu 3× „+0“ (Etappen)
  for (let g = 1; g <= 10; g++) {
    await page.mouse.wheel(0, 100);
    await page.waitForTimeout(2000);
    const now = await state();
    const delta = now.scene - prev.scene;
    const ok = delta === 1 || (delta === 0 && pinBudget < 3 && g > 1);
    if (delta === 0 && ok) pinBudget++;
    console.log(`  notch ${String(g).padStart(2)}: szene ${now.scene} (${delta >= 0 ? '+' : ''}${delta}) ${ok ? '✓' : '✗'}`);
    if (!ok || delta > 1 || delta < 0) failures.push({ notch: g, von: prev.scene, nach: now.scene, y: now.y });
    prev = now;
  }

  // Burst: 3 Events à 40ms wie eine echte Maus-Geste — darf nie > +2 (Coalescing) und
  // nie rückwärts; Kerncheck: Szene N+1 wird nie übersprungen (der ursprüngliche Bug)
  console.log('  burst: 3 Events à 40ms (Maus-Rutteln)');
  for (let g = 1; g <= 5; g++) {
    const before = (await state()).scene;
    for (let k = 0; k < 3; k++) { await page.mouse.wheel(0, 100); await page.waitForTimeout(40); }
    await page.waitForTimeout(1400);
    const now = await state();
    const delta = now.scene - before;
    const ok = delta >= 1 && delta <= 2;
    console.log(`  burst ${String(g).padStart(2)}: szene ${now.scene} (${delta >= 0 ? '+' : ''}${delta}) ${ok ? '✓' : '✗'}`);
    if (!ok) failures.push({ burst: g, von: before, nach: now.scene });
    prev = now;
  }

  await browser.close();
  if (failures.length === 0) {
    console.log('✓ WHEEL-PROTOKOLL SAUBER: 1 Raster = 1 Szene, keine Skips');
    process.exit(0);
  }
  console.error(`✗ ${failures.length} ANOMALIE(N): ${JSON.stringify(failures)}`);
  process.exit(1);
})().catch((e) => { console.error(e); process.exit(1); });