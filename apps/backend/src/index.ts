import express from 'express';
import cors from 'cors';
import { createExpressMiddleware } from '@trpc/server/adapters/express';
import { appRouter } from './routers';

const app = express();
const PORT = process.env['PORT'] || 3000;

// CORS erlauben (Angular Dev-Server läuft auf Port 4200)
app.use(cors({ origin: 'http://localhost:4200' }));

// tRPC-Middleware mounten
app.use(
  '/trpc',
  createExpressMiddleware({
    router: appRouter,
  }),
);

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`🚀 Backend läuft auf http://localhost:${PORT}`);
  // eslint-disable-next-line no-console
  console.log(`   tRPC-API: http://localhost:${PORT}/trpc`);
});
