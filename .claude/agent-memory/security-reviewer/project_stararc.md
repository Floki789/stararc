---
name: stararc project overview
description: Tech stack, architecture, and security-relevant components of the stararc project
type: project
---

stararc is a Next.js 15 SaaS application with the following tech stack (confirmed via dependency probing 2026-03-12):

- **Framework:** Next.js 15 (App Router)
- **Auth:** NextAuth.js v4 with JWT strategy, GoogleProvider + CredentialsProvider, role-based access
- **Database/Backend:** Supabase (supabase-js), with both a regular client and supabaseAdmin (service role)
- **Payments:** Stripe with webhook signature verification
- **AI:** OpenAI/AI SDK (generate route at src/app/api/generate/route.ts)
- **Email:** Resend
- **UI:** React 18+, Tailwind CSS, lucide-react, @radix-ui components
- **Validation:** Zod
- **Key files:**
  - `src/lib/supabase.ts` — defines both `supabase` (anon) and `supabaseAdmin` (service role) clients
  - `src/lib/auth.ts` — NextAuth config with JWT strategy, role stored in token
  - `middleware.ts` — route protection using getToken, role-based redirects for /admin
  - `src/app/api/auth/[...nextauth]/route.ts` — NextAuth handler
  - `src/app/api/checkout/route.ts` — Stripe checkout session creation
  - `src/app/api/stripe/webhook/route.ts` — Stripe webhook with signature verification
  - `src/app/api/generate/route.ts` — AI generation endpoint with credits system
  - `src/app/api/user/route.ts` — User data API
  - `src/app/api/admin/route.ts` — Admin API (role-protected)
  - `src/components/Dashboard.tsx` — Main dashboard, uses supabaseAdmin (security issue)
  - `src/components/Pricing.tsx` — Pricing component
  - `next.config.js` — Has headers() config, images with remotePatterns

**Why:** Persistent tech stack reference to avoid re-probing in future sessions.
**How to apply:** Use this to immediately understand the security surface when starting new reviews.
