-- Live distance telemetry, driver stock RLS, passenger journey reads.
-- Run in Supabase SQL Editor (safe to re-run).

-- ---------------------------------------------------------------------------
-- Products / inventory (if not already present)
-- ---------------------------------------------------------------------------
create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  brand_id uuid,
  campaign_id uuid references public.campaigns(id) on delete set null,
  name text not null,
  description text,
  sku text,
  retail_price_pence int not null default 0,
  wholesale_price_pence int default 0,
  product_type text default 'retail',
  image_url text,
  active boolean default true,
  created_at timestamptz default now()
);

create table if not exists public.inventory (
  id uuid primary key default gen_random_uuid(),
  product_id uuid references public.products(id) on delete cascade,
  vehicle_id uuid references public.vehicles(id) on delete cascade,
  quantity int not null default 0,
  reserved int not null default 0,
  low_at int not null default 3,
  updated_at timestamptz default now()
);

do $$ begin
  alter table public.inventory add column if not exists low_at int not null default 3;
exception when others then null;
end $$;

create index if not exists idx_inventory_vehicle on public.inventory(vehicle_id);
create index if not exists idx_inventory_product on public.inventory(product_id);
create index if not exists idx_products_active on public.products(active);

-- ---------------------------------------------------------------------------
-- GPS / journey telemetry
-- ---------------------------------------------------------------------------
create table if not exists public.telemetry_points (
  id uuid primary key default gen_random_uuid(),
  driver_id uuid not null references public.profiles(id) on delete cascade,
  vehicle_id uuid references public.vehicles(id) on delete set null,
  recorded_at timestamptz not null default now(),
  lat double precision not null,
  lng double precision not null,
  accuracy_m double precision,
  speed_mps double precision,
  heading double precision,
  source text default 'app',
  created_at timestamptz default now()
);

create index if not exists idx_telemetry_driver_time
  on public.telemetry_points (driver_id, recorded_at desc);
create index if not exists idx_telemetry_vehicle_time
  on public.telemetry_points (vehicle_id, recorded_at desc);

create table if not exists public.journey_sessions (
  id uuid primary key default gen_random_uuid(),
  vehicle_id uuid references public.vehicles(id),
  journey_code text,
  passenger_token text,
  started_at timestamptz default now(),
  ended_at timestamptz,
  city text,
  distance_km double precision default 0,
  metadata jsonb default '{}'::jsonb
);

-- ---------------------------------------------------------------------------
-- Daily aggregate helper (callable by authenticated drivers)
-- ---------------------------------------------------------------------------
create or replace function public.driver_daily_stats(
  p_driver_id uuid,
  p_day date default (timezone('Europe/London', now()))::date
)
returns table (
  distance_km double precision,
  point_count bigint,
  first_at timestamptz,
  last_at timestamptz,
  active_minutes double precision,
  journeys int
)
language sql
stable
security definer
set search_path = public
as $$
  with bounds as (
    select
      (p_day::timestamp at time zone 'Europe/London') as day_start,
      ((p_day + 1)::timestamp at time zone 'Europe/London') as day_end
  ),
  pts as (
    select
      t.lat,
      t.lng,
      t.recorded_at,
      lag(t.lat) over (order by t.recorded_at) as prev_lat,
      lag(t.lng) over (order by t.recorded_at) as prev_lng,
      lag(t.recorded_at) over (order by t.recorded_at) as prev_at
    from public.telemetry_points t, bounds b
    where t.driver_id = p_driver_id
      and t.recorded_at >= b.day_start
      and t.recorded_at < b.day_end
  ),
  segs as (
    select
      recorded_at,
      prev_at,
      case
        when prev_lat is null then 0
        else 6371.0 * 2 * asin(least(1.0, sqrt(
          power(sin(radians(lat - prev_lat) / 2), 2) +
          cos(radians(prev_lat)) * cos(radians(lat)) *
          power(sin(radians(lng - prev_lng) / 2), 2)
        )))
      end as seg_km,
      case
        when prev_at is null then 0
        else extract(epoch from (recorded_at - prev_at)) / 60.0
      end as gap_min
    from pts
  )
  select
    coalesce(sum(case when seg_km < 5 then seg_km else 0 end), 0)::double precision as distance_km,
    count(*)::bigint as point_count,
    min(recorded_at) as first_at,
    max(recorded_at) as last_at,
    coalesce(
      sum(case when gap_min > 0 and gap_min <= 12 then gap_min else 0 end),
      0
    )::double precision as active_minutes,
    greatest(
      1,
      (1 + count(*) filter (where gap_min > 20))::int
    ) as journeys
  from segs;
$$;

revoke all on function public.driver_daily_stats(uuid, date) from public;
grant execute on function public.driver_daily_stats(uuid, date) to authenticated;
grant execute on function public.driver_daily_stats(uuid, date) to service_role;

-- ---------------------------------------------------------------------------
-- RLS
-- ---------------------------------------------------------------------------
alter table public.products enable row level security;
alter table public.inventory enable row level security;
alter table public.telemetry_points enable row level security;
alter table public.journey_sessions enable row level security;

-- Products: authenticated drivers can read active catalogue
drop policy if exists products_select_active on public.products;
create policy products_select_active on public.products
  for select to authenticated
  using (active = true);

-- Inventory: drivers read stock on vehicles they own
drop policy if exists inventory_select_own_vehicle on public.inventory;
create policy inventory_select_own_vehicle on public.inventory
  for select to authenticated
  using (
    exists (
      select 1 from public.vehicles v
      where v.id = inventory.vehicle_id
        and v.driver_id = auth.uid()
    )
  );

-- Telemetry: drivers insert + read own points
drop policy if exists telemetry_insert_own on public.telemetry_points;
create policy telemetry_insert_own on public.telemetry_points
  for insert to authenticated
  with check (driver_id = auth.uid());

drop policy if exists telemetry_select_own on public.telemetry_points;
create policy telemetry_select_own on public.telemetry_points
  for select to authenticated
  using (driver_id = auth.uid());

-- Journey sessions: service role / ops manages; drivers can read their vehicle sessions
drop policy if exists journey_sessions_select_own on public.journey_sessions;
create policy journey_sessions_select_own on public.journey_sessions
  for select to authenticated
  using (
    exists (
      select 1 from public.vehicles v
      where v.id = journey_sessions.vehicle_id
        and v.driver_id = auth.uid()
    )
  );

-- Public vehicle lookup by journey code is done via website service-role API
-- (no broad anon grant on vehicles).

comment on table public.telemetry_points is 'Driver app GPS samples for daily distance / routes report';
comment on function public.driver_daily_stats is 'Haversine daily distance + journey estimates for a driver';

-- Earnings ledger: drivers can read own rows; insert own campaign completions
create table if not exists public.earnings_ledger (
  id uuid primary key default gen_random_uuid(),
  driver_id uuid references public.profiles(id),
  assignment_id uuid references public.campaign_assignments(id),
  transaction_id uuid,
  amount_pence int not null,
  entry_type text default 'campaign',
  description text,
  status text default 'pending',
  created_at timestamptz default now()
);

alter table public.earnings_ledger enable row level security;

drop policy if exists earnings_select_own on public.earnings_ledger;
create policy earnings_select_own on public.earnings_ledger
  for select to authenticated
  using (driver_id = auth.uid());

drop policy if exists earnings_insert_own on public.earnings_ledger;
create policy earnings_insert_own on public.earnings_ledger
  for insert to authenticated
  with check (driver_id = auth.uid());
