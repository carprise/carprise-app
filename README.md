# Carprise Driver App

A complete Expo/React Native starter for the Carprise founding driver network. It runs immediately with polished demo data and is structured for Supabase, Vercel and Resend integration.

## Included
- Driver dashboard and live campaign progress
- Campaign invitations, acceptance and checklists
- Evidence photo capture
- Earnings and payment history
- Vehicle verification and photo uploads
- Driver profile, document and notification areas
- Supabase-ready client and environment configuration
- EAS development, preview and production profiles

## Start
```bash
npm install
npx expo start
```

## Backend setup
1. Copy `.env.example` to `.env`.
2. Add the Supabase URL and anon key.
3. Create tables from `supabase-schema.sql`.
4. Replace demo data in `src/data/mock.ts` with Supabase queries.
5. Keep Resend keys server-side in Vercel. The app should call authenticated Vercel API routes, never Resend directly.

## EAS
```bash
npx eas-cli@latest login
npx eas-cli@latest build:configure
npx eas-cli@latest build --platform ios --profile development
```

Before production, replace the demo driver identity, add authentication screens, connect storage policies, add final legal copy and update the EAS project ID.
