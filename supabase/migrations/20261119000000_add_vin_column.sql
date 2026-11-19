-- ============================================================
-- Add VIN (Vehicle Identification Number) column to profiles and vehicles
-- ============================================================

-- Add VIN to profiles table (used during registration)
alter table profiles add column if not exists vin text;

-- Add VIN to vehicles table (already referenced in UserDashboard but column was missing)
alter table vehicles add column if not exists vin text;

-- Add comment for documentation
comment on column profiles.vin is 'Vehicle Identification Number captured during registration';
comment on column vehicles.vin is 'Vehicle Identification Number for each registered vehicle';
