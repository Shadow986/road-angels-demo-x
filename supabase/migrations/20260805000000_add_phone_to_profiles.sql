-- Add phone column to profiles
alter table profiles add column if not exists phone text;
