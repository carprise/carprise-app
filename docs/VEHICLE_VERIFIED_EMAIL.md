# Email when a vehicle is verified

**Today:** changing `verification_status` to `verified` in Supabase only updates the database.  
**With this setup:** the driver gets an email from `support@carprise.co.uk`.

## What the email says

- Vehicle is approved for the Carprise network  
- Link to open the driver app: `https://www.carprise.co.uk/drive`  
- From: Carprise / support@  

## Setup (about 10 minutes)

### 1. Deploy the Edge Function

From the project root (with [Supabase CLI](https://supabase.com/docs/guides/cli) logged in):

```bash
npx supabase login
npx supabase link --project-ref xfukghylbjtnywhymqrm
npx supabase secrets set RESEND_API_KEY=re_xxxxxxxx
npx supabase secrets set RESEND_FROM_EMAIL="Carprise <support@carprise.co.uk>"
npx supabase secrets set DRIVER_APP_URL=https://www.carprise.co.uk/drive
npx supabase functions deploy notify-vehicle-verified
```

`SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` are usually injected automatically for Edge Functions.

### 2. Database Webhook (recommended)

In Supabase Dashboard:

1. **Database → Webhooks → Create a new hook**
2. **Name:** `vehicle-verified-email`
3. **Table:** `vehicles`
4. **Events:** `UPDATE`
5. **Type:** HTTP Request  
6. **Method:** POST  
7. **URL:**  
   `https://xfukghylbjtnywhymqrm.supabase.co/functions/v1/notify-vehicle-verified`
8. **HTTP Headers:**
   - `Content-Type` = `application/json`
   - `Authorization` = `Bearer <ANON_KEY or SERVICE_ROLE_KEY>`
9. Save

The function only sends mail when:

- `record.verification_status` is `verified`, and  
- `old_record.verification_status` was **not** `verified`

So re-saving an already-verified car does not spam the driver.

### 3. Test

1. Set a vehicle to `pending` (if needed).  
2. Change `verification_status` to `verified` in Table Editor.  
3. Check:
   - Edge Function logs  
   - Resend dashboard (email delivered)  
   - Driver inbox (and spam)

## Manual fallback (pilot, no function)

If you prefer not to automate yet:

1. Verify the vehicle in Supabase.  
2. Email the driver from `support@carprise.co.uk` (or Resend) yourself:

**Subject:** Your vehicle has been verified – Carprise  

**Body:**  
Hi [name],  
Your vehicle has been reviewed and approved for the Carprise driver network.  
Open the app: https://www.carprise.co.uk/drive  
– The Carprise team  

## Troubleshooting

| Issue | Check |
|--------|--------|
| No email | Webhook fired? Function logs? Resend domain verified? |
| 401 from function | Authorization header key correct |
| 404 driver email | `driver_id` must match `auth.users` / profile id |
| Email works but wrong From | `RESEND_FROM_EMAIL` secret and domain verification |

## Files

- `supabase/functions/notify-vehicle-verified/index.ts` – sends the email  
- `supabase/vehicle-verified-notify.sql` – optional notes / manual HTTP post  
