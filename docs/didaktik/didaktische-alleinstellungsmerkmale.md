# Didaktische Alleinstellungsmerkmale & Ausbaupotenzial

> Kurzfassung der USPs und konkrete Vorschläge zum weiteren Ausbau (Stand: Backlog 60 Storys).

---

## 1. Bereits verankerte Alleinstellungsmerkte

- **Datenschutz als Enabler:** DSGVO, Local-First, anonymer Modus → Formate, die bei US-ARS schwer vertretbar sind.
- **Zwei Modi in einem Tool:** Presets „Spielerisch“ vs. „Seriös“, Lesephase für reflektiertes Antworten.
- **Hochschul-Fit:** KaTeX, Schwierigkeitsstufen, Bonus-Token für formelle Anerkennung bei Wahrung der Anonymität.
- **Feedback & Gamification:** Streak, persönliche Scorecard, kontextuelle Motivationsmeldungen, differenziertes Scoring (Schwierigkeit + Zeit).
- **Institutionelle Souveränität:** Self-Hosted, Open Source, Zero-Account, keine Abo-Kosten, WCAG 2.1 AA.

---

## 2. Vorschläge zum Ausbau

### 2.1 Dokumentation & Sichtbarkeit

| Maßnahme | Nutzen |
|----------|--------|
| **ARS-Vergleich um Zeile „Didaktik“ erweitern** | Einordnung neben Kahoot/Mentimeter (Lesephase, Presets, Bonus-Token, anonyme Auswertung). |
| **Dozenten-Quickstart** | 1–2 Seiten: „Spielerisch vs. Seriös“, wann Lesephase, wann Bonus-Token, DSGVO-Hinweis. |
| **Dieses Dokument** | Zentrale Referenz für Marketing, Anträge, Schulungen. |

### 2.2 Geplante Features stärker als Didaktik-USP benennen

- **Story 1.14 (Word Cloud)** ist im ARS-Vergleich genannt, fehlt aber in der Backlog-Tabelle → als Story aufnehmen und als „Mentimeter-Level Freitext-Auswertung“ kommunizieren.
- **Story 2.6 (Lesephase)** in Außendarstellung klar als didaktisches Alleinstellungsmerkmal hervorheben („Frage zuerst lesen, dann antworten“).
- **Presets (1.11)** in Docs und UI mit kurzer didaktischer Begründung versehen („Spielerisch: Motivation & Wettbewerb“ / „Seriös: Druckfreiheit & Fokus“).

### 2.3 Neue / erweiterte Backlog-Ideen (didaktisch)

| Idee | Kurzbeschreibung | Priorität |
|------|------------------|-----------|
| **Lernziel- / Kompetenz-Tags pro Frage** | Optionale Tags (z. B. Bloom-Stufe, Kompetenzfeld) nur in der Quiz-Erstellung; keine Weitergabe an Teilnehmer. Nutzen: Nachbereitung, Lehrportfolio, Curricula. | 🟢 Could |
| **Reflexionsfrage nach Antwort (Metakognition)** | Optional nach jeder Frage: „Wie sicher warst du?“ (1–5). Nur aggregiert anzeigen (Histogramm); fördert Selbsteinschätzung. | 🟢 Could |
| **Peer Instruction (Zweite Runde)** | Option „Nach Ergebnis erneut abstimmen“: gleiche Frage nach kurzer Diskussion; Vergleich Vorher/Nachher auf Beamer. | 🟢 Could |
| **Mindest-Lesezeit in Lesephase** | Bei Seriös-Preset: Button „Antworten freigeben“ erst nach z. B. 30 s aktiv – stellt Lesen vor Klicken. | 🟡 Should |
| **Ergebnis-Export für Dozenten (anonym)** | CSV/PDF pro Session: aggregierte Statistiken, Verteilung pro Frage, Bonus-Token-Liste; keine personenbezogenen Daten. Für Nachbereitung, Akkreditierung, Lehrevaluation. | 🟡 Should |
| **Drittes Preset „Formatives Assessment“** | Lesephase an, anonym, kein Leaderboard, persönliche Scorecard mit Fokus auf „Was war richtig/falsch?“ – für formatives Feedback ohne Wettbewerb. | 🟢 Could |
| **Slide-Import (PPT/PDF)** | Quiz-Fragen aus Folien ableiten (Text extrahieren, als Freitext-/MC-Basis). Im ARS-Vergleich bereits als „Slide-Import“ erwähnt. | 🟢 Could |

### 2.4 Keine Änderung nötig, aber kommunizieren

- **Team-Modus (7.1):** Kollaboratives Lernen, Gruppenergebnis – in Didaktik-Docs erwähnen.
- **Q&A-Modus (8.x):** Anonyme Fragen + Upvoting – klassische partizipative Didaktik; mit Seriös-Preset verknüpfen.
- **Rating-Skala (1.2c):** Stimmungsbild, Zufriedenheit, Selbsteinschätzung – eine Zeile in Dozenten-Quickstart.

---

## 3. Nächste Schritte (optional)

1. ~~**Backlog:** Story 1.14 (Word Cloud) in die Story-Tabelle und als Epic-1-Story mit Akzeptanzkriterien aufnehmen.~~ ✅ Erledigt.
2. ~~**Backlog:** Eine „Should“-Story „Ergebnis-Export für Dozenten (anonym)“ (Epic 4) anlegen.~~ ✅ Erledigt (Story 4.7).
3. ~~**Vergleich:** In `docs/ARS-comparison/Kahoot-Mentimeter-Slido-arsnova.click-v3.md` eine Zeile „Didaktik“ mit Lesephase, Presets, Bonus-Token, optional Reflexion/Export ergänzen.~~ ✅ Erledigt.
4. **Dozenten-Doc:** Kurzes `docs/didaktik/dozenten-quickstart.md` (1–2 Seiten) mit Presets, Lesephase, Datenschutz-Hinweis.

---

*Living Documentation – bei Umsetzung von Stories hier abgleichen.*
