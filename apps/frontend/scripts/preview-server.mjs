#!/usr/bin/env node
import { createServer } from 'http';
import { createReadStream, existsSync, statSync } from 'fs';
import { join, extname } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { request as httpRequest } from 'http';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DIST = join(__dirname, '..', 'dist', 'browser');
const PORT = parseInt(process.env.PREVIEW_PORT || '8080', 10);
const BACKEND = 'http://localhost:3000';

const MIME = {
  '.html': 'text/html',
  '.js': 'application/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.webmanifest': 'application/manifest+json',
  '.woff2': 'font/woff2',
  '.woff': 'font/woff',
};

const server = createServer((req, res) => {
  const parsed = new URL(req.url, `http://localhost:${PORT}`);
  const pathname = decodeURIComponent(parsed.pathname);

  if (pathname.startsWith('/trpc')) {
    const proxyReq = httpRequest(
      `${BACKEND}${req.url}`,
      { method: req.method, headers: { ...req.headers, host: 'localhost:3000' } },
      (proxyRes) => {
        res.writeHead(proxyRes.statusCode, proxyRes.headers);
        proxyRes.pipe(res);
      },
    );
    proxyReq.on('error', () => {
      res.writeHead(502);
      res.end('Backend unavailable');
    });
    req.pipe(proxyReq);
    return;
  }

  let filePath = join(DIST, pathname === '/' ? 'index.html' : pathname);
  const isSpaFallback = !existsSync(filePath) || statSync(filePath).isDirectory();
  if (isSpaFallback) {
    filePath = join(DIST, 'index.html');
  }

  const ext = extname(filePath);
  const headers = { 'Content-Type': MIME[ext] || 'application/octet-stream' };
  if (pathname === '/ngsw-worker.js') {
    headers['Service-Worker-Allowed'] = '/';
  }
  res.writeHead(200, headers);
  createReadStream(filePath).pipe(res);
});

server.listen(PORT, () => {
  console.log(`\n  PWA Preview: http://localhost:${PORT}/`);
  console.log(`  Backend proxy: /trpc → ${BACKEND}/trpc\n`);
});
