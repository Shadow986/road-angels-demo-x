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

create policy "Users can manage own vehicles" on vehicles
  for all using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
