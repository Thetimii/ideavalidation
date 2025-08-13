-- Add async job system to existing schema

-- Jobs table for tracking AI generation tasks
create table public.generation_jobs (
  id uuid primary key default gen_random_uuid(),
  user_prompt text not null,
  status text check (status in ('pending', 'processing', 'completed', 'failed')) default 'pending',
  progress jsonb default '{"step": "initializing", "message": "Starting generation..."}',
  result jsonb,
  error_message text,
  page_id text,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  completed_at timestamptz
);

-- Real-time subscriptions table for live updates
create table public.job_updates (
  id uuid primary key default gen_random_uuid(),
  job_id uuid references public.generation_jobs(id) on delete cascade,
  step text not null,
  message text not null,
  progress_percent integer default 0,
  created_at timestamptz default now()
);

-- Enable RLS
alter table public.generation_jobs enable row level security;
alter table public.job_updates enable row level security;

-- Policies for jobs (allow public read for now, can restrict later)
create policy "Anyone can create generation jobs" on public.generation_jobs
  for insert with check (true);

create policy "Anyone can read generation jobs" on public.generation_jobs
  for select using (true);

create policy "System can update generation jobs" on public.generation_jobs
  for update using (true);

-- Policies for job updates
create policy "Anyone can read job updates" on public.job_updates
  for select using (true);

create policy "System can create job updates" on public.job_updates
  for insert with check (true);

-- Indexes for performance
create index idx_generation_jobs_status on public.generation_jobs(status);
create index idx_generation_jobs_created_at on public.generation_jobs(created_at);
create index idx_job_updates_job_id on public.job_updates(job_id);
create index idx_job_updates_created_at on public.job_updates(created_at);

-- Function to update job progress
create or replace function update_job_progress(
  job_id_param uuid,
  step_param text,
  message_param text,
  progress_percent_param integer default null
) returns void as $$
begin
  -- Update the main job
  update public.generation_jobs
  set 
    progress = jsonb_build_object(
      'step', step_param,
      'message', message_param,
      'progress_percent', coalesce(progress_percent_param, (progress->>'progress_percent')::integer, 0)
    ),
    updated_at = now()
  where id = job_id_param;
  
  -- Insert update record for real-time
  insert into public.job_updates (job_id, step, message, progress_percent)
  values (job_id_param, step_param, message_param, coalesce(progress_percent_param, 0));
end;
$$ language plpgsql security definer;

-- Function to complete job
create or replace function complete_job(
  job_id_param uuid,
  result_param jsonb default null,
  page_id_param text default null,
  error_message_param text default null
) returns void as $$
begin
  update public.generation_jobs
  set 
    status = case when error_message_param is null then 'completed' else 'failed' end,
    result = result_param,
    page_id = page_id_param,
    error_message = error_message_param,
    completed_at = now(),
    updated_at = now()
  where id = job_id_param;
end;
$$ language plpgsql security definer;

-- Trigger to update updated_at automatically
create trigger update_generation_jobs_updated_at 
  before update on public.generation_jobs 
  for each row execute function update_updated_at_column();
