-- English: Create table and policies in your Supabase project (SQL Editor). 
-- This enables realtime via Postgres CDC automatically.

create table if not exists public.vulnerabilities (
  id text primary key,
  title text not null,
  severity double precision not null check (severity >= 0 and severity <= 10),
  source text not null check (source in ('NVD','GitHub','OSV','Manual')),
  package_name text,
  published_at timestamptz,
  created_at timestamptz not null default now()
);

-- Enable Row Level Security
alter table public.vulnerabilities enable row level security;

-- Realtime will stream changes if replica identity is full (enabled by Supabase by default).

-- Policy: Allow read for anon (public listing).
do $$
begin
  if not exists (
    select 1
    from pg_policies
    where schemaname = 'public' and tablename = 'vulnerabilities' and policyname = 'Allow anon read'
  ) then
    create policy "Allow anon read"
      on public.vulnerabilities for select
      to anon, authenticated
      using (true);
  end if;
end $$;

-- Policy: Allow insert for authenticated users (or rely on service role for backend writes).
do $$
begin
  if not exists (
    select 1
    from pg_policies
    where schemaname = 'public' and tablename = 'vulnerabilities' and policyname = 'Allow auth insert'
  ) then
    create policy "Allow auth insert"
      on public.vulnerabilities for insert
      to authenticated
      with check (true);
  end if;
end $$;

-- Helpful index for ordering
create index if not exists idx_vulnerabilities_created_at on public.vulnerabilities (created_at desc);
