---
name: stararc project overview
description: Tech stack, architecture, and security-relevant components of the stararc project
type: project
---

stararc is a two-app SaaS platform for financial planning with client-side encryption (confirmed via source code analysis, March 2026):

## Architecture

- **StarArc** (`stararc.one`) — Auth, onboarding, subscriptions, user management
- **Spaceship** (`spaceship.stararc.one`) — Financial planning app with all user data
- **Cross-app communication:** JWT with CROSS_APP_JWT_SECRET (5-min expiry)

## Tech Stack

- **Frontend:** React 18+ with Vite, TypeScript, Tailwind CSS
- **Backend:** Express.js (Node.js), TypeScript
- **Database:** PostgreSQL (separate instances per app, Heroku EU Ireland)
- **Auth:** Custom JWT-based auth with BCrypt password hashing, role-based access
- **Payments:** Stripe with webhook signature verification
- **Email:** Resend
- **UI Libraries:** Tailwind CSS, lucide-react, Radix UI components
- **Validation:** Zod
- **Crypto:** Web Crypto API (`crypto.subtle`), no external crypto libraries
- **i18n:** Custom i18n with en.json / de.json locale files

## Security Architecture

- **Encryption:** AES-256-GCM field-level encryption with KEK/DEK envelope encryption
- **KDF:** PBKDF2-SHA-256, 600,000 iterations (matches Bitwarden 2024 standard)
- **Two auth modes:** Standard (server can decrypt) and Zero-Knowledge/Sovereignty (server is blind proxy)
- **Recovery:** 6 BIP39 words (~66 bits entropy) for ZK mode
- **Session:** DEK in sessionStorage only, 4-hour hard timeout
- **Full details:** See [SECURITY_ARCHITECTURE.md](SECURITY_ARCHITECTURE.md)

## Key Files (StarArc)

- `backend/src/routes/` — API routes (auth, stripe, users, admin)
- `backend/src/middleware/` — Auth middleware, role checks
- `backend/src/services/` — Business logic (encryption, stripe, email)
- `frontend/src/pages/` — React pages (Dashboard, Register, Login, etc.)
- `frontend/src/components/` — Shared components (PlanCards, etc.)
- `frontend/src/services/` — Frontend API services (stripeService, etc.)
- `frontend/src/locales/en.json` / `de.json` — i18n translations
- `frontend/src/utils/encryption/` — Client-side crypto (KEK/DEK, AES-GCM)

## Key Tables (StarArc DB)

- `users` — Auth, onboarding_step, encrypted_alias, encrypted_email, admin_encrypted_*, wrapped_dek, wrapped_dek_server, dek_salt
- Onboarding flow: `registration → subscription_selection → auth_method_selection → completed`

## Key Tables (Spaceship DB)

- `user_family_members` — Encrypted: name, birth_date, relationship; Plain: is_main_person, is_dependent
- `user_profile_completion` — Completion flags per section
- `user_location_settings` — country, currency, timezone, language
- All financial data tables — Field-level encrypted (assets, wallets, vaults, budgets, etc.)

**Why:** Persistent tech stack reference to avoid re-probing in future sessions.
**How to apply:** Use this to immediately understand the security surface when starting new reviews.
