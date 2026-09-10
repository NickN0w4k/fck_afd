# MASTER-UMSETZUNG: info-afd.de v2.0 — Konzept, Umbauplan & Dauer-Update-Prozess

**Stand:** 10.09.2026 · **Branch:** v1.5 · **Basis:** 4 Team-Gutachten (nova/saw/apex/nexus in diesem Ordner) + BRIEF.md
**Auftrag:** Nicks Feedback — „zu viel Text, Leute lesen nicht durch → mehr Grafiken, Leute sollen dranbleiben, mehr krasse aktuelle Beispiele“
**Status:** Konzept fertig, Umsetzung noch NICHT begonnen. Nick gibt Wellen frei.

---

## 1. Zielbild (1 Satz)

Eine Faktensite, die man **durchscrollt wie ein Short-Video**: Zahlen als Blickfang, alle 2–3 Szenen eine Interaktion, jede Szene als teilbares Mini-Argument — und die sich selbst **regelmäßig mit frischen Belegen aktualisiert**, ohne an Seriosität zu verlieren.

## 2. Diagnose-Ist (gemessen, nicht gefühlt)

- ~7.000 Zeichen sichtbarer Text; 11 von 34 Szenen >250 Zeichen (bis 560) — sie tragen 64 % des Texts
- Nur 7 von 23 Content-Szenen interaktiv; Kapitel 2 = 6 passive Szenen am Stück; Kapitel 6 = 3× Contrast in Folge (Pattern-Deadlock)
- Kein Fortschrittsgefühl („34 Szenen“ wirken endlos), Interaktion wird mit Textwänden „belohnt“ (reveal/quiz-Body)
- Befähigung („was kannst du tun“) kommt erst in Szene 32 — viel zu spät
- Dexit (690 Mrd. €) fehlt komplett als Szene; Wahlsieg Sachsen-Anhalt + 20 frische Beispiele (nexus) sind noch nicht eingearbeitet

## 3. Die 8 Design-Regeln (konsolidiert — gelten ab sofort für JEDE neue Szene)

1. **Scan-First:** Ziel-Budget 200 Zeichen/Szene, hartes Limit 250. Blickfang-Reihenfolge: **Zahl > Bild/Grafik > Satz** (max. 1 Kernsatz, fett, ≤12 Wörter). Alles Weitere aufklappbar („Warum?“-Panel / Quellen-Tooltip) — Quellen-Politik bleibt intakt.
2. **Rhythmus:** nie >2 passive Szenen hintereinander, nie >2 interaktive hintereinander; Ziel 12 von 23 Content-Szenen interaktiv (1:2 statt 1:3,3).
3. **Dramaturgie je Kapitel:** Hook → Eskalation → persönlicher Bezug („Was heißt das für DICH?“) → Handlung. Kein Kapitel ohne Bezug-Szene.
4. **Emotionskurve:** Fakt → Konfrontation → Kontrolle im Wechsel. **Harte Regel: niemals 2 Konfrontationen hintereinander.** Nach jedem Eskalations-Peak folgt Interaktion oder chapterbreak-Pause („Du weißt jetzt: …“).
5. **Fortschritt:** Kapitel-Tracker (7 Segmente, sticky, nur bei Wechsel animiert) statt „Szene x/34“. Keine Prozentangaben, kein „nur noch X“.
6. **Teilbarkeit:** jede Szene = sharebares Mini-Argument (eigener Deep-Link, dynamisches OG-Image pro Szene, Kachel-Export 9:16 + 1:1, vorformulierter Share-Text). Quiz teilt die FRAGE, nicht die Antwort. Keine „Teile das!“-Aufforderungen.
7. **Trust durch Demonstration:** Quellen-Chip permanent sichtbar + „Archiviert ✓“-Badge, tappable zur Fundstelle. Zeigen statt sagen.
8. **Fakten heilig:** jede Zahl mit Primärquelle im Archiv; Verlust-Frame nur als Übersetzung („440 € = 36 €/Monat“), nie als Übertreibung (keine 10-Jahres-Summierungen). Keine erfundenen Szenarien, keine Privatpersonen.

## 4. Ziel-Architektur (was sich konkret ändert)

### 4.1 Szenen-Typen: Umbau statt Neuerfindung (14 Typen bleiben)

