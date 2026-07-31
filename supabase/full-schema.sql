-- Carprise full platform schema (Phase 1–3 pilot ready)
-- Run in Supabase SQL editor after auth is enabled.
-- Extends the original driver-only tables safely.

-- Roles: driver | brand | admin | fleet
create table if not exists public.profiles (
  id uuid primary key references auth.users on delete cascade,
  first_name text,
  last_name text,
  phone text,
  role text not null default 'driver' check (role in ('driver','brand','admin','fleet')),
  company_name text,
  rating numeric default 5,
  onboarding_complete boolean default false,
  bank_sort_code text,
  bank_account_last4 text,
  payout_method text default 'bank',
  created_at timestamptz default now()
);

create table if not exists public.fleet_operators (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  city text,
  contact_email text,
  subscription_tier text default 'pilot',
  monthly_fee_pence int default 0,
  created_at timestamptz default now()
);

create table if not exists public.vehicles (
  id uuid primary key default gen_random_uuid(),
  driver_id uuid references public.profiles(id) on delete cascade,
  fleet_id uuid references public.fleet_operators(id),
  make text,
  model text,
  year int,
  colour text,
  registration text,
  verification_status text default 'pending',
  journey_code text unique,
  hardware_status text default 'not_installed',
  city text default 'Manchester',
  active boolean default true,
  created_at timestamptz default now()
);

create table if not exists public.brands (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid references public.profiles(id),
  name text not null,
  category text,
  contact_email text,
  subscription_tier text default 'pilot',
  created_at timestamptz default now()
);

create table if not exists public.campaigns (
  id uuid primary key default gen_random_uuid(),
  brand_id uuid references public.brands(id),
  brand text not null,
  title text not null,
  description text,
  area text,
  starts_on date,
  ends_on date,
  payment_pence int not null default 0,
  budget_pence int default 0,
  campaign_type text default 'awareness' check (campaign_type in ('awareness','sampling','retail','hybrid')),
  status text default 'draft',
  target_vehicles int default 10,
  impressions_goal int default 0,
  created_at timestamptz default now()
);

create table if not exists public.campaign_assignments (
  id uuid primary key default gen_random_uuid(),
  campaign_id uuid references public.campaigns(id) on delete cascade,
  driver_id uuid references public.profiles(id),
  vehicle_id uuid references public.vehicles(id),
  status text default 'invited',
  progress int default 0,
  revenue_share_pence int default 0,
  created_at timestamptz default now()
);

create table if not exists public.evidence (
  id uuid primary key default gen_random_uuid(),
  assignment_id uuid references public.campaign_assignments(id) on delete cascade,
  driver_id uuid references public.profiles(id),
  storage_path text not null,
  evidence_type text,
  review_status text default 'pending',
  reviewer_note text,
  created_at timestamptz default now()
);

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  brand_id uuid references public.brands(id),
  campaign_id uuid references public.campaigns(id),
  name text not null,
  description text,
  sku text,
  retail_price_pence int not null default 0,
  wholesale_price_pence int default 0,
  product_type text default 'retail' check (product_type in ('retail','sample','service')),
  image_url text,
  active boolean default true,
  created_at timestamptz default now()
);

create table if not exists public.inventory (
  id uuid primary key default gen_random_uuid(),
  product_id uuid references public.products(id) on delete cascade,
  vehicle_id uuid references public.vehicles(id),
  quantity int not null default 0,
  reserved int not null default 0,
  updated_at timestamptz default now()
);

create table if not exists public.journey_sessions (
  id uuid primary key default gen_random_uuid(),
  vehicle_id uuid references public.vehicles(id),
  journey_code text,
  passenger_token text,
  started_at timestamptz default now(),
  ended_at timestamptz,
  city text
);

create table if not exists public.transactions (
  id uuid primary key default gen_random_uuid(),
  journey_id uuid references public.journey_sessions(id),
  vehicle_id uuid references public.vehicles(id),
  product_id uuid references public.products(id),
  campaign_id uuid references public.campaigns(id),
  amount_pence int not null,
  platform_fee_pence int default 0,
  driver_share_pence int default 0,
  brand_share_pence int default 0,
  status text default 'completed',
  transaction_type text default 'purchase' check (transaction_type in ('purchase','sample','engagement','subscription')),
  created_at timestamptz default now()
);

create table if not exists public.sample_claims (
  id uuid primary key default gen_random_uuid(),
  journey_id uuid references public.journey_sessions(id),
  product_id uuid references public.products(id),
  vehicle_id uuid references public.vehicles(id),
  passenger_email text,
  status text default 'claimed',
  created_at timestamptz default now()
);

create table if not exists public.earnings_ledger (
  id uuid primary key default gen_random_uuid(),
  driver_id uuid references public.profiles(id),
  assignment_id uuid references public.campaign_assignments(id),
  transaction_id uuid references public.transactions(id),
  amount_pence int not null,
  entry_type text default 'campaign',
  description text,
  status text default 'pending',
  created_at timestamptz default now()
);

