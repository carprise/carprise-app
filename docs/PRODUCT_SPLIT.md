# Carprise product split

Three surfaces. Different users. Different jobs. Different UI.

## 1. Driver / B2B app (`/drive` · native)

**Users:** Drivers, fleet operators  
**Job:** Run the commercial layer of the vehicle  
**Not:** Passenger entertainment or climate control  

| Area | Purpose |
|------|---------|
| Today | Daily report, route tracking toggle, active work |
| Work | Campaign invitations, activation, evidence |
| Stock | Live inventory from ops (fallback estimate) |
| Routes | Live GPS distance + journey analytics |
| Account | Profile, vehicle verification, payouts |

### Live systems

- **Distance:** `telemetry_points` + `driver_daily_stats()` (see `supabase/live-ops-and-passenger.sql`)
- **Stock:** `inventory` + `products` assigned in `/ops` → Inventory

## 2. Passenger / customer experience (`/j/[code]`)

**Users:** Passengers in the car  
**Job:** Journey comfort, discovery, ordering  
**Not:** Driver ops, stock counts, earnings  

| Area | Purpose |
|------|---------|
| Home | Calm welcome, separate from driver shell |
| Order | Samples & retail from on-board stock |
| For you | Name, mood, interest personalisation |
| Cabin | Temperature target + music ambience |

**Design:** warm cream hospitality shell — not the dark ops instrument panel.  
Entry: vehicle journey code / QR → `https://www.carprise.co.uk/j/[code]`

## 3. Carprise Ops (`/ops`)

**Users:** Internal Carprise team  
**Job:** Verify vehicles, create campaigns, assign work, stock network  

| Area | Purpose |
|------|---------|
| Drivers / vehicles | Verification |
| Campaigns | Assign commercial work |
| Inventory | Products + vehicle stock levels |

## Design direction

- **Premium mobility / private hire**, not budget airline  
- Driver app = professional instrument panel (ink + champagne)  
- Passenger app = calm, hospitality-led cream experience  
- Never reuse the same shell or navigation for both  
