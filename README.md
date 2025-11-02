# Stararc.one - Privacy-Focused Starship Landing Page

A modern landing page and subscription system for the Starship zero-knowledge portfolio management platform.

## 🚀 Features

- **Zero-Knowledge Authentication**: Secure login code system with bcrypt hashing
- **Swiss Privacy Standards**: No data retention, automatic document deletion
- **Subscription Management**: Stripe-powered billing with multiple tiers
- **Privacy-by-Design**: Client-side encryption, no server-side data storage
- **Self-Custody Focus**: Maximum user control over financial data

## 🏗️ Architecture

```
stararc/
├── backend/          # Node.js Express API
├── frontend/         # React TypeScript SPA
├── database/         # PostgreSQL schema & migrations
├── shared/           # Shared TypeScript types
└── docker-compose.yml
```

## 🛡️ Privacy Features

- **No Data Sales**: Zero tracking, advertising, or data sharing
- **Ephemeral Processing**: Temporary document processing only
- **Encrypted Vaults**: Hardware-level encryption for asset storage
- **Anonymous Analytics**: Portfolio analysis without identity exposure
- **Swiss Compliance**: GDPR+ privacy standards

## 📦 Quick Start

```bash
# Install dependencies
npm run install:all

# Start development servers
npm run dev

# Build for production
npm run build
```

## 🔐 Environment Variables

Create `.env` files in both `backend/` and `frontend/` directories:

### Backend (.env)
```
DATABASE_URL=postgresql://user:password@localhost:5432/stararc
JWT_SECRET=your-super-secure-jwt-secret
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
FRONTEND_URL=http://localhost:3000
EMAIL_HOST=smtp.gmail.com
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
```

### Frontend (.env)
```
VITE_API_URL=http://localhost:3001
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_...
```

## 🎯 Subscription Plans

1. **Starship Basic** (CHF 29/month)
   - Zero-Knowledge Login
   - 1 Portfolio
   - Basic OCR
   - Swiss Privacy

2. **Starship Pro** (CHF 59/month)
   - 5 Portfolios
   - Advanced OCR
   - Multi-Bank Support
   - Real-time Analytics

3. **Starship Enterprise** (CHF 199/month)
   - Unlimited Portfolios
   - Premium OCR
   - API Access
   - On-Premise Option

## 🇨🇭 Swiss Privacy Commitment

Starship is built for Swiss privacy standards:
- **Digital Sovereignty**: Complete control over financial data
- **Zero-Log Policy**: No activity tracking or monitoring
- **On-Premise Deployable**: Full self-hosting capability
- **Memory-Safe Processing**: No disk caching of sensitive data

## 📱 Tech Stack

- **Backend**: Node.js, Express, TypeScript, PostgreSQL
- **Frontend**: React, TypeScript, Tailwind CSS, Framer Motion
- **Payments**: Stripe with Swiss banking support
- **Security**: JWT, bcrypt, rate limiting, CORS
- **Privacy**: Client-side encryption, zero-retention policies

## 🚀 Deployment

The application is designed for Swiss hosting providers and can be deployed on-premise for maximum privacy control.

---

**Made in Switzerland 🇨🇭 for Privacy-Conscious Investors**