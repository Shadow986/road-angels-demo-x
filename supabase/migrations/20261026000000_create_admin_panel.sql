-- ============================================================
-- Admin Panel Migration: tables, RLS policies, storage bucket
-- ============================================================

-- ── 0a. Ensure required columns exist on profiles ───────────
alter table profiles add column if not exists role text default 'user';
alter table profiles add column if not exists is_active_member boolean default false;
alter table profiles add column if not exists full_name text;
alter table profiles add column if not exists membership_rank text default 'Bronze';
alter table profiles add column if not exists phone text;
alter table profiles add column if not exists surname text;
alter table profiles add column if not exists id_passport text;
alter table profiles add column if not exists car_make text;
alter table profiles add column if not exists address text;

-- ── 0b. Ensure vehicles table exists ────────────────────────
create table if not exists vehicles (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  make text not null,
  model text not null,
  plate text not null,
  image_url text,
  is_verified boolean default false,
  created_at timestamptz default now()
);

alter table vehicles enable row level security;

-- User can manage own vehicles
drop policy if exists "Users can manage own vehicles" on vehicles;
create policy "Users can manage own vehicles" on vehicles
  for all using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- ── 0c. Ensure payments table exists ─────────────────────────
create table if not exists payments (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete set null,
  email text not null,
  amount numeric not null,
  reference text unique not null,
  status text not null,
  created_at timestamptz default now()
);

alter table payments enable row level security;

-- Only service role (edge functions) can insert/update
drop policy if exists "service role only" on payments;
create policy "service role only" on payments
  using (false)
  with check (false);

-- Users can read their own payments
drop policy if exists "Users can read own payments" on payments;
create policy "Users can read own payments" on payments
  for select using (auth.uid() = user_id);

-- ── 0d. Ensure car-images storage bucket exists ─────────────
insert into storage.buckets (id, name, public)
values ('car-images', 'car-images', true)
on conflict (id) do nothing;

-- ── 0e. Ensure profiles table RLS + trigger ──────────────────
alter table profiles enable row level security;

drop policy if exists "Users can read own profile" on profiles;
create policy "Users can read own profile" on profiles
  for select using (auth.uid() = id);

drop policy if exists "Users can update own profile" on profiles;
create policy "Users can update own profile" on profiles
  for update using (auth.uid() = id);

create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name)
  values (
    new.id,
    new.raw_user_meta_data->>'full_name'
  )
  on conflict (id) do update
    set full_name = coalesce(excluded.full_name, profiles.full_name);
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ── 1. Helper: is_admin() function (SECURITY DEFINER) ────────
create or replace function public.is_admin()
returns boolean as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
$$ language sql security definer stable;

