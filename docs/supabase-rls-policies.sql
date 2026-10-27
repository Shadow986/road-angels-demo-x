-- ============================================================
-- RLS Policies for Admin Management
-- Run this in Supabase Dashboard → SQL Editor
-- ============================================================

-- 1. Confirm the admin user's email (skip email verification)
UPDATE auth.users
SET email_confirmed_at = now()
WHERE email = 'admin@roadangelsrsa.co.za';

-- 2. Set the admin role in the profiles table
--    Note: profiles table has no "email" column — email is in auth.users
INSERT INTO profiles (id, role, full_name, is_active_member)
VALUES (
  (SELECT id FROM auth.users WHERE email = 'admin@roadangelsrsa.co.za'),
  'admin',
  'System Admin',
  true
)
ON CONFLICT (id) DO UPDATE
SET role = 'admin',
    is_active_member = true;

-- 3. RLS Policies for profiles table
--    Allow admins to read, insert, update, and delete any profile
--    Allow users to read and update their own profile

-- First, enable RLS on profiles (if not already enabled)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist (to avoid conflicts)
DROP POLICY IF EXISTS "Admins can read all profiles" ON profiles;
DROP POLICY IF EXISTS "Admins can insert profiles" ON profiles;
DROP POLICY IF EXISTS "Admins can update any profile" ON profiles;
DROP POLICY IF EXISTS "Admins can delete profiles" ON profiles;
DROP POLICY IF EXISTS "Users can read own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;

-- Admin policies
CREATE POLICY "Admins can read all profiles"
  ON profiles FOR SELECT
  TO authenticated
  USING (
    role = 'admin'
    OR id = auth.uid()
  );

CREATE POLICY "Admins can insert profiles"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
    OR id = auth.uid()
  );

CREATE POLICY "Admins can update any profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (id = auth.uid())
  WITH CHECK (id = auth.uid());

CREATE POLICY "Admins can delete profiles"
  ON profiles FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- 4. RLS Policies for vehicles table (allow admins full access)
DROP POLICY IF EXISTS "Admins can read all vehicles" ON vehicles;
DROP POLICY IF EXISTS "Admins can update vehicles" ON vehicles;
DROP POLICY IF EXISTS "Admins can delete vehicles" ON vehicles;

CREATE POLICY "Admins can read all vehicles"
  ON vehicles FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins can update vehicles"
  ON vehicles FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Admins can delete vehicles"
  ON vehicles FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- 5. RLS Policies for payments table (allow admins full access)
DROP POLICY IF EXISTS "Admins can read all payments" ON payments;
DROP POLICY IF EXISTS "Admins can delete payments" ON payments;

CREATE POLICY "Admins can read all payments"
  ON payments FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins can delete payments"
  ON payments FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- 6. RLS Policies for admin_logs table (admins can read, authenticated can insert)
DROP POLICY IF EXISTS "Admins can read logs" ON admin_logs;
DROP POLICY IF EXISTS "Authenticated can insert logs" ON admin_logs;

CREATE POLICY "Admins can read logs"
  ON admin_logs FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Authenticated can insert logs"
  ON admin_logs FOR INSERT
  TO authenticated
  WITH CHECK (admin_id = auth.uid());

-- 7. RLS Policies for site_settings table (admins full access, others read-only)
DROP POLICY IF EXISTS "Anyone can read settings" ON site_settings;
DROP POLICY IF EXISTS "Admins can update settings" ON site_settings;

CREATE POLICY "Anyone can read settings"
  ON site_settings FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins can update settings"
  ON site_settings FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- ============================================================
-- 8. Add VIN column to vehicles table
-- ============================================================
ALTER TABLE vehicles ADD COLUMN IF NOT EXISTS vin text;
