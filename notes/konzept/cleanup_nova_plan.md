# Cleanup-Plan (nova) — Kürzung & Struktur der 42 Szenen

**Stand:** 13.09.2026 · **Branch:** cleanup · **Auftrag:** Nicks Cleanup-Welle — Seite kürzen, Bias Richtung Kürzen („keine Sorgen, dass etwas fehlt"), Texte straffen, kleiner Sport-Catcher am Tour-Ende.
**Basis:** `content/scenes.json` (42 Szenen, Live-Stand), `content/chapters.json`, `MASTER_UMSETZUNG.md`, `saw_psychologie.md`.
**Grenze dieses Dokuments:** Plan only — keine Edits an scenes.json, kein Build, kein Commit. Nick wählt je Zeile; ohne Freigabe nichts live.

**Mess-Methodik (Approx, deckungsgleich mit Orchestrator-Messung):** sichtbar = quote+author+**context** · contrast=claim+reality · data=headline+caption · timeline=headline+date+title+text je Item · quiz=question+Optionen · slider=prompt · reveal=teaser+headline · summary=6 Kacheln. Erst **nach** Interaktion sichtbar (2. Ebene, eigenes Budget): reveal-body (Regel ≤150), quiz-explanation, slider-explanation, context_tooltip.

---

## 0) Bilanz Ist → Plan

| Kennzahl | Ist (42 Szenen) | Plan (36 Szenen) |
|---|---|---|
| Sichtbarer Text gesamt | ≈ 7.240 Z. | ≈ 5.000 Z. (−30 %) |
| Ø pro Szene | 172 Z. | ≈ 135–140 Z. |
| Szenen > 250 Z. | 9 (dazu 5 mit 248) | 0 |
| Szenen | 42 | 36 (−4 Streichungen, −2 Merges; Catcher in EndCard integriert) |

Grundsatz: **0 Fakten-Verlust.** Jede Zahl/jedes Zitat der gestrichenen Szenen bleibt entweder (a) wörtlich in einer anderen Szene vorhanden, (b) als 1-Satz-Kern gerettet (Pfad je Kandidat angegeben), oder (c) über Szene 42 + Archiv prüfbar. Quellen-Politik unberührt: nichts fliegt aus sources_log/Quellenverzeichnis, nur die Szene verschwindet.

---

## 1) Streichkandidaten

Reihenfolge = Empfehlungsstärke. Dopplungs-Prinzip: **gleiche Zahl ≠ gleiche Aussage** — geprüft wurde die Aussage-Ebene, nicht nur die Zahl.

### S1 · Szene 8 — data „44 % Wahlsieg Sachsen-Anhalt" (228 Z., verfassungsschutz)

- **Relevanz:** Mittel. Die Zahl ist stark, aber die Aussage „AfD ist stärkste Kraft in ST" steht zwei weitere Male (Szene 38, Ereignis-Kontext mit BSW-Absage; Szene 39, 44 %-Kachel im Recap). Der 8er-Chart (AfD 44 / CDU 17,8 / SPD 9,1) zeigt die Verteilung — Komfort, kein eigenes Argument.
- **Dopplungs-Check:** 8 ↔ 38 ↔ 39 = gleiche Zahl, drei verschiedene Aussage-Ebenen (Verteilung / Ereignis / Recap). Unersetzlich ist nur die Ereignis-Ebene (38) — die Recap-Kachel (39) deckt die reine Zahl ab. Die 8er-Ebene ist verzichtbar.
- **Emotionskurve:** Neutraler Daten-Puffer zwischen den Quotes 7 und 9. Fällt 9 ebenfalls (S2), endet das Kapitel auf Quote 7 (Konfrontations-Peak) + chapterbreak = sauberer saw-Rhythmus („Fakt → Konfrontation → Pause").
- **Rettungs-Pfade (Pflicht bei Streichung):** (a) Verdopplungs-Zahl „2021: 20,8 %" → als Klammertext in Szene 38, Item 1. (b) Kombinations-Pointe „Land wählt Partei mit gesichert rechtsextremistischem Landesverband": LV-Einstufung steht bereits sichtbar in Szene 6 — die Verknüpfung ist Textlogik, kein neuer Fakt; optionaler Halbsatz in 38/Item 1, nur wenn dessen Budget (§3, 38) es hergibt.

### S2 · Szene 9 — quote Weidel „Verfassungsschutz abschaffen" (357 Z., verfassungsschutz)

- **Relevanz:** Mittel. „AfD will die Beobachtung loswerden" ist ein guter Beleg, aber die Leser-fokussierte Widerlegung desselben Einwands leistet Szene 32 („V ist parteiisch → 3 Gerichte") direkter und kürzer.
- **Dopplungs-Check:** 9 ↔ 32 = gleiche Argumentlinie (AfD vs. Verfassungsschutz), verschiedene Rollen: 32 antwortet auf den Einwand, den Zweifelnde tatsächlich im Kopf haben — 9 ist Zusatz-O-Ton. „3 Gerichte bestätigt" steht außerdem in Szene 5, 32 und der Summary. 9 ist die schwächste der drei Ebenen.
- **Emotionskurve:** 7 und 9 sind zwei Quote-Konfrontationen im selben Kapitel; 7 (AfD-TV-Originalton, behördlich zitiert) ist der stärkere Beleg und bleibt als Kapitel-Peak.
- **Rettungs-Pfade:** O-Ton als 1 Satz in Szene 32 reality: „Weidel selbst fordert: Verfassungsschutz ‚in seiner jetzigen Form abschaffen'." DLF/dpa-Quelle bleibt in Szene 42 + Archiv prüfbar („Verwendet in"-Pfad entfällt, Quellenverzeichnis listet sie weiter).

### S3 · Szene 22 — quote Trump „MGGA" (258 Z., innen)

- **Relevanz fürs Überzeugungsziel:** Gering. Für Zweifelnde ist Trumps Gratulation kein Argument — für AfD-nahe Leser ist sie eher Bestätigung. „Ausland feiert" ist Kontext, kein Beleg über die AfD selbst.
- **Dopplungs-Check:** Echte Dopplung: Der Trump-Kern („MGGA", 2 Tage nach der Wahl) steht **wörtlich** in Szene 38, Item 3. Nur Musk („Gut gemacht!") und Grenell („großer Sieg") sind exklusiv — Folgezitate mit kleinem Eigenwert.
- **Emotionskurve:** Größter Fix-Gewinn der Welle: innen endet aktuell mit **3 Quotes in Folge** (21, 22, 23) — schlimmster Hartregel-Verstoß der Tour („nie 2 Konfrontationen hintereinander"). Streichung löst das.
- **Rettungs-Pfade:** Trump-Wortlaut bleibt über 38/Item 3 (dort jetzt Pflicht, s. §3/38). Musk/Grenell optional als Halbsatz in 38 — Empfehlung: **weglassen** (Bias Kürzen; Quellen bleiben in 42 + Archiv).

### S4 · Szene 25 — statement „Institute rechnen vor" (160 Z., kosten)

- **Relevanz:** Gering. Reine Ankündigung ohne Fakt, Zahl oder Zitat — das Kapitel liefert direkt danach (26–30), was 25 nur verspricht.
- **Dopplungs-Check:** Dreifach-Ankündigung derselben Aussage: Kapitel-Frage in chapters.json („Institute haben es durchgerechnet") + chapterbreak 24 + Statement 25. Null Informationsverlust.
- **Emotionskurve:** Neutraler Filler zwischen chapterbreak und Slider. Streichung lässt das Kapitel direkt mit dem interaktiven Dexit-Slider starten — der bessere Hook (saw: Interaktion statt Ankündigung).
- **Rettungs-Pfade:** Instituts-Namen („IW Köln · DIW Berlin · ZEW Mannheim") → 1 Klammertext im chapterbreak 24 („Weiter: Wer zahlt? IW, DIW und ZEW rechnen vor."). ZEW-URL der 25 bleibt in 42 (identisch mit Szene-28-Quelle).

### S5 · Szene 36 — data „Umfragen 27–29 %" (192 Z., fazit) — **optional; besser MERGE (→ M1)**

- **Relevanz:** Mittel. „Keine Randerscheinung" ist Motivations-, nicht Argumentationswert — und die flüchtigste Quelle der Tour („Stand 01.09.2026", veraltet monatlich, pflegeintensiv im Update-Zyklus).
- **Dopplungs-Check:** 36 (27–29 %, Umfragen) ↔ 37 (20,8 %, amtliche BTW) ↔ 38 (44 %, Wahlsieg): verschiedene Zahlen, **gleiche Aussage-Ebene** („die AfD ist real stark"). Die dauerhaften, amtlichen Belege (37, 38) tragen sie allein.
- **Emotionskurve:** fazit startet mit 2 Zahlen-Szenen am Stück vor der Timeline — Merge auf 1 interaktive Quiz-Szene strafft und gibt dem Abschlusskapitel Schwung.
- **Rettungs-Pfade (im Merge enthalten):** Einzigartige Info „alle 8 Institute konsistent, überall vor der Union" → 1 Satz in 37 explanation. wahlrecht.de-Quelle → 37 source bzw. 42. Pflegeaufwand Umfragen entfällt dauerhaft.

### Gegenprobe — Kern-Belege, auf keinen Fall streichen

| Szenen | Grund (Kern-Beleg) |
|---|---|
| 4 (28.000, Schwarm-Pin), 5 (3 Instanzen), 6 (5 LV gesichert) | Fundament des VSB-Kapitels + Setpiece; 5 stützt Einwand 32 und Summary-Kachel „3" |
| 7 (AfD-TV-Quote) | Original-Beleg für rechtsextreme Erzählung vom offiziellen Kanal, behördlich zitiert |
| 11, 12, 13, 16 | Programm-Kern: Klima, Nord Stream, Spardepot (Du-Bezug Rente), Remigration |
| 18 (Gauland) | Historischer Anker NS-Relativierung — **kürzen (§3), nie streichen**; Share-Kachel |
| 19, 20 (AFA, Krah) | Stärkste innen-Belege: Urteile + Personen + „0 Konsequenzen"-Story |
| 21 (Plenarprotokoll), 23 (Dobrindt/BMI) | Goldstandard-Zitat; Behörden-Gegenstimme (gewinnt an Gewicht, wenn 9 fällt) |
| 26, 27, 28, 29, 30 | Kosten-Herzstück: Dexit, IWH-Landesebene, +440/19.190-Verlust-Frame, Agrar-Quiz, DIW-Paradox-Pointe |
| 32, 33, 34 | Einwände = Familienessen-Zweck des Kapitels (jede einzeln sichtbar + „So sagst du's") |
| 38, 39, 40, 41, 42 | Frischeste Belege (BSW/Siegmund/Halle), Recap, Befähigung, Abschluss, Quellen-Trust-Feature |

---

## 2) Merge-Kandidaten

### M1 (empfohlen): Szene 36 + 37 → 1 Quiz-Szene (fazit)

- **Warum nah:** Beide = „AfD-Stärke in Zahlen" (s. S5). Ein Quiz mit Mitraten ersetzt zwei passive Daten-Screens am Kapitelstart.
- **Verfahren:** Quiz 37 bleibt (Typ, Frage, Optionen unverändert). 36-Kern als 1 Satz in die explanation: „Heute: 27–29 % in allen acht Instituts-Umfragen — überall vor der Union." 8-Balken-Chart und wahlrecht-Pflege entfallen. Quellen: wahlrecht.de in 37 source aufnehmen (2 Quellen je Szene — **Validator-Feld prüfen, apex**) oder nur in 42 weiterführen. Zielbild ≤ 250 Z. sichtbar (Frage+Optionen) / explanation ≤ 150.
- **Effekt:** −1 Szene, fazit startet interaktiv, monatlicher Update-Aufwand (Umfragen) entfällt.

### M2 (empfohlen): Szene 14 + 15 → 1 Contrast-Szene (programm, „Das Land zuerst.")

- **Warum nah:** Beide Contrast, beide hintereinander, beide aus demselben ST-Regierungsprogramm-PDF, gleiche Kapitelfrage. Zwei Szenen = zwei Mal derselbe Quellen-Chip.
- **Verfahren:** Szene 15 (Bürgerwacht) bleibt als Szene — konkretester, visuellster Claim (Verfassungsrechtler-Warnung). Claim 15 wörtlich behalten. Reality straffen (§3/15). **1 Satz aus 14** in die reality aufnehmen: „Als erste Amtshandlung kündigt dasselbe Programm die Rundfunkstaatsverträge." DW-Einordnung („radikaler Gesellschaftsumbau") + Landesparteitag-Details (aus 14) in den context_tooltip (existiert). Quellen: AfD-PDF + ZDF (evtl. + DW) je Szene — **Validator: source-Array prüfen**. Ziel ≤ 250 Z. sichtbar.
- **Effekt:** −1 Szene, −~100 Z. sichtbar, 2 Programm-Belege auf 1 Screen.

### M3 (optional, nur wenn Nick tiefer kürzen will): Szene 32 + 33 → 1 Contrast-Szene (einwaende)

- **Warum nah:** MASTER 4.1/4.2 sah vor: „Einwände 1+2 verschmelzen zu 1 Quiz" — offen, beide heute Contrast. Im Familienessen fallen „V ist parteiisch" und „nur Wahlkampfforderungen" oft als **ein** Satz.
- **Verfahren:** 1 Contrast: claim = „Der Verfassungsschutz ist parteiisch — und das sind nur Wahlkampfparolen, nie durchsetzbar." reality = „Drei Gerichte haben bestätigt — und die Anträge liegen als Drucksachen im Bundestag." Beide Quellen behalten (Validator: source-Array). Einwand 34 („Sprüche nimmt niemand wörtlich") bleibt eigenständig — andere Beweis-Ebene (Gewalt-Rhetorik).
- **Vorbehalt:** saw §3 gibt jedem Einwand einen eigenen „So sagst du's"-Satz — das Kapitel ist Befähigungs-Herzstück. Merge nur als maximale Kürzungs-Option, Empfehlung ist Behalten beider.

### Geprüft und bewusst NICHT gemerged: Szene 18 + 34 (Gauland 2×)

Gleicher Sprecher, **verschiedene Aussage**: 18 = NS-Relativierung (2018, Eskalations-Rolle in innen), 34 = „jagen"-Rhetorik (2017, Widerlegungs-Rolle im Einwand-Kapitel). Verschiedene Beweis-Ziele, verschiedene Kapitelrollen — Merge würde beide Aussagen verwässern. Bleibt getrennt.

---

## 3) Kürzungsplan der Over-Budget-Szenen

Ziel je Szene ≤ 250 Z. sichtbar, Ø < 170. **Sichtbarkeits-Regel (Inhalts-Regeln):** Das context-Feld beim Quote ist die **sichtbare kritische Einordnung im selben Screen** — es wird auf genau **1 Einordnungssatz** gekürzt, wandert nie komplett in den Tooltip. Details → context_tooltip (existiert je Szene bereits, wird Ziel des Transfers). **Weglassen nur letzte Option**, je Zeile markiert.

| Szene | Typ | Ist | Ziel | Bleibt sichtbar | Wandert in context_tooltip | Weglassen (nur falls nötig) |
|---|---|---|---|---|---|---|
| 5 | timeline | 248 | ~210 | Headline + 3 Items (Verdachtsfall → gesichert → ausgesetzt) | — (timeline ohne Tooltip-Feld) | Item-Texte straffen; **kein** Item darf fliegen — „Ausgesetzt" ist Fairness-Anker, „rechtskräftig" ist der Beweiswert |
| 7 | quote | 476 | ≤ 250 | Zitat auf Kernsatz mit Ellipse: „… Die Politik schaut nicht dabei zu, sie fördert aktiv den Austausch unserer Bevölkerung." + Autor + **1** Einordnungssatz („VSB zitiert dieses Video wörtlich — vom offiziellen Partei-Kanal.") | Details beider Felder konsolidieren: context UND context_tooltip sind heute fast inhaltsgleich → „Großer Austausch = verschwörungstheoretische Falschbehauptung (VSB S. 131)", ethnisch-abstammungsmäßiges Volksverständnis | Ersten Zitat-Halbsatz („Dörfer sterben …") — Pointe bleibt erhalten |
| 9 | quote | 357 | — | **Gestrichen (S2).** Falls behalten: Kernsatz „… in seiner jetzigen Form abgeschaffen" + Autor + 1 Einordnungssatz → ~200 | Drei-Gerichte-Details, Verdachtsfall-Kette | — |
| 12 | quote | 436 | ≤ 250 | Zitat mit Ellipse: „… die sofortige Aufhebung der Wirtschaftssanktionen gegen Russland sowie die Instandsetzung der Nord Stream-Leitungen." + Autor + 1 Einordnungssatz („Während Russland Krieg führt — der VSB nennt die Linie ‚eindeutig prorussische Narrative'.") | „Stoppt die Sanktionen"-Kampagne, Abgeordneten-Beteiligung, Kriegsfinanzierungs-Pointe (Tooltip existiert) | Nur Sekundärdetails; VSB-Einordnung ist Kern, bleibt sichtbar |
| 14 | contrast | 296 | — | **Gemerged in 15 (M2).** Falls behalten: claim wörtlich + reality auf 1 Satz + DW-Zitat → ~190 | Landesparteitag, PDF-Stand, „Posten und Pflichtgebühren" | — |
| 15 | contrast | 301 | ≤ 250 | Claim wörtlich (Programm-Direktzitat) + reality straffen: „Verfassungsrechtler Thiel: ‚verfassungsrechtlich problematisch' — der Plan ‚erinnert an Bürgerwehr'." + Merge-Satz aus 14 (Rundfunk als erste Amtshandlung) | Grundrechte/Funktionsvorbehalt/Art. 33 GG im Vollzitat (Tooltip existiert) + DW-Details aus 14 | Nie die Thiel-Quelle (kritische Einordnung) |
| 18 | quote | 372 | ≤ 250 | Zitat wörtlich (58 Z., unverzichtbar) + Autor + 1 Einordnungssatz („Die AfD-Jugend applaudierte — Gauland verteidigte den Satz später.") | Auschwitz-Komitee („widerlich"), Soldaten-Stolz-Forderung (Tooltip existiert) | — |
| 22 | quote | 258 | — | **Gestrichen (S3).** Falls behalten: 1 Einordnungssatz statt 2 → ~220 | Musk, Grenell, SPD-Reaktion | — |
| 23 | quote | 252 | ~200 | Zitat + Autor + 1 Einordnungssatz („Sein eigener Verfassungsschutzbericht zählt 28.000 im AfD-Umfeld — Rekord.") | 58.700 Potenzial (+17 %), 15.600 gewaltorientiert, 5 LV (Tooltip existiert) | — |
| 38 | timeline | 420 | ≤ 250 | Headline kürzen („Nach der Wahl") + 3 Items, Texte je ≤ 45 Z.: ① „Die AfD gewinnt mit 44 % (2021: 20,8 %)." ② „BSW schließt Koalition aus. Schüsse auf Kundgebung in Halle — Täter unbekannt." ③ „Siegmund: Kernpositionen ‚zu 100 %' umsetzen. Trump: ‚MGGA'." | — (timeline: Details je Item-Quelle); kürzere dates („06./07./08.–09.09.") + titles ≤ 18 Z. als zusätzliche Hebel | Halle-**Halbsatz** niemals: „Täter unbekannt" ist Fairness-Pflicht (MASTER §6); Weidel entfällt (steht als eigene Szene 21); Trump bleibt hier (Rettung für S3) |

**Zusatzregeln aus der Messung (nicht in der Over-Liste, aber gegen Budget-Regeln):**

| Szene | Regel | Ist | Ziel |
|---|---|---|---|
| 6 | reveal body ≤ 150 | 162 | ~140 („seit Jahren als gesichert — kein Gericht hat das gekippt. Neu 2025/26: Brandenburg, Niedersachsen.") |
| 20 | reveal body ≤ 150 | 165 | ≤ 150 (Jahre „2019–2024" straffen; Kern-Story „1 Mitarbeiter · 4 J. 9 Mon. · 0 Konsequenzen" unantastbar) |
| 16, 29 | quiz explanation ≤ 150 | 198 / 171 | ≤ 150 (Sekundärsätze in context_tooltip verschieben) |
| 7, 12 | Doppelung context ↔ context_tooltip | 2× fast identisch | Konsolidieren: context = 1 Einordnungssatz, tooltip = Details (einmalig, nicht doppelt) |

---

## 4) Sport-Catcher (Teaser auf die kommende Sportseite)

**Annahme (laut Auftrag):** kommende, übersichtlich durchklickbare Seite zum Ansehen aller Inhalte — Arbeitstitel „Sportseite". Copy verspricht nur diese Zusagen: übersichtlich, alles ansehen, durchklicken. **Keine Fake-Features** (kein Quiz, keine Rechner, keine Spiele).

### Platzierung

| Option | Bewertung |
|---|---|
| Vor der EndCard (zwischen 40/41) | Nein — verwässert den Handlungs-/Abschluss-Moment („Dein Zug.") und konkurriert mit den Action-Karten |
| Hinter der EndCard (zwischen 41/42) | Nein — bricht den Trust-Pfad EndCard → Quellen; **technischer Konflikt:** der Quellen-Button scrollt zu `sceneEl.nextElementSibling` und würde auf den Catcher statt auf die Quellen springen (EndCard.astro, data-scroll-sources) |
| Hinter Szene 42 (Nachspann) | Alternative — stört nichts, erreicht aber nur das Trust-Publikum, das bis zum letzten Screen scrollt |
| **In der EndCard integriert (Empfehlung)** | 1 Zeile + 1 Button zwischen den Aktions-Buttons und dem end-note; **100 % der Finisher** sehen ihn, kein neuer Screen, kein Scroll-Pfad-Bruch, kein neuer Szenen-Typ → Validator unverändert |

**Empfehlung: in der EndCard integriert.** Falls EndCard unangetastet bleiben soll: Nachspann hinter 42 — dann als Szene vom Typ `statement` in scenes.json abbildbar (Validator-kompatibel, keine neuen Felder).

### Copy-Varianten (je Kicker + 1–2 Sätze + Button-Label)

**V1 — Nachschlage-Frame (stärkster Zielgruppennutzen, Familienessen-Anschluss):**
- Kicker: „Zum Nachschlagen"
- Text: „Eine Zahl brauchst du im Gespräch? Alle Szenen liegen bald auf einer übersichtlichen Seite — zum Durchklicken, statt die Tour neu zu scrollen."
- Button: „Zur Übersicht"

**V2 — Neugier-Frame (EndCard-Ton, kurz und neckisch):**
- Kicker: „Noch nicht genug?"
- Text: „Bald kannst du dir alles auch einzeln angucken: jede Szene auf einer Seite, klickbar. Ohne Scroll-Marathon."
- Button: „Schau rein"

**V3 — Teilen-Frame (knüpft an die Teilen-Karte der EndCard an):**
- Kicker: „Übrigens"
- Text: „Du hast gerade eine Szene im Kopf, die du jemandem schicken willst? Sie wird bald alleine stehen — anklickbar auf einer Übersichtsseite."
- Button: „Alle Szenen"

### Umsetzungsgrenzen

1. **Betriebsmodi:** (A) Seite live → Button aktiv auf die Sportseite. (B) Seite nicht live → nur Kicker + Text mit „Bald"-Badge, **kein Button** (kein toter Link, keine Fake-Feature-Erneuerung).
2. **Keine festen Szenenzahlen** in der Copy („42" bzw. künftig „36" nicht festschreiben — „alle Szenen" reicht).
3. Kein neuer Szenen-Typ, keine Validator-Felder, keine neue Komponente nötig (EndCard-Zusatzzeile) — Catcher ≠ Feature-Ausbau.
4. Quellen-Regel: Catcher enthält keine Behauptung über die AfD → kein Quellen-Chip nötig; sichtbarer Text ≈ 100–140 Z. (im EndCard-Budget enthalten, keine eigene Budget-Szene).

---

## 5) Folge-Empfehlungen (Emotionskurve nach den Eingriffen)

| Eingriff | Folge-Maßnahme |
|---|---|
| 22 gestrichen (innen) | 21 + 23 wären 2 Quotes hintereinander → **23 zwischen 20 und 21 schieben**: 18 quote · 19 reveal · 23 quote · 20 reveal · 21 quote = Zickzack statt Block |
| 8 + 9 gestrichen (vs) | Kapitel endet auf Quote 7 (Peak) + chapterbreak 10 mit Kompetenz-Satz — saw-Idealrhythmus; chapterbreak 24 bekommt Instituts-Klammertext (aus S4) |
| 25 gestrichen (kosten) | Kapitel startet direkt mit Dexit-Slider (26) — Hook statt Ankündigung |
| 36 gemerged (fazit) | Kapitel startet interaktiv (Quiz 37 mit Umfrage-Satz); Rest bleibt (38 wischbar, 39 Counter-Kacheln, 40 Karten = keine toten Screens) |
| MASTER-Nebenbefunde (offen, beim Reorder mitdenken, kein Teil dieses Auftrags) | 4.2 sah „Krah-Spionage vor AFA" vor — Datenbestand hat AFA (19) vor Krah (20); 4.1 sah Quiz-Merge der Einwände 1+2 vor → als M3 geführt |

**Freigabe:** Nick wählt je Zeile S1–S5 (streichen/mergen/behalten) und Copy-Variante V1–V3; Umsetzung danach durch Orchestrator + apex (Validator: source-Arrays bei Merges, timeline-Zählung bei 38), im Anschluss validate → build → smoke → Deploy nach Freigabe.