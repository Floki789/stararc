# Login-Methoden: Standard vs Zero-Knowledge

## Übersicht

StarArc/Spaceship unterstützt zwei Login-Methoden mit Client-seitiger Verschlüsselung (CSE):

| Aspekt | Standard Login | Zero-Knowledge (ZK) |
|--------|---------------|---------------------|
| Passwort | 1x (StarArc = Spaceship) | 2x (unterschiedlich möglich) |
| Server kennt DEK? | Ja (wrapped_dek_server) | Nein (niemals) |
| Admin Password Reset | ✅ Möglich | ❌ Unmöglich |
| User Self-Recovery | ❌ | ✅ Mit 12 Passphrasen |
| Cross-App Login | Seamless (kein 2. Passwort) | Password-Prompt |

---

## 1. Standard Login

### Konzept
- Ein Passwort für beide Apps (StarArc + Spaceship)
- Server hat Zugriff auf das DEK via `wrapped_dek_server`
- Ermöglicht Admin-unterstützten Password Reset

### Kryptographische Komponenten

```
┌─────────────────────────────────────────────────────────────┐
│                    STANDARD LOGIN                           │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Password ──► PBKDF2(100k) ──► KEK (Key Encryption Key)    │
│                    │                                        │
│                    ▼                                        │
│              ┌─────────┐                                    │
│              │   DEK   │  (Data Encryption Key, 256-bit)   │
│              └────┬────┘                                    │
│                   │                                         │
│         ┌────────┼────────┐                                │
│         ▼        ▼        ▼                                │
│   wrapped_dek  wrapped_dek_server  (verschlüsselte Daten)  │
│   (User KEK)   (Server KEK)                                │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Datenbank-Felder (users Tabelle)

| Feld | Beschreibung |
|------|--------------|
| `wrapped_dek` | DEK verschlüsselt mit User-KEK (PBKDF2 von Passwort + dek_salt) |
| `wrapped_dek_server` | DEK verschlüsselt mit Server-KEK (PBKDF2 von SERVER_SECRET + user_id) |
| `dek_salt` | 32-byte Salt für PBKDF2 |
| `login_method_selected` | `'standard'` |

### Registrierung Flow

```
1. User gibt Passwort ein
2. Client generiert:
   - DEK: crypto.getRandomValues(32 bytes)
   - dek_salt: crypto.getRandomValues(32 bytes)
   - KEK: PBKDF2(password, dek_salt, 600000, SHA-256)
   - wrapped_dek: AES-256-GCM(DEK, KEK)
3. Client sendet an Server: { wrapped_dek, dek_salt, dek (temporär) }
4. Server erstellt:
   - server_kek: PBKDF2(SERVER_SECRET, "user-{id}", 100000, SHA-256) [starkes Secret]
   - wrapped_dek_server: AES-256-GCM(dek, server_kek)
5. Server speichert: wrapped_dek, wrapped_dek_server, dek_salt
6. Server löscht raw DEK aus Memory
```

### Login Flow

```
1. User gibt Passwort ein
2. Server sendet: wrapped_dek, dek_salt
3. Client berechnet: KEK = PBKDF2(password, dek_salt)
4. Client entschlüsselt: DEK = AES-GCM-Decrypt(wrapped_dek, KEK)
5. DEK wird in sessionStorage gespeichert
```

### Cross-App Login (StarArc → Spaceship)

```
1. StarArc entschlüsselt wrapped_dek_server mit Server-KEK → bekommt DEK
2. StarArc generiert temp_key (random 256-bit)
3. StarArc verschlüsselt DEK mit temp_key → encrypted_dek
4. JWT enthält: { dekTransport: {encrypted_dek, temp_key}, dekData: {wrapped_dek, wrapped_dek_server, dek_salt} }
5. Spaceship entschlüsselt: DEK = AES-GCM-Decrypt(encrypted_dek, temp_key)
6. Spaceship speichert dekData in DB (für neuen User)
7. User ist eingeloggt OHNE 2. Passwort-Eingabe
```

### Admin Password Reset

```
1. Admin erhält Reset-Request
2. Server entschlüsselt: DEK = AES-GCM-Decrypt(wrapped_dek_server, server_kek)
3. User setzt neues Passwort
4. Server berechnet: new_kek = PBKDF2(new_password, new_salt)
5. Server erstellt: new_wrapped_dek = AES-GCM(DEK, new_kek)
6. Server aktualisiert: wrapped_dek, dek_salt
7. Alle Daten bleiben lesbar (selbes DEK)
```

---

## 2. Zero-Knowledge (ZK) Login

### Konzept
- Separates Spaceship-Passwort möglich
- Server hat **niemals** Zugriff auf das DEK
- Nur User kann Daten entschlüsseln
- Recovery nur mit 12 Passphrasen möglich

### Kryptographische Komponenten

```
┌─────────────────────────────────────────────────────────────┐
│                   ZERO-KNOWLEDGE LOGIN                      │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Password ──► PBKDF2 ──► KEK                               │
│                          │                                  │
│                          ▼                                  │
│                    ┌─────────┐                              │
│                    │   DEK   │                              │
│                    └────┬────┘                              │
│                         │                                   │
│         ┌───────────────┼───────────────┐                  │
│         ▼               ▼               ▼                  │
│   wrapped_dek    wrapped_dek_recovery   (Daten)            │
│   (User KEK)     (Recovery KEK)                            │
│                         ▲                                   │
│                         │                                   │
│  12 Passphrasen ──► PBKDF2 ──► Recovery KEK                │
│                                                             │
│  ❌ KEIN wrapped_dek_server (Server sieht DEK nie!)        │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Datenbank-Felder (users Tabelle)

