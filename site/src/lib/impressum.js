// Impressum-Daten: EINMAL hier ausfüllen — die Seite /impressum/ rendert daraus.
// Pflichtangaben (§ 5 DDG + § 18 Abs. 2 MStV, journalistisch-redaktionelles Angebot):
//   - Name + ladungsfähige Anschrift (Straße, Hausnummer, PLZ, Ort — KEIN Postfach)
//   - schnelle Kontaktmöglichkeit (E-Mail)
// Solange hier Platzhalter stehen, warnt der Validator (npm run validate).
export const IMPRESSUM = {
  // ↓↓↓ AUSFÜLLEN: Vollständiger Name des Betreibers ↓↓↓
  name: 'VORNAME NACHNAME',
  // ↓↓↓ AUSFÜLLEN: Ladungsfähige Anschrift (kein Postfach!) ↓↓↓
  anschrift: 'Straße Hausnummer, PLZ Ort',
  // Dedicated Kontakt-Adresse (Mail-Forwarding beim Domain-Provider einrichten)
  email: 'info@info-afd.de',
  // Verantwortlich für redaktionelle Inhalte i.S.d. § 18 Abs. 2 MStV
  // (kann mit dem Betreiber identisch sein — dann identisch lassen)
  verantwortlichName: 'VORNAME NACHNAME',
  verantwortlichAnschrift: 'Straße Hausnummer, PLZ Ort',
};

// true, solange noch Platzhalter drin sind — Validator + Impressumsseite nutzen das.
export const IMPRESSUM_UNVOLLSTAENDIG =
  IMPRESSUM.name.includes('VORNAME') ||
  IMPRESSUM.anschrift.includes('PLZ') ||
  IMPRESSUM.verantwortlichName.includes('VORNAME') ||
  IMPRESSUM.verantwortlichAnschrift.includes('PLZ');