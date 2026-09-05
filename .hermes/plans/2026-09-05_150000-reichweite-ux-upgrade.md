# fck_afd — Reichweite + UX Upgrade (alle Analyse-Punkte)

**Goal:** Umsetzung aller Verbesserungspunkte aus der Projekt-Analyse vom 05.09.2026 — außer Quiz-Ergebnis-Sharing (von Nick ausgeschlossen).

**Architecture:** Astro 7 statische Site in `site/`, Content als JSON in `content/`, zentrale Animationen in `src/scripts/animations.js`. Neue Features greifen dezentral: Meta-Upgrade im Layout, Share-Logik als ein globales Script, Kapitel-Unterseiten als statische Astro-Pages aus demselben `content/`-Datenbestand.

**Tech Stack:** Astro 7, Svelte 5 (Islands), GSAP, Playwright-core (aus /root/soulhouse/frontend, chromium-1234) für og:image-Rendering.

---

## Tasks (serielle Reihenfolge)

### Task 1: Meta/SEO-Upgrade in Base.astro + astro.config
- `site/astro.config.mjs`: `site: process.env.SITE_URL || 'https://fck-afd.example'` (Deploy-Domain später EINMAL hier ändern).
- Neu: `site/src/lib/meta.js` — zentrale Konstanten (SITE_STAND='05.09.2026', Share-Texte).
- `site/src/layouts/Base.astro`: canonical (Astro.site + Astro.url.pathname), og:image (+width/height/alt), og:url, twitter:card summary_large_image, twitter:title/description.
- Verify: `npm run build`, grep auf og:image/canonical in dist/index.html.

### Task 2: og:image generieren
- Neu: `site/scripts/og-image.mjs` — rendert `site/og-image/template.html` (1200×630, Dark-BG, Glow-Hauch, Space-Grotesk aus node_modules @fontsource-variable via file://) zu `site/public/og-image.png` mit playwright-core + chromium-1234 (bekanntes Muster aus soulhouse: .cjs/executablePath).
- npm script `"og": "node scripts/og-image.mjs"`; PNG committed.
- Verify: PNG existiert, ~>=600px breit geprüft via file-Größe, in dist/.

### Task 3: Szenen-Sharing + Deep-Links
- Neu: `site/src/scripts/share.js` (geladen in Base.astro):
  - Jede `.scene` bekommt `data-share-text` (build-time in index.astro aus scene-Feldern erzeugt).
  - Share-Button je Szene (kleines Pill neben scene-num, `data-share`).
  - navigator.share vorhanden → native Sheet (deckt WhatsApp/Telegram mobil ab); sonst Popover: Telegram-Deeplink (t.me/share/url), WhatsApp (wa.me/?text=), Link kopieren.
  - Anker: id `scene-{i}` für ALLE Szenen; Initial-Hash → scrollIntoView (instant), hashchange → smooth.
  - Beim Scrollen (throttled) `history.replaceState` auf `#scene-{i}` → kopierte URL ist immer szenengenau.
- EndCard-Fallback (kein navigator.share) nutzt dasselbe Popover.
- Verify: Build + Headless-Check (Popover öffnet, Hash-Scroll landet in Szene).

### Task 4: sitemap + robots
- Neu: `site/src/pages/sitemap.xml.ts` + `site/src/pages/robots.txt.ts` (Endpunkte, Base-URL aus Astro.site; / + 6 Kapitel + /quellen).

### Task 5: Kapitel-Unterseiten (SEO)
- Neu: `site/src/pages/[slug].astro` mit getStaticPaths aus chapters.json: /verfassungsschutz /programm /innen /kosten /einwaende /fazit; plus `/quellen` (alle Quellen + Archiv-Hinweis).
- Lese-Modus: Szenen-Komponenten OHNE Scene-Wrapper in `.doc-mode` (neutralisiert .scene-Viewport-/Snap-Styles via CSS-Overrides in global.css), H1 = Kapitel, chapter question als Intro, Footer: Link zur kompletten Tour + Stand.
- Islands (Quiz/Reveal/Slider) funktionieren weiter (client:visible).
- Verify: jede Unterseite baut, enthält echten Text, Links zeigen auf /.

### Task 6: Kapitel „Einwände" (07? — wird Kapitel 06 vor Fazit)
- `content/chapters.json`: einwaende (num 06, accent #E86FA5-prüfen auf --accent-contrast) vor fazit; fazit num → 07.
- `content/scenes.json`: 6 Szenen vor dem fazit-chapterbreak einfügen (statement, contrast ×3, reveal):
  1. C1 „VS ist parteiisch" → rechtskräftig in drei Instanzen (Quelle: tagesschau-FAQ, archiviert).
  2. Reveal „Drei Instanzen, drei Niederlagen" (2022 VG Köln, 2024 OVG NRW, 2025 BVerwG, Az. 6 B 23.24) (Quelle: lto/verfassungsschutz.de, archiviert).
  3. C2 „Höcke/Krah sind Einzelfälle" → VSB 2025 S. 131: liberal-konservative Positionen „öffentlich kaum noch wahrnehmbar" (Quelle: VSB 2025 PDF, archiviert).
  4. C3 „nur Wahlkampf-Forderungen" → tatsächlich im Bundestag: Erbschaftsteuer-Abschaffung (HIB), Junior-Spardepot (21/2163), Klimafolgenbereinigung kippen (Quelle: bundestag.de, archiviert).
- Alle URLs nur aus sources/sources_log.md (Archiv vorhanden) — Nick-Regel.
- Verify: `npm run validate`.

### Task 7: Timeline-Szene (Verfassungsschutz-Kapitel)
- Neu: `site/src/components/scenes/Timeline.astro` — horizontale Swipe-/Scroll-Karte (overflow-x + scroll-snap-x, Drag-Scroll am Desktop, reduced-motion safe), 6 Karten: 03/2021 Verdachtsfall → 03/2022 VG Köln → 05/2024 OVG NRW → 02.05.2025 gesichert rechtsextremistisch → 05/2025 BVerwG rechtskräftig → 26.02.2026 Hochstufung vorläufig ausgesetzt.
- Je Karte eigenes Source-Tag. Position: Kapitel 02, nach dem BfV-Quiz.
- Validator: 'timeline' → jedes item braucht date+title+source; 'action' → NO_CLAIM_TYPES.

### Task 8: „Was du tun kannst"-Szene vor EndCard
- Neu: `site/src/components/scenes/Action.astro` (type 'action'): 4 Karten — Wählen (nächste Landtagswahlen, Sachsen-Anhalt 06.09.2026 als Beleg, Quelle wahlrecht.de archiviert), Selbst prüfen (Checkliste + Link /quellen), Umfeld ansprechen (→ Teilen-Buttons), Vertiefen (VSB-PDF, tagesschau FAQ, correctiv — archivierte URLs).
- In index.astro + Unterseiten-Renderer registrieren; vor endcard in scenes.json einfügen.

### Task 9: A11y + Stand-Badge
- QuizIsland: `aria-live="polite"` + role="status" auf Explanation.
- index.astro: Skip-Link „Direkt zum Fazit" → #scene-summary (summary scene bekommt feste id).
- Stand-Badge unten links (fixiert): „Stand: 05.09.2026 · Quellen archiviert", Klick → zur Quellen-Szene; CSS in global.css; aria-label.
- Quelle-Count automatisch aus scenes.json.

### Task 10: Update-Pfad dokumentieren
- Neu: `notes/UPDATE-PFAD.md` — wie Zahlen/Szenen/Quellen aktualisiert werden (scenes.json-Felder, tools/archive_source.py, validate, og neu?, SITE_STAND in lib/meta.js, build, commit/push). 

### Task 11: Gesamtverify + Push
- `npm run validate && npm run build` sauber.
- Headless-Smoke (playwright-core): Index + 2 Unterseiten laden ohne Console-Errors, Quiz klickbar (aria-live da), Share-Popover öffnet, Timeline scrollbar, Badge da.
- Git: Commits pro Task-Bereich als Nick, push auf origin/master. Tag bleibt v0.2-glow (Release nur wenn Nick will).

## Files
- Modify: site/astro.config.mjs, site/src/layouts/Base.astro, site/src/pages/index.astro, site/src/styles/global.css, site/src/components/Scene.astro, site/src/components/scenes/{EndCard,QuizIsland}.astro/.svelte, site/scripts/validate-content.mjs, content/{chapters,scenes}.json
- Create: site/src/lib/meta.js, site/src/scripts/share.js, site/scripts/og-image.mjs, site/og-image/template.html, site/src/pages/[slug].astro, site/src/pages/quellen.astro, site/src/pages/{sitemap.xml,robots.txt}.ts, site/src/components/scenes/{Timeline,Action}.astro, notes/UPDATE-PFAD.md, site/public/og-image.png

## Risiken
- Domain unbekannt → Platzhalter https://fck-afd.example zentral in astro.config; og:image URL und canonical daraus abgeleitet (eine Zeile ändern beim Deploy).
- share.js Popover auf Mobile nur Fallback (native Sheet priorisiert).
- scenes.json-Inserts programmatisch (Python), damit $comment/Formatierung erhalten bleibt.