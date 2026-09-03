// ShareCard: generiert eine 1080×1920 Story-Karte (PNG) mit den Kernfakten
// + QR-Code zur Site. Läuft komplett clientseitig im Canvas.
// Quellenlabel stammen aus der Summary-Szene (content/scenes.json).

import QRCode from 'qrcode';

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

// Zahlen/Begriffe als Akzent-Markierungen erkennen (gleiche Logik wie der Auto-Highlighter)
function highlight(ctx, line, x, y, accent) {
  const PAT = /(\d[\d.,]*\s?(?:%|€|Mrd\.?|Mio\.?|Milliarden|Millionen)?(?:\s(?:pro|je)\s\w+)?)/g;
  const parts = line.split(PAT);
  let cursor = x;
  for (const part of parts) {
    if (!part) continue;
    const isNum = PAT.test(part) && /\d/.test(part);
    PAT.lastIndex = 0;
    ctx.fillStyle = isNum ? accent : FG;
    ctx.fillText(part, cursor, y);
    cursor += ctx.measureText(part).width;
  }
}

export async function renderShareCard({ tldr, closing, accent = '#ff4d2e', url, origin }) {
  const canvas = document.createElement('canvas');
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('canvas unavailable');

  // Hintergrund
  ctx.fillStyle = BG;
  ctx.fillRect(0, 0, W, H);

  // Glow-Hauch oben links + unten rechts (wie die Site)
  const g1 = ctx.createRadialGradient(0, H * 0.1, 0, 0, H * 0.1, W * 0.9);
  g1.addColorStop(0, `${accent}30`);
  g1.addColorStop(1, 'transparent');
  ctx.fillStyle = g1;
  ctx.fillRect(0, 0, W, H * 0.5);
  const g2 = ctx.createRadialGradient(W, H * 0.92, 0, W, H * 0.92, W * 0.9);
  g2.addColorStop(0, '#4de0ff26');
  g2.addColorStop(1, 'transparent');
  ctx.fillStyle = g2;
  ctx.fillRect(0, H * 0.5, W, H * 0.5);

  // Headline
  ctx.textBaseline = 'top';
  ctx.fillStyle = accent;
  ctx.font = '700 54px "Space Grotesk Variable", "Space Grotesk", system-ui, sans-serif';
  ctx.fillText('DIE AFD. DIE FAKTEN.', 72, 130);

  ctx.fillStyle = MUTED;
  ctx.font = '400 30px "Inter Variable", Inter, system-ui, sans-serif';
  ctx.fillText('Jede Zeile mit Quelle. Alles prüfbar.', 72, 185);

  // Fakten-Karten
  let y = 300;
  const maxCards = Math.min(tldr.length, 10);
  const slotH = 1050 / maxCards;
  tldr.forEach((point, i) => {
    const num = point.num ?? String(i + 1).padStart(2, '0');
    const text = point.text ?? point;
    // Karten-Hintergrund
    const cardY = y;
    // Höhe dynamisch nach Text
    ctx.font = '600 31px "Space Grotesk Variable", "Space Grotesk", system-ui, sans-serif';
    const lines = wrapText(ctx, text, W - 72 * 2 - 110);
    const cardH = Math.max(74, lines.length * 42 + 40);
    // Badge
    ctx.fillStyle = '#141311';
    roundRect(ctx, 72, cardY, W - 144, cardH, 16);
    ctx.fill();
    ctx.strokeStyle = 'rgba(245,242,236,0.14)';
    ctx.lineWidth = 2;
    ctx.stroke();
    // Nummer
    ctx.fillStyle = accent;
    ctx.font = '700 26px "Space Grotesk Variable", "Space Grotesk", system-ui, sans-serif';
    ctx.fillText(num, 96, cardY + 46);
    // Text (mit Zahlen-Highlights)
    ctx.font = '600 31px "Space Grotesk Variable", "Space Grotesk", system-ui, sans-serif';
    lines.slice(0, 3).forEach((line, li) => {
      highlight(ctx, line, 72 + 96, cardY + 44 + li * 42 + (li === 0 ? 6 : 0), accent);
    });
    y += cardH + 18;
  });

  // QR-Code
  const qrCanvas = document.createElement('canvas');
  await QRCode.toCanvas(qrCanvas, url, {
    width: 300,
    color: { dark: FG, light: '#00000000' },
    margin: 0,
  });
  const qrY = H - 400;
  ctx.drawImage(qrCanvas, 72, qrY, 240, 240);

  // CTA-Text neben QR
  ctx.fillStyle = FG;
  ctx.font = '700 34px "Space Grotesk Variable", "Space Grotesk", system-ui, sans-serif';
  ctx.fillText('Die ganze Tour:', 360, qrY + 92);
  ctx.fillStyle = accent;
  ctx.font = '700 30px "Space Grotesk Variable", "Space Grotesk", system-ui, sans-serif';
  ctx.fillText(url.replace(/^https?:\/\//, ''), 360, qrY + 140);
  ctx.fillStyle = MUTED;
  ctx.font = '400 24px "Inter Variable", Inter, system-ui, sans-serif';
  ctx.fillText('Scan oder tippen — jede Zahl mit Quelle.', 360, qrY + 190);

  return canvas;
}

function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}