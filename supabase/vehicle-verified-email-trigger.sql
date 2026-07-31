-- =============================================================================
-- AUTOMATIC EMAIL when vehicles.verification_status becomes 'verified'
--
-- Run once in Supabase → SQL Editor
--
-- STEPS:
-- 1. Database → Extensions → enable "pg_net"
-- 2. Replace re_REPLACE_WITH_YOUR_RESEND_KEY below with your Resend API key
-- 3. Run this whole script
-- 4. Test: set a vehicle to verified in Table Editor → check driver inbox
-- =============================================================================

create extension if not exists pg_net with schema extensions;

-- Private config (not exposed to anon clients)
create schema if not exists private;

create table if not exists private.app_config (
  key text primary key,
  value text not null
);

revoke all on schema private from public, anon, authenticated;
revoke all on all tables in schema private from public, anon, authenticated;

-- Store Resend key (edit the value, then run)
insert into private.app_config (key, value)
values ('resend_api_key', 're_REPLACE_WITH_YOUR_RESEND_KEY')
on conflict (key) do update set value = excluded.value;

create or replace function public.notify_driver_vehicle_verified()
returns trigger
language plpgsql
security definer
set search_path = public, extensions, auth, private
as $$
declare
  driver_email text;
  driver_name text;
  vehicle_label text;
  reg_label text;
  api_key text;
  email_html text;
  email_text text;
  resend_from text := 'Carprise <support@carprise.co.uk>';
  app_url text := 'https://www.carprise.co.uk/drive';
begin
  if new.verification_status is distinct from 'verified' then
    return new;
  end if;
  if tg_op = 'UPDATE' and old.verification_status is not distinct from 'verified' then
    return new;
  end if;

  select u.email,
         coalesce(nullif(trim(u.raw_user_meta_data ->> 'first_name'), ''), 'driver')
  into driver_email, driver_name
  from auth.users u
  where u.id = new.driver_id;

  if driver_email is null or btrim(driver_email) = '' then
    raise warning 'notify_driver_vehicle_verified: no email for driver %', new.driver_id;
    return new;
  end if;

  select c.value into api_key
  from private.app_config c
  where c.key = 'resend_api_key'
  limit 1;

  if api_key is null
     or api_key = ''
     or api_key like '%REPLACE_WITH_YOUR_RESEND_KEY%' then
    raise warning 'notify_driver_vehicle_verified: set private.app_config resend_api_key first';
    return new;
  end if;

  vehicle_label := trim(both ' ' from concat_ws(' ', new.year::text, new.make, new.model));
  if vehicle_label = '' then
    vehicle_label := 'your vehicle';
  end if;

  reg_label := case
    when coalesce(new.registration, '') <> '' then ' (' || new.registration || ')'
    else ''
  end;

  email_html := format(
    $html$
    <div style="font-family:Arial,Helvetica,sans-serif;line-height:1.6;color:#08090b">
      <h2 style="font-weight:500">You&apos;re verified</h2>
      <p>Hi %s,</p>
      <p>Great news – <strong>%s%s</strong> has been reviewed and approved for the Carprise driver network.</p>
      <p>You can now take part in matched campaigns. Open the driver app to check for invitations.</p>
      <p>
        <a href="%s" style="display:inline-block;padding:12px 18px;background:#08090b;color:#f3f0e8;text-decoration:none;font-weight:700">
          Open driver app
        </a>
      </p>
      <p style="color:#5d5c58;font-size:13px">
        Questions? Contact <a href="mailto:support@carprise.co.uk">support@carprise.co.uk</a>.
      </p>
      <p>- The Carprise team</p>
    </div>
    $html$,
    driver_name,
    vehicle_label,
    reg_label,
    app_url
  );

  email_text := format(
    E'Hi %s,\n\nGreat news – %s%s has been reviewed and approved for the Carprise driver network.\n\nOpen the driver app: %s\n\nQuestions? support@carprise.co.uk\n- The Carprise team\n',
    driver_name,
    vehicle_label,
    reg_label,
    app_url
  );

  perform net.http_post(
    url := 'https://api.resend.com/emails',
    headers := jsonb_build_object(
      'Authorization', 'Bearer ' || api_key,
      'Content-Type', 'application/json'
    ),
    body := jsonb_build_object(
      'from', resend_from,
      'to', jsonb_build_array(driver_email),
      'subject', 'Your vehicle has been verified - Carprise',
      'html', email_html,
      'text', email_text
    )
  );

  return new;
end;
$$;

drop trigger if exists vehicles_notify_verified on public.vehicles;

create trigger vehicles_notify_verified
after update of verification_status on public.vehicles
for each row
when (new.verification_status = 'verified' and old.verification_status is distinct from 'verified')
execute function public.notify_driver_vehicle_verified();

-- Optional: also allow INSERT already verified (rare)
-- drop trigger if exists vehicles_notify_verified_insert on public.vehicles;
-- create trigger vehicles_notify_verified_insert
-- after insert on public.vehicles
-- for each row
-- when (new.verification_status = 'verified')
-- execute function public.notify_driver_vehicle_verified();
