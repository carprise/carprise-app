-- Passenger cabin requests (Ask / Listen / Ride) for the driver app inbox.
-- Safe to re-run in the Supabase SQL editor.

create table if not exists public.passenger_requests (
  id uuid primary key default gen_random_uuid(),
  vehicle_id uuid references public.vehicles(id) on delete cascade,
  journey_code text,
  kind text not null,
  title text not null,
  body text,
  status text not null default 'open',
  created_at timestamptz default now(),
  resolved_at timestamptz
);

create index if not exists idx_passenger_requests_vehicle
  on public.passenger_requests (vehicle_id, status, created_at desc);

alter table public.passenger_requests enable row level security;

drop policy if exists passenger_requests_driver_read on public.passenger_requests;
create policy passenger_requests_driver_read
  on public.passenger_requests
  for select
  to authenticated
  using (
    vehicle_id in (
      select v.id from public.vehicles v where v.driver_id = auth.uid()
    )
  );

drop policy if exists passenger_requests_driver_update on public.passenger_requests;
create policy passenger_requests_driver_update
  on public.passenger_requests
  for update
  to authenticated
  using (
    vehicle_id in (
      select v.id from public.vehicles v where v.driver_id = auth.uid()
    )
  );
