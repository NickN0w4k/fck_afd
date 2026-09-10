# Konzept Teil 3 — Visualisierungs- & Tech-Konzept (apex)

Für: info-afd.de Engagement-Relaunch · Stand: Sep 2026 · Basis: Repo-Review `site/src/components/scenes/` (alle 14 Typen physisch vorhanden: Action, ChapterBreak, Contrast, Data, EndCard, Hero, Quiz+QuizIsland, Quote, Reveal+RevealIsland, Slider+SliderIsland, Sources, Statement, Summary, Timeline), `scripts/animations.js` (GSAP-Registry), `content/scenes.json` (34 Szenen: 6× chapterbreak, 5× quote, 4× data, 4× contrast, 3× reveal, 3× quiz, 2× statement, je 1 hero/timeline/slider/summary/action/endcard/sources).

**Bestands-Befunde, auf denen alles hier aufbaut:**
- GSAP läuft zentral über die Registry `animations.js` (data-Attribute: `data-anim="rise"`, `data-count`, `data-bar`, `data-donut`, `data-split`, `data-strike`, `data-quote`, `data-words`). Alles `once:true` oder scrub — **kein einziges `pin`**, kein scrubbed Counter, keine Kamerafahrt. Genau da liegt der Hebel.
- `prefers-reduced-motion` ist als Muster überall sauber umgesetzt (Endzustand wird gesetzt, nicht nur übersprungen) — neue Effekte müssen dieses Muster kopieren.
- Die Site ist aktuell **100 % typografisch**: null Fotos im Repo (nur favicon + og-image), keine Astro-Image-Pipeline. Das ist ein Performance-Vorsprung — gezielt behalten, Fotos nur selektiv.
- Data-Komponente unterstützt `chart: 'bars' | 'donut'` + Counter + Pull-Number + Caption gleichzeitig — das ist zu viel pro Szene und Teil des Textwand-Problems.

---

## 1. Daten-Storytelling: Kern-Zahlen → Chart → Szenen-Typ

**Grundregel: eine Zahl = eine Szene = eine Botschaft.** Counter-Szene OHNE Chart (die Zahl ist der Chart), Chart-Szene OHNE Counter, Caption max. 2 Zeilen. Detail-Kontext wandert in `reveal`- oder `sources`-Szenen.

**Generische Chart-Wahl nach Zahlentyp:**
| Zahlen-Arbeit | Chart-Typ | Beispiel |
|---|---|---|
| Absolute, groß, abstrakt | Counter (scrubbed) + Punkt-Schwarm oder Vergleichs-Kette | 28.000, 690 Mrd. |
| Anteil an Ganzem | 10×10-Kachel-Raster oder Donut | 44,0 % |
| Verhältnis Gewinner/Verlierer | Diverging Bars (auf/ab) | +440 € vs −19.190 € |
| Entwicklung über Zeit | Gestaffelte Balken mit Scrub | 11.300 → 20.000 → 28.000 |
| Größenordnung einordnen | Anker-Vergleichsbalken | 690 Mrd. = 1,4× Bundeshaushalt |

**Keine Chart-Library (Chart.js, d3).** Alles hier geht mit Inline-SVG/DOM + GSAP. Chart.js wäre ~50 KB gzip für Diagramme mit < 10 Elementen. Bestehende bars/donut-Implementierung zeigen, dass der Ansatz trägt.

### 28.000 Rechtsextremisten im AfD-Umfeld (VSB 2025)
- **Szenen-Typ:** `data` (bestehende Szene Kap. 2, value=28000, chart=bars 2023/2024/2025).
- **Umbau:** Counter wird **scrubbed** (Zahl zählt mit Daumen auf, statt once) — siehe Abschnitt 3. Die drei Jahres-Balken behalten ihren once-Stagger, aber als **Ergänzung, nicht parallel zum Counter**: Chart in eigene Folge-Szene auslagern, Counter-Szene pur.
- **Erweiterung (optional, großer Effekt):** Punkt-Schwarm als gepinnte Mini-Story — 1 Punkt ≈ 250 Personen → 112 Kreise; Pin 3 Screens: 11.300 (45 Punkte) → 20.000 (80) → 28.000 (112), Punkte poppen gestaffelt. DOM-Kreise reichen (112 < 300, Canvas-Grenze s. Abschnitt 4). Quellenverweis bleibt BMI-VSB 2025.

