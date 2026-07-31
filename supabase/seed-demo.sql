-- Optional demo seed for Supabase (run after full-schema.sql)
-- Replace owner UUIDs with real auth.users ids after creating accounts.

insert into public.brands (id, name, category, contact_email, subscription_tier)
values
  ('11111111-1111-1111-1111-111111111111', 'Northern Brew Co', 'FMCG · Beverage', 'campaigns@northernbrew.co.uk', 'pilot'),
  ('22222222-2222-2222-2222-222222222222', 'Glow Lab Skincare', 'Beauty · Sampling', 'partnerships@glowlab.uk', 'pilot'),
  ('33333333-3333-3333-3333-333333333333', 'MetroSnack', 'Retail · Snacking', 'trade@metrosnack.com', 'growth')
on conflict do nothing;

insert into public.fleet_operators (id, name, city, contact_email, subscription_tier, monthly_fee_pence)
values
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'MCR Executive Cars', 'Manchester', 'ops@mcrexec.demo', 'pilot', 2000),
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'Northern Ride Partners', 'Manchester', 'hello@nrp.demo', 'pilot', 1500)
on conflict do nothing;

insert into public.campaigns (id, brand_id, brand, title, description, area, starts_on, ends_on, payment_pence, budget_pence, campaign_type, status, target_vehicles)
values
  (
    'c1111111-1111-1111-1111-111111111111',
    '11111111-1111-1111-1111-111111111111',
    'Northern Brew Co',
    'Cold Brew Discovery',
    'In-journey sampling and retail of ready-to-drink cold brew.',
    'Manchester city centre',
    '2026-03-01',
    '2026-04-15',
    12000,
    450000,
    'hybrid',
    'live',
    20
  ),
  (
    'c2222222-2222-2222-2222-222222222222',
    '22222222-2222-2222-2222-222222222222',
    'Glow Lab Skincare',
    'Glow On The Go',
    'Mini serum samples with QR-led brand story.',
    'Manchester & Salford',
    '2026-03-10',
    '2026-05-01',
    9500,
    320000,
    'sampling',
    'live',
    15
  )
on conflict do nothing;

insert into public.products (brand_id, campaign_id, name, description, sku, retail_price_pence, product_type, active)
values
  ('11111111-1111-1111-1111-111111111111', 'c1111111-1111-1111-1111-111111111111', 'Northern Brew RTD 250ml', 'Smooth cold brew RTD.', 'NBC-RTD-250', 350, 'retail', true),
  ('11111111-1111-1111-1111-111111111111', 'c1111111-1111-1111-1111-111111111111', 'Cold Brew Sample Shot', 'Complimentary 60ml sample.', 'NBC-SAMP-60', 0, 'sample', true),
  ('22222222-2222-2222-2222-222222222222', 'c2222222-2222-2222-2222-222222222222', 'Glow Serum Mini', 'Travel-size vitamin C serum sample.', 'GLW-SER-MINI', 0, 'sample', true);