| Typ | Künftig | Änderung |
|---|---|---|
| **data** | 6–7× (Kern) | 5 Untertypen: bars, donut, **diverging** (+440 vs. 19.190), **tiles** (44 % als 10×10), **compare** (690 Mrd. mit Anker) — alles Inline-SVG + GSAP, **keine Chart-Library** |
| **quiz** | 4× | Mitraten statt Abfragen; bestätigen statt abwerten; Kap. 6: Einwände 1+2 verschmelzen zu 1 Quiz |
| **reveal** | 3–4× | Body strikt ≤150 Z.; Kern-Story in 3 Zahlen (Krah: „1 Mitarbeiter · 4 J. 9 M. Haft · 0 Konsequenzen für Krah“) |
| **quote** | 3–4× | Zitat + 1 Satz Kontext; Quell-Tooltip; Kachel-Export |
| **contrast** | 2× | Kap. 6 von 3 auf 2; „So sagst du’s“-Befähigungssatz dazu |
| statement / slider / timeline | 1× je | Statement → Frage-Format; Slider → „Kosten-Du-Rechner“ (Schätzfrage + Auflösung + Differenz-Balken); Timeline auf 3 Punkte |
| summary | umbauen | 6 Textzeilen → 6 Zahlen-Kacheln (scrubbed Counter) |
| hero / action / endcard / sources / chapterbreak | bestehen | chapterbreak wird zum Pausen-/Kompetenz-Moment; Action 4→3 Karten; Quellen-Verzeichnis als Feature mit Kapitel-Gruppierung |

Neue Komponenten: **FactTile / FactTileGrid / StatTile / QuoteTile** (+ Lucide-Icon-Subset, max. 20 Icons inline). Neue Szenen-Typen: **keine.**

### 4.2 Kapitel-für-Kapitel (Umbau-Kern)

