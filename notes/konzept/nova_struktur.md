# Nova — Erzähl- & Szenenarchitektur für maximale Verweildauer

**Konzept v2.0 für info-afd.de · Umbau der bestehenden 34 Szenen / 7 Kapitel (content/scenes.json + chapters.json) · Bezugsgröße: Nicks Feedback „zu viel Text, Leute springen ab"**

---

## 0. Diagnose aus den Daten (nicht aus dem Gefühl)

Gemessen an `content/scenes.json`:

| Befund | Zahl | Konsequenz |
|---|---|---|
| Sichtbarer Text über alle Content-Felder | ~7.000 Zeichen | Um fast die Hälfte kürzbar, ohne einen Fakt zu verlieren |
| Szenen mit Textblock > 250 Zeichen | 11 von 34 | Genau diese 11 fressen die Lesedauer; sie tragen 64 % des Texts (4.462 von ~6.957 Zeichen) |
| Längster Block | Reveal #17 (Krah/Spionage): 560 Zeichen | Textwand im interaktiven Format — der Teaser-Click wird mit Lesearbeit „belohnt" |
| Interaktive Szenen (Quiz/Slider/Reveal) | 7 von 34 | Alle in den Kapiteln 3–5; Kapitel 6 „Einwände" sind 3 Contrast-Szenen in Folge — totales Pattern-Deadlock |
| Längste passive Strecke | Szenen 3–5 (chapterbreak → data → timeline) | Drei passive Formate hintereinander direkt nach dem Intro |

Die Site verliert Leser nicht am Anfang, sondern **mitten drin**: Kapitel 3–5 sind textlastig, Kapitel 6 ohne einen einzigen Interaktionspunkt. Das ist der Hebel.

---

## 1. Kapitel-Dramaturgie: Hook → Eskalation → persönlicher Bezug → Handlung

Die 6 inhaltlichen Kapitel (intro, verfassungsschutz, programm, innen, kosten, einwaende + fazit) bekommen eine feste Dramaturgie-Rolle. **Jedes Kapitel folgt demselben 4-Phasen-Muster**, nur die Intensität steigt:

```
HOOK            ESKALATION              PERSÖNLICHER BEZUG         HANDLUNG
"Wusstest du    "Es wird schlimmer      "Was heißt das             "Was kannst du
 dass…?"        /krasser als gedacht"    für DICH?"                 tun?"
 (1 Szene)      (2–3 Szenen)            (2 Szenen)                 (1 Szene/Brücke)
```

Konkret zugeordnet auf die bestehenden Kapitel (Nr = Szene in scenes.json):

