-- Add member detail columns to profiles
alter table profiles add column if not exists surname text;
alter table profiles add column if not exists id_passport text;
alter table profiles add column if not exists car_make text;
alter table profiles add column if not exists address text;
