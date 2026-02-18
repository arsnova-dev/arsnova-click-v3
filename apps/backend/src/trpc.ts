/**
 * tRPC-Initialisierung.
 * Hier werden Router- und Procedure-Builder erstellt,
 * die in allen Routern verwendet werden.
 */
import { initTRPC } from '@trpc/server';

const t = initTRPC.create();

/** tRPC Router Builder */
export const router = t.router;

/** Öffentliche Procedure (kein Auth nötig) */
export const publicProcedure = t.procedure;