| Kapitel | Rolle | Umbau |
|---|---|---|
| **01 intro** | Hook | hero + statement bleiben. Statement #2 wird auf **2 Zeilen** gekürzt („Diese Seite ist keine Meinungsseite. Alles mit Quelle, alles belegbar. — Scroll.") |
| **02 verfassungsschutz** | Hook + Eskalation | data #4 (28.000) ist der Hook-Zahlknaller → bleibt Opener. Timeline #5 bleibt Eskalation, aber auf **3 statt 6 Punkte** kürzen (siehe §6). Reveal #6 + Quote #7 → Eskalation. |
| **03 programm** | Eskalation + **persönlicher Bezug** | Contrast #11 (Klima) als Aufhänger, Quote #12 (Russland/Sanktionen) → Eskalation. Slider #13 (Rente) + Quiz #14 (Remigration) sind die persönlichen Szenen — **beide behalten und stärken**, nicht ersetzen. |
| **04 innen** | Eskalation („wiederlichste Belege") | Quote #16 (Gauland/Vogelschiss) → Opener. Die beiden Reveals #17 + #18 (AFA-Abschiebetrupp, Krah-Spionage) sind die krassesten Karten der Site → **Reihenfolge tauschen: Spionage-Story zuerst** (hat Personen, Plot, Urteil — stärkster Hook), dann AFA-Abschiebetrupp. |
| **05 kosten** | **Persönlicher Bezug** (das ist das Herzstück) | Statement #20 → als **Frage** formulieren („Wie viel zahlt DU für die AfD-Pläne?"). Data #21 (+440 € / 19.190 €) → Chart bleibt, aber die **+440 € für die Normalfamilie werden die Headline**, nicht die 19.190 €. Quiz #22 (Agrarmilliarden) behalten. Quote #23 (DIW/AfD-Paradox) → gekürzt als Paukenschlag. |
| **06 einwaende** | Handlungs-Vorbereitung | 3 Contrast-Szenen #25–27 → **nur 2 behalten** (siehe §6), als Frage-Antwort-Rhythmus: Szene stellt die Frage, die du im Gespräch hörst → Tap zum Aufklappen der Antwort. |
| **07 fazit** | Handlung | data #29 (28 % Umfragen) → bleibt Anker. Quiz #30 behalten. Summary #31 wird zur **Kurz-Spiegelbox** (nur die 6 Zahlen, je 1 Zeile). Action #32 bleibt. endcard #33 + sources #34 bleiben. |

**Regel: keine Phase auslassen.** Ein Kapitel ohne persönlichen Bezug (heute: verfassungsschutz, innen) bekommt eine Brücken-Szene „Was heißt das für dich?" — 1 Satz + 1 Zahl, nicht mehr. Beispiel Verfassungsschutz: nach Szene #9 einbauen → „Bei 28 % in den Umfragen ist das kein Randthema mehr — es bestimmt, wer 2027 regiert."

**Emotionskurve:** Hook (Neugier) → Eskalation (Wut/Fassungslosigkeit) → Bezug (Betroffenheit: „das kostet DICH") → Handlung (Selbstwirksamkeit). Nach jedem Eskalations-Peak folgt zwingend eine interaktive Szene als „Ventil" — sonst kippt Wut in Resignation und Absprung.

---

## 2. Szenenrhythmus: interaktiv vs. passiv

**Regel: nie mehr als 2 passive Szenen hintereinander, mindestens 1 Interaktionspunkt pro Bildschirm-Minute.**

Bestand: 7 interaktive (Quiz ×3, Slider ×1, Reveal ×3) auf 23 Content-Szenen — Verhältnis 1 : 3,3. Ziel-Verhältnis: **1 : 2** (d. h. 11–12 interaktive auf 23 Content-Szenen). Das wird nicht durch neue Komponenten erreicht, sondern durch **Typ-Tausch** (§6).

**Idealer Pattern-Wechsel: alle 2–3 Szenen.** Nie 3 passive in Folge, nie 3 interaktive in Folge (Quiz-Fatigue ist genauso real wie Textwand).

**Gewünschte Sequenz-Typen (Fünfer-Rhythmus als Bauplan pro Kapitel):**

```
[passiv] → [passiv] → [INTERAKTIV] → [passiv] → [INTERAKTIV] → …
   data       quote      quiz/slider    contrast    reveal/quiz
```

Kapitel-Check gegen den Bestand:

| Kapitel | Ist-Rhythmus | Problem | Fix |
|---|---|---|---|
| 02 verfassungsschutz | data → timeline → reveal → quote → data → quote | 3 passive am Anfang, 2 passive am Ende | #7 (Quote Weidel) → **Contrast**: „Verfassungsschutz parteiisch?" → Tap → Antwort |
| 03 programm | contrast → quote → slider → quiz | ok, nur #12 (Quote Russland) lang | #12 auf Zitat + 1 Satz kürzen |
| 04 innen | quote → reveal → reveal | 2 Reveals hintereinander = doppelter Tap-Zwang | Reveal #18 (Krah) → **data** mit Chart (Zeile: „4 J. 9 Mon. Haft für Spionage — aus Krahs Büro") |
| 05 kosten | statement → data → quiz → quote | ok | Statement #20 → Frage-Statement (siehe §1) |
| 06 einwaende | contrast → contrast → contrast | totales Pattern-Deadlock | #25 + #26 → **zu 1 Quiz** zusammenlegen („Welcher dieser 3 Einwände ist wahr? — Keiner."), #27 („Wir werden sie jagen") bleibt als Quote-Paukenschlag |
| 07 fazit | data → quiz → summary → action | ok | — |

Ergebnis: **12 von 23 Content-Szenen interaktiv** statt 7. Pattern-Wechsel alle 2–3 Szenen überall erfüllt.

---

## 3. Scan-First-Prinzip: wie viel Text pro Szene

**Hartes Budget: 200 Zeichen pro Szene, 250 als absolutes Limit.** Heute: Ø 205, aber 11 Szenen drüber (bis 560). Ziel: **keine Szene über 250 Zeichen**, Ø unter 170.

**Blickfang-Priorität (was zuerst lesbar sein muss, in dieser Reihenfolge):**

1. **Zahl** — größte Schrift auf der Szene. Ist keine Zahl im Spiel, ist es ein Zitat oder ein einzelnes Wort („Remigration", „Vogelschiss", „AFA").
2. **Bild/Grafik** — Chart, Balken, Kachel, Karte. Muss ohne Text funktionieren.
3. **Satz** — maximal 1 Satz Kern-Aussage, fett, max. 12 Wörter.
4. (erst danach) Kontext/Quelle — **aufklappbar**, nicht sichtbar default.

**Konsequenzen für die 11 Übertäter:**

| Szene | Jetzt | Ziel |
|---|---|---|
| #5 timeline | 6 Punkte, 305 Zeichen | 3 Punkte: 2021 Verdacht → 2025 gesichert/rechtskräftig → 2026 ausgesetzt. Rest weg. |
| #6 reveal | 305 Z. | Teaser 1 Satz, Body ≤ 150 Z. |
| #9 quote (Weidel) | 254 Z. | Zitat + 1 Satz Kontext. Der Rest wandert als „Quelle"-Tooltip hinter das ℹ-Icon. |
| #12 quote (Russland) | 259 Z. | Zitat + 1 Satz. |
| #13 slider | 324 Z. | Erklärung auf ≤ 200 Z. |
| #14 quiz | 350 Z. | Erklärung auf ≤ 200 Z. (Nur Kern: Remigration = Druck zur Ausreise, Krah-Zitat raus.) |
| #17 reveal (Krah) | 560 Z. | **Kern-Story in 3 Zahlen**: „1 Mitarbeiter · 4 J. 9 Mon. Haft · 0 Konsequenzen für Krah". Der restliche Kontext → aufklappbar. |
| #18 reveal (AFA) | 352 Z. | ≤ 150 Z. — Kern: Name „AFA", ICE-Vorbild, „Startbahnen glühen"-Logik. |
| #22 quiz | 274 Z. | Erklärung ≤ 200 Z. |
| #27 contrast | 385 Z. | Zitat + 1 Satz. |
| #31 summary | 6 TLDR, 455 Z. | 6 Zahlen statt 6 Sätze („28.000 · 3 Gerichte · 44 % · −440 € · 6 Zitate · 0 Rücktritte"). |

**Faustregel für Autoren:** Wenn ein Satz ohne Verlust weggelassen werden kann → weglassen. Wenn ein Satz nicht in einer Zeile passt → zwei Sätze aus ihm machen. Wenn ein Kontext nicht in 150 Zeichen passt → aufklappbar machen, nicht löschen (Quellen-Politik bleibt intakt: Quelle ist weiterhin sichtbar, nur der Fließtext wandert in den Tooltip).

---

## 4. Micro-Hooks zwischen Szenen

**Prinzip: Jede Szenengrenze ist eine Neugier-Lücke.** Der letzte Blickpunkt einer Szene ist der Cliffhanger zur nächsten. Konkret: Am Ende jeder passiven Szene erscheint (kurz, klein, 1 Zeile) ein **Hook-Teaser** auf die nächste Szene — auf der Timeline zwischen den Szenen, nicht in der Szene selbst.

**Formulierungs-Bausteine (auf die bestehende Tour angewandt):**

| Übergang | Micro-Hook |
|---|---|
| #2 → #3 (intro → VS) | „Wie viele Rechtsextremisten sitzen laut Verfassungsschutz im AfD-Umfeld? Die Zahl hat sich verdoppelt. →" |
| #4 → #5 (data 28.000 → timeline) | „Die AfD hat dagegen geklagt. Drei Gerichte. Ein Ergebnis. →" |
| #6 → #7 (reveal 5 Verbände → quote) | „Und dieses Zitat? Nicht von einem Randfigur. Vom offiziellen AfD-Kanal. →" |
| #9 → #10 (VS → programm) | „Das war die Einschätzung von Behörden. Was steht im Wahlprogramm? →" |
| #12 → #13 (quote Russland → slider) | „Und für deine Rente? Da wird es richtig teuer. →" |
| #14 → #15 (programm → innen) | „Und wer gibt dort eigentlich den Ton an? →" |
| #18 → #19 (innen → kosten) | „Klingt abstrakt? Institute haben durchgerechnet, was das kostet. →" |
| #23 → #24 (kosten → einwaende) | „Da kommen Einwände. Drei davon. Hier geprüft. →" |
| #27 → #28 (einwaende → fazit) | „Und was, wenn du recht hast? Die Umfragen sagen etwas anderes. →" |

**Zwei Arten von Hooks abwechseln:**
1. **Zahl-Hook:** „X % …" / „Y Millionen …" — verspricht eine krasse Zahl in der nächsten Szene.
2. **Cliffhanger-Frage:** „Was heißt das für dich?" / „Wie viel kostet dich das?" — offener Loop, der erst die nächste Szene schließt.

**Regeln:**
- Max. **60 Zeichen** pro Hook, 1 Zeile, keine Erklärung.
- Nie zwei Hook-Typen direkt hintereinander.
- Hooks sind **kein eigener Szenen-Typ**, sondern ein Feld (z. B. `next_hook`) auf der letzten Szene vor einem Übergang. Kein neuer Szenen-Typ nötig, Datenmodell bleibt schlank.

---

## 5. Teil-/Deep-Link-Strategie: Szenen als sharebare Mini-Argumente

**Prinzip: Jede Szene ist ein eigenständiges, teilbares Argument.** Der Teilen-Button (heute oben rechts in der Action-Szene erwähnt) muss **pro Szene** funktionieren und **ohne Kontext** verständlich sein.

**Technik:**
- Jede Szene bekommt eine stabile URL: `info-afd.de/#szene-<chapter>-<nr>` (z. B. `/szene-verfassungsschutz-4` für die 28.000-Szene) — Deep-Link springt direkt zu dieser Szene, Chapter-Kontext wird mitgeladen.
- Beim Teilen wird ein **OG-Image dynamisch gerendert** (Astro-Endpoint oder Static-Pre-Render pro Szene): Hintergrund = Akzentfarbe des Kapitels, **die zentrale Zahl bzw. das Zitat als Bildtext**, Untertitel = Quellen-Label. Das OG-Image ist das eigentliche Share-Argument — die Vorschau in WhatsApp/Insta muss wie ein Fakten-Kachelposter wirken, nicht wie ein Link.
- Share-Text-Vorlage pro Szene (in scenes.json als Feld `share`): 1 Zahl + 1 Satz + Quelle, z. B. Szene #21: „Eine Familie mit 40.000 € zahlt 440 € mehr. Eine mit 180.000 € bekommt 19.190 €. Quelle: ZEW Mannheim."
- **Kontext-Sicherung:** Wer einen Deep-Link öffnet, sieht 1 Zeile „Das ist Szene 4 aus Kapitel 2 der info-afd-Tour" + Button „Tour starten" — niemand landet orientierungslos.
- **Progress-Link im Share:** Wer über Deep-Link einsteigt, sieht danach einen „→ Weiter zur nächsten Szene"-Pfeil, damit die Tour nicht nach 1 Szene endet.

**Welche Szenen sind Share-Kandidaten (Top 5, mit höchstem Argumentwert):**
1. #4 — 28.000 Rechtsextremisten (Verdopplung in 2 Jahren)
2. #21 — +440 € für die Normalfamilie / +19.190 € für Topverdiener
3. #17 — Krah/Spionage: „4 Jahre 9 Monate Haft — aus dem Büro des EU-Spitzenkandidaten"
4. #16 — Gauland „Vogelschiss"
5. #14 — Quiz Remigration (der „Remigration"-Begriff mit Erklärung)

Diese 5 Szenen bekommen das dynamische OG-Image zuerst; bei Erfolg werden alle claim-Szenen nachgezogen. **Der Quiz-Share teilt nicht die Antwort, sondern die Frage** („Weißt du, wie die AfD ihre Migrationspolitik nennt?") — Quiz-Shares sind Einladungen, kein Spoiler.

---

## 6. Empfehlung: welche Szenen-Typen dominieren, welche sterben

**Dominierende 5 (Kerninventar, ~80 % der Content-Szenen):**

| Typ | Künftig | Warum |
|---|---|---|
| **data** | 6–7× | Der Zahl-Blickfang. Jede krasse Zahl (28.000 · 44 % · 690 Mrd. · −440 €) als animierter Counter/Chart. Arbeitet ohne Text. |
| **quiz** | 4× | Stärkster Engagement-Typ, erzeugt Anteilnahme + Share-Freude. Auch für Einwände-Kapitel genutzt (#25+#26 verschmelzen zu 1 Quiz). |
| **reveal** | 3–4× | Tap-to-Reveal = aktive Beteiligung + kleiner Dopamin-Moment. Aber: Body-Text strikt auf ≤ 150 Z. kürzen. |
| **quote** | 3–4× | Zitate sind die emotionsstärksten, kürzesten Belege (Vogelschiss, Weidel, Programm-S. 92). Zitat + 1 Satz Kontext, mehr nicht. |
| **contrast** | 2× | Behält seine Rolle als „Einwand → Fakt"-Umkehrer, aber nur noch 2 statt 4; Rest wandert ins Quiz. |

**Seltener/untergeordnet:** statement (nur 1× als Kapitel-Einstieg mit Frage), slider (1×, bleibt als Abwechslung im Rhythmus), timeline (1×, auf 3 Punkte gestutzt).

**Gestrichen/ersetzt:**

| Typ | Aktion | Begründung |
|---|---|---|
| **statement** | Von 2 auf 1 reduzieren | #20 (kosten) wird zur **Frage** umgebaut („Wie viel zahlt DU?") — Statements sind textlastige Passivszenen mit der schwächsten Verweildauer. |
| **summary** | Umbauen, nicht streichen | 6 Textzeilen → **6 Zahlen als Kacheln** (Zahl + 3-Wort-Label). Der Text „Die AfD hat die Landtagswahl gewonnen…" wird zur Zahl „44 %". |
| **timeline** | Auf 1 Instanz reduzieren, 3 Punkte | 6 Zeitpunkte sind zu viel; 3 reichen für die Story (Verdacht → gesichert → ausgesetzt). |
| **action** | Bleibt, aber mit Teilen-Fokus | 4 Karten → 3: „Dranbleiben", „Selbst nachprüfen", „Teilen" (Weiterlesen fliegt in die Quellen-Sektion). |
| **contrast** (als eigenständiges Kapitel-Gerüst) | Kapitel 6 auf 2 Contrast + 1 Quote slanken | 3× denselben Typ hintereinander ist Pattern-Deadlock; der dritte Einwand wandert ins Quiz. |

**Neue Typen: keine.** 14 Typen reichen. Alles oben ist Typ-Tausch, Kürzung und Feldergänzung (`next_hook`, `share`, optional `context_tooltip`) — kein neues Datenmodell.

---

## 7. Zusammengefasst: der Umbau in 5 Regeln

1. **Jedes Kapitel folgt Hook → Eskalation → Bezug → Handlung.** Kein Kapitel ohne persönlichen Bezug (Brücken-Szene „Was heißt das für dich?" mit 1 Zahl).
2. **Max. 2 passive Szenen hintereinander, 1 interaktive pro 2–3 Szenen.** Ziel: 12 von 23 interaktiv statt 7.
3. **Scan-First:** Keine Szene über 250 Zeichen (Ø < 170), Blickfang-Reihenfolge Zahl > Bild > Satz. Alles andere aufklappbar.
4. **Jede Szenengrenze ist ein Micro-Hook** (max. 60 Zeichen, abwechselnd Zahl- oder Cliffhanger-Frage).
5. **Jede Szene ist ein sharebares Mini-Argument** mit eigener URL + dynamischem OG-Image; Top-5-Share-Szenen zuerst.

Damit werden die ~7.000 Zeichen sichtbaren Texts auf ~4.500 reduziert, 5 Szenen-Typen werden dominierend, 3 werden umgebaut/gestrichen — **ohne eine einzige Quelle oder einen Fakt zu verlieren.**