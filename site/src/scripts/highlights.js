// Text-Highlighter: hebt Zahlen und Schlüsselbegriffe mit Akzentfarbe hervor.
// Läuft über alle [data-hl] Elemente; escaped nur HTML-unsichere Zeichen, Text stammt aus scenes.json.
const PATTERNS = [
  // Zahlen mit Einheiten/Währung/Prozent: 19.190 €, 690 Mrd. €, 6,2 %, 2021, 2,5 Millionen
  // Fix 13.09.: "Jahren" vor "Jahre" (sonst blieb das n außerhalb der Markierung: „Jahre n")
  /(\d[\d.,]*\s?(?:%|€|Mrd\.?|Mio\.?|Milliarden|Millionen|Billionen|Tsd\.?|Jahren|Jahre|Euro)(?:\s(?:pro|je)\s\w+)?)/g,
  // Rechtliche/ideologische Kernbegriffe — Fix 13.09. (apex): Duplikat „Volksverhetzung“
  // raus + mit hl-server.js synchron („deutscher Staatsangehörigkeit“ ergänzt)
  /(Verfassungsschutz|Verdachtsfall|rechtskräftig|gesichert rechtsextremistisch|Rechtsextremismus|Volksverhetzung|SA-Parole|Remigration|Großer Austausch|Umvolkung|Menschenwürde|Grundgesetz|deutscher Staatsangehörigkeit)/gi,
];

function esc(s) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

export function initHighlights() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    return; // keine Animation, aber Markierung passiert trotzdem unten statisch? Nein: bewusst ohne
  }
  document.querySelectorAll('[data-hl]').forEach((el) => {
    if (el.dataset.hlDone) return;
    let html = esc(el.textContent.trim());
    for (const re of PATTERNS) {
      html = html.replace(re, '<mark class="hl">$1</mark>');
    }
    // Doppel-Markierungen durch überlappende Patterns auflösen
    html = html.replace(/<\/mark>\s*<mark class="hl">/g, ' ');
    el.innerHTML = html;
    el.dataset.hlDone = '1';
  });
}