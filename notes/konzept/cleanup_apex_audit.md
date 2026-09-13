# Cleanup-Audit (APEX) — statischer Code-/Design-/UX-Review

Scope: `site/src/components/scenes/` (alle .astro + .svelte), `layouts/Base.astro`, `pages/index.astro`, `pages/szene/[scene].astro`, `pages/quellen.astro`, `pages/[slug].astro` (rendert dieselben Szenen), `lib/*.js`, `scripts/*.js` (Snap/Flight-Lock/GSAP-Logik), `styles/global.css`. Stand: Branch `cleanup`, Live-Stand.
Bewusst NICHT gemeldet (bekannt): Szene-2-Meta-Warnung, fehlendes Impressum, entfernter Hero-Parallax-Pin, Preview-/Subpfad-Thematik, transition:slide-Bug.
Grad: **KRITISCH** (User/Feature sichtbar kaputt) · **MITTEL** (erkennbarer Mangel) · **KLEIN** (Politur/Wartung).

---

## 1. BUGS — Referenzen, Lecks, Race-Conditions, Framework-Fallen

- **KRITISCH · `pages/szene/[scene].astro:31` + `layouts/Base.astro:24/46` — og:image der Szenen-Seiten ist relativ.** `[scene].astro` übergibt `ogImage = "/og/scene-N.png"` als String; Base nutzt den Override 1:1 ohne `new URL(..., site)` (nur der Default-Pfad wird absolut gemacht). og:image MUSS laut Spec absolut sein — WhatsApp/FB/X zeigen beim Teilen von `/szene/N/` kein Vorschaubild. Fix: in Base bei Override `new URL(ogImageOverride, site)` oder absolut in `[scene].astro` bauen. Live per Teilen verifizieren.

- **KRITISCH · `styles/global.css:149-151` — Kapitel-Akzent hängt an `attr(data-accent type(<color>))`.** Typed `attr()` wird aktuell nur von Chromium interpretiert; Firefox/Safari verwerfen die Deklaration → `--accent` bleibt Root-Rot in ALLEN Kapiteln. Ohne reduce fängt `initAccent()` (GSAP-ScrollTrigger) das beim Scrollen ab, aber **bei `prefers-reduced-motion` springt `initAccent` vorzeitig raus (animations.js:365) → kompletter Theme-Bruch (rot statt Kapitelfarbe) in Firefox/Safari**. Der CSS-Kommentar behauptet einen „Inline-Style-Fallback“, der im Markup nicht existiert (`Scene.astro` setzt nur `data-accent`, kein `style="--accent:…"`). Fix: Inline-Style auf die Section (wie `doc-page` es schon macht) — eine Zeile.

- **KRITISCH · `scripts/animations.js:209-251` (`initSplit`) — Contrast-Spalten-Scrub zerreißt das Mobile-Layout.** `gsap.fromTo(el, {width:'100%'}, {width:'50%'}, …)` läuft viewport-unabhängig; auf Mobile (`.contrast { flex-wrap: wrap }`, beide Panels `flex: 1 1 100%`, Stack untereinander) wird die Behauptungs-Box beim Scrollen auf 50 % Breite geschrumpft, während die Realität 100 % behält — in **6 Contrast-Szenen** halbbreiter Kasten mit zusammengestauchtem Text. Betroffen auch auf den Lese-Modus-Seiten (`[slug]`, `/szene/N/`), wo der Scrub-Endzustand (50 %) dauerhaft stehen bleibt, weil kein Snap zurückschreibt. Fix: Split-Scrub nur `@media (min-width: 768px)` (matchMedia im JS) bzw. `scrollMatchMedia` in GSAP.

