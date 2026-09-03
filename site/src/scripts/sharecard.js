// ShareCard: generiert eine 1080×1920 Story-Karte (PNG) mit 6 Kernfakten.
// Kein QR (auf einem geteilten Bild unscanbar) — stattdessen mehr Raum für die
// Fakten und die URL als Footer-Zeile. Läuft komplett clientseitig im Canvas.

const W = 1080;
const H = 1920;
const BG = '#0a0a0a';
const FG = '#f5f2ec';
const MUTED = '#9b968c';

function wrapText(ctx, text, maxWidth) {
  const words = text.split(' ');
  const lines = [];
  let line = '';
  for (const w of words) {
    const test = line ? `${line} ${w}` : w;
    if (ctx.measureText(test).width > maxWidth && line) {
      lines.push(line);
      line = w;
    } else {
      line = test;
    }
  }
  if (line) lines.push(line);
  return lines;
}

export async function renderShareCard({ accent = '#ff4d2e', url }) {
  const canvas = document.createElement('canvas');
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('canvas unavailable');

  // Hintergrund
  ctx.fillStyle = BG;
  ctx.fillRect(0, 0, W, H);

  // Glow-Hauch (wie die Site, dezent)
  const g1 = ctx.createRadialGradient(0, H * 0.06, 0, 0, H * 0.06, W * 0.95);
  g1.addColorStop(0, `${accent}26`);
  g1.addColorStop(1, 'transparent');
  ctx.fillStyle = g1;
  ctx.fillRect(0, 0, W, H * 0.55);

  // Headline
  ctx.textBaseline = 'top';
  ctx.fillStyle = accent;
  ctx.font = '700 76px "Space Grotesk Variable", "Space Grotesk", system-ui, sans-serif';
  ctx.fillText('DIE AFD.', 84, 120);
  ctx.fillStyle = FG;
  ctx.fillText('DIE FAKTEN.', 84, 205);

  ctx.fillStyle = MUTED;
  ctx.font = '400 30px "Inter Variable", Inter, system-ui, sans-serif';
  ctx.fillText('Sechs Fakten. Jede mit Quelle.', 84, 305);

  // 6 Kernfakten — große Zahl, kurzer Text, jetzt mehr Raum pro Zeile
  const facts = (window.__fckafd_facts6 ?? []).slice(0, 6);
  let y = 375;
  const rowH = 195;
  facts.forEach((f) => {
    // Große Akzent-Zahl/Keyword
    ctx.fillStyle = accent;
    ctx.font = '700 72px "Space Grotesk Variable", "Space Grotesk", system-ui, sans-serif';
    ctx.fillText(f.big, 84, y);
    // Beschreibung (max 2 Zeilen)
    ctx.fillStyle = FG;
    ctx.font = '500 30px "Inter Variable", Inter, system-ui, sans-serif';
    const lines = wrapText(ctx, f.small, W - 84 * 2).slice(0, 2);
    lines.forEach((line, li) => {
      ctx.fillText(line, 84, y + 92 + li * 40);
    });
    // Trennlinie
    ctx.strokeStyle = 'rgba(245,242,236,0.10)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(84, y + 172);
    ctx.lineTo(W - 84, y + 172);
    ctx.stroke();
    y += rowH;
  });

  // Footer: URL als Text (auf einem geteilten Bild der sinnvollste Verweis)
  ctx.fillStyle = MUTED;
  ctx.font = '500 28px "Inter Variable", Inter, system-ui, sans-serif';
  ctx.fillText('Die ganze Tour mit allen Quellen:', 84, H - 170);
  ctx.fillStyle = accent;
  ctx.font = '700 34px "Space Grotesk Variable", "Space Grotesk", system-ui, sans-serif';
  ctx.fillText(url.replace(/^https?:\/\//, ''), 84, H - 115);

  return canvas;
}