| Feld | Beschreibung |
|------|--------------|
| `wrapped_dek` | DEK verschlüsselt mit User-KEK |
| `wrapped_dek_recovery` | DEK verschlüsselt mit Recovery-KEK (aus Passphrasen) |
| `dek_salt` | Salt für User-KEK Ableitung |
| `recovery_salt` | Salt für Recovery-KEK Ableitung |
| `recovery_key_hash` | SHA-256 Hash des Recovery-Keys (zur Verifikation) |
| `login_method_selected` | `'password_zk'` |
| `wrapped_dek_server` | **NULL** (by design!) |

### Setup Flow (ZK-Verschlüsselung aktivieren)

```
1. User wählt "Zero-Knowledge Encryption"
2. Client generiert:
   - DEK: crypto.getRandomValues(32 bytes)
   - dek_salt: crypto.getRandomValues(32 bytes)
   - 12 Passphrasen aus Wortliste (BIP39-ähnlich)
   - recovery_salt: crypto.getRandomValues(32 bytes)
3. Client berechnet:
   - user_kek: PBKDF2(password, dek_salt)
   - recovery_key: PBKDF2(passphrasen.join(' '), recovery_salt)
   - recovery_key_hash: SHA-256(recovery_key)
   - wrapped_dek: AES-GCM(DEK, user_kek)
   - wrapped_dek_recovery: AES-GCM(DEK, recovery_key)
4. Client zeigt 12 Passphrasen an (User muss aufschreiben!)
5. Client sendet an Server: wrapped_dek, wrapped_dek_recovery, dek_salt, recovery_salt, recovery_key_hash
6. Server speichert alles OHNE das raw DEK je zu sehen
```

### Login Flow

```
1. User gibt Spaceship-Passwort ein
2. Server sendet: wrapped_dek, dek_salt
3. Client berechnet: KEK = PBKDF2(password, dek_salt)
4. Client entschlüsselt: DEK = AES-GCM-Decrypt(wrapped_dek, KEK)
5. DEK wird in sessionStorage gespeichert
```

### Cross-App Login (StarArc → Spaceship)

```
1. StarArc generiert JWT mit zkData: {wrapped_dek, wrapped_dek_recovery, dek_salt, recovery_salt, recovery_key_hash}
2. Spaceship empfängt JWT
3. Spaceship speichert zkData in DB (für neuen User)
4. Spaceship zeigt PASSWORD-PROMPT an (kein seamless login!)
5. User gibt Spaceship-Passwort ein
6. Client entschlüsselt wrapped_dek mit Passwort
```

### User Self-Recovery (Passphrasen)

