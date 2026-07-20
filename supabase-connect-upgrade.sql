-- Run this once in Supabase SQL Editor after the original supabase-schema.sql.

create policy "Drivers insert own profile"
on public.profiles for insert
to authenticated
with check (auth.uid() = id);

create policy "Authenticated drivers read available campaigns"
on public.campaigns for select
to authenticated
using (
  exists (
    select 1 from public.campaign_assignments assignment
    where assignment.campaign_id = campaigns.id
      and assignment.driver_id = auth.uid()
  )
);

create policy "Drivers upload own vehicle photos"
on storage.objects for insert
to authenticated
with check (
  bucket_id = 'vehicle-photos'
  and (storage.foldername(name))[1] = auth.uid()::text
);

create policy "Drivers read own vehicle photos"
on storage.objects for select
to authenticated
using (
  bucket_id = 'vehicle-photos'
  and (storage.foldername(name))[1] = auth.uid()::text
);

create policy "Drivers upload own campaign evidence"
on storage.objects for insert
to authenticated
with check (
  bucket_id = 'campaign-evidence'
  and (storage.foldername(name))[1] = auth.uid()::text
);

create policy "Drivers read own campaign evidence"
on storage.objects for select
to authenticated
using (
  bucket_id = 'campaign-evidence'
  and (storage.foldername(name))[1] = auth.uid()::text
);
