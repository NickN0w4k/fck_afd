# Update-Pfad — Inhalte pflegen

Wie Zahlen, Szenen und Quellen dieser Site aktualisiert werden. Gilt für alle, die nach der Wahl oder nach neuen Verfassungsschutzberichten hier anpacken.

## Wo liegt was?

| Inhalt | Datei |
|---|---|
| Kapitel (Titel, Nummern, Akzentfarben) | `content/chapters.json` |
| Alle Szenen (Text, Quiz, Quellen) | `content/scenes.json` |
| Recherche-Notizen mit Belegstellen | `notes/10_fakten_recherche.md` |
| Quellen-Volltexte (Archiv) | `sources/pages/` + `sources/sources_log.md` |
| Stand-Datum + Share-Texte | `site/src/lib/meta.js` |
| og:image Vorlage | `site/og-image/template.html` |

## Standard-Ablauf eines Updates

1. **Quelle archivieren** (bevor sie zitiert wird):
   ```bash
   cd /root/fck_afd && tools/archive_source.py <url>
   ```
   Das legt Volltext + SHA256 in `sources/pages/` ab und loggt in `sources/sources_log.md`. DIW blockt curl → Wayback-Snapshot nehmen (siehe Log-Einträge `WEBSEITE-WAYBACK`).

2. **Szene ändern/ergänzen** in `content/scenes.json`:
   - Feld `source` braucht immer `label`, `url`, `visited` (Datum). Die URL muss im Archiv liegen.
   - Szenen-Typen: `hero, statement, data, quiz, quote, reveal, contrast, slider, timeline, action, summary, endcard, sources, chapterbreak`.
   - Jede Behauptung → eine Quelle. Meta-Statements (Framing ohne Fakten) dürfen bewusst ohne Quelle sein — Validator warnt dann nur.

3. **Validator + Build**:
   ```bash
   cd site && npm run validate && npm run build
   ```
   Der Validator bricht bei harten Fehlern ab (Quelle ohne URL/Label, Timeline-Karte ohne Datum etc.).

4. **Stand-Datum bumpen** in `site/src/lib/meta.js` (`SITE_STAND`) — erscheint automatisch im Badge, in Unterseiten-Footern und (bei Bedarf) im og:image.

5. **og:image nur neu rendern, wenn sich die Fakten dort ändern**:
   ```bash
   cd site && node scripts/og-image.mjs   # braucht chromium-1234 in ~/.cache/ms-playwright
   ```

6. **Commit + Push** (Commits als Nick):
   ```bash
   git add -A && git commit -m "Update: <was>" && git push
   ```

## Spezialfälle

- **Impressum:** Seite + Datenmodell wurden in `8d87faf` (07.09.2026) zurückgenommen — „vorerst kein Impressum" (Nick). Vorher: Platzhalter-`impressum.js` wäre mit „VORNAME NACHNAME" live gegangen. Falls es später wiederkommt: Anbieterkennzeichnung braucht Name + ladungsfähige Anschrift ODER eine c/o-Adresse (§ 5 DDG, § 18 Abs. 2 MStV); echte Adressdaten erst eintragen, wenn der Betreiber entschieden hat (Doxxing-Abwägung bei einer Anti-AfD-Site).

- **Neues Kapitel**: in `chapters.json` ergänzen (id, num, title, accent, question) → Unterseite `/[id]/` entsteht automatisch, Sitemap via `npm run build` mitbauen (paths in `site/src/pages/sitemap.xml.ts` manuell ergänzen!). Szenen mit `"chapter": "<id>"` in scenes.json anlegen.
- **Deploy-Domain ändern**: EINMAL in `site/astro.config.mjs` (`site:`) — canonical, og:image-URL und sitemap ziehen automatisch mit. Danach im og-Template (`site/og-image/template.html`) die URL-Zeile anpassen und og neu rendern. Domain seit 06.09.2026: **info-afd.de** (eigene Domain, Pages serviert vom Branch-Root → `base: '/'`, KEIN `/fck_afd/`-Präfix mehr). Die `CNAME` liegt in `site/public/` und muss bei jedem Deploy mit im dist landen — fehlt sie, verliert die Domain ihre Verknüpfung. **Rollback-Anker-Buchhaltung:** Jeder Deploy verschiebt `origin/gh-pages` — vor jedem Deploy den aktuellen Stand notieren, DAS ist der Rollback-Ziel-Wert. (Buchung: v1.5 = `8b9f1ab`, Live-v1.6-Deploy = `d0d02da`, Hero-Pin-Fix 13.09. = `a09d84b` — jeweils Vorstand notieren, nicht den eigenen Deploy!)
- **Deploy auf gh-pages ist KEIN naiver Build+Replace** — der Branch-Root enthält Dinge, die ein frischer `dist/` nicht hat: `preview/` (Vorschau-Deploy **mit eigener `preview/CNAME`**), `.nojekyll` und Reste (`.hermes/`, `site/`). Ablauf: Dist bauen → `preview/` + `.nojekyll` + CNAME in den neuen Stand kopieren (CNAME liegt in `site/public/`, kommt normalerweise mit) → Reste (`.hermes/`, `site/`) bei der Gelegenheit entsorgen. Nach dem Deploy: Root-CNAME + `preview/CNAME` prüfen, sonst verlieren info-afd.de UND die Preview ihre Domain-Verknüpfung.
- **Quiz ergänzen**: `options` (mindestens eine `correct: true`), `explanation`, `source`. Die Insel zeigt Erklärung erst nach dem Klick (aria-live ist gesetzt).
- **Timeline ergänzen**: `items` mit `date, title, text, source`. Reihenfolge = Kartenreihenfolge.

## Was NICHT geändert werden darf

- Archivierte Quellen nachträglich „schönen" — Archiv ist historisch, neue Erkenntnis → neue Quelle.
- Direktzitate ohne Volltext-Beleg im Archiv (Nick-Regel: unseriös belegte Zitate raus).
- Scene-IDs (`#scene-N`) sind Positions-Anker aus dem Build — Szenen mitten drin einfügen verschiebt sie; wer einen stabilen Link auf eine bestimmte Szene teilen will, nimmt die Kapitel-URL.