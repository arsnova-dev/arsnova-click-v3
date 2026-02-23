# Story 0.3: Yjs WebSocket-Provider (Epic 0 abgeschlossen)

**Epic 0 (Infrastruktur)** ist umgesetzt: Redis (0.1), tRPC WebSocket (0.2), Yjs (0.3), Server-Status (0.4), Rate-Limiting (0.5), CI/CD (0.6).

Der Yjs-WebSocket-Server wird **mit dem Backend gestartet** (Story 0.3 umgesetzt).

## Backend-Integration

- Beim Start des Backends wird `@y/websocket-server` als Child-Prozess auf `YJS_WS_PORT` (Default 3002) gestartet.
- Umgebungsvariablen: `YJS_WS_PORT`, `HOST` (für Yjs-Server).

## Zwei-Tabs-Sync testen

1. Backend starten (`npm run dev:backend`) – Yjs-Server läuft auf `ws://localhost:3002`.
2. Zwei Browser-Tabs öffnen mit einer minimalen Testseite, die `y-websocket` und `yjs` nutzt:
   - Beide Tabs verbinden sich mit derselben Room-URL, z. B. `ws://localhost:3002/mein-quiz`.
   - In einem Tab Änderungen am Y.Doc vornehmen (z. B. Text einfügen).
   - Im anderen Tab erscheinen die Änderungen nach dem Sync automatisch.

Beispiel-Code (Browser-Konsole oder kleine HTML-Seite):

```html
<script type="module">
  import * as Y from 'https://esm.sh/yjs';
  import { WebsocketProvider } from 'https://esm.sh/y-websocket';
  const doc = new Y.Doc();
  const provider = new WebsocketProvider('ws://localhost:3002', 'test-room', doc);
  const ytext = doc.getText('shared');
  provider.on('sync', () => console.log('Synced'));
  ytext.observe(() => console.log('Content:', ytext.toString()));
  // In einem Tab: ytext.insert(0, 'Hallo'); – im anderen Tab erscheint es.
</script>
```

## Frontend (Story 1.6)

Der Dozenten-Client verbindet sich mit dem Yjs-WebSocket-Server (`ws://localhost:3002`), um Quiz-Dokumente zwischen Geräten zu synchronisieren.