### 690 Mrd. € Dexit-Kosten (IW Köln)
- **Status:** noch keine Szene in scenes.json — kommt mit nexus-Recherche. Neu anlegen als `data` **plus** `slider`.
- **Slider zuerst:** Schätzfrage „Was kostet der Dexit deiner Schätzung nach?“ (0–1000 Mrd.), Auflösung 690 — bestehende SliderIsland-Mechanik, nur Content. Schätzung vor Auflösung = die Zahl verankert sich.
- **data-Szene als `compare`:** neuer Chart-Untertyp — Anker-Balken 690 (Akzentfarbe) + Vergleichsbalken darunter (Bundeshaushalt ~500, Corona-Hilfen ~300 — Zahlen von nexus belegen lassen). Scrubbed: Balken wachsen mit Scroll, der 690er überragt sichtbar.
- **Typo-Moment:** 690.000.000.000 einmalig ausgeschrieben, Nullen erscheinen einzeln (scrubbed stagger) — reine Typo, kein Chart-Element nötig.

### +440 € Familienbelastung (Steuerpläne, ZEW)
- **Szenen-Typ:** `data`, Umbau der bestehenden Szene (Kap. 5 „kosten“, aktuell Headline 19.190 € + Balken 95 % vs 3 %).
- **Problem heute:** Die +440 € stecken in der Caption, der Counter zeigt 19.190 € — der eigentliche Kern (Normalfamilie ZAHLT drauf) ist unsichtbar.
- **Umbau zu `diverging bars`:** Headline „+440 €“ (Counter, scrubbed). Chart: Balken nach Einkommens-Stufe, Entlastung nach oben (Akzent), Belastung nach unten (rot), Nulllinie sichtbar. „Familie 40.000 €“ = negativer Balken −440, „180.000 €“ = +19.190. Das Verhältnis erzählt die Story ohne Caption.
- **Interaktion (optional):** Slider „Was verdient deine Familie?“ → Marker springt auf den zugehörigen Balken. Aufwand mittel, nur wenn Kapitel 5 ohnehin erweitert wird.

### 44,0 % AfD Sachsen-Anhalt
- **Szenen-Typ:** `data` (bestehende Szene, chart=bars AfD/CDU/SPD).
- **Umbau zu 10×10-Kachel-Raster** (`chart: 'tiles'`): 100 Kacheln, 44 färben sich gestaffelt Akzent, Rest bleibt dunkel. Starker als Balken, weil es „fast die Hälfte des Landes“ physisch zeigt. Balken AfD/CDU/SPD als kleine Stat-Tiles daneben oder Folge-Szene.
- **Kein Choropleth/Wahlkreis-Karte:** Aufwand groß, Pflege der ST-Daten teuer, Mehrwert für Mobile gering. Nur wenn nexus Landtags-Daten komplett liefert, als spätere Erweiterung.

---

## 2. Bild-/Icon-System

**Grundsatz-Entscheidung: Icon/Typo-first bleiben, Fotos als Ausnahme.**
Fotos von Politikern: Porträtrecht, Kontext-Manipulation (Foto ≠ Beweis), LCP-Kosten auf Mobile. Die Site verkauft Fakten, keine Stimmung — Typo + Icon transportiert das besser und bleibt schnell.