- **KRITISCH · `scripts/animations.js:400-412` — Resume-Hint ist komplett unstyled und damit praktisch unsichtbar.** `hint.className = 'resume-hint'` + `data-anim="rise"`: Für `.resume-hint` existiert **keine CSS-Regel** (global.css hat nichts), und `initRise()` lief längst — der `data-anim`-Hook wirkt nie. Der Button erscheint als nackter Text am Body-Ende **nach der letzten Szene** (kein `position:fixed`), tief außerhalb des Viewports → das Resume-Feature („Weiter da, wo du aufgehört hast?“) ist für alle User tot. Fix: CSS-Klasse anlegen (fixed, bottom) oder Feature entfernen.

- **MITTEL · `pages/index.astro:97-103` + `styles/global.css:545-571` — Stand-Badge existiert nicht im Markup.** Das Script bindet einen Click-Listener auf `[data-goto-sources]`, global.css pflegt `.stand-badge` — aber **kein Element mit `data-goto-sources`/`.stand-badge` wird irgendwo gerendert**. Totes Feature (Stand-Badge fehlt live) + 30 Zeilen totes CSS + toter Listener-Code. Entweder Badge-Markup in Base/index rendern oder CSS+Script entfernen.

- **MITTEL · `components/scenes/Timeline.astro:112-134` — Drag-Scroll bricht Quell-Links am Desktop.** `pointerdown` auf dem Track ruft sofort `track.setPointerCapture(e.pointerId)` — auch wenn der pointerdown auf dem SourceTag-`<a>` landete. Nach Spec werden follow-up-Pointer-Events (inkl. compat mouse events) auf das Capture-Element retargetet, der synthetisierte `click` landet auf dem gemeinsamen Vorfahren (Track) statt auf dem Link → **Quellen-Klicks in Timeline-Szenen 4 und 37 können am Desktop tot sein** (Touch unaffected). Headless gegen Chrome verifizieren; Fix: Capture erst nach einer Bewegungsschwelle (~5 px) setzen und `click` nach Drag unterdrücken. Zusätzlich fehlt `user-select: none` beim Drag — Textauswahl und Scrollen konkurrieren.

- **MITTEL · `scripts/animations.js:120-123` — `initBars` ist an `.scene`-Wrapper gekoppelt; Balken auf Lese-Modus-Seiten unsichtbar.** Auf `[slug]`-Kapitelseiten und `/szene/N/` heißen die Wrapper `.doc-scene` → `document.querySelectorAll('.scene')` ist leer → **alle `data-bar`-Diagramme (Szenen 7, 27, 35) bleiben bei `width: 0 %`**, sichtbar nur leere Tracks; beim Swarm (Szene 3) bleibt `[data-bars-staged]` bei `autoAlpha`-SSR-Zustand, Balken ebenfalls 0. Öffentliche SEO-Seiten zeigen kaputte Charts (Zahlen stehen nur im Text/aria-label). Fix: Trigger auf `el.closest('section') ?? el` statt `.scene`.

- **MITTEL · `lib/meta.js:10-16` — FACTS6 ist ungenutzt UND widerspricht der Live-Liste.** `FACTS6` wird nirgends importiert (die ShareCard rendert `window.__fckafd_facts6` aus index.astro:81-88). Die tote Liste sagt `+440 €` („Familie verliert“ — big/small widersprechen sich selbst), die Live-Liste `−440 €`, Szene 38 ebenfalls `−440 €`. Vier Fakten-Instanzen statt der laut Skill erwarteten drei = Sync-Falle beim nächsten Fakt-Update. Fix: entweder index.astro importet FACTS6 (eine Quelle der Wahrheit) oder meta.js-Eintrag löschen.

- **MITTEL · `components/scenes/Contrast.astro:15-16, 81-92` + `scripts/animations.js:254-275` — Mythos-Durchstrich ist toter Code.** `data-strike` wird von keinem Markup gesetzt (0 von 42 Szenen nutzen `reality: "!"`): `initStrike`, die `--strike`-CSS-Regeln und der `replace(/^!/, '')`-Pfad in beiden scene-text-Varianten sind nie erreichbar. Entweder bewusst entsorgen (weniger Bundle/CSS) oder die „!“-Variante dokumentiert lassen.

