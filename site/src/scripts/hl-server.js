// Serverseitiger Text-Highlighter für Astro-Komponenten (build-time).
// Gleiche Patterns wie highlights.js (client), escaped nur HTML-unsichere Zeichen.
const PATTERNS = [
  /(\d[\d.,]*\s?(?:%|€|Mrd\.?|Mio\.?|Milliarden|Millionen|Billionen|Tsd\.?|Jahre|Jahren|Euro)(?:\s(?:pro|je)\s\w+)?)/g,
  /(Verfassungsschutz|Verdachtsfall|rechtskräftig|gesichert rechtsextremistisch|Rechtsextremismus|Volksverhetzung|SA-Parole|Remigration|Großer Austausch|Umvolkung|Menschenwürde|Grundgesetz|deutscher Staatsangehörigkeit)/gi,
];

function esc(s) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

export function hl(text) {
  let html = esc(text);
  for (const re of PATTERNS) {
    html = html.replace(re, '<mark class="hl">$1</mark>');
  }
  html = html.replace(/<\/mark>\s*<mark class="hl">/g, ' ');
  return html;
}