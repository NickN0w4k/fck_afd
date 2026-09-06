# Optik-Upgrade für lange Textstellen — Implementationsplan

> **For Hermes:** Aufgaben seriell abarbeiten; nach jeder Aufgabe verifizieren, committen.

**Ziel:** Die 15 Szenen mit langen Textblöcken (200–690 Zeichen) sollen visuell gegliedert und „scrollbar schön" werden — ohne den Text zu kürzen und ohne den TikTok-Flow zu brechen.

**Ansatz:** Drei neue wiederverwendbare Bausteine — (1) ein **Fact-List-Breaker**, der lange Fließtexte per Trennzeichen (`—`, `.` nach Doppelpunkten) in gestaffelte Mini-Zeilen zerlegt, (2) **Pull-Highlights** (akzentfarbene Merksatz-Zeile), die aus dem Text gefischt werden, (3) typografische Feinschliffe (Zeilenhöhe, Max-Breite, Aufzählungs-Punkte mit Akzent-Border). Alles rein CSS/JS-seitig — `scenes.json` bleibt unangetastet, Quellen-Disziplin bleibt gewahrt.

**Tech:** Astro-Komponenten (bestehende), highlights.js (bestehend), kein neues npm-Paket.

**Identifizierte Problemszenen (aus scenes.json-Scan):**

| Szenen | Typ | Feld | Länge | Problem |
|---|---|---|---|---|
| #16 | reveal | body | 688 | längster Block, monolithische Wand |
| #13 | quiz | explanation | 539 | Erklärung nach Klick = Textwand |
| #12 | slider | explanation | 484 | dito |
| #17 | reveal | body | 485 | dito |
| #05 | reveal | body | 406 | dito |
| #10 | contrast | reality | 372 | Realität-Seite zu dicht |
| #08, #11, #15, #22 | quote | context | 241–382 | Kontext unter Zitat = grauer Klumpen |
| #07, #20 | data | caption | 242–310 | Erklär-Text unter Diagramm |
| #21 | quiz | explanation | 388 | dito |
| #25 | contrast | reality | 217 | dito |

---

## Task 1: `factList()`-Textsplitter als Shared Utility

**Objective:** Eine Funktion, die lange Texte an `—`-Gedankenstrichen in 2–4 Hälften teilt; Teilstrings mit Quelle in Klammern bleiben ganz.

**Files:**
- Create: `site/src/scripts/textsplit.js`

```js
// Teilt lange Texte an Gedankenstrichen in Fact-Hälften.
// Klammern (...) bleiben unangetastet. Gibt Array von Strings zurück.
export function factList(text, maxLen = 180) {
  if (text.length <= maxLen) return [text];
  // an " — " splitten, Klammern ignorieren (zählt Klammern mit)
  const parts = [];
  let depth = 0, buf = '';
  const chunks = text.split(/(?<=[^—])\s—\s/); // grob; Feinschliff unten
  for (const c of chunks) {
    if (buf && (buf + ' — ' + c).length > maxLen) { parts.push(buf); buf = c; }
    else buf = buf ? buf + ' — ' + c : c;
  }
  if (buf) parts.push(buf);
  return parts.slice(0, 4);
}
```

**Verify:** `node -e "import('./site/src/scripts/textsplit.js').then(m => console.log(m.factList('A — B — (Q — X) — C')))"`
→ `['A — B', '(Q — X)', 'C']` o. ä. — Klammern intakt, max. 4 Teile.

## Task 2: Reveal-Bodies als gestaffelte Fact-Liste rendern

