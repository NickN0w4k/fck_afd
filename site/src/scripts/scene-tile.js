// Fakten-Kachel-Renderer (Welle 3, Stufe A — 3.4): rendert eine Szene als
// teilbare PNG-Kachel (9:16 → 1080×1920 + 1:1 → 1080×1080). Canvas-Rendering
// wie sharecard.js: gleiche Farben, gleiche Fonts, gleiche Look-Sprache.
// Inhalt via lib/scene-tile.js (große Zahl/Zitat + Label + Quellen-Label),
// Footer „PRÜF ES SELBST → INFO-AFD.DE“ + Szenen-Deep-Link.

import { sceneTileContent } from '../lib/scene-tile.js';

const BG = '#0a0a0a';
const FG = '#f5f2ec';
const MUTED = '#9b968c';
const HEAD_FONT = '"Space Grotesk Variable", "Space Grotesk", system-ui, sans-serif';
const BODY_FONT = '"Inter Variable", Inter, system-ui, sans-serif';

function wrapText(ctx, text, maxWidth) {
  const words = String(text ?? '').split(' ');
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

// Schriftgröße verkleinern, bis der Text passt (Muster aus sharecard.js fitFont)
function fitFont(ctx, text, weight, family, startSize, maxWidth) {
  let size = startSize;
  do {
    ctx.font = `${weight} ${size}px ${family}`;
    if (ctx.measureText(text).width <= maxWidth) break;
    size -= 2;
  } while (size > 24);
  return size;
}

function fitLines(ctx, lines, weight, family, startSize, maxWidth, minSize = 22) {
  let size = startSize;
  while (size > minSize) {
    ctx.font = `${weight} ${size}px ${family}`;
    if (lines.every((l) => ctx.measureText(l).width <= maxWidth)) break;
    size -= 2;
  }
  return size;
}

// Warnstreifen-Band (diagonal, akzentfarben) — wie sharecard.js
function warningStripes(ctx, y, h, w) {
  ctx.save();
  ctx.beginPath();
  ctx.rect(0, y, w, h);
  ctx.clip();
  ctx.fillStyle = BG;
  ctx.fillRect(0, y, w, h);
  ctx.strokeStyle = 'rgba(255,77,46,0.55)';
  ctx.lineWidth = 16;
  for (let x = -h; x < w + h; x += 44) {
    ctx.beginPath();
    ctx.moveTo(x, y + h);
    ctx.lineTo(x + h, y);
    ctx.stroke();
  }
  ctx.restore();
}

/**
 * Zeichnet die Kachel für eine Szene. Layout zuerst trocken vermessen
 * (big verkleinert sich, bis alles über dem Footer passt), dann einmal zeichnen.
 * @param {any} scene Szenen-Objekt aus content/scenes.json
 * @param {{ accent?: string, deepLink?: string, siteUrl?: string, w: number, h: number }} opts
 * @returns {HTMLCanvasElement}
 */
export function renderSceneTile(scene, { accent = '#ff4d2e', deepLink = '', siteUrl = 'info-afd.de', w, h }) {
  const { big, label, source } = sceneTileContent(scene);
  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('canvas unavailable');

  const M = Math.round(w * 0.078); // Seiten-Margin (~84px bei 1080)
  const maxW = w - M * 2;

  // Hintergrund + Akzent-Glow
  ctx.fillStyle = BG;
  ctx.fillRect(0, 0, w, h);
  const g1 = ctx.createRadialGradient(0, 0, 0, 0, 0, w);
  g1.addColorStop(0, `${accent}30`);
  g1.addColorStop(1, 'transparent');
  ctx.fillStyle = g1;
  ctx.fillRect(0, 0, w, h * 0.55);

  // Warnstreifen oben + unten
  const stripe = Math.max(20, Math.round(h * 0.014));
  warningStripes(ctx, 0, stripe, w);
  warningStripes(ctx, h - stripe, stripe, w);

  ctx.textBaseline = 'top';
  ctx.textAlign = 'left';

  // --- Maße ---
  const kickY = Math.round(h * 0.075);
  const kickSize = Math.round(w * 0.03);
  const bigTop = kickY + Math.round(w * 0.075);
  const footH = Math.round(w * 0.085);
  const footY = h - stripe - Math.round(w * 0.075) - footH;
  const limitY = footY - Math.round(h * 0.02); // Inhalt darf bis hier laufen

  // Footer: „PRÜF ES SELBST →“ + Deep-Link auf Akzent-Balken
  ctx.fillStyle = accent;
  ctx.fillRect(M, footY, maxW, footH);
  ctx.fillStyle = BG;
  const footFS = Math.round(w * 0.027);
  ctx.font = `700 ${footFS}px ${HEAD_FONT}`;
  ctx.fillText('PRÜF ES SELBST →', M + Math.round(w * 0.037), footY + Math.round(footH * 0.16));
  const dl = String(deepLink || siteUrl).replace(/^https?:\/\//, '');
  const dlSize = fitFont(ctx, dl, '700', HEAD_FONT, Math.round(w * 0.036), maxW - Math.round(w * 0.074));
  ctx.font = `700 ${dlSize}px ${HEAD_FONT}`;
  ctx.fillText(dl, M + Math.round(w * 0.037), footY + footH - Math.round(footH * 0.48) - Math.round(dlSize * 0.12));

  // --- Trockenlayout: big so groß wie möglich, Label + Quelle müssen unter ihn passen ---
  const labelLines = label ? wrapText(ctx, label, maxW).slice(0, 4) : [];
  const srcText = source ? `Quelle: ${source}` : '';
  const srcLines = srcText ? wrapText(ctx, srcText, maxW - Math.round(w * 0.06)).slice(0, 3) : [];

  // 9:16 hat viel Luft → große Zahl darf groß starten; 1:1 moderater. Zeilen-Caps hoch,
  // damit lange Zitate nicht abgeschnitten werden; breitestes Wort muss immer passen.
  const tall = h > w * 1.4;
  const bigStartSize = Math.round(w * (tall ? 0.165 : 0.12));
  const bigMin = Math.round(w * (tall ? 0.05 : 0.045));
  const maxBigLines = tall ? 10 : 6;

  let bigSize = bigStartSize;
  let bigLines = [];
  let bigLH = 0;
  let labelSize = 0;
  let labelLH = 0;
  let srcSize = 0;
  let srcLH = 0;
  let contentH = 0;
  let truncated = false;

  for (;;) {
    ctx.font = `700 ${bigSize}px ${HEAD_FONT}`;
    const fullWrap = wrapText(ctx, big, maxW);
    truncated = fullWrap.length > maxBigLines;
    bigLines = fullWrap.slice(0, maxBigLines);
    if (truncated && !/[.!?…]$/.test(bigLines[maxBigLines - 1])) bigLines[maxBigLines - 1] += ' …';
    bigLH = Math.round(bigSize * 1.1);

    // Horizontal-Fit: das breiteste Einzelwort muss in maxW passen (Wrap kann lange Wörter nicht brechen)
    let widest = 0;
    for (const l of bigLines) for (const word of l.split(' ')) widest = Math.max(widest, ctx.measureText(word).width);

    labelSize = labelLines.length ? fitLines(ctx, labelLines, '500', BODY_FONT, Math.round(w * 0.042), maxW, Math.round(w * 0.024)) : 0;
    labelLH = Math.round(labelSize * 1.4);
    srcSize = srcLines.length ? fitLines(ctx, srcLines, '500', BODY_FONT, Math.round(w * 0.032), maxW - Math.round(w * 0.06), Math.round(w * 0.022)) : 0;
    srcLH = Math.round(srcSize * 1.35);

    contentH =
      bigLines.length * bigLH +
      (labelLines.length ? Math.round(h * 0.03) + labelLines.length * labelLH : 0) +
      (srcLines.length ? Math.round(h * 0.02) + srcLH * (srcLines.length - 1) + srcSize : 0);

    if ((widest <= maxW && bigTop + contentH <= limitY) || bigSize <= bigMin) break;
    bigSize -= 2;
  }

  // Vertikal zentrieren (Rest-Luft oben/unten im Verhältnis 1:2 → optisch leicht erhöht)
  const startY = bigTop + Math.max(0, Math.round((limitY - bigTop - contentH) * 0.36));

  // --- Zeichnen ---
  ctx.fillStyle = MUTED;
  ctx.font = `500 ${kickSize}px ${BODY_FONT}`;
  const num = scene.__num !== undefined ? `${String(scene.__num).padStart(2, '0')} / ` : '';
  ctx.fillText(`${num}FAKTEN-KACHEL`, M, kickY);

  let y = startY;
  ctx.fillStyle = accent;
  ctx.font = `700 ${bigSize}px ${HEAD_FONT}`;
  bigLines.forEach((l) => {
    ctx.fillText(l, M, y);
    y += bigLH;
  });

  if (labelLines.length) {
    y += Math.round(h * 0.03);
    ctx.fillStyle = FG;
    ctx.font = `500 ${labelSize}px ${BODY_FONT}`;
    labelLines.forEach((l) => {
      ctx.fillText(l, M, y);
      y += labelLH;
    });
  }

  if (srcLines.length) {
    y += Math.round(h * 0.02);
    const srcSizeDraw = srcSize;
    ctx.fillStyle = accent;
    ctx.fillRect(M, y + Math.round(srcSizeDraw * 0.25), Math.round(w * 0.035), Math.max(2, Math.round(w * 0.004)));
    ctx.fillStyle = MUTED;
    ctx.font = `500 ${srcSizeDraw}px ${BODY_FONT}`;
    srcLines.forEach((l, li) => {
      ctx.fillText(l, M + Math.round(w * 0.055), y + li * Math.round(srcSizeDraw * 1.35));
    });
  }

  return canvas;
}

/** Beide Formate rendern: 9:16 + 1:1 */
export function renderSceneTiles(scene, opts) {
  return [renderSceneTile(scene, { ...opts, w: 1080, h: 1920 }), renderSceneTile(scene, { ...opts, w: 1080, h: 1080 })];
}