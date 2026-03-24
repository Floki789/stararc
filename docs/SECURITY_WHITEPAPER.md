# StarArc Security Whitepaper

**Version 1.0 — March 2026**
**Authors:** Archimedes Apps

---

## Inhaltsverzeichnis

1. [Zusammenfassung](#1-zusammenfassung)
2. [Designphilosophie](#2-designphilosophie)
3. [Systemarchitektur](#3-systemarchitektur)
4. [Verschlüsselungsstandards](#4-verschlüsselungsstandards)
5. [Envelope-Verschlüsselung (KEK/DEK)](#5-envelope-verschlüsselung-kekdek)
6. [Authentifizierungsmodi](#6-authentifizierungsmodi)
7. [Feldbasierte Verschlüsselung](#7-feldbasierte-verschlüsselung)
8. [Schlüsselverwaltung](#8-schlüsselverwaltung)
9. [Zwei-Faktor-Authentifizierung](#9-zwei-faktor-authentifizierung)
10. [Cross-App-Sicherheit](#10-cross-app-sicherheit)
11. [Transport- und Infrastruktursicherheit](#11-transport--und-infrastruktursicherheit)
12. [Browsersicherheit](#12-browsersicherheit)
13. [Datenschutz und DSGVO](#13-datenschutz-und-dsgvo)
14. [Branchenvergleich](#14-branchenvergleich)
15. [Bekannte Einschränkungen und Transparenz](#15-bekannte-einschränkungen-und-transparenz)

---

## 1. Zusammenfassung

StarArc ist eine Personal-Finance-Plattform, die aus zwei eng integrierten Anwendungen besteht: **StarArc** (Authentifizierung, Benutzerverwaltung, Abonnements) und **Spaceship** (Finanzplanung mit allen Nutzerdaten). Beide Anwendungen nutzen eine mehrschichtige Sicherheitsarchitektur, deren zentrales Element eine **clientseitige AES-256-GCM-Verschlüsselung mit Envelope-Key-Management** ist.

### Kernversprechen

- **Alle persönlichen und finanziellen Daten werden clientseitig verschlüsselt**, bevor sie den Server erreichen
- **Jedes Datenfeld wird einzeln verschlüsselt** — mit frischem Zufalls-IV und -Salt pro Verschlüsselung
- **Kein externer Krypto-Code** — ausschließlich die browsernative Web Crypto API (`crypto.subtle`)
- **Sovereignty-Modus (Zero-Knowledge):** Der Server kann die Nutzerdaten unter keinen Umständen entschlüsseln
- **Moderne Schlüsselableitung:** PBKDF2-SHA-256 mit 600.000 Iterationen

---

## 2. Designphilosophie

### Security by Design

Die Sicherheitsarchitektur wurde nicht nachträglich aufgesetzt, sondern ist integraler Bestandteil des Datenmodells. Jede Tabelle, die persönliche Daten speichert, ist von Grund auf mit verschlüsselten Feldern konzipiert.

### Prinzip der minimalen Vertrauensanforderung

StarArc verfolgt das Ziel, die erforderliche Vertrauensbasis gegenüber dem Serverbetreiber zu minimieren:

| Modus | Vertrauensbedarf gegenüber Server |
|---|---|
| **Standard Login** | Moderat — Server kann bei Bedarf entschlüsseln (für Komfortfunktionen wie Passwort-Reset) |
| **Sovereignty (Zero-Knowledge)** | Minimal — Server speichert nur verschlüsselte Blobs, ohne die Möglichkeit der Entschlüsselung |

Nutzer wählen selbst, welches Modell ihren Anforderungen entspricht.

### Verschlüsselung als Grundzustand

Alle personenbezogenen und finanziellen Daten werden **vor dem Verlassen des Browsers** verschlüsselt. Im Klartext verbleiben auf der Datenbank ausschließlich:

- Primär- und Fremdschlüssel (strukturelle Verknüpfungen)
- Kategorie-IDs (nicht die Namen)
- Boolsche Konfigurationswerte
- Zeitstempel
- Verschlüsselungs-Metadaten (Version, Algorithmus, IV, Salt)
- Funktionale Metadaten mit geringer Datenschutzrelevanz, zum Beispiel:
  - Währungscodes (z. B. `CHF`, `EUR`, `USD`)
  - Datenquellen-Typ (z. B. `manual`, `import`, `csv`)
  - Erinnerungsintervall für Wertaktualisierungen (z. B. `monatlich`, `quartalsweise`)
  - Szenario-Typ für Projektionen (z. B. `konservativ`, `optimistisch`)
  - Verarbeitungs- und Importstatus-Flags (z. B. `pending`, `completed`)

---

## 3. Systemarchitektur

```
┌──────────────────────────────────────────────────┐
│                    Nutzer-Browser                 │
│  ┌──────────────────┐  ┌───────────────────────┐ │
│  │    StarArc UI     │  │     Spaceship UI      │ │
│  │  (Registrierung,  │  │  (Finanzplanung,      │ │
│  │   Login, 2FA)     │  │   verschlüsselte      │ │
│  │                   │  │   Datenverwaltung)     │ │
│  └───────┬──────────┘  └──────────┬────────────┘ │
│          │ Web Crypto API          │              │
│          │ (crypto.subtle)         │              │
└──────────┼─────────────────────────┼──────────────┘
           │ HTTPS/TLS              │ HTTPS/TLS
           ▼                        ▼
┌──────────────────┐      ┌──────────────────────┐
│  StarArc Backend │      │  Spaceship Backend    │
│  (Express.js/TS) │◄────►│  (Express.js/Node)    │
│                  │ JWT  │                       │
│  PostgreSQL (EU) │ 5min │  PostgreSQL (EU)      │
└──────────────────┘      └──────────────────────┘
```

- **Hosting:** Heroku EU (Irland) — Daten verbleiben innerhalb der EU
- **Datenbanken:** Getrennte PostgreSQL-Instanzen pro Anwendung — kein gemeinsamer Datenzugriff
- **Kommunikation:** Kurzlebige Cross-App-JWT-Token (5 Minuten Gültigkeit)

---

## 4. Verschlüsselungsstandards

| Komponente | Algorithmus | Parameter |
|---|---|---|
| Datenverschlüsselung | **AES-256-GCM** | 12 Byte IV, 128-Bit Authentifizierungs-Tag |
| Nutzer-Schlüsselableitung (KEK) | **PBKDF2-SHA-256** | 600.000 Iterationen, 32 Byte Zufalls-Salt |
| Passwort-Hashing | **BCrypt** | Branchenstandard-Kostenfaktor, automatischer Salt |
| E-Mail-Lookup | **SHA-256** | E-Mail + anwendungsspezifischer Salt |
| Wiederherstellungsphrase | **BIP39-Wortliste** | 6 Wörter aus 2048-Wort-Liste (~66 Bit Entropie) |
| Cross-App-Token | **JWT (HMAC-SHA256)** | 5 Minuten Gültigkeit |
| Kryptografie-API | **Web Crypto API** | Browsernativ, keine externen Bibliotheken |

### Warum AES-256-GCM?

AES-256-GCM bietet **authentifizierte Verschlüsselung** — es schützt gleichzeitig die Vertraulichkeit und die Integrität der Daten. Jede Manipulation verschlüsselter Daten wird beim Entschlüsseln erkannt und abgelehnt. Dies ist der De-facto-Standard für moderne Datenverschlüsselung und wird von Branchenführern wie Apple (iCloud), Signal und Google verwendet.

### Warum Web Crypto API?

Die gesamte clientseitige Kryptografie nutzt ausschließlich `crypto.subtle` — die vom Browser bereitgestellte, hardwarebeschleunigte Krypto-API. Vorteile:

- **Keine externen Abhängigkeiten:** Kein Risiko durch kompromittierte npm-Pakete
- **Hardwarebeschleunigung:** Nutzung der CPU-AES-Instruktionen
- **Auditierbar:** Der Browser-Code ist open source (Chromium, Firefox)
- **Sicher gegen Timing-Angriffe:** Implementierungen in nativem C/C++

---

## 5. Envelope-Verschlüsselung (KEK/DEK)

StarArc verwendet ein **zweistufiges Schlüsselsystem** nach dem Envelope-Encryption-Prinzip, wie es auch von AWS KMS, Google Cloud KMS und Apple iCloud eingesetzt wird.

```
Nutzer-Passwort (oder Wiederherstellungsphrase)
    │
    ▼
PBKDF2 (SHA-256, 600.000 Iterationen, 32 Byte Zufalls-Salt)
    │
    ▼
KEK (Key Encryption Key) — 256 Bit, wird nie gespeichert
    │
    ▼
AES-GCM Wrap/Unwrap
    │
    ▼
DEK (Data Encryption Key) — 256 Bit, nur verpackt gespeichert
    │
    ▼
AES-256-GCM pro Datenfeld
    │
    ▼
Salt ‖ IV ‖ Ciphertext ‖ Authentifizierungs-Tag (Base64-kodiert)
```

### DEK-Lebenszyklus

1. **Erzeugung:** Einmalig bei der Registrierung mittels `crypto.subtle.generateKey('AES-GCM', 256)`
2. **Speicherung:** Der DEK wird **nie im Klartext** gespeichert — es existieren nur verpackte (wrapped) Kopien
3. **Verpackungen:**
   - Nutzer-Kopie — verpackt mit dem Nutzer-KEK (beide Modi)
   - Server-Kopie — verpackt mit dem Server-KEK (nur Standard-Modus; nicht vorhanden im Sovereignty-Modus)
   - Wiederherstellungs-Kopie — verpackt mit dem Wiederherstellungs-KEK (nur Sovereignty-Modus)
4. **Im Browser:** Temporär in `sessionStorage` (wird beim Schließen des Tabs gelöscht)
5. **Zeitlimit:** 4 Stunden harte Ablaufzeit mit Aktivitätsüberwachung

### Warum Envelope Encryption?

- **Schlüsselrotation:** Wird der DEK kompromittiert, muss nur der DEK neu verpackt werden — nicht alle Daten neu verschlüsselt
- **Getrennter Zugriff:** Server und Nutzer verwenden unterschiedliche KEKs für denselben DEK
- **Keine Passwort-Exposition:** Das Passwort verlässt den Browser nie — nur der daraus abgeleitete KEK wird verwendet

---

## 6. Authentifizierungsmodi

### 6a. Standard Login

```
Registrierung:
  Browser: DEK erzeugen → KEK aus Passwort ableiten → DEK verpacken
  Browser: Rohen DEK + Nutzer-Schlüssel-Kopie + Salt an Server senden (einmalig)
  Server:  Server-KEK ableiten → Server-Schlüssel-Kopie erstellen → rohen DEK verwerfen

Anmeldung bei Spaceship:
  Server:  DEK via Server-Schlüssel-Kopie entpacken → für Transport verschlüsseln → JWT
  Browser: DEK aus JWT entschlüsseln → sessionStorage → nahtloser Zugriff
```

**Vorteile:**
- Nahtloses Anmeldeerlebnis — kein zweites Passwort nötig
- Administrator-Passwort-Reset möglich
- Komfortabel für Nutzer, die dem Serverbetreiber vertrauen

**Kompromiss:** Der Server hält eine verschlüsselte Kopie des DEK und kann den DEK bei Bedarf ableiten. Dies ist bewusst so gestaltet, um Komfortfunktionen zu ermöglichen.

### 6b. Sovereignty (Zero-Knowledge) Modus

```
Einrichtung:
  Browser: Sovereignty-Passwort erstellen (min. 12 Zeichen)
  Browser: 6 BIP39-Wiederherstellungswörter generieren
  Browser: DEK erzeugen
  Browser: Passwort-KEK ableiten → Nutzer-Schlüssel-Kopie
  Browser: Wiederherstellungs-KEK ableiten → Wiederherstellungs-Schlüssel-Kopie
  Browser: Wiederherstellungsphrase mit DEK verschlüsseln
  Browser: Alle verpackten Artefakte an Server senden
           (Der rohe DEK verlässt den Browser NIE)

Anmeldung bei Spaceship:
  Server:  Nutzer-Schlüssel-Kopie + Salt im JWT senden (kein roher DEK)
  Browser: Sovereignty-Passwort abfragen → KEK ableiten → DEK entpacken
```

**Garantien:**
- Server-Schlüssel-Kopie = nicht vorhanden — der Server hat physisch keinen Zugang zu den Daten
- Kein Administrator-Passwort-Reset möglich
- Wiederherstellung ausschließlich über die 6-Wort-Phrase (clientseitig)
- Der Server fungiert als „blinder Tresor" — speichert verschlüsselte Blobs, ohne deren Inhalt zu kennen

---

## 7. Feldbasierte Verschlüsselung

Im Gegensatz zu vielen Anwendungen, die Daten auf Container- oder Datenbankebene verschlüsseln, verschlüsselt StarArc **jedes sensible Feld einzeln**.

### Verschlüsselte Datenfelder (Auszug)

| Anwendung | Verschlüsselte Felder |
|---|---|
| **StarArc** | E-Mail, Name/Alias, 2FA-Geheimnisse, Backup-Codes, Rechtskenntnis-Einwilligungen |
| **Spaceship** | Asset-Namen, Werte, Mengen, Währungen, ISINs, Bitcoin-xPubs, Ableitungspfade, Wallet-Details, Familiennamen, Geburtsjahre, Budget-Beträge, Immobilienwerte, Hypotheken, Edelmetallbestände, Seed-Informationen, Hardware-Seriennummern, Kontowerte, Verbindlichkeiten, Standortdaten |

### Eigenschaften

- **Frischer Salt** (32 Byte) und **frischer IV** (12 Byte) pro Verschlüsselung
- Derselbe Wert ergibt bei zweimaliger Verschlüsselung **unterschiedlichen Ciphertext** (Schutz vor Musteranalyse)
- **Selbstbeschreibendes Format:** Salt ‖ IV ‖ Ciphertext ‖ Authentifizierungs-Tag (Base64-kodiert)
- **Verschlüsselungs-Metadaten** pro Datensatz: `encryption_version: 1`, `encryption_algorithm: "AES-256-GCM"` (ermöglicht nahtlose Migration bei Algorithmus-Updates)

### Performance-Optimierung

Der DEK wird beim Login einmalig entpackt und für die Dauer der Sitzung vorgehalten. Einzelne Feld-Operationen verwenden anschließend direkt AES-256-GCM — ohne erneute PBKDF2-Ableitung:

- **Login:** 1× PBKDF2 (600.000 Iterationen) zum DEK-Entpacken
- **Jede Feld-Operation:** Nur AES-256-GCM (hardwarebeschleunigt, Mikrosekunden)

---

## 8. Schlüsselverwaltung

| Schlüssel | Erzeugung | Speicherort | Zugriff |
|---|---|---|---|
| Nutzer-Passwort | Nutzerwahl | BCrypt-Hash in DB | Nur Nutzer |
| Sovereignty-Passwort | Nutzerwahl (min. 12 Zeichen) | BCrypt-Hash in DB | Nur Nutzer |
| DEK | `crypto.subtle.generateKey()` | Nur als verpackte Kopien | Standard: Nutzer + Server; ZK: nur Nutzer |
| Nutzer-KEK | PBKDF2(Passwort, Salt, 600k) | Nicht gespeichert; bei Bedarf abgeleitet | Nur Nutzer |
| Server-KEK | PBKDF2(Servergeheimnis, User-Salt) | Nicht gespeichert; bei Bedarf abgeleitet | Nur Server |
| Wiederherstellungs-KEK | PBKDF2(6 Wörter, Salt, 600k) | Nicht gespeichert; bei Bedarf abgeleitet | Nur Nutzer |
| Wiederherstellungsphrase | 6 zufällige BIP39-Wörter | Mit DEK verschlüsselt in DB | Nur Nutzer |
| Admin-Masterkey | Umgebungsvariable | Serverumgebung | Nur Serveradministrator |
| Cross-App-Geheimnis | Umgebungsvariable | Beide Serverumgebungen | Beide Server |

### Schlüsseltrennung

Kein einzelner Schlüssel gewährt Zugriff auf alle Daten. Das System setzt auf **Schlüsseltrennung**:

- Der **Admin-Masterkey** verschlüsselt nur administrative Kopien (E-Mail, Name) — nicht die Finanzdaten
- Der **DEK** verschlüsselt die Nutzerdaten — ist aber ohne den KEK nicht zugänglich
- Der **KEK** existiert nur transient im Speicher — wird nie auf der Festplatte gespeichert
- **Sovereignty-Modus:** Selbst eine vollständige Kompromittierung des Servers gibt keinen Zugang zu Nutzerdaten

---

## 9. Zwei-Faktor-Authentifizierung

StarArc bietet TOTP-basierte Zwei-Faktor-Authentifizierung (kompatibel mit Google Authenticator, Authy, etc.):

- **Algorithmus:** TOTP (RFC 6238) mit 30-Sekunden-Intervall
- **Toleranz:** ±1 Intervall (30 Sekunden Kulanzzeit)
- **Backup-Codes:** 10 Codes mit je 8 kryptografisch zufälligen Hex-Zeichen
- **Speicherung:** 2FA-Geheimnisse werden **verschlüsselt** in der Datenbank gespeichert (AES-256-GCM) — nie im Klartext
- **Benachrichtigungen:** Sicherheits-E-Mails bei Aktivierung und Deaktivierung von 2FA

---

## 10. Cross-App-Sicherheit

Die Kommunikation zwischen StarArc und Spaceship erfolgt über signierte, kurzlebige JWT-Token:

| Eigenschaft | Wert |
|---|---|
| Algorithmus | HMAC-SHA256 |
| Gültigkeit | 5 Minuten |
| Geteiltes Geheimnis | Umgebungsvariable (nur serverseitig) |
| Dateninhalt | User-ID, Auth-Methode, verschlüsselte DEK-Daten |

### Standard-Modus-Transport

1. StarArc entpackt den DEK serverseitig
2. Verschlüsselt den DEK mit einem zufälligen Einmal-Schlüssel für den Transport
3. Signiert das JWT mit: Auth-Key, Auth-Methode, verschlüsselten DEK-Daten
4. Spaceship entschlüsselt den DEK → nahtloser Zugriff

### Sovereignty-Modus-Transport

1. StarArc sendet die Nutzer-Schlüssel-Kopie + Salt im JWT (kein roher DEK)
2. Spaceship fordert das Sovereignty-Passwort vom Nutzer
3. Client leitet KEK ab → entpackt DEK
4. Kein nahtloser Login — by Design

---

## 11. Transport- und Infrastruktursicherheit

### HTTPS-Erzwingung

Beide Anwendungen erzwingen HTTPS in der Produktion mit permanenter 301-Weiterleitung:
- **HSTS:** `Strict-Transport-Security: max-age=31536000; includeSubDomains; preload`
- Heroku-Reverse-Proxy wird mit `trust proxy = 1` korrekt respektiert

### HTTP Security Headers

Beide Anwendungen nutzen [Helmet.js](https://helmetjs.github.io/) mit folgenden Headerschutzmaßnahmen:

| Header | Funktion |
|---|---|
| `Content-Security-Policy` | Strenge Whitelist für Script-, Style-, Font- und Verbindungsquellen |
| `X-Frame-Options` | Schutz vor Clickjacking |
| `X-Content-Type-Options: nosniff` | Verhindert MIME-Type-Sniffing |
| `Referrer-Policy` | Kontrollierter Referrer-Informationsfluss |
| `X-XSS-Protection` | Browser-XSS-Filter |
| `Strict-Transport-Security` | HTTPS-Erzwingung (1 Jahr, inkl. Subdomains, Preload) |

Die Content Security Policy ist pro Anwendung maßgeschneidert:
- **StarArc:** Erlaubt `js.stripe.com` und `api.stripe.com` für Zahlungsabwicklung
- **Spaceship:** Blockiert alle Frames (`frame-src: 'none'`) und Plugins (`object-src: 'none'`)

### Rate Limiting

| Kategorie | StarArc | Spaceship |
|---|---|---|
| Globale API | Aktiv | Aktiv |
| Anmeldung (Login) | Striktes Limit | — |
| Registrierung | Striktes Limit | — |

### CORS

Beide Anwendungen verwenden **explizite Origin-Whitelists** (kein `origin: '*'`):
- Nur bekannte Produktions-Domains und Entwicklungsumgebungen sind zugelassen
- `credentials: true` für sichere Cookie/Token-Übertragung
- Preflight-Cache: 24 Stunden

### SQL-Injection-Schutz

**100 % parametrisierte Queries** in beiden Anwendungen über `pg` (node-postgres) mit `$1, $2, ...`-Platzhaltern. **Keine String-Konkatenation** in SQL-Abfragen.

```sql
-- Beispiel: Parametrisierte Abfrage
SELECT * FROM users WHERE id = $1    -- ✓ Sicher
SELECT * FROM users WHERE id = '...' -- ✗ Wird nicht verwendet
```

### Eingabevalidierung

StarArc verwendet `express-validator` für eine konsistente, deklarative Eingabevalidierung:

- E-Mail-Normalisierung und -Validierung
- Passwort-Komplexität (Mindestlänge, Groß-/Kleinbuchstaben, Ziffern)
- Typ-Prüfungen (Boolean, Enum-Werte)
- Längen-Beschränkungen

---

## 12. Browsersicherheit

| Maßnahme | Details |
|---|---|
| **Kryptografie** | Ausschließlich `crypto.subtle` (Web Crypto API) — keine externen JS-Kryptobibliotheken |
| **Schlüsselspeicherung** | DEK nur in `sessionStorage` (gelöscht bei Tab-Schließung) |
| **Sitzungszeitlimit** | 4 Stunden harte Ablaufzeit |
| **Aktivitätsüberwachung** | Erkennung von: Mausbewegung, Tastendruck, Scrollen, Touch, Klick |
| **Kein persistenter Schlüssel** | DEK wird nie in `localStorage` gespeichert |
| **Nur HTTPS** | Gesamte Kommunikation TLS-verschlüsselt |

### Session-Lifecycle

```
Login → PBKDF2 (600k) → KEK → DEK entpacken
    → sessionStorage (verschlüsselter Schlüssel-Blob)
    → Aktivitäts-Timer startet (4h)

Nutzer aktiv → Timer zurücksetzen
Nutzer inaktiv >4h → DEK aus Speicher löschen → Re-Login erforderlich
Tab schließen → sessionStorage automatisch gelöscht
```

---

## 13. Datenschutz und DSGVO

### Datenstandort

Alle Daten werden auf **Heroku EU (Irland)** verarbeitet und gespeichert. Es findet keine Datenübertragung außerhalb der EU statt.

### Datenlöschung

Beide Anwendungen bieten vollständige Datenlöschung:

- **Spaceship:** Kaskadierende Löschung über 20+ Tabellen in korrekter Fremdschlüssel-Reihenfolge
- **StarArc:** Eine automatisierte Anonymisierungsfunktion anonymisiert alle personenbezogenen Felder, löscht Zahlungsinformationen und deaktiviert Zugangsschlüssel

### Einwilligungsnachverfolgung (Art. 7 DSGVO)

Einwilligungszeitpunkte, -versionen und dazugehörige Metadaten werden verschlüsselt gespeichert — für den Nachweis der rechtmäßigen Einwilligung gemäß Art. 7 DSGVO.

### Automatische Bereinigung

Abgelaufene Verifikations- und Reset-Token werden automatisch durch geplante Datenbankfunktionen bereinigt.

---

## 14. Branchenvergleich

| Eigenschaft | StarArc | Bitwarden | Proton Mail |
|---|---|---|---|
| Clientseitige Verschlüsselung | AES-256-GCM | AES-256-CBC + HMAC | OpenPGP |
| Schlüsselableitung | PBKDF2-SHA256, 600k | PBKDF2/Argon2id, 600k | Bcrypt + SRP |
| Zero-Knowledge-Option | Ja (Sovereignty-Modus) | Ja (Standard) | Ja (Standard) |
| Feldbasierte Verschlüsselung | Ja (pro Feld mit frischem IV) | Vault-basiert | Nachrichten-basiert |
| Wiederherstellung | 6 BIP39-Wörter | Master-Passwort | Wiederherstellungsphrase |
| Web Crypto API (nativ) | Ja | Ja | Teilweise |
| Open Source | Geplant (Krypto-Schicht) | Ja (Client + Server) | Client only |
| Serverzugriff auf Daten | Standard: ja; ZK: nein | Nein | Nein |

### Einordnung

StarArc implementiert dieselben kryptografischen Primitiven wie führende Security-Produkte (Bitwarden, Proton Mail). Der **Sovereignty-Modus** bietet ein Schutzniveau, das mit reinen Zero-Knowledge-Diensten vergleichbar ist, während der **Standard-Modus** einen bewussten Kompromiss zugunsten der Benutzerfreundlichkeit eingeht.

---

## 15. Bekannte Einschränkungen und Transparenz

Wir sind der Überzeugung, dass echte Sicherheit Transparenz erfordert. Daher legen wir bekannte Einschränkungen offen:

### 1. Webbasierte Ende-zu-Ende-Verschlüsselung

Als Webanwendung liefert der Server den JavaScript-Code aus, der die Verschlüsselung durchführt. Nutzer vertrauen darauf, dass der ausgelieferte Code dem entspricht, was dokumentiert ist. Dies ist dieselbe Einschränkung, die auch für Proton Mail und andere webbasierte E2E-Dienste gilt.

**Geplante Mitigation:** Open-Source-Veröffentlichung der Krypto-Schicht zur unabhängigen Überprüfung.

### 2. Standard-Modus: Serverzugriff möglich

Im Standard-Modus hält der Server eine verschlüsselte Kopie des DEK und kann den DEK theoretisch ableiten. Dies ist bewusst so gestaltet, um Komfortfunktionen wie Passwort-Reset zu ermöglichen. Nutzer, die maximale Privatsphäre anstreben, sollten den **Sovereignty-Modus** verwenden.

### 3. PBKDF2 vs. Argon2id

PBKDF2 ist der aktuell verwendete KDF. Argon2id (speicherharter Algorithmus) würde stärkeren Schutz gegen GPU/ASIC-basierte Brute-Force-Angriffe bieten. Eine Migration ist für den Zeitpunkt geplant, zu dem die Web Crypto API Argon2id nativ unterstützt.

### 4. 6-Wort-Wiederherstellungsphrase

Die Wiederherstellungsphrase im Sovereignty-Modus umfasst 6 BIP39-Wörter (~66 Bit Entropie). Dies ist weniger als der 12-Wort-Standard in der Bitcoin-Welt (128 Bit), aber ausreichend für den Zweck der Schlüsselwiederherstellung, da jeder Brute-Force-Versuch 600.000 PBKDF2-Iterationen erfordert.

---

## Kontakt

Für Sicherheitsfragen oder die verantwortungsvolle Meldung von Schwachstellen wenden Sie sich bitte an das StarArc-Team.

---

*Dieses Dokument beschreibt den Stand der Sicherheitsarchitektur zum Zeitpunkt der Veröffentlichung. Die Sicherheitsmaßnahmen werden kontinuierlich weiterentwickelt.*