### Wo was
| Kontext | Mittel |
|---|---|
| hero, chapterbreak | **Typo + Ambient-Glow** (bestehend). Optional: 1 großes Duotone-Foto pro Kapitel (z. B. Landtag ST für Kap. 2) — nur wenn nexus kuratierte, frei lizenzierbare Bilder liefert |
| data (alle) | **Charts + reine Typo**, kein Foto, kein Deko-Icon |
| quote | **Typo.** Optional Duotone-Foto des Zitierenden als Tile-Hintergrund (CSS-Filter, 2 Farben aus Kapitel-Akzent) |
| contrast | **Typo**, die Panel-Farben sind die Botschaft |
| reveal | **Icon** im Teaser (Schloss/Skull/Skala je Inhalt) |
| timeline | **Icon pro Karte** (Datum + Icon + Titel), 1 Icon-Kategorie pro Kapitel |
| summary/endcard/action | **Icon** + Stat-Tiles |
| statement | **Typo** |

Duotone-Rezept: Foto → `filter: grayscale(1) contrast(1.2)` + Overlay in Kapitel-Akzent mit `mix-blend-mode: multiply`, dunkler Base-Layer. Kein JS, 3 CSS-Zeilen, sieht kuratiert statt Stock aus.

### Komponenten (neu)
1. **FactTile.astro** — „Fakten-Kachel“: quadratisch, 1 Inline-SVG-Icon + Zahl/2-Wörter-Label + Source-Tag optional. Grid aus 4–9 Kacheln pro Szene. Für: Verfassungsschutz-Merkmale (Menschenfeindlichkeit, Verfassungsfeindlichkeit…), AfD-Struktur (Flügel, Junge Alternative…), Programm-Kernpunkte. Entrance: Stagger-Rise über Registry (`data-anim="rise"` + `--d`).
2. **FactTileGrid.astro** — Wrapper: Raster 2×2 (mobile) bis 3×3, prop `tiles: {icon, value, label, source?}[]`.
3. **QuoteTile.svelte** — kompakte Zitat-Kachel für summary/endcard: Autor + 1-Zeilen-Zitat, Klick → expandiert zum Vollzitat mit Einordnung. Nutzt `factList()` aus textsplit.js.
4. **StatTile.astro** — Zahl + Label, 3–4 Stück in summary: „28.000 · 690 Mrd. € · +440 € · 44 %“ als Recap-Grid mit scrubbed Countern.

### Karten-Stile (Systematik, bestehende wiederverwenden)
- **Card solid** (bg-elev + Border): timeline-Karten, reveal-Karte, Einordnungs-Karte in quote — Bestand, unverändert.
- **Tile** (quadratisch, icon-first): neu (FactTile/StatTile).
- **Split-Panel** (claim/reality): contrast — Bestand.
- **Duotone-Media-Karte:** Foto-Variante für quote/chapterbreak, neu.

### Icon-Quelle
Lucide-Subset als Inline-SVG (MIT, per Hand kopiert in `src/components/icons/`), stroke 2px, 24er-Grid, `currentColor`, Kapitel-Akzent via CSS-Var. **Keine Icon-Font, keine Icon-Library als npm-Dependency** — Icons liegen als .astro-Snippets, tree-shaken von Natur aus. Max. 20 Icons insgesamt, wiederverwendet über Kapitel-Akzent.

---

## 3. Scroll-Story-Techniken mit GSAP — pro Szenen-Typ

Bestand ist die Registry in `animations.js` (initRise/initWords/initCount/initBars/initDonut/initSplit/initStrike/initQuote + ambient/glow). Alles Neue kommt als weitere `init*`-Funktion in dieselbe Registry — kein zweites Animationssystem. Alle scrubs: `prefers-reduced-motion` → Endzustand direkt setzen (bestehendes Muster), `invalidateOnRefresh: true` bei Pins.

