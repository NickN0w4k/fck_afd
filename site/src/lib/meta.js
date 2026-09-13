// Zentrale Site-Konstanten: Stand-Datum, Share-Texte, Fakten-Kurzliste.
// Beim Update der Inhalte: SITE_STAND anpassen (siehe notes/UPDATE-PFAD.md).
// Fix 13.09. (apex-Audit): FACTS6 ist die EINE Quelle der Wahrheit für die Fakten-Karte
// (ShareCard) — index.astro importiert sie und injiziert sie via define:vars.
// Fakten müssen synchron zur Summary-Szene (scenes.json) und zu FACTS-Slot-1 (stärkste Zahl) sein.

export const SITE_STAND = '13.09.2026';

export const SHARE_TITLE = 'Die AfD. Die Fakten.';
export const SHARE_TEXT = 'Die Fakten über die AfD. Jede mit Quelle. Prüf es selbst.';

/** Fakten-Kurzliste für ShareCard (Klick „Fakten-Karte speichern“ in der EndCard) */
export const FACTS6 = [
  { big: '43,8 %', label: 'AfD-Sieg in Sachsen-Anhalt', small: 'Bestes Ergebnis ihrer Geschichte — vorläufiges Endergebnis 06.09.2026.' },
  { big: '28.000', label: 'Rechtsextremisten im AfD-Umfeld', small: 'Doppelt so viele wie 2023 — Verfassungsschutzbericht 2025.' },
  { big: '5×', label: 'Landesverbände gesichert rechtsextremistisch', small: 'Thüringen bis Niedersachsen — von keinem Gericht gekippt.' },
  { big: '−440 €', label: 'Verlust pro Jahr für Normalverdiener', small: 'Topverdiener gewinnen 19.190 € — laut ZEW-Berechnung.' },
  { big: '690 Mrd. €', label: 'Kosten eines Dexit', small: '5,6 % des BIP und 2,5 Mio. Jobs weg — laut IW Köln.' },
  { big: 'VS abschaffen', label: 'Weidels Rezept gegen die Beobachtung', small: 'Die Behörde soll weg, die sie als rechtsextrem einstuft.' },
];