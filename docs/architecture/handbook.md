# 🏛️ Architektur-Handbuch: arsnova.click V3

**Zuletzt aktualisiert:** 2026-02-18
**Rolle:** Living Documentation (Documentation as Code)

## 1. Einleitung & Philosophie
Dieses Handbuch beschreibt die Softwarearchitektur von **arsnova.click V3**. Wir folgen dem Prinzip der **"Living Documentation"**. Dieses Dokument und alle dazugehörigen Architekturentscheidungen (ADRs) leben direkt im Git-Repository. Sie entwickeln sich parallel zum Code weiter. 

Das Hauptziel dieses Systems ist es, ein hochperformantes Audience-Response-System (Quiz-App für Hörsäle) zu schaffen, dessen absoluter **USP (Unique Selling Proposition)** die **100%ige DSGVO-Konformität** ist. Das System operiert serverseitig als "Zero-Knowledge"-Infrastruktur bezüglich der geistigen Eigentümer (Fragen) der Dozenten.

---

## 2. Der Technologie-Stack (High-Level)
Wir setzen auf einen modernen, stark typisierten TypeScript-Stack (Full-Stack), der auf Typsicherheit, Entwicklererfahrung (DX) und Echtzeit-Performance optimiert ist.

* **Frontend:** Angular (v17+) mit **Signals** (Zustandsverwaltung), **Standalone Components** und **Tailwind CSS**.
* **Backend:** Node.js API mit **tRPC** (für typsichere Aufrufe und WebSocket-Subscriptions).
* **Datenbank (Persistenz):** **PostgreSQL** angebunden über **Prisma ORM**.
* **Echtzeit-Broker (Flüchtig):** **Redis** (Pub/Sub für Abstimmungen).
* **Offline & Sync Engine:** **Yjs** (CRDTs für die Local-First Speicherung im Browser).

---

## 3. Kern-Architekturkonzepte

Um die Ziele des Projekts zu erreichen, müssen alle Entwickler folgende drei architektonische Säulen strikt einhalten:

### 3.1 Local-First & Zero-Knowledge (Die Yjs-Engine)
Quizzes werden *nicht* in der zentralen PostgreSQL-Datenbank gespeichert. Wenn ein Dozent ein Quiz erstellt, lebt dieses als **CRDT-Dokument (Conflict-free Replicated Data Type)** über `Yjs` primär in der lokalen IndexedDB seines Browsers. 
Das Backend dient für das Erstellen von Quizzes lediglich als "dummer" WebSocket-Relay-Server, um E2E-verschlüsselte Deltas (Änderungen) zwischen den Endgeräten des Dozenten (z.B. PC und iPad) zu synchronisieren.

### 3.2 End-to-End Typsicherheit (tRPC)
Wir verzichten auf klassische REST-Schnittstellen und das manuelle Schreiben von DTO-Klassen im Frontend. Durch die Nutzung von **tRPC** im Monorepo (npm Workspaces) importiert das Angular-Frontend die Typen direkt aus der API-Schicht des Backends. Wenn sich das Datenbank-Schema (Prisma) ändert, schlägt der Frontend-Build sofort fehl.

### 3.3 Security & Data-Stripping (Das DTO-Pattern)
Während einer Live-Sitzung müssen die Fragen an die Smartphones der Studenten gesendet werden. Das Backend lädt die Daten und **muss zwingend** ein DTO (Data Transfer Object) anwenden, bevor die Daten über WebSockets versendet werden. Lösungsrelevante Felder (wie `isCorrect`) werden serverseitig restlos entfernt, um clientseitiges Cheating (z.B. über Chrome DevTools) auszuschließen.

---

## 4. Architecture Decision Records (ADRs)
Wir dokumentieren jede signifikante Änderung an der Architektur, neue Bibliotheken oder Muster in Form von ADRs. 

> 📂 **Alle Entscheidungen finden sich im Ordner:** [`./decisions`](./decisions)

**Wichtige Basis-Entscheidungen:**
* [ADR-0002: Nutzung von Angular Signals](./decisions/0002-use-angular-signals-for-ui-state.md)
* [ADR-0003: Nutzung von tRPC](./decisions/0003-use-trpc-for-api.md)
* [ADR-0004: Nutzung von Yjs (CRDTs) für Offline-Sync](./decisions/0004-use-yjs-for-local-first-storage.md)

---

## 5. Datenmodell (Single Source of Truth)
Unser relationales Datenmodell (für Nutzer-Accounts, Admin-Metadaten und flüchtige Live-Sessions) wird zentral über Prisma verwaltet. 
Das aktuelle Schema findet sich immer in der Datei: `prisma/schema.prisma`.
