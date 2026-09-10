# Zielgruppen- & Psychologie-Analyse — warum Leute bleiben (oder abspringen)

**info-afd.de · Konzept-Teil 2 · saw · Stand 10.09.2026**
Basis: Bestehende Tour (34 Szenen, 7 Kapitel laut chapters.json), Nicks Feedback („zu viel Text, Leute springen ab"), Szenen-Typen aus BRIEF.md (hero, statement, data, quiz, quote, reveal, contrast, slider, timeline, action, summary, endcard, sources, chapterbreak). Kein Neuerfindungs-Wishlist — Umbau des Vorhandenen.

---

## 1) Wer springt ab — und warum

**Zielgruppe in drei Typen** (realistisch, nicht idealisiert):

| Typ | Wer | Wie landet er hier | Was ihn abbrechen lässt |
|---|---|---|---|
| **1. Scroll-Stimme** | TikTok-Gewohnt, Aufmerksamkeitsspanne 5–15 Sekunden pro Screen, liest Überschriften, überspringt Fließtext | Zufall, Link, Streit-Argument | Textwände (Szenen 6, 17, 18: 5–6 Zeilen body + context), zu wenig „was heißt das für mich" |
| **2. AfD-nah sozialisiert** | Kennt die Sprüche, wählt evtl. AfD oder findet sie „wenigstens ehrlich" | Kontroverse, geteilter Link | Fühlt sich belehrt („du solltest"), merkt Einseitigkeit sofort, springt beim ersten moralisierenden Ton ab |
| **3. Unentschlossene** | Findet AfD „eigentlich okay", hat Bauchgrimm, prüft aber nach | Echte Offenheit | Überforderung: 34 Szenen wirken endlos; ohne sichtbaren Fortschritt denkt sie „das dauert noch ewig" und geht |

**Die harte Wahrheit:** Typ 2 (AfD-nah) wird **nicht in einer Session konvertiert**. Realistisches Ziel ist nicht Überzeugung, sondern **Impfung**: 1–2 Argumente, die beim nächsten Familienessen einfallen. Typ 3 ist die eigentliche Zielgruppe — offen, aber überfordert. Typ 1 braucht nur Kürze plus einen starken Moment zum Teilen.

**Warum aktuell abgesprungen wird (Diagnose der Bestandsszenen):**
- **Textwände in interaktiven Typen:** Reveal-Szenen (6, 17, 18) kündigen „Tippen, um aufzudecken" an — und liefern dann 5–6 Zeilen body. Die Interaktion wird belohnt mit … Text. Gleiches Muster bei quiz: Frage interaktiv, `explanation` danach 4–5 Zeilen. Fühlt sich an wie trollen.
- **Passive Strecken:** Kapitel 2 (4–9): data, timeline, reveal, quote, data, quote — 6 Szenen ohne ein interaktives Element. Kapitel 4 (16–18): quote → reveal → reveal = 3 schwere Szenen hintereinander, kein Atempunkt.
- **Kein Fortschrittsgefühl:** 34 Szenen ohne sichtbares „wo bin ich". Ohne Fortschritt ist jede Szene „Szene irgendwas von 34" — Typ 3 geht.
- **Quiz als Test statt Beteiligung:** „Wie nennt die AfD ihre Migrationspolitik?" fragt Wissen ab, lädt nicht zum Mitraten ein. Mitraten = Bindung, Abfragen = Hürde.

**Psychologische Kernregel:** Absprung passiert nicht bei Langeweile, sondern bei **erwarteter Mühe ohne sichtbaren Lohn**. Jede Szene muss in unter 2 Sekunden versprechen: „Kostet dich wenig, bringt dir was."

---

## 2) Kognitive Last — Chunking, Progress, Selbstwirksamkeit

