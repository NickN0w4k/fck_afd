// Szenen-Teilen + Deep-Links:
//  - [data-share] öffnet nativen Share-Dialog (navigator.share) oder Popover-Fallback
//    (Telegram / WhatsApp / X / Link kopieren)
//  - Jede Szene hat eine Anker-ID (#scene-N); URL wird beim Scrollen szenengenau gehalten
//  - Hash beim Laden → direkt in die Szene springen

const SHARE_SHEET_ID = 'share-sheet';

/** Popover-Fallback: kleines Menü mit Deeplinks */
function ensureSheet() {
  let sheet = document.getElementById(SHARE_SHEET_ID);
  if (sheet) return sheet;
  sheet = document.createElement('div');
  sheet.id = SHARE_SHEET_ID;
  sheet.className = 'share-sheet';
  sheet.setAttribute('role', 'menu');
  sheet.hidden = true;
  sheet.innerHTML = `
    <p class="share-sheet__label">Szene teilen</p>
    <button data-share-to="telegram" role="menuitem">Telegram</button>
    <button data-share-to="whatsapp" role="menuitem">WhatsApp</button>
    <button data-share-to="x" role="menuitem">X / Twitter</button>
    <button data-share-to="copy" role="menuitem">Link kopieren</button>
  `;
  document.body.appendChild(sheet);

  sheet.addEventListener('click', async (e) => {
    const btn = e.target.closest('[data-share-to]');
    if (!btn) return;
    const { text, url } = sheet.dataset;
    const enc = encodeURIComponent;
    const full = `${text} ${url}`;
    let done = false;
    if (btn.dataset.shareTo === 'telegram') {
      window.open(`https://t.me/share/url?url=${enc(url)}&text=${enc(text)}`, '_blank', 'noopener');
      done = true;
    } else if (btn.dataset.shareTo === 'whatsapp') {
      window.open(`https://wa.me/?text=${enc(full)}`, '_blank', 'noopener');
      done = true;
    } else if (btn.dataset.shareTo === 'x') {
      window.open(`https://twitter.com/intent/tweet?text=${enc(text)}&url=${enc(url)}`, '_blank', 'noopener');
      done = true;
    } else if (btn.dataset.shareTo === 'copy') {
      done = await copyToClipboard(full);
      if (done) toast('Link kopiert ✓');
    }
    if (done) closeSheet();
  });

  // Outside-Click + Esc schließen
  document.addEventListener('click', (e) => {
    if (!sheet.hidden && !sheet.contains(e.target) && !e.target.closest('[data-share]')) closeSheet();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeSheet();
  });
  return sheet;
}

function closeSheet() {
  const sheet = document.getElementById(SHARE_SHEET_ID);
  if (sheet) sheet.hidden = true;
}

async function copyToClipboard(text) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    // Fallback für nicht-sichere Kontexte (LAN/http)
    try {
      const ta = document.createElement('textarea');
      ta.value = text;
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      ta.remove();
      return true;
    } catch {
      return false;
    }
  }
}

let toastTimer;
function toast(msg) {
  let el = document.querySelector('.share-toast');
  if (!el) {
    el = document.createElement('div');
    el.className = 'share-toast';
    el.setAttribute('role', 'status');
    document.body.appendChild(el);
  }
  el.textContent = msg;
  el.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove('show'), 2000);
}

/** Öffnet das Sheet an einer Anker-Position (auch für EndCard genutzt: window.__sceneShare) */
function openSheetFor(anchor, text, url) {
  const sheet = ensureSheet();
  sheet.dataset.text = text;
  sheet.dataset.url = url;
  sheet.hidden = false;
  const r = anchor.getBoundingClientRect();
  const sw = sheet.offsetWidth || 240;
  const sh = sheet.offsetHeight || 220;
  let left = Math.min(Math.max(12, r.left + r.width / 2 - sw / 2), window.innerWidth - sw - 12);
  let top = r.bottom + 10;
  if (top + sh > window.innerHeight - 12) top = Math.max(12, r.top - sh - 10);
  sheet.style.left = `${left}px`;
  sheet.style.top = `${top}px`;
  sheet.querySelector('button')?.focus({ preventScroll: true });
}

