// Screenshots der neuen Features (Desktop 1280x800).
const { chromium } = require('playwright-core');
const { existsSync } = require('fs');
const path = require('path');
const os = require('os');
const exe = [
  path.join(os.homedir(), '.cache', 'ms-playwright', 'chromium-1234', 'chrome-linux64', 'chrome'),
  path.join(os.homedir(), '.cache', 'ms-playwright', 'chromium-1234', 'chrome-linux', 'chrome'),
].filter(existsSync)[0];

(async () => {
  const b = await chromium.launch({ executablePath: exe, args: ['--no-sandbox'] });
  const p = await b.newPage({ viewport: { width: 1280, height: 800 } });

  await p.goto('http://127.0.0.1:4173/verfassungsschutz/', { waitUntil: 'networkidle' });
  await p.locator('.tl-track').scrollIntoViewIfNeeded();
  await p.waitForTimeout(1500);
  await p.screenshot({ path: '/tmp/timeline.png' });

  await p.goto('http://127.0.0.1:4173/einwaende/', { waitUntil: 'networkidle' });
  await p.waitForTimeout(1000);
  await p.screenshot({ path: '/tmp/einwaende.png' });

  await p.goto('http://127.0.0.1:4173/#scene-2', { waitUntil: 'networkidle' });
  await p.waitForTimeout(1800);
  await p.screenshot({ path: '/tmp/tour-share.png' });

  await b.close();
  console.log('done');
})();