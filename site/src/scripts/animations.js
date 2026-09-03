// Zentrale Animation-Registry: registriert ScrollTrigger-Verhalten per data-anim Attribut.
// Wird von Base.astro geladen. Respektiert prefers-reduced-motion.
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

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

/** Statement-Szenen: Wörter bauen sich beim Scrollen auf (scrubbed) */
function initWords() {
  document.querySelectorAll('[data-words]').forEach((el) => {
    if (prefersReduced) return;
    // Wörter in Spans wrappen (einmalig)
    if (!el.dataset.wordSplit) {
      el.innerHTML = el.textContent.trim().split(/\s+/).map((w) => `<span class="word">${w}</span>`).join(' ');
      el.dataset.wordSplit = '1';
    }
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

/** Balken wachsen auf Scrub: [data-bar] mit style="--w: X%" — gestaffelt pro Szene */
function initBars() {
  document.querySelectorAll('.scene').forEach((scene) => {
    const bars = scene.querySelectorAll('[data-bar]');
    bars.forEach((el, i) => {
      const width = el.style.getPropertyValue('--w');
      if (prefersReduced) {
        el.style.width = width;
        return;
      }
      gsap.fromTo(
        el,
        { width: '0%' },
        {
          width,
          duration: 1.1,
          delay: i * 0.12, // Stagger: Balken wachsen nacheinander
          ease: 'power3.out',
          scrollTrigger: { trigger: scene, start: 'top 70%', once: true },
        },
      );
    });
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

/** Kontrast-Szene: Split öffnet sich beim Scrollen */
function initSplit() {
  document.querySelectorAll('[data-split]').forEach((el) => {
    if (prefersReduced) return;
    gsap.fromTo(
      el,
      { width: '100%' },
      {
        width: '50%',
        ease: 'none',
        scrollTrigger: {
          trigger: el.closest('.scene'),
          start: 'top top',
          end: 'center center',
          scrub: true,
        },
      },
    );
  });
}

/** Mythos-Durchstrich beim Scrollen */
function initStrike() {
  document.querySelectorAll('[data-strike]').forEach((el) => {
    if (prefersReduced) {
      el.classList.add('struck');
      return;
    }
    gsap.fromTo(
      el,
      { '--strike': '0%' },
      {
        '--strike': '100%',
        ease: 'none',
        scrollTrigger: { trigger: el, start: 'top 70%', end: 'top 30%', scrub: true },
        onComplete: () => el.classList.add('struck'),
      },
    );
  });
}

/** Zitate: Buchstaben-sliden */
function initQuote() {
  document.querySelectorAll('[data-quote]').forEach((el) => {
    if (prefersReduced) return;
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

/** Fortschritt: Bar + Szenen-Zähler + Dots */
function initProgress() {
  const bar = document.querySelector('.progress__bar');
  const counter = document.querySelector('.counter');
  const dots = document.querySelectorAll('.dots button');
  const scenes = Array.from(document.querySelectorAll('.scene'));
  if (!bar && !counter && !dots.length) return;

  const update = () => {
    const scrollY = window.scrollY;
    const max = document.documentElement.scrollHeight - window.innerHeight;
    if (bar) bar.style.width = `${max > 0 ? Math.min(100, (scrollY / max) * 100) : 0}%`;
    if (counter || dots.length) {
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
      if (counter) counter.textContent = `${nearest + 1}/${scenes.length}`;
      dots.forEach((d, i) => d.setAttribute('aria-current', String(i === nearest)));
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
 *  (bei center-align wäre der oberste Teil der Szene unerreichbar) */
function initSnapTall() {
  const vh = window.innerHeight;
  document.querySelectorAll('.scene').forEach((s) => {
    if (s.scrollHeight > vh * 1.15) s.style.scrollSnapAlign = 'start';
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

  const goTo = (i) => {
    const s = scenes[Math.max(0, Math.min(scenes.length - 1, i))];
    const tall = s.scrollHeight > window.innerHeight * 1.15;
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
        if (Math.abs(acc) >= 30) goTo(nearestIndex() + (acc > 0 ? 1 : -1));
        acc = 0;
      }, 150);
    },
    { passive: false },
  );
}

function init() {
  initRise();
  initWords();
  initCount();
  initBars();
  initDonut();
  initSplit();
  initStrike();
  initQuote();
  initChapter();
  initSnapTall();
  initWheelSnap();
  initProgress();
  initAccent();
  initResume();
  ScrollTrigger.refresh();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}