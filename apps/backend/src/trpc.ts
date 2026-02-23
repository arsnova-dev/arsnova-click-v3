/**
 * tRPC-Initialisierung (Story 0.5: Context mit req für Rate-Limit-IP).
 */
import { initTRPC } from '@trpc/server';
import type { IncomingMessage } from 'http';

export type Context = {
  req?: IncomingMessage;
};

const t = initTRPC.context<Context>().create();

/** tRPC Router Builder */
export const router = t.router;

/** Öffentliche Procedure (kein Auth nötig) */
export const publicProcedure = t.procedure;

/** Liest Client-IP aus Context (für Rate-Limiting). */
export function getClientIp(ctx: Context): string {
  const req = ctx.req;
  if (!req) return '0.0.0.0';
  const forwarded = req.headers['x-forwarded-for'];
  if (typeof forwarded === 'string') return forwarded.split(',')[0]?.trim() ?? req.socket.remoteAddress ?? '0.0.0.0';
  return req.socket.remoteAddress ?? '0.0.0.0';
}
