// Umami-Tour-Tracking: scene_view / scene_time / tour_exit.
// Lektion aus Welle 3: JS-generierte DOM-Zustände nie statisch verifizieren —
// dieses Script sendet nur bei hostname === 'info-afd.de' (kein Preview-/Local-Noise).
// Zahlen-Präzision (13.09.): scene_time wird PRO SZENE akkumuliert (Re-Entries addieren
// sich) und erst beim Verlassen der Seite geflusht — max. 1 scene_time-Event je Szene
// und Session statt je Eintritt einer. Hash-Pageviews schaltet der Tracker-Tag selbst
// aus (data-exclude-hash in Base.astro), ?ref= bleibt erhalten (kein exclude-search).
(function () {
  'use strict';
  if (window.__umamiTour) return;
  window.__umamiTour = true;

  var HOST = 'info-afd.de';
  var SITE = 'https://analytics.nwk-pro.dev';
  var WID = document.querySelector('script[data-website-id]');
  var websiteId = WID ? WID.getAttribute('data-website-id') : null;
  if (!websiteId) return;
  // __UMAMI_TOUR_TEST__ (nur in Headless-Tests via addInitScript gesetzt) umgeht den Hostname-Gate.
  if (location.hostname !== HOST && window.__UMAMI_TOUR_TEST__ !== true) return;

  var send = function (name, data) {
    var payload = {
      website: websiteId,
      hostname: HOST,
      language: navigator.language || 'de-DE',
      screen: window.innerWidth + 'x' + window.innerHeight,
      url: location.pathname,
      name: name,
      data: data,
    };
    if (window.umami && typeof window.umami.track === 'function') {
      try { window.umami.track(name, data); return; } catch (e) { /* fallback unten */ }
    }
    try {
      fetch(SITE + '/api/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'event', payload: payload }),
        keepalive: true,
      }).catch(function () {});
    } catch (e) { /* tracking darf nie brechen */ }
  };

  var scenes = Array.prototype.slice.call(document.querySelectorAll('.scene[data-scene-index]'));
  if (!scenes.length) return;

  var t0 = Date.now();
  var current = null;      // { index, chapter, since }
  var times = {};          // slug -> akkumulierte ms
  var chapters = {};       // slug -> chapter (für den Flush)
  var reached = 0;         // höchste angesehene Szenen-Nummer
  var seen = {};           // Dedupe: Szene nur einmal als view zählen

  var accumulate = function () {
    if (!current) return;
    var dur = Date.now() - current.since;
    times[current.index] = (times[current.index] || 0) + dur;
    current = null;
  };

  var flushTimes = function () {
    Object.keys(times).forEach(function (sl) {
      var ms = Math.round(times[sl]);
      if (ms >= 1000) send('scene_time', { scene: sl, chapter: chapters[sl] || '', ms: String(ms) });
    });
    times = {}; // geleert: nach pagehide/bfcache-Restore keine Doppelzählung
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
      send('scene_view', { scene: sl, chapter: ch });
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
    send('tour_exit', {
      last: lastIdx,
      reached: String(reached),
      session_ms: String(Date.now() - t0),
      seen: String(Object.keys(seen).length),
    });
  };
  // pagehide feuert auch bei Tab-Schließen/Navigation (keepalive überlebt das);
  // visibilitychange(hidden) sichert nur die Zeit der aktuellen Szene — geflusht wird
  // beim pagehide, damit ein Tab-Wechsel zurück die Akkumulation fortsetzen kann.
  window.addEventListener('pagehide', onExit, { capture: true });
  document.addEventListener('visibilitychange', function () {
    if (document.visibilityState === 'hidden') {
      accumulate(); // Zeit der aktuellen Szene sichern, Exit-Event nur beim pagehide
    } else if (document.visibilityState === 'visible' && !current) {
      // Zurück vom Tab: aktuelle Szene wieder als aktiv markieren
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