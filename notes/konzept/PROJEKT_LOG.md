# PROJEKT-LOG: info-afd.de — Was wir wann warum gebaut haben

**Stand: 12.09.2026 · Repo `/root/fck_afd` · Arbeits-Branch `v1.5` · Release-Branch `master` = Live (info-afd.de)**
Dieses Dokument ist die Chronik der Umbau-Arbeiten. Das HOW steht in `MASTER_UMSETZUNG.md` (Konzept), das WAS-WARUM-WANN hier.

---

## 1. Ausgangslage & Warum überhaupt umgebaut?

**Site:** Anti-AfD-Faktensite im TikTok-Stil (vertikale Scrolltour, Astro 7 + Svelte 5 + GSAP, Mobile first), live auf info-afd.de seit 06.09.2026. Jede Aussage mit archivierter Primärquelle (93+ Volltexte mit SHA256 in `sources/pages/`).

**Nicks Feedback (10.09.):** „Zu viel Text, den man sich eh nicht ganz durchliest. Wir arbeiten mehr mit Grafiken." Die Tour hatte 34 Szenen, ~7.000 Zeichen sichtbaren Text, 11 Szenen als Textwände (>250 Zeichen, bis 560), nur 7 von 23 Content-Szenen interaktiv, kein Fortschrittsgefühl.

**Zielbild:** Eine Seite, die man durchscrollt wie ein Short-Video — Zahl als Blickfang, Interaktion alle 2–3 Szenen, jede Szene teilbar als Mini-Argument, dauerhaft aktuell durch einen geregelten Update-Prozess.

---

## 2. Konzeptphase (10.09.)

4 Team-Agents lieferten parallel Gutachten (in `notes/konzept/`):
- **nova** — Erzähl-/Szenenarchitektur: 4-Phasen-Dramaturgie je Kapitel (Hook → Eskalation → Bezug → Handlung), 250-Zeichen-Budget, Micro-Hooks, Deep-Link-Strategie
- **saw** — Psychologie: 3 Zielgruppen-Typen (Absprung-Diagnose), Kapitel-Tracker statt „Szene 7/34", Emotionskurve (nie 2 Konfrontationen hintereinander), Verlust-Aversion gerechnet (440 € = 36 €/Monat, 690 Mrd. ≈ 33.000 € pro 4er-Familie), Share-Psychologie
- **apex** — Tech: Chart-Untertypen ohne Library (Inline-SVG + GSAP), Pin-Budget 3, Performance-Budget (LCP <2s, JS <120 KB)
- **nexus** — 20 krasse aktuelle Beispiele (Sept./Sommer 2026) mit 32 archivierten Primärquellen (Trump-MGGA, Weidel im Bundestag, IWH, ST-Regierungsprogramm, Halle)

→ Konsolidiert in `MASTER_UMSETZUNG.md`: 8 Design-Regeln, 3 Wellen, **Dauer-Update-Prozess** (Monats-Zyklus, Quellen-Orakel, Aufnahme-/Raus-Kriterien, Scoring, Frühwarnsystem) — damit künftige Aktualität geregelt einfließt, ohne die Seriosität zu riskieren.

---

## 3. OG-Image-Claim (09.–10.09.)

Nick bemerkte: Das Share-Bild trägt „KEINE MEINUNG · NUR QUELLEN" über dem Titel — exakt der Platz von BILDs „unabhängig · überparteilich" (seit 1971 unter dem Logo), mit invertierter Botschaft. 6 Varianten wurden als Bilder gerendert, Nick wählte:
- **Kicker: „ERST QUELLEN. DANN MEINUNG."** (Anspielung auf „Bild dir deine Meinung", Umkehrung ins Belegbare)
- **Subline: „Jede Behauptung mit Quelle. Was die Partei plant, was sie kostet — und wer draufzahlt."** („steht in den Gutachten"-Eck raus, klang behördlich)
- Commit 26533a6, live verifiziert (SHA256-Vergleich Live↔lokal).

---

## 4. Welle 1 — Quick Wins (11.09., LIVE)

**Warum:** Größter Hebel pro Aufwand gegen Nicks „zu viel Text"-Problem.

