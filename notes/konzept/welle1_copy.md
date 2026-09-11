# Welle 1 — Copy-Texte (welle1_copy.md)

**Stand:** 11.09.2026 · **Basis:** MASTER_UMSETZUNG.md §5 (1.2, 1.4) + §3 Design-Regeln · saw_psychologie.md §2/§4 · Branch v1.5
**Nur Copy.** Keine Code-/Content-Änderungen, nichts committet. Orchestrator wählt je Text eine Variante.

**Limits (geprüft, Python `len()` inkl. Leerzeichen):**

| Text | Feld | Limit |
|---|---|---|
| Kapitel-Break (6×) | `summary` | ≤90 Z. |
| Kapitel-Break (6×) | `next_title` | ≤40 Z. |
| Szene 21 (data, kosten) | `headline` | ≤60 Z. |
| Szene 21 (data, kosten) | `caption` | ≤200 Z. |
| 43,6×-Kachel | Kernsatz + Quellenzeile | ≤80 Z. (Kernsatz ≤12 Wörter) |

**Fakten-Basis (unverändert, keine neuen Behauptungen):**

- **+440 €** Steuern/Jahr für Familie mit 40.000 € brutto · **−19.190 €** zurück für 180.000 € brutto — ZEW Mannheim, „Wen die Parteien entlasten würden“ (2025), Szene 21. Quellen-Label bleibt exakt wie in scenes.json.
- **36 €/Monat** = 440 € ÷ 12 — reine Übersetzung (saw §4, „Verlust-Frame nur als Übersetzung“).
- **43,6-fach** = 19.190 € ÷ 440 € — eigene Rechnung aus den beiden ZEW-Zahlen (saw Anhang).
- 690 Mrd. € (Dexit) / 8.200 €/Kopf gehören zur Dexit-Szene (Welle 2.1) — hier nicht verbaut.

---

## 1) Kapitel-Breaks — „Du weißt jetzt“ + „Weiter“ (MASTER 1.2, saw §2/§3)

6 chapterbreak-Szenen (scenes.json, Positionen 3 / 10 / 15 / 19 / 24 / 28). Je 2 Felder:
`summary` = 1 Satz Kompetenz-Bestätigung („Du weißt jetzt: …“), **kein Zahlen-Recap**; `next_title` = „Weiter: …“ mit Kapitel-Titel aus chapters.json. Kurz, direkt, locker-konkret — nicht belehrend.

### Break 1 — Szene 3 · 01 „Der Anlass“ → 02 „Verfassungsschutz“

**`summary`** (≤90 Z.):
- **S1** `Du weißt jetzt: Hier steht nichts ohne Beleg — jede Zahl hat ihre Quelle.` [73 Z / ≤90]
- **S2** `Du weißt jetzt, woran du hier bist: an Belegen, nicht an Meinungen.` [67 Z / ≤90]
- **S3** `Zweifel an einer Zahl? Gut. Du weißt jetzt, dass du hier jede prüfen kannst.` [76 Z / ≤90]

**`next_title`** (≤40 Z.):
- **T1** `Weiter: Verfassungsschutz` [25 Z / ≤40]
- **T2** `Weiter: Kapitel 2 — Verfassungsschutz` [37 Z / ≤40]

### Break 2 — Szene 10 · 02 „Verfassungsschutz“ → 03 „Das Programm“

**`summary`** (≤90 Z.):
- **S1** `Du weißt jetzt, warum der Verfassungsschutz die Partei im Blick hat.` [68 Z / ≤90]
- **S2** `Du weißt jetzt, warum drei Gerichte die Einstufung bestätigt haben.` [67 Z / ≤90]
- **S3** `Noch da? Du weißt jetzt, warum der Verfassungsschutz die AfD im Blick hat.` [74 Z / ≤90]

**`next_title`** (≤40 Z.):
- **T1** `Weiter: Das Programm` [20 Z / ≤40]
- **T2** `Weiter: Kapitel 3 — Das Programm` [32 Z / ≤40]

### Break 3 — Szene 15 · 03 „Das Programm“ → 04 „Innenleben“

