// Zentrales Event-Tracking für Matomo — bewusst als IIFE/Klassik-Script (kein ESM),
// damit Base.astro es vor tour-tracking.js und share.js als <script src> laden kann.
// Alle Tour-/Quiz-/Share-Events: _paq.push(['trackEvent', category, action, name, value]).
// Custom Dimensions (action-scope, ids 1-3): 1=chapter, 2=reached, 3=seen.
// Policy (Nick): strikt anonym — disableCookies im Base.astro-Tag, IP-Anonymisierung serverseitig.
// Tracking darf nie brechen: jeder Push ist try/catch-gesichert.
(function () {
  'use strict';

  function push() {
    try {
      var q = window._paq;
      // Achtung: nach dem Tracker-Load ist _paq KEIN echtes Array mehr (Matomo
      // ersetzt es durch sein Queue-Objekt) — nur auf push-Funktion prüfen.
      if (q && typeof q.push === 'function') q.push(Array.prototype.slice.call(arguments));
    } catch (e) { /* tracking darf nie brechen */ }
  }

  var trackScene = function (slug, chapter) {
    push('setCustomDimension', 1, String(chapter ?? ''));
    push('trackEvent', 'Tour', 'scene_view', String(slug));
  };

  var trackSceneTime = function (slug, chapter, ms) {
    push('setCustomDimension', 1, String(chapter ?? ''));
    push('trackEvent', 'Tour', 'scene_time', String(slug), Math.round(ms));
  };

  var trackTourExit = function (_a) {
    var last = _a && _a.last, reached = _a && _a.reached, seen = _a && _a.seen;
    push('setCustomDimension', 2, String(reached ?? ''));
    push('setCustomDimension', 3, String(seen ?? ''));
    push('trackEvent', 'Tour', 'tour_exit', String(last ?? ''), Number(reached ?? 0));
  };

  var trackQuiz = function (scene, chapter, answer, correct) {
    push('setCustomDimension', 1, String(chapter ?? ''));
    push('trackEvent', 'Quiz', 'quiz_answer', scene + '|a' + answer + '|c' + (correct ? 1 : 0));
  };

  var trackShare = function (target, url) {
    push('trackEvent', 'Share', String(target), String(url ?? ''));
  };

  var trackTileExport = function (scene) {
    push('trackEvent', 'Share', 'tile_export', String(scene));
  };

  window.__matomoTrack = {
    trackScene: trackScene,
    trackSceneTime: trackSceneTime,
    trackTourExit: trackTourExit,
    trackQuiz: trackQuiz,
    trackShare: trackShare,
    trackTileExport: trackTileExport,
  };
})();