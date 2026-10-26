-- ============================================================
-- Admin Panel Migration: tables, RLS policies, storage bucket
-- ============================================================

-- ── 0. Helper: is_admin() function (SECURITY DEFINER) ────────
-- Bypasses RLS to check the current user's role without causing
-- infinite recursion on the profiles table policies.
create or replace function public.is_admin()
returns boolean as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
$$ language sql security definer stable;

-- ── 1. Site Settings table ──────────────────────────────────
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

-- ── 2. Admin Audit Logs table ───────────────────────────────
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

-- ── 3. Admin RLS policies on existing tables ─────────────────

-- 3a. Profiles
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

-- 3b. Vehicles
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

-- 3c. Payments
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

-- ── 4. Admin uploads storage bucket ─────────────────────────
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

-- ── 5. Helper function: log admin action ────────────────────
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

-- ── 6. updated_at trigger for site_settings ──────────────────
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