- **KLEIN · `scripts/highlights.js:7` — Tippfehler im Regex: `Volksverhetzung|SA-Parole|Volksverhetzung`** (doppelt, vermutlich sollte da `Remigration`-Nachbar oder ein anderer Begriff stehen). Wirkungslos, aber verrät Copy-Paste; in `hl-server.js:5` fehlt das Duplikat — beide Patterns-Listen driften auseinander („gleiche Patterns“ stimmt nicht mehr).

- **KLEIN · `components/scenes/Hero.astro:111-120` — `.char`-Split ohne Consumer.** Der Kommentar sagt „für Stagger-Animation“, aber animations.js animiert nur das ganze `h1` (`data-anim="rise"`); kein Tween greift auf `.char` zu. Toter Code + `will-change`-artige Inline-block-Spans ohne Nutzen.

---

## 2. OPTIK — Mobile 390×844 zuerst, dann Desktop 1440×900

- **KRITISCH · Mobile: siehe BUG `initSplit`** — halbbreite Behauptungs-Box in 6 Szenen ist der größte Mobile-Optik-Bruch (390 px: 50 % = ~175 px Textspalte).
- **MITTEL · `scripts/animations.js:714` + `Data.astro:70-72` — „Wischen zum Weiterkommen ↓“ bleibt bei reduced-motion dauerhaft stehen.** Bei reduce springt `initPinStack` VOR dem Hint-Handling raus (Zeile 733 erreicht nie), das Ausblenden läuft nur in der Pin-Timeline. Reduced-User sehen den Hinweis auf eine Interaktion (Pin-Etappen), die für sie nicht existiert — irritierend, zumal auf `/szene/3/` und `[slug]`-Seiten (kein Pin) ebenfalls. Fix: bei reduce `display:none` per CSS-Media oder JS-Klasse.

- **MITTEL · `components/ChapterTracker.astro:70, 114-125` — Kapitel-Label läuft auf Mobile aus dem Container.** `white-space: nowrap` + `width: min(170px, 42vw)`: „Kapitel 0/6 — Verfassungsschutz“ (~230 px) ragt bei 390 px links/rechts über die 170-px-Schiene hinaus, zentriert unter den Segmenten. Zudem inkonsistente Nummerierung: der Tracker zeigt „Kapitel **0**/6“ (0-basiert), `primeChapterContext` (share.js:211) für dasselbe Element „Kapitel **1**/7“ (1-basiert, andere Nenner). Einheitlich `c.num`-basiert („00“–„06“) und `text-overflow`/wrap erlauben.

- **MITTEL · `scripts/highlights.js:15-17` — Highlight-Markierung bei reduced-motion inkonsistent.** Bei reduce returnet `initHighlights` bewusst ohne `<mark class="hl">` (der Code-Kommentar „bewusst ohne“ ist selbst unsicher formuliert) — aber Contrast/Reveal bekommen ihre Marks build-time via `hl-server.js` (SSR). Ergebnis: dieselbe Zahl ist bei reduce in Szenentyp A akzentuiert, in Statement/Quote nicht. Theme-Bruch zwischen Szenentypen; Entscheidung dokumentieren oder client-seitig nachziehen.

- **MITTEL · `styles/global.css:99-111` vs. `Data.astro` — reduced-motion + Szene 26 Count-up startet bei „0“.** SSR rendert `'0'` (Data.astro:47) und `initCount` setzt bei reduce den Zielwert (animations.js:76-78) ✓ — das funktioniert. Aber der Swarm-Counter zeigt bei reduce den SSR-Endwert „28.000“ ✓, während die Swarm-**Balken** (0 %) und der -Hint (bleibt sichtbar) den „Endzustand sofort“-Grundsatz brechen (vgl. Fund oben + BUG `initBars`). Einheitliche reduced-Endzustände prüfen.

- **MITTEL · `styles/global.css:396-399` + `Data.astro:243-248` — Mobile-Grid-Override für `.bar-row` doppelt gepflegt.** global.css überschreibt `.bar-row`/`.bar-label` global für ≤640 px, Data.astro enthält eigene Bar-Styles (14 px Track); SliderIsland (270-272) hat eigene Overrides. Drei Stellen, dieselbe Optik — bei der nächsten Balken-Änderung brechen sie unabhängig. In eine Stelle konsolidieren.

