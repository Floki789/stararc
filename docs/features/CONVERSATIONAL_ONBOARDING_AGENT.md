# Conversational Onboarding Agent

**Status:** Konzept | Planung
**Erstellt:** 14. März 2026
**Gilt für:** StarArc + Spaceship

---

## 1. Vision & Motivation

### Aktueller Zustand

Benutzer erfassen ihre Daten über **modale Formulare** mit strukturierten Eingabefeldern:
- Profil: Land, Sprache, Wohnsituation
- Familie: Name, Geburtsjahr, Beziehung
- Assets: Konten, Wertschriften, Immobilien, Vorsorge
- Ziele: Pensionierung, Lebenskosten, Lebensphasen

**Problem:** Cold-Start — User muss viele Felder ausfüllen, bevor die App Mehrwert liefert.

### Neue Vision

Ein **conversational Agent** führt durch das Onboarding:
- Stellt Fragen in natürlicher Sprache
- Extrahiert strukturierte Daten aus Antworten via Function Calling
- Speichert automatisch in die DB (verschlüsselt)
- Merkt sich Kontext in `user_agent_memory`-Tabelle
- Gesprächsformat: persönlich, warm, nicht roboterhaft

**Beispiel-Dialog:**
```
Agent: Willkommen! Wie soll ich dich nennen?
User:  Sam

Agent: Schön, Sam! Wann bist du geboren?
User:  1985

Agent: Wohnst du in der Schweiz oder woanders?
User:  Zürich, Schweiz

Agent: Hast du eine Familie – Partner*in, Kinder?
User:  Verheiratet, 2 Kinder (2018 und 2021)

→ Agent erstellt automatisch:
   Main Person (Sam, 1985, CH)
   Spouse (Platzhalter, später ergänzbar)
   Child 1 (2018), Child 2 (2021)
   Location: CH / Europe/Zurich / CHF
```

**Vorteile:**
- Natürlicher Start, weniger einschüchternd als Formulare
- Erfasst auch qualitative Daten (Lebensziele, Wünsche)
- Kontext bleibt zwischen Sessions erhalten
- Höhere Onboarding-Completion-Rate

> **Architektur-Kontext:** StarArc = Auth/Onboarding-Layer. Spaceship = Datenlayer mit dem echten Profil-API. Die Daten fließen via Cross-App-JWT von StarArc nach Spaceship.

---

## 2. Zentrale Herausforderung: Zero-Knowledge Architektur

### Problem

Spaceship nutzt **client-side encryption** (Zero-Knowledge):
- Alle sensiblen Daten werden **nur** im Browser verschlüsselt
- Server sieht niemals Klartextdaten
- User-DEK (Data Encryption Key) bleibt im Browser

**Konflikt:** Ein server-side LLM würde Klartextdaten sehen → Zero-Knowledge theoretisch gebrochen.

### Lösungsansatz: Zweistufiges Modell

| Stufe | Daten | Encryption | ZK-konform? |
|-------|-------|------------|-------------|
| **Stufe 1** | Profil (Name, Familie, Standort) | DEK / Admin-Key | ⚠️ Teilweise |
| **Stufe 2** | Finanzdaten (Assets, Konten, Pensionen) | Client-side DEK | ✅ Ja |

**Zusätzliche Massnahme: Value-Masking** (siehe Abschnitt 7) — reduziert LLM-Exposition bestätigter Werte und gilt für beide Stufen.

---

## 3. Architektur: Zweistufiger Ansatz

### Stufe 1: StarArc-Profildaten (Onboarding-Phase)

**Scope:** Name, Geburtsdatum, Familie, Standort, Einkommenssituation, qualitative Lebensziele

**Architektur:**
```
Client (Browser)
    │  User-Nachricht [DEK-verschlüsselt]
    ▼
StarArc Backend
    │  Entschlüsseln (Standard: hat wrapped_dek_server)
    │  Prompt aufbauen (Value-Masking für bestätigte Felder)
    ▼
LLM API (Anthropic Claude)
    │  Structured Output via Function Calling
    ▼
StarArc Backend
    │  DEK-verschlüsseln
    │  Cross-App-JWT → Spaceship
    ▼  (family-members + location-settings)
DB (Spaceship)
```