create table if not exists public.engagement_events (
  id uuid primary key default gen_random_uuid(),
  journey_id uuid references public.journey_sessions(id),
  vehicle_id uuid references public.vehicles(id),
  campaign_id uuid references public.campaigns(id),
  event_type text not null,
  metadata jsonb default '{}'::jsonb,
  created_at timestamptz default now()
);

-- Journey code generator
create or replace function public.generate_journey_code()
returns trigger as $$
begin
  if new.journey_code is null or new.journey_code = '' then
    new.journey_code := upper(substr(replace(gen_random_uuid()::text, '-', ''), 1, 8));
  end if;
  return new;
end;
$$ language plpgsql;

drop trigger if exists vehicles_journey_code on public.vehicles;
create trigger vehicles_journey_code
  before insert on public.vehicles
  for each row execute function public.generate_journey_code();

-- Profile bootstrap on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, first_name, last_name, role)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'first_name', ''),
    coalesce(new.raw_user_meta_data->>'last_name', ''),
    coalesce(new.raw_user_meta_data->>'role', 'driver')
  )
  on conflict (id) do nothing;
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- RLS
alter table public.profiles enable row level security;
alter table public.vehicles enable row level security;
alter table public.campaigns enable row level security;
alter table public.campaign_assignments enable row level security;
alter table public.evidence enable row level security;
alter table public.products enable row level security;
alter table public.inventory enable row level security;
alter table public.journey_sessions enable row level security;
alter table public.transactions enable row level security;
alter table public.sample_claims enable row level security;
alter table public.earnings_ledger enable row level security;
alter table public.engagement_events enable row level security;
alter table public.brands enable row level security;
alter table public.fleet_operators enable row level security;

-- Driver policies
drop policy if exists "Drivers read own profile" on public.profiles;
create policy "Drivers read own profile" on public.profiles for select using (auth.uid() = id);
drop policy if exists "Drivers update own profile" on public.profiles;
create policy "Drivers update own profile" on public.profiles for update using (auth.uid() = id);
drop policy if exists "Drivers insert own profile" on public.profiles;
create policy "Drivers insert own profile" on public.profiles for insert with check (auth.uid() = id);

drop policy if exists "Drivers manage own vehicles" on public.vehicles;
create policy "Drivers manage own vehicles" on public.vehicles for all using (auth.uid() = driver_id) with check (auth.uid() = driver_id);

drop policy if exists "Drivers read assignments" on public.campaign_assignments;
create policy "Drivers read assignments" on public.campaign_assignments for select using (auth.uid() = driver_id);
drop policy if exists "Drivers update assignments" on public.campaign_assignments;
create policy "Drivers update assignments" on public.campaign_assignments for update using (auth.uid() = driver_id);

drop policy if exists "Drivers manage evidence" on public.evidence;
create policy "Drivers manage evidence" on public.evidence for all using (auth.uid() = driver_id) with check (auth.uid() = driver_id);

drop policy if exists "Drivers read own earnings" on public.earnings_ledger;
create policy "Drivers read own earnings" on public.earnings_ledger for select using (auth.uid() = driver_id);

-- Public passenger read for active vehicle journey (anon)
drop policy if exists "Public read vehicles by journey code" on public.vehicles;
create policy "Public read vehicles by journey code" on public.vehicles for select using (active = true);

drop policy if exists "Public read active products" on public.products;
create policy "Public read active products" on public.products for select using (active = true);

drop policy if exists "Public read live campaigns" on public.campaigns;
create policy "Public read live campaigns" on public.campaigns for select using (status in ('live','active','pilot'));

drop policy if exists "Anyone insert journey sessions" on public.journey_sessions;
create policy "Anyone insert journey sessions" on public.journey_sessions for insert with check (true);
drop policy if exists "Anyone read journey sessions" on public.journey_sessions;
create policy "Anyone read journey sessions" on public.journey_sessions for select using (true);

drop policy if exists "Anyone insert sample claims" on public.sample_claims;
create policy "Anyone insert sample claims" on public.sample_claims for insert with check (true);
drop policy if exists "Anyone insert transactions" on public.transactions;
create policy "Anyone insert transactions" on public.transactions for insert with check (true);
drop policy if exists "Anyone insert engagement" on public.engagement_events;
create policy "Anyone insert engagement" on public.engagement_events for insert with check (true);

-- Brand owner policies
drop policy if exists "Brand owners manage brands" on public.brands;
create policy "Brand owners manage brands" on public.brands for all using (auth.uid() = owner_id) with check (auth.uid() = owner_id);

-- Storage buckets (run in dashboard or via API): vehicle-photos, campaign-evidence
-- Indexes
create index if not exists idx_vehicles_journey_code on public.vehicles(journey_code);
create index if not exists idx_assignments_driver on public.campaign_assignments(driver_id);
create index if not exists idx_campaigns_status on public.campaigns(status);
create index if not exists idx_transactions_vehicle on public.transactions(vehicle_id);
create index if not exists idx_earnings_driver on public.earnings_ledger(driver_id);
