// Teilt lange Texte an Gedankenstrichen in Fact-Hälften.
// Klammern (...) bleiben unangetastet. Gibt Array von Strings zurück.
export function factList(text, maxLen = 180) {
  if (!text || text.length <= maxLen) return [text];
  // an " — " splitten (Klammern werden einfach als Teil des Texts behandelt)
  const parts = [];
  let buf = '';
  const chunks = text.split(/(?<=[^—])\s+—\s+/);
  for (const c of chunks) {
    if (buf && (buf + ' — ' + c).length > maxLen) { parts.push(buf); buf = c; }
    else buf = buf ? buf + ' — ' + c : c;
  }
  if (buf) parts.push(buf);
  return parts.slice(0, 4);
}