**ZK-Login-Sonderfall:** Server agiert als blinder Proxy (kennt DEK nicht). LLM sieht Klartextdaten via TLS — unvermeidbar. Server speichert aber nichts unverschlüsselt.

### Stufe 2: Spaceship-Finanzdaten (nach Onboarding)

**Scope:** Assets (Konten, Wertschriften, Immobilien), Pensionskasse, Einkommen, Schulden

**Architektur:**
```
Client (Browser)
    │  LLM-Call direkt via Proxy
    ▼
StarArc/Spaceship Backend (Proxy — forwarded nur, loggt nichts)
    ▼
LLM API (Anthropic Claude)
    │  Structured Output via Function Calling
    ▼
Client (Browser)
    │  Client-side AES-256-GCM Encryption mit User-DEK
    ▼
Spaceship Backend → DB (vollständig ZK)
```

> **Wichtig:** LLM-Proxy darf Request-Bodies **nicht** loggen. Nur Metadata: Timestamp, User-ID, Response-Status.

---

## 4. Ziel-Schemas: Stufe 1 (Profile Onboarding)

Der Agent terminiert, wenn alle Pflichtfelder dieser Schemas als `[COLLECTED]` markiert sind.

### Schema 1: Hauptperson

`user_family_members`-Record mit `is_main_person = true`

| Feld (DB)                              | Typ    | Pflicht | Inhalt                                          |
|----------------------------------------|--------|---------|--------------------------------------------------|
| `encrypted_name`                       | string | **Ja**  | Displayname / Vorname                            |
| `encrypted_birth_date`                 | string | **Ja**  | `YYYY-MM-DD` oder `YYYY-01-01` (nur Jahr)        |
| `encrypted_has_employment_income`      | bool   | **Ja**  | angestellt?                                      |
| `encrypted_has_self_employment_income` | bool   | **Ja**  | selbstständig?                                   |
| `encrypted_has_ahv_income`             | bool   | nein    | bezieht AHV-Rente?                               |
| `encrypted_has_occupational_pension_income` | bool | nein | bezieht BVG-Rente?                              |
| `encrypted_has_capital_income`         | bool   | nein    | Kapitalerträge?                                  |
| `is_primary_earner`                    | bool   | **Ja**  | plain, für Berechnungen (default: `true`)        |
| `is_dependent`                         | bool   | **Ja**  | plain, für Berechnungen (default: `false`)       |

### Schema 2: Familienmitglied

Pro weiterer Person im Haushalt ein separater Record.

| Feld (DB)                              | Typ    | Pflicht | Inhalt                                                      |
|----------------------------------------|--------|---------|--------------------------------------------------------------|
| `encrypted_name`                       | string | **Ja**  | Vorname genügt                                               |
| `encrypted_birth_date`                 | string | **Ja**  | `YYYY-MM-DD` oder `YYYY-01-01`                               |
| `encrypted_relationship`               | enum   | **Ja**  | `spouse \| partner \| child \| parent \| sibling \| other`  |
| `is_dependent`                         | bool   | **Ja**  | plain, für Berechnungen                                      |
| `is_primary_earner`                    | bool   | **Ja**  | plain, für Berechnungen                                      |
| `encrypted_has_employment_income`      | bool   | nein    | bei Erwachsenen relevant                                     |
| `encrypted_has_self_employment_income` | bool   | nein    | s.o.                                                         |
| `encrypted_notes`                      | string | nein    | freie Anmerkungen                                            |

### Schema 3: Standort-Einstellungen

`user_location_settings`-Record

| Feld             | Typ    | Pflicht | Inhalt                              |
|------------------|--------|---------|--------------------------------------|
| `country_code`   | string | **Ja**  | ISO-3166-1 alpha-2 (`CH`, `DE`, …)   |
| `currency`       | string | **Ja**  | ISO-4217 (`CHF`, `EUR`, …)           |
| `timezone`       | string | **Ja**  | IANA (`Europe/Zurich`)               |
| `language_code`  | string | **Ja**  | `de` / `en` / `fr`                   |

> `timezone` und `currency` werden aus `country_code` defaulted (CH → `Europe/Zurich`, `CHF`). Der Agent fragt nur nach dem Wohnort.

---

## 5. Konversationsphasen

