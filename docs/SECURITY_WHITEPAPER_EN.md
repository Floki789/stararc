# StarArc Security Whitepaper

**Version 1.0 — March 2026**
**Authors:** Archimedes Apps

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Design Philosophy](#2-design-philosophy)
3. [System Architecture](#3-system-architecture)
4. [Encryption Standards](#4-encryption-standards)
5. [Envelope Encryption (KEK/DEK)](#5-envelope-encryption-kekdek)
6. [Authentication Modes](#6-authentication-modes)
7. [Field-Level Encryption](#7-field-level-encryption)
8. [Key Management](#8-key-management)
9. [Two-Factor Authentication](#9-two-factor-authentication)
10. [Cross-App Security](#10-cross-app-security)
11. [Transport and Infrastructure Security](#11-transport-and-infrastructure-security)
12. [Browser Security](#12-browser-security)
13. [Data Protection and GDPR](#13-data-protection-and-gdpr)
14. [Industry Comparison](#14-industry-comparison)
15. [Known Limitations and Transparency](#15-known-limitations-and-transparency)

---

## 1. Executive Summary

StarArc is a personal finance platform consisting of two tightly integrated applications: **StarArc** (authentication, user management, subscriptions) and **Spaceship** (financial planning with all user data). Both applications employ a multi-layered security architecture with **client-side AES-256-GCM encryption and envelope key management** at its core.

### Core Promises

- **All personal and financial data is encrypted client-side** before it reaches the server
- **Every data field is individually encrypted** — with fresh random IV and salt per encryption
- **No external crypto code** — exclusively the browser-native Web Crypto API (`crypto.subtle`)
- **Sovereignty Mode (Zero-Knowledge):** The server cannot decrypt user data under any circumstances
- **Modern key derivation:** PBKDF2-SHA-256 with 600,000 iterations

---

## 2. Design Philosophy

### Security by Design

The security architecture was not bolted on retroactively but is an integral part of the data model. Every table storing personal data is designed from the ground up with encrypted fields.

### Principle of Minimal Trust

StarArc aims to minimize the required trust in the server operator:

| Mode | Trust Required in Server |
|---|---|
| **Standard Login** | Moderate — Server can decrypt when needed (for convenience features like password reset) |
| **Sovereignty (Zero-Knowledge)** | Minimal — Server stores only encrypted blobs with no ability to decrypt |

Users choose which model suits their requirements.

### Encryption as Default State

All personal and financial data is encrypted **before leaving the browser**. Only the following remain in plaintext in the database:

- Primary and foreign keys (structural relationships)
- Category IDs (not names)
- Boolean configuration values
- Timestamps
- Encryption metadata (version, algorithm, IV, salt)
- Functional metadata with low privacy relevance, for example:
  - Currency codes (e.g. `CHF`, `EUR`, `USD`)
  - Data source type (e.g. `manual`, `import`, `csv`)
  - Update reminder interval (e.g. `monthly`, `quarterly`)
  - Scenario type for projections (e.g. `conservative`, `optimistic`)
  - Processing and import status flags (e.g. `pending`, `completed`)

---

## 3. System Architecture

```
┌──────────────────────────────────────────────────┐
│                   User Browser                   │
│  ┌──────────────────┐  ┌───────────────────────┐ │
│  │    StarArc UI     │  │     Spaceship UI      │ │
│  │  (Registration,   │  │  (Financial planning, │ │
│  │   Login, 2FA)     │  │   encrypted data      │ │
│  │                   │  │   management)          │ │
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

- **Hosting:** Heroku EU (Ireland) — data remains within the EU
- **Databases:** Separate PostgreSQL instances per application — no shared data access
- **Communication:** Short-lived cross-app JWT tokens (5-minute validity)

---

## 4. Encryption Standards

| Component | Algorithm | Parameters |
|---|---|---|
| Data encryption | **AES-256-GCM** | 12-byte IV, 128-bit authentication tag |
| User key derivation (KEK) | **PBKDF2-SHA-256** | 600,000 iterations, 32-byte random salt |
| Password hashing | **BCrypt** | Industry-standard work factor, automatic salt |
| Email lookup | **SHA-256** | Email + application-specific salt |
| Recovery phrase | **BIP39 wordlist** | 6 words from 2,048-word list (~66 bits entropy) |
| Cross-app token | **JWT (HMAC-SHA256)** | 5-minute validity |
| Cryptography API | **Web Crypto API** | Browser-native, no external libraries |

### Why AES-256-GCM?

AES-256-GCM provides **authenticated encryption** — it simultaneously protects data confidentiality and integrity. Any tampering with encrypted data is detected and rejected during decryption. This is the de facto standard for modern data encryption, used by industry leaders like Apple (iCloud), Signal, and Google.

### Why Web Crypto API?

All client-side cryptography exclusively uses `crypto.subtle` — the hardware-accelerated crypto API provided by the browser. Benefits:

- **No external dependencies:** No risk from compromised npm packages
- **Hardware acceleration:** Uses CPU AES instructions
- **Auditable:** Browser code is open source (Chromium, Firefox)
- **Safe against timing attacks:** Implementations in native C/C++

---

## 5. Envelope Encryption (KEK/DEK)

StarArc uses a **two-tier key system** following the envelope encryption principle, also employed by AWS KMS, Google Cloud KMS, and Apple iCloud.

```
User Password (or Recovery Phrase)
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
DEK (Data Encryption Key) — 256-bit, stored only in wrapped form
    │
    ▼
AES-256-GCM per data field
    │
    ▼
salt ‖ IV ‖ ciphertext ‖ authentication tag (Base64-encoded)
```

### DEK Lifecycle

1. **Generation:** Created once during registration via `crypto.subtle.generateKey('AES-GCM', 256)`
2. **Storage:** The DEK is **never stored in plaintext** — only wrapped copies exist
3. **Wrapped copies:**
   - User copy — wrapped with the user KEK (both modes)
   - Server copy — wrapped with the server KEK (Standard mode only; absent in Sovereignty mode)
   - Recovery copy — wrapped with the recovery KEK (Sovereignty mode only)
4. **In browser:** Temporarily in `sessionStorage` (cleared when tab closes)
5. **Time limit:** 4-hour hard expiry with activity monitoring

### Why Envelope Encryption?

- **Key rotation:** If the DEK is compromised, only the DEK needs to be re-wrapped — not all data re-encrypted
- **Separate access:** Server and user use different KEKs for the same DEK
- **No password exposure:** The password never leaves the browser — only the derived KEK is used

---

## 6. Authentication Modes

### 6a. Standard Login

```
Registration:
  Browser: Generate DEK → derive KEK from password → wrap DEK
  Browser: Send raw DEK + user-key-copy + salt to server (one-time)
  Server:  Derive server KEK → create server-key-copy → discard raw DEK

Login to Spaceship:
  Server:  Unwrap DEK via server-key-copy → encrypt for transport → JWT
  Browser: Decrypt DEK from JWT → sessionStorage → seamless access
```

**Advantages:**
- Seamless login experience — no second password needed
- Administrator password reset possible
- Convenient for users who trust the server operator

**Trade-off:** The server holds an encrypted copy of the DEK and can derive the DEK when needed. This is intentional to enable convenience features.

### 6b. Sovereignty (Zero-Knowledge) Mode

```
Setup:
  Browser: Create Sovereignty password (min. 12 characters)
  Browser: Generate 6 BIP39 recovery words
  Browser: Generate DEK
  Browser: Derive password KEK → user-key-copy
  Browser: Derive recovery KEK → recovery-key-copy
  Browser: Encrypt recovery phrase with DEK
  Browser: Send all wrapped artifacts to server
           (Raw DEK NEVER leaves the browser)

Login to Spaceship:
  Server:  Send user-key-copy + salt in JWT (no raw DEK)
  Browser: Prompt for Sovereignty password → derive KEK → unwrap DEK
```

**Guarantees:**
- Server key copy = absent — the server has physically no access to the data
- No administrator password reset possible
- Recovery exclusively via 6-word phrase (client-side)
- The server acts as a "blind vault" — stores encrypted blobs without knowing their contents

---

## 7. Field-Level Encryption

Unlike many applications that encrypt data at the container or database level, StarArc encrypts **every sensitive field individually**.

### Encrypted Data Fields (Excerpt)

| Application | Encrypted Fields |
|---|---|
| **StarArc** | Email, name/alias, 2FA secrets, backup codes, legal consent records |
| **Spaceship** | Asset names, values, quantities, currencies, ISINs, Bitcoin xPubs, derivation paths, wallet details, family names, birth years, budget amounts, real estate values, mortgages, precious metal holdings, seed information, hardware serial numbers, account values, liabilities, location data |

### Properties

- **Fresh salt** (32 bytes) and **fresh IV** (12 bytes) per encryption
- The same value encrypted twice produces **different ciphertext** (protection against pattern analysis)
- **Self-describing format:** salt ‖ IV ‖ ciphertext ‖ authentication tag (Base64-encoded)
- **Encryption metadata** per record: `encryption_version: 1`, `encryption_algorithm: "AES-256-GCM"` (enables seamless migration during algorithm updates)

### Performance Optimization

The DEK is unwrapped once at login and held for the duration of the session. Individual field operations then use AES-256-GCM directly — without repeated PBKDF2 derivation:

- **Login:** 1× PBKDF2 (600,000 iterations) to unwrap DEK
- **Each field operation:** AES-256-GCM only (hardware-accelerated, microseconds)

---

## 8. Key Management

| Key | Generation | Storage | Access |
|---|---|---|---|
| User password | User-chosen | BCrypt hash in DB | User only |
| Sovereignty password | User-chosen (min. 12 chars) | BCrypt hash in DB | User only |
| DEK | `crypto.subtle.generateKey()` | Only as wrapped copies | Standard: user + server; ZK: user only |
| User KEK | PBKDF2(password, salt, 600k) | Not stored; derived on demand | User only |
| Server KEK | PBKDF2(server secret, user salt) | Not stored; derived on demand | Server only |
| Recovery KEK | PBKDF2(6 words, salt, 600k) | Not stored; derived on demand | User only |
| Recovery phrase | 6 random BIP39 words | Encrypted with DEK in DB | User only |
| Admin master key | Environment variable | Server environment | Server admin only |
| Cross-app secret | Environment variable | Both server environments | Both servers |

### Key Separation

No single key grants access to all data. The system relies on **key separation**:

- The **admin master key** encrypts only administrative copies (email, name) — not financial data
- The **DEK** encrypts user data — but is inaccessible without the KEK
- The **KEK** exists only transiently in memory — never stored on disk
- **Sovereignty mode:** Even a complete server compromise provides no access to user data

---

## 9. Two-Factor Authentication

StarArc offers TOTP-based two-factor authentication (compatible with Google Authenticator, Authy, etc.):

- **Algorithm:** TOTP (RFC 6238) with 30-second interval
- **Tolerance:** ±1 interval (30-second grace period)
- **Backup codes:** 10 codes with 8 cryptographically random hex characters each
- **Storage:** 2FA secrets are stored **encrypted** in the database (AES-256-GCM) — never in plaintext
- **Notifications:** Security emails on 2FA activation and deactivation

---

## 10. Cross-App Security

Communication between StarArc and Spaceship uses signed, short-lived JWT tokens:

| Property | Value |
|---|---|
| Algorithm | HMAC-SHA256 |
| Validity | 5 minutes |
| Shared secret | Environment variable (server-side only) |
| Payload | User ID, auth method, encrypted DEK data |

### Standard Mode Transport

1. StarArc unwraps the DEK server-side
2. Encrypts the DEK with a random one-time key for transport
3. Signs the JWT with: auth key, auth method, encrypted DEK data
4. Spaceship decrypts the DEK → seamless access

### Sovereignty Mode Transport

1. StarArc sends the user key copy + salt in the JWT (no raw DEK)
2. Spaceship prompts the user for the Sovereignty password
3. Client derives KEK → unwraps DEK
4. No seamless login — by design

---

## 11. Transport and Infrastructure Security

### HTTPS Enforcement

Both applications enforce HTTPS in production with permanent 301 redirects:
- **HSTS:** `Strict-Transport-Security: max-age=31536000; includeSubDomains; preload`
- Heroku reverse proxy correctly respected with `trust proxy = 1`

### HTTP Security Headers

Both applications use [Helmet.js](https://helmetjs.github.io/) with the following header protections:

| Header | Function |
|---|---|
| `Content-Security-Policy` | Strict whitelist for script, style, font, and connection sources |
| `X-Frame-Options` | Clickjacking protection |
| `X-Content-Type-Options: nosniff` | Prevents MIME type sniffing |
| `Referrer-Policy` | Controlled referrer information flow |
| `X-XSS-Protection` | Browser XSS filter |
| `Strict-Transport-Security` | HTTPS enforcement (1 year, including subdomains, preload) |

The Content Security Policy is tailored per application:
- **StarArc:** Allows `js.stripe.com` and `api.stripe.com` for payment processing
- **Spaceship:** Blocks all frames (`frame-src: 'none'`) and plugins (`object-src: 'none'`)

### Rate Limiting

| Category | StarArc | Spaceship |
|---|---|---|
| Global API | Enforced | Enforced |
| Login | Strict limit | — |
| Registration | Strict limit | — |

### CORS

Both applications use **explicit origin whitelists** (no `origin: '*'`):
- Only known production domains and development environments are allowed
- `credentials: true` for secure cookie/token transmission
- Preflight cache: 24 hours

### SQL Injection Protection

**100% parameterized queries** in both applications via `pg` (node-postgres) with `$1, $2, ...` placeholders. **No string concatenation** in SQL queries.

```sql
-- Example: Parameterized query
SELECT * FROM users WHERE id = $1    -- ✓ Secure
SELECT * FROM users WHERE id = '...' -- ✗ Not used
```

### Input Validation

StarArc uses `express-validator` for consistent, declarative input validation:

- Email normalization and validation
- Password complexity (minimum length, upper/lowercase, digits)
- Type checks (boolean, enum values)
- Length constraints

---

## 12. Browser Security

| Measure | Details |
|---|---|
| **Cryptography** | Exclusively `crypto.subtle` (Web Crypto API) — no external JS crypto libraries |
| **Key storage** | DEK only in `sessionStorage` (cleared on tab close) |
| **Session timeout** | 4-hour hard expiry |
| **Activity monitoring** | Detection of: mouse movement, keypress, scroll, touch, click |
| **No persistent key** | DEK is never stored in `localStorage` |
| **HTTPS only** | All communication TLS-encrypted |

### Session Lifecycle

```
Login → PBKDF2 (600k) → KEK → unwrap DEK
    → sessionStorage (encrypted key blob)
    → Activity timer starts (4h)

User active → Timer resets
User inactive >4h → DEK cleared from memory → Re-login required
Tab close → sessionStorage automatically cleared
```

---

## 13. Data Protection and GDPR

### Data Location

All data is processed and stored on **Heroku EU (Ireland)**. No data transfer outside the EU takes place.

### Data Deletion

Both applications offer complete data deletion:

- **Spaceship:** Cascading deletion across 20+ tables in correct foreign key order
- **StarArc:** An automated anonymization function anonymizes all personal fields, deletes payment information, and deactivates access keys

### Consent Tracking (Art. 7 GDPR)

Consent timestamps, versions, and associated metadata are stored encrypted — for demonstrating lawful consent per Art. 7 GDPR.

### Automatic Cleanup

Expired verification and reset tokens are automatically cleaned up by scheduled database functions.

---

## 14. Industry Comparison

| Feature | StarArc | Bitwarden | Proton Mail |
|---|---|---|---|
| Client-side encryption | AES-256-GCM | AES-256-CBC + HMAC | OpenPGP |
| Key derivation | PBKDF2-SHA256, 600k | PBKDF2/Argon2id, 600k | Bcrypt + SRP |
| Zero-knowledge option | Yes (Sovereignty mode) | Yes (default) | Yes (default) |
| Field-level encryption | Yes (per field with fresh IV) | Vault-based | Message-based |
| Recovery | 6 BIP39 words | Master password | Recovery phrase |
| Web Crypto API (native) | Yes | Yes | Partial |
| Open source | Planned (crypto layer) | Yes (client + server) | Client only |
| Server access to data | Standard: yes; ZK: no | No | No |

### Assessment

StarArc implements the same cryptographic primitives as leading security products (Bitwarden, Proton Mail). The **Sovereignty mode** provides a protection level comparable to pure zero-knowledge services, while the **Standard mode** makes a deliberate trade-off in favor of usability.

---

## 15. Known Limitations and Transparency

We believe that true security requires transparency. Therefore, we disclose known limitations:

### 1. Web-Based End-to-End Encryption

As a web application, the server delivers the JavaScript code that performs the encryption. Users trust that the delivered code matches what is documented. This is the same limitation that applies to Proton Mail and other web-based E2E services.

**Planned mitigation:** Open-source release of the crypto layer for independent verification.

### 2. Standard Mode: Server Access Possible

In Standard mode, the server holds an encrypted copy of the DEK and can theoretically derive the DEK. This is intentionally designed to enable convenience features like password reset. Users seeking maximum privacy should use **Sovereignty mode**.

### 3. PBKDF2 vs. Argon2id

PBKDF2 is the currently used KDF. Argon2id (memory-hard algorithm) would provide stronger protection against GPU/ASIC-based brute force attacks. A migration is planned for when the Web Crypto API natively supports Argon2id.

### 4. 6-Word Recovery Phrase

The Sovereignty mode recovery phrase comprises 6 BIP39 words (~66 bits entropy). This is less than the 12-word standard in the Bitcoin world (128 bits), but sufficient for key recovery purposes since each brute force attempt requires 600,000 PBKDF2 iterations.

---

## Contact

For security questions or responsible vulnerability disclosure, please contact the StarArc team.

---

*This document describes the state of the security architecture at the time of publication. Security measures are continuously evolving.*
