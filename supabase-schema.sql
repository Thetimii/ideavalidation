-- Supabase Database Schema for AI Website Builder

-- Enable necessary extensions
create extension if not exists "uuid-ossp";

-- Users table (extends Supabase auth.users)
create table public.users (
  id uuid references auth.users(id) primary key,
  email text unique not null,
  created_at timestamptz default now()
);

-- Projects table
create table public.projects (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.users(id) on delete cascade,
  name text not null,
  created_at timestamptz default now()
);

-- Pages table
create table public.pages (
  id uuid primary key default gen_random_uuid(),
  project_id uuid references public.projects(id) on delete cascade,
  slug text unique not null,
  page_spec jsonb not null,
  copy_spec jsonb not null,
  tokens jsonb not null,
  published boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Leads table
create table public.leads (
  id uuid primary key default gen_random_uuid(),
  page_id uuid references public.pages(id) on delete cascade,
  email text not null,
  utm jsonb,
  created_at timestamptz default now()
);

-- Images table
create table public.images (
  id bigint generated always as identity primary key,
  page_id uuid references public.pages(id) on delete cascade,
  section_id text not null,
  provider text not null default 'pexels',
  payload jsonb not null,
  created_at timestamptz default now()
);

-- Analytics events table
create table public.analytics_events (
  id bigint generated always as identity primary key,
  page_id uuid references public.pages(id) on delete cascade,
  type text check (type in ('view','cta_click','lead')) not null,
  meta jsonb,
  created_at timestamptz default now()
);

-- Row Level Security (RLS) Policies

-- Enable RLS on all tables
alter table public.users enable row level security;
alter table public.projects enable row level security;
alter table public.pages enable row level security;
alter table public.leads enable row level security;
alter table public.images enable row level security;
alter table public.analytics_events enable row level security;

-- Users policies
create policy "Users can view own profile" on public.users
  for select using (auth.uid() = id);

create policy "Users can update own profile" on public.users
  for update using (auth.uid() = id);

-- Projects policies
create policy "Users can view own projects" on public.projects
  for select using (auth.uid() = user_id);

create policy "Users can create own projects" on public.projects
  for insert with check (auth.uid() = user_id);

create policy "Users can update own projects" on public.projects
  for update using (auth.uid() = user_id);

create policy "Users can delete own projects" on public.projects
  for delete using (auth.uid() = user_id);

-- Pages policies
create policy "Anyone can view published pages" on public.pages
  for select using (published = true);

create policy "Users can view own pages" on public.pages
  for select using (
    exists (
      select 1 from public.projects 
      where id = pages.project_id 
      and user_id = auth.uid()
    )
  );

create policy "Users can create pages in own projects" on public.pages
  for insert with check (
    exists (
      select 1 from public.projects 
      where id = pages.project_id 
      and user_id = auth.uid()
    )
  );

create policy "Users can update own pages" on public.pages
  for update using (
    exists (
      select 1 from public.projects 
      where id = pages.project_id 
      and user_id = auth.uid()
    )
  );

-- Leads policies (read-only for page owners)
create policy "Page owners can view leads" on public.leads
  for select using (
    exists (
      select 1 from public.pages p
      join public.projects pr on p.project_id = pr.id
      where p.id = leads.page_id 
      and pr.user_id = auth.uid()
    )
  );

create policy "Anyone can create leads" on public.leads
  for insert with check (true);

-- Images policies
create policy "Page owners can manage images" on public.images
  for all using (
    exists (
      select 1 from public.pages p
      join public.projects pr on p.project_id = pr.id
      where p.id = images.page_id 
      and pr.user_id = auth.uid()
    )
  );

-- Analytics policies
create policy "Page owners can view analytics" on public.analytics_events
  for select using (
    exists (
      select 1 from public.pages p
      join public.projects pr on p.project_id = pr.id
      where p.id = analytics_events.page_id 
      and pr.user_id = auth.uid()
    )
  );

create policy "Anyone can create analytics events" on public.analytics_events
  for insert with check (true);

-- Indexes for performance
create index idx_pages_slug on public.pages(slug);
create index idx_pages_published on public.pages(published);
create index idx_leads_page_id on public.leads(page_id);
create index idx_leads_created_at on public.leads(created_at);
create index idx_analytics_page_id on public.analytics_events(page_id);
create index idx_analytics_type on public.analytics_events(type);
create index idx_analytics_created_at on public.analytics_events(created_at);

-- Functions
create or replace function update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- Triggers
create trigger update_pages_updated_at 
  before update on public.pages 
  for each row execute function update_updated_at_column();

-- Insert trigger to create user record when they sign up
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.users (id, email)
  values (new.id, new.email);
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
