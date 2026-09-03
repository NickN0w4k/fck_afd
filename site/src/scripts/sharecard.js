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

export async function renderShareCard({ tldr, accent = '#ff4d2e', url, origin }) {
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
  ctx.font = '700 72px "Space Grotesk Variable", "Space Grotesk", system-ui, sans-serif';
  ctx.fillText('DIE AFD.', 84, 120);
  ctx.fillStyle = FG;
  ctx.fillText('DIE FAKTEN.', 84, 200);

  ctx.fillStyle = MUTED;
  ctx.font = '400 30px "Inter Variable", Inter, system-ui, sans-serif';
  ctx.fillText('Sechs Fakten. Jede mit Quelle.', 84, 250);

  // 6 Kernfakten — große Zahl, kurzer Text, viel Luft
  // Format: { num, big, small } — big = Akzent-Zeile, small = Erklärung
  const facts = (window.__fckafd_facts6 ?? []).slice(0, 6);
  let y = 360;
  const rowH = 178;
  facts.forEach((f) => {
    // Große Akzent-Zahl/Keyword
    ctx.fillStyle = accent;
    ctx.font = '700 64px "Space Grotesk Variable", "Space Grotesk", system-ui, sans-serif';
    ctx.fillText(f.big, 84, y);
    // Beschreibung (max 2 Zeilen)
    ctx.fillStyle = FG;
    ctx.font = '500 29px "Inter Variable", Inter, system-ui, sans-serif';
    const lines = wrapText(ctx, f.small, W - 84 * 2).slice(0, 2);
    lines.forEach((line, li) => {
      ctx.fillText(line, 84, y + 82 + li * 38);
    });
    // Trennlinie
    ctx.strokeStyle = 'rgba(245,242,236,0.10)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(84, y + 158);
    ctx.lineTo(W - 84, y + 158);
    ctx.stroke();
    y += rowH;
  });

  // Footer: QR + CTA
  const qrSize = 210;
  const qrY = H - 330;
  const qrCanvas = document.createElement('canvas');
  await QRCode.toCanvas(qrCanvas, url, {
    width: qrSize,
    color: { dark: '#f5f2ec', light: '#00000000' },
    margin: 0,
  });
  ctx.drawImage(qrCanvas, 84, qrY, qrSize, qrSize);

  ctx.fillStyle = FG;
  ctx.font = '700 36px "Space Grotesk Variable", "Space Grotesk", system-ui, sans-serif';
  ctx.fillText('Die ganze Tour:', 84 + qrSize + 40, qrY + 70);
  ctx.fillStyle = accent;
  ctx.font = '700 30px "Space Grotesk Variable", "Space Grotesk", system-ui, sans-serif';
  ctx.fillText(url.replace(/^https?:\/\//, ''), 84 + qrSize + 40, qrY + 118);

  return canvas;
}
