// Matomo-Tour-Tracking: scene_view / scene_time / tour_exit via window.__matomoTrack
// (Bridge aus analytics.js, die Base.astro als klassisches Script vor diesem hier lädt).
// Zahlen-Präzision: scene_time wird PRO SZENE akkumuliert (Re-Entries addieren sich)
// und erst beim Verlassen der Seite geflusht — max. 1 scene_time-Event je Szene/Session.
// Matomo zählt Hash-URL-Änderungen nicht als Pageview — kein exclude-hash nötig.
// Gate: sendet nur auf info-afd.de (Headless-Test via window.__MATOMO_TOUR_TEST__).
(function () {
  'use strict';
  if (window.__matomoTour) return;
  window.__matomoTour = true;

  var HOST = 'info-afd.de';
  if (location.hostname !== HOST && window.__MATOMO_TOUR_TEST__ !== true) return;

  var A = window.__matomoTrack;
  if (!A) return; // Bridge fehlt (z. B. Script-Load-Reihenfolge) — nichts senden

  var scenes = Array.prototype.slice.call(document.querySelectorAll('.scene[data-scene-index]'));
  if (!scenes.length) return;

  var t0 = Date.now();
  var current = null;      // { index (slug), chapter, since }
  var times = {};          // slug -> akkumulierte ms
  var chapters = {};       // slug -> chapter
  var reached = 0;         // höchste angesehene Szenen-Nummer (data-scene-index)
  var seen = {};           // slug -> true (Dedupe scene_view; Zähler = Exit-Dimension 3)

  var accumulate = function () {
    if (!current) return;
    var dur = Date.now() - current.since;
    times[current.index] = (times[current.index] || 0) + dur;
    current = null;
  };

  var flushTimes = function () {
    Object.keys(times).forEach(function (sl) {
      var ms = Math.round(times[sl]);
      if (ms >= 1000) A.trackSceneTime(sl, chapters[sl] || '', ms);
    });
    times = {}; // nach pagehide/bfcache-Restore keine Doppelzählung
  };

  var enter = function (scene) {
    var idx = scene.getAttribute('data-scene-index');
    var sl = scene.getAttribute('data-slug') || idx;
    var ch = scene.getAttribute('data-chapter') || '';
    accumulate();
    current = { index: sl, chapter: ch, since: Date.now() };
    chapters[sl] = ch;
    var n = parseInt(idx, 10) || 0;
    if (n > reached) reached = n;
    if (!seen[sl]) {
      seen[sl] = true;
      A.trackScene(sl, ch);
    }
  };

  var io = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting && en.intersectionRatio >= 0.5) enter(en.target);
      });
    },
    { threshold: [0.5] }
  );
  scenes.forEach(function (s) { io.observe(s); });

  var onExit = function () {
    var lastIdx = current ? current.index : String(reached);
    accumulate();
    flushTimes();
    current = null; // bfcache-Restore erkennt die Szene via visibilitychange wieder
    A.trackTourExit({ last: lastIdx, reached: reached, seen: Object.keys(seen).length });
  };
  // pagehide feuert auch bei Tab-Schließen/Navigation; visibilitychange(hidden) sichert
  // nur die Zeit der aktuellen Szene — geflusht wird beim pagehide.
  window.addEventListener('pagehide', onExit, { capture: true });
  document.addEventListener('visibilitychange', function () {
    if (document.visibilityState === 'hidden') {
      accumulate();
    } else if (document.visibilityState === 'visible' && !current) {
      var mid = Math.floor(window.innerHeight / 2);
      var el = document.elementFromPoint(window.innerWidth / 2, mid);
      var sc = el && (el.closest ? el.closest('.scene[data-scene-index]') : null);
      if (sc) {
        var sl = sc.getAttribute('data-slug') || sc.getAttribute('data-scene-index');
        current = { index: sl, chapter: sc.getAttribute('data-chapter') || '', since: Date.now() };
        chapters[sl] = current.chapter;
      }
    }
  });
})();