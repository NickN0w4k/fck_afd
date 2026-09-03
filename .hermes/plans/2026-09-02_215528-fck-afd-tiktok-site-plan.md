# fck_afd – Aufklärungs-Website im TikTok-Stil (Technik & Design, noch ohne Fakten)

**Ziel:** Eine immersive, mobilfirst Aufklärungs-Website („Warum die AfD für die meisten Menschen in Deutschland eine schlechte Wahl wäre“) im TikTok-artigen Bedienstil: vertikal scrollen/swipen, Szene für Szene — aber keine stumpfen statischen Karteikarten, sondern lebendige, animierte, teils interaktive Szenen (Scrollytelling, Parallax, Canvas-Effekte, Micro-Interaktionen), mit Fortschrittsanzeige und Zusammenfassung am Ende.

**Arbeitsverteilung:** Planung, Technik, Design UND Fakten-Recherche laufen alle über den Agenten. Nick gibt Richtung vor und schaut sich Ergebnisse an; nichts ist auf „Nick pflegt Inhalte ein“ ausgelegt.

**Kontext / Annahmen**
- Zielgruppe: eher junge, sozialisierte Social-Media-Nutzer; kurze Aufmerksamkeitsspanne.
- Hosting: statisch (einfach zu deployen, z. B. Netlify/Vercel/GitHub Pages/LAN).
- Fakten-Recherche ist eine eigene spätere Phase mit eigenen Regeln (Primärquellen, nüchterner Ton, sichtbare Belege) — technisch hier schon vorgesehen, inhaltlich später.

---

## 1. Framework-Entscheidung

**Empfehlung: Astro + Svelte-Komponenten** (statischer Output, keine Server-Infrastruktur nötig).
- Astro liefert standardmäßig **kein JS mit**, nur für interaktive Komponenten (Svelte-Inseln). Das passt perfekt zu einer Scroll-Story: viel Inhalt, wenig JS.
- `prefers-reduced-motion` und `prefers-reduced-data` lassen sich sauber respektieren (nötig für Barrierefreiheit).
- Alternativen und warum nicht:
  - SvelteKit (SSR + Hydration): mehr JS-Ballast, Hydration-Overhead unnötig, da keine dynamischen Daten.
  - Next.js/Nuxt: Overkill für eine Story-Site.
  - Plain HTML/CSS/JS: machbar, aber bei 20–40 „Slides“ + Fortschritt + Animationen wird’s schnell unübersichtlich — Astro strukturiert das sauber (eine Komponente = eine Karte).

**Libraries (klein und gezielt):**
- **GSAP ScrollTrigger** (100 % free seit 2024) für Scroll-Animationen, Pinning, Scrubbing — Standard für Scrollytelling, gut dokumentiert.
- **CSS `scroll-snap`** als Basis für das „TikTok-Feel“ (jede Karte = 100vh, snappt an). Kein aggressives „Scroll-Jacking“: `scroll-snap-type: y proximity` statt `mandatory` auf Desktop, auf Mobile `mandatory` ok. Native Scroll = barrierefrei.
- **lenis** (smooth scroll, nur wenn nötig, degradierbar).
- Icon-Set: **lucide** (MIT, leichtgewichtig).

---

## 2. UX-Konzept (TikTok-Feel, aber wirklich lebendig)

### Kern-Loop
Jede „Szene“ ist eine eigene kleine Erlebnis-Einheit (100vh), kein einheitlicher Karten-Typ. Der Feed wechselt bewusst zwischen verschiedenen Szenen-Typen, damit die Tour nie wie eine Folien-Präsentation wirkt:

1. **Hero-Szene:** großer animierter Titel (Buchstaben fallen/sliden ein), Canvas-Hintergrund mit subtiler Partikel-/Störungs-Animation, Hook-Satz, „Swipe“-Indikator.
2. **Statement-Szene:** riesige Typo, die sich beim Scrollen aufbaut (Wort für Wort / Zeile für Zeile, scrubbed an Scrollposition gebunden) — klassisches Scrollytelling statt statischem Textblock.
3. **Daten-Szene:** Zahlen zählen hoch, sobald sie in den Viewport kommen; animierte Balken-/Donut-Diagramme, die sich beim Scrollen aufbauen (GSAP-Scrub). Kein „X %“ als Text — sondern das Diagramm als Hauptdarsteller.
4. **Kontrast-Szene:** Split-Screen, der sich beim Scrollen öffnet — links Behauptung, rechts die Realität; oder Text, der durchgestrichen wird, während man scrollt (Mythos → Fakt).
5. **Zitat-Szene:** Vollbild-Zitat in großer Typo, Hintergrund wechselt die Farbe pro Zitat (Kapitel-Farbwelt), Quelle klein am Rand.
6. **Interaktions-Szene (alle ~6–8 Szenen einschieben):**
   - Mini-Quiz: „Was glaubst du?“ → 2–3 Buttons, Antwort flippt auf mit Animation.
   - „Schieberegler“: z. B. Schieberegler „Wie viel Prozent …?“ → Balken/Anzeige reagiert live.
   - Tap-to-reveal: verdeckte Karte, die beim Antippen die Fakten aufdeckt.
