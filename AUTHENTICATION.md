# StarArc Authentication System

## 🔐 Current Implementation (v1.0)

### Overview
StarArc currently uses a **Secure Login Code** system for Zero-Knowledge authentication. This is **NOT** a BIP39 mnemonic system.

---

## 📋 System Architecture

### **Login Code Generation**
```typescript
// Current implementation in backend/src/utils/passwordGenerator.ts
function generateSecurePassword(): string {
  // Generates a random 24-character secure password
  // Format: Mixed alphanumeric + special characters
  // Example: "X7#mK9$pL2@nR5&vQ8*hW3"
  
  const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
  // ... random generation logic
}
```

### **Hash Storage**
```typescript
// BCrypt hashing (10 rounds)
const hash = await bcrypt.hash(loginCode, 10);

// Stored in database:
// - StarArc DB: users.password_hash (for subscription management)
// - Starship DB: access_keys.access_key_hash (for app authentication)
```

---

## 🔄 Authentication Flow

### **Registration**
```mermaid
User Registration
    ↓
Generate Secure Login Code (24 chars)
    ↓
Hash with BCrypt (10 rounds)
    ↓
Store hash in StarArc DB
    ↓
Create Starship access key (separate hash)
    ↓
Display login code to user (ONE TIME ONLY)
    ↓
User must save code securely
```

### **Login**
```mermaid
User enters Login Code
    ↓
Fetch user's hash from DB
    ↓
BCrypt compare(loginCode, storedHash)
    ↓
If match: Generate session token
    ↓
User authenticated
```

---

## 🛡️ Security Features

### ✅ **What We Have:**
- **Zero-Knowledge Architecture**: Server never stores plaintext login codes
- **BCrypt Hashing**: Industry-standard password hashing (10 rounds)
- **Secure Random Generation**: Cryptographically secure password generation
- **One-Time Display**: Login code shown only once during registration
- **Separate Keys**: Different hashes for StarArc (subscription) and Starship (app)

### ❌ **What We DON'T Have (Yet):**
- **BIP39 Mnemonics**: Not using 12-word recovery phrases
- **Hierarchical Deterministic Keys**: Not deriving multiple keys from one seed
- **Key Separation**: authKey and dataKey are the same (no key wrapping)
- **Password Recovery**: No recovery mechanism if login code is lost
- **Key Rotation**: No ability to change login code

---

## 🚀 Future Enhancement: Dual-Mode Authentication

### **Proposed System:**

#### **Mode 1: Current System (Enhanced)**
- Keep current secure login code
- Add BIP39 recovery phrase backup
- Add password reset via recovery phrase

#### **Mode 2: Standard Password + Recovery**
- Email/Password authentication
- Separate authKey and dataKey
- Key wrapping for security
- BIP39 recovery phrase for account recovery
- PBKDF2 with 310k iterations

---

## 📊 Database Schema

### **StarArc DB (Subscription Management)**
```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,  -- BCrypt hash of login code
  created_at TIMESTAMP DEFAULT NOW()
);
```

### **Starship DB (App Authentication)**
```sql
CREATE TABLE access_keys (
  id SERIAL PRIMARY KEY,
  user_email VARCHAR(255) NOT NULL,
  access_key_hash VARCHAR(255) NOT NULL,  -- BCrypt hash of login code
  subscription_token UUID NOT NULL,       -- Anonymous verification token
  created_at TIMESTAMP DEFAULT NOW()
);
```

---

## 🔧 Technical Implementation

### **Password Generator**
- **Length**: 24 characters
- **Charset**: A-Z, a-z, 0-9, !@#$%^&*
- **Entropy**: ~142 bits (24 chars from 70-char alphabet)
- **Method**: `crypto.randomBytes()` for cryptographic security

### **BCrypt Configuration**
- **Rounds**: 10 (2^10 = 1,024 iterations)
- **Salt**: Automatically generated per hash
- **Algorithm**: Blowfish-based key derivation

### **Security Properties**
```typescript
// Time to crack (estimated):
// - Online attack: ~10^40 years (with rate limiting)
// - Offline attack: ~10^30 years (with BCrypt slowdown)
// - Rainbow tables: Impossible (unique salt per hash)
```

---

## 📝 Terminology

### ✅ **Correct Terms:**
- "Secure Login Code"
- "Zero-Knowledge Login Code"
- "Access Code"
- "Authentication Code"
- "Recovery Code" (if implementing recovery)

### ❌ **Incorrect Terms (DO NOT USE):**
- "BIP39 Login"
- "Mnemonic Phrase"
- "12-word Recovery"
- "Seed Phrase"
- "HD Wallet"

---

## 🔄 Migration Path (If Implementing BIP39)

### **Phase 1: Backward Compatible**
1. Add `auth_method` column to users table
2. Mark existing users as `'legacy'`
3. New users can choose `'bip39'` or `'standard'`
4. Keep current system working

### **Phase 2: Optional Upgrade**
1. Allow legacy users to upgrade to BIP39
2. Generate recovery phrase
3. Re-hash with new system
4. Maintain backward compatibility

### **Phase 3: Long-term**
1. Support both systems indefinitely
2. Legacy system remains secure
3. New features only for upgraded users
4. Clear documentation for both paths

---

## 📚 References

### **Current System:**
- BCrypt: https://github.com/kelektiv/node.bcrypt.js
- Web Crypto API: https://developer.mozilla.org/en-US/docs/Web/API/Web_Crypto_API

### **Future Enhancement Research:**
- BIP39 Spec: https://github.com/bitcoin/bips/blob/master/bip-0039.mediawiki
- PBKDF2: https://tools.ietf.org/html/rfc2898
- Key Wrapping: https://tools.ietf.org/html/rfc3394
- OWASP Password Storage: https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html

---

## ⚠️ Important Notes

1. **No Password Recovery**: If user loses login code, account is unrecoverable
2. **Single Point of Failure**: Login code is the only authentication method
3. **User Responsibility**: Users must securely store their login code
4. **No Key Rotation**: Cannot change login code after registration
5. **No 2FA**: No second factor authentication implemented

---

## 🎯 Recommended Next Steps

1. ✅ **Document Current System** (This file)
2. 🔄 **Implement BIP39 Recovery Backup** (Phase 1)
3. 🔄 **Add Password Reset Flow** (Using recovery phrase)
4. 🔄 **Implement Key Separation** (authKey ≠ dataKey)
5. 🔄 **Add Standard Password Option** (Optional, better UX)
6. 🔄 **Implement 2FA** (TOTP or hardware key)

---

**Last Updated**: November 1, 2025  
**Version**: 1.0.0  
**Status**: Production (Legacy System)
