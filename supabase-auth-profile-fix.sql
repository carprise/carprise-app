-- Run once in Supabase SQL Editor.
-- This safely creates a driver profile whenever a new Auth user is created.

create or replace function public.handle_new_driver_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, first_name, last_name)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'first_name', ''),
    coalesce(new.raw_user_meta_data ->> 'last_name', '')
  )
  on conflict (id) do update set
    first_name = coalesce(nullif(excluded.first_name, ''), public.profiles.first_name),
    last_name = coalesce(nullif(excluded.last_name, ''), public.profiles.last_name);
  return new;
end;
$$;

drop trigger if exists on_auth_user_created_create_driver_profile on auth.users;

create trigger on_auth_user_created_create_driver_profile
after insert on auth.users
for each row execute procedure public.handle_new_driver_user();

-- Backfill profiles for accounts that were already created before this trigger existed.
insert into public.profiles (id, first_name, last_name)
select
  u.id,
  coalesce(u.raw_user_meta_data ->> 'first_name', ''),
  coalesce(u.raw_user_meta_data ->> 'last_name', '')
from auth.users u
left join public.profiles p on p.id = u.id
where p.id is null
on conflict (id) do nothing;