Drei sequenzielle Phasen. Der Agent wechselt erst in die nächste Phase, wenn alle Pflichtfelder der aktuellen `[COLLECTED]` sind.

```
Phase 1: Hauptperson          Phase 2: Haushalt            Phase 3: Standort
──────────────────────────    ───────────────────────────   ──────────────────
Name                          Hat weitere Personen?          Wohnort
Geburtsdatum                  [Loop pro Person:]             → country auflösen
Einkommenssituation           - Name                        → timezone default
                              - Geburtsdatum                → currency default
                              - Beziehung
                              - Abhängigkeit
                              - Einkommensüberblick
```

### Phase 1: Hauptperson

```
Agent:  "Willkommen! Ich helfe dir, dein Profil in wenigen Minuten einzurichten.
         Wie soll ich dich nennen?"
User:   "Max"

Agent:  "Schön, Max! Wann wurdest du geboren?
         (Nur das Jahr reicht, falls du das bevorzugst)"
User:   "15. März 1985"

Agent:  "Perfekt. Bist du aktuell angestellt, selbstständig, oder beides?"
User:   "Angestellt."

→ [COLLECTED: name = "Max"]
→ [COLLECTED: birth_date = "1985-03-15"]
→ [COLLECTED: has_employment_income = true, has_self_employment_income = false]
→ [COLLECTED: is_primary_earner = true, is_dependent = false]
```

**Parse-Logik (via Function Calling):**
- "angestellt" → `has_employment_income = true`
- "selbstständig" → `has_self_employment_income = true`
- "beides" → beide `true`
- "in Rente" / "Rentner" → `has_ahv_income = true`

### Phase 2: Haushalt / Familienmitglieder

```
Agent:  "Gehören noch weitere Personen zu deinem Haushalt –
         zum Beispiel Partner*in oder Kinder?"
User:   "Ja, meine Frau Anna (Jg. 1988) und unser Sohn Tim (10 Jahre)"

Agent:  "Ich trage Anna und Tim schon mal ein.
         Anna – sie ist deine Ehefrau, richtig? Ist sie berufstätig?"
User:   "Ja, Ehefrau. Sie arbeitet 80%."

Agent:  "Und Tim – euer Kind, abhängig von euch?"
User:   "Genau."

→ FM 1: [COLLECTED: name="Anna", birth_date="1988-01-01",
          relationship="spouse", is_dependent=false, has_employment_income=true]
→ FM 2: [COLLECTED: name="Tim", birth_date="2015-01-01",
          relationship="child", is_dependent=true, has_employment_income=false]
```

**Loop-Logik:**
- Agent erkennt mehrere Personen in einem Satz ("Frau und zwei Kinder")
- Für jede Person: Beziehung bestätigen → Geburtsdatum → Einkommensstatus
- Nach letztem Mitglied: "Hast du noch weitere Personen?"
- "Nein" → Phase abgeschlossen

### Phase 3: Standort

```
Agent:  "Letzte Frage: In welcher Stadt und welchem Land lebst du?"
User:   "Zürich, Schweiz"

→ [COLLECTED: country_code="CH", currency="CHF", timezone="Europe/Zurich"]
→ [COLLECTED: language_code="de" (aus StarArc-Einstellung)]

Agent:  "Alles erledigt! Ich habe folgendes gespeichert:
         • Du: Max, geb. 15.03.1985, angestellt
         • Anna (Ehefrau), geb. 1988, berufstätig
         • Tim (Kind, ~10 Jahre), abhängig
         • Standort: Zürich, Schweiz"
```

---

## 6. Stopping-Condition