### data
- **Scrubbed Counter** (`data-count-scrub`): `gsap.to(obj, { v: target, ease: 'none', scrollTrigger: { trigger: el, start: 'top 85%', end: 'top 35%', scrub: 0.5 } })`. Die Zahl folgt dem Scroll — „du machst die Zahl“. `once`-Variante für bestehende Szenen behalten; scrub explizit pro Szene opt-in, damit nicht alle 34 Szenen umgebaut werden.
- **Pin-Stack** für die 2–3 großen Zahlen-Storys (28.000 Punkt-Schwarm, 690 Mrd.): `pin: true, end: '+=1500'`, gsap.timeline mit 3 Phasen, Phasenwechsel über Scrollposition. **Pin-Budget: max. 3 Pins auf der ganzen Tour** — jeder Pin kostet Scroll-Länge und Batterie. pinType `transform`, `anticipatePin: 1`.
- **Balken:** Bestand (once + Stagger) für einfache Charts bleibt. Für Zeitreihen (2023→2025) scrubbed Variante: Balken wachsen nacheinander mit Scroll, Zahl zählt mit.

### reveal
- Bleibt tap-first — **kein Pin**, Interaktion ist der Hook. Neu: Tease-Beim-Scrollen (leichte Rotation ±1.5° + Scale 0.98→1, once) und beim Öffnen Kamera-Zoom: Karte scale 0.94→1 mit `ease: 'power2.out'`, Umfeld dimmt (Svelte-Transition + CSS-Klasse, kein GSAP nötig).

### contrast
- Bestehender Split (data-split, scrubbed 100 %→50 %) ist bereits eine Mini-Kamerafahrt — behalten.
- **Upgrade 1:** Claim-Text parallaxt 12 px nach links während der Split öffnet (zweiter scrubbed Tween auf `.claim-text`).
- **Upgrade 2:** Reality-Panel slidet mit `y: 40, autoAlpha: 0` nach, `stagger: 0.15`, sobald Split bei 50 %.
- **Mythos-Variante (data-strike):** beim `struck` zusätzlich Panel-Rotation `rotationY: -3, transformPerspective: 600` — die Behauptung „kippt“ physisch weg.

### slider
- Ergebnis-Moment inszenieren: Nach „Auflösen“ zählt der Readout von der eigenen Schätzung auf den wahren Wert (`gsap.to` auf Proxy-Objekt, snap auf ganze Zahlen, duration 1.2) — die Differenz wird physisch erlebt.
- Differenz-Balken: „Deine Schätzung vs. Wahrheit“ — zwei Balken wachsen gestaffelt (Registry `data-bar` wiederverwenden, SliderIsland rendert sie nach Reveal).
- Kein Pin — Slider ist Input-Szene, Scroll darf nicht gekapert werden.

### timeline
- **Desktop:** Kamerafahrt statt Drag — Track `translateX` wird an vertikalen Scroll gekoppelt: `gsap.to(track, { x: -(scrollWidth - viewportWidth), scrollTrigger: { trigger: scene, pin: true, scrub: 1, end: '+=1200' } })` — oder sauberer: ScrollTrigger `containerAnimation` (GSAP 3.15 hat das), damit Karten-Kanten als Trigger nutzbar sind.
- **Mobile:** bleibt nativer Swipe mit Scroll-Snap (bestehend) — Pin auf Touch ist Batterie-/UX-Gift. Media-Query im Init-Skript (`matchMedia('(min-width: 768px)')` via `gsap.matchMedia()`).
- **Fokus-Dim:** aktive Karte scale 1.04, übrige opacity 0.5 — via ScrollTrigger mit `onToggle` per Karte.

### statement / hero
- statement: Wort-Building (bestehend, scrubbed) behalten; neues Finale: Schlüsselwort (`<mark>`) zoomt zum Schluss `scale: 1 → 1.18` (scrubbed, Ende der Timeline).
- hero: Parallax-Kamerafahrt — Ambient-Glow-Layer `yPercent: 30, scrub`, Headline `yPercent: -10`, Pin + Fade-out bei erstem Scroll (`end: '+=600'`). Nur wenn Pin-Budget noch frei (Hero zählt als Pin 1 von 3).

---

## 4. Performance-Budget Mobile

Zielgeräte: Mittelklasse-Android auf 4G. Die Site startet gut (kein Bild, self-hosted Fonts, GSAP ~70 KB) — Budget hält diese Stellung fest.

