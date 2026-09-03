// Ambient-Glow: zwei große, weiche Farblichter aus gegenüberliegenden Ecken.
// Design-Prinzip "Licht als Ereignis": Der Ruhezustand ist dezent (BASE_OPACITY),
// bei jedem Kapitelwechsel flammt das Licht kurz auf und klingt über ~3s ab.
// Das bekämpft den Gewöhnungseffekt (Habituation), ohne den dunklen Stil
// dauerhaft aufzuhellen. Farben folgen den Kapitel-Akzenten.

const HUE_SHIFT = 150; // Grad Verschiebung für die Gegenfarbe (türkis <-> pink-Bereich)

function hexToHsl(hex) {
  const m = hex.replace('#', '');
  const r = parseInt(m.slice(0, 2), 16) / 255;
  const g = parseInt(m.slice(2, 4), 16) / 255;
  const b = parseInt(m.slice(4, 6), 16) / 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0, s = 0;
  const l = (max + min) / 2;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }
  return { h: h * 360, s, l };
}

function complementary(hex) {
  const { h, s, l } = hexToHsl(hex);
  const h2 = (h + HUE_SHIFT) % 360;
  return hslToHex(h2, Math.min(1, s * 0.9 + 0.1), Math.min(0.72, l + 0.18));
}

function hslToHex(h, s, l) {
  const f = (n) => {
    const k = (n + h / 30) % 12;
    const a = s * Math.min(l, 1 - l);
    const v = l - a * Math.max(-1, Math.min(k - 3, Math.min(9 - k, 1)));
    return Math.round(255 * v).toString(16).padStart(2, '0');
  };
  return `#${f(0)}${f(8)}${f(4)}`;
}

export function initGlow() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const BASE_OPACITY = 0.55; // Ruhezustand: dezent, dunkler Stil bleibt intakt
  const FLAME_OPACITY = 1.0; // Kapitelwechsel-Aufflammen

  const glow = document.createElement('div');
  glow.className = 'ambient-glow';
  glow.setAttribute('aria-hidden', 'true');
  glow.style.opacity = String(BASE_OPACITY);

  const left = document.createElement('div');
  left.className = 'glow-blob glow-left';
  const right = document.createElement('div');
  right.className = 'glow-blob glow-right';

  glow.appendChild(left);
  glow.appendChild(right);
  document.body.appendChild(glow);

  // Farben dynamisch an die aktuelle Kapitel-Akzentfarbe anpassen
  const update = () => {
    const accent = getComputedStyle(document.documentElement).getPropertyValue('--accent').trim() || '#ff4d2e';
    left.style.background = `radial-gradient(circle at 0% 50%, ${accent}cc 0%, transparent 62%)`;
    right.style.background = `radial-gradient(circle at 100% 50%, ${complementary(accent)}99 0%, transparent 62%)`;
  };

  // Kapitelwechsel = Licht-Ereignis: aufflammen, dann über ~3s abklingen
  const flame = () => {
    glow.style.transition = 'none';
    glow.style.opacity = String(FLAME_OPACITY);
    void glow.offsetHeight; // Force-Refresh, damit die Transition greift
    glow.style.transition = 'opacity 3.2s cubic-bezier(0.16, 1, 0.3, 1)';
    glow.style.opacity = String(BASE_OPACITY);
  };

  // Akzent wechselt pro Kapitel (via --accent auf :root) — MutationObserver verfolgt das live
  let lastAccent = '';
  const observer = new MutationObserver(() => {
    const accent = getComputedStyle(document.documentElement).getPropertyValue('--accent').trim();
    if (accent !== lastAccent) {
      lastAccent = accent;
      update();
      flame();
    }
  });
  lastAccent = getComputedStyle(document.documentElement).getPropertyValue('--accent').trim();
  update();
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ['style'] });
}