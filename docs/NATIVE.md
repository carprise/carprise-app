# Native driver app (EAS)

GPS route tracking is more reliable on a real device than in the browser.

## Prerequisites

1. Expo account linked to the project (`eas login`)
2. Apple Developer + Google Play (for store builds)
3. Env on EAS secrets (or `eas.json` env):

```bash
eas secret:create --name EXPO_PUBLIC_SUPABASE_URL --value https://xfukghylbjtnywhymqrm.supabase.co
eas secret:create --name EXPO_PUBLIC_SUPABASE_ANON_KEY --value <anon-key>
eas secret:create --name EXPO_PUBLIC_AUTH_REDIRECT_URL --value https://www.carprise.co.uk/drive
```

## Builds

```bash
# Internal APK / ad-hoc iOS for pilot drivers
eas build --profile preview --platform android
eas build --profile preview --platform ios

# Store builds
eas build --profile production --platform all
```

## Location permission copy

Configured in `app.json` via `expo-location` plugin:

> Allow Carprise to measure distance travelled for your daily routes report.

## Test checklist

1. Sign in as driver  
2. Today → Route tracking **On**  
3. Drive a short loop  
4. Pull to refresh → **Live GPS** distance on Today / Routes  
5. Vehicle tab → passenger QR opens `/j/{code}`  

## Web still works

`/drive` on carprise.co.uk remains the pilot web shell. Native is the production GPS path.