| Budget | Wert | Begründung/Maßnahme |
|---|---|---|
| LCP | **< 2,0 s** | LCP-Element ist Hero-Headline (Typo). Fonts `font-display: swap` (fontsource-Default), nur latin + latin-ext laden. Kein Render-blocking außer global.css. |
| JS gesamt (gzip) | **< 120 KB** | GSAP core (~34 KB) + ScrollTrigger (~24 KB) + Svelte-Islands (~20–30 KB) + own code. **Keine weiteren GSAP-Plugins** (Observer, Flip, MotionPath unnötig). Islands strikt `client:visible`. |
| INP | **< 100 ms** | Slider/Quiz/Reveal-Klicks: nur Transition/State, keine synchrone Layout-Arbeit. FactTileGrid rein Astro+CSS-Animation → 0 JS. |
| CLS | **0** | Pin-Wrapper reservieren Höhe (`min-height: 100svh`) im Markup, nicht per JS. Fonts mit size-adjust-Metrik. |
| Seite gesamt | **< 500 KB** über die Leitung | Aktuell ~<200 KB. Mit Icons (Inline-SVG, ~15 KB) und max. 6 Duotone-Fotos (je ~25–40 KB AVIF) realistisch < 450 KB. |
| Gleichzeitige Tweens | **≤ 3 pro Viewport** | Registry zählt aktiv über `ScrollTrigger.getAll()` beim Init; ambient/glow pausieren, sobald ein scrub-Pin läuft. |
| Scrub-Länge | **max. `end: '+=1500'`** | Länger = Endless-Scroll-Gefühl + Absprung. Pins: Hero, 28.000-Schwarm, 690-Mrd. — fertig. |
| Glow/Ambient | **nur ≥ 1024px** | `gsap.matchMedia()`: hue-shift + grain-Tween auf Mobile deaktiviert (statisches CSS) — spart kontinuierliche Composite-Kosten. |
| Bilder (wenn Fotos) | **AVIF + WebP-Fallback via astro:assets**, widths 480/960/1440, quality 60–70 | Nur hero/chapterbreak/quote-Hintergrund. LCP-Foto: `fetchpriority="high"`, alles andere `loading="lazy"`. LQIP als CSS-Blur-Placeholder. Kein Unpic/externer Dienst nötig — Astro 7 bringt die Pipeline mit. |
| Punktwolke | **DOM-Kreise, max. 300 Punkte** | 112 Punkte bei 1:250: reine `transform`-Animation auf `<div>`, GPU-ok. Darüber Canvas — bei den geplanten Zahlen nie nötig. |
| prefers-reduced-motion | **Pflicht-Muster**: Endzustand setzen | Scrubs und Pins zeigen Endzustand sofort (Muster aus initCount/initStrike), keine „skip only“-Lösung. Pins ohne Animation → normale Dokumenthöhe. |

Anti-Patterns (nicht machen): normalizeScroll auf Touch (iOS-Fallstricke), Canvas/Video-Loop im Hero, Scroll-Jacking über 2 Kapitel hinaus, Chart-Library, Icon-Font, Fotos ohne Astro-Pipeline.

---

## 5. Umbauplan: Bestand → Ziel, mit Aufwand

Aufwand: **klein** < 2 h · **mittel** ½–2 d · **groß** > 2 d. Reihenfolge nach Impact/ Aufwand.