/** Globale API für Komponenten (EndCard-Fallback): window.__sceneShare(text, url, anchorEl) */
window.__sceneShare = (text, url, anchor) => {
  if (navigator.share) {
    navigator.share({ title: document.title, text, url }).catch(() => {}); // Abbruch ok
  } else {
    openSheetFor(anchor ?? document.body, text, url);
  }
};

// --- Buttons verdrahten ---
document.querySelectorAll('.scene[data-share-text] [data-share]').forEach((btn) => {
  btn.addEventListener('click', () => {
    const scene = btn.closest('.scene');
    const text = scene?.dataset.shareText || document.title;
    const url = window.location.origin + window.location.pathname + (scene?.id ? `#${scene.id}` : '');
    if (navigator.share) {
      navigator.share({ title: document.title, text, url }).catch(() => {}); // Abbruch ok
    } else {
      openSheetFor(btn, text, url);
    }
  });
});

// --- Kachel-Export: Szene als PNG (9:16 + 1:1) herunterladen ---
// Akzent als 6-stelliges Hex (Canvas-Alpha like `${accent}30` braucht Hex, kein rgb()).
function resolveAccent(scene) {
  const raw = scene?.dataset?.accent?.trim();
  if (/^#[0-9a-fA-F]{6}$/.test(raw ?? '')) return raw;
  const cs = getComputedStyle(scene).getPropertyValue('--accent').trim();
  if (/^#[0-9a-fA-F]{6}$/.test(cs)) return cs;
  const m = cs.match(/rgba?\((\d+)[,\s]+(\d+)[,\s]+(\d+)/);
  if (m) return `#${[m[1], m[2], m[3]].map((v) => Number(v).toString(16).padStart(2, '0')).join('')}`;
  return '#ff4d2e';
}

async function downloadTile(scene, canvas, index) {
  const dataUrl = canvas.toDataURL('image/png');
  const a = document.createElement('a');
  a.href = dataUrl;
  a.download = `fckafd-szene-${index}.png`;
  a.click();
  await new Promise((r) => setTimeout(r, 350)); // Browser brauchen Luft zwischen Downloads
}

let tileRendering = false;
document.querySelectorAll('.scene[data-share-text] [data-share-tile]').forEach((btn) => {
  btn.addEventListener('click', async () => {
    if (tileRendering) return;
    const scene = btn.closest('.scene');
    if (!scene) return;
    tileRendering = true;
    btn.setAttribute('aria-busy', 'true');
    try {
      const scenesData = (window.__fckafd_scenes ?? []).scenes ?? window.__fckafd_scenes ?? [];
      const num = Number(scene.dataset.sceneIndex);
      const data = scenesData[num];
      const accent = resolveAccent(scene);
      const { renderSceneTiles } = await import('./scene-tile.js');
      const canvases = renderSceneTiles(data ?? { type: 'statement', text: scene.dataset.shareText }, {
        accent,
        deepLink: window.location.origin + window.location.pathname + (scene.id ? `#${scene.id}` : ''),
        siteUrl: window.location.origin.replace(/^https?:\/\//, ''),
      });
      for (const [k, canvas] of canvases.entries()) {
        await downloadTile(scene, canvas, num);
        if (k < canvases.length - 1) await new Promise((r) => setTimeout(r, 250));
      }
      toast('Kacheln exportiert ✓');
    } catch (err) {
      console.error('Kachel-Export fehlgeschlagen:', err);
      toast('Export fehlgeschlagen ✗');
    } finally {
      btn.removeAttribute('aria-busy');
      tileRendering = false;
    }
  });
});

// --- Deep-Links: URL folgt der Szene, Hash springt in die Szene ---
const scenes = Array.from(document.querySelectorAll('.scene[id]'));

/** Kapitel-Kontext beim Deep-Link-Einstieg: Label setzen + Segment aktivieren. */
function primeChapterContext(sceneEl) {
  const tr = document.querySelector('[data-chtracker]');
  if (!tr || !sceneEl?.dataset.chapter) return;
  const chapters = Array.from(tr.querySelectorAll('.chtracker__seg')).map((s) => s.dataset.chapterId);
  const idx = chapters.indexOf(sceneEl.dataset.chapter);
  if (idx < 0) return;
  const label = tr.querySelector('.chtracker__label');
  if (label) {
    const titles = window.__fckafd_chapters ?? [];
    const title = typeof titles[idx] === 'object' ? titles[idx]?.title : titles[idx];
    label.textContent = `Kapitel ${idx + 1}/${chapters.length} — ${title ?? ''}`;
    label.classList.add('is-show');
    setTimeout(() => label.classList.remove('is-show'), 4000);
  }
  const seg = tr.querySelectorAll('.chtracker__seg')[idx];
  if (seg && !seg.classList.contains('is-active')) {
    tr.querySelectorAll('.chtracker__seg').forEach((s, k) => {
      s.classList.toggle('is-active', k === idx);
      s.classList.toggle('is-done', k < idx);
    });
  }
}

/** „→ Weiter zur nächsten Szene“-Pfeil unter der Deep-Link-Ziel-Szene. */
function mountNextArrow(sceneEl) {
  document.querySelectorAll('.scene-next').forEach((n) => n.remove());
  const next = sceneEl?.nextElementSibling;
  if (!next || !next.classList.contains('scene')) return; // letzte Szene → kein Pfeil
  const nav = document.createElement('button');
  nav.className = 'scene-next';
  nav.type = 'button';
  nav.innerHTML = `<span>→ Weiter zur nächsten Szene</span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" aria-hidden="true"><path d="M12 5v14M5 12l7 7 7-7"/></svg>`;
  nav.addEventListener('click', () => next.scrollIntoView({ behavior: 'smooth', block: 'center' }));
  sceneEl.appendChild(nav);
  setTimeout(() => {
    if (nav.isConnected) nav.remove();
  }, 12000);
}

function jumpToHash(instant) {
  if (!window.location.hash) return false;
  const el = document.getElementById(decodeURIComponent(window.location.hash.slice(1)));
  if (!el || !el.classList.contains('scene')) return false;
  setTimeout(() => {
    el.scrollIntoView({ behavior: instant ? 'instant' : 'smooth', block: 'center' });
    // Deep-Link-Kontext: Kapitel-Label + aktives Segment setzen + Orientierungs-Pfeil
    if (instant) {
      setTimeout(() => {
        primeChapterContext(el);
        mountNextArrow(el);
      }, 150);
    }
  }, 80);
  return true;
}

if (scenes.length) {
  if (!jumpToHash(true)) {
    // kein Hash → Resume-Hint darf bleiben
  }
  window.addEventListener('hashchange', () => jumpToHash(false));

  // Beim Scrollen die URL still auf die aktuelle Szene setzen
  let ticking = false;
  window.addEventListener(
    'scroll',
    () => {
      if (ticking) return;
      ticking = true;
      setTimeout(() => {
        ticking = false;
        const mid = window.innerHeight / 2;
        let best = null;
        let dist = Infinity;
        scenes.forEach((s) => {
          const r = s.getBoundingClientRect();
          const d = Math.abs(r.top + r.height / 2 - mid);
          if (d < dist) {
            dist = d;
            best = s;
          }
        });
        if (!best) return;
        const target = best.id === 'scene-0' ? '' : `#${best.id}`;
        if (window.location.hash !== target) {
          history.replaceState(null, '', window.location.pathname + window.location.search + target);
        }
      }, 400);
    },
    { passive: true },
  );
}