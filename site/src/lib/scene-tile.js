// Fakten-Kachel-Baukasten (Welle 3, Stufe A — 3.4 Teilen-pro-Szene):
// Baut aus einer Szene den Kachel-Inhalt {big, label, source} — plus den
// Share-Text (wird von lib/scene-text.js und Client-Code gleichermaßen genutzt).
// Reine Funktionen, keine DOM/Canvas-Abhängigkeit → läuft Build-time UND Client.
// Ein Format: eine große Akzent-Zahl/Zitat-Zeile + Label + Quellen-Label.

const clean = (s) => String(s ?? '').replace(/\s+/g, ' ').trim();

/**
 * Kachel-Inhalt für eine Szene: {big, label, source}.
 * big = große Zeile (Zahl/Zitat/Kernsatz), label = Kontext-Zeile, source = Quellen-Label.
 * @param {any} scene
 * @returns {{ big: string, label: string, source: string }}
 */
export function sceneTileContent(scene) {
  const srcLabel = (s) => s?.source?.label ?? s?.sourceLabel ?? '';
  switch (scene?.type) {
    case 'hero':
      return { big: clean(scene.title) || 'Die AfD.', label: clean(scene.subtitle), source: 'Die Fakten — jede mit Quelle' };
    case 'statement':
      return { big: clean(scene.text), label: clean(scene.note ?? 'Alles mit Beleg. Immer.'), source: srcLabel(scene) || 'Alles mit Beleg. Immer.' };
    case 'chapterbreak':
      return { big: clean(scene.title) || `Kapitel`, label: 'Weiter im Kapitel scrollen', source: '' };
    case 'data': {
      const n = typeof scene.value === 'number' ? scene.value.toLocaleString('de-DE', { maximumFractionDigits: 1 }) : '';
      return { big: n ? `${n}${scene.suffix ?? ''}` : clean(scene.headline), label: clean(scene.caption || scene.headline), source: srcLabel(scene) };
    }
    case 'quiz': {
      const correct = (scene.options ?? []).find((o) => o.correct);
      return {
        big: correct ? clean(correct.text) : clean(scene.question),
        label: clean(scene.question),
        source: srcLabel(scene),
      };
    }
    case 'quote': {
      // Runde 3: Verdict in die Kachel — aber nur erster Satz (Label max-height clippt sonst)
      const verdictLine = clean(scene.verdict ?? '').split(/(?<=\.)\s/)[0] ?? '';
      return { big: clean(scene.quote), label: `— ${clean(scene.author)}${verdictLine ? ` — ${verdictLine}` : ''}`, source: srcLabel(scene) };
    }
    case 'reveal':
      return { big: clean(scene.headline || scene.teaser), label: clean(scene.body || scene.teaser), source: srcLabel(scene) };
    case 'contrast': {
      const bare = clean(scene.claim).replace(/^[„"«]+/, '').replace(/[”"“»]+$/, '');
      return {
        big: `„${bare}“`,
        label: clean(scene.reality),
        source: srcLabel(scene),
      };
    }
    case 'slider': {
      const unit = clean(scene.unit);
      return { big: clean(scene.prompt), label: `Antwort: ${scene.answer ?? '?'}${unit ? ` ${unit}` : ''}`, source: srcLabel(scene) };
    }
    case 'summary':
      return { big: 'Das Wichtigste in Kürze', label: 'Sechs Fakten — jede mit Quelle.', source: '' };
    case 'action':
      return { big: clean(scene.headline || 'Was du jetzt tun kannst'), label: (scene.cards ?? []).map((c) => clean(c.title)).join(' · '), source: '' };
    case 'endcard':
      return { big: 'Teile die Fakten.', label: 'Die komplette Tour: jede Szene, jede Quelle.', source: '' };
    case 'sources':
      return { big: 'Alle Quellen', label: 'Jede Behauptung belegt — alle URLs archiviert.', source: '' };
    case 'timeline': {
      const item = (scene.items ?? [])[0];
      return {
        big: clean(item?.title || scene.headline || 'Zeitleiste'),
        label: item ? `${clean(item.date)} — ${clean(item.text)}` : clean(scene.headline),
        source: item?.source?.label ?? srcLabel(scene),
      };
    }
    default:
      return { big: clean(scene?.title ?? scene?.headline ?? ''), label: clean(scene?.subtitle ?? ''), source: srcLabel(scene) };
  }
}

/**
 * Share-Text für eine Szene (Web-Share + Popover + Kachel-Deep-Link-Footer).
 * scene.share hat Vorrang, sonst lib/scene-text.js-Fallback.
 * @param {any} scene @param {string} [chapterTitle] @returns {string}
 */
export function sceneShareText(scene, chapterTitle) {
  if (typeof scene?.share === 'string' && scene.share.trim()) return clean(scene.share);
  return clean(sceneTextFallback(scene, chapterTitle));
}

/** Fallback (1:1 aus src/lib/scene-text.js — client-seitig ohne Build-Import verfügbar) */
function sceneTextFallback(scene, chapterTitle) {
  switch (scene?.type) {
    case 'hero':
      return `${scene.title} ${scene.subtitle ?? ''}`;
    case 'statement':
      return scene.text;
    case 'data':
      return scene.headline + (scene.caption ? ` — ${scene.caption}` : '');
    case 'quiz':
      return `Quiz: ${scene.question}`;
    case 'quote':
      return `„${scene.quote}" — ${scene.author}`;
    case 'reveal':
      return scene.headline || scene.teaser || scene.body;
    case 'contrast':
      return `Behauptung: ${scene.claim} — Realität: ${scene.reality.replace(/^!/, '')}`;
    case 'slider':
      return scene.prompt;
    case 'chapterbreak':
      return `Kapitel: ${chapterTitle ?? scene.title ?? ''}`;
    case 'summary':
      return 'Das Wichtigste in Kürze — die Fakten zur AfD.';
    case 'endcard':
      return 'Teile die Fakten.';
    case 'sources':
      return 'Alle Quellen — jede Behauptung belegt.';
    case 'timeline':
      return scene.headline || 'Wie die AfD zum Verfassungsschutz-Thema wurde';
    case 'action':
      return scene.headline || 'Was du jetzt tun kannst.';
    default:
      return '';
  }
}