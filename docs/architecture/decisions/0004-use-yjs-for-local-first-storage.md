# ADR-0004: Nutzung von Yjs (CRDTs) für Local-First Speicherung

**Status:** Accepted
**Datum:** 2026-02-18
**Entscheider:** Projektteam

## Kontext

Das Kernprinzip von arsnova.click V3 ist die **"Zero-Knowledge"-Infrastruktur**: Quiz-Inhalte (geistiges Eigentum der Dozenten) sollen niemals im Klartext auf einem zentralen Server gespeichert werden. Dozenten sollen ohne Account arbeiten können und ihre Daten sollen lokal im Browser persistiert werden.

## Entscheidung

Wir verwenden **Yjs** als CRDT-Framework (Conflict-free Replicated Data Types) kombiniert mit **IndexedDB** als lokaler Persistenz-Layer im Browser.

- Quizzes werden als **Yjs-Dokumente** modelliert
- Die lokale Persistenz erfolgt über `y-indexeddb`
- Synchronisation zwischen Geräten desselben Dozenten (z.B. Laptop & iPad) läuft über einen WebSocket-Relay-Server, der nur verschlüsselte Deltas weiterleitet
- Der Server sieht zu keinem Zeitpunkt den Klartext der Quiz-Inhalte

## Konsequenzen

### Positiv
- 100% DSGVO-Konformität: Keine personenbezogenen Inhalte auf dem Server
- Offline-Fähigkeit: Dozenten können Quizzes ohne Internetverbindung erstellen
- Multi-Device-Sync ohne Cloud-Account
- Konfliktfreie Zusammenarbeit durch CRDTs

### Negativ / Risiken
- Yjs hat eine Lernkurve; CRDTs sind konzeptionell anspruchsvoll
- Browser-Storage (IndexedDB) kann vom User gelöscht werden → Datenverlust möglich
- Debugging von CRDT-Sync-Problemen ist schwieriger als bei klassischen DB-Queries

## Alternativen (geprüft)
- **Klassische Server-Speicherung:** Widerspricht dem Zero-Knowledge-Prinzip
- **LocalStorage:** Zu limitiert (5 MB), keine strukturierte Abfrage
- **PouchDB/CouchDB:** Gute Sync-Lösung, aber weniger flexibel als Yjs bei Echtzeit-Collaboration
