import { publicProcedure, router } from '../trpc';

/**
 * Health-Check Router.
 * Liefert den API-Status – nützlich zum Testen der Verbindung.
 */
export const healthRouter = router({
  check: publicProcedure.query(() => {
    return {
      status: 'ok' as const,
      timestamp: new Date().toISOString(),
      version: '0.1.0',
    };
  }),
});
