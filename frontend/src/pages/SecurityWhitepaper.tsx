import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { useDayMode } from '../contexts/DayModeContext';

const SecurityWhitepaper: React.FC = () => {
  const { t, language } = useLanguage();
  const { dayMode } = useDayMode();
  const isDE = language === 'de';

  const SectionTitle: React.FC<{ number: number; children: React.ReactNode }> = ({ number, children }) => (
    <h2 className={`text-2xl font-semibold mb-6 ${dayMode ? 'text-slate-900' : 'text-white'}`} id={`section-${number}`}>
      {number}. {children}
    </h2>
  );

  const SubTitle: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <h3 className={`text-xl font-semibold mt-8 mb-4 ${dayMode ? 'text-slate-900' : 'text-white'}`}>{children}</h3>
  );

  const P: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <p className={`mb-4 leading-relaxed ${dayMode ? 'text-slate-700' : 'text-gray-300'}`}>{children}</p>
  );

  const Table: React.FC<{ headers: string[]; rows: string[][] }> = ({ headers, rows }) => (
    <div className="overflow-x-auto mb-6">
      <table className={`w-full text-sm text-left border rounded-lg overflow-hidden ${dayMode ? 'border-slate-300' : 'border-gray-700'}`}>
        <thead className={dayMode ? 'bg-slate-200 text-slate-800' : 'bg-gray-800 text-gray-200'}>
          <tr>
            {headers.map((h, i) => (
              <th key={i} className="px-4 py-3 font-medium">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody className={`divide-y ${dayMode ? 'divide-slate-300' : 'divide-gray-700'}`}>
          {rows.map((row, i) => (
            <tr key={i} className={dayMode ? 'bg-white hover:bg-slate-50' : 'bg-gray-900 hover:bg-gray-800/50'}>
              {row.map((cell, j) => (
                <td key={j} className={`px-4 py-3 ${dayMode ? 'text-slate-700' : 'text-gray-300'}`}>{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  const CodeBlock: React.FC<{ children: string }> = ({ children }) => (
    <pre className={`border rounded-lg p-4 mb-6 overflow-x-auto text-sm font-mono whitespace-pre ${dayMode ? 'bg-slate-100 border-slate-300 text-slate-800' : 'bg-gray-950 border-gray-700 text-gray-300'}`}>
      {children}
    </pre>
  );

  const BulletList: React.FC<{ items: string[] }> = ({ items }) => (
    <ul className={`list-disc list-inside space-y-2 ml-4 mb-4 ${dayMode ? 'text-slate-700' : 'text-gray-300'}`}>
      {items.map((item, i) => <li key={i}>{item}</li>)}
    </ul>
  );

  return (
    <div className={`min-h-screen py-20 transition-colors duration-700 ${dayMode ? 'bg-slate-100' : 'bg-gray-900'}`}>
      <div className="max-w-4xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-12 pt-8">
          <div className="inline-flex items-center px-3 py-1 rounded-full bg-green-500/10 text-green-400 text-sm font-medium mb-4">
            🔒 {t('securityWhitepaper.badge')}
          </div>
          <h1 className={`text-4xl font-bold mb-4 ${dayMode ? 'text-slate-900' : 'text-white'}`}>
            {t('securityWhitepaper.title')}
          </h1>
          <p className={`text-lg ${dayMode ? 'text-slate-600' : 'text-gray-400'}`}>
            {t('securityWhitepaper.subtitle')}
          </p>
          <p className={`text-sm mt-2 ${dayMode ? 'text-slate-500' : 'text-gray-500'}`}>
            {t('securityWhitepaper.version')}
          </p>
        </div>

        {/* Content */}
        <div className="prose prose-invert prose-lg max-w-none">

          {/* Section 1 — Summary */}
          <section className="mb-12">
            <SectionTitle number={1}>
              {isDE ? 'Zusammenfassung' : 'Executive Summary'}
            </SectionTitle>
            <P>
              {isDE
                ? 'StarArc ist eine Inventar-Plattform, die aus zwei eng integrierten Anwendungen besteht: StarArc (Authentifizierung, Benutzerverwaltung, Abonnements) und Spaceship (Finanzplanung mit allen Nutzerdaten). Beide Anwendungen nutzen eine mehrschichtige Sicherheitsarchitektur, deren zentrales Element eine clientseitige AES-256-GCM-Verschlüsselung mit Envelope-Key-Management ist.'
                : 'StarArc is an inventory platform consisting of two tightly integrated applications: StarArc (authentication, user management, subscriptions) and Spaceship (financial planning with all user data). Both applications employ a multi-layered security architecture with client-side AES-256-GCM encryption and envelope key management at its core.'}
            </P>
            <SubTitle>{isDE ? 'Kernversprechen' : 'Core Promises'}</SubTitle>
            <BulletList items={isDE ? [
              'Alle persönlichen und finanziellen Daten werden clientseitig verschlüsselt, bevor sie den Server erreichen',
              'Jedes Datenfeld wird einzeln verschlüsselt — mit frischem Zufalls-IV und -Salt pro Verschlüsselung',
              'Kein externer Krypto-Code — ausschließlich die browsernative Web Crypto API (crypto.subtle)',
              'Privacy Login (Zero-Knowledge): Der Server kann die Nutzerdaten unter keinen Umständen entschlüsseln',
              'Moderne Schlüsselableitung: PBKDF2-SHA-256 mit 600.000 Iterationen',
            ] : [
              'All personal and financial data is encrypted client-side before it reaches the server',
              'Every data field is individually encrypted — with fresh random IV and salt per encryption',
              'No external crypto code — exclusively the browser-native Web Crypto API (crypto.subtle)',
              'Privacy Login (Zero-Knowledge): The server cannot decrypt user data under any circumstances',
              'Modern key derivation: PBKDF2-SHA-256 with 600,000 iterations',
            ]} />
          </section>

          {/* Section 2 — Design Philosophy */}
          <section className="mb-12">
            <SectionTitle number={2}>
              {isDE ? 'Designphilosophie' : 'Design Philosophy'}
            </SectionTitle>
            <SubTitle>Security by Design</SubTitle>
            <P>
              {isDE
                ? 'Die Sicherheitsarchitektur ist integraler Bestandteil des Datenmodells. Jede Tabelle, die persönliche Daten speichert, ist von Grund auf mit verschlüsselten Feldern konzipiert.'
                : 'The security architecture is an integral part of the data model. Every table storing personal data is designed from the ground up with encrypted fields.'}
            </P>
            <SubTitle>
              {isDE ? 'Prinzip der minimalen Vertrauensanforderung' : 'Principle of Minimal Trust'}
            </SubTitle>
            <Table
              headers={[
                isDE ? 'Modus' : 'Mode',
                isDE ? 'Vertrauensbedarf gegenüber Server' : 'Trust Required in Server',
              ]}
              rows={[
                [
                  'Privacy Login (Zero-Knowledge)',
                  isDE
                    ? 'Minimal — Server speichert nur verschlüsselte Blobs, ohne die Möglichkeit der Entschlüsselung'
                    : 'Minimal — Server stores only encrypted blobs with no ability to decrypt',
                ],
              ]}
            />
            <SubTitle>
              {isDE ? 'Verschlüsselung als Grundzustand' : 'Encryption as Default State'}
            </SubTitle>
            <P>
              {isDE
                ? 'Alle personenbezogenen und finanziellen Daten werden vor dem Verlassen des Browsers verschlüsselt. Im Klartext verbleiben auf der Datenbank ausschließlich:'
                : 'All personal and financial data is encrypted before leaving the browser. Only the following remain in plaintext in the database:'}
            </P>
            <BulletList items={isDE ? [
              'Primär- und Fremdschlüssel (strukturelle Verknüpfungen)',
              'Kategorie-IDs (nicht die Namen)',
              'Boolsche Konfigurationswerte',
              'Zeitstempel',
              'Verschlüsselungs-Metadaten (Version, Algorithmus)',
              'Nicht-sensible Präferenzwerte (z. B. Währungscode, Zeitzone, Sprache, Datumsformat)',
            ] : [
              'Primary and foreign keys (structural relationships)',
              'Category IDs (not names)',
              'Boolean configuration values',
              'Timestamps',
              'Encryption metadata (version, algorithm)',
              'Non-sensitive preference values (e.g. currency code, timezone, language, date format)',
            ]} />
          </section>

          {/* Section 3 — System Architecture */}
          <section className="mb-12">
            <SectionTitle number={3}>
              {isDE ? 'Systemarchitektur' : 'System Architecture'}
            </SectionTitle>
            <CodeBlock>{`┌──────────────────────────────────────────────────┐
│              ${isDE ? '    Nutzer-Browser' : '     User Browser'}                 │
│  ┌──────────────────┐  ┌───────────────────────┐ │
│  │    StarArc UI     │  │     Spaceship UI      │ │
│  │  (${isDE ? 'Registrierung' : 'Registration'},  │  │  (${isDE ? 'Finanzplanung' : 'Financial planning'},│ │
│  │   Login, 2FA)     │  │   ${isDE ? 'verschlüsselte' : 'encrypted data'}    │ │
│  │                   │  │   ${isDE ? 'Datenverwaltung' : 'management'}${isDE ? '' : '       '})  │ │
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
└──────────────────┘      └──────────────────────┘`}</CodeBlock>
            <BulletList items={isDE ? [
              'Hosting: Heroku EU (Irland) — Daten verbleiben innerhalb der EU',
              'Datenbanken: Getrennte PostgreSQL-Instanzen pro Anwendung — kein gemeinsamer Datenzugriff',
              'Kommunikation: Kurzlebige Cross-App-JWT-Token (5 Minuten Gültigkeit)',
            ] : [
              'Hosting: Heroku EU (Ireland) — data remains within the EU',
              'Databases: Separate PostgreSQL instances per application — no shared data access',
              'Communication: Short-lived cross-app JWT tokens (5-minute validity)',
            ]} />
          </section>

          {/* Section 4 — Encryption Standards */}
          <section className="mb-12">
            <SectionTitle number={4}>
              {isDE ? 'Verschlüsselungsstandards' : 'Encryption Standards'}
            </SectionTitle>
            <Table
              headers={[
                isDE ? 'Komponente' : 'Component',
                isDE ? 'Algorithmus' : 'Algorithm',
                isDE ? 'Parameter' : 'Parameters',
              ]}
              rows={[
                [isDE ? 'Datenverschlüsselung' : 'Data encryption', 'AES-256-GCM', isDE ? '12 Byte IV, 128-Bit Auth-Tag' : '12-byte IV, 128-bit auth tag'],
                [isDE ? 'Schlüsselableitung (KEK)' : 'Key derivation (KEK)', 'PBKDF2-SHA-256', isDE ? '600.000 Iterationen, 32 Byte Salt' : '600,000 iterations, 32-byte salt'],
                [isDE ? 'Passwort-Hashing' : 'Password hashing', 'BCrypt', isDE ? 'Branchenstandard-Kostenfaktor, automatischer Salt' : 'Industry-standard work factor, automatic salt'],
                ['E-Mail-Lookup', 'SHA-256', isDE ? 'E-Mail + App-Salt' : 'Email + app-specific salt'],
                [isDE ? 'Wiederherstellungsphrase' : 'Recovery phrase', 'BIP39', isDE ? '6 Wörter (~66 Bit Entropie)' : '6 words (~66 bits entropy)'],
                ['Cross-App-Token', 'JWT (HMAC-SHA256)', isDE ? '5 Minuten Gültigkeit' : '5-minute validity'],
                [isDE ? 'Kryptografie-API' : 'Crypto API', 'Web Crypto API', isDE ? 'Browsernativ' : 'Browser-native'],
              ]}
            />
            <SubTitle>{isDE ? 'Warum AES-256-GCM?' : 'Why AES-256-GCM?'}</SubTitle>
            <P>
              {isDE
                ? 'AES-256-GCM bietet authentifizierte Verschlüsselung — es schützt gleichzeitig die Vertraulichkeit und die Integrität der Daten. Jede Manipulation verschlüsselter Daten wird beim Entschlüsseln erkannt und abgelehnt. Dies ist der De-facto-Standard für moderne Datenverschlüsselung und wird von Branchenführern wie Apple (iCloud), Signal und Google verwendet.'
                : 'AES-256-GCM provides authenticated encryption — it simultaneously protects data confidentiality and integrity. Any tampering with encrypted data is detected and rejected during decryption. This is the de facto standard for modern data encryption, used by industry leaders like Apple (iCloud), Signal, and Google.'}
            </P>
            <SubTitle>{isDE ? 'Warum Web Crypto API?' : 'Why Web Crypto API?'}</SubTitle>
            <P>
              {isDE
                ? 'Die gesamte clientseitige Kryptografie nutzt ausschließlich crypto.subtle — die vom Browser bereitgestellte, hardwarebeschleunigte Krypto-API:'
                : 'All client-side cryptography exclusively uses crypto.subtle — the hardware-accelerated crypto API provided by the browser:'}
            </P>
            <BulletList items={isDE ? [
              'Keine externen Abhängigkeiten: Kein Risiko durch kompromittierte npm-Pakete',
              'Hardwarebeschleunigung: Nutzung der CPU-AES-Instruktionen',
              'Auditierbar: Der Browser-Code ist open source (Chromium, Firefox)',
              'Sicher gegen Timing-Angriffe: Implementierungen in nativem C/C++',
            ] : [
              'No external dependencies: No risk from compromised npm packages',
              'Hardware acceleration: Uses CPU AES instructions',
              'Auditable: Browser code is open source (Chromium, Firefox)',
              'Safe against timing attacks: Implementations in native C/C++',
            ]} />
          </section>

          {/* Section 5 — Envelope Encryption */}
          <section className="mb-12">
            <SectionTitle number={5}>
              {isDE ? 'Envelope-Verschlüsselung (KEK/DEK)' : 'Envelope Encryption (KEK/DEK)'}
            </SectionTitle>
            <P>
              {isDE
                ? 'StarArc verwendet ein zweistufiges Schlüsselsystem nach dem Envelope-Encryption-Prinzip, wie es auch von AWS KMS, Google Cloud KMS und Apple iCloud eingesetzt wird.'
                : 'StarArc uses a two-tier key system following the envelope encryption principle, also employed by AWS KMS, Google Cloud KMS, and Apple iCloud.'}
            </P>
            <CodeBlock>{isDE
              ? `Nutzer-Passwort (oder Wiederherstellungsphrase)
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
salt ‖ IV ‖ ciphertext ‖ auth-tag (Base64)`
              : `User Password (or Recovery Phrase)
    │
    ▼
PBKDF2 (SHA-256, 600,000 iterations, 32-byte random salt)
    │
    ▼
KEK (Key Encryption Key) — 256-bit, never stored
    │
    ▼
AES-GCM Wrap/Unwrap
    │
    ▼
DEK (Data Encryption Key) — 256-bit, stored only wrapped
    │
    ▼
AES-256-GCM per data field
    │
    ▼
salt ‖ IV ‖ ciphertext ‖ auth-tag (Base64)`}</CodeBlock>
            <SubTitle>{isDE ? 'DEK-Lebenszyklus' : 'DEK Lifecycle'}</SubTitle>
            <BulletList items={isDE ? [
              'Erzeugung: Einmalig bei der Registrierung mittels crypto.subtle.generateKey()',
              'Speicherung: Der DEK wird nie im Klartext gespeichert — es existieren nur verpackte Kopien',
              'Nutzer-Kopie — verpackt mit dem Nutzer-KEK',
              'Wiederherstellungs-Kopie — verpackt mit dem Wiederherstellungs-KEK',
              'Im Browser: Temporär in sessionStorage (wird beim Schließen des Tabs gelöscht)',
              'Zeitlimit: 4 Stunden harte Ablaufzeit mit Aktivitätsüberwachung',
            ] : [
              'Generation: Created once during registration via crypto.subtle.generateKey()',
              'Storage: The DEK is never stored in plaintext — only wrapped copies exist',
              'User copy — wrapped with the user KEK',
              'Recovery copy — wrapped with the recovery KEK',
              'In browser: Temporarily in sessionStorage (cleared when tab closes)',
              'Time limit: 4-hour hard expiry with activity monitoring',
            ]} />
            <SubTitle>{isDE ? 'Warum Envelope Encryption?' : 'Why Envelope Encryption?'}</SubTitle>
            <BulletList items={isDE ? [
              'Schlüsselrotation: Wird der DEK kompromittiert, muss nur der DEK neu verpackt werden — nicht alle Daten neu verschlüsselt',
              'Getrennter Zugriff: Server und Nutzer verwenden unterschiedliche KEKs für denselben DEK',
              'Keine Passwort-Exposition: Das Passwort verlässt den Browser nie — nur der daraus abgeleitete KEK wird verwendet',
            ] : [
              'Key rotation: If the DEK is compromised, only the DEK needs to be re-wrapped — not all data re-encrypted',
              'Separate access: Server and user use different KEKs for the same DEK',
              'No password exposure: The password never leaves the browser — only the derived KEK is used',
            ]} />
          </section>

          {/* Section 6 — Authentication Mode */}
          <section className="mb-12">
            <SectionTitle number={6}>
              {isDE ? 'Authentifizierungsmodus' : 'Authentication Mode'}
            </SectionTitle>
            <SubTitle>Privacy Login (Zero-Knowledge)</SubTitle>
            <CodeBlock>{isDE
              ? `Einrichtung:
  Browser: Privacy-Login-Passwort erstellen (min. 12 Zeichen)
  Browser: 6 BIP39-Wiederherstellungswörter generieren
  Browser: DEK erzeugen
  Browser: Passwort-KEK ableiten → Nutzer-Schlüssel-Kopie
  Browser: Wiederherstellungs-KEK ableiten → Wiederherstellungs-Schlüssel-Kopie
  Browser: Wiederherstellungsphrase mit DEK verschlüsseln
  Browser: Alle verpackten Artefakte an Server senden
           (Der rohe DEK verlässt den Browser NIE)

Anmeldung bei Spaceship:
  Server:  Nutzer-Schlüssel-Kopie + Salt im JWT senden (kein roher DEK)
  Browser: Privacy-Login-Passwort abfragen → KEK ableiten → DEK entpacken`
              : `Setup:
  Browser: Create Privacy Login password (min. 12 characters)
  Browser: Generate 6 BIP39 recovery words
  Browser: Generate DEK
  Browser: Derive password KEK → user-key-copy
  Browser: Derive recovery KEK → recovery-key-copy
  Browser: Encrypt recovery phrase with DEK
  Browser: Send all wrapped artifacts to server
           (Raw DEK NEVER leaves the browser)

Login to Spaceship:
  Server:  Send user-key-copy + salt in JWT (no raw DEK)
  Browser: Prompt for Privacy Login password → derive KEK → unwrap DEK`}</CodeBlock>
            <P><strong>{isDE ? 'Garantien:' : 'Guarantees:'}</strong></P>
            <BulletList items={isDE ? [
              'Server-Schlüssel-Kopie = nicht vorhanden — der Server hat physisch keinen Zugang zu den Daten',
              'Kein Administrator-Passwort-Reset möglich',
              'Wiederherstellung ausschließlich über die 6-Wort-Phrase (clientseitig)',
              'Der Server fungiert als „blinder Tresor" — speichert verschlüsselte Blobs, ohne deren Inhalt zu kennen',
            ] : [
              'Server key copy = absent — the server has physically no access to the data',
              'No administrator password reset possible',
              'Recovery exclusively via 6-word phrase (client-side)',
              'The server acts as a "blind vault" — stores encrypted blobs without knowing their contents',
            ]} />
          </section>

          {/* Section 7 — Field-Level Encryption */}
          <section className="mb-12">
            <SectionTitle number={7}>
              {isDE ? 'Feldbasierte Verschlüsselung' : 'Field-Level Encryption'}
            </SectionTitle>
            <P>
              {isDE
                ? 'Im Gegensatz zu vielen Anwendungen, die Daten auf Container- oder Datenbankebene verschlüsseln, verschlüsselt StarArc jedes sensible Feld einzeln.'
                : 'Unlike many applications that encrypt data at the container or database level, StarArc encrypts every sensitive field individually.'}
            </P>
            <SubTitle>{isDE ? 'Verschlüsselte Datenfelder (Auszug)' : 'Encrypted Data Fields (Excerpt)'}</SubTitle>
            <Table
              headers={[isDE ? 'Anwendung' : 'Application', isDE ? 'Verschlüsselte Felder' : 'Encrypted Fields']}
              rows={[
                ['StarArc', isDE
                  ? 'E-Mail, Name/Alias, 2FA-Geheimnisse, Backup-Codes, Rechtskenntnis-Einwilligungen'
                  : 'Email, name/alias, 2FA secrets, backup codes, legal consent records'],
                ['Spaceship', isDE
                  ? 'Asset-Namen, Werte, Mengen, Währungen, ISINs, Bitcoin-xPubs, Ableitungspfade, Wallet-Details, Familiennamen, Geburtsjahre, Budget-Beträge, Immobilienwerte, Hypotheken, Edelmetallbestände, Seed-Informationen, Kontowerte, Verbindlichkeiten, Standortdaten'
                  : 'Asset names, values, quantities, currencies, ISINs, Bitcoin xPubs, derivation paths, wallet details, family names, birth years, budget amounts, real estate values, mortgages, precious metal holdings, seed information, account values, liabilities, location data'],
              ]}
            />
            <SubTitle>{isDE ? 'Eigenschaften' : 'Properties'}</SubTitle>
            <BulletList items={isDE ? [
              'Frischer Salt (32 Byte) und frischer IV (12 Byte) pro Verschlüsselung',
              'Derselbe Wert ergibt bei zweimaliger Verschlüsselung unterschiedlichen Ciphertext (Schutz vor Musteranalyse)',
              'Selbstbeschreibendes Format: Salt ‖ IV ‖ Ciphertext ‖ Auth-Tag (Base64-kodiert)',
              'Verschlüsselungs-Metadaten pro Datensatz: encryption_version, encryption_algorithm (ermöglicht nahtlose Migration)',
            ] : [
              'Fresh salt (32 bytes) and fresh IV (12 bytes) per encryption',
              'The same value encrypted twice produces different ciphertext (protection against pattern analysis)',
              'Self-describing format: salt ‖ IV ‖ ciphertext ‖ authentication tag (Base64-encoded)',
              'Encryption metadata per record: encryption_version, encryption_algorithm (enables seamless migration)',
            ]} />
            <SubTitle>{isDE ? 'Performance-Optimierung' : 'Performance Optimization'}</SubTitle>
            <P>
              {isDE
                ? 'Der DEK wird beim Login einmalig entpackt und für die Dauer der Sitzung vorgehalten. Einzelne Feld-Operationen verwenden anschließend direkt AES-256-GCM — ohne erneute PBKDF2-Ableitung.'
                : 'The DEK is unwrapped once at login and held for the duration of the session. Individual field operations then use AES-256-GCM directly — without repeated PBKDF2 derivation.'}
            </P>
            <BulletList items={isDE ? [
              'Login: 1× PBKDF2 (600.000 Iterationen) zum DEK-Entpacken',
              'Jede Feld-Operation: Nur AES-256-GCM (hardwarebeschleunigt, Mikrosekunden)',
            ] : [
              'Login: 1× PBKDF2 (600,000 iterations) to unwrap DEK',
              'Each field operation: AES-256-GCM only (hardware-accelerated, microseconds)',
            ]} />
          </section>

          {/* Section 8 — Key Management */}
          <section className="mb-12">
            <SectionTitle number={8}>
              {isDE ? 'Schlüsselverwaltung' : 'Key Management'}
            </SectionTitle>
            <Table
              headers={[
                isDE ? 'Schlüssel' : 'Key',
                isDE ? 'Erzeugung' : 'Generation',
                isDE ? 'Speicherort' : 'Storage',
                isDE ? 'Zugriff' : 'Access',
              ]}
              rows={[
                [isDE ? 'Nutzer-Passwort' : 'User password', isDE ? 'Nutzerwahl' : 'User-chosen', isDE ? 'BCrypt-Hash in DB' : 'BCrypt hash in DB', isDE ? 'Nur Nutzer' : 'User only'],
                [isDE ? 'Privacy-Login-Passwort' : 'Privacy Login password', isDE ? 'Nutzerwahl (min. 12 Zeichen)' : 'User-chosen (min. 12 chars)', isDE ? 'BCrypt-Hash in DB' : 'BCrypt hash in DB', isDE ? 'Nur Nutzer' : 'User only'],
                ['DEK', 'crypto.subtle.generateKey()', isDE ? 'Nur verpackte Kopien' : 'Only wrapped copies', isDE ? 'Nur Nutzer' : 'User only'],
                [isDE ? 'Nutzer-KEK' : 'User KEK', 'PBKDF2(password, salt, 600k)', isDE ? 'Nicht gespeichert' : 'Not stored', isDE ? 'Nur Nutzer' : 'User only'],
                [isDE ? 'Wiederherstellungs-KEK' : 'Recovery KEK', 'PBKDF2(6 words, salt, 600k)', isDE ? 'Nicht gespeichert' : 'Not stored', isDE ? 'Nur Nutzer' : 'User only'],
                [isDE ? 'Wiederherstellungsphrase' : 'Recovery phrase', isDE ? '6 BIP39-Wörter' : '6 BIP39 words', isDE ? 'Mit DEK verschlüsselt in DB' : 'Encrypted with DEK in DB', isDE ? 'Nur Nutzer' : 'User only'],
                ['Admin-Masterkey', isDE ? 'Umgebungsvariable' : 'Environment variable', isDE ? 'Serverumgebung' : 'Server environment', isDE ? 'Nur Serveradministrator' : 'Server admin only'],
                [isDE ? 'Cross-App-Geheimnis' : 'Cross-app secret', isDE ? 'Umgebungsvariable' : 'Environment variable', isDE ? 'Beide Serverumgebungen' : 'Both server environments', isDE ? 'Beide Server' : 'Both servers'],
              ]}
            />
            <SubTitle>{isDE ? 'Schlüsseltrennung' : 'Key Separation'}</SubTitle>
            <P>
              {isDE
                ? 'Kein einzelner Schlüssel gewährt Zugriff auf alle Daten. Das System setzt auf Schlüsseltrennung:'
                : 'No single key grants access to all data. The system relies on key separation:'}
            </P>
            <BulletList items={isDE ? [
              'Der Admin-Masterkey verschlüsselt nur administrative Kopien (E-Mail, Name) — nicht die Finanzdaten',
              'Der DEK verschlüsselt die Nutzerdaten — ist aber ohne den KEK nicht zugänglich',
              'Der KEK existiert nur transient im Speicher — wird nie auf der Festplatte gespeichert',
              'Privacy Login: Selbst eine vollständige Kompromittierung des Servers gibt keinen Zugang zu Nutzerdaten',
            ] : [
              'The admin master key encrypts only administrative copies (email, name) — not financial data',
              'The DEK encrypts user data — but is inaccessible without the KEK',
              'The KEK exists only transiently in memory — never stored on disk',
              'Privacy Login: Even a complete server compromise provides no access to user data',
            ]} />
          </section>

          {/* Section 9 — 2FA */}
          <section className="mb-12">
            <SectionTitle number={9}>
              {isDE ? 'Zwei-Faktor-Authentifizierung' : 'Two-Factor Authentication'}
            </SectionTitle>
            <P>
              {isDE
                ? 'StarArc bietet TOTP-basierte Zwei-Faktor-Authentifizierung (kompatibel mit Google Authenticator, Authy, etc.):'
                : 'StarArc offers TOTP-based two-factor authentication (compatible with Google Authenticator, Authy, etc.):'}
            </P>
            <BulletList items={isDE ? [
              'Algorithmus: TOTP (RFC 6238) mit 30-Sekunden-Intervall',
              'Toleranz: ±1 Intervall (30 Sekunden Kulanzzeit)',
              'Backup-Codes: 10 Codes mit je 8 kryptografisch zufälligen Hex-Zeichen',
              '2FA-Geheimnisse werden verschlüsselt gespeichert (AES-256-GCM) — nie im Klartext',
              'Sicherheits-E-Mails bei Aktivierung und Deaktivierung von 2FA',
            ] : [
              'Algorithm: TOTP (RFC 6238) with 30-second interval',
              'Tolerance: ±1 interval (30-second grace period)',
              'Backup codes: 10 codes with 8 cryptographically random hex characters each',
              '2FA secrets are stored encrypted (AES-256-GCM) — never in plaintext',
              'Security emails on 2FA activation and deactivation',
            ]} />
          </section>

          {/* Section 10 — Cross-App Security */}
          <section className="mb-12">
            <SectionTitle number={10}>
              {isDE ? 'Cross-App-Sicherheit' : 'Cross-App Security'}
            </SectionTitle>
            <P>
              {isDE
                ? 'Die Kommunikation zwischen StarArc und Spaceship erfolgt über signierte, kurzlebige JWT-Token:'
                : 'Communication between StarArc and Spaceship uses signed, short-lived JWT tokens:'}
            </P>
            <Table
              headers={[isDE ? 'Eigenschaft' : 'Property', isDE ? 'Wert' : 'Value']}
              rows={[
                [isDE ? 'Algorithmus' : 'Algorithm', 'HMAC-SHA256'],
                [isDE ? 'Gültigkeit' : 'Validity', isDE ? '5 Minuten' : '5 minutes'],
                [isDE ? 'Dateninhalt' : 'Payload', isDE ? 'User-ID, Auth-Methode, verschlüsselte DEK-Daten' : 'User ID, auth method, encrypted DEK data'],
              ]}
            />
            <SubTitle>{isDE ? 'Privacy-Login-Transport' : 'Privacy Login Transport'}</SubTitle>
            <BulletList items={isDE ? [
              'StarArc sendet Nutzer-Schlüssel-Kopie + Salt im JWT (kein roher DEK)',
              'Spaceship fordert das Privacy-Login-Passwort vom Nutzer',
              'Client leitet KEK ab → entpackt DEK',
              'Kein nahtloser Login — by Design',
            ] : [
              'StarArc sends user-key-copy + salt in the JWT (no raw DEK)',
              'Spaceship prompts the user for the Privacy Login password',
              'Client derives KEK → unwraps DEK',
              'No seamless login — by design',
            ]} />
          </section>

          {/* Section 11 — Transport & Infrastructure Security */}
          <section className="mb-12">
            <SectionTitle number={11}>
              {isDE ? 'Transport- und Infrastruktursicherheit' : 'Transport and Infrastructure Security'}
            </SectionTitle>

            <SubTitle>{isDE ? 'HTTPS-Erzwingung' : 'HTTPS Enforcement'}</SubTitle>
            <P>
              {isDE
                ? 'Beide Anwendungen erzwingen HTTPS in der Produktion mit permanenter 301-Weiterleitung und HSTS (Strict-Transport-Security: max-age=31536000; includeSubDomains; preload).'
                : 'Both applications enforce HTTPS in production with permanent 301 redirects and HSTS (Strict-Transport-Security: max-age=31536000; includeSubDomains; preload).'}
            </P>

            <SubTitle>HTTP Security Headers</SubTitle>
            <P>
              {isDE
                ? 'Beide Anwendungen nutzen Helmet.js mit folgenden Headerschutzmaßnahmen:'
                : 'Both applications use Helmet.js with the following header protections:'}
            </P>
            <Table
              headers={['Header', isDE ? 'Funktion' : 'Function']}
              rows={[
                ['Content-Security-Policy', isDE ? 'Strenge Whitelist für Script-, Style-, Font- und Verbindungsquellen' : 'Strict whitelist for script, style, font, and connection sources'],
                ['X-Frame-Options', isDE ? 'Schutz vor Clickjacking' : 'Clickjacking protection'],
                ['X-Content-Type-Options', isDE ? 'Verhindert MIME-Type-Sniffing' : 'Prevents MIME type sniffing'],
                ['Referrer-Policy', isDE ? 'Kontrollierter Referrer-Informationsfluss' : 'Controlled referrer information flow'],
                ['Strict-Transport-Security', isDE ? 'HTTPS-Erzwingung (1 Jahr, Subdomains, Preload)' : 'HTTPS enforcement (1 year, subdomains, preload)'],
              ]}
            />

            <SubTitle>Rate Limiting</SubTitle>
            <Table
              headers={[isDE ? 'Kategorie' : 'Category', 'StarArc', 'Spaceship']}
              rows={[
                [isDE ? 'Globale API' : 'Global API', isDE ? 'Aktiv' : 'Enforced', isDE ? 'Aktiv' : 'Enforced'],
                ['Login', isDE ? 'Striktes Limit' : 'Strict limit', '—'],
                [isDE ? 'Registrierung' : 'Registration', isDE ? 'Striktes Limit' : 'Strict limit', '—'],

              ]}
            />

            <SubTitle>CORS</SubTitle>
            <P>
              {isDE
                ? 'Beide Anwendungen verwenden explizite Origin-Whitelists (kein origin: \'*\'). Nur bekannte Produktions-Domains und Entwicklungsumgebungen sind zugelassen.'
                : 'Both applications use explicit origin whitelists (no origin: \'*\'). Only known production domains and development environments are allowed.'}
            </P>

            <SubTitle>{isDE ? 'SQL-Injection-Schutz' : 'SQL Injection Protection'}</SubTitle>
            <P>
              {isDE
                ? 'Alle Benutzereingaben werden über pg (node-postgres) mit $1, $2, ... Platzhaltern parametrisiert. Tabellen- und Spaltennamen stammen aus serverseitigen Whitelists und werden nie aus Benutzereingaben interpoliert.'
                : 'All user inputs are parameterized via pg (node-postgres) with $1, $2, ... placeholders. Table and column names are sourced from server-side whitelists and are never interpolated from user input.'}
            </P>

            <SubTitle>{isDE ? 'Eingabevalidierung' : 'Input Validation'}</SubTitle>
            <P>
              {isDE
                ? 'StarArc verwendet express-validator für konsistente, deklarative Eingabevalidierung: E-Mail-Normalisierung, Passwort-Komplexität, Typ-Prüfungen und Längen-Beschränkungen.'
                : 'StarArc uses express-validator for consistent, declarative input validation: email normalization, password complexity, type checks, and length constraints.'}
            </P>
          </section>

          {/* Section 12 — Browser Security */}
          <section className="mb-12">
            <SectionTitle number={12}>
              {isDE ? 'Browsersicherheit' : 'Browser Security'}
            </SectionTitle>
            <Table
              headers={[isDE ? 'Maßnahme' : 'Measure', 'Details']}
              rows={[
                [isDE ? 'Kryptografie' : 'Cryptography', isDE ? 'Ausschließlich crypto.subtle (Web Crypto API)' : 'Exclusively crypto.subtle (Web Crypto API)'],
                [isDE ? 'Schlüsselspeicherung' : 'Key storage', isDE ? 'DEK nur in sessionStorage (gelöscht bei Tab-Schließung)' : 'DEK only in sessionStorage (cleared on tab close)'],
                [isDE ? 'Sitzungszeitlimit' : 'Session timeout', isDE ? '4 Stunden harte Ablaufzeit' : '4-hour hard expiry'],
                [isDE ? 'Aktivitätsüberwachung' : 'Activity monitoring', isDE ? 'Mausbewegung, Tastendruck, Scrollen, Touch, Klick' : 'Mouse movement, keypress, scroll, touch, click'],
                [isDE ? 'Kein persistenter Schlüssel' : 'No persistent key', isDE ? 'DEK wird nie in localStorage gespeichert' : 'DEK is never stored in localStorage'],
                [isDE ? 'Nur HTTPS' : 'HTTPS only', isDE ? 'Gesamte Kommunikation TLS-verschlüsselt' : 'All communication TLS-encrypted'],
              ]}
            />
            <SubTitle>Session Lifecycle</SubTitle>
            <CodeBlock>{isDE
              ? `Login → PBKDF2 (600k) → KEK → DEK entpacken
  → sessionStorage (verschlüsselter Schlüssel-Blob)
  → Aktivitäts-Timer startet (4h)

Nutzer aktiv → Timer zurücksetzen
Nutzer inaktiv >4h → DEK aus Speicher löschen → Re-Login
Tab schließen → sessionStorage automatisch gelöscht`
              : `Login → PBKDF2 (600k) → KEK → unwrap DEK
  → sessionStorage (encrypted key blob)
  → Activity timer starts (4h)

User active → Timer resets
User inactive >4h → DEK cleared from memory → Re-login
Tab close → sessionStorage automatically cleared`}</CodeBlock>
          </section>

          {/* Section 13 — GDPR */}
          <section className="mb-12">
            <SectionTitle number={13}>
              {isDE ? 'Datenschutz und DSGVO' : 'Data Protection and GDPR'}
            </SectionTitle>
            <SubTitle>{isDE ? 'Datenstandort' : 'Data Location'}</SubTitle>
            <P>
              {isDE
                ? 'Alle Daten werden auf Heroku EU (Irland) verarbeitet und gespeichert. Es findet keine Datenübertragung außerhalb der EU statt.'
                : 'All data is processed and stored on Heroku EU (Ireland). No data transfer outside the EU takes place.'}
            </P>
            <SubTitle>{isDE ? 'Datenlöschung' : 'Data Deletion'}</SubTitle>
            <BulletList items={isDE ? [
              'Spaceship: Kaskadierende Löschung über 20+ Tabellen in korrekter Fremdschlüssel-Reihenfolge',
              'StarArc: Automatisierte Anonymisierungsfunktion anonymisiert alle personenbezogenen Felder, löscht Zahlungsinformationen und deaktiviert Zugangsschlüssel',
            ] : [
              'Spaceship: Cascading deletion across 20+ tables in correct foreign key order',
              'StarArc: An automated anonymization function anonymizes all personal fields, deletes payment information, and deactivates access keys',
            ]} />
            <SubTitle>{isDE ? 'Einwilligungsnachverfolgung (Art. 7 DSGVO)' : 'Consent Tracking (Art. 7 GDPR)'}</SubTitle>
            <P>
              {isDE
                ? 'Einwilligungszeitpunkte, -versionen und dazugehörige Metadaten werden verschlüsselt gespeichert — für den Nachweis der rechtmäßigen Einwilligung gemäß Art. 7 DSGVO.'
                : 'Consent timestamps, versions, and associated metadata are stored encrypted — for demonstrating lawful consent per Art. 7 GDPR.'}
            </P>
            <SubTitle>{isDE ? 'Automatische Bereinigung' : 'Automatic Cleanup'}</SubTitle>
            <P>
              {isDE
                ? 'Abgelaufene Verifikations- und Reset-Token werden automatisch durch geplante Datenbankfunktionen bereinigt.'
                : 'Expired verification and reset tokens are automatically cleaned up by scheduled database functions.'}
            </P>
          </section>

          {/* Section 14 — Industry Comparison */}
          <section className="mb-12">
            <SectionTitle number={14}>
              {isDE ? 'Branchenvergleich' : 'Industry Comparison'}
            </SectionTitle>
            <Table
              headers={[isDE ? 'Eigenschaft' : 'Feature', 'StarArc', 'Bitwarden', 'Proton Mail']}
              rows={[
                [isDE ? 'Clientseitige Verschlüsselung' : 'Client-side encryption', 'AES-256-GCM', 'AES-256-CBC + HMAC', 'OpenPGP'],
                [isDE ? 'Schlüsselableitung' : 'Key derivation', 'PBKDF2-SHA256, 600k', 'PBKDF2/Argon2id, 600k', 'Bcrypt + SRP'],
                ['Zero-Knowledge', isDE ? 'Ja (Privacy Login)' : 'Yes (Privacy Login)', isDE ? 'Ja (Standard)' : 'Yes (default)', isDE ? 'Ja (Standard)' : 'Yes (default)'],
                [isDE ? 'Feldbasierte Verschlüsselung' : 'Field-level encryption', isDE ? 'Ja (pro Feld, frischer IV)' : 'Yes (per field, fresh IV)', 'Vault-' + (isDE ? 'basiert' : 'based'), isDE ? 'Nachrichten-basiert' : 'Message-based'],
                [isDE ? 'Wiederherstellung' : 'Recovery', isDE ? '6 BIP39-Wörter' : '6 BIP39 words', 'Master-' + (isDE ? 'Passwort' : 'password'), isDE ? 'Wiederherstellungsphrase' : 'Recovery phrase'],
                ['Web Crypto API', isDE ? 'Ja' : 'Yes', isDE ? 'Ja' : 'Yes', isDE ? 'Teilweise' : 'Partial'],
                ['Open Source', isDE ? 'Geplant (Krypto-Schicht)' : 'Planned (crypto layer)', isDE ? 'Ja (Client + Server)' : 'Yes (client + server)', 'Client only'],
                [isDE ? 'Serverzugriff' : 'Server access', isDE ? 'Nein' : 'No', isDE ? 'Nein' : 'No', isDE ? 'Nein' : 'No'],
              ]}
            />
            <P>
              {isDE
                ? 'StarArc implementiert dieselben kryptografischen Primitiven wie führende Security-Produkte. Das Privacy Login bietet ein Schutzniveau, das mit reinen Zero-Knowledge-Diensten vergleichbar ist.'
                : 'StarArc implements the same cryptographic primitives as leading security products. Privacy Login provides a protection level comparable to pure zero-knowledge services.'}
            </P>
          </section>

          {/* Section 15 — Known Limitations */}
          <section className="mb-12">
            <SectionTitle number={15}>
              {isDE ? 'Bekannte Einschränkungen und Transparenz' : 'Known Limitations and Transparency'}
            </SectionTitle>
            <P>
              {isDE
                ? 'Wir sind der Überzeugung, dass echte Sicherheit Transparenz erfordert. Daher legen wir bekannte Einschränkungen offen:'
                : 'We believe that true security requires transparency. Therefore, we disclose known limitations:'}
            </P>

            <SubTitle>
              {isDE ? '1. Webbasierte Ende-zu-Ende-Verschlüsselung' : '1. Web-Based End-to-End Encryption'}
            </SubTitle>
            <P>
              {isDE
                ? 'Als Webanwendung liefert der Server den JavaScript-Code aus, der die Verschlüsselung durchführt. Nutzer vertrauen darauf, dass der ausgelieferte Code dem entspricht, was dokumentiert ist. Dies ist dieselbe Einschränkung, die auch für Proton Mail und andere webbasierte E2E-Dienste gilt. Geplante Mitigation: Open-Source-Veröffentlichung der Krypto-Schicht.'
                : 'As a web application, the server delivers the JavaScript code that performs the encryption. Users trust that the delivered code matches what is documented. This is the same limitation that applies to Proton Mail and other web-based E2E services. Planned mitigation: Open-source release of the crypto layer.'}
            </P>

            <SubTitle>
              {isDE ? '2. PBKDF2 vs. Argon2id' : '2. PBKDF2 vs. Argon2id'}
            </SubTitle>
            <P>
              {isDE
                ? 'PBKDF2 ist der aktuell verwendete KDF. Argon2id (speicherharter Algorithmus) würde stärkeren Schutz gegen GPU/ASIC-basierte Brute-Force-Angriffe bieten. Eine Migration ist für den Zeitpunkt geplant, zu dem die Web Crypto API Argon2id nativ unterstützt.'
                : 'PBKDF2 is the currently used KDF. Argon2id (memory-hard algorithm) would provide stronger protection against GPU/ASIC-based brute force attacks. A migration is planned for when the Web Crypto API natively supports Argon2id.'}
            </P>

            <SubTitle>
              {isDE ? '3. 6-Wort-Wiederherstellungsphrase' : '3. 6-Word Recovery Phrase'}
            </SubTitle>
            <P>
              {isDE
                ? 'Die Wiederherstellungsphrase im Privacy Login umfasst 6 BIP39-Wörter (~66 Bit Entropie). Dies ist weniger als der 12-Wort-Standard in der Bitcoin-Welt (128 Bit), aber ausreichend für den Zweck der Schlüsselwiederherstellung, da jeder Brute-Force-Versuch 600.000 PBKDF2-Iterationen erfordert.'
                : 'The Privacy Login recovery phrase comprises 6 BIP39 words (~66 bits entropy). This is less than the 12-word standard in the Bitcoin world (128 bits), but sufficient for key recovery purposes since each brute force attempt requires 600,000 PBKDF2 iterations.'}
            </P>
          </section>

          {/* Section 16 — Future Roadmap */}
          <section className="mb-12">
            <SectionTitle number={16}>
              {isDE ? 'Zukunftsplanung' : 'Future Roadmap'}
            </SectionTitle>
            <Table
              headers={[isDE ? 'Maßnahme' : 'Measure', 'Status']}
              rows={[
                [isDE ? 'Open-Source-Krypto-Schicht' : 'Open-source crypto layer', isDE ? 'Geplant' : 'Planned'],
                [isDE ? 'Migration zu Argon2id' : 'Migration to Argon2id', isDE ? 'Vorbereitet' : 'Prepared'],
                [isDE ? 'Automatisierte Dependency-Sicherheitsscans' : 'Automated dependency security scans', isDE ? 'Geplant' : 'Planned'],
                [isDE ? 'Self-Service-Kontolöschung' : 'Self-service account deletion', isDE ? 'In Entwicklung' : 'In development'],
                [isDE ? 'Externe Sicherheitsaudits' : 'External security audits', isDE ? 'Geplant' : 'Planned'],
              ]}
            />
          </section>

          {/* Contact */}
          <section className="mb-12 text-center">
            <div className={`border rounded-lg p-8 ${dayMode ? 'border-slate-300 bg-slate-200/50' : 'border-gray-700 bg-gray-800/30'}`}>
              <h3 className={`text-xl font-semibold mb-4 ${dayMode ? 'text-slate-900' : 'text-white'}`}>
                {isDE ? 'Kontakt' : 'Contact'}
              </h3>
              <P>
                {isDE
                  ? 'Für Sicherheitsfragen oder die verantwortungsvolle Meldung von Schwachstellen wenden Sie sich bitte an:'
                  : 'For security questions or responsible vulnerability disclosure, please contact:'}
              </P>
              <a href="mailto:info@stararc.one" className="text-primary-400 hover:text-primary-300 transition-colors">
                info@stararc.one
              </a>
            </div>
          </section>

          {/* Footer note */}
          <p className={`text-sm text-center italic ${dayMode ? 'text-slate-500' : 'text-gray-500'}`}>
            {isDE
              ? 'Dieses Dokument beschreibt den Stand der Sicherheitsarchitektur zum Zeitpunkt der Veröffentlichung (März 2026). Die Sicherheitsmaßnahmen werden kontinuierlich weiterentwickelt.'
              : 'This document describes the state of the security architecture at the time of publication (March 2026). Security measures are continuously evolving.'}
          </p>

        </div>
      </div>
    </div>
  );
};

export default SecurityWhitepaper;
