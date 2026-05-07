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

-- Only the service role (edge functions) can insert/update
create policy "service role only" on payments
  using (false)
  with check (false);