**Chunking: 1 Idee pro Szene.** Der Text in reveal/quote/quiz-Szenen ist oft zwei Gedanken (Zitat + Einordnung + Ausblick). Regel: **Der Screen zeigt max. 3 Elemente** — Headline, 1 Kernsatz, 1 Quellen-Chip. Alles Weitere (context, lange explanations) hinter einen „Warum?"-Tap oder in die nächste Szene. Konkret: Szenen 6, 14, 17, 18, 22 body auf 2 Sätze kürzen, Rest in „Warum?"-Panel.

**Progress-Element (nicht-nervig):** Statt „Szene 7/34" (Szenen zählt niemand) → **Kapitel-Progress**:

- **Kapitel-Tracker, sticky oben, ~40 px, 7 Segmente:** aktueller gefüllt, absolvierte hohl. Bei Kapitelwechsel poppt kurz „Kapitel 3/7 — Das Programm". Das ist die „Szene 7/34"-Info in einer Form, die Fortschritt zeigt statt Restmenge. „Kapitel 3 von 7" wirkt erreichbar, „7/34" wie ein Marathon.
- **Zusätzlich beim Kapitelwechsel:** „Du weißt jetzt: …" (1 Satz Kompetenz-Bestätigung) + „Weiter: …" (Titel des nächsten Kapitels). Fortschritt als Kompliment statt als Zähler.
- **3 Nicht-nervig-Regeln:** (a) poppt nur bei Kapitelwechsel, nicht pro Szene; (b) nie Prozent, nie „nur noch X Szenen" (drängt); (c) endcard belohnt: „Alle 7 Kapitel geschafft."
- **Alternative für Skeptiker:** Fortschritt nur innerhalb der chapterbreak-Szene zeigen („Kapitel 3 von 7 — Das Programm"). Dort ist das Feedback erwartbar und stört nie den Flow.

**Selbstwirksamkeit statt Überforderung:**
- Quiz-Szenen (14, 22, 30): nach der Antwort **bestätigen statt abwerten** — „Genau." bzw. „Viele denken das — tatsächlich ist …". Kein „Falsch."-Framing (Demütigung = Absprung). Beim Slider (13): „Fast alle schätzen zu niedrig — hier sind die echten Zahlen" statt „falsch geraten".
- **Ende jedes Kapitels: 1 Satz-Zusammenfassung** („Du weißt jetzt: X") — Kompetenzgefühl vor dem nächsten Block. Der chapterbreak ist der natürliche Ort dafür.

---

## 3) Emotionskurve über die Tour — Fakten/Wut/Befähigung im Wechsel

**Problem:** Wut hält Aufmerksamkeit, aber Wut **ohne Kontrollgefühl** = Hilflosigkeit = Absprung. Fakten ohne Emotion = langweilig. Befähigung ohne Fakten = hohl. Die Bestandstour: viel Wut und Fakten, Befähigung erst am Ende.

**Emotionskurve der Bestandstour (Ist-Zustand):**

```
Wut/Konfrontation  ▲        (6)(7)(9)         (16)(17)(18)              (29)
Fakten/neutral     │     (4)(5)        (11–14)     (19–22)   (25–27)  (30)(31)
Befähigung/Kontrolle │                                                (32)
                   └─────────────────────────────────────────────────────→ Szene
                      1–3      4–9         10–14      15–22     23–28   29–34
```

**Ist-Analyse:** Kapitel 2 (4–9) ist eine Fakten+Zitat-Wand ohne Interaktion. Kapitel 4 (16 Vogelschiss, 17 AFA-Abschiebetrupp, 18 China-Spionage) = 3 Enthüllungen hintereinander → **Hilflosigkeits-Tiefpunkt** der Tour. Befähigung kommt erst in Szene 32 (action) — viel zu spät; Typ 3 ist bis dahin längst überfordert.

**Soll-Rhythmus: Fakt → Konfrontation → Kontrolle, max. 2–3 Szenen pro Phase.** Nach jeder Konfrontation (quote/reveal) folgt ein Kontroll-Element (quiz, slider, contrast mit „So sagst du's") oder ein chapterbreak mit Kompetenz-Satz. **Harte Regel: niemals 2 Konfrontationen hintereinander.**

**Wo Pausen fehlen (konkrete Umbaustellen):**
- **Nach Szene 9 (Ende Kapitel 2):** 6 Szenen Verfassungsschutz = schwere Kost. Der chapterbreak bei 10 trägt künftig: „Du weißt jetzt, warum der Verfassungsschutz die Partei im Blick hat. Weiter: Was die AfD plant." — 1 Satz Kompetenz + Ausblick, kein Zahlen-Recap.
- **Nach Szene 18 (Spionage-Urteil):** schwerster Punkt der Tour. Hier die Kompetenz-Pause: „Du weißt jetzt, wer dort den Ton angibt." Keine neue Enthüllung. Optional selbstironischer Pausen-Satz („Noch da? Du hast 4 Kapitel geschafft.") — entwaffnet, ohne zu belehren.
- **Nach Szene 22 (EU-Agrar-Quiz):** Kapitel 5 endet hart („Ihre Wähler zahlen sie mit"). Pause als Hook: „Du weißt jetzt, wer zahlt. Weiter: Die Einwände aus dem Gespräch — geprüft."
- **Kapitel 6 (25–27):** Das ist die Dramaturgie des Familienessens: 3 contrast-Szenen = 3 Einwände. Hier ist Befähigung DAS Ziel, nicht Nebeneffekt. Jede contrast-Szene bekommt einen **„So sagst du's"-Satz**: „Sag: Drei Gerichte haben das geprüft — nicht der Verfassungsschutz allein." Befähigung im Gespräch = Selbstwirksamkeit.
- **Szene 32 (action):** Die 4 Karten sind gut; Karte „Das Gespräch suchen" bekommt vorgefertigte Share-Texte pro Kapitel (siehe §5).

**Umsetzung ohne neuen Szenen-Typ:** Der vorhandene **chapterbreak** wird zum Pausen-/Kompetenz-Moment („Du weißt jetzt: …" + „Weiter: …"). Bestehender Typ, neue Funktion — 6 Stellen, eine Logik.

---

## 4) Verlust-Aversion — „Das kostet DICH"

**Psychologie:** Verluste wiegen psychologisch schwerer als Gewinne — „du bekommst X" wirkt schwächer als „du verlierst X". Hier legitim, weil die Zahlen aus seriösen Quellen kommen (ZEW, IW Köln, DIW): Wir **übertreiben nicht, wir übersetzen** — große abstrakte Summen in persönliche Beträge.

**Verfügbare Fakten (aus der Tour):**
- Familie mit 40.000 € brutto: **+440 €/Jahr Steuern** (ZEW 2025, Szene 21)
- Topverdiener (180.000 € brutto): **−19.190 €/Jahr** (ZEW 2025, Szene 21)
- Dexit: **690 Mrd. €** Gesamtkosten (IW Köln; URL liefert die Nexus-Recherche)
- DIW: Hauptleidtragende der AfD-Politik = eigene Wähler (Szene 23, DIW aktuell 88)

**Formate (auf Bestandstypen gemappt):**

1. **„Kosten-Du-Rechner" aus dem Slider-Typ (Szene 13 umbauen):** Prompt: „Was glaubst du: Wie viel zahlt eine Normalfamilie durch die AfD-Steuerpläne extra?" Slider 0–2000 €/Jahr. Auflösung: **440 €** — „das sind 36 € pro Monat, jeden Monat." Der Slider ist ein Schätzspiel — Schätzen bindet stärker als Lesen, und der Typ existiert bereits.
   - Zweite Ebene imselben Slider-Screen: „Und ein Dexit? 690 Mrd. € — rund **8.200 € pro Kopf**. Für eine Vierer-Familie: **~33.000 €**." Rechnung: 690 Mrd. € / 84 Mio. Einwohner ≈ 8.214 €, ×4 ≈ 32.900 €.
2. **Szene 21 (data) auf Verlust-Frame drehen:** Headline heute: „Steuerpläne: Wer bekommt wie viel zurück?" → neu: **„Wer zahlt drauf — und wer kassiert?"** Große Zahl im Screen: **+440 €** (die Verlust-Zahl), erst danach der Kontrast 19.190 €. Caption: „Jedes Jahr. 36 € pro Monat — ohne dass du AfD wählst. Nur wenn sie regiert." (Daten unverändert, nur Framing.)
3. **43×-Kachel als stärkste Verlust-Botschaft:** 19.190/440 = **43,6-fach**. Formulierung: „Wer's nicht nötig hat, bekommt das 43-Fache. Wer's nötig hat, zahlt drauf." Als data- oder contrast-Kachel — share-fähig (siehe §5).
4. **Per-Kopf-Übersetzung für den Dexit als eigene data-Szene:** „690 Mrd. € kann keiner fühlen. 8.200 € pro Kopf schon." Die Tour hat den Dexit noch nicht als Szene — das ist die Lücke für Nicks „krasse Beispiele".
5. **Summary (Szene 31, Punkt 04) ergänzen:** „… minus 440 € im Jahr = 36 € pro Monat." Kompetenz-Erinnerung statt nur Zahl.
6. **„Das kostet DICH"-Tile:** „AfD-Steuerpläne: Deine Familie zahlt +440 €/Jahr. Ein Topverdiener bekommt 19.190 €. Das ist das 43-Fache." + Quellen-Chip (ZEW) + „Prüf es selbst".

**Wo wir NICHT übertreiben:** Keine erfundenen Szenarien, keine Summierung über 10 Jahre („4.400 € in 10 Jahren!" wäre Framing, das die Quelle nicht hergibt — 440 € ist die ZEW-Aussage, Punkt). Wer bei einer Fakten-Seite dramatisiert, verliert das Vertrauen, das die Quellen-Arbeit aufbaut.

---

## 5) Share-Psychologie — was lässt Leute posten

**Warum Leute teilen:** nicht der Partei wegen, sondern **Selbstdarstellung + sozialer Nutzen**: (a) „Schau, was ich gefunden hab" (Informiertheit), (b) „Schau, was DIE schreiben" (Empörung), (c) am stärksten: **Konversations-Päckchen** — „Schick das der Tante, die behauptet immer …". Der wertvollste Share ist das **gezielte Zuschicken (1:1)**, nicht das öffentliche Posten. Die Tour muss 1:1-Teilen zum Hauptpfad machen.

**Regel: Shareables sind Kacheln, nicht Screenshots.** Niemand postet einen Screenshot einer Textwand. Die Site hat bereits einen Teilen-Button pro Szene (action-Szene 32 verweist darauf) — ausbauen zum **Tile-Export**.

**Tile-Formate (alle aus Bestandstypen):**
1. **Zitat-Tiles aus `quote` (5× vorhanden):** Vogelschiss (16), „Wir werden sie jagen" (27), Krah „Kein persönliches Fehlverhalten" (18). Format: Zitat + Sprecher + 1 Faktsatz + Quellen-Chip. Als Bild exportierbar (Canvas-Export oder og-image-Endpoint pro Szene) — **Haupt-Shareable-Pfad**.
2. **Kontrast-Kacheln aus `contrast` (4× vorhanden):** claim/reality-Split als Kachel — links das Zitat, rechts 1 Faktsatz + Quelle. Szenen 11, 25, 26, 27 sind inhaltlich schon Memes; es fehlt nur der Bild-Export.
3. **Data-Tiles aus `data` (4× vorhanden):** Chart + Headline als Tile — „28.000" als große Zahl mit Balken, „43×" als Kontrast-Zahl.
4. **„Prüf es selbst"-CTA auf jeder Kachel:** unten: „Prüf es selbst → info-afd.de/szene-21" (Deep-Link zur Szene) oder „→ info-afd.de/quellen". Der CTA ist Trust-Builder und Traffic-Hook in einem.
5. **Vorformulierte Share-Texte (Web-Share API):** Der Teilen-Dialog zeigt einen **fertigen Satz**, nicht nur die URL: „+440 € für die Familie, 19.190 € für Topverdiener — das 43-Fache. Quelle: info-afd.de". Der Nutzer editiert nach Gusto; der Impuls wird nicht zerstört.
6. **1:1-Teilen als Hauptpfad:** „Schick das dem, der es hören muss." Deep-Link pro Szene (`info-afd.de/#szene-21`) teilt die exakte Kachel, nicht den Tour-Anfang.
7. **Was NICHT funktioniert:** Aufforderungen („Teile das jetzt!") — belehrend, tötet den Impuls. Der fertige Tile-Export + fertiger Satz reichen.

**Kachel-Design-Regel:** 9:16 (Story/Status) + 1:1 (WhatsApp/Feed). Max. 1 Kernaussage, große Zahl bzw. Zitat, 1 Quellen-Zeile, 1 CTA-Zeile. Kein Screenshot-Look, eigene Tile-Grafik.

---

## 5b) Social-Proof-Formate (optional, niedrige Priorität)

- **Möglich:** „Heute haben X Menschen eine Quelle geprüft" auf der endcard, oder im Quiz „Y % haben hier auch falsch geraten" — aber **nur mit echten, live gezählten Zahlen** (einfacher Counter auf /quellen/ bzw. Quiz-Resultate).
- **Fake-Social-Proof ist bei einer Fakten-Seite Gift:** Eine erfundene Zahl widerlegt die eigene Glaubwürdigkeit. Wenn kein Budget für echte Zähler: **streichen, nicht faken.**
- **Empfehlung:** Priorität niedrig. Erst P1–P2, dann evaluieren.

---

## 6) Trust-Builder — Quellen-Sichtbarkeit statt Belehrung

**Problem:** Die Quellen-Arbeit ist exzellent (Primärquellen, archiviert, nur Behörden/Gerichte/Institute/etablierte Medien) — aber die Quelle ist aktuell **Fußnote**, nicht **Feature**. Trust entsteht nicht durch „Wir sind seriös, vertrau uns", sondern durch **„Sieh selbst, hier ist der Beleg"**.

**Formate (auf Bestandstypen):**
1. **Quellen-Chip in jeder Inhaltsszene, permanent sichtbar:** Chip („VSB 2025, S. 94" / „ZEW 2025") fix unten in der Szene, tappable → Archiv-Link in neuem Tab. Kein „Quellenangabe:"-Block, ein Chip.
2. **„Archiviert ✓"-Badge am Chip:** „Beleg als Volltext archiviert — bleibt prüfbar, auch wenn die Originalseite sich ändert oder verschwindet." Das beantwortet die häufigste Misstrauens-Frage, bevor sie gestellt wird.
3. **„Prüf es selbst"-Tap-Ziele:** In data/quote/contrast/reveal: Tap auf den Chip springt direkt zur Fundstelle (Archiv + Seitenzahl wie „S. 94–95"). Zeigt die exakte Fundstelle, wirkt der Beleg wie ein Beweis, nicht wie eine Behauptung.
4. **Szene 2 (statement) umschreiben — Demonstration statt Deklaration:** Heute: „Diese Seite ist keine Meinungsseite. Alles, was hier steht, lässt sich belegen…" = Belehrung. Neu: „Zweifel an einer Zahl? Tippe drauf. Jede Zahl hier verlinkt ihre Quelle. Auch diese." — die Szene macht das Prüfen zum Feature statt es zu versprechen.
5. **Szene 34 (sources) als Feature:** Aus der End-Liste wird ein **Quellen-Verzeichnis mit Kapitel-Gruppierung**: jede Quelle mit „Verwendet in: Kapitel 2, Szene 7" + Archiv-Status. Kopfzeile: „**25 Primärquellen. Alle archiviert. Jede Zahl dieser Tour belegt.**" — das ist selbst ein Shareable und der stärkste Trust-Satz der Seite.
6. **Trust durch Selbstbegrenzung:** Im Quellenverzeichnis ein Absatz „Was diese Seite nicht ist": kein Medium, keine Partei, privat betrieben, alle Volltexte öffentlich archiviert. Grenzen offen zu benennen erhöht Glaubwürdigkeit.

**Trust-Regel: Zeigen statt sagen.** Jede Behauptung bekommt eine tappable Quelle im Sichtfeld; das Verzeichnis wird vom Fußnote-Ende zum Feature.

---

## 7) Umsetzungs-Liste — Prioritäten

**P1 (größter Hebel, kleinster Aufwand):**
1. Text-Kürzung: body/explanation/context in Szenen 6, 14, 17, 18, 22 → max. 3 Sätze sichtbar, Rest in „Warum?"-Panel
2. chapterbreak-Umbau (6 Stellen, eine Logik): „Du weißt jetzt: …" + „Weiter: …"
3. Kapitel-Tracker (sticky, 7 Segmente, Animation nur bei Wechsel)
4. Szene 21: Verlust-Frame („Wer zahlt drauf — und wer kassiert?") + 43×-Kachel
5. Tile-Export für quote/contrast/data (9:16 + 1:1, mit „Prüf es selbst"-CTA)

**P2:**
6. Szene 13 → „Kosten-Du-Rechner" (Slider 0–2000 €, Auflösung 440 € = 36 €/Monat, Ebene 2 Dexit 8.200 €/Kopf)
7. Quiz-Umbau: bestätigen statt abwerten; Kompetenz-Pause nach Szene 18
8. Szene 2: Demonstration statt Deklaration
9. Quellen-Chip permanent sichtbar + „Archiviert ✓"-Badge

**P3:**
10. Szene 34: Quellen-Verzeichnis mit Kapitel-Gruppierung, „Verwendet in"-Zeilen, Betreiber-Transparenz
11. Deep-Links pro Szene + vorformulierte Share-Texte (Web-Share API)
12. Social-Proof-Counter — nur mit echten Zählern, sonst streichen

---

## Anhang: Fakten mit Quellen (aus der Bestandstour, für Verlust- & Share-Formate)

- **28.000** Rechtsextremisten im AfD-Umfeld 2025 (2023: 11.300, 2024: 20.000) — Verfassungsschutzbericht 2025 (BMI), S. 94–95, visited 2026-09-03
- **5 Landesverbände** gesichert rechtsextremistisch — CORRECTIV, 17.06.2026
- **44,0 %** Sachsen-Anhalt, 06.09.2026 — in summary der Tour (Punkt 03)
- **+440 €** für Familie mit 40.000 € brutto / **−19.190 €** für 180.000 € brutto — ZEW Mannheim 2025 (Szene 21)
- **690 Mrd. €** Dexit-Gesamtkosten — IW Köln (Zahl im Briefing genannt; URL liefert Nexus-Recherche)
- **DIW:** „Die Hauptleidtragenden der AfD-Politik wären ihre eigenen Wählerinnen und Wähler." — DIW aktuell 88, 21.08.2023 (Szene 23)
- Umfragen: **27–29 %**, alle 8 Institute, Stand 01.09.2026 — wahlrecht.de (Szene 29)

**Abgeleitete Formate** (eigene Rechnung, keine neuen Quellen nötig):
- 440 €/Jahr = **36,67 €/Monat** = **8,46 €/Woche**
- 690 Mrd. € / 84 Mio. Einwohner ≈ **8.214 € pro Kopf**; Vierpersonen-Haushalt ≈ **32.900 €**
- 19.190 € / 440 € = **43,6-fach**