```
1. User klickt "Forgot Password"
2. User gibt 12 Passphrasen ein
3. Client berechnet:
   - recovery_key: PBKDF2(passphrasen.join(' '), recovery_salt)
   - verification: SHA-256(recovery_key)
4. Client prüft: verification === recovery_key_hash
5. Falls OK: DEK = AES-GCM-Decrypt(wrapped_dek_recovery, recovery_key)
6. User setzt neues Passwort
7. Client erstellt:
   - new_dek_salt: crypto.getRandomValues(32 bytes)
   - new_kek: PBKDF2(new_password, new_dek_salt)
   - new_wrapped_dek: AES-GCM(DEK, new_kek)
8. Server aktualisiert: wrapped_dek, dek_salt
9. Recovery-Felder bleiben unverändert (selbe Passphrasen funktionieren weiter)
```

---

## Vergleich: Was ändert sich bei Password Reset?

### Standard Login (Admin Reset)

| Feld | Ändert sich? |
|------|-------------|
| `wrapped_dek` | ✅ Ja (neu verschlüsselt) |
| `dek_salt` | ✅ Ja (neues Salt) |
| `wrapped_dek_server` | ❌ Nein (selbes DEK, selber Server-KEK) |

### Zero-Knowledge (User Self-Recovery)

| Feld | Ändert sich? |
|------|-------------|
| `wrapped_dek` | ✅ Ja (neu verschlüsselt) |
| `dek_salt` | ⚡ Optional (kann gleich bleiben) |
| `wrapped_dek_recovery` | ❌ Nein |
| `recovery_salt` | ❌ Nein |
| `recovery_key_hash` | ❌ Nein |

---

## Sicherheitsgarantien

### Standard Login
- ✅ Daten sind verschlüsselt (Client-Side Encryption)
- ✅ Transport-Verschlüsselung (HTTPS + AES-GCM temp_key)
- ⚠️ Server KANN Daten entschlüsseln (mit SERVER_SECRET)
- ✅ Admin kann Password Reset durchführen

### Zero-Knowledge
- ✅ Daten sind verschlüsselt (Client-Side Encryption)
- ✅ Server kann Daten **NIEMALS** entschlüsseln
- ✅ Selbst bei Datenbank-Leak sind Daten sicher
- ⚠️ Passphrasen verloren = Daten unwiederbringlich verloren
- ❌ Admin kann NICHT helfen bei Passwort-Verlust

---

## Algorithmen & Parameter

| Komponente | Algorithmus | Parameter |
|------------|-------------|-----------|
| Key Derivation | PBKDF2 | SHA-256, 600.000 Iterationen (OWASP 2024) |
| DEK Wrapping | AES-256-GCM | 96-bit IV, 128-bit Auth Tag |
| Data Encryption | AES-256-GCM | 96-bit IV, 128-bit Auth Tag |
| Hashing | SHA-256 | 256-bit Output |
| Salt/IV Generation | crypto.getRandomValues | 32 bytes (Salt), 12 bytes (IV) |
| Passphrase Generation | BIP39-ähnlich | 12 Wörter aus 2048-Wort-Liste |
| Server KEK | PBKDF2 | SHA-256, 100.000 Iterationen (starkes Secret) |

---

## Datenbank-Schema

```sql
-- Gemeinsame Felder (beide Methoden)
wrapped_dek TEXT,              -- DEK verschlüsselt mit User-KEK
dek_salt TEXT,                 -- Salt für PBKDF2
login_method_selected VARCHAR, -- 'standard' oder 'password_zk'

-- Nur Standard Login
wrapped_dek_server TEXT,       -- DEK verschlüsselt mit Server-KEK

-- Nur Zero-Knowledge
wrapped_dek_recovery TEXT,     -- DEK verschlüsselt mit Recovery-KEK
recovery_salt TEXT,            -- Salt für Recovery-KEK
recovery_key_hash VARCHAR(64)  -- SHA-256 Hash zur Verifikation
```

---

## Wichtige Hinweise

1. **DEK bleibt immer gleich** - nur die Verpackung (wrapped_dek) ändert sich bei Password Reset
2. **Server speichert nie das raw DEK** für ZK-User
3. **12 Passphrasen sind kritisch** - User muss sie sicher aufbewahren
4. **Cross-App DEK Transport** verwendet temporären Schlüssel (temp_key) für zusätzliche Sicherheit
5. **SESSION_SECRET** und **SERVER_SECRET** müssen sicher verwahrt werden (Vault/Secrets Manager)
