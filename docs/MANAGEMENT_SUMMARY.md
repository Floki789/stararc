# Management Summary — StarArc / Spaceship Platform

**Stand: 31. März 2026**

---

## Was ist das Produkt?

**StarArc** (`stararc.one`) ist eine zweiteilige Personal-Finance-Plattform für die Verwaltung und Planung von Privatvermögen — entwickelt von Archimedes SB, Samuel Bumann, Rapperswil-Jona CH.

| App | Rolle |
|---|---|
| **StarArc** | Authentifizierung, Registrierung, Abonnements |
| **Spaceship** | Finanzplanung, Vermögensverwaltung, Datenlayer |

---

## Technologie-Stack

### Frontend

| | |
|---|---|
| Sprache | TypeScript / React 18 |
| Styling | Tailwind CSS |
| Build | CRACO (Create React App) |
| Charts | Recharts |
| Icons | Lucide React |
| i18n | react-i18next (Deutsch / Englisch) |
| Routing | React Router v7 |

### Backend

| | |
|---|---|
| Sprache | Node.js (JavaScript) |
| Framework | Express.js |
| Datenbank | PostgreSQL 17 |
| Auth | JWT (5 Min. Cross-App-Token) |
| Email | Nodemailer via Hostpoint SMTP |
| Zahlungen | Stripe |
 
### Infrastruktur

| | |
|---|---|
| Hosting | Heroku EU (Irland) |
| Datenbank-Plan | Essential-0 (1 GB) |
| Domain | stararc.one / spaceship.stararc.one |
| SSL | Let's Encrypt, Auto-Renewal |
| Email-Authentifizierung | SPF + DKIM + DMARC (Hostpoint) |

---

## Architektur

```
Browser (User)
    │
    ├── StarArc Frontend  →  StarArc Backend  →  PostgreSQL (StarArc)
    │         │
    │    Cross-App JWT (5 Min.)
    │         │
    └── Spaceship Frontend  →  Spaceship Backend  →  PostgreSQL (Spaceship)
```

- Zwei getrennte Apps, zwei getrennte Datenbanken
- Kommunikation via kurzlebige JWT-Token (`CROSS_APP_JWT_SECRET`)
- Beide Apps auf Heroku EU — keine Datenübertragung ausserhalb der EU

---

## Login & Authentifizierung

| | StarArc | Spaceship |
|---|---|---|
| Methode | Standard Login (Email + Passwort) | Privacy Login via StarArc |
| Passwort-Speicherung | BCrypt-Hash | — |
| Session | JWT | JWT (von StarArc) |
| 2FA | TOTP (Google Authenticator) | — |
| Passwort-Reset | Möglich (admin) | Nicht möglich (Zero-Knowledge) |
| Wiederherstellung | — | 6 BIP39-Wörter |

---

## Verschlüsselungs-Architektur (Zero-Knowledge)

```
Nutzer-Passwort
    ↓
PBKDF2-SHA256 (600'000 Iterationen, 32-Byte Salt)
    ↓
KEK (Key Encryption Key) — nie gespeichert
    ↓
AES-GCM Unwrap
    ↓
DEK (Data Encryption Key) — nur als verschlüsselte Kopie in DB
    ↓
AES-256-GCM pro Datenfeld (frischer IV + Salt pro Verschlüsselung)
```

| Parameter | Wert |
|---|---|
| Algorithmus | AES-256-GCM |
| Key-Derivation | PBKDF2-SHA256 |
| Iterationen | 600'000 |
| IV | 12 Byte (zufällig, pro Feld) |
| Salt | 32 Byte (zufällig, pro Feld) |
| Krypto-API | Web Crypto API (`crypto.subtle`) — keine externen Libs |
| DEK-Speicherung | Nur verschlüsselt (wrapped) in DB |
| Session | `sessionStorage` — gelöscht bei Tab-Schliessen |
| Timeout | 4 Stunden Inaktivität |

**Garantie:** Der Server sieht ausschliesslich verschlüsselte Blobs — selbst bei vollständiger Kompromittierung des Servers sind Nutzerdaten nicht lesbar.

---

## Externe APIs

| API | Zweck |
|---|---|
| OpenAI GPT-4o | Document Scanner (Rechnungsanalyse via Vision) |
| EODHD | Aktien- / Wertschriften-Kurse (Realtime + Suche) |
| MetalPriceAPI | Edelmetallpreise (Gold, Silber etc.) |
| ExchangeRate-API | Wechselkurse |
| CoinGecko | Bitcoin-Preis |
| Blockstream | Bitcoin On-Chain Daten *(aktuell deaktiviert)* |
| Yahoo Finance | Wertschriften-Kurse (Ergänzung) |

---

## Deaktivierte Features (Code vorhanden, nicht aktiv)

| Feature | Status |
|---|---|
| Stripe Payment Workflow | Deaktiviert |
| xPub / yPub / zPub Blockchain Lookup | Deaktiviert |
| Standard Login (Spaceship) | Deaktiviert |

---

## Projekt-Kennzahlen

| | StarArc | Spaceship | Total |
|---|---|---|---|
| **Codezeilen** | 48'433 | 180'077 | **~228'000** |
| **Dateien** (TS/JS/CSS) | 168 | 333 | **501** |
| **Commits** | 319 | 1'199 | **1'518** |
| **Branches** | 164 | 596 | **760** |
| **Erster Commit** | 6. Okt 2025 | 21. Sep 2025 | — |
| **Projektlaufzeit** | — | — | **~6.5 Monate** |
| **Ø Commits/Monat** | ~50 | ~185 | **~230** |

### Commits pro Monat

| Monat | StarArc | Spaceship |
|---|---|---|
| Sep 2025 | — | 35 |
| Okt 2025 | 18 | 169 |
| Nov 2025 | 48 | 164 |
| Dez 2025 | 72 | 261 |
| Jan 2026 | 17 | 282 |
| Feb 2026 | 39 | 80 |
| Mär 2026 | 125 | 208 |

---

## Datenbank-Kennzahlen

| | StarArc | Spaceship |
|---|---|---|
| **PostgreSQL Version** | 17.6 | 17.7 |
| **Tabellen** | 4 | 49 |
| **DB-Grösse** | 8.85 MB | 15.8 MB |
| **Plan** | Essential-0 (1 GB) | Essential-0 (1 GB) |
| **Auslastung** | 0.86% | 1.55% |
| **Migrationen** | — | 137 |
| **Registrierte User** | 4 | 4 |
| **Erstellt** | 14. März 2026 | 14. März 2026 |

### Spaceship — wichtigste Tabellen

| Tabelle | Einträge |
|---|---|
| predefined_institutions | 429 |
| schema_migrations | 137 |
| subscription_plan_limits | 96 |
| asset_items | 72 |
| budget_items | 66 |
| vaults | 17 |
| user_institutions | 15 |

---

## Compliance & Datenschutz

- **DSGVO** (EU) + **DSG** (Schweiz) konform
- Daten ausschliesslich in EU (Heroku Irland)
- Vollständige Datenlöschung bei Account-Kündigung
- Keine Analytics, kein Tracking
- Einwilligungsnachverfolgung nach Art. 7 DSGVO
- Datenschutzerklärung und AGB in Deutsch und Englisch

---

*Erstellt: 31. März 2026*
