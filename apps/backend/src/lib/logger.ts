/**
 * Zentraler Logger (Stand der Technik: eine Stelle für alle Ausgaben).
 * Erlaubt späteren Tausch gegen Pino/Winston ohne Änderungen in den Aufrufern.
 * ESLint: console nur hier erlaubt (kein console.log in App-Code).
 */
/* eslint-disable no-console */

export const logger = {
  /** Info-Ausgaben (Startup, Konfiguration). */
  info(message: string, ...args: unknown[]): void {
    console.info(message, ...args);
  },

  /** Warnungen (z. B. Yjs-Start fehlgeschlagen). */
  warn(message: string, ...args: unknown[]): void {
    console.warn(message, ...args);
  },

  /** Fehler (kritisch). */
  error(message: string, ...args: unknown[]): void {
    console.error(message, ...args);
  },
} as const;
