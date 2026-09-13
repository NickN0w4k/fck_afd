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
  // Optionale Felder (3.6 Kosten-Du-Rechner): per_head/per_family = Zahl (€), label = Übersetzung
  if (scene.per_head !== undefined) {
    if (typeof scene.per_head !== 'number' || scene.per_head <= 0) {
      errors.push(`${where}: per_head muss positive Zahl sein`);
    } else if (scene.type !== 'slider') {
      warnings.push(`${where}: per_head gesetzt, obwohl Typ ${scene.type} keine Du-Ebene rendert`);
    }
  }
  if (scene.per_family !== undefined) {
    if (typeof scene.per_family !== 'number' || scene.per_family <= 0) {
      errors.push(`${where}: per_family muss positive Zahl sein`);
    } else if (scene.per_head === undefined) {
      errors.push(`${where}: per_family braucht auch per_head (Du-Ebene startet mit pro-Kopf-Betrag)`);
    }
  }
  if (scene.per_family_label !== undefined) {
    if (typeof scene.per_family_label !== 'string' || !scene.per_family_label.trim()) {
      errors.push(`${where}: per_family_label muss nicht-leerer string sein`);
    } else if (scene.per_family_label.length > 90) {
      errors.push(`${where}: per_family_label länger als 90 Zeichen (${scene.per_family_label.length})`);
    }
  }
  if (scene.count_scrub !== undefined && typeof scene.count_scrub !== 'boolean') {
    errors.push(`${where}: count_scrub muss boolean sein`);
  }
  // Optionales Feld (Runde 3): verdict = sichtbare harte Einordnung bei AfD-Zitaten
  if (scene.verdict !== undefined) {
    if (typeof scene.verdict !== 'string' || !scene.verdict.trim()) {
      errors.push(`${where}: verdict muss nicht-leerer string sein`);
    } else if (scene.type !== 'quote' && scene.type !== 'contrast') {
      warnings.push(`${where}: verdict gesetzt, obwohl Typ ${scene.type} kein Verdict-Feld rendert`);
    } else if (scene.verdict.length > 160) {
      warnings.push(`${where}: verdict länger als 160 Zeichen (${scene.verdict.length})`);
    }
  }
  // Optionales Feld (Welle 2): facts [{big, label}] — Recap-Zahlen (Summary), max 6
  if (scene.facts !== undefined) {
    if (!Array.isArray(scene.facts)) {
      errors.push(`${where}: facts muss ein Array sein`);
    } else if (scene.facts.length > 6) {
      errors.push(`${where}: facts darf maximal 6 Einträge haben (${scene.facts.length})`);
    } else {
      scene.facts.forEach((f, j) => {
        if (!f || typeof f !== 'object' || Array.isArray(f)) {
          errors.push(`${where}: facts[${j}] muss ein Objekt {big, label} sein`);
        } else {
          if (typeof f.big !== 'string' || !f.big.trim()) errors.push(`${where}: facts[${j}].big muss nicht-leerer string sein`);
          else if (f.big.length > 24) errors.push(`${where}: facts[${j}].big länger als 24 Zeichen (${f.big.length})`);
          if (typeof f.label !== 'string' || !f.label.trim()) errors.push(`${where}: facts[${j}].label muss nicht-leerer string sein`);
          else if (f.label.length > 60) errors.push(`${where}: facts[${j}].label länger als 60 Zeichen (${f.label.length})`);
        }
      });
    }
    if (scene.type !== 'summary') warnings.push(`${where}: facts gesetzt, obwohl Typ ${scene.type} kein facts-Grid rendert`);
  }
  if (scene.chart !== undefined) {
    if (!CHART_TYPES.has(scene.chart)) {
      errors.push(`${where}: chart "${scene.chart}" unbekannt (erlaubt: ${[...CHART_TYPES].join(', ')})`);
    } else if (scene.type !== 'data') {
      warnings.push(`${where}: chart gesetzt, obwohl Typ ${scene.type} keins rendert`);
    }
  }
  // Optionale Felder (Cleanup-Welle 13.09): sources[] = Zweitquellen je Szene (erscheinen
  // im Quellen-Verzeichnis /quellen/), gleiche Struktur wie source
  if (scene.sources !== undefined) {
    if (!Array.isArray(scene.sources)) errors.push(`${where}: sources muss ein Array sein`);
    else
      scene.sources.forEach((src, j) => {
        if (!src?.url || !src?.label) errors.push(`${where}: sources[${j}] braucht label + url`);
        if (src?.url && !/^https?:\/\//.test(src.url)) errors.push(`${where}: sources[${j}].url kein http(s)-Link`);
        if (src?.url && src?.label && !src?.visited) warnings.push(`${where}: sources[${j}] ohne visited-Datum`);
      });
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
    if (scene.sources !== undefined) {
      if (!Array.isArray(scene.sources)) errors.push(`${where}: sources muss ein Array sein`);
      else
        scene.sources.forEach((src, j) => {
          if (!src?.url || !src?.label) errors.push(`${where}: sources[${j}] braucht label + url`);
        });
    }
  }
});

if (warnings.length) console.warn('⚠ Quellen-Warnungen:\n' + warnings.map((w) => '  - ' + w).join('\n'));
if (errors.length) {
  console.error('✗ Content-Fehler:\n' + errors.map((e) => '  - ' + e).join('\n'));
  process.exit(1);
}
console.log(`✓ ${scenes.length} Szenen geprüft.`);