```typescript
interface OnboardingCollectionState {
  phase: 1 | 2 | 3;

  mainPerson: {
    name?: string;
    birth_date?: string;         // "YYYY-MM-DD" | "YYYY-01-01"
    has_employment_income?: boolean;
    has_self_employment_income?: boolean;
    is_primary_earner: boolean;  // default: true
    is_dependent: boolean;       // default: false
  };

  familyMembers: Array<{
    name?: string;
    birth_date?: string;
    relationship?: 'spouse' | 'partner' | 'child' | 'parent' | 'sibling' | 'other';
    is_dependent?: boolean;
    is_primary_earner?: boolean;
    has_employment_income?: boolean;
  }>;

  hasFamilyMembersAnswered: boolean; // "nein" → sofort Phase 3

  location: {
    country_code?: string;
    city?: string;
    currency?: string;   // auto-default aus country
    timezone?: string;   // auto-default aus country
  };
}

function isComplete(state: OnboardingCollectionState): boolean {
  const mainPersonComplete =
    !!state.mainPerson.name &&
    !!state.mainPerson.birth_date &&
    state.mainPerson.has_employment_income !== undefined;

  const familyComplete =
    state.hasFamilyMembersAnswered &&
    state.familyMembers.every(m => !!m.name && !!m.birth_date && !!m.relationship);

  const locationComplete = !!state.location.country_code;

  return mainPersonComplete && familyComplete && locationComplete;
}
```

---

## 7. Privacy-Modell: Value-Masking nach Bestätigung

### Problem

Das Cloud-LLM (Anthropic API) empfängt Klartextdaten — unvermeidbar für server-seitige LLMs. "Admin-Verschlüsselung" alleine schützt nur Transport und Speicherung auf dem eigenen Server, nicht gegenüber dem LLM-Provider.

### Lösung: Minimale LLM-Exposition

Sobald ein Wert bestätigt wurde, taucht er im LLM-Kontext **nicht mehr als Klartext** auf:

```
# LLM-Kontext nach Phase 1 (aus Sicht des LLM ab dem nächsten Turn):
[COLLECTED: name]
[COLLECTED: birth_date]
[COLLECTED: income_situation → employed]
[MISSING: family_situation, location]

# "Max" und "1985-03-15" verlassen danach nie wieder den Client in Klartext.
```

**Client verwaltet echte Werte separat:**
```typescript
// Nur im Browser — nicht mehr im LLM-Kontext nach Bestätigung
const collectedValues = {
  name: "Max",
  birth_date: "1985-03-15",
};

// Was das LLM ab dem nächsten Turn sieht:
const llmContext = {
  "[COLLECTED: name]": true,
  "[COLLECTED: birth_date]": true,
  "[MISSING: family_situation]": true,
};
```

### Verschlüsselungsmodell (konsistent mit Standard vs. ZK Login)

| Aspekt                         | Standard-Login          | ZK-Login                    |
|--------------------------------|-------------------------|-----------------------------|
| Server sieht Konversation      | Ja (hat DEK)            | Nein (blinder Proxy)        |
| LLM-Provider sieht Daten       | Ja (unvermeidbar)       | Ja (unvermeidbar)           |
| Value-Masking nach Bestätigung | ✓                       | ✓                           |
| Persistierte Daten             | DEK-verschlüsselt       | ZK-DEK-verschlüsselt        |
| Konversationslog am Server     | Nicht persistiert       | Nicht persistiert           |

> **Hinweis:** Anthropic's Zero Data Retention Policy (ZDR) aktivieren, sodass die API keine Konversationsdaten für Training verwendet. Muss in der Datenschutzerklärung kommuniziert werden.

---

## 8. Datenfluss: StarArc → Spaceship

```
1. Agent sammelt State (client-seitig) bis isComplete() = true

2. Client → StarArc-Backend:
   POST /api/onboarding/session/complete
   { session_id, dataset: "<AES-256-GCM mit DEK>", onboarding_step: "completed" }

3. StarArc-Backend:
   a) Entschlüsselt dataset (Standard) oder leitet durch (ZK)
   b) Cross-App-JWT → Spaceship:
      POST /api/profile/:userId/family-members   (Hauptperson + Familienmitglieder)
      POST /api/profile/:userId/location-settings

4. Spaceship persistiert alles DEK-verschlüsselt

5. StarArc: users.onboarding_step = 'completed'
```

---

## 9. Datenmodell: Agent Memory

Neue Tabelle für Konversationskontext und Wiederaufnahme:

```sql
CREATE TABLE user_agent_memory (
  id                              SERIAL PRIMARY KEY,
  user_id                         INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  onboarding_phase                VARCHAR(50) DEFAULT 'welcome',
  pending_topics                  JSONB DEFAULT '[]'::jsonb,
  admin_encrypted_context         TEXT,   -- JSON: gesammelter State
  admin_encrypted_conversation_history TEXT,
  admin_encrypted_notes           TEXT,   -- qualitative Infos (Lebensziele etc.)
  last_interaction_at             TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  created_at                      TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at                      TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_user_agent_memory_user ON user_agent_memory(user_id);
```

