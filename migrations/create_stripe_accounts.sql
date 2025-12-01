-- Create Stripe Accounts Table
create table if not exists stripe_accounts (
  user_id uuid primary key references auth.users(id) on delete cascade,
  stripe_account_id text not null unique,
  charges_enabled boolean default false,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

-- Enable RLS
alter table stripe_accounts enable row level security;

-- Policies
create policy "Users can view their own stripe account"
  on stripe_accounts for select
  to authenticated
  using (auth.uid() = user_id);

-- Only service role (backend) should insert/update, but for now we can allow users to read.
-- We will handle inserts via server actions (service role).