-- ── 2. Site Settings table ──────────────────────────────────
create table if not exists site_settings (
  id uuid default gen_random_uuid() primary key,
  key text unique not null,
  value text,
  label text,
  description text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table site_settings enable row level security;

drop policy if exists "Public can read site settings" on site_settings;
create policy "Public can read site settings" on site_settings
  for select to public using (true);

drop policy if exists "Admins can manage site settings" on site_settings;
create policy "Admins can manage site settings" on site_settings
  for all using (public.is_admin())
  with check (public.is_admin());

insert into site_settings (key, value, label, description) values
  ('membership_price', '195', 'Monthly Membership Price (R)', 'The monthly subscription fee in ZAR'),
  ('contact_phone', '+27604807393', 'Contact Phone', 'Primary WhatsApp/contact number'),
  ('contact_email', 'info@roadangelsrsa.co.za', 'Contact Email', 'Primary contact email address'),
  ('paystack_public_key', '', 'Paystack Public Key', 'Paystack inline-js public key'),
  ('site_name', 'Road Angels RSA', 'Site Name', 'Display name for the website')
on conflict (key) do nothing;

-- ── 3. Admin Audit Logs table ───────────────────────────────
create table if not exists admin_logs (
  id uuid default gen_random_uuid() primary key,
  admin_id uuid references auth.users(id) on delete set null,
  action text not null,
  target_table text,
  target_id text,
  details jsonb,
  created_at timestamptz default now()
);

alter table admin_logs enable row level security;

drop policy if exists "Admins can read admin logs" on admin_logs;
create policy "Admins can read admin logs" on admin_logs
  for select using (public.is_admin());

drop policy if exists "Admins can insert admin logs" on admin_logs;
create policy "Admins can insert admin logs" on admin_logs
  for insert with check (public.is_admin() or auth.role() = 'service_role');

-- ── 4. Admin RLS policies on existing tables ─────────────────

-- 4a. Profiles
drop policy if exists "Admins can read all profiles" on profiles;
create policy "Admins can read all profiles" on profiles
  for select using (public.is_admin());

drop policy if exists "Admins can update profiles" on profiles;
create policy "Admins can update profiles" on profiles
  for update using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "Admins can delete profiles" on profiles;
create policy "Admins can delete profiles" on profiles
  for delete using (public.is_admin());

-- 4b. Vehicles
drop policy if exists "Admins can read all vehicles" on vehicles;
create policy "Admins can read all vehicles" on vehicles
  for select using (public.is_admin());

drop policy if exists "Admins can update vehicles" on vehicles;
create policy "Admins can update vehicles" on vehicles
  for update using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "Admins can delete vehicles" on vehicles;
create policy "Admins can delete vehicles" on vehicles
  for delete using (public.is_admin());

-- 4c. Payments
drop policy if exists "Admins can read all payments" on payments;
create policy "Admins can read all payments" on payments
  for select using (public.is_admin());

drop policy if exists "Admins can update payments" on payments;
create policy "Admins can update payments" on payments
  for update using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "Admins can delete payments" on payments;
create policy "Admins can delete payments" on payments
  for delete using (public.is_admin());

-- ── 5. Admin uploads storage bucket ─────────────────────────
insert into storage.buckets (id, name, public)
values ('admin-uploads', 'admin-uploads', true)
on conflict (id) do nothing;

drop policy if exists "Admins can upload to admin-uploads" on storage.objects;
create policy "Admins can upload to admin-uploads" on storage.objects
  for insert to authenticated
  with check (bucket_id = 'admin-uploads' and public.is_admin());

drop policy if exists "Public can view admin-uploads" on storage.objects;
create policy "Public can view admin-uploads" on storage.objects
  for select to public
  using (bucket_id = 'admin-uploads');

drop policy if exists "Admins can delete admin-uploads" on storage.objects;
create policy "Admins can delete admin-uploads" on storage.objects
  for delete to authenticated
  using (bucket_id = 'admin-uploads' and public.is_admin());

drop policy if exists "Admins can update admin-uploads" on storage.objects;
create policy "Admins can update admin-uploads" on storage.objects
  for update to authenticated
  using (bucket_id = 'admin-uploads' and public.is_admin())
  with check (bucket_id = 'admin-uploads' and public.is_admin());

-- ── 6. Helper function: log admin action ────────────────────
create or replace function log_admin_action(
  p_admin_id uuid,
  p_action text,
  p_target_table text default null,
  p_target_id text default null,
  p_details jsonb default null
) returns void as $$
begin
  insert into admin_logs (admin_id, action, target_table, target_id, details)
  values (p_admin_id, p_action, p_target_table, p_target_id, p_details);
end;
$$ language plpgsql security definer;

-- ── 7. updated_at trigger for site_settings ──────────────────
create or replace function update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists site_settings_updated_at on site_settings;
create trigger site_settings_updated_at
  before update on site_settings
  for each row execute function update_updated_at_column();

-- ── 8. Create temporary admin user ──────────────────────────
-- Creates an auth user with a known email/password and grants admin role.
-- Email: admin@roadangels.co.za
-- Password: Admin@2026
--
-- IMPORTANT: Change this password immediately after first login.
-- To remove the temp admin later, run:
--   delete from auth.users where email = 'admin@roadangels.co.za';
--   delete from profiles where email = 'admin@roadangels.co.za';

-- Insert into auth.users (raw, with bcrypt-hashed password)
-- Password hash for 'Admin@2026' generated with crypt() and bf (blowfish)
do $$
declare
  admin_uuid uuid := gen_random_uuid();
  hashed_pw text;
begin
  -- Check if admin user already exists
  if not exists (select 1 from auth.users where email = 'admin@roadangels.co.za') then
    -- Generate bcrypt hash for the password
    hashed_pw := crypt('Admin@2026', gen_salt('bf'));

    -- Insert into auth.users
    insert into auth.users (
      id,
      aud,
      role,
      email,
      encrypted_password,
      email_confirmed_at,
      created_at,
      updated_at,
      raw_app_meta_data,
      raw_user_meta_data,
      is_sso_user,
      instance_id
    ) values (
      admin_uuid,
      'authenticated',
      'authenticated',
      'admin@roadangels.co.za',
      hashed_pw,
      now(),
      now(),
      now(),
      '{}'::jsonb,
      '{"full_name": "Admin"}'::jsonb,
      false,
      '00000000-0000-0000-0000-000000000000'
    );

    -- Create profile row with admin role
    insert into public.profiles (id, role, full_name, is_active_member, membership_rank)
    values (admin_uuid, 'admin', 'Admin', true, 'Elite')
    on conflict (id) do nothing;

    -- Also set email in profiles if column exists
    -- (profiles table may not have an email column; auth.users is the source of truth)
  end if;
end;
$$;

-- If the profiles table has an email column, set it for the admin
do $$
begin
  update profiles set email = 'admin@roadangels.co.za'
  where id = (select id from auth.users where email = 'admin@roadangels.co.za');
exception when others then
  null; -- profiles might not have an email column, ignore
end;
$$;
