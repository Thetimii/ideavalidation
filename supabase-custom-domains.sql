-- Add custom domain support to existing schema

-- Custom domains table
create table public.custom_domains (
  id uuid primary key default gen_random_uuid(),
  page_id uuid references public.pages(id) on delete cascade,
  domain text unique not null,
  verified boolean default false,
  dns_configured boolean default false,
  ssl_configured boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Add custom domain column to pages
alter table public.pages 
add column custom_domain text unique;

-- Add domain verification tokens
create table public.domain_verification (
  id uuid primary key default gen_random_uuid(),
  domain text unique not null,
  verification_token text unique not null,
  page_id uuid references public.pages(id) on delete cascade,
  verified_at timestamptz,
  created_at timestamptz default now()
);

-- RLS for custom domains
alter table public.custom_domains enable row level security;
alter table public.domain_verification enable row level security;

-- Custom domains policies (simplified for public access)
create policy "Anyone can manage custom domains" on public.custom_domains
  for all using (true);

create policy "Anyone can view verified custom domains" on public.custom_domains
  for select using (verified = true);

-- Domain verification policies (simplified for public access)
create policy "Anyone can manage domain verification" on public.domain_verification
  for all using (true);

-- Indexes for performance
create index idx_custom_domains_domain on public.custom_domains(domain);
create index idx_custom_domains_page_id on public.custom_domains(page_id);
create index idx_domain_verification_domain on public.domain_verification(domain);
create index idx_domain_verification_token on public.domain_verification(verification_token);
create index idx_pages_custom_domain on public.pages(custom_domain);

-- Functions for domain management
create or replace function verify_domain_ownership(
  domain_name text,
  verification_token text
) returns boolean as $$
declare
  verification_record record;
begin
  select * into verification_record
  from public.domain_verification
  where domain = domain_name and verification_token = verification_token;
  
  if found then
    update public.domain_verification
    set verified_at = now()
    where id = verification_record.id;
    
    update public.custom_domains
    set verified = true
    where domain = domain_name;
    
    return true;
  end if;
  
  return false;
end;
$$ language plpgsql security definer;
