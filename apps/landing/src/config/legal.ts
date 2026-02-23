/**
 * Rechtliche Angaben für Impressum & Datenschutz.
 * Bitte vor Go-Live mit echten Werten ersetzen.
 */
export const legal = {
  /** Anbieter (Person oder Institution) */
  providerName: '[Name / Firma oder verantwortliche Person]',
  /** Straße und Hausnummer */
  street: '[Straße, Hausnummer]',
  /** PLZ und Ort */
  city: '[PLZ Ort]',
  /** Land (optional, Standard: Deutschland) */
  country: 'Deutschland',
  /** E-Mail für Kontakt */
  email: '[kontakt@example.org]',
  /** Telefon (optional, leer lassen wenn nicht gewünscht) */
  phone: '',
  /** Verantwortlich für Inhalte nach § 55 Abs. 2 RStV (bei redaktionellen Inhalten) */
  responsibleContent: '[Name, Anschrift]',
  /** Umsatzsteuer-ID (optional, leer wenn nicht vorhanden) */
  vatId: '',
  /** Aufsichtsbehörde (z. B. für Berufsangaben) – optional */
  supervisoryAuthority: '',
  /** E-Mail für Datenschutzanfragen */
  privacyEmail: '[datenschutz@example.org]',
} as const;

export const site = {
  name: 'arsnova.click',
  url: 'https://arsnova.click',
} as const;
