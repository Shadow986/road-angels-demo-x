-- ============================================================
-- Admin Panel Migration: tables, RLS policies, storage bucket
-- ============================================================

-- ── 1. Site Settings table ──────────────────────────────────
-- Stores editable site-wide configuration as key/value pairs
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

-- Public can read settings (so the site can display them)
drop policy if exists "Public can read site settings" on site_settings;
create policy "Public can read site settings" on site_settings
  for select to public using (true);

-- Only admins can write settings
drop policy if exists "Admins can manage site settings" on site_settings;
create policy "Admins can manage site settings" on site_settings
  for all using (
    exists (select 1 from profiles p where p.id = auth.uid() and p.role = 'admin')
  )
  with check (
    exists (select 1 from profiles p where p.id = auth.uid() and p.role = 'admin')
  );

-- Seed default settings
insert into site_settings (key, value, label, description) values
  ('membership_price', '195', 'Monthly Membership Price (R)', 'The monthly subscription fee in ZAR'),
  ('contact_phone', '+27604807393', 'Contact Phone', 'Primary WhatsApp/contact number'),
  ('contact_email', 'info@roadangelsrsa.co.za', 'Contact Email', 'Primary contact email address'),
  ('paystack_public_key', '', 'Paystack Public Key', 'Paystack inline-js public key'),
  ('site_name', 'Road Angels RSA', 'Site Name', 'Display name for the website')
on conflict (key) do nothing;

-- ── 2. Admin Audit Logs table ───────────────────────────────
-- Tracks all admin actions for accountability
create table if not exists admin_logs (
  id uuid default gen_random_uuid() primary key,
  admin_id uuid references auth.users(id) on delete set null,
  action text not null,              -- 'update_member', 'delete_vehicle', 'update_settings', etc.
  target_table text,                 -- 'profiles', 'vehicles', 'payments', 'site_settings'
  target_id text,                    -- ID of the affected record
  details jsonb,                     -- Additional context (before/after values)
  created_at timestamptz default now()
);

alter table admin_logs enable row level security;

-- Admins can read logs
drop policy if exists "Admins can read admin logs" on admin_logs;
create policy "Admins can read admin logs" on admin_logs
  for select using (
    exists (select 1 from profiles p where p.id = auth.uid() and p.role = 'admin')
  );

-- Service role (edge functions) can insert logs; admins can insert via client too
drop policy if exists "Admins can insert admin logs" on admin_logs;
create policy "Admins can insert admin logs" on admin_logs
  for insert with check (
    exists (select 1 from profiles p where p.id = auth.uid() and p.role = 'admin')
    or auth.role() = 'service_role'
  );

-- ── 3. Admin RLS policies on existing tables ─────────────────
-- Allow admins to read & manage profiles, vehicles, and payments

-- ── 3a. Profiles ──
drop policy if exists "Admins can read all profiles" on profiles;
create policy "Admins can read all profiles" on profiles
  for select using (
    exists (select 1 from profiles p where p.id = auth.uid() and p.role = 'admin')
  );

drop policy if exists "Admins can update profiles" on profiles;
create policy "Admins can update profiles" on profiles
  for update using (
    exists (select 1 from profiles p where p.id = auth.uid() and p.role = 'admin')
  )
  with check (
    exists (select 1 from profiles p where p.id = auth.uid() and p.role = 'admin')
  );

drop policy if exists "Admins can delete profiles" on profiles;
create policy "Admins can delete profiles" on profiles
  for delete using (
    exists (select 1 from profiles p where p.id = auth.uid() and p.role = 'admin')
  );

-- ── 3b. Vehicles ──
drop policy if exists "Admins can read all vehicles" on vehicles;
create policy "Admins can read all vehicles" on vehicles
  for select using (
    exists (select 1 from profiles p where p.id = auth.uid() and p.role = 'admin')
  );

drop policy if exists "Admins can update vehicles" on vehicles;
create policy "Admins can update vehicles" on vehicles
  for update using (
    exists (select 1 from profiles p where p.id = auth.uid() and p.role = 'admin')
  )
  with check (
    exists (select 1 from profiles p where p.id = auth.uid() and p.role = 'admin')
  );

drop policy if exists "Admins can delete vehicles" on vehicles;
create policy "Admins can delete vehicles" on vehicles
  for delete using (
    exists (select 1 from profiles p where p.id = auth.uid() and p.role = 'admin')
  );

-- ── 3c. Payments ──
drop policy if exists "Admins can read all payments" on payments;
create policy "Admins can read all payments" on payments
  for select using (
    exists (select 1 from profiles p where p.id = auth.uid() and p.role = 'admin')
  );

drop policy if exists "Admins can update payments" on payments;
create policy "Admins can update payments" on payments
  for update using (
    exists (select 1 from profiles p where p.id = auth.uid() and p.role = 'admin')
  )
  with check (
    exists (select 1 from profiles p where p.id = auth.uid() and p.role = 'admin')
  );

drop policy if exists "Admins can delete payments" on payments;
create policy "Admins can delete payments" on payments
  for delete using (
    exists (select 1 from profiles p where p.id = auth.uid() and p.role = 'admin')
  );

-- ── 4. Admin uploads storage bucket ─────────────────────────
-- For admin-uploaded files (documents, images, etc.)

insert into storage.buckets (id, name, public)
values ('admin-uploads', 'admin-uploads', true)
on conflict (id) do nothing;

-- Admins can upload files
drop policy if exists "Admins can upload to admin-uploads" on storage.objects;
create policy "Admins can upload to admin-uploads" on storage.objects
  for insert to authenticated
  with check (
    bucket_id = 'admin-uploads'
    and exists (select 1 from profiles p where p.id = auth.uid() and p.role = 'admin')
  );

-- Public can view admin uploads (logos, banners, etc.)
drop policy if exists "Public can view admin-uploads" on storage.objects;
create policy "Public can view admin-uploads" on storage.objects
  for select to public
  using (bucket_id = 'admin-uploads');

-- Admins can delete their uploads
drop policy if exists "Admins can delete admin-uploads" on storage.objects;
create policy "Admins can delete admin-uploads" on storage.objects
  for delete to authenticated
  using (
    bucket_id = 'admin-uploads'
    and exists (select 1 from profiles p where p.id = auth.uid() and p.role = 'admin')
  );

-- Admins can update their uploads
drop policy if exists "Admins can update admin-uploads" on storage.objects;
create policy "Admins can update admin-uploads" on storage.objects
  for update to authenticated
  using (
    bucket_id = 'admin-uploads'
    and exists (select 1 from profiles p where p.id = auth.uid() and p.role = 'admin')
  )
  with check (
    bucket_id = 'admin-uploads'
    and exists (select 1 from profiles p where p.id = auth.uid() and p.role = 'admin')
  );

-- ── 5. Helper function: log admin action ────────────────────
-- Callable from edge functions or client to record actions
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