7. **Kapitel-Übergang:** volle Farbfläche (Akzentfarbe), große Kapitelnummer, kurze Frage als Cliffhanger — gibt Rhythmus und Orientierung.
8. **Finale: Zusammenfassung** (die geforderte Übersicht):
   - TL;DR-Szene: 5–8 Punkte, die nacheinander einfliegen.
   - Themen-Chips: antippen scrollt zurück zur passenden Szene.
   - Quellen-Szene: Linkliste, sauber typografisch (Credibility).
   - Optional: Share-Bild-Generator (später entscheiden).

### Micro-Details, die es „teuer“ aussehen lassen
- Fortschrittsbalken oben (Story-Stil) + Szenen-Nummer „3/28“.
- Parallax-Layer in Hintergründen (leichte Tiefe, kein Gimmick-Overkill).
- Farbwechsel des Themas pro Kapitel (eine Akzentfarbe pro Kapitel, Overall bleibt dunkel).
- Sanfter Sound optional? → nein, erstmal ohne; Autoplay-Audio ist ein Anti-Pattern.
- Kleine „haptische“ Reaktionen: Buttons skalieren beim Tap, Szenen faden/skalen beim Eintritt.
- Persistenter Fortschritt via `localStorage`: „Weiter da, wo du aufgehört hast?“ beim nächsten Besuch.

### Bedienung
- Mobile: natürliches Scrollen + scroll-snap (keine extra Gesten nötig).
- Desktop: Pfeiltasten ↑/↓ und Mausrad funktionieren; optional dezente „Swipe up“-Animation am Start als Affordance (dreht sich nach dem ersten Scroll ab).
- **Kein „du musst bis zum Ende scrollen“-Zwang:** Karte 1 enthält „Springen zu …“-Menü (Kapitel-Übersicht) für Leute, die gezielt ein Thema wollen.

### Barrierefreiheit & Performance (professionell)
- `prefers-reduced-motion`: alle Animationen aus.
- Kontrast >= WCAG AA, Fokus-Ringe sichtbar, semantisches HTML (kein `<div>`-Gewitter) → Screenreader können alles lesen, auch wenn es visuell wie ein Feed aussieht.
- Kein LCP-Killer: Text-basierte Karten, Bilder/WebP nur wo nötig (lazy), Schrift: variable font (Inter oder Space Grotesk) — 1 Request.
- Lighthouse-Ziel: 95+ Performance/Accessibility.

---

## 3. Design-Richtung

