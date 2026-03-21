# StarArc / Spaceship — Security & Encryption Architecture

> Complete reference for security whitepaper creation.
> Based on source code analysis of both codebases (March 2026).

---

## 1. System Overview

- **StarArc** (`stararc.one`) — Auth, onboarding, subscriptions, user management
- **Spaceship** (`spaceship.stararc.one`) — Financial planning app with all user data
- **Communication:** Cross-app JWT (CROSS_APP_JWT_SECRET, 5-min expiry)
- **Hosting:** Heroku EU (Ireland)
- **Databases:** Separate PostgreSQL instances per app

---

## 2. Encryption Standards

| Component | Algorithm | Parameters |
|---|---|---|
| Data encryption | AES-256-GCM | 12-byte IV, 128-bit auth tag |
| User KEK derivation | PBKDF2-SHA-256 | **600,000 iterations**, 32-byte random salt |
| Server KEK derivation | PBKDF2-SHA-256 | 100,000 iterations, SHA256("user-{id}") as salt |
| Password hashing | BCrypt | 12 rounds, auto-salt |
| Email lookup hash | SHA-256 | email + EMAIL_HASH_SALT |
| Recovery phrase | BIP39 wordlist | 6 words from 2048-word English list (~66 bits entropy) |
| Recovery key hash | SHA-256 | Direct hash of joined words (server-side verification only) |
| Cross-app token | JWT (HMAC) | CROSS_APP_JWT_SECRET, 5-minute expiry |
| Web Crypto API | `crypto.subtle` | Browser-native, no external crypto libraries |

---

## 3. Envelope Encryption (KEK/DEK Architecture)

```
User Password (or Recovery Phrase)
    ↓
PBKDF2 (SHA-256, 600k iterations, random salt)
    ↓
KEK (Key Encryption Key) — 256-bit, never stored
    ↓
AES-GCM Wrap/Unwrap
    ↓
DEK (Data Encryption Key) — 256-bit, stored only wrapped
    ↓
AES-256-GCM per field
    ↓
Base64(salt[32] || IV[12] || ciphertext || authTag[16])
```

### DEK Lifecycle

- **Generated once** during registration via `crypto.subtle.generateKey('AES-GCM', 256)`
- **Never stored raw** — only wrapped copies exist
- **Wrapped by user KEK** → `wrapped_dek` (both modes)
- **Wrapped by server KEK** → `wrapped_dek_server` (Standard only; NULL for ZK)
- **Wrapped by recovery KEK** → `wrapped_dek_recovery` (ZK only)
- **In browser:** Stored as `DERIVED_KEY:{base64}` in `sessionStorage` (dies with tab)
- **Session timeout:** 4 hours hard expiry, activity-monitored

---

## 4. Two Authentication Modes

### 4a. Standard Login

```
Registration:
  Client: Generate DEK → derive user KEK from password → wrap DEK
  Client: Send raw DEK (one-time) + wrapped_dek + dek_salt to server
  Server: Derive server KEK → create wrapped_dek_server → discard raw DEK

Login to Spaceship:
  Server: Unwrap DEK via wrapped_dek_server → encrypt for transport → JWT
  Spaceship: Decrypt DEK from JWT → store in sessionStorage → seamless access
```

**Server CAN decrypt data** (via wrapped_dek_server using DEK_SERVER_SECRET)
**Enables:** Admin password reset, seamless cross-app login (no 2nd password)

### 4b. Zero-Knowledge / Sovereignty Login

```
Setup (during auth method selection):
  Client: User creates ZK password (min 12 chars)
  Client: Generate 6 BIP39 recovery words
  Client: Generate DEK
  Client: Derive password KEK → wrap DEK → wrapped_dek
  Client: Derive recovery KEK → wrap DEK → wrapped_dek_recovery
  Client: Encrypt recovery phrase with DEK → encrypted_recovery_phrase
  Client: Hash recovery phrase → recovery_key_hash (verification only)
  Client: Send all wrapped artifacts to server (raw DEK NEVER sent)

Login to Spaceship:
  Server: Send wrapped_dek + dek_salt in JWT
  Spaceship: Prompt user for ZK password → derive KEK → unwrap DEK
```

