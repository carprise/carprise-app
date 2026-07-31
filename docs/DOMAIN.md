# One-domain setup (carprise.co.uk)

## URL map

| URL | Product |
|-----|---------|
| `https://www.carprise.co.uk` | Marketing website (`carprise-website`) |
| `https://www.carprise.co.uk/drivers` | Driver recruitment / apply |
| `https://www.carprise.co.uk/drive` | **Driver app** (Expo web, proxied) |
| `https://www.carprise.co.uk/j` | Passenger entry (any code / guest cabin) |
| `https://www.carprise.co.uk/j/[code]` | Passenger cabin for that code (any code works) |
| `https://www.carprise.co.uk/ops` | Ops admin |
| `https://www.carprise.co.uk/portal` | Brand portal |

Mobile installs can also use the deep link scheme: `carprise://`

## How `/drive` works

1. Driver app is configured with `experiments.baseUrl: "/drive"` in `app.json`.
2. Deploy this repo to Vercel as **carprise-driver-app** (`vercel.json` exports Expo web to `dist`).
3. On the **website** Vercel project (`carprise-website`), set:

```bash
DRIVER_WEB_ORIGIN=https://carprise-driver-app.vercel.app
```

4. Website `next.config.ts` proxies:

```
www.carprise.co.uk/drive  →  https://carprise-driver-app.vercel.app/drive
```

Users stay on **carprise.co.uk** in the address bar.

### Vercel env for the driver project

In **carprise-driver-app** → Settings → Environment Variables:

```
EXPO_PUBLIC_SUPABASE_URL=https://xfukghylbjtnywhymqrm.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=<your anon key>
```

Redeploy after adding them.

Direct app URL (for testing): https://carprise-driver-app.vercel.app/drive

## Local development

Terminal 1 — driver app (web):

```bash
cd carprise-driver-app
npx expo start --web
# app available at http://localhost:8081/drive
```

Terminal 2 — website with proxy:

```bash
cd carprise-website
# .env.local
DRIVER_WEB_ORIGIN=http://localhost:8081
npm run dev
# open http://localhost:3000/drive
```

## Passenger journey (native on website)

Open:

- `http://localhost:3000/j/MCR01TAS` (demo cabin always works)
- Live vehicles resolve by `journey_code` when Supabase service role is set

## Platform proxy (optional — brand portal only)

```bash
PLATFORM_WEB_ORIGIN=http://localhost:3001
```

Then run the platform on port 3001 and open `/portal`.

## Deploy checklist

1. Deploy Expo web (with baseUrl `/drive`).
2. Deploy platform Next app.
3. On website Vercel project, set `DRIVER_WEB_ORIGIN` and `PLATFORM_WEB_ORIGIN`.
4. Redeploy website so rewrites apply.
5. Test `https://www.carprise.co.uk/drive` signs in against Supabase.
