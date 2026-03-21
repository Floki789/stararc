---
name: stararc security findings
description: Security vulnerabilities and findings discovered during reviews of the stararc project
type: project
---

## Architecture Rewrite Note (March 2026)

The project was fully rewritten from Next.js/Supabase/NextAuth to Express.js/React/PostgreSQL.
All findings from the initial review (KRIT-01/02, HOCH-01/02/03, MITT-01/02/03/04, INFO-01/02/03) are **OBSOLETE** — the referenced files, libraries, and patterns no longer exist.

---

## Current Architecture Findings (March 2026)

### Positive Findings
- AES-256-GCM field-level encryption with KEK/DEK envelope architecture
- PBKDF2-SHA-256 with 600,000 iterations (matches Bitwarden 2024 standard)
- Web Crypto API (`crypto.subtle`) — browser-native, no JS crypto libraries
- Stripe webhook signature verification correctly implemented
- All secrets via environment variables (no hardcoded secrets)
- Zod validation used for input
- Custom JWT auth with BCrypt (12 rounds) password hashing
- DEK stored only in sessionStorage (dies with tab close)
- 4-hour hard session timeout with activity monitoring
- Dual encryption (user + admin copies) for PII in StarArc
- Zero-Knowledge mode: server literally cannot decrypt (wrapped_dek_server = NULL)
- Cross-app JWT with 5-minute expiry
- Heroku EU (Ireland) hosting for GDPR compliance

### Known Limitations (by design, documented)
- **Standard Login:** Server holds wrapped_dek_server → can technically decrypt user data. By design for password reset convenience. Users who need maximum privacy use Sovereignty/ZK mode.
- **Web-based E2E:** Server delivers JavaScript → user trusts served code. Same limitation as Proton Mail. Planned mitigation: open-source crypto layer.
- **PBKDF2 vs. Argon2id:** PBKDF2 is GPU/ASIC-optimizable. Argon2id (memory-hard) would be stronger. Placeholder for future migration when browser support matures.
- **6-word recovery:** ~66 bits entropy. Sufficient since brute-force must defeat PBKDF2 600k iterations per attempt.
- **Plaintext gaps:** `passphrases` table not yet encrypted; some enum fields (software_name on wallets) may reveal metadata.

### Areas for Future Review
- Rate limiting on API endpoints
- CSP and security headers configuration
- Error message sanitization (ensure no stack traces leak to client)
- Input validation completeness across all endpoints
- Admin route authorization depth

**Why:** Track known issues to prevent regression in future reviews.
**How to apply:** Before starting a new review session, check these findings to see which are fixed and which are new regressions.