- **KLEIN · `components/scenes/SliderIsland.svelte:34, 83` — „Wahrheit“-Balken bei Antwort 0 unsichtbar.** Szene 12 (Trickfrage, `answer: 0`): `toPct(0) = 0` → der Akzent-Balken „Wahrheit“ hat Länge 0, nur das Text-Label bleibt. Für die Pointe der Szene wäre ein Mindest-„Tick“ (4 % wie bei initBars) erzählerisch besser.

- **KLEIN · `styles/global.css:390-392 + 533-542` — Share-Buttons mobil keine Kreise mehr.** Mobile Override setzt `.scene-share` auf 42×42 px, aber die globale 44-px-min-height-Regel für Buttons (Zeile 390) zwingt Höhe 44 → 42×44-Ellipse statt Kreis bei `border-radius: 50 %`. Auf 44×44 aufrunden.

- **KLEIN · `components/scenes/Summary.astro:42` — leerer `<p class="closing">`, wenn `scene.closing` fehlt.** Unbedingtes Rendern erzeugt einen leeren Absatz mit 2 rem Margin (Szene 38 hat `closing`, künftige Summarys evtl. nicht). Conditional wie bei `scene.intro`.

- **KLEIN · tote Chart-Renderer + CSS pflegen Layout-Risiken.** `donut`/`tiles`/`diverging`/`compare` (Data.astro + initTiles/initDonut + `--data-danger`, `.sources-num` global.css:703) sind von scenes.json unbenutzt (nur `bars` ×4) — `data-pull` (caption >220) nie aktiv, `fmtSigned` tot. Kein User-Schaden, aber jede zukünftige Szene erbt ungetestete Pfade; bewusst entscheiden: behalten (Welle 2-Rückkehr) oder rausschneiden.

---

## 3. BEDIENUNG — Tap-Flächen, Fokus, Snap, Keyboard, Deep-Links

- **MITTEL · `scripts/animations.js:606-620` — Space wird global gekapert und schlägt fokussierte Buttons.** Der keydown-Handler preventDefault-ed `' '`/Pfeile/PageUp/Down, prüft aber nur `input/textarea/select/contenteditable`. Steht der Fokus auf dem Share-/Hintergrund-/Quiz-Button, springt Space die Szene statt den Button zu drücken (Enter geht noch) — Tastatur-User verlieren Button-Bedienung. Fix: bei `e.target.closest('button, a, [role="button"], details')` auslassen.

- **MITTEL · `scripts/animations.js:606-620` — Keyboard hat keinen Flight-Lock und überspringt Szenen.** Das Wheel-Design (150-ms-Settle + `animating`-Flag + Nachzug, Zeilen 560-588) ist sorgfältig, aber der keydown-Zweig ruft `goTo(nearestIndex() + dir)` **ohne** Lock: `nearestIndex()` liest während des laufenden Smooth-Flights die In-Flight-Position → Space/PageDown-Spam springt mehrere Szenen (exakt der Bug, den wheel am 12.09. bekommen hat, jetzt via Tastatur). Denselben Settle-Mechanismus für Tasten verwenden.

- **MITTEL · `components/SourceTag.astro:45-51` — „Hintergrund“-Pill ist < 44 px Tap-Fläche.** `padding: 0.55rem 1rem` + 0.9 rem Font ≈ 31 px Höhe; die globale `button { min-height: 44px }`-Regel greift nicht (summary ist kein button). Dabei ist das Panel das zentrale „tiefere Einordnung“-Feature (21 Szenen). Mobile min-height/padding auf ≥44 px.

