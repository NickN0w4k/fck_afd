// Zentrale Animation-Registry: registriert ScrollTrigger-Verhalten per data-anim Attribut.
// Wird von Base.astro geladen. Respektiert prefers-reduced-motion.
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { initHighlights } from './highlights.js';
import { initAmbient } from './ambient.js';
import { initGlow } from './glow.js';

gsap.registerPlugin(ScrollTrigger);

const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/** Fade+Rise für alle [data-anim="rise"] Elemente; respektiert optionale --d-Verzögerung */
function initRise() {
  document.querySelectorAll('[data-anim="rise"]').forEach((el) => {
    if (prefersReduced) return;
    const delay = parseFloat(getComputedStyle(el).getPropertyValue('--d')) || 0;
    gsap.from(el, {
      y: 42,
      autoAlpha: 0,
      duration: 0.9,
      delay: delay / 1000,
      ease: 'power3.out',
      scrollTrigger: { trigger: el, start: 'top 95%', once: true },
    });
  });
}

/** Wörter in Spans wrappen (einmalig) — mark-Tags bleiben als Einheit erhalten */
function splitWordsMarkAware(el) {
  if (el.dataset.wordSplit) return;
  const frag = el.innerHTML.split(/(<mark class="hl">.*?<\/mark>)/g);
  el.innerHTML = frag
    .map((chunk) => {
      if (chunk.startsWith('<mark')) return chunk; // Highlight-Block unangetastet
      return chunk
        .trim()
        .split(/\s+/)
        .filter(Boolean)
        .map((w) => `<span class="word">${w}</span>`)
        .join(' ');
    })
    .join(' ');
  el.dataset.wordSplit = '1';
}

/** Statement-Szenen: Wörter bauen sich beim Scrollen auf (scrubbed).
 *  Mark-aware: bereits bestehende <mark.hl>-Highlights bleiben erhalten. */
function initWords() {
  document.querySelectorAll('[data-words]').forEach((el) => {
    if (prefersReduced) return;
    splitWordsMarkAware(el);
    gsap.fromTo(
      el.querySelectorAll('.word'),
      { autoAlpha: 0.12 },
      {
        autoAlpha: 1,
        stagger: 0.35,
        ease: 'none',
        scrollTrigger: {
          trigger: el.closest('.scene') ?? el,
          start: 'top 75%',
          end: 'top 20%',
          scrub: true,
        },
      },
    );
  });
}

