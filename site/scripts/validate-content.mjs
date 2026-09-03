// Validiert content/scenes.json: Jede Behauptung braucht eine Quelle.
import { readFileSync } from 'node:fs';

const CLAIM_TYPES = new Set(['data', 'contrast', 'quote', 'quiz', 'slider', 'reveal', 'statement']);
const NO_CLAIM_TYPES = new Set(['hero', 'chapterbreak', 'summary', 'sources']);

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
});

if (warnings.length) console.warn('⚠ Quellen-Warnungen:\n' + warnings.map((w) => '  - ' + w).join('\n'));
if (errors.length) {
  console.error('✗ Content-Fehler:\n' + errors.map((e) => '  - ' + e).join('\n'));
  process.exit(1);
}
console.log(`✓ ${scenes.length} Szenen geprüft.`);