**`summary`** (≤90 Z.):
- **S1** `Du weißt jetzt, was die AfD schriftlich plant — es steht alles im Programm.` [75 Z / ≤90]
- **S2** `Du weißt jetzt: Das sind keine Sprüche, das ist ihr Programm. Wort für Wort.` [76 Z / ≤90]
- **S3** `Klima, Russland, Rente, Migration — du weißt jetzt, was drinsteht.` [66 Z / ≤90]

**`next_title`** (≤40 Z.):
- **T1** `Weiter: Innenleben` [18 Z / ≤40]
- **T2** `Weiter: Kapitel 4 — Innenleben` [30 Z / ≤40]

### Break 4 — Szene 19 · 04 „Innenleben“ → 05 „Was es kostet“

**`summary`** (≤90 Z.):
- **S1** `Du weißt jetzt, wer dort den Ton angibt — und dass es kein Einzelfall ist.` [74 Z / ≤90]
- **S2** `Noch da? Du hast vier Kapitel geschafft — und weißt jetzt, wer den Ton angibt.` [78 Z / ≤90]
- **S3** `Du weißt jetzt, wer den Ton angibt. Und was das fürs Geld bedeutet.` [67 Z / ≤90]

**`next_title`** (≤40 Z.):
- **T1** `Weiter: Was es kostet` [21 Z / ≤40]
- **T2** `Weiter: Kapitel 5 — Was es kostet` [33 Z / ≤40]

### Break 5 — Szene 24 · 05 „Was es kostet“ → 06 „Einwände“

**`summary`** (≤90 Z.):
- **S1** `Du weißt jetzt, wer draufzahlt. Und wer kassiert.` [49 Z / ≤90]
- **S2** `Du weißt jetzt, wer zahlt — und dass es nicht die sind, die kassieren.` [70 Z / ≤90]
- **S3** `Du weißt jetzt, was die Pläne kosten — und wer sie bezahlt.` [59 Z / ≤90]

**`next_title`** (≤40 Z.):
- **T1** `Weiter: Einwände` [16 Z / ≤40]
- **T2** `Weiter: Kapitel 6 — Einwände` [28 Z / ≤40]

### Break 6 — Szene 28 · 06 „Einwände“ → 07 „Das Fazit“

**`summary`** (≤90 Z.):
- **S1** `Du weißt jetzt, was die drei Standard-Einwände wert sind.` [57 Z / ≤90]
- **S2** `Du weißt jetzt, was du auf die drei Standard-Einwände antworten kannst.` [71 Z / ≤90]
- **S3** `Die drei Einwände vom Familienessen? Du weißt jetzt, was darauf passt.` [70 Z / ≤90]

**`next_title`** (≤40 Z.):
- **T1** `Weiter: Das Fazit` [17 Z / ≤40]
- **T2** `Weiter: Kapitel 7 — Das Fazit` [29 Z / ≤40]

**Auswahl-Empfehlung Orchestrator:** B1→S1 · B2→S1 (saw-Wortlaut §3) · B3→S1 · B4→S2 (self-ironische Pause nach dem schwersten Kapitel, saw §3 — sonst S1) · B5→S1 (greift die neue Headline von Szene 21 vor) · B6→S3 (Familienessen-Frame) oder S1. next_title: T1 Standard, T2 wenn der Kapitel-Tracker die Nummerierung ohnehin zeigt.

---

## 2) Szene 21 (data, kosten, Steuerpläne) — Verlust-Frame (MASTER 1.4, saw §4)

Ist: headline „Steuerpläne: Wer bekommt wie viel zurück?“ (41 Z.), caption 184 Z. — Gewinn-Frame aus Topverdiener-Sicht. Neu: Verlust-Frame, die +440-€-Familie als Blickfang, 19.190 € als Kontrast.
**Daten/Chart/Source bleiben unverändert** (value 19190, series, ZEW-Label). Nur headline + caption tauschen. Hinweis für den Umbau: saw §4 empfiehlt, die große Bildschirm-Zahl auf **+440 €** zu drehen (Verlust-Zahl zuerst) — das ist Chart-Konfiguration, hier nur Copy.

