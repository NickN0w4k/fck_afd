// ShareCard: generiert eine 1080×1920 Story-Karte (PNG) — reißerische
// Fakten-Übersicht im "Alarm"-Look. Kein QR (auf geteilten Bildern unscanbar),
// die URL steht als Text im Footer. Läuft komplett clientseitig im Canvas.

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

// Schriftgröße verkleinern, bis der Text passt
function fitFont(ctx, text, weight, family, startSize, maxWidth) {
  let size = startSize;
  do {
    ctx.font = `${weight} ${size}px ${family}`;
    if (ctx.measureText(text).width <= maxWidth) break;
    size -= 2;
  } while (size > 28);
  return size;
}

const HEAD_FONT = '"Space Grotesk Variable", "Space Grotesk", system-ui, sans-serif';
const BODY_FONT = '"Inter Variable", Inter, system-ui, sans-serif';

// Warnstreifen-Band (diagonal, akzentfarben) — dezenter Alarm-Look
function warningStripes(ctx, y, h) {
  ctx.save();
  ctx.beginPath();
  ctx.rect(0, y, W, h);
  ctx.clip();
  ctx.fillStyle = BG;
  ctx.fillRect(0, y, W, h);
  ctx.strokeStyle = 'rgba(255,77,46,0.55)';
  ctx.lineWidth = 16;
  for (let x = -h; x < W + h; x += 44) {
    ctx.beginPath();
    ctx.moveTo(x, y + h);
    ctx.lineTo(x + h, y);
    ctx.stroke();
  }
  ctx.restore();
}

export async function renderShareCard({ accent = '#ff4d2e', url }) {
  const canvas = document.createElement('canvas');
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('canvas unavailable');

  // Hintergrund + dunkler Glow-Hauch
  ctx.fillStyle = BG;
  ctx.fillRect(0, 0, W, H);
  const g1 = ctx.createRadialGradient(0, 0, 0, 0, 0, W);
  g1.addColorStop(0, `${accent}30`);
  g1.addColorStop(1, 'transparent');
  ctx.fillStyle = g1;
  ctx.fillRect(0, 0, W, H * 0.6);

  // Warnstreifen oben + unten (Rahmen des Alarms)
  warningStripes(ctx, 0, 26);
  warningStripes(ctx, H - 26, 26);

  ctx.textBaseline = 'top';

  // Stempel "BEVOR DU WÄHLST" (leicht rotiert, rahmen)
  ctx.save();
  ctx.translate(W - 300, 96);
  ctx.rotate(-0.07);
  ctx.strokeStyle = accent;
  ctx.lineWidth = 6;
  ctx.strokeRect(0, 0, 236, 74);
  ctx.fillStyle = accent;
  ctx.font = `700 30px ${HEAD_FONT}`;
  ctx.textAlign = 'center';
  ctx.fillText('BEVOR DU', 118, 16);
  ctx.fillText('WÄHLST', 118, 44);
  ctx.restore();
  ctx.textAlign = 'left';

  // Headline
  ctx.fillStyle = FG;
  ctx.font = `700 110px ${HEAD_FONT}`;
  ctx.fillText('DIE AFD.', 84, 84);
  ctx.fillStyle = accent;
  ctx.font = `700 96px ${HEAD_FONT}`;
  ctx.fillText('DIE FAKTEN.', 84, 196);

  ctx.fillStyle = MUTED;
  ctx.font = `500 32px ${BODY_FONT}`;
  ctx.fillText('Sechs Fakten. Jede mit Quelle. Alles prüfbar.', 84, 330);

  // 6 Kernfakten: RIESIGE Zahl + Uppercase-Label + punchy Zeile
  const facts = (window.__fckafd_facts6 ?? []).slice(0, 6);
  let y = 425;
  const rowH = 190;
  facts.forEach((f) => {
    // Riesige Zahl (auto-fit)
    const size = fitFont(ctx, f.big, '700', HEAD_FONT, 84, W - 168);
    ctx.fillStyle = accent;
    ctx.font = `700 ${size}px ${HEAD_FONT}`;
    ctx.fillText(f.big, 84, y);

    // Uppercase-Label
    const labelY = y + size + 12;
    ctx.fillStyle = FG;
    ctx.font = `700 32px ${HEAD_FONT}`;
    ctx.fillText(f.label.toUpperCase(), 84, labelY);

    // Punchline (1 Zeile, kurz gehalten in facts6)
    ctx.fillStyle = MUTED;
    ctx.font = `500 28px ${BODY_FONT}`;
    ctx.fillText(f.small, 84, labelY + 46);

    y += rowH;
    if (f !== facts[facts.length - 1]) {
      ctx.strokeStyle = 'rgba(245,242,236,0.12)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(84, y + 2);
      ctx.lineTo(W - 84, y + 2);
      ctx.stroke();
      y += 34;
    }
  });

  // Footer: Akzent-Balken mit URL — rechts die Quellen-Anzahl
  const barY = 1760;
  const barH = 100;
  ctx.fillStyle = accent;
  ctx.fillRect(84, barY, W - 168, barH);
  ctx.fillStyle = '#0a0a0a';
  ctx.font = `700 24px ${HEAD_FONT}`;
  ctx.fillText('DIE GANZE TOUR:', 124, barY + 16);
  const urlSize = fitFont(ctx, url.replace(/^https?:\/\//, ''), '700', HEAD_FONT, 40, W - 168 - 300);
  ctx.font = `700 ${urlSize}px ${HEAD_FONT}`;
  ctx.fillText(url.replace(/^https?:\/\//, ''), 124, barY + 58);
  ctx.font = `700 30px ${HEAD_FONT}`;
  ctx.textAlign = 'right';
  ctx.fillText('44 QUELLEN', W - 124, barY + 56);
  ctx.textAlign = 'left';

  return canvas;
}