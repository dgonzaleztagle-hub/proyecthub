-- Create projects table
create table public.projects (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  company text not null,
  type text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create credentials table
create table public.credentials (
  id uuid default gen_random_uuid() primary key,
  project_id uuid references public.projects(id) on delete cascade not null,
  service text not null,
  username text not null,
  password text not null,
  notes text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create accounting table
create table public.accounting (
  id uuid default gen_random_uuid() primary key,
  project_id uuid references public.projects(id) on delete cascade not null,
  type text check (type in ('income', 'expense')) not null,
  amount numeric not null,
  description text not null,
  date timestamp with time zone default timezone('utc'::text, now()) not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create brainstorm table
create table public.brainstorm (
  id uuid default gen_random_uuid() primary key,
  project_id uuid references public.projects(id) on delete cascade not null,
  content text not null,
  is_completed boolean default false not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security (RLS)
alter table public.projects enable row level security;
alter table public.credentials enable row level security;
alter table public.accounting enable row level security;
alter table public.brainstorm enable row level security;

-- Create policies to allow public access (since we don't have auth yet)
-- WARNING: This is for development/demo purposes. In a real app, you'd want authenticated access.
create policy "Allow public access to projects" on public.projects for all using (true);
create policy "Allow public access to credentials" on public.credentials for all using (true);
create policy "Allow public access to accounting" on public.accounting for all using (true);
create policy "Allow public access to brainstorm" on public.brainstorm for all using (true);
