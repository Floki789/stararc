---
name: stararc security findings
description: Security vulnerabilities and findings discovered during reviews of the stararc project
type: project
---

## Initial Review: 2026-03-12

### Critical (unresolved)
- **KRIT-01:** `supabaseAdmin` (Service Role Key) used directly in `src/components/Dashboard.tsx` — bypasses all Supabase RLS policies. Fix: move to Server Action or API Route only.
- **KRIT-02:** `debug: true` hardcoded in NextAuth config (`src/app/api/auth/[...nextauth]/route.ts`) — logs sensitive auth data in production. Fix: `debug: process.env.NODE_ENV === 'development'`

### High (unresolved)
- **HOCH-01:** `console.log(prompt)` in `src/app/api/generate/route.ts` — logs user prompts (PII/GDPR risk)
- **HOCH-02:** No rate limiting on `/api/generate` — risk of API abuse and race condition in credits system
- **HOCH-03:** `error.message` returned to client in `src/app/api/checkout/route.ts` — information disclosure

### Medium (unresolved)
- **MITT-01:** `dangerouslySetInnerHTML` in `src/components/Dashboard.tsx` — XSS risk if content is user-controlled
- **MITT-02:** Auth token stored in `localStorage` in Dashboard — vulnerable to XSS token theft
- **MITT-03:** Wildcard `hostname: '**'` in `next.config.js` image remotePatterns — SSRF risk
- **MITT-04:** No server-side whitelist validation of `priceId` in checkout API — price manipulation risk

### Low/Info (unresolved)
- **INFO-01:** Missing CSP and Permissions-Policy headers (HSTS, X-Frame, X-Content-Type present)
- **INFO-02:** next-auth v4 (legacy) — no active feature updates
- **INFO-03:** JWT role not re-validated against DB for admin routes — privilege persistence after role removal

### Positive Findings
- Stripe webhook signature verification correctly implemented
- All secrets via process.env (no hardcoded secrets)
- Zod validation used for input
- getServerSession() used in all checked API routes
- Middleware role-checks for /admin routes

**Why:** Track known issues to prevent regression in future reviews.
**How to apply:** Before starting a new review session, check these findings to see which are fixed and which are new regressions.
