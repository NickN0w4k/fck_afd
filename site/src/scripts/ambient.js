// Ambient-Hintergrund: globaler Partikel-Canvas (fixed, hinter allem) + sanfter
// Akzent-Hauch, der pro Kapitel die Farbe wechselt. Batterie-schonend:
// IntersectionObserver pausiert das Rendering, wenn der Tab unsichtbar ist,
// und prefers-reduced-motion deaktiviert alles.

export function initAmbient() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const canvas = document.createElement('canvas');
  canvas.className = 'ambient-canvas';
  canvas.setAttribute('aria-hidden', 'true');
  document.body.appendChild(canvas);
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  let w = 0, h = 0, raf = 0;
  const DPR = Math.min(devicePixelRatio || 1, 2); // Akkuschonung: max 2x

  // Partikel: wenige, langsam, dezent — Drift nach oben wie Staub im Projektorlicht
  const N = Math.round(Math.min(90, (window.innerWidth * window.innerHeight) / 22000));
  const pts = Array.from({ length: N }, () => ({
    x: Math.random(),
    y: Math.random(),
    vx: (Math.random() - 0.5) * 0.00035,
    vy: -(Math.random() * 0.0004 + 0.00008), // langsamer Aufwärtsdrift
    r: Math.random() * 1.8 + 0.5,
    tw: Math.random() * Math.PI * 2, // Twinkle-Phase
    twS: Math.random() * 0.02 + 0.005, // Twinkle-Geschwindigkeit
  }));

  // Pointer-Interaktion (sanft, wie im Hero)
  let mx = -999, my = -999;
  window.addEventListener('pointermove', (e) => {
    mx = e.clientX / window.innerWidth;
    my = e.clientY / window.innerHeight;
  }, { passive: true });

  const resize = () => {
    w = canvas.width = window.innerWidth * DPR;
    h = canvas.height = window.innerHeight * DPR;
    canvas.style.width = window.innerWidth + 'px';
    canvas.style.height = window.innerHeight + 'px';
  };
  resize();
  window.addEventListener('resize', resize, { passive: true });

  // Akzentfarbe live verfolgen (Kapitel-Farbwechsel läuft auf --accent)
  let lastAccent = '';
  const accent = () => getComputedStyle(document.documentElement).getPropertyValue('--accent').trim() || '#ff4d2e';

  const tick = () => {
    if (!ctx) return;
    ctx.clearRect(0, 0, w, h);
    const col = accent();
    if (col !== lastAccent) lastAccent = col;
    ctx.fillStyle = col;

    for (const p of pts) {
      // sanfte Pointer-Anziehung (nah = leichter Sog)
      const dx = mx - p.x, dy = my - p.y;
      const d2 = dx * dx + dy * dy;
      if (d2 < 0.08 && d2 > 0.0002) {
        p.vx += dx * 0.00003;
        p.vy += dy * 0.00003;
      }
      p.vx *= 0.995; p.vy *= 0.995;
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0) p.x += 1; if (p.x > 1) p.x -= 1;
      if (p.y < 0) p.y += 1; if (p.y > 1) p.y -= 1;

      // Twinkle: Partikel pulsieren dezent
      p.tw += p.twS;
      const alpha = 0.18 + Math.abs(Math.sin(p.tw)) * 0.25;
      ctx.globalAlpha = alpha;
      ctx.beginPath();
      ctx.arc(p.x * w, p.y * h, p.r * DPR, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;
    raf = requestAnimationFrame(tick);
  };

  // Nur rendern, wenn Tab sichtbar (Batterie)
  const start = () => { if (!raf) raf = requestAnimationFrame(tick); };
  const stop = () => { cancelAnimationFrame(raf); raf = 0; };
  document.addEventListener('visibilitychange', () => (document.hidden ? stop() : start()));
  start();
}