**`headline`** (≤60 Z.):
- **H1** `Wer zahlt drauf — und wer kassiert?` [35 Z / ≤60]  ← saw-Wortlaut §4
- **H2** `Wer zahlt drauf? Nicht die, die kassieren.` [42 Z / ≤60]
- **H3** `+440 € für die Familie. 19.190 € für Topverdiener.` [50 Z / ≤60]

**`caption`** (≤200 Z.):
- **C1** `Eine Familie mit 40.000 € brutto zahlt 440 € extra — im Jahr. Das sind 36 € pro Monat. Eine Familie mit 180.000 € bekommt im selben Jahr 19.190 € zurück. Wer wenig hat, verliert.` [178 Z / ≤200]
- **C2** `Eine Familie mit 40.000 € brutto zahlt künftig 440 € extra. Pro Monat: 36 €, jeden Monat. Eine Familie mit 180.000 € bekommt im selben Jahr 19.190 € zurück. Die Entlastung steigt mit dem Einkommen.` [197 Z / ≤200]
- **C3** `Wer 40.000 € brutto verdient, zahlt 440 € im Jahr drauf — 36 € pro Monat. Wer 180.000 € verdient, bekommt 19.190 € zurück. Die Entlastung steigt mit dem Einkommen.` [163 Z / ≤200]

Alle drei: +440-€-Familie als Blickfang, 36-€-pro-Monat-Übersetzung, 19.190 € als Kontrast. Keine 10-Jahres-Summierung, keine erfundenen Szenarien (saw §4 „Wo wir NICHT übertreiben“).
**Auswahl-Empfehlung:** H1 (saw-Wortlaut) · C2 (Blickfang + Übersetzung + „Entlastung steigt“-Punchline) oder C1 (mit Schlusspointe „Wer wenig hat, verliert“).

---

## 3) 43,6×-Kachel (MASTER 1.4, saw §4.3)

Rechnung: 19.190 € ÷ 440 € = **43,6-fach** (beides ZEW 2025). 2 Zeilen: Kernsatz (≤12 Wörter) + Quellenzeile. Grenzfall dokumentiert: Ist das 80-Z.-Limit für **beide Zeilen zusammen** gemeint, hält nur **K2**; sonst sind alle drei wählbar.

- **K1** `Wer's nicht nötig hat, bekommt das 43-Fache. Wer's nötig hat, zahlt drauf.` [74 Z / 12 W / ≤80] + `Quelle: ZEW Mannheim 2025` [25 Z] → Gesamt 100 Z — nur wählbar, wenn die Quellenzeile NICHT ins 80-Z.-Limit zählt
- **K2** `Wer's nicht nötig hat, bekommt das 43-Fache.` [44 Z / 7 W / ≤80] + `Quelle: ZEW Mannheim 2025` [25 Z] → Gesamt 70 Z ✓ hält auch die strenge Lesart (empfohlen)
- **K3** `Oben kassiert das 43-Fache, unten zahlt drauf.` [46 Z / 7 W / ≤80] + `Quelle: ZEW 2025` [16 Z] → Gesamt 63 Z ✓ strenge Lesart, Alternative mit Gegenüber-Frame

K1/K2 folgen exakt der saw-Formulierung („Wer's nicht nötig hat, bekommt das 43-Fache …“). Die Zahl „43,6“ wird in der Kachel als „43-Fache“ gesprochen — die exakte Rechnung (19.190/440 = 43,6) steht im „Warum?“-Panel/Tooltip, nicht auf der Kachel.

---

## 4) Zähl-Bestand (für den Validator-Check 1.6)

- 6 Breaks × 3 summary-Varianten = 18
- 6 Breaks × 2 next_title-Varianten = 12
- Szene 21: 3 Headline-Varianten + 3 Caption-Varianten = 6
- Kachel: 3 Varianten (Kernsatz + Quellenzeile)
- **Gesamt: 39 Texte**

Neue Felder (`summary`/`next_title` am chapterbreak, neue headline/caption) werden mit Maßnahme 1.6 in `validate-content.mjs` gepflegt, bevor sie in scenes.json landen. Umsetzung der Felder = eigener Schritt (apex), hier nur Copy.
