// Validiert content/scenes.json: Jede Behauptung braucht eine Quelle.
// Prüft zusätzlich: Impressum-Vollständigkeit (site/src/lib/impressum.js).
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const { IMPRESSUM, IMPRESSUM_UNVOLLSTAENDIG } = require('../src/lib/impressum.js');

const CLAIM_TYPES = new Set(['data', 'contrast', 'quote', 'quiz', 'slider', 'reveal', 'statement']);
const NO_CLAIM_TYPES = new Set(['hero', 'chapterbreak', 'summary', 'sources', 'endcard', 'action']);

const raw = JSON.parse(readFileSync(new URL('../../content/scenes.json', import.meta.url), 'utf-8'));
const scenes = raw.scenes ?? raw;
const errors = [];
const warnings = [];

scenes.forEach((scene, i) => {
  const where = `scene #${i + 1} (${scene.type}, chapter=${scene.chapter ?? '?'})`;
  if (!scene.type) errors.push(`${where}: type fehlt`);
  if (CLAIM_TYPES.has(scene.type) && !scene.source) {
    warnings.push(`${where}: keine source — Behauptung unbelegt!`);
  } else if (scene.source) {
    if (!scene.source.url || !scene.source.label) errors.push(`${where}: source braucht label + url`);
    if (!scene.source.visited) warnings.push(`${where}: source ohne visited-Datum`);
    if (scene.source.url && !/^https?:\/\//.test(scene.source.url)) errors.push(`${where}: source.url kein http(s)-Link`);
  }
  if (NO_CLAIM_TYPES.has(scene.type) && scene.source) {
    warnings.push(`${where}: hat source, obwohl Typ keine Behauptung enthält`);
  }
  // Timeline: jede Karte braucht date + title + text; Quellen je Karte prüfen
  if (scene.type === 'timeline') {
    if (!Array.isArray(scene.items) || scene.items.length < 3) {
      errors.push(`${where}: timeline braucht mindestens 3 items`);
    }
    (scene.items ?? []).forEach((item, j) => {
      if (!item.date || !item.title || !item.text) errors.push(`${where}: item #${j + 1} braucht date + title + text`);
      const src = item.source;
      if (src) {
        if (!src.url || !src.label) errors.push(`${where}: item #${j + 1} source braucht label + url`);
        if (!src.visited) warnings.push(`${where}: item #${j + 1} source ohne visited-Datum`);
        if (src.url && !/^https?:\/\//.test(src.url)) errors.push(`${where}: item #${j + 1} source.url kein http(s)-Link`);
      } else {
        warnings.push(`${where}: item #${j + 1} ohne Quelle`);
      }
    });
  }
});

if (IMPRESSUM_UNVOLLSTAENDIG) {
  warnings.push('Impressum: Platzhalter in site/src/lib/impressum.js noch nicht ausgefüllt (Name/Anschrift) — /impressum/ zeigt Warnung, bis echte Daten drin stehen.');
}
if (warnings.length) console.warn('⚠ Quellen-Warnungen:\n' + warnings.map((w) => '  - ' + w).join('\n'));
if (errors.length) {
  console.error('✗ Content-Fehler:\n' + errors.map((e) => '  - ' + e).join('\n'));
  process.exit(1);
}
console.log(`✓ ${scenes.length} Szenen geprüft.`);