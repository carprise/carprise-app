# Carprise Platform

**Commercializing Mobility** — modular mobility commerce for passenger journeys.

This monorepo contains the Phase 1–3 pilot stack:

| Surface | Path | Stack | Purpose |
|--------|------|--------|---------|
| **Driver network** | repo root (`app/`, `src/`) | Expo / React Native | Campaigns, evidence, vehicle verification, earnings |
| **Web platform** | `platform/` | Next.js | Passenger journey, Ops admin, Brand portal |
| **Database** | `supabase/` | Postgres + RLS | Full multi-sided schema + seed |

## Domain (carprise.co.uk)

Same public domain for marketing + product:

| Path | App |
|------|-----|
| `/` | Marketing site (`carprise-website`) |
| `/drivers` | Recruitment / apply |
| **`/drive`** | **Driver app** (this Expo project, web + native) |
| `/j/[code]` | Passenger journey |
| `/ops` | Ops admin |
| `/portal` | Brand portal |

See [docs/DOMAIN.md](docs/DOMAIN.md) for Vercel rewrites and env vars.

## Quick start

### 1. Driver app
```bash
npm install
npx expo start
```

Web (serves under base path `/drive`):
```bash
npx expo start --web
# → http://localhost:8081/drive
```

### 2. Web platform (passenger · ops · brand)
```bash
cd platform
npm install
npm run dev
```
Open [http://localhost:3000](http://localhost:3000)

From root you can also run:
```bash
npm run platform
```

### Demo entry points
| Role | URL |
|------|-----|
| Hub | `/` |
| Passenger journey | `/j/MCR01TAS` |
| Ops console | `/admin` → “Enter as operations” |
| Brand portal | `/brand` → pick a demo brand |

Other journey codes: `MCR02JAM`, `MCR04MAR`

## Product map (business model)

```
Passengers  →  in-journey offers, samples, cashless checkout
Drivers     →  incremental earnings, campaigns, evidence
Fleets      →  vehicle density, per-vehicle subscription (schema + ops view)
Brands      →  campaigns, sampling, retail, analytics
Carprise    →  platform fees, SaaS, licensing, orchestration
```

### Revenue streams modelled
- Driver / fleet subscription (per vehicle)
- Transaction commission + product margin
- Brand campaign fees
- Sampling / trial fees
- Fleet analytics & partner portal (Phase 3 surface)
- Enterprise licensing (roadmap)

### Phase 1 validation focus
1. Passenger acceptance of in-journey commerce  
2. Operational reliability (assign → evidence → pay)  
3. Positive contribution per vehicle (see Ops → Unit economics)

## Architecture

```
carprise-driver-app/
├── app/                    # Expo Router screens (driver)
├── src/                    # Driver context, UI, Supabase client
├── platform/               # Next.js multi-role web app
│   └── src/
│       ├── app/
│       │   ├── j/[code]/  # Passenger journey
│       │   ├── admin/      # Ops control centre
│       │   └── brand/      # Brand portal
│       ├── components/
│       └── lib/            # Demo data + client store
└── supabase/
    ├── full-schema.sql     # Full platform tables + RLS
    └── seed-demo.sql       # Optional seed campaigns/products
```

### Data layer
- **Demo mode (default for web):** in-memory + seed data in `platform/src/lib/demo-data.ts` so the pilot story runs without backend config.
- **Production path:** run `supabase/full-schema.sql` in Supabase, set env vars, replace demo reads/writes with Supabase queries (driver app already uses Supabase for auth, profiles, vehicles, campaigns, evidence).

### Driver env (`.env`)
```
EXPO_PUBLIC_SUPABASE_URL=...
EXPO_PUBLIC_SUPABASE_ANON_KEY=...
EXPO_PUBLIC_API_URL=...
```

### Platform env (`platform/.env.local` optional)
```
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
```

## Backend setup (Supabase)
1. Create a Supabase project.
2. Run `supabase/full-schema.sql` (extends original driver tables).
3. Optionally run `supabase/seed-demo.sql`.
4. Create storage buckets: `vehicle-photos`, `campaign-evidence` (private).
5. Point driver `.env` at the project.

Original lightweight schema remains at `supabase-schema.sql` for reference.

## EAS (driver builds)
```bash
npx eas-cli@latest login
npx eas-cli@latest build --platform ios --profile development
```

## Innovator Founder alignment
- **Innovation** — integrated mobility commerce (retail + advertising + analytics + engagement), not a single device feature.
- **Viability** — diversified recurring revenue with phased GTM; pilot validates unit economics before scale.
- **Scalability** — asset-light (no vehicle ownership); software, standardised hardware, fleet partnerships, licensing.

## Next hardening (when you leave demo mode)
- Wire platform admin/brand mutations to Supabase with role-based RLS
- Real payments (Stripe) for passenger checkout
- Push notifications for driver campaign invites
- QR sticker generation per `journey_code`
- Consent / privacy copy finalisation
- Resend transactional email via server routes only

---

Carprise Ltd · United Kingdom · Confidential