| Was | Ergebnis | Commit |
|---|---|---|
| Text-Kürzung 11 Szenen | 9.309 → 5.735 Z. (−38 %), Ø 274 → 169, 0 Szenen >250 | 8419b7d |
| Fließtext aufklappbar | 14 `context_tooltip`-Panels (0 JS, `<details>`) | 8419b7d |
| Kapitel-Breaks | „Du weißt jetzt: …"-Kompetenz-Pausen (6×) | 8419b7d |
| Kapitel-Tracker | 7 Segmente sticky, Pop nur bei Wechsel | 8419b7d |
| Verlust-Frame Szene 21 | „Wer zahlt drauf — und wer kassiert?" + 43,6×-Share + Scrubbed-Counter | 8419b7d |
| Animation-Polish | Scrubbed-Counter, Slider-Auflösungs-Moment, Contrast/Reveal | 8419b7d |

**Lighthouse Mobile: Performance 95, Accessibility 96, Best Practices 100 (LCP 1,7 s, CLS 0,001).** Live-Deploy am 11.09. nach Nick-Freigabe.

---

## 5. Feedback-Runden (11.09.) — Nicks Preview-Reviews

| Nick-Frage | Warum | Fix | Commit |
|---|---|---|---|
| „Weiter: Kapitelname" auf Deckblättern überflüssig | Doppel-Info (Kapitel steht eh groß drüber) | `next_title` entfernt (Markup+CSS+Feld) | efde6cd |
| Einordnung-Button zu klein/versteckt | Wichtige Funktion in Mini-Fußnote | Pill-Chip in Akzentfarbe, größere Tap-Fläche | efde6cd |
| Tooltips ordnen zu wenig ein („nur was wann passierte") | AfD-Aussagen brauchen Bewertung, nicht Herkunft | 14 Tooltips neu: echte Einordnungen (beleggestützt: VG-Hannover-Wortlaut, DIW, GBA) | efde6cd |
| Doppeltes „Einordnung" (Kicker + Button) | Überflüssige Dopplung im selben Screen | Button heißt jetzt „Hintergrund", Kicker bleibt „Einordnung" | 0c7d059 |
| Faktenkarte am Ende aktualisieren | Sie war noch auf altem Stand | 44 %-Sieg an Slot 1, „Potsdam/Vertreibung"-Kachel raus (Formulierung nicht mehr haltbar), Quellen-Anzahl dynamisch statt hardcodiert „44" | 1fec420 |
| **Regel daraus (Nick):** Jede AfD-Aussage braucht SICHTBARE kritische Einordnung im selben Screen — Tooltip liefert nur Zusatz. 4 Quote-Szenen bekamen sichtbare Einordnungen (Austausch-Erzählung = verschwörungstheoretisch laut VSB, Weidel = trifft genau die Beobachtungsbehörde, Russland = prorussische Narrative, Gauland = NS-Relativierung mit Wehrmacht-Stolz-Wortlaut). | | | efde6cd |

**Kachel-Kurations-Loop (entstanden):** Nick streicht Szenen direkt per Nummer auf der Preview:
- **Kachel 23 (Chrupalla-Zitat) — „irrelevant":** raus, 44 → 43 (2493a10)
- **Kachel 27 (Dexit-Compare-Chart) — „genau das von 26":** raus, Referenz „200 Mrd. allein 2021" in die Slider-Auflösung gerettet, 43 → 42 (3169cf5)

---

## 6. Welle 2 — Neue Zahlen & Zitate (11.09., LIVE seit 12.09.)

**Warum:** Nick wollte mehr krasse, SEHR aktuelle Beispiele (nexus hatte 20 recherchiert + archiviert). 10 neue Szenen (34 → 44, nach Kuration 42):

| Neue Szenen | Beleg |
|---|---|
| Weidel „Schwarz-Rot ist vorbei" + Merz „destruktive Kraft" (Rededuell) | Plenarprotokoll 21/92 (Bundestag, 09.09.) |
| Trump „MGGA!!!" + Musk/Grenell | ZEIT/dpa 09.09. |
| Dobrindt „größte Bedrohung … von Rechtsextremisten" | BMI-PM 30.06. |
| 2× ST-Regierungsprogramm (Rundfunk-Kündigung, „Bürgerwacht") + Verfassungsrechtler-Warnung | AfD-ST-PDF (253 S., archiviert) + ZDF |
| Dexit-Slider (Schätzfrage → 690 Mrd. € Auflösung, −5,6 % BIP, 2,5 Mio. Jobs) | iwd.de/IW |
| IWH 2,2 Mrd. € Haushaltslücke ST — „nicht finanzierbar" | IWH-PM 05.08. |
| Nach-der-Wahl-Timeline (06.09. Wahl → BSW-Absage → Weidel/Trump) | tagesschau/MDR |

Dazu: Chart-Untertypen **diverging** (±440/19.190 an Nulllinie), **tiles** (10×10 für 44 %), **compare**; FactTile/StatTile-System; Validator erweitert. Faktenkarte synchron aktualisiert.

---

## 7. Welle 3 Stufe A+B (12.09., auf /preview/ — Freigabe ausstehend)

**Warum:** Nicks Kernziel „Leute dranbleiben + teilen" brauchte (a) teilbare Einzelargumente, (b) einen visuellen Aha-Moment.

**Stufe A — Teilen-pro-Szene (6776402):**
- Deep-Links: scene-share teilt {Szenen-Share-Text + URL `#scene-N`}; nach Deep-Link-Einstieg erscheint „→ Weiter zur nächsten Szene"
- **Kachel-Export:** 2. Button je Szene erzeugt Fakten-Kachel 9:16 + 1:1 (Canvas, gleiche Look-Sprache wie EndCard)
- **OG-Images pro Szene:** 42 PNGs (1200×630, `scripts/og-scenes.mjs` — nach Content-Änderungen manuell laufen lassen!) + `/szene/N/`-Seiten mit eigenem og:image → in WhatsApp zeigt eine geteilte Szene die Fakten-Kachel, nicht die Tour
- Sitemap 51 URLs

**Stufe B — Set-Pieces:**
- **28.000er-Punktschwarm:** 112 Punkte (1 Punkt ≈ 250 Menschen), 3-Phasen-Pin (11.300 → 20.000 → 28.000), Zähler läuft mit dem Scroll
- **Hero-Parallax-Pin:** Titelbild mit Tiefenwirkung, fadet beim ersten Scroll
- Pin-Budget 2/3, reduced-motion-safe (SSR-Endzustand ohne JS)

---

## 8. Aktueller Stand (12.09.2026)

| | |
|---|---|
| **Live (info-afd.de)** | Welle 1 + 2 — 42 Szenen, 7 Kapitel, 46+ archivierte Quellen |
| **Preview (/preview/, noindex)** | Welle 3 A+B — Teilen-pro-Szene, Kacheln, OG-Images, Punktschwarm, Hero-Pin |
| **Branches** | `v1.5` = Arbeits-Stand (6776402) · `master` = Live (3169cf5) · Freigabe → merge v1.5 → master + Deploy |
| **Offen** | Welle 3 Rest: 3.2 Timeline-Kamerafahrt (Desktop), 3.5 Quellen-Verzeichnis als Feature, 3.6 Kosten-Du-Rechner |
| **Nicht umgesetzt (bewusst)** | `next_hook`/`share`-Felder im Validator, aber ohne Renderer — erst mit 3.4-Fortsatz sinnvoll; Social-Proof-Counter (nur mit echten Zählern, sonst streichen) |

## 9. Was NICHT geklappt hat / Lektionen

- **Hermes browser_exec** unbenutzbar (real-profile-Toggle meckert über Default-Browser) → Headless-Checks direkt mit node + playwright-core aus `site/node_modules`
- **Preview-Base-Bug (2× passiert):** `SITE_BASE=/preview/` vergessen → Assets referenzieren `/_astro/…` ohne Präfix → Seite unstyled (404). Fix: Flag immer explizit, Build-Check `grep href="/preview/_astro`
- **gh-pages-Push-Konflikte (2×):** Live-Deploy schreibt gh-pages parallel → vor Preview-Push immer `fetch` + `reset --hard origin/gh-pages`
- **noindex vergessen** = Preview ohne Schutz — Injektion nach JEDEM Rebuild
- **Voll-QA-Agenten lohnen nicht (Nick):** 1 h + viele Tokens für Wort-für-Wort-Prüfungen → gezielte Checks in execute_code, QA-Subagents früh stoppen
- **IW-Köln 403 / LG-Halle-PM 404:** Fakten über archivierte Ersatzquellen doppelt belegt (iwd.de-Volltext, tagesschau+ZEIT) — Retry später

## 10. Wer was macht (Rollen)

| | |
|---|---|
| **nexus** | Recherche + Archivierung (Monats-Zyklus + Ad-hoc bei Mega-Events) |
| **nova** | Szenen-Architektur (Rhythmus, Text-Budget) |
| **saw** | Copy-Texte (Kapitel-Breaks, Frames) |
| **apex** | Komponenten, Charts, Performance |
| **Orchestrator (Hermes)** | Kuratierung, Scoring, Copy-Auswahl, Rendering-Verdrahtung, validate/build/smoke/Lighthouse, Deploy |
| **Nick** | Freigaben (Wellen, Deploy-Runden, Kachel-Kuration per Nummer) |