**Memory-Kontext JSON (gespeichert in `admin_encrypted_context`):**
```json
{
  "collection_state": { ... },
  "life_goals": "Frührente mit 60, viel reisen",
  "conversation_style": "casual",
  "pending_questions": ["Spouse details", "Housing type"],
  "last_topic": "family"
}
```

**Onboarding-Phasen (State Machine):**

| Phase | Beschreibung | Abgeschlossen wenn |
|-------|--------------|-------------------|
| `welcome` | Begrüssung, Sprache | `language` gesetzt |
| `profile_basics` | Name, Geburtsdatum, Einkommen | Hauptperson complete |
| `family` | Haushalt erfassen | `hasFamilyMembersAnswered = true` |
| `location` | Wohnort | `country_code` gesetzt |
| `financial_overview` | Grobe Asset-Kategorien (Stufe 2) | Überblick vorhanden |
| `financial_details` | Konkrete Beträge (Stufe 2) | Mindestens 1 Asset erfasst |
| `completed` | Onboarding abgeschlossen | User kann Dashboard nutzen |

---

## 10. Tech-Stack & Tools

### LLM-Provider: Anthropic Claude (empfohlen)

- Modell: `claude-sonnet-4-6` (Stand: März 2026)
- Tool Use / Function Calling für strukturierte Datenextraktion
- Stärke: Sehr gute Deutsch-Qualität

**Fallback:** OpenAI `gpt-4o-mini` (günstiger, bei claude-Ausfall)

### Structured Data Extraction via Function Calling

```typescript
const tools = [
  {
    name: "save_main_person",
    description: "Save the main person's profile data",
    input_schema: {
      type: "object",
      properties: {
        name:                        { type: "string" },
        birth_date:                  { type: "string", description: "YYYY-MM-DD or YYYY-01-01" },
        has_employment_income:       { type: "boolean" },
        has_self_employment_income:  { type: "boolean" },
        has_ahv_income:              { type: "boolean" },
      },
      required: ["name", "birth_date", "has_employment_income", "has_self_employment_income"]
    }
  },
  {
    name: "create_family_member",
    description: "Add a family member to the household",
    input_schema: {
      type: "object",
      properties: {
        name:         { type: "string" },
        birth_date:   { type: "string" },
        relationship: { type: "string", enum: ["spouse", "partner", "child", "parent", "sibling", "other"] },
        is_dependent: { type: "boolean" },
        has_employment_income: { type: "boolean" }
      },
      required: ["name", "relationship", "is_dependent"]
    }
  },
  {
    name: "save_location",
    description: "Save location settings",
    input_schema: {
      type: "object",
      properties: {
        country_code: { type: "string", description: "ISO 3166-1 alpha-2" },
        city:         { type: "string" }
      },
      required: ["country_code"]
    }
  },
  {
    name: "onboarding_complete",
    description: "Signal that all required data has been collected",
    input_schema: { type: "object", properties: {}, required: [] }
  }
];
```

**Flow:**
1. User: "Ich bin verheiratet und habe 2 Kinder, geboren 2018 und 2021"
2. LLM → `create_family_member` (3× Tool Call)
3. Backend verarbeitet → DB-Insert via Spaceship-API

### Frontend: Chat-UI

**Komponente:** `src/components/onboarding/ConversationalOnboarding.tsx`

- Bubble-Chat-Style (WhatsApp-ähnlich)
- Typing indicator während LLM antwortet
- Quick-Replies für häufige Antworten ("Ja", "Nein", "Überspringen")
- Custom-Komponente mit bestehenden Tailwind-Klassen (kein externes Chat-Widget)

### Backend: Agent Service

**Datei:** `backend/services/conversationalAgentService.ts`
**Verantwortlichkeiten:** LLM-Calls, Prompt-Building (Value-Masking), Function Calling, Memory-Management

---

## 11. System-Prompt Struktur