- **MITTEL · `styles/global.css:380-385` — Quellen-Tag (SourceTag) mobile ~24 px hoch.** 4 px Padding + 0.72 rem Font unterschreiten die 44-px-Empfehlung deutlich — ausgerechnet den Kern-Link („jede Behauptung mit Quelle“) trifft man schlecht. Tap-Padding auf ~10-12 px vertikal erhöhen.

- **MITTEL · `scripts/animations.js:541-549` — `goTo`-tall-Pfad landet bei Szene 41 am Ende der Quellenliste.** Bewusstes Design („Autor/Quelle zeigen“) passt für Zitat-Szenen, aber für die 60+-Zeilen-Quellen-Szene bedeutet es: Anspringen per Dot/Wheel endet am Listenende statt am „Quellen“-Header. Spezialfall: letzte Szene ans `offsetTop` (Anfang) statt ans `offsetTop + height - innerHeight`.

- **KLEIN · `components/scenes/QuizIsland.svelte:28` — nach dem Antworten fliegt der Fokus.** `disabled={picked !== null}` deaktiviert alle Optionen inkl. des fokussierten → Fokus fällt auf body, Screenreader/Nutzer verlieren die Position. `aria-disabled` + Fokus auf die Erklärung stattdessen.

- **KLEIN · QuizIsland.svelte:41 / SliderIsland.svelte:72 — `transition:slide` läuft bei reduced-motion weiter.** Die globalen `animation/transition-duration: 0.01ms !important` (global.css:256) erwischen keine JS-Transitions; RevealIsland hat einen reduce-Guard (`duration: 0`), Quiz/Slider nicht — Inkonsistenz innerhalb derselben Insel-Familie.

- **KLEIN · `EndCard.astro:172-187` vs. `share.js` — zwei Share-UX-Flows.** Szenen-Share-Buttons öffnen bei fehlendem `navigator.share` das Sheet (Telegram/WhatsApp/X/Copy), der EndCard-„Teilen“-Button kopiert nur stumm die URL. Desktop-User am Ende der Tour kriegen weniger Optionen als mitten in der Tour — `window.__sceneShare()` existiert und wird nicht genutzt.

- **KLEIN · Doc-/Szenen-Seiten: kleine Tap-Flächen.** `.doc-nav-link` (global.css:649: `padding: 0.5rem 0` ≈ 30 px) und `quellen.astro` `.q-usage` sind schmale Textlinks unter 44 px — auf Mobile secondary, aber leicht fixbar (padding).

- **KLEIN · `EndCard.astro:41-44, 115-124` — Fakten-Karten-Preview ohne Layout-Reserve.** `.card-result img` hat kein width/height-Attribut; beim Aufdecken verschiebt sich der Inhalt unter der Preview (CLS). `aspect-ratio: 9/16` + `width: 100 %` reicht.

---

## 4. PERFORMANCE — Bundle, doppelte Inits, Rehydratisierung, Scroll-Kosten

- **MITTEL · `layouts/Base.astro:62-63` — GSAP + ScrollTrigger laden auf JEDER Seite.** animations.js importiert gsap/ScrollTrigger top-level; auch `/quellen/`, `/szene/N/`, `[slug]` zahlen das volle Bundle (~60-70 KB gzip) für init-Funktionen, die dort über leere NodeLists iterieren. Dynamic Import in `init()` nur wenn `.scene`/Anim-Marker existieren, oder ein separates `Base`-Prop für statische Seiten.

- **MITTEL · `pages/index.astro:72` — scenes.json liegt doppelt im Dokument.** `define:vars={{ scenesRaw }}` serialisiert die kompletten 47 KB JSON ins Inline-Script, zusätzlich zum gerenderten Szenen-HTML. Für Kachel-Export/Tracker reicht ein kompakteres Fenster (`type`, `title`, Zahlen) statt Voll-Szenen; spart LCP-Bytes auf der Haupt-URL.