- **01 intro:** Statement auf 2 Zeilen; neu: Data-Hook „44,0 % — und was jetzt?“ (Wahlsieg als Einstieg, nexus #11)
- **02 verfassungsschutz:** Timeline 6→3 Punkte; Quote #7 → Contrast; neu: 5×-gesichert-rechtsextremistisch (nexus #7–10) als Reveal/Data; Dobrindt-Zitat (#9) als Quote
- **03 programm:** ST-Regierungsprogramm-Direktzitate (nexus #12: Rundfunk-Kündigung, Bürgerwacht, Patriotismuserklärung) als Quote/Contrast; Verfassungsrechtler-Warnung (#13) als Contrast
- **04 innen:** Reihenfolge tauschen — Krah-Spionage zuerst (Urteil 4 J. 9 M., nexus #4), dann AFA; neu: Weidel „Schwarz-Rot ist vorbei“ (#1), Trump „MGGA“ (#2), Chrupalla-Zitate (#6/#20)
- **05 kosten:** Headline wird **+440 €** (Verlust-Frame, „Wer zahlt drauf — und wer kassiert?“), 43,6×-Kachel; **neu: Dexit-Slider + compare-Chart** (nexus #17); neu: IWH 2,2 Mrd. € Haushaltslücke ST (#14)
- **06 einwaende:** 3 Contrast → 1 Quiz (Einwände 1+2) + 1 Contrast + Gauland-Quote; jeder Einwand mit „So sagst du’s“
- **07 fazit:** Summary → 6 Zahlen-Kacheln; neu: Nach-der-Wahl-Timeline (06.09. Wahl → BSW-Absage → Weidel/Merz → Trump, nexus #15) + Quellen-Feature

### 4.3 GSAP/Performance (aus apex, verbindlich)

- Registry `animations.js` erweitern: `data-count-scrub` (Opt-in je Szene), `initPinStack`, `containerAnimation` für Timeline-Desktop
- **Pin-Budget: max. 3** (Hero, 28.000-Punktschwarm, 690-Mrd.) — Hero zählt als Pin 1
- Budget: LCP <2,0 s · JS <120 KB gzip (keine weiteren GSAP-Plugins!) · CLS 0 · ≤3 Tweens/Viewport · Scrub-Länge max. `end: '+=1500'`
- Icon/Typo-first bleiben (0 Fotos = Vorsprung); Duotone-Fotos nur als Ausnahme via astro:assets (AVIF, widths 480/960/1440)
- `prefers-reduced-motion` = Endzustand setzen (bestehendes Muster), für JEDE neue Stufe
- Risiko bewusst: neue Felder (chart-Untertypen, tiles-Props, next_hook, share) VOR Verwendung in `validate-content.mjs` pflegen; jede Chart-Komponente muss in beiden Render-Pfaden (Snap-Feed + Kapitel-Seite) SSR-fähig sein

## 5. Umsetzungsplan (3 Wellen, keine Zeitvorgabe — Nick gibt frei)

### Welle 1 — Quick Wins (größter Hebel, kleinster Aufwand)
| # | Maßnahme | Aufwand | Quelle |
|---|---|---|---|
| 1.1 | Text-Kürzung der 11 Übertäter-Szenen auf ≤250 Z. (Tabelle in nova §3), Fließtext in „Warum?“-Panels | mittel | nova §3 |
| 1.2 | chapterbreak-Umbau an 6 Stellen: „Du weißt jetzt: …“ + „Weiter: …“ | klein | saw §2/3 |
| 1.3 | Kapitel-Tracker (7 Segmente, sticky) | klein | saw §2 |
| 1.4 | Szene 21 Verlust-Frame („Wer zahlt drauf — und wer kassiert?“) + 43,6×-Kachel | klein | saw §4 |
| 1.5 | Scrubbed-Counter (Opt-in) + Slider-Auflösungs-Moment + Contrast/Reveal-Polish | klein | apex §3/5 |
| 1.6 | Validator: neue Felder (`next_hook`, `share`, chart-Untertypen) | klein | apex Stufe 16 |

**Welle 1 schließt ab mit: Smoke-Test + Lighthouse (Mobile) + Nicks Freigabe → Deploy.**

### Welle 2 — Neue Zahlen, neue Charts, neue Inhalte
| # | Maßnahme | Aufwand | Quelle |
|---|---|---|---|
| 2.1 | **Neue Szene: Dexit** (Slider Schätzfrage + compare-Chart 690 Mrd.) | mittel | nexus #17 |
| 2.2 | **Neue Szene: IWH 2,2 Mrd. €** Haushaltslücke ST | klein | nexus #14 |
| 2.3 | diverging-Bars ±440/19.190 (19.190-€-Szene umbauen) | mittel | apex §1 |
| 2.4 | 44 % als 10×10-Kachel-Raster + amtliches Endergebnis 43,8 % einarbeiten | mittel | apex §1, nexus #11 |
| 2.5 | Neue Quotes: Weidel/Merz, Trump-MGGA, Chrupalla, Dobrindt, Programm-Zitate | klein | nexus #1, 2, 6, 9, 12 |
| 2.6 | FactTile-System + Summary-Rebuild (6 Zahlen) | mittel | apex §2 |
| 2.7 | Micro-Hooks (`next_hook`) an allen Szenengrenzen | klein | nova §4 |
| 2.8 | Tile-Export (9:16 + 1:1) für quote/contrast/data mit „Prüf es selbst“-CTA | mittel | saw §5 |

### Welle 3 — Set-Pieces (nur wenn Mobile-Budget im Profiling hält)
| # | Maßnahme | Aufwand |
|---|---|---|
| 3.1 | 28.000er-Punktschwarm (Pin-Stack, 3 Screens) | groß |
| 3.2 | Timeline-Kamerafahrt (nur Desktop) + Fokus-Dim | mittel |
| 3.3 | Hero-Parallax-Pin | mittel |
| 3.4 | Dynamische OG-Images pro Szene + Deep-Links + Share-Texte | mittel |
| 3.5 | Quellen-Verzeichnis als Feature (Kapitel-Gruppierung, „Verwendet in“, Betreiber-Transparenz) | mittel |
| 3.6 | Kosten-Du-Rechner (Slider-Szene 13 komplett umbauen) | mittel |

## 6. Neue Inhalte: Mapping nexus → Site (priorisiert)

Die 20 recherchierten Beispiele (Details + Belege: `nexus_beispiele_recherche.md`) nach Impact geordnet:

| Priorität | Inhalt | → Kapitel/Typ |
|---|---|---|
| 1 | 44,0 % Wahlsieg ST (vs. 20,8 % 2021) + Siegmund „zu 100 % umgesetzt“ | 01 data-Hook / 04 quote |
| 2 | Weidel „Schwarz-Rot ist vorbei“ + Merz „destruktive Kraft“ (Protokoll-Wortlaut) | 04 quote/statement |
| 3 | Trump „MGGA“ + Musk/Grenell (Ausland feiert AfD) | 04 quote / 07 reveal |
| 4 | ST-Regierungsprogramm-Direktzitate (Rundfunk, Bürgerwacht, Patriotismuserklärung) | 03 quote/contrast |
| 5 | Dexit 690 Mrd. € (−5,6 % BIP, −2,5 Mio. Jobs) | 05 slider + data |
| 6 | IWH 2,2 Mrd. € Haushaltslücke — „nicht finanzierbar“ | 05 data |
| 7 | 5× gesichert rechtsextremistisch (inkl. Nds.-Gerichtsbestätigung im Wortlaut) | 02 reveal/data |
| 8 | VSB 2025: 28.000 + Dobrindt-Zitat | 02 data + quote |
| 9 | Krah/Jian G. 4 J. 9 M. + Ermittlungen gegen Krah laufen weiter | 04 reveal (Umbau) |
| 10 | Höcke rechtskräftig verurteilt (BGH + LG Halle 16.900 €) | 04 timeline/quote |
| 11 | BSW schließt Koalition aus; „radikaler Gesellschaftsumbau“ (DW) | 07 timeline |
| 12 | Halle-Schüsse auf Demo (fair: Täter unbekannt, nur Kontext) | 07 reveal/statement |

**Fairness-Regeln aus der Recherche (beim Einbau beachten):** #16 Halle = Täter unbekannt, nicht der AfD zuschreiben. #19 Witten-Zitat belegt die Parlaments-Aussage, nicht den umstrittenen Sachverhalt. 2 Quellen offen (iwkoeln.de 403, LG-Halle-PM 404) — Fakten sind über archivierte Ersatzquellen doppelt belegt; Retry später.

## 7. DAUER-UPDATE-PROZESSE (Neu — wie künftige Aktualität einfließt)

### 7.1 Turnus
- **Monatlicher Recherche-Zyklus** (1. Woche im Monat): nexus recherchiert neue Beispiele → Kuratierung durch Orchestrator → Vorschlagsliste an Nick → Freigabe → Einbau (Wellen-Muster: Quote/Data-Szenen zuerst) → Build+Smoke → Deploy.
- **Ad-hoc-Sofort-Track** für Mega-Events (Wahlen, Urteile, Regierungsbildungen, Skandale): direkt recherchieren + archivieren, Kuratierung am selben Tag, Nick kurz freigeben lassen, einbauen.
- **Jeder Update-Runde läuft über:** `notes/konzept/BRIEF.md` (Regeln) + dieses Dokument + `UPDATE-PFAD.md` (technischer Pfad: archive → scenes.json → validate → build → meta.js → og:image bei Bedarf).

### 7.2 Quellen-Orakel (was zählt — und was nie)
**Zählt als Beleg:** Behörden & Gerichte (BfV, BMI, Landgerichte, VG/BGH — Pressemitteilungen + Protokolle zählen hoch), Institute (IW, ZEW, DIW, IWH — Leibniz-/Wirtschaftsinstitute), etablierte Medien (tagesschau, ZEIT, MDR, DW, ZDF, NDR, Correctiv). Parlamentsdokumente (Plenarprotokolle) = Goldstandard für Zitate.
**Zählt nie:** Blogs, Meinungsportale, Telegram/Sozialmedien direkt (nur wenn etabliertes Medium den Wortlaut dokumentiert), Partei-Eigendarstellung als „Fakt“ (AfD-Programm-PDF zählt als Beleg für *Inhalt*, nicht für Wahrheit), anonyme „Berichte“.
**Jede aufgenommene Quelle:** sofort `tools/archive_source.py` (SHA256 + Log). Erst archivieren, dann zitieren. Wenn Archivierung scheitert (403/404): Ersatzquelle doppelt belegen, Retry-Termin notieren.

### 7.3 Aufnahme-Kriterien (alles muss zutreffen)
1. **Belegbar:** Primärquelle nach 7.2, archiviert.
2. **Zielgruppen-relevant:** betrifft Spitzenpersonal, Programm, Regierungsarbeit oder Geld — **niemals Privatpersonen**.
3. **Krasse-Kriterium:** min. 1 von — (a) harte Zahl, (b) wörtliches Zitat mit Skandal-/Macht-Niveau, (c) Ereignis mit direkter Folge (Urteil, Einstufung, Entlassung).
4. **Erzählbar in 1 Szene:** Kern in ≤250 Zeichen + 1 Blickfang (Zahl/Zitat) erzählbar.
5. **Dramaturgie-Fit:** hat Slot in Hook/Eskalation/Bezug/Handlung und verletzt die Emotionskurve nicht (kein 3. Konfrontations-Block in Folge).
6. **Fair zugeschrieben:** Wortlaut ≠ Sachverhalt (Zitate belegen die Aussage); Vorwürfe klar als „Ermittlung läuft“ formuliert, solange nicht rechtskräftig.
7. **Score ≥ Bestand:** schlägt in der Prioritätsrechnung (7.5) ein vorhandenes Beispiel desselben Slots?

### 7.4 Rausfliegen / Ersetzen — Entscheidungsregeln
Eine Szene/Beispiel wird **ersetzt oder rausgenommen**, wenn:
1. **Überholt:** derselbe Slot hat ein stärkeres, neueres Beispiel (z. B. Hochrechnung 44,0 % → amtliches Endergebnis 43,8 %, sobald amtlich festgestellt → tauschen UND korrigieren).
2. **Nicht mehr aktuell:** Datum >12 Monate und keine „historische Anker“-Rolle (Timeline-Kontext darf älter bleiben, z. B. Gauland 2017 als Eskalations-Beleg).
3. **Widerlegt:** Quelle widerruft, korrigiert, gerichtliche Instanz dreht die Entscheidung → Szene SOFORT anpassen oder raus; Korrektur im Quellen-Log vermerken.
4. **Rechtlich/organisatorisch erledigt:** Einstufung gekippt, Verfahren eingestellt, Urteil aufgehoben → nicht als aktuell stehen lassen.
5. **Budget-Verstoß dauerhaft:** Szene lässt sich nicht auf 250 Zeichen bringen und aufklappbarer Kontext löst es nicht.
6. **Fairness-Verstoß:** Zuschreibung nicht mehr haltbar (neue Erkenntnisse).

**Kontext-Werte bleiben:** Beispiele, die in Timeline/Quellenverzeichnis als historische Belegkette stehen (BGH-Urteile, VSB-Einstufungen), fliegen NICHT wegen Alter raus — sie wandern nur aus dem Aktiv-Teil in den Kontext-Teil.

### 7.5 Kuratierung & Scoring (wer entscheidet was)
- **nexus** liefert Kandidatenliste mit Pflichtfeldern aus 7.3 + eigenem Vorschlag „Slot“.
- **Orchestrator (ich)** scorent: **Impact (0–3) × Aktualität (0–3) × Erzählbarkeit (0–3) − Risiko (0–3)** → Sortierung, Kollisions-Check mit Emotionskurve/Rhythmus → Vorschlags-Shortlist (max. 6 pro Zyklus).
- **Nick** gibt final frei (Shortlist mit 1-Zeilen-Begründung je Kandidat). Ohne Freigabe nichts live.
- **Einbau** folgt UPDATE-PFAD.md; jede neue Zahl → Validator → Build → Smoke → Deploy nach Freigabe.
- **Nach jedem Deploy:** `sources/sources_log.md` + `notes/konzept/nexus_beispiele_recherche.md` aktualisieren (Status je Quelle), Commit auf v1.5.

### 7.6 Frühwarnsystem (damit Updates nicht zu spät kommen)
Beobachtete Quellen (RSS/Seiten, monatlicher Check): tagesschau AfD-Desk, BfV/BMI-PMs, MDR/DW Sachsen-Anhalt-Ticker, IWH/IW/ZEW-PMs, Bundestag-Plenarprotokolle bei AfD-Debatten, Landgericht Halle/Magdeburg-PMs. Trigger-Wortliste: „Urteil“, „Einstufung“, „verfassungsschutzbericht“, „Kandidat“, „Regierungsprogramm“, „Urteil rechtskräftig“.

## 8. Qualitätssicherung (jede Änderung)

1. `cd site && npm run validate` (harte Fehler = Abbruch)
2. `npm run build` + Smoke-Test → ALL GREEN
3. Lighthouse Mobile nach Welle 1/2/3 (LCP/JS-Budget halten)
4. Fakten-Review: jede geänderte Zahl gegen Archivkopie prüfen (nicht gegen den Medienbericht)
5. `prefers-reduced-motion`-Audit je neuer Animation
6. Deploy nur nach Nicks Freigabe; master = Live-Stand

## 9. Team-Rollen (künftig wiederkehrend)

| Agent | Rolle |
|---|---|
| **nexus** | Monats-Recherche + Archivierung (7.2–7.6) |
| **nova** | Szenen-Architektur-Checks (Rhythmus/Text-Budget bei neuen Szenen) |
| **saw** | Psychologie-Check neuer Formate (Emotionskurve, Share-Psychologie) |
| **apex** | Komponenten-Umbau, Performance, Validator |
| **Orchestrator (ich)** | Kuratierung, Scoring, Briefings, QA, Deploy |
| **Nick** | Freigaben (Konzept-Wellen, jede Deploy-Runde, kuratierte Beispiele) |