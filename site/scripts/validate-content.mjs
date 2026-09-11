// Validiert content/scenes.json: Jede Behauptung braucht eine Quelle.
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);

const CLAIM_TYPES = new Set(['data', 'contrast', 'quote', 'quiz', 'slider', 'reveal', 'statement']);
const NO_CLAIM_TYPES = new Set(['hero', 'chapterbreak', 'summary', 'sources', 'endcard', 'action']);
const CHART_TYPES = new Set(['bars', 'donut', 'diverging', 'tiles', 'compare']);

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
  // Optionale Felder (Welle 1): next_hook, share, count_scrub, chart-Untertypen
  if (scene.next_hook !== undefined) {
    if (typeof scene.next_hook !== 'string') errors.push(`${where}: next_hook muss string sein`);
    else if (scene.next_hook.length > 60) errors.push(`${where}: next_hook länger als 60 Zeichen (${scene.next_hook.length})`);
  }
  if (scene.share !== undefined && typeof scene.share !== 'string') {
    errors.push(`${where}: share muss string sein`);
  }
  if (scene.count_scrub !== undefined && typeof scene.count_scrub !== 'boolean') {
    errors.push(`${where}: count_scrub muss boolean sein`);
  }
  if (scene.chart !== undefined) {
    if (!CHART_TYPES.has(scene.chart)) {
      errors.push(`${where}: chart "${scene.chart}" unbekannt (erlaubt: ${[...CHART_TYPES].join(', ')})`);
    } else if (scene.type !== 'data') {
      warnings.push(`${where}: chart gesetzt, obwohl Typ ${scene.type} keins rendert`);
    }
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

if (warnings.length) console.warn('⚠ Quellen-Warnungen:\n' + warnings.map((w) => '  - ' + w).join('\n'));
if (errors.length) {
  console.error('✗ Content-Fehler:\n' + errors.map((e) => '  - ' + e).join('\n'));
  process.exit(1);
}
console.log(`✓ ${scenes.length} Szenen geprüft.`);