- **MITTEL · `scripts/animations.js:331-361`, `ChapterTracker.astro:55-77`, `share.js:264-292` — dreifacher nearest-Scene-Scan im Scroll-Handler.** `initProgress` (unthrottled, 42× `getBoundingClientRect` pro Scroll-Event), ChapterTracker.update (unthrottled, nochmal 42 Rects) und share.js (400 ms throttle, drittens) implementieren dieselbe „nächste Szene zur Mitte“-Logik dreimal. Ein shared rAF-throttled Observer (IntersectionObserver auf Szenen) ersetzt alle drei — weniger Layout-Thrashing, ein Ort für die Logik.

- **MITTEL · `scripts/animations.js:422-442` — 42 ResizeObserver + Refresh-Sturm.** Jede Szene bekommt einen eigenen RO, der bei Änderung `requestAnimationFrame(ScrollTrigger.refresh)` schiebt: Ein Viewport-Resize (Orientierungswechsel) feuert bis zu 42 Refreshes im selben Frame über alle 60+ Trigger. Refresh sammeln (ein debounced Refresh für alle Szenen) — auf Mobile merklich.

- **KLEIN · `scripts/ambient.js` + `Hero.astro` — zwei Partikel-Systeme im ersten Screen.** Hero-Canvas (70 Punkte) und Ambient-Canvas laufen gleichzeitig über dem Hero; zusätzlich Glow-Blobs. Visuell gewollt überlappungsfrei, kostet aber zwei rAF-Loops + zwei Canvas auf der LCP-Scene. Hero-Canvas könnte im Ambient aufgehen. Zweites Detail: Hero-Canvas capped DPR nicht (ambient.js:17 schon auf 2).

- **KLEIN · Hero `.char`-Split (s.o.) und `initTiles`/`initDonut`-Leerläufe** — Micro-Politur im Init; keine doppelten Timelines gefunden: Swarm-Scene sauber aus `initBars`/`initCount`/`initCountScrub` ausgenommen (Data.astro:44-46), Pin-Registrierung eindeutig (Budget-Warnung aktiv). Gut gelöst.

---

## Top-10 priorisiert (Fix-Reihenfolge)

1. **og:image relativ auf `/szene/N/`** (Base.astro/[scene].astro) — alle 42 Szenen-Share-Previews ohne Bild in Messengern; Einzeiler.
2. **Kapitel-Akzent `attr(data-accent type(<color>))`** (global.css:150) — Firefox/Safari komplett rot, bei reduce auch dort wo JS es retten könnte; Inline-Style-Fallback nachziehen.
3. **`initSplit`-Scrub auf Mobile** (animations.js:213) — 6 Contrast-Szenen halbbreit gequetscht auf der Kernplattform; auf Doc-Seiten dauerhaft 50 %.
4. **`initBars`-`.scene`-Kopplung** (animations.js:120) — alle Balkendiagramme + Swarm-Bars unsichtbar auf den öffentlichen Lese-Modus-/Szenen-Seiten.
5. **Resume-Hint unstyled** (animations.js:403) — Feature zu 100 % tot; CSS nachliefern oder entfernen.
6. **Timeline `setPointerCapture` vs. Quell-Links** (Timeline.astro:118) — Desktop-Klicks auf Belege evtl. tot; headless verifizieren, Threshold-Drag bauen (+`user-select:none`).
7. **Keyboard: Space-Kaperung + fehlender Flight-Lock** (animations.js:606) — Buttons nicht per Space bedienbar, Szenen-Skip bei Tasten-Spam; selbes Lock-Design wie wheel anwenden.
8. **Swarm-Hint bei reduced-motion dauerhaft** (Data.astro:72/animations.js:733) — widerspricht dem „Endzustand sofort“-Grundsatz, irritiert auf jeder Seite mit Szene 3.
9. **Stand-Badge/`[data-goto-sources]` fehlt im Markup** (index.astro:98) — totes Feature + toter Code-Block; entscheiden: rendern oder entfernen.
10. **FACTS6 in meta.js ungenutzt und widersprüchlich** (lib/meta.js:10) — vierte Fakten-Instanz mit Vorzeichen-Dreher (+/−440 €); Sync-Risiko beim nächsten Update, eine Quelle der Wahrheit schaffen.