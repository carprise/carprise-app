# Automatic email when a vehicle is verified

When `verification_status` is changed to **`verified`**, the driver is emailed automatically from **Carprise &lt;support@carprise.co.uk&gt;**.

## Setup (do this once)

### 1. Enable extension
Supabase → **Database → Extensions** → turn on **`pg_net`**.

### 2. Run SQL
1. Open `supabase/vehicle-verified-email-trigger.sql`
2. Find `re_REPLACE_WITH_YOUR_RESEND_KEY` and replace with your real Resend API key
3. Supabase → **SQL Editor** → paste entire file → **Run**

### 3. Test
1. **Table Editor → vehicles**
2. Set a car to `pending` (if it is already verified)
3. Change to `verified`
4. Check Resend logs + the driver’s email inbox

## What the driver gets

- Subject: **Your vehicle has been verified - Carprise**
- From: **support@carprise.co.uk**
- Link: https://www.carprise.co.uk/drive

## Change Resend key later

```sql
update private.app_config
set value = 're_NEW_KEY_HERE'
where key = 'resend_api_key';
```

## Notes

- Only fires on **change to** `verified` (not every save)
- Uses the email on the Auth user linked by `driver_id`
- Needs Resend domain `carprise.co.uk` verified
