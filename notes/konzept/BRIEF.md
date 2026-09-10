# BRIEF: Konzept v2.0 — info-afd.de Engagement-Relaunch

**Für:** Team-Agents (nova=Konzept, saw=Zielgruppen/Psychologie, apex=Tech/Visuales, nexus=Recherche)
**Auftraggeber:** Nick · **Koordinator:** Hermes-Orchestrator (Nick duzt alle, Ton locker)

## Projekt
Anti-AfD-Faktensite **info-afd.de** — TikTok-Stil-Scrolltour (Astro 7 + Svelte 5 + GSAP, Mobile first).
34 Szenen in 6 Kapiteln (content/scenes.json + content/chapters.json). 14 Szenen-Typen vorhanden:
hero, statement, data, quiz, quote, reveal, contrast, slider, timeline, action, summary, endcard, sources, chapterbreak.
Live: https://info-afd.de/ · Repo: /root/fck_afd · Arbeits-Branch: v1.5 · Release-Branch: master.
Regeln: nur seriöse Quellen (Behörden/Gerichte/Institute/etablierte Medien), jede Behauptung mit
Primärquelle (Feld source: label/url/visited), Volltexte via tools/archive_source.py archivieren
(läuft mit /root/heavy_block/.venv/bin/python). Validator: cd site && npm run validate.
Tonalität: kurz, direkt, einfach — für die zu überzeugende Zielgruppe, nicht für Eingeweihte.

## Nicks Feedback (Auslöser)
- **Zu viel Text.** Leute lesen nicht komplett durch — Absprungrisiko.
- Mehr **Grafiken/Visuales** statt Textwänden.
- Ziel: Leute **dranbleiben** lassen, Seite wirkt **interessant**.
- Mehr **krasse, sehr aktuelle Beispiele** sollen später rein (wird separat recherchiert).

## Eure Aufgaben (je Agent ein Output-File, Deutsch, Markdown, konkret & umsetzbar)

### nova → /root/fck_afd/notes/konzept/nova_struktur.md
Grundkonzept: Erzähl- und Szenenarchitektur für maximale Bindung.
Kapitel-Dramaturgie (Hook → Eskalation → persönliches "Was heißt das für dich" → Handlung),
Szenenrhythmus (wie oft interaktive vs. passive Elemente), Scan-First-Prinzip (Textkürzen,
Blickfang-Priorität), Micro-Hooks zwischen Szenen, Deep-Link-/Teil-Szenen-Strategie,
Vorschlag: welche 3–5 Szenen-Typen dominieren künftig und welche sterben.

### saw → /root/fck_afd/notes/konzept/saw_psychologie.md
Zielgruppe & Psychologie: Wer abspringt, warum, und was hält.
Kognitive Last (Chunks, Progress-Metaphern wie "Szene 7/34"), Selbstwirksamkeit statt
Überforderung, Emotionskurve (Wut/Fakten/Befähigung im Wechsel), Share-Psychologie
(was lässt Leute posten), Social-Proof-Formate, Verlust-Aversion ("das kostet DICH"),
Trust-Builder (Quellen sichtbar statt Belehrung). Konkrete UI-Psychologie-Muster mit
Bezug auf die vorhandenen Szenen-Typen.

### apex → /root/fck_afd/notes/konzept/apex_visual_tech.md
Visualisierung & Tech-Konzept. Behandle:
- Daten-Storytelling: Balken/Counter/Animated-Charts für Zahlen (28.000 Rechtsextremisten,
  690 Mrd. € Dexit, +440 € Familienbelastung, 44,0% Sachsen-Anhalt) — welche Charts in welchem Szenen-Typ.
- Bild-/Icon-System: Karten-Stile, Kollagen, Zitat-Tiles, "Fakten-Kacheln", Foto-Politik.
- Scroll-Story-Techniken (GSAP): pinned Scenes, scrubbed Counters, Kamerafahrten.
- Performance-Budget Mobile (LCP, Animation-Budget, prefers-reduced-motion, keine Textwände).
- Konkreter Umbauplan: Bestands-Szenen-Typen → neue/umgebaute Komponenten (Aufwand je Stufe).

### nexus → /root/fck_afd/notes/konzept/nexus_beispiele_recherche.md
Recherche: krasse, SEHR AKTUELLE Beispiele (Fokus Sept. 2026, gern zurück bis Sommer 2026).
Kandidaten-Felder: AfD-Spitzenpersonen (Höcke, Gauland, Weidel, Krahs-Mitarbeiter/China-Spionage),
Landesverbände (5× gesichert rechtsextremistisch), Sachsen-Anhalt-Regierungsarbeit nach der Wahl
(AfD 44,0%), Dexit-Kosten (IW Köln 690 Mrd. €), Steuerpläne (+440 € für Normalfamilie,
19.190 € für Topverdiener), neue Vorfälle/Skandale/Aussagen seit August 2026.
Für JEDES Beispiel: [Datum] [Aussage/Fakt wörtlich oder präzise Zahl] [Primärquelle mit URL]
[wo es auf die Site passt: Kapitel + Szenen-Typ] [Archiv-Status: archiviert/open].
ARCHIVIERE jede verwendete Primärquelle sofort: cd /root/fck_afd && /root/heavy_block/.venv/bin/python
tools/archive_source.py <url> — dann Status "archiviert" setzen. Keine Blog-/Meinungsquellen.

## Regeln für ALLE
- Schreibstil der Outputs: knapp, präzise, keine Füllwörter, direkt umsetzbar.
- Kein Deploy, keine Code-Änderungen an der Site selbst — nur Konzepte + Recherche.
- Nick-Freundlich: konkrete Vorschläge statt theoretischer Abhandlungen.
- Wenn ihr Fakten nennt: sofort belegen (Quelle + Datum), keine "gefühlten" Zahlen.
- Bezieht euch auf die BESTEHENDE Site (34 Szenen, 6 Kapitel) — kein Neuerfindungs-Wishlist,
  sondern Umbau/Erweiterung des Vorhandenen.