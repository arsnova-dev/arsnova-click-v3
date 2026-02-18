# 📋 Product Backlog: arsnova.click V3 (Core Features MVP)

## Epic 1: Quiz-Verwaltung (Rolle: Dozent / Ersteller)
* **Story 1.1 (Quiz erstellen):** Als Dozent möchte ich ein neues Quiz anlegen und benennen können.
* **Story 1.2 (Fragentypen):** Als Dozent möchte ich verschiedene Fragentypen (Multiple Choice, Single Choice, Freitext, Umfrage) hinzufügen können.
* **Story 1.3 (Antworten & Lösungen):** Als Dozent möchte ich Antwortmöglichkeiten definieren und korrekte Antworten markieren können.
* **Story 1.4 (Sitzungs-Konfiguration):** Als Dozent möchte ich globale Einstellungen für mein Quiz festlegen können (Leaderboard, Pseudonyme, Timer).
* **Story 1.5 (Local-First Speicherung):** Als Dozent möchte ich, dass mein Quiz automatisch lokal in meinem Browser (IndexedDB via Yjs) gespeichert wird, ohne Account-Zwang.

## Epic 2: Live-Sitzung & Lobby (Rolle: Dozent)
* **Story 2.1 (Sitzung starten):** Als Dozent möchte ich ein lokales Quiz live schalten können, wodurch eine 6-stellige Session-ID und ein QR-Code generiert werden.
* **Story 2.2 (Lobby-Ansicht):** Als Dozent möchte ich in Echtzeit sehen, wie viele Studenten meiner Lobby beigetreten sind.
* **Story 2.3 (Präsentations-Steuerung):** Als Dozent möchte ich den Ablauf steuern (Frage öffnen, Countdown starten, Ergebnisse auflösen).
* **Story 2.4 (Security/Stripping):** Als Dozent möchte ich absolut sicher sein, dass die `isCorrect`-Lösungsflags beim Live-Schalten *nicht* an die Browser der Studenten gesendet werden.

## Epic 3: Teilnahme & Abstimmung (Rolle: Student)
* **Story 3.1 (Beitreten):** Als Student möchte ich über die Eingabe des Session-Codes sofort und ohne Registrierung in die Quiz-Lobby gelangen.
* **Story 3.2 (Nicknames):** Als Student möchte ich einen Nicknamen eingeben oder zugewiesen bekommen.
* **Story 3.3 (Live-Abstimmung):** Als Student möchte ich die aktuell freigegebene Frage auf meinem Gerät sehen und performant abstimmen können (via tRPC WebSockets).
* **Story 3.4 (Echtzeit-Feedback):** Als Student möchte ich nach der Auflösung durch den Dozenten sofort sehen, ob meine Antwort richtig war.

## Epic 4: Auswertung & Aufräumen (System & Dozent)
* **Story 4.1 (Leaderboard):** Als Dozent möchte ich am Ende des Quizzes das Ranking der besten Studenten anzeigen können.
* **Story 4.2 (Server aufräumen):** Als System möchte ich, dass die flüchtigen Abstimmungsdaten (Redis) vom Server gelöscht werden, sobald der Dozent die Live-Session beendet.