/** Count-up für [data-count] (Daten-Szenen) */
function initCount() {
  document.querySelectorAll('[data-count]').forEach((el) => {
    const target = parseFloat(el.dataset.count ?? '0');
    const decimals = (el.dataset.count ?? '').includes('.') ? 1 : 0;
    if (prefersReduced) {
      el.textContent = target.toLocaleString('de-DE', { minimumFractionDigits: decimals });
      return;
    }
    const obj = { v: 0 };
    gsap.to(obj, {
      v: target,
      duration: 1.6,
      ease: 'power2.out',
      scrollTrigger: { trigger: el, start: 'top 80%', once: true },
      onUpdate: () => {
        el.textContent = obj.v.toLocaleString('de-DE', { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
      },
    });
  });
}

/** Scrubbed-Counter: [data-count-scrub] — Zahl folgt dem Scroll (Opt-in je Szene) */
function initCountScrub() {
  document.querySelectorAll('[data-count-scrub]').forEach((el) => {
    const raw = el.dataset.countScrub ?? '0';
    const target = parseFloat(raw);
    const decimals = raw.includes('.') ? 1 : 0;
    const fmt = (v) => v.toLocaleString('de-DE', { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
    if (prefersReduced) {
      el.textContent = fmt(target);
      return;
    }
    const obj = { v: 0 };
    gsap.to(obj, {
      v: target,
      ease: 'none',
      snap: { v: decimals ? 0.1 : 1 },
      scrollTrigger: { trigger: el, start: 'top 85%', end: 'top 35%', scrub: 0.5 },
      onUpdate: () => {
        el.textContent = fmt(obj.v);
      },
    });
  });
}

/** Balken wachsen auf Scrub: [data-bar] mit style="--w: X%" — gestaffelt pro Szene.
 *  Diverging-Variante: .dv-fill wächst als HÖHE (von der Nulllinie aus auf/ab), --h = Länge. */
function initBars() {
  document.querySelectorAll('.scene').forEach((scene) => {
    // Swarm-Szene: Balken laufen in der Pin-Stack-Timeline (initPinStack) — hier ausnehmen
    if (scene.querySelector('[data-swarm]')) return;
    const bars = scene.querySelectorAll('[data-bar]');
    bars.forEach((el, i) => {
      const width = el.style.getPropertyValue('--w');
      const isDiverging = el.classList.contains('dv-fill');
      const length = el.style.getPropertyValue('--h');
      if (prefersReduced) {
        if (isDiverging) {
          el.style.width = length;
        } else {
          el.style.width = width;
        }
        return;
      }
      const target = isDiverging ? length : width;
      if (!target) return;
      gsap.fromTo(
        el,
        { width: '0%' },
        {
          width: target,
          duration: 1.1,
          delay: i * 0.12, // Stagger: Balken wachsen nacheinander
          ease: 'power3.out',
          scrollTrigger: { trigger: scene, start: 'top 70%', once: true },
        },
      );
    });
  });
}

/** 10×10-Kachel-Raster: [data-tiles] färbt die ersten N Kacheln gestaffelt ein (stagger 0.02).
 *  prefers-reduced-motion → alle Kacheln sofort im Endzustand gefärbt. */
function initTiles() {
  document.querySelectorAll('[data-tiles]').forEach((grid) => {
    const tiles = grid.querySelectorAll('[data-tile]');
    if (prefersReduced) return; // SSR-Endzustand (.tile.is-on gefärbt) bleibt bestehen
    // Akzentfarbe computed auflösen (GSAP kann var() als Farbwert nicht zuverlässig animieren)
    const accent = getComputedStyle(grid).getPropertyValue('--accent').trim() || '#ff4d2e';
    // Startzustand: alle dunkel; Indexliste der zu färbenden Kacheln merken
    const onIdx = [];
    tiles.forEach((t, i) => {
      if (t.classList.contains('is-on')) {
        onIdx.push(i);
        t.classList.remove('is-on');
      }
    });
    if (!onIdx.length) return;
    gsap.to(
      onIdx.map((i) => tiles[i]),
      {
        backgroundColor: accent,
        duration: 0.28,
        ease: 'power1.out',
        stagger: 0.02, // gestaffelt: Kachel für Kachel füllt sich
        scrollTrigger: { trigger: grid, start: 'top 80%', once: true },
      },
    );
  });
}

/** Donut füllt sich: SVG circle mit stroke-dasharray */
function initDonut() {
  document.querySelectorAll('[data-donut]').forEach((circle) => {
    const pct = parseFloat(circle.dataset.donut ?? '50');
    const r = circle.r.baseVal.value;
    const c = 2 * Math.PI * r;
    circle.style.strokeDasharray = `${c}`;
    if (prefersReduced) {
      circle.style.strokeDashoffset = `${c * (1 - pct / 100)}`;
      return;
    }
    gsap.fromTo(
      circle,
      { strokeDashoffset: c },
      {
        strokeDashoffset: c * (1 - pct / 100),
        duration: 1.6,
        ease: 'power3.out',
        scrollTrigger: { trigger: circle, start: 'top 80%', once: true },
      },
    );
  });
}

/** Kontrast-Szene: Split öffnet sich beim Scrollen; Claim-Text parallaxt leicht,
 *  Reality-Panel slided nach, sobald der Split bei 50 % ist */
function initSplit() {
  document.querySelectorAll('[data-split]').forEach((el) => {
    if (prefersReduced) return;
    const scene = el.closest('.scene');
    gsap.fromTo(
      el,
      { width: '100%' },
      {
        width: '50%',
        ease: 'none',
        scrollTrigger: {
          trigger: scene,
          start: 'top top',
          end: 'center center',
          scrub: true,
        },
      },
    );
    // Claim-Text parallaxt ~12px nach links, während der Split öffnet
    const claimText = el.querySelector('.claim-text');
    if (claimText) {
      gsap.fromTo(
        claimText,
        { x: 0 },
        {
          x: -12,
          ease: 'none',
          scrollTrigger: { trigger: scene, start: 'top top', end: 'center center', scrub: true },
        },
      );
    }
    // Reality-Panel slided nach (y 40, autoAlpha 0→1), sobald der Split 50 % erreicht hat
    const reality = el.parentElement?.querySelector('.reality');
    if (reality) {
      const kids = reality.querySelectorAll('.side-label, .reality-text, .reality-list li');
      const tl = gsap.timeline({ scrollTrigger: { trigger: scene, start: 'center center', once: true } });
      tl.fromTo(reality, { y: 40, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.6, ease: 'power2.out' });
      if (kids.length) {
        tl.from(kids, { y: 24, autoAlpha: 0, duration: 0.5, stagger: 0.15, ease: 'power2.out' }, '-=0.25');
      }
    }
  });
}

/** Mythos-Durchstrich beim Scrollen; nach struck kippt die Behauptung physisch weg */
function initStrike() {
  document.querySelectorAll('[data-strike]').forEach((el) => {
    if (prefersReduced) {
      el.classList.add('struck');
      gsap.set(el, { rotationY: -3, transformPerspective: 600 });
      return;
    }
    gsap.fromTo(
      el,
      { '--strike': '0%' },
      {
        '--strike': '100%',
        ease: 'none',
        scrollTrigger: { trigger: el, start: 'top 70%', end: 'top 30%', scrub: true },
        onComplete: () => {
          el.classList.add('struck');
          gsap.to(el, { rotationY: -3, transformPerspective: 600, duration: 0.6, ease: 'power2.out' });
        },
      },
    );
  });
}

/** Reveal-Tease: Karte neigt sich beim Scrollen leicht (±1.5°) und richtet sich auf (0.98→1, once) */
function initRevealTease() {
  document.querySelectorAll('[data-reveal-tease]').forEach((el) => {
    if (prefersReduced) return;
    gsap.fromTo(
      el,
      { rotation: -1.5, scale: 0.98 },
      {
        rotation: 0,
        scale: 1,
        duration: 0.9,
        ease: 'power2.out',
        scrollTrigger: { trigger: el, start: 'top 80%', once: true },
      },
    );
  });
}

/** Zitate: Wörter sliden einzeln rein — mark-aware (Highlights bleiben Einheiten) */
function initQuote() {
  document.querySelectorAll('[data-quote]').forEach((el) => {
    if (prefersReduced) return;
    splitWordsMarkAware(el);
    const words = el.querySelectorAll('.word');
    if (!words.length) return;
    gsap.from(words, {
      y: 26,
      autoAlpha: 0,
      stagger: 0.08,
      duration: 0.7,
      ease: 'power3.out',
      scrollTrigger: { trigger: el, start: 'top 75%', once: true },
    });
  });
}

/** Kapitel-Übergänge: große Nummer parallaxt */
function initChapter() {
  document.querySelectorAll('[data-chapter-num]').forEach((el) => {
    if (prefersReduced) return;
    gsap.fromTo(
      el,
      { yPercent: 30, autoAlpha: 0.2 },
      {
        yPercent: -30,
        autoAlpha: 1,
        ease: 'none',
        scrollTrigger: { trigger: el.closest('.scene'), start: 'top bottom', end: 'bottom top', scrub: true },
      },
    );
  });
}

/** Fortschritt: Bar + Dots (Szenen-Zähler ersetzt durch ChapterTracker) */
function initProgress() {
  const bar = document.querySelector('.progress__bar');
  const dots = document.querySelectorAll('.dots button');
  const scenes = Array.from(document.querySelectorAll('.scene'));
  if (!bar && !dots.length) return;

  const update = () => {
    const scrollY = window.scrollY;
    const max = document.documentElement.scrollHeight - window.innerHeight;
    if (bar) bar.style.width = `${max > 0 ? Math.min(100, (scrollY / max) * 100) : 0}%`;
    if (dots.length) {
      // nächstliegende Szene zur Mitte des Viewports
      let nearest = 0;
      let best = Infinity;
      scenes.forEach((s, i) => {
        const rect = s.getBoundingClientRect();
        const dist = Math.abs(rect.top + rect.height / 2 - window.innerHeight / 2);
        if (dist < best) {
          best = dist;
          nearest = i;
        }
      });
      // Dots sind Kapitel-, nicht Szenen-Indizes: aktive Szene → Kapitel-Index
      const chapterOrder = Array.from(dots, (d) => (d.dataset.goto ?? '').replace('chapter-', ''));
      const chapterIdx = chapterOrder.indexOf(scenes[nearest].dataset.chapter);
      dots.forEach((d, i) => d.setAttribute('aria-current', String(i === chapterIdx)));
    }
  };
  window.addEventListener('scroll', update, { passive: true });
  update();
}

/** Kapitel-Akzentfarbe aufs :root migrieren, wenn Szene aktiv */
function initAccent() {
  if (prefersReduced) return;
  const scenes = Array.from(document.querySelectorAll('.scene[data-accent]'));
  if (!scenes.length) return;
  const root = document.documentElement;
  const apply = (color) => root.style.setProperty('--accent', color);
  scenes.forEach((scene) => {
    ScrollTrigger.create({
      trigger: scene,
      start: 'top 50%',
      end: 'bottom 50%',
      onToggle: (self) => {
        if (self.isActive) apply(scene.dataset.accent);
      },
    });
  });
}

/** localStorage-Resume: merkt Scrollposition */
function initResume() {
  const KEY = 'fck-afd-resume';
  const scenes = document.querySelectorAll('.scene');
  if (!scenes.length) return;
  // speichern
  let saveTimer;
  window.addEventListener(
    'scroll',
    () => {
      clearTimeout(saveTimer);
      saveTimer = setTimeout(() => {
        localStorage.setItem(KEY, String(window.scrollY));
      }, 300);
    },
    { passive: true },
  );
  // wiederherstellen mit Hinweis statt Auto-Jump
  const saved = localStorage.getItem(KEY);
  if (saved && parseInt(saved, 10) > window.innerHeight * 1.5) {
    const hint = document.createElement('button');
    hint.className = 'resume-hint';
    hint.textContent = 'Weiter da, wo du aufgehört hast?';
    hint.setAttribute('data-anim', 'rise');
    hint.addEventListener('click', () => {
      window.scrollTo({ top: parseInt(saved, 10), behavior: 'smooth' });
      hint.remove();
    });
    document.body.appendChild(hint);
    setTimeout(() => hint.remove(), 12000);
  }
}

/** Szenen, die höher als der Viewport sind, rasten oben ein statt zentriert
 *  (bei center-align wäre der oberste Teil der Szene unerreichbar).
 *  Reaktiv (Fix 12.09.): Slider-/Quiz-Reveals wachsen zur Laufzeit über 1vh —
 *  der statische Init-Check reichte nicht mehr. ResizeObserver zieht snap-align
 *  nach und refresht ScrollTrigger, damit Pin-Positionen neu gerechnet werden.
 *  Schwelle 1.02vh: Schon minimal Überhöhen rastet oben ein — center bei 898px-
 *  Szene auf 844px-Viewport verdeckt sonst die oberen ~30px (Prompt-Abschneider). */
function initSnapTall() {
  const isTall = (s) => s.scrollHeight > window.innerHeight * 1.02;
  const refresh = () => ScrollTrigger.refresh();

  document.querySelectorAll('.scene').forEach((s) => {
    if (isTall(s)) s.style.scrollSnapAlign = 'start';
    if ('ResizeObserver' in window && !prefersReduced) {
      const ro = new ResizeObserver(() => {
        const prevAlign = s.style.scrollSnapAlign;
        const nowTall = isTall(s);
        const nextAlign = nowTall ? 'start' : '';
        if (prevAlign !== nextAlign) {
          s.style.scrollSnapAlign = nextAlign;
          // Pin-Positionen folgen erst nach refresh — im nächsten Frame (Layout ist stabil)
          requestAnimationFrame(refresh);
        }
      });
      ro.observe(s);
    }
  });
}

/** Desktop-Wheel-Stopper: eine Scroll-Geste = exakt eine Szene weiter (TikTok-Feel).
 *  Touch & Keyboard laufen weiter über natives CSS-Snap; reduced-motion lässt alles nativ. */
function initWheelSnap() {
  if (prefersReduced) return;
  const scenes = Array.from(document.querySelectorAll('.scene'));
  if (!scenes.length) return;

  let acc = 0;
  let timer = null;

  const nearestIndex = () => {
    const mid = window.innerHeight / 2;
    let best = 0;
    let dist = Infinity;
    scenes.forEach((s, i) => {
      const r = s.getBoundingClientRect();
      const d = Math.abs(r.top + r.height / 2 - mid);
      if (d < dist) {
        dist = d;
        best = i;
      }
    });
    return best;
  };

  // Pin-Stack-Schritt (Welle 3): liegt der Viewport im Bereich eines Pins,
  // durchschreitet die Geste den Pin in ~3 Etappen (Phasen erlebbar), statt
  // per Szenen-Sprung den Scrub zu überspringen.
  // Fix 12.09.: Pin-Suche über scroll-Position (at innerhalb start-tail … end+tail),
  // NICHT über nearestIndex() — der kippt am gepinnten Zustand (Szenen-rect bleibt
  // bei top=0 transformiert, Szenen-Mitte verschiebt sich → falsche Szene gewählt,
  // Rückwärts-Wheel sprang aus dem Pin statt eine Etappe zurück).
  const pinStep = (dir) => {
    const at = window.scrollY;
    const st = pinTriggers.find((p) => at >= p.start - 2 && at <= p.end + PIN_TAIL);
    if (!st || st.end <= st.start) return false;
    const step = (st.end - st.start) / 3;
    if (dir > 0 && at >= st.start - 2 && at < st.end - 2) {
      window.scrollTo({ top: Math.min(st.end, at + step), behavior: 'smooth' });
      return true;
    }
    if (dir < 0 && at > st.start + 2 && at <= st.end + 2) {
      window.scrollTo({ top: Math.max(st.start, at - step), behavior: 'smooth' });
      return true;
    }
    return false;
  };

  const goTo = (i, dir = 1) => {
    const idx = Math.max(0, Math.min(scenes.length - 1, i));
    const s = scenes[idx];
    // Pin-Szene als Ziel: an den Pin-Anfang fahren (Scrub startet), nicht ans Szenen-Ende springen
    const pin = pinTriggers.find((p) => p.trigger === s);
    if (pin && pin.end > pin.start) {
      const at = window.scrollY;
      if (dir > 0) {
        if (at < pin.start - 2) {
          window.scrollTo({ top: pin.start, behavior: 'smooth' });
          return;
        }
        if (at < pin.end - 2) {
          window.scrollTo({ top: Math.min(pin.end, at + (pin.end - pin.start) / 3), behavior: 'smooth' });
          return;
        }
        goTo(idx + 1, dir); // Pin komplett durchlaufen → nächste Szene
        return;
      }
      if (at > pin.end + 2) {
        window.scrollTo({ top: Math.max(pin.start, pin.end - (pin.end - pin.start) / 3), behavior: 'smooth' });
        return; // von unten zurück in den Pin: am Ende wieder einsteigen
      }
      if (at > pin.start + 2) {
        window.scrollTo({ top: Math.max(pin.start, at - (pin.end - pin.start) / 3), behavior: 'smooth' });
        return;
      }
      // vor dem Pin → normale Navigation zur vorherigen Szene
      const prev = scenes[Math.max(0, idx - 1)];
      if (prev.scrollHeight > window.innerHeight * 1.02) {
        window.scrollTo({ top: Math.max(0, prev.offsetTop + prev.scrollHeight - window.innerHeight), behavior: 'smooth' });
      } else {
        prev.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }
    const tall = s.scrollHeight > window.innerHeight * 1.02;
    if (tall) {
      // Hohe Szene: erst ans Ende scrollen (Autor/Quelle zeigen), Snap restet via CSS
      const targetY = s.offsetTop + s.scrollHeight - window.innerHeight;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      window.scrollTo({ top: Math.min(targetY, Math.max(0, max)), behavior: 'smooth' });
    } else {
      s.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  window.addEventListener(
    'wheel',
    (e) => {
      if (e.ctrlKey) return; // Pinch-Zoom nicht kaputtmachen
      const t = e.target;
      if (t.closest && t.closest('input, textarea, select, [contenteditable]')) return;
      e.preventDefault();
      acc += e.deltaY;
      clearTimeout(timer);
      timer = setTimeout(() => {
        const dir = acc > 0 ? 1 : -1;
        if (Math.abs(acc) >= 30 && !pinStep(dir)) goTo(nearestIndex() + dir, dir);
        acc = 0;
      }, 150);
    },
    { passive: false },
  );
}

// ============================================================================
// Welle 3 — Pin-Stack-Infrastruktur (apex §3, MASTER §4.3/§5)
// pinTriggers sammelt alle Pin-ScrollTrigger (Budget: max 3 — Hero = Pin 1,
// 28.000er-Punktschwarm = Pin 2). Solange ein Pin läuft (isActive && progress > 0),
// setzt die Registry html.pin-active + dispatcht fckafd:pin-active/-inactive —
// ambient.js pausiert dann das Partikel-Rendering, die Glow-Blobs frieren ein
// (global.css). Drift-frei, weil isActive live gelesen wird.
// ============================================================================
const pinTriggers = [];
let _pinStateActive = false;

/** Bereichs-basiert (start-1 … end+AUSLAUF): schon am Pin-Anfang aktiv, damit das
 *  gelockerte Snap-Verhalten (html.pin-active → proximity) greift, BEVOR der Scrub
 *  beginnt — mandatory-Snap würde Zwischenpositionen im Pin sonst zum Snap-Punkt
 *  zurückziehen. Am ENDE mit kleiner Auslaufzone (+150px): Die Rückwärts-Etappe
 *  (pinStep dir<0) startet bei y=pin.end und wird ohne Zone vom mandatory-Snap
 *  zurückgezogen, bevor der smooth-scroll ankommt (Fix 12.09.: „Snap hängt am
 *  Pin-Ende"). 150px ≈ halbe Wheel-Etappe, ohne die nächste Szene zu überlappen. */
const PIN_TAIL = 150;
function updatePinState() {
  const at = window.scrollY || window.pageYOffset || 0;
  const active = pinTriggers.some((st) => at >= st.start - 1 && at < st.end + PIN_TAIL);
  if (active === _pinStateActive) return;
  _pinStateActive = active;
  document.documentElement.classList.toggle('pin-active', active);
  document.dispatchEvent(new CustomEvent(active ? 'fckafd:pin-active' : 'fckafd:pin-inactive'));
}

/** Pin-ScrollTrigger registrieren + Budget bewachen (MASTER §4.3: max 3) */
function registerPin(st) {
  pinTriggers.push(st);
  if (pinTriggers.length === 1) {
    window.addEventListener('scroll', updatePinState, { passive: true });
  }
  if (pinTriggers.length > 3) {
    console.warn(`Pin-Budget überschritten: ${pinTriggers.length} Pins registriert (Budget: 3)`);
  }
  return st;
}

/** Welle 3 / 3.3 — Hero-Parallax-Pin (Pin 1 von 3, apex §3 „statement/hero“):
 *  Ambient-Glow-Layer yPercent 30 (scrub), Headline-Block yPercent -10,
 *  Hero-Inhalt blendet beim ersten Scroll aus. end '+=600', pinType transform,
 *  anticipatePin 1. prefers-reduced-motion: kein Pin — statischer Hero (SSR). */
function initHeroParallax() {
  const glow = document.querySelector('.hero-glow');
  if (!glow) return;
  const scene = glow.closest('.scene');
  if (!scene || prefersReduced) return;
  const inner = scene.querySelector('.hero-inner');
  const hint = scene.querySelector('.swipe-hint');
  const canvas = scene.querySelector('.hero-canvas');
  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: scene,
      start: 'top top',
      end: '+=600',
      pin: true,
      pinType: 'transform',
      anticipatePin: 1,
      scrub: true,
      invalidateOnRefresh: true,
      onUpdate: updatePinState,
      onToggle: updatePinState,
    },
  });
  registerPin(tl.scrollTrigger);
  tl.to(glow, { yPercent: 30, ease: 'none', duration: 1 }, 0)
    .to(inner, { yPercent: -10, ease: 'none', duration: 1 }, 0);
  tl.to([inner, canvas, hint].filter(Boolean), { autoAlpha: 0, duration: 0.4, ease: 'power1.in' }, 0.6);
}

/** Welle 3 / 3.1 — 28.000er-Punktschwarm als Pin-Stack (apex §3 „data“, MASTER 3.1):
 *  Pin 2 von 3. 112 DOM-Kreise (1 Punkt ≈ 250 Personen), 3 Phasen an Scrollposition:
 *  11.300 (45 Punkte) → 20.000 (80) → 28.000 (112), Punkte poppen gestaffelt
 *  (stagger 0.02), der Zähler läuft scrubbed mit (data-count-scrub-Muster auf
 *  data-swarm-count — initCount/initCountScrub fassen die Szene dadurch nicht an).
 *  Die Balken-Zeitreihe bleibt als Folge-Element unter dem Schwarm und ist nach
 *  dem Pin normal sichtbar (pinSpacing default: GSAP reserviert die Scroll-Länge).
 *  prefers-reduced-motion: Endzustand sofort (SSR: 112 Punkte · 28.000 · 2025),
 *  keine Pin-Scroll-Länge — Funktion springt aus, bevor irgendwas gesetzt wird. */
function initPinStack() {
  document.querySelectorAll('[data-swarm]').forEach((swarm) => {
    const scene = swarm.closest('.scene');
    const dots = Array.from(swarm.querySelectorAll('[data-swarm-dot]'));
    const years = Array.from(swarm.querySelectorAll('.swarm-year'));
    let phases = [];
    try {
      phases = JSON.parse(swarm.dataset.swarmPhases ?? '[]');
    } catch {
      phases = []; // defekte Daten → SSR-Endzustand bleibt stehen
    }
    if (!scene || phases.length !== 3 || dots.length !== phases[2].dots) return;
    if (prefersReduced) return; // Endzustand sofort, Pin aus

    const counter = scene.querySelector('[data-swarm-count]');
    const fmt = (v) => Math.round(v).toLocaleString('de-DE');

    // Startzustand setzen (SSR liefert den Endzustand für reduced-motion/no-JS)
    gsap.set(dots, { scale: 0, autoAlpha: 0 });
    years.forEach((y) => y.classList.remove('is-on'));
    if (counter) counter.textContent = fmt(0);
    // Fix 12.09. (Nick): Balken-Zeitreihe unter dem Schwarm nicht vorgreifen —
    // erst im letzten Pin-Drittel aufdecken (vorher standen Zahl+Werte sofort da = Spoiler).
    // gsap.set statt CSS-Hook (kein .js-Klasse-System): autoAlpha 0 + width 0 bis zur Aufdeckung.
    const barsBlock = scene.querySelector('[data-bars-staged]');
    const barFills = barsBlock ? Array.from(barsBlock.querySelectorAll('[data-bar]')) : [];
    const hint = scene.querySelector('[data-swarm-hint]');
    if (barsBlock) gsap.set(barsBlock, { autoAlpha: 0 });
    if (hint) gsap.set(hint, { autoAlpha: 0 });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: scene,
        start: 'top top',
        end: '+=1500',
        pin: true,
        pinType: 'transform',
        anticipatePin: 1,
        scrub: 0.6,
        invalidateOnRefresh: true,
        onUpdate: updatePinState,
        onToggle: updatePinState,
      },
    });
    registerPin(tl.scrollTrigger);

    phases.forEach((phase, pi) => {
      const fromDots = pi === 0 ? 0 : phases[pi - 1].dots;
      const label = `p${pi}`;
      tl.addLabel(label, pi * 1.8); // Phasenwechsel an Scrollposition (Gap = kurzer Beat)
      tl.to(dots.slice(fromDots, phase.dots), {
        scale: 1,
        autoAlpha: 1,
        duration: 0.45,
        stagger: 0.02, // Punkte poppen gestaffelt
        ease: 'back.out(2.2)',
      }, label);
      if (counter) {
        const obj = { v: pi === 0 ? 0 : phases[pi - 1].value };
        tl.to(obj, {
          v: phase.value,
          duration: 0.45 + (phase.dots - fromDots - 1) * 0.02, // Zähler hält mit den Punkten Schritt
          ease: 'none',
          onUpdate: () => {
            counter.textContent = Math.round(obj.v).toLocaleString('de-DE');
          },
        }, label);
      }
      if (years[pi]) {
        if (pi > 0 && years[pi - 1]) tl.to(years[pi - 1], { autoAlpha: 0, duration: 0.2 }, label);
        tl.fromTo(years[pi], { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.2 }, label);
      }
      // Fix 12.09.: Letzte Phase (2025/28.000) — Balken aufdecken, Werte wachsen mit:
      // Balken 1–3 wachsen nacheinander (stagger), initBars' eigener Trigger ist dafür
      // entfernt (initBars springt Swarm-Szenen aus → kein Doppel-Animation).
      if (pi === phases.length - 1 && barFills.length) {
        tl.addLabel('bars', pi * 1.8 + 0.45); // kurz nach dem finalen Punkte-Pop
        tl.to(barsBlock, { autoAlpha: 1, duration: 0.25 }, 'bars'); // Block einblenden
        barFills.forEach((el, bi) => {
          tl.fromTo(
            el,
            { width: '0%' },
            {
              width: el.style.getPropertyValue('--w'),
              duration: 0.55,
              ease: 'power2.out',
            },
            `bars+=${bi * 0.18}`,
          );
        });
        if (hint) tl.fromTo(hint, { autoAlpha: 0 }, { autoAlpha: 0.9, duration: 0.3 }, 'bars+=0.4');
      }
    });
    tl.to({}, { duration: 0.35 }); // Endruhe: 28.000 hält kurz, dann löst der Pin
    // Am Pin-Ende: Wisch-Hinweis ausblenden (der ist nur während des Pins sinnvoll)
    tl.call(() => hint?.classList.add('is-done'), [], '+=0.01');
  });
}

function init() {
  initAmbient();
  initGlow();
  initHighlights();
  initRise();
  initWords();
  initCount();
  initCountScrub();
  initBars();
  initTiles();
  initDonut();
  initSplit();
  initStrike();
  initQuote();
  initRevealTease();
  initChapter();
  initHeroParallax(); // Welle 3 / 3.3 — Pin 1 (Hero-Parallax)
  initPinStack(); // Welle 3 / 3.1 — Pin 2 (28.000er-Punktschwarm)
  initSnapTall();
  initWheelSnap();
  initProgress();
  initAccent();
  initResume();
  ScrollTrigger.refresh();
  // Registry-Zählung (MASTER §4.3: ≤3 Scrub-Tweens pro Szene/Viewport, Pin-Budget 3) —
  // für Checks headless lesbar. once-Tweens zählen nicht (idle nach einer Auslösung).
  const sceneEls = Array.from(document.querySelectorAll('.scene'));
  const scrubByScene = {};
  ScrollTrigger.getAll().forEach((st) => {
    if (!st.vars?.scrub && !st.vars?.pin) return;
    const scene = st.trigger?.closest?.('.scene');
    const key = scene ? `${scene.dataset.chapter ?? '?'}#${sceneEls.indexOf(scene)}` : 'global';
    scrubByScene[key] = (scrubByScene[key] ?? 0) + 1;
  });
  window.__fckafd_registry = {
    pins: pinTriggers.map((st) => ({
      chapter: st.trigger?.dataset?.chapter ?? st.trigger?.id ?? '?',
      start: st.start,
      end: st.end,
      length: st.end - st.start,
    })),
    scrubByScene,
  };
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}