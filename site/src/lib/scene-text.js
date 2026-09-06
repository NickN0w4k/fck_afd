// Baut aus einer Szene einen kurzen, teilbaren Text (für navigator.share + Popover).
// Wird build-time in index.astro und den Kapitel-Unterseiten verwendet.

/** @param {any} scene @param {string} [chapterTitle] */
export function sceneShareText(scene, chapterTitle) {
  const clean = (s) => String(s ?? '').replace(/\s+/g, ' ').trim();
  switch (scene.type) {
    case 'hero':
      return clean(`${scene.title} ${scene.subtitle ?? ''}`);
    case 'statement':
      return clean(scene.text);
    case 'data':
      return clean(scene.headline + (scene.caption ? ` — ${scene.caption}` : ''));
    case 'quiz':
      return clean(`Quiz: ${scene.question}`);
    case 'quote':
      return clean(`„${scene.quote}" — ${scene.author}`);
    case 'reveal':
      return clean(scene.headline || scene.teaser || scene.body);
    case 'contrast':
      return clean(`Behauptung: ${scene.claim} — Realität: ${scene.reality.replace(/^!/, '')}`);
    case 'slider':
      return clean(scene.prompt);
    case 'chapterbreak':
      return clean(`Kapitel: ${chapterTitle ?? scene.title ?? ''}`);
    case 'summary':
      return 'Das Wichtigste in Kürze — die Fakten zur AfD.';
    case 'endcard':
      return 'Teile die Fakten.';
    case 'sources':
      return 'Alle Quellen — jede Behauptung belegt.';
    case 'timeline':
      return clean(scene.headline || 'Wie die AfD zum Verfassungsschutz-Thema wurde');
    case 'action':
      return clean(scene.headline || 'Was du jetzt tun kannst.');
    default:
      return '';
  }
}