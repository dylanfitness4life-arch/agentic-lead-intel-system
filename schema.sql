create extension if not exists "pgcrypto";

create table if not exists public.lead_analyses (
  id uuid primary key default gen_random_uuid(),
  workflow_id text not null unique,
  url text not null,
  business_name text,
  location text,
  scraped_title text,
  website_score integer check (website_score >= 0 and website_score <= 100),
  confidence numeric check (confidence >= 0 and confidence <= 1),
  pain_points jsonb not null default '[]'::jsonb,
  opportunities jsonb not null default '[]'::jsonb,
  recommended_offer text,
  outreach_angle text,
  outreach_draft text,
  obsidian_note text,
  status text not null default 'pending_review'
    check (status in ('pending_review', 'approved', 'rejected', 'sent')),
  trace jsonb not null default '[]'::jsonb,
  raw_analysis jsonb not null default '{}'::jsonb,
  approved_at timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists lead_analyses_created_at_idx
on public.lead_analyses (created_at desc);

create index if not exists lead_analyses_status_idx
on public.lead_analyses (status);

create index if not exists lead_analyses_business_name_idx
on public.lead_analyses (business_name);

alter table public.lead_analyses enable row level security;

-- Recruiter-demo policy:
-- Keep writes server-side with the service role key.
-- Add authenticated read policies only if you build a public user-facing dashboard.

create policy "service_role_full_access"
on public.lead_analyses
for all
using (auth.role() = 'service_role')
with check (auth.role() = 'service_role');