**Objective:** Die 3 langen Reveal-Bodies (#05, #16, #17) werden nach dem Aufdecken als Liste mit Akzent-Bullets + Stagger angezeigt statt einem Block.

**Files:**
- Modify: `site/src/components/scenes/RevealIsland.svelte` (Body-Rendering + Styles)

**Steps:**
1. In `RevealIsland.svelte` nach `open = true`: `const items = factList(body, 200)` berechnen (Import aus `../../scripts/textsplit.js`).
2. Template: statt `<p>{@html body}</p>` →
   ```svelte
   <ul class="fact-list">
     {#each items as item, i}
       <li style="--i:{i}" data-open>{@html item}</li>
     {/each}
   </ul>
   ```
3. Styles: `.fact-list li { border-left: 3px solid var(--accent); padding-left: .9rem; margin: .8rem 0; animation: fact-in .5s var(--ease-out) both; animation-delay: calc(var(--i) * 120ms); }` + `@keyframes fact-in { from { opacity: 0; transform: translateX(-8px);} }`
4. `prefers-reduced-motion`: Animation aus.

**Verify:** Build + Screenshot von Szene 16 (Startbahnen): Body erscheint als 3–4 gestaffelte Zeilen mit rotem Balken links. Headless-Check: `document.querySelectorAll('.fact-list li').length >= 3`.

## Task 3: Quote-Kontext als „Einordnung"-Box

**Objective:** Der graue `context`-Klumpen unter den 10 Zitaten wird zur klar gerahmten Einordnung mit Kicker.

**Files:**
- Modify: `site/src/components/scenes/Quote.astro`

**Steps:**
1. Template: `{scene.context && (<div class="quote-context"><p class="context-kicker">Einordnung</p><p class="context-text" data-hl>{scene.context}</p></div>)}`
2. CSS: `.quote-context { margin-top: 1.4rem; border: 1px solid var(--border); border-left: 3px solid var(--accent); border-radius: 12px; padding: 0.9rem 1.1rem; background: var(--bg-elev); }` `.context-kicker { font-family: var(--font-head); font-size: 0.68rem; letter-spacing: 0.18em; text-transform: uppercase; color: var(--accent); margin-bottom: 0.4rem; }` `.context-text { font-size: 0.92rem; color: var(--fg-muted); line-height: 1.55; }`
3. `data-hl` hinzufügen → Auto-Highlighter färbt Zahlen/Zitatbegriffe (bestehendes System, kein neuer Code).

**Verify:** Screenshot Szene 8 (Weidel): Kontext in abgesetzter Karte mit „EINORDNUNG"-Kicker, Highlights sichtbar. Farb-Kollisions-Scan (bestehendes Check-Skript) → 0 Kollisionen.

## Task 4: Data-Captions mit Pull-Number

**Objective:** Die langen captions (#07, #20) sollen ihre Kernzahl visuell herausziehen.

**Files:**
- Modify: `site/src/components/scenes/Data.astro`

**Steps:**
1. Im Frontmatter: erste Zahl mit Einheit aus caption extrahieren:
   ```js
   const m = scene.caption?.match(/(\d[\d.,]*\s?(?:%|€|Mrd\.?|Mio\.?|Millionen)?)/);
   const pullNumber = m ? m[0].trim() : null;
   ```
2. Template über caption: `{pullNumber && scene.caption.length > 220 && (<p class="data-pull">{pullNumber}</p>)}` — nur bei langen Captions, sonst doppelt es mit dem Count-up.
3. CSS: `.data-pull { font-family: var(--font-head); font-size: clamp(1.6rem, 5vw, 2.4rem); font-weight: 700; color: var(--accent); margin: -0.4rem 0 0.6rem; }` und `.data-caption { max-width: 46ch; color: var(--fg-muted); line-height: 1.6; }` (Bestehendes ergänzen).
4. **Achtung:** Bei Szenen mit `value` (Count-up) KEIN Pull rendern (sonst 2× dieselbe Zahl) → Bedingung `!scene.value` in Schritt 2 aufnehmen.

**Verify:** Screenshot Szene 20: „19.190 €" als Akzentzahl über dem grauen Text. Szene 7 (hat value 28) unverändert.

## Task 5: Contrast-Realität mit Listen-Häkchen

**Objective:** Die `reality`-Blöcke (#10, #25) werden, wenn sie `—`/Komma-Listen enthalten, als Häkchen-Liste gerendert.

**Files:**
- Modify: `site/src/components/scenes/Contrast.astro`

**Steps:**
1. Frontmatter: `const realityItems = reality.includes(' — ') ? reality.split(/ — (?![^(]*\))/).slice(0, 4) : null;` (nur wenn Split > 1 Teil).
2. Template: `{#if realityItems}` → `<ul class="reality-list">{#each realityItems as item}<li><svg-check/>{@html item}</li>{/each}</ul>` `{:else}` bestehender Paragraph.
3. CSS: `.reality-list { list-style: none; padding: 0; margin: 0.6rem 0 0; } .reality-list li { display: flex; gap: 0.55rem; align-items: flex-start; margin: 0.55rem 0; font-size: 0.95em; line-height: 1.45; } .reality-list svg { flex-shrink: 0; margin-top: 0.2em; }`
4. Häkchen inline: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path d="M20 6 9 17l-5-5"/></svg>` — Farbe erbt (reality = Kontrastfarbe).
5. WICHTIG: Server-Highlighter (`hl()`) läuft pro Item, nicht auf dem Ganzen → `set:html={hl(item)}`.

**Verify:** Screenshot Szene 10 (Klima): Realität-Seite zeigt 3 gehäkhte Punkte statt Textblock. Mobile: Contrast bleibt viewport-hoch (Höhen-Check wie früher).

## Task 6: Quiz-/Slider-Erklärungen gestaffelt

**Objective:** Die langen explanations (#12, #13, #21) erscheinen nach der Antwort als animierte Mini-Facts statt Block.

**Files:**
- Modify: `site/src/components/scenes/QuizIsland.svelte`
- Modify: `site/src/components/scenes/SliderIsland.svelte`

**Steps:**
1. In beiden: `const items = factList(explanation, 160);`
2. Ersetze `<p class="explanation">{explanation}</p>` durch:
   ```svelte
   <div class="explanation" role="status" aria-live="polite" transition:slide>
     {#each items as item, i}
       <p style="--i:{i}">{@html item}</p>
     {/each}
   </div>
   ```
3. CSS: `.explanation p { margin: 0.45rem 0; padding-left: 0.9rem; border-left: 2px solid var(--accent); animation: fact-in .45s var(--ease-out) both; animation-delay: calc(var(--i) * 140ms); line-height: 1.5; }`
4. Bestehende aria-live-Semantik bleibt auf dem Container.

**Verify:** Headless: Quiz in Szene 13 klicken → `.explanation p` count ≥ 3, Stagger-Styles gesetzt. Screenshot.

## Task 7: Typografie-Feinschliff global

**Objective:** Lesbarkeit langer Passagen auf Mobile generell verbessern.

**Files:**
- Modify: `site/src/styles/global.css`

**Steps (Mobile-Media-Query ergänzen/nutzen):**
1. `p { line-height: 1.6; }` (global, war 1.55)
2. `max-width: 46ch` für `.quote-context, .data-caption, .fact-list li, .explanation p` (Desktop via `@media (min-width: 641px)`, Mobile naturally fits)
3. `.source-tag` bleibt unberührt.

**Verify:** Build grün; Smoke-Test ALL GREEN (`BASE_URL=http://localhost:4173/fck_afd node scripts/smoke.cjs`).

## Task 8: End-to-End-Verifikation + Deploy

**Steps:**
1. `npm run build` in `site/`
2. Smoke: `BASE_URL=http://localhost:4173/fck_afd node scripts/smoke.cjs` → ALL GREEN
3. Screenshot-Runde (mobile 390px) der Szenen 5, 7, 8, 10, 13, 16, 20 — visuelle Prüfung per vision_analyze
4. Farb-Kollisions-Scan für neue Highlights auf Akzent-Flächen (bestehendes Probe-Skript) → 0
6. Commit + Push master; Deploy: `npx gh-pages -d dist --dotfiles` → Live-Check `https://nickn0w4k.github.io/fck_afd/` = 200

---

## Risiken & Entscheidungen

- **Text-Splitting ist heuristisch:** `factList` teilt an `—`; Texte ohne Gedankenstriche bleiben Block (dann greift nur Typo-Feinschliff) — bewusst OK, kein Zwang.
- **Keine content-Änderung:** `scenes.json` wird nicht angetastet → Quellen/Belege bleiben 1:1.
- **Contrast-Viewport:** Häkchen-Listen können die Reality-Seite etwas erhöhen — nach Task 5 Höhen-Check auf Mobile (Ziel ≤ 100svh) durchführen.
- **Aufwand:** ~45–60 Min gesamt; Tasks unabhängig commitbar, jederzeit anhaltbar.