```
Du bist der StarArc Onboarding-Assistent. Führe ein freundliches, natürliches Gespräch
— KEIN Formular-Gefühl.

ZIEL: Folgende Informationen erheben:
  HAUPTPERSON: name*, birth_date*, income_situation*
  HAUSHALT:    family_members (name*, birth_date*, relationship*, dependency*)
  STANDORT:    wohnort* (→ country, city)

REGELN:
- Immer nur EINE Information pro Turn erfragen
- Mehrere Angaben in einem Satz intelligent parsen und via Tool Call bestätigen
- Bestätigte Felder ([COLLECTED: ...]) NICHT nochmals erfragen
- Geburtsjahr ohne genaues Datum akzeptieren → YYYY-01-01
- Ungenaue Altersangaben ("10 Jahre", "ca. 40") in Geburtsjahr umrechnen
- Nach letztem Pflichtfeld: Zusammenfassung anzeigen + onboarding_complete aufrufen

AKTUELLER STATUS:
[COLLECTED: name]
[COLLECTED: birth_date]
[MISSING: income_situation, family_situation, location]
```

---

## 12. Server-Endpunkte

```
POST /api/onboarding/session/start
  → Erstellt Session, gibt session_id zurück
  → Lädt bestehenden State (falls abgebrochene Session)

POST /api/onboarding/session/message
  Body:     { session_id, message: "<DEK-enc>", collectionState: "<DEK-enc>" }
  Response: { reply: "<DEK-enc>", updatedState: "<DEK-enc>", toolCalls?: [...] }
  → Proxy zum LLM mit Value-Masking-Aufbereitung

POST /api/onboarding/session/complete
  Body: { session_id, dataset: "<DEK-enc>" }
  → Schreibt nach Spaceship (family-members + location-settings)
  → Setzt onboarding_step = 'completed'
  → Löscht Session

GET /api/onboarding/session/:sessionId/state
  → Gibt aktuellen (verschlüsselten) State zurück
```

---

## 13. Abbruch & Wiederaufnahme

- Session-State wird DEK-verschlüsselt am Server zwischengespeichert (TTL: 7 Tage)
- Bei erneutem Login: Agent nimmt genau da wieder auf, wo er aufgehört hat
- "Später"-Option: Session offen, `onboarding_step` bleibt auf `auth_method_selection`
- `user_agent_memory` wird nach `onboarding_step = 'completed'` bereinigt (nur Phase-Info für Analytics behalten)

---

## 14. Implementierungsplan

### Phase 1: MVP — Profil-Onboarding (2 Wochen)

**Woche 1: Backend**
- [ ] DB-Migration: `user_agent_memory` Tabelle
- [ ] `conversationalAgentService.ts`: LLM-Client, Prompt Engineering, Function Calling
- [ ] API-Endpoints: `/api/onboarding/session/*`
- [ ] Value-Masking-Logik
- [ ] Cross-App-JWT Flow zu Spaceship

**Woche 2: Frontend**
- [ ] `ConversationalOnboarding.tsx` (Chat-UI, Typing Indicator, Quick-Replies)
- [ ] Onboarding-Flow: Redirect zu Chat statt Profil-Modal
- [ ] Error-Handling (LLM offline, Rate Limits, Fallback auf Formulare)
- [ ] i18n: DE / EN

### Phase 2: Spaceship-Finanzdaten (2–3 Wochen)

- [ ] LLM-API-Proxy (Forwarding ohne Logging)
- [ ] Client-side Encryption Flow für Asset-Eingabe
- [ ] Function Calling Tools: `create_bank_account`, `create_security`, `create_pension_account`
- [ ] Integration mit bestehenden API-Endpoints (`/api/items`, `/api/pension-accounts`)

### Phase 3: Advanced Features (Optional)

- [ ] Voice Input (Web Speech API)
- [ ] Dokument-Upload (PDF-Parsing für Lohnabrechnungen)
- [ ] Proaktive Nachfragen aus der App heraus

---

## 15. Kosten & Ressourcen

### LLM-API-Kosten (Anthropic Claude)

**Annahmen:** 20 Messages pro Onboarding, ~500 Input / ~200 Output Tokens pro Message

```
Input:  10K tokens × $0.003 = $0.03
Output:  4K tokens × $0.015 = $0.06
Total:                        ~$0.09 pro User
```

Bei 1.000 neuen Users/Monat: **~$90/Monat** LLM-Kosten.

### Go/No-Go-Kriterien (nach MVP)

- ✅ ≥ 70% Onboarding-Completion-Rate bei Test-Usern
- ✅ ≤ $0.20 LLM-Kosten pro User
- ✅ Keine kritischen Bugs (Datenverlust, Encryption-Fehler)
- ❌ Falls nicht erfüllt → Zurück zu Formularen, Feature pausieren

---

## 16. Risiken & Mitigations

| Risiko | Mitigation |
|--------|-----------|
| **LLM halluziniert Daten** | Function Calling mit Schema-Validierung; User bestätigt Zusammenfassung vor Speicherung; "Undo"-Option |
| **API-Kosten explodieren** | Rate Limit: max. 50 Messages/Onboarding; Fallback auf Formulare bei Budget-Limit |
| **LLM-API offline** | Graceful Degradation auf Formulare; Retry mit exponential backoff; Fallback OpenAI |
| **User vertraut Agent nicht** | Transparenz-Banner; Opt-Out zu Formularen; Klare Privacy-Policy |
| **Datenqualität** | Review-Screen vor finalem Speichern; Edit-Möglichkeit |

---

## 17. Sicherheit & Datenschutz

**Massnahmen:**
1. **LLM-Provider DSGVO:** Anthropic Data Processing Agreement + Zero Data Retention Policy aktivieren
2. **Memory-Retention:** `user_agent_memory` nach Completion bereinigen
3. **Proxy-Logging:** Nur Metadata, keine Request-Bodies
4. **Rate Limiting:** 100 Messages/Stunde pro User, 200/Stunde pro IP
5. **Audit-Log:** `agent_interaction_log`-Tabelle (action, phase, IP-Hash, User-Agent-Hash)

**Datenschutz-Hinweis vor Konversationsstart:**
> "Ich stelle dir ein paar Fragen, um dein Profil einzurichten. Deine Antworten werden zur Profilerstellung verwendet und danach verschlüsselt gespeichert. Das KI-Modell (Anthropic Claude) verarbeitet deine Eingaben temporär und speichert sie nicht dauerhaft."

---

## 18. Erfolgsmetriken

| Metrik | Ziel |
|--------|------|
| Onboarding-Completion-Rate | > 70% |
| Durchschnittliche Dauer | < 15 Minuten |
| Datenqualität (falsche Extraktionen) | < 5% |
| User Satisfaction (Post-Survey) | > 8/10 |
| LLM-Kosten pro User | < $0.15 |
| Bounce-Rate (< 3 Messages) | < 30% |

---

## 19. Offene Fragen & TODOs

**Technisch:**
- [ ] Streaming-Responses oder Batch? (Streaming = besseres UX)
- [ ] Memory-Retention: Komplett löschen oder verschlüsselt archivieren?
- [ ] **Geocoding:** `city`-String → `country_code`, `timezone` via Nominatim / Google Maps
- [ ] **Subscription-Limit:** Max. Family Members je Plan prüfen vor Insert
- [ ] **Lokales LLM (WebLLM):** Future Work für maximale ZK-Privacy

**UX:**
- [ ] Quick-Replies: Welche Standard-Antworten vordefinieren?
- [ ] Wann Agent anbieten, wann direkt Formulare? (User-Wahl beim ersten Login?)

**Business:**
- [ ] A/B-Testing: Agent vs. Formulare (50/50 bei Neuregistrierungen, 4 Wochen)
- [ ] LLM-Provider: Claude als Default, OpenAI als Fallback?

---

## 20. Zusammenfassung

**Was:** KI-Chatbot für Onboarding statt modale Formulare
**Warum:** Natürlicher, höhere Completion-Rate, bessere Datenqualität
**Wie:** Anthropic Claude mit Function Calling, Value-Masking, DEK-Encryption
**Stufe 1:** StarArc-Profildaten (Name, Familie, Standort) → Spaceship via Cross-App-JWT
**Stufe 2:** Spaceship-Finanzdaten via Client-side Encryption (vollständig ZK)

**Nächster Schritt:** DB-Migration `user_agent_memory` vorbereiten, LLM-API-Key einrichten, `conversationalAgentService.ts` scaffolden.
