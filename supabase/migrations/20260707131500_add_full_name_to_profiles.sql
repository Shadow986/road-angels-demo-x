-- Add full_name column to profiles if it doesn't exist
alter table profiles add column if not exists full_name text;

-- Add membership_rank column used by the dashboard
alter table profiles add column if not exists membership_rank text default 'Aspirant';

-- Update the trigger so it also captures full_name from signup metadata
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
