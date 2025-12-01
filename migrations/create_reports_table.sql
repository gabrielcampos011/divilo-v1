-- Create Reports Table
create table if not exists reports (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz default now() not null,
  reporter_id uuid references auth.users(id) not null,
  group_id uuid references grupos(id),
  reason text not null, -- 'scam', 'abuse', 'inactive', 'other'
  description text,
  status text default 'pending' not null -- 'pending', 'resolved', 'dismissed'
);

-- Enable RLS
alter table reports enable row level security;

-- Policies
create policy "Users can create reports"
  on reports for insert
  to authenticated
  with check (auth.uid() = reporter_id);

create policy "Users can view their own reports"
  on reports for select
  to authenticated
  using (auth.uid() = reporter_id);