| # | Bestands-Komponente | Maßnahme | Aufwand | Reihenfolge |
|---|---|---|---|---|
| 1 | `Data.astro` + `initCount` | Scrubbed-Counter als Opt-in (`data-count-scrub`), Registry erweitern | klein | 1 |
| 2 | `SliderIsland.svelte` | Reveal-Countdown (Schätzung→Antwort) + Differenz-Balken | klein | 1 |
| 3 | `Contrast.astro` + `initSplit`/`initStrike` | Parallax-Claim, Reality-Stagger, struck-Kippung | klein | 2 |
| 4 | `Reveal.astro`/Island | Tease beim Scrollen + Kamera-Zoom beim Öffnen | klein | 2 |
| 5 | `Data.astro` | Chart-Untertyp `diverging` (positiv/negativ-Balken) → +440-€-Szene umbauen | mittel | 2 |
| 6 | `Data.astro` | Chart-Untertyp `tiles` (10×10-Kachel-Raster) → 44-%-Szene umbauen | mittel | 3 |
| 7 | `animations.js` | `initParallax` + `initPinStack` (pin + Timeline, reduced-motion-Fallback) | mittel | 3 |
| 8 | `Data.astro` | Chart-Untertyp `compare` (Anker + Referenz-Balken) → 690-Mrd-Szene (wartet auf nexus-Zahlen) | mittel | 4 |
| 9 | neu: `FactTile.astro`, `FactTileGrid.astro`, `StatTile.astro` | Icon-System + Summary-Rebuild mit scrubbed Countern | mittel | 4 |
| 10 | `Timeline.astro` | Desktop-Kamerafahrt via `containerAnimation` + Fokus-Dim, Mobile unverändert | mittel | 5 |
| 11 | `Hero.astro` | Parallax-Pin + Fade-out (Pin 1 von 3) | mittel | 5 |
| 12 | neu: `QuoteTile.svelte` | Kompakt-Zitat-Tiles für summary/endcard | mittel | 5 |
| 13 | `Data.astro` (28.000-Szene) | Pin-Stack Punkt-Schwarm (3 Screens, gestaffelt) | groß | 6 |
| 14 | `ambient.js`/`glow.js` | Mobile-Budget: glow/ambient nur ≥ 1024px via matchMedia | klein | nebenbei |
| 15 | `styles/global.css` + Registry | prefers-reduced-motion-Audit aller neuen Patterns (Endzustände!) | klein | je Stufe |
| 16 | `validate-content.mjs` | Neue optionale Felder (`chart: 'tiles'\|'compare'\|'diverging'`, `data-count-scrub`, tile-Props) im Schema + `npm run validate` | klein | je Stufe |

**Fahrplan in Wellen (kein Zeitdruck, aber sinnvolle Reihenfolge):**
1. **Quick Wins (Stufe 1+2):** scrubbed Counter, Slider-Auflösung, Contrast-/Reveal-Polish, +440-€-Umbau. Spürbarste Verbesserung pro Stunde.
2. **Charts (Stufe 3+4):** Kachel-Raster 44 %, compare 690 Mrd. (sobald nexus liefert), FactTile-System.
3. **Set-Pieces (Stufe 5+6):** Timeline-Kamerafahrt, Hero-Pin, 28.000-Schwarm. Nur wenn Mobile-Budget im Devtools-Profiling (Lighthouse + 4G-Throttle) hält.

**Risiken:**
- **scenes.json-Validator:** jedes neue Feld muss in `validate-content.mjs` gepflegt werden — Untertypen als optionale Felder designen, sonst bricht `npm run validate` bestehende Szenen.
- **Zwei Render-Pfade:** Szenen rendern in Snap-Feed (index) UND Kapitel-Seiten (`[slug].astro` via SceneBody) — jede neue Chart-Komponente muss in beiden Kontexten ohne JS auslieferbar sein (SSR-Darstellung = Endzustand).
- **Pin-Kaskade:** mehrere Pins nacheinander (`pinSpacing`) verlängern die Seite — Gesamtlänge im Blick behalten, Progress-Bar (bestehend) recalibriert über `ScrollTrigger.refresh()`.
- **Quellenpflicht:** jede neue Zahl (690 Mrd., +440) kommt nur mit `source` + Archivierung via `tools/archive_source.py` in die scenes.json — Recherche-Aufwand liegt bei nexus, nicht beim Umbau.

**Sterben soll nichts.** Alle 14 Typen bleiben; quiz/action/endcard/sources/chapterbreak bleiben unverändert. Die 5 Kern-Typen nach Umbau sind: `data` (5 Untertypen), `contrast`, `slider`, `reveal`, `quote` — deckt sich mit Nick-Ziel (weniger Text, mehr Grafik, mehr Interaktion).