# fck_afd — info-afd.de

Anti-AfD-Faktensite (Astro 7 + Svelte 5 + GSAP, TikTok-Stil-Scrolltour, Mobile first).
Live: https://info-afd.de — jede Behauptung mit archivierter Primärquelle (SHA256).

## Wichtige Dateien
- `notes/UPDATE-PFAD.md` — technischer Update-Prozess (archive → scenes.json → validate → build → deploy)
- `notes/konzept/PROJEKT_LOG.md` — Chronik: was wann warum gebaut
- `notes/konzept/MASTER_UMSETZUNG.md` — 8 Design-Regeln, Wellenplan, Dauer-Update-Prozess (Monats-Zyklus)
- `content/scenes.json` / `content/chapters.json` — alle Inhalte
- `sources/pages/` + `sources/sources_log.md` — Quellen-Archiv

## Prozess (verbindlich)
- **Arbeits-Branch:** `v1.6` (Nachfolger von v1.5) · **Release-Branch:** `master` = Live
- **Nick gibt frei:** Wellen, Deploy-Runden, Kachel-Kuration. Ohne Freigabe nichts live.
- **QA-Pflicht vor Commit:** `cd site && npm run validate && npm run build && node scripts/smoke.cjs`
  (Smoke braucht `CHROME_PATH=C:\Users\nickn\AppData\Local\ms-playwright\chromium-1234\chrome-win64\chrome.exe`
  + laufenden Preview-Server auf :4173 — Start: `Start-Process node -ArgumentList "node_modules\astro\bin\astro.mjs","preview","--port","4173" -WorkingDirectory <site>`; lauscht auf `::`)
- **Playwright-Browser liegen unter** `%LOCALAPPDATA%\ms-playwright` (Windows), NICHT `~/.cache/ms-playwright` (Linux-Pfad aus dem alten Setup)
- **Git-Identität im Repo:** `Nick <nick@local>` (repo-lokal config, nicht global)
- **Neue Szene-Felder VOR Verwendung in `validate-content.mjs` pflegen** (Regel aus Master §4.3)
- **Validator-Warnung „scene #2 statement ohne source" ist bekannt** — Meta-Statement ohne Fakten, bewusst quellenlos

## Erledigt (Stand 12.09.2026)
- Welle 1+2: LIVE auf info-afd.de (42 Szenen, 7 Kapitel)
- Welle 3 A+B (Teilen-pro-Szene, Kachel-Export, 42 OG-Images, Punktschwarm, Hero-Pin): gemerged, live
- 3.6 Kosten-Du-Rechner + 3.5 Quellen-Verzeichnis als Feature: erledigt auf Branch `v1.6`, Freigabe ausstehend
- Bugfix: `transition:slide` ohne Import (ReferenceError bei jedem Slider-Reveal, Vorbefund seit Initiale)

## Offen
- 3.2 Timeline-Kamerafahrt (nur Desktop) — letzter Welle-3-Punkt
- Quellen-Retry: IW-Köln 403, LG-Halle-PM 404 (Fakten doppelt belegt über Ersatzquellen)
- Monats-Recherche-Zyklus (nexus): neue September-Beispiele
- OG-Images neu rendern (`scripts/og-scenes.mjs`) sobald Content-Texte sich ändern