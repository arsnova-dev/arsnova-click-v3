import { createTRPCProxyClient, httpBatchLink } from '@trpc/client';
import type { AppRouter } from '@arsnova/api';

/**
 * tRPC-Client für das Angular-Frontend.
 * Der Typ `AppRouter` wird direkt aus dem Backend importiert (via tsconfig path alias).
 * → 100% End-to-End Typsicherheit ohne Code-Generierung!
 *
 * In Development proxy'd der Angular-Dev-Server `/trpc` → `http://localhost:3000/trpc`
 * (siehe proxy.conf.json).
 */
export const trpc = createTRPCProxyClient<AppRouter>({
  links: [
    httpBatchLink({
      url: '/trpc',
    }),
  ],
});
