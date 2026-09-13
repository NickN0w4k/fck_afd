// Umami-Tour-Tracking: scene_view / scene_time / tour_exit.
// Lektion aus Welle 3: JS-generierte DOM-Zustände nie statisch verifizieren —
// dieses Script sendet nur bei hostname === 'info-afd.de' (kein Preview-/Local-Noise).
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
  var reached = 0;         // höchste angesehene Szenen-Nummer
  var seen = {};           // Dedupe: Szene nur einmal als view zählen

  var leave = function (ms) {
    if (!current) return;
    var dur = ms !== undefined ? ms : Date.now() - current.since;
    if (dur >= 1000) {
      send('scene_time', { scene: String(current.index), chapter: current.chapter, ms: String(dur) });
    }
    current = null;
  };

  var enter = function (scene) {
    var idx = scene.getAttribute('data-scene-index');
    var ch = scene.getAttribute('data-chapter') || '';
    leave();
    current = { index: idx, chapter: ch, since: Date.now() };
    var n = parseInt(idx, 10) || 0;
    if (n > reached) reached = n;
    if (!seen[idx]) {
      seen[idx] = true;
      send('scene_view', { scene: idx, chapter: ch });
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
    leave();
    send('tour_exit', {
      last: lastIdx,
      reached: String(reached),
      session_ms: String(Date.now() - t0),
      seen: String(Object.keys(seen).length),
    });
  };
  // pagehide feuert auch bei Tab-Schließen/Navigation (keepalive überlebt das);
  // visibilitychange(hidden) deckt Tab-Wechsel als Soft-Exit ab (nicht bFCache-sicher nötig).
  window.addEventListener('pagehide', onExit, { capture: true });
  document.addEventListener('visibilitychange', function () {
    if (document.visibilityState === 'hidden') {
      leave(); // Zeit der aktuellen Szene sichern, Exit-Event nur beim pagehide
    } else if (document.visibilityState === 'visible' && !current) {
      // Zurück vom Tab: aktuelle Szene wieder als aktiv markieren
      var mid = Math.floor(window.innerHeight / 2);
      var el = document.elementFromPoint(window.innerWidth / 2, mid);
      var sc = el && (el.closest ? el.closest('.scene[data-scene-index]') : null);
      if (sc) current = { index: sc.getAttribute('data-scene-index'), chapter: sc.getAttribute('data-chapter') || '', since: Date.now() };
    }
  });
})();