**Server CANNOT decrypt data** (wrapped_dek_server = NULL)
**No admin password reset possible**
**Recovery only via 6-word phrase** (client-side)

---

## 5. Field-Level Encryption

Every sensitive field is independently encrypted:
- **Fresh random salt** (32 bytes) per encryption
- **Fresh random IV** (12 bytes) per encryption
- Same value encrypted twice produces different ciphertext
- Self-contained format: `Base64(salt[32] || IV[12] || ciphertext || authTag[16])`
- Overhead per field: 60 bytes + ciphertext length
- Metadata per entity: `encryption_version: 1`, `encryption_algorithm: "AES-256-GCM"`

### Pre-derived Key Optimization

For performance, the DEK is pre-derived at login. Encryption service detects `DERIVED_KEY:` prefix and imports the raw 256-bit key directly via `crypto.subtle.importKey()`, skipping per-field PBKDF2. This means:
- Login: 1x PBKDF2 (600k iterations) to unwrap DEK
- Each field encrypt/decrypt: AES-256-GCM only (fast)

---

## 6. Encrypted vs. Plaintext Data

### Principle: Encrypt ALL personal/financial data, keep only structural metadata in plaintext

### StarArc (users table)

**Encrypted:**
- Email, alias/name (dual: user-encrypted + admin-encrypted)
- 2FA secret, backup codes
- Legal acceptance records (admin-encrypted for GDPR Art. 7)
- DEK wrapping artifacts (wrapped_dek, wrapped_dek_server, wrapped_dek_recovery)

**Plaintext:**
- email_hash (SHA-256, for login lookup)
- password_hash (BCrypt)
- Subscription/billing status
- Onboarding step, login method
- Stripe IDs
- Timestamps

### Spaceship (all user data tables)

**Encrypted (client-side, per field):**
- Asset names, symbols, ISIN, quantities, values, currencies, descriptions
- Bitcoin xPubs, derivation paths, balance, addresses, wallet details
- Vault names, locations, access instructions, security notes
- Family member names, birth years, relationships, income flags
- Budget names, amounts, categories, items
- Real estate names, values, descriptions
- Mortgage amounts, interest rates, payments
- Precious metal names, quantities, values
- Seed names, word counts, master fingerprints
- Hardware/software wallet names, serial numbers
- Wallet keys (xPub, derivation path)
- Descriptors, receive addresses
- Securities account names, values
- Custom institution names
- Liability amounts, creditors, rates
- User location (country, city, postal code)

**Plaintext (structural only):**
- Primary keys, foreign keys
- Category/subcategory IDs (not names)
- Enum types (property_type, device_type, vault_category)
- Boolean flags (is_active, is_dependent, is_main_person)
- Currency codes (2-3 char ISO)
- Timestamps
- Encryption metadata (version, algorithm)
- Sort orders

---

## 7. Server Role per Mode

### Standard Login — Server as "Trusted Custodian"
- Holds `wrapped_dek_server` → can derive DEK
- Encrypts PII dual (user + admin copies)
- Can perform admin password reset
- Can provide seamless cross-app login (DEK in JWT)

### ZK Login — Server as "Blind Proxy"
- `wrapped_dek_server = NULL`
- Stores/returns encrypted blobs without understanding them
- Cannot decrypt any user data at any time
- No admin reset possible
- Recovery exclusively client-side (6 BIP39 words)

---

## 8. Cross-App Authentication Flow

### Standard:
1. StarArc unwraps DEK server-side
2. Encrypts DEK with random temp_key for transport
3. Signs JWT with: authKey, authMethod, dekData, dekTransport
4. Spaceship decrypts DEK → seamless access

### ZK:
1. StarArc sends wrapped_dek + dek_salt in JWT (no raw DEK)
2. Spaceship prompts for ZK password
3. Client derives KEK → unwraps DEK
4. No seamless login — by design

---

## 9. Key Management Summary

| Key | How Created | Where Stored | Who Has Access |
|---|---|---|---|
| User password | User-chosen | BCrypt hash in DB | User only (hash only on server) |
| ZK password | User-chosen (min 12 chars) | BCrypt hash in DB | User only |
| DEK | `crypto.subtle.generateKey()` | Only as wrapped copies | Standard: user + server; ZK: user only |
| User KEK | PBKDF2(password, salt, 600k) | Not stored; derived at runtime | User only |
| Server KEK | PBKDF2(DEK_SERVER_SECRET, SHA256("user-{id}"), 100k) | Not stored; derived at runtime | Server only |
| Recovery KEK | PBKDF2(6 words, recovery_salt, 600k) | Not stored; derived at runtime | User only |
| Recovery phrase | 6 random BIP39 words | Encrypted with DEK in DB | User only |
| Admin master key | ADMIN_USER_DATA_ENCRYPTION_KEY env var | Server environment | Server admin only |
| DEK_SERVER_SECRET | Environment variable | Server environment | Server only |
| Cross-app JWT secret | CROSS_APP_JWT_SECRET env var | Both servers | Both servers |
| Spaceship auth key | Random 256-bit, AES-GCM encrypted | StarArc DB (encrypted) | Server only |

---

## 10. Browser Security

- **Web Crypto API:** All crypto via `crypto.subtle` (browser-native, not JS libs)
- **Session storage:** DEK in `sessionStorage` (cleared on tab close)
- **4-hour timeout:** Hard key expiry with activity monitoring
- **Activity events:** mousedown, mousemove, keypress, keydown, scroll, touchstart, click
- **No persistent key storage:** DEK never in localStorage (only auth tokens there)
- **HTTPS only:** All communication TLS-encrypted in transit

---

## 11. Comparison with Industry Standards

| Feature | StarArc | Bitwarden | Proton Mail |
|---|---|---|---|
| Client-side encryption | Yes (AES-256-GCM) | Yes (AES-256-CBC + HMAC) | Yes (OpenPGP) |
| KDF | PBKDF2-SHA256, 600k | PBKDF2-SHA256, 600k (or Argon2id) | Bcrypt + SRP |
| Zero-knowledge option | Yes (Sovereignty mode) | Yes (default) | Yes (default) |
| Open source | Not yet | Yes (client + server) | Client only |
| Field-level encryption | Yes (per field, fresh IV) | Vault-level | Message-level |
| Recovery mechanism | 6 BIP39 words | Master password | Recovery phrase |
| Server access to data | Standard: yes; ZK: no | No | No |

---

## 12. Known Limitations & Transparency

1. **Web-based E2E:** Server delivers JavaScript — user trusts the served code does what it claims. Same limitation as Proton Mail. Mitigation: DevTools verification, planned open-source crypto layer.
2. **Standard Login:** Server holds wrapped_dek_server → can technically decrypt. By design for password reset convenience. Users who want maximum privacy should use Sovereignty mode.
3. **PBKDF2 vs. Argon2id:** PBKDF2 is GPU/ASIC-optimizable. Argon2id (memory-hard) would be stronger. Code has placeholder comment for future Argon2id migration when browser support matures.
4. **6-word recovery:** ~66 bits entropy (vs. Bitcoin's 128 bits for 12 words). Sufficient for key recovery purpose since brute-force requires defeating PBKDF2 600k iterations per attempt.
5. **Modulo bias:** `Uint32 % 2048` has negligible bias (2^32 / 2048 = exactly 2^21, so actually zero bias in this case).
6. **Some plaintext gaps:** `passphrases` table not yet encrypted; some enum fields (software_name on wallets) could reveal metadata.

---

## 13. Environment Variables (Security-Critical)

| Variable | Used By | Purpose |
|---|---|---|
| `DEK_SERVER_SECRET` | StarArc backend | Derives server KEK for wrapped_dek_server |
| `ADMIN_USER_DATA_ENCRYPTION_KEY` | StarArc backend | Master key for admin_encrypted_* fields |
| `EMAIL_HASH_SALT` | StarArc backend | Salt for email_hash lookup |
| `CROSS_APP_JWT_SECRET` | Both backends | Signs cross-app JWT tokens |
| `SPACESHIP_AUTH_ENCRYPTION_KEY` | StarArc backend | Encrypts spaceship_auth_key per user |
| `STRIPE_SECRET_KEY` | StarArc backend | Stripe API authentication |
| `ENCRYPTION_KEY` | Spaceship backend | Document scan encryption only (AES-256-CBC) |