- **Look:** Dark mode editorial (wie ein News-Feature, nicht wie eine Wahlkampfseite). Hintergrund fast schwarz (#0A0A0A), Text weiß, **ein** Akzent (rot-orange, z. B. `#FF4D2E`) für Zahlen/Hervorhebungen — sparsam eingesetzt.
- **Typo:** Große, variable Headline-Font (z. B. „Space Grotesk“) + gut lesbare Body-Font („Inter“). Zahlen riesig (clamp() responsive).
- **Grafik-Stil:** flache, modern Illustration/SVG, keine Stockfotos; Diagramme als animierte SVG/CSS (Balken, Donuts) — wirkt hochwertig und ist leichtgewichtig.
- **Feinheiten:** Grain/Noise-Overlay (dezent), Karten-Übergänge mit weichem Fade/Scale, Progress-Dots seitlich (Desktop) / Balken oben (Mobile).
- **Wichtig (Professionalität/Credibility):** nüchtern-scharfer Ton, keine Emojis im Fließtext, Quellen immer sichtbar. Der Look soll „ seriousness meets TikTok energy“ sein — ernstes Thema, aber zugänglich präsentiert.

---

## 4. Projektstruktur

```
fck_afd/
├── .hermes/plans/           # Planungen (diese Datei)
├── content/                 # Szenen als strukturierte Daten (JSON/MD)
│   ├── scenes.json          # Alle Szenen: type, chapter, content, source, interaktion
│   └── chapters.json        # Kapitel: id, titel, akzentfarbe, intro
├── src/
│   ├── pages/index.astro    # Einstieg, rendert Szenen-Feed
│   ├── layouts/Base.astro   # Meta, Fonts, Progress-Leiste
│   ├── components/
│   │   ├── Scene.astro      # Basis-Szenen-Wrapper (100vh, Eintritts-Animation)
│   │   ├── scenes/          # Typen: Hero, Statement, Data, Contrast, Quote, Quiz, Slider, Reveal, ChapterBreak, Summary, Sources
│   │   ├── Progress.astro   # Story-Balken + Szenen-Nummer
│   │   └── SwipeHint.astro
│   └── styles/global.css    # Theme, scroll-snap, Reduced-Motion, Kapitel-Farbwelten
├── public/
│   └── favicon.svg
└── package.json
```

**Content-Driven, aber agent-gefüllt:** Szenen werden aus `content/scenes.json` generiert. Die Fakten-Recherche (Phase 2, ebenfalls Agent) schreibt diese Daten direkt — mit Pflichtfeld `source` (URL + Besuchsdatum) pro Behauptung. Trennung Daten/Präsentation bleibt: Recherche-Ticker kann Szenen anlegen, ohne Animationscode anzufassen.

**Validierung beim Build:** Skript prüft, dass jede Behauptung eine Quelle hat (Warnung statt Failure) — verhindert unbelegte Behauptungen.

---

## 5. Umsetzungsplan (Tasks, später auszuführen)

1. **Scaffold:** `npm create astro@latest` in `/root/fck_afd`, Svelte-Integration, Git init, `.gitignore`.
2. **Base-Layout:** Fonts, Theme, Meta (OG-Tags für Share-Preview!), global.css mit scroll-snap + reduced-motion.
3. **Scene-Framework:** Basis-Scene-Wrapper + ScrollTrigger-Setup (Eintritts-/Scrub-Animationen), Fortschrittsbalken, Szenen-Nummer.
4. **Erste Szenen-Typen:** Hero (Canvas + Titel-Animation), Statement (Scrub-Textaufbau), Data (Count-up + animiertes Diagramm) — mit Platzhalter-Inhalten.
5. **Scroll-Choreografie:** Kapitel-Farbwechsel, Parallax, Übergänge, Scroll-Snap-Feintuning (Desktop proximity, Mobile mandatory).
6. **Rest-Typen:** Contrast (Split/Mythos-Durchstrich), Quote, Quiz/Slider/Reveal (Interaktion), ChapterBreak.
7. **Finale:** Summary-Szene (TL;DR + Chips + Quellen), localStorage-Resume, Kapitelmenü, Swipe-Hint.
8. **QA:** Mobile (Chrome DevTools), Tastatur, Screenreader-Smoke-Test, Lighthouse > 95.
9. **Deploy:** `astro build` → statischer Output; Deployment-Ziel (Netlify Drop / GitHub Pages / LAN-Server wie heavy_block) dann entscheiden.

**Phase 2 (danach): Fakten-Recherche.** Der Agent recherchiert Themenfelder (Verfassungsschutz-Befunde, Wirtschaft/Klima-Programm, Zitate von Funktionären, Dokumentiertes aus sozialen Medien etc.), legt alles mit Primärquelle + Besuchsdatum in `content/scenes.json` ab und baut die Tour inhaltlich aus. Recherche-Regeln wie im heavy_block-Projekt: nur öffentliche Quellen, nur belegbare Behauptungen, nüchterner Ton.

**Validation pro Task:** `npm run dev` + `npm run build` grün; Mobile-Viewport-Check via Browser-Tools; am Ende Lighthouse.

---

## 6. Risiken & offene Punkte

- **Scroll-Jacking-Falle:** `mandatory` snap + GSAP-Pinning kann nervig/wackelig werden → proximity-Snap wählen, auf Mobile testen. Falls GSAP + snap kollidieren: nur CSS-Snap, GSAP nur für Fade/Scale/Scrub.
- **Over-Animation:** viele Effekte ≠ gut. Regel: pro Szene max. 1 großer Effekt + 1 Mikro-Interaktion; alles andere ist Stillstand. `prefers-reduced-motion` schaltet alles ab.
- **Interaktions-Szenen brauchen JS** (Quiz, Slider, Reveal) — das ist ok, aber nur diese Komponenten hydrieren (Astro-Inseln), der Rest bleibt statisch.
- **Zu viel Inhalt pro Szene = Tot:** Disziplin: 1 Szene = 1 Punkt = max. ~40 Wörter. Tiefe läuft über „Mehr dazu“-Expand oder Quellenlink.
- **Rechtlich/tonal:** nüchtern bleiben, keine Unterstellung ohne Primärquelle (passiert später bei den Fakten — Quellenpflicht ist im Datenmodell eingebaut).
- **Offen für später:** eigene Domain? Impressum/Datenschutz (statisch, aber bei .de-Domain Impressum nötig)? Analytics (besser: none / self-hosted Plausible)? — beim Faktenschritt mitentscheiden.

**Nächster Schritt:** Scaffold + Scene-Framework + Hero/Statement/Data-Szenen mit Platzhalter-Inhalten bauen — das Feel muss live im Browser stehen, bevor die Faktenarbeit startet. Danach Phase 2 (Recherche